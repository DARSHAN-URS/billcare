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

class PackageItem {
  final String id;
  final String title;
  final String description;
  final double price;
  final double originalPrice;
  final List<String> servicesIncluded;

  PackageItem({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    required this.originalPrice,
    required this.servicesIncluded,
  });
}

class Customer {
  final String id;
  final String name;
  final String phone;
  final String email;
  final int visitsCount;
  final double totalSpent;
  final int loyaltyPoints;
  final String membership;
  final String? formulaNotes;
  final String tag; // "Regular", "New", "Inactive"

  Customer({
    required this.id,
    required this.name,
    required this.phone,
    required this.email,
    required this.visitsCount,
    required this.totalSpent,
    this.loyaltyPoints = 500,
    this.membership = "Classic (Active)",
    this.formulaNotes,
    this.tag = "Regular",
  });
}

class Appointment {
  final String id;
  final String customerName;
  final String customerPhone;
  final String serviceName;
  final String staffName;
  final DateTime time;
  final int durationMinutes;
  final double price;
  String status; // "In Service", "Confirmed", "Upcoming", "Completed", "Cancelled"
  final String notes;

  Appointment({
    required this.id,
    required this.customerName,
    this.customerPhone = "+91 98765 43210",
    required this.serviceName,
    required this.staffName,
    required this.time,
    this.durationMinutes = 60,
    required this.price,
    required this.status,
    this.notes = "Client prefers mild products.",
  });
}

class StaffMember {
  final String id;
  final String name;
  final String role;
  final String phone;
  bool isActive;
  bool isClockedIn;
  String checkInTime;
  int servicesCount;
  double serviceRevenue;
  double commissionRate;
  double rating;
  int assignedServicesCount;

  StaffMember({
    required this.id,
    required this.name,
    required this.role,
    this.phone = "+91 98451 22334",
    this.isActive = true,
    this.isClockedIn = true,
    this.checkInTime = "09:30 AM",
    this.servicesCount = 156,
    this.serviceRevenue = 72400.0,
    this.commissionRate = 0.10,
    this.rating = 4.8,
    this.assignedServicesCount = 12,
  });
}

class InventoryItem {
  final String id;
  final String name;
  final String sizeVolume;
  final String category;
  int stock;
  final int minAlert;
  final String unit;

  InventoryItem({
    required this.id,
    required this.name,
    required this.sizeVolume,
    required this.category,
    required this.stock,
    required this.minAlert,
    this.unit = "pcs",
  });

  bool get isLowStock => stock <= minAlert;
}

class ExpenseItem {
  final String id;
  final String category;
  final double amount;
  final DateTime date;
  final String note;

  ExpenseItem({
    required this.id,
    required this.category,
    required this.amount,
    required this.date,
    this.note = "",
  });
}

class OfferItem {
  final String id;
  final String title;
  final String description;
  final String validity;
  bool isActive;
  final double discountPercent;

  OfferItem({
    required this.id,
    required this.title,
    required this.description,
    required this.validity,
    this.isActive = true,
    this.discountPercent = 20,
  });
}

class CartItem {
  final ServiceItem service;
  int quantity;

  CartItem({required this.service, this.quantity = 1});
}

class RuvexiAppState extends ChangeNotifier {
  String salonName = "Ruvexi Salon & Spa";
  String salonLocation = "Chikmagaluru, Karnataka";
  String userRole = "Owner";
  double todayRevenue = 42600.00;
  int todayAppointmentsCount = 24;
  int todayClientsCount = 18;
  double todayProfit = 8920.00;

  bool isAuthenticated = true;
  String currentUserName = "Darshan";
  String currentUserEmail = "ruvexisolutions@gmail.com";

  Future<bool> login({required String identifier, required String password}) async {
    isAuthenticated = true;
    currentUserEmail = identifier;
    currentUserName = identifier.contains('@') ? identifier.split('@').first : "Darshan";
    userRole = "Owner";
    notifyListeners();
    return true;
  }

