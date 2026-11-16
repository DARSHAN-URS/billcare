import 'dart:async';
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'api_config.dart';

class RuvexiApiException implements Exception {
  final String message;
  final int? statusCode;

  RuvexiApiException(this.message, {this.statusCode});

  @override
  String toString() => message;
}

class RuvexiApiClient {
  static const String _tokenStorageKey = 'ruvexi_jwt_token';
  final FlutterSecureStorage _storage = const FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );
  final http.Client _http = http.Client();

  String? _cachedToken;
  VoidCallbackLike? onUnauthorized;

  Future<String?> getToken() async {
    _cachedToken ??= await _storage.read(key: _tokenStorageKey);
    return _cachedToken;
  }

  Future<void> setToken(String token) async {
    _cachedToken = token;
    await _storage.write(key: _tokenStorageKey, value: token);
  }

  Future<void> clearToken() async {
    _cachedToken = null;
    await _storage.delete(key: _tokenStorageKey);
  }

  Uri _buildUri(String path) {
    final base = RuvexiApiConfig.apiBaseUrl.replaceAll(RegExp(r'/+$'), '');
    final normalizedPath = path.startsWith('/') ? path : '/$path';
    return Uri.parse('$base$normalizedPath');
  }

  Future<dynamic> _request(
    String method,
    String path, {
    Map<String, dynamic>? body,
    bool requireAuth = true,
  }) async {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (requireAuth) {
      final token = await getToken();
      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    final uri = _buildUri(path);
    late http.Response res;

    try {
      const timeout = Duration(seconds: 20);
      final encodedBody = body != null ? jsonEncode(body) : null;
      switch (method) {
        case 'GET':
          res = await _http.get(uri, headers: headers).timeout(timeout);
          break;
        case 'POST':
          res = await _http.post(uri, headers: headers, body: encodedBody).timeout(timeout);
          break;
        case 'PUT':
          res = await _http.put(uri, headers: headers, body: encodedBody).timeout(timeout);
          break;
        case 'DELETE':
          res = await _http.delete(uri, headers: headers, body: encodedBody).timeout(timeout);
          break;
        default:
          throw RuvexiApiException('Unsupported HTTP method: $method');
      }
    } on TimeoutException {
      throw RuvexiApiException('Connection timed out. Please check your internet connection.');
    } catch (e) {
      if (e is RuvexiApiException) rethrow;
      throw RuvexiApiException('Unable to reach Ruvexi server. Please check your internet connection.');
    }

    dynamic decoded;
    if (res.body.isNotEmpty) {
      try {
        decoded = jsonDecode(res.body);
      } catch (_) {
        decoded = res.body;
      }
    }

    if (res.statusCode == 401 && requireAuth) {
      await clearToken();
      onUnauthorized?.call();
    }

    if (res.statusCode >= 200 && res.statusCode < 300) {
      return decoded;
    }

    String msg = 'Request failed (${res.statusCode})';
    if (decoded is Map<String, dynamic>) {
      final detail = decoded['detail'] ?? decoded['message'] ?? decoded['error'];
      if (detail is String && detail.trim().isNotEmpty) {
        msg = detail.trim();
      }
    }
    throw RuvexiApiException(msg, statusCode: res.statusCode);
  }

  // ── Auth ────────────────────────────────────────────────────────────────
  Future<Map<String, dynamic>> login({
    required String identifier,
    required String password,
  }) async {
    final res = await _request(
      'POST',
      '/auth/login',
      body: {'identifier': identifier, 'email': identifier, 'password': password},
      requireAuth: false,
    );
    final map = Map<String, dynamic>.from(res as Map);
    final token = map['token'] as String?;
    if (token == null || token.isEmpty) {
      throw RuvexiApiException('Server did not return an authentication token.');
    }
    await setToken(token);
    return map;
  }

  Future<Map<String, dynamic>> signup({
    required String ownerName,
    required String salonName,
    required String email,
    required String password,
    String phone = '',
    String city = 'Bengaluru',
  }) async {
    final res = await _request(
      'POST',
      '/auth/signup',
      body: {
        'user': {
          'name': ownerName,
          'email': email,
          'password': password,
          'phone': phone,
        },
        'salon': {
          'name': salonName,
          'city': city,
          'branch': '$city Flagship',
        },
      },
      requireAuth: false,
    );
    final map = Map<String, dynamic>.from(res as Map);
    final token = map['token'] as String?;
    if (token != null && token.isNotEmpty) {
      await setToken(token);
    }
    return map;
  }

  Future<Map<String, dynamic>> requestOtp(String phone) async {
    final res = await _request(
      'POST',
      '/auth/otp/request',
      body: {'phone': phone},
      requireAuth: false,
    );
    return Map<String, dynamic>.from(res as Map);
  }

  Future<Map<String, dynamic>> verifyOtp({
    required String phone,
    required String otp,
  }) async {
    final res = await _request(
      'POST',
      '/auth/otp/verify',
      body: {'phone': phone, 'otp': otp},
      requireAuth: false,
    );
    final map = Map<String, dynamic>.from(res as Map);
    final token = map['token'] as String?;
    if (token == null || token.isEmpty) {
      throw RuvexiApiException('Server did not return an authentication token.');
    }
    await setToken(token);
    return map;
  }

  Future<Map<String, dynamic>> googleAuth({
    String? idToken,
    String? accessToken,
  }) async {
    final res = await _request(
      'POST',
      '/auth/google',
      body: {
        if (idToken != null && idToken.isNotEmpty) 'credential': idToken,
        if (accessToken != null && accessToken.isNotEmpty) 'access_token': accessToken,
      },
      requireAuth: false,
    );
    final map = Map<String, dynamic>.from(res as Map);
    final token = map['token'] as String?;
    if (token == null || token.isEmpty) {
      throw RuvexiApiException('Google login did not return a session token.');
    }
    await setToken(token);
    return map;
  }

  Future<Map<String, dynamic>> fetchPublicConfig() async {
    final res = await _request('GET', '/auth/public-config', requireAuth: false);
    return Map<String, dynamic>.from(res as Map);
  }

  Future<Map<String, dynamic>> fetchMe() async {
    final res = await _request('GET', '/auth/me');
    return Map<String, dynamic>.from(res as Map);
  }

  Future<Map<String, dynamic>> requestPasswordReset(String email) async {
    final res = await _request(
      'POST',
      '/auth/forgot-password',
      body: {'email': email},
      requireAuth: false,
    );
    return Map<String, dynamic>.from(res as Map);
  }

  // ── Bootstrap & Workspace ───────────────────────────────────────────────
  Future<Map<String, dynamic>> fetchBootstrap() async {
    final res = await _request('GET', '/bootstrap');
    return Map<String, dynamic>.from(res as Map);
  }

  Future<Map<String, dynamic>> fetchSubscriptionStatus() async {
    final res = await _request('GET', '/subscription/status');
    return Map<String, dynamic>.from(res as Map);
  }

  Future<Map<String, dynamic>> fetchReportsSummary() async {
    final res = await _request('GET', '/reports/summary');
    return Map<String, dynamic>.from(res as Map);
  }

  Future<List<dynamic>> fetchExpenses() async {
    final res = await _request('GET', '/expenses');
    return List<dynamic>.from(res as List);
  }

  Future<Map<String, dynamic>> updateSalonSettings(Map<String, dynamic> data) async {
    final res = await _request('PUT', '/salon', body: data);
    return Map<String, dynamic>.from(res as Map);
  }

  // ── Operational Mutations ───────────────────────────────────────────────
  Future<Map<String, dynamic>> createAppointment(Map<String, dynamic> data) async {
    final res = await _request('POST', '/appointments', body: data);
    return Map<String, dynamic>.from(res as Map);
  }

  Future<Map<String, dynamic>> updateAppointmentStatus(String id, String status) async {
    final res = await _request('PUT', '/appointments/$id/status', body: {'status': status});
    return Map<String, dynamic>.from(res as Map);
  }

  Future<Map<String, dynamic>> createCustomer(Map<String, dynamic> data) async {
    final res = await _request('POST', '/customers', body: data);
    return Map<String, dynamic>.from(res as Map);
  }

  Future<Map<String, dynamic>> createStaff(Map<String, dynamic> data) async {
    final res = await _request('POST', '/staff', body: data);
    return Map<String, dynamic>.from(res as Map);
  }

  Future<Map<String, dynamic>> toggleStaffClock(String id) async {
    final res = await _request('POST', '/staff/$id/toggle-clock');
    return Map<String, dynamic>.from(res as Map);
  }

  Future<Map<String, dynamic>> createService(Map<String, dynamic> data) async {
    final res = await _request('POST', '/services', body: data);
    return Map<String, dynamic>.from(res as Map);
  }

  Future<Map<String, dynamic>> createInventoryItem(Map<String, dynamic> data) async {
    final res = await _request('POST', '/inventory', body: data);
    return Map<String, dynamic>.from(res as Map);
  }

  Future<Map<String, dynamic>> createExpense(Map<String, dynamic> data) async {
    final res = await _request('POST', '/expenses', body: data);
    return Map<String, dynamic>.from(res as Map);
  }

  Future<Map<String, dynamic>> createInvoice(Map<String, dynamic> data) async {
    final res = await _request('POST', '/invoices', body: data);
    return Map<String, dynamic>.from(res as Map);
  }
}

typedef VoidCallbackLike = void Function();

