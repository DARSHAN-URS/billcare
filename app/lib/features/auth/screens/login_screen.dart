import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';
import 'package:ruvexi_mobile/shared/widgets/ruvexi_logo.dart';
import '../../../main.dart';

class LoginScreen extends StatefulWidget {
  final RuvexiAppState appState;

  const LoginScreen({super.key, required this.appState});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _identifierCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();

  bool _obscurePassword = true;
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _identifierCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  // Handle Standard Sign In
  Future<void> _handleSignIn() async {
    final identifier = _identifierCtrl.text.trim();
    final password = _passwordCtrl.text;

    setState(() => _errorMessage = null);

    if (identifier.isEmpty) {
      setState(() => _errorMessage = "Please enter your email or mobile number");
      return;
    }
    if (password.isEmpty) {
      setState(() => _errorMessage = "Please enter your password");
      return;
    }

    setState(() => _isLoading = true);

    try {
      await widget.appState.login(identifier: identifier, password: password);

      if (!mounted) return;
      setState(() => _isLoading = false);

      Navigator.of(context).pushReplacement(
        PageRouteBuilder(
          pageBuilder: (_, __, ___) => MainShellScreen(appState: widget.appState),
          transitionsBuilder: (_, anim, __, child) => FadeTransition(opacity: anim, child: child),
          transitionDuration: const Duration(milliseconds: 400),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      final raw = e.toString();
      final clean = raw.replaceAll('RuvexiApiException:', '').replaceAll('Exception:', '').trim();
      setState(() {
        _isLoading = false;
        _errorMessage = clean.isNotEmpty ? clean : "Sign in failed. Please verify your credentials.";
      });
    }
  }

  // Handle Google Sign In
  Future<void> _handleGoogleSignIn() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      await widget.appState.loginWithGoogle();

      if (!mounted) return;
      setState(() => _isLoading = false);

      Navigator.of(context).pushReplacement(
        PageRouteBuilder(
          pageBuilder: (_, __, ___) => MainShellScreen(appState: widget.appState),
          transitionsBuilder: (_, anim, __, child) => FadeTransition(opacity: anim, child: child),
          transitionDuration: const Duration(milliseconds: 400),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      final raw = e.toString();
      String friendlyMessage;

      if (raw.contains('10') || raw.contains('DEVELOPER_ERROR') || raw.contains('sign_in_failed')) {
        friendlyMessage =
            "Google Sign-In requires registering the app's SHA-1 fingerprint in Google Cloud Console.\n\nPlease sign in with Email & Password or use Phone OTP (8296294666).";
      } else if (raw.contains('cancelled') || raw.contains('canceled')) {
        friendlyMessage = "Google sign-in was cancelled.";
      } else {
        friendlyMessage = raw.replaceAll('RuvexiApiException:', '').replaceAll('Exception:', '').trim();
      }

      setState(() {
        _isLoading = false;
        _errorMessage = friendlyMessage;
      });
    }
  }

  // Handle Phone OTP Sign-In
  void _showOtpSignInSheet() {
    final phoneCtrl = TextEditingController(text: "8296294666");
    final otpCtrl = TextEditingController();
    bool otpSent = false;
    bool isSubmitting = false;
    String? otpError;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF101211),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        side: BorderSide(color: Color(0xFF22C55E), width: 1.2),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 24,
                right: 24,
                top: 24,
                bottom: MediaQuery.of(ctx).viewInsets.bottom + 28,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Manager Sign In with Phone OTP",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close_rounded, color: Colors.white54, size: 20),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    otpSent
                        ? "Enter the 6-digit verification code dispatched to your phone/email."
                        : "Enter your registered Salon Manager phone number to receive a secure login code.",
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.55),
                      fontSize: 12.5,
                    ),
                  ),
                  if (otpError != null) ...[
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.red.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: Colors.redAccent.withOpacity(0.5)),
                      ),
                      child: Text(
                        otpError!,
                        style: const TextStyle(color: Colors.redAccent, fontSize: 12),
                      ),
                    ),
                  ],
                  const SizedBox(height: 18),
                  if (!otpSent) ...[
                    Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFF141715),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFF272B28), width: 1.2),
                      ),
                      child: TextField(
                        controller: phoneCtrl,
                        keyboardType: TextInputType.phone,
                        style: const TextStyle(color: Colors.white, fontSize: 14),
                        decoration: InputDecoration(
                          hintText: "Phone Number (e.g. 8296294666)",
                          hintStyle: TextStyle(
                            color: Colors.white.withOpacity(0.42),
                            fontSize: 13,
                          ),
                          prefixIcon: Icon(
                            Icons.phone_android_rounded,
                            color: Colors.white.withOpacity(0.65),
                            size: 20,
                          ),
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(vertical: 14),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF22C55E),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(25),
                          ),
                        ),
                        onPressed: isSubmitting
                            ? null
                            : () async {
                                final phone = phoneCtrl.text.trim();
                                if (phone.isEmpty) return;
                                setSheetState(() {
                                  isSubmitting = true;
                                  otpError = null;
                                });
                                try {
                                  await widget.appState.requestOtp(phone);
                                  setSheetState(() {
                                    isSubmitting = false;
                                    otpSent = true;
                                  });
                                } catch (e) {
                                  setSheetState(() {
                                    isSubmitting = false;
                                    otpError = e.toString().replaceAll('RuvexiApiException:', '').trim();
                                  });
                                }
                              },
                        child: isSubmitting
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black),
                              )
                            : const Text(
                                "Send Login Code",
                                style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                      ),
                    ),
                  ] else ...[
                    Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFF141715),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFF272B28), width: 1.2),
                      ),
                      child: TextField(
                        controller: otpCtrl,
                        keyboardType: TextInputType.number,
                        maxLength: 6,
                        style: const TextStyle(color: Colors.white, fontSize: 18, letterSpacing: 6, fontWeight: FontWeight.bold),
                        decoration: InputDecoration(
                          counterText: "",
                          hintText: "• • • • • •",
                          hintStyle: TextStyle(
                            color: Colors.white.withOpacity(0.3),
                            fontSize: 18,
                            letterSpacing: 6,
                          ),
                          prefixIcon: Icon(
                            Icons.lock_clock_rounded,
                            color: Colors.white.withOpacity(0.65),
                            size: 20,
                          ),
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(vertical: 14),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF22C55E),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(25),
                          ),
                        ),
                        onPressed: isSubmitting
                            ? null
                            : () async {
                                final code = otpCtrl.text.trim();
                                if (code.length < 6) return;
                                setSheetState(() {
                                  isSubmitting = true;
                                  otpError = null;
                                });
                                try {
                                  await widget.appState.verifyOtp(
                                    phone: phoneCtrl.text.trim(),
                                    otp: code,
                                  );
                                  if (!mounted) return;
                                  Navigator.pop(ctx);
                                  Navigator.of(context).pushReplacement(
                                    PageRouteBuilder(
                                      pageBuilder: (_, __, ___) => MainShellScreen(appState: widget.appState),
                                      transitionsBuilder: (_, anim, __, child) => FadeTransition(opacity: anim, child: child),
                                      transitionDuration: const Duration(milliseconds: 400),
                                    ),
                                  );
                                } catch (e) {
                                  setSheetState(() {
                                    isSubmitting = false;
                                    otpError = e.toString().replaceAll('RuvexiApiException:', '').trim();
                                  });
                                }
                              },
                        child: isSubmitting
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black),
                              )
                            : const Text(
                                "Verify & Sign In",
                                style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                      ),
                    ),
                    const SizedBox(height: 10),
                    Center(
                      child: TextButton(
                        onPressed: () => setSheetState(() => otpSent = false),
                        child: const Text(
                          "Change Phone Number",
                          style: TextStyle(color: Color(0xFF22C55E), fontSize: 12),
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            );
          },
        );
      },
    );
  }

  // Forgot Password Bottom Sheet
  void _showForgotPasswordSheet() {
    final emailCtrl = TextEditingController(text: _identifierCtrl.text);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF101211),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            left: 24,
            right: 24,
            top: 24,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 28,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    "Reset Password",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white60, size: 20),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                "Enter your registered email address or mobile number. We'll send instructions to reset your password.",
                style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.6),
                  fontSize: 13,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 20),
              Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF141715),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF272B28), width: 1.2),
                ),
                child: TextField(
                  controller: emailCtrl,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: InputDecoration(
                    hintText: "Email or Mobile Number",
                    hintStyle: TextStyle(color: Colors.white.withValues(alpha: 0.4), fontSize: 13.5),
                    prefixIcon: const Icon(Icons.mail_outline_rounded, color: Colors.white60, size: 20),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF22C55E),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(25),
                    ),
                  ),
                  onPressed: () async {
                    final targetEmail = emailCtrl.text.trim();
                    if (targetEmail.isEmpty) return;
                    Navigator.pop(ctx);
                    try {
                      await widget.appState.requestPasswordReset(targetEmail);
                      if (!mounted) return;
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text("Password reset instructions sent to $targetEmail"),
                          backgroundColor: const Color(0xFF22C55E),
                          behavior: SnackBarBehavior.floating,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                      );
                    } catch (e) {
                      if (!mounted) return;
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(e.toString()),
                          backgroundColor: Colors.redAccent,
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    }
                  },
                  child: const Text(
                    "Send Reset Instructions",
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 14.5,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // Create Account Bottom Sheet / Dialog
  void _showCreateAccountSheet() {
    final nameCtrl = TextEditingController();
    final salonCtrl = TextEditingController();
    final emailCtrl = TextEditingController(text: _identifierCtrl.text.trim());
    final passCtrl = TextEditingController();
    final cityCtrl = TextEditingController(text: "Bengaluru");
    bool creating = false;
    String? modalError;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF101211),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setModalState) => Padding(
            padding: EdgeInsets.only(
              left: 24,
              right: 24,
              top: 24,
              bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
            ),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Create Salon Workspace",
                    style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    "Launch your sovereign salon workspace.",
                    style: TextStyle(color: Colors.white.withValues(alpha: 0.65), fontSize: 13),
                  ),
                  if (modalError != null) ...[
                    const SizedBox(height: 12),
                    Text(modalError!, style: const TextStyle(color: Colors.redAccent, fontSize: 12.5)),
                  ],
                  const SizedBox(height: 14),
                  _sheetField(nameCtrl, "Your Full Name"),
                  const SizedBox(height: 10),
                  _sheetField(salonCtrl, "Salon / Studio Name"),
                  const SizedBox(height: 10),
                  _sheetField(emailCtrl, "Work Email", keyboardType: TextInputType.emailAddress),
                  const SizedBox(height: 10),
                  _sheetField(passCtrl, "Password (min 6 chars)", obscureText: true),
                  const SizedBox(height: 10),
                  _sheetField(cityCtrl, "City"),
                  const SizedBox(height: 18),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF22C55E),
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
                      ),
                      onPressed: creating
                          ? null
                          : () async {
                              setModalState(() {
                                creating = true;
                                modalError = null;
                              });
                              try {
                                await widget.appState.signup(
                                  ownerName: nameCtrl.text.trim(),
                                  salonNameInput: salonCtrl.text.trim(),
                                  email: emailCtrl.text.trim(),
                                  password: passCtrl.text,
                                  city: cityCtrl.text.trim().isNotEmpty ? cityCtrl.text.trim() : "Bengaluru",
                                );
                                if (!mounted) return;
                                Navigator.pop(ctx);
                                Navigator.of(context).pushReplacement(
                                  MaterialPageRoute(builder: (_) => MainShellScreen(appState: widget.appState)),
                                );
                              } catch (e) {
                                setModalState(() {
                                  creating = false;
                                  modalError = e.toString();
                                });
                              }
                            },
                      child: creating
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black),
                            )
                          : const Text(
                              "Create Salon Workspace",
                              style: TextStyle(color: Colors.black, fontSize: 14.5, fontWeight: FontWeight.bold),
                            ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _sheetField(
    TextEditingController ctrl,
    String hint, {
    bool obscureText = false,
    TextInputType? keyboardType,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF141715),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFF272B28), width: 1.2),
      ),
      child: TextField(
        controller: ctrl,
        obscureText: obscureText,
        keyboardType: keyboardType,
        style: const TextStyle(color: Colors.white, fontSize: 14),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: TextStyle(color: Colors.white.withValues(alpha: 0.4), fontSize: 13.5),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF08090A),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        color: const Color(0xFF08090A),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 26, vertical: 24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Real Ruvexi Brand Logo
                  Container(
                    width: 76,
                    height: 76,
                    decoration: BoxDecoration(
                      color: const Color(0xFF121513),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFF272B28), width: 1.4),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF22C55E).withOpacity(0.14),
                          blurRadius: 24,
                          spreadRadius: 1,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(18),
                      child: Image.asset(
                        'assets/images/logo.png',
                        width: 76,
                        height: 76,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Image.asset(
                          'assets/icons/app_icon_512.png',
                          width: 76,
                          height: 76,
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 14),

                  // Brand Text
                  const RuvexiLogoWidget(fontSize: 26, showSubtitle: true),
                  const SizedBox(height: 4),
                  Text(
                    "Salon Management Platform",
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.5),
                      fontSize: 12.5,
                      fontWeight: FontWeight.w400,
                      letterSpacing: 0.5,
                    ),
                  ),

                  const SizedBox(height: 32),

                    // Welcome Back Header
                    const Text(
                      "Welcome Back",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 23,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.3,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      "Sign in to manage your salon",
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.65),
                        fontSize: 13.5,
                      ),
                    ),

                    const SizedBox(height: 28),

                    // Error Banner if present
                    if (_errorMessage != null) ...[
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        margin: const EdgeInsets.only(bottom: 18),
                        decoration: BoxDecoration(
                          color: const Color(0xFF221111),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: const Color(0xFF7F1D1D)),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Padding(
                              padding: EdgeInsets.only(top: 2),
                              child: Icon(Icons.error_outline_rounded, color: Color(0xFFEF4444), size: 18),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                _errorMessage!,
                                style: const TextStyle(
                                  color: Color(0xFFFCA5A5),
                                  fontSize: 12.5,
                                  height: 1.4,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],

                    // Input 1: Email or Mobile Number (100% Opaque)
                    Container(
                      height: 52,
                      decoration: BoxDecoration(
                        color: const Color(0xFF141715),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: const Color(0xFF272B28),
                          width: 1.2,
                        ),
                      ),
                      child: TextField(
                        controller: _identifierCtrl,
                        keyboardType: TextInputType.emailAddress,
                        style: const TextStyle(color: Colors.white, fontSize: 14),
                        decoration: InputDecoration(
                          hintText: "Email or Mobile Number",
                          hintStyle: TextStyle(
                            color: Colors.white.withOpacity(0.42),
                            fontSize: 13.5,
                          ),
                          prefixIcon: Icon(
                            Icons.mail_outline_rounded,
                            color: Colors.white.withOpacity(0.65),
                            size: 20,
                          ),
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        ),
                      ),
                    ),

                    const SizedBox(height: 14),

                    // Input 2: Password (100% Opaque)
                    Container(
                      height: 52,
                      decoration: BoxDecoration(
                        color: const Color(0xFF141715),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: const Color(0xFF272B28),
                          width: 1.2,
                        ),
                      ),
                      child: TextField(
                        controller: _passwordCtrl,
                        obscureText: _obscurePassword,
                        style: const TextStyle(color: Colors.white, fontSize: 14),
                        decoration: InputDecoration(
                          hintText: "Password",
                          hintStyle: TextStyle(
                            color: Colors.white.withOpacity(0.42),
                            fontSize: 13.5,
                          ),
                          prefixIcon: Icon(
                            Icons.lock_outline_rounded,
                            color: Colors.white.withOpacity(0.65),
                            size: 20,
                          ),
                          suffixIcon: IconButton(
                            icon: Icon(
                              _obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                              color: Colors.white.withOpacity(0.6),
                              size: 20,
                            ),
                            onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                          ),
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        ),
                      ),
                    ),

                    const SizedBox(height: 12),

                    // Forgot Password Link
                    Align(
                      alignment: Alignment.centerRight,
                      child: GestureDetector(
                        onTap: _showForgotPasswordSheet,
                        child: const Text(
                          "Forgot Password?",
                          style: TextStyle(
                            color: Color(0xFF22C55E),
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 22),

                    // Primary Button: Sign In ->
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF22C55E),
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(28),
                          ),
                        ),
                        onPressed: _isLoading ? null : _handleSignIn,
                        child: _isLoading
                            ? const SizedBox(
                                width: 22,
                                height: 22,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2.2,
                                  valueColor: AlwaysStoppedAnimation<Color>(Colors.black),
                                ),
                              )
                            : Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: const [
                                  Text(
                                    "Sign In",
                                    style: TextStyle(
                                      color: Colors.black,
                                      fontSize: 15.5,
                                      fontWeight: FontWeight.bold,
                                      letterSpacing: 0.2,
                                    ),
                                  ),
                                  SizedBox(width: 6),
                                  Icon(
                                    Icons.arrow_forward_rounded,
                                    color: Colors.black,
                                    size: 18,
                                  ),
                                ],
                              ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // "or" Divider
                    Row(
                      children: [
                        Expanded(
                          child: Divider(
                            color: const Color(0xFF272B28),
                            thickness: 1.0,
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 14),
                          child: Text(
                            "or",
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.45),
                              fontSize: 12.5,
                            ),
                          ),
                        ),
                        Expanded(
                          child: Divider(
                            color: const Color(0xFF272B28),
                            thickness: 1.0,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 20),

                    // Social Button: Continue with Google (100% Opaque)
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          backgroundColor: const Color(0xFF141715),
                          side: const BorderSide(
                            color: Color(0xFF272B28),
                            width: 1.2,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(28),
                          ),
                        ),
                        onPressed: _isLoading ? null : _handleGoogleSignIn,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Image.asset(
                              'assets/icons/google_g.png',
                              width: 18,
                              height: 18,
                              errorBuilder: (_, __, ___) => const Icon(
                                Icons.g_mobiledata_rounded,
                                color: Colors.white,
                                size: 22,
                              ),
                            ),
                            const SizedBox(width: 10),
                            const Text(
                              "Continue with Google",
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 13.5,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 12),

                    // Phone OTP Sign-In Button
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          backgroundColor: const Color(0xFF141715),
                          side: const BorderSide(
                            color: Color(0xFF22C55E),
                            width: 1.0,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(28),
                          ),
                        ),
                        onPressed: _isLoading ? null : _showOtpSignInSheet,
                        icon: const Icon(Icons.phone_iphone_rounded, color: Color(0xFF22C55E), size: 18),
                        label: const Text(
                          "Sign In with Phone OTP",
                          style: TextStyle(
                            color: Color(0xFF22C55E),
                            fontSize: 13.5,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 28),

                    // Footer Link: Don't have an account? Create Account
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "Don't have an account? ",
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.6),
                            fontSize: 13,
                          ),
                        ),
                        GestureDetector(
                          onTap: _showCreateAccountSheet,
                          child: const Text(
                            "Create Account",
                            style: TextStyle(
                              color: Color(0xFF22C55E),
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      );
  }
}
