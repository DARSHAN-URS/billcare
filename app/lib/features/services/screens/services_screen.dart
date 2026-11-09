import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';

class ServicesPricingScreen extends StatefulWidget {
  final RuvexiAppState appState;

  const ServicesPricingScreen({super.key, required this.appState});

  @override
  State<ServicesPricingScreen> createState() => _ServicesPricingScreenState();
}

class _ServicesPricingScreenState extends State<ServicesPricingScreen> {
  int _selectedTab = 0; // 0: Services, 1: Packages
  int _selectedCategoryIndex = 0; // 0: All, 1: Hair, 2: Skin, 3: Beard, 4: Spa

  final List<String> _categories = ["All", "Hair", "Skin", "Beard", "Spa"];

  void _showAddServiceDialog() {
    final nameCtrl = TextEditingController();
    final priceCtrl = TextEditingController();
    final durationCtrl = TextEditingController(text: "30");
    String category = "Hair";

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) => AlertDialog(
          backgroundColor: const Color(0xFF101311),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(18),
            side: const BorderSide(color: Color(0xFF22C55E), width: 1),
          ),
          title: const Text("Add New Service", style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameCtrl,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  hintText: "Service Name",
                  hintStyle: TextStyle(color: Colors.white.withOpacity(0.4)),
                  filled: true,
                  fillColor: const Color(0xFF141815),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: priceCtrl,
                keyboardType: TextInputType.number,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  hintText: "Price (₹)",
                  hintStyle: TextStyle(color: Colors.white.withOpacity(0.4)),
                  filled: true,
                  fillColor: const Color(0xFF141815),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: durationCtrl,
                keyboardType: TextInputType.number,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  hintText: "Duration (minutes)",
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
                if (nameCtrl.text.isNotEmpty && priceCtrl.text.isNotEmpty) {
                  final newSvc = ServiceItem(
                    id: "s_${DateTime.now().millisecondsSinceEpoch}",
                    name: nameCtrl.text.trim(),
                    category: category,
                    price: double.tryParse(priceCtrl.text) ?? 499.0,
                    durationMinutes: int.tryParse(durationCtrl.text) ?? 30,
                  );
                  widget.appState.addService(newSvc);
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("${newSvc.name} added to catalog")),
                  );
                }
              },
              child: const Text("Save Service", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
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
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Services",
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
              // Tabs: Services, Packages
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                child: Row(
                  children: [
                    _buildTab(0, "Services"),
                    const SizedBox(width: 10),
                    _buildTab(1, "Packages"),
                  ],
                ),
              ),

              // Category chips
              if (_selectedTab == 0) ...[
                const SizedBox(height: 8),
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
              ],
              const SizedBox(height: 14),

              // Service items or Package items
              Expanded(
                child: _selectedTab == 0 ? _buildServicesList() : _buildPackagesList(),
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
            onPressed: _showAddServiceDialog,
            icon: const Icon(Icons.add, color: Colors.black, size: 20),
            label: Text(
              _selectedTab == 0 ? "Add Service" : "Create Package",
              style: const TextStyle(color: Colors.black, fontSize: 15, fontWeight: FontWeight.bold),
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

  Widget _buildTab(int index, String label) {
    final isSelected = _selectedTab == index;
    return GestureDetector(
      onTap: () => setState(() => _selectedTab = index),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 7),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF22C55E) : const Color(0xFF101311),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? Colors.transparent : Colors.white.withOpacity(0.08),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.black : Colors.white70,
            fontSize: 12,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
          ),
        ),
      ),
    );
  }

  Widget _buildServicesList() {
    final selectedCat = _categories[_selectedCategoryIndex];
    final list = widget.appState.catalog.where((s) {
      if (selectedCat == "All") return true;
      return s.category.toLowerCase() == selectedCat.toLowerCase();
    }).toList();

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 90),
      itemCount: list.length,
      itemBuilder: (context, index) {
        final item = list[index];
        return Container(
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
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: const Color(0xFF181D1A),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.content_cut, color: Color(0xFF22C55E), size: 18),
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
                      "₹${item.price.toInt()}",
                      style: const TextStyle(color: Color(0xFF22C55E), fontSize: 13, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
              Text(
                "${item.durationMinutes} min",
                style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12),
              ),
              const SizedBox(width: 6),
              const Icon(Icons.chevron_right, color: Colors.white38, size: 18),
            ],
          ),
        );
      },
    );
  }

  Widget _buildPackagesList() {
    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 90),
      itemCount: widget.appState.packages.length,
      itemBuilder: (context, index) {
        final pkg = widget.appState.packages[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFF101311),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withOpacity(0.08)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(pkg.title, style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
                  Text("₹${pkg.price.toInt()}", style: const TextStyle(color: Color(0xFF22C55E), fontSize: 16, fontWeight: FontWeight.bold)),
                ],
              ),
              const SizedBox(height: 6),
              Text(pkg.description, style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12)),
              const SizedBox(height: 10),
              Wrap(
                spacing: 6,
                runSpacing: 6,
                children: pkg.servicesIncluded.map((s) => Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFF141815),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: Colors.white.withOpacity(0.08)),
                  ),
                  child: Text(s, style: const TextStyle(color: Colors.white70, fontSize: 10)),
                )).toList(),
              ),
            ],
          ),
        );
      },
    );
  }
}
