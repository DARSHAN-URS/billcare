import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';
import 'package:ruvexi_mobile/shared/widgets/ruvexi_logo.dart';
import 'login_screen.dart';
import '../../../main.dart';

class SplashScreen extends StatefulWidget {
  final RuvexiAppState appState;

  const SplashScreen({super.key, required this.appState});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _animCtrl;
  late Animation<double> _fadeAnim;
  late Animation<double> _scaleAnim;

  @override
  void initState() {
    super.initState();
    _animCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    );

    _fadeAnim = CurvedAnimation(parent: _animCtrl, curve: Curves.easeIn);
    _scaleAnim = Tween<double>(begin: 0.88, end: 1.0).animate(
      CurvedAnimation(parent: _animCtrl, curve: Curves.easeOutCubic),
    );

    _animCtrl.forward();

    // Check auth status after splash presentation
    Future.delayed(const Duration(milliseconds: 2400), () {
      if (!mounted) return;
      if (widget.appState.isAuthenticated) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => MainShellScreen(appState: widget.appState)),
        );
      } else {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => LoginScreen(appState: widget.appState)),
        );
      }
    });
  }

  @override
  void dispose() {
    _animCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: RuvexiTheme.background,
      body: Center(
        child: FadeTransition(
          opacity: _fadeAnim,
          child: ScaleTransition(
            scale: _scaleAnim,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // R Monogram Badge
                Container(
                  width: 90,
                  height: 90,
                  decoration: BoxDecoration(
                    color: RuvexiTheme.card,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: RuvexiTheme.border, width: 1.5),
                    boxShadow: [
                      BoxShadow(
                        color: RuvexiTheme.primaryAccent.withOpacity(0.12),
                        blurRadius: 28,
                        spreadRadius: 4,
                      )
                    ],
                  ),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      const Text(
                        'R',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 48,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.5,
                        ),
                      ),
                      Positioned(
                        top: 18,
                        right: 22,
                        child: CustomPaint(
                          size: const Size(10, 16),
                          painter: _SplashAccentPainter(),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 28),
                const RuvexiLogoWidget(fontSize: 26, showSubtitle: true),
                const SizedBox(height: 38),
                SizedBox(
                  width: 22,
                  height: 22,
                  child: CircularProgressIndicator(
                    strokeWidth: 2.2,
                    valueColor: AlwaysStoppedAnimation<Color>(RuvexiTheme.primaryAccent),
                  ),
                ),
                const SizedBox(height: 14),
                Text(
                  "Sovereign Salon Operating System",
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.4),
                    fontSize: 11,
                    letterSpacing: 1.2,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _SplashAccentPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF22C55E)
      ..strokeWidth = 3.2
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    canvas.drawLine(
      Offset(1, size.height - 1),
      Offset(size.width - 1, 1),
      paint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

