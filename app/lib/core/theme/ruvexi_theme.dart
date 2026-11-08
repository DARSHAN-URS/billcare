import 'package:flutter/material.dart';

class RuvexiTheme {
  // Brand Palette matching website
  static const Color background = Color(0xFF09090B); // #09090b
  static const Color surface = Color(0xFF141417);
  static const Color card = Color(0xFF18181B);
  static const Color border = Color(0xFF27272A);
  
  static const Color primary = Colors.white;
  static const Color primaryAccent = Color(0xFF22C55E); // Ruvexi green tick (#22c55e)
  static const Color goldAccent = Color(0xFFFACC15); // amber-400
  static const Color textMuted = Color(0xFFA1A1AA);
  static const Color textSecondary = Color(0xFF71717A);

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      primaryColor: primaryAccent,
      canvasColor: surface,
      cardColor: card,
      colorScheme: const ColorScheme.dark(
        primary: primaryAccent,
        secondary: goldAccent,
        surface: surface,
        background: background,
        onSurface: Colors.white,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: background,
        elevation: 0,
        centerTitle: false,
        iconTheme: IconThemeData(color: Colors.white),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Color(0xFF101014),
        selectedItemColor: primaryAccent,
        unselectedItemColor: Color(0xFF71717A),
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
    );
  }
}

