import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';
import 'package:ruvexi_mobile/shared/widgets/ruvexi_logo.dart';

class PublicBookingScreen extends StatefulWidget {
  final RuvexiAppState appState;

  const PublicBookingScreen({super.key, required this.appState});

  @override
  State<PublicBookingScreen> createState() => _PublicBookingScreenState();
}

class _PublicBookingScreenState extends State<PublicBookingScreen> {
  ServiceItem? selectedService;
  String selectedStylist = "Any Available Master";
  DateTime selectedDate = DateTime.now();
  String selectedTime = "11:30 AM";

  final List<String> timeSlots = [
    "10:00 AM",
    "11:30 AM",
    "01:00 PM",
    "02:30 PM",
    "04:00 PM",
    "05:30 PM",
    "07:00 PM"
  ];

  @override
  void initState() {
    super.initState();
    if (widget.appState.catalog.isNotEmpty) {
      selectedService = widget.appState.catalog.first;
    }
  }

  void _confirmBooking() {
    if (selectedService == null) return;
    widget.appState.appointments.add(
      Appointment(
        id: "a_${DateTime.now().millisecondsSinceEpoch}",
        customerName: "Guest Client (Self Booked)",
        serviceName: selectedService!.name,
        staffName: selectedStylist,
        time: selectedDate,
        price: selectedService!.price,
        status: "Confirmed",
      ),
    );
    widget.appState.notifyListeners();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: RuvexiTheme.card,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text("Booking Confirmed!", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        content: Text(
          "Your appointment for ${selectedService!.name} on $selectedTime has been reserved. Instant SMS & WhatsApp confirmation sent.",
          style: TextStyle(color: RuvexiTheme.textMuted, fontSize: 13),
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: RuvexiTheme.primaryAccent),
            onPressed: () => Navigator.pop(ctx),
            child: const Text("Done", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const RuvexiLogoWidget(fontSize: 16),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: RuvexiTheme.card,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: RuvexiTheme.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("ONLINE SALON BOOKING", style: TextStyle(color: RuvexiTheme.primaryAccent, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
                  const SizedBox(height: 4),
                  Text(widget.appState.salonName, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                  const SizedBox(height: 4),
                  const Text("Select your preferred treatment, stylist, and time.", style: TextStyle(color: RuvexiTheme.textMuted, fontSize: 12)),
                ],
              ),
            ),
            const SizedBox(height: 20),
            const Text("1. Select Service", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white)),
            const SizedBox(height: 10),
            ...widget.appState.catalog.map((service) {
              final isSelected = selectedService?.id == service.id;
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                decoration: BoxDecoration(
                  color: isSelected ? RuvexiTheme.primaryAccent.withOpacity(0.12) : RuvexiTheme.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isSelected ? RuvexiTheme.primaryAccent : RuvexiTheme.border,
                  ),
                ),
                child: ListTile(
                  title: Text(service.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white)),
                  subtitle: Text("${service.category} • ${service.durationMinutes} min", style: TextStyle(color: RuvexiTheme.textMuted, fontSize: 12)),
                  trailing: Text("₹${service.price.toStringAsFixed(0)}", style: const TextStyle(fontWeight: FontWeight.bold, color: RuvexiTheme.goldAccent, fontSize: 14)),
                  onTap: () {
                    setState(() {
                      selectedService = service;
                    });
                  },
                ),
              );
            }),
            const SizedBox(height: 20),
            const Text("2. Select Time Slot", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white)),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: timeSlots.map((slot) {
                final isSelected = selectedTime == slot;
                return ChoiceChip(
                  label: Text(slot),
                  selected: isSelected,
                  selectedColor: RuvexiTheme.primaryAccent,
                  backgroundColor: RuvexiTheme.surface,
                  labelStyle: TextStyle(
                    color: isSelected ? Colors.black : Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                  onSelected: (val) {
                    if (val) setState(() => selectedTime = slot);
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 28),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: RuvexiTheme.primaryAccent,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: _confirmBooking,
                child: const Text("Confirm & Reserve Slot", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 15)),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}

