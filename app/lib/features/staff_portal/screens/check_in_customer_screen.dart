import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/shared/widgets/ruvexi_logo.dart';
import 'package:ruvexi_mobile/features/staff_portal/screens/seats_stations_screen.dart';
import 'package:ruvexi_mobile/features/staff_portal/screens/in_salon_screen.dart';

class CheckInCustomerScreen extends StatefulWidget {
  final RuvexiAppState appState;
  final String? preselectedSeatId;

  const CheckInCustomerScreen({
    super.key,
    required this.appState,
    this.preselectedSeatId,
  });

  @override
  State<CheckInCustomerScreen> createState() => _CheckInCustomerScreenState();
}

class _CheckInCustomerScreenState extends State<CheckInCustomerScreen> {
  final _nameCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _notesCtrl = TextEditingController();

  final List<ServiceItem> _selectedServices = [];
  String _assignedStaff = "Manoj K";
  String? _selectedSeatId;

  @override
  void initState() {
    super.initState();
    _selectedSeatId = widget.preselectedSeatId;
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _notesCtrl.dispose();
    super.dispose();
  }

  void _pickServices() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF101311),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) => Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text("Select Services", style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                  TextButton(
                    onPressed: () => Navigator.pop(ctx),
                    child: const Text("Done", style: TextStyle(color: Color(0xFF22C55E), fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Flexible(
                child: ListView(
                  shrinkWrap: true,
                  children: widget.appState.catalog.map((svc) {
                    final isSelected = _selectedServices.any((s) => s.id == svc.id);
                    return CheckboxListTile(
                      contentPadding: EdgeInsets.zero,
                      activeColor: const Color(0xFF22C55E),
                      checkColor: Colors.black,
                      value: isSelected,
                      title: Text(svc.name, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600)),
                      subtitle: Text("₹${svc.price.toInt()} • ${svc.durationMinutes} min", style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12)),
                      onChanged: (val) {
                        setModalState(() {
                          if (val == true) {
                            _selectedServices.add(svc);
                          } else {
                            _selectedServices.removeWhere((s) => s.id == svc.id);
                          }
                        });
                        setState(() {});
                      },
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _pickStaff() {
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
            const Text("Assign Staff", style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            ...widget.appState.staff.map((st) => ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: CircleAvatar(
                    backgroundColor: const Color(0xFF18221B),
                    child: Text(st.name[0], style: const TextStyle(color: Color(0xFF22C55E), fontWeight: FontWeight.bold)),
                  ),
                  title: Text(st.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                  subtitle: Text(st.role, style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12)),
                  trailing: _assignedStaff == st.name ? const Icon(Icons.check_circle, color: Color(0xFF22C55E)) : null,
                  onTap: () {
                    setState(() => _assignedStaff = st.name);
                    Navigator.pop(ctx);
                  },
                )),
          ],
        ),
      ),
    );
  }

  Future<void> _pickSeat() async {
    final chosenSeat = await Navigator.push<String>(
      context,
      MaterialPageRoute(
        builder: (_) => SeatsStationsScreen(
          appState: widget.appState,
          selectionMode: true,
        ),
      ),
    );
    if (chosenSeat != null) {
      setState(() => _selectedSeatId = chosenSeat);
    }
  }

  void _submitCheckIn() {
    final name = _nameCtrl.text.trim();
    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please enter Customer Name")),
      );
      return;
    }

    final servicesToAssign = _selectedServices.isNotEmpty
        ? List<ServiceItem>.from(_selectedServices)
        : [widget.appState.catalog.first];

    final seatToAssign = _selectedSeatId ?? "Waiting";

    widget.appState.checkInCustomer(
      customerName: name,
      phone: _phoneCtrl.text.trim(),
      services: servicesToAssign,
      assignedStaff: _assignedStaff,
      seatId: seatToAssign,
      notes: _notesCtrl.text.trim(),
    );

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("$name checked in to $seatToAssign")),
    );

    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (_) => InSalonScreen(appState: widget.appState),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final servicesLabel = _selectedServices.isEmpty
        ? "Select Services *"
        : _selectedServices.map((s) => s.name).join(" + ");

    return Scaffold(
      backgroundColor: const Color(0xFF060706),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top bar
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
                  IconButton(
                    icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
                    onPressed: () => Navigator.pop(context),
                  ),
                  const Text(
                    "Check-in Customer",
                    style: TextStyle(color: Colors.white, fontSize: 19, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
                child: Column(
                  children: [
                    // Customer Name *
                    _buildTextField(
                      controller: _nameCtrl,
                      icon: Icons.person_outline,
                      hint: "Customer Name *",
                    ),
                    const SizedBox(height: 12),

                    // Phone Number
                    _buildTextField(
                      controller: _phoneCtrl,
                      icon: Icons.phone_outlined,
                      hint: "Phone Number",
                      keyboardType: TextInputType.phone,
                    ),
                    const SizedBox(height: 12),

                    // Select Services *
                    _buildPickerTile(
                      icon: Icons.grid_view_rounded,
                      label: servicesLabel,
                      hasValue: _selectedServices.isNotEmpty,
                      onTap: _pickServices,
                    ),
                    const SizedBox(height: 12),

                    // Assign Staff (Optional)
                    _buildPickerTile(
                      icon: Icons.badge_outlined,
                      label: "Staff: $_assignedStaff",
                      hasValue: true,
                      onTap: _pickStaff,
                    ),
                    const SizedBox(height: 12),

                    // Select Seat / Station *
                    _buildPickerTile(
                      icon: Icons.chair_alt_outlined,
                      label: _selectedSeatId != null ? "Seat: $_selectedSeatId" : "Select Seat / Station *",
                      hasValue: _selectedSeatId != null,
                      onTap: _pickSeat,
                    ),
                    const SizedBox(height: 12),

                    // Notes (Optional)
                    _buildTextField(
                      controller: _notesCtrl,
                      icon: Icons.description_outlined,
                      hint: "Notes (Optional)",
                      maxLines: 2,
                    ),
                    const SizedBox(height: 28),

                    // Check-in Customer -> Button
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: _submitCheckIn,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF22C55E),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              "Check-in Customer",
                              style: TextStyle(color: Colors.black, fontSize: 15, fontWeight: FontWeight.bold),
                            ),
                            SizedBox(width: 8),
                            Icon(Icons.arrow_forward_rounded, color: Colors.black, size: 18),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required IconData icon,
    required String hint,
    TextInputType? keyboardType,
    int maxLines = 1,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF101311),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: TextField(
        controller: controller,
        keyboardType: keyboardType,
        maxLines: maxLines,
        style: const TextStyle(color: Colors.white, fontSize: 14),
        decoration: InputDecoration(
          prefixIcon: Icon(icon, color: Colors.white54, size: 20),
          hintText: hint,
          hintStyle: TextStyle(color: Colors.white.withOpacity(0.45), fontSize: 13.5),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
        ),
      ),
    );
  }

  Widget _buildPickerTile({
    required IconData icon,
    required String label,
    required bool hasValue,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        decoration: BoxDecoration(
          color: const Color(0xFF101311),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.white.withOpacity(0.08)),
        ),
        child: Row(
          children: [
            Icon(icon, color: Colors.white54, size: 20),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                label,
                style: TextStyle(
                  color: hasValue ? Colors.white : Colors.white.withOpacity(0.45),
                  fontSize: 13.5,
                  fontWeight: hasValue ? FontWeight.w600 : FontWeight.normal,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const Icon(Icons.chevron_right, color: Colors.white38, size: 20),
          ],
        ),
      ),
    );
  }
}
