import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/shared/widgets/ruvexi_logo.dart';
import 'package:ruvexi_mobile/shared/widgets/customer_avatar.dart';
import 'package:ruvexi_mobile/shared/widgets/salon_notification_dialog.dart';
import 'package:ruvexi_mobile/features/staff_portal/screens/staff_billing_screen.dart';

class InSalonCustomerDetailsScreen extends StatefulWidget {
  final RuvexiAppState appState;
  final InSalonClient client;

  const InSalonCustomerDetailsScreen({
    super.key,
    required this.appState,
    required this.client,
  });

  @override
  State<InSalonCustomerDetailsScreen> createState() => _InSalonCustomerDetailsScreenState();
}

class _InSalonCustomerDetailsScreenState extends State<InSalonCustomerDetailsScreen> {
  void _showUpdateSheet() {
    String selectedSeat = widget.client.seatId;
    String selectedStaff = widget.client.assignedStaff;
    final availableSeats = widget.appState.seats
        .where((s) => !s.isInUse || s.id == widget.client.seatId)
        .map((s) => s.id)
        .toList();
    if (!availableSeats.contains("Waiting")) availableSeats.add("Waiting");

    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF101311),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) => Padding(
          padding: const EdgeInsets.all(22),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text("Update In-Salon Assignment", style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              const Text("Seat / Station", style: TextStyle(color: Color(0xFF22C55E), fontSize: 12, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: availableSeats.map((s) {
                  final isSel = selectedSeat == s;
                  return ChoiceChip(
                    label: Text(s, style: TextStyle(color: isSel ? Colors.black : Colors.white, fontWeight: FontWeight.bold)),
                    selected: isSel,
                    selectedColor: const Color(0xFF22C55E),
                    backgroundColor: const Color(0xFF141815),
                    onSelected: (_) => setModalState(() => selectedSeat = s),
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),
              const Text("Assigned Staff", style: TextStyle(color: Color(0xFF22C55E), fontSize: 12, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: widget.appState.staff.map((st) {
                  final isSel = selectedStaff == st.name;
                  return ChoiceChip(
                    label: Text(st.name, style: TextStyle(color: isSel ? Colors.black : Colors.white, fontWeight: FontWeight.bold)),
                    selected: isSel,
                    selectedColor: const Color(0xFF22C55E),
                    backgroundColor: const Color(0xFF141815),
                    onSelected: (_) => setModalState(() => selectedStaff = st.name),
                  );
                }).toList(),
              ),
              const SizedBox(height: 22),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF22C55E)),
                  onPressed: () {
                    widget.appState.updateInSalonClient(
                      clientId: widget.client.id,
                      newSeatId: selectedSeat,
                      newStaff: selectedStaff,
                    );
                    Navigator.pop(ctx);
                    setState(() {});
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("Customer assignment updated")),
                    );
                  },
                  child: const Text("Save Assignment", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final client = widget.client;
    final initials = client.customerName.split(' ').map((n) => n.isNotEmpty ? n[0] : '').take(2).join();

    return Scaffold(
      backgroundColor: const Color(0xFF060706),
      body: SafeArea(
        child: Column(
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
                    tooltip: "Salon Alerts",
                    onPressed: () => showSalonNotificationModal(context, widget.appState),
                  ),
                ],
              ),
            ),

            // Back + Title
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 4, 20, 14),
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
                    onPressed: () => Navigator.pop(context),
                  ),
                  const Text(
                    "Customer Details",
                    style: TextStyle(color: Colors.white, fontSize: 19, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  children: [
                    // Customer Header Card
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFF101311),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.white.withOpacity(0.08)),
                      ),
                      child: Row(
                        children: [
                          CustomerAvatarWidget(
                            name: client.customerName,
                            radius: 26,
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  client.customerName,
                                  style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                                ),
                                const SizedBox(height: 3),
                                Text(
                                  client.phone,
                                  style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 12),
                                ),
                                const SizedBox(height: 6),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF122C1A),
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Text(
                                    client.status,
                                    style: const TextStyle(color: Color(0xFF22C55E), fontSize: 10.5, fontWeight: FontWeight.bold),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text("Dialing ${client.phone}...")),
                              );
                            },
                            icon: Container(
                              padding: const EdgeInsets.all(10),
                              decoration: const BoxDecoration(
                                color: Color(0xFF122C1A),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.phone_outlined, color: Color(0xFF22C55E), size: 20),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Details List Card
                    Container(
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        color: const Color(0xFF101311),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.white.withOpacity(0.08)),
                      ),
                      child: Column(
                        children: [
                          _buildDetailRow(Icons.content_cut_rounded, "Services", client.servicesSummary),
                          const Divider(color: Color(0xFF1C221E), height: 24),
                          _buildDetailRow(Icons.chair_alt_outlined, "Seat / Station", client.seatId),
                          const Divider(color: Color(0xFF1C221E), height: 24),
                          _buildDetailRow(Icons.person_outline_rounded, "Assigned Staff", client.assignedStaff),
                          const Divider(color: Color(0xFF1C221E), height: 24),
                          _buildDetailRow(
                            Icons.access_time_rounded,
                            "Check-in Time",
                            "${client.checkInTime} (${client.elapsedMinutes} min ago)",
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 36),

                    // Action Buttons Row: Update & Move to Billing
                    Row(
                      children: [
                        Expanded(
                          child: SizedBox(
                            height: 52,
                            child: OutlinedButton(
                              onPressed: _showUpdateSheet,
                              style: OutlinedButton.styleFrom(
                                side: BorderSide(color: Colors.white.withOpacity(0.18)),
                                backgroundColor: const Color(0xFF101311),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                              ),
                              child: const Text(
                                "Update",
                                style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: SizedBox(
                            height: 52,
                            child: ElevatedButton(
                              onPressed: () {
                                widget.appState.moveClientToBilling(client);
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => StaffBillingScreen(appState: widget.appState),
                                  ),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF22C55E),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                elevation: 0,
                              ),
                              child: const Text(
                                "Move to Billing",
                                style: TextStyle(color: Colors.black, fontSize: 15, fontWeight: FontWeight.bold),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, color: Colors.white54, size: 20),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 11)),
              const SizedBox(height: 3),
              Text(value, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600)),
            ],
          ),
        ),
      ],
    );
  }
}

