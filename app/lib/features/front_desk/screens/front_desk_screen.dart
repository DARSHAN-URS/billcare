import 'package:flutter/material.dart';
import '../../core/state/ruvexi_state.dart';
import '../../core/theme/ruvexi_theme.dart';

class FrontDeskScreen extends StatelessWidget {
  final RuvexiAppState appState;

  const FrontDeskScreen({super.key, required this.appState});

  void _showAddWalkInDialog(BuildContext context) {
    final nameCtrl = TextEditingController();
    final serviceCtrl = TextEditingController(text: "Men's Haircut & Beard");
    final stylistCtrl = TextEditingController(text: "Vikram S.");

    showModalBottomSheet(
      context: context,
      backgroundColor: RuvexiTheme.card,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          left: 20,
          right: 20,
          top: 20,
          bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "New Walk-In Client",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: nameCtrl,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                labelText: "Client Name",
                labelStyle: const TextStyle(color: RuvexiTheme.textMuted),
                filled: true,
                fillColor: RuvexiTheme.surface,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: serviceCtrl,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                labelText: "Service Requested",
                labelStyle: const TextStyle(color: RuvexiTheme.textMuted),
                filled: true,
                fillColor: RuvexiTheme.surface,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: RuvexiTheme.primaryAccent,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                onPressed: () {
                  if (nameCtrl.text.isNotEmpty) {
                    appState.addWalkIn(nameCtrl.text, serviceCtrl.text, stylistCtrl.text);
                    Navigator.pop(ctx);
                  }
                },
                child: const Text("Add to Queue", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
              ),
            )
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Front Desk & Walk-Ins", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle, color: RuvexiTheme.primaryAccent, size: 28),
            onPressed: () => _showAddWalkInDialog(context),
          ),
        ],
      ),
      body: ListenableBuilder(
        listenable: appState,
        builder: (context, _) {
          final queue = appState.walkInQueue;
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Summary Banner
              Container(
                margin: const EdgeInsets.all(16),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: RuvexiTheme.card,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: RuvexiTheme.border),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildStat("Active in Chair", queue.where((q) => q.status == 'In Chair').length.toString(), RuvexiTheme.primaryAccent),
                    _buildStat("In Waitlist", queue.where((q) => q.status == 'Waiting').length.toString(), RuvexiTheme.goldAccent),
                    _buildStat("Avg. Wait", "12 min", Colors.white),
                  ],
                ),
              ),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Text("Live Floor Queue", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white)),
              ),
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: queue.length,
                  itemBuilder: (context, idx) {
                    final item = queue[idx];
                    final isInChair = item.status == 'In Chair';
                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: RuvexiTheme.surface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isInChair ? RuvexiTheme.primaryAccent.withOpacity(0.4) : RuvexiTheme.border,
                        ),
                      ),
                      child: Row(
                        children: [
                          CircleAvatar(
                            backgroundColor: isInChair ? RuvexiTheme.primaryAccent.withOpacity(0.15) : RuvexiTheme.border,
                            child: Icon(
                              isInChair ? Icons.content_cut : Icons.hourglass_top,
                              color: isInChair ? RuvexiTheme.primaryAccent : RuvexiTheme.goldAccent,
                              size: 20,
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(item.clientName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white)),
                                const SizedBox(height: 2),
                                Text(item.serviceName, style: const TextStyle(color: RuvexiTheme.textMuted, fontSize: 13)),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    const Icon(Icons.person, size: 13, color: RuvexiTheme.textSecondary),
                                    const SizedBox(width: 4),
                                    Text(item.assignedStylist, style: const TextStyle(color: RuvexiTheme.textSecondary, fontSize: 12)),
                                  ],
                                )
                              ],
                            ),
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: isInChair ? RuvexiTheme.primaryAccent.withOpacity(0.2) : RuvexiTheme.goldAccent.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  item.status,
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: isInChair ? RuvexiTheme.primaryAccent : RuvexiTheme.goldAccent,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 6),
                              Row(
                                children: [
                                  if (!isInChair)
                                    IconButton(
                                      icon: const Icon(Icons.check, size: 18, color: RuvexiTheme.primaryAccent),
                                      onPressed: () => appState.updateWalkInStatus(item.id, 'In Chair'),
                                      tooltip: "Seat in Chair",
                                    ),
                                  IconButton(
                                    icon: const Icon(Icons.done_all, size: 18, color: Colors.blueAccent),
                                    onPressed: () => appState.updateWalkInStatus(item.id, 'Done'),
                                    tooltip: "Complete Service",
                                  ),
                                ],
                              )
                            ],
                          )
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildStat(String label, String value, Color color) {
    return Column(
      children: [
        Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: color)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(fontSize: 12, color: RuvexiTheme.textMuted)),
      ],
    );
  }
}

