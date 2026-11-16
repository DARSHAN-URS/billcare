import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';
import 'package:ruvexi_mobile/shared/widgets/customer_avatar.dart';
import 'package:ruvexi_mobile/features/staff_portal/screens/check_in_customer_screen.dart';
import 'package:url_launcher/url_launcher.dart';

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

  void _showScheduleFollowUpSheet() {
    int selectedWeeks = 3;
    final catalog = widget.appState.catalog;
    final serviceNames = catalog.isNotEmpty ? catalog.map((s) => s.name).toList() : ["Hair Cut & Styling"];
    String selectedService = serviceNames.first;

    final staffList = widget.appState.staff;
    final staffNames = staffList.isNotEmpty ? staffList.map((s) => s.name).toList() : ["Manoj K", "Pooja M"];
    String selectedStaff = staffNames.first;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF101311),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) {
          final followUpDate = DateTime.now().add(Duration(days: selectedWeeks * 7));
          final dateStr = DateFormat("EEE, dd MMM yyyy").format(followUpDate);

          return Padding(
            padding: EdgeInsets.only(
              left: 22,
              right: 22,
              top: 22,
              bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "Schedule Visit: ${_customer.name}",
                      style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.white54, size: 20),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                Text(
                  "Set up customer return appointment and reminder",
                  style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 12),
                ),
                const SizedBox(height: 16),
                const Text(
                  "Recommended Interval",
                  style: TextStyle(color: Color(0xFF22C55E), fontSize: 12, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    _buildIntervalChip("2 Weeks", 2, selectedWeeks, (val) => setModalState(() => selectedWeeks = val)),
                    const SizedBox(width: 8),
                    _buildIntervalChip("3 Weeks", 3, selectedWeeks, (val) => setModalState(() => selectedWeeks = val)),
                    const SizedBox(width: 8),
                    _buildIntervalChip("4 Weeks (1 Mo)", 4, selectedWeeks, (val) => setModalState(() => selectedWeeks = val)),
                  ],
                ),
                const SizedBox(height: 14),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF141815),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF22C55E).withOpacity(0.3)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.calendar_today_rounded, color: Color(0xFF22C55E), size: 18),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          "Target Date: $dateStr",
                          style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF22C55E),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () async {
                      Navigator.pop(ctx);
                      try {
                        final appt = Appointment(
                          id: "appt_${DateTime.now().millisecondsSinceEpoch}",
                          customerName: _customer.name,
                          customerPhone: _customer.phone,
                          serviceName: selectedService,
                          staffName: selectedStaff,
                          time: followUpDate,
                          price: 499.0,
                          status: "Upcoming",
                          notes: "Follow-up visit booked via CRM",
                        );
                        await widget.appState.addAppointment(appt);
                        _showActionToast("Appointment booked for ${_customer.name} on $dateStr");
                      } catch (e) {
                        _showActionToast("Error booking: $e");
                      }
                    },
                    child: const Text("Confirm & Schedule Appointment", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildIntervalChip(String label, int weeks, int current, ValueChanged<int> onSelect) {
    final isSelected = current == weeks;
    return GestureDetector(
      onTap: () => onSelect(weeks),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF22C55E) : const Color(0xFF141815),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: isSelected ? const Color(0xFF22C55E) : Colors.white12),
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
      bottomNavigationBar: Container(
        color: const Color(0xFF060706),
        padding: const EdgeInsets.fromLTRB(20, 10, 20, 20),
        child: Row(
          children: [
            Expanded(
              child: SizedBox(
                height: 50,
                child: OutlinedButton.icon(
                  icon: const Icon(Icons.login_rounded, color: Color(0xFF22C55E), size: 18),
                  label: const Text(
                    "Check In",
                    style: TextStyle(color: Color(0xFF22C55E), fontSize: 14, fontWeight: FontWeight.bold),
                  ),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Color(0xFF22C55E), width: 1.2),
                    backgroundColor: const Color(0xFF101311),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => CheckInCustomerScreen(appState: widget.appState),
                      ),
                    );
                  },
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: SizedBox(
                height: 50,
                child: ElevatedButton.icon(
                  icon: const Icon(Icons.calendar_month_outlined, color: Colors.black, size: 18),
                  label: const Text(
                    "Schedule Visit",
                    style: TextStyle(color: Colors.black, fontSize: 14, fontWeight: FontWeight.bold),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF22C55E),
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  onPressed: _showScheduleFollowUpSheet,
                ),
              ),
            ),
          ],
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
                  CustomerAvatarWidget(
                    name: _customer.name,
                    radius: 40,
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
                _buildActionCircle(Icons.phone_outlined, "Call", () async {
                  final cleanNum = _customer.phone.replaceAll(RegExp(r'[^0-9+]'), '');
                  final uri = Uri.parse("tel:$cleanNum");
                  if (await canLaunchUrl(uri)) {
                    await launchUrl(uri);
                  } else {
                    _showActionToast("Dialing ${_customer.phone}...");
                  }
                }),
                const SizedBox(width: 24),
                _buildActionCircle(Icons.chat_bubble_outline, "WhatsApp", () async {
                  final digits = _customer.phone.replaceAll(RegExp(r'[^0-9]'), '');
                  final phoneParam = digits.length == 10 ? '91$digits' : digits;
                  final text = Uri.encodeComponent("Hello ${_customer.name}, from ${widget.appState.salonName}!");
                  final uri = Uri.parse("https://wa.me/$phoneParam?text=$text");
                  if (await canLaunchUrl(uri)) {
                    await launchUrl(uri, mode: LaunchMode.externalApplication);
                  } else {
                    _showActionToast("Launching WhatsApp with ${_customer.name}...");
                  }
                }),
                const SizedBox(width: 24),
                _buildActionCircle(Icons.mail_outline, "Message", () async {
                  final cleanNum = _customer.phone.replaceAll(RegExp(r'[^0-9+]'), '');
                  final uri = Uri.parse("sms:$cleanNum");
                  if (await canLaunchUrl(uri)) {
                    await launchUrl(uri);
                  } else {
                    _showActionToast("Sending SMS to ${_customer.phone}...");
                  }
                }),
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

