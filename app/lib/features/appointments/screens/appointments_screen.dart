import 'package:flutter/material.dart';
import '../../core/state/ruvexi_state.dart';
import '../../core/theme/ruvexi_theme.dart';

class AppointmentsCalendarScreen extends StatelessWidget {
  final RuvexiAppState appState;

  const AppointmentsCalendarScreen({super.key, required this.appState});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Appointments & Calendar", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
      ),
      body: ListenableBuilder(
        listenable: appState,
        builder: (context, _) {
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: appState.appointments.length,
            itemBuilder: (context, idx) {
              final appt = appState.appointments[idx];
              final timeStr = "${appt.time.hour.toString().padLeft(2, '0')}:${appt.time.minute.toString().padLeft(2, '0')}";
              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: RuvexiTheme.card,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: RuvexiTheme.border),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: RuvexiTheme.surface,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: RuvexiTheme.border),
                      ),
                      child: Column(
                        children: [
                          const Icon(Icons.access_time, size: 16, color: RuvexiTheme.primaryAccent),
                          const SizedBox(height: 4),
                          Text(timeStr, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white)),
                        ],
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(appt.customerName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white)),
                          const SizedBox(height: 2),
                          Text(appt.serviceName, style: const TextStyle(color: RuvexiTheme.textMuted, fontSize: 13)),
                          const SizedBox(height: 4),
                          Text("Stylist: ${appt.staffName}", style: const TextStyle(color: RuvexiTheme.textSecondary, fontSize: 12)),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text("₹${appt.price.toStringAsFixed(0)}", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: RuvexiTheme.goldAccent)),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: RuvexiTheme.primaryAccent.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(appt.status, style: const TextStyle(color: RuvexiTheme.primaryAccent, fontSize: 11, fontWeight: FontWeight.bold)),
                        )
                      ],
                    )
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}

