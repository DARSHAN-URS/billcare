import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';

class AttendanceStaffScreen extends StatelessWidget {
  final RuvexiAppState appState;

  const AttendanceStaffScreen({super.key, required this.appState});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Staff Attendance & Payouts", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
      ),
      body: ListenableBuilder(
        listenable: appState,
        builder: (context, _) {
          final staffList = appState.staff;

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: staffList.length,
            itemBuilder: (context, idx) {
              final member = staffList[idx];
              final commissionAmt = member.todaySales * member.commissionRate;

              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: RuvexiTheme.card,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: member.isClockedIn ? RuvexiTheme.primaryAccent.withOpacity(0.3) : RuvexiTheme.border,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            CircleAvatar(
                              backgroundColor: member.isClockedIn ? RuvexiTheme.primaryAccent.withOpacity(0.15) : RuvexiTheme.surface,
                              child: Text(
                                member.staffName[0],
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: member.isClockedIn ? RuvexiTheme.primaryAccent : Colors.grey,
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(member.staffName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white)),
                                Text(member.role, style: TextStyle(color: RuvexiTheme.textMuted, fontSize: 12)),
                              ],
                            ),
                          ],
                        ),
                        // Clock In / Out Toggle Button
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: member.isClockedIn ? Colors.redAccent.withOpacity(0.15) : RuvexiTheme.primaryAccent,
                            foregroundColor: member.isClockedIn ? Colors.redAccent : Colors.black,
                            elevation: 0,
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          ),
                          onPressed: () => appState.toggleStaffClockIn(member.id),
                          child: Text(
                            member.isClockedIn ? "Clock Out" : "Clock In",
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                          ),
                        ),
                      ],
                    ),
                    const Divider(color: RuvexiTheme.border, height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildSubStat("Shift Check-In", member.checkInTime),
                        _buildSubStat("Today Sales", "₹${member.todaySales.toStringAsFixed(0)}"),
                        _buildSubStat("Commission (${(member.commissionRate * 100).toInt()}%)", "₹${commissionAmt.toStringAsFixed(0)}", isHighlight: true),
                      ],
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }

  Widget _buildSubStat(String label, String value, {bool isHighlight = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 10, color: RuvexiTheme.textSecondary)),
        const SizedBox(height: 2),
        Text(
          value,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.bold,
            color: isHighlight ? RuvexiTheme.goldAccent : Colors.white,
          ),
        ),
      ],
    );
  }
}

