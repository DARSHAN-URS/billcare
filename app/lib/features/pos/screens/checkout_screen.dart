import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';
import 'package:ruvexi_mobile/features/pos/screens/payment_screen.dart';

class CheckoutScreen extends StatefulWidget {
  final RuvexiAppState appState;

  const CheckoutScreen({super.key, required this.appState});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  // Local checkout items if cart was empty or customized
  List<Map<String, dynamic>> _items = [
    {"name": "Hair Cut", "price": 399.0, "qty": 1},
    {"name": "Hair Spa", "price": 1199.0, "qty": 1},
  ];

  @override
  void initState() {
    super.initState();
    if (widget.appState.posCart.isNotEmpty) {
      _items = widget.appState.posCart.map((c) => {
        "name": c.service.name,
        "price": c.service.price,
        "qty": c.quantity,
      }).toList();
    }
  }

  double get _subtotal => _items.fold(0.0, (sum, i) => sum + ((i["price"] as double) * (i["qty"] as int)));
  double get _discount => _subtotal * 0.10;
  double get _tax => (_subtotal - _discount) * 0.18;
  double get _totalPayable => _subtotal - _discount + _tax;

  void _addMoreServices() {
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
                subtitle: Text("₹${s.price.toInt()}", style: TextStyle(color: Colors.white.withOpacity(0.5))),
                trailing: const Icon(Icons.add_circle_outline, color: Color(0xFF22C55E)),
                onTap: () {
                  setState(() {
                    final existingIdx = _items.indexWhere((i) => i["name"] == s.name);
                    if (existingIdx >= 0) {
                      _items[existingIdx]["qty"] = (_items[existingIdx]["qty"] as int) + 1;
                    } else {
                      _items.add({"name": s.name, "price": s.price, "qty": 1});
                    }
                  });
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
    final customer = widget.appState.posSelectedCustomer ?? widget.appState.customers.first;

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
          "Checkout",
          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Customer Bar
            Container(
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
                    backgroundColor: const Color(0xFF312E81),
                    child: Text(
                      customer.name.substring(0, 1),
                      style: const TextStyle(color: Color(0xFFA5B4FC), fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          customer.name,
                          style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          customer.phone,
                          style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right, color: Colors.white38, size: 20),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Services Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Services (${_items.length})",
                  style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                ),
                GestureDetector(
                  onTap: _addMoreServices,
                  child: const Text(
                    "Add More",
                    style: TextStyle(color: Color(0xFF22C55E), fontSize: 13, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Items List
            ...List.generate(_items.length, (index) {
              final item = _items[index];
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
                    const Icon(Icons.content_cut, color: Color(0xFF22C55E), size: 18),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            item["name"] as String,
                            style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            "₹${(item["price"] as double).toInt()}",
                            style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                    // Stepper
                    Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFF141815),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.white.withOpacity(0.1)),
                      ),
                      child: Row(
                        children: [
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                if ((item["qty"] as int) > 1) {
                                  item["qty"] = (item["qty"] as int) - 1;
                                } else {
                                  _items.removeAt(index);
                                }
                              });
                            },
                            child: const Padding(
                              padding: EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              child: Text("-", style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                            ),
                          ),
                          Text(
                            "${item["qty"]}",
                            style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                          ),
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                item["qty"] = (item["qty"] as int) + 1;
                              });
                            },
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
            const SizedBox(height: 16),

            // Summary Breakdown
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: const Color(0xFF101311),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: Column(
                children: [
                  _buildSummaryRow("Subtotal", "₹${_subtotal.toInt()}"),
                  const SizedBox(height: 10),
                  _buildSummaryRow("Discount (10%)", "-₹${_discount.toInt()}", valueColor: const Color(0xFF22C55E)),
                  const SizedBox(height: 10),
                  _buildSummaryRow("Tax (18%)", "₹${_tax.toInt()}"),
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
                        "₹${_totalPayable.toInt()}",
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
            const SizedBox(height: 32),

            // Proceed to Payment Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => PaymentScreen(
                        appState: widget.appState,
                        amount: _totalPayable,
                        customerName: customer.name,
                      ),
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
          ],
        ),
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
