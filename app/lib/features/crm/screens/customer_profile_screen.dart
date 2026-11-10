import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';

class CustomerProfileScreen extends StatefulWidget {
  final RuvexiAppState appState;
  final Customer customer;

  const CustomerProfileScreen({
    super.key,
    required this.appState,
    required this.customer,
  });

  @override
  State<CustomerProfileScreen> createState() => _CustomerProfileScreenState();
}

class _CustomerProfileScreenState extends State<CustomerProfileScreen> {
  int _selectedTabIndex = 0; // 0: Overview, 1: Visits, 2: Packages, 3: Notes
  late Customer _customer;

  @override
  void initState() {
    super.initState();
    _customer = widget.customer;
  }

  void _showActionToast(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF141815),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
          side: const BorderSide(color: Color(0xFF22C55E)),
        ),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF060706),
      appBar: AppBar(
        backgroundColor: const Color(0xFF060706),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Customer Profile",
          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        child: Column(
          children: [
            // Avatar
            Center(
              child: Stack(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: const Color(0xFF312E81),
                    child: Text(
                      _customer.name.substring(0, 1),
                      style: const TextStyle(color: Color(0xFFA5B4FC), fontSize: 32, fontWeight: FontWeight.bold),
                    ),
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: const BoxDecoration(
                        color: Color(0xFF22C55E),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.check, size: 12, color: Colors.black),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Name & Phone
            Text(
              _customer.name,
              style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Text(
              _customer.phone,
              style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13),
            ),
            const SizedBox(height: 8),

            // Regular Badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF122C1A),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFF22C55E).withOpacity(0.3)),
              ),
              child: Text(
                _customer.tag,
                style: const TextStyle(color: Color(0xFF22C55E), fontSize: 11, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 20),

            // Action Buttons: Call, WhatsApp, Message
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildActionCircle(Icons.phone_outlined, "Call", () => _showActionToast("Dialing ${_customer.phone}...")),
                const SizedBox(width: 24),
                _buildActionCircle(Icons.chat_bubble_outline, "WhatsApp", () => _showActionToast("Launching WhatsApp with ${_customer.name}...")),
                const SizedBox(width: 24),
                _buildActionCircle(Icons.mail_outline, "Message", () => _showActionToast("Sending SMS to ${_customer.phone}...")),
              ],
            ),
            const SizedBox(height: 24),

            // Tab Bar: Overview, Visits, Packages, Notes
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: const Color(0xFF101311),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: Row(
                children: [
                  _buildTabSegment(0, "Overview"),
                  _buildTabSegment(1, "Visits"),
                  _buildTabSegment(2, "Packages"),
                  _buildTabSegment(3, "Notes"),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Tab Content
            if (_selectedTabIndex == 0) _buildOverviewTab(),
            if (_selectedTabIndex == 1) _buildVisitsTab(),
            if (_selectedTabIndex == 2) _buildPackagesTab(),
            if (_selectedTabIndex == 3) _buildNotesTab(),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCircle(IconData icon, String label, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF141815),
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white.withOpacity(0.1)),
            ),
            child: Icon(icon, color: Colors.white70, size: 18),
          ),
          const SizedBox(height: 6),
          Text(label, style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 11)),
        ],
      ),
    );
  }

  Widget _buildTabSegment(int index, String label) {
    final isSelected = _selectedTabIndex == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedTabIndex = index),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF22C55E) : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: TextStyle(
              color: isSelected ? Colors.black : Colors.white70,
              fontSize: 12,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildOverviewTab() {
    return Column(
      children: [
        // 2 Metric cards side by side
        Row(
          children: [
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF101311),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white.withOpacity(0.08)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.wallet_outlined, color: Color(0xFF22C55E), size: 20),
                    const SizedBox(height: 12),
                    Text(
                      "${_customer.visitsCount}",
                      style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      "Total Visits",
                      style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 12),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF101311),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white.withOpacity(0.08)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("₹", style: TextStyle(color: Color(0xFF22C55E), fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 12),
                    Text(
                      "₹${_customer.totalSpent.toInt()}",
                      style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      "Total Spend",
                      style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 12),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),

        // Loyalty Points Row
        _buildInfoRow(
          icon: Icons.card_giftcard_rounded,
          title: "Loyalty Points",
          value: "${_customer.loyaltyPoints} pts",
        ),
        const SizedBox(height: 10),

        // Membership Row
        _buildInfoRow(
          icon: Icons.verified_outlined,
          title: "Membership",
          value: _customer.membership,
          valueColor: const Color(0xFF22C55E),
        ),
      ],
    );
  }

  Widget _buildVisitsTab() {
    return Column(
      children: [
        _buildVisitTile("Tue 09 Nov 2026", "Hair Cut + Hair Spa", "Manoj K", "₹1,399"),
        _buildVisitTile("14 Oct 2026", "Precision Hair Cut & Styling", "Manoj K", "₹399"),
        _buildVisitTile("28 Sep 2026", "Hair Color & Gloss Treatment", "Pooja M", "₹2,499"),
      ],
    );
  }

  Widget _buildVisitTile(String date, String service, String stylist, String amount) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF101311),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(service, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                const SizedBox(height: 3),
                Text("$date • Stylist: $stylist", style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 11)),
              ],
            ),
          ),
          Text(amount, style: const TextStyle(color: Color(0xFF22C55E), fontSize: 14, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildPackagesTab() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF101311),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("Royal Grooming Series (2/4)", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
              Text("Active", style: TextStyle(color: Color(0xFF22C55E), fontSize: 11, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 6),
          Text("2 visits remaining out of 4 bundled services. Valid till 31 Dec 2026.", style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12)),
        ],
      ),
    );
  }

  Widget _buildNotesTab() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF101311),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text("Formulation & Preference Notes", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
              IconButton(
                icon: const Icon(Icons.edit_outlined, color: Color(0xFF22C55E), size: 18),
                onPressed: () => _showActionToast("Formula notes updated"),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            _customer.formulaNotes ?? "Client prefers mild organic products. Avoid heavy chemical developers.",
            style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 13, height: 1.4),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow({
    required IconData icon,
    required String title,
    required String value,
    Color? valueColor,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: const Color(0xFF101311),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFF22C55E), size: 20),
          const SizedBox(width: 14),
          Expanded(
            child: Text(
              title,
              style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w500),
            ),
          ),
          Text(
            value,
            style: TextStyle(
              color: valueColor ?? Colors.white,
              fontSize: 13,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(width: 6),
          const Icon(Icons.chevron_right, color: Colors.white38, size: 18),
        ],
      ),
    );
  }
}

