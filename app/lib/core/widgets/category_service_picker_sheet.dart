import 'package:flutter/material.dart';
import '../state/ruvexi_state.dart';

enum ServicePickerMode {
  singleSelect,
  multiSelect,
  addToCart,
}

class CategoryServicePickerSheet extends StatefulWidget {
  final List<ServiceItem> catalog;
  final ServicePickerMode mode;
  final String title;
  final ServiceItem? initiallySelected;
  final List<ServiceItem>? initiallySelectedList;
  final ValueChanged<ServiceItem>? onServiceSelected;
  final ValueChanged<List<ServiceItem>>? onMultiSubmit;
  final ValueChanged<ServiceItem>? onAddToCart;

  const CategoryServicePickerSheet({
    super.key,
    required this.catalog,
    this.mode = ServicePickerMode.singleSelect,
    this.title = "Select Category & Service",
    this.initiallySelected,
    this.initiallySelectedList,
    this.onServiceSelected,
    this.onMultiSubmit,
    this.onAddToCart,
  });

  static Future<ServiceItem?> showSingle({
    required BuildContext context,
    required List<ServiceItem> catalog,
    String title = "Select Service",
    ServiceItem? current,
  }) {
    return showModalBottomSheet<ServiceItem>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => CategoryServicePickerSheet(
        catalog: catalog,
        mode: ServicePickerMode.singleSelect,
        title: title,
        initiallySelected: current,
        onServiceSelected: (s) => Navigator.pop(ctx, s),
      ),
    );
  }

  static Future<List<ServiceItem>?> showMulti({
    required BuildContext context,
    required List<ServiceItem> catalog,
    String title = "Select Services",
    List<ServiceItem> selected = const [],
  }) {
    return showModalBottomSheet<List<ServiceItem>>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => CategoryServicePickerSheet(
        catalog: catalog,
        mode: ServicePickerMode.multiSelect,
        title: title,
        initiallySelectedList: selected,
        onMultiSubmit: (list) => Navigator.pop(ctx, list),
      ),
    );
  }

  static void showAddToCart({
    required BuildContext context,
    required List<ServiceItem> catalog,
    String title = "Add Service to Bill",
    required ValueChanged<ServiceItem> onAdd,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => CategoryServicePickerSheet(
        catalog: catalog,
        mode: ServicePickerMode.addToCart,
        title: title,
        onAddToCart: onAdd,
      ),
    );
  }

  @override
  State<CategoryServicePickerSheet> createState() => _CategoryServicePickerSheetState();
}

class _CategoryServicePickerSheetState extends State<CategoryServicePickerSheet> {
  String _selectedCategory = "All";
  String _searchQuery = "";
  final TextEditingController _searchCtrl = TextEditingController();
  late Set<String> _selectedIds;
  int _addedCount = 0;

