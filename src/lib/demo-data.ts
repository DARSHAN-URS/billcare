export interface SalonProfile {
  id: string;
  name: string;
  tagline: string;
  branch: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  currency: string;
  rating: number;
  reviewCount: number;
  logo: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  specialty: string[];
  phone: string;
  avatar: string;
  commissionRate: number; // percentage
  status: "clocked_in" | "on_break" | "clocked_out";
  clockInTime?: string;
  todayRevenue: number;
  todayCommission: number;
  todayServicesCount: number;
  rating: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: "Hair" | "Skin & Spa" | "Nails" | "Beard & Grooming" | "Makeup";
  durationMinutes: number;
  price: number;
  description: string;
  popular?: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  brand: string;
  sku: string;
  category: "Hair Care" | "Color & Chemical" | "Skin & Facial" | "Tools & Disposables";
  usageType: "Salon Professional" | "Retail Sale";
  currentStock: number;
  minThreshold: number;
  costPrice: number;
  retailPrice?: number;
  unit: string;
  lastRestocked: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: "Female" | "Male" | "Other";
  visitsCount: number;
  totalSpent: number;
  loyaltyPoints: number;
  lastVisitDate: string;
  lastService: string;
  preferredStaff: string;
  tags: string[];
  notes: string;
}

export interface FollowUpCampaign {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  campaignType: "24h_feedback" | "color_touchup" | "win_back" | "birthday_offer";
  status: "Pending" | "Sent" | "Delivered" | "Replied";
  scheduledFor: string;
  serviceTrigger: string;
  suggestedMessage: string;
  discountOffer?: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  type: "service" | "product";
  price: number;
  quantity: number;
  staffId: string;
  staffName: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  gstAmount: number;
  total: number;
  paymentMethod: "Cash" | "UPI" | "Card" | "Split";
  splitDetails?: { cash: number; upi: number };
  status: "Paid" | "Draft" | "Refunded";
}

export interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  staffName: string;
  staffId: string;
  time: string;
  durationMinutes: number;
  price: number;
  status: "Confirmed" | "In-Service" | "Completed" | "Cancelled";
  source: "Online Booking" | "Walk-in" | "Phone Call";
}

