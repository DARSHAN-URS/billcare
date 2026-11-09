import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';

class InventoryScreen extends StatelessWidget {
  final RuvexiAppState appState;

  const InventoryScreen({super.key, required this.appState});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Stock & Inventory OS", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
      ),
      body: ListenableBuilder(
        listenable: appState,
        builder: (context, _) {
          final items = appState.inventory;
          final lowStockCount = items.where((i) => i.stock <= i.minAlert).length;

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Low stock alert banner
              if (lowStockCount > 0)
                Container(
                  margin: const EdgeInsets.all(16),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.amber.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.amber.withOpacity(0.4)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.warning_amber_rounded, color: Colors.amber),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          "$lowStockCount items below critical re-order threshold! Restock required.",
                          style: const TextStyle(color: Colors.amber, fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                ),
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: items.length,
                  itemBuilder: (context, idx) {
                    final item = items[idx];
                    final isLow = item.stock <= item.minAlert;

                    return Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: RuvexiTheme.card,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isLow ? Colors.redAccent.withOpacity(0.5) : RuvexiTheme.border,
                        ),
                      ),
                      child: Row(
                        children: [
                          CircleAvatar(
                            backgroundColor: isLow ? Colors.redAccent.withOpacity(0.15) : RuvexiTheme.surface,
                            child: Icon(
                              Icons.inventory_2_outlined,
                              color: isLow ? Colors.redAccent : RuvexiTheme.primaryAccent,
                              size: 20,
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(item.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white)),
                                const SizedBox(height: 2),
                                Text("${item.category} • Min. threshold: ${item.minAlert} ${item.unit}", style: TextStyle(color: RuvexiTheme.textMuted, fontSize: 12)),
                              ],
                            ),
                          ),
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              IconButton(
                                icon: const Icon(Icons.remove_circle_outline, size: 20, color: Colors.white70),
                                onPressed: () => appState.adjustStock(item.id, -1),
                              ),
                              Text(
                                "${item.stock}",
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                  color: isLow ? Colors.redAccent : Colors.white,
                                ),
                              ),
                              IconButton(
                                icon: const Icon(Icons.add_circle_outline, size: 20, color: RuvexiTheme.primaryAccent),
                                onPressed: () => appState.adjustStock(item.id, 1),
                              ),
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
}

