import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Building2,
  HardHat,
  Bus,
  Shield,
  UploadCloud,
  FileText,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Check,
  X,
  Camera,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Printer,
  Download,
  Share2,
  Filter,
  Eye,
  FileCheck,
  Sparkles,
  QrCode,
  CheckCircle,
  HelpCircle,
  Bell,
  SlidersHorizontal,
  Home,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  MapPin,
  ExternalLink,
  ChevronRight,
  Lock,
  Zap,
  Building,
  Users,
  Banknote,
  CreditCard,
  Layers,
  FolderOpen,
  CircleDot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './ui/LanguageToggle';
import { TabType, ApplicationItem } from '../types';

export interface EPermitTrackerModuleProps {
  currentTab?: TabType | string;
  applications?: ApplicationItem[];
  onNavigateToTab?: (tab: TabType | string) => void;
  onAddNewApplication?: (applicantName: string, permitType: string) => void;
  onNavigateToDashboard?: () => void;
  onUpdateApplicationStatus?: (appId: string, status: string, department?: string) => void;
}

export type PermitCategoryType = 'business' | 'building' | 'transport' | 'barangay';

export interface TrackingMilestone {
  step: number;
  title: string;
  status: 'completed' | 'current' | 'pending' | 'action_needed';
  date?: string;
  department?: string;
}

export interface UnifiedTrackingRecord {
  id: string;
  referenceCode: string;
  permitCategory: PermitCategoryType;
  permitType: string;
  applicant: string;
  businessName?: string;
  dateSubmitted: string;
  currentStatus: string;
  currentDepartment: string;
  assignedOffice: string;
  paymentStatus: string;
  documentStatus: string;
  lastUpdated: string;
  actionNeededText?: string;
  requiresAction?: boolean;
  milestones: TrackingMilestone[];
  uploadedDocuments: Array<{ name: string; type: string; date: string; size: string }>;
  qrHash?: string;
}

// Built-in Seed Registry connecting all 4 modules seamlessly
const SEED_TRACKING_RECORDS: Record<string, UnifiedTrackingRecord> = {
  'BP-2025-00045': {
    id: 'BP-2025-00045',
    referenceCode: 'BP-2025-00045',
    permitCategory: 'business',
    permitType: "Mayor's Business Permit (New)",
    applicant: 'ABC Trading',
    businessName: 'ABC Trading & General Merchandise',
    dateSubmitted: 'May 20, 2025',
    currentStatus: 'UNDER REVIEW',
    currentDepartment: 'Business Permit and Licensing Office (BPLO)',
    assignedOffice: 'LGU City Hall - Ground Floor Business One-Stop Shop',
    paymentStatus: 'Assessed & Paid (OR #88291)',
    documentStatus: 'Barangay Clearance & DTI Verified (Pending Fire Safety Cert)',
    lastUpdated: 'May 20, 2025 • 03:45 PM',
    requiresAction: true,
    actionNeededText: 'Please upload your missing Fire Safety Inspection Certificate (FSIC) to proceed.',
    milestones: [
      { step: 1, title: 'Application Submitted', status: 'completed', date: 'May 20, 2025 09:30 AM', department: 'Online Portal' },
      { step: 2, title: 'Initial Review', status: 'completed', date: 'May 20, 2025 11:15 AM', department: 'BPLO Intake' },
      { step: 3, title: 'Document Verification', status: 'action_needed', date: 'May 20, 2025 02:00 PM', department: 'Inspection Unit' },
      { step: 4, title: 'Department Processing', status: 'pending', department: 'BPLO Assessing' },
      { step: 5, title: 'Approval', status: 'pending', department: "City Mayor's Office" },
      { step: 6, title: 'Permit Ready for Release', status: 'pending', department: 'Records & Release' }
    ],
    uploadedDocuments: [
      { name: 'DTI_Registration_Certificate.pdf', type: 'PDF', date: 'May 20, 2025', size: '1.4 MB' },
      { name: 'Barangay_Business_Clearance.jpg', type: 'JPG', date: 'May 20, 2025', size: '820 KB' }
    ],
    qrHash: 'SHA256-BP-2025-00045-QC-VALID'
  },
  'BP-2026-000123': {
    id: 'BP-2026-000123',
    referenceCode: 'BP-2026-000123',
    permitCategory: 'business',
    permitType: "Mayor's Business Permit",
    applicant: 'Juan Dela Cruz',
    businessName: 'Apex Innovations Retail Hub',
    dateSubmitted: 'January 10, 2026',
    currentStatus: 'UNDER REVIEW',
    currentDepartment: 'Business Permit Office',
    assignedOffice: 'Quezon City Business Permit and Licensing Department',
    paymentStatus: 'Official Receipt #99102 Verified (₱3,450.00)',
    documentStatus: 'All primary clearances verified',
    lastUpdated: 'Today at 02:15 PM',
    requiresAction: false,
    milestones: [
      { step: 1, title: 'Application Submitted', status: 'completed', date: 'Jan 10, 2026 08:30 AM', department: 'Citizen Portal' },
      { step: 2, title: 'Initial Review', status: 'completed', date: 'Jan 10, 2026 10:15 AM', department: 'BPLO Intake Desk' },
      { step: 3, title: 'Document Verification', status: 'completed', date: 'Jan 10, 2026 01:20 PM', department: 'Automated OCR & Audit' },
      { step: 4, title: 'Department Processing', status: 'current', date: 'Jan 10, 2026 02:15 PM', department: 'Business Permit Office' },
      { step: 5, title: 'Approval', status: 'pending', department: "City Mayor's Desk" },
      { step: 6, title: 'Permit Ready for Release', status: 'pending', department: 'Digital Release Hub' }
    ],
    uploadedDocuments: [
      { name: 'SEC_Certificate_Registration.pdf', type: 'PDF', date: 'Jan 10, 2026', size: '2.1 MB' },
      { name: 'Lease_Contract_Notarized.pdf', type: 'PDF', date: 'Jan 10, 2026', size: '3.4 MB' },
      { name: 'Official_Receipt_OR99102.png', type: 'PNG', date: 'Jan 10, 2026', size: '640 KB' }
    ],
    qrHash: 'SHA256-BP-2026-000123-AUTHENTICATED'
  },
  'BC-2025-00125': {
    id: 'BC-2025-00125',
    referenceCode: 'BC-2025-00125',
    permitCategory: 'building',
    permitType: 'Building & Construction Permit (Residential)',
    applicant: 'Engr. Danilo Ramos',
    businessName: '2-Storey Residential House Project',
    dateSubmitted: 'May 18, 2025',
    currentStatus: 'UNDER REVIEW',
    currentDepartment: 'City Building Official (OBO)',
    assignedOffice: 'Engineering Office - Architectural & Structural Section',
    paymentStatus: 'Filing Fee Paid (₱8,500.00)',
    documentStatus: 'Blueprints & Structural Analysis Under Review',
    lastUpdated: 'May 19, 2025 • 10:45 AM',
    requiresAction: false,
    milestones: [
      { step: 1, title: 'Application Submitted', status: 'completed', date: 'May 18, 2025 09:00 AM', department: 'Engineering Portal' },
      { step: 2, title: 'Initial Review', status: 'completed', date: 'May 18, 2025 11:30 AM', department: 'Receiving Officer' },
      { step: 3, title: 'Document Verification', status: 'completed', date: 'May 18, 2025 03:00 PM', department: 'Zoning & Land Use' },
      { step: 4, title: 'Department Processing', status: 'current', date: 'May 19, 2025 10:45 AM', department: 'Structural Engineering Board' },
      { step: 5, title: 'Approval', status: 'pending', department: 'City Building Official' },
      { step: 6, title: 'Permit Ready for Release', status: 'pending', department: 'Engineering Releasing' }
    ],
    uploadedDocuments: [
      { name: 'Architectural_Plan_A1.dwg', type: 'CAD', date: 'May 18, 2025', size: '9.8 MB' },
      { name: 'Structural_Analysis_Computation.pdf', type: 'PDF', date: 'May 18, 2025', size: '4.2 MB' }
    ],
    qrHash: 'SHA256-BC-2025-00125-OBO-VALID'
  },
  'BLD-2026-000456': {
    id: 'BLD-2026-000456',
    referenceCode: 'BLD-2026-000456',
    permitCategory: 'building',
    permitType: 'Commercial Building Permit',
    applicant: 'Vertex Prime Real Estate Corp.',
    businessName: 'Vertex Heights 18-Storey Mixed-Use Tower',
    dateSubmitted: 'January 05, 2026',
    currentStatus: 'APPROVED',
    currentDepartment: 'City Building Official (OBO)',
    assignedOffice: 'Office of the Building Official - City Hall Complex',
    paymentStatus: 'Fully Paid (OR #BC-2026-9921)',
    documentStatus: 'All Engineering & Fire Safety Permits Approved',
    lastUpdated: 'Yesterday at 04:30 PM',
    requiresAction: false,
    milestones: [
      { step: 1, title: 'Application Submitted', status: 'completed', date: 'Jan 05, 2026', department: 'Engineering Portal' },
      { step: 2, title: 'Initial Review', status: 'completed', date: 'Jan 06, 2026', department: 'Intake Staff' },
      { step: 3, title: 'Document Verification', status: 'completed', date: 'Jan 08, 2026', department: 'Zoning & Fire Bureau' },
      { step: 4, title: 'Department Processing', status: 'completed', date: 'Jan 12, 2026', department: 'Structural Review Board' },
      { step: 5, title: 'Approval', status: 'completed', date: 'Jan 14, 2026', department: 'Office of the Building Official' },
      { step: 6, title: 'Permit Ready for Release', status: 'current', date: 'Jan 15, 2026', department: 'Digital Release' }
    ],
    uploadedDocuments: [
      { name: 'Complete_Engineering_Blueprints.pdf', type: 'PDF', date: 'Jan 05, 2026', size: '18.4 MB' },
      { name: 'Fire_Safety_Evaluation_Clearance.pdf', type: 'PDF', date: 'Jan 08, 2026', size: '2.6 MB' }
    ],
    qrHash: 'SHA256-BLD-2026-000456-AUTHENTICATED'
  },
  'FT-2025-00078': {
    id: 'FT-2025-00078',
    referenceCode: 'FT-2025-00078',
    permitCategory: 'transport',
    permitType: 'Franchise MTOP & Transport Permit',
    applicant: 'XYZ Express Transport Co.',
    businessName: 'XYZ Express Fleet Operators Association',
    dateSubmitted: 'May 17, 2025',
    currentStatus: 'UNDER REVIEW',
    currentDepartment: 'Tricycle Franchising & Regulatory Board (TFRB)',
    assignedOffice: 'Transport Regulatory Division - Traffic Management Bureau',
    paymentStatus: 'Tariff Paid (₱1,500.00)',
    documentStatus: 'LTO Official Receipt & Certificate of Registration Verified',
    lastUpdated: 'May 19, 2025 • 09:15 AM',
    requiresAction: false,
    milestones: [
      { step: 1, title: 'Application Submitted', status: 'completed', date: 'May 17, 2025', department: 'Online Portal' },
      { step: 2, title: 'Initial Review', status: 'completed', date: 'May 17, 2025', department: 'MTOP Registry' },
      { step: 3, title: 'Document Verification', status: 'completed', date: 'May 18, 2025', department: 'LTO Verification Link' },
      { step: 4, title: 'Department Processing', status: 'current', date: 'May 19, 2025', department: 'Route Quota Board' },
      { step: 5, title: 'Approval', status: 'pending', department: 'City Council Franchise Committee' },
      { step: 6, title: 'Permit Ready for Release', status: 'pending', department: 'Release & Decal Dispatch' }
    ],
    uploadedDocuments: [
      { name: 'LTO_OR_CR_Plate_Validation.pdf', type: 'PDF', date: 'May 17, 2025', size: '1.2 MB' },
      { name: 'TODA_Membership_Clearance.jpg', type: 'JPG', date: 'May 17, 2025', size: '750 KB' }
    ],
    qrHash: 'SHA256-FT-2025-00078-MTOP-VALID'
  },
  'FR-2026-000789': {
    id: 'FR-2026-000789',
    referenceCode: 'FR-2026-000789',
    permitCategory: 'transport',
    permitType: 'Franchise Annual Renewal',
    applicant: 'Rolando Santos',
    businessName: 'Commonwealth-Fairview TODA Unit #142',
    dateSubmitted: 'January 08, 2026',
    currentStatus: 'UNDER REVIEW',
    currentDepartment: 'Transport Regulatory Department',
    assignedOffice: 'TFRB Licensing and Regulatory Division',
    paymentStatus: 'Renewal Assessment Paid (₱1,200.00)',
    documentStatus: 'Roadworthiness & Smoke Emission Passed',
    lastUpdated: 'Today at 11:20 AM',
    requiresAction: false,
    milestones: [
      { step: 1, title: 'Application Submitted', status: 'completed', date: 'Jan 08, 2026', department: 'Online Portal' },
      { step: 2, title: 'Initial Review', status: 'completed', date: 'Jan 08, 2026', department: 'TFRB Intake' },
      { step: 3, title: 'Document Verification', status: 'completed', date: 'Jan 09, 2026', department: 'Emission & Inspection Hub' },
      { step: 4, title: 'Department Processing', status: 'current', date: 'Jan 10, 2026', department: 'Franchise Renewal Board' },
      { step: 5, title: 'Approval', status: 'pending', department: 'Council Representative' },
      { step: 6, title: 'Permit Ready for Release', status: 'pending', department: 'Decal Issuance Window' }
    ],
    uploadedDocuments: [
      { name: 'Smoke_Emission_Test_Passing.pdf', type: 'PDF', date: 'Jan 08, 2026', size: '950 KB' }
    ],
    qrHash: 'SHA256-FR-2026-000789-VALID'
  },
  'BR-2025-00033': {
    id: 'BR-2025-00033',
    referenceCode: 'BR-2025-00033',
    permitCategory: 'barangay',
    permitType: 'Barangay Business Clearance',
    applicant: 'Juan Dela Cruz',
    businessName: 'Dela Cruz Trading',
    dateSubmitted: 'May 16, 2025',
    currentStatus: 'APPROVED',
    currentDepartment: 'Barangay Poblacion Council Secretariat',
    assignedOffice: 'Barangay Hall - Public Services Center',
    paymentStatus: 'Official Fee Paid (₱500.00)',
    documentStatus: 'Residency & Community Tax (Cedula) Verified',
    lastUpdated: 'May 17, 2025 • 02:00 PM',
    requiresAction: false,
    milestones: [
      { step: 1, title: 'Application Submitted', status: 'completed', date: 'May 16, 2025', department: 'Barangay Portal' },
      { step: 2, title: 'Initial Review', status: 'completed', date: 'May 16, 2025', department: 'Barangay Secretary' },
      { step: 3, title: 'Document Verification', status: 'completed', date: 'May 16, 2025', department: 'Cedula / CTC Records' },
      { step: 4, title: 'Department Processing', status: 'completed', date: 'May 17, 2025', department: 'Lupon Tagapamayapa Clearance' },
      { step: 5, title: 'Approval', status: 'completed', date: 'May 17, 2025', department: 'Punong Barangay (Captain)' },
      { step: 6, title: 'Permit Ready for Release', status: 'completed', date: 'May 17, 2025', department: 'Digital Seal Active' }
    ],
    uploadedDocuments: [
      { name: 'Cedula_CTC_Certificate.jpg', type: 'JPG', date: 'May 16, 2025', size: '680 KB' },
      { name: 'Proof_Of_Residency_Bill.pdf', type: 'PDF', date: 'May 16, 2025', size: '1.1 MB' }
    ],
    qrHash: 'SHA256-BR-2025-00033-SEAL-AUTHENTIC'
  },
  'BC-2026-000321': {
    id: 'BC-2026-000321',
    referenceCode: 'BC-2026-000321',
    permitCategory: 'barangay',
    permitType: 'Barangay Residency Clearance & Endorsement',
    applicant: 'Maria Clara Santos',
    businessName: 'Santos Micro-Catering',
    dateSubmitted: 'January 11, 2026',
    currentStatus: 'READY FOR RELEASE',
    currentDepartment: 'Barangay Integration Office',
    assignedOffice: 'Barangay Operations Center',
    paymentStatus: 'Official Barangay Receipt #4410 Issued',
    documentStatus: '100% Complete & Digital Signature Affixed',
    lastUpdated: 'Today at 01:05 PM',
    requiresAction: false,
    milestones: [
      { step: 1, title: 'Application Submitted', status: 'completed', date: 'Jan 11, 2026', department: 'Online Portal' },
      { step: 2, title: 'Initial Review', status: 'completed', date: 'Jan 11, 2026', department: 'Barangay Desk' },
      { step: 3, title: 'Document Verification', status: 'completed', date: 'Jan 11, 2026', department: 'Civil Registry' },
      { step: 4, title: 'Department Processing', status: 'completed', date: 'Jan 12, 2026', department: 'Barangay Council' },
      { step: 5, title: 'Approval', status: 'completed', date: 'Jan 12, 2026', department: 'Barangay Captain' },
      { step: 6, title: 'Permit Ready for Release', status: 'current', date: 'Jan 12, 2026', department: 'Download & Pickup Ready' }
    ],
    uploadedDocuments: [
      { name: 'Valid_ID_Government_Issued.jpg', type: 'JPG', date: 'Jan 11, 2026', size: '540 KB' }
    ],
    qrHash: 'SHA256-BC-2026-000321-AUTHENTICATED'
  }
};

