import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';

class NewAppointmentScreen extends StatefulWidget {
  final RuvexiAppState appState;

  const NewAppointmentScreen({super.key, required this.appState});

  @override
  State<NewAppointmentScreen> createState() => _NewAppointmentScreenState();
}

class _NewAppointmentScreenState extends State<NewAppointmentScreen> {
  int _selectedTypeIndex = 1; // 0: Walk-in, 1: Appointment, 2: Block
  Customer? _selectedCustomer;
  ServiceItem? _selectedService;
  StaffMember? _selectedStaff;
  DateTime _selectedDate = DateTime(2026, 11, 9, 11, 30);
  final TextEditingController _notesController = TextEditingController();

  @override
  void initState() {
    super.initState();
    if (widget.appState.customers.isNotEmpty) {
      _selectedCustomer = widget.appState.customers.first;
    }
    if (widget.appState.catalog.isNotEmpty) {
      _selectedService = widget.appState.catalog.first;
    }
    if (widget.appState.staff.isNotEmpty) {
      _selectedStaff = widget.appState.staff.first;
    }
  }

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
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
            const Text(
              "Select Customer",
              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 14),
            ...widget.appState.customers.map(
              (c) => ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(
                  backgroundColor: const Color(0xFF1F2420),
                  child: Text(c.name[0], style: const TextStyle(color: RuvexiTheme.primaryAccent)),
                ),
                title: Text(c.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                subtitle: Text(c.phone, style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12)),
                trailing: _selectedCustomer?.id == c.id
                    ? const Icon(Icons.check_circle, color: RuvexiTheme.primaryAccent, size: 20)
                    : null,
                onTap: () {
                  setState(() => _selectedCustomer = c);
                  Navigator.pop(ctx);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _pickService() {
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
              "Select Service",
              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 14),
            ...widget.appState.catalog.map(
              (s) => ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.content_cut, color: RuvexiTheme.primaryAccent),
                title: Text(s.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                subtitle: Text("${s.durationMinutes} min • ₹${s.price.toInt()}", style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12)),
                trailing: _selectedService?.id == s.id
                    ? const Icon(Icons.check_circle, color: RuvexiTheme.primaryAccent, size: 20)
                    : null,
                onTap: () {
                  setState(() => _selectedService = s);
                  Navigator.pop(ctx);
                },
              ),
            ),
          ],
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
            const Text(
              "Select Staff",
              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 14),
            ...widget.appState.staff.map(
              (st) => ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(
                  backgroundColor: const Color(0xFF1F2420),
                  child: Text(st.name[0], style: const TextStyle(color: RuvexiTheme.primaryAccent)),
                ),
                title: Text(st.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                subtitle: Text(st.role, style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12)),
                trailing: _selectedStaff?.id == st.id
                    ? const Icon(Icons.check_circle, color: RuvexiTheme.primaryAccent, size: 20)
                    : null,
                onTap: () {
                  setState(() => _selectedStaff = st);
                  Navigator.pop(ctx);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _pickDateTime() async {
    final pickedTime = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.fromDateTime(_selectedDate),
      builder: (context, child) {
        return Theme(
          data: ThemeData.dark().copyWith(
            colorScheme: const ColorScheme.dark(
              primary: RuvexiTheme.primaryAccent,
              surface: Color(0xFF141815),
            ),
          ),
          child: child!,
        );
      },
    );

    if (pickedTime != null) {
      setState(() {
        _selectedDate = DateTime(
          _selectedDate.year,
          _selectedDate.month,
          _selectedDate.day,
          pickedTime.hour,
          pickedTime.minute,
        );
      });
    }
  }

  void _createAppointment() {
    if (_selectedCustomer == null || _selectedService == null || _selectedStaff == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please select customer, service and staff")),
      );
      return;
    }

    final newAppt = Appointment(
      id: "apt_${DateTime.now().millisecondsSinceEpoch}",
      customerName: _selectedCustomer!.name,
      customerPhone: _selectedCustomer!.phone,
      serviceName: _selectedService!.name,
      staffName: _selectedStaff!.name,
      time: _selectedDate,
      durationMinutes: _selectedService!.durationMinutes,
      price: _selectedService!.price,
      status: "Confirmed",
      notes: _notesController.text.isNotEmpty ? _notesController.text : "Client prefers mild products.",
    );

    widget.appState.addAppointment(newAppt);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text("Appointment created for ${newAppt.customerName}!"),
        backgroundColor: const Color(0xFF122C1A),
      ),
    );

    Navigator.pop(context);
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
          "New Appointment",
          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Column(
          children: [
            // Segmented selector: Walk-in | Appointment | Block
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: const Color(0xFF101311),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: Row(
                children: [
                  _buildSegment(0, "Walk-in"),
                  _buildSegment(1, "Appointment"),
                  _buildSegment(2, "Block"),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Select Customer
            _buildSelectorTile(
              icon: Icons.person_outline,
              label: _selectedCustomer != null ? _selectedCustomer!.name : "Select Customer",
              hasValue: _selectedCustomer != null,
              onTap: _pickCustomer,
            ),
            const SizedBox(height: 12),

            // Select Services
            _buildSelectorTile(
              icon: Icons.content_cut,
              label: _selectedService != null ? "${_selectedService!.name} (₹${_selectedService!.price.toInt()})" : "Select Services",
              hasValue: _selectedService != null,
              onTap: _pickService,
            ),
            const SizedBox(height: 12),

            // Select Staff
            _buildSelectorTile(
              icon: Icons.badge_outlined,
              label: _selectedStaff != null ? "${_selectedStaff!.name} (${_selectedStaff!.role})" : "Select Staff",
              hasValue: _selectedStaff != null,
              onTap: _pickStaff,
            ),
            const SizedBox(height: 12),

            // Date & Time
            _buildSelectorTile(
              icon: Icons.calendar_today_outlined,
              label: "Tue, 09 Nov • ${TimeOfDay.fromDateTime(_selectedDate).format(context)}",
              hasValue: true,
              onTap: _pickDateTime,
            ),
            const SizedBox(height: 12),

            // Notes field
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFF101311),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: TextField(
                controller: _notesController,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                maxLines: 3,
                decoration: InputDecoration(
                  prefixIcon: const Padding(
                    padding: EdgeInsets.only(bottom: 30),
                    child: Icon(Icons.description_outlined, color: Colors.white54, size: 20),
                  ),
                  hintText: "Notes (Optional)",
                  hintStyle: TextStyle(color: Colors.white.withOpacity(0.35), fontSize: 14),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                ),
              ),
            ),
            const SizedBox(height: 36),

            // Create Appointment Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: _createAppointment,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF22C55E),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  elevation: 0,
                ),
                child: const Text(
                  "Create Appointment",
                  style: TextStyle(color: Colors.black, fontSize: 15, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSegment(int index, String label) {
    final isSelected = _selectedTypeIndex == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedTypeIndex = index),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF22C55E) : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: TextStyle(
              color: isSelected ? Colors.black : Colors.white70,
              fontSize: 13,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSelectorTile({
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
            Icon(icon, color: Colors.white60, size: 20),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                label,
                style: TextStyle(
                  color: hasValue ? Colors.white : Colors.white38,
                  fontSize: 14,
                  fontWeight: hasValue ? FontWeight.w500 : FontWeight.normal,
                ),
              ),
            ),
            const Icon(Icons.chevron_right, color: Colors.white38, size: 20),
          ],
        ),
      ),
    );
  }
}

