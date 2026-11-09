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
  final _emailCtrl = TextEditingController(text: "owner@ruvexi.com");
  final _passwordCtrl = TextEditingController(text: "••••••••");
  bool _isLoading = false;
  bool _isGoogleLoading = false;
  bool _obscurePassword = true;

  Future<void> _handleGoogleSignIn() async {
    setState(() => _isGoogleLoading = true);
    
    // Simulate Google OAuth flow
    await Future.delayed(const Duration(milliseconds: 1200));
    
    widget.appState.loginWithGoogle(
      userName: "Priya Varma",
      userEmail: "priya.owner@ruvexi.com",
    );

    if (!mounted) return;
    setState(() => _isGoogleLoading = false);
    
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => MainShellScreen(appState: widget.appState)),
    );
  }

  Future<void> _handleEmailLogin() async {
    if (_emailCtrl.text.isEmpty) return;
    setState(() => _isLoading = true);

    await Future.delayed(const Duration(milliseconds: 800));

    widget.appState.loginWithEmail(_emailCtrl.text);

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
                // Header Branding
                const Center(child: RuvexiLogoWidget(fontSize: 24, showSubtitle: true)),
                const SizedBox(height: 10),
                Center(
                  child: Text(
                    "Sign in to your salon workspace",
                    style: TextStyle(color: RuvexiTheme.textMuted, fontSize: 13),
                  ),
                ),
                const SizedBox(height: 36),

                // Sign In with Google Button
                SizedBox(
                  height: 52,
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      backgroundColor: RuvexiTheme.card,
                      side: const BorderSide(color: RuvexiTheme.border, width: 1.2),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      elevation: 0,
                    ),
                    onPressed: _isGoogleLoading ? null : _handleGoogleSignIn,
                    child: _isGoogleLoading
                        ? SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2, color: RuvexiTheme.primaryAccent),
                          )
                        : Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              _buildGoogleIcon(),
                              const SizedBox(width: 14),
                              const Text(
                                "Continue with Google",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  letterSpacing: 0.3,
                                ),
                              ),
                            ],
                          ),
                  ),
                ),

                const SizedBox(height: 24),
                // Divider OR
                Row(
                  children: [
                    const Expanded(child: Divider(color: RuvexiTheme.border)),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      child: Text("OR", style: TextStyle(color: RuvexiTheme.textSecondary, fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                    const Expanded(child: Divider(color: RuvexiTheme.border)),
                  ],
                ),
                const SizedBox(height: 24),

                // Email Input
                TextField(
                  controller: _emailCtrl,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: InputDecoration(
                    labelText: "Work Email",
                    labelStyle: TextStyle(color: RuvexiTheme.textMuted, fontSize: 13),
                    prefixIcon: Icon(Icons.mail_outline, color: RuvexiTheme.textMuted, size: 20),
                    filled: true,
                    fillColor: RuvexiTheme.surface,
                    contentPadding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: RuvexiTheme.border),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: RuvexiTheme.primaryAccent, width: 1.5),
                    ),
                  ),
                ),
                const SizedBox(height: 14),

                // Password Input
                TextField(
                  controller: _passwordCtrl,
                  obscureText: _obscurePassword,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: InputDecoration(
                    labelText: "Security Password",
                    labelStyle: TextStyle(color: RuvexiTheme.textMuted, fontSize: 13),
                    prefixIcon: Icon(Icons.lock_outline, color: RuvexiTheme.textMuted, size: 20),
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
                    contentPadding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: RuvexiTheme.border),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: RuvexiTheme.primaryAccent, width: 1.5),
                    ),
                  ),
                ),
                const SizedBox(height: 10),

                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(
                    onPressed: () {},
                    child: Text(
                      "Forgot credentials?",
                      style: TextStyle(color: RuvexiTheme.goldAccent, fontSize: 12, fontWeight: FontWeight.w600),
                    ),
                  ),
                ),
                const SizedBox(height: 14),

                // Primary Sign In Button
                SizedBox(
                  height: 50,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: RuvexiTheme.primaryAccent,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      elevation: 2,
                    ),
                    onPressed: _isLoading ? null : _handleEmailLogin,
                    child: _isLoading
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black),
                          )
                        : const Text(
                            "Sign In to Console",
                            style: TextStyle(
                              color: Colors.black,
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              letterSpacing: 0.3,
                            ),
                          ),
                  ),
                ),
                const SizedBox(height: 30),

                // Register Prompt
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text("Registering a new salon atelier?", style: TextStyle(color: RuvexiTheme.textMuted, fontSize: 12)),
                    TextButton(
                      onPressed: () {},
                      child: Text("Start 14-Day Trial", style: TextStyle(color: RuvexiTheme.primaryAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildGoogleIcon() {
    return SizedBox(
      width: 20,
      height: 20,
      child: CustomPaint(painter: _GoogleIconPainter()),
    );
  }
}

class _GoogleIconPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final double w = size.width;
    final double h = size.height;

    // 4-color Google G icon drawing
    const blueColor = Color(0xFF4285F4);
    const greenColor = Color(0xFF34A853);
    const yellowColor = Color(0xFFFBBC05);
    const redColor = Color(0xFFEA4335);

    final rect = Rect.fromLTWH(0, 0, w, h);

    // Blue horizontal bar
    final barPaint = Paint()..color = blueColor;
    canvas.drawRect(Rect.fromLTWH(w * 0.45, h * 0.42, w * 0.52, h * 0.2), barPaint);
    
    // Outer arc segments
    final strokePaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = w * 0.22
      ..strokeCap = StrokeCap.butt;

    strokePaint.color = blueColor;
    canvas.drawArc(rect.deflate(w * 0.11), -0.7, 1.2, false, strokePaint);

    strokePaint.color = greenColor;
    canvas.drawArc(rect.deflate(w * 0.11), 0.5, 1.6, false, strokePaint);

    strokePaint.color = yellowColor;
    canvas.drawArc(rect.deflate(w * 0.11), 2.1, 1.5, false, strokePaint);

    strokePaint.color = redColor;
    canvas.drawArc(rect.deflate(w * 0.11), 3.6, 1.6, false, strokePaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

