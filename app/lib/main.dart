import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/features/overview/screens/overview_screen.dart';
import 'package:ruvexi_mobile/features/appointments/screens/appointments_screen.dart';
import 'package:ruvexi_mobile/features/pos/screens/pos_screen.dart';
import 'package:ruvexi_mobile/features/crm/screens/customers_crm_screen.dart';
import 'package:ruvexi_mobile/features/more/screens/more_screen.dart';
import 'package:ruvexi_mobile/features/staff_portal/screens/staff_home_screen.dart';
import 'package:ruvexi_mobile/features/staff_portal/screens/staff_customers_screen.dart';
import 'package:ruvexi_mobile/features/staff_portal/screens/staff_billing_screen.dart';
import 'package:ruvexi_mobile/features/staff_portal/screens/staff_more_screen.dart';
import 'package:ruvexi_mobile/features/auth/screens/splash_screen.dart';

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
  int _currentNavIndex = 0;

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: widget.appState,
      builder: (context, _) {
        final isStaff = widget.appState.userRole == "Receptionist";

        if (isStaff) {
          final staffIndex = _currentNavIndex > 3 ? 0 : _currentNavIndex;
          final staffScreens = [
            StaffHomeScreen(
              appState: widget.appState,
              onNavigateToTab: (idx) {
                setState(() => _currentNavIndex = idx.clamp(0, 3));
              },
            ),
            StaffCustomersScreen(
              appState: widget.appState,
              showBackButton: false,
            ),
            StaffBillingScreen(
              appState: widget.appState,
              showBackButton: false,
            ),
            StaffMoreScreen(
              appState: widget.appState,
            ),
          ];

          return Scaffold(
            backgroundColor: const Color(0xFF060706),
            body: IndexedStack(
              index: staffIndex,
              children: staffScreens,
            ),
            bottomNavigationBar: _buildStaffBottomBar(staffIndex),
          );
        }

        // Owner Role Shell (5 tabs)
        final ownerIndex = _currentNavIndex > 4 ? 0 : _currentNavIndex;
        final ownerScreens = [
          OverviewDashboardScreen(
            appState: widget.appState,
            onNavigateToTab: (index) {
              setState(() {
                _currentNavIndex = (index <= 4) ? index : 4;
              });
            },
          ),
          AppointmentsCalendarScreen(appState: widget.appState),
          PosBillingScreen(appState: widget.appState),
          CustomersCrmScreen(appState: widget.appState),
          MoreScreen(appState: widget.appState),
        ];

        return Scaffold(
          backgroundColor: const Color(0xFF060706),
          body: IndexedStack(
            index: ownerIndex,
            children: ownerScreens,
          ),
          bottomNavigationBar: _buildOwnerBottomBar(ownerIndex),
        );
      },
    );
  }

  Widget _buildStaffBottomBar(int selectedIndex) {
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
            selectedIndex: selectedIndex,
            iconOutline: Icons.home_outlined,
            iconFilled: Icons.home_rounded,
            label: "Home",
          ),
          _buildNavItem(
            index: 1,
            selectedIndex: selectedIndex,
            iconOutline: Icons.people_outline_rounded,
            iconFilled: Icons.people_rounded,
            label: "Customers",
          ),
          _buildNavItem(
            index: 2,
            selectedIndex: selectedIndex,
            iconOutline: Icons.point_of_sale_outlined,
            iconFilled: Icons.point_of_sale_rounded,
            label: "Billing",
          ),
          _buildNavItem(
            index: 3,
            selectedIndex: selectedIndex,
            iconOutline: Icons.grid_view_rounded,
            iconFilled: Icons.grid_view_rounded,
            label: "More",
          ),
        ],
      ),
    );
  }

  Widget _buildOwnerBottomBar(int selectedIndex) {
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
            selectedIndex: selectedIndex,
            iconOutline: Icons.home_rounded,
            iconFilled: Icons.home_rounded,
            label: "Home",
          ),
          _buildNavItem(
            index: 1,
            selectedIndex: selectedIndex,
            iconOutline: Icons.calendar_month_outlined,
            iconFilled: Icons.calendar_month_rounded,
            label: "Appointments",
          ),
          _buildNavItem(
            index: 2,
            selectedIndex: selectedIndex,
            iconOutline: Icons.point_of_sale_outlined,
            iconFilled: Icons.point_of_sale_rounded,
            label: "POS",
          ),
          _buildNavItem(
            index: 3,
            selectedIndex: selectedIndex,
            iconOutline: Icons.people_outline_rounded,
            iconFilled: Icons.people_rounded,
            label: "Customers",
          ),
          _buildNavItem(
            index: 4,
            selectedIndex: selectedIndex,
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
    required int selectedIndex,
    required IconData iconOutline,
    required IconData iconFilled,
    required String label,
  }) {
    final isSelected = selectedIndex == index;

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
