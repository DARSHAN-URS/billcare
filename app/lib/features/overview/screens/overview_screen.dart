import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';
import 'package:ruvexi_mobile/shared/widgets/ruvexi_logo.dart';

class OverviewDashboardScreen extends StatelessWidget {
  final RuvexiAppState appState;

  const OverviewDashboardScreen({super.key, required this.appState});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const RuvexiLogoWidget(fontSize: 16),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: RuvexiTheme.card,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: RuvexiTheme.border),
            ),
            child: Row(
              children: [
                const Icon(Icons.verified_user, size: 14, color: RuvexiTheme.primaryAccent),
                const SizedBox(width: 4),
                Text(appState.userRole, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white)),
              ],
            ),
          )
        ],
      ),
      body: ListenableBuilder(
        listenable: appState,
        builder: (context, _) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  appState.salonName,
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                const Text("Operational Overview & Performance", style: TextStyle(color: RuvexiTheme.textMuted, fontSize: 13)),
                const SizedBox(height: 20),

                // Metrics Row
                Row(
                  children: [
                    Expanded(
                      child: _buildMetricCard(
                        "Today's Revenue",
                        "₹${appState.todayRevenue.toStringAsFixed(0)}",
                        Icons.trending_up,
                        RuvexiTheme.primaryAccent,
                        "+18% vs yesterday",
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildMetricCard(
                        "Invoices Settled",
                        appState.todayInvoices.toString(),
                        Icons.receipt_long,
                        RuvexiTheme.goldAccent,
                        "Average bill ₹${(appState.todayRevenue / (appState.todayInvoices > 0 ? appState.todayInvoices : 1)).toStringAsFixed(0)}",
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: _buildMetricCard(
                        "Live Waitlist",
                        "${appState.walkInQueue.where((q) => q.status == 'Waiting').length} guests",
                        Icons.people,
                        Colors.blueAccent,
                        "Est. wait: 12 mins",
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildMetricCard(
                        "Appts Today",
                        appState.appointments.length.toString(),
                        Icons.calendar_today,
                        Colors.purpleAccent,
                        "All confirmed",
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 24),
                const Text("Quick Counter Actions", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white)),
                const SizedBox(height: 12),

                _buildActionTile(Icons.qr_code_scanner, "Show UPI Payment Counter QR", "Collect instant customer settlement", RuvexiTheme.primaryAccent),
                _buildActionTile(Icons.mark_chat_unread, "Broadcast WhatsApp Re-engagement", "Send 14-day follow-up promos", Colors.tealAccent),
                _buildActionTile(Icons.inventory_2, "Stock & Inventory Alerts", "2 items below safety threshold", Colors.orangeAccent),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildMetricCard(String title, String value, IconData icon, Color accent, String subtext) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: RuvexiTheme.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: RuvexiTheme.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: const TextStyle(fontSize: 12, color: RuvexiTheme.textMuted)),
              Icon(icon, size: 16, color: accent),
            ],
          ),
          const SizedBox(height: 8),
          Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: accent)),
          const SizedBox(height: 6),
          Text(subtext, style: const TextStyle(fontSize: 10, color: RuvexiTheme.textSecondary)),
        ],
      ),
    );
  }

  Widget _buildActionTile(IconData icon, String title, String subtitle, Color color) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: RuvexiTheme.card,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: RuvexiTheme.border),
      ),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: color.withOpacity(0.15),
          child: Icon(icon, color: color, size: 20),
        ),
        title: Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white)),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 12, color: RuvexiTheme.textMuted)),
        trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: RuvexiTheme.textSecondary),
        onTap: () {},
      ),
    );
  }
}