export const EPermitTrackerModule: React.FC<EPermitTrackerModuleProps> = ({
  currentTab,
  applications = [],
  onNavigateToTab,
  onAddNewApplication,
  onNavigateToDashboard,
  onUpdateApplicationStatus
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, language } = useLanguage();
  const isAdmin = user?.role === 'admin';

  // Navigation & Sub-views:
  // 'select_category' | 'track_application' | 'my_applications' | 'notifications'
  const [activeView, setActiveView] = useState<'select_category' | 'track_application' | 'my_applications' | 'notifications'>('select_category');
  
  // Selected category filter or module choice
  const [selectedCategory, setSelectedCategory] = useState<PermitCategoryType | 'all'>('all');
  
  // Reference search input
  const [inputReference, setInputReference] = useState<string>('');
  
  // Active loaded tracking record
  const [activeRecord, setActiveRecord] = useState<UnifiedTrackingRecord | null>(null);
  
  // Upload & Smart Auto-detection state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null);
  const [isAnalyzingFile, setIsAnalyzingFile] = useState<boolean>(false);
  const [detectedCategory, setDetectedCategory] = useState<{
    category: PermitCategoryType;
    categoryLabel: string;
    extractedCode: string;
    confidence: number;
  } | null>(null);
  const [showAutoDetectConfirm, setShowAutoDetectConfirm] = useState<boolean>(false);
  const [uploadDragOver, setUploadDragOver] = useState<boolean>(false);
  const [showManualLookup, setShowManualLookup] = useState<boolean>(false);
  
  // Missing requirement upload modal state (Required Action feature)
  const [showActionUploadModal, setShowActionUploadModal] = useState<boolean>(false);
  const [actionFile, setActionFile] = useState<File | null>(null);
  const [isSubmittingActionDoc, setIsSubmittingActionDoc] = useState<boolean>(false);
  
  // Profile dropdown state
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // My Applications filter & search
  const [myAppsCategoryFilter, setMyAppsCategoryFilter] = useState<'all' | PermitCategoryType>('all');
  const [myAppsSearchQuery, setMyAppsSearchQuery] = useState<string>('');

  // BPLO Detail Page View State ('mayor' | 'occupational' | 'bis' | 'verify' | null)
  const [bploDetailView, setBploDetailView] = useState<'mayor' | 'occupational' | 'bis' | 'verify' | null>(null);

  // Building & Construction Detail Page View State
  const [buildingDetailView, setBuildingDetailView] = useState<boolean>(false);

  // Franchise & Transport Detail Page View State
  const [transportDetailView, setTransportDetailView] = useState<'new_permit' | 'renewal' | 'amendment' | 'special_trip' | null>(null);

  // Notification preferences
  const [notifPrefs, setNotifPrefs] = useState({
    email: true,
    sms: true,
    inSystem: true
  });

  // Toast banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Synchronized unified records (merging seed records with user's real applications from props / localStorage)
  const unifiedRecords = useMemo(() => {
    const registry: Record<string, UnifiedTrackingRecord> = { ...SEED_TRACKING_RECORDS };

    // Also read any runtime records from localStorage
    try {
      const localAppsRaw = localStorage.getItem('govserve_applications_registry_v1');
      if (localAppsRaw) {
        const localApps: ApplicationItem[] = JSON.parse(localAppsRaw);
        localApps.forEach(app => {
          if (!registry[app.id]) {
            const cat: PermitCategoryType = 
              app.category === 'building' || app.type.toLowerCase().includes('building') ? 'building' :
              app.category === 'transport' || app.type.toLowerCase().includes('transport') || app.type.toLowerCase().includes('franchise') || app.type.toLowerCase().includes('mtop') ? 'transport' :
              app.category === 'barangay' || app.type.toLowerCase().includes('barangay') || app.type.toLowerCase().includes('cedula') ? 'barangay' : 'business';

            const dept = 
              cat === 'building' ? 'Office of the Building Official (OBO)' :
              cat === 'transport' ? 'Transport & Franchising Regulatory Board' :
              cat === 'barangay' ? 'Barangay Integration Office' : 'Business Permit & Licensing Office';

            const office =
              cat === 'building' ? 'City Engineering Department' :
              cat === 'transport' ? 'City Traffic & Transport Management Division' :
              cat === 'barangay' ? 'Barangay Affairs Coordination Hall' : 'Quezon City BPLO Main Hub';

            const isApproved = app.status === 'Approved';
            const isPendingReq = app.status.toLowerCase().includes('requirement') || app.status.toLowerCase().includes('action');

            registry[app.id] = {
              id: app.id,
              referenceCode: app.id,
              permitCategory: cat,
              permitType: app.type,
              applicant: app.applicant || 'Citizen Applicant',
              businessName: app.businessName || app.applicant,
              dateSubmitted: app.date || 'Recent',
              currentStatus: isApproved ? 'APPROVED' : isPendingReq ? 'NEEDS ACTION' : 'UNDER REVIEW',
              currentDepartment: dept,
              assignedOffice: office,
              paymentStatus: app.assessmentFee ? `Assessed Fee (₱${app.assessmentFee.toFixed(2)})` : 'Free Public Tariff / Paid',
              documentStatus: isPendingReq ? '1 Document Missing' : 'Initial Documents Uploaded',
              lastUpdated: 'Recently updated',
              requiresAction: isPendingReq,
              actionNeededText: isPendingReq ? 'Please upload your missing proof of payment or compliance requirement.' : undefined,
              milestones: [
                { step: 1, title: 'Application Submitted', status: 'completed', date: app.date || 'Recent', department: 'Online Portal' },
                { step: 2, title: 'Initial Review', status: 'completed', date: app.date || 'Recent', department: dept },
                { step: 3, title: 'Document Verification', status: isPendingReq ? 'action_needed' : 'completed', date: 'Recent', department: dept },
                { step: 4, title: 'Department Processing', status: isApproved ? 'completed' : isPendingReq ? 'pending' : 'current', department: dept },
                { step: 5, title: 'Approval', status: isApproved ? 'completed' : 'pending', department: office },
                { step: 6, title: 'Permit Ready for Release', status: isApproved ? 'completed' : 'pending', department: 'Digital Release' }
              ],
              uploadedDocuments: [
                { name: 'Initial_Application_Form.pdf', type: 'PDF', date: app.date || 'Recent', size: '1.1 MB' }
              ],
              qrHash: `SHA256-${app.id}-ONLINE`
            };
          }
        });
      }
    } catch (e) {
      console.warn('Failed to parse localStorage applications:', e);
    }

    // Merge applications passed via prop
    applications.forEach(app => {
      if (app && app.id && !registry[app.id]) {
        const cat: PermitCategoryType = 
          app.category === 'building' || app.type.toLowerCase().includes('building') ? 'building' :
          app.category === 'transport' || app.type.toLowerCase().includes('transport') || app.type.toLowerCase().includes('franchise') || app.type.toLowerCase().includes('mtop') ? 'transport' :
          app.category === 'barangay' || app.type.toLowerCase().includes('barangay') || app.type.toLowerCase().includes('cedula') ? 'barangay' : 'business';

        const dept = 
          cat === 'building' ? 'Office of the Building Official (OBO)' :
          cat === 'transport' ? 'Transport & Franchising Regulatory Board' :
          cat === 'barangay' ? 'Barangay Integration Office' : 'Business Permit & Licensing Office';

        const isApproved = app.status === 'Approved';

        registry[app.id] = {
          id: app.id,
          referenceCode: app.id,
          permitCategory: cat,
          permitType: app.type,
          applicant: app.applicant || 'Citizen Applicant',
          businessName: app.businessName || app.applicant,
          dateSubmitted: app.date || 'Recent',
          currentStatus: isApproved ? 'APPROVED' : 'UNDER REVIEW',
          currentDepartment: dept,
          assignedOffice: 'Quezon City LGU One-Stop Center',
          paymentStatus: app.assessmentFee ? `Assessed Fee (₱${app.assessmentFee.toFixed(2)})` : 'Official Receipt Active',
          documentStatus: 'Documents Filed',
          lastUpdated: 'Just now',
          requiresAction: false,
          milestones: [
            { step: 1, title: 'Application Submitted', status: 'completed', date: app.date, department: 'Online Portal' },
            { step: 2, title: 'Initial Review', status: 'completed', date: app.date, department: dept },
            { step: 3, title: 'Document Verification', status: 'completed', department: dept },
            { step: 4, title: 'Department Processing', status: isApproved ? 'completed' : 'current', department: dept },
            { step: 5, title: 'Approval', status: isApproved ? 'completed' : 'pending', department: dept },
            { step: 6, title: 'Permit Ready for Release', status: isApproved ? 'completed' : 'pending', department: 'Digital Release' }
          ],
          uploadedDocuments: [
            { name: 'Application_Submission_Receipt.pdf', type: 'PDF', date: app.date || 'Recent', size: '1.2 MB' }
          ],
          qrHash: `SHA256-${app.id}-PORTAL`
        };
      }
    });

    return registry;
  }, [applications]);

  // Count active applications per module for the 4 large cards
  const categoryCounts = useMemo(() => {
    const list = Object.values(unifiedRecords);
    return {
      business: list.filter(r => r.permitCategory === 'business').length,
      building: list.filter(r => r.permitCategory === 'building').length,
      transport: list.filter(r => r.permitCategory === 'transport').length,
      barangay: list.filter(r => r.permitCategory === 'barangay').length,
      total: list.length
    };
  }, [unifiedRecords]);

  // Business permit applicants list connected directly to Business Permit Module & LocalStorage
  const businessApplicants = useMemo(() => {
    return Object.values(unifiedRecords).filter(r => r.permitCategory === 'business');
  }, [unifiedRecords]);

  // Current category applicants
  const categoryApplicants = useMemo(() => {
    if (selectedCategory === 'all') return Object.values(unifiedRecords);
    return Object.values(unifiedRecords).filter(r => r.permitCategory === selectedCategory);
  }, [unifiedRecords, selectedCategory]);

  // Auto-load record when in track_application view if none is currently active
  useEffect(() => {
    if (activeView === 'track_application' && !activeRecord) {
      const match = Object.values(unifiedRecords).find(r => 
        selectedCategory === 'all' ? r.permitCategory === 'business' : r.permitCategory === selectedCategory
      ) || Object.values(unifiedRecords)[0];
      if (match) {
        setActiveRecord(match);
        setInputReference(match.referenceCode);
      }
    }
  }, [activeView, activeRecord, selectedCategory, unifiedRecords]);

  // Handle category selection from the 4 large cards
  const handleSelectModuleCard = (category: PermitCategoryType) => {
    setSelectedCategory(category);
    setActiveView('track_application');
    setBuildingDetailView(false);
    setBploDetailView(null);
    setTransportDetailView(null);
    
    // Pick the most relevant default record for quick exploration
    const match = Object.values(unifiedRecords).find(r => r.permitCategory === category);
    if (match) {
      setInputReference(match.referenceCode);
      setActiveRecord(match);
    }
  };

  // Perform lookup by reference code
  const handleLookupByCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) {
      showToast('Please enter a reference code (e.g. EP-2026-000123, BP-2025-00045)');
      return;
    }

    const found = unifiedRecords[clean] || Object.values(unifiedRecords).find(
      r => r.id.toUpperCase() === clean || r.referenceCode.toUpperCase() === clean
    );

    if (found) {
      setActiveRecord(found);
      setActiveView('track_application');
      showToast(`✓ Application Found: ${found.referenceCode}`);
    } else {
      // Dynamic fallback for any typed valid code format
      const isBld = clean.startsWith('BLD') || clean.startsWith('BC');
      const isTrp = clean.startsWith('FT') || clean.startsWith('FR') || clean.startsWith('MTOP');
      const isBrg = clean.startsWith('BR') || clean.startsWith('BC-') && !clean.startsWith('BC-2025');
      const category: PermitCategoryType = isBld ? 'building' : isTrp ? 'transport' : isBrg ? 'barangay' : 'business';

      const syntheticRecord: UnifiedTrackingRecord = {
        id: clean,
        referenceCode: clean,
        permitCategory: category,
        permitType: category === 'building' ? 'Building Permit' :
                    category === 'transport' ? 'Franchise & Transport Permit' :
                    category === 'barangay' ? 'Barangay Clearance' : 'Business Permit Application',
        applicant: user?.name || 'Registered Applicant',
        businessName: 'Official Registered Enterprise',
        dateSubmitted: 'January 2026',
        currentStatus: 'UNDER REVIEW',
        currentDepartment: category === 'building' ? 'Building Permit Office' :
                           category === 'transport' ? 'Transport Regulatory Office' :
                           category === 'barangay' ? 'Barangay Hall Secretariat' : 'Business Permit Office',
        assignedOffice: 'Quezon City LGU One-Stop Center',
        paymentStatus: 'Official Filing Fee Processed',
        documentStatus: 'Documents Authenticated',
        lastUpdated: 'Today at 02:40 PM',
        requiresAction: false,
        milestones: [
          { step: 1, title: 'Application Submitted', status: 'completed', date: 'Jan 10, 2026', department: 'Online Portal' },
          { step: 2, title: 'Initial Review', status: 'completed', date: 'Jan 11, 2026', department: 'Intake Staff' },
          { step: 3, title: 'Document Verification', status: 'completed', date: 'Jan 12, 2026', department: 'Evaluation Unit' },
          { step: 4, title: 'Department Processing', status: 'current', date: 'Jan 14, 2026', department: 'Assessing Bureau' },
          { step: 5, title: 'Approval', status: 'pending', department: 'Official Signatory' },
          { step: 6, title: 'Permit Ready for Release', status: 'pending', department: 'Release Center' }
        ],
        uploadedDocuments: [
          { name: 'Application_Document.pdf', type: 'PDF', date: 'Jan 10, 2026', size: '1.5 MB' }
        ],
        qrHash: `SHA256-${clean}-AUTHENTIC`
      };

      setActiveRecord(syntheticRecord);
      setActiveView('track_application');
      showToast(`✓ Application Found: ${clean}`);
    }
  };

  // Smart document / screenshot upload handler with automatic module & reference detection
  const handleFileUpload = (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|pdf)$/i)) {
      showToast('❌ Unsupported format. Please upload JPG, PNG, or PDF.');
      return;
    }

    setUploadedFile(file);
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setUploadedFilePreview(url);
    } else {
      setUploadedFilePreview(null);
    }

    // Start smart analysis & OCR simulation
    setIsAnalyzingFile(true);
    setTimeout(() => {
      setIsAnalyzingFile(false);

      // Intelligent detection based on file name or simulated OCR
      const fn = file.name.toUpperCase();
      let detectedCat: PermitCategoryType = 'business';
      let extractedRef = 'BP-2026-000123';
      let catLabel = 'Business Permit';

      if (fn.includes('BUILD') || fn.includes('CONSTRUCT') || fn.includes('BLD') || fn.includes('ARCH') || fn.includes('BC-2025')) {
        detectedCat = 'building';
        extractedRef = 'BLD-2026-000456';
        catLabel = 'Building & Construction Permit';
      } else if (fn.includes('TRANS') || fn.includes('FRANCHISE') || fn.includes('MTOP') || fn.includes('VEHICLE') || fn.includes('FT-')) {
        detectedCat = 'transport';
        extractedRef = 'FT-2025-00078';
        catLabel = 'Franchise & Transport Permit';
      } else if (fn.includes('BARANGAY') || fn.includes('CEDULA') || fn.includes('CTC') || fn.includes('CLEARANCE') || fn.includes('BR-')) {
        detectedCat = 'barangay';
        extractedRef = 'BR-2025-00033';
        catLabel = 'Barangay Permit';
      } else {
        // Match existing category if user had picked one
        if (selectedCategory !== 'all') {
          detectedCat = selectedCategory;
          catLabel = selectedCategory === 'building' ? 'Building & Construction Permit' :
                     selectedCategory === 'transport' ? 'Franchise & Transport Permit' :
                     selectedCategory === 'barangay' ? 'Barangay Permit' : 'Business Permit';
          extractedRef = selectedCategory === 'building' ? 'BC-2025-00125' :
                         selectedCategory === 'transport' ? 'FT-2025-00078' :
                         selectedCategory === 'barangay' ? 'BR-2025-00033' : 'BP-2026-000123';
        }
      }

      setDetectedCategory({
        category: detectedCat,
        categoryLabel: catLabel,
        extractedCode: extractedRef,
        confidence: 98.4
      });

      // Show the Friendly Confirmation Dialog: "Is this the application you want to track?"
      setShowAutoDetectConfirm(true);
    }, 900);
  };

  // Confirm auto-detected application
  const handleConfirmAutoDetect = () => {
    if (!detectedCategory) return;
    setShowAutoDetectConfirm(false);
    setSelectedCategory(detectedCategory.category);
    handleLookupByCode(detectedCategory.extractedCode);
  };

  // User chooses to select another permit
  const handleChooseAnotherPermit = () => {
    setShowAutoDetectConfirm(false);
    setUploadedFile(null);
    setUploadedFilePreview(null);
    setActiveView('select_category');
  };

  // Handle direct missing document upload (Required Action resolution)
  const handleActionDocumentSubmit = () => {
    if (!actionFile && !uploadedFile) {
      showToast('Please select a document or screenshot to upload.');
      return;
    }

    setIsSubmittingActionDoc(true);
    setTimeout(() => {
      setIsSubmittingActionDoc(false);
      setShowActionUploadModal(false);

      if (activeRecord) {
        const updatedRecord: UnifiedTrackingRecord = {
          ...activeRecord,
          currentStatus: 'UNDER REVIEW',
          requiresAction: false,
          actionNeededText: undefined,
          lastUpdated: 'Just now • Document Submitted',
          milestones: activeRecord.milestones.map(m => {
            if (m.status === 'action_needed') {
              return { ...m, status: 'completed', date: 'Just now' };
            }
            if (m.title === 'Department Processing') {
              return { ...m, status: 'current', date: 'In progress' };
            }
            return m;
          }),
          uploadedDocuments: [
            {
              name: actionFile ? actionFile.name : 'Missing_Document_Proof.pdf',
              type: 'PDF',
              date: 'Just now',
              size: '1.3 MB'
            },
            ...activeRecord.uploadedDocuments
          ]
        };

        setActiveRecord(updatedRecord);
        if (onUpdateApplicationStatus) {
          onUpdateApplicationStatus(activeRecord.id, 'Under Review', activeRecord.currentDepartment);
        }
        showToast('✓ Document uploaded successfully! Your application status has been updated to UNDER REVIEW.');
      }
      setActionFile(null);
    }, 1200);
  };

  // Friendly status message formatting helper
  const getFriendlyStatusText = (status: string, requiresAction?: boolean) => {
    if (requiresAction) {
      return 'Your application needs correction. Please check the required action below.';
    }
    const clean = status.toUpperCase();
    if (clean.includes('APPROV') || clean.includes('VALID')) {
      return 'Good news! Your permit has been approved.';
    }
    if (clean.includes('RELEASE') || clean.includes('READY')) {
      return 'Your permit is ready for release! Download your digital copy or pick it up at the office.';
    }
    if (clean.includes('REVIEW') || clean.includes('EVALUAT') || clean.includes('PROCESS') || clean.includes('INSPECT')) {
      return 'Your application is currently being reviewed.';
    }
    if (clean.includes('REQUIREMENT') || clean.includes('PENDING')) {
      return 'We need additional documents from you.';
    }
    if (clean.includes('REJECT') || clean.includes('CORRECT')) {
      return 'Your application needs correction. Please check the required action below.';
    }
    return 'Your application is currently being reviewed.';
  };

  // Filtered applications list for "My Applications" tab
  const filteredMyApplications = useMemo(() => {
    return Object.values(unifiedRecords).filter(record => {
      const matchCat = myAppsCategoryFilter === 'all' || record.permitCategory === myAppsCategoryFilter;
      const q = myAppsSearchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        record.referenceCode.toLowerCase().includes(q) ||
        record.applicant.toLowerCase().includes(q) ||
        (record.businessName && record.businessName.toLowerCase().includes(q)) ||
        record.permitType.toLowerCase().includes(q) ||
        record.currentStatus.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [unifiedRecords, myAppsCategoryFilter, myAppsSearchQuery]);

  // Download official tracking slip
  const handleDownloadTrackingSlip = (rec: UnifiedTrackingRecord) => {
    const text = `========================================================================================
GOVSERVE CENTRALIZED E-PERMIT TRACKING RECORD & OFFICIAL ATTESTATION
========================================================================================
REFERENCE CODE       : ${rec.referenceCode}
PERMIT CATEGORY      : ${rec.permitCategory.toUpperCase()} PERMIT
PERMIT TYPE          : ${rec.permitType}
CURRENT STATUS       : ${rec.currentStatus}
DATE SUBMITTED       : ${rec.dateSubmitted}
LAST UPDATED         : ${rec.lastUpdated}
----------------------------------------------------------------------------------------
APPLICANT / BUSINESS SPECIFICATIONS:
Applicant Name       : ${rec.applicant}
Commercial / Project : ${rec.businessName || rec.applicant}
Assigned Office      : ${rec.assignedOffice}
Current Department   : ${rec.currentDepartment}
Payment Status       : ${rec.paymentStatus}
Document Status      : ${rec.documentStatus}
----------------------------------------------------------------------------------------
APPLICATION PROGRESS TIMELINE:
${rec.milestones.map(m => `[Step ${m.step}] ${m.title.padEnd(28)} : ${m.status.toUpperCase()} ${m.date ? `(${m.date})` : ''}`).join('\n')}
----------------------------------------------------------------------------------------
CRYPTOGRAPHIC INTEGRITY:
Security Hash        : ${rec.qrHash || 'SHA256-GENUINE-LGU-RECORD'}
Attestation Timestamp: ${new Date().toLocaleString()}
Official Verification: Verified by GovServe Centralized E-Permit Tracker
========================================================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `E-Permit_Tracking_${rec.referenceCode}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded Tracking Slip for ${rec.referenceCode}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1220] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center space-x-2.5 animate-bounce">
          <Sparkles size={16} className="text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0B1220]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-xs px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Brand & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-white p-0.5 shadow-md flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200 dark:border-white/20">
              <img src="/government-logo.png" alt="Government Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                  GOVSERVE
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Action Controls, Dark Mode & Profile */}
          <div className="flex items-center space-x-3">
            {/* Home Navigation Button */}
            <button
              onClick={() => onNavigateToDashboard ? onNavigateToDashboard() : (onNavigateToTab ? onNavigateToTab('Home') : setActiveView('select_category'))}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 shadow-xs"
              title="Return to Home Portal"
            >
              <Home size={15} />
              <span>Home</span>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
            </button>

            {/* Citizen Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2.5 p-1.5 pl-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="text-left hidden sm:block pr-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[130px]">
                    {user?.name || 'User'}
                  </p>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name || 'Citizen User'}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">{user?.email || 'citizen@govserve.ph'}</p>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={() => { setProfileDropdownOpen(false); setActiveView('my_applications'); }}
                      className="w-full px-4 py-2 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2"
                    >
                      <FolderOpen size={14} className="text-blue-500" />
                      <span>My Applications ({categoryCounts.total})</span>
                    </button>
                    <button 
                      onClick={() => { setProfileDropdownOpen(false); setActiveView('notifications'); }}
                      className="w-full px-4 py-2 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2"
                    >
                      <Bell size={14} className="text-amber-500" />
                      <span>Notifications &amp; Alerts</span>
                    </button>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                    <button 
                      onClick={() => { setProfileDropdownOpen(false); logout(); }}
                      className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center space-x-2 font-semibold"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. FULL-WIDTH HERO SECTION (CENTERED HERO LAYOUT) */}
      {/* ========================================================================= */}
      <section className="w-full bg-transparent text-slate-900 dark:text-white pt-3 pb-1 px-4 sm:px-6 relative transition-colors">
        <div className="max-w-2xl mx-auto relative z-10 text-center space-y-0.5">
          <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {activeView === 'track_application' && selectedCategory === 'business'
              ? '🏛️ Business Permit Tracking Portal'
              : activeView === 'track_application' && selectedCategory === 'building'
              ? '🏗️ Building & Construction Permit Tracker'
              : activeView === 'track_application' && selectedCategory === 'transport'
              ? '🚐 Franchise & Transportation Tracking Portal'
              : 'Track Your Permit'}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-[11px] max-w-lg mx-auto leading-normal">
            {activeView === 'track_application' && selectedCategory === 'business'
              ? 'Monitor real-time evaluation, inspection schedules, and official permit issuance.'
              : activeView === 'track_application' && selectedCategory === 'building'
              ? 'Track real-time architectural, structural, and fire safety clearance across all 17 building permit services.'
              : activeView === 'track_application' && selectedCategory === 'transport'
              ? 'Monitor real-time route verification, LTO roadworthiness audit, and franchise issuance.'
              : 'Track the real-time review, inspection, and release status of your permit applications.'}
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE CONTAINER */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-2.5 space-y-3">
        
        {/* ======================================================================= */}
        {/* VIEW 1: SELECT PERMIT TYPE (THE 4 LARGE SELECTABLE CARDS)               */}
        {/* ======================================================================= */}
        {activeView === 'select_category' && (
          <div className="space-y-8 animate-in fade-in duration-200">

            {/* =================================================================== */}
            {/* THE FOUR SELECTABLE TRACKER CARDS (2-COLUMN COMPACT GRID) */}
            {/* =================================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto pt-2">
              
              {/* ======================================================================= */}
              {/* CARD 1: BUSINESS PERMIT TRACKER - BLUE / SKY THEME                      */}
              {/* ======================================================================= */}
              <div 
                className="relative overflow-hidden rounded-2xl glass-card p-4 group select-text flex flex-col justify-between w-full max-w-[430px] mx-auto"
              >
                <div className="flex flex-col justify-between gap-4 relative z-10 flex-1">
                  {/* Info & Details */}
                  <div className="space-y-2 min-w-0">
                    <div>
                      <h3 className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white tracking-tight leading-snug uppercase">
                        BUSINESS PERMIT TRACKER
                      </h3>
                    </div>

                    {/* 5 Information Rows with Circular Icons */}
                    <div className="space-y-1.5 pt-0.5">
                      {/* Row 1: Target Users */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Users size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">TARGET USERS</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Citizens, business owners, applicants, corporations &amp; representatives</p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Building2 size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">SERVICE METHOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Online permit tracking through centralized E-Permit system</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Clock size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">TIME PERIOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Real-time status and milestone updates (Instant 24/7 lookup)</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Banknote size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">CHARGES &amp; PAYMENT</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Free tracking service (₱0.00 Tariff)</p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <CreditCard size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">PAYMENT METHOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Use payment method provided by selected business permit service</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="w-full pt-1">
                    <button
                      type="button"
                      onClick={() => handleSelectModuleCard('business')}
                      className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 hover:scale-[1.005] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Track Business Permit →</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* CARD 2: BUILDING & CONSTRUCTION PERMIT TRACKER - BLUE THEME             */}
              {/* ======================================================================= */}
              <div 
                className="relative overflow-hidden rounded-2xl glass-card p-4 group select-text flex flex-col justify-between w-full max-w-[430px] mx-auto"
              >
                <div className="flex flex-col justify-between gap-4 relative z-10 flex-1">
                  {/* Info & Details */}
                  <div className="space-y-2 min-w-0">
                    <div>
                      <h3 className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white tracking-tight leading-snug uppercase">
                        BUILDING &amp; CONSTRUCTION PERMIT TRACKER
                      </h3>
                    </div>

                    {/* 5 Information Rows with Circular Icons */}
                    <div className="space-y-1.5 pt-0.5">
                      {/* Row 1: Target Users */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Users size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">TARGET USERS</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Property owners, civil engineers, architects, contractors &amp; reps</p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <HardHat size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">SERVICE METHOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Online tracking through GovServe Building Official portal</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Clock size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">TIME PERIOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Real-time architectural, structural &amp; fire milestone tracking</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Banknote size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">CHARGES &amp; PAYMENT</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Free tracking service (₱0.00 Tariff)</p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <CreditCard size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">PAYMENT METHOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Via City Building Official cashier or online portal payment</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="w-full pt-1">
                    <button
                      type="button"
                      onClick={() => handleSelectModuleCard('building')}
                      className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 hover:scale-[1.005] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Track Building Permit →</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* CARD 3: FRANCHISE & TRANSPORT PERMIT TRACKER - BLUE THEME               */}
              {/* ======================================================================= */}
              <div 
                className="relative overflow-hidden rounded-2xl glass-card p-4 group select-text flex flex-col justify-between w-full max-w-[430px] mx-auto"
              >
                <div className="flex flex-col justify-between gap-4 relative z-10 flex-1">
                  {/* Info & Details */}
                  <div className="space-y-2 min-w-0">
                    <div>
                      <h3 className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white tracking-tight leading-snug uppercase">
                        FRANCHISE &amp; TRANSPORT PERMIT TRACKER
                      </h3>
                    </div>

                    {/* 5 Information Rows with Circular Icons */}
                    <div className="space-y-1.5 pt-0.5">
                      {/* Row 1: Target Users */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Users size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">TARGET USERS</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">PUV operators, transport cooperatives, fleet owners, MTOP &amp; drivers</p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Bus size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">SERVICE METHOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Online tracking through Transport Regulatory system</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Clock size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">TIME PERIOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Real-time route validation, roadworthiness &amp; decal issuance</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Banknote size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">CHARGES &amp; PAYMENT</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Free tracking service (₱0.00 Tariff)</p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <CreditCard size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">PAYMENT METHOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Via GovServe online portal or TFRB cashier</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="w-full pt-1">
                    <button
                      type="button"
                      onClick={() => handleSelectModuleCard('transport')}
                      className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 hover:scale-[1.005] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Track Transport Permit →</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* CARD 4: BARANGAY PERMIT TRACKER - BLUE THEME                            */}
              {/* ======================================================================= */}
              <div 
                className="relative overflow-hidden rounded-2xl glass-card p-4 group select-text flex flex-col justify-between w-full max-w-[430px] mx-auto"
              >
                <div className="flex flex-col justify-between gap-4 relative z-10 flex-1">
                  {/* Info & Details */}
                  <div className="space-y-2 min-w-0">
                    <div>
                      <h3 className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white tracking-tight leading-snug uppercase">
                        BARANGAY PERMIT TRACKER
                      </h3>
                    </div>

                    {/* 5 Information Rows with Circular Icons */}
                    <div className="space-y-1.5 pt-0.5">
                      {/* Row 1: Target Users */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Users size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">TARGET USERS</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Residents, community business owners, homeowners &amp; reps</p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Shield size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">SERVICE METHOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Online tracking through 24-Barangay Integrated Network</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Clock size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">TIME PERIOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Real-time validation, Lupon clearance &amp; digital seal updates</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Banknote size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">CHARGES &amp; PAYMENT</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Free tracking service (₱0.00 Tariff)</p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <CreditCard size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">PAYMENT METHOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Via Barangay Hall cashier or online clearance portal</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="w-full pt-1">
                    <button
                      type="button"
                      onClick={() => handleSelectModuleCard('barangay')}
                      className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 hover:scale-[1.005] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Track Barangay Permit →</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* VIEW 2: TRACK APPLICATION & RESULTS INTERFACE                           */}
        {/* ======================================================================= */}
        {activeView === 'track_application' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            
            {/* Top Bar with Return to Categories */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <button
                onClick={() => {
                  setActiveView('select_category');
                  setBuildingDetailView(false);
                  setBploDetailView(null);
                  setTransportDetailView(null);
                }}
                className="self-start px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs text-slate-700 dark:text-slate-200"
              >
                <ArrowLeft size={12} />
                <span>Choose Another Permit Category</span>
              </button>

              {/* Active Category Indicator */}
              <div className="flex items-center space-x-1.5 text-[11px]">
                <span className="text-slate-400 font-medium">Tracking Mode:</span>
                <span className="px-2 py-0.5 rounded-full font-bold uppercase text-[9.5px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {selectedCategory === 'business' ? 'BPLO HUB' : selectedCategory === 'building' ? 'BUILDING & CONSTRUCTION PERMIT' : selectedCategory === 'transport' ? 'TRANSPORT & FRANCHISE HUB' : (selectedCategory === 'all' ? 'All Permitting Modules' : `${selectedCategory} Permit`)}
                </span>
              </div>
            </div>

            {selectedCategory === 'business' ? (
              /* =================================================================== */
              /* BPLO BUSINESS PERMIT TRACKING PORTAL (IN-PAGE DIRECT VIEW)          */
              /* =================================================================== */
              <div className="space-y-2.5">
                {bploDetailView !== null ? (
                  /* --------------------------------------------------------------- */
                  /* FULL PAGE DETAIL CONTENT (COMPACT IN-PAGE VIEW)                 */
                  /* --------------------------------------------------------------- */
                  <div className="space-y-3 animate-in fade-in duration-150">
                    {/* Top Bar for Detail View */}
                    <div className="flex items-center justify-between pb-0.5">
                      <button
                        type="button"
                        onClick={() => setBploDetailView(null)}
                        className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline cursor-pointer"
                      >
                        <ArrowLeft size={13} />
                        <span>Back to All Applications</span>
                      </button>
                    </div>

                    {/* Main Detail Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs space-y-3">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                            {bploDetailView === 'mayor' && "🏛️ MAYOR'S PERMIT APPLICATION STATUS"}
                            {bploDetailView === 'occupational' && "👷 WORK PERMIT & HEALTH CLEARANCE STATUS"}
                            {bploDetailView === 'bis' && "🏢 BUSINESS INFORMATION SYSTEM & CTC STATUS"}
                            {bploDetailView === 'verify' && "🔍 MAYOR'S PERMIT VERIFICATION & AUDIT RECORD"}
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                            {bploDetailView === 'mayor' && 'Apex Innovations Retail Hub'}
                            {bploDetailView === 'occupational' && 'Juan Dela Cruz'}
                            {bploDetailView === 'bis' && 'Online Business CTC (Cedula)'}
                            {bploDetailView === 'verify' && 'Apex Innovations Retail Hub'}
                          </h3>
                          <p className="text-[10.5px] text-slate-500 mt-0.5">
                            {bploDetailView === 'mayor' && (
                              <>Application No: <span className="font-mono font-bold text-blue-600">BP-2026-000123</span> • Owner: <span className="font-semibold text-slate-700 dark:text-slate-200">Jason Taccad</span> • Type: <span className="font-semibold text-slate-700 dark:text-slate-200">New Business Permit</span></>
                            )}
                            {bploDetailView === 'occupational' && (
                              <>Permit No: <span className="font-mono font-bold text-sky-600">WP-2026-000452</span> • Employer: <span className="font-semibold text-slate-700 dark:text-slate-200">Apex Innovations Retail Hub</span> • Position: <span className="font-semibold text-slate-700 dark:text-slate-200">Commercial Staff / Cashier</span></>
                            )}
                            {bploDetailView === 'bis' && (
                              <>Reference No: <span className="font-mono font-bold text-emerald-600">BIS-2026-000881</span> • Registered Owner: <span className="font-semibold text-slate-700 dark:text-slate-200">Jason Taccad</span> • Assessed Fee: <span className="font-semibold text-slate-700 dark:text-slate-200">₱220.00 (Paid via GCash)</span></>
                            )}
                            {bploDetailView === 'verify' && (
                              <>Verification ID: <span className="font-mono font-bold text-teal-600">VFY-2026-00319</span> • Permit No: <span className="font-semibold text-slate-700 dark:text-slate-200">QC-2026-004419</span> • Location: <span className="font-semibold text-slate-700 dark:text-slate-200">Aurora Blvd, Quezon City</span></>
                            )}
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                            bploDetailView === 'mayor' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' :
                            bploDetailView === 'occupational' ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800' :
                            bploDetailView === 'bis' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' :
                            'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                          }`}>
                            {bploDetailView === 'mayor' && 'IN PROGRESS'}
                            {bploDetailView === 'occupational' && 'IN PROGRESS'}
                            {bploDetailView === 'bis' && 'COMPLETED'}
                            {bploDetailView === 'verify' && 'VERIFIED ACTIVE'}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {bploDetailView === 'mayor' && 'Date Filed: January 10, 2026'}
                            {bploDetailView === 'occupational' && 'Date Filed: January 12, 2026'}
                            {bploDetailView === 'bis' && 'Date Filed: January 14, 2026'}
                            {bploDetailView === 'verify' && 'Date Verified: January 15, 2026'}
                          </span>
                        </div>
                      </div>

                      {/* Current Status Highlight Banner */}
                      <div className={`p-2.5 rounded-lg border ${
                        bploDetailView === 'mayor'
                          ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100'
                          : bploDetailView === 'occupational'
                          ? 'bg-sky-50/80 dark:bg-sky-950/40 border-sky-300 dark:border-sky-700 text-sky-900 dark:text-sky-100'
                          : bploDetailView === 'bis'
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100'
                          : 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-300 dark:border-teal-700 text-teal-900 dark:text-teal-100'
                      }`}>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[9px] font-black uppercase tracking-wider opacity-75">CURRENT STATUS:</span>
                          {bploDetailView === 'mayor' || bploDetailView === 'occupational' ? (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          ) : (
                            <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                          )}
                        </div>
                        <p className="text-xs sm:text-sm font-extrabold mt-0.5">
                          {bploDetailView === 'mayor' && 'STEP 2: UNDER EVALUATION (BPLO Frontline & Screening)'}
                          {bploDetailView === 'occupational' && 'STEP 2: FOR MEDICAL EXAM & CLEARANCE (City Health Office)'}
                          {bploDetailView === 'bis' && 'STEP 4: READY FOR DOWNLOAD (Electronic CTC Released)'}
                          {bploDetailView === 'verify' && 'STEP 4: VERIFIED ACTIVE & LEGITIMATE (Official BPLO LGU Registry)'}
                        </p>
                      </div>

                      {/* Section Title */}
                      <div className="space-y-2">
                        <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                          PROCESSING STAGES (PROCESS &amp; STATUS):
                        </span>

                        {/* CASE 1: MAYOR'S PERMIT */}
                        {bploDetailView === 'mayor' && (
                          <div className="space-y-2">
                            {/* Step 1 */}
                            <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2">
                              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-emerald-800 dark:text-emerald-200">
                                  [✓] STEP 1: APPLICATION SUBMITTED (Completed)
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> January 10, 2026
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> BPLO has officially received your application form and uploaded documentary proof (DTI, Barangay Clearance, Storefront photo).
                                </p>
                              </div>
                            </div>

                            {/* Step 2 */}
                            <div className="p-2.5 rounded-lg bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 flex items-start gap-2 ring-1 ring-amber-500/20">
                              <Clock size={16} className="text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                              <div className="space-y-0.5">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <p className="text-[11.5px] font-black text-amber-900 dark:text-amber-100">
                                    [⏳] STEP 2: UNDER EVALUATION (BPLO Frontline &amp; Screening)
                                  </p>
                                  <span className="px-1.5 py-0.5 rounded-full text-[8px] bg-amber-200 text-amber-900 font-extrabold uppercase">
                                    CURRENT STAGE
                                  </span>
                                </div>
                                <p className="text-[10.5px] text-slate-700 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> In progress (Evaluation Division)
                                </p>
                                <p className="text-[10.5px] text-slate-700 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> Licensing officers are reviewing uploaded DTI, Barangay Clearance, and business premises.
                                </p>
                                <p className="text-[10.5px] text-amber-800 dark:text-amber-200 font-medium pt-0.5">
                                  • <span className="font-semibold">Official Remarks:</span> "On-process for regulatory assessment."
                                </p>
                              </div>
                            </div>

                            {/* Step 3 */}
                            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start gap-2 opacity-75">
                              <CircleDot size={16} className="text-slate-400 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-slate-700 dark:text-slate-300">
                                  [ ] STEP 3: PAYMENT OF ASSESSMENT FEES (Pending)
                                </p>
                                <p className="text-[10.5px] text-slate-500">
                                  • <span className="font-semibold">Details:</span> Waiting for the official Tax Order of Payment (Assessment Fee computation). Online payment gateway will unlock once Step 2 is approved.
                                </p>
                              </div>
                            </div>

                            {/* Step 4 */}
                            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start gap-2 opacity-60">
                              <CircleDot size={16} className="text-slate-400 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-slate-700 dark:text-slate-300">
                                  [ ] STEP 4: PERMIT ISSUANCE &amp; DIGITAL RELEASE (Pending)
                                </p>
                                <p className="text-[10.5px] text-slate-500">
                                  • <span className="font-semibold">Details:</span> Official Electronic Mayor's Permit with authenticated QR code will be ready for instant download and printing.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* CASE 2: OCCUPATIONAL / WORK PERMIT */}
                        {bploDetailView === 'occupational' && (
                          <div className="space-y-2">
                            {/* Step 1 */}
                            <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2">
                              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-emerald-800 dark:text-emerald-200">
                                  [✓] STEP 1: REQUIREMENTS FILED (Completed)
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> January 12, 2026
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> Uploaded Barangay Clearance, Police/NBI Clearance, and 1x1 Photo.
                                </p>
                              </div>
                            </div>

                            {/* Step 2 */}
                            <div className="p-2.5 rounded-lg bg-sky-50/80 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-700 flex items-start gap-2 ring-1 ring-sky-500/20">
                              <Clock size={16} className="text-sky-600 shrink-0 mt-0.5 animate-pulse" />
                              <div className="space-y-0.5">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <p className="text-[11.5px] font-black text-sky-900 dark:text-sky-100">
                                    [⏳] STEP 2: MEDICAL EXAM &amp; CLEARANCE (City Health Office)
                                  </p>
                                  <span className="px-1.5 py-0.5 rounded-full text-[8px] bg-sky-200 text-sky-900 font-extrabold uppercase">
                                    CURRENT STAGE
                                  </span>
                                </div>
                                <p className="text-[10.5px] text-slate-700 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> In progress (City Health Department)
                                </p>
                                <p className="text-[10.5px] text-slate-700 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> Proceed to City Health Department for chest X-ray and laboratory urinalysis.
                                </p>
                                <p className="text-[10.5px] text-sky-800 dark:text-sky-200 font-medium pt-0.5">
                                  • <span className="font-semibold">Official Remarks:</span> "Proceed to City Health Department for diagnostic tests."
                                </p>
                              </div>
                            </div>

                            {/* Step 3 */}
                            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start gap-2 opacity-75">
                              <CircleDot size={16} className="text-slate-400 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-slate-700 dark:text-slate-300">
                                  [ ] STEP 3: PAYMENT &amp; HEALTH ORIENTATION (Pending)
                                </p>
                                <p className="text-[10.5px] text-slate-500">
                                  • <span className="font-semibold">Details:</span> Settle standard fee of ₱170.00 and attend the 15-minute sanitary orientation briefing.
                                </p>
                              </div>
                            </div>

                            {/* Step 4 */}
                            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start gap-2 opacity-60">
                              <CircleDot size={16} className="text-slate-400 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-slate-700 dark:text-slate-300">
                                  [ ] STEP 4: WORK CLEARANCE ID ISSUED (Pending)
                                </p>
                                <p className="text-[10.5px] text-slate-500">
                                  • <span className="font-semibold">Details:</span> Official Occupational Health Card ready for release upon passing laboratory tests.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* CASE 3: BUSINESS INFORMATION SYSTEM (ONLINE CTC / CEDULA) */}
                        {bploDetailView === 'bis' && (
                          <div className="space-y-2">
                            {/* Step 1 */}
                            <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2">
                              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-emerald-800 dark:text-emerald-200">
                                  [✓] STEP 1: CTC APPLICATION FILED (Completed)
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> January 14, 2026
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> Taxpayer filed declared gross sales receipts and business profile via online portal.
                                </p>
                              </div>
                            </div>

                            {/* Step 2 */}
                            <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2">
                              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-emerald-800 dark:text-emerald-200">
                                  [✓] STEP 2: TAX ASSESSMENT &amp; COMPUTATION (Completed)
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> January 14, 2026
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> City Treasurer's Office computed basic CTC fee (₱5.00) plus gross receipts surtax (₱215.00). Total: ₱220.00.
                                </p>
                              </div>
                            </div>

                            {/* Step 3 */}
                            <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2">
                              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-emerald-800 dark:text-emerald-200">
                                  [✓] STEP 3: ELECTRONIC PAYMENT CONFIRMED (Completed)
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> January 14, 2026
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> Electronic payment confirmed via GCash (Reference #GC-99482103). Official Receipt generated.
                                </p>
                              </div>
                            </div>

                            {/* Step 4 */}
                            <div className="p-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 flex items-start gap-2 ring-1 ring-emerald-500/20">
                              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <p className="text-[11.5px] font-black text-emerald-900 dark:text-emerald-100">
                                    [✓] STEP 4: DIGITAL CTC GENERATED &amp; RELEASED (Completed)
                                  </p>
                                  <span className="px-1.5 py-0.5 rounded-full text-[8px] bg-emerald-200 text-emerald-900 font-extrabold uppercase">
                                    READY FOR USE
                                  </span>
                                </div>
                                <p className="text-[10.5px] text-slate-700 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> January 14, 2026
                                </p>
                                <p className="text-[10.5px] text-slate-700 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> Official Electronic Community Tax Certificate generated with authenticated LGU QR seal.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* CASE 4: MAYOR'S PERMIT VERIFICATION & AUTHENTICITY */}
                        {bploDetailView === 'verify' && (
                          <div className="space-y-2">
                            {/* Step 1 */}
                            <div className="p-2.5 rounded-lg bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/50 flex items-start gap-2">
                              <CheckCircle size={16} className="text-teal-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-teal-800 dark:text-teal-200">
                                  [✓] STEP 1: CENTRAL REGISTRY QUERY (Completed)
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> January 15, 2026
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> Verified against Quezon City BPLO Master Business Database with active registered status.
                                </p>
                              </div>
                            </div>

                            {/* Step 2 */}
                            <div className="p-2.5 rounded-lg bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/50 flex items-start gap-2">
                              <CheckCircle size={16} className="text-teal-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-teal-800 dark:text-teal-200">
                                  [✓] STEP 2: REGULATORY CLEARANCES VALIDATED (Completed)
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> January 15, 2026
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> All regulatory clearances passed: Fire Safety (FSIC), Sanitary Permit, and Environmental Clearance.
                                </p>
                              </div>
                            </div>

                            {/* Step 3 */}
                            <div className="p-2.5 rounded-lg bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/50 flex items-start gap-2">
                              <CheckCircle size={16} className="text-teal-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-teal-800 dark:text-teal-200">
                                  [✓] STEP 3: TAX &amp; COMPLIANCE STATUS (Completed)
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> January 15, 2026
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> Zero delinquency flag. Current annual local business taxes and regulatory fees are fully settled.
                                </p>
                              </div>
                            </div>

                            {/* Step 4 */}
                            <div className="p-2.5 rounded-lg bg-teal-50/80 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-700 flex items-start gap-2 ring-1 ring-teal-500/20">
                              <CheckCircle2 size={16} className="text-teal-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <p className="text-[11.5px] font-black text-teal-900 dark:text-teal-100">
                                    [✓] STEP 4: OFFICIAL AUTHENTICITY VALIDATION (Completed)
                                  </p>
                                  <span className="px-1.5 py-0.5 rounded-full text-[8px] bg-teal-200 text-teal-900 font-extrabold uppercase">
                                    VERIFIED ACTIVE
                                  </span>
                                </div>
                                <p className="text-[10.5px] text-slate-700 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> January 15, 2026
                                </p>
                                <p className="text-[10.5px] text-slate-700 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> Authenticity QR security seal validated. Legitimate and authorized to operate until December 31, 2026.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 📌 WHAT YOU NEED TO DO NEXT Box */}
                      <div className="p-2.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 block">
                          📌 WHAT YOU NEED TO DO NEXT:
                        </span>
                        <p className="text-[11px] text-slate-700 dark:text-slate-200 leading-normal font-medium">
                          {bploDetailView === 'mayor' && '"No action required at this moment. Please wait for Step 2 evaluation to complete. Once approved, the payment gateway and assessment bill will unlock for Step 3."'}
                          {bploDetailView === 'occupational' && '"Please proceed to the City Health Department laboratory section with your referral slip to complete your medical tests."'}
                          {bploDetailView === 'bis' && '"Your electronic Community Tax Certificate (CTC) has been officially released and recorded in the LGU master database for official transactions."'}
                          {bploDetailView === 'verify' && '"This business holds an active, verified, and legitimate Mayor\'s Permit authorized by the Quezon City Government. Valid for commercial operations and banking/regulatory compliance."'}
                        </p>
                      </div>

                      {/* Bottom Back Button */}
                      <div className="pt-0.5">
                        <button
                          type="button"
                          onClick={() => setBploDetailView(null)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold transition-all inline-flex items-center space-x-1 cursor-pointer shadow-xs"
                        >
                          <ArrowLeft size={13} />
                          <span>Back to All Applications</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* --------------------------------------------------------------- */
                  /* ALL 4 SERVICES CARDS (COMPACT STACKED VIEW)                     */
                  /* --------------------------------------------------------------- */
                  <div className="space-y-2.5">
                    {/* 1. MAYOR'S PERMIT (BUSINESS) */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 sm:p-3.5 shadow-xs space-y-2 hover:border-blue-300 dark:hover:border-blue-700/60 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                            🏛️ MAYOR'S PERMIT (BUSINESS) APPLICATION RECORD
                          </span>
                          <h3 className="text-sm sm:text-[15px] font-black text-slate-900 dark:text-white mt-0.5">
                            Apex Innovations Retail Hub
                          </h3>
                          <p className="text-[10px] sm:text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Owner: <span className="font-semibold text-slate-700 dark:text-slate-200">Jason Taccad</span> • Line of Business: <span className="font-semibold text-slate-700 dark:text-slate-200">IT &amp; Electronics Retail</span> • Type: <span className="font-semibold text-slate-700 dark:text-slate-200">New Business Permit</span>
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="font-mono text-[11px] font-extrabold text-blue-600 dark:text-blue-400 block">
                            BP-2026-000123
                          </span>
                          <span className="text-[9.5px] text-slate-400">
                            Date Filed: January 10, 2026
                          </span>
                        </div>
                      </div>

                      {/* Status & Remarks */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-0.5">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 block">
                            CURRENT STATUS
                          </span>
                          <p className="text-[11px] font-extrabold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            STEP 2: UNDER EVALUATION (BPLO Frontline &amp; Screening)
                          </p>
                        </div>

                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-0.5">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-400 block">
                            OFFICIAL REMARKS
                          </span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight truncate sm:whitespace-normal">
                            "Verifying uploaded DTI, Barangay Clearance, and Storefront proof."
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => setBploDetailView('mayor')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer shadow-xs"
                        >
                          <Eye size={12} />
                          <span>View Status &amp; Timeline</span>
                        </button>
                      </div>
                    </div>

                    {/* 2. OCCUPATIONAL / WORK PERMIT */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 sm:p-3.5 shadow-xs space-y-2 hover:border-sky-300 dark:hover:border-sky-700/60 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 block">
                            👷 OCCUPATIONAL / WORK PERMIT APPLICATION RECORD
                          </span>
                          <h3 className="text-sm sm:text-[15px] font-black text-slate-900 dark:text-white mt-0.5">
                            Juan Dela Cruz
                          </h3>
                          <p className="text-[10px] sm:text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Applicant: <span className="font-semibold text-slate-700 dark:text-slate-200">Juan Dela Cruz</span> • Position: <span className="font-semibold text-slate-700 dark:text-slate-200">Commercial Staff / Cashier</span> • Employer: <span className="font-semibold text-slate-700 dark:text-slate-200">Apex Innovations Retail Hub</span> • Type: <span className="font-semibold text-slate-700 dark:text-slate-200">Health Card &amp; Work Clearance</span>
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="font-mono text-[11px] font-extrabold text-sky-600 dark:text-sky-400 block">
                            WP-2026-000452
                          </span>
                          <span className="text-[9.5px] text-slate-400">
                            Date Filed: January 12, 2026
                          </span>
                        </div>
                      </div>

                      {/* Status & Remarks */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 space-y-0.5">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-sky-700 dark:text-sky-300 block">
                            CURRENT STATUS
                          </span>
                          <p className="text-[11px] font-extrabold text-sky-800 dark:text-sky-200 flex items-center gap-1.5">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                            STEP 2: FOR MEDICAL EXAM &amp; CLEARANCE (City Health Office)
                          </p>
                        </div>

                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-0.5">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-400 block">
                            OFFICIAL REMARKS
                          </span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight truncate sm:whitespace-normal">
                            "Proceed to City Health Department for X-ray and Urinalysis laboratory submission."
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => setBploDetailView('occupational')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer shadow-xs"
                        >
                          <Eye size={12} />
                          <span>View Status &amp; Timeline</span>
                        </button>
                      </div>
                    </div>

                    {/* 3. BUSINESS INFORMATION SYSTEM (BIS / CTC) */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 sm:p-3.5 shadow-xs space-y-2 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                            🏢 BUSINESS INFORMATION SYSTEM (REGISTRY &amp; CTC REQUEST)
                          </span>
                          <h3 className="text-sm sm:text-[15px] font-black text-slate-900 dark:text-white mt-0.5">
                            Online Business CTC (Cedula)
                          </h3>
                          <p className="text-[10px] sm:text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Business: <span className="font-semibold text-slate-700 dark:text-slate-200">Apex Innovations Retail Hub</span> • Owner: <span className="font-semibold text-slate-700 dark:text-slate-200">Jason Taccad</span> • Requested Document: <span className="font-semibold text-slate-700 dark:text-slate-200">Online Business CTC (Cedula)</span> • Assessed Fee: <span className="font-semibold text-slate-700 dark:text-slate-200">₱220.00 (Paid via GCash)</span>
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="font-mono text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 block">
                            BIS-2026-000881
                          </span>
                          <span className="text-[9.5px] text-slate-400">
                            Date Filed: January 14, 2026
                          </span>
                        </div>
                      </div>

                      {/* Status & Remarks */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-0.5">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-emerald-700 dark:text-amber-300 block">
                            CURRENT STATUS
                          </span>
                          <p className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                            STEP 4: READY FOR DOWNLOAD (Electronic CTC Released)
                          </p>
                        </div>

                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-0.5">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-400 block">
                            OFFICIAL REMARKS
                          </span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight truncate sm:whitespace-normal">
                            "Electronic Community Tax Certificate generated with verified QR seal."
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => setBploDetailView('bis')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer shadow-xs"
                        >
                          <Eye size={12} />
                          <span>View Status &amp; Timeline</span>
                        </button>
                      </div>
                    </div>

                    {/* 4. MAYOR'S PERMIT VERIFICATION */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 sm:p-3.5 shadow-xs space-y-2 hover:border-teal-300 dark:hover:border-teal-700/60 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                            🔍 MAYOR'S PERMIT VERIFICATION &amp; AUTHENTICITY RECORD
                          </span>
                          <h3 className="text-sm sm:text-[15px] font-black text-slate-900 dark:text-white mt-0.5">
                            Apex Innovations Retail Hub
                          </h3>
                          <p className="text-[10px] sm:text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Permit No: <span className="font-semibold text-slate-700 dark:text-slate-200">QC-2026-004419</span> • Registered Owner: <span className="font-semibold text-slate-700 dark:text-slate-200">Jason Taccad</span> • Location: <span className="font-semibold text-slate-700 dark:text-slate-200">Aurora Blvd, Quezon City</span>
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="font-mono text-[11px] font-extrabold text-teal-600 dark:text-teal-400 block">
                            VFY-2026-00319
                          </span>
                          <span className="text-[9.5px] text-slate-400">
                            Date Verified: January 15, 2026
                          </span>
                        </div>
                      </div>

                      {/* Status & Remarks */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 space-y-0.5">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-300 block">
                            CURRENT STATUS
                          </span>
                          <p className="text-[11px] font-extrabold text-teal-800 dark:text-teal-200 flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-teal-600 shrink-0" />
                            VERIFIED ACTIVE &amp; LEGITIMATE (Official BPLO LGU Registry)
                          </p>
                        </div>

                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-0.5">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-400 block">
                            OFFICIAL REMARKS
                          </span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight truncate sm:whitespace-normal">
                            "Fully compliant with local regulatory standards. Valid until December 31, 2026."
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => setBploDetailView('verify')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer shadow-xs"
                        >
                          <Eye size={12} />
                          <span>View Status &amp; Timeline</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : selectedCategory === 'building' ? (
              /* =================================================================== */
              /* BUILDING & CONSTRUCTION PERMIT TRACKER PORTAL (OFFICE OF BUILDING OFFICIAL) */
              /* =================================================================== */
              <div className="space-y-2.5">
                {buildingDetailView ? (
                  /* --------------------------------------------------------------- */
                  /* STATE 2: 4-STAGE DETAILED ENGINEERING TIMELINE VIEW             */
                  /* --------------------------------------------------------------- */
                  <div className="space-y-3 animate-in fade-in duration-150">
                    {/* Top Back Button */}
                    <div className="flex items-center justify-between pb-0.5">
                      <button
                        type="button"
                        onClick={() => setBuildingDetailView(false)}
                        className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline cursor-pointer"
                      >
                        <ArrowLeft size={13} />
                        <span>Back to All Applications</span>
                      </button>
                    </div>

                    {/* Main Timeline Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs space-y-3">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                            🏗️ APPLICATION PROGRESS TIMELINE
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                            Metro East Corporate Center &amp; Plaza
                          </h3>
                          <p className="text-[10.5px] text-slate-500 mt-0.5">
                            Application Code: <span className="font-mono font-bold text-blue-600">QC-DBO-2026-89104</span> • Permit Type: <span className="font-semibold text-slate-700 dark:text-slate-200">#1 Building Permit (Core Construction P.D. 1096)</span> • Supervising Architect: <span className="font-semibold text-slate-700 dark:text-slate-200">Arch. Roberto S. Alcantara (PRC-ARCH-0044912)</span>
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                            STAGE 2 OF 4 • PRE-EVALUATED
                          </span>
                        </div>
                      </div>

                      {/* 4-Step Engineering Timeline */}
                      <div className="space-y-2">
                        {/* Step 1 */}
                        <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2">
                          <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="text-[11.5px] font-black text-emerald-800 dark:text-emerald-200">
                              [✓] STEP 1: ARCHITECTURAL &amp; STRUCTURAL PLANS SUBMITTED (Completed)
                            </p>
                            <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                              • <span className="font-semibold">Date:</span> September 24, 2026
                            </p>
                            <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                              • <span className="font-semibold">Details:</span> Ingestion of 5 sets of signed &amp; sealed blueprints, TCT title, and DOLE CSHP clearance.
                            </p>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="p-2.5 rounded-lg bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 flex items-start gap-2 ring-1 ring-amber-500/20">
                          <Clock size={16} className="text-amber-600 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <p className="text-[11.5px] font-black text-amber-900 dark:text-amber-100">
                                [●] STEP 2: ZONING &amp; LOCATIONAL CLEARANCE VERIFICATION (Current In Progress)
                              </p>
                              <span className="px-1.5 py-0.5 rounded-full text-[8px] bg-amber-200 text-amber-900 font-extrabold uppercase">
                                IN PROGRESS
                              </span>
                            </div>
                            <p className="text-[10.5px] text-slate-700 dark:text-slate-300">
                              • <span className="font-semibold">Date:</span> September 25, 2026
                            </p>
                            <p className="text-[10.5px] text-slate-700 dark:text-slate-300">
                              • <span className="font-semibold">Details:</span> Land use compliance and road right-of-way setback audit by City Planning &amp; Development.
                            </p>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start gap-2 opacity-75">
                          <div className="w-4 h-4 rounded-full border border-slate-400 text-slate-400 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                            3
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[11.5px] font-bold text-slate-700 dark:text-slate-300">
                              [○] STEP 3: JOINT STRUCTURAL &amp; FIRE SAFETY EVALUATION (Pending)
                            </p>
                            <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                              • Engineering structural load computation and BFP Fire Safety Inspection review.
                            </p>
                          </div>
                        </div>

                        {/* Step 4 */}
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start gap-2 opacity-75">
                          <div className="w-4 h-4 rounded-full border border-slate-400 text-slate-400 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                            4
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[11.5px] font-bold text-slate-700 dark:text-slate-300">
                              [○] STEP 4: BUILDING OFFICIAL APPROVAL &amp; PERMIT RELEASE (Pending)
                            </p>
                            <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                              • Final digital signature of City Building Official and release of official construction decal.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 📌 WHAT YOU NEED TO DO NEXT Box */}
                      <div className="p-2.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 block">
                          📌 WHAT YOU NEED TO DO NEXT:
                        </span>
                        <p className="text-[11px] text-slate-700 dark:text-slate-200 leading-normal font-medium">
                          "Your application is currently undergoing Step 2 zoning review. Please monitor your registered email for the schedule of fees once pre-evaluation is approved by the City Building Official."
                        </p>
                      </div>

                      {/* Bottom Back Button */}
                      <div className="pt-0.5">
                        <button
                          type="button"
                          onClick={() => setBuildingDetailView(false)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold transition-all inline-flex items-center space-x-1 cursor-pointer shadow-xs"
                        >
                          <ArrowLeft size={13} />
                          <span>Back to All Applications</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* --------------------------------------------------------------- */
                  /* STATE 1: SINGLE CARD OVERVIEW (ONLY 1 CARD, NO LIVE ACTIVE BANNER)*/
                  /* --------------------------------------------------------------- */
                  <div className="space-y-2.5">
                    {/* Main Container */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 sm:p-3.5 shadow-xs space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800 shrink-0">
                            <Building2 size={16} />
                          </div>
                          <div>
                            <h3 className="text-xs sm:text-[13px] font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                              Connected Building &amp; Construction Permit Applications
                            </h3>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              Live sync with Office of the Building Official (OBO) &amp; Engineering Dept.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Single Application Card */}
                      <div className="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/80 p-3 space-y-2 hover:border-blue-300 dark:hover:border-blue-700/60 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                          <div>
                            <span className="font-mono text-[11px] font-extrabold text-blue-600 dark:text-blue-400 block">
                              QC-DBO-2026-89104
                            </span>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                              Metro East Corporate Center &amp; Plaza
                            </h4>
                            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                              Permit Type: <span className="font-semibold text-slate-700 dark:text-slate-200">#1 Building Permit (Core Construction P.D. 1096)</span> • Applicant: <span className="font-semibold text-slate-700 dark:text-slate-200">{user?.name || 'Jason Taccad'}</span> • Supervising Architect: <span className="font-semibold text-slate-700 dark:text-slate-200">Arch. Roberto S. Alcantara</span>
                            </p>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                              IN PROGRESS • PRE-EVALUATED
                            </span>
                            <span className="text-[9.5px] text-slate-400 block mt-0.5">
                              Submitted: September 24, 2026
                            </span>
                          </div>
                        </div>

                        {/* Status & Remarks */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="p-2 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 space-y-0.5">
                            <span className="text-[8.5px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 block">
                              ENGINEERING STATUS
                            </span>
                            <p className="text-[10.5px] font-extrabold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                              <Clock size={12} className="text-blue-600 shrink-0" />
                              STAGE 2 OF 4 • ZONING &amp; LOCATIONAL REVIEW
                            </p>
                          </div>

                          <div className="p-2 rounded-lg bg-slate-100/60 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-0.5">
                            <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-400 block">
                              OFFICIAL REMARKS
                            </span>
                            <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">
                              "Architectural blueprints cleared. Locational setback review underway."
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() => setBuildingDetailView(true)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer shadow-xs"
                          >
                            <Eye size={12} />
                            <span>View Status &amp; Timeline</span>
                          </button>

                          <span className="inline-flex items-center space-x-1 font-bold text-[10px] text-blue-600 dark:text-blue-400">
                            <Check size={11} />
                            <span>Active Track</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : selectedCategory === 'transport' ? (
              /* =================================================================== */
              /* FRANCHISE & TRANSPORT PERMIT TRACKING PORTAL (IN-PAGE DIRECT VIEW)  */
              /* =================================================================== */
              <div className="space-y-2.5">
                {transportDetailView !== null ? (
                  /* --------------------------------------------------------------- */
                  /* FULL PAGE DETAIL CONTENT (TRANSPORT IN-PAGE VIEW)               */
                  /* --------------------------------------------------------------- */
                  <div className="space-y-3 animate-in fade-in duration-150">
                    {/* Top Bar for Detail View */}
                    <div className="flex items-center justify-between pb-0.5">
                      <button
                        type="button"
                        onClick={() => setTransportDetailView(null)}
                        className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline cursor-pointer"
                      >
                        <ArrowLeft size={13} />
                        <span>Back to All Applications</span>
                      </button>
                    </div>

                    {/* Main Detail Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs space-y-3">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                            {transportDetailView === 'new_permit' && "🚐 NEW TRANSPORT & VEHICLE PERMIT STATUS"}
                            {transportDetailView === 'renewal' && "🔄 FRANCHISE ANNUAL RENEWAL STATUS"}
                            {transportDetailView === 'amendment' && "🔁 AMENDMENT & UNIT SUBSTITUTION STATUS"}
                            {transportDetailView === 'special_trip' && "📋 SPECIAL TRIP CLEARANCE STATUS"}
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                            {transportDetailView === 'new_permit' && 'Danilo Macaraeg (Unit #108)'}
                            {transportDetailView === 'renewal' && 'Rolando Santos (Unit #142)'}
                            {transportDetailView === 'amendment' && 'Eduardo Ramirez (Unit #019)'}
                            {transportDetailView === 'special_trip' && 'Rogelio Vargas (Tourist Van #08)'}
                          </h3>
                          <p className="text-[10.5px] text-slate-500 mt-0.5">
                            {transportDetailView === 'new_permit' && (
                              <>Ref No: <span className="font-mono font-bold text-blue-600">TR-2026-004821</span> • Operator: <span className="font-semibold text-slate-700 dark:text-slate-200">Danilo Macaraeg</span> • Route: <span className="font-semibold text-slate-700 dark:text-slate-200">Commonwealth-Fairview Corridor</span> • Plate/Body: <span className="font-semibold text-slate-700 dark:text-slate-200">4821-QC</span></>
                            )}
                            {transportDetailView === 'renewal' && (
                              <>Ref No: <span className="font-mono font-bold text-sky-600">FR-2026-009142</span> • Operator: <span className="font-semibold text-slate-700 dark:text-slate-200">Rolando Santos</span> • Route: <span className="font-semibold text-slate-700 dark:text-slate-200">Novaliches-Bayan TODA</span> • Unit: <span className="font-semibold text-slate-700 dark:text-slate-200">PUV Unit #142</span></>
                            )}
                            {transportDetailView === 'amendment' && (
                              <>Ref No: <span className="font-mono font-bold text-amber-600">AS-2026-002377</span> • Operator: <span className="font-semibold text-slate-700 dark:text-slate-200">Eduardo Ramirez</span> • Line: <span className="font-semibold text-slate-700 dark:text-slate-200">Cubao-Anonas Route Line</span> • Type: <span className="font-semibold text-slate-700 dark:text-slate-200">Motor &amp; Chassis Replacement</span></>
                            )}
                            {transportDetailView === 'special_trip' && (
                              <>Ref No: <span className="font-mono font-bold text-emerald-600">ST-2026-006510</span> • Operator: <span className="font-semibold text-slate-700 dark:text-slate-200">Rogelio Vargas</span> • Destination: <span className="font-semibold text-slate-700 dark:text-slate-200">QC Hall to Intramuros Tour</span> • Service: <span className="font-semibold text-slate-700 dark:text-slate-200">Special Out-of-Line Authority</span></>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            transportDetailView === 'special_trip'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                              : transportDetailView === 'renewal'
                              ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                          }`}>
                            {transportDetailView === 'new_permit' && 'UNDER REVIEW'}
                            {transportDetailView === 'renewal' && 'AUDIT IN PROGRESS'}
                            {transportDetailView === 'amendment' && 'PENDING INSPECTION'}
                            {transportDetailView === 'special_trip' && 'READY FOR RELEASE'}
                          </span>
                        </div>
                      </div>

                      {/* Official Regulatory Agency Bar */}
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-[10.5px] space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-slate-500 uppercase text-[9px] block">OFFICIAL REGULATORY AGENCY:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              Transport &amp; Franchise Regulatory Board (TFRB) • LTO Public Licensing Unit
                            </span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-500 uppercase text-[9px] block">FEE &amp; TARIFF STATUS:</span>
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                              {transportDetailView === 'new_permit' && '₱1,350.00 Base Regulatory Franchise Tariff (Paid • OR #TFRB-88392)'}
                              {transportDetailView === 'renewal' && '₱1,250.00 Annual Vehicle Franchise Renewal Tariff (Paid • OR #FR-44109)'}
                              {transportDetailView === 'amendment' && '₱850.00 Unit Substitution Filing Fee (Paid • OR #AS-31084)'}
                              {transportDetailView === 'special_trip' && '₱600.00 Special Out-of-Line Permit Tariff (Paid • OR #ST-11928)'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Timeline Section */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                          <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                            Application Progress Timeline
                          </h4>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {transportDetailView === 'special_trip' ? 'Stage 4 of 4 • COMPLETED' : 'Stage 2 of 4 • IN PROGRESS'}
                          </span>
                        </div>

                        {/* CASE 1: NEW TRANSPORT & VEHICLE PERMIT */}
                        {transportDetailView === 'new_permit' && (
                          <div className="space-y-2">
                            {/* Step 1 */}
                            <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2">
                              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-emerald-800 dark:text-emerald-200">
                                  [✓] STEP 1: LTO OR/CR &amp; APPLICANT DOSSIER INTAKE (Completed)
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> October 20, 2026
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> LTO Certificate of Registration, Official Receipt, Professional Driver's License, and TODA route endorsement verified.
                                </p>
                              </div>
                            </div>

                            {/* Step 2 */}
                            <div className="p-2.5 rounded-lg bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 flex items-start gap-2 ring-1 ring-amber-500/20">
                              <Clock size={16} className="text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                              <div className="space-y-0.5">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <p className="text-[11.5px] font-black text-amber-900 dark:text-amber-100">
                                    [⏳] STEP 2: ROUTE ALLOCATION &amp; CONFLICT AUDIT (TFRB Planning Unit)
                                  </p>
                                  <span className="px-1.5 py-0.5 rounded-full text-[8px] bg-amber-200 text-amber-900 font-extrabold uppercase">
                                    CURRENT STAGE
                                  </span>
                                </div>
                                <p className="text-[10.5px] text-slate-700 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> In progress (TFRB Planning &amp; Regulatory Unit)
                                </p>
                                <p className="text-[10.5px] text-slate-700 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> Urban Transport Division verifying route capacity, authorized drop zones, and ensuring zero route collision along Commonwealth Avenue corridor.
                                </p>
                                <p className="text-[10.5px] text-amber-800 dark:text-amber-200 font-medium pt-0.5">
                                  • <span className="font-semibold">Official Remarks:</span> "Verifying uploaded LTO OR/CR, Professional Driver's License, and TODA line quota."
                                </p>
                              </div>
                            </div>

                            {/* Step 3 */}
                            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start gap-2 opacity-75">
                              <CircleDot size={16} className="text-slate-400 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-slate-700 dark:text-slate-300">
                                  [ ] STEP 3: PHYSICAL ROADWORTHINESS &amp; SMOKE EMISSION AUDIT (Pending Step 2)
                                </p>
                                <p className="text-[10.5px] text-slate-500">
                                  • <span className="font-semibold">Details:</span> Vehicle inspection at City Mechanics Bay: Headlights, brakes, side mirrors, and passing smoke emission carbon reading test.
                                </p>
                              </div>
                            </div>

                            {/* Step 4 */}
                            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start gap-2 opacity-60">
                              <CircleDot size={16} className="text-slate-400 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-slate-700 dark:text-slate-300">
                                  [ ] STEP 4: OFFICIAL FRANCHISE SEAL &amp; VEHICLE DECAL RELEASE (Pending)
                                </p>
                                <p className="text-[10.5px] text-slate-500">
                                  • <span className="font-semibold">Details:</span> City Council Transportation Committee approval, tamper-proof windshield QR decal release, and MTOP laminated certificate issuance.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* CASE 2: FRANCHISE RENEWAL */}
                        {transportDetailView === 'renewal' && (
                          <div className="space-y-2">
                            {/* Step 1 */}
                            <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2">
                              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-emerald-800 dark:text-emerald-200">
                                  [✓] STEP 1: RENEWAL APPLICATION &amp; RECORD AUDIT (Completed)
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> October 18, 2026
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> Previous franchise validity verified. Tax clearance and updated barangay public transport clearance submitted.
                                </p>
                              </div>
                            </div>

                            {/* Step 2 */}
                            <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2">
                              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-emerald-800 dark:text-emerald-200">
                                  [✓] STEP 2: COOP &amp; TODA ENDORSEMENT VALIDATION (Completed)
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> October 19, 2026
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> Novaliches-Bayan TODA confirmed active member in good standing with zero pending passenger complaints.
                                </p>
                              </div>
                            </div>

                            {/* Step 3 */}
                            <div className="p-2.5 rounded-lg bg-sky-50/80 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-700 flex items-start gap-2 ring-1 ring-sky-500/20">
                              <Clock size={16} className="text-sky-600 shrink-0 mt-0.5 animate-pulse" />
                              <div className="space-y-0.5">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <p className="text-[11.5px] font-black text-sky-900 dark:text-sky-100">
                                    [⏳] STEP 3: PHYSICAL ROADWORTHINESS &amp; EMISSION RE-TEST (Inspection Bay)
                                  </p>
                                  <span className="px-1.5 py-0.5 rounded-full text-[8px] bg-sky-200 text-sky-900 font-extrabold uppercase">
                                    CURRENT STAGE
                                  </span>
                                </div>
                                <p className="text-[10.5px] text-slate-700 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> In progress (Depot Inspection Bay &amp; Emission Unit)
                                </p>
                                <p className="text-[10.5px] text-slate-700 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> Annual unit presentation for safety audit: brake efficiency, signal lights, and DENR-compliant smoke test.
                                </p>
                                <p className="text-[10.5px] text-sky-800 dark:text-sky-200 font-medium pt-0.5">
                                  • <span className="font-semibold">Official Remarks:</span> "Annual fleet validation ongoing. Bring unit to testing bay for brakes and smoke test."
                                </p>
                              </div>
                            </div>

                            {/* Step 4 */}
                            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start gap-2 opacity-60">
                              <CircleDot size={16} className="text-slate-400 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-slate-700 dark:text-slate-300">
                                  [ ] STEP 4: ANNUAL VALIDATION QR STICKER &amp; MTOP RELEASE (Pending)
                                </p>
                                <p className="text-[10.5px] text-slate-500">
                                  • <span className="font-semibold">Details:</span> Laminated MTOP certificate renewed and hologram security sticker affixed to PUV windshield.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* CASE 3: AMENDMENT & UNIT SUBSTITUTION */}
                        {transportDetailView === 'amendment' && (
                          <div className="space-y-2">
                            {/* Step 1 */}
                            <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2">
                              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-emerald-800 dark:text-emerald-200">
                                  [✓] STEP 1: SUBSTITUTION FILING &amp; NOTARIZED DEED INTAKE (Completed)
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> October 19, 2026
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> Applicant filed formal request for motor substitution. Deed of Sale and vehicle transfer documents accepted.
                                </p>
                              </div>
                            </div>

                            {/* Step 2 */}
                            <div className="p-2.5 rounded-lg bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 flex items-start gap-2 ring-1 ring-amber-500/20">
                              <Clock size={16} className="text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                              <div className="space-y-0.5">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <p className="text-[11.5px] font-black text-amber-900 dark:text-amber-100">
                                    [⏳] STEP 2: PNP HPG &amp; STENCIL VERIFICATION (Traffic Division)
                                  </p>
                                  <span className="px-1.5 py-0.5 rounded-full text-[8px] bg-amber-200 text-amber-900 font-extrabold uppercase">
                                    CURRENT STAGE
                                  </span>
                                </div>
                                <p className="text-[10.5px] text-slate-700 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> In progress (Traffic &amp; Vehicle Registry Division)
                                </p>
                                <p className="text-[10.5px] text-slate-700 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> PNP Highway Patrol Group verifying engine and chassis numbers against national vehicle registry.
                                </p>
                                <p className="text-[10.5px] text-amber-800 dark:text-amber-200 font-medium pt-0.5">
                                  • <span className="font-semibold">Official Remarks:</span> "Deed of sale and engine stencil submitted. Verifying previous motor registration."
                                </p>
                              </div>
                            </div>

                            {/* Step 3 */}
                            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start gap-2 opacity-75">
                              <CircleDot size={16} className="text-slate-400 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-slate-700 dark:text-slate-300">
                                  [ ] STEP 3: REPLACEMENT UNIT PHYSICAL INSPECTION (Pending)
                                </p>
                                <p className="text-[10.5px] text-slate-500">
                                  • <span className="font-semibold">Details:</span> Engine displacement and safety compliance inspection of the newly mounted replacement engine.
                                </p>
                              </div>
                            </div>

                            {/* Step 4 */}
                            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start gap-2 opacity-60">
                              <CircleDot size={16} className="text-slate-400 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-slate-700 dark:text-slate-300">
                                  [ ] STEP 4: AMENDED FRANCHISE RESOLUTION ISSUANCE (Pending)
                                </p>
                                <p className="text-[10.5px] text-slate-500">
                                  • <span className="font-semibold">Details:</span> TFRB board resolution approving unit transfer and updated franchise certificate release.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* CASE 4: SPECIAL TRIP CLEARANCE */}
                        {transportDetailView === 'special_trip' && (
                          <div className="space-y-2">
                            {/* Step 1 */}
                            <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2">
                              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-emerald-800 dark:text-emerald-200">
                                  [✓] STEP 1: ITINERARY &amp; PASSENGER MANIFEST FILED (Completed)
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> October 21, 2026
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> Passenger headcount manifest, driver credentials, and point-to-point route itinerary successfully received.
                                </p>
                              </div>
                            </div>

                            {/* Step 2 */}
                            <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2">
                              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-emerald-800 dark:text-emerald-200">
                                  [✓] STEP 2: OUT-OF-LINE ROUTE &amp; INSURANCE CLEARANCE (Completed)
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> October 21, 2026
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> Passenger insurance coverage verified for inter-city travel. Traffic management coordination cleared.
                                </p>
                              </div>
                            </div>

                            {/* Step 3 */}
                            <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2">
                              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[11.5px] font-black text-emerald-800 dark:text-emerald-200">
                                  [✓] STEP 3: SPECIAL TARIFF ASSESSMENT &amp; GCASH PAYMENT (Completed)
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> October 21, 2026
                                </p>
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> Special trip regulatory tariff settled (₱600.00 via online portal • Official Receipt #ST-11928).
                                </p>
                              </div>
                            </div>

                            {/* Step 4 */}
                            <div className="p-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 flex items-start gap-2 ring-1 ring-emerald-500/20">
                              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <p className="text-[11.5px] font-black text-emerald-900 dark:text-emerald-100">
                                    [✓] STEP 4: SPECIAL TRIP PASS READY FOR RELEASE (Active Authority)
                                  </p>
                                  <span className="px-1.5 py-0.5 rounded-full text-[8px] bg-emerald-200 text-emerald-900 font-extrabold uppercase">
                                    AUTHORIZED
                                  </span>
                                </div>
                                <p className="text-[10.5px] text-slate-700 dark:text-slate-300">
                                  • <span className="font-semibold">Date:</span> October 21, 2026
                                </p>
                                <p className="text-[10.5px] text-slate-700 dark:text-slate-300">
                                  • <span className="font-semibold">Details:</span> Official Out-of-Line Travel Pass with cryptographic QR security seal released for specified itinerary dates.
                                </p>
                                <p className="text-[10.5px] text-emerald-800 dark:text-emerald-200 font-medium pt-0.5">
                                  • <span className="font-semibold">Official Remarks:</span> "Passenger manifest and route itinerary approved. Ready to print special pass."
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* What You Need to Do Next */}
                      <div className="p-2.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 block">
                          📌 WHAT YOU NEED TO DO NEXT:
                        </span>
                        <p className="text-[11px] text-slate-700 dark:text-slate-200 leading-normal font-medium">
                          {transportDetailView === 'new_permit' && '"Your route allocation review is underway at the TFRB Division (2-3 business days). Please stand by for an SMS notification with your scheduled inspection bay date at the City Transport Depot for Step 3."'}
                          {transportDetailView === 'renewal' && '"Please bring your PUV unit to the City Transport Inspection Depot (Bay 3) between 8:00 AM - 4:00 PM for the physical roadworthiness audit and smoke emission re-test."'}
                          {transportDetailView === 'amendment' && '"Stand by for PNP Highway Patrol Group stencil clearance validation. Once cleared, you will be invited to present the replacement motor unit for bay inspection."'}
                          {transportDetailView === 'special_trip' && '"Your Special Out-of-Line Permit is officially authorized and ready! You can present this digital pass or printed copy with QR code during route inspections."'}
                        </p>
                      </div>

                      {/* Bottom Back Button */}
                      <div className="pt-0.5">
                        <button
                          type="button"
                          onClick={() => setTransportDetailView(null)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold transition-all inline-flex items-center space-x-1 cursor-pointer shadow-xs"
                        >
                          <ArrowLeft size={13} />
                          <span>Back to All Applications</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* --------------------------------------------------------------- */
                  /* ALL 4 TRANSPORT SERVICES CARDS (MATCHING USER SCREENSHOT)       */
                  /* --------------------------------------------------------------- */
                  <div className="space-y-2.5">
                    {/* 1. APPLY FOR TRANSPORT & VEHICLE PERMIT */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 sm:p-3.5 shadow-xs space-y-2 hover:border-blue-300 dark:hover:border-blue-700/60 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                            🚐 NEW TRANSPORT &amp; VEHICLE PERMIT RECORD
                          </span>
                          <h3 className="text-sm sm:text-[15px] font-black text-slate-900 dark:text-white mt-0.5">
                            Danilo Macaraeg (Unit #108)
                          </h3>
                          <p className="text-[10px] sm:text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Operator: <span className="font-semibold text-slate-700 dark:text-slate-200">Danilo Macaraeg</span> • Route: <span className="font-semibold text-slate-700 dark:text-slate-200">Commonwealth-Fairview Corridor</span> • TODA: <span className="font-semibold text-slate-700 dark:text-slate-200">Commonwealth TODA</span> • Fee: <span className="font-semibold text-slate-700 dark:text-slate-200">₱1,350.00 Base Regulatory Tariff</span>
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="font-mono text-[11px] font-extrabold text-blue-600 dark:text-blue-400 block">
                            TR-2026-004821
                          </span>
                          <span className="text-[9.5px] text-slate-400">
                            Date Filed: October 20, 2026
                          </span>
                        </div>
                      </div>

                      {/* Status & Remarks */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-0.5">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 block">
                            CURRENT STATUS
                          </span>
                          <p className="text-[11px] font-extrabold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            ■ STEP 2: ROUTE ALLOCATION &amp; CONFLICT AUDIT (TFRB Planning &amp; Regulatory Unit)
                          </p>
                        </div>

                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-0.5">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-400 block">
                            OFFICIAL REMARKS
                          </span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight truncate sm:whitespace-normal">
                            "Verifying uploaded LTO OR/CR, Professional Driver's License, and TODA line quota."
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => setTransportDetailView('new_permit')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer shadow-xs"
                        >
                          <Eye size={12} />
                          <span>View Status &amp; Timeline</span>
                        </button>
                      </div>
                    </div>

                    {/* 2. FRANCHISE RENEWAL */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 sm:p-3.5 shadow-xs space-y-2 hover:border-blue-300 dark:hover:border-blue-700/60 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                            🔄 FRANCHISE ANNUAL RENEWAL RECORD
                          </span>
                          <h3 className="text-sm sm:text-[15px] font-black text-slate-900 dark:text-white mt-0.5">
                            Rolando Santos (Unit #142)
                          </h3>
                          <p className="text-[10px] sm:text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Operator: <span className="font-semibold text-slate-700 dark:text-slate-200">Rolando Santos</span> • Route: <span className="font-semibold text-slate-700 dark:text-slate-200">Novaliches-Bayan TODA</span> • Fee: <span className="font-semibold text-slate-700 dark:text-slate-200">₱1,250.00 Annual Tariff</span> • Decal: <span className="font-semibold text-slate-700 dark:text-slate-200">Validated</span>
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="font-mono text-[11px] font-extrabold text-blue-600 dark:text-blue-400 block">
                            FR-2026-009142
                          </span>
                          <span className="text-[9.5px] text-slate-400">
                            Date Filed: October 18, 2026
                          </span>
                        </div>
                      </div>

                      {/* Status & Remarks */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 space-y-0.5">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-sky-700 dark:text-sky-300 block">
                            CURRENT STATUS
                          </span>
                          <p className="text-[11px] font-extrabold text-sky-800 dark:text-sky-200 flex items-center gap-1.5">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                            ● STEP 3: PHYSICAL ROADWORTHINESS AUDIT (Depot Inspection Bay &amp; Emission Unit)
                          </p>
                        </div>

                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-0.5">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-400 block">
                            OFFICIAL REMARKS
                          </span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight truncate sm:whitespace-normal">
                            "Annual fleet validation ongoing. Bring unit to testing bay for brakes and smoke test."
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => setTransportDetailView('renewal')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer shadow-xs"
                        >
                          <Eye size={12} />
                          <span>View Status &amp; Timeline</span>
                        </button>
                      </div>
                    </div>

                    {/* 3. AMENDMENT & SUBSTITUTION */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 sm:p-3.5 shadow-xs space-y-2 hover:border-blue-300 dark:hover:border-blue-700/60 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                            🔁 AMENDMENT &amp; UNIT SUBSTITUTION RECORD
                          </span>
                          <h3 className="text-sm sm:text-[15px] font-black text-slate-900 dark:text-white mt-0.5">
                            Eduardo Ramirez (Unit #019)
                          </h3>
                          <p className="text-[10px] sm:text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Operator: <span className="font-semibold text-slate-700 dark:text-slate-200">Eduardo Ramirez</span> • Line: <span className="font-semibold text-slate-700 dark:text-slate-200">Cubao-Anonas Route</span> • Type: <span className="font-semibold text-slate-700 dark:text-slate-200">Motor &amp; Chassis Change</span> • Fee: <span className="font-semibold text-slate-700 dark:text-slate-200">₱850.00 Filing Fee</span>
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="font-mono text-[11px] font-extrabold text-blue-600 dark:text-blue-400 block">
                            AS-2026-002377
                          </span>
                          <span className="text-[9.5px] text-slate-400">
                            Date Filed: October 19, 2026
                          </span>
                        </div>
                      </div>

                      {/* Status & Remarks */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-0.5">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 block">
                            CURRENT STATUS
                          </span>
                          <p className="text-[11px] font-extrabold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            ■ STEP 2: PNP HPG &amp; STENCIL VERIFICATION (Traffic &amp; Vehicle Registry Division)
                          </p>
                        </div>

                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-0.5">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-400 block">
                            OFFICIAL REMARKS
                          </span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight truncate sm:whitespace-normal">
                            "Deed of sale and engine stencil submitted. Verifying previous motor registration."
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => setTransportDetailView('amendment')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer shadow-xs"
                        >
                          <Eye size={12} />
                          <span>View Status &amp; Timeline</span>
                        </button>
                      </div>
                    </div>

                    {/* 4. SPECIAL TRIP CLEARANCE */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 sm:p-3.5 shadow-xs space-y-2 hover:border-blue-300 dark:hover:border-blue-700/60 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                            📋 SPECIAL TRIP CLEARANCE APPLICATION RECORD
                          </span>
                          <h3 className="text-sm sm:text-[15px] font-black text-slate-900 dark:text-white mt-0.5">
                            Rogelio Vargas (Tourist Van #08)
                          </h3>
                          <p className="text-[10px] sm:text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Operator: <span className="font-semibold text-slate-700 dark:text-slate-200">Rogelio Vargas</span> • Designated Route: <span className="font-semibold text-slate-700 dark:text-slate-200">QC Hall to Intramuros Tour</span> • Fee: <span className="font-semibold text-slate-700 dark:text-slate-200">₱600.00 Special Tariff</span>
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="font-mono text-[11px] font-extrabold text-blue-600 dark:text-blue-400 block">
                            ST-2026-006510
                          </span>
                          <span className="text-[9.5px] text-slate-400">
                            Date Filed: October 21, 2026
                          </span>
                        </div>
                      </div>

                      {/* Status & Remarks */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-0.5">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">
                            CURRENT STATUS
                          </span>
                          <p className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            ● STEP 4: READY FOR RELEASE (Digital Out-of-Line Authority Issued)
                          </p>
                        </div>

                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-0.5">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-400 block">
                            OFFICIAL REMARKS
                          </span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight truncate sm:whitespace-normal">
                            "Passenger manifest and route itinerary approved. Ready to print special pass."
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => setTransportDetailView('special_trip')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer shadow-xs"
                        >
                          <Eye size={12} />
                          <span>View Status &amp; Timeline</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* =================================================================== */
              /* OTHER PERMIT MODULES (BARANGAY)                                     */
              /* =================================================================== */
              <>
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                      Connected Business Permit Applications
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Live sync with Business Permit &amp; Licensing Office (BPLO). Select an applicant to track:
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowManualLookup(prev => !prev)}
                  className="self-start sm:self-auto px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <Search size={13} className="text-blue-600 dark:text-blue-400" />
                  <span>{showManualLookup ? 'Hide Manual Search' : 'Lookup Other Code / Upload'}</span>
                </button>
              </div>

              {/* Applicant Selector Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {categoryApplicants.map((app) => {
                  const isSelected = activeRecord?.id === app.id;
                  const isApproved = app.currentStatus.toLowerCase().includes('approved');
                  const isAction = app.requiresAction;

                  return (
                    <div
                      key={app.id}
                      onClick={() => {
                        setActiveRecord(app);
                        setInputReference(app.referenceCode);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-50/90 dark:bg-blue-950/70 border-blue-500 dark:border-blue-500 shadow-md ring-2 ring-blue-500/20'
                          : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-extrabold text-blue-600 dark:text-blue-400">
                            {app.referenceCode}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isApproved
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : isAction
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          }`}>
                            {app.currentStatus}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                          {app.businessName || app.applicant}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          Owner: <span className="font-medium text-slate-700 dark:text-slate-300">{app.applicant}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-400">
                        <span>Submitted: {app.dateSubmitted}</span>
                        {isSelected && (
                          <span className="inline-flex items-center space-x-1 font-bold text-blue-600 dark:text-blue-400">
                            <Check size={12} />
                            <span>Active Track</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLLAPSIBLE MANUAL LOOKUP / UPLOAD SECTION */}
            {showManualLookup && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-top-3 duration-200">
                
                {/* PRIMARY METHOD: UPLOAD A DOCUMENT OR SCREENSHOT (7 Columns) */}
                <div className="lg:col-span-7 bg-gradient-to-br from-white via-slate-50/60 to-teal-50/30 dark:from-slate-900 dark:via-slate-900/95 dark:to-teal-950/20 rounded-3xl border border-teal-200/80 dark:border-teal-800/60 p-6 sm:p-7 shadow-xl shadow-teal-950/5 relative overflow-hidden flex flex-col justify-between space-y-4">
                  {/* Accent Top Glow Bar */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500" />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-md shadow-teal-500/25 ring-4 ring-teal-500/10">
                          <UploadCloud size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                            Upload Document or Screenshot
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                            Primary method • Instant AI code &amp; module extraction
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-teal-100/70 dark:bg-teal-950/70 px-3 py-1 rounded-full border border-teal-300 dark:border-teal-800 shadow-xs">
                        <Sparkles size={12} className="text-teal-600 dark:text-teal-400 animate-pulse" />
                        Recommended
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      Upload a clear photo, screenshot, QR code decal, or official permit receipt.
                    </p>

                    {/* Dropzone Area */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setUploadDragOver(true); }}
                      onDragLeave={() => setUploadDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setUploadDragOver(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleFileUpload(e.dataTransfer.files[0]);
                        }
                      }}
                      className={`group border-2 border-dashed rounded-2xl p-6 sm:p-7 text-center transition-all duration-300 cursor-pointer relative overflow-hidden ${
                        uploadDragOver
                          ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-950/50 scale-[1.01] shadow-lg shadow-teal-500/10'
                          : 'border-teal-200/90 dark:border-teal-800/80 bg-gradient-to-b from-white/90 via-teal-50/20 to-slate-50/80 dark:from-slate-900/90 dark:via-slate-800/40 dark:to-teal-950/30 hover:border-teal-500 dark:hover:border-teal-400 hover:shadow-md'
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0]);
                          }
                        }}
                      />
                      <input
                        type="file"
                        ref={cameraInputRef}
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0]);
                          }
                        }}
                      />

                      {isAnalyzingFile ? (
                        <div className="py-6 space-y-3">
                          <RefreshCw size={32} className="mx-auto text-teal-600 animate-spin" />
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Scanning document &amp; QR decal...
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Extracting application number and verifying official records...
                          </p>
                        </div>
                      ) : uploadedFile ? (
                        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center space-x-3">
                            {uploadedFilePreview ? (
                              <img 
                                src={uploadedFilePreview} 
                                alt="Uploaded document preview" 
                                className="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-sm"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center border border-teal-200">
                                <FileText size={28} />
                              </div>
                            )}
                            <div className="text-left">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                                {uploadedFile.name}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {(uploadedFile.size / 1024).toFixed(1)} KB • {uploadedFile.type || 'Document'}
                              </p>
                              <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md mt-1">
                                <Check size={11} />
                                <span>Scan Complete</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-center space-x-3 pt-2">
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                            >
                              Replace File
                            </button>
                            <button
                              onClick={() => { setUploadedFile(null); setUploadedFilePreview(null); }}
                              className="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950 hover:bg-rose-100 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                            >
                              Remove File
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="w-13 h-13 mx-auto rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-teal-500/25 group-hover:scale-110 group-hover:rotate-1 transition-all duration-300 ring-4 ring-teal-500/10">
                            <UploadCloud size={24} />
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">
                              Drag and drop your document here, or <span className="text-teal-600 dark:text-teal-400 underline underline-offset-4 decoration-teal-400/60 font-black">browse</span>
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300">JPG</span>
                              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300">PNG</span>
                              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300">PDF</span>
                              <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[10px] font-bold">QR DECAL</span>
                              <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] font-bold">RECEIPT</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile Camera Option & One-Click Test Files */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex items-center space-x-2 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer transition-all border border-slate-200 dark:border-slate-700 hover:scale-[1.02] shadow-xs"
                    >
                      <Camera size={14} className="text-teal-600 dark:text-teal-400" />
                      <span>Take Photo / Mobile Camera</span>
                    </button>

                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="text-slate-400 font-semibold mr-0.5">Sample Receipt:</span>
                      <button
                        onClick={() => {
                          const fakeFile = new File(['mock_receipt'], 'Official_Business_Receipt_BP-2026.png', { type: 'image/png' });
                          handleFileUpload(fakeFile);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-[11px] font-bold hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer transition-all shadow-xs"
                      >
                        Business Receipt
                      </button>
                      <button
                        onClick={() => {
                          const fakeFile = new File(['mock_building'], 'Building_Permit_BC_Receipt.pdf', { type: 'application/pdf' });
                          handleFileUpload(fakeFile);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[11px] font-bold hover:bg-amber-100 dark:hover:bg-amber-900 cursor-pointer transition-all shadow-xs"
                      >
                        Building Plan
                      </button>
                    </div>
                  </div>
                </div>

                {/* ALTERNATIVE METHOD: REFERENCE CODE OPTION (5 Columns) */}
                <div className="lg:col-span-5 bg-gradient-to-br from-white via-slate-50/60 to-blue-50/30 dark:from-slate-900 dark:via-slate-900/95 dark:to-blue-950/20 rounded-3xl border border-blue-200/80 dark:border-blue-800/60 p-6 sm:p-7 shadow-xl shadow-blue-950/5 relative overflow-hidden flex flex-col justify-between space-y-5">
                  {/* Accent Top Glow Bar */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-500" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-600/25 ring-4 ring-blue-500/10">
                          <FileCheck size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                            Enter Reference Code
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            Alternative method • Type your official permit code
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100/70 dark:bg-blue-950/70 px-3 py-1 rounded-full border border-blue-300 dark:border-blue-800 shadow-xs">
                        <Search size={12} className="text-blue-600 dark:text-blue-400" />
                        Direct Code
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      You do not need to remember complicated details. Enter your tracking number from your official receipt or permit document.
                    </p>

                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
                          Application Reference Code:
                        </label>
                        <span className="text-[10px] font-semibold text-slate-400">
                          Case-insensitive
                        </span>
                      </div>

                      <div className="relative flex items-center">
                        <div className="absolute left-3.5 text-blue-500 pointer-events-none">
                          <Search size={18} />
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. BP-2025-00045"
                          value={inputReference}
                          onChange={(e) => setInputReference(e.target.value.toUpperCase())}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleLookupByCode(inputReference); }}
                          className="w-full pl-10 pr-10 py-3.5 bg-slate-50/90 dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl text-sm font-mono font-extrabold tracking-wider text-slate-900 dark:text-white uppercase focus:outline-none focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:font-normal placeholder:font-sans placeholder:text-slate-400 shadow-inner"
                        />
                        {inputReference && (
                          <button
                            type="button"
                            onClick={() => setInputReference('')}
                            className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            title="Clear input"
                          >
                            <X size={15} />
                          </button>
                        )}
                      </div>

                      {/* Quick Sample Code Chips */}
                      <div className="flex items-center flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 mr-0.5">Quick Codes:</span>
                        <button
                          type="button"
                          onClick={() => setInputReference('BP-2025-00045')}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-all cursor-pointer"
                        >
                          BP-2025-00045
                        </button>
                        <button
                          type="button"
                          onClick={() => setInputReference('BLD-2026-000456')}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-all cursor-pointer"
                        >
                          BLD-2026-000456
                        </button>
                        <button
                          type="button"
                          onClick={() => setInputReference('FT-2025-00078')}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-all cursor-pointer"
                        >
                          FT-2025-00078
                        </button>
                        <button
                          type="button"
                          onClick={() => setInputReference('BR-2025-00033')}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-all cursor-pointer"
                        >
                          BR-2025-00033
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3">
                    <button
                      onClick={() => handleLookupByCode(inputReference)}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white rounded-2xl text-sm font-extrabold transition-all duration-200 flex items-center justify-center space-x-2.5 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
                    >
                      <span>Track Application</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                    </button>

                    <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span>Live sync with Business, Building, Transport &amp; Barangay records</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* =================================================================== */}
            {/* AUTOMATIC MODULE DETECTION MODAL / CONFIRMATION                     */}
            {/* =================================================================== */}
            {showAutoDetectConfirm && detectedCategory && (
              <div className="bg-gradient-to-r from-teal-50 via-sky-50 to-blue-50 dark:from-teal-950/60 dark:via-sky-950/60 dark:to-blue-950/60 border border-teal-300 dark:border-teal-700 rounded-3xl p-6 sm:p-7 shadow-lg space-y-4 animate-in zoom-in-95">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-300">
                        Automatic Module Detection
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        Detected: "{detectedCategory.categoryLabel}"
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                        Extracted Reference Number: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{detectedCategory.extractedCode}</span> ({detectedCategory.confidence}% Match)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl p-4 border border-teal-200 dark:border-teal-800 text-xs text-slate-700 dark:text-slate-300">
                  <p className="font-bold text-slate-900 dark:text-white mb-1">
                    Is this the application you want to track?
                  </p>
                  <p className="text-[11px] text-slate-500">
                    GovServe automatically matched your uploaded screenshot against active municipal permit databases.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={handleConfirmAutoDetect}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-md"
                  >
                    <Check size={14} />
                    <span>Yes, Track Application</span>
                  </button>
                  <button
                    onClick={handleChooseAnotherPermit}
                    className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Choose Another Permit
                  </button>
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* APPLICATION RESULT SECTION                                          */}
            {/* =================================================================== */}
            {activeRecord ? (
              <div className="space-y-6 pt-4 animate-in fade-in">
                
                {/* Result Top Banner */}
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-sky-950/40 border border-emerald-300 dark:border-emerald-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                      <CheckCircle size={26} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        LIVE APPLICATION TRACKING ACTIVE ✓
                      </span>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                        {activeRecord.businessName || activeRecord.applicant}
                      </h2>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {activeRecord.permitType} • Application Code: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{activeRecord.referenceCode}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleDownloadTrackingSlip(activeRecord)}
                      className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <Download size={14} />
                      <span>Download Tracking Slip</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <Printer size={14} />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                {/* =============================================================== */}
                {/* APPLICATION PROGRESS (VISUAL TIMELINE - PICTURE 1 ENHANCED)     */}
                {/* =============================================================== */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-900/5 relative overflow-hidden space-y-7">
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-400" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        Application Progress Timeline
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Visual milestone states: Completed (✓), Current (●), Pending (○), Action Needed (!)
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-3.5 py-1 rounded-full text-xs font-black bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-xs">
                        Stage {activeRecord.milestones.findIndex(m => m.status === 'current' || m.status === 'action_needed') + 1 || activeRecord.milestones.length} of {activeRecord.milestones.length} • {activeRecord.currentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal on Desktop / Vertical on Mobile */}
                  <div className="relative pt-2">
                    <div className="hidden lg:flex items-center justify-between relative">
                      {/* Background line centered at 22px */}
                      <div className="absolute top-[22px] left-8 right-8 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0 rounded-full" />

                      {activeRecord.milestones.map((milestone) => {
                        const isCompleted = milestone.status === 'completed';
                        const isCurrent = milestone.status === 'current';
                        const isAction = milestone.status === 'action_needed';
                        const isPending = milestone.status === 'pending';

                        return (
                          <div key={milestone.step} className="relative z-10 flex flex-col items-center text-center max-w-[150px]">
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all ${
                              isCompleted
                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950 shadow-emerald-500/25'
                                : isCurrent
                                ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-950 shadow-blue-500/25 animate-pulse'
                                : isAction
                                ? 'bg-amber-500 text-white ring-4 ring-amber-100 dark:ring-amber-950 shadow-amber-500/25'
                                : 'bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-400'
                            }`}>
                              {isCompleted ? <Check size={18} /> : isAction ? '!' : isCurrent ? '●' : '○'}
                            </div>

                            <span className="text-xs font-bold text-slate-900 dark:text-white mt-3 leading-snug">
                              {milestone.title}
                            </span>
                            {milestone.department && (
                              <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                                {milestone.department}
                              </span>
                            )}
                            {milestone.date && (
                              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                                {milestone.date}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Mobile Vertical Timeline */}
                    <div className="lg:hidden space-y-4 relative pl-8 border-l-2 border-slate-200 dark:border-slate-800 ml-4">
                      {activeRecord.milestones.map((milestone) => {
                        const isCompleted = milestone.status === 'completed';
                        const isCurrent = milestone.status === 'current';
                        const isAction = milestone.status === 'action_needed';

                        return (
                          <div key={milestone.step} className="relative space-y-1">
                            <div className={`absolute -left-[45px] top-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                              isCompleted
                                ? 'bg-emerald-600 text-white'
                                : isCurrent
                                ? 'bg-blue-600 text-white ring-2 ring-blue-200 animate-pulse'
                                : isAction
                                ? 'bg-amber-500 text-white ring-2 ring-amber-200'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                            }`}>
                              {isCompleted ? <Check size={14} /> : isAction ? '!' : isCurrent ? '●' : '○'}
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                              <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                                {milestone.title}
                              </h5>
                              <p className="text-[11px] text-slate-500">
                                {milestone.department} {milestone.date ? `• ${milestone.date}` : ''}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Friendly Citizen Guidance Explainer Box */}
                  <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles size={16} />
                    </div>
                    <div className="space-y-0.5 text-xs">
                      <h5 className="font-bold text-slate-900 dark:text-white">
                        {activeRecord.currentStatus === 'APPROVED' ? 'Application Fully Approved!' : activeRecord.requiresAction ? 'Action Required on Your Application' : 'Current Progress Status: Under Active Review'}
                      </h5>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                        {activeRecord.requiresAction 
                          ? (activeRecord.actionNeededText || 'Please upload your missing document to avoid delays in approval.')
                          : activeRecord.currentStatus === 'APPROVED'
                          ? 'Your official permit is authenticated and ready for digital download or pickup at City Hall.'
                          : 'Your business permit requirements and filings are being evaluated by the BPLO and evaluating departments. No in-person visit is needed at this time.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* =============================================================== */}
                {/* REQUIRED ACTION PROMINENT BANNER (If action needed)             */}
                {/* =============================================================== */}
                {activeRecord.requiresAction && (
                  <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border-2 border-amber-500 dark:border-amber-500 rounded-3xl p-6 sm:p-7 shadow-md space-y-4">
                    <div className="flex items-start space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                        <AlertCircle size={22} />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                          ACTION NEEDED
                        </span>
                        <h4 className="text-base font-black text-slate-900 dark:text-white">
                          {activeRecord.actionNeededText || 'Please upload your missing proof of payment or requirement.'}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          You can upload the requested document directly below without restarting your application.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 pt-1">
                      <button
                        onClick={() => setShowActionUploadModal(true)}
                        className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 cursor-pointer"
                      >
                        <UploadCloud size={16} />
                        <span>Upload Required Document →</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* SUMMARY DETAILS CARD (Key Metadata) */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                        PERMIT TYPE
                      </span>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {activeRecord.permitType}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                        APPLICATION NUMBER
                      </span>
                      <p className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                        {activeRecord.referenceCode}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                        APPLICANT / OWNER
                      </span>
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {activeRecord.applicant}
                      </p>
                      {activeRecord.businessName && activeRecord.businessName !== activeRecord.applicant && (
                        <p className="text-[10px] text-slate-400 truncate">
                          {activeRecord.businessName}
                        </p>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                        DATE SUBMITTED
                      </span>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {activeRecord.dateSubmitted}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                        CURRENT STATUS
                      </span>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                        activeRecord.currentStatus === 'APPROVED' || activeRecord.currentStatus === 'READY FOR RELEASE'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                          : activeRecord.requiresAction
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300'
                          : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300'
                      }`}>
                        {activeRecord.currentStatus}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                        DEPARTMENT
                      </span>
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {activeRecord.currentDepartment}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Assigned Office: <strong className="text-slate-700 dark:text-slate-300">{activeRecord.assignedOffice}</strong></span>
                    <span>Payment Status: <strong className="text-slate-700 dark:text-slate-300">{activeRecord.paymentStatus}</strong></span>
                  </div>
                </div>

                {/* =============================================================== */}
                {/* APPLICATION DETAILS SECTION                                      */}
                {/* =============================================================== */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        Application Details &amp; Documents
                      </h3>
                      <p className="text-xs text-slate-500">
                        Official centralized record data synchronized across municipal systems
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      ID: {activeRecord.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Permit Category</span>
                      <p className="font-bold text-slate-900 dark:text-white capitalize">{activeRecord.permitCategory} Permitting</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Payment Status</span>
                      <p className="font-bold text-slate-900 dark:text-white">{activeRecord.paymentStatus}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Document Status</span>
                      <p className="font-bold text-slate-900 dark:text-white">{activeRecord.documentStatus}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Assigned Office</span>
                      <p className="font-bold text-slate-900 dark:text-white">{activeRecord.assignedOffice}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Last System Update</span>
                      <p className="font-bold text-slate-900 dark:text-white">{activeRecord.lastUpdated}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Cryptographic QR Proof</span>
                      <p className="font-mono text-[11px] font-bold text-teal-600 dark:text-teal-400 truncate">{activeRecord.qrHash || 'GENUINE-SEAL'}</p>
                    </div>
                  </div>

                  {/* Documents on file */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Uploaded Application Documents ({activeRecord.uploadedDocuments.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {activeRecord.uploadedDocuments.map((doc, idx) => (
                        <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                          <div className="flex items-center space-x-2.5 truncate">
                            <FileText size={18} className="text-blue-500 flex-shrink-0" />
                            <div className="truncate">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{doc.name}</p>
                              <p className="text-[10px] text-slate-400">{doc.size} • {doc.date}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                            Verified
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Search size={30} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Ready to Track Your Application
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Upload your document or receipt screenshot above, or enter your Reference Code to view real-time progress and required actions.
                  </p>
                </div>
              </div>
            )}
            </>
            )}

          </div>
        )}

        {/* ======================================================================= */}
        {/* VIEW 3: MY APPLICATIONS (CENTRALIZED CROSS-MODULE HUB)                  */}
        {/* ======================================================================= */}
        {activeView === 'my_applications' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  My Applications
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Track all your applications associated with your account across the four municipal permit modules.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(['all', 'business', 'building', 'transport', 'barangay'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setMyAppsCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      myAppsCategoryFilter === cat
                        ? cat === 'business'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : cat === 'building'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : cat === 'transport'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : cat === 'barangay'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat === 'all' ? `All (${categoryCounts.total})` : `${cat} (${categoryCounts[cat]})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search application by code, applicant name, business, or status..."
                value={myAppsSearchQuery}
                onChange={(e) => setMyAppsSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              {myAppsSearchQuery && (
                <button onClick={() => setMyAppsSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Applications List */}
            {filteredMyApplications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMyApplications.map((app) => {
                  const isApproved = app.currentStatus === 'APPROVED' || app.currentStatus === 'READY FOR RELEASE';
                  const isAction = app.requiresAction;

                  return (
                    <div
                      key={app.id}
                      onClick={() => {
                        setActiveRecord(app);
                        setSelectedCategory(app.permitCategory);
                        setInputReference(app.referenceCode);
                        setActiveView('track_application');
                      }}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            app.permitCategory === 'business'
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : app.permitCategory === 'building'
                              ? 'bg-amber-100 text-amber-700 border border-amber-200'
                              : app.permitCategory === 'transport'
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : 'bg-purple-100 text-purple-700 border border-purple-200'
                          }`}>
                            {app.permitCategory} Permit
                          </span>

                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            isApproved
                              ? 'bg-emerald-100 text-emerald-700'
                              : isAction
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {app.currentStatus}
                          </span>
                        </div>

                        <div>
                          <p className="text-xs font-mono font-bold text-slate-500">
                            {app.referenceCode}
                          </p>
                          <h4 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {app.permitType}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                            {app.applicant} {app.businessName ? `• ${app.businessName}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-400">
                          Submitted: {app.dateSubmitted}
                        </span>
                        <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                          <span>Track Application</span>
                          <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-3">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No applications found for this filter.
                </p>
                <button
                  onClick={() => { setMyAppsCategoryFilter('all'); setMyAppsSearchQuery(''); }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  Clear Filters
                </button>
              </div>
            )}

          </div>
        )}

        {/* ======================================================================= */}
        {/* VIEW 4: NOTIFICATIONS & ALERTS                                          */}
        {/* ======================================================================= */}
        {activeView === 'notifications' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Milestone Notifications
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Friendly real-time notifications triggered as your permit advances through municipal review.
              </p>
            </div>

            {/* Notification Channel Preferences */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-500">
                Notification Delivery Channels
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifPrefs.inSystem}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, inSystem: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    In-System Notifications
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifPrefs.email}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, email: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Email Notification
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifPrefs.sms}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, sms: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    SMS Notification
                  </div>
                </label>
              </div>
            </div>

            {/* List of Friendly Notifications */}
            <div className="space-y-3">
              <div className="p-4 rounded-3xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-start space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                  <Building2 size={18} />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase">Business Permit Office</span>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Your Business Permit application has been received.
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Reference BP-2026-000123 has passed initial intake and is now queued for document verification.
                  </p>
                </div>
                <span className="text-[10px] text-slate-400">10m ago</span>
              </div>

              <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-start space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0">
                  <HardHat size={18} />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">Building Official (OBO)</span>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Your Building Permit is currently under document verification.
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Structural blueprints for BLD-2026-000456 are being audited by City Engineers.
                  </p>
                </div>
                <span className="text-[10px] text-slate-400">2h ago</span>
              </div>

              <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-start space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  <Bus size={18} />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">Transport Franchising Board</span>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Your Franchise Renewal application has been approved.
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    MTOP clearance FR-2026-000789 is verified and moving to official QR decal printing.
                  </p>
                </div>
                <span className="text-[10px] text-slate-400">1d ago</span>
              </div>

              <div className="p-4 rounded-3xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-start space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
                  <Shield size={18} />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase">Barangay Integration Office</span>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Your Barangay Clearance is ready for release.
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Barangay Clearance BC-2026-000321 has been signed by the Punong Barangay.
                  </p>
                </div>
                <span className="text-[10px] text-slate-400">2d ago</span>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* 4. MODAL: UPLOAD REQUIRED DOCUMENT (DIRECT ACTION RESOLUTION)             */}
      {/* ========================================================================= */}
      {showActionUploadModal && activeRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                  <UploadCloud size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Upload Required Document
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Application #{activeRecord.referenceCode}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowActionUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-amber-600 block">
                Required Action:
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {activeRecord.actionNeededText || 'Please upload your missing proof of payment or requirement.'}
              </p>
            </div>

            {/* File Selector */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center space-y-2 bg-slate-50 dark:bg-slate-800/50">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                id="action-doc-input"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setActionFile(e.target.files[0]);
                  }
                }}
              />
              <label htmlFor="action-doc-input" className="cursor-pointer block space-y-2">
                <div className="w-10 h-10 mx-auto rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {actionFile ? actionFile.name : 'Click to select file (JPG, PNG, PDF)'}
                </p>
                <p className="text-[10px] text-slate-400">
                  {actionFile ? `${(actionFile.size / 1024).toFixed(1)} KB` : 'Maximum file size: 15MB'}
                </p>
              </label>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowActionUploadModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleActionDocumentSubmit}
                disabled={isSubmittingActionDoc}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSubmittingActionDoc ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Submit Document</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
};