  Future<bool> loginWithGoogle() async {
    isAuthenticated = true;
    currentUserEmail = "ruvexisolutions@gmail.com";
    currentUserName = "Darshan";
    userRole = "Owner";
    notifyListeners();
    return true;
  }

  // Selected customer in POS
  Customer? posSelectedCustomer;

  // Catalog of services
  final List<ServiceItem> catalog = [
    ServiceItem(id: "s1", name: "Hair Cut", category: "Hair", price: 399.0, durationMinutes: 30),
    ServiceItem(id: "s2", name: "Hair Spa", category: "Hair", price: 1199.0, durationMinutes: 60),
    ServiceItem(id: "s3", name: "Hair Color", category: "Hair", price: 2499.0, durationMinutes: 90),
    ServiceItem(id: "s4", name: "Beard Grooming", category: "Beard", price: 299.0, durationMinutes: 20),
    ServiceItem(id: "s5", name: "Facial", category: "Skin", price: 1299.0, durationMinutes: 60),
    ServiceItem(id: "s6", name: "Head Massage & Oil", category: "Spa", price: 599.0, durationMinutes: 30),
    ServiceItem(id: "s7", name: "Deep Cleanse Pedicure", category: "Spa", price: 899.0, durationMinutes: 45),
  ];

  // Packages
  final List<PackageItem> packages = [
    PackageItem(
      id: "pkg1",
      title: "Royal Grooming Package",
      description: "Hair Cut + Beard Sculpt + Hair Spa + Head Massage",
      price: 2199.0,
      originalPrice: 2896.0,
      servicesIncluded: ["Hair Cut", "Beard Grooming", "Hair Spa", "Head Massage"],
    ),
    PackageItem(
      id: "pkg2",
      title: "Glow & Radiance Combo",
      description: "Skin Fruit Facial + Hair Spa + Manicure",
      price: 2799.0,
      originalPrice: 3599.0,
      servicesIncluded: ["Facial", "Hair Spa", "Pedicure"],
    ),
    PackageItem(
      id: "pkg3",
      title: "Executive Styling Series",
      description: "5 Precision Haircuts + 3 Beard Trims",
      price: 2499.0,
      originalPrice: 3100.0,
      servicesIncluded: ["5x Hair Cut", "3x Beard Trim"],
    ),
  ];

  // Appointments matching the screens
  final List<Appointment> appointments = [
    Appointment(
      id: "apt_1",
      customerName: "Priya Sharma",
      customerPhone: "+91 98765 43210",
      serviceName: "Hair Cut + Hair Spa",
      staffName: "Manoj K",
      time: DateTime(2026, 11, 9, 10, 0),
      durationMinutes: 60,
      price: 1399.0,
      status: "In Service",
      notes: "Client prefers mild products.",
    ),
    Appointment(
      id: "apt_2",
      customerName: "Arjun Rao",
      customerPhone: "+91 87654 32109",
      serviceName: "Beard Grooming",
      staffName: "Kiran S",
      time: DateTime(2026, 11, 9, 11, 30),
      durationMinutes: 20,
      price: 299.0,
      status: "Confirmed",
      notes: "Fade beard neatly.",
    ),
    Appointment(
      id: "apt_3",
      customerName: "Neha R",
      customerPhone: "+91 99876 54321",
      serviceName: "Hair Color",
      staffName: "Pooja M",
      time: DateTime(2026, 11, 9, 13, 0),
      durationMinutes: 90,
      price: 2499.0,
      status: "Upcoming",
      notes: "No ammonia developer.",
    ),
    Appointment(
      id: "apt_4",
      customerName: "Rahul M",
      customerPhone: "+91 96543 21098",
      serviceName: "Hair Cut",
      staffName: "Rohit D",
      time: DateTime(2026, 11, 9, 14, 30),
      durationMinutes: 30,
      price: 399.0,
      status: "Confirmed",
      notes: "Short crop with texture.",
    ),
    Appointment(
      id: "apt_5",
      customerName: "Sneha P",
      customerPhone: "+91 93456 78901",
      serviceName: "Facial",
      staffName: "Anjali R",
      time: DateTime(2026, 11, 9, 16, 0),
      durationMinutes: 60,
      price: 1299.0,
      status: "Upcoming",
      notes: "Organic fruit extract mask.",
    ),
    Appointment(
      id: "apt_6",
      customerName: "Vivek K",
      customerPhone: "+91 90987 65432",
      serviceName: "Hair Spa",
      staffName: "Manoj K",
      time: DateTime(2026, 11, 9, 17, 30),
      durationMinutes: 60,
      price: 1199.0,
      status: "Confirmed",
      notes: "Deep hydration scalp therapy.",
    ),
  ];

