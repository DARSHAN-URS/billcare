import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';

class PaymentScreen extends StatefulWidget {
  final RuvexiAppState appState;
  final double amount;
  final String customerName;

  const PaymentScreen({
    super.key,
    required this.appState,
    required this.amount,
    this.customerName = "Priya Sharma",
  });

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  int _selectedMethodIndex = 0; // 0: UPI, 1: Card, 2: Cash, 3: Other

  final List<Map<String, dynamic>> _methods = [
    {
      "title": "UPI",
      "subtitle": "Google Pay, PhonePe, Paytm QR",
      "icon": Icons.qr_code_2_rounded,
      "tag": "UPI",
    },
    {
      "title": "Card",
      "subtitle": "Credit / Debit Card (Visa, RuPay, MC)",
      "icon": Icons.credit_card_rounded,
      "tag": "CARD",
    },
    {
      "title": "Cash",
      "subtitle": "Direct physical counter currency",
      "icon": Icons.payments_outlined,
      "tag": "CASH",
    },
    {
      "title": "Other",
      "subtitle": "Split / Store Credit / Cheque",
      "icon": Icons.swap_horiz_rounded,
      "tag": "OTHER",
    },
  ];

  void _collectPayment() {
    final methodTag = _methods[_selectedMethodIndex]["tag"] as String;
    widget.appState.completePayment(method: methodTag, amount: widget.amount);

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF101311),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: Color(0xFF22C55E), width: 1),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF122C1A),
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFF22C55E).withOpacity(0.4)),
              ),
              child: const Icon(Icons.check_rounded, color: Color(0xFF22C55E), size: 36),
            ),
            const SizedBox(height: 18),
            const Text(
              "Payment Received",
              style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 6),
            Text(
              "₹${widget.amount.toInt()} collected via $methodTag",
              style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 13),
            ),
            const SizedBox(height: 4),
            Text(
              "Invoice #RVX-${DateTime.now().millisecondsSinceEpoch % 100000}",
              style: const TextStyle(color: Color(0xFF22C55E), fontSize: 12, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.print_outlined, size: 16, color: Colors.white),
                    label: const Text("Receipt", style: TextStyle(color: Colors.white, fontSize: 13)),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: Colors.white.withOpacity(0.2)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    onPressed: () {
                      Navigator.pop(ctx);
                      Navigator.pop(context); // back to pos/home
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("Receipt printed & sent to WhatsApp")),
                      );
                    },
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF22C55E),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    onPressed: () {
                      Navigator.pop(ctx);
                      Navigator.pop(context);
                    },
                    child: const Text("Done", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            )
          ],
        ),
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
          "Payment",
          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Amount to Pay Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF101311),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF122C1A),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.receipt_long_rounded, color: Color(0xFF22C55E), size: 24),
                  ),
                  const SizedBox(width: 16),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Amount to Pay",
                        style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        "₹${widget.amount.toInt()}",
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Select Payment Method Header
            const Text(
              "Select Payment Method",
              style: TextStyle(
                color: Colors.white,
                fontSize: 15,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 14),

            // Options
            ...List.generate(_methods.length, (index) {
              final item = _methods[index];
              final isSelected = _selectedMethodIndex == index;

              return GestureDetector(
                onTap: () => setState(() => _selectedMethodIndex = index),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF101311),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: isSelected ? const Color(0xFF22C55E) : Colors.white.withOpacity(0.08),
                      width: isSelected ? 1.5 : 1,
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(item["icon"] as IconData, color: isSelected ? const Color(0xFF22C55E) : Colors.white60, size: 22),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              item["title"] as String,
                              style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              item["subtitle"] as String,
                              style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 11),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        width: 20,
                        height: 20,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: isSelected ? const Color(0xFF22C55E) : Colors.white38,
                            width: 2,
                          ),
                          color: isSelected ? const Color(0xFF22C55E) : Colors.transparent,
                        ),
                        child: isSelected
                            ? const Icon(Icons.check, size: 12, color: Colors.black)
                            : null,
                      ),
                    ],
                  ),
                ),
              );
            }),

            const SizedBox(height: 36),

            // Collect Payment Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: _collectPayment,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF22C55E),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  elevation: 0,
                ),
                child: Text(
                  "Collect Payment ₹${widget.amount.toInt()}",
                  style: const TextStyle(color: Colors.black, fontSize: 15, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
