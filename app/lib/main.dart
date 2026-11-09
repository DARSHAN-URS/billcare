import 'package:flutter/material.dart';
import 'core/theme/ruvexi_theme.dart';
import 'core/state/ruvexi_state.dart';
import 'features/overview/screens/overview_screen.dart';
import 'features/front_desk/screens/front_desk_screen.dart';
import 'features/pos/screens/pos_screen.dart';
import 'features/appointments/screens/appointments_screen.dart';
import 'features/crm/screens/customers_crm_screen.dart';
import 'features/inventory/screens/inventory_screen.dart';
import 'features/attendance/screens/attendance_staff_screen.dart';
import 'features/reports/screens/reports_analytics_screen.dart';
import 'features/booking/screens/public_booking_screen.dart';
import 'features/settings/screens/settings_staff_screen.dart';

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
      home: MainShellScreen(appState: _appState),
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
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final screens = [
      OverviewDashboardScreen(appState: widget.appState),
      FrontDeskScreen(appState: widget.appState),
      PosBillingScreen(appState: widget.appState),
      AppointmentsCalendarScreen(appState: widget.appState),
      CustomersCrmScreen(appState: widget.appState),
      InventoryScreen(appState: widget.appState),
      AttendanceStaffScreen(appState: widget.appState),
      ReportsAnalyticsScreen(appState: widget.appState),
      PublicBookingScreen(appState: widget.appState),
      SettingsStaffScreen(appState: widget.appState),
    ];

    return Scaffold(
      drawer: Drawer(
        backgroundColor: RuvexiTheme.card,
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              decoration: const BoxDecoration(color: Color(0xFF101014)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  const Text("RUVEXI SOLUTIONS", style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 18, letterSpacing: 2)),
                  const SizedBox(height: 4),
                  Text(widget.appState.salonName, style: const TextStyle(color: RuvexiTheme.textMuted, fontSize: 13)),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: RuvexiTheme.primaryAccent.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      widget.appState.userRole,
                      style: const TextStyle(color: RuvexiTheme.primaryAccent, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  )
                ],
              ),
            ),
            _buildDrawerTile(Icons.dashboard_outlined, "Overview", 0),
            _buildDrawerTile(Icons.chair_alt_outlined, "Front Desk & Queue", 1),
            _buildDrawerTile(Icons.point_of_sale, "POS Checkout Register", 2),
            _buildDrawerTile(Icons.calendar_month_outlined, "Appointments & Calendar", 3),
            _buildDrawerTile(Icons.groups_outlined, "Client Formulas & CRM", 4),
            const Divider(color: RuvexiTheme.border),
            _buildDrawerTile(Icons.inventory_2_outlined, "Stock & Inventory", 5),
            _buildDrawerTile(Icons.badge_outlined, "Staff Attendance & Payouts", 6),
            _buildDrawerTile(Icons.bar_chart, "Reports & Analytics", 7),
            _buildDrawerTile(Icons.language, "Public Booking Portal", 8),
            _buildDrawerTile(Icons.settings_outlined, "Salon Settings", 9),
          ],
        ),
      ),
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex >= 5 ? 0 : _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed,
        selectedItemColor: RuvexiTheme.primaryAccent,
        unselectedItemColor: const Color(0xFF71717A),
        backgroundColor: const Color(0xFF101014),
        selectedFontSize: 11,
        unselectedFontSize: 11,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard_outlined),
            activeIcon: Icon(Icons.dashboard),
            label: 'Overview',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.chair_alt_outlined),
            activeIcon: Icon(Icons.chair_alt),
            label: 'Front Desk',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.point_of_sale),
            activeIcon: Icon(Icons.point_of_sale),
            label: 'POS Register',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_month_outlined),
            activeIcon: Icon(Icons.calendar_month),
            label: 'Calendar',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.groups_outlined),
            activeIcon: Icon(Icons.groups),
            label: 'Clients',
          ),
        ],
      ),
    );
  }

  Widget _buildDrawerTile(IconData icon, String title, int index) {
    final isSelected = _currentIndex == index;
    return ListTile(
      leading: Icon(icon, color: isSelected ? RuvexiTheme.primaryAccent : RuvexiTheme.textMuted, size: 20),
      title: Text(
        title,
        style: TextStyle(
          color: isSelected ? Colors.white : RuvexiTheme.textMuted,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          fontSize: 13,
        ),
      ),
      selected: isSelected,
      onTap: () {
        setState(() {
          _currentIndex = index;
        });
        Navigator.pop(context);
      },
    );
  }
}
