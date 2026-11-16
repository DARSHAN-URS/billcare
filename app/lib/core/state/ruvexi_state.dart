import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:intl/intl.dart';
import '../network/api_config.dart';
import '../network/ruvexi_api_client.dart';
import 'olg_default_catalog.dart';

class ServiceItem {
  final String id;
  final String name;
  final String category;
  final double price;
  final int durationMinutes;
  final int bufferMinutes;
  final String description;
  final bool popular;
  final bool isOnlineBookable;
  final bool isActive;

  ServiceItem({
    required this.id,
    required this.name,
    required this.category,
    required this.price,
    required this.durationMinutes,
    this.bufferMinutes = 5,
    this.description = '',
    this.popular = false,
    this.isOnlineBookable = true,
    this.isActive = true,
  });

  factory ServiceItem.fromJson(Map<String, dynamic> json) {
    return ServiceItem(
      id: (json['id'] ?? '').toString(),
      name: (json['name'] ?? 'Service').toString(),
      category: (json['category'] ?? 'Hair').toString(),
      price: (json['price'] is num) ? (json['price'] as num).toDouble() : double.tryParse('${json['price']}') ?? 0.0,
      durationMinutes: (json['durationMinutes'] is num)
          ? (json['durationMinutes'] as num).toInt()
          : int.tryParse('${json['durationMinutes']}') ?? 45,
      bufferMinutes: (json['bufferMinutes'] is num) ? (json['bufferMinutes'] as num).toInt() : 5,
      description: (json['description'] ?? '').toString(),
      popular: json['popular'] == true,
      isOnlineBookable: json['isOnlineBookable'] != false,
      isActive: json['isActive'] != false,
    );
  }
}

class PackageItem {
  final String id;
  final String title;
  final String description;
  final double price;
  final double originalPrice;
  final List<String> servicesIncluded;

  PackageItem({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    required this.originalPrice,
    required this.servicesIncluded,
  });
}

class Customer {
  final String id;
  final String name;
  final String phone;
  final String email;
  final int visitsCount;
  final double totalSpent;
  final int loyaltyPoints;
  final String membership;
  final String? formulaNotes;
  final String tag; // "Regular", "New", "Inactive"

  Customer({
    required this.id,
    required this.name,
    required this.phone,
    required this.email,
    required this.visitsCount,
    required this.totalSpent,
    this.loyaltyPoints = 50,
    this.membership = "Standard",
    this.formulaNotes,
    this.tag = "Regular",
  });

  factory Customer.fromJson(Map<String, dynamic> json) {
    final visits = (json['visitsCount'] ?? json['totalVisits'] ?? 0);
    final spent = (json['totalSpent'] ?? json['totalSpend'] ?? 0.0);
    final visitsInt = visits is num ? visits.toInt() : int.tryParse('$visits') ?? 0;
    final tagsRaw = json['tags'];
    String derivedTag = visitsInt <= 1 ? 'New' : 'Regular';
    if (tagsRaw is List && tagsRaw.isNotEmpty) {
      derivedTag = tagsRaw.first.toString();
    }
    return Customer(
      id: (json['id'] ?? '').toString(),
      name: (json['name'] ?? 'Guest').toString(),
      phone: (json['phone'] ?? '').toString(),
      email: (json['email'] ?? '').toString(),
      visitsCount: visitsInt,
      totalSpent: spent is num ? spent.toDouble() : double.tryParse('$spent') ?? 0.0,
      loyaltyPoints: (json['loyaltyPoints'] is num)
          ? (json['loyaltyPoints'] as num).toInt()
          : int.tryParse('${json['loyaltyPoints']}') ?? 50,
      membership: (json['vipTier'] ?? 'Standard').toString(),
      formulaNotes: (json['formulaNotes'] ?? json['notes'])?.toString(),
      tag: derivedTag,
    );
  }
}

class Appointment {
  final String id;
  final String customerName;
  final String customerPhone;
  final String serviceName;
  final String staffName;
  final DateTime time;
  final int durationMinutes;
  final double price;
  String status; // "In Service", "Confirmed", "Upcoming", "Completed", "Cancelled"
  final String notes;

  Appointment({
    required this.id,
    required this.customerName,
    this.customerPhone = "",
    required this.serviceName,
    required this.staffName,
    required this.time,
    this.durationMinutes = 45,
    required this.price,
    required this.status,
    this.notes = "",
  });

