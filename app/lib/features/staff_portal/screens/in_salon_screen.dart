import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/shared/widgets/ruvexi_logo.dart';
import 'package:ruvexi_mobile/features/staff_portal/screens/check_in_customer_screen.dart';
import 'package:ruvexi_mobile/features/staff_portal/screens/in_salon_customer_details_screen.dart';
import 'package:ruvexi_mobile/features/staff_portal/screens/seats_stations_screen.dart';

class InSalonScreen extends StatefulWidget {
  final RuvexiAppState appState;
  final int initialTab; // 0: In Salon, 1: Waiting, 2: Completed

  const InSalonScreen({
    super.key,
    required this.appState,
    this.initialTab = 0,
  });

  @override
  State<InSalonScreen> createState() => _InSalonScreenState();
}

class _InSalonScreenState extends State<InSalonScreen> {
  late int _selectedTab;

  @override
  void initState() {
    super.initState();
    _selectedTab = widget.initialTab;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF060706),
      body: SafeArea(
        child: ListenableBuilder(
          listenable: widget.appState,
          builder: (context, _) {
            final inSalonCount = widget.appState.inSalonActiveCount;
            final waitingCount = widget.appState.waitingClientsCount;

            final filtered = widget.appState.inSalonClients.where((c) {
              if (_selectedTab == 0) return c.status == "In Salon";
              if (_selectedTab == 1) return c.status == "Waiting";
              return c.status == "Completed";
            }).toList();

            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Bar
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 12, 16, 4),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const RuvexiLogoWidget(fontSize: 16, showSubtitle: true),
                      IconButton(
                        icon: const Icon(Icons.notifications_outlined, color: Colors.white70, size: 22),
                        onPressed: () {},
                      ),
                    ],
                  ),
                ),

                // Back + Title + Seats Icon
                Padding(
                  padding: const EdgeInsets.fromLTRB(8, 4, 16, 12),
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
                        onPressed: () => Navigator.pop(context),
                      ),
                      const Text(
                        "In Salon",
                        style: TextStyle(color: Colors.white, fontSize: 19, fontWeight: FontWeight.bold),
                      ),
                      const Spacer(),
                      GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => SeatsStationsScreen(appState: widget.appState),
                            ),
                          );
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: const Color(0xFF101311),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFF22C55E).withOpacity(0.35)),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.chair_alt_outlined, color: Color(0xFF22C55E), size: 14),
                              SizedBox(width: 5),
                              Text("Seats", style: TextStyle(color: Color(0xFF22C55E), fontSize: 11.5, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Filter Tabs: In Salon, Waiting, Completed
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    children: [
                      _buildTab(0, "In Salon ($inSalonCount)"),
                      const SizedBox(width: 8),
                      _buildTab(1, "Waiting ($waitingCount)"),
                      const SizedBox(width: 8),
                      _buildTab(2, "Completed"),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Client Cards List
                Expanded(
                  child: filtered.isEmpty
                      ? Center(
                          child: Text(
                            "No customers in this queue",
                            style: TextStyle(color: Colors.white.withOpacity(0.45), fontSize: 14),
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.fromLTRB(20, 0, 20, 90),
                          itemCount: filtered.length,
                          itemBuilder: (context, index) {
                            final client = filtered[index];
                            return _buildInSalonCard(client);
                          },
                        ),
                ),
              ],
            );
          },
        ),
      ),
      bottomSheet: Container(
        color: const Color(0xFF060706),
        padding: const EdgeInsets.fromLTRB(20, 10, 20, 20),
        child: SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton.icon(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => CheckInCustomerScreen(appState: widget.appState),
                ),
              );
            },
            icon: const Icon(Icons.add, color: Colors.black, size: 20),
            label: const Text(
              "Check-in New Customer",
              style: TextStyle(color: Colors.black, fontSize: 15, fontWeight: FontWeight.bold),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF22C55E),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              elevation: 0,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTab(int index, String label) {
    final isSelected = _selectedTab == index;
    return GestureDetector(
      onTap: () => setState(() => _selectedTab = index),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF22C55E) : const Color(0xFF101311),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: isSelected ? Colors.transparent : Colors.white.withOpacity(0.08)),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.black : Colors.white70,
            fontSize: 12,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
          ),
        ),
      ),
    );
  }

  Widget _buildInSalonCard(InSalonClient client) {
    final initials = client.customerName.split(' ').map((n) => n.isNotEmpty ? n[0] : '').take(2).join();

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => InSalonCustomerDetailsScreen(
              appState: widget.appState,
              client: client,
            ),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
        decoration: BoxDecoration(
          color: const Color(0xFF101311),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withOpacity(0.08)),
        ),
        child: Row(
          children: [
            CircleAvatar(
              radius: 19,
              backgroundColor: const Color(0xFF2E2638),
              child: Text(
                initials,
                style: const TextStyle(color: Color(0xFFD8B4FE), fontWeight: FontWeight.bold, fontSize: 12),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    client.customerName,
                    style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    client.servicesSummary,
                    style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 11.5),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFF122C1A),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    client.seatId,
                    style: const TextStyle(color: Color(0xFF22C55E), fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Icon(Icons.access_time, color: Colors.white.withOpacity(0.45), size: 11),
                    const SizedBox(width: 3),
                    Text(
                      "${client.elapsedMinutes} min",
                      style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 10.5),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(width: 6),
            const Icon(Icons.chevron_right, color: Colors.white38, size: 18),
          ],
        ),
      ),
    );
  }
}
