import 'package:flutter/material.dart';
import 'core/theme/ruvexi_theme.dart';
import 'core/state/ruvexi_state.dart';
import 'features/overview/screens/overview_screen.dart';
import 'features/front_desk/screens/front_desk_screen.dart';
import 'features/pos/screens/pos_screen.dart';
import 'features/appointments/screens/appointments_screen.dart';
import 'features/crm/screens/customers_crm_screen.dart';
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
      SettingsStaffScreen(appState: widget.appState),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
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
          BottomNavigationBarItem(
            icon: Icon(Icons.settings_outlined),
            activeIcon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}
