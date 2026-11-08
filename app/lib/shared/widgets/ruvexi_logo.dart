import 'package:flutter/material.dart';

class RuvexiLogoWidget extends StatelessWidget {
  final double fontSize;
  final bool showSubtitle;

  const RuvexiLogoWidget({
    super.key,
    this.fontSize = 22,
    this.showSubtitle = true,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.baseline,
          textBaseline: TextBaseline.alphabetic,
          children: [
            Text(
              'RUVEX',
              style: TextStyle(
                color: Colors.white,
                fontSize: fontSize,
                fontWeight: FontWeight.w800,
                letterSpacing: 3.5,
              ),
            ),
            Stack(
              clipBehavior: Clip.none,
              alignment: Alignment.center,
              children: [
                Positioned(
                  top: -(fontSize * 0.35),
                  child: CustomPaint(
                    size: Size(fontSize * 0.28, fontSize * 0.4),
                    painter: _GreenAccentPainter(),
                  ),
                ),
                Text(
                  'I',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: fontSize,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 3.5,
                  ),
                ),
              ],
            ),
          ],
        ),
        if (showSubtitle) ...[
          const SizedBox(height: 2),
          Text(
            'SOLUTIONS',
            style: TextStyle(
              color: Colors.white.withOpacity(0.65),
              fontSize: fontSize * 0.38,
              fontWeight: FontWeight.w400,
              letterSpacing: 5.5,
            ),
          ),
        ],
      ],
    );
  }
}

class _GreenAccentPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF22C55E)
      ..strokeWidth = 2.4
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    // Acute accent stroke pointing up-right
    canvas.drawLine(
      Offset(1, size.height - 1),
      Offset(size.width - 1, 1),
      paint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

