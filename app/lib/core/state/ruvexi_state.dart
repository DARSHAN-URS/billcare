import 'package:flutter/foundation.dart';

class ServiceItem {
  final String id;
  final String name;
  final String category;
  final double price;
  final int durationMinutes;

  ServiceItem({
    required this.id,
    required this.name,
    required this.category,
    required this.price,
    required this.durationMinutes,
  });
}

class Customer {
  final String id;
  final String name;
  final String phone;
  final String email;
  final int visitsCount;
  final double totalSpent;
  final String? formulaNotes;

  Customer({
    required this.id,
    required this.name,
    required this.phone,
    required this.email,
    required this.visitsCount,
    required this.totalSpent,
    this.formulaNotes,
  });
}

class Appointment {
  final String id;
  final String customerName;
  final String serviceName;
  final String staffName;
  final DateTime time;
  final double price;
  final String status; // 'Confirmed', 'In Progress', 'Completed'

  Appointment({
    required this.id,
    required this.customerName,
    required this.serviceName,
    required this.staffName,
    required this.time,
    required this.price,
    required this.status,
  });
}

class WalkInQueueItem {
  final String id;
  final String clientName;
  final String serviceName;
  final String assignedStylist;
  final int waitMinutes;
  final String status; // 'Waiting', 'In Chair', 'Done'

  WalkInQueueItem({
    required this.id,
    required this.clientName,
    required this.serviceName,
    required this.assignedStylist,
    required this.waitMinutes,
    required this.status,
  });
}

class CartItem {
  final ServiceItem service;
  int quantity;

  CartItem({required this.service, this.quantity = 1});
}

class RuvexiAppState extends ChangeNotifier {
  String salonName = "Ruvexi Flagship Atelier";
  String userRole = "Owner"; // Owner, Manager, Receptionist
  double todayRevenue = 28450.00;
  int todayInvoices = 18;

  List<WalkInQueueItem> walkInQueue = [
    WalkInQueueItem(
      id: "w1",
      clientName: "Ananya Sharma",
      serviceName: "Balayage & Olaplex",
      assignedStylist: "Priya V.",
      waitMinutes: 0,
      status: "In Chair",
    ),
    WalkInQueueItem(
      id: "w2",
      clientName: "Rohan Kapoor",
      serviceName: "Executive Fade & Beard Sculpt",
      assignedStylist: "Vikram S.",
      waitMinutes: 10,
      status: "Waiting",
    ),
    WalkInQueueItem(
      id: "w3",
      clientName: "Meera Nair",
      serviceName: "HydraFacial Glow",
      assignedStylist: "Sunita M.",
      waitMinutes: 15,
      status: "Waiting",
    ),
  ];

  List<Appointment> appointments = [
    Appointment(
      id: "a1",
      customerName: "Aarav Mehta",
      serviceName: "Men's Luxury Cut & Style",
      staffName: "Vikram S.",
      time: DateTime.now().add(const Duration(minutes: 30)),
      price: 1200.0,
      status: "Confirmed",
    ),
    Appointment(
      id: "a2",
      customerName: "Deepika Rao",
      serviceName: "Keratin Treatment Pro",
      staffName: "Priya V.",
      time: DateTime.now().add(const Duration(hours: 2)),
      price: 6500.0,
      status: "Confirmed",
    ),
    Appointment(
      id: "a3",
      customerName: "Siddharth Jain",
      serviceName: "Charcoal Detox Facial",
      staffName: "Sunita M.",
      time: DateTime.now().add(const Duration(hours: 3, minutes: 30)),
      price: 2400.0,
      status: "Confirmed",
    ),
  ];

  List<ServiceItem> catalog = [
    ServiceItem(id: "s1", name: "Men's Classic Cut", category: "Hair", price: 850.0, durationMinutes: 30),
    ServiceItem(id: "s2", name: "Executive Hair & Beard", category: "Hair", price: 1400.0, durationMinutes: 45),
    ServiceItem(id: "s3", name: "Women's Precision Cut", category: "Hair", price: 1800.0, durationMinutes: 60),
    ServiceItem(id: "s4", name: "Balayage & Color Gloss", category: "Hair", price: 5500.0, durationMinutes: 120),
    ServiceItem(id: "s5", name: "HydraFacial Deluxe", category: "Skin", price: 3800.0, durationMinutes: 60),
    ServiceItem(id: "s6", name: "Aromatherapy Massage", category: "Spa", price: 3200.0, durationMinutes: 60),
    ServiceItem(id: "s7", name: "Gel Manicure Luxe", category: "Nails", price: 1500.0, durationMinutes: 45),
  ];

  List<Customer> customers = [
    Customer(
      id: "c1",
      name: "Ananya Sharma",
      phone: "+91 98201 11223",
      email: "ananya@example.com",
      visitsCount: 14,
      totalSpent: 42800.0,
      formulaNotes: "Wella Koleston 7/1 + 6% Vol, 35 mins. Sensitive scalp.",
    ),
    Customer(
      id: "c2",
      name: "Rohan Kapoor",
      phone: "+91 98110 44556",
      email: "rohan@example.com",
      visitsCount: 8,
      totalSpent: 16400.0,
      formulaNotes: "Low fade #0.5 into scissor on top. Moroccan Oil finish.",
    ),
    Customer(
      id: "c3",
      name: "Meera Nair",
      phone: "+91 97400 99881",
      email: "meera@example.com",
      visitsCount: 22,
      totalSpent: 68900.0,
      formulaNotes: "Avoid tea tree oil. Prefers rose hydrating mist.",
    ),
  ];

  final List<CartItem> posCart = [];

  void addToCart(ServiceItem service) {
    final existingIndex = posCart.indexWhere((item) => item.service.id == service.id);
    if (existingIndex >= 0) {
      posCart[existingIndex].quantity += 1;
    } else {
      posCart.add(CartItem(service: service));
    }
    notifyListeners();
  }

  void removeFromCart(String serviceId) {
    posCart.removeWhere((item) => item.service.id == serviceId);
    notifyListeners();
  }

  void clearCart() {
    posCart.clear();
    notifyListeners();
  }

  double get cartSubtotal => posCart.fold(0, (sum, item) => sum + (item.service.price * item.quantity));
  double get cartTax => cartSubtotal * 0.18; // 18% GST standard
  double get cartGrandTotal => cartSubtotal + cartTax;

  void completeCheckout(String paymentMethod) {
    todayRevenue += cartGrandTotal;
    todayInvoices += 1;
    posCart.clear();
    notifyListeners();
  }

  void addWalkIn(String clientName, String serviceName, String stylist) {
    walkInQueue.add(
      WalkInQueueItem(
        id: "w_${DateTime.now().millisecondsSinceEpoch}",
        clientName: clientName,
        serviceName: serviceName,
        assignedStylist: stylist,
        waitMinutes: 5,
        status: "Waiting",
      ),
    );
    notifyListeners();
  }

  void updateWalkInStatus(String id, String newStatus) {
    final itemIndex = walkInQueue.indexWhere((item) => item.id == id);
    if (itemIndex >= 0) {
      if (newStatus == 'Done') {
        walkInQueue.removeAt(itemIndex);
      } else {
        final existing = walkInQueue[itemIndex];
        walkInQueue[itemIndex] = WalkInQueueItem(
          id: existing.id,
          clientName: existing.clientName,
          serviceName: existing.serviceName,
          assignedStylist: existing.assignedStylist,
          waitMinutes: existing.waitMinutes,
          status: newStatus,
        );
      }
      notifyListeners();
    }
  }
}

