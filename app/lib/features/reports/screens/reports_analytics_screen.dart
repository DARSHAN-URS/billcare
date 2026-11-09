import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';

class ReportsAnalyticsScreen extends StatelessWidget {
  final RuvexiAppState appState;

  const ReportsAnalyticsScreen({super.key, required this.appState});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Reports & Financial Analytics", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
      ),
      body: ListenableBuilder(
        listenable: appState,
        builder: (context, _) {
          final gstCollected = appState.todayRevenue * 0.18;
          final netRevenue = appState.todayRevenue - gstCollected;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF18181B), Color(0xFF141417)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: RuvexiTheme.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text("GROSS REVENUE (TODAY)", style: TextStyle(color: RuvexiTheme.textMuted, fontSize: 11, letterSpacing: 1.5, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 6),
                      Text("₹${appState.todayRevenue.toStringAsFixed(0)}", style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white)),
                      const Divider(color: RuvexiTheme.border, height: 24),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _buildReportPill("Net Sales", "₹${netRevenue.toStringAsFixed(0)}"),
                          _buildReportPill("GST Output (18%)", "₹${gstCollected.toStringAsFixed(0)}"),
                          _buildReportPill("Average Ticket", "₹${(appState.todayRevenue / (appState.todayInvoices > 0 ? appState.todayInvoices : 1)).toStringAsFixed(0)}"),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                const Text("Top Revenue Services Today", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white)),
                const SizedBox(height: 12),
                _buildServicePerfRow("Balayage & Color Gloss", 7, 38500.0, 0.85),
                _buildServicePerfRow("Keratin Treatment Pro", 4, 26000.0, 0.60),
                _buildServicePerfRow("HydraFacial Deluxe", 5, 19000.0, 0.45),
                _buildServicePerfRow("Executive Hair & Beard", 11, 15400.0, 0.35),

                const SizedBox(height: 24),
                const Text("Settlement Method Breakdown", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white)),
                const SizedBox(height: 12),
                _buildPaymentBreakdown("UPI Counter QR (GPay/PhonePe)", "68%", RuvexiTheme.primaryAccent),
                _buildPaymentBreakdown("Credit / Debit Card Terminal", "24%", Colors.blueAccent),
                _buildPaymentBreakdown("Cash Counter Drawer", "8%", RuvexiTheme.goldAccent),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildReportPill(String title, String val) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(fontSize: 10, color: RuvexiTheme.textSecondary)),
        const SizedBox(height: 2),
        Text(val, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: RuvexiTheme.goldAccent)),
      ],
    );
  }

  Widget _buildServicePerfRow(String name, int qty, double amount, double progress) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: RuvexiTheme.card,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: RuvexiTheme.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white)),
              Text("₹${amount.toStringAsFixed(0)}", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: RuvexiTheme.primaryAccent)),
            ],
          ),
          const SizedBox(height: 4),
          Text("$qty completed orders", style: TextStyle(color: RuvexiTheme.textMuted, fontSize: 11)),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: progress,
            backgroundColor: RuvexiTheme.surface,
            valueColor: const AlwaysStoppedAnimation<Color>(RuvexiTheme.primaryAccent),
            borderRadius: BorderRadius.circular(4),
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentBreakdown(String method, String percentage, Color color) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: RuvexiTheme.surface,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: RuvexiTheme.border),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              CircleAvatar(radius: 5, backgroundColor: color),
              const SizedBox(width: 10),
              Text(method, style: const TextStyle(fontSize: 12, color: Colors.white)),
            ],
          ),
          Text(percentage, style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: color)),
        ],
      ),
    );
  }
}

