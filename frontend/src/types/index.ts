export type TabType =
  | 'Home'
  | 'E-Permit Portal'
  | 'Citizen Portal'
  | 'My Applications'
  // 1. Business Permit Application Module
  | 'Business Permit Application'
  | 'Business Registration (New / Renewal)'
  | 'New Registration'
  | 'Renewal'
  | 'Requirements Submission'
  | 'AI Document Verification'
  | 'Fee Assessment & Computation'
  | 'Intelligent Approval Recommendation'
  | 'Permit Generation'
  | 'Application Status Tracking'
  // 2. Building & Construction Permits Module
  | 'Building & Construction Permits'
  | 'Building Permit Filing'
  | 'Building Permit Reviews'
  | 'Blueprint & Plan Inspection'
  | 'Inspector Scheduling & Dispatch'
  | 'On-Site Inspection & Scheduling'
  | 'On-Site Inspection & Scheduling Hub'
  | 'Plan & Blueprint Upload'
  | 'Inspection Scheduling'
  | 'AI Compliance Checking'
  | 'Automated Document Verification (OCR)'
  | 'Permit Approval & Release'
  | 'Construction Progress Monitoring'
  // 3. Franchise & Transport Permits Module
  | 'Franchise & Transport Permits'
  | 'Franchise Permit Filing'
  | 'Franchise Permit Review'
  | 'Route & Unit Inspection'
  | 'Route & Unit Inspection Audit'
  | 'Route & Unit Verification'
  | 'AI Route Conflict Check'
  | 'Franchise Fee Computation'
  | 'Fleet Progress Monitoring'
  // 4. Barangay Permit Integration Module
  | 'Barangay Permit Integration'
  | 'Barangay Clearance Registry'
  | '24-Barangay Network Grid'
  | '24-Barangay Clearance Network'
  | 'Barangay Integration Review'
  | 'Barangay Clearance Filing'
  | 'Community Clearance Validation'
  | 'Community Clearance Verification'
  | 'Inspection & Local Validation'
  | 'Barangay Permit Release'
  | 'Integration Status Tracking'
  // 5. E-Permit Tracker Module
  | 'E-Permit Tracker'
  | 'Public Reference Code Tracker'
  | 'QR Code Authenticity Verification'
  | 'QR Cryptographic Verification'
  | 'Live Application Milestone Status'
  | 'AI Clearance Audit'
  | 'Digital Permit Download'
  // Utility & Standard Nav Tabs
  | 'Public Services Portal'
  | 'Landing Page'
  | 'Permits & Licenses'
  | 'Payments'
  | 'My Documents'
  | 'Notifications'
  | 'Help & Support'
  | 'Settings'
  | 'Audit Logs'
  | 'Dashboard'
  | 'Permit Details'
  | 'AI Assistant (Chat)';

export interface RegistrationFormData {
  registrationType: 'new' | 'renewal';
  businessName: string;
  tradeName: string;
  businessType: string;
  businessSize: string;
  natureOfBusiness: string;
  businessDescription: string;
  unitFloorBuilding: string;
  streetNameNo: string;
  barangay: string;
  cityMunicipality: string;
  province: string;
  zipCode: string;
}

export interface ApplicationItem {
  id: string;
  applicant: string;
  type: string;
  status: string;
  statusColor: string;
  date: string;
  businessName?: string;
  category?: 'business' | 'building' | 'transport' | 'barangay' | 'inspection';
  address?: string;
  contact?: string;
  email?: string;
  assignedOfficer?: string;
  assignedInspector?: string;
  inspectionStatus?: 'Pending' | 'Scheduled' | 'Passed' | 'Failed';
  inspectionDate?: string;
  assessmentFee?: number;
  remarks?: string;
  requirements?: Array<{ name: string; status: 'Verified' | 'Pending' | 'Rejected' | 'Missing'; notes?: string }>;
  formData?: Record<string, any>;
  activityHistory?: Array<{ action: string; performedBy: string; timestamp: string; details?: string }>;
  permitNumber?: string;
  issueDate?: string;
  validUntil?: string;
  qrData?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  applicationId?: string;
  targetTab?: TabType;
}

export interface BusinessPermitItem {
  id: string;
  name: string;
  type: string;
  date: string;
  status: string;
  color: string;
}

export interface BuildingPermitItem {
  id: string;
  name: string;
  location: string;
  date: string;
  status: string;
  color: string;
}

export interface FranchisePermitItem {
  id: string;
  operator: string;
  type: string;
  date: string;
  status: string;
  color: string;
}

export interface BarangayPermitItem {
  id: string;
  applicant: string;
  type: string;
  date: string;
  status: string;
  color: string;
}

export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  organization?: string;
  citizenId?: string;
  avatarBg: string;
  phone?: string;
  mfaEnabled?: boolean;
}

export interface LoginCredentials {
  identifier: string; // Email or Citizen ID
  password: string;
  rememberMe?: boolean;
  role?: UserRole;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  citizenId: string;
  phone: string;
  businessName?: string;
  password: string;
  role: UserRole;
}

export const MOCK_USERS: Record<UserRole, UserProfile> = {
  user: {
    id: 'USR-2025-001',
    name: 'James Tejares',
    email: 'jamestejares1@gmail.com',
    role: 'user',
    roleTitle: 'Citizen / Business Owner',
    department: 'Private Enterprise Sector',
    organization: 'Tejares Enterprise & Trading',
    citizenId: 'PH-CITIZEN-00001',
    phone: '+63 917 000 0001',
    avatarBg: 'bg-blue-600',
    mfaEnabled: true
  },
  admin: {
    id: 'USR-2025-ADMIN',
    name: 'LGU System Administrator',
    email: 'admin@govserve.ph',
    role: 'admin',
    roleTitle: 'LGU Licensing & Permitting Officer',
    department: 'Business Permits & Licensing Office (BPLO)',
    organization: 'Local Government Licensing Authority',
    citizenId: 'LGU-ADMIN-001',
    phone: '+63 999 555 1111',
    avatarBg: 'bg-blue-600',
    mfaEnabled: false
  }
};