import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';

class SubscriptionScreen extends StatelessWidget {
  final RuvexiAppState appState;

  const SubscriptionScreen({super.key, required this.appState});

  void _manageSubscription(BuildContext context) {
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
            const Text(
              "Manage Salon Subscription",
              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              "Your next renewal of ₹2,999 will be auto-debited on 09 Dec 2026 via Primary UPI / Card mandate.",
              style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 13, height: 1.4),
            ),
            const SizedBox(height: 16),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.receipt_long, color: Color(0xFF22C55E)),
              title: const Text("Download Latest Tax Invoice", style: TextStyle(color: Colors.white, fontSize: 13)),
              trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.white38),
              onTap: () {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Invoice #RUX-SUB-9021 sent to registered email")),
                );
              },
            ),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.upgrade, color: Color(0xFFFACC15)),
              title: const Text("Upgrade to Multi-Outlet Enterprise", style: TextStyle(color: Colors.white, fontSize: 13)),
              trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.white38),
              onTap: () {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Enterprise Tier Concierge will contact you shortly")),
                );
              },
            ),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.pause_circle_outline, color: Colors.redAccent),
              title: const Text("Pause or Cancel Auto-Debit Mandate", style: TextStyle(color: Colors.redAccent, fontSize: 13)),
              trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.white38),
              onTap: () {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Plan cancellation request logged")),
                );
              },
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
      appBar: AppBar(
        backgroundColor: const Color(0xFF060706),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Subscription",
          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Plan Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF101311),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: const Color(0xFF2E2408),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFFACC15).withOpacity(0.3)),
                        ),
                        child: const Icon(Icons.workspace_premium_rounded, color: Color(0xFFFACC15), size: 24),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "Professional Plan",
                              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              "All features for growing salons",
                              style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF122C1A),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          "Active",
                          style: TextStyle(color: Color(0xFF22C55E), fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 16),
                    child: Divider(color: Color(0xFF1C221E), height: 1),
                  ),

                  // Billing Cycle
                  _buildDetailRow(Icons.calendar_month_outlined, "Billing Cycle", "Monthly"),
                  const SizedBox(height: 12),

                  // Next Renewal
                  _buildDetailRow(Icons.cached_rounded, "Next Renewal", "09 Dec 2026"),
                  const SizedBox(height: 12),

                  // Plan Price
                  _buildDetailRow(Icons.payments_outlined, "Plan Price", "₹2,999 / month"),
                  const SizedBox(height: 20),

                  // Manage Subscription Button
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: OutlinedButton(
                      onPressed: () => _manageSubscription(context),
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(color: Colors.white.withOpacity(0.2)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text(
                        "Manage Subscription",
                        style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Plan Features Section
            const Text(
              "Plan Features",
              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 14),

            _buildFeatureCheck("Unlimited Appointments & Walk-ins"),
            _buildFeatureCheck("Billing & POS with Dynamic UPI QR"),
            _buildFeatureCheck("Staff Management & Commission Ledgers"),
            _buildFeatureCheck("Inventory & Low Stock Push Alerts"),
            _buildFeatureCheck("Full Financial Analytics & Profit Ledger"),
            _buildFeatureCheck("Meta WhatsApp Cloud Integration"),
            _buildFeatureCheck("GST 18% Compliant Automatic Invoicing"),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, color: Colors.white54, size: 18),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            label,
            style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13),
          ),
        ),
        Text(
          value,
          style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }

  Widget _buildFeatureCheck(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(3),
            decoration: const BoxDecoration(
              color: Color(0xFF122C1A),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.check, color: Color(0xFF22C55E), size: 14),
          ),
          const SizedBox(width: 12),
          Text(
            title,
            style: TextStyle(color: Colors.white.withOpacity(0.85), fontSize: 13, fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }
}
