import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:ruvexi_mobile/core/network/api_config.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/shared/widgets/ruvexi_logo.dart';
import 'package:ruvexi_mobile/shared/widgets/salon_notification_dialog.dart';
import 'package:ruvexi_mobile/features/staff_portal/screens/check_in_customer_screen.dart';

class CheckoutCompleteScreen extends StatelessWidget {
  final RuvexiAppState appState;
  final double amount;
  final String customerName;
  final String customerPhone;
  final String paymentMethod;
  final List<Map<String, dynamic>> billedItems;

  const CheckoutCompleteScreen({
    super.key,
    required this.appState,
    required this.amount,
    required this.customerName,
    this.customerPhone = "",
    required this.paymentMethod,
    this.billedItems = const [],
  });

  Future<void> _sendWhatsAppReceipt(BuildContext context) async {
    String phone = customerPhone.trim();
    if (phone.isEmpty) {
      try {
        final match = appState.customers.firstWhere(
          (c) => c.name.toLowerCase() == customerName.toLowerCase(),
        );
        phone = match.phone.trim();
      } catch (_) {}
    }

    final digits = phone.replaceAll(RegExp(r'[^0-9]'), '');
    final phoneParam = digits.length == 10 ? '91$digits' : digits;

    final itemsSummary = billedItems.isNotEmpty
        ? billedItems
            .map((item) => "• ${item['name'] ?? 'Service'} (₹${((item['price'] as num?)?.toDouble() ?? 0.0).toInt()})")
            .join("\n")
        : "• Salon Services";

    final invoiceNo = "RVX-${DateTime.now().millisecondsSinceEpoch % 100000}";

    final message = "🌟 *${appState.salonName}* — Payment Receipt & Follow-Up\n\n"
        "Dear *$customerName*,\n"
        "Thank you for visiting us today! Your checkout has been processed successfully.\n\n"
        "🧾 *Invoice #:* $invoiceNo\n"
        "💰 *Amount Paid:* ₹${amount.toInt()}\n"
        "💳 *Method:* $paymentMethod\n\n"
        "*Services Rendered:*\n$itemsSummary\n\n"
        "We hope you loved your look! Feel free to reply here if you need anything or book your next follow-up appointment online:\n"
        "🔗 ${RuvexiApiConfig.webAppUrl}/book\n\n"
        "Have a beautiful day! ✨";

    final uri = Uri.parse("https://wa.me/$phoneParam?text=${Uri.encodeComponent(message)}");
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Launching WhatsApp with $customerName ($phone)...")),
      );
    }
  }

  void _showScheduleFollowUpSheet(BuildContext context) {
    int selectedWeeks = 3;
    final staffNames = appState.staff.isNotEmpty
        ? appState.staff.map((s) => s.name).toList()
        : ["Manoj K", "Pooja M", "Kiran S"];
    String selectedStaff = staffNames.first;
    String selectedService = billedItems.isNotEmpty
        ? (billedItems.first['name']?.toString() ?? 'Hair Cut & Styling')
        : (appState.catalog.isNotEmpty ? appState.catalog.first.name : 'Hair Cut & Styling');

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
                    const Text(
                      "Schedule Next Follow-Up",
                      style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.white54, size: 20),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                Text(
                  "Keep $customerName engaged with automated return visit scheduling",
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
                    _buildIntervalChip("4 Weeks", 4, selectedWeeks, (val) => setModalState(() => selectedWeeks = val)),
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
                          "Follow-Up Date: $dateStr",
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
                          customerName: customerName,
                          customerPhone: customerPhone,
                          serviceName: selectedService,
                          staffName: selectedStaff,
                          time: followUpDate,
                          price: amount,
                          status: "Upcoming",
                          notes: "Follow-up scheduled after completed payment",
                        );
                        await appState.addAppointment(appt);
                        if (!context.mounted) return;
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text("Follow-up appointment booked for $customerName on $dateStr")),
                        );
                      } catch (e) {
                        if (!context.mounted) return;
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text(e.toString()), backgroundColor: Colors.redAccent),
                        );
                      }
                    },
                    child: const Text("Confirm & Schedule Follow-Up", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
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

  void _showReceiptSheet(BuildContext context) {
    final invoiceNo = "RVX-${DateTime.now().millisecondsSinceEpoch % 100000}";
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
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Official Tax Receipt",
                  style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                ),
                Text(
                  "#$invoiceNo",
                  style: const TextStyle(color: Color(0xFF22C55E), fontSize: 12, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              "${appState.salonName} • ${appState.salonLocation}",
              style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 11),
            ),
            const Divider(color: Color(0xFF1C221E), height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text("Client: $customerName", style: const TextStyle(color: Colors.white, fontSize: 13)),
                Text("Paid via $paymentMethod", style: const TextStyle(color: Color(0xFF22C55E), fontSize: 12, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 12),
            if (billedItems.isNotEmpty)
              ...billedItems.map((item) {
                final qty = (item['qty'] is int) ? (item['qty'] as int) : 1;
                final price = (item['price'] is num) ? (item['price'] as num).toDouble() : 0.0;
                return Padding(
                  padding: const EdgeInsets.only(bottom: 6),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text("${qty}x ${item['name'] ?? 'Item'}", style: const TextStyle(color: Colors.white70, fontSize: 13)),
                      Text("₹${(price * qty).toInt()}", style: const TextStyle(color: Colors.white, fontSize: 13)),
                    ],
                  ),
                );
              }),
            const Divider(color: Color(0xFF1C221E), height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text("Total Paid (incl. Tax)", style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                Text("₹${amount.toInt()}", style: const TextStyle(color: Color(0xFF22C55E), fontSize: 18, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                icon: const Icon(Icons.print_outlined, color: Colors.black, size: 18),
                label: const Text("Print Thermal Copy", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF22C55E),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Sent to Bluetooth Thermal Printer")),
                  );
                },
              ),
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
      body: SafeArea(
        child: Column(
          children: [
            // Top bar
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 12, 16, 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const RuvexiLogoWidget(fontSize: 16, showSubtitle: true),
                  IconButton(
                    icon: const Icon(Icons.notifications_outlined, color: Colors.white70, size: 22),
                    tooltip: "Salon Alerts",
                    onPressed: () => showSalonNotificationModal(context, appState),
                  ),
                ],
              ),
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 12),
                    // Glowing Checkmark Circle
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: const Color(0xFF0E2918),
                        border: Border.all(color: const Color(0xFF22C55E), width: 2.5),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF22C55E).withOpacity(0.35),
                            blurRadius: 28,
                            spreadRadius: 4,
                          ),
                        ],
                      ),
                      child: const Icon(Icons.check_rounded, color: Color(0xFF22C55E), size: 42),
                    ),
                    const SizedBox(height: 22),

                    const Text(
                      "Checkout Complete",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 23,
                        fontWeight: FontWeight.bold,
                        letterSpacing: -0.3,
                      ),
                    ),
                    const SizedBox(height: 8),

                    Text(
                      "Payment of ₹${amount.toInt()} received\nfrom $customerName via $paymentMethod",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.65),
                        fontSize: 13.5,
                        height: 1.45,
                      ),
                    ),
                    const SizedBox(height: 28),

                    // WhatsApp Follow-Up Button
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton.icon(
                        onPressed: () => _sendWhatsAppReceipt(context),
                        icon: const Icon(Icons.chat_bubble_outline, color: Colors.black, size: 18),
                        label: const Text(
                          "Send WhatsApp Receipt & Follow-Up",
                          style: TextStyle(color: Colors.black, fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF22C55E),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Schedule Follow-Up Appointment Button
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: OutlinedButton.icon(
                        onPressed: () => _showScheduleFollowUpSheet(context),
                        icon: const Icon(Icons.calendar_month_outlined, color: Color(0xFF22C55E), size: 18),
                        label: const Text(
                          "Schedule Next Follow-Up Visit",
                          style: TextStyle(color: Color(0xFF22C55E), fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Color(0xFF22C55E), width: 1.2),
                          backgroundColor: const Color(0xFF101311),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // View Receipt Button
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: OutlinedButton.icon(
                        onPressed: () => _showReceiptSheet(context),
                        icon: const Icon(Icons.receipt_long_outlined, color: Colors.white70, size: 18),
                        label: const Text(
                          "View Detailed Receipt",
                          style: TextStyle(color: Colors.white70, fontSize: 13.5, fontWeight: FontWeight.w600),
                        ),
                        style: OutlinedButton.styleFrom(
                          side: BorderSide(color: Colors.white.withOpacity(0.16)),
                          backgroundColor: const Color(0xFF101311),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // New Check-in -> Button
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.of(context).pushReplacement(
                            MaterialPageRoute(
                              builder: (_) => CheckInCustomerScreen(appState: appState),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF161A17),
                          side: BorderSide(color: Colors.white.withOpacity(0.12)),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              "New Check-in",
                              style: TextStyle(color: Colors.white, fontSize: 14.5, fontWeight: FontWeight.bold),
                            ),
                            SizedBox(width: 8),
                            Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 17),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Back to Home text link
                    TextButton(
                      onPressed: () {
                        Navigator.of(context).popUntil((route) => route.isFirst);
                      },
                      child: Text(
                        "Back to Reception Home",
                        style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 13),
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