  // Customers CRM
  final List<Customer> customers = [
    Customer(
      id: "c1",
      name: "Priya Sharma",
      phone: "+91 98765 43210",
      email: "priya.sharma@example.com",
      visitsCount: 12,
      totalSpent: 18240.0,
      loyaltyPoints: 1240,
      membership: "Classic (Active)",
      formulaNotes: "Client prefers mild products.",
      tag: "Regular",
    ),
    Customer(
      id: "c2",
      name: "Arjun Rao",
      phone: "+91 87654 32109",
      email: "arjun.rao@example.com",
      visitsCount: 8,
      totalSpent: 9850.0,
      loyaltyPoints: 780,
      membership: "Classic (Active)",
      formulaNotes: "Prefers beard balm, no chemical aftershaves.",
      tag: "Regular",
    ),
    Customer(
      id: "c3",
      name: "Neha R",
      phone: "+91 99876 54321",
      email: "neha.r@example.com",
      visitsCount: 5,
      totalSpent: 14200.0,
      loyaltyPoints: 620,
      membership: "Classic (Active)",
      formulaNotes: "L'Oreal Inoa 5.0 with 20 vol.",
      tag: "Regular",
    ),
    Customer(
      id: "c4",
      name: "Rahul M",
      phone: "+91 96543 21098",
      email: "rahul.m@example.com",
      visitsCount: 3,
      totalSpent: 2850.0,
      loyaltyPoints: 210,
      membership: "Standard",
      formulaNotes: "Side taper, matte clay.",
      tag: "New",
    ),
    Customer(
      id: "c5",
      name: "Sneha P",
      phone: "+91 93456 78901",
      email: "sneha.p@example.com",
      visitsCount: 7,
      totalSpent: 11300.0,
      loyaltyPoints: 890,
      membership: "Classic (Active)",
      formulaNotes: "Sensitive skin, avoids citrus scrubs.",
      tag: "Regular",
    ),
    Customer(
      id: "c6",
      name: "Vivek K",
      phone: "+91 90987 65432",
      email: "vivek.k@example.com",
      visitsCount: 4,
      totalSpent: 5600.0,
      loyaltyPoints: 340,
      membership: "Standard",
      formulaNotes: "Anti-dandruff tea-tree wash.",
      tag: "Regular",
    ),
  ];

