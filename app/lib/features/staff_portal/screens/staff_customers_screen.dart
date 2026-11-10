import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/shared/widgets/ruvexi_logo.dart';
import 'package:ruvexi_mobile/features/crm/screens/customer_profile_screen.dart';
import 'package:ruvexi_mobile/features/staff_portal/screens/check_in_customer_screen.dart';

class StaffCustomersScreen extends StatefulWidget {
  final RuvexiAppState appState;
  final bool showBackButton;
  final VoidCallback? onBack;

  const StaffCustomersScreen({
    super.key,
    required this.appState,
    this.showBackButton = false,
    this.onBack,
  });

  @override
  State<StaffCustomersScreen> createState() => _StaffCustomersScreenState();
}

class _StaffCustomersScreenState extends State<StaffCustomersScreen> {
  int _selectedFilter = 0; // 0: All (348), 1: In Salon, 2: Today
  String _query = "";
  final _searchCtrl = TextEditingController();

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF060706),
      body: SafeArea(
        child: ListenableBuilder(
          listenable: widget.appState,
          builder: (context, _) {
            final inSalonNames = widget.appState.inSalonClients
                .where((i) => i.status == "In Salon")
                .map((i) => i.customerName.toLowerCase())
                .toSet();

            final filtered = widget.appState.customers.where((c) {
              final matches = c.name.toLowerCase().contains(_query) || c.phone.contains(_query);
              if (!matches) return false;
              if (_selectedFilter == 1) return inSalonNames.contains(c.name.toLowerCase());
              return true;
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

                // Title row
                Padding(
                  padding: const EdgeInsets.fromLTRB(8, 4, 20, 10),
                  child: Row(
                    children: [
                      if (widget.showBackButton)
                        IconButton(
                          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
                          onPressed: () {
                            if (widget.onBack != null) {
                              widget.onBack!();
                            } else if (Navigator.canPop(context)) {
                              Navigator.pop(context);
                            }
                          },
                        )
                      else
                        const SizedBox(width: 12),
                      const Text(
                        "Customers",
                        style: TextStyle(color: Colors.white, fontSize: 19, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),

                // Search Bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
                  child: Container(
                    height: 44,
                    decoration: BoxDecoration(
                      color: const Color(0xFF101311),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.white.withOpacity(0.08)),
                    ),
                    child: TextField(
                      controller: _searchCtrl,
                      onChanged: (v) => setState(() => _query = v.toLowerCase()),
                      style: const TextStyle(color: Colors.white, fontSize: 13),
                      decoration: InputDecoration(
                        prefixIcon: const Icon(Icons.search, color: Colors.white38, size: 18),
                        hintText: "Search by name or phone",
                        hintStyle: TextStyle(color: Colors.white.withOpacity(0.35), fontSize: 13),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 10),

                // Filter Chips: All (348), In Salon (6), Today (12)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    children: [
                      _buildChip(0, "All (348)"),
                      const SizedBox(width: 8),
                      _buildChip(1, "In Salon (${widget.appState.inSalonActiveCount})"),
                      const SizedBox(width: 8),
                      _buildChip(2, "Today (12)"),
                    ],
                  ),
                ),
                const SizedBox(height: 14),

                // Customer list
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.fromLTRB(20, 0, 20, 80),
                    itemCount: filtered.length,
                    itemBuilder: (context, index) {
                      final customer = filtered[index];
                      final initials = customer.name.split(' ').map((n) => n.isNotEmpty ? n[0] : '').take(2).join();

                      return GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => CustomerProfileScreen(
                                appState: widget.appState,
                                customer: customer,
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
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(customer.name, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                                    const SizedBox(height: 2),
                                    Text(customer.phone, style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 12)),
                                  ],
                                ),
                              ),
                              const Icon(Icons.chevron_right, color: Colors.white38, size: 18),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: const Color(0xFF22C55E),
        elevation: 4,
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => CheckInCustomerScreen(appState: widget.appState)),
          );
        },
        child: const Icon(Icons.add, color: Colors.black, size: 28),
      ),
    );
  }

  Widget _buildChip(int index, String label) {
    final isSelected = _selectedFilter == index;
    return GestureDetector(
      onTap: () => setState(() => _selectedFilter = index),
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
}
