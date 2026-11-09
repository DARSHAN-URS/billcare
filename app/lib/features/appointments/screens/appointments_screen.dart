import 'package:flutter/material.dart';
import 'package:ruvexi_mobile/core/state/ruvexi_state.dart';
import 'package:ruvexi_mobile/core/theme/ruvexi_theme.dart';
import 'package:ruvexi_mobile/features/appointments/screens/appointment_details_screen.dart';
import 'package:ruvexi_mobile/features/appointments/screens/new_appointment_screen.dart';

class AppointmentsCalendarScreen extends StatefulWidget {
  final RuvexiAppState appState;

  const AppointmentsCalendarScreen({super.key, required this.appState});

  @override
  State<AppointmentsCalendarScreen> createState() => _AppointmentsCalendarScreenState();
}

class _AppointmentsCalendarScreenState extends State<AppointmentsCalendarScreen> {
  int _selectedFilterTab = 0; // 0: Today, 1: Upcoming, 2: Completed
  int _selectedDayIndex = 0; // 0: Tue 09, 1: Wed 10, etc.

  final List<Map<String, String>> _days = [
    {"day": "Tue", "date": "09 Nov"},
    {"day": "Wed", "date": "10"},
    {"day": "Thu", "date": "11"},
    {"day": "Fri", "date": "12"},
    {"day": "Sat", "date": "13"},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF060706),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top App Bar
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              child: Row(
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Text(
                            "RUVEXI",
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 2.0,
                            ),
                          ),
                          Container(
                            width: 3.5,
                            height: 7,
                            margin: const EdgeInsets.only(left: 2, bottom: 8),
                            decoration: BoxDecoration(
                              color: const Color(0xFF22C55E),
                              borderRadius: BorderRadius.circular(1),
                            ),
                          ),
                        ],
                      ),
                      const Text(
                        "SOLUTIONS",
                        style: TextStyle(
                          color: Colors.white70,
                          fontSize: 8,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 3.5,
                        ),
                      ),
                    ],
                  ),
                  const Spacer(),
                  // Salon selector
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: const Color(0xFF141815),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.white.withOpacity(0.1)),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.content_cut, size: 12, color: Color(0xFF22C55E)),
                        SizedBox(width: 6),
                        Text(
                          "Ruvexi Salon & Spa",
                          style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
                        ),
                        SizedBox(width: 4),
                        Icon(Icons.keyboard_arrow_down, size: 14, color: Colors.white60),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  // Bell notification
                  IconButton(
                    icon: const Icon(Icons.notifications_outlined, color: Colors.white, size: 22),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("No new appointment notifications")),
                      );
                    },
                  ),
                ],
              ),
            ),

            // Title
            const Padding(
              padding: EdgeInsets.fromLTRB(20, 8, 20, 12),
              child: Text(
                "Appointments",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  letterSpacing: -0.3,
                ),
              ),
            ),

            // Tab Filters: Today, Upcoming, Completed
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  _buildTabPill(0, "Today"),
                  const SizedBox(width: 8),
                  _buildTabPill(1, "Upcoming"),
                  const SizedBox(width: 8),
                  _buildTabPill(2, "Completed"),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Date selector row
            SizedBox(
              height: 60,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _days.length + 1,
                itemBuilder: (context, index) {
                  if (index == _days.length) {
                    return Container(
                      width: 52,
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF101311),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.white.withOpacity(0.08)),
                      ),
                      child: IconButton(
                        icon: const Icon(Icons.calendar_month_outlined, color: Colors.white70, size: 20),
                        onPressed: () async {
                          await showDatePicker(
                            context: context,
                            initialDate: DateTime.now(),
                            firstDate: DateTime(2025),
                            lastDate: DateTime(2030),
                          );
                        },
                      ),
                    );
                  }

                  final item = _days[index];
                  final isSelected = _selectedDayIndex == index;

                  return GestureDetector(
                    onTap: () => setState(() => _selectedDayIndex = index),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFF122C1A) : const Color(0xFF101311),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected ? const Color(0xFF22C55E).withOpacity(0.4) : Colors.white.withOpacity(0.08),
                        ),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            item["day"]!,
                            style: TextStyle(
                              color: isSelected ? const Color(0xFF22C55E) : Colors.white60,
                              fontSize: 11,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            item["date"]!,
                            style: TextStyle(
                              color: isSelected ? Colors.white : Colors.white70,
                              fontSize: 12,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 16),

            // Appointments List
            Expanded(
              child: ListenableBuilder(
                listenable: widget.appState,
                builder: (context, _) {
                  final list = widget.appState.appointments.where((a) {
                    if (_selectedFilterTab == 0) return a.status != "Completed" && a.status != "Cancelled";
                    if (_selectedFilterTab == 1) return a.status == "Upcoming";
                    if (_selectedFilterTab == 2) return a.status == "Completed";
                    return true;
                  }).toList();

                  if (list.isEmpty) {
                    return Center(
                      child: Text(
                        "No appointments in this view",
                        style: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 14),
                      ),
                    );
                  }

                  return ListView.builder(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 80),
                    itemCount: list.length,
                    itemBuilder: (context, index) {
                      final appt = list[index];
                      return _buildAppointmentCard(appt);
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: const Color(0xFF22C55E),
        elevation: 4,
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => NewAppointmentScreen(appState: widget.appState),
            ),
          );
        },
        child: const Icon(Icons.add, color: Colors.black, size: 28),
      ),
    );
  }

  Widget _buildTabPill(int index, String label) {
    final isSelected = _selectedFilterTab == index;
    return GestureDetector(
      onTap: () => setState(() => _selectedFilterTab = index),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 7),
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

  Widget _buildAppointmentCard(Appointment appt) {
    final timeStr = "${appt.time.hour.toString().padLeft(2, '0')}:${appt.time.minute.toString().padLeft(2, '0')} ${appt.time.hour >= 12 ? 'PM' : 'AM'}";
    final initials = appt.customerName.split(' ').map((n) => n.isNotEmpty ? n[0] : '').take(2).join();

    Color pillBg = const Color(0xFF1E293B);
    Color pillText = const Color(0xFF38BDF8);
    if (appt.status == "In Service") {
      pillBg = const Color(0xFF122C1A);
      pillText = const Color(0xFF22C55E);
    } else if (appt.status == "Confirmed") {
      pillBg = const Color(0xFF1E293B);
      pillText = const Color(0xFF60A5FA);
    } else if (appt.status == "Upcoming") {
      pillBg = const Color(0xFF332306);
      pillText = const Color(0xFFFBBF24);
    }

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => AppointmentDetailsScreen(
              appState: widget.appState,
              appointment: appt,
            ),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
        decoration: BoxDecoration(
          color: const Color(0xFF101311),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withOpacity(0.08)),
        ),
        child: Row(
          children: [
            // Left green indicator line
            Container(
              width: 3,
              height: 38,
              decoration: BoxDecoration(
                color: const Color(0xFF22C55E),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(width: 12),

            // Time
            Text(
              timeStr,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(width: 14),

            // Avatar circle
            CircleAvatar(
              radius: 17,
              backgroundColor: const Color(0xFF2B2538),
              child: Text(
                initials,
                style: const TextStyle(
                  color: Color(0xFFD8B4FE),
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(width: 12),

            // Name + service
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    appt.customerName,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    appt.serviceName,
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.55),
                      fontSize: 11,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),

            // Status Pill
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: pillBg,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                appt.status,
                style: TextStyle(
                  color: pillText,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