  factory Appointment.fromJson(Map<String, dynamic> json) {
    final dateStr = (json['date'] ?? '').toString().trim();
    final timeStr = (json['startTime'] ?? json['time'] ?? '11:00').toString().trim();
    DateTime parsedTime = DateTime.now();
    try {
      final baseDate = dateStr.isNotEmpty ? DateTime.parse(dateStr) : DateTime.now();
      final match = RegExp(r'^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?', caseSensitive: false).firstMatch(timeStr);
      if (match != null) {
        int h = int.parse(match.group(1)!);
        final m = int.parse(match.group(2)!);
        final ampm = match.group(3)?.toUpperCase();
        if (ampm == 'PM' && h < 12) h += 12;
        if (ampm == 'AM' && h == 12) h = 0;
        parsedTime = DateTime(baseDate.year, baseDate.month, baseDate.day, h.clamp(0, 23), m.clamp(0, 59));
      } else {
        parsedTime = baseDate;
      }
    } catch (_) {
      parsedTime = DateTime.now();
    }

    final rawStatus = (json['status'] ?? 'confirmed').toString().toLowerCase().trim();
    String uiStatus = 'Confirmed';
    if (rawStatus == 'in_service' || rawStatus == 'in service') {
      uiStatus = 'In Service';
    } else if (rawStatus == 'completed') {
      uiStatus = 'Completed';
    } else if (rawStatus == 'cancelled') {
      uiStatus = 'Cancelled';
    } else if (rawStatus == 'upcoming' || rawStatus == 'pending' || rawStatus == 'scheduled') {
      uiStatus = 'Upcoming';
    }

    return Appointment(
      id: (json['id'] ?? '').toString(),
      customerName: (json['customerName'] ?? 'Guest').toString(),
      customerPhone: (json['customerPhone'] ?? '').toString(),
      serviceName: (json['serviceName'] ?? 'Salon Service').toString(),
      staffName: (json['staffName'] ?? 'Stylist').toString(),
      time: parsedTime,
      durationMinutes: (json['durationMinutes'] is num)
          ? (json['durationMinutes'] as num).toInt()
          : int.tryParse('${json['durationMinutes']}') ?? 45,
      price: (json['price'] is num) ? (json['price'] as num).toDouble() : double.tryParse('${json['price']}') ?? 0.0,
      status: uiStatus,
      notes: (json['notes'] ?? '').toString(),
    );
  }
}

class StaffMember {
  final String id;
  final String name;
  final String role;
  final String phone;
  bool isActive;
  bool isClockedIn;
  String checkInTime;
  int servicesCount;
  double serviceRevenue;
  double commissionRate;
  double rating;
  int assignedServicesCount;

  StaffMember({
    required this.id,
    required this.name,
    required this.role,
    this.phone = "",
    this.isActive = true,
    this.isClockedIn = true,
    this.checkInTime = "--",
    this.servicesCount = 0,
    this.serviceRevenue = 0.0,
    this.commissionRate = 0.10,
    this.rating = 4.8,
    this.assignedServicesCount = 0,
  });

  String get staffName => name;
  double get todaySales => serviceRevenue;

  factory StaffMember.fromJson(Map<String, dynamic> json) {
    final rawRate = (json['commissionRate'] is num)
        ? (json['commissionRate'] as num).toDouble()
        : double.tryParse('${json['commissionRate']}') ?? 10.0;
    final normalizedRate = rawRate > 1.0 ? rawRate / 100.0 : rawRate;
    final clockedIn = json['isClockedIn'] == true;
    final clockedAt = (json['clockedInAt'] ?? '').toString();

    return StaffMember(
      id: (json['id'] ?? '').toString(),
      name: (json['name'] ?? 'Staff').toString(),
      role: (json['role'] ?? 'Stylist').toString(),
      phone: (json['phone'] ?? '').toString(),
      isActive: json['isActive'] != false,
      isClockedIn: clockedIn,
      checkInTime: clockedAt.isNotEmpty ? clockedAt : (clockedIn ? 'Clocked In' : '--'),
      servicesCount: (json['totalServicesCompleted'] ?? json['todayServicesCount'] ?? 0) is num
          ? ((json['totalServicesCompleted'] ?? json['todayServicesCount']) as num).toInt()
          : 0,
      serviceRevenue: (json['todayRevenue'] is num)
          ? (json['todayRevenue'] as num).toDouble()
          : double.tryParse('${json['todayRevenue']}') ?? 0.0,
      commissionRate: normalizedRate,
      rating: (json['rating'] is num) ? (json['rating'] as num).toDouble() : 4.8,
      assignedServicesCount: (json['todayServicesCount'] is num)
          ? (json['todayServicesCount'] as num).toInt()
          : 0,
    );
  }
}

class InventoryItem {
  final String id;
  final String name;
  final String sizeVolume;
  final String category;
  int stock;
  final int minAlert;
  final String unit;

  InventoryItem({
    required this.id,
    required this.name,
    required this.sizeVolume,
    required this.category,
    required this.stock,
    required this.minAlert,
    this.unit = "pcs",
  });

  bool get isLowStock => stock <= minAlert;

  factory InventoryItem.fromJson(Map<String, dynamic> json) {
    return InventoryItem(
      id: (json['id'] ?? '').toString(),
      name: (json['name'] ?? 'Product').toString(),
      sizeVolume: (json['brand'] ?? json['usageType'] ?? 'Professional').toString(),
      category: (json['category'] ?? 'Hair Care').toString(),
      stock: (json['currentStock'] is num)
          ? (json['currentStock'] as num).toInt()
          : int.tryParse('${json['currentStock']}') ?? 0,
      minAlert: (json['minThreshold'] is num)
          ? (json['minThreshold'] as num).toInt()
          : int.tryParse('${json['minThreshold']}') ?? 5,
      unit: (json['unit'] ?? 'pcs').toString(),
    );
  }
}

class ExpenseItem {
  final String id;
  final String category;
  final double amount;
  final DateTime date;
  final String note;

  ExpenseItem({
    required this.id,
    required this.category,
    required this.amount,
    required this.date,
    this.note = "",
  });

