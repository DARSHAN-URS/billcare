import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';
import 'package:ruvexi_mobile/features/staff/screens/staff_management_screen.dart';
import 'package:ruvexi_mobile/features/services/screens/services_screen.dart';
import 'package:ruvexi_mobile/features/inventory/screens/inventory_screen.dart';
import 'package:ruvexi_mobile/features/reports/screens/reports_analytics_screen.dart';
import 'package:ruvexi_mobile/features/offers/screens/offers_packages_screen.dart';
import 'package:ruvexi_mobile/features/expenses/screens/expenses_screen.dart';
import 'package:ruvexi_mobile/features/business/screens/business_settings_screen.dart';
import 'package:ruvexi_mobile/features/legal/screens/legal_and_support_screens.dart';

class MoreScreen extends StatelessWidget {
  final RuvexiAppState appState;

  const MoreScreen({super.key, required this.appState});

  @override
  Widget build(BuildContext context) {
    final modules = [
      {
        "title": "Staff",
        "icon": Icons.people_outline_rounded,
        "onTap": () => Navigator.push(context, MaterialPageRoute(builder: (_) => StaffManagementScreen(appState: appState))),
      },
      {
        "title": "Services",
        "icon": Icons.content_cut_rounded,
        "onTap": () => Navigator.push(context, MaterialPageRoute(builder: (_) => ServicesPricingScreen(appState: appState))),
      },
      {
        "title": "Inventory",
        "icon": Icons.inventory_2_outlined,
        "onTap": () => Navigator.push(context, MaterialPageRoute(builder: (_) => InventoryScreen(appState: appState))),
      },
      {
        "title": "Reports",
        "icon": Icons.bar_chart_rounded,
        "onTap": () => Navigator.push(context, MaterialPageRoute(builder: (_) => ReportsAnalyticsScreen(appState: appState))),
      },
      {
        "title": "Offers &\nCoupons",
        "icon": Icons.local_offer_outlined,
        "onTap": () => Navigator.push(context, MaterialPageRoute(builder: (_) => OffersPackagesScreen(appState: appState))),
      },
      {
        "title": "Packages",
        "icon": Icons.card_giftcard_rounded,
        "onTap": () => Navigator.push(context, MaterialPageRoute(builder: (_) => OffersPackagesScreen(appState: appState))),
      },
      {
        "title": "Expense",
        "icon": Icons.receipt_long_outlined,
        "onTap": () => Navigator.push(context, MaterialPageRoute(builder: (_) => ExpensesScreen(appState: appState))),
      },
      {
        "title": "Settings",
        "icon": Icons.settings_outlined,
        "onTap": () => Navigator.push(context, MaterialPageRoute(builder: (_) => BusinessSettingsScreen(appState: appState))),
      },
    ];

    return Scaffold(
      backgroundColor: const Color(0xFF060706),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 80),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Bar
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Text(
                            "RUVEXI",
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 2.0,
                            ),
                          ),
                          Container(
                            width: 3.5,
                            height: 7,
                            margin: const EdgeInsets.only(left: 2, bottom: 8),
                            decoration: BoxDecoration(
                              color: const Color(0xFF22C55E),
                              borderRadius: BorderRadius.circular(1),
                            ),
                          ),
                        ],
                      ),
                      const Text(
                        "SOLUTIONS",
                        style: TextStyle(
                          color: Colors.white70,
                          fontSize: 8,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 3.5,
                        ),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.notifications_outlined, color: Colors.white70, size: 22),
                    onPressed: () {},
                  ),
                ],
              ),
              const SizedBox(height: 14),

              // Title: More
              const Text(
                "More",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  letterSpacing: -0.3,
                ),
              ),
              const SizedBox(height: 18),

              // 8-Card Grid
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: modules.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 0.95,
                ),
                itemBuilder: (context, index) {
                  final mod = modules[index];
                  return GestureDetector(
                    onTap: mod["onTap"] as VoidCallback,
                    child: Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFF101311),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.white.withOpacity(0.08)),
                      ),
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(mod["icon"] as IconData, color: const Color(0xFF22C55E), size: 24),
                          const SizedBox(height: 8),
                          Text(
                            mod["title"] as String,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              height: 1.2,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 24),

              // Legal & Support Links
              _buildMenuRow(
                icon: Icons.help_outline_rounded,
                title: "Help & Support",
                onTap: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const HelpSupportScreen()));
                },
              ),
              _buildMenuRow(
                icon: Icons.shield_outlined,
                title: "Privacy Policy",
                onTap: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const PrivacyPolicyScreen()));
                },
              ),
              _buildMenuRow(
                icon: Icons.description_outlined,
                title: "Terms & Conditions",
                onTap: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const TermsConditionsScreen()));
                },
              ),
              const SizedBox(height: 36),

              // Footer branding
              Center(
                child: Column(
                  children: [
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text(
                          "RUVEXI",
                          style: TextStyle(
                            color: Colors.white38,
                            fontSize: 12,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 2.0,
                          ),
                        ),
                        Container(
                          width: 2.5,
                          height: 5,
                          margin: const EdgeInsets.only(left: 2, bottom: 6),
                          decoration: BoxDecoration(
                            color: const Color(0xFF22C55E).withOpacity(0.5),
                            borderRadius: BorderRadius.circular(1),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    const Text(
                      "SOLUTIONS",
                      style: TextStyle(
                        color: Colors.white24,
                        fontSize: 8,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 3.0,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      "v1.0.0",
                      style: TextStyle(color: Colors.white.withOpacity(0.2), fontSize: 11),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMenuRow({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: const Color(0xFF101311),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.white.withOpacity(0.08)),
        ),
        child: Row(
          children: [
            Icon(icon, color: Colors.white60, size: 20),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w500),
              ),
            ),
            const Icon(Icons.chevron_right, color: Colors.white38, size: 18),
          ],
        ),
      ),
    );
  }
}

