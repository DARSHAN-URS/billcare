import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';
import 'package:ruvexi_mobile/features/business/screens/subscription_screen.dart';

class BusinessSettingsScreen extends StatelessWidget {
  final RuvexiAppState appState;

  const BusinessSettingsScreen({super.key, required this.appState});

  void _showEditProfileSheet(BuildContext context) {
    final nameCtrl = TextEditingController(text: appState.salonName);
    final locCtrl = TextEditingController(text: appState.salonLocation);

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
          children: [
            const Text("Edit Salon Atelier Info", style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 14),
            TextField(
              controller: nameCtrl,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                labelText: "Salon Name",
                labelStyle: const TextStyle(color: Color(0xFF22C55E)),
                filled: true,
                fillColor: const Color(0xFF141815),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: locCtrl,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                labelText: "Location",
                labelStyle: const TextStyle(color: Color(0xFF22C55E)),
                filled: true,
                fillColor: const Color(0xFF141815),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 18),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF22C55E)),
                onPressed: () {
                  appState.salonName = nameCtrl.text.trim();
                  appState.salonLocation = locCtrl.text.trim();
                  appState.notifyListeners();
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Business profile updated")),
                  );
                },
                child: const Text("Save Changes", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showOperatingHoursSheet(BuildContext context) {
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
            const Text("Operating Hours", style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 14),
            _buildHourRow("Monday – Saturday", "09:00 AM – 09:00 PM", "Open"),
            const SizedBox(height: 10),
            _buildHourRow("Sunday", "10:00 AM – 08:00 PM", "Open"),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF22C55E)),
                onPressed: () => Navigator.pop(ctx),
                child: const Text("Done", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHourRow(String days, String hours, String status) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(days, style: const TextStyle(color: Colors.white70, fontSize: 13)),
        Text(hours, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
      ],
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
          onPressed: () {
            if (Navigator.canPop(context)) Navigator.pop(context);
          },
        ),
        title: const Text(
          "Business",
          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined, color: Colors.white70, size: 20),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        child: Column(
          children: [
            // Salon Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF101311),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: const Color(0xFF181D1A),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.storefront_rounded, color: Color(0xFF22C55E), size: 24),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          appState.salonName,
                          style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          appState.salonLocation,
                          style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.edit_outlined, color: Colors.white70, size: 18),
                    onPressed: () => _showEditProfileSheet(context),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Settings Items
            _buildSettingTile(
              icon: Icons.person_outline,
              title: "Business Profile",
              onTap: () => _showEditProfileSheet(context),
            ),
            _buildSettingTile(
              icon: Icons.access_time,
              title: "Operating Hours",
              onTap: () => _showOperatingHoursSheet(context),
            ),
            _buildSettingTile(
              icon: Icons.location_on_outlined,
              title: "Branches / Outlets",
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Active branch: Chikmagaluru Flagship")),
                );
              },
            ),
            _buildSettingTile(
              icon: Icons.workspace_premium_outlined,
              title: "Subscription & Plan",
              trailingBadge: "Active",
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => SubscriptionScreen(appState: appState)),
                );
              },
            ),
            _buildSettingTile(
              icon: Icons.receipt_long_outlined,
              title: "Payments & Tax (GST)",
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("GSTIN: 29RUVEXI9824C1Z9 (18% Auto-Applied)")),
                );
              },
            ),
            _buildSettingTile(
              icon: Icons.cloud_done_outlined,
              title: "Data & Backup",
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("All records synced to Supabase Cloud Engine")),
                );
              },
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingTile({
    required IconData icon,
    required String title,
    String? trailingBadge,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: const Color(0xFF101311),
          borderRadius: BorderRadius.circular(16),
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
            if (trailingBadge != null) ...[
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFF122C1A),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  trailingBadge,
                  style: const TextStyle(color: Color(0xFF22C55E), fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(width: 8),
            ],
            const Icon(Icons.chevron_right, color: Colors.white38, size: 18),
          ],
        ),
      ),
    );
  }
}
