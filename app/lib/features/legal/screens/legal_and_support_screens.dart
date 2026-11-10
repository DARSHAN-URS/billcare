import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';

class HelpSupportScreen extends StatelessWidget {
  const HelpSupportScreen({super.key});

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
          "Help & Support",
          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF101311),
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: const Color(0xFF122C1A),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.headset_mic_rounded, color: Color(0xFF22C55E), size: 24),
                  ),
                  const SizedBox(height: 14),
                  const Text(
                    "We're here to help your salon run 24/7",
                    style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    "Dedicated support team for POS hardware, UPI auto-settlement, and multi-staff accounts.",
                    style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12, height: 1.4),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Contact Channels
            const Text(
              "Contact Channels",
              style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            _buildContactCard(
              icon: Icons.mail_outline_rounded,
              title: "Email Support",
              subtitle: "ruvexisolutions@gmail.com",
              actionLabel: "Write Email",
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Email client opened for ruvexisolutions@gmail.com")),
                );
              },
            ),
            const SizedBox(height: 10),

            _buildContactCard(
              icon: Icons.chat_bubble_outline_rounded,
              title: "WhatsApp Priority Desk",
              subtitle: "Instant response for live billing issues",
              actionLabel: "Chat Now",
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Connecting to Ruvexi WhatsApp Care (+91 98765 43210)...")),
                );
              },
            ),
            const SizedBox(height: 24),

            // Frequently Asked Questions
            const Text(
              "Frequently Asked Questions",
              style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            _buildFaqTile("How does Dynamic UPI QR work with billing?",
              "When you proceed to payment, the POS automatically computes tax, discounts, and generates a dynamic NPCI-standard QR code. Your customer scans and pays directly, with instant payment confirmation."),
            _buildFaqTile("Can I pair ESC/POS Bluetooth thermal printers?",
              "Yes. Ruvexi supports all standard 58mm and 80mm wireless Bluetooth receipt and kitchen thermal printers with single-tap instant print."),
            _buildFaqTile("How are staff commissions calculated?",
              "Each staff member has a configured commission percentage on completed services. The system aggregates their monthly earnings and tracks ledger payouts in real-time."),
            _buildFaqTile("Is customer formula data secure?",
              "All customer hair/skin formula notes are encrypted at rest with AES-256 and protected via strict multi-tenant Row Level Security."),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildContactCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required String actionLabel,
    required VoidCallback onTap,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF101311),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFF22C55E), size: 22),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                const SizedBox(height: 2),
                Text(subtitle, style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 12)),
              ],
            ),
          ),
          OutlinedButton(
            onPressed: onTap,
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: Color(0xFF22C55E), width: 1),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: Text(actionLabel, style: const TextStyle(color: Color(0xFF22C55E), fontSize: 11, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildFaqTile(String question, String answer) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: const Color(0xFF101311),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Theme(
        data: ThemeData.dark().copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          title: Text(question, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600)),
          iconColor: const Color(0xFF22C55E),
          collapsedIconColor: Colors.white54,
          childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          children: [
            Text(answer, style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 12, height: 1.4)),
          ],
        ),
      ),
    );
  }
}

class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

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
          "Privacy Policy",
          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "RUVEXI Privacy Policy",
              style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 6),
            const Text(
              "Last updated: November 2026 • Official RUVEXI Salon Management Platform",
              style: TextStyle(color: Color(0xFF22C55E), fontSize: 11, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 18),

            _buildPolicySection(
              "1. Information We Collect",
              "When salons and clients use RUVEXI Solutions, we collect personal identity data (name, phone number, email address), business registration details (GSTIN, salon atelier address), appointment bookings, service histories, and chemical formula preferences to enable automated salon workflows.",
            ),
            _buildPolicySection(
              "2. How We Use Salon Data",
              "We process data exclusively to provide POS billing, schedule appointments, send WhatsApp transaction notifications, compute staff commission splits, and maintain inventory stock counts. We do NOT sell, rent, or trade customer data to any third-party advertisers.",
            ),
            _buildPolicySection(
              "3. Bank-Grade Security & Encryption",
              "All communication between RUVEXI mobile apps, web dashboards, and cloud databases is protected by 256-bit TLS encryption in transit and AES-256 encryption at rest. Multi-tenant Row-Level Security ensures complete data isolation between different salons.",
            ),
            _buildPolicySection(
              "4. WhatsApp Cloud API & Communications",
              "By using automated reminders, you authorize RUVEXI to transmit appointment confirmations and digital invoices via Meta WhatsApp Cloud API following strict opt-in guidelines.",
            ),
            _buildPolicySection(
              "5. Contact & Data Protection Officer",
              "For inquiries regarding your personal data, data export, or deletion requests, please contact our Data Governance Officer at:\n\nEmail: ruvexisolutions@gmail.com\nSupport Hours: Monday to Saturday, 9:00 AM – 8:00 PM IST",
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildPolicySection(String heading, String content) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF101311),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(heading, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text(content, style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 12, height: 1.5)),
        ],
      ),
    );
  }
}

class TermsConditionsScreen extends StatelessWidget {
  const TermsConditionsScreen({super.key});

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
          "Terms & Conditions",
          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Terms of Service",
              style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 6),
            const Text(
              "Effective: November 2026 • RUVEXI Solutions OS",
              style: TextStyle(color: Color(0xFF22C55E), fontSize: 11, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 18),

            _buildTermsSection(
              "1. Acceptance of Terms",
              "By creating an account or accessing the RUVEXI Salon Management Platform, you agree to comply with and be legally bound by these Terms of Service. If you disagree with any part of these terms, you must discontinue using the application.",
            ),
            _buildTermsSection(
              "2. Salon Operator Obligations",
              "As a salon owner or manager, you represent that all pricing, staff rosters, tax registration (GSTIN), and service catalogs entered into RUVEXI are accurate and lawful. You are responsible for maintaining confidentiality of owner credentials.",
            ),
            _buildTermsSection(
              "3. Subscription & Billing Plans",
              "The Professional Plan (₹2,999/month) is billed on a recurring monthly cycle. Subscriptions renew automatically unless cancelled prior to the renewal date. All payments are processed through secure Indian payment gateways (UPI, RuPay, Visa, MasterCard).",
            ),
            _buildTermsSection(
              "4. Platform Availability (99.9% SLA)",
              "RUVEXI commits to maintaining high availability with automated failover and daily database backups. Scheduled maintenance windows will be communicated in advance via in-app banner announcements.",
            ),
            _buildTermsSection(
              "5. Contact & Grievance Redressal",
              "For questions regarding legal terms, subscription disputes, or formal notices, contact:\n\nRUVEXI Solutions\nEmail: ruvexisolutions@gmail.com\nBangalore & Chikmagaluru, Karnataka, India",
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildTermsSection(String heading, String content) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF101311),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(heading, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text(content, style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 12, height: 1.5)),
        ],
      ),
    );
  }
}