  factory ExpenseItem.fromJson(Map<String, dynamic> json) {
    DateTime parsedDate = DateTime.now();
    try {
      final raw = (json['date'] ?? '').toString();
      if (raw.isNotEmpty) parsedDate = DateTime.parse(raw);
    } catch (_) {}
    final title = (json['title'] ?? '').toString();
    final notes = (json['notes'] ?? '').toString();
    return ExpenseItem(
      id: (json['id'] ?? '').toString(),
      category: (json['category'] ?? 'Supplies').toString(),
      amount: (json['amount'] is num) ? (json['amount'] as num).toDouble() : double.tryParse('${json['amount']}') ?? 0.0,
      date: parsedDate,
      note: notes.isNotEmpty ? notes : title,
    );
  }
}

class OfferItem {
  final String id;
  final String title;
  final String description;
  final String validity;
  bool isActive;
  final double discountPercent;

  OfferItem({
    required this.id,
    required this.title,
    required this.description,
    required this.validity,
    this.isActive = true,
    this.discountPercent = 20,
  });
}

class CartItem {
  final ServiceItem service;
  int quantity;

  CartItem({required this.service, this.quantity = 1});
}

class SalonSeat {
  final String id; // e.g., "S-1"
  bool isInUse;
  String? currentClientId;
  String? currentClientName;

  SalonSeat({
    required this.id,
    this.isInUse = false,
    this.currentClientId,
    this.currentClientName,
  });
}

class InSalonClient {
  final String id;
  final String customerName;
  final String phone;
  List<ServiceItem> services;
  String assignedStaff;
  String seatId; // e.g., "S-1" or "Waiting"
  final String checkInTime;
  int elapsedMinutes;
  String status; // "In Salon", "Waiting", "Completed"
  String notes;

  InSalonClient({
    required this.id,
    required this.customerName,
    required this.phone,
    required this.services,
    required this.assignedStaff,
    required this.seatId,
    required this.checkInTime,
    this.elapsedMinutes = 5,
    this.status = "In Salon",
    this.notes = "",
  });

  String get servicesSummary => services.map((s) => s.name).join(" + ");
  double get totalServiceAmount => services.fold(0.0, (sum, s) => sum + s.price);
}

class RuvexiAppState extends ChangeNotifier {
  final RuvexiApiClient api = RuvexiApiClient();

  String salonId = "";
  String salonSlug = "";
  String salonName = "Ruvexi Salon & Spa";
  String salonLocation = "";
  String salonPhone = "";
  String salonGstin = "";
  String salonUpiId = "";
  int salonChairs = 6;

  // Subscription state (fetched live from Railway)
  String subscriptionStatus = "trial";
  String subscriptionPlan = "free_trial";
  bool isTrialActive = true;
  int trialDaysLeft = 7;
  String? trialEndsAt;
  String conciergeWhatsapp = "";
  String conciergeUpiId = "";

  // Role state (RBAC enforced)
  String backendRole = "SALON_RECEPTIONIST";
  String userRole = "Receptionist"; // UI display mode: "Owner" | "Receptionist"
  bool get canSwitchRoles {
    final normalized = backendRole.toUpperCase();
    return normalized == "SALON_MANAGER" ||
        normalized == "OWNER" ||
        normalized == "MANAGER" ||
        normalized == "ADMIN" ||
        normalized == "MASTER_ADMIN";
  }

  double todayRevenue = 0.0;
  int todayAppointmentsCount = 0;
  int todayClientsCount = 0;
  double todayProfit = 0.0;

  bool isAuthenticated = false;
  bool isSyncing = false;
  String? lastSyncError;
  String currentUserName = "";
  String currentUserEmail = "";

  Customer? posSelectedCustomer;
  InSalonClient? activeBillingClient;
  int staffCompletedCount = 0;

  final List<SalonSeat> seats = [];
  final List<InSalonClient> inSalonClients = [];
  final List<ServiceItem> catalog = [];
  final List<PackageItem> packages = [];
  final List<Appointment> appointments = [];
  final List<Customer> customers = [];
  final List<StaffMember> staff = [];
  final List<InventoryItem> inventory = [];
  final List<ExpenseItem> expenses = [];
  final List<OfferItem> offers = [];
  final List<CartItem> posCart = [];
  final List<Map<String, dynamic>> invoices = [];

  double discountAmount = 0.0;

  RuvexiAppState() {
    catalog.addAll(defaultOlgCatalog);
    api.onUnauthorized = () {
      _clearWorkspaceData();
      isAuthenticated = false;
      notifyListeners();
    };
  }

  void _rebuildSeats(int chairCount) {
    final count = chairCount.clamp(1, 24);
    seats.clear();
    for (int i = 1; i <= count; i++) {
      final seatId = "S-$i";
      final occupying = inSalonClients.where((c) => c.seatId == seatId && c.status == "In Salon").toList();
      seats.add(SalonSeat(
        id: seatId,
        isInUse: occupying.isNotEmpty,
        currentClientId: occupying.isNotEmpty ? occupying.first.id : null,
        currentClientName: occupying.isNotEmpty ? occupying.first.customerName : null,
      ));
    }
  }