  @override
  void initState() {
    super.initState();
    _selectedIds = {};
    if (widget.mode == ServicePickerMode.singleSelect && widget.initiallySelected != null) {
      _selectedIds.add(widget.initiallySelected!.id);
      _selectedCategory = widget.initiallySelected!.category;
    } else if (widget.mode == ServicePickerMode.multiSelect && widget.initiallySelectedList != null) {
      _selectedIds = widget.initiallySelectedList!.map((s) => s.id).toSet();
    }
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  List<String> get _categories {
    final set = <String>{};
    for (final s in widget.catalog) {
      final c = s.category.trim();
      if (c.isNotEmpty) set.add(c);
    }
    final sorted = set.toList()..sort();
    return ["All", ...sorted];
  }

  int _countForCategory(String cat) {
    if (cat == "All") return widget.catalog.length;
    return widget.catalog.where((s) => s.category.toLowerCase() == cat.toLowerCase()).length;
  }

  List<ServiceItem> get _filteredServices {
    return widget.catalog.where((s) {
      final matchesCategory =
          _selectedCategory == "All" || s.category.toLowerCase() == _selectedCategory.toLowerCase();
      final q = _searchQuery.toLowerCase();
      final matchesSearch = q.isEmpty ||
          s.name.toLowerCase().contains(q) ||
          s.category.toLowerCase().contains(q);
      return matchesCategory && matchesSearch;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;
    final categories = _categories;
    final services = _filteredServices;

    return Container(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.88,
      ),
      margin: EdgeInsets.only(bottom: bottomInset),
      decoration: const BoxDecoration(
        color: Color(0xFF101311),
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        border: Border(
          top: BorderSide(color: Color(0xFF22C55E), width: 1.5),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Drag handle
          Center(
            child: Container(
              margin: const EdgeInsets.only(top: 10, bottom: 8),
              width: 38,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.white24,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),

          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.title,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        "1. Choose Category  →  2. Pick Service (${widget.catalog.length} services)",
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.5),
                          fontSize: 11.5,
                        ),
                      ),
                    ],
                  ),
                ),
                if (widget.mode == ServicePickerMode.multiSelect)
                  ElevatedButton(
                    onPressed: () {
                      final selectedItems =
                          widget.catalog.where((s) => _selectedIds.contains(s.id)).toList();
                      if (widget.onMultiSubmit != null) {
                        widget.onMultiSubmit!(selectedItems);
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF22C55E),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                    child: Text(
                      "Done (${_selectedIds.length})",
                      style: const TextStyle(
                        color: Colors.black,
                        fontWeight: FontWeight.bold,
                        fontSize: 12.5,
                      ),
                    ),
                  )
                else if (widget.mode == ServicePickerMode.addToCart)
                  ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF22C55E),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                    child: Text(
                      _addedCount > 0 ? "Done ($_addedCount added)" : "Close",
                      style: const TextStyle(
                        color: Colors.black,
                        fontWeight: FontWeight.bold,
                        fontSize: 12.5,
                      ),
                    ),
                  )
                else
                  IconButton(
                    icon: const Icon(Icons.close_rounded, color: Colors.white54, size: 20),
                    onPressed: () => Navigator.pop(context),
                  ),
              ],
            ),
          ),

          // Search Box
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
            child: Container(
              height: 42,
              decoration: BoxDecoration(
                color: const Color(0xFF161A17),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: TextField(
                controller: _searchCtrl,
                style: const TextStyle(color: Colors.white, fontSize: 13),
                onChanged: (val) => setState(() => _searchQuery = val),
                decoration: InputDecoration(
                  hintText: "Search services in ${widget.catalog.length} items...",
                  hintStyle: TextStyle(color: Colors.white.withOpacity(0.35), fontSize: 13),
                  prefixIcon: const Icon(Icons.search_rounded, color: Color(0xFF22C55E), size: 18),
                  suffixIcon: _searchQuery.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear, color: Colors.white38, size: 16),
                          onPressed: () {
                            _searchCtrl.clear();
                            setState(() => _searchQuery = "");
                          },
                        )
                      : null,
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(vertical: 10),
                ),
              ),
            ),
          ),

          // Category Chips Bar (Horizontal Scroll)
          Container(
            height: 44,
            margin: const EdgeInsets.symmetric(vertical: 6),
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              itemCount: categories.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final cat = categories[index];
                final isSelected = _selectedCategory == cat;
                final count = _countForCategory(cat);

                return ChoiceChip(
                  label: Text(
                    cat == "All" ? "All ($count)" : "$cat ($count)",
                    style: TextStyle(
                      color: isSelected ? Colors.black : Colors.white.withOpacity(0.75),
                      fontSize: 12,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                    ),
                  ),
                  selected: isSelected,
                  selectedColor: const Color(0xFF22C55E),
                  backgroundColor: const Color(0xFF161A17),
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  side: BorderSide(
                    color: isSelected ? const Color(0xFF22C55E) : Colors.white.withOpacity(0.1),
                  ),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                  showCheckmark: false,
                  onSelected: (selected) {
                    if (selected) {
                      setState(() => _selectedCategory = cat);
                    }
                  },
                );
              },
            ),
          ),

          const Divider(color: Color(0xFF1E2420), height: 1),

          // Service Items List
          Expanded(
            child: services.isEmpty
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.spa_outlined, color: Colors.white.withOpacity(0.2), size: 40),
                          const SizedBox(height: 10),
                          Text(
                            "No services found",
                            style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 14),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            "Try choosing another category or clearing search filter.",
                            style: TextStyle(color: Colors.white.withOpacity(0.35), fontSize: 12),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.fromLTRB(20, 10, 20, 24),
                    itemCount: services.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 8),
                    itemBuilder: (context, index) {
                      final item = services[index];
                      final isSelected = _selectedIds.contains(item.id);

                      return InkWell(
                        onTap: () {
                          if (widget.mode == ServicePickerMode.singleSelect) {
                            if (widget.onServiceSelected != null) {
                              widget.onServiceSelected!(item);
                            }
                          } else if (widget.mode == ServicePickerMode.multiSelect) {
                            setState(() {
                              if (_selectedIds.contains(item.id)) {
                                _selectedIds.remove(item.id);
                              } else {
                                _selectedIds.add(item.id);
                              }
                            });
                          } else if (widget.mode == ServicePickerMode.addToCart) {
                            if (widget.onAddToCart != null) {
                              widget.onAddToCart!(item);
                              setState(() => _addedCount++);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text("Added ${item.name} to bill"),
                                  duration: const Duration(milliseconds: 900),
                                  backgroundColor: const Color(0xFF161A17),
                                  behavior: SnackBarBehavior.floating,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(10),
                                    side: const BorderSide(color: Color(0xFF22C55E)),
                                  ),
                                ),
                              );
                            }
                          }
                        },
                        borderRadius: BorderRadius.circular(14),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? const Color(0xFF182A1D)
                                : const Color(0xFF151916),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: isSelected
                                  ? const Color(0xFF22C55E)
                                  : Colors.white.withOpacity(0.06),
                              width: isSelected ? 1.5 : 1.0,
                            ),
                          ),
                          child: Row(
                            children: [
                              // Icon / Category initial
                              Container(
                                width: 38,
                                height: 38,
                                decoration: BoxDecoration(
                                  color: isSelected
                                      ? const Color(0xFF22C55E).withOpacity(0.2)
                                      : const Color(0xFF1E2420),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Center(
                                  child: Icon(
                                    _iconForCategory(item.category),
                                    color: const Color(0xFF22C55E),
                                    size: 18,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),

                              // Name + category + duration
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      item.name,
                                      style: TextStyle(
                                        color: isSelected ? Colors.white : Colors.white.withOpacity(0.92),
                                        fontSize: 13.5,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    const SizedBox(height: 3),
                                    Row(
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                                          decoration: BoxDecoration(
                                            color: const Color(0xFF22C55E).withOpacity(0.12),
                                            borderRadius: BorderRadius.circular(4),
                                          ),
                                          child: Text(
                                            item.category,
                                            style: const TextStyle(
                                              color: Color(0xFF22C55E),
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 6),
                                        Text(
                                          "•  ${item.durationMinutes} min",
                                          style: TextStyle(
                                            color: Colors.white.withOpacity(0.45),
                                            fontSize: 11,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),

                              // Price & Action
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    "₹${item.price.toInt()}",
                                    style: const TextStyle(
                                      color: Color(0xFF22C55E),
                                      fontSize: 15,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  if (widget.mode == ServicePickerMode.multiSelect)
                                    Icon(
                                      isSelected
                                          ? Icons.check_circle_rounded
                                          : Icons.radio_button_unchecked_rounded,
                                      color: isSelected
                                          ? const Color(0xFF22C55E)
                                          : Colors.white24,
                                      size: 18,
                                    )
                                  else if (widget.mode == ServicePickerMode.singleSelect)
                                    if (isSelected)
                                      const Icon(
                                        Icons.check_circle_rounded,
                                        color: Color(0xFF22C55E),
                                        size: 18,
                                      )
                                    else
                                      const SizedBox.shrink()
                                  else if (widget.mode == ServicePickerMode.addToCart)
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF22C55E),
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      child: const Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(Icons.add, size: 12, color: Colors.black),
                                          Text(
                                            "Add",
                                            style: TextStyle(
                                              color: Colors.black,
                                              fontSize: 11,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  IconData _iconForCategory(String category) {
    final c = category.toLowerCase();
    if (c.contains("wax")) return Icons.cleaning_services_rounded;
    if (c.contains("haircut") || c.contains("hair colour") || c.contains("hair")) return Icons.content_cut_rounded;
    if (c.contains("beard") || c.contains("shave") || c.contains("grooming")) return Icons.face_rounded;
    if (c.contains("nail")) return Icons.brush_rounded;
    if (c.contains("facial") || c.contains("clean-up") || c.contains("d-tan")) return Icons.spa_rounded;
    if (c.contains("spa") || c.contains("massage")) return Icons.self_improvement_rounded;
    if (c.contains("thread")) return Icons.gesture_rounded;
    return Icons.star_border_rounded;
  }
}

