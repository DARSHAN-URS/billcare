import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/shared/widgets/ruvexi_logo.dart';
import 'package:ruvexi_mobile/shared/widgets/upi_qr_dialog.dart';
import 'package:ruvexi_mobile/shared/widgets/salon_notification_dialog.dart';
import 'package:ruvexi_mobile/features/staff_portal/screens/checkout_complete_screen.dart';

class StaffPaymentScreen extends StatefulWidget {
  final RuvexiAppState appState;
  final double totalAmount;
  final String customerName;
  final String customerPhone;
  final List<Map<String, dynamic>> billedItems;

  const StaffPaymentScreen({
    super.key,
    required this.appState,
    required this.totalAmount,
    required this.customerName,
    this.customerPhone = "",
    this.billedItems = const [],
  });

  @override
  State<StaffPaymentScreen> createState() => _StaffPaymentScreenState();
}

class _StaffPaymentScreenState extends State<StaffPaymentScreen> {
  int _selectedMethod = 0; // 0: UPI, 1: Card, 2: Cash, 3: Split Payment

  final List<Map<String, dynamic>> _methods = [
    {
      "title": "UPI",
      "subtitle": "",
      "icon": Icons.qr_code_2_rounded,
      "tag": "UPI",
    },
    {
      "title": "Card",
      "subtitle": "Credit / Debit Card",
      "icon": Icons.credit_card_rounded,
      "tag": "Card",
    },
    {
      "title": "Cash",
      "subtitle": "",
      "icon": Icons.payments_outlined,
      "tag": "Cash",
    },
    {
      "title": "Split Payment",
      "subtitle": "",
      "icon": Icons.call_split_rounded,
      "tag": "Split Payment",
    },
  ];

  Future<void> _completePayment() async {
    final tag = _methods[_selectedMethod]["tag"] as String;
    if (tag == "UPI") {
      final invNum = "RVX-${DateTime.now().millisecondsSinceEpoch % 100000}";
      showDialog(
        context: context,
        barrierDismissible: true,
        builder: (ctx) => UpiQrModalDialog(
          appState: widget.appState,
          amount: widget.totalAmount,
          customerName: widget.customerName,
          invoiceNumber: invNum,
          onPaymentConfirmed: () => _executeStaffCheckoutBackend("UPI"),
        ),
      );
      return;
    }
    await _executeStaffCheckoutBackend(tag);
  }

  Future<void> _executeStaffCheckoutBackend(String tag) async {
    try {
      await widget.appState.completeStaffCheckout(method: tag, amount: widget.totalAmount);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString()), backgroundColor: Colors.redAccent),
      );
      return;
    }
    if (!mounted) return;

    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(
        builder: (_) => CheckoutCompleteScreen(
          appState: widget.appState,
          amount: widget.totalAmount,
          customerName: widget.customerName,
          customerPhone: widget.customerPhone,
          paymentMethod: tag,
          billedItems: widget.billedItems,
        ),
      ),
      (route) => route.isFirst,
    );
  }

  @override
  Widget build(BuildContext context) {
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
                    "Payment",
                    style: TextStyle(color: Colors.white, fontSize: 19, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Total Amount Card
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(18),
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
                            child: const Icon(Icons.account_balance_wallet_outlined, color: Color(0xFF22C55E), size: 22),
                          ),
                          const SizedBox(width: 16),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Total Amount",
                                style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                "₹${widget.totalAmount.toInt()}",
                                style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    const Text(
                      "Select Payment Method",
                      style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 14),

                    // Methods List
                    ...List.generate(_methods.length, (idx) {
                      final m = _methods[idx];
                      final isSelected = _selectedMethod == idx;
                      final subtitle = m["subtitle"] as String;

                      return GestureDetector(
                        onTap: () => setState(() => _selectedMethod = idx),
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
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
                              Icon(
                                m["icon"] as IconData,
                                color: isSelected ? const Color(0xFF22C55E) : Colors.white60,
                                size: 22,
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      m["title"] as String,
                                      style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                                    ),
                                    if (subtitle.isNotEmpty) ...[
                                      const SizedBox(height: 2),
                                      Text(
                                        subtitle,
                                        style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 11),
                                      ),
                                    ],
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
                                ),
                                child: isSelected
                                    ? Center(
                                        child: Container(
                                          width: 10,
                                          height: 10,
                                          decoration: const BoxDecoration(
                                            shape: BoxShape.circle,
                                            color: Color(0xFF22C55E),
                                          ),
                                        ),
                                      )
                                    : null,
                              ),
                            ],
                          ),
                        ),
                      );
                    }),

                    const SizedBox(height: 28),

                    // Complete Payment Button
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: _completePayment,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF22C55E),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              _selectedMethod == 0
                                  ? "Show UPI QR Code (₹${widget.totalAmount.toStringAsFixed(0)})"
                                  : "Complete Payment",
                              style: const TextStyle(color: Colors.black, fontSize: 15, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(width: 8),
                            Icon(_selectedMethod == 0 ? Icons.qr_code_rounded : Icons.check_rounded, color: Colors.black, size: 18),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 30),
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