  void _clearWorkspaceData() {
    salonId = "";
    salonSlug = "";
    salonName = "Ruvexi Salon & Spa";
    salonLocation = "";
    salonPhone = "";
    salonGstin = "";
    salonUpiId = "";
    salonChairs = 6;
    subscriptionStatus = "trial";
    subscriptionPlan = "free_trial";
    isTrialActive = true;
    trialDaysLeft = 7;
    trialEndsAt = null;
    conciergeWhatsapp = "";
    conciergeUpiId = "";
    backendRole = "SALON_RECEPTIONIST";
    userRole = "Receptionist";
    currentUserName = "";
    currentUserEmail = "";
    todayRevenue = 0.0;
    todayAppointmentsCount = 0;
    todayClientsCount = 0;
    todayProfit = 0.0;
    staffCompletedCount = 0;
    posSelectedCustomer = null;
    activeBillingClient = null;
    catalog.clear();
    catalog.addAll(defaultOlgCatalog);
    customers.clear();
    staff.clear();
    inventory.clear();
    appointments.clear();
    expenses.clear();
    invoices.clear();
    inSalonClients.clear();
    seats.clear();
    posCart.clear();
  }

  void _applyUserAndSalon(Map<String, dynamic>? userMap, Map<String, dynamic>? salonMap) {
    if (userMap != null) {
      currentUserName = (userMap['name'] ?? '').toString();
      currentUserEmail = (userMap['email'] ?? '').toString();
      backendRole = (userMap['role'] ?? 'SALON_RECEPTIONIST').toString().toUpperCase();
      userRole = canSwitchRoles ? 'Owner' : 'Receptionist';
    }
    if (salonMap != null) {
      salonId = (salonMap['id'] ?? '').toString();
      salonSlug = (salonMap['slug'] ?? '').toString();
      salonName = (salonMap['name'] ?? 'Ruvexi Salon & Spa').toString();
      final city = (salonMap['city'] ?? '').toString();
      final branch = (salonMap['branch'] ?? '').toString();
      salonLocation = city.isNotEmpty ? city : (branch.isNotEmpty ? branch : (salonMap['address'] ?? '').toString());
      salonPhone = (salonMap['phone'] ?? '').toString();
      salonGstin = (salonMap['gstin'] ?? '').toString();
      salonUpiId = (salonMap['upiId'] ?? '').toString();
      salonChairs = (salonMap['chairs'] is num) ? (salonMap['chairs'] as num).toInt() : 6;
      subscriptionStatus = (salonMap['subscriptionStatus'] ?? 'trial').toString();
      subscriptionPlan = (salonMap['subscriptionPlan'] ?? 'free_trial').toString();
      isTrialActive = salonMap['isTrialActive'] != false;
      trialDaysLeft = (salonMap['trialDaysLeft'] is num) ? (salonMap['trialDaysLeft'] as num).toInt() : 7;
      trialEndsAt = salonMap['trialEndsAt']?.toString();
    }
  }

