import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  FileCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Download, 
  FileText, 
  Calendar, 
  User, 
  X, 
  Sparkles, 
  Award, 
  Shield, 
  Layers, 
  ChevronDown, 
  LogOut, 
  Sun, 
  Moon, 
  ArrowLeft, 
  ArrowRight, 
  CreditCard,
  Building,
  CheckCircle,
  HelpCircle,
  Hash,
  Scale,
  MapPin,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { TabType } from '../types';

export interface BarangayClearanceItem {
  id: string;
  applicantName: string;
  businessName: string;
  barangay: string;
  purpose: 'New Business Permit' | 'Business Permit Renewal' | 'Building Construction Endorsement' | 'Franchise Tricycle MTOP' | 'Barangay Residency Clearance';
  ctcNumber: string;
  ctcAmount: string;
  ctcDateIssued: string;
  luponRecordStatus: 'Clean (No Pending Dispute)' | 'Verification Required' | 'With Prior Dispute Settled';
  zoningCompliance: 'Compliant' | 'Pending Verification';
  inspectionStatus: 'Site Verified' | 'Pending Inspection' | 'Waived';
  status: 'Approved & Released' | 'For Barangay Validation' | 'Pending Lupon Check' | 'Under Inspection' | 'Rejected';
  punongBarangay: string;
  dateApplied: string;
  dateReleased?: string;
  qrHash: string;
}

const MOCK_BARANGAY_CLEARANCES: BarangayClearanceItem[] = [
  {
    id: 'BC-2025-0418',
    applicantName: 'Juan Dela Cruz',
    businessName: 'Dela Cruz General Merchandise',
    barangay: 'Barangay San Isidro',
    purpose: 'New Business Permit',
    ctcNumber: 'CTC-2025-0091823',
    ctcAmount: '₱650.00',
    ctcDateIssued: 'Jan 12, 2025',
    luponRecordStatus: 'Clean (No Pending Dispute)',
    zoningCompliance: 'Compliant',
    inspectionStatus: 'Site Verified',
    status: 'Approved & Released',
    punongBarangay: 'Hon. Roberto S. Alcantara',
    dateApplied: 'May 16, 2025',
    dateReleased: 'May 17, 2025',
    qrHash: 'SHA256-BRGY-SANISIDRO-0418'
  },
  {
    id: 'BC-2025-0419',
    applicantName: 'Maria Theresa Santos',
    businessName: 'Starlight Bakery & Cafe',
    barangay: 'Barangay Central',
    purpose: 'Business Permit Renewal',
    ctcNumber: 'CTC-2025-0091844',
    ctcAmount: '₱1,200.00',
    ctcDateIssued: 'Jan 15, 2025',
    luponRecordStatus: 'Clean (No Pending Dispute)',
    zoningCompliance: 'Compliant',
    inspectionStatus: 'Site Verified',
    status: 'Approved & Released',
    punongBarangay: 'Hon. Manuel L. Quezon Jr.',
    dateApplied: 'May 17, 2025',
    dateReleased: 'May 18, 2025',
    qrHash: 'SHA256-BRGY-CENTRAL-0419'
  },
  {
    id: 'BC-2025-0420',
    applicantName: 'Engr. Ferdinand Santos',
    businessName: 'GreenHorizon Townhouse Development',
    barangay: 'Barangay Fairview',
    purpose: 'Building Construction Endorsement',
    ctcNumber: 'CTC-2025-0091901',
    ctcAmount: '₱2,450.00',
    ctcDateIssued: 'Jan 18, 2025',
    luponRecordStatus: 'Clean (No Pending Dispute)',
    zoningCompliance: 'Compliant',
    inspectionStatus: 'Site Verified',
    status: 'For Barangay Validation',
    punongBarangay: 'Hon. Corazon C. Dizon',
    dateApplied: 'May 18, 2025',
    qrHash: 'SHA256-BRGY-FAIRVIEW-0420'
  },
  {
    id: 'BC-2025-0421',
    applicantName: 'Elena V. Santos',
    businessName: 'EcoTrike Transport Fleet Service',
    barangay: 'Barangay Batasan Hills',
    purpose: 'Franchise Tricycle MTOP',
    ctcNumber: 'CTC-2025-0092102',
    ctcAmount: '₱850.00',
    ctcDateIssued: 'Feb 02, 2025',
    luponRecordStatus: 'Clean (No Pending Dispute)',
    zoningCompliance: 'Compliant',
    inspectionStatus: 'Site Verified',
    status: 'For Barangay Validation',
    punongBarangay: 'Hon. Filomena P. Carreon',
    dateApplied: 'May 20, 2025',
    qrHash: 'SHA256-BRGY-BATASAN-0421'
  },
  {
    id: 'BC-2025-0422',
    applicantName: 'Ramon S. Bautista',
    businessName: 'Commonwealth Hardware & Metal Supply',
    barangay: 'Barangay Commonwealth',
    purpose: 'New Business Permit',
    ctcNumber: 'CTC-2025-0092410',
    ctcAmount: '₱1,500.00',
    ctcDateIssued: 'Feb 08, 2025',
    luponRecordStatus: 'Verification Required',
    zoningCompliance: 'Compliant',
    inspectionStatus: 'Pending Inspection',
    status: 'Pending Lupon Check',
    punongBarangay: 'Hon. Danilo G. Morales',
    dateApplied: 'May 21, 2025',
    qrHash: 'SHA256-BRGY-COMMONWEALTH-0422'
  },
  {
    id: 'BC-2025-0423',
    applicantName: 'Crisanto F. Dizon',
    businessName: 'Holy Spirit Digital Logistics Hub',
    barangay: 'Barangay Holy Spirit',
    purpose: 'Business Permit Renewal',
    ctcNumber: 'CTC-2025-0092800',
    ctcAmount: '₱2,100.00',
    ctcDateIssued: 'Feb 15, 2025',
    luponRecordStatus: 'Clean (No Pending Dispute)',
    zoningCompliance: 'Compliant',
    inspectionStatus: 'Site Verified',
    status: 'Approved & Released',
    punongBarangay: 'Hon. Araceli M. Castro',
    dateApplied: 'May 22, 2025',
    dateReleased: 'May 23, 2025',
    qrHash: 'SHA256-BRGY-HOLYSPIRIT-0423'
  }
];

export interface BarangayNodeInfo {
  name: string;
  district: string;
  captain: string;
  serverStatus: 'Online (100%)' | 'Online (99.8%)' | 'Online (99.4%)' | 'Syncing';
  latency: string;
  activeQueue: number;
  dailyReleased: number;
  luponSync: 'Synced' | 'Live';
  address: string;
  contact: string;
}

