import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';
import 'package:ruvexi_mobile/shared/widgets/ruvexi_logo.dart';

class OverviewDashboardScreen extends StatelessWidget {
  final RuvexiAppState appState;
  final void Function(int index)? onNavigateToTab;

  const OverviewDashboardScreen({
    super.key,
    required this.appState,
    this.onNavigateToTab,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF060706),
      body: Stack(
        children: [
          // Ambient Emerald Glow at top right corner
          Positioned(
            top: -40,
            right: -40,
            child: Container(
              width: 220,
              height: 220,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    const Color(0xFF22C55E).withValues(alpha: 0.16),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),

          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 1. Top Header Bar: Brand Logo + Salon Dropdown + Notifications
                  _buildTopHeader(context),

                  const SizedBox(height: 22),

                  // 2. Greeting & Owner Role Badge
                  _buildGreetingAndRole(context),

                  const SizedBox(height: 22),

                  // 3. Primary 4 Navigation Tiles (Appointments, Billing POS, Customers, Inventory)
                  _buildPrimaryNavigationTiles(context),

                  const SizedBox(height: 22),

                  // 4. Today's Overview Card (Excluding Profit slide per user request)
                  _buildTodaysOverviewCard(context),

                  const SizedBox(height: 26),

                  // 5. Quick Actions Row
                  _buildQuickActions(context),

                  const SizedBox(height: 26),

                  // 6. Today's Appointments List
                  _buildTodaysAppointments(context),

                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // 1. Top Header Bar
  Widget _buildTopHeader(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // Left: Ruvexi Brand Logo
        const RuvexiLogoWidget(fontSize: 18, showSubtitle: true),

        // Center / Right: Salon selector & Notification Bell
        Row(
          children: [
            // Salon Selector Dropdown
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
              decoration: BoxDecoration(
                color: const Color(0xFF101311),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white.withValues(alpha: 0.14)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: const [
                  Icon(Icons.content_cut_rounded, size: 14, color: Colors.white70),
                  SizedBox(width: 6),
                  Text(
                    "Ruvexi Salon & Spa",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 12.5,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  SizedBox(width: 4),
                  Icon(Icons.keyboard_arrow_down_rounded, size: 16, color: Colors.white70),
                ],
              ),
            ),

            const SizedBox(width: 10),

            // Notification Bell with Green Indicator Dot
            Stack(
              clipBehavior: Clip.none,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFF101311),
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white.withValues(alpha: 0.12)),
                  ),
                  child: const Icon(
                    Icons.notifications_none_rounded,
                    color: Colors.white,
                    size: 20,
                  ),
                ),
                Positioned(
                  top: 2,
                  right: 3,
                  child: Container(
                    width: 7.5,
                    height: 7.5,
                    decoration: BoxDecoration(
                      color: const Color(0xFF22C55E),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF22C55E).withValues(alpha: 0.8),
                          blurRadius: 4,
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ],
    );
  }

  // 2. Greeting & Owner Role
  Widget _buildGreetingAndRole(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        // Left: Good Evening + Name with wave emoji
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Good Evening,",
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.6),
                fontSize: 14,
                fontWeight: FontWeight.w400,
              ),
            ),
            const SizedBox(height: 2),
            Row(
              children: const [
                Text(
                  "Darshan",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.2,
                  ),
                ),
                SizedBox(width: 6),
                Text(
                  "👋",
                  style: TextStyle(fontSize: 22),
                ),
              ],
            ),
          ],
        ),

        // Right: Owner Role Dropdown Pill
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
          decoration: BoxDecoration(
            color: const Color(0xFF101411),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFF22C55E).withValues(alpha: 0.35)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: const [
              Icon(Icons.workspace_premium_rounded, size: 15, color: Color(0xFFFACC15)),
              SizedBox(width: 6),
              Text(
                "Owner",
                style: TextStyle(
                  color: Color(0xFF22C55E),
                  fontSize: 12.5,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(width: 4),
              Icon(Icons.keyboard_arrow_down_rounded, size: 16, color: Color(0xFF22C55E)),
            ],
          ),
        ),
      ],
    );
  }

  // 3. Primary 4 Navigation Tiles
  Widget _buildPrimaryNavigationTiles(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _buildNavTile(
            icon: Icons.calendar_month_outlined,
            label: "Appointments",
            onTap: () => onNavigateToTab?.call(1),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _buildNavTile(
            icon: Icons.point_of_sale_outlined,
            label: "Billing (POS)",
            onTap: () => onNavigateToTab?.call(2),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _buildNavTile(
            icon: Icons.people_outline_rounded,
            label: "Customers",
            onTap: () => onNavigateToTab?.call(3),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _buildNavTile(
            icon: Icons.inventory_2_outlined,
            label: "Inventory",
            onTap: () => onNavigateToTab?.call(5),
          ),
        ),
      ],
    );
  }

  Widget _buildNavTile({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 76,
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 4),
        decoration: BoxDecoration(
          color: const Color(0xFF101311),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withValues(alpha: 0.12)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: const Color(0xFF22C55E), size: 24),
            const SizedBox(height: 7),
            Text(
              label,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 10.5,
                fontWeight: FontWeight.w500,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  // 4. Today's Overview Card (WITHOUT Profit slide)
  Widget _buildTodaysOverviewCard(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF0F1210),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: Colors.white.withValues(alpha: 0.12)),
      ),
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header: "Today's Overview" & Date, with "Today v" dropdown
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Today's Overview",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    "Tue, 09 Nov 2026",
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.5),
                      fontSize: 11.5,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: const Color(0xFF181B19),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.white.withValues(alpha: 0.12)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: const [
                    Text(
                      "Today",
                      style: TextStyle(color: Colors.white, fontSize: 11.5, fontWeight: FontWeight.w500),
                    ),
                    SizedBox(width: 4),
                    Icon(Icons.keyboard_arrow_down_rounded, size: 14, color: Colors.white70),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 18),

          // Row 1 Metrics: 24 Appointments & 18 Clients
          Row(
            children: [
              Expanded(
                child: _buildMetricCard(
                  icon: Icons.calendar_month_outlined,
                  value: "24",
                  label: "Appointments",
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildMetricCard(
                  icon: Icons.people_outline_rounded,
                  value: "18",
                  label: "Clients",
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          // Row 2 Metric: Revenue (Profit slide excluded per explicit instruction)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
              color: const Color(0xFF141815),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
            ),
            child: Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: const Color(0xFF22C55E).withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                  ),
                  alignment: Alignment.center,
                  child: const Text(
                    "₹",
                    style: TextStyle(
                      color: Color(0xFF22C55E),
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(width: 14),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      "₹42,600",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.2,
                      ),
                    ),
                    Text(
                      "Total Revenue Today",
                      style: TextStyle(
                        color: Colors.white60,
                        fontSize: 11.5,
                      ),
                    ),
                  ],
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFF22C55E).withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text(
                    "+18% vs avg",
                    style: TextStyle(
                      color: Color(0xFF22C55E),
                      fontSize: 10.5,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 8),

          // Neon Wavy Line Chart
          SizedBox(
            height: 70,
            width: double.infinity,
            child: CustomPaint(
              painter: _NeonWavyChartPainter(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricCard({
    required IconData icon,
    required String value,
    required String label,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF141815),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFF22C55E), size: 22),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                value,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                label,
                style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.55),
                  fontSize: 11.5,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // 5. Quick Actions Section
  Widget _buildQuickActions(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Quick Actions",
          style: TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 14),
        Row(
          children: [
            // Action 1: New Appointment (Highlighted with Neon Green Border)
            Expanded(
              child: GestureDetector(
                onTap: () => onNavigateToTab?.call(1),
                child: Container(
                  height: 84,
                  padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFF101411),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: const Color(0xFF22C55E),
                      width: 1.5,
                    ),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(Icons.add_circle_outline_rounded, color: Color(0xFF22C55E), size: 24),
                      SizedBox(height: 6),
                      Text(
                        "New\nAppointment",
                        style: TextStyle(
                          color: Color(0xFF22C55E),
                          fontSize: 10.5,
                          fontWeight: FontWeight.bold,
                          height: 1.2,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),

            // Action 2: New Bill (POS)
            Expanded(
              child: _buildQuickActionCard(
                icon: Icons.qr_code_scanner_rounded,
                label: "New Bill\n(POS)",
                onTap: () => onNavigateToTab?.call(2),
              ),
            ),
            const SizedBox(width: 8),

            // Action 3: Add Customer
            Expanded(
              child: _buildQuickActionCard(
                icon: Icons.person_add_alt_1_outlined,
                label: "Add\nCustomer",
                onTap: () => onNavigateToTab?.call(3),
              ),
            ),
            const SizedBox(width: 8),

            // Action 4: Add Service
            Expanded(
              child: _buildQuickActionCard(
                icon: Icons.grid_view_rounded,
                label: "Add\nService",
                onTap: () => onNavigateToTab?.call(4),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildQuickActionCard({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 84,
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
        decoration: BoxDecoration(
          color: const Color(0xFF101311),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withValues(alpha: 0.12)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: const Color(0xFF22C55E), size: 22),
            const SizedBox(height: 6),
            Text(
              label,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 10.5,
                fontWeight: FontWeight.w500,
                height: 1.2,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  // 6. Today's Appointments Section
  Widget _buildTodaysAppointments(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              "Today's Appointments",
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            GestureDetector(
              onTap: () => onNavigateToTab?.call(1),
              child: Row(
                children: const [
                  Text(
                    "View All",
                    style: TextStyle(
                      color: Color(0xFF22C55E),
                      fontSize: 12.5,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(width: 4),
                  Icon(Icons.arrow_forward_rounded, color: Color(0xFF22C55E), size: 14),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),

        // Card 1: Priya Sharma (In Service)
        _buildAppointmentItem(
          time: "10:00 AM",
          avatarLetters: "PS",
          avatarColor: const Color(0xFF4C1D95), // deep purple
          customerName: "Priya Sharma",
          serviceName: "Hair Cut + Hair Spa",
          statusLabel: "In Service",
          statusBg: const Color(0xFF14532D),
          statusBorder: const Color(0xFF22C55E),
          statusTextColor: const Color(0xFF4ADE80),
        ),

        const SizedBox(height: 10),

        // Card 2: Arjun Rao (Confirmed)
        _buildAppointmentItem(
          time: "11:30 AM",
          avatarLetters: "AR",
          avatarColor: const Color(0xFF334155), // slate
          customerName: "Arjun Rao",
          serviceName: "Beard Grooming",
          statusLabel: "Confirmed",
          statusBg: const Color(0xFF1E3A8A),
          statusBorder: const Color(0xFF3B82F6),
          statusTextColor: const Color(0xFF60A5FA),
        ),

        const SizedBox(height: 10),

        // Card 3: Neha R (Upcoming)
        _buildAppointmentItem(
          time: "01:00 PM",
          avatarLetters: "NR",
          avatarColor: const Color(0xFF78350F), // warm tan
          customerName: "Neha R",
          serviceName: "Hair Color",
          statusLabel: "Upcoming",
          statusBg: const Color(0xFF78350F).withValues(alpha: 0.6),
          statusBorder: const Color(0xFFF59E0B),
          statusTextColor: const Color(0xFFFBBF24),
        ),
      ],
    );
  }

  Widget _buildAppointmentItem({
    required String time,
    required String avatarLetters,
    required Color avatarColor,
    required String customerName,
    required String serviceName,
    required String statusLabel,
    required Color statusBg,
    required Color statusBorder,
    required Color statusTextColor,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF101311),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.10)),
      ),
      child: Row(
        children: [
          // Left Vertical Green Bar
          Container(
            width: 3.5,
            height: 28,
            decoration: BoxDecoration(
              color: const Color(0xFF22C55E),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(width: 10),

          // Time
          Text(
            time,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(width: 14),

          // Avatar Badge
          Container(
            width: 34,
            height: 34,
            decoration: BoxDecoration(
              color: avatarColor,
              borderRadius: BorderRadius.circular(10),
            ),
            alignment: Alignment.center,
            child: Text(
              avatarLetters,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 12),

          // Customer and Service
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  customerName,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 13.5,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  serviceName,
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: 0.55),
                    fontSize: 11.5,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),

          // Status Badge Pill
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: statusBg,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: statusBorder.withValues(alpha: 0.5), width: 1),
            ),
            child: Text(
              statusLabel,
              style: TextStyle(
                color: statusTextColor,
                fontSize: 11,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ----------------------------------------------------------------------------
// Custom Neon Wavy Chart Painter (matching the reference image curve and glow)
// ----------------------------------------------------------------------------
class _NeonWavyChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    final path = Path();
    path.moveTo(0, h * 0.70);
    path.cubicTo(w * 0.15, h * 0.72, w * 0.25, h * 0.50, w * 0.35, h * 0.45);
    path.cubicTo(w * 0.45, h * 0.40, w * 0.55, h * 0.85, w * 0.65, h * 0.65);
    path.cubicTo(w * 0.75, h * 0.50, w * 0.85, h * 0.68, w * 0.98, h * 0.15);

    // 1. Shaded Gradient under curve
    final fillPath = Path.from(path)
      ..lineTo(w * 0.98, h)
      ..lineTo(0, h)
      ..close();

    final fillPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          const Color(0xFF22C55E).withValues(alpha: 0.42),
          const Color(0xFF22C55E).withValues(alpha: 0.08),
          Colors.transparent,
        ],
        stops: const [0.0, 0.5, 1.0],
      ).createShader(Rect.fromLTWH(0, 0, w, h));

    canvas.drawPath(fillPath, fillPaint);

    // 2. Neon Line Stroke with Glow
    final glowPaint = Paint()
      ..color = const Color(0xFF22C55E)
      ..strokeWidth = 3.2
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..maskFilter = const MaskFilter.blur(BlurStyle.solid, 4);

    canvas.drawPath(path, glowPaint);

    final linePaint = Paint()
      ..color = const Color(0xFF22C55E)
      ..strokeWidth = 2.2
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    canvas.drawPath(path, linePaint);

    // 3. Glowing Endpoint Dot at (w * 0.98, h * 0.15)
    final endPoint = Offset(w * 0.98, h * 0.15);

    // Outer glow halo
    canvas.drawCircle(
      endPoint,
      6.0,
      Paint()
        ..color = const Color(0xFF22C55E).withValues(alpha: 0.55)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 5),
    );

    // Solid core dot
    canvas.drawCircle(
      endPoint,
      3.8,
      Paint()..color = Colors.white,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
