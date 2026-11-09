import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';

class CustomersCrmScreen extends StatelessWidget {
  final RuvexiAppState appState;

  const CustomersCrmScreen({super.key, required this.appState});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Client Formulas & CRM", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
      ),
      body: ListenableBuilder(
        listenable: appState,
        builder: (context, _) {
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: appState.customers.length,
            itemBuilder: (context, idx) {
              final client = appState.customers[idx];
              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: RuvexiTheme.card,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: RuvexiTheme.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(client.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white)),
                        Text("${client.visitsCount} visits • ₹${client.totalSpent.toStringAsFixed(0)}", style: TextStyle(color: RuvexiTheme.goldAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text("${client.phone} • ${client.email}", style: TextStyle(color: RuvexiTheme.textMuted, fontSize: 12)),
                    if (client.formulaNotes != null) ...[
                      const SizedBox(height: 10),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: RuvexiTheme.surface,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: RuvexiTheme.border),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Icon(Icons.colorize, size: 14, color: RuvexiTheme.primaryAccent),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                client.formulaNotes!,
                                style: const TextStyle(color: Color(0xFFE4E4E7), fontSize: 12, height: 1.3),
                              ),
                            ),
                          ],
                        ),
                      )
                    ]
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

