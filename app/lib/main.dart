import 'package:flutter/material.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const RuvexiApp());
}

class RuvexiApp extends StatelessWidget {
  const RuvexiApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RUVEXI Staff',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF2563EB), // RUVEXI Primary Blue
          primary: const Color(0xFF2563EB),
          secondary: const Color(0xFF8B5CF6), // Accent Purple
          surface: const Color(0xFFFFFFFF),
          background: const Color(0xFFF8FAFC),
        ),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
      ),
      home: const Scaffold(
        body: Center(
          child: Text(
            'RUVEXI Salon Management Staff App',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Color(0xFF0F172A), // Deep Navy
            ),
          ),
        ),
      ),
    );
  }
}
