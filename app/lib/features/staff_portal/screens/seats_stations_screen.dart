import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/shared/widgets/ruvexi_logo.dart';
import 'package:ruvexi_mobile/features/staff_portal/screens/in_salon_customer_details_screen.dart';
import 'package:ruvexi_mobile/features/staff_portal/screens/check_in_customer_screen.dart';

class SeatsStationsScreen extends StatelessWidget {
  final RuvexiAppState appState;
  final bool selectionMode;

  const SeatsStationsScreen({
    super.key,
    required this.appState,
    this.selectionMode = false,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF060706),
      body: SafeArea(
        child: ListenableBuilder(
          listenable: appState,
          builder: (context, _) {
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top bar
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

                // Back + Title
                Padding(
                  padding: const EdgeInsets.fromLTRB(8, 4, 20, 16),
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
                        onPressed: () => Navigator.pop(context),
                      ),
                      Text(
                        selectionMode ? "Select Seat / Station" : "Seats / Stations",
                        style: const TextStyle(color: Colors.white, fontSize: 19, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),

                // 2-Column Grid of Seats S-1 to S-6
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      children: [
                        Expanded(
                          child: GridView.builder(
                            itemCount: appState.seats.length,
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              crossAxisSpacing: 14,
                              mainAxisSpacing: 14,
                              childAspectRatio: 1.15,
                            ),
                            itemBuilder: (context, index) {
                              final seat = appState.seats[index];
                              final inUse = seat.isInUse;

                              return GestureDetector(
                                onTap: () {
                                  if (selectionMode) {
                                    if (inUse) {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(content: Text("${seat.id} is currently occupied by ${seat.currentClientName}")),
                                      );
                                    } else {
                                      Navigator.pop(context, seat.id);
                                    }
                                  } else {
                                    if (inUse && seat.currentClientId != null) {
                                      final clientIdx = appState.inSalonClients.indexWhere((c) => c.id == seat.currentClientId);
                                      if (clientIdx >= 0) {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (_) => InSalonCustomerDetailsScreen(
                                              appState: appState,
                                              client: appState.inSalonClients[clientIdx],
                                            ),
                                          ),
                                        );
                                      }
                                    } else {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (_) => CheckInCustomerScreen(
                                            appState: appState,
                                            preselectedSeatId: seat.id,
                                          ),
                                        ),
                                      );
                                    }
                                  }
                                },
                                child: Container(
                                  decoration: BoxDecoration(
                                    color: inUse ? const Color(0xFF0C2214) : const Color(0xFF101311),
                                    borderRadius: BorderRadius.circular(18),
                                    border: Border.all(
                                      color: inUse ? const Color(0xFF22C55E).withOpacity(0.55) : Colors.white.withOpacity(0.08),
                                      width: inUse ? 1.4 : 1,
                                    ),
                                  ),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        Icons.chair_alt_rounded,
                                        color: inUse ? const Color(0xFF22C55E) : Colors.white38,
                                        size: 30,
                                      ),
                                      const SizedBox(height: 10),
                                      Text(
                                        seat.id,
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 17,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        inUse ? "In Use" : "Available",
                                        style: TextStyle(
                                          color: inUse ? const Color(0xFF22C55E) : Colors.white54,
                                          fontSize: 12,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                      if (inUse && seat.currentClientName != null) ...[
                                        const SizedBox(height: 2),
                                        Text(
                                          seat.currentClientName!,
                                          style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 10.5),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ],
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        ),

                        // Legend Footer
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 20),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(color: Color(0xFF22C55E), shape: BoxShape.circle),
                              ),
                              const SizedBox(width: 6),
                              Text(
                                "In Use (${appState.seatsInUseCount})",
                                style: TextStyle(color: Colors.white.withOpacity(0.75), fontSize: 12.5, fontWeight: FontWeight.w500),
                              ),
                              const SizedBox(width: 24),
                              Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(color: Colors.white38, shape: BoxShape.circle),
                              ),
                              const SizedBox(width: 6),
                              Text(
                                "Available (${appState.seatsAvailableCount})",
                                style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 12.5, fontWeight: FontWeight.w500),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
