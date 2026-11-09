import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';

class InventoryScreen extends StatefulWidget {
  final RuvexiAppState appState;

  const InventoryScreen({super.key, required this.appState});

  @override
  State<InventoryScreen> createState() => _InventoryScreenState();
}

class _InventoryScreenState extends State<InventoryScreen> {
  int _selectedCategoryIndex = 0; // 0: All, 1: Hair Care, 2: Skin Care, 3: Tools
  String _searchQuery = "";
  final TextEditingController _searchController = TextEditingController();

  final List<String> _categories = ["All", "Hair Care", "Skin Care", "Tools"];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showAddItemDialog() {
    final nameCtrl = TextEditingController();
    final volumeCtrl = TextEditingController(text: "250 ml");
    final stockCtrl = TextEditingController(text: "20");
    String category = "Hair Care";

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF101311),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: const BorderSide(color: Color(0xFF22C55E), width: 1),
        ),
        title: const Text("Add Inventory Item", style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameCtrl,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: "Product Name",
                hintStyle: TextStyle(color: Colors.white.withOpacity(0.4)),
                filled: true,
                fillColor: const Color(0xFF141815),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: volumeCtrl,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: "Size / Volume (e.g. 500 ml)",
                hintStyle: TextStyle(color: Colors.white.withOpacity(0.4)),
                filled: true,
                fillColor: const Color(0xFF141815),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: stockCtrl,
              keyboardType: TextInputType.number,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: "Initial Stock Units",
                hintStyle: TextStyle(color: Colors.white.withOpacity(0.4)),
                filled: true,
                fillColor: const Color(0xFF141815),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text("Cancel", style: TextStyle(color: Colors.white54)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF22C55E)),
            onPressed: () {
              if (nameCtrl.text.isNotEmpty) {
                final newItem = InventoryItem(
                  id: "inv_${DateTime.now().millisecondsSinceEpoch}",
                  name: nameCtrl.text.trim(),
                  sizeVolume: volumeCtrl.text.trim(),
                  category: category,
                  stock: int.tryParse(stockCtrl.text) ?? 10,
                  minAlert: 8,
                );
                widget.appState.addInventoryItem(newItem);
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text("${newItem.name} added to stock")),
                );
              }
            },
            child: const Text("Add to Stock", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  void _showAdjustStockSheet(InventoryItem item) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF101311),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (context, setSheetState) => Padding(
          padding: const EdgeInsets.all(22),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(item.name, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text("${item.sizeVolume} • ${item.category}", style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12)),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  IconButton(
                    icon: const Icon(Icons.remove_circle_outline, color: Colors.white70, size: 32),
                    onPressed: () {
                      if (item.stock > 0) {
                        setSheetState(() => item.stock -= 1);
                        setState(() {});
                      }
                    },
                  ),
                  const SizedBox(width: 24),
                  Text(
                    "${item.stock}",
                    style: const TextStyle(color: Color(0xFF22C55E), fontSize: 28, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(width: 24),
                  IconButton(
                    icon: const Icon(Icons.add_circle_outline, color: Color(0xFF22C55E), size: 32),
                    onPressed: () {
                      setSheetState(() => item.stock += 1);
                      setState(() {});
                    },
                  ),
                ],
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF22C55E)),
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text("Update Stock", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
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
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Inventory",
          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.search, color: Colors.white70, size: 20),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.notifications_outlined, color: Colors.white70, size: 20),
            onPressed: () {},
          ),
        ],
      ),
      body: ListenableBuilder(
        listenable: widget.appState,
        builder: (context, _) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 2 Top metric cards: Total Items (1,248) and Low Stock (12)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                child: Row(
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
                            const Icon(Icons.inventory_2_outlined, color: Color(0xFF22C55E), size: 22),
                            const SizedBox(height: 10),
                            Text(
                              "${widget.appState.totalInventoryItemsCount}",
                              style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              "Total Items",
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
                            const Icon(Icons.warning_amber_rounded, color: Color(0xFFF59E0B), size: 22),
                            const SizedBox(height: 10),
                            Text(
                              "${widget.appState.lowStockInventoryCount}",
                              style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              "Low Stock",
                              style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Search Bar
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
                child: Container(
                  height: 44,
                  decoration: BoxDecoration(
                    color: const Color(0xFF101311),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white.withOpacity(0.08)),
                  ),
                  child: TextField(
                    controller: _searchController,
                    onChanged: (val) => setState(() => _searchQuery = val.toLowerCase()),
                    style: const TextStyle(color: Colors.white, fontSize: 13),
                    decoration: InputDecoration(
                      prefixIcon: const Icon(Icons.search, color: Colors.white38, size: 18),
                      hintText: "Search product or brand",
                      hintStyle: TextStyle(color: Colors.white.withOpacity(0.35), fontSize: 13),
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 8),

              // Category chips
              SizedBox(
                height: 38,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  itemCount: _categories.length,
                  itemBuilder: (context, index) {
                    final cat = _categories[index];
                    final isSelected = _selectedCategoryIndex == index;
                    return GestureDetector(
                      onTap: () => setState(() => _selectedCategoryIndex = index),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 7),
                        margin: const EdgeInsets.only(right: 8),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFF22C55E) : const Color(0xFF101311),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: isSelected ? Colors.transparent : Colors.white.withOpacity(0.08),
                          ),
                        ),
                        child: Text(
                          cat,
                          style: TextStyle(
                            color: isSelected ? Colors.black : Colors.white70,
                            fontSize: 12,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 12),

              // Product List
              Expanded(
                child: _buildProductList(),
              ),
            ],
          );
        },
      ),
      bottomSheet: Container(
        color: const Color(0xFF060706),
        padding: const EdgeInsets.fromLTRB(20, 10, 20, 20),
        child: SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton.icon(
            onPressed: _showAddItemDialog,
            icon: const Icon(Icons.add, color: Colors.black, size: 20),
            label: const Text(
              "Add Item",
              style: TextStyle(color: Colors.black, fontSize: 15, fontWeight: FontWeight.bold),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF22C55E),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              elevation: 0,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildProductList() {
    final selectedCat = _categories[_selectedCategoryIndex];
    final items = widget.appState.inventory.where((item) {
      final matchesQuery = item.name.toLowerCase().contains(_searchQuery);
      if (!matchesQuery) return false;
      if (selectedCat == "All") return true;
      return item.category.toLowerCase() == selectedCat.toLowerCase();
    }).toList();

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 90),
      itemCount: items.length,
      itemBuilder: (context, index) {
        final item = items[index];
        final isLow = item.isLowStock;

        return GestureDetector(
          onTap: () => _showAdjustStockSheet(item),
          child: Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
            decoration: BoxDecoration(
              color: const Color(0xFF101311),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withOpacity(0.08)),
            ),
            child: Row(
              children: [
                Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    color: const Color(0xFF181D1A),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.inventory_2_outlined, color: Color(0xFF22C55E), size: 18),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.name,
                        style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        item.sizeVolume,
                        style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 12),
                      ),
                    ],
                  ),
                ),
                Text(
                  "Stock: ${item.stock}",
                  style: TextStyle(
                    color: isLow ? const Color(0xFFEF4444) : Colors.white70,
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(width: 8),
                const Icon(Icons.chevron_right, color: Colors.white38, size: 18),
              ],
            ),
          ),
        );
      },
    );
  }
}