  Future<bool> restoreSession() async {
    final token = await api.getToken();
    if (token == null || token.isEmpty) {
      isAuthenticated = false;
      notifyListeners();
      return false;
    }

    try {
      await syncWorkspace();
      isAuthenticated = true;
      notifyListeners();
      return true;
    } catch (e) {
      await api.clearToken();
      _clearWorkspaceData();
      isAuthenticated = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> login({required String identifier, required String password}) async {
    lastSyncError = null;
    final res = await api.login(identifier: identifier, password: password);
    _applyUserAndSalon(
      res['user'] is Map ? Map<String, dynamic>.from(res['user']) : null,
      res['salon'] is Map ? Map<String, dynamic>.from(res['salon']) : null,
    );
    isAuthenticated = true;
    await syncWorkspace();
    notifyListeners();
    return true;
  }

  Future<bool> signup({
    required String ownerName,
    required String salonNameInput,
    required String email,
    required String password,
    String phone = '',
    String city = 'Bengaluru',
  }) async {
    lastSyncError = null;
    final res = await api.signup(
      ownerName: ownerName,
      salonName: salonNameInput,
      email: email,
      password: password,
      phone: phone,
      city: city,
    );
    _applyUserAndSalon(
      res['user'] is Map ? Map<String, dynamic>.from(res['user']) : null,
      res['salon'] is Map ? Map<String, dynamic>.from(res['salon']) : null,
    );
    isAuthenticated = true;
    await syncWorkspace();
    notifyListeners();
    return true;
  }

  Future<bool> loginWithGoogle() async {
    lastSyncError = null;
    String clientId = RuvexiApiConfig.googleClientId;
    if (clientId.isEmpty) {
      try {
        final cfg = await api.fetchPublicConfig();
        clientId = (cfg['googleClientId'] ?? '').toString();
      } catch (_) {}
    }

    final googleSignIn = GoogleSignIn(
      scopes: const ['email', 'profile'],
      serverClientId: clientId.isNotEmpty ? clientId : null,
    );

    final account = await googleSignIn.signIn();
    if (account == null) {
      throw RuvexiApiException('Google sign-in was cancelled.');
    }

    final auth = await account.authentication;
    if ((auth.idToken == null || auth.idToken!.isEmpty) &&
        (auth.accessToken == null || auth.accessToken!.isEmpty)) {
      throw RuvexiApiException('Could not obtain Google credentials. Please sign in with email & password.');
    }

    final res = await api.googleAuth(idToken: auth.idToken, accessToken: auth.accessToken);
    _applyUserAndSalon(
      res['user'] is Map ? Map<String, dynamic>.from(res['user']) : null,
      res['salon'] is Map ? Map<String, dynamic>.from(res['salon']) : null,
    );
    isAuthenticated = true;
    await syncWorkspace();
    notifyListeners();
    return true;
  }

  Future<void> requestPasswordReset(String email) async {
    await api.requestPasswordReset(email);
  }

  Future<void> requestOtp(String phone) async {
    await api.requestOtp(phone);
  }

  Future<bool> verifyOtp({required String phone, required String otp}) async {
    lastSyncError = null;
    final res = await api.verifyOtp(phone: phone, otp: otp);
    _applyUserAndSalon(
      res['user'] is Map ? Map<String, dynamic>.from(res['user']) : null,
      res['salon'] is Map ? Map<String, dynamic>.from(res['salon']) : null,
    );
    isAuthenticated = true;
    await syncWorkspace();
    notifyListeners();
    return true;
  }

  Future<void> syncWorkspace() async {
    isSyncing = true;
    lastSyncError = null;
    notifyListeners();

    try {
      final data = await api.fetchBootstrap();
      _applyUserAndSalon(
        data['user'] is Map ? Map<String, dynamic>.from(data['user']) : null,
        data['salon'] is Map ? Map<String, dynamic>.from(data['salon']) : null,
      );

      final rawServices = (data['services'] as List?) ?? [];
      final parsedServices = rawServices.whereType<Map>().map((m) => ServiceItem.fromJson(Map<String, dynamic>.from(m))).toList();
      catalog
        ..clear()
        ..addAll(parsedServices.isNotEmpty ? parsedServices : defaultOlgCatalog);

      final rawCustomers = (data['customers'] as List?) ?? [];
      customers
        ..clear()
        ..addAll(rawCustomers.whereType<Map>().map((m) => Customer.fromJson(Map<String, dynamic>.from(m))));

      final rawStaff = (data['staff'] as List?) ?? [];
      staff
        ..clear()
        ..addAll(rawStaff.whereType<Map>().map((m) => StaffMember.fromJson(Map<String, dynamic>.from(m))));

      final rawInventory = (data['inventory'] as List?) ?? [];
      inventory
        ..clear()
        ..addAll(rawInventory.whereType<Map>().map((m) => InventoryItem.fromJson(Map<String, dynamic>.from(m))));

      final rawAppointments = (data['appointments'] as List?) ?? [];
      appointments
        ..clear()
        ..addAll(rawAppointments.whereType<Map>().map((m) => Appointment.fromJson(Map<String, dynamic>.from(m))));

      final rawInvoices = (data['invoices'] as List?) ?? [];
      invoices
        ..clear()
        ..addAll(rawInvoices.whereType<Map>().map((m) => Map<String, dynamic>.from(m)));

      try {
        final rawExpenses = await api.fetchExpenses();
        expenses
          ..clear()
          ..addAll(rawExpenses.whereType<Map>().map((m) => ExpenseItem.fromJson(Map<String, dynamic>.from(m))));
      } catch (_) {}

      try {
        final sub = await api.fetchSubscriptionStatus();
        subscriptionStatus = (sub['subscriptionStatus'] ?? subscriptionStatus).toString();
        subscriptionPlan = (sub['subscriptionPlan'] ?? subscriptionPlan).toString();
        isTrialActive = sub['isTrialActive'] != false;
        trialDaysLeft = (sub['trialDaysLeft'] is num) ? (sub['trialDaysLeft'] as num).toInt() : trialDaysLeft;
        trialEndsAt = sub['trialEndsAt']?.toString() ?? trialEndsAt;
        conciergeWhatsapp = (sub['conciergeWhatsapp'] ?? '').toString();
        conciergeUpiId = (sub['conciergeUpiId'] ?? '').toString();
      } catch (_) {}

      // Sync In-Salon active clients from active "In Service" appointments
      inSalonClients.clear();
      int chairIdx = 1;
      for (final apt in appointments) {
        if (apt.status == 'In Service') {
          final seatId = chairIdx <= salonChairs ? 'S-${chairIdx++}' : 'Waiting';
          final matchedServices = catalog.where((s) => s.name.toLowerCase() == apt.serviceName.toLowerCase()).toList();
          inSalonClients.add(InSalonClient(
            id: apt.id,
            customerName: apt.customerName,
            phone: apt.customerPhone,
            services: matchedServices.isNotEmpty
                ? matchedServices
                : [ServiceItem(id: apt.id, name: apt.serviceName, category: 'Hair', price: apt.price, durationMinutes: apt.durationMinutes)],
            assignedStaff: apt.staffName,
            seatId: seatId,
            checkInTime: DateFormat('hh:mm a').format(apt.time),
            elapsedMinutes: DateTime.now().difference(apt.time).inMinutes.clamp(1, 180),
            status: seatId == 'Waiting' ? 'Waiting' : 'In Salon',
            notes: apt.notes,
          ));
        }
      }
      _rebuildSeats(salonChairs);

      // Compute dashboard KPIs from real server records
      final todayStr = DateFormat('yyyy-MM-dd').format(DateTime.now());
      double revToday = 0.0;
      int completedCount = 0;
      for (final inv in invoices) {
        final status = (inv['status'] ?? '').toString().toLowerCase();
        final dateField = (inv['paidAt'] ?? inv['createdAt'] ?? inv['date'] ?? '').toString();
        if (status == 'paid' && dateField.startsWith(todayStr)) {
          revToday += (inv['grandTotal'] is num) ? (inv['grandTotal'] as num).toDouble() : 0.0;
          completedCount += 1;
        }
      }

      if (revToday == 0.0 && invoices.isNotEmpty) {
        for (final inv in invoices) {
          if ((inv['status'] ?? '').toString().toLowerCase() == 'paid') {
            revToday += (inv['grandTotal'] is num) ? (inv['grandTotal'] as num).toDouble() : 0.0;
            completedCount += 1;
          }
        }
      }

      todayRevenue = revToday;
      todayAppointmentsCount = appointments.where((a) => DateFormat('yyyy-MM-dd').format(a.time) == todayStr).length;
      if (todayAppointmentsCount == 0) todayAppointmentsCount = appointments.length;
      todayClientsCount = customers.length;
      staffCompletedCount = completedCount;
      todayProfit = (revToday - totalExpenses).clamp(0.0, double.infinity);

      if (canSwitchRoles) {
        try {
          final report = await api.fetchReportsSummary();
          if (report['netProfit'] is num) {
            todayProfit = (report['netProfit'] as num).toDouble();
          }
        } catch (_) {}
      }
    } finally {
      isSyncing = false;
      notifyListeners();
    }
  }

  void switchRole(String role) {
    if (!canSwitchRoles) return;
    if (role == "Owner" || role == "Receptionist") {
      userRole = role;
      notifyListeners();
    }
  }

  Future<void> updateSalonProfile({String? name, String? location, String? gstin}) async {
    final trimmedName = name?.trim();
    final trimmedLoc = location?.trim();
    final trimmedGstin = gstin?.trim();
    final updated = await api.updateSalonSettings({
      if (trimmedName != null && trimmedName.isNotEmpty) 'name': trimmedName,
      if (trimmedLoc != null && trimmedLoc.isNotEmpty) 'city': trimmedLoc,
      if (trimmedGstin != null && trimmedGstin.isNotEmpty) 'gstin': trimmedGstin,
    });
    _applyUserAndSalon(null, updated);
    notifyListeners();
  }

  Future<void> updateSalonPaymentSettings({required String upiId}) async {
    final trimmedUpi = upiId.trim();
    salonUpiId = trimmedUpi;
    notifyListeners();
    try {
      final updated = await api.updateSalonSettings({
        'upiId': trimmedUpi,
      });
      _applyUserAndSalon(null, updated);
      notifyListeners();
    } catch (_) {}
  }

  int get inSalonActiveCount => inSalonClients.where((c) => c.status == "In Salon").length;
  int get waitingClientsCount => inSalonClients.where((c) => c.status == "Waiting").length;
  int get seatsInUseCount => seats.where((s) => s.isInUse).length;
  int get seatsAvailableCount => seats.where((s) => !s.isInUse).length;

  int get totalInventoryItemsCount => inventory.fold(0, (sum, i) => sum + i.stock);
  int get lowStockInventoryCount => inventory.where((i) => i.isLowStock).length;

  double get totalExpenses => expenses.fold(0, (sum, e) => sum + e.amount);

  double get cartSubtotal => posCart.fold(0, (sum, item) => sum + (item.service.price * item.quantity));
  double get cartTax => ((cartSubtotal - discountAmount).clamp(0, double.infinity)) * 0.18;
  double get cartTotalPayable => (cartSubtotal - discountAmount + cartTax).clamp(0, double.infinity);

  void updateCartQuantity(String serviceId, int delta) {
    final idx = posCart.indexWhere((c) => c.service.id == serviceId);
    if (idx >= 0) {
      final newQty = posCart[idx].quantity + delta;
      if (newQty <= 0) {
        posCart.removeAt(idx);
      } else {
        posCart[idx].quantity = newQty;
      }
      notifyListeners();
    }
  }

  void addServiceToCart(ServiceItem service) {
    final idx = posCart.indexWhere((c) => c.service.id == service.id);
    if (idx >= 0) {
      posCart[idx].quantity += 1;
    } else {
      posCart.add(CartItem(service: service));
    }
    notifyListeners();
  }

  void clearCart() {
    posCart.clear();
    notifyListeners();
  }

  void setPosCustomer(Customer? customer) {
    posSelectedCustomer = customer;
    notifyListeners();
  }

  Future<void> completePayment({required String method, double? amount}) async {
    final total = amount ?? cartTotalPayable;
    final itemsPayload = posCart.isNotEmpty
        ? posCart
            .map((c) => {
                  'serviceId': c.service.id,
                  'name': c.service.name,
                  'price': c.service.price,
                  'quantity': c.quantity,
                })
            .toList()
        : [
            {'name': 'Salon Service', 'price': total, 'quantity': 1}
          ];

    await api.createInvoice({
      if (posSelectedCustomer != null && !posSelectedCustomer!.id.startsWith('tmp_'))
        'customerId': posSelectedCustomer!.id,
      'customerName': posSelectedCustomer?.name ?? 'Walk-in Guest',
      'customerPhone': posSelectedCustomer?.phone ?? '',
      'items': itemsPayload,
      'subtotal': posCart.isNotEmpty ? cartSubtotal : total,
      'discountAmount': discountAmount,
      'taxPercent': posCart.isNotEmpty ? 18.0 : 0.0,
      'paymentMethod': method,
      'status': 'paid',
    });

    todayRevenue += total;
    todayClientsCount += 1;
    clearCart();
    await syncWorkspace();
  }

  Future<void> addAppointment(Appointment appt) async {
    appointments.insert(0, appt);
    notifyListeners();
    try {
      final created = await api.createAppointment({
        'customerName': appt.customerName,
        'customerPhone': appt.customerPhone,
        'serviceName': appt.serviceName,
        'staffName': appt.staffName,
        'date': DateFormat('yyyy-MM-dd').format(appt.time),
        'startTime': DateFormat('HH:mm').format(appt.time),
        'durationMinutes': appt.durationMinutes,
        'price': appt.price,
        'status': appt.status.toLowerCase().replaceAll(' ', '_'),
        'notes': appt.notes,
        'source': 'mobile_app',
        'allowDoubleBooking': true,
      });
      appointments[0] = Appointment.fromJson(created);
      notifyListeners();
    } catch (e) {
      appointments.remove(appt);
      lastSyncError = e.toString();
      notifyListeners();
      rethrow;
    }
  }

  Future<void> updateAppointmentStatus(String id, String newStatus) async {
    final idx = appointments.indexWhere((a) => a.id == id);
    final previous = idx >= 0 ? appointments[idx].status : null;
    if (idx >= 0) {
      appointments[idx].status = newStatus;
      notifyListeners();
    }
    try {
      await api.updateAppointmentStatus(id, newStatus.toLowerCase().replaceAll(' ', '_'));
    } catch (e) {
      if (idx >= 0 && previous != null) {
        appointments[idx].status = previous;
      }
      lastSyncError = e.toString();
      notifyListeners();
    }
  }

  Future<void> addCustomer(Customer customer) async {
    customers.insert(0, customer);
    notifyListeners();
    try {
      final created = await api.createCustomer({
        'name': customer.name,
        'phone': customer.phone,
        'email': customer.email,
        'formulaNotes': customer.formulaNotes ?? '',
        'vipTier': customer.membership,
      });
      customers[0] = Customer.fromJson(created);
      notifyListeners();
    } catch (e) {
      customers.remove(customer);
      lastSyncError = e.toString();
      notifyListeners();
    }
  }

  Future<void> addStaff(StaffMember staffMember) async {
    staff.add(staffMember);
    notifyListeners();
    try {
      final created = await api.createStaff({
        'name': staffMember.name,
        'role': staffMember.role,
        'phone': staffMember.phone,
        'commissionRate': staffMember.commissionRate * 100.0,
      });
      final idx = staff.indexOf(staffMember);
      if (idx >= 0) staff[idx] = StaffMember.fromJson(created);
      notifyListeners();
    } catch (e) {
      staff.remove(staffMember);
      lastSyncError = e.toString();
      notifyListeners();
    }
  }

  Future<void> toggleStaffClockIn(String id) async {
    final idx = staff.indexWhere((s) => s.id == id);
    if (idx >= 0) {
      staff[idx].isClockedIn = !staff[idx].isClockedIn;
      notifyListeners();
      try {
        final updated = await api.toggleStaffClock(id);
        staff[idx] = StaffMember.fromJson(updated);
        notifyListeners();
      } catch (_) {}
    }
  }

  Future<void> addService(ServiceItem service) async {
    catalog.add(service);
    notifyListeners();
    try {
      final created = await api.createService({
        'name': service.name,
        'category': service.category,
        'price': service.price,
        'durationMinutes': service.durationMinutes,
      });
      final idx = catalog.indexOf(service);
      if (idx >= 0) catalog[idx] = ServiceItem.fromJson(created);
      notifyListeners();
    } catch (e) {
      catalog.remove(service);
      lastSyncError = e.toString();
      notifyListeners();
    }
  }

  Future<void> addInventoryItem(InventoryItem item) async {
    inventory.insert(0, item);
    notifyListeners();
    try {
      final created = await api.createInventoryItem({
        'name': item.name,
        'category': item.category,
        'currentStock': item.stock,
        'minThreshold': item.minAlert,
        'unit': item.unit,
        'brand': item.sizeVolume,
      });
      inventory[0] = InventoryItem.fromJson(created);
      notifyListeners();
    } catch (e) {
      inventory.remove(item);
      lastSyncError = e.toString();
      notifyListeners();
    }
  }

  Future<void> addExpense(ExpenseItem item) async {
    expenses.insert(0, item);
    notifyListeners();
    try {
      final created = await api.createExpense({
        'title': item.note.isNotEmpty ? item.note : item.category,
        'category': item.category,
        'amount': item.amount,
        'date': DateFormat('yyyy-MM-dd').format(item.date),
        'notes': item.note,
      });
      expenses[0] = ExpenseItem.fromJson(created);
      notifyListeners();
    } catch (e) {
      expenses.remove(item);
      lastSyncError = e.toString();
      notifyListeners();
    }
  }

  void toggleOfferStatus(String id) {
    final idx = offers.indexWhere((o) => o.id == id);
    if (idx >= 0) {
      offers[idx].isActive = !offers[idx].isActive;
      notifyListeners();
    }
  }

  void addOffer(OfferItem offer) {
    offers.add(offer);
    notifyListeners();
  }

  Future<void> checkInCustomer({
    required String customerName,
    required String phone,
    required List<ServiceItem> services,
    required String assignedStaff,
    required String seatId,
    String notes = "",
  }) async {
    final tempId = "ins_${DateTime.now().millisecondsSinceEpoch}";
    final isWaiting = seatId == "Waiting";
    final now = TimeOfDayHelper.formatNow();

    final newClient = InSalonClient(
      id: tempId,
      customerName: customerName,
      phone: phone,
      services: services,
      assignedStaff: assignedStaff,
      seatId: seatId,
      checkInTime: now,
      elapsedMinutes: 1,
      status: isWaiting ? "Waiting" : "In Salon",
      notes: notes,
    );

    inSalonClients.insert(0, newClient);

    if (!isWaiting) {
      final seatIdx = seats.indexWhere((s) => s.id == seatId);
      if (seatIdx >= 0) {
        seats[seatIdx].isInUse = true;
        seats[seatIdx].currentClientId = tempId;
        seats[seatIdx].currentClientName = customerName;
      }
    }

    notifyListeners();

    try {
      final totalServicePrice = services.fold(0.0, (s, item) => s + item.price);
      final created = await api.createAppointment({
        'customerName': customerName,
        'customerPhone': phone,
        'serviceName': services.map((s) => s.name).join(' + '),
        'staffName': assignedStaff,
        'date': DateFormat('yyyy-MM-dd').format(DateTime.now()),
        'startTime': DateFormat('HH:mm').format(DateTime.now()),
        'durationMinutes': services.fold(0, (s, item) => s + item.durationMinutes),
        'price': totalServicePrice > 0 ? totalServicePrice : 500.0,
        'status': 'in_service',
        'notes': notes,
        'source': 'front_desk',
        'allowDoubleBooking': true,
      });
      appointments.insert(0, Appointment.fromJson(created));
      notifyListeners();
    } catch (_) {}
  }

  void updateInSalonClient({
    required String clientId,
    String? newSeatId,
    String? newStaff,
    List<ServiceItem>? newServices,
  }) {
    final idx = inSalonClients.indexWhere((c) => c.id == clientId);
    if (idx < 0) return;

    final client = inSalonClients[idx];

    if (newSeatId != null && newSeatId != client.seatId) {
      final oldSeatIdx = seats.indexWhere((s) => s.id == client.seatId);
      if (oldSeatIdx >= 0) {
        seats[oldSeatIdx].isInUse = false;
        seats[oldSeatIdx].currentClientId = null;
        seats[oldSeatIdx].currentClientName = null;
      }
      if (newSeatId != "Waiting") {
        final newSeatIdx = seats.indexWhere((s) => s.id == newSeatId);
        if (newSeatIdx >= 0) {
          seats[newSeatIdx].isInUse = true;
          seats[newSeatIdx].currentClientId = client.id;
          seats[newSeatIdx].currentClientName = client.customerName;
        }
        client.status = "In Salon";
      } else {
        client.status = "Waiting";
      }
      client.seatId = newSeatId;
    }

    if (newStaff != null) client.assignedStaff = newStaff;
    if (newServices != null && newServices.isNotEmpty) client.services = newServices;

    notifyListeners();
  }

  void moveClientToBilling(InSalonClient client) {
    activeBillingClient = client;

    final existingIdx = customers.indexWhere((c) => c.name.toLowerCase() == client.customerName.toLowerCase());
    if (existingIdx >= 0) {
      posSelectedCustomer = customers[existingIdx];
    } else {
      posSelectedCustomer = Customer(
        id: "tmp_${client.id}",
        name: client.customerName,
        phone: client.phone,
        email: "",
        visitsCount: 1,
        totalSpent: 0,
      );
    }

    posCart.clear();
    for (final svc in client.services) {
      posCart.add(CartItem(service: svc, quantity: 1));
    }

    notifyListeners();
  }

  Future<void> completeStaffCheckout({required String method, required double amount}) async {
    await completePayment(method: method, amount: amount);

    if (activeBillingClient != null) {
      final client = activeBillingClient!;
      client.status = "Completed";
      if (!client.id.startsWith('ins_')) {
        await updateAppointmentStatus(client.id, 'Completed');
      }

      final seatIdx = seats.indexWhere((s) => s.id == client.seatId);
      if (seatIdx >= 0) {
        seats[seatIdx].isInUse = false;
        seats[seatIdx].currentClientId = null;
        seats[seatIdx].currentClientName = null;
      }
      activeBillingClient = null;
    }

    notifyListeners();
  }

  Future<void> logout() async {
    await api.clearToken();
    _clearWorkspaceData();
    isAuthenticated = false;
    notifyListeners();
  }
}

class TimeOfDayHelper {
  static String formatNow() {
    final now = DateTime.now();
    final hour12 = now.hour > 12 ? now.hour - 12 : (now.hour == 0 ? 12 : now.hour);
    final period = now.hour >= 12 ? "PM" : "AM";
    return "${hour12.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')} $period";
  }
}