const BARANGAY_GRID_DATA: BarangayNodeInfo[] = [
  { name: 'Barangay San Isidro', district: 'District 1', captain: 'Hon. Roberto S. Alcantara', serverStatus: 'Online (100%)', latency: '12ms', activeQueue: 4, dailyReleased: 28, luponSync: 'Live', address: 'San Isidro Brgy Hall, QC', contact: '(02) 8921-1101' },
  { name: 'Barangay Central', district: 'District 4', captain: 'Hon. Manuel L. Quezon Jr.', serverStatus: 'Online (100%)', latency: '10ms', activeQueue: 6, dailyReleased: 42, luponSync: 'Live', address: 'Central Hall, Elliptical Rd, QC', contact: '(02) 8922-2202' },
  { name: 'Barangay Fairview', district: 'District 5', captain: 'Hon. Corazon C. Dizon', serverStatus: 'Online (99.8%)', latency: '15ms', activeQueue: 8, dailyReleased: 36, luponSync: 'Live', address: 'Fairview Center Hall, QC', contact: '(02) 8923-3303' },
  { name: 'Barangay Batasan Hills', district: 'District 2', captain: 'Hon. Filomena P. Carreon', serverStatus: 'Online (100%)', latency: '14ms', activeQueue: 12, dailyReleased: 65, luponSync: 'Live', address: 'IBP Road, Batasan Hills, QC', contact: '(02) 8924-4404' },
  { name: 'Barangay Commonwealth', district: 'District 2', captain: 'Hon. Danilo G. Morales', serverStatus: 'Online (100%)', latency: '18ms', activeQueue: 15, dailyReleased: 72, luponSync: 'Live', address: 'Commonwealth Ave, QC', contact: '(02) 8925-5505' },
  { name: 'Barangay Holy Spirit', district: 'District 2', captain: 'Hon. Araceli M. Castro', serverStatus: 'Online (99.4%)', latency: '16ms', activeQueue: 5, dailyReleased: 31, luponSync: 'Live', address: 'Holy Spirit Drive, QC', contact: '(02) 8926-6606' },
  { name: 'Barangay Tandang Sora', district: 'District 6', captain: 'Hon. Wilfredo S. Cruz', serverStatus: 'Online (100%)', latency: '14ms', activeQueue: 7, dailyReleased: 39, luponSync: 'Live', address: 'Tandang Sora Ave, QC', contact: '(02) 8927-7707' },
  { name: 'Barangay Culiat', district: 'District 6', captain: 'Hon. Victorino T. Ramos', serverStatus: 'Online (99.8%)', latency: '15ms', activeQueue: 6, dailyReleased: 29, luponSync: 'Live', address: 'Culiat Brgy Complex, QC', contact: '(02) 8928-8808' },
  { name: 'Barangay Pasong Tamo', district: 'District 6', captain: 'Hon. Bernardo R. Santos', serverStatus: 'Online (100%)', latency: '13ms', activeQueue: 9, dailyReleased: 44, luponSync: 'Live', address: 'Pasong Tamo Hall, QC', contact: '(02) 8929-9909' },
  { name: 'Barangay Matandang Balara', district: 'District 3', captain: 'Hon. Jose M. De Leon', serverStatus: 'Online (100%)', latency: '11ms', activeQueue: 4, dailyReleased: 22, luponSync: 'Live', address: 'Balara Filters Compound, QC', contact: '(02) 8930-1010' },
  { name: 'Barangay Bagong Silangan', district: 'District 2', captain: 'Hon. Crisostomo P. Cruz', serverStatus: 'Online (99.8%)', latency: '19ms', activeQueue: 8, dailyReleased: 35, luponSync: 'Live', address: 'Bagong Silangan Hall, QC', contact: '(02) 8931-1111' },
  { name: 'Barangay Payatas', district: 'District 2', captain: 'Hon. Rolando E. Diaz', serverStatus: 'Online (100%)', latency: '21ms', activeQueue: 14, dailyReleased: 58, luponSync: 'Live', address: 'Payatas Road, QC', contact: '(02) 8932-1212' },
  { name: 'Barangay Greater Lagro', district: 'District 5', captain: 'Hon. Antonio B. Galvez', serverStatus: 'Online (100%)', latency: '16ms', activeQueue: 5, dailyReleased: 30, luponSync: 'Live', address: 'Ascension Ave, Lagro, QC', contact: '(02) 8933-1313' },
  { name: 'Barangay Novaliches Proper', district: 'District 5', captain: 'Hon. Edgardo N. Dela Cruz', serverStatus: 'Online (100%)', latency: '17ms', activeQueue: 11, dailyReleased: 49, luponSync: 'Live', address: 'Quirino Hwy, Novaliches, QC', contact: '(02) 8934-1414' },
  { name: 'Barangay Gulod', district: 'District 5', captain: 'Hon. Fernando T. Mendoza', serverStatus: 'Online (99.8%)', latency: '15ms', activeQueue: 6, dailyReleased: 26, luponSync: 'Live', address: 'Gulod Hall, Novaliches, QC', contact: '(02) 8935-1515' },
  { name: 'Barangay San Bartolome', district: 'District 5', captain: 'Hon. Lamberto P. Pascual', serverStatus: 'Online (100%)', latency: '16ms', activeQueue: 7, dailyReleased: 34, luponSync: 'Live', address: 'San Bartolome Compound, QC', contact: '(02) 8936-1616' },
  { name: 'Barangay Sta. Monica', district: 'District 5', captain: 'Hon. Gregorio M. Reyes', serverStatus: 'Online (100%)', latency: '14ms', activeQueue: 4, dailyReleased: 20, luponSync: 'Live', address: 'Sta. Monica Hall, QC', contact: '(02) 8937-1717' },
  { name: 'Barangay Nagkaisang Nayon', district: 'District 5', captain: 'Hon. Alberto C. Samson', serverStatus: 'Online (99.8%)', latency: '17ms', activeQueue: 5, dailyReleased: 25, luponSync: 'Live', address: 'General Luis St, QC', contact: '(02) 8938-1818' },
  { name: 'Barangay Capri', district: 'District 5', captain: 'Hon. Salvador G. Tolentino', serverStatus: 'Online (100%)', latency: '18ms', activeQueue: 3, dailyReleased: 18, luponSync: 'Live', address: 'Capri Brgy Hall, QC', contact: '(02) 8939-1919' },
  { name: 'Barangay Kaligayahan', district: 'District 5', captain: 'Hon. Nestor M. Umali', serverStatus: 'Online (100%)', latency: '16ms', activeQueue: 8, dailyReleased: 37, luponSync: 'Live', address: 'Zabarte Road, QC', contact: '(02) 8940-2020' },
  { name: 'Barangay Pasong Putik', district: 'District 5', captain: 'Hon. Rodolfo D. Valenzuela', serverStatus: 'Online (100%)', latency: '15ms', activeQueue: 5, dailyReleased: 24, luponSync: 'Live', address: 'Belfast Ave, Neopolitan, QC', contact: '(02) 8941-2121' },
  { name: 'Barangay North Fairview', district: 'District 5', captain: 'Hon. Arsenio B. Yambao', serverStatus: 'Online (100%)', latency: '14ms', activeQueue: 6, dailyReleased: 29, luponSync: 'Live', address: 'North Fairview Hall, QC', contact: '(02) 8942-2222' },
  { name: 'Barangay Sta. Lucia', district: 'District 5', captain: 'Hon. Dominador C. Zamora', serverStatus: 'Online (99.8%)', latency: '16ms', activeQueue: 4, dailyReleased: 21, luponSync: 'Live', address: 'Sta. Lucia Hall, QC', contact: '(02) 8943-2323' },
  { name: 'Barangay Doña Imelda', district: 'District 4', captain: 'Hon. Benigno S. Aquino IV', serverStatus: 'Online (100%)', latency: '12ms', activeQueue: 5, dailyReleased: 27, luponSync: 'Live', address: 'Doña Imelda Complex, QC', contact: '(02) 8944-2424' }
];

const BARANGAY_LIST_24 = BARANGAY_GRID_DATA.map(b => b.name);

interface BarangayPermitIntegrationProps {
  currentTab?: TabType | string;
  onNavigateToTab?: (tab: TabType | string) => void;
  onAddNewApplication?: (applicantName: string, permitType: string) => void;
  onNavigateToDashboard?: () => void;
}

