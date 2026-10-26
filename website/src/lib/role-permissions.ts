export type UserRole = "owner" | "manager" | "receptionist" | "admin";

export type DashboardTab =
  | "frontdesk"
  | "owner"
  | "overview"
  | "calendar"
  | "pos"
  | "customers"
  | "services"
  | "staff"
  | "inventory"
  | "followups"
  | "reports"
  | "booking"
  | "settings";

export interface RoleConfig {
  role: UserRole;
  label: string;
  shortTitle: string;
  badge: string;
  badgeClasses: string;
  iconName: string;
  description: string;
  defaultTab: DashboardTab;
  allowedTabs: DashboardTab[];
  capabilities: {
    canViewOwnerBI: boolean;
    canViewFinancialMargins: boolean;
    canViewTaxReports: boolean;
    canEditSalonSettings: boolean;
    canEditStaffCommissions: boolean;
    canManageStaffAttendance: boolean;
    canManageInventoryStock: boolean;
    canViewInventoryCost: boolean;
    canEditServices: boolean;
    canSendWhatsAppMarketing: boolean;
    canExportCrm: boolean;
    canCreateBilling: boolean;
    canAccessMultiCenter: boolean;
  };
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  receptionist: {
    role: "receptionist",
    label: "Front Desk Receptionist",
    shortTitle: "Receptionist",
    badge: "Front Desk",
    badgeClasses: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    iconName: "Headphones",
    description:
      "Handles customer check-ins, appointment bookings, POS billing checkout, and client contact profiles. Financial margins, staff commissions, and business settings are strictly locked.",
    defaultTab: "frontdesk",
    allowedTabs: ["frontdesk", "calendar", "pos", "customers", "services", "booking"],
    capabilities: {
      canViewOwnerBI: false,
      canViewFinancialMargins: false,
      canViewTaxReports: false,
      canEditSalonSettings: false,
      canEditStaffCommissions: false,
      canManageStaffAttendance: false,
      canManageInventoryStock: false,
      canViewInventoryCost: false,
      canEditServices: false,
      canSendWhatsAppMarketing: false,
      canExportCrm: false,
      canCreateBilling: true,
      canAccessMultiCenter: false,
    },
  },

  manager: {
    role: "manager",
    label: "Salon Manager",
    shortTitle: "Manager",
    badge: "Operations Lead",
    badgeClasses: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    iconName: "Briefcase",
    description:
      "Manages daily salon operations, staff clock-in attendance, stock levels, services catalog, and WhatsApp retention triggers. Executive owner analytics and legal bank/tax settings are restricted.",
    defaultTab: "overview",
    allowedTabs: [
      "frontdesk",
      "overview",
      "calendar",
      "pos",
      "customers",
      "services",
      "staff",
      "inventory",
      "followups",
      "booking",
    ],
    capabilities: {
      canViewOwnerBI: false,
      canViewFinancialMargins: false,
      canViewTaxReports: false,
      canEditSalonSettings: false,
      canEditStaffCommissions: false, // Owner only
      canManageStaffAttendance: true,
      canManageInventoryStock: true,
      canViewInventoryCost: false, // Owner only
      canEditServices: true,
      canSendWhatsAppMarketing: true,
      canExportCrm: true,
      canCreateBilling: true,
      canAccessMultiCenter: false,
    },
  },

  owner: {
    role: "owner",
    label: "Salon Owner / Director",
    shortTitle: "Owner",
    badge: "Full Access",
    badgeClasses: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    iconName: "Crown",
    description:
      "Unrestricted 360° executive control over AI business intelligence, financial tax ledgers, staff commission structures, inventory cost valuations, bank configuration, and multi-branch operations.",
    defaultTab: "owner",
    allowedTabs: [
      "frontdesk",
      "owner",
      "overview",
      "calendar",
      "pos",
      "customers",
      "services",
      "staff",
      "inventory",
      "followups",
      "reports",
      "booking",
      "settings",
    ],
    capabilities: {
      canViewOwnerBI: true,
      canViewFinancialMargins: true,
      canViewTaxReports: true,
      canEditSalonSettings: true,
      canEditStaffCommissions: true,
      canManageStaffAttendance: true,
      canManageInventoryStock: true,
      canViewInventoryCost: true,
      canEditServices: true,
      canSendWhatsAppMarketing: true,
      canExportCrm: true,
      canCreateBilling: true,
      canAccessMultiCenter: true,
    },
  },

  admin: {
    role: "admin",
    label: "BillCare Platform Administrator",
    shortTitle: "Super Admin",
    badge: "Platform Admin",
    badgeClasses: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    iconName: "ShieldCheck",
    description: "Platform-wide administrative authority across all multi-tenant salon nodes.",
    defaultTab: "owner",
    allowedTabs: [
      "frontdesk",
      "owner",
      "overview",
      "calendar",
      "pos",
      "customers",
      "services",
      "staff",
      "inventory",
      "followups",
      "reports",
      "booking",
      "settings",
    ],
    capabilities: {
      canViewOwnerBI: true,
      canViewFinancialMargins: true,
      canViewTaxReports: true,
      canEditSalonSettings: true,
      canEditStaffCommissions: true,
      canManageStaffAttendance: true,
      canManageInventoryStock: true,
      canViewInventoryCost: true,
      canEditServices: true,
      canSendWhatsAppMarketing: true,
      canExportCrm: true,
      canCreateBilling: true,
      canAccessMultiCenter: true,
    },
  },
};

export function getRoleConfig(role?: string): RoleConfig {
  const normalized = (role || "").toLowerCase() as UserRole;
  return ROLE_CONFIGS[normalized] || ROLE_CONFIGS.owner;
}

export function canAccessTab(role: string | undefined, tab: DashboardTab): boolean {
  const config = getRoleConfig(role);
  return config.allowedTabs.includes(tab);
}

export function getRequiredRoleForTab(tab: DashboardTab): string {
  switch (tab) {
    case "owner":
    case "reports":
    case "settings":
      return "Owner";
    case "overview":
    case "staff":
    case "inventory":
    case "followups":
      return "Manager or Owner";
    default:
      return "Receptionist, Manager, or Owner";
  }
}
