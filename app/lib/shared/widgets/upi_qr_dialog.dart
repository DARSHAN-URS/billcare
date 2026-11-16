import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';

class UpiQrModalDialog extends StatelessWidget {
  final RuvexiAppState appState;
  final double amount;
  final String customerName;
  final String invoiceNumber;
  final VoidCallback onPaymentConfirmed;

  const UpiQrModalDialog({
    super.key,
    required this.appState,
    required this.amount,
    required this.customerName,
    required this.invoiceNumber,
    required this.onPaymentConfirmed,
  });

  String get _upiId {
    if (appState.salonUpiId.isNotEmpty) return appState.salonUpiId;
    return "ruvexi.${appState.salonName.toLowerCase().replaceAll(RegExp(r'[^a-z0-9]'), '')}@upi";
  }

  String get _upiIntentUri {
    final cleanUpi = _upiId;
    final cleanName = Uri.encodeComponent(appState.salonName);
    final amt = amount.toStringAsFixed(2);
    final note = Uri.encodeComponent("Invoice $invoiceNumber");
    return "upi://pay?pa=$cleanUpi&pn=$cleanName&am=$amt&cu=INR&tn=$note";
  }

  String get _qrCodeImageUrl {
    final encodedData = Uri.encodeComponent(_upiIntentUri);
    return "https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=$encodedData";
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: Container(
        width: double.infinity,
        constraints: const BoxConstraints(maxWidth: 400),
        decoration: BoxDecoration(
          color: const Color(0xFF0C0E0D),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0xFF22C55E).withOpacity(0.4), width: 1.5),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF22C55E).withOpacity(0.15),
              blurRadius: 30,
              spreadRadius: 2,
            ),
            BoxShadow(
              color: Colors.black.withOpacity(0.9),
              blurRadius: 20,
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Top Salon Header with Dismiss Button
            Container(
              padding: const EdgeInsets.fromLTRB(20, 18, 14, 16),
              decoration: BoxDecoration(
                color: const Color(0xFF141715),
                borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
                border: Border(bottom: BorderSide(color: Colors.white.withOpacity(0.08))),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(7),
                    decoration: BoxDecoration(
                      color: const Color(0xFF22C55E).withOpacity(0.15),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.storefront_rounded, color: Color(0xFF22C55E), size: 18),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          appState.salonName.toUpperCase(),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.8,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 2),
                        Row(
                          children: [
                            Container(
                              width: 6,
                              height: 6,
                              decoration: const BoxDecoration(
                                color: Color(0xFF22C55E),
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 6),
                            const Text(
                              "Instant Counter UPI Settlement",
                              style: TextStyle(
                                color: Color(0xFF22C55E),
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded, color: Colors.white60, size: 20),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),

            Padding(
              padding: const EdgeInsets.fromLTRB(22, 18, 22, 22),
              child: Column(
                children: [
                  // Prominent Bill Amount
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF131A15),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFF22C55E).withOpacity(0.35)),
                    ),
                    child: Column(
                      children: [
                        Text(
                          "TOTAL PAYABLE AMOUNT",
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.6),
                            fontSize: 10,
                            letterSpacing: 1.5,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          "₹${amount.toStringAsFixed(0)}",
                          style: const TextStyle(
                            color: Color(0xFF22C55E),
                            fontSize: 32,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -0.5,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          "Client: $customerName • $invoiceNumber",
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.65),
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 18),

                  // Dynamic UPI QR Code with White Frame
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.6),
                          blurRadius: 16,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(
                        _qrCodeImageUrl,
                        width: 200,
                        height: 200,
                        fit: BoxFit.contain,
                        loadingBuilder: (context, child, loadingProgress) {
                          if (loadingProgress == null) return child;
                          return Container(
                            width: 200,
                            height: 200,
                            color: Colors.white,
                            child: const Center(
                              child: CircularProgressIndicator(
                                strokeWidth: 2.5,
                                color: Color(0xFF22C55E),
                              ),
                            ),
                          );
                        },
                        errorBuilder: (context, error, stackTrace) {
                          // Fallback styled visual QR placeholder
                          return Container(
                            width: 200,
                            height: 200,
                            color: Colors.white,
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.qr_code_2_rounded, size: 84, color: Colors.black),
                                const SizedBox(height: 8),
                                Text(
                                  _upiId,
                                  style: const TextStyle(
                                    color: Colors.black87,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ),
                  ),

                  const SizedBox(height: 14),

                  // UPI ID display and Copy Button
                  GestureDetector(
                    onTap: () {
                      Clipboard.setData(ClipboardData(text: _upiId));
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text("UPI ID copied: $_upiId"),
                          backgroundColor: const Color(0xFF141815),
                          behavior: SnackBarBehavior.floating,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                            side: const BorderSide(color: Color(0xFF22C55E)),
                          ),
                          duration: const Duration(seconds: 1),
                        ),
                      );
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF151816),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.white.withOpacity(0.1)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.alternate_email, color: Color(0xFF22C55E), size: 14),
                          const SizedBox(width: 8),
                          Flexible(
                            child: Text(
                              _upiId,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                fontFamily: 'monospace',
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const SizedBox(width: 8),
                          const Icon(Icons.copy_rounded, color: Colors.white54, size: 14),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 14),

                  // Supported Payment Apps
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _buildPaymentBadge("GPay"),
                      const SizedBox(width: 6),
                      _buildPaymentBadge("PhonePe"),
                      const SizedBox(width: 6),
                      _buildPaymentBadge("Paytm"),
                      const SizedBox(width: 6),
                      _buildPaymentBadge("BHIM"),
                    ],
                  ),

                  const SizedBox(height: 20),

                  // Confirm Payment Received Button
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF22C55E),
                        foregroundColor: Colors.black,
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      icon: const Icon(Icons.check_circle_rounded, size: 20, color: Colors.black),
                      label: const Text(
                        "Confirm Payment Received",
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.3,
                        ),
                      ),
                      onPressed: () {
                        Navigator.pop(context); // close QR dialog
                        onPaymentConfirmed();
                      },
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentBadge(String title) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: const Color(0xFF141715),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Text(
        title,
        style: TextStyle(
          color: Colors.white.withOpacity(0.6),
          fontSize: 10,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

