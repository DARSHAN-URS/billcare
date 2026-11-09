import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';

class SettingsStaffScreen extends StatelessWidget {
  final RuvexiAppState appState;

  const SettingsStaffScreen({super.key, required this.appState});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Salon Settings & Team", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
      ),
      body: ListenableBuilder(
        listenable: appState,
        builder: (context, _) {
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: RuvexiTheme.card,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: RuvexiTheme.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Active Organization", style: TextStyle(color: RuvexiTheme.textMuted, fontSize: 12)),
                    const SizedBox(height: 4),
                    Text(appState.salonName, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Icon(Icons.location_on, size: 14, color: RuvexiTheme.primaryAccent),
                        const SizedBox(width: 4),
                        const Text("Indiranagar 100ft Rd, Bengaluru", style: TextStyle(color: RuvexiTheme.textSecondary, fontSize: 12)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              const Text("Team Stylists & Commissions", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white)),
              const SizedBox(height: 10),
              _buildStaffTile("Priya Varma", "Senior Colorist", "15% Commission", "₹18,400 sales today"),
              _buildStaffTile("Vikram Sethi", "Master Barber", "12% Commission", "₹14,200 sales today"),
              _buildStaffTile("Sunita Mohan", "Lead Aesthetician", "10% Commission", "₹8,600 sales today"),
              const SizedBox(height: 20),
              const Text("Salon Integrations", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white)),
              const SizedBox(height: 10),
              _buildIntegrationTile(Icons.phone_android, "Meta WhatsApp Cloud API", "Connected • Auto follow-ups active", RuvexiTheme.primaryAccent),
              _buildIntegrationTile(Icons.account_balance, "Razorpay Payment Gateway", "Active • Instant settlements", Colors.blueAccent),
            ],
          );
        },
      ),
    );
  }

  Widget _buildStaffTile(String name, String role, String comm, String stats) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: RuvexiTheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: RuvexiTheme.border),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 14)),
              Text(role, style: TextStyle(color: RuvexiTheme.textMuted, fontSize: 12)),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(comm, style: TextStyle(color: RuvexiTheme.goldAccent, fontWeight: FontWeight.bold, fontSize: 12)),
              Text(stats, style: TextStyle(color: RuvexiTheme.textSecondary, fontSize: 11)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildIntegrationTile(IconData icon, String title, String subtitle, Color color) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: RuvexiTheme.card,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: RuvexiTheme.border),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 13)),
                Text(subtitle, style: TextStyle(color: RuvexiTheme.textMuted, fontSize: 11)),
              ],
            ),
          ),
          Icon(Icons.check_circle, color: RuvexiTheme.primaryAccent, size: 16),
        ],
      ),
    );
  }
}

