import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';

class StaffProfileScreen extends StatefulWidget {
  final RuvexiAppState appState;
  final StaffMember staffMember;

  const StaffProfileScreen({
    super.key,
    required this.appState,
    required this.staffMember,
  });

  @override
  State<StaffProfileScreen> createState() => _StaffProfileScreenState();
}

class _StaffProfileScreenState extends State<StaffProfileScreen> {
  int _selectedTabIndex = 0; // 0: Overview, 1: Attendance, 2: Commission
  late StaffMember _staff;

  @override
  void initState() {
    super.initState();
    _staff = widget.staffMember;
  }

  void _showActionToast(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF141815),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
          side: const BorderSide(color: Color(0xFF22C55E)),
        ),
        duration: const Duration(seconds: 2),
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
          "Staff Profile",
          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        child: Column(
          children: [
            // Avatar
            Center(
              child: Stack(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: const Color(0xFF1E2822),
                    child: Text(
                      _staff.name.substring(0, 1),
                      style: const TextStyle(color: Color(0xFF22C55E), fontSize: 32, fontWeight: FontWeight.bold),
                    ),
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: const BoxDecoration(
                        color: Color(0xFF22C55E),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.check, size: 12, color: Colors.black),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Name & Role
            Text(
              _staff.name,
              style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Text(
              _staff.role,
              style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13),
            ),
            const SizedBox(height: 8),

            // Active Badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF122C1A),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFF22C55E).withOpacity(0.3)),
              ),
              child: const Text(
                "Active",
                style: TextStyle(color: Color(0xFF22C55E), fontSize: 11, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 20),

            // Action Buttons: Call, Message
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildActionCircle(Icons.phone_outlined, "Call", () => _showActionToast("Calling ${_staff.phone}...")),
                const SizedBox(width: 32),
                _buildActionCircle(Icons.chat_bubble_outline, "Message", () => _showActionToast("Sending message to ${_staff.name}...")),
              ],
            ),
            const SizedBox(height: 24),

            // Tabs: Overview, Attendance, Commission
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: const Color(0xFF101311),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: Row(
                children: [
                  _buildTabSegment(0, "Overview"),
                  _buildTabSegment(1, "Attendance"),
                  _buildTabSegment(2, "Commission"),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Tab Content
            if (_selectedTabIndex == 0) _buildOverviewTab(),
            if (_selectedTabIndex == 1) _buildAttendanceTab(),
            if (_selectedTabIndex == 2) _buildCommissionTab(),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCircle(IconData icon, String label, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF141815),
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white.withOpacity(0.1)),
            ),
            child: Icon(icon, color: Colors.white70, size: 18),
          ),
          const SizedBox(height: 6),
          Text(label, style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 11)),
        ],
      ),
    );
  }

  Widget _buildTabSegment(int index, String label) {
    final isSelected = _selectedTabIndex == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedTabIndex = index),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF22C55E) : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: TextStyle(
              color: isSelected ? Colors.black : Colors.white70,
              fontSize: 12,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildOverviewTab() {
    return Column(
      children: [
        // 2 Metric cards top
        Row(
          children: [
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF101311),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white.withOpacity(0.08)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.calendar_month_outlined, color: Color(0xFF22C55E), size: 20),
                    const SizedBox(height: 12),
                    Text(
                      "${_staff.servicesCount}",
                      style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      "Services",
                      style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 12),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF101311),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white.withOpacity(0.08)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("₹", style: TextStyle(color: Color(0xFF22C55E), fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 12),
                    Text(
                      "₹${_staff.serviceRevenue.toInt()}",
                      style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      "Service Revenue",
                      style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 12),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),

        // 2 Metric cards bottom
        Row(
          children: [
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF101311),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white.withOpacity(0.08)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("%", style: TextStyle(color: Color(0xFF22C55E), fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 12),
                    Text(
                      "${(_staff.commissionRate * 100).toInt()}%",
                      style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      "Commission",
                      style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 12),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF101311),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white.withOpacity(0.08)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.star_rounded, color: Color(0xFF22C55E), size: 20),
                    const SizedBox(height: 12),
                    Text(
                      "${_staff.rating}",
                      style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      "Avg. Rating",
                      style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 12),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),

        // Assigned Services Tile
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          decoration: BoxDecoration(
            color: const Color(0xFF101311),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: Colors.white.withOpacity(0.08)),
          ),
          child: Row(
            children: [
              const Icon(Icons.content_cut, color: Color(0xFF22C55E), size: 20),
              const SizedBox(width: 14),
              const Expanded(
                child: Text(
                  "Assigned Services",
                  style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w500),
                ),
              ),
              Text(
                "${_staff.assignedServicesCount} Services",
                style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
              ),
              const SizedBox(width: 6),
              const Icon(Icons.chevron_right, color: Colors.white38, size: 18),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildAttendanceTab() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF101311),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text("Today's Shift Clock", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF122C1A),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(_staff.isClockedIn ? "Clocked In • ${_staff.checkInTime}" : "Not Clocked In",
                  style: const TextStyle(color: Color(0xFF22C55E), fontSize: 11, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text("Monthly Attendance: 26 / 26 Working Days (100% On-Time Record)",
            style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 12)),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _staff.isClockedIn = !_staff.isClockedIn;
                _staff.checkInTime = _staff.isClockedIn ? "09:30 AM" : "--";
              });
              _showActionToast(_staff.isClockedIn ? "Clocked In successfully" : "Clocked Out successfully");
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: _staff.isClockedIn ? Colors.redAccent.withOpacity(0.2) : const Color(0xFF22C55E),
              foregroundColor: _staff.isClockedIn ? Colors.redAccent : Colors.black,
            ),
            child: Text(_staff.isClockedIn ? "Clock Out Staff" : "Clock In Staff"),
          ),
        ],
      ),
    );
  }

  Widget _buildCommissionTab() {
    final earnedCommission = _staff.serviceRevenue * _staff.commissionRate;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF101311),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Monthly Payout Breakdown", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 14),
          _buildPayoutRow("Gross Revenue Generated", "₹${_staff.serviceRevenue.toInt()}"),
          const SizedBox(height: 8),
          _buildPayoutRow("Commission Rate", "${(_staff.commissionRate * 100).toInt()}%"),
          const SizedBox(height: 8),
          _buildPayoutRow("Commission Earned", "₹${earnedCommission.toInt()}", valueColor: const Color(0xFF22C55E)),
          const Divider(color: Color(0xFF1C221E), height: 24),
          _buildPayoutRow("Total Payout Due (with base)", "₹${(earnedCommission + 25000).toInt()}", valueColor: Colors.white, isBold: true),
        ],
      ),
    );
  }

  Widget _buildPayoutRow(String label, String value, {Color? valueColor, bool isBold = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(color: Colors.white.withOpacity(0.65), fontSize: 13)),
        Text(
          value,
          style: TextStyle(
            color: valueColor ?? Colors.white,
            fontSize: 13,
            fontWeight: isBold ? FontWeight.bold : FontWeight.w600,
          ),
        ),
      ],
    );
  }
}

