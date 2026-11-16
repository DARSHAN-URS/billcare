import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:url_launcher/url_launcher.dart';

class SubscriptionScreen extends StatelessWidget {
  final RuvexiAppState appState;

  const SubscriptionScreen({super.key, required this.appState});

  Future<void> _openWhatsAppActivation(BuildContext context) async {
    final phone = appState.conciergeWhatsapp.replaceAll(RegExp(r'[^0-9]'), '');
    if (phone.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Concierge WhatsApp is not configured on the server yet."),
          backgroundColor: Colors.orangeAccent,
        ),
      );
      return;
    }
    final msg = Uri.encodeComponent(
      "Hi RUVEXI Team! I want to activate the paid plan for ${appState.salonName} (${appState.currentUserEmail}).",
    );
    final uri = Uri.parse("https://wa.me/$phone?text=$msg");
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Could not open WhatsApp on this device.")),
      );
    }
  }

  void _manageSubscription(BuildContext context) {
    final upi = appState.conciergeUpiId;
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
              "Activate / Manage Subscription",
              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              "Pay via UPI and share your payment screenshot on WhatsApp for instant manual activation.",
              style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 13, height: 1.4),
            ),
            const SizedBox(height: 16),
            if (upi.isNotEmpty)
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.qr_code_2_rounded, color: Color(0xFF22C55E)),
                title: Text("UPI ID: $upi", style: const TextStyle(color: Colors.white, fontSize: 13)),
                subtitle: const Text("Tap to copy UPI ID", style: TextStyle(color: Colors.white54, fontSize: 11)),
                trailing: const Icon(Icons.copy_rounded, size: 16, color: Color(0xFF22C55E)),
                onTap: () {
                  Clipboard.setData(ClipboardData(text: upi));
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("Copied UPI ID: $upi")),
                  );
                },
              ),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.chat_bubble_outline_rounded, color: Color(0xFF22C55E)),
              title: const Text("Send Screenshot on WhatsApp", style: TextStyle(color: Colors.white, fontSize: 13)),
              trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.white38),
              onTap: () {
                Navigator.pop(ctx);
                _openWhatsAppActivation(context);
              },
            ),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.refresh_rounded, color: Color(0xFFFACC15)),
              title: const Text("Refresh Subscription Status", style: TextStyle(color: Colors.white, fontSize: 13)),
              trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.white38),
              onTap: () async {
                Navigator.pop(ctx);
                await appState.syncWorkspace();
                if (!context.mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text("Status: ${appState.subscriptionStatus.toUpperCase()}")),
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
    final statusUpper = appState.subscriptionStatus.toUpperCase();
    final isPaidActive = appState.subscriptionStatus.toLowerCase() == 'active';
    final planLabel = appState.subscriptionPlan.replaceAll('_', ' ').toUpperCase();

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
      body: ListenableBuilder(
        listenable: appState,
        builder: (context, _) => SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
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
                              Text(
                                planLabel.isNotEmpty ? planLabel : "RUVEXI PLAN",
                                style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                isPaidActive
                                    ? "Full salon OS access active"
                                    : "Active workspace subscription",
                                style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 12),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: isPaidActive ? const Color(0xFF122C1A) : const Color(0xFF2E2408),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            statusUpper,
                            style: TextStyle(
                              color: isPaidActive ? const Color(0xFF22C55E) : const Color(0xFFFACC15),
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 16),
                      child: Divider(color: Color(0xFF1C221E), height: 1),
                    ),
                    _buildDetailRow(Icons.storefront_outlined, "Workspace", appState.salonName),
                    const SizedBox(height: 12),
                    _buildDetailRow(
                      Icons.shield_outlined,
                      "Access Tier",
                      isPaidActive ? "Active Unlimited Plan" : "Standard Salon Workspace",
                    ),
                    if (appState.conciergeUpiId.isNotEmpty) ...[
                      const SizedBox(height: 12),
                      _buildDetailRow(Icons.payments_outlined, "Activation UPI", appState.conciergeUpiId),
                    ],
                    const SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: OutlinedButton(
                        onPressed: () => _manageSubscription(context),
                        style: OutlinedButton.styleFrom(
                          side: BorderSide(color: Colors.white.withOpacity(0.2)),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: Text(
                          isPaidActive ? "Manage Subscription" : "Activate via UPI / WhatsApp",
                          style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
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
