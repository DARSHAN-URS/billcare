import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';

class OffersPackagesScreen extends StatefulWidget {
  final RuvexiAppState appState;

  const OffersPackagesScreen({super.key, required this.appState});

  @override
  State<OffersPackagesScreen> createState() => _OffersPackagesScreenState();
}

class _OffersPackagesScreenState extends State<OffersPackagesScreen> {
  int _selectedTab = 0; // 0: Offers, 1: Packages

  void _showCreateOfferDialog() {
    final titleCtrl = TextEditingController();
    final descCtrl = TextEditingController();
    final validityCtrl = TextEditingController(text: "01 Nov - 30 Nov 2026");

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF101311),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: const BorderSide(color: Color(0xFF22C55E), width: 1),
        ),
        title: const Text("Create Promotional Offer", style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: titleCtrl,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: "Offer Headline (e.g. Flat 25% Off)",
                hintStyle: TextStyle(color: Colors.white.withOpacity(0.4)),
                filled: true,
                fillColor: const Color(0xFF141815),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: descCtrl,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: "Valid on (e.g. On Hair Color & Spa)",
                hintStyle: TextStyle(color: Colors.white.withOpacity(0.4)),
                filled: true,
                fillColor: const Color(0xFF141815),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: validityCtrl,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: "Validity Date Range",
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
              if (titleCtrl.text.isNotEmpty) {
                widget.appState.addOffer(
                  OfferItem(
                    id: "off_${DateTime.now().millisecondsSinceEpoch}",
                    title: titleCtrl.text.trim(),
                    description: descCtrl.text.trim(),
                    validity: validityCtrl.text.trim(),
                    isActive: true,
                  ),
                );
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Campaign offer published")),
                );
              }
            },
            child: const Text("Publish Offer", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
          ),
        ],
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
          "Offers & Packages",
          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
      body: ListenableBuilder(
        listenable: widget.appState,
        builder: (context, _) {
          return Column(
            children: [
              // Tabs: Offers, Packages
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                child: Row(
                  children: [
                    _buildTab(0, "Offers"),
                    const SizedBox(width: 10),
                    _buildTab(1, "Packages"),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // Content
              Expanded(
                child: _selectedTab == 0 ? _buildOffersList() : _buildPackagesList(),
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
            onPressed: _showCreateOfferDialog,
            icon: const Icon(Icons.add, color: Colors.black, size: 20),
            label: Text(
              _selectedTab == 0 ? "Create Offer" : "Create Package",
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
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 7),
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

  Widget _buildOffersList() {
    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 90),
      itemCount: widget.appState.offers.length,
      itemBuilder: (context, index) {
        final offer = widget.appState.offers[index];
        return GestureDetector(
          onTap: () => widget.appState.toggleOfferStatus(offer.id),
          child: Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF101311),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withOpacity(0.08)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: const Color(0xFF181D1A),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.local_offer_outlined, color: Color(0xFF22C55E), size: 22),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              offer.title,
                              style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: offer.isActive ? const Color(0xFF122C1A) : const Color(0xFF1F2420),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              offer.isActive ? "Active" : "Inactive",
                              style: TextStyle(
                                color: offer.isActive ? const Color(0xFF22C55E) : Colors.white38,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        offer.description,
                        style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          const Icon(Icons.calendar_today_outlined, color: Colors.white38, size: 12),
                          const SizedBox(width: 6),
                          Text(
                            offer.validity,
                            style: TextStyle(color: Colors.white.withOpacity(0.45), fontSize: 11),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
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