export const INITIAL_SALON: SalonProfile = {
  id: "sln_01",
  name: "Luxe Haven Salon & Aesthetic Spa",
  tagline: "Bespoke Styling, Organic Hair Therapy & Modern Skin Wellness",
  branch: "Indiranagar Flagship, Bengaluru",
  address: "100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru - 560038",
  phone: "+91 98450 12890",
  email: "concierge@luxehaven.in",
  gstin: "29AABCU9603R1ZM",
  currency: "₹",
  rating: 4.9,
  reviewCount: 428,
  logo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=150&auto=format&fit=crop&q=80",
};

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: "st_1",
    name: "Priya Sharma",
    role: "Master Hair Stylist & Creative Director",
    specialty: ["Balayage", "Keratin Therapy", "Bridal Updo"],
    phone: "+91 98201 44512",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    commissionRate: 15,
    status: "clocked_in",
    clockInTime: "09:30 AM",
    todayRevenue: 14500,
    todayCommission: 2175,
    todayServicesCount: 4,
    rating: 4.9,
  },
  {
    id: "st_2",
    name: "Arjun Verma",
    role: "Senior Barber & Texture Specialist",
    specialty: ["Fade & Scissor Cut", "Beard Sculpt", "Scalp Detox"],
    phone: "+91 98334 11209",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    commissionRate: 12,
    status: "clocked_in",
    clockInTime: "10:00 AM",
    todayRevenue: 8200,
    todayCommission: 984,
    todayServicesCount: 6,
    rating: 4.8,
  },
  {
    id: "st_3",
    name: "Aisha Khan",
    role: "Clinical Aesthetician & Spa Lead",
    specialty: ["HydraFacial", "LED Phototherapy", "Body Polish"],
    phone: "+91 98711 99234",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    commissionRate: 18,
    status: "on_break",
    clockInTime: "09:45 AM",
    todayRevenue: 16800,
    todayCommission: 3024,
    todayServicesCount: 3,
    rating: 5.0,
  },
  {
    id: "st_4",
    name: "Rohit Mehta",
    role: "Nail Artiste & Pedicurist",
    specialty: ["Gel Extensions", "Russian Manicure", "Nail Chrome"],
    phone: "+91 98192 33481",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    commissionRate: 10,
    status: "clocked_in",
    clockInTime: "10:15 AM",
    todayRevenue: 5400,
    todayCommission: 540,
    todayServicesCount: 3,
    rating: 4.7,
  },
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: "srv_1",
    name: "Signature Balayage & Olaplex Gloss",
    category: "Hair",
    durationMinutes: 120,
    price: 6500,
    description: "Hand-painted dimensional highlights with bond builder treatment & toner glaze.",
    popular: true,
  },
  {
    id: "srv_2",
    name: "Amazonian Keratin Smooth Infusion",
    category: "Hair",
    durationMinutes: 90,
    price: 4800,
    description: "Frizz-eliminating protein therapy giving 4 months of silky manageable hair.",
    popular: true,
  },
  {
    id: "srv_3",
    name: "Luxe Hydra-Infusion Facial & Glow",
    category: "Skin & Spa",
    durationMinutes: 60,
    price: 3800,
    description: "Deep vortex vacuum pore cleansing, hyaluronic acid infusion & LED light therapy.",
    popular: true,
  },
  {
    id: "srv_4",
    name: "Executive Gentleman Haircut & Hot Towel Shave",
    category: "Beard & Grooming",
    durationMinutes: 45,
    price: 1200,
    description: "Precision shear cut, clarifying shampoo, hot steam towel & botanical beard oil.",
    popular: true,
  },
  {
    id: "srv_5",
    name: "Sculpted Gel Extensions & Chrome Art",
    category: "Nails",
    durationMinutes: 75,
    price: 2400,
    description: "Hard gel nail extensions with mirror chrome finish and cuticle therapy.",
  },
  {
    id: "srv_6",
    name: "Ayurvedic Scalp Rejuvenation & Head Massage",
    category: "Hair",
    durationMinutes: 40,
    price: 1600,
    description: "Warm herbal oil massage followed by ozone hair steam for deep root stimulation.",
  },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: "inv_1",
    name: "L'Oréal Professionnel Absolut Repair Mask (500ml)",
    brand: "L'Oréal Professionnel",
    sku: "LOR-AR-500",
    category: "Hair Care",
    usageType: "Salon Professional",
    currentStock: 4,
    minThreshold: 6,
    costPrice: 950,
    unit: "Tubs",
    lastRestocked: "2026-10-02",
  },
  {
    id: "inv_2",
    name: "Olaplex No. 3 Hair Perfector (100ml)",
    brand: "Olaplex",
    sku: "OLA-NO3-100",
    category: "Hair Care",
    usageType: "Retail Sale",
    currentStock: 18,
    minThreshold: 5,
    costPrice: 1900,
    retailPrice: 2950,
    unit: "Bottles",
    lastRestocked: "2026-10-08",
  },
  {
    id: "inv_3",
    name: "Moroccanoil Treatment Original (100ml)",
    brand: "Moroccanoil",
    sku: "MOR-TRT-100",
    category: "Hair Care",
    usageType: "Retail Sale",
    currentStock: 3,
    minThreshold: 8,
    costPrice: 2400,
    retailPrice: 3800,
    unit: "Bottles",
    lastRestocked: "2026-09-28",
  },
  {
    id: "inv_4",
    name: "Wella Koleston Perfect Me+ 7/1 Ash Blonde",
    brand: "Wella Professionals",
    sku: "WEL-KP-71",
    category: "Color & Chemical",
    usageType: "Salon Professional",
    currentStock: 2,
    minThreshold: 10,
    costPrice: 480,
    unit: "Tubes",
    lastRestocked: "2026-10-05",
  },
  {
    id: "inv_5",
    name: "Schwarzkopf Igora Royal 20 Vol Developer (1L)",
    brand: "Schwarzkopf",
    sku: "SCH-DEV-20",
    category: "Color & Chemical",
    usageType: "Salon Professional",
    currentStock: 14,
    minThreshold: 5,
    costPrice: 650,
    unit: "Bottles",
    lastRestocked: "2026-10-10",
  },
  {
    id: "inv_6",
    name: "HydraFacial Antiox+ Botanical Infusion Serum",
    brand: "HydraFacial MD",
    sku: "HYD-ANT-BOX",
    category: "Skin & Facial",
    usageType: "Salon Professional",
    currentStock: 5,
    minThreshold: 8,
    costPrice: 1800,
    unit: "Vials",
    lastRestocked: "2026-09-30",
  },
  {
    id: "inv_7",
    name: "Biodegradable Salon Towels & Capes (Pack of 100)",
    brand: "EcoSalon Pro",
    sku: "ECO-TWL-100",
    category: "Tools & Disposables",
    usageType: "Salon Professional",
    currentStock: 12,
    minThreshold: 4,
    costPrice: 750,
    unit: "Packs",
    lastRestocked: "2026-10-09",
  },
];

