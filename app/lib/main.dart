import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/features/overview/screens/overview_screen.dart';
import 'package:ruvexi_mobile/features/appointments/screens/appointments_screen.dart';
import 'package:ruvexi_mobile/features/pos/screens/pos_screen.dart';
import 'package:ruvexi_mobile/features/crm/screens/customers_crm_screen.dart';
import 'package:ruvexi_mobile/features/more/screens/more_screen.dart';
import 'package:ruvexi_mobile/features/auth/screens/splash_screen.dart';
import 'package:ruvexi_mobile/features/auth/screens/login_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const RuvexiApp());
}

class RuvexiApp extends StatefulWidget {
  const RuvexiApp({super.key});

  @override
  State<RuvexiApp> createState() => _RuvexiAppState();
}

class _RuvexiAppState extends State<RuvexiApp> {
  final RuvexiAppState _appState = RuvexiAppState();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RUVEXI Solutions - Salon OS',
      debugShowCheckedModeBanner: false,
      theme: RuvexiTheme.darkTheme,
      home: SplashScreen(appState: _appState),
    );
  }
}

class MainShellScreen extends StatefulWidget {
  final RuvexiAppState appState;

  const MainShellScreen({super.key, required this.appState});

  @override
  State<MainShellScreen> createState() => _MainShellScreenState();
}

class _MainShellScreenState extends State<MainShellScreen> {
  // Navigation indices matching the custom bar:
  // 0: Home (Overview)
  // 1: Appointments
  // 2: POS
  // 3: Customers (CRM)
  // 4: More (Complete Access Grid)
  int _currentNavIndex = 0;

  @override
  Widget build(BuildContext context) {
    final screens = [
      OverviewDashboardScreen(
        appState: widget.appState,
        onNavigateToTab: (index) {
          setState(() {
            _currentNavIndex = (index <= 4) ? index : 4;
          });
        },
      ), // 0: Home
      AppointmentsCalendarScreen(appState: widget.appState), // 1: Appointments
      PosBillingScreen(appState: widget.appState), // 2: POS
      CustomersCrmScreen(appState: widget.appState), // 3: Customers
      MoreScreen(appState: widget.appState), // 4: More (Image 1 Screen 10)
    ];

    return Scaffold(
      backgroundColor: const Color(0xFF060706),
      body: IndexedStack(
        index: _currentNavIndex,
        children: screens,
      ),
      bottomNavigationBar: _buildPremiumFloatingBottomBar(),
    );
  }

  // Exact bottom navigation bar matching the user's reference image
  Widget _buildPremiumFloatingBottomBar() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF070908),
        border: Border(
          top: BorderSide(
            color: Colors.white.withValues(alpha: 0.10),
            width: 0.9,
          ),
        ),
      ),
      padding: const EdgeInsets.fromLTRB(10, 10, 10, 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(
            index: 0,
            iconOutline: Icons.home_rounded,
            iconFilled: Icons.home_rounded,
            label: "Home",
          ),
          _buildNavItem(
            index: 1,
            iconOutline: Icons.calendar_month_outlined,
            iconFilled: Icons.calendar_month_rounded,
            label: "Appointments",
          ),
          _buildNavItem(
            index: 2,
            iconOutline: Icons.point_of_sale_outlined,
            iconFilled: Icons.point_of_sale_rounded,
            label: "POS",
          ),
          _buildNavItem(
            index: 3,
            iconOutline: Icons.people_outline_rounded,
            iconFilled: Icons.people_rounded,
            label: "Customers",
          ),
          _buildNavItem(
            index: 4,
            iconOutline: Icons.grid_view_rounded,
            iconFilled: Icons.grid_view_rounded,
            label: "More",
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem({
    required int index,
    required IconData iconOutline,
    required IconData iconFilled,
    required String label,
  }) {
    final isSelected = _currentNavIndex == index;

    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: () {
        setState(() {
          _currentNavIndex = index;
        });
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            isSelected ? iconFilled : iconOutline,
            color: isSelected ? const Color(0xFF22C55E) : const Color(0xFFD4D4D8),
            size: 22,
          ),
          const SizedBox(height: 5),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
              color: isSelected ? const Color(0xFF22C55E) : const Color(0xFFA1A1AA),
              letterSpacing: 0.2,
            ),
          ),
        ],
      ),
    );
  }
}