  // Staff list matching Screen 5 & Staff Profile
  final List<StaffMember> staff = [
    StaffMember(
      id: "st_1",
      name: "Manoj K",
      role: "Senior Stylist",
      phone: "+91 98451 22334",
      isActive: true,
      isClockedIn: true,
      checkInTime: "09:15 AM",
      servicesCount: 156,
      serviceRevenue: 72400.0,
      commissionRate: 0.10,
      rating: 4.8,
      assignedServicesCount: 12,
    ),
    StaffMember(
      id: "st_2",
      name: "Kiran S",
      role: "Hair Stylist",
      phone: "+91 98451 22335",
      isActive: true,
      isClockedIn: true,
      checkInTime: "09:30 AM",
      servicesCount: 124,
      serviceRevenue: 54200.0,
      commissionRate: 0.10,
      rating: 4.7,
      assignedServicesCount: 8,
    ),
    StaffMember(
      id: "st_3",
      name: "Pooja M",
      role: "Skin Expert",
      phone: "+91 98451 22336",
      isActive: true,
      isClockedIn: true,
      checkInTime: "09:45 AM",
      servicesCount: 98,
      serviceRevenue: 48600.0,
      commissionRate: 0.12,
      rating: 4.9,
      assignedServicesCount: 6,
    ),
    StaffMember(
      id: "st_4",
      name: "Rohit D",
      role: "Barber",
      phone: "+91 98451 22337",
      isActive: true,
      isClockedIn: true,
      checkInTime: "10:00 AM",
      servicesCount: 142,
      serviceRevenue: 38900.0,
      commissionRate: 0.08,
      rating: 4.6,
      assignedServicesCount: 5,
    ),
    StaffMember(
      id: "st_5",
      name: "Anjali R",
      role: "Salon Assistant",
      phone: "+91 98451 22338",
      isActive: true,
      isClockedIn: false,
      checkInTime: "--",
      servicesCount: 86,
      serviceRevenue: 22400.0,
      commissionRate: 0.06,
      rating: 4.5,
      assignedServicesCount: 4,
    ),
  ];

  // Inventory matching Screen 7
  final List<InventoryItem> inventory = [
    InventoryItem(id: "inv1", name: "Loreal Shampoo", sizeVolume: "1 Litre", category: "Hair Care", stock: 12, minAlert: 10, unit: "bottles"),
    InventoryItem(id: "inv2", name: "Hair Serum", sizeVolume: "100 ml", category: "Hair Care", stock: 5, minAlert: 10, unit: "bottles"),
    InventoryItem(id: "inv3", name: "Face Cleanser", sizeVolume: "250 ml", category: "Skin Care", stock: 28, minAlert: 15, unit: "bottles"),
    InventoryItem(id: "inv4", name: "Hair Color (Black)", sizeVolume: "50 g", category: "Hair Care", stock: 8, minAlert: 10, unit: "tubes"),
    InventoryItem(id: "inv5", name: "Styling Wax Matte", sizeVolume: "75 g", category: "Hair Care", stock: 22, minAlert: 8, unit: "jars"),
    InventoryItem(id: "inv6", name: "Hydrating Rose Mist", sizeVolume: "200 ml", category: "Skin Care", stock: 19, minAlert: 6, unit: "bottles"),
    InventoryItem(id: "inv7", name: "Titanium Thinning Shears", sizeVolume: "6 inch", category: "Tools", stock: 7, minAlert: 4, unit: "pcs"),
  ];

  int get totalInventoryItemsCount => 1248;
  int get lowStockInventoryCount => inventory.where((i) => i.isLowStock).length;

  // Expenses matching Screen 8b
  final List<ExpenseItem> expenses = [
    ExpenseItem(id: "exp1", category: "Products & Inventory", amount: 28500.0, date: DateTime(2026, 11, 2), note: "Monthly stock replenishment"),
    ExpenseItem(id: "exp2", category: "Rent", amount: 15000.0, date: DateTime(2026, 11, 1), note: "Atelier floor commercial lease"),
    ExpenseItem(id: "exp3", category: "Utilities (Electricity, Water)", amount: 4200.0, date: DateTime(2026, 11, 4), note: "BESCOM & water board"),
    ExpenseItem(id: "exp4", category: "Staff Incentives", amount: 8000.0, date: DateTime(2026, 11, 5), note: "Diwali festival bonus advance"),
    ExpenseItem(id: "exp5", category: "Others", amount: 6700.0, date: DateTime(2026, 11, 7), note: "Laundry, sanitizers & pantry supplies"),
  ];

  double get totalExpenses => expenses.fold(0, (sum, e) => sum + e.amount);

