import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/shared/widgets/ruvexi_logo.dart';
import 'package:ruvexi_mobile/features/staff_portal/screens/check_in_customer_screen.dart';
import 'package:ruvexi_mobile/features/staff_portal/screens/in_salon_screen.dart';
import 'package:ruvexi_mobile/features/staff_portal/screens/seats_stations_screen.dart';
import 'package:ruvexi_mobile/features/appointments/screens/appointments_screen.dart';

class StaffHomeScreen extends StatelessWidget {
  final RuvexiAppState appState;
  final void Function(int navIndex)? onNavigateToTab;

  const StaffHomeScreen({
    super.key,
    required this.appState,
    this.onNavigateToTab,
  });

  void _showRoleSwitcher(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF101311),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(22),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Switch Workspace Role", style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 14),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.workspace_premium_rounded, color: Color(0xFFFACC15)),
              title: const Text("Owner Dashboard", style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
              subtitle: const Text("Full financials, analytics, staff & settings", style: TextStyle(color: Colors.white54, fontSize: 12)),
              trailing: appState.userRole == "Owner" ? const Icon(Icons.check_circle, color: Color(0xFF22C55E)) : null,
              onTap: () {
                Navigator.pop(ctx);
                appState.switchRole("Owner");
              },
            ),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.support_agent_rounded, color: Color(0xFF22C55E)),
              title: const Text("Receptionist / Staff Desk", style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
              subtitle: const Text("Check-in queue, seats, and rapid billing", style: TextStyle(color: Colors.white54, fontSize: 12)),
              trailing: appState.userRole == "Receptionist" ? const Icon(Icons.check_circle, color: Color(0xFF22C55E)) : null,
              onTap: () {
                Navigator.pop(ctx);
                appState.switchRole("Receptionist");
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF060706),
      body: Stack(
        children: [
          // Top right ambient glow
          Positioned(
            top: -40,
            right: -40,
            child: Container(
              width: 200,
              height: 200,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    const Color(0xFF22C55E).withOpacity(0.14),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),

          SafeArea(
            child: ListenableBuilder(
              listenable: appState,
              builder: (context, _) {
                final inSalonTotal = appState.inSalonActiveCount + appState.waitingClientsCount;

                return SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // 1. Top Bar
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const RuvexiLogoWidget(fontSize: 17, showSubtitle: true),
                          Stack(
                            clipBehavior: Clip.none,
                            children: [
                              GestureDetector(
                                onTap: () {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text("Floor updates: 4 seats occupied, 2 available")),
                                  );
                                },
                                child: Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF101311),
                                    shape: BoxShape.circle,
                                    border: Border.all(color: Colors.white.withOpacity(0.12)),
                                  ),
                                  child: const Icon(Icons.notifications_none_rounded, color: Colors.white, size: 20),
                                ),
                              ),
                              Positioned(
                                top: 2,
                                right: 3,
                                child: Container(
                                  width: 7.5,
                                  height: 7.5,
                                  decoration: const BoxDecoration(color: Color(0xFF22C55E), shape: BoxShape.circle),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 22),

                      // 2. Greeting Row + Receptionist Role Pill
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              CircleAvatar(
                                radius: 22,
                                backgroundColor: const Color(0xFF1B241E),
                                child: const Text(
                                  "A",
                                  style: TextStyle(color: Color(0xFF22C55E), fontWeight: FontWeight.bold, fontSize: 18),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "Good Evening,",
                                    style: TextStyle(color: Colors.white.withOpacity(0.65), fontSize: 12.5),
                                  ),
                                  const Row(
                                    children: [
                                      Text(
                                        "Anjali",
                                        style: TextStyle(color: Colors.white, fontSize: 21, fontWeight: FontWeight.bold),
                                      ),
                                      SizedBox(width: 6),
                                      Text("👋", style: TextStyle(fontSize: 17)),
                                    ],
                                  ),
                                ],
                              ),
                            ],
                          ),

                          // Receptionist Role Badge Pill
                          GestureDetector(
                            onTap: () => _showRoleSwitcher(context),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                              decoration: BoxDecoration(
                                color: const Color(0xFF111A14),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(color: const Color(0xFF22C55E).withOpacity(0.4)),
                              ),
                              child: const Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    "Receptionist",
                                    style: TextStyle(color: Color(0xFF22C55E), fontSize: 12, fontWeight: FontWeight.bold),
                                  ),
                                  SizedBox(width: 4),
                                  Icon(Icons.keyboard_arrow_down_rounded, size: 16, color: Color(0xFF22C55E)),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // 3. 2x2 Quick Navigation Grid
                      Row(
                        children: [
                          Expanded(
                            child: _buildActionGridTile(
                              icon: Icons.person_add_alt_1_outlined,
                              label: "Check-in\nCustomer",
                              isHighlighted: true,
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(builder: (_) => CheckInCustomerScreen(appState: appState)),
                                );
                              },
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildActionGridTile(
                              icon: Icons.calendar_month_outlined,
                              label: "Appointments",
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(builder: (_) => AppointmentsCalendarScreen(appState: appState)),
                                );
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: _buildActionGridTile(
                              icon: Icons.point_of_sale_outlined,
                              label: "Billing (POS)",
                              onTap: () => onNavigateToTab?.call(2),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildActionGridTile(
                              icon: Icons.people_outline_rounded,
                              label: "Customers",
                              onTap: () => onNavigateToTab?.call(1),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // 4. Today at Salon Card
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: const Color(0xFF101311),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: Colors.white.withOpacity(0.10)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "Today at Salon",
                              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              "Tue, 09 Nov 2026",
                              style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 11.5),
                            ),
                            const SizedBox(height: 16),

                            // 3 Metrics Row
                            Row(
                              children: [
                                Expanded(
                                  child: _buildStatSubCard(
                                    icon: Icons.people_outline_rounded,
                                    count: "$inSalonTotal",
                                    label: "In Salon",
                                    onTap: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(builder: (_) => InSalonScreen(appState: appState, initialTab: 0)),
                                      );
                                    },
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: _buildStatSubCard(
                                    icon: Icons.calendar_month_outlined,
                                    count: "${appState.appointments.length + 6}",
                                    label: "Scheduled",
                                    onTap: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(builder: (_) => AppointmentsCalendarScreen(appState: appState)),
                                      );
                                    },
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: _buildStatSubCard(
                                    icon: Icons.check_rounded,
                                    count: "${appState.staffCompletedCount}",
                                    label: "Completed",
                                    onTap: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(builder: (_) => InSalonScreen(appState: appState, initialTab: 2)),
                                      );
                                    },
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),

                      // 5. Quick Access to Seats / Stations & In Salon Floor
                      GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => SeatsStationsScreen(appState: appState)),
                          );
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          decoration: BoxDecoration(
                            color: const Color(0xFF101311),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.white.withOpacity(0.08)),
                          ),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF122C1A),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Icon(Icons.chair_alt_rounded, color: Color(0xFF22C55E), size: 18),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text("Seats / Stations Floor", style: TextStyle(color: Colors.white, fontSize: 13.5, fontWeight: FontWeight.bold)),
                                    const SizedBox(height: 2),
                                    Text(
                                      "${appState.seatsInUseCount} In Use • ${appState.seatsAvailableCount} Available",
                                      style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 11.5),
                                    ),
                                  ],
                                ),
                              ),
                              const Icon(Icons.chevron_right, color: Colors.white38, size: 18),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),

                      GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => InSalonScreen(appState: appState)),
                          );
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          decoration: BoxDecoration(
                            color: const Color(0xFF101311),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.white.withOpacity(0.08)),
                          ),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF122C1A),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Icon(Icons.people_alt_outlined, color: Color(0xFF22C55E), size: 18),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text("In Salon Queue", style: TextStyle(color: Colors.white, fontSize: 13.5, fontWeight: FontWeight.bold)),
                                    const SizedBox(height: 2),
                                    Text(
                                      "${appState.inSalonActiveCount} Active • ${appState.waitingClientsCount} Waiting",
                                      style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 11.5),
                                    ),
                                  ],
                                ),
                              ),
                              const Icon(Icons.chevron_right, color: Colors.white38, size: 18),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionGridTile({
    required IconData icon,
    required String label,
    bool isHighlighted = false,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 92,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        decoration: BoxDecoration(
          color: isHighlighted ? const Color(0xFF0E1D13) : const Color(0xFF101311),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isHighlighted ? const Color(0xFF22C55E) : Colors.white.withOpacity(0.10),
            width: isHighlighted ? 1.5 : 1.0,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: const Color(0xFF22C55E), size: 24),
            const SizedBox(height: 8),
            Text(
              label,
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.white, fontSize: 12.5, fontWeight: FontWeight.w600, height: 1.2),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatSubCard({
    required IconData icon,
    required String count,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
        decoration: BoxDecoration(
          color: const Color(0xFF141815),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.white.withOpacity(0.08)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: const Color(0xFF22C55E), size: 17),
                const SizedBox(width: 6),
                Text(count, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 11),
            ),
          ],
        ),
      ),
    );
  }
}

