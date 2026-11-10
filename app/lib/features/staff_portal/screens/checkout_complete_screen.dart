import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/shared/widgets/ruvexi_logo.dart';
import 'package:ruvexi_mobile/features/staff_portal/screens/check_in_customer_screen.dart';

class CheckoutCompleteScreen extends StatelessWidget {
  final RuvexiAppState appState;
  final double amount;
  final String customerName;
  final String paymentMethod;
  final List<Map<String, dynamic>> billedItems;

  const CheckoutCompleteScreen({
    super.key,
    required this.appState,
    required this.amount,
    required this.customerName,
    required this.paymentMethod,
    this.billedItems = const [],
  });

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
              ...billedItems.map((item) => Padding(
                    padding: const EdgeInsets.only(bottom: 6),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text("${item['qty']}x ${item['name']}", style: const TextStyle(color: Colors.white70, fontSize: 13)),
                        Text("₹${((item['price'] as double) * (item['qty'] as int)).toInt()}",
                            style: const TextStyle(color: Colors.white, fontSize: 13)),
                      ],
                    ),
                  )),
            const Divider(color: Color(0xFF1C221E), height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text("Total Paid (incl. 18% GST)", style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
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
                    onPressed: () {},
                  ),
                ],
              ),
            ),

            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Glowing Checkmark Circle
                    Container(
                      width: 88,
                      height: 88,
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
                      child: const Icon(Icons.check_rounded, color: Color(0xFF22C55E), size: 46),
                    ),
                    const SizedBox(height: 28),

                    const Text(
                      "Checkout Complete",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        letterSpacing: -0.3,
                      ),
                    ),
                    const SizedBox(height: 10),

                    Text(
                      "Payment of ₹${amount.toInt()} received\nfrom $customerName",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.65),
                        fontSize: 14,
                        height: 1.45,
                      ),
                    ),
                    const SizedBox(height: 36),

                    // View Receipt Button
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: OutlinedButton.icon(
                        onPressed: () => _showReceiptSheet(context),
                        icon: const Icon(Icons.receipt_long_outlined, color: Colors.white, size: 18),
                        label: const Text(
                          "View Receipt",
                          style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600),
                        ),
                        style: OutlinedButton.styleFrom(
                          side: BorderSide(color: Colors.white.withOpacity(0.16)),
                          backgroundColor: const Color(0xFF101311),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Share Receipt Button
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: OutlinedButton.icon(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text("Digital receipt shared via WhatsApp to $customerName")),
                          );
                        },
                        icon: const Icon(Icons.share_outlined, color: Colors.white, size: 18),
                        label: const Text(
                          "Share Receipt",
                          style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600),
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
                      height: 52,
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.of(context).pushReplacement(
                            MaterialPageRoute(
                              builder: (_) => CheckInCustomerScreen(appState: appState),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF22C55E),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              "New Check-in",
                              style: TextStyle(color: Colors.black, fontSize: 15, fontWeight: FontWeight.bold),
                            ),
                            SizedBox(width: 8),
                            Icon(Icons.arrow_forward_rounded, color: Colors.black, size: 18),
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