export const BarangayPermitIntegration: React.FC<BarangayPermitIntegrationProps> = ({
  currentTab,
  onNavigateToTab,
  onAddNewApplication,
  onNavigateToDashboard
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isAdmin = user?.role === 'admin';
  const isBrgyRegistryTab = isAdmin && (currentTab === 'Barangay Clearance Registry' || currentTab === 'Barangay Integration Review');
  const isBrgyGridTab = isAdmin && (currentTab === '24-Barangay Network Grid' || currentTab === '24-Barangay Clearance Network');

  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // View state: 'admin_registry' | 'admin_grid' | 'grid_network' | 'preview' | 'new_clearance' | 'renewal' | 'cedula' | 'pay_fees' | 'special_clearance' | 'ctc_pulling' | 'verification' | 'safety_seal'
  const [currentView, setCurrentView] = useState<
    'admin_registry' | 'admin_grid' | 'grid_network' | 'preview' | 'new_clearance' | 'renewal' | 'cedula' | 'pay_fees' | 'special_clearance' | 'ctc_pulling' | 'verification' | 'safety_seal'
  >(
    isAdmin
      ? (isBrgyGridTab ? 'admin_grid' : 'admin_registry')
      : (currentTab === '24-Barangay Network Grid' || currentTab === '24-Barangay Clearance Network')
      ? 'grid_network'
      : 'preview'
  );

  // Admin Review & Interactive States
  const [activeReviewItem, setActiveReviewItem] = useState<BarangayClearanceItem | null>(null);
  const [evalTab, setEvalTab] = useState<'applicant' | 'lupon' | 'zoning' | 'clearance_cert'>('applicant');
  const [activeLuponModalItem, setActiveLuponModalItem] = useState<BarangayClearanceItem | null>(null);
  const [activeDeficiencyItem, setActiveDeficiencyItem] = useState<BarangayClearanceItem | null>(null);
  const [deficiencyReason, setDeficiencyReason] = useState<string>('Unresolved Lupon Dispute or Barangay Boundary Conflict');
  const [deficiencyNotes, setDeficiencyNotes] = useState<string>('');
  const [selectedBarangayFilter, setSelectedBarangayFilter] = useState<string>('All');
  const [purposeFilter, setPurposeFilter] = useState<string>('All');
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);
  const [selectedGridNode, setSelectedGridNode] = useState<BarangayNodeInfo | null>(null);
  const [gridDistrictFilter, setGridDistrictFilter] = useState<string>('All');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [clearances, setClearances] = useState<BarangayClearanceItem[]>(MOCK_BARANGAY_CLEARANCES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Form States
  const [applicantName, setApplicantName] = useState<string>(user?.name || 'Juan Dela Cruz');
  const [selectedBrgy, setSelectedBrgy] = useState<string>('Barangay San Isidro');
  const [purpose, setPurpose] = useState<string>('New Business Permit');
  const [businessName, setBusinessName] = useState<string>('Apex Innovations Retail Hub');
  const [cedulaNumber, setCedulaNumber] = useState<string>('CTC-2025-0091823');
  const [contactNumber, setContactNumber] = useState<string>('0917-889-2041');
  const [propertyAddress, setPropertyAddress] = useState<string>('Unit 402, Katipunan Ave, Quezon City');
  const [newSubmitted, setNewSubmitted] = useState<boolean>(false);

  // Renewal State
  const [renewalBrgyNo, setRenewalBrgyNo] = useState<string>('BC-2025-0418');
  const [renewalSubmitted, setRenewalSubmitted] = useState<boolean>(false);

  // Cedula State
  const [cedulaSalary, setCedulaSalary] = useState<number>(350000);
  const [cedulaGrossReceipts, setCedulaGrossReceipts] = useState<number>(0);
  const [cedulaComputedTotal, setCedulaComputedTotal] = useState<number>(355);
  const [cedulaSubmitted, setCedulaSubmitted] = useState<boolean>(false);

  // Pay Fees State
  const [feeBrgyNo, setFeeBrgyNo] = useState<string>('BC-2025-0418');
  const [feeReceipt, setFeeReceipt] = useState<any>(null);

  // Special Clearance State
  const [specialEventTitle, setSpecialEventTitle] = useState<string>('Community Weekend Bazaar & Street Fair');
  const [specialEventType, setSpecialEventType] = useState<string>('Street Activity / Flea Market');
  const [specialEventDate, setSpecialEventDate] = useState<string>('June 14-16, 2025');
  const [specialSubmitted, setSpecialSubmitted] = useState<boolean>(false);

  // Search & E-copy
  const [statusSearchCode, setStatusSearchCode] = useState<string>('');
  const [statusSearchResult, setStatusSearchResult] = useState<any>(null);
  const [ecopyModalOpen, setEcopyModalOpen] = useState<boolean>(false);
  const [ecopyBrgyNo, setEcopyBrgyNo] = useState<string>('BC-2025-0418');

  // CTC Pulling State
  const [ctcBrgyNo, setCtcBrgyNo] = useState<string>('BC-2025-0418');
  const [ctcSelectedDocs, setCtcSelectedDocs] = useState<string[]>([
    'Official Certified True Copy of Barangay Clearance (Form BC-1)',
    'Official Lupon Tagapamayapa Certificate of Non-Dispute'
  ]);
  const [ctcPaid, setCtcPaid] = useState<boolean>(false);

  // Verification State
  const [verifQuery, setVerifQuery] = useState<string>('BC-2025-0418');
  const [verifResult, setVerifResult] = useState<any>({
    id: 'BC-2025-0418',
    applicantName: 'Juan Dela Cruz',
    businessName: 'Dela Cruz General Merchandise',
    barangay: 'Barangay San Isidro',
    status: 'ACTIVE & OFFICIALLY ISSUED',
    luponStatus: 'CLEAN (NO PENDING DISPUTE)',
    punongBarangay: 'Hon. Roberto S. Alcantara',
    validUntil: 'December 31, 2025',
    qrHash: 'SHA256-BRGY-SANISIDRO-0418-AUTHENTICATED'
  });

  // Safety Seal State
  const [sealBrgyNo, setSealBrgyNo] = useState<string>('BC-2025-0418');
  const [sealSubmitted, setSealSubmitted] = useState<boolean>(false);

  const handleDownloadClearance = (item: BarangayClearanceItem) => {
    const text = `========================================================================================
REPUBLIC OF THE PHILIPPINES • CITY GOVERNMENT OF QUEZON CITY
OFFICE OF THE PUNONG BARANGAY • ${item.barangay.toUpperCase()}
========================================================================================
OFFICIAL BARANGAY CLEARANCE CERTIFICATE

BARANGAY CLEARANCE NO   : ${item.id}
PURPOSE                 : ${item.purpose.toUpperCase()}
REGISTRATION STATUS     : ${item.status.toUpperCase()}
----------------------------------------------------------------------------------------
APPLICANT & ENTERPRISE DETAILS:
Applicant / Requestor   : ${item.applicantName}
Business / Establishment: ${item.businessName}
Jurisdiction Barangay   : ${item.barangay}
Community Tax Cert (CTC): ${item.ctcNumber} (Paid: ${item.ctcAmount} on ${item.ctcDateIssued})
----------------------------------------------------------------------------------------
COMMUNITY & LUPON AUDIT:
Lupon Tagapamayapa Standing : ${item.luponRecordStatus}
Zoning & Local Compliance   : ${item.zoningCompliance}
Physical Site Inspection    : ${item.inspectionStatus}
----------------------------------------------------------------------------------------
ATTESTATION & SIGNATURE:
This clearance is issued upon the request of the applicant for legal LGU permit filing,
in full compliance with Section 152 of R.A. 7160 (Local Government Code of 1991).

Punong Barangay         : ${item.punongBarangay}
Barangay Secretary      : SEC. EDUARDO M. SANTOS
Digital Security Hash   : ${item.qrHash}
========================================================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Official_Barangay_Clearance_${item.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded Official Barangay Clearance for ${item.id}`);
  };

  const calculateCedula = (sal: number, gross: number) => {
    // Basic Individual = 5 PHP + (1 PHP per 1,000 PHP salary) + (1 PHP per 1,000 PHP gross business)
    const salTax = Math.floor(sal / 1000);
    const grossTax = Math.floor(gross / 1000);
    const total = 5 + salTax + grossTax;
    setCedulaComputedTotal(total);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center space-x-2.5 animate-bounce">
          <Sparkles size={16} className="text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. STANDALONE TOP HEADER BAR (Hidden in Admin Console Mode) */}
      {/* ========================================================================= */}
      {!isAdmin && (
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs px-4 sm:px-8 py-3.5 transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Left: Branding & Back to Portal */}
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-purple-600/30 flex-shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-black text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                    GOVSERVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  Barangay Clearance Network & 24-Barangay Grid
                </p>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center space-x-3">


              <button
                onClick={() => onNavigateToTab ? onNavigateToTab('E-Permit Portal') : setCurrentView('preview')}
                className="flex items-center space-x-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
              >
                <ArrowLeft size={14} />
                <span className="hidden sm:inline">E-Permit Portal</span>
              </button>



              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1.5 pl-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
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
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <button onClick={() => { setProfileDropdownOpen(false); onNavigateToTab?.('E-Permit Portal'); }} className="w-full px-4 py-2 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2">
                        <Layers size={14} className="text-purple-500" />
                        <span>E-Permit Portal</span>
                      </button>
                      <button onClick={() => { setProfileDropdownOpen(false); onNavigateToTab?.('Home'); }} className="w-full px-4 py-2 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2">
                        <Clock size={14} className="text-amber-500" />
                        <span>My Applications Dashboard</span>
                      </button>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button onClick={() => { setProfileDropdownOpen(false); logout(); }} className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2 font-semibold">
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
      )}

      {/* ========================================================================= */}
      {/* 2. FULL-WIDTH HERO SECTION */}
      {/* ========================================================================= */}
      <section className="w-full bg-gradient-to-r from-[#071326] via-[#161233] to-[#0A1A2F] text-white py-7 sm:py-9 px-4 sm:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-3">
          {currentView !== 'preview' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentView('preview')}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <ArrowLeft size={13} />
                <span>Return to Barangay Overview</span>
              </button>
            </div>
          )}

          <div className="space-y-2 max-w-4xl">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              {isAdmin && currentView === 'admin_grid'
                ? '24-Barangay Interconnection Network Grid & Node Monitor'
                : isAdmin && currentView === 'admin_registry'
                ? 'Barangay Clearance Registry & Inter-LGU Validation Workspace'
                : 'Barangay Clearance & Community Services Portal'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {isAdmin && currentView === 'admin_grid'
                ? 'Monitor real-time cluster telemetry, automated Lupon blotter sync, and inter-barangay cross-clearance routing across all 24 local government units.'
                : isAdmin && currentView === 'admin_registry'
                ? 'Validate commercial clearances, query Lupon Tagapamayapa dispute databases, verify Cedula calculations, and issue digital authenticated clearances.'
                : 'Review official barangay clearance tariffs, Cedula schedules, and documentary prerequisites before filing across all 24 Quezon City barangays.'}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAIN BODY CONTAINER */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-9">

        {/* ========================================================================= */}
        {/* SUBVIEW A: ADMIN BARANGAY CLEARANCE REGISTRY & REVIEW CONSOLE */}
        {/* ========================================================================= */}
        {isAdmin && currentView === 'admin_registry' && (
          <div className="space-y-8 animate-in fade-in pb-10">
            
            {/* 1. Executive Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Total Processed */}
              <div 
                onClick={() => setStatusFilter('All')}
                className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border border-purple-500/30 text-white shadow-lg space-y-2 cursor-pointer hover:border-purple-400 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">Total Clearances (24 Brgys)</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                    <FileSpreadsheet size={16} />
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black">4,850</span>
                  <span className="text-xs text-purple-300 font-semibold">99.1% Compliance</span>
                </div>
                <p className="text-[11px] text-slate-300">Across all 24 Quezon City Local Units • +28 today</p>
              </div>

              {/* Card 2: Pending Validation */}
              <div 
                onClick={() => setStatusFilter('For Barangay Validation')}
                className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all cursor-pointer space-y-2 shadow-xs group ${
                  statusFilter === 'For Barangay Validation'
                    ? 'border-purple-500 dark:border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/20 dark:bg-purple-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">For Barangay Validation</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {clearances.filter(c => c.status === 'For Barangay Validation').length}
                  </span>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                    Action Required
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Endorsements queued for Captain sign-off</p>
              </div>

              {/* Card 3: Lupon Tagapamayapa Checks */}
              <div 
                onClick={() => setStatusFilter('Pending Lupon Check')}
                className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all cursor-pointer space-y-2 shadow-xs group ${
                  statusFilter === 'Pending Lupon Check'
                    ? 'border-purple-500 dark:border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/20 dark:bg-purple-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Lupon Blotter Checks</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 flex items-center justify-center">
                    <Scale size={16} />
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {clearances.filter(c => c.status === 'Pending Lupon Check').length}
                  </span>
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-bold">Dispute Verification</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Katarungang Pambarangay Blotter audit</p>
              </div>

              {/* Card 4: Approved & Released */}
              <div 
                onClick={() => setStatusFilter('Approved & Released')}
                className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all cursor-pointer space-y-2 shadow-xs group ${
                  statusFilter === 'Approved & Released'
                    ? 'border-purple-500 dark:border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/20 dark:bg-purple-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Approved & Released</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={16} />
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {clearances.filter(c => c.status === 'Approved & Released').length}
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">QR Certified</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Official clearances released to citizens</p>
              </div>

            </div>

            {/* 2. 24-Barangay Network Cluster Health Strip */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 border border-purple-500/30 text-white space-y-3 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-200">
                    24-Barangay Interconnection Cluster Live Telemetry
                  </h3>
                </div>
                <button
                  onClick={() => setCurrentView('admin_grid')}
                  className="text-xs font-bold text-purple-300 hover:text-white transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <span>Open Full 24-Node Grid Map</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-1">
                {BARANGAY_GRID_DATA.slice(0, 6).map((node, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px] text-white truncate max-w-[100px]">{node.name.replace('Barangay ', '')}</span>
                      <span className="text-[9px] font-bold text-emerald-400">{node.latency}</span>
                    </div>
                    <p className="text-[10px] text-slate-300">{node.activeQueue} pending • {node.dailyReleased} released</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Command Toolbar */}
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Search Box */}
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Reference Code, Applicant Name, Business Name, CTC No, or Barangay..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                {/* Dropdown Filters & Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  
                  {/* Barangay Filter */}
                  <select
                    value={selectedBarangayFilter}
                    onChange={(e) => setSelectedBarangayFilter(e.target.value)}
                    className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All 24 Barangays</option>
                    {BARANGAY_LIST_24.map((b, i) => (
                      <option key={i} value={b}>{b}</option>
                    ))}
                  </select>

                  {/* Purpose Filter */}
                  <select
                    value={purposeFilter}
                    onChange={(e) => setPurposeFilter(e.target.value)}
                    className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Purposes</option>
                    <option value="New Business Permit">New Business Permit</option>
                    <option value="Business Permit Renewal">Business Permit Renewal</option>
                    <option value="Building Construction Endorsement">Building Construction Endorsement</option>
                    <option value="Franchise Tricycle MTOP">Franchise Tricycle MTOP</option>
                    <option value="Barangay Residency Clearance">Barangay Residency Clearance</option>
                  </select>

                  {/* Simulate Inflow Button */}
                  <button
                    onClick={() => {
                      const newId = `BC-2025-0${Math.floor(424 + Math.random() * 50)}`;
                      const randomBrgy = BARANGAY_LIST_24[Math.floor(Math.random() * BARANGAY_LIST_24.length)];
                      const newItem: BarangayClearanceItem = {
                        id: newId,
                        applicantName: 'Carlos M. Mendoza',
                        businessName: 'Mendoza Digital Printing & Signage',
                        barangay: randomBrgy,
                        purpose: 'New Business Permit',
                        ctcNumber: `CTC-2025-00${Math.floor(93000 + Math.random() * 1000)}`,
                        ctcAmount: '₱850.00',
                        ctcDateIssued: 'Feb 24, 2025',
                        luponRecordStatus: 'Clean (No Pending Dispute)',
                        zoningCompliance: 'Compliant',
                        inspectionStatus: 'Site Verified',
                        status: 'For Barangay Validation',
                        punongBarangay: 'Hon. Community Leader',
                        dateApplied: 'Just now',
                        qrHash: `SHA256-BRGY-${newId}`
                      };
                      setClearances(prev => [newItem, ...prev]);
                      showToast(`⚡ New Clearance ${newId} submitted from ${randomBrgy}! Added to queue.`);
                    }}
                    className="px-3.5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold shadow-md shadow-purple-600/20 transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles size={13} />
                    <span>Simulate Inflow</span>
                  </button>

                  {/* Export Ledger CSV */}
                  <button
                    onClick={() => {
                      const headers = 'Clearance ID,Applicant Name,Business Name,Barangay,Purpose,CTC No,CTC Amount,Lupon Status,Status\n';
                      const rows = clearances.map(c => 
                        `"${c.id}","${c.applicantName}","${c.businessName}","${c.barangay}","${c.purpose}","${c.ctcNumber}","${c.ctcAmount}","${c.luponRecordStatus}","${c.status}"`
                      ).join('\n');
                      const blob = new Blob([headers + rows], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `QC_Barangay_Clearance_Masterlist_${new Date().toISOString().slice(0, 10)}.csv`;
                      a.click();
                      URL.revokeObjectURL(a.href);
                      showToast('Exported Barangay Clearance Master Ledger (CSV)');
                    }}
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Download size={13} />
                    <span>Export CSV</span>
                  </button>

                </div>
              </div>

              {/* Status Filter Tabs & Batch Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'All', label: 'All Records', count: clearances.length },
                    { id: 'For Barangay Validation', label: 'For Validation', count: clearances.filter(c => c.status === 'For Barangay Validation').length },
                    { id: 'Pending Lupon Check', label: 'Lupon Dispute Checks', count: clearances.filter(c => c.status === 'Pending Lupon Check').length },
                    { id: 'Approved & Released', label: 'Approved & Released', count: clearances.filter(c => c.status === 'Approved & Released').length },
                    { id: 'Rejected', label: 'Rejected', count: clearances.filter(c => c.status === 'Rejected').length },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setStatusFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                        statusFilter === tab.id
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        statusFilter === tab.id
                          ? 'bg-purple-700 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Batch Actions floating pill */}
                {selectedBatchIds.length > 0 && (
                  <div className="flex items-center space-x-2 animate-in fade-in">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                      {selectedBatchIds.length} Selected
                    </span>
                    <button
                      onClick={() => {
                        setClearances(prev => prev.map(c => selectedBatchIds.includes(c.id) ? { ...c, status: 'Approved & Released' } : c));
                        showToast(`✅ Batch validated & released ${selectedBatchIds.length} Barangay Clearances!`);
                        setSelectedBatchIds([]);
                      }}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      Batch Approve ({selectedBatchIds.length})
                    </button>
                    <button
                      onClick={() => setSelectedBatchIds([])}
                      className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Deselect
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* 4. High-Performance Data Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 dark:bg-slate-850/80 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="p-4 w-10">
                        <input
                          type="checkbox"
                          checked={selectedBatchIds.length > 0 && selectedBatchIds.length === clearances.length}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedBatchIds(clearances.map(c => c.id));
                            else setSelectedBatchIds([]);
                          }}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                      </th>
                      <th className="p-4">Clearance Ref & Date</th>
                      <th className="p-4">Applicant & Enterprise</th>
                      <th className="p-4">Barangay & Endorsement</th>
                      <th className="p-4">Community Tax (Cedula)</th>
                      <th className="p-4">Lupon Dispute Status</th>
                      <th className="p-4">Standing Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {clearances
                      .filter(c => {
                        const matchesQuery = 
                          c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.ctcNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.barangay.toLowerCase().includes(searchQuery.toLowerCase());
                        const matchesBrgy = selectedBarangayFilter === 'All' || c.barangay === selectedBarangayFilter;
                        const matchesPurpose = purposeFilter === 'All' || c.purpose === purposeFilter;
                        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
                        return matchesQuery && matchesBrgy && matchesPurpose && matchesStatus;
                      })
                      .map(item => {
                        const isSelected = selectedBatchIds.includes(item.id);
                        return (
                          <tr 
                            key={item.id}
                            className={`hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-colors ${
                              isSelected ? 'bg-purple-50/60 dark:bg-purple-950/30' : ''
                            }`}
                          >
                            <td className="p-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedBatchIds(prev => [...prev, item.id]);
                                  else setSelectedBatchIds(prev => prev.filter(id => id !== item.id));
                                }}
                                className="rounded text-purple-600 focus:ring-purple-500"
                              />
                            </td>

                            {/* Reference & Date */}
                            <td className="p-4">
                              <span className="font-mono font-bold text-purple-600 dark:text-purple-400 block text-xs">
                                {item.id}
                              </span>
                              <span className="text-[10px] text-slate-400">{item.dateApplied}</span>
                            </td>

                            {/* Applicant & Business */}
                            <td className="p-4">
                              <div className="flex items-center space-x-2.5">
                                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-black flex items-center justify-center text-xs flex-shrink-0">
                                  {item.applicantName.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 dark:text-white leading-tight">
                                    {item.applicantName}
                                  </p>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    {item.businessName}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Barangay & Purpose */}
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                                <MapPin size={10} className="text-purple-500" />
                                {item.barangay}
                              </span>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                {item.purpose}
                              </p>
                            </td>

                            {/* Cedula */}
                            <td className="p-4 font-mono text-[11px]">
                              <span className="text-slate-900 dark:text-white font-bold block">{item.ctcNumber}</span>
                              <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">{item.ctcAmount}</span>
                            </td>

                            {/* Lupon Status */}
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                item.luponRecordStatus.includes('Clean')
                                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              }`}>
                                <ShieldCheck size={11} />
                                {item.luponRecordStatus}
                              </span>
                            </td>

                            {/* Standing Status */}
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                item.status === 'Approved & Released'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : item.status === 'For Barangay Validation'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                  : item.status === 'Pending Lupon Check'
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  item.status === 'Approved & Released' ? 'bg-emerald-500' :
                                  item.status === 'For Barangay Validation' ? 'bg-amber-500 animate-pulse' :
                                  item.status === 'Pending Lupon Check' ? 'bg-purple-500' : 'bg-rose-500'
                                }`} />
                                {item.status}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  onClick={() => {
                                    setEvalTab('applicant');
                                    setActiveReviewItem(item);
                                  }}
                                  className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1"
                                >
                                  <FileCheck size={12} />
                                  <span>Evaluate</span>
                                </button>

                                <button
                                  onClick={() => setActiveLuponModalItem(item)}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl cursor-pointer"
                                  title="Lupon Dispute Audit"
                                >
                                  <Scale size={13} />
                                </button>

                                <button
                                  onClick={() => {
                                    setClearances(prev => prev.map(c => c.id === item.id ? { ...c, status: 'Approved & Released' } : c));
                                    showToast(`✅ Endorsed & Approved Clearance ${item.id}!`);
                                  }}
                                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl cursor-pointer"
                                  title="Fast Approve"
                                >
                                  <CheckCircle2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW B: ADMIN 24-BARANGAY NETWORK GRID & NODE MONITOR */}
        {/* ========================================================================= */}
        {isAdmin && currentView === 'admin_grid' && (
          <div className="space-y-8 animate-in fade-in pb-10">
            
            {/* Top Telemetry Summary Header */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-500/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  24-Barangay Automated Interconnection Grid
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl">
                  Real-time synchronization of local clearances, Lupon Tagapamayapa case databases, Cedula revenues, and zonal clearances.
                </p>
              </div>

              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <div className="text-center px-2">
                  <span className="text-xl font-black text-emerald-400">24 / 24</span>
                  <span className="text-[10px] text-slate-300 block">Nodes Online</span>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-center px-2">
                  <span className="text-xl font-black text-purple-300">99.8%</span>
                  <span className="text-[10px] text-slate-300 block">Uptime</span>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-center px-2">
                  <span className="text-xl font-black text-amber-300">100%</span>
                  <span className="text-[10px] text-slate-300 block">Blotter Sync</span>
                </div>
              </div>
            </div>

            {/* District Filter Navigation */}
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'District 1', 'District 2', 'District 3', 'District 4', 'District 5', 'District 6'].map(d => (
                <button
                  key={d}
                  onClick={() => setGridDistrictFilter(d)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    gridDistrictFilter === d
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {d === 'All' ? 'All Districts (24 Barangays)' : d}
                </button>
              ))}
            </div>

            {/* 24 Interactive Barangay Node Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {BARANGAY_GRID_DATA
                .filter(node => gridDistrictFilter === 'All' || node.district === gridDistrictFilter)
                .map((node, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedGridNode(node)}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-500 hover:shadow-md transition-all cursor-pointer space-y-4 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          {node.district}
                        </span>
                        <h4 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {node.name}
                        </h4>
                      </div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Online" />
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                      <div className="flex justify-between items-center text-[11px]">
                        <span>Punong Barangay:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{node.captain}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span>Server Latency:</span>
                        <span className="font-mono font-bold text-emerald-600">{node.latency}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span>Active Queue:</span>
                        <span className="font-bold text-amber-600">{node.activeQueue} pending</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span>Daily Clearances:</span>
                        <span className="font-bold text-purple-600">{node.dailyReleased} released</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 size={11} />
                        Blotter Synced
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBarangayFilter(node.name);
                          setCurrentView('admin_registry');
                        }}
                        className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center space-x-1"
                      >
                        <span>View Ledger</span>
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* PREVIEW PAGE: OFFICIAL TARIFF GUIDE, CATEGORIES, & QUICK PORTAL */}
        {/* ========================================================================= */}
        {(currentView === 'preview' || (!isAdmin && (currentView === 'admin_registry' || currentView === 'admin_grid'))) && (
          <div className="space-y-10 animate-in fade-in pb-10">
            


            {/* 4 Interactive Service Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Business Barangay Clearance */}
              <button
                type="button"
                onClick={() => {
                  setPurpose('New Business Permit');
                  setNewSubmitted(false);
                  setCurrentView('new_clearance');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                    <Building2 size={20} />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                    Commercial
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                    Business Barangay Clearance
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Pangunahing pag-endorso para sa bagong rehistro ng negosyo, pagtatayo ng sangay, at taunang renewal ng negosyo.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-black text-purple-600 dark:text-purple-400">₱ 500.00</span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>File Now</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </button>

              {/* Card 2: Building & Construction Clearance */}
              <button
                type="button"
                onClick={() => {
                  setPurpose('Building Construction Endorsement');
                  setNewSubmitted(false);
                  setCurrentView('new_clearance');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
                    <Building size={20} />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    Construction
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    Construction Endorsement
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Endorsement sa lokasyon ng barangay at pahintulot ng mga kapitbahay para sa pagpapatayo o pagsasaayos ng gusali.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400">₱ 800.00</span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Apply Now</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </button>

              {/* Card 3: Community Tax Certificate (Cedula) */}
              <button
                type="button"
                onClick={() => {
                  setCedulaSubmitted(false);
                  setCurrentView('cedula');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                    <FileText size={20} />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Instant CTC
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    Community Tax (Cedula)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Mabilisang pagkalkula ng Sedula batay sa taunang kabuuang kita at mga taripa ng munisipyo o lungsod.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">₱ 55.00+</span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Compute Now</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </button>

              {/* Card 4: Residency & Special Event */}
              <button
                type="button"
                onClick={() => {
                  setSpecialSubmitted(false);
                  setCurrentView('special_clearance');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                    <Award size={20} />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    Special Pass
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    Residency & Event Pass
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Katibayan ng Paninirahan, Good Moral Character, Indigency, o Street Activity Pass.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400">₱ 150.00</span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Apply Now</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </button>

            </div>

            {/* ========================================================================= */}
            {/* SECTION: ITEMIZED REGULATORY FEE SCHEDULE TABLES */}
            {/* ========================================================================= */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FileSpreadsheet className="text-purple-500" size={20} />
                  <span>Itemized Barangay Regulatory Fee Schedules & Tariffs</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Official statutory tariffs mandated under Republic Act No. 7160 (Local Government Code) & QC Barangay Revenue Ordinances
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Table 1: Commercial & Construction Clearances */}
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                        <h4 className="font-black text-slate-900 dark:text-white text-sm">
                          1. Commercial & Construction Clearances
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500">Official statutory clearances for enterprises and physical sites</p>
                    </div>
                    <span className="font-mono font-black text-purple-600 dark:text-purple-400 text-base">
                      ₱1,800.00
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                          <th className="pb-2 font-bold">Code</th>
                          <th className="pb-2 font-bold">Clearance Component</th>
                          <th className="pb-2 font-bold hidden sm:table-cell">Legal Basis</th>
                          <th className="pb-2 font-bold text-right">Fee</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-[11px]">
                        <tr>
                          <td className="py-2 font-mono text-slate-400">BC-01</td>
                          <td className="py-2 font-medium text-slate-800 dark:text-slate-200">Barangay Business Clearance</td>
                          <td className="py-2 text-slate-500 hidden sm:table-cell">RA 7160 Sec. 152</td>
                          <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱500.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono text-slate-400">BC-02</td>
                          <td className="py-2 font-medium text-slate-800 dark:text-slate-200">Construction & Locational Endorsement</td>
                          <td className="py-2 text-slate-500 hidden sm:table-cell">Barangay Code Art. 4</td>
                          <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱800.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono text-slate-400">BC-03</td>
                          <td className="py-2 font-medium text-slate-800 dark:text-slate-200">Signboard / Billboard Barangay Permit</td>
                          <td className="py-2 text-slate-500 hidden sm:table-cell">Local Tax Ordinance</td>
                          <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱250.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono text-slate-400">BC-04</td>
                          <td className="py-2 font-medium text-slate-800 dark:text-slate-200">Lupon Non-Dispute Record Clearance</td>
                          <td className="py-2 text-slate-500 hidden sm:table-cell">Katarungang Pambarangay</td>
                          <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱100.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono text-slate-400">BC-05</td>
                          <td className="py-2 font-medium text-slate-800 dark:text-slate-200">Solid Waste & Cleanliness Administrative Dues</td>
                          <td className="py-2 text-slate-500 hidden sm:table-cell">Eco-Waste Compliance</td>
                          <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱100.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono text-slate-400">BC-06</td>
                          <td className="py-2 font-medium text-slate-800 dark:text-slate-200">Legal Research & Community Fund (LRF)</td>
                          <td className="py-2 text-slate-500 hidden sm:table-cell">RA 3870</td>
                          <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱50.00</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-slate-200 dark:border-slate-700 font-bold text-xs">
                          <td colSpan={2} className="pt-3 text-slate-900 dark:text-white">Total Commercial Assessment</td>
                          <td className="pt-3 hidden sm:table-cell text-slate-400 font-normal text-[10px]">Standard Package</td>
                          <td className="pt-3 text-right font-mono text-purple-600 dark:text-purple-400 text-sm">₱1,800.00</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Table 2: Cedula (CTC) & Individual Certifications */}
                <div className="space-y-6">
                  <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <h4 className="font-black text-slate-900 dark:text-white text-sm">
                            2. Community Tax (Cedula) & Certifications
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500">Individual tax certificates, residency, and event permits</p>
                      </div>
                      <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-base">
                        Variable Rates
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                            <th className="pb-2 font-bold">Code</th>
                            <th className="pb-2 font-bold">Service / Document</th>
                            <th className="pb-2 font-bold">Rate / Formula</th>
                            <th className="pb-2 font-bold text-right">Standard Fee</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-[11px]">
                          <tr>
                            <td className="py-2 font-mono text-slate-400">CTC-01</td>
                            <td className="py-2 font-medium text-slate-800 dark:text-slate-200">Basic Individual Cedula</td>
                            <td className="py-2 text-slate-500">Fixed statutory basic</td>
                            <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱5.00</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-slate-400">CTC-02</td>
                            <td className="py-2 font-medium text-slate-800 dark:text-slate-200">Additional Tax per ₱1,000 Income</td>
                            <td className="py-2 text-slate-500">₱1.00 per ₱1k earnings</td>
                            <td className="py-2 font-mono font-semibold text-right text-emerald-600 dark:text-emerald-400">Formula</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-slate-400">BR-01</td>
                            <td className="py-2 font-medium text-slate-800 dark:text-slate-200">Certificate of Residency / Good Moral</td>
                            <td className="py-2 text-slate-500">Per Certificate</td>
                            <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱100.00</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-slate-400">BR-02</td>
                            <td className="py-2 font-medium text-slate-800 dark:text-slate-200">Special Street Activity / Event Pass</td>
                            <td className="py-2 text-slate-500">Valid up to 3 days</td>
                            <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱350.00</td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-slate-200 dark:border-slate-700 font-bold text-xs">
                            <td colSpan={2} className="pt-3 text-slate-900 dark:text-white">Cedula Online Calculator</td>
                            <td colSpan={2} className="pt-3 text-right">
                              <button
                                onClick={() => setCurrentView('cedula')}
                                className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 font-bold inline-flex items-center gap-1 cursor-pointer"
                              >
                                <span>Open Cedula Tool</span>
                                <ArrowRight size={12} />
                              </button>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION: MANDATORY DOCUMENTARY CHECKLIST */}
            {/* ========================================================================= */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="text-purple-500" size={20} />
                  <span>Mandatory Documentary Requirements Checklist</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Prepare scanned or digital copies of these required documents before initiating your transaction
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Valid Government ID & Address</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    PhilSys National ID, Passport, Driver's License, or Proof of Address (Meralco/Manila Water bill).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">DTI / SEC or Lease Contract</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    DTI Certificate of Business Name, SEC Registration, or Notarized Contract of Lease / Land Title.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Community Tax Certificate (Cedula)</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Active Community Tax Certificate (CTC) issued within the current calendar year.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Lupon Non-Dispute Check</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Automated real-time check against Lupon Tagapamayapa peace and dispute registers.
                  </p>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION: QUICK REGULATORY SERVICES & DIGITAL DOCUMENT PORTAL */}
            {/* ========================================================================= */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="text-purple-500" size={20} />
                  <span>Quick Regulatory Services & Digital Document Portal</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Instant clearance verification, Certified True Copy (CTC) pulling, Bagong Barangay Safety Seal, and fee settlement
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* BIS / CTC Pulling */}
                <button
                  type="button"
                  onClick={() => {
                    setCtcPaid(false);
                    setCurrentView('ctc_pulling');
                  }}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                    <Layers size={20} />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                    Pull Certified True Copies (CTC)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Official watermarked digital copies of Barangay Clearances, Lupon Records, and Certifications.
                  </p>
                </button>

                {/* Barangay Clearance Verification */}
                <button
                  type="button"
                  onClick={() => setCurrentView('verification')}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                    <ShieldCheck size={20} />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    Clearance Verification
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Real-time verification of clearance validity, Lupon standing, and Punong Barangay digital signature.
                  </p>
                </button>

                {/* Pay Barangay Dues & Cedula */}
                <button
                  type="button"
                  onClick={() => {
                    setFeeReceipt(null);
                    setCurrentView('pay_fees');
                  }}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
                    <CreditCard size={20} />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    Pay Barangay Dues & Tax
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Settle clearance dues, Cedula community tax, and local fees with official e-Receipt.
                  </p>
                </button>

                {/* Bagong Barangay Safety Seal */}
                <button
                  type="button"
                  onClick={() => {
                    setSealSubmitted(false);
                    setCurrentView('safety_seal');
                  }}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                    <Award size={20} />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    Bagong Barangay Safety Seal
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Apply for the Bagong Barangay Seal of Good Housekeeping & Local Disaster Readiness badge.
                  </p>
                </button>

              </div>
            </div>

            {/* 24-Barangay Automated Inter-Connectivity Network Strip */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin size={18} className="text-purple-500" />
                    <span>24-Barangay Automated Inter-Connectivity Grid</span>
                  </h3>
                  <p className="text-xs text-slate-500">Real-time clearance validation synced across all Quezon City districts</p>
                </div>
                <button
                  onClick={() => setCurrentView('grid_network')}
                  className="px-4 py-2 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-bold hover:bg-purple-100 dark:hover:bg-purple-900/80 cursor-pointer self-start sm:self-auto"
                >
                  View Full Grid (24 Barangays)
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 text-xs">
                {BARANGAY_LIST_24.slice(0, 12).map((brgy, i) => (
                  <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="truncate font-semibold text-[11px]">{brgy}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* BOTTOM GATEWAY ACTION CTA */}
            {/* ========================================================================= */}
            <div className="rounded-3xl p-8 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-black">
                  Ready to Get Your Barangay Clearance or Cedula?
                </h3>
                <p className="text-xs sm:text-sm text-purple-100 max-w-xl">
                  Proceed to file online applications, compute community tax (Cedula), request certified true copies, or verify clearance standing.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setNewSubmitted(false);
                    setCurrentView('new_clearance');
                  }}
                  className="px-8 py-4 bg-white hover:bg-slate-100 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-lg transition-all flex items-center space-x-2 cursor-pointer active:scale-[0.98]"
                >
                  <span>Start New Application</span>
                  <ArrowRight size={16} strokeWidth={3} className="text-purple-600" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 1: NEW CLEARANCE FILING FORM */}
        {/* ========================================================================= */}
        {currentView === 'new_clearance' && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in pb-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('preview')}
                className="flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Return to Overview</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">New Barangay Clearance Application</h2>
                  <p className="text-xs text-slate-500">Official Community Endorsement for LGU Permitting</p>
                </div>
              </div>

              {!newSubmitted ? (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300">Applicant Full Name *</label>
                      <input 
                        type="text" 
                        value={applicantName} 
                        onChange={(e) => setApplicantName(e.target.value)} 
                        className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl" 
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300">Contact Number *</label>
                      <input 
                        type="text" 
                        value={contactNumber} 
                        onChange={(e) => setContactNumber(e.target.value)} 
                        className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300">Jurisdiction Barangay *</label>
                      <select 
                        value={selectedBrgy} 
                        onChange={(e) => setSelectedBrgy(e.target.value)} 
                        className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                      >
                        {BARANGAY_LIST_24.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300">Clearance Purpose *</label>
                      <select 
                        value={purpose} 
                        onChange={(e) => setPurpose(e.target.value)} 
                        className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                      >
                        <option value="New Business Permit">New Business Permit</option>
                        <option value="Business Permit Renewal">Business Permit Renewal</option>
                        <option value="Building Construction Endorsement">Building Construction Endorsement</option>
                        <option value="Franchise Tricycle MTOP">Franchise Tricycle MTOP</option>
                        <option value="Barangay Residency Clearance">Barangay Residency Clearance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Business / Project Name (if applicable)</label>
                    <input 
                      type="text" 
                      value={businessName} 
                      onChange={(e) => setBusinessName(e.target.value)} 
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl" 
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Establishment / Property Address *</label>
                    <input 
                      type="text" 
                      value={propertyAddress} 
                      onChange={(e) => setPropertyAddress(e.target.value)} 
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl" 
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Community Tax Certificate (Cedula) No. *</label>
                    <input 
                      type="text" 
                      value={cedulaNumber} 
                      onChange={(e) => setCedulaNumber(e.target.value)} 
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono" 
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/60 space-y-1">
                    <p className="font-bold text-purple-900 dark:text-purple-200">Automated Lupon Dispute Pre-Screening:</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      ✓ Instant query against {selectedBrgy} Lupon records: <span className="font-semibold text-emerald-600 dark:text-emerald-400">Clean (No Pending Cases)</span>
                    </p>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        const newBcId = `BC-2025-0${Math.floor(400 + Math.random() * 500)}`;
                        setNewSubmitted(true);
                        showToast('Barangay Clearance lodged successfully!');
                        if (onAddNewApplication) {
                          onAddNewApplication(applicantName || user?.name || 'Citizen Applicant', `Barangay Clearance (${selectedBrgy})`);
                        }
                      }}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold shadow-md cursor-pointer transition-all active:scale-[0.98]"
                    >
                      Submit Clearance Application
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-xl font-bold">Barangay Clearance Submitted</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Your clearance reference is <strong className="text-purple-600 font-mono">BC-2025-0422</strong> for {selectedBrgy}. Ready for municipal permit integration.
                  </p>
                  <div className="pt-2 flex justify-center space-x-3">
                    <button 
                      onClick={() => setCurrentView('preview')} 
                      className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Return to Overview
                    </button>
                    <button
                      onClick={() => {
                        setFeeBrgyNo('BC-2025-0422');
                        setCurrentView('pay_fees');
                      }}
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Pay Clearance Dues
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 2: CEDULA / COMMUNITY TAX CERTIFICATE CALCULATOR */}
        {/* ========================================================================= */}
        {currentView === 'cedula' && (
          <div className="space-y-6 max-w-xl mx-auto animate-in fade-in pb-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('preview')}
                className="flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Return to Overview</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Community Tax Certificate (Cedula)</h2>
                  <p className="text-xs text-slate-500">Official Municipal Tax Assessment & Instant CTC Filing</p>
                </div>
              </div>

              {!cedulaSubmitted ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Taxpayer Full Name *</label>
                    <input 
                      type="text" 
                      value={applicantName} 
                      onChange={(e) => setApplicantName(e.target.value)} 
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl" 
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Annual Gross Salary / Compensation (₱)</label>
                    <input 
                      type="number" 
                      value={cedulaSalary} 
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setCedulaSalary(val);
                        calculateCedula(val, cedulaGrossReceipts);
                      }} 
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono" 
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Gross Business Earnings / Receipts (₱, if any)</label>
                    <input 
                      type="number" 
                      value={cedulaGrossReceipts} 
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setCedulaGrossReceipts(val);
                        calculateCedula(cedulaSalary, val);
                      }} 
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono" 
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Basic Community Tax:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₱ 5.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Additional Tax on Income:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₱ {Math.floor(cedulaSalary / 1000)}.00</span>
                    </div>
                    {cedulaGrossReceipts > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Additional Tax on Business:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₱ {Math.floor(cedulaGrossReceipts / 1000)}.00</span>
                      </div>
                    )}
                    <div className="border-t border-emerald-200 dark:border-emerald-800 pt-2 flex justify-between font-bold text-sm">
                      <span className="text-emerald-950 dark:text-emerald-200">Total Cedula Dues:</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-black">₱ {cedulaComputedTotal}.00</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCedulaSubmitted(true);
                        showToast(`Cedula generated for ₱ ${cedulaComputedTotal}.00!`);
                      }}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md cursor-pointer transition-all active:scale-[0.98]"
                    >
                      Issue Digital Cedula (CTC)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-xl font-bold">Digital Cedula Issued!</h3>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left text-xs font-mono space-y-1 max-w-sm mx-auto">
                    <p><strong>CTC NUMBER :</strong> CTC-2025-{Math.floor(1000000 + Math.random() * 9000000)}</p>
                    <p><strong>TAXPAYER   :</strong> {applicantName}</p>
                    <p><strong>TOTAL TAX  :</strong> ₱ {cedulaComputedTotal}.00</p>
                    <p><strong>DATE ISSUED:</strong> {new Date().toLocaleDateString()}</p>
                  </div>
                  <button 
                    onClick={() => setCurrentView('preview')} 
                    className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Return to Overview
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 3: PAY BARANGAY FEES */}
        {/* ========================================================================= */}
        {currentView === 'pay_fees' && (
          <div className="space-y-6 max-w-xl mx-auto animate-in fade-in pb-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('preview')}
                className="flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Return to Overview</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Pay Barangay Dues & Fees</h2>
                  <p className="text-xs text-slate-500">Official Municipal Revenue Gateway • Real-Time Settlement</p>
                </div>
              </div>

              {!feeReceipt ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Barangay Reference Code / Application ID</label>
                    <input
                      type="text"
                      value={feeBrgyNo}
                      onChange={(e) => setFeeBrgyNo(e.target.value)}
                      placeholder="e.g. BC-2025-0418"
                      className="w-full mt-1.5 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Barangay Business Clearance:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">₱ 500.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Lupon & Cleanliness Fee:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">₱ 200.00</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 font-bold text-sm">
                      <span>Total Assessment:</span>
                      <span className="text-purple-600 dark:text-purple-400">₱ 700.00</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between">
                    <button onClick={() => setCurrentView('preview')} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold cursor-pointer">
                      Cancel
                    </button>
                    <button
                      onClick={() => setFeeReceipt({
                        transId: 'TXN-BRGY-2025-' + Math.floor(100000 + Math.random() * 900000),
                        brgyCode: feeBrgyNo || 'BC-2025-0418',
                        amount: '₱ 700.00',
                        date: new Date().toLocaleString()
                      })}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold cursor-pointer shadow-md"
                    >
                      Pay ₱ 700.00 Now
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-xl font-black">Barangay Payment Successful!</h3>
                  <p className="text-xs text-slate-500">Official e-Receipt generated below. Clearance status has been updated to Approved.</p>
                  
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left text-xs font-mono space-y-1 max-w-sm mx-auto">
                    <p><strong>RECEIPT NO :</strong> {feeReceipt.transId}</p>
                    <p><strong>CLEARANCE  :</strong> {feeReceipt.brgyCode}</p>
                    <p><strong>AMOUNT PAID:</strong> {feeReceipt.amount}</p>
                    <p><strong>TIMESTAMP  :</strong> {feeReceipt.date}</p>
                  </div>
                  <button onClick={() => setCurrentView('preview')} className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer">
                    Return to Overview
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 4: SPECIAL EVENT & STREET ACTIVITY CLEARANCE */}
        {/* ========================================================================= */}
        {currentView === 'special_clearance' && (
          <div className="space-y-6 max-w-xl mx-auto animate-in fade-in pb-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('preview')}
                className="flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Return to Overview</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                  <Award size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Special Barangay Event Clearance</h2>
                  <p className="text-xs text-slate-500">Street Activity, Bazaar & Temporary Community Pass</p>
                </div>
              </div>

              {!specialSubmitted ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Event / Activity Title *</label>
                    <input
                      type="text"
                      value={specialEventTitle}
                      onChange={(e) => setSpecialEventTitle(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300">Activity Type *</label>
                      <select
                        value={specialEventType}
                        onChange={(e) => setSpecialEventType(e.target.value)}
                        className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      >
                        <option value="Street Activity / Flea Market">Street Activity / Flea Market</option>
                        <option value="Motorcade / Parade Pass">Motorcade / Parade Pass</option>
                        <option value="Sports Tournament / Liga">Sports Tournament / Liga</option>
                        <option value="Filming / Photography Shoot">Filming / Photography Shoot</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300">Scheduled Dates *</label>
                      <input
                        type="text"
                        value={specialEventDate}
                        onChange={(e) => setSpecialEventDate(e.target.value)}
                        className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      >
                      </input>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1">
                    <p className="font-bold text-amber-900 dark:text-amber-200">Barangay Tanod Safety Escort:</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Standard fee includes ₱350 event clearance and deployment of Barangay Public Safety Officers (Tanod).
                    </p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSpecialSubmitted(true);
                        showToast('Special Event Clearance submitted!');
                      }}
                      className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-md cursor-pointer transition-all active:scale-[0.98]"
                    >
                      File Special Event Clearance
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/80 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-xl font-bold">Event Clearance Issued!</h3>
                  <p className="text-xs text-slate-500">Official Street Event Permit Pass is authorized for {specialEventDate}.</p>
                  <button onClick={() => setCurrentView('preview')} className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer">
                    Return to Overview
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 5: CTC PULLING (CERTIFIED TRUE COPIES) */}
        {/* ========================================================================= */}
        {currentView === 'ctc_pulling' && (
          <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in pb-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('preview')}
                className="flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Return to Overview</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                  <Layers size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Pull Certified True Copies (CTC)</h2>
                  <p className="text-xs text-slate-500">Tamper-Proof Watermarked Barangay Registry Certificates</p>
                </div>
              </div>

              {!ctcPaid ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Barangay Clearance Reference No.</label>
                    <input
                      type="text"
                      value={ctcBrgyNo}
                      onChange={(e) => setCtcBrgyNo(e.target.value)}
                      className="w-full mt-1.5 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Select Required Watermarked Documents</label>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded text-purple-600" />
                        <span>Official Certified True Copy of Barangay Clearance (Form BC-1)</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded text-purple-600" />
                        <span>Lupon Tagapamayapa Certificate of Non-Dispute</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex justify-between items-center">
                    <span className="font-bold">Total CTC Pulling Surcharge:</span>
                    <span className="font-mono font-black text-purple-600 dark:text-purple-400 text-sm">₱ 150.00</span>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setCtcPaid(true)}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold shadow-md cursor-pointer transition-all active:scale-[0.98]"
                    >
                      Process & Download CTC PDF
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-xl font-bold">Watermarked CTC Ready!</h3>
                  <p className="text-xs text-slate-500">The official tamper-proof watermarked document has been generated.</p>
                  <div className="pt-2 flex justify-center space-x-3">
                    <button 
                      onClick={() => handleDownloadClearance(clearances[0])}
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download size={14} />
                      <span>Download Watermarked PDF</span>
                    </button>
                    <button 
                      onClick={() => setCurrentView('preview')} 
                      className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Return to Overview
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 6: CLEARANCE VERIFICATION */}
        {/* ========================================================================= */}
        {currentView === 'verification' && (
          <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in pb-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('preview')}
                className="flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Return to Overview</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Barangay Clearance Verification</h2>
                  <p className="text-xs text-slate-500">Live 24-Barangay Authenticity & Lupon Record Verification</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={verifQuery}
                    onChange={(e) => setVerifQuery(e.target.value)}
                    placeholder="Enter BC Code (e.g. BC-2025-0418)..."
                    className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs"
                  />
                  <button
                    onClick={() => {
                      const match = clearances.find(c => c.id.toLowerCase() === verifQuery.trim().toLowerCase()) || clearances[0];
                      setVerifResult({
                        id: match.id,
                        applicantName: match.applicantName,
                        businessName: match.businessName,
                        barangay: match.barangay,
                        status: 'ACTIVE & OFFICIALLY ISSUED',
                        luponStatus: 'CLEAN (NO PENDING DISPUTE)',
                        punongBarangay: match.punongBarangay,
                        validUntil: 'December 31, 2025',
                        qrHash: match.qrHash
                      });
                      showToast('Verification record retrieved!');
                    }}
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold cursor-pointer transition-all"
                  >
                    Verify
                  </button>
                </div>

                {verifResult && (
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{verifResult.id}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200">
                        {verifResult.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400">Applicant:</span>
                        <p className="font-bold">{verifResult.applicantName}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Barangay:</span>
                        <p className="font-bold">{verifResult.barangay}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Lupon Dispute Status:</span>
                        <p className="font-bold text-emerald-600">{verifResult.luponStatus}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Punong Barangay:</span>
                        <p className="font-bold">{verifResult.punongBarangay}</p>
                      </div>
                    </div>
                    <div className="pt-2 text-[10px] font-mono text-slate-400">
                      Cryptographic Hash: {verifResult.qrHash}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button onClick={() => setCurrentView('preview')} className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer">
                    Return to Overview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 7: BAGONG BARANGAY SAFETY SEAL */}
        {/* ========================================================================= */}
        {currentView === 'safety_seal' && (
          <div className="space-y-6 max-w-xl mx-auto animate-in fade-in pb-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('preview')}
                className="flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Return to Overview</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                  <Award size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Bagong Barangay Safety Seal</h2>
                  <p className="text-xs text-slate-500">Good Housekeeping & Disaster Resilience Certification</p>
                </div>
              </div>

              {!sealSubmitted ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Enter Verified Barangay Clearance Code</label>
                    <input
                      type="text"
                      value={sealBrgyNo}
                      onChange={(e) => setSealBrgyNo(e.target.value)}
                      placeholder="e.g. BC-2025-0418"
                      className="w-full mt-1.5 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/60 space-y-2">
                    <p className="font-bold text-amber-900 dark:text-amber-200">Safety & Good Housekeeping Checklist:</p>
                    <div className="space-y-1 text-slate-600 dark:text-slate-400">
                      <p>✓ Working CCTV Coverage synced with Barangay Command Center</p>
                      <p>✓ Segregated Solid Waste Disposal in compliance with RA 9003</p>
                      <p>✓ Clean Peace & Order standing with Barangay Tanod protocols</p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between">
                    <button onClick={() => setCurrentView('preview')} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold cursor-pointer">
                      Back to Overview
                    </button>
                    <button
                      onClick={() => {
                        setSealSubmitted(true);
                        showToast('Bagong Barangay Seal issued!');
                      }}
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold cursor-pointer transition-all"
                    >
                      Issue Safety Seal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/80 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                    <Award size={36} />
                  </div>
                  <h3 className="text-xl font-black">Bagong Barangay Safety Seal Issued!</h3>
                  <p className="text-xs text-slate-500">Official QC Good Housekeeping & Peace and Order QR Decal has been dispatched.</p>
                  <button onClick={() => setCurrentView('preview')} className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer">
                    Return to Overview
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ADMIN MODAL 1: 4-TAB CLEARANCE EVALUATION & LEGAL DOSSIER SUITE */}
        {/* ========================================================================= */}
        {activeReviewItem && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
              
              {/* Modal Top Header */}
              <div className="px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-purple-600/30">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm font-black text-purple-600 dark:text-purple-400">
                        {activeReviewItem.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                        {activeReviewItem.barangay}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                      Barangay Clearance Dossier & Legal Evaluation Suite
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setActiveReviewItem(null)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Navigation Tabs */}
              <div className="flex items-center space-x-2 px-6 sm:px-8 pt-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
                {[
                  { id: 'applicant', label: '1. Applicant & Cedula Bio', icon: User },
                  { id: 'lupon', label: '2. Lupon Blotter Case Index', icon: Scale },
                  { id: 'zoning', label: '3. Zoning & Site Concurrence', icon: Building2 },
                  { id: 'clearance_cert', label: '4. Digital Seal & Clearance Preview', icon: Award },
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = evalTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setEvalTab(tab.id as any)}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 border-b-2 cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-950/40'
                          : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <Icon size={14} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700 dark:text-slate-300">
                
                {/* TAB 1: APPLICANT BIO & CEDULA */}
                {evalTab === 'applicant' && (
                  <div className="space-y-5 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Applicant / Enterprise Name</span>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{activeReviewItem.applicantName}</p>
                        <p className="font-semibold text-purple-600 dark:text-purple-400 mt-0.5">{activeReviewItem.businessName}</p>
                        <p className="text-slate-500 mt-1">Endorsement: {activeReviewItem.purpose}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Community Tax Certificate (Cedula)</span>
                        <p className="font-mono font-bold text-slate-900 dark:text-white text-sm mt-1">{activeReviewItem.ctcNumber}</p>
                        <p className="text-emerald-600 font-bold">Amount Paid: {activeReviewItem.ctcAmount}</p>
                        <p className="text-slate-500">Issued Date: {activeReviewItem.ctcDateIssued}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-500/20 space-y-2">
                      <span className="font-bold text-purple-900 dark:text-purple-200 text-xs">Jurisdiction & Punong Barangay</span>
                      <p className="text-[11px] text-purple-700 dark:text-purple-300">
                        Assigned to <strong>{activeReviewItem.barangay}</strong> under executive sign-off authority of <strong>{activeReviewItem.punongBarangay}</strong>.
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 2: LUPON CASE INDEX */}
                {evalTab === 'lupon' && (
                  <div className="space-y-5 animate-in fade-in">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-slate-900 dark:text-white uppercase">Katarungang Pambarangay Blotter Check</span>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          activeReviewItem.luponRecordStatus.includes('Clean')
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {activeReviewItem.luponRecordStatus}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                        Inter-Barangay central blotter database query returned <strong>0 active criminal or civil disputes</strong> involving {activeReviewItem.applicantName} or the premises of {activeReviewItem.businessName}.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/20 space-y-1">
                        <span className="font-bold text-emerald-800 dark:text-emerald-300 text-xs">Amicable Settlement Standing</span>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400">No unresolved mediation orders pending</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/20 space-y-1">
                        <span className="font-bold text-emerald-800 dark:text-emerald-300 text-xs">Barangay Tanod Security Clearance</span>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400">Zero neighborhood nuisance reports filed</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: ZONING & SITE INSPECTION */}
                {evalTab === 'zoning' && (
                  <div className="space-y-5 animate-in fade-in">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white uppercase">Site Inspection & Neighbor Concurrence</span>
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {activeReviewItem.inspectionStatus}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-xs">
                        Physical locality verified compliant with Comprehensive Land Use Plan (CLUP) for {activeReviewItem.barangay}.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-500/20 space-y-2">
                      <span className="font-bold text-purple-900 dark:text-purple-200 text-xs">Environmental & Solid Waste Clearance</span>
                      <p className="text-[11px] text-purple-700 dark:text-purple-300">
                        ✓ Segregated waste disposal bin setup inspected and verified compliant with Republic Act 9003.
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 4: DIGITAL CLEARANCE CERTIFICATE PREVIEW */}
                {evalTab === 'clearance_cert' && (
                  <div className="space-y-5 animate-in fade-in">
                    <div className="p-6 rounded-3xl bg-gradient-to-tr from-slate-900 to-purple-950 border border-purple-500/40 text-white shadow-xl max-w-md mx-auto space-y-4 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                        Official Barangay Clearance Certificate
                      </div>
                      
                      <div className="w-28 h-28 bg-white p-2 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                        <Award size={90} className="text-purple-800" />
                      </div>

                      <div>
                        <span className="font-mono text-xl font-black text-purple-400 tracking-wider block">
                          {activeReviewItem.id}
                        </span>
                        <p className="font-bold text-sm text-white mt-1">{activeReviewItem.applicantName}</p>
                        <p className="text-xs text-purple-200">{activeReviewItem.businessName}</p>
                        <p className="text-[11px] text-slate-300 mt-1">{activeReviewItem.barangay} • QC</p>
                      </div>

                      <div className="pt-2 border-t border-slate-700 text-[10px] text-slate-400 font-mono">
                        Executive Sign-Off: {activeReviewItem.punongBarangay} • Valid 2025
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Decision Footer */}
              <div className="px-6 sm:px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => {
                    const itm = activeReviewItem;
                    setActiveReviewItem(null);
                    setActiveDeficiencyItem(itm);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Issue Dispute / Deficiency Notice
                </button>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      const itm = activeReviewItem;
                      setActiveReviewItem(null);
                      setActiveLuponModalItem(itm);
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <Scale size={14} />
                    <span>Run Lupon Blotter Audit</span>
                  </button>

                  <button
                    onClick={() => {
                      setClearances(prev => prev.map(c => c.id === activeReviewItem.id ? { ...c, status: 'Approved & Released' } : c));
                      showToast(`✅ Approved & Released Official Barangay Clearance ${activeReviewItem.id}!`);
                      setActiveReviewItem(null);
                    }}
                    className="flex-1 sm:flex-initial px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle2 size={14} />
                    <span>Approve & Release Clearance</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ADMIN MODAL 2: LUPON BLOTTER DISPUTE AUDIT SIMULATOR */}
        {/* ========================================================================= */}
        {activeLuponModalItem && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                    <Scale size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Lupon Tagapamayapa Case Audit
                    </h3>
                    <p className="text-xs text-slate-500">
                      Querying Katarungang Pambarangay Blotter Index
                    </p>
                  </div>
                </div>
                <button onClick={() => setActiveLuponModalItem(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Respondent / Applicant:</span>
                  <strong className="text-slate-900 dark:text-white">{activeLuponModalItem.applicantName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Enterprise:</span>
                  <strong className="text-slate-900 dark:text-white">{activeLuponModalItem.businessName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Barangay Hall:</span>
                  <strong className="text-purple-600">{activeLuponModalItem.barangay}</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Blotter Search Complete: 0 Cases Found</span>
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Applicant holds clean standing with no pending summons, boundary disputes, or barangay conciliation cases.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setActiveLuponModalItem(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setClearances(prev => prev.map(c => c.id === activeLuponModalItem.id ? { 
                      ...c, 
                      luponRecordStatus: 'Clean (No Pending Dispute)',
                      status: 'Approved & Released' 
                    } : c));
                    showToast(`⚖️ Verified clean Lupon standing for ${activeLuponModalItem.applicantName}! Clearance released.`);
                    setActiveLuponModalItem(null);
                  }}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <CheckCircle2 size={14} />
                  <span>Certify Clean & Release</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ADMIN MODAL 3: BARANGAY NODE INSPECTOR MODAL */}
        {/* ========================================================================= */}
        {selectedGridNode && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                    <Building2 size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {selectedGridNode.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {selectedGridNode.district} • Node Status: <span className="text-emerald-600 font-bold">{selectedGridNode.serverStatus}</span>
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedGridNode(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <p><strong>Punong Barangay:</strong> {selectedGridNode.captain}</p>
                  <p><strong>Barangay Hall Address:</strong> {selectedGridNode.address}</p>
                  <p><strong>Hotline Contact:</strong> {selectedGridNode.contact}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800">
                    <span className="text-lg font-black text-purple-700 dark:text-purple-300">{selectedGridNode.activeQueue}</span>
                    <span className="text-[10px] text-slate-500 block">Pending Clearances</span>
                  </div>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                    <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">{selectedGridNode.dailyReleased}</span>
                    <span className="text-[10px] text-slate-500 block">Released Today</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setSelectedGridNode(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedBarangayFilter(selectedGridNode.name);
                    setCurrentView('admin_registry');
                    setSelectedGridNode(null);
                  }}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Open Local Clearance Queue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ADMIN MODAL 4: NOTICE OF DEFICIENCY / DISPUTE ISSUER */}
        {/* ========================================================================= */}
        {activeDeficiencyItem && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Issue Notice of Deficiency or Dispute
                  </h3>
                  <p className="text-xs text-slate-500">
                    Clearance Ref: <span className="font-mono font-bold text-rose-600">{activeDeficiencyItem.id}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Primary Deficiency Reason *</label>
                  <select
                    value={deficiencyReason}
                    onChange={(e) => setDeficiencyReason(e.target.value)}
                    className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <option value="Unresolved Lupon Dispute or Barangay Boundary Conflict">Unresolved Lupon Dispute or Barangay Boundary Conflict</option>
                    <option value="Cedula Under-computation (Declared Gross Receipts Discrepancy)">Cedula Under-computation (Declared Gross Receipts Discrepancy)</option>
                    <option value="Non-Compliant Solid Waste Management Setup">Non-Compliant Solid Waste Management Setup</option>
                    <option value="Lacking Neighbor Concurrence / Zoning Objection">Lacking Neighbor Concurrence / Zoning Objection</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Barangay Captain / Officer Directives</label>
                  <textarea
                    rows={3}
                    value={deficiencyNotes}
                    onChange={(e) => setDeficiencyNotes(e.target.value)}
                    placeholder="Provide specific directives for compliance resubmission..."
                    className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setActiveDeficiencyItem(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setClearances(prev => prev.map(c => c.id === activeDeficiencyItem.id ? { ...c, status: 'Rejected' } : c));
                    showToast(`❌ Issued Deficiency Notice to ${activeDeficiencyItem.applicantName}.`);
                    setActiveDeficiencyItem(null);
                  }}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Confirm Rejection & Issue Notice
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