export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: "cst_1",
    name: "Ananya Deshmukh",
    phone: "+91 99201 88721",
    email: "ananya.d@gmail.com",
    gender: "Female",
    visitsCount: 9,
    totalSpent: 42800,
    loyaltyPoints: 850,
    lastVisitDate: "2026-10-11",
    lastService: "Signature Balayage & Olaplex Gloss",
    preferredStaff: "Priya Sharma",
    tags: ["VIP", "Color Enthusiast", "High Ticket"],
    notes: "Prefers cold iced latte during services. Sensitive scalp; use sulfate-free wash.",
  },
  {
    id: "cst_2",
    name: "Karan Singhania",
    phone: "+91 98450 67123",
    email: "karan.singh@outlook.com",
    gender: "Male",
    visitsCount: 14,
    totalSpent: 19600,
    loyaltyPoints: 420,
    lastVisitDate: "2026-10-08",
    lastService: "Executive Gentleman Haircut & Hot Towel Shave",
    preferredStaff: "Arjun Verma",
    tags: ["Weekly Regular", "Prompt Payer"],
    notes: "Always books Thursday evenings at 6:30 PM.",
  },
  {
    id: "cst_3",
    name: "Meera Nair",
    phone: "+91 97402 33119",
    email: "meera.nair@techfirm.co",
    gender: "Female",
    visitsCount: 4,
    totalSpent: 15200,
    loyaltyPoints: 310,
    lastVisitDate: "2026-09-18",
    lastService: "Luxe Hydra-Infusion Facial & Glow",
    preferredStaff: "Aisha Khan",
    tags: ["Skin Care Loyal", "Due For Follow-up"],
    notes: "Suffers from seasonal dehydration. Loves the HydraFacial Antiox serum.",
  },
  {
    id: "cst_4",
    name: "Rohan Kapoor",
    phone: "+91 98112 55432",
    email: "rohan.k@fintech.io",
    gender: "Male",
    visitsCount: 1,
    totalSpent: 1200,
    loyaltyPoints: 50,
    lastVisitDate: "2026-08-25",
    lastService: "Executive Gentleman Haircut",
    preferredStaff: "Arjun Verma",
    tags: ["At-Risk Inactive", "First Timer"],
    notes: "Has not visited in 48 days. Prime target for win-back campaign.",
  },
  {
    id: "cst_5",
    name: "Divya Sen",
    phone: "+91 98230 44991",
    email: "divya.sen@artstudio.com",
    gender: "Female",
    visitsCount: 6,
    totalSpent: 26500,
    loyaltyPoints: 590,
    lastVisitDate: "2026-09-20",
    lastService: "Amazonian Keratin Smooth Infusion",
    preferredStaff: "Priya Sharma",
    tags: ["VIP", "Keratin Repeat"],
    notes: "Birthday coming up this Sunday (Oct 18). Send birthday greeting with voucher.",
  },
];

