import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/shared/widgets/ruvexi_logo.dart';
import 'package:ruvexi_mobile/features/staff_portal/screens/staff_payment_screen.dart';

class StaffBillingScreen extends StatefulWidget {
  final RuvexiAppState appState;
  final bool showBackButton;
  final VoidCallback? onBack;

  const StaffBillingScreen({
    super.key,
    required this.appState,
    this.showBackButton = true,
    this.onBack,
  });

  @override
  State<StaffBillingScreen> createState() => _StaffBillingScreenState();
}

class _StaffBillingScreenState extends State<StaffBillingScreen> {
  double _discount = 100.0;

  @override
  void initState() {
    super.initState();
    // Ensure default cart matches Screen 6 if empty
    if (widget.appState.posCart.isEmpty) {
      widget.appState.posCart.addAll([
        CartItem(service: widget.appState.catalog[0], quantity: 1), // Hair Cut ₹399
        CartItem(service: widget.appState.catalog[1], quantity: 1), // Hair Spa ₹1199
      ]);
      widget.appState.posSelectedCustomer ??= widget.appState.customers.first;
    }
  }

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
            const Text("Select Customer", style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const CircleAvatar(
                backgroundColor: Color(0xFF181D1A),
                child: Icon(Icons.person_outline, color: Color(0xFF22C55E)),
              ),
              title: const Text("Walk-in Customer", style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
              onTap: () {
                widget.appState.setPosCustomer(null);
                Navigator.pop(ctx);
              },
            ),
            ...widget.appState.customers.take(5).map((c) => ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: CircleAvatar(
                    backgroundColor: const Color(0xFF2E2638),
                    child: Text(c.name[0], style: const TextStyle(color: Color(0xFFD8B4FE), fontWeight: FontWeight.bold)),
                  ),
                  title: Text(c.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                  subtitle: Text(c.phone, style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12)),
                  onTap: () {
                    widget.appState.setPosCustomer(c);
                    Navigator.pop(ctx);
                  },
                )),
          ],
        ),
      ),
    );
  }

  void _showAddServiceSheet() {
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
            const Text("Add Service to Bill", style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            ...widget.appState.catalog.map((s) => ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.content_cut, color: Color(0xFF22C55E), size: 20),
                  title: Text(s.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                  subtitle: Text("₹${s.price.toInt()} • ${s.durationMinutes} min", style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12)),
                  trailing: const Icon(Icons.add_circle_outline, color: Color(0xFF22C55E)),
                  onTap: () {
                    widget.appState.addServiceToCart(s);
                    Navigator.pop(ctx);
                  },
                )),
          ],
        ),
      ),
    );
  }

  void _editDiscountDialog() {
    final ctrl = TextEditingController(text: _discount.toInt().toString());
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF101311),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: Color(0xFF22C55E)),
        ),
        title: const Text("Apply Discount (₹)", style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
        content: TextField(
          controller: ctrl,
          keyboardType: TextInputType.number,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            filled: true,
            fillColor: const Color(0xFF141815),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text("Cancel", style: TextStyle(color: Colors.white54))),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF22C55E)),
            onPressed: () {
              setState(() {
                _discount = (double.tryParse(ctrl.text) ?? 0.0).clamp(0, 50000);
              });
              Navigator.pop(ctx);
            },
            child: const Text("Apply", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF060706),
      body: SafeArea(
        child: ListenableBuilder(
          listenable: widget.appState,
          builder: (context, _) {
            final customer = widget.appState.posSelectedCustomer;
            final customerName = customer?.name ?? "Walk-in Customer";
            final customerPhone = customer?.phone ?? "Tap to link customer";

            final subtotal = widget.appState.cartSubtotal;
            final appliedDiscount = _discount > subtotal ? 0.0 : _discount;
            final taxable = (subtotal - appliedDiscount).clamp(0.0, double.infinity);
            final tax = taxable * 0.18;
            final totalPayable = taxable + tax;

            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Bar
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 12, 16, 4),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const RuvexiLogoWidget(fontSize: 16, showSubtitle: true),
                      IconButton(
                        icon: const Icon(Icons.notifications_outlined, color: Colors.white70, size: 22),
                        onPressed: () {},
                      ),
                    ],
                  ),
                ),

                // Back + Title
                Padding(
                  padding: const EdgeInsets.fromLTRB(8, 4, 20, 12),
                  child: Row(
                    children: [
                      if (widget.showBackButton)
                        IconButton(
                          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
                          onPressed: () {
                            if (widget.onBack != null) {
                              widget.onBack!();
                            } else if (Navigator.canPop(context)) {
                              Navigator.pop(context);
                            }
                          },
                        )
                      else
                        const SizedBox(width: 12),
                      const Text(
                        "Billing (POS)",
                        style: TextStyle(color: Colors.white, fontSize: 19, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),

                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Customer Banner
                        GestureDetector(
                          onTap: _pickCustomer,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                            decoration: BoxDecoration(
                              color: const Color(0xFF101311),
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: Colors.white.withOpacity(0.08)),
                            ),
                            child: Row(
                              children: [
                                CircleAvatar(
                                  radius: 19,
                                  backgroundColor: const Color(0xFF312E81),
                                  child: Text(
                                    customerName[0],
                                    style: const TextStyle(color: Color(0xFFA5B4FC), fontWeight: FontWeight.bold, fontSize: 14),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(customerName, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                                      const SizedBox(height: 2),
                                      Text(customerPhone, style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 12)),
                                    ],
                                  ),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.close, color: Colors.white54, size: 18),
                                  onPressed: () => widget.appState.setPosCustomer(null),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Services Header + Add Service
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text("Services", style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
                            GestureDetector(
                              onTap: _showAddServiceSheet,
                              child: const Text("Add Service", style: TextStyle(color: Color(0xFF22C55E), fontSize: 13, fontWeight: FontWeight.bold)),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),

                        // Cart Items
                        if (widget.appState.posCart.isEmpty)
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: const Color(0xFF101311),
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: Colors.white.withOpacity(0.08)),
                            ),
                            child: Center(
                              child: Text("No services added. Tap 'Add Service' above.",
                                  style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12)),
                            ),
                          ),

                        ...widget.appState.posCart.map((cartItem) {
                          return Container(
                            margin: const EdgeInsets.only(bottom: 10),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                            decoration: BoxDecoration(
                              color: const Color(0xFF101311),
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: Colors.white.withOpacity(0.08)),
                            ),
                            child: Row(
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(cartItem.service.name, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                                      const SizedBox(height: 2),
                                      Text("₹${cartItem.service.price.toInt()}", style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12)),
                                    ],
                                  ),
                                ),
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
                                          child: Text("−", style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                                        ),
                                      ),
                                      Text("${cartItem.quantity}", style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                                      GestureDetector(
                                        onTap: () => widget.appState.updateCartQuantity(cartItem.service.id, 1),
                                        child: const Padding(
                                          padding: EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                          child: Text("+", style: TextStyle(color: Color(0xFF22C55E), fontSize: 14, fontWeight: FontWeight.bold)),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          );
                        }),
                        const SizedBox(height: 16),

                        // Financial Breakdown Card
                        Container(
                          padding: const EdgeInsets.all(18),
                          decoration: BoxDecoration(
                            color: const Color(0xFF101311),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.white.withOpacity(0.08)),
                          ),
                          child: Column(
                            children: [
                              _buildSummaryRow("Subtotal", "₹${subtotal.toInt()}"),
                              const SizedBox(height: 10),
                              GestureDetector(
                                onTap: _editDiscountDialog,
                                child: _buildSummaryRow("Discount (Tap to edit)", "-₹${appliedDiscount.toInt()}", valueColor: const Color(0xFF22C55E)),
                              ),
                              const SizedBox(height: 10),
                              _buildSummaryRow("Tax (18%)", "₹${tax.round()}"),
                              const Padding(
                                padding: EdgeInsets.symmetric(vertical: 12),
                                child: Divider(color: Color(0xFF1C221E), height: 1),
                              ),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text("Total Payable", style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
                                  Text(
                                    "₹${totalPayable.round()}",
                                    style: const TextStyle(color: Color(0xFF22C55E), fontSize: 18, fontWeight: FontWeight.bold),
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
                            onPressed: widget.appState.posCart.isEmpty
                                ? null
                                : () {
                                    final itemsList = widget.appState.posCart
                                        .map((c) => {
                                              "name": c.service.name,
                                              "price": c.service.price,
                                              "qty": c.quantity,
                                            })
                                        .toList();
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (_) => StaffPaymentScreen(
                                          appState: widget.appState,
                                          totalAmount: totalPayable.roundToDouble(),
                                          customerName: customerName,
                                          billedItems: itemsList,
                                        ),
                                      ),
                                    );
                                  },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF22C55E),
                              disabledBackgroundColor: Colors.white12,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                              elevation: 0,
                            ),
                            child: const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text("Proceed to Payment", style: TextStyle(color: Colors.black, fontSize: 15, fontWeight: FontWeight.bold)),
                                SizedBox(width: 8),
                                Icon(Icons.arrow_forward_rounded, color: Colors.black, size: 18),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {Color? valueColor}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(color: Colors.white.withOpacity(0.65), fontSize: 13)),
        Text(value, style: TextStyle(color: valueColor ?? Colors.white, fontSize: 13, fontWeight: FontWeight.w600)),
      ],
    );
  }
}
