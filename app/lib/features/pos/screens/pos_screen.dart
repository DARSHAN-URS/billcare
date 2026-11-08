import 'package:flutter/material.dart';
import '../../core/state/ruvexi_state.dart';
import '../../core/theme/ruvexi_theme.dart';

class PosBillingScreen extends StatelessWidget {
  final RuvexiAppState appState;

  const PosBillingScreen({super.key, required this.appState});

  void _showCheckoutDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: RuvexiTheme.card,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Select Settlement Method", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
            const SizedBox(height: 16),
            ListTile(
              leading: const Icon(Icons.qr_code, color: RuvexiTheme.primaryAccent),
              title: const Text("UPI Counter QR (Instant)", style: TextStyle(color: Colors.white)),
              subtitle: const Text("Google Pay, PhonePe, Paytm", style: TextStyle(color: RuvexiTheme.textMuted, fontSize: 12)),
              onTap: () {
                appState.completeCheckout("UPI");
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Payment of ₹${""} received via UPI QR!"), backgroundColor: RuvexiTheme.primaryAccent),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.credit_card, color: Colors.blueAccent),
              title: const Text("Card Swipe / POS Terminal", style: TextStyle(color: Colors.white)),
              subtitle: const Text("Visa, MasterCard, RuPay", style: TextStyle(color: RuvexiTheme.textMuted, fontSize: 12)),
              onTap: () {
                appState.completeCheckout("Card");
                Navigator.pop(ctx);
              },
            ),
            ListTile(
              leading: const Icon(Icons.money, color: RuvexiTheme.goldAccent),
              title: const Text("Cash Payment", style: TextStyle(color: Colors.white)),
              subtitle: const Text("Direct Register Cash Entry", style: TextStyle(color: RuvexiTheme.textMuted, fontSize: 12)),
              onTap: () {
                appState.completeCheckout("Cash");
                Navigator.pop(ctx);
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("POS Counter Checkout", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline, color: Colors.redAccent),
            onPressed: () => appState.clearCart(),
            tooltip: "Clear Register",
          )
        ],
      ),
      body: ListenableBuilder(
        listenable: appState,
        builder: (context, _) {
          return Row(
            children: [
              // Catalog (Services / Products)
              Expanded(
                flex: 6,
                child: ListView.builder(
                  padding: const EdgeInsets.all(12),
                  itemCount: appState.catalog.length,
                  itemBuilder: (context, idx) {
                    final item = appState.catalog[idx];
                    return Card(
                      color: RuvexiTheme.card,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: const BorderSide(color: RuvexiTheme.border),
                      ),
                      margin: const EdgeInsets.only(bottom: 8),
                      child: ListTile(
                        title: Text(item.name, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 14)),
                        subtitle: Text("${item.category} • ${item.durationMinutes} min", style: const TextStyle(color: RuvexiTheme.textMuted, fontSize: 12)),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text("₹${item.price.toStringAsFixed(0)}", style: const TextStyle(color: RuvexiTheme.primaryAccent, fontWeight: FontWeight.bold, fontSize: 15)),
                            const SizedBox(width: 8),
                            IconButton(
                              icon: const Icon(Icons.add_circle, color: RuvexiTheme.primaryAccent),
                              onPressed: () => appState.addToCart(item),
                            )
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),

              // Register Order Summary
              Expanded(
                flex: 4,
                child: Container(
                  decoration: const BoxDecoration(
                    color: Color(0xFF101014),
                    border: Border(left: BorderSide(color: RuvexiTheme.border)),
                  ),
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text("Active Bill", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                      const Divider(color: RuvexiTheme.border),
                      Expanded(
                        child: appState.posCart.isEmpty
                            ? const Center(
                                child: Text("Tap services to bill", style: TextStyle(color: RuvexiTheme.textSecondary, fontSize: 12)),
                              )
                            : ListView.builder(
                                itemCount: appState.posCart.length,
                                itemBuilder: (context, idx) {
                                  final cartItem = appState.posCart[idx];
                                  return Padding(
                                    padding: const EdgeInsets.symmetric(vertical: 4),
                                    child: Row(
                                      children: [
                                        Expanded(
                                          child: Text(
                                            "${cartItem.quantity}x ${cartItem.service.name}",
                                            style: const TextStyle(fontSize: 12, color: Colors.white),
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                        Text("₹${(cartItem.service.price * cartItem.quantity).toStringAsFixed(0)}", style: const TextStyle(fontSize: 12, color: RuvexiTheme.primaryAccent)),
                                      ],
                                    ),
                                  );
                                },
                              ),
                      ),
                      const Divider(color: RuvexiTheme.border),
                      _buildRow("Subtotal", "₹${appState.cartSubtotal.toStringAsFixed(0)}"),
                      const SizedBox(height: 4),
                      _buildRow("GST (18%)", "₹${appState.cartTax.toStringAsFixed(0)}"),
                      const SizedBox(height: 6),
                      _buildRow(
                        "Total",
                        "₹${appState.cartGrandTotal.toStringAsFixed(0)}",
                        isTotal: true,
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        height: 44,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: appState.posCart.isEmpty ? Colors.grey : RuvexiTheme.primaryAccent,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          ),
                          onPressed: appState.posCart.isEmpty ? null : () => _showCheckoutDialog(context),
                          child: const Text("Charge & Settle", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 13)),
                        ),
                      )
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildRow(String label, String value, {bool isTotal = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(fontSize: isTotal ? 14 : 12, fontWeight: isTotal ? FontWeight.bold : FontWeight.normal, color: isTotal ? Colors.white : RuvexiTheme.textMuted)),
        Text(value, style: TextStyle(fontSize: isTotal ? 16 : 12, fontWeight: isTotal ? FontWeight.bold : FontWeight.normal, color: isTotal ? RuvexiTheme.goldAccent : Colors.white)),
      ],
    );
  }
}