  // Offers matching Screen 8c
  final List<OfferItem> offers = [
    OfferItem(
      id: "off1",
      title: "Flat 20% Off",
      description: "On Hair Spa & Hair Care",
      validity: "01 Nov - 30 Nov 2026",
      isActive: true,
      discountPercent: 20,
    ),
    OfferItem(
      id: "off2",
      title: "Beard Grooming Combo @ ₹499",
      description: "Beard Trim + Charcoal Wash + Hot Towel",
      validity: "01 Nov - 30 Nov 2026",
      isActive: true,
      discountPercent: 15,
    ),
    OfferItem(
      id: "off3",
      title: "Facial + Clean Up @ ₹1,299",
      description: "Valid Till: 15 Nov 2026",
      validity: "Valid Till: 15 Nov 2026",
      isActive: false,
      discountPercent: 25,
    ),
  ];

  // POS Cart
  final List<CartItem> posCart = [
    CartItem(
      service: ServiceItem(id: "s1", name: "Hair Cut", category: "Hair", price: 399.0, durationMinutes: 30),
      quantity: 1,
    ),
    CartItem(
      service: ServiceItem(id: "s2", name: "Hair Spa", category: "Hair", price: 1199.0, durationMinutes: 60),
      quantity: 1,
    ),
    CartItem(
      service: ServiceItem(id: "s4", name: "Beard Grooming", category: "Beard", price: 299.0, durationMinutes: 20),
      quantity: 1,
    ),
  ];

  double discountAmount = 100.0;

  double get cartSubtotal => posCart.fold(0, (sum, item) => sum + (item.service.price * item.quantity));
  double get cartTax => (cartSubtotal - discountAmount) * 0.18;
  double get cartTotalPayable => (cartSubtotal - discountAmount + cartTax).clamp(0, double.infinity);

  void updateCartQuantity(String serviceId, int delta) {
    final idx = posCart.indexWhere((c) => c.service.id == serviceId);
    if (idx >= 0) {
      final newQty = posCart[idx].quantity + delta;
      if (newQty <= 0) {
        posCart.removeAt(idx);
      } else {
        posCart[idx].quantity = newQty;
      }
      notifyListeners();
    }
  }

  void addServiceToCart(ServiceItem service) {
    final idx = posCart.indexWhere((c) => c.service.id == service.id);
    if (idx >= 0) {
      posCart[idx].quantity += 1;
    } else {
      posCart.add(CartItem(service: service));
    }
    notifyListeners();
  }

  void clearCart() {
    posCart.clear();
    notifyListeners();
  }

  void setPosCustomer(Customer? customer) {
    posSelectedCustomer = customer;
    notifyListeners();
  }

  void completePayment({required String method, double? amount}) {
    final total = amount ?? cartTotalPayable;
    todayRevenue += total;
    todayClientsCount += 1;
    todayAppointmentsCount += 1;
    clearCart();
    notifyListeners();
  }

  void addAppointment(Appointment appt) {
    appointments.insert(0, appt);
    notifyListeners();
  }

  void updateAppointmentStatus(String id, String newStatus) {
    final idx = appointments.indexWhere((a) => a.id == id);
    if (idx >= 0) {
      appointments[idx].status = newStatus;
      notifyListeners();
    }
  }

  void addCustomer(Customer customer) {
    customers.insert(0, customer);
    notifyListeners();
  }

  void addStaff(StaffMember staffMember) {
    staff.add(staffMember);
    notifyListeners();
  }

  void addService(ServiceItem service) {
    catalog.add(service);
    notifyListeners();
  }

  void addInventoryItem(InventoryItem item) {
    inventory.insert(0, item);
    notifyListeners();
  }

  void addExpense(ExpenseItem item) {
    expenses.insert(0, item);
    notifyListeners();
  }

  void toggleOfferStatus(String id) {
    final idx = offers.indexWhere((o) => o.id == id);
    if (idx >= 0) {
      offers[idx].isActive = !offers[idx].isActive;
      notifyListeners();
    }
  }

  void addOffer(OfferItem offer) {
    offers.add(offer);
    notifyListeners();
  }

  void logout() {
    isAuthenticated = false;
    currentUserName = "";
    currentUserEmail = "";
    notifyListeners();
  }
}
