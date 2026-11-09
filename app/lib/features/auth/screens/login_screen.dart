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
  // Mode selection: 0 = Owner (Email OTP), 1 = Staff (Email + Password)
  int _selectedRoleIndex = 0;

  // Controllers
  final _ownerEmailCtrl = TextEditingController(text: "owner@ruvexi.com");
  final _staffEmailCtrl = TextEditingController(text: "staff@ruvexi.com");
  final _staffPasswordCtrl = TextEditingController();
  final _otpCtrl = TextEditingController();
  final _newPasswordCtrl = TextEditingController();

  bool _obscurePassword = true;
  bool _isLoading = false;

  // Owner state: false = enter email, true = enter OTP
  bool _ownerOtpSent = false;

  // Forgot password dialog flow
  void _showStaffForgotPasswordDialog() {
    final resetEmailCtrl = TextEditingController(text: _staffEmailCtrl.text);
    final forgotOtpCtrl = TextEditingController();
    final newPassCtrl = TextEditingController();
    bool otpDispatched = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: RuvexiTheme.card,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (modalCtx, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 24,
                right: 24,
                top: 24,
                bottom: MediaQuery.of(modalCtx).viewInsets.bottom + 24,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Reset Staff Password",
                        style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: RuvexiTheme.textMuted, size: 20),
                        onPressed: () => Navigator.pop(modalCtx),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    otpDispatched
                        ? "Enter the 6-digit OTP sent to your staff email and set a new password."
                        : "Enter your registered staff email. We will dispatch a verification OTP to reset your password.",
                    style: const TextStyle(color: RuvexiTheme.textMuted, fontSize: 13, height: 1.4),
                  ),
                  const SizedBox(height: 20),

                  if (!otpDispatched) ...[
                    TextField(
                      controller: resetEmailCtrl,
                      style: const TextStyle(color: Colors.white, fontSize: 14),
                      decoration: InputDecoration(
                        labelText: "Staff Email",
                        labelStyle: const TextStyle(color: RuvexiTheme.textMuted, fontSize: 13),
                        prefixIcon: const Icon(Icons.mail_outline, color: RuvexiTheme.textMuted, size: 20),
                        filled: true,
                        fillColor: RuvexiTheme.surface,
                        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: RuvexiTheme.border)),
                        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: RuvexiTheme.primaryAccent)),
                      ),
                    ),
                    const SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: RuvexiTheme.primaryAccent,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        onPressed: () {
                          if (resetEmailCtrl.text.isNotEmpty) {
                            setModalState(() => otpDispatched = true);
                          }
                        },
                        child: const Text("Send Reset OTP", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 14)),
                      ),
                    ),
                  ] else ...[
                    // OTP Input
                    TextField(
                      controller: forgotOtpCtrl,
                      keyboardType: TextInputType.number,
                      maxLength: 6,
                      style: const TextStyle(color: Colors.white, fontSize: 18, letterSpacing: 8, fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center,
                      decoration: InputDecoration(
                        hintText: "• • • • • •",
                        hintStyle: const TextStyle(color: RuvexiTheme.textSecondary, letterSpacing: 8),
                        counterText: "",
                        filled: true,
                        fillColor: RuvexiTheme.surface,
                        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: RuvexiTheme.border)),
                        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: RuvexiTheme.primaryAccent)),
                      ),
                    ),
                    const SizedBox(height: 14),
                    // New Password
                    TextField(
                      controller: newPassCtrl,
                      obscureText: true,
                      style: const TextStyle(color: Colors.white, fontSize: 14),
                      decoration: InputDecoration(
                        labelText: "New Password",
                        labelStyle: const TextStyle(color: RuvexiTheme.textMuted, fontSize: 13),
                        prefixIcon: const Icon(Icons.lock_outline, color: RuvexiTheme.textMuted, size: 20),
                        filled: true,
                        fillColor: RuvexiTheme.surface,
                        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: RuvexiTheme.border)),
                        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: RuvexiTheme.primaryAccent)),
                      ),
                    ),
                    const SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: RuvexiTheme.primaryAccent,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        onPressed: () {
                          widget.appState.resetStaffPassword(
                            email: resetEmailCtrl.text,
                            newPassword: newPassCtrl.text,
                          );
                          Navigator.pop(modalCtx);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text("Password updated successfully! Sign in with your new credentials."),
                              backgroundColor: RuvexiTheme.primaryAccent,
                            ),
                          );
                        },
                        child: const Text("Confirm & Set New Password", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 14)),
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

  // Owner action: Send OTP or Verify OTP
  Future<void> _handleOwnerAction() async {
    if (_ownerEmailCtrl.text.isEmpty) return;

    if (!_ownerOtpSent) {
      // Step 1: Send OTP to owner email
      setState(() => _isLoading = true);
      await Future.delayed(const Duration(milliseconds: 600));
      setState(() {
        _isLoading = false;
        _ownerOtpSent = true;
      });
    } else {
      // Step 2: Verify OTP
      if (_otpCtrl.text.length < 4) return;
      setState(() => _isLoading = true);
      await Future.delayed(const Duration(milliseconds: 700));

      widget.appState.loginAsOwner(email: _ownerEmailCtrl.text);

      if (!mounted) return;
      setState(() => _isLoading = false);

      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => MainShellScreen(appState: widget.appState)),
      );
    }
  }

  // Staff action: Email + Password Login
  Future<void> _handleStaffLogin() async {
    if (_staffEmailCtrl.text.isEmpty) return;
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(milliseconds: 700));

    widget.appState.loginAsStaff(
      email: _staffEmailCtrl.text,
      password: _staffPasswordCtrl.text,
    );

    if (!mounted) return;
    setState(() => _isLoading = false);

    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => MainShellScreen(appState: widget.appState)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: RuvexiTheme.background,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Brand Header
                const Center(child: RuvexiLogoWidget(fontSize: 24, showSubtitle: true)),
                const SizedBox(height: 8),
                Center(
                  child: Text(
                    "Sign in to your sovereign salon workspace",
                    style: TextStyle(color: RuvexiTheme.textMuted, fontSize: 13),
                  ),
                ),
                const SizedBox(height: 32),

                // Role Toggle (Owner vs Staff) - Clean, premium segmented pill
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: RuvexiTheme.card,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: RuvexiTheme.border),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() {
                            _selectedRoleIndex = 0;
                            _ownerOtpSent = false;
                          }),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            decoration: BoxDecoration(
                              color: _selectedRoleIndex == 0 ? RuvexiTheme.surface : Colors.transparent,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: _selectedRoleIndex == 0 ? RuvexiTheme.border : Colors.transparent,
                              ),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.store_mall_directory_outlined,
                                  size: 16,
                                  color: _selectedRoleIndex == 0 ? RuvexiTheme.primaryAccent : RuvexiTheme.textMuted,
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  "Salon Owner",
                                  style: TextStyle(
                                    color: _selectedRoleIndex == 0 ? Colors.white : RuvexiTheme.textMuted,
                                    fontSize: 13,
                                    fontWeight: _selectedRoleIndex == 0 ? FontWeight.bold : FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _selectedRoleIndex = 1),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            decoration: BoxDecoration(
                              color: _selectedRoleIndex == 1 ? RuvexiTheme.surface : Colors.transparent,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: _selectedRoleIndex == 1 ? RuvexiTheme.border : Colors.transparent,
                              ),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.badge_outlined,
                                  size: 16,
                                  color: _selectedRoleIndex == 1 ? RuvexiTheme.primaryAccent : RuvexiTheme.textMuted,
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  "Staff / Stylist",
                                  style: TextStyle(
                                    color: _selectedRoleIndex == 1 ? Colors.white : RuvexiTheme.textMuted,
                                    fontSize: 13,
                                    fontWeight: _selectedRoleIndex == 1 ? FontWeight.bold : FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 28),

                // ==================== OWNER FLOW: EMAIL OTP ====================
                if (_selectedRoleIndex == 0) ...[
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: RuvexiTheme.card,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: RuvexiTheme.border),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.shield_outlined, color: RuvexiTheme.primaryAccent, size: 20),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            _ownerOtpSent
                                ? "Enter the one-time authentication code sent to ${_ownerEmailCtrl.text}"
                                : "Passwordless Owner Authentication via secure Email OTP.",
                            style: const TextStyle(color: RuvexiTheme.textMuted, fontSize: 12, height: 1.35),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Owner Email Field
                  TextField(
                    controller: _ownerEmailCtrl,
                    enabled: !_ownerOtpSent,
                    style: const TextStyle(color: Colors.white, fontSize: 14),
                    decoration: InputDecoration(
                      labelText: "Owner Registered Email",
                      labelStyle: const TextStyle(color: RuvexiTheme.textMuted, fontSize: 13),
                      prefixIcon: const Icon(Icons.mail_outline, color: RuvexiTheme.textMuted, size: 20),
                      filled: true,
                      fillColor: RuvexiTheme.surface,
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: RuvexiTheme.border)),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: RuvexiTheme.primaryAccent, width: 1.5)),
                      disabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: RuvexiTheme.border)),
                    ),
                  ),

                  // OTP Field (Shows after clicking Send OTP)
                  if (_ownerOtpSent) ...[
                    const SizedBox(height: 16),
                    TextField(
                      controller: _otpCtrl,
                      keyboardType: TextInputType.number,
                      maxLength: 6,
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: Colors.white, fontSize: 20, letterSpacing: 10, fontWeight: FontWeight.bold),
                      decoration: InputDecoration(
                        labelText: "Enter 6-Digit Email OTP",
                        labelStyle: const TextStyle(color: RuvexiTheme.textMuted, fontSize: 13, letterSpacing: 0),
                        counterText: "",
                        filled: true,
                        fillColor: RuvexiTheme.surface,
                        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: RuvexiTheme.primaryAccent)),
                        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: RuvexiTheme.primaryAccent, width: 2)),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () => setState(() => _ownerOtpSent = false),
                        child: const Text("Change Email Address", style: TextStyle(color: RuvexiTheme.goldAccent, fontSize: 12)),
                      ),
                    ),
                  ],

                  const SizedBox(height: 24),
                  SizedBox(
                    height: 50,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: RuvexiTheme.primaryAccent,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        elevation: 2,
                      ),
                      onPressed: _isLoading ? null : _handleOwnerAction,
                      child: _isLoading
                          ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black))
                          : Text(
                              _ownerOtpSent ? "Verify OTP & Enter Console" : "Dispatch Login OTP",
                              style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 14),
                            ),
                    ),
                  ),
                ],

                // ==================== STAFF FLOW: EMAIL + PASSWORD ====================
                if (_selectedRoleIndex == 1) ...[
                  // Staff Email
                  TextField(
                    controller: _staffEmailCtrl,
                    style: const TextStyle(color: Colors.white, fontSize: 14),
                    decoration: InputDecoration(
                      labelText: "Staff Email",
                      labelStyle: const TextStyle(color: RuvexiTheme.textMuted, fontSize: 13),
                      prefixIcon: const Icon(Icons.mail_outline, color: RuvexiTheme.textMuted, size: 20),
                      filled: true,
                      fillColor: RuvexiTheme.surface,
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: RuvexiTheme.border)),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: RuvexiTheme.primaryAccent, width: 1.5)),
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Staff Password
                  TextField(
                    controller: _staffPasswordCtrl,
                    obscureText: _obscurePassword,
                    style: const TextStyle(color: Colors.white, fontSize: 14),
                    decoration: InputDecoration(
                      labelText: "Password",
                      labelStyle: const TextStyle(color: RuvexiTheme.textMuted, fontSize: 13),
                      prefixIcon: const Icon(Icons.lock_outline, color: RuvexiTheme.textMuted, size: 20),
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                          color: RuvexiTheme.textMuted,
                          size: 20,
                        ),
                        onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                      ),
                      filled: true,
                      fillColor: RuvexiTheme.surface,
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: RuvexiTheme.border)),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: RuvexiTheme.primaryAccent, width: 1.5)),
                    ),
                  ),

                  // Forgot Password Link -> Triggers OTP Reset Modal
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: _showStaffForgotPasswordDialog,
                      child: const Text(
                        "Forgot Password? (Reset via OTP)",
                        style: TextStyle(color: RuvexiTheme.goldAccent, fontSize: 12, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),

                  SizedBox(
                    height: 50,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: RuvexiTheme.primaryAccent,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        elevation: 2,
                      ),
                      onPressed: _isLoading ? null : _handleStaffLogin,
                      child: _isLoading
                          ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black))
                          : const Text(
                              "Sign In as Staff",
                              style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 14),
                            ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