export const INITIAL_FOLLOW_UPS: FollowUpCampaign[] = [
  {
    id: "flw_1",
    customerId: "cst_1",
    customerName: "Ananya Deshmukh",
    customerPhone: "+91 99201 88721",
    campaignType: "24h_feedback",
    status: "Pending",
    scheduledFor: "Today, 4:00 PM",
    serviceTrigger: "Signature Balayage & Olaplex Gloss (Yesterday)",
    suggestedMessage:
      "Hi Ananya! ✨ We hope you are loving your new Balayage by Priya at Luxe Haven! How is your hair feeling today? We would deeply appreciate your 30-second Google review: https://g.page/r/luxehaven/review. Show this message on your next visit for a complimentary deep hydration ampoule! 💛",
    discountOffer: "Complimentary Ampoule",
  },
  {
    id: "flw_2",
    customerId: "cst_3",
    customerName: "Meera Nair",
    customerPhone: "+91 97402 33119",
    campaignType: "color_touchup",
    status: "Pending",
    scheduledFor: "Tomorrow, 11:00 AM",
    serviceTrigger: "Hydra-Infusion Facial (24 Days Ago)",
    suggestedMessage:
      "Hello Meera! 🌸 It has been 3 weeks since your glowing Hydra-Infusion treatment with Aisha. For sustained cellular hydration, salon aesthetic protocol suggests a booster session every 28 days. Reply 'BOOK' or click here to reserve your priority weekend slot with 10% loyalty credit: https://luxehaven.in/book",
    discountOffer: "10% Loyalty Credit",
  },
  {
    id: "flw_3",
    customerId: "cst_4",
    customerName: "Rohan Kapoor",
    customerPhone: "+91 98112 55432",
    campaignType: "win_back",
    status: "Pending",
    scheduledFor: "Today, 5:30 PM",
    serviceTrigger: "Inactive for 48 Days (Last: Executive Haircut)",
    suggestedMessage:
      "Hi Rohan, we miss you at Luxe Haven! ✂️ It's been over 6 weeks since your last grooming session with Arjun. We've reserved an exclusive ₹300 welcome-back credit on your next haircut or beard sculpt this week. Use code 'LOOKSHARP300' when booking: https://luxehaven.in/book",
    discountOffer: "₹300 Instant Credit",
  },
  {
    id: "flw_4",
    customerId: "cst_5",
    customerName: "Divya Sen",
    customerPhone: "+91 98230 44991",
    campaignType: "birthday_offer",
    status: "Pending",
    scheduledFor: "Oct 15, 10:00 AM",
    serviceTrigger: "Upcoming Birthday (Oct 18)",
    suggestedMessage:
      "Happy Birthday Week, Divya! 🎉🎂 Treat yourself to luxury on your special day! Enjoy a celebratory 20% discount on any Hair Spa or Keratin treatment throughout your birthday month. Reserve your pampering session here: https://luxehaven.in/book?code=BDAY20",
    discountOffer: "20% Birthday Glam Voucher",
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv_101",
    invoiceNumber: "INV-2026-1042",
    date: "2026-10-12 11:45 AM",
    customerName: "Ananya Deshmukh",
    customerPhone: "+91 99201 88721",
    items: [
      {
        id: "itm_1",
        name: "Signature Balayage & Olaplex Gloss",
        type: "service",
        price: 6500,
        quantity: 1,
        staffId: "st_1",
        staffName: "Priya Sharma",
      },
      {
        id: "itm_2",
        name: "Olaplex No. 3 Hair Perfector (100ml)",
        type: "product",
        price: 2950,
        quantity: 1,
        staffId: "st_1",
        staffName: "Priya Sharma",
      },
    ],
    subtotal: 9450,
    discount: 500,
    gstAmount: 805,
    total: 9755,
    paymentMethod: "UPI",
    status: "Paid",
  },
  {
    id: "inv_102",
    invoiceNumber: "INV-2026-1043",
    date: "2026-10-12 01:15 PM",
    customerName: "Karan Singhania",
    customerPhone: "+91 98450 67123",
    items: [
      {
        id: "itm_3",
        name: "Executive Gentleman Haircut & Hot Towel Shave",
        type: "service",
        price: 1200,
        quantity: 1,
        staffId: "st_2",
        staffName: "Arjun Verma",
      },
    ],
    subtotal: 1200,
    discount: 0,
    gstAmount: 60,
    total: 1260,
    paymentMethod: "Card",
    status: "Paid",
  },
  {
    id: "inv_103",
    invoiceNumber: "INV-2026-1044",
    date: "2026-10-12 02:30 PM",
    customerName: "Meera Nair",
    customerPhone: "+91 97402 33119",
    items: [
      {
        id: "itm_4",
        name: "Luxe Hydra-Infusion Facial & Glow",
        type: "service",
        price: 3800,
        quantity: 1,
        staffId: "st_3",
        staffName: "Aisha Khan",
      },
    ],
    subtotal: 3800,
    discount: 380,
    gstAmount: 171,
    total: 3591,
    paymentMethod: "Split",
    splitDetails: { cash: 1500, upi: 2091 },
    status: "Paid",
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt_1",
    customerName: "Sneha Reddy",
    customerPhone: "+91 99882 11029",
    serviceName: "Signature Balayage & Olaplex Gloss",
    staffName: "Priya Sharma",
    staffId: "st_1",
    time: "10:30 AM",
    durationMinutes: 120,
    price: 6500,
    status: "Completed",
    source: "Online Booking",
  },
  {
    id: "apt_2",
    customerName: "Vikram Malhotra",
    customerPhone: "+91 98221 44001",
    serviceName: "Executive Gentleman Haircut & Hot Towel Shave",
    staffName: "Arjun Verma",
    staffId: "st_2",
    time: "02:00 PM",
    durationMinutes: 45,
    price: 1200,
    status: "In-Service",
    source: "Walk-in",
  },
  {
    id: "apt_3",
    customerName: "Rhea Chawla",
    customerPhone: "+91 97331 99012",
    serviceName: "Luxe Hydra-Infusion Facial & Glow",
    staffName: "Aisha Khan",
    staffId: "st_3",
    time: "03:30 PM",
    durationMinutes: 60,
    price: 3800,
    status: "Confirmed",
    source: "Online Booking",
  },
  {
    id: "apt_4",
    customerName: "Pooja Hegde",
    customerPhone: "+91 98450 33219",
    serviceName: "Sculpted Gel Extensions & Chrome Art",
    staffName: "Rohit Mehta",
    staffId: "st_4",
    time: "04:45 PM",
    durationMinutes: 75,
    price: 2400,
    status: "Confirmed",
    source: "Phone Call",
  },
  {
    id: "apt_5",
    customerName: "Amitabh Sen",
    customerPhone: "+91 99001 88231",
    serviceName: "Ayurvedic Scalp Rejuvenation & Head Massage",
    staffName: "Arjun Verma",
    staffId: "st_2",
    time: "06:00 PM",
    durationMinutes: 40,
    price: 1600,
    status: "Confirmed",
    source: "Online Booking",
  },
];
