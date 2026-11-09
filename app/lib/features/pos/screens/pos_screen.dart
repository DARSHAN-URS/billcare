import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';
import 'package:ruvexi_mobile/features/pos/screens/checkout_screen.dart';

class PosBillingScreen extends StatefulWidget {
  final RuvexiAppState appState;

  const PosBillingScreen({super.key, required this.appState});

  @override
  State<PosBillingScreen> createState() => _PosBillingScreenState();
}

class _PosBillingScreenState extends State<PosBillingScreen> {
  void _pickCustomer() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF101311),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Select Customer for Billing",
              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 14),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const CircleAvatar(
                backgroundColor: Color(0xFF1F2420),
                child: Icon(Icons.person_outline, color: Color(0xFF22C55E)),
              ),
              title: const Text("Walk-in Customer", style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
              trailing: widget.appState.posSelectedCustomer == null
                  ? const Icon(Icons.check_circle, color: Color(0xFF22C55E), size: 20)
                  : null,
              onTap: () {
                widget.appState.setPosCustomer(null);
                Navigator.pop(ctx);
              },
            ),
            ...widget.appState.customers.map(
              (c) => ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(
                  backgroundColor: const Color(0xFF1F2420),
                  child: Text(c.name[0], style: const TextStyle(color: Color(0xFF22C55E))),
                ),
                title: Text(c.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                subtitle: Text(c.phone, style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12)),
                trailing: widget.appState.posSelectedCustomer?.id == c.id
                    ? const Icon(Icons.check_circle, color: Color(0xFF22C55E), size: 20)
                    : null,
                onTap: () {
                  widget.appState.setPosCustomer(c);
                  Navigator.pop(ctx);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showAddMoreServices() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF101311),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Add Service to Bill",
              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 14),
            ...widget.appState.catalog.map(
              (s) => ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.content_cut, color: Color(0xFF22C55E)),
                title: Text(s.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                subtitle: Text("₹${s.price.toInt()} • ${s.durationMinutes} mins", style: TextStyle(color: Colors.white.withOpacity(0.5))),
                trailing: const Icon(Icons.add_circle_outline, color: Color(0xFF22C55E)),
                onTap: () {
                  widget.appState.addServiceToCart(s);
                  Navigator.pop(ctx);
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
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
          onPressed: () {
            // If in nested stack or back to home
            if (Navigator.canPop(context)) {
              Navigator.pop(context);
            }
          },
        ),
        title: const Text(
          "Billing (POS)",
          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.qr_code_scanner_rounded, color: Colors.white70, size: 20),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("Barcode & QR Scanner active")),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.receipt_long_outlined, color: Colors.white70, size: 20),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("Today's register: 18 bills closed")),
              );
            },
          ),
        ],
      ),
      body: ListenableBuilder(
        listenable: widget.appState,
        builder: (context, _) {
          final customer = widget.appState.posSelectedCustomer;
          final customerDisplayName = customer != null ? customer.name : "Walk-in Customer";
          final customerSub = customer != null ? customer.phone : "Tap to assign registered client";

          return SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Select Customer Card
                GestureDetector(
                  onTap: _pickCustomer,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      color: const Color(0xFF101311),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: Colors.white.withOpacity(0.08)),
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 18,
                          backgroundColor: const Color(0xFF1E2620),
                          child: const Icon(Icons.person_outline, color: Color(0xFF22C55E), size: 18),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Select Customer",
                                style: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 11),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                customerDisplayName,
                                style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.chevron_right, color: Colors.white38, size: 20),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Add Services Section Header
                const Text(
                  "Add Services",
                  style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),

                // Services in Cart
                ...widget.appState.posCart.map((cartItem) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFF101311),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: Colors.white.withOpacity(0.08)),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: const Color(0xFF181D1A),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(Icons.content_cut, color: Color(0xFF22C55E), size: 18),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                cartItem.service.name,
                                style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                "₹${cartItem.service.price.toInt()}",
                                style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12),
                              ),
                            ],
                          ),
                        ),
                        // Stepper [- 1 +]
                        Container(
                          decoration: BoxDecoration(
                            color: const Color(0xFF141815),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.white.withOpacity(0.1)),
                          ),
                          child: Row(
                            children: [
                              GestureDetector(
                                onTap: () => widget.appState.updateCartQuantity(cartItem.service.id, -1),
                                child: const Padding(
                                  padding: EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  child: Text("-", style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                                ),
                              ),
                              Text(
                                "${cartItem.quantity}",
                                style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                              ),
                              GestureDetector(
                                onTap: () => widget.appState.updateCartQuantity(cartItem.service.id, 1),
                                child: const Padding(
                                  padding: EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  child: Text("+", style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                }),

                // Add More Services button
                Center(
                  child: TextButton.icon(
                    onPressed: _showAddMoreServices,
                    icon: const Icon(Icons.add, color: Color(0xFF22C55E), size: 16),
                    label: const Text(
                      "Add More Services",
                      style: TextStyle(color: Color(0xFF22C55E), fontSize: 13, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Financial Summary Card
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: const Color(0xFF101311),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.white.withOpacity(0.08)),
                  ),
                  child: Column(
                    children: [
                      _buildSummaryRow("Subtotal", "₹${widget.appState.cartSubtotal.toInt()}"),
                      const SizedBox(height: 10),
                      _buildSummaryRow("Discount", "-₹${widget.appState.discountAmount.toInt()}", valueColor: const Color(0xFF22C55E)),
                      const SizedBox(height: 10),
                      _buildSummaryRow("Tax (18%)", "₹${widget.appState.cartTax.toInt()}"),
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 12),
                        child: Divider(color: Color(0xFF1C221E), height: 1),
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            "Total Payable",
                            style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                          ),
                          Text(
                            "₹${widget.appState.cartTotalPayable.toInt()}",
                            style: const TextStyle(
                              color: Color(0xFF22C55E),
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Proceed to Payment Button
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => CheckoutScreen(appState: widget.appState),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF22C55E),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      elevation: 0,
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "Proceed to Payment",
                          style: TextStyle(color: Colors.black, fontSize: 15, fontWeight: FontWeight.bold),
                        ),
                        SizedBox(width: 8),
                        Icon(Icons.arrow_forward_rounded, color: Colors.black, size: 18),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 30),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {Color? valueColor}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(color: Colors.white.withOpacity(0.65), fontSize: 13),
        ),
        Text(
          value,
          style: TextStyle(color: valueColor ?? Colors.white, fontSize: 13, fontWeight: FontWeight.w600),
        ),
      ],
    );
  }
}
