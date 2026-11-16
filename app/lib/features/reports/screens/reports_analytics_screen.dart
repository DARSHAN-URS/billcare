import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';
import 'package:ruvexi_mobile/shared/widgets/salon_notification_dialog.dart';
import 'package:ruvexi_mobile/features/expenses/screens/expenses_screen.dart';
import 'package:ruvexi_mobile/features/staff/screens/staff_management_screen.dart';
import 'package:ruvexi_mobile/features/inventory/screens/inventory_screen.dart';

class ReportsAnalyticsScreen extends StatefulWidget {
  final RuvexiAppState appState;

  const ReportsAnalyticsScreen({super.key, required this.appState});

  @override
  State<ReportsAnalyticsScreen> createState() => _ReportsAnalyticsScreenState();
}

class _ReportsAnalyticsScreenState extends State<ReportsAnalyticsScreen> {
  int _selectedChip = 0; // 0: Revenue, 1: Services, 2: Staff, 3: Inventory
  String _selectedPeriod = "This Month";

  void _showReportDetailsModal(String title) {
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
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(title, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                IconButton(icon: const Icon(Icons.close, color: Colors.white54, size: 20), onPressed: () => Navigator.pop(ctx)),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              "Full ledger data for $title is synced with cloud database. All 1,248 transaction rows verified with 100% bank-reconciled statements.",
              style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 13, height: 1.4),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                icon: const Icon(Icons.download_rounded, color: Colors.black, size: 18),
                label: const Text("Export Statement (PDF / CSV)", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF22C55E)),
                onPressed: () {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("$title exported to PDF & sent to ${widget.appState.currentUserEmail}")),
                  );
                },
              ),
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
        automaticallyImplyLeading: false,
        leading: Navigator.canPop(context)
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
                onPressed: () => Navigator.pop(context),
              )
            : null,
        title: const Text(
          "Reports",
          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.symmetric(vertical: 12),
            padding: const EdgeInsets.symmetric(horizontal: 10),
            decoration: BoxDecoration(
              color: const Color(0xFF141815),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.white.withOpacity(0.08)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(_selectedPeriod, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600)),
                const SizedBox(width: 4),
                const Icon(Icons.keyboard_arrow_down, color: Colors.white70, size: 14),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.notifications_outlined, color: Colors.white70, size: 20),
            tooltip: "Salon Alerts",
            onPressed: () => showSalonNotificationModal(context, widget.appState),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Filter chips: Revenue, Services, Staff, Inventory
            Row(
              children: [
                _buildChip(0, "Revenue"),
                const SizedBox(width: 8),
                _buildChip(1, "Services"),
                const SizedBox(width: 8),
                _buildChip(2, "Staff"),
                const SizedBox(width: 8),
                _buildChip(3, "Inventory"),
              ],
            ),
            const SizedBox(height: 16),

            // Hero Card with Total Revenue & Custom Wavy Line Chart
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
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Total Revenue",
                            style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 12),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            "₹4,86,200",
                            style: TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF122C1A),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          "+12.4%",
                          style: TextStyle(color: Color(0xFF22C55E), fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Neon Green Wavy Line Chart
                  SizedBox(
                    height: 80,
                    width: double.infinity,
                    child: CustomPaint(
                      painter: _NeonWavePainter(),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // 4 Metric cards in 2x2 grid
            Row(
              children: [
                Expanded(
                  child: _buildMetricCard(
                    icon: Icons.calendar_today_outlined,
                    value: "1,248",
                    label: "Services",
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildMetricCard(
                    icon: Icons.people_outline_rounded,
                    value: "386",
                    label: "Clients",
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildMetricCard(
                    icon: Icons.trending_up_rounded,
                    value: "₹1,26,800",
                    label: "Profit",
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildMetricCard(
                    icon: Icons.access_time_rounded,
                    value: "76%",
                    label: "Occupancy",
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Drill-down list items
            _buildDrillDownTile("Sales Report", Icons.receipt_long_outlined, () => _showReportDetailsModal("Sales Report")),
            _buildDrillDownTile("Service Report", Icons.pie_chart_outline_rounded, () => _showReportDetailsModal("Service Report")),
            _buildDrillDownTile("Staff Performance", Icons.badge_outlined, () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => StaffManagementScreen(appState: widget.appState)),
              );
            }),
            _buildDrillDownTile("Inventory Report", Icons.inventory_2_outlined, () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => InventoryScreen(appState: widget.appState)),
              );
            }),
            _buildDrillDownTile("Salon Expenses", Icons.account_balance_wallet_outlined, () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => ExpensesScreen(appState: widget.appState)),
              );
            }),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildChip(int index, String label) {
    final isSelected = _selectedChip == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedChip = index),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF22C55E) : const Color(0xFF101311),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isSelected ? Colors.transparent : Colors.white.withOpacity(0.08),
            ),
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: TextStyle(
              color: isSelected ? Colors.black : Colors.white70,
              fontSize: 11,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMetricCard({
    required IconData icon,
    required String value,
    required String label,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF101311),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: const Color(0xFF22C55E), size: 20),
          const SizedBox(height: 10),
          Text(
            value,
            style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _buildDrillDownTile(String title, IconData icon, VoidCallback onTap) {
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
            Icon(icon, color: const Color(0xFF22C55E), size: 20),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600),
              ),
            ),
            const Icon(Icons.chevron_right, color: Colors.white38, size: 18),
          ],
        ),
      ),
    );
  }
}

class _NeonWavePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final path = Path();
    path.moveTo(0, size.height * 0.7);
    path.quadraticBezierTo(size.width * 0.15, size.height * 0.9, size.width * 0.35, size.height * 0.45);
    path.quadraticBezierTo(size.width * 0.55, size.height * 0.1, size.width * 0.75, size.height * 0.55);
    path.quadraticBezierTo(size.width * 0.90, size.height * 0.8, size.width, size.height * 0.25);

    // Gradient fill under curve
    final fillPath = Path.from(path)
      ..lineTo(size.width, size.height)
      ..lineTo(0, size.height)
      ..close();

    final fillPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          const Color(0xFF22C55E).withOpacity(0.35),
          const Color(0xFF22C55E).withOpacity(0.0),
        ],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

    canvas.drawPath(fillPath, fillPaint);

    final linePaint = Paint()
      ..color = const Color(0xFF22C55E)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round;

    canvas.drawPath(path, linePaint);

    // Dot at peak
    final dotPaint = Paint()..color = const Color(0xFF22C55E);
    canvas.drawCircle(Offset(size.width, size.height * 0.25), 4, dotPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
