import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/features/overview/screens/overview_screen.dart';
import 'package:ruvexi_mobile/features/front_desk/screens/front_desk_screen.dart';
import 'package:ruvexi_mobile/features/pos/screens/pos_screen.dart';
import 'package:ruvexi_mobile/features/appointments/screens/appointments_screen.dart';
import 'package:ruvexi_mobile/features/crm/screens/customers_crm_screen.dart';
import 'package:ruvexi_mobile/features/inventory/screens/inventory_screen.dart';
import 'package:ruvexi_mobile/features/attendance/screens/attendance_staff_screen.dart';
import 'package:ruvexi_mobile/features/reports/screens/reports_analytics_screen.dart';
import 'package:ruvexi_mobile/features/booking/screens/public_booking_screen.dart';
import 'package:ruvexi_mobile/features/settings/screens/settings_staff_screen.dart';
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
  // 4: More (Floor/Stock/Attendance/Reports/Settings)
  int _currentNavIndex = 0;

  // Active screen to render in the body
  int _activeScreenIndex = 0;

  void _showMoreMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: RuvexiTheme.card,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        final isOwner = widget.appState.userRole == "Owner";

        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 22),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Salon Operations & Workspace",
                        style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        "Role: ${widget.appState.userRole}",
                        style: const TextStyle(color: RuvexiTheme.primaryAccent, fontSize: 12, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: RuvexiTheme.textMuted, size: 20),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              const Divider(color: RuvexiTheme.border),
              const SizedBox(height: 8),

              _buildMoreTile(ctx, Icons.chair_alt_outlined, "Front Desk & Walk-In Floor", 4),
              _buildMoreTile(ctx, Icons.inventory_2_outlined, "Stock & Inventory Control", 5),
              _buildMoreTile(ctx, Icons.badge_outlined, "Staff Attendance & Payouts", 6),
              if (isOwner)
                _buildMoreTile(ctx, Icons.bar_chart_rounded, "Financial Analytics & Tax Ledgers", 7),
              _buildMoreTile(ctx, Icons.language, "Client Online Booking Portal", 8),
              if (isOwner)
                _buildMoreTile(ctx, Icons.settings_outlined, "Salon Atelier Settings", 9),

              const SizedBox(height: 8),
              const Divider(color: RuvexiTheme.border),
              const SizedBox(height: 4),

              // Sign Out tile
              ListTile(
                contentPadding: const EdgeInsets.symmetric(horizontal: 8),
                leading: const Icon(Icons.logout, color: Colors.redAccent, size: 20),
                title: const Text("Sign Out of Console", style: TextStyle(color: Colors.redAccent, fontSize: 13, fontWeight: FontWeight.bold)),
                onTap: () {
                  widget.appState.logout();
                  Navigator.pop(ctx);
                  Navigator.of(context).pushReplacement(
                    MaterialPageRoute(builder: (_) => LoginScreen(appState: widget.appState)),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildMoreTile(BuildContext ctx, IconData icon, String title, int screenIndex) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      leading: Icon(icon, color: Colors.white70, size: 20),
      title: Text(title, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500)),
      trailing: const Icon(Icons.arrow_forward_ios, size: 13, color: RuvexiTheme.textSecondary),
      onTap: () {
        Navigator.pop(ctx);
        setState(() {
          _activeScreenIndex = screenIndex;
          _currentNavIndex = 4;
        });
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      OverviewDashboardScreen(appState: widget.appState),        // 0: Home
      AppointmentsCalendarScreen(appState: widget.appState),     // 1: Appointments
      PosBillingScreen(appState: widget.appState),               // 2: POS
      CustomersCrmScreen(appState: widget.appState),             // 3: Customers
      FrontDeskScreen(appState: widget.appState),                // 4: Front Desk
      InventoryScreen(appState: widget.appState),                // 5: Inventory
      AttendanceStaffScreen(appState: widget.appState),          // 6: Attendance
      ReportsAnalyticsScreen(appState: widget.appState),         // 7: Reports
      PublicBookingScreen(appState: widget.appState),            // 8: Booking
      SettingsStaffScreen(appState: widget.appState),            // 9: Settings
    ];

    return Scaffold(
      backgroundColor: RuvexiTheme.background,
      body: IndexedStack(
        index: _activeScreenIndex,
        children: screens,
      ),
      bottomNavigationBar: _buildPremiumFloatingBottomBar(),
    );
  }

  // Exact bottom navigation bar matching the user's reference image
  Widget _buildPremiumFloatingBottomBar() {
    return Container(
      margin: const EdgeInsets.fromLTRB(14, 0, 14, 18),
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF09090B),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: const Color(0xFF27272A), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.7),
            blurRadius: 24,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(
            index: 0,
            screenIndex: 0,
            iconOutline: Icons.home_outlined,
            iconFilled: Icons.home_rounded,
            label: "Home",
          ),
          _buildNavItem(
            index: 1,
            screenIndex: 1,
            iconOutline: Icons.calendar_month_outlined,
            iconFilled: Icons.calendar_month_rounded,
            label: "Appointments",
          ),
          _buildNavItem(
            index: 2,
            screenIndex: 2,
            iconOutline: Icons.account_balance_wallet_outlined,
            iconFilled: Icons.account_balance_wallet_rounded,
            label: "POS",
          ),
          _buildNavItem(
            index: 3,
            screenIndex: 3,
            iconOutline: Icons.people_outline_rounded,
            iconFilled: Icons.people_rounded,
            label: "Customers",
          ),
          _buildMoreNavItem(),
        ],
      ),
    );
  }

  Widget _buildNavItem({
    required int index,
    required int screenIndex,
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
          _activeScreenIndex = screenIndex;
        });
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            isSelected ? iconFilled : iconOutline,
            color: isSelected ? RuvexiTheme.primaryAccent : const Color(0xFFD4D4D8),
            size: 22,
          ),
          const SizedBox(height: 5),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
              color: isSelected ? RuvexiTheme.primaryAccent : const Color(0xFFA1A1AA),
              letterSpacing: 0.2,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMoreNavItem() {
    final isSelected = _currentNavIndex == 4;

    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: () => _showMoreMenu(context),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.more_horiz_rounded,
            color: isSelected ? RuvexiTheme.primaryAccent : const Color(0xFFD4D4D8),
            size: 22,
          ),
          const SizedBox(height: 5),
          Text(
            "More",
            style: TextStyle(
              fontSize: 11,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
              color: isSelected ? RuvexiTheme.primaryAccent : const Color(0xFFA1A1AA),
              letterSpacing: 0.2,
            ),
          ),
        ],
      ),
    );
  }
}
