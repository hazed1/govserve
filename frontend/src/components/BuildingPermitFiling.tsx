import React, { useState, useRef, useEffect } from 'react';
import { 
  Building, 
  Building2,
  HardHat, 
  FileText, 
  Layers, 
  ShieldCheck, 
  Award, 
  Search, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Clock, 
  X, 
  Sparkles, 
  QrCode, 
  Upload, 
  FileCheck, 
  Activity, 
  Eye, 
  Check, 
  Landmark, 
  Plus, 
  Compass, 
  Wrench, 
  Zap, 
  DollarSign, 
  CheckCircle,
  FolderKanban,
  FileSpreadsheet,
  FileCode,
  Calendar,
  Phone,
  Mail,
  User,
  Shield,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  LogOut,
  Sun,
  Moon,
  CreditCard,
  Home,
  Users,
  Banknote,
  Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './ui/LanguageToggle';
import { GreenSealComplianceForm } from './GreenSealComplianceForm';
import { BuildingPermitUploadWizard } from './BuildingPermitUploadWizard';


interface AdminBuildingPermitItem {
  id: string;
  projectTitle: string;
  ownerApplicantName: string;
  architectEngineer: string;
  prcLicenseNo: string;
  locationAddress: string;
  totalFloorArea: string;
  noOfStoreys: string;
  intendedUse: string;
  estimatedCost: string;
  dateApplied: string;
  nbcpScore: number;
  structuralCheck: string;
  fireSafetyCheck: string;
  status: 'For Engineering Review' | 'For Fire Inspection' | 'Approved & Released' | 'Defect Revision Required';
  notes?: string;
  contactNumber?: string;
}

const MOCK_ADMIN_BUILDING_PERMITS: AdminBuildingPermitItem[] = [
  {
    id: 'BLD-2025-00101',
    projectTitle: 'Vertex Heights 18-Storey Mixed-Use Commercial Tower',
    ownerApplicantName: 'Vertex Prime Real Estate Corp.',
    architectEngineer: 'Arch. Roberto S. Alcantara, UAP, ASEAN Arch.',
    prcLicenseNo: 'PRC-ARCH-0044912',
    locationAddress: 'Lot 4-B, Block 12, Commonwealth Ave., Brgy. Batasan, Quezon City',
    totalFloorArea: '14,250.00 sqm',
    noOfStoreys: '18 Storeys + 2 Basements',
    intendedUse: 'Commercial Retail & High-Density BPO Offices',
    estimatedCost: '₱ 285,000,000.00',
    dateApplied: '2025-08-10',
    nbcpScore: 96,
    structuralCheck: 'Full Wind & Seismic Zone 4 Compliance',
    fireSafetyCheck: 'NFPA 101 & RA 9514 FSEC Approved',
    status: 'Approved & Released',
    notes: 'Architectural, Structural, and Mechanical plans meet 100% of P.D. 1096 guidelines.',
    contactNumber: '+63 917 888 1234'
  },
  {
    id: 'BLD-2025-00102',
    projectTitle: 'GreenHorizon 3-Storey Residential Townhouse Complex',
    ownerApplicantName: 'Engr. Ferdinand M. Santos',
    architectEngineer: 'Arch. Maria Elena C. Dizon, UAP',
    prcLicenseNo: 'PRC-ARCH-0088219',
    locationAddress: '14 Jasmine Street, Brgy. Fairview, Quezon City',
    totalFloorArea: '860.00 sqm',
    noOfStoreys: '3 Storeys with Roof Deck',
    intendedUse: 'Medium-Density Residential Cluster',
    estimatedCost: '₱ 24,500,000.00',
    dateApplied: '2025-08-14',
    nbcpScore: 92,
    structuralCheck: 'Reinforced Concrete Beam-Column Frame Compliant',
    fireSafetyCheck: 'Fire Sprinkler & Exit Stairs Validated',
    status: 'For Engineering Review',
    notes: 'Awaiting City Geodetic Engineer setback verification along north boundary.',
    contactNumber: '+63 918 555 9876'
  },
  {
    id: 'BLD-2025-00103',
    projectTitle: 'Apex Logistics & Cold Storage Distribution Warehouse',
    ownerApplicantName: 'Apex Supply Chain Logistics Inc.',
    architectEngineer: 'Engr. Danilo K. Villanueva, MSCE, PICE',
    prcLicenseNo: 'PRC-CIVIL-0033104',
    locationAddress: 'Warehouse Block 7, Quirino Highway, Novaliches, Quezon City',
    totalFloorArea: '6,400.00 sqm',
    noOfStoreys: '2 High-Ceiling Storeys with Mezzanine',
    intendedUse: 'Industrial Cold Storage & Freight Logistics',
    estimatedCost: '₱ 89,000,000.00',
    dateApplied: '2025-08-18',
    nbcpScore: 78,
    structuralCheck: 'Clear-Span Steel Truss Load Calculation Required',
    fireSafetyCheck: 'Industrial Hazard NFPA 13 Review Pending',
    status: 'Defect Revision Required',
    notes: 'Structural engineer must resubmit dead load and live load moment calculations for heavy pallet racking.',
    contactNumber: '+63 920 444 8811'
  },
  {
    id: 'BLD-2025-00104',
    projectTitle: 'San Isidro Parish Community Center & Health Clinic',
    ownerApplicantName: 'Diocese of Novaliches / Rev. Fr. Miguel Cruz',
    architectEngineer: 'Arch. Joaquin T. Valderrama, UAP',
    prcLicenseNo: 'PRC-ARCH-0071203',
    locationAddress: '78 Quirino Avenue, Brgy. Gulod, Quezon City',
    totalFloorArea: '1,200.00 sqm',
    noOfStoreys: '2 Storeys with Assembly Hall',
    intendedUse: 'Institutional Healthcare & Community Assembly',
    estimatedCost: '₱ 18,200,000.00',
    dateApplied: '2025-08-20',
    nbcpScore: 94,
    structuralCheck: 'R.C. Moment-Resisting Frame Validated',
    fireSafetyCheck: 'Dual Fire Exits and Panic Hardware Cleared',
    status: 'For Fire Inspection',
    notes: 'FSEC issued by BFP Station 4; site inspection scheduled for Thursday.',
    contactNumber: '+63 922 777 6543'
  }
];

const NBCP_REVIEW_ITEMS = [
  { id: 'nbcp_1', label: 'Zoning & Locational Clearance (Comprehensive Land Use Plan)', weight: 20 },
  { id: 'nbcp_2', label: 'Structural Wind & Seismic Hazard Analysis (NSCP 2015 7th Ed.)', weight: 20 },
  { id: 'nbcp_3', label: 'Electrical & Sanitary Mechanical Load Compliance Plans', weight: 15 },
  { id: 'nbcp_4', label: 'Road Right-of-Way (RROW) Setback & 70% Max Lot Occupancy Limit', weight: 15 },
  { id: 'nbcp_5', label: 'Geotechnical Soil Bearing Capacity & Geohazard Clearance', weight: 15 },
  { id: 'nbcp_6', label: 'PRC Licensed Civil Engineer & Architect Official Sealed Documents', weight: 15 }
];

interface BuildingPermitFilingProps {
  initialStep?: number;
  currentTab?: string;
  onNavigateToTab?: (tab: string) => void;
  onAddNewApplication?: (applicantName: string, permitType: string) => void;
  onNavigateToDashboard?: () => void;
}

export const BuildingPermitFiling: React.FC<BuildingPermitFilingProps> = ({
  initialStep = 1,
  currentTab,
  onNavigateToTab,
  onAddNewApplication,
  onNavigateToDashboard
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, language } = useLanguage();
  const isAdmin = user?.role === 'admin';
  const isReviewsTab = currentTab === 'Building Permit Reviews' || isAdmin;
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Current view controller:
  // 'admin_reviews' | 'preview' | 'hub' | 'new_building_app' | 'ancillary' | 'occupancy' | 'pay_fees' | 'special_permit' | 'ctc_pulling' | 'verification' | 'green_seal'
  const [currentView, setCurrentView] = useState<
    'admin_reviews' | 'preview' | 'hub' | 'new_building_app' | 'ancillary' | 'occupancy' | 'pay_fees' | 'special_permit' | 'ctc_pulling' | 'verification' | 'green_seal'
  >(isReviewsTab ? 'admin_reviews' : 'preview');

  // -------------------------------------------------------------
  // TOAST & MODAL STATES
  // -------------------------------------------------------------
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // -------------------------------------------------------------
  // CARD 1: APPLICATION ONLINE STATES
  // -------------------------------------------------------------
  // 1. New Building Permit (7-Step Wizard)
  const [newAppStep, setNewAppStep] = useState<number>(1);
  const [newBuildingForm, setNewBuildingForm] = useState({
    projectTitle: 'Metro East Corporate Center & Plaza',
    ownerName: user?.name || 'Avelino Construction & Development Corp.',
    ownerContact: '+63 917 888 7766',
    ownerEmail: user?.email || 'avelino.corp@govserve.ph',
    locationAddress: 'Lot 12, Block 8, Elliptical Road, Brgy. Central, Quezon City',
    tctNo: 'TCT-QC-2021-99412',
    taxDecNo: 'TD-04-12849-01',
    buildingUse: 'Commercial & Mixed-Use Office (Group E)',
    totalFloorArea: '4,500.00',
    noOfStoreys: '6 Storeys with 1 Basement Parking',
    estimatedCost: '₱ 68,000,000.00',
    leadArchitect: 'Arch. Maria Elena C. Dizon, UAP (PRC-0088219)',
    leadCivilEngineer: 'Engr. Roberto S. Alcantara, MSCE (PRC-0044912)',
    leadElectricalEngineer: 'Engr. Danilo K. Villanueva, PEE (PRC-0033104)',
    leadSanitaryEngineer: 'Engr. Teresa G. Ramos, RSE (PRC-0099411)',
    dateConstructionStart: '2025-10-01'
  });
  const [newBuildingSubmitted, setNewBuildingSubmitted] = useState<boolean>(false);

  // 2. Ancillary Clearances State
  const [ancillaryPermitNo, setAncillaryPermitNo] = useState<string>('BLD-2025-00101');
  const [selectedAncillaryTypes, setSelectedAncillaryTypes] = useState<string[]>([
    'Electrical Permit (Transformer & Main Feeder Load Analysis)',
    'Sanitary & Plumbing Permit (Septic Tank & STP Design)',
    'Mechanical Permit (Air Conditioning & Elevator System)'
  ]);
  const [ancillarySubmitted, setAncillarySubmitted] = useState<boolean>(false);

  // 3. Occupancy Certificate State
  const [occupancyPermitNo, setOccupancyPermitNo] = useState<string>('BLD-2025-00101');
  const [occupancyInspectorDate, setOccupancyInspectorDate] = useState<string>('2025-09-12');
  const [occupancySubmitted, setOccupancySubmitted] = useState<boolean>(false);

  // 4. Pay Building Fees State
  const [feeBin, setFeeBin] = useState<string>('BLD-2025-00101');
  const [feePaymentMethod, setFeePaymentMethod] = useState<'gcash' | 'maya' | 'landbank' | 'card'>('gcash');
  const [feeReceipt, setFeeReceipt] = useState<any>(null);
  const [isProcessingFee, setIsProcessingFee] = useState<boolean>(false);

  // 5. Special Scaffolding & Demolition Permit State
  const [specialDemoData, setSpecialDemoData] = useState({
    projectTitle: 'Temporary Perimeter Scaffolding & Façade Retrofit',
    contractorName: 'Titan Builders & Engineering Corp.',
    location: '45 Aurora Blvd., Quezon City',
    durationDays: '45 Calendar Days',
    safetyOfficer: 'Engr. Victor Manuel (DOLE BOSH Certified)'
  });
  const [specialDemoSubmitted, setSpecialDemoSubmitted] = useState<boolean>(false);

  // Status Search State on Hub Card 1
  const [statusSearchCode, setStatusSearchCode] = useState<string>('');
  const [statusSearchResult, setStatusSearchResult] = useState<any>(null);

  // Request for E-Copy Modal State
  const [ecopyModalOpen, setEcopyModalOpen] = useState<boolean>(false);
  const [ecopyPermitNo, setEcopyPermitNo] = useState<string>('BLD-2025-00101');
  const [ecopyGenerated, setEcopyGenerated] = useState<boolean>(false);

  // -------------------------------------------------------------
  // CARD 2: BUILDING INFORMATION SYSTEM (CTC PULLING) STATES
  // -------------------------------------------------------------
  const [ctcStep, setCtcStep] = useState<number>(1);
  const [ctcPermitNo, setCtcPermitNo] = useState<string>('BLD-2025-00101');
  const [ctcProjectName, setCtcProjectName] = useState<string>('Vertex Heights 18-Storey Mixed-Use Tower');
  const [ctcRequestorName, setCtcRequestorName] = useState<string>(user?.name || 'Juan Dela Cruz');
  const [ctcRequestorContact, setCtcRequestorContact] = useState<string>('+63 917 555 4321');
  const [ctcRequestorEmail, setCtcRequestorEmail] = useState<string>(user?.email || 'juan.delacruz@govserve.ph');
  const [ctcIdType, setCtcIdType] = useState<string>('Philippine National ID (PhilID)');
  const [ctcIdNumber, setCtcIdNumber] = useState<string>('1234-5678-9012-3456');
  const [ctcSelectedDocs, setCtcSelectedDocs] = useState<string[]>([
    'Official Certified True Copy of Approved Building Permit (Form 1)',
    'Approved Architectural & Structural Floor Plans (As-Built Sealed CAD/PDF)'
  ]);
  const [ctcPaid, setCtcPaid] = useState<boolean>(false);
  const [ctcOrNo, setCtcOrNo] = useState<string>('OR-ENG-2025-99318');
  const [ctcIsProcessingPayment, setCtcIsProcessingPayment] = useState<boolean>(false);

  // -------------------------------------------------------------
  // CARD 3: BUILDING PERMIT VERIFICATION STATES
  // -------------------------------------------------------------
  const [verifQuery, setVerifQuery] = useState<string>('BLD-2025-00101');
  const [verifResult, setVerifResult] = useState<any>({
    permitNumber: 'BLD-2025-00101',
    projectTitle: 'Vertex Heights 18-Storey Mixed-Use Commercial Tower',
    ownerApplicantName: 'Vertex Prime Real Estate Corp.',
    locationAddress: 'Lot 4-B, Block 12, Commonwealth Ave., Brgy. Batasan, Quezon City',
    totalFloorArea: '14,250.00 sqm',
    status: 'ACTIVE & OFFICIALLY ISSUED',
    validUntil: 'August 10, 2026',
    nbcpScore: '96% (EXCELLENT COMPLIANCE)',
    locationalClearance: 'APPROVED (ZON-QC-2025-091)',
    fsecNumber: 'FSEC-BFP-2025-00812 (CLEARED)',
    structuralSafety: 'NSCP 2015 ZONE 4 VERIFIED',
    leadArchitect: 'Arch. Roberto S. Alcantara (PRC-0044912)',
    qrHash: 'sha256-bld-8849127391adfe66201a4bc5'
  });
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // -------------------------------------------------------------
  // CARD 4: GREEN BUILDING SEAL STATES
  // -------------------------------------------------------------
  const [greenPermitNo, setGreenPermitNo] = useState<string>('BLD-2025-00101');
  const [greenRating, setGreenRating] = useState<'Platinum' | 'Gold' | 'Silver'>('Platinum');
  const [greenSubmitted, setGreenSubmitted] = useState<boolean>(false);

  // -------------------------------------------------------------
  // ADMIN VIEW STATES & REVIEWS CONSOLE
  // -------------------------------------------------------------
  const [adminPermits, setAdminPermits] = useState<AdminBuildingPermitItem[]>(MOCK_ADMIN_BUILDING_PERMITS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [occupancyFilter, setOccupancyFilter] = useState<string>('All');
  const [activeReviewItem, setActiveReviewItem] = useState<AdminBuildingPermitItem | null>(null);
  const [activeBlueprintItem, setActiveBlueprintItem] = useState<AdminBuildingPermitItem | null>(null);
  const [activeDeficiencyItem, setActiveDeficiencyItem] = useState<AdminBuildingPermitItem | null>(null);
  const [deficiencyReason, setDeficiencyReason] = useState<string>('Setback violation along Road Right-of-Way (RROW)');
  const [deficiencyCustomNote, setDeficiencyCustomNote] = useState<string>('');
  
  const [reviewChecklist, setReviewChecklist] = useState<Record<string, boolean>>({
    nbcp_1: true,
    nbcp_2: true,
    nbcp_3: true,
    nbcp_4: true,
    nbcp_5: true,
    nbcp_6: true
  });
  const [engineerNotes, setEngineerNotes] = useState<string>('');

  // Sync real-time citizen applications from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('govserve_applications_registry_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        const buildingApps = parsed.filter((a: any) => 
          a.type.includes('Building') || a.type.includes('Construction') || a.type.includes('Occupancy') || a.type.includes('Ancillary') || a.id.startsWith('BC-') || a.id.startsWith('BLD-')
        );
        if (buildingApps.length > 0) {
          const newEntries: AdminBuildingPermitItem[] = buildingApps.map((a: any, idx: number) => ({
            id: a.id,
            projectTitle: `${a.applicant} Proposed Construction Project`,
            ownerApplicantName: a.applicant,
            architectEngineer: 'Engr. & Arch. Design Team (PRC Validated)',
            prcLicenseNo: `PRC-ENG-${88000 + idx}`,
            locationAddress: 'District Construction Site, Quezon City',
            totalFloorArea: '1,450.00 sqm',
            noOfStoreys: '3 Storeys Commercial / Residential',
            intendedUse: a.type,
            estimatedCost: '₱ 18,500,000.00',
            dateApplied: a.date === 'Just now' ? new Date().toISOString().split('T')[0] : a.date,
            nbcpScore: a.status === 'Approved' ? 96 : a.status === 'For Approval' ? 92 : 86,
            structuralCheck: 'Seismic Zone 4 & Wind Load Analysis Under Review',
            fireSafetyCheck: 'RA 9514 Fire Code Compliance Verification',
            status: (a.status === 'Approved' ? 'Approved & Released' : a.status === 'For Approval' ? 'For Fire Inspection' : 'For Engineering Review') as AdminBuildingPermitItem['status'],
            notes: 'Application received via online citizen intake portal.'
          }));
          
          setAdminPermits(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const fresh = newEntries.filter(e => !existingIds.has(e.id));
            return [...fresh, ...prev];
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const calculateReviewScore = () => {
    let score = 0;
    NBCP_REVIEW_ITEMS.forEach(item => {
      if (reviewChecklist[item.id]) {
        score += item.weight;
      }
    });
    return score;
  };

  const handleOpenReviewModal = (item: AdminBuildingPermitItem) => {
    setActiveReviewItem(item);
    setEngineerNotes(item.notes || '');
    setReviewChecklist({
      nbcp_1: item.nbcpScore >= 20,
      nbcp_2: item.nbcpScore >= 40,
      nbcp_3: item.nbcpScore >= 55,
      nbcp_4: item.nbcpScore >= 70,
      nbcp_5: item.nbcpScore >= 85,
      nbcp_6: item.nbcpScore >= 95
    });
  };

  const handleSaveReviewDecision = (newStatus: AdminBuildingPermitItem['status']) => {
    if (!activeReviewItem) return;
    const finalScore = calculateReviewScore();
    setAdminPermits(prev => prev.map(p => {
      if (p.id === activeReviewItem.id) {
        return {
          ...p,
          status: newStatus,
          nbcpScore: finalScore,
          notes: engineerNotes || p.notes
        };
      }
      return p;
    }));
    setActiveReviewItem(null);
    showToast(`Updated permit ${activeReviewItem.id} status to: ${newStatus}`);
  };

  const handleQuickApprove = (id: string) => {
    setAdminPermits(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: 'Approved & Released', nbcpScore: 98 };
      }
      return p;
    }));
    showToast(`Official Building Permit ${id} approved & cryptographically released!`);
  };

  const handleApplyDeficiency = () => {
    if (!activeDeficiencyItem) return;
    const combinedReason = `${deficiencyReason}${deficiencyCustomNote ? `: ${deficiencyCustomNote}` : ''}`;
    setAdminPermits(prev => prev.map(p => {
      if (p.id === activeDeficiencyItem.id) {
        return {
          ...p,
          status: 'Defect Revision Required',
          notes: `Notice of Deficiencies Issued: ${combinedReason}`
        };
      }
      return p;
    }));
    setActiveDeficiencyItem(null);
    setDeficiencyCustomNote('');
    showToast(`Notice of Deficiencies dispatched for ${activeDeficiencyItem.id}`);
  };

  const handleExportCSV = () => {
    const headers = 'Permit No,Project Title,Owner,Supervising Engineer,Location,Floor Area,Storeys,Estimated Cost,NBCP Score,Status,Date Applied\n';
    const rows = adminPermits.map(p => 
      `"${p.id}","${p.projectTitle.replace(/"/g, '""')}","${p.ownerApplicantName}","${p.architectEngineer}","${p.locationAddress.replace(/"/g, '""')}","${p.totalFloorArea}","${p.noOfStoreys}","${p.estimatedCost}",${p.nbcpScore}%,"${p.status}","${p.dateApplied}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Building_Permits_NBCP_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Building permits audit ledger exported to CSV!');
  };

  const handleDownloadPermitCertificate = (item: AdminBuildingPermitItem) => {
    const text = `========================================================================================
REPUBLIC OF THE PHILIPPINES • CITY GOVERNMENT OF QUEZON CITY
OFFICE OF THE CITY BUILDING OFFICIAL • ENGINEERING & ARCHITECTURAL LICENSING
========================================================================================
OFFICIAL BUILDING PERMIT CERTIFICATE (P.D. 1096 - NATIONAL BUILDING CODE)

BUILDING PERMIT NO      : ${item.id}
APPLICATION DATE        : ${item.dateApplied}
REGISTRATION STATUS     : ${item.status.toUpperCase()}
----------------------------------------------------------------------------------------
PROJECT SPECIFICATIONS:
Project Title           : ${item.projectTitle}
Project Location        : ${item.locationAddress}
Registered Owner        : ${item.ownerApplicantName} (Contact: ${item.contactNumber || '+63 917 888 1234'})
Supervising Engineer    : ${item.architectEngineer} (PRC License: ${item.prcLicenseNo})
Total Estimated Cost    : ${item.estimatedCost}
Storeys & Floor Area    : ${item.noOfStoreys} (${item.totalFloorArea})
Building Classification : ${item.intendedUse}
----------------------------------------------------------------------------------------
TECHNICAL EVALUATION AUDIT:
NBCP Technical Score    : ${item.nbcpScore}% (PASSED REGULATORY SPECIFICATION)
Structural Assessment   : ${item.structuralCheck}
Fire Safety Assessment  : ${item.fireSafetyCheck}
Official Regulatory Note: ${item.notes || 'Full compliance with P.D. 1096 National Building Code.'}
----------------------------------------------------------------------------------------
APPROVAL & AUTHORIZATION:
Permission is hereby granted for the construction of the building structure described above,
subject to periodic on-site foundation, framing, and final occupancy inspections.
City Building Official  : ENGR. ROBERTO S. ALCANTARA, M.S.C.E.
Digital Security Hash   : SHA256-BUILDING-PERMIT-${item.id}-AUTHENTICATED
========================================================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Official_Building_Permit_${item.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded Official Building Permit for ${item.id}`);
  };

  const filteredAdminPermits = adminPermits.filter(p => {
    const matchesSearch = 
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ownerApplicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.architectEngineer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.locationAddress.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center space-x-2.5 animate-bounce">
          <Sparkles size={16} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. CITIZEN STANDALONE TOP HEADER BAR (Hidden in Admin Mode to prevent duplicate headers) */}
      {/* ========================================================================= */}
      {!isAdmin && (
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs px-4 sm:px-8 py-3.5 transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Left: Branding & Back to Portal */}
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
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  Building Clearances & Blueprint Permits
                </p>
              </div>
            </div>

            {/* Right: Quick Action Controls, Dark Mode & Profile */}
            <div className="flex items-center space-x-3">
              
              {/* Home Navigation Button */}
              <button
                onClick={() => onNavigateToTab ? onNavigateToTab('Home') : setCurrentView('preview')}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-xl text-xs font-bold transition-all border border-blue-200 dark:border-blue-800 cursor-pointer shadow-xs"
                title={t('return_home', 'Return to Home Portal')}
              >
                <Home size={15} />
                <span>{t('home', 'Home')}</span>
              </button>

              {/* Language Switcher TL | EN Toggle */}
              <LanguageToggle />

              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title={theme === 'dark' ? t('theme_light', 'Switch to Light Mode') : t('theme_dark', 'Switch to Dark Mode')}
              >
                {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
              </button>

              <div className="relative" ref={dropdownRef}>
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
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigateToTab?.('Home');
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 cursor-pointer"
                      >
                        <Home size={14} className="text-blue-500" />
                        <span>Home Portal</span>
                      </button>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigateToTab?.('Home');
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 cursor-pointer"
                      >
                        <Clock size={14} className="text-amber-500" />
                        <span>My Applications Dashboard</span>
                      </button>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center space-x-2 cursor-pointer font-semibold"
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
      )}

      {/* ========================================================================= */}
      {/* 2. FULL-WIDTH HERO SECTION */}
      {/* ========================================================================= */}
      <section className="w-full bg-white dark:bg-gradient-to-r dark:from-[#071326] dark:via-[#0E2744] dark:to-[#0A1A2F] text-slate-900 dark:text-white py-7 sm:py-8 px-4 sm:px-8 border-b border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors">
        <div className="hidden dark:block absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="hidden dark:block absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-3">
          {currentView !== 'preview' && currentView !== 'admin_reviews' && (
            <div className="flex justify-end">
              <button
                onClick={() => setCurrentView('preview')}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <ArrowLeft size={13} />
                <span>Return to Building Overview</span>
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {currentView === 'admin_reviews' 
                  ? 'Building Permit Reviews' 
                  : 'Building Permit & Construction Portal'}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                {currentView === 'admin_reviews'
                  ? 'Engineering and architectural compliance review queue for submitted building permits.'
                  : 'Review the official regulatory fee schedule, engineering clearance assessments, and mandatory documentary requirements under the National Building Code of the Philippines (P.D. 1096).'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN BODY CONTAINER */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-7">

        {/* ========================================================================= */}
        {/* PREVIEW PAGE: OFFICIAL BUILDING FEE SCHEDULE & ENGINEERING TARIFF GUIDE */}
        {/* ========================================================================= */}
        {currentView === 'preview' && (
          <div className="space-y-10 animate-in fade-in pb-10">
            


            {/* ========================================================================= */}
            {/* TOP GATEWAY ACTION CTA */}
            {/* ========================================================================= */}
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-black">
                  Ready to Start Your Building Permit Application?
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                  Proceed to file a new building construction permit, upload architectural & engineering blueprints, or request ancillary clearances.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setNewAppStep(1);
                    setNewBuildingSubmitted(false);
                    setCurrentView('new_building_app');
                  }}
                  className="px-8 py-4 bg-white hover:bg-slate-100 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-lg transition-all flex items-center space-x-2 cursor-pointer active:scale-[0.98]"
                >
                  <span>Start New Application</span>
                  <ArrowRight size={16} strokeWidth={3} className="text-blue-600" />
                </button>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* HERO SECTION: OFFICIAL PICTURE 3 REFERENCE DESIGN */}
            {/* ========================================================================= */}
            <div className="relative rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-slate-900 via-[#10243e] to-slate-950 border border-sky-500/30 text-white shadow-xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-sky-500/25 transition-all duration-700" />
              <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center space-x-3">
                    <span className="px-3.5 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-sky-500/20 text-sky-300 border border-sky-400/30">
                      Engineering & Infrastructure
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                      Building and Construction Permit
                    </h2>
                    <p className="text-sm font-semibold text-sky-300 mt-1">
                      Building Clearances & Blueprint Permits
                    </p>
                  </div>

                  {/* 5 Feature Rows with Circular Badges matching Picture 3 */}
                  <div className="space-y-2.5 pt-2 border-t border-white/10">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0288d1] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <Users size={16} />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-white block">Target Users</span>
                        <span className="text-slate-300">Property developers, structural owners, and licensed architects / civil engineers</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0288d1] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <Building2 size={16} />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-white block">Service Method</span>
                        <span className="text-slate-300">Online application through GovServe</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0288d1] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <Clock size={16} />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-white block">Time Period</span>
                        <span className="text-slate-300">5 to 7 days upon joint engineering & FSEC review</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0288d1] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <Banknote size={16} />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-white block">Charges & Payment</span>
                        <span className="text-slate-300">Assessed per total floor area (sqm) under National Building Code</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0288d1] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <CreditCard size={16} />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-white block">Payment Method</span>
                        <span className="text-slate-300">Via GovServe online portal</span>
                      </div>
                    </div>
                  </div>

                  {/* Document Photo Upload Callout */}
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                    <div className="flex items-center space-x-2 text-sky-300 text-xs font-bold">
                      <Camera size={15} className="text-sky-400" />
                      <span>Blueprint & Technical Document Upload Active</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Upload clear architectural CAD/PDF plans, structural analyses, soil tests, and FSEC clearances with automated digital evaluation.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                        <FileText size={10} className="text-sky-300" /> Architectural Plans
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                        <FileText size={10} className="text-sky-300" /> Structural CAD
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                        <FileText size={10} className="text-sky-300" /> Title / TCT
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                        <FileText size={10} className="text-sky-300" /> FSEC Clearance
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Controls matching Picture 3 */}
                <div className="w-full lg:w-80 flex flex-col space-y-3 flex-shrink-0">
                  <button
                    onClick={() => {
                      setNewAppStep(1);
                      setNewBuildingSubmitted(false);
                      setCurrentView('new_building_app');
                    }}
                    className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5 cursor-pointer group/btn"
                  >
                    <span>Apply for Building Permit →</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setAncillarySubmitted(false);
                        setCurrentView('ancillary');
                      }}
                      className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Wrench size={13} />
                      <span>Upload Plans</span>
                    </button>

                    <button
                      onClick={() => {
                        showToast('Viewing Building Permit Requirements & NBCP Standards');
                      }}
                      className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <FileCheck size={13} />
                      <span>View Requirements</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 3 EXPANDED BUILDING SERVICE MODULE CARDS (SAME FORMAT AS PICTURE 1) */}
            {/* ========================================================================= */}
            <div className="space-y-6">
              
              {/* ======================================================================= */}
              {/* CARD 1: ANCILLARY PERMITS */}
              {/* ======================================================================= */}
              <div className="relative rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-slate-900 via-[#1c1303] to-slate-950 border border-amber-500/30 text-white shadow-xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/25 transition-all duration-700" />
                <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center space-x-3">
                      <span className="px-3.5 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30">
                        Technical Clearances
                      </span>
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1.5">
                        <Wrench size={12} className="text-amber-400" />
                        <span>Fast-Track Clearance</span>
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
                        <Wrench className="text-amber-400" size={26} />
                        <span>Ancillary Permits</span>
                      </h2>
                      <p className="text-xs sm:text-sm font-medium text-amber-300/90 mt-1">
                        Electrical, Sanitary/Plumbing, Mechanical (HVAC/Elevator), & Electronics Clearances
                      </p>
                    </div>

                    {/* 5 Feature Rows with Circular Badges */}
                    <div className="space-y-2.5 pt-2 border-t border-white/10">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Users size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Target Users</span>
                          <span className="text-slate-300">Professional Electrical (PEE), Master Plumbers, and Mechanical Engineers</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Building2 size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Service Method</span>
                          <span className="text-slate-300">Online filing via GovServe – Technical Ancillary Clearance Desk</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Clock size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Time Period</span>
                          <span className="text-slate-300">2 to 3 working days upon plan verification & load schedule check</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Banknote size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Charges & Payment</span>
                          <span className="text-slate-300">₱1,650.00 Standard Assessment per technical trade clearance</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <CreditCard size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Payment Method</span>
                          <span className="text-slate-300">Via GovServe online portal (e-Wallets, Maya, GCash, Landbank)</span>
                        </div>
                      </div>
                    </div>

                    {/* Document Photo Upload Callout */}
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                      <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold">
                        <Camera size={15} className="text-amber-400" />
                        <span>Trade Line Plans & Engineering Specifications Upload Active</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Upload clear single-line wiring diagrams, plumbing riser blueprints, HVAC mechanical schematics, and sealed PRC specifications.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-amber-300" /> Electrical Single-Line
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-amber-300" /> Sanitary Riser
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-amber-300" /> Mechanical Plan
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-amber-300" /> Electronics Diagram
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary & Secondary Action Controls */}
                  <div className="w-full lg:w-80 flex flex-col space-y-3 flex-shrink-0">
                    <button
                      onClick={() => {
                        setAncillarySubmitted(false);
                        setCurrentView('ancillary');
                      }}
                      className="w-full py-4 px-6 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-amber-600/30 hover:shadow-amber-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5 cursor-pointer group/btn"
                    >
                      <span>Apply for Ancillary Permits →</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setAncillarySubmitted(false);
                          setCurrentView('ancillary');
                        }}
                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Banknote size={13} className="text-amber-400" />
                        <span>Standard: ₱1,650</span>
                      </button>
                      <button
                        onClick={() => showToast('Viewing Ancillary Clearance Guidelines')}
                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <FileCheck size={13} />
                        <span>Requirements</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* CARD 2: CERTIFICATE OF OCCUPANCY */}
              {/* ======================================================================= */}
              <div className="relative rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-slate-900 via-[#06241a] to-slate-950 border border-emerald-500/30 text-white shadow-xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/25 transition-all duration-700" />
                <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center space-x-3">
                      <span className="px-3.5 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        Habitation Clearance
                      </span>
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1.5">
                        <ShieldCheck size={12} className="text-emerald-400" />
                        <span>Final Sign-Off</span>
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
                        <ShieldCheck className="text-emerald-400" size={26} />
                        <span>Certificate of Occupancy</span>
                      </h2>
                      <p className="text-xs sm:text-sm font-medium text-emerald-300/90 mt-1">
                        Final Engineering Inspection, Fire Safety Compliance (FSIC), & Habitation Authorization
                      </p>
                    </div>

                    {/* 5 Feature Rows with Circular Badges */}
                    <div className="space-y-2.5 pt-2 border-t border-white/10">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Users size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Target Users</span>
                          <span className="text-slate-300">Building owners and developers with completed structural construction</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Building2 size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Service Method</span>
                          <span className="text-slate-300">Online inspection request & document verification via GovServe</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Clock size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Time Period</span>
                          <span className="text-slate-300">3 to 5 working days upon on-site joint inspector sign-off</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Banknote size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Charges & Payment</span>
                          <span className="text-slate-300">₱2,400.00 Official Occupancy Inspection Tariff</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <CreditCard size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Payment Method</span>
                          <span className="text-slate-300">Via GovServe online portal (e-Wallets, Maya, GCash, Landbank)</span>
                        </div>
                      </div>
                    </div>

                    {/* Document Photo Upload Callout */}
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                      <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold">
                        <Camera size={15} className="text-emerald-400" />
                        <span>As-Built Plans & Completion Documents Upload Active</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Upload clear as-built architectural drawings, Certificate of Completion by Supervising Engineer, FSIC certificate, and site photos.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-emerald-300" /> As-Built Plans
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-emerald-300" /> Certificate of Completion
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-emerald-300" /> FSIC Certificate
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-emerald-300" /> Structural Sign-Off
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary & Secondary Action Controls */}
                  <div className="w-full lg:w-80 flex flex-col space-y-3 flex-shrink-0">
                    <button
                      onClick={() => {
                        setOccupancySubmitted(false);
                        setCurrentView('occupancy');
                      }}
                      className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5 cursor-pointer group/btn"
                    >
                      <span>Request Occupancy Inspection →</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setOccupancySubmitted(false);
                          setCurrentView('occupancy');
                        }}
                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Banknote size={13} className="text-emerald-400" />
                        <span>Tariff: ₱2,400</span>
                      </button>
                      <button
                        onClick={() => showToast('Viewing Occupancy Prerequisites & Checklist')}
                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <FileCheck size={13} />
                        <span>Checklist</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* CARD 3: SPECIAL & DEMOLITION PERMITS */}
              {/* ======================================================================= */}
              <div className="relative rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-slate-900 via-[#1e0a2e] to-slate-950 border border-purple-500/30 text-white shadow-xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/25 transition-all duration-700" />
                <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center space-x-3">
                      <span className="px-3.5 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-400/30">
                        Hazardous & Special
                      </span>
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center space-x-1.5">
                        <HardHat size={12} className="text-purple-400" />
                        <span>Public Safety</span>
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
                        <HardHat className="text-purple-400" size={26} />
                        <span>Special & Demolition Permits</span>
                      </h2>
                      <p className="text-xs sm:text-sm font-medium text-purple-300/90 mt-1">
                        Temporary Sidewalk Enclosure, Deep Excavation, Scaffolding, & Structural Demolition Permits
                      </p>
                    </div>

                    {/* 5 Feature Rows with Circular Badges */}
                    <div className="space-y-2.5 pt-2 border-t border-white/10">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Users size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Target Users</span>
                          <span className="text-slate-300">Demolition contractors, excavation crews, and civil construction builders</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Building2 size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Service Method</span>
                          <span className="text-slate-300">Online hazardous works filing and structural safety audit via GovServe</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Clock size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Time Period</span>
                          <span className="text-slate-300">2 to 4 working days upon safety perimeter & structural engineering audit</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Banknote size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Charges & Payment</span>
                          <span className="text-slate-300">₱1,200.00 Base Special Permit & Protective Enclosure Pass</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <CreditCard size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Payment Method</span>
                          <span className="text-slate-300">Via GovServe online portal (e-Wallets, Maya, GCash, Landbank)</span>
                        </div>
                      </div>
                    </div>

                    {/* Document Photo Upload Callout */}
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                      <div className="flex items-center space-x-2 text-purple-300 text-xs font-bold">
                        <Camera size={15} className="text-purple-400" />
                        <span>Demolition Method & Structural Shoring Upload Active</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Upload clear structural demolition sequence plans, protective catch platform blueprints, and neighbor protection agreements.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-purple-300" /> Demolition Plan
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-purple-300" /> Soil Shoring Design
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-purple-300" /> Public Safety Plan
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-purple-300" /> Neighbor Consent
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary & Secondary Action Controls */}
                  <div className="w-full lg:w-80 flex flex-col space-y-3 flex-shrink-0">
                    <button
                      onClick={() => {
                        setSpecialDemoSubmitted(false);
                        setCurrentView('special_permit');
                      }}
                      className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5 cursor-pointer group/btn"
                    >
                      <span>File Special Permit →</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSpecialDemoSubmitted(false);
                          setCurrentView('special_permit');
                        }}
                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Banknote size={13} className="text-purple-400" />
                        <span>Pass: ₱1,200</span>
                      </button>
                      <button
                        onClick={() => showToast('Viewing Special Permit Safety Standards')}
                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <FileCheck size={13} />
                        <span>Safety Code</span>
                      </button>
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
                  <ShieldCheck className="text-blue-500" size={20} />
                  <span>Mandatory Documentary Checklist Before Construction Filing</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Prepare notarized digital blueprint sets and property titles before initiating your application
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">5 Sets Blueprint Plans</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Signed and dry-sealed architectural, structural, sanitary, and electrical plans by licensed PRC professionals.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Proof of Ownership / TCT</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Certified True Copy of Transfer Certificate of Title (TCT), updated Real Property Tax Declaration, and Tax Clearance.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Barangay Clearance</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Barangay Construction Clearance from the project host barangay and City Zoning/Locational Clearance.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Soil Boring & Analysis</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Geotechnical soil investigation report and structural design computations (mandatory for 2-storey and above).
                  </p>
                </div>
              </div>
            </div>


          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 0: ADMIN BUILDING PERMIT REVIEWS CONSOLE */}
        {/* ========================================================================= */}
        {currentView === 'admin_reviews' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* 1. EXECUTIVE METRICS CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total In Queue</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{adminPermits.length}</p>
                <p className="text-[10px] text-slate-400">All submissions</p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">For Engr Review</span>
                <p className="text-2xl font-black text-amber-600">
                  {adminPermits.filter(p => p.status === 'For Engineering Review').length}
                </p>
                <p className="text-[10px] text-slate-400">Structural audit</p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">For Fire Check</span>
                <p className="text-2xl font-black text-rose-600">
                  {adminPermits.filter(p => p.status === 'For Fire Inspection').length}
                </p>
                <p className="text-[10px] text-slate-400">BFP inspection</p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Deficiencies</span>
                <p className="text-2xl font-black text-rose-500">
                  {adminPermits.filter(p => p.status === 'Defect Revision Required').length}
                </p>
                <p className="text-[10px] text-slate-400">Revisions needed</p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Approved</span>
                <p className="text-2xl font-black text-emerald-600">
                  {adminPermits.filter(p => p.status === 'Approved & Released').length}
                </p>
                <p className="text-[10px] text-slate-400">Permits released</p>
              </div>
            </div>

            {/* 2. CLEAN SEARCH & FILTER BAR */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Permit No, Project Title, Owner, or Lead Architect..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {[
                  { id: 'All', label: 'All Reviews' },
                  { id: 'For Engineering Review', label: 'Structural Review' },
                  { id: 'For Fire Inspection', label: 'Fire Safety' },
                  { id: 'Approved & Released', label: 'Approved' },
                  { id: 'Defect Revision Required', label: 'Deficiencies' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      statusFilter === tab.id
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. REVIEWS QUEUE TABLE */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Building Permit Applications & Engineering Review Queue
                  </h3>
                  <p className="text-xs text-slate-500">Showing {filteredAdminPermits.length} active construction project records</p>
                </div>
                <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-full text-xs font-bold border border-amber-200 dark:border-amber-800">
                  National Building Code (P.D. 1096)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Permit No & Project</th>
                      <th className="px-4 py-3.5">Owner / Developer</th>
                      <th className="px-4 py-3.5">Lead Architect & PRC No</th>
                      <th className="px-4 py-3.5">Location & Storeys</th>
                      <th className="px-4 py-3.5">Valuation</th>
                      <th className="px-4 py-3.5">NBCP Score</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Reviewer Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                    {filteredAdminPermits.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        
                        {/* Permit & Project */}
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                              {item.id}
                            </span>
                            <p className="font-bold text-slate-900 dark:text-white text-xs max-w-xs line-clamp-1">{item.projectTitle}</p>
                            <span className="text-[10px] text-slate-500">{item.intendedUse}</span>
                          </div>
                        </td>

                        {/* Owner */}
                        <td className="px-4 py-4">
                          <p className="font-bold text-slate-900 dark:text-white">{item.ownerApplicantName}</p>
                          <p className="text-[11px] text-slate-400">{item.contactNumber || '+63 917 888 1234'}</p>
                        </td>

                        {/* Architect / Engineer */}
                        <td className="px-4 py-4">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{item.architectEngineer}</p>
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded font-mono text-[10px] font-bold border border-blue-200 dark:border-blue-800">
                            {item.prcLicenseNo}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="px-4 py-4">
                          <p className="text-slate-600 dark:text-slate-300 max-w-[170px] truncate" title={item.locationAddress}>
                            {item.locationAddress}
                          </p>
                          <p className="text-[11px] text-slate-400 font-semibold">{item.noOfStoreys} • {item.totalFloorArea}</p>
                        </td>

                        {/* Valuation */}
                        <td className="px-4 py-4">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">{item.estimatedCost}</span>
                          <p className="text-[10px] text-slate-400">Applied: {item.dateApplied}</p>
                        </td>

                        {/* NBCP Score */}
                        <td className="px-4 py-4">
                          <div className="space-y-1 w-24">
                            <div className="flex justify-between items-center text-[10px] font-bold">
                              <span>P.D. 1096</span>
                              <span className={item.nbcpScore >= 90 ? 'text-emerald-600' : item.nbcpScore >= 75 ? 'text-amber-600' : 'text-rose-600'}>
                                {item.nbcpScore}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  item.nbcpScore >= 90 ? 'bg-emerald-500' : item.nbcpScore >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${item.nbcpScore}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap inline-flex items-center space-x-1 ${
                            item.status === 'Approved & Released'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : item.status === 'For Engineering Review'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : item.status === 'For Fire Inspection'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          }`}>
                            <span>{item.status}</span>
                          </span>
                        </td>

                        {/* Reviewer Action Buttons */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            
                            {/* Primary Review Button */}
                            <button
                              onClick={() => handleOpenReviewModal(item)}
                              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/80 text-amber-700 dark:text-amber-300 rounded-lg font-bold text-[11px] transition-colors cursor-pointer border border-amber-200 dark:border-amber-800 flex items-center space-x-1"
                              title="Audit Technical Plans & Checklist"
                            >
                              <FileCheck size={13} />
                              <span>Review</span>
                            </button>

                            {/* Blueprint AI Inspection */}
                            <button
                              onClick={() => setActiveBlueprintItem(item)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                              title="View Blueprints & CAD Scan"
                            >
                              <Layers size={13} />
                            </button>

                            {/* Quick Approve */}
                            {item.status !== 'Approved & Released' && (
                              <button
                                onClick={() => handleQuickApprove(item.id)}
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-lg transition-colors cursor-pointer border border-emerald-200 dark:border-emerald-800"
                                title="Approve & Sign"
                              >
                                <Check size={13} />
                              </button>
                            )}

                            {/* Issue Notice of Deficiencies */}
                            {item.status !== 'Approved & Released' && (
                              <button
                                onClick={() => {
                                  setActiveDeficiencyItem(item);
                                  setDeficiencyReason('Setback violation along Road Right-of-Way (RROW)');
                                }}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded-lg transition-colors cursor-pointer border border-rose-200 dark:border-rose-800"
                                title="Notice of Deficiencies"
                              >
                                <AlertTriangle size={13} />
                              </button>
                            )}

                            {/* Download Official Permit */}
                            <button
                              onClick={() => handleDownloadPermitCertificate(item)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                              title="Download Permit Certificate"
                            >
                              <Download size={13} />
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredAdminPermits.length === 0 && (
                <div className="text-center py-12 space-y-2 text-slate-400">
                  <Building2 size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="font-bold text-sm">No Building Permit applications matching your search</p>
                  <p className="text-xs">Try adjusting your filters or search keywords.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 1: NEW APPLICATION (UPLOAD-FIRST WIZARD) */}
        {/* ========================================================================= */}
        {currentView === 'new_building_app' && (
          <BuildingPermitUploadWizard
            onBack={() => setCurrentView('preview')}
            onAddNewApplication={onAddNewApplication}
            onNavigateToDashboard={onNavigateToDashboard}
          />
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 2: ANCILLARY & SPECIALTY PERMITS */}
        {/* ========================================================================= */}
        {currentView === 'ancillary' && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                  <Wrench size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Ancillary & Specialty Clearances
                  </h2>
                  <p className="text-xs text-slate-500">Electrical, Plumbing, Mechanical & Sanitary Engineering Endorsements</p>
                </div>
              </div>

              {!ancillarySubmitted ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Associated Main Building Permit No. *</label>
                    <input
                      type="text"
                      value={ancillaryPermitNo}
                      onChange={(e) => setAncillaryPermitNo(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 mb-2 block">Select Required Ancillary Permits *</label>
                    <div className="space-y-2">
                      {[
                        'Electrical Permit (Transformer & Main Feeder Load Analysis)',
                        'Sanitary & Plumbing Permit (Septic Tank & STP Design)',
                        'Mechanical Permit (Air Conditioning & Elevator System)',
                        'Excavation & Ground Preparation Clearance'
                      ].map((item) => {
                        const checked = selectedAncillaryTypes.includes(item);
                        return (
                          <div
                            key={item}
                            onClick={() => {
                              if (checked) {
                                setSelectedAncillaryTypes(selectedAncillaryTypes.filter(x => x !== item));
                              } else {
                                setSelectedAncillaryTypes([...selectedAncillaryTypes, item]);
                              }
                            }}
                            className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                              checked ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-900 dark:text-amber-200' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <span>{item}</span>
                            {checked && <Check size={16} className="text-amber-600" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setAncillarySubmitted(true);
                        showToast('Ancillary clearances lodged successfully!');
                        if (onAddNewApplication) {
                          onAddNewApplication(user?.name || 'Building Owner', 'Building Ancillary Permit');
                        }
                      }}
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                    >
                      Submit Ancillary Endorsements
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 mx-auto rounded-full flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold">Ancillary Endorsements Submitted</h3>
                  <p className="text-xs text-slate-500">Your ancillary permits have been queued for mechanical & sanitary engineering verification.</p>
                  <button onClick={() => setCurrentView('preview')} className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold">
                    Return to Overview
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 3: CERTIFICATE OF OCCUPANCY / COMPLETION */}
        {/* ========================================================================= */}
        {currentView === 'occupancy' && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  <Landmark size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Certificate of Occupancy & Completion
                  </h2>
                  <p className="text-xs text-slate-500">Final Building Inspection, As-Built Verification & Release</p>
                </div>
              </div>

              {!occupancySubmitted ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Approved Building Permit Reference *</label>
                    <input
                      type="text"
                      value={occupancyPermitNo}
                      onChange={(e) => setOccupancyPermitNo(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Target Final Inspection Date *</label>
                    <input
                      type="date"
                      value={occupancyInspectorDate}
                      onChange={(e) => setOccupancyInspectorDate(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>

                  <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-2">
                    <p className="font-bold text-emerald-900 dark:text-emerald-200">Prerequisites for Certificate of Occupancy:</p>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">• As-Built Plans signed & sealed by supervising architects and engineers</p>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">• Fire Safety Inspection Certificate (FSIC for Occupancy) issued by BFP</p>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">• Certificate of Completion from Master Electrician and Master Plumber</p>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setOccupancySubmitted(true);
                        showToast('Occupancy Inspection scheduled successfully!');
                        if (onAddNewApplication) {
                          onAddNewApplication(user?.name || 'Building Owner', 'Certificate of Occupancy');
                        }
                      }}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                    >
                      Schedule Occupancy Inspection
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 mx-auto rounded-full flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold">Occupancy Inspection Scheduled</h3>
                  <p className="text-xs text-slate-500">The Municipal Inspector Team will conduct the on-site physical walk-through on {occupancyInspectorDate}.</p>
                  <button onClick={() => setCurrentView('preview')} className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold">
                    Return to Overview
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 4: PAY BUILDING & ENGINEERING FEES */}
        {/* ========================================================================= */}
        {currentView === 'pay_fees' && (
          <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  <DollarSign size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Pay Building & Engineering Dues
                  </h2>
                  <p className="text-xs text-slate-500">Instant Online Official Receipt (OR) Generation</p>
                </div>
              </div>

              {!feeReceipt ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Building Permit / Assessment No. *</label>
                    <input
                      type="text"
                      value={feeBin}
                      onChange={(e) => setFeeBin(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex justify-between font-medium">
                      <span>Building Structure Filing Fee (P.D. 1096):</span>
                      <span className="font-mono">₱ 18,500.00</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Electrical & Mechanical Inspection Fee:</span>
                      <span className="font-mono">₱ 9,200.00</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Sanitary & Locational Clearance Fee:</span>
                      <span className="font-mono">₱ 6,450.00</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Fire Safety Inspection Fee (15% BFP):</span>
                      <span className="font-mono">₱ 8,700.00</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-sm text-slate-900 dark:text-white">
                      <span>Total Engineering Assessment Due:</span>
                      <span className="font-mono text-emerald-600">₱ 42,850.00</span>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 mb-2 block">Choose Payment Gateway</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'gcash', label: 'GCash' },
                        { id: 'maya', label: 'Maya' },
                        { id: 'landbank', label: 'Landbank' },
                        { id: 'card', label: 'Credit Card' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFeePaymentMethod(item.id as any)}
                          className={`p-3 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                            feePaymentMethod === item.id 
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      disabled={isProcessingFee}
                      onClick={() => {
                        setIsProcessingFee(true);
                        setTimeout(() => {
                          setIsProcessingFee(false);
                          setFeeReceipt({
                            orNo: 'OR-ENG-2025-88491',
                            amount: '₱ 42,850.00',
                            date: new Date().toLocaleString(),
                            permitNo: feeBin
                          });
                          showToast('Payment confirmed! Official Receipt generated.');
                        }, 1200);
                      }}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center space-x-2"
                    >
                      {isProcessingFee ? <span>Processing Secure Payment...</span> : <span>Confirm Payment of ₱ 42,850.00</span>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 mx-auto rounded-full flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold">Official Receipt Released</h3>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5 font-mono">
                    <p><strong>OR NUMBER  :</strong> {feeReceipt.orNo}</p>
                    <p><strong>PERMIT REF :</strong> {feeReceipt.permitNo}</p>
                    <p><strong>AMOUNT PAID:</strong> {feeReceipt.amount}</p>
                    <p><strong>TIMESTAMP  :</strong> {feeReceipt.date}</p>
                  </div>
                  <button onClick={() => setCurrentView('preview')} className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold">
                    Return to Overview
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 5: SPECIAL SCAFFOLDING & DEMOLITION PERMIT */}
        {/* ========================================================================= */}
        {currentView === 'special_permit' && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                  <HardHat size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Special Scaffolding & Demolition Permit
                  </h2>
                  <p className="text-xs text-slate-500">Short-Term Demolition, Public Right-of-Way Protection & Enclosure</p>
                </div>
              </div>

              {!specialDemoSubmitted ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Project / Demolition Title *</label>
                    <input
                      type="text"
                      value={specialDemoData.projectTitle}
                      onChange={(e) => setSpecialDemoData({...specialDemoData, projectTitle: e.target.value})}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Contractor / Safety Engineer Name *</label>
                    <input
                      type="text"
                      value={specialDemoData.contractorName}
                      onChange={(e) => setSpecialDemoData({...specialDemoData, contractorName: e.target.value})}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Location Address *</label>
                    <input
                      type="text"
                      value={specialDemoData.location}
                      onChange={(e) => setSpecialDemoData({...specialDemoData, location: e.target.value})}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>
                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setSpecialDemoSubmitted(true);
                        showToast('Special Demolition/Scaffolding clearance issued!');
                        if (onAddNewApplication) {
                          onAddNewApplication(specialDemoData.contractorName || user?.name || 'Contractor', 'Scaffolding & Demolition Permit');
                        }
                      }}
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                    >
                      File Special Demolition Clearance
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 mx-auto rounded-full flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold">Special Clearance Filed</h3>
                  <p className="text-xs text-slate-500">Your temporary scaffolding and demolition clearance has been lodged.</p>
                  <button onClick={() => setCurrentView('preview')} className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold">
                    Return to Overview
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 6: CTC PULLING (CERTIFIED TRUE COPIES OF BLUEPRINTS) */}
        {/* ========================================================================= */}
        {currentView === 'ctc_pulling' && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                  <Layers size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Pulling of Certified True Copies (CTC) of Plans & Permits
                  </h2>
                  <p className="text-xs text-slate-500">Official Municipal Archive Document Retrieval System</p>
                </div>
              </div>

              {!ctcPaid ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Building Permit Reference Code *</label>
                    <input
                      type="text"
                      value={ctcPermitNo}
                      onChange={(e) => setCtcPermitNo(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Project / Building Name *</label>
                    <input
                      type="text"
                      value={ctcProjectName}
                      onChange={(e) => setCtcProjectName(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 mb-2 block">Select Documents to Pull *</label>
                    <div className="space-y-2">
                      {[
                        'Official Certified True Copy of Approved Building Permit (Form 1)',
                        'Approved Architectural & Structural Floor Plans (As-Built Sealed CAD/PDF)',
                        'Official Certificate of Occupancy & Fire Safety Endorsement'
                      ].map((doc) => {
                        const isSel = ctcSelectedDocs.includes(doc);
                        return (
                          <div
                            key={doc}
                            onClick={() => {
                              if (isSel) {
                                setCtcSelectedDocs(ctcSelectedDocs.filter(d => d !== doc));
                              } else {
                                setCtcSelectedDocs([...ctcSelectedDocs, doc]);
                              }
                            }}
                            className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                              isSel ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 text-purple-900 dark:text-purple-200' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <span>{doc}</span>
                            {isSel && <Check size={16} className="text-purple-600" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-2xl flex justify-between items-center text-xs">
                    <span className="font-bold text-purple-900 dark:text-purple-200">Archive Search & CTC Certification Fee:</span>
                    <span className="font-mono font-bold text-purple-900 dark:text-purple-200">₱ 500.00</span>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      disabled={ctcIsProcessingPayment}
                      onClick={() => {
                        setCtcIsProcessingPayment(true);
                        setTimeout(() => {
                          setCtcIsProcessingPayment(false);
                          setCtcPaid(true);
                          showToast('CTC Documents authenticated & unlocked for download!');
                        }, 1000);
                      }}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-2"
                    >
                      {ctcIsProcessingPayment ? <span>Authenticating Municipal Watermark...</span> : <span>Pay ₱500.00 & Download CTC</span>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 mx-auto rounded-full flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold">Certified True Copy Unlocked</h3>
                  <p className="text-xs text-slate-500">Official tamper-proof watermarked files for {ctcPermitNo} are ready for download.</p>
                  
                  <div className="space-y-2 text-xs max-w-md mx-auto">
                    {ctcSelectedDocs.map((doc, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <span className="truncate pr-2 font-medium">{doc}</span>
                        <button
                          onClick={() => showToast(`Downloaded watermarked ${doc}`)}
                          className="px-3 py-1 bg-purple-600 text-white rounded-lg font-bold flex items-center space-x-1"
                        >
                          <Download size={12} />
                          <span>PDF</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button onClick={() => setCurrentView('preview')} className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold">
                      Return to Overview
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 7: BUILDING PERMIT VERIFICATION MODAL / SCREEN */}
        {/* ========================================================================= */}
        {currentView === 'verification' && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Building Permit & NBCP Standing Verification
                  </h2>
                  <p className="text-xs text-slate-500">Cryptographic Verification & P.D. 1096 Compliance Audit</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={verifQuery}
                  onChange={(e) => setVerifQuery(e.target.value)}
                  placeholder="Enter Permit No (e.g. BLD-2025-00101)..."
                  className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
                <button
                  onClick={() => {
                    setIsVerifying(true);
                    setTimeout(() => {
                      setIsVerifying(false);
                      showToast('Verification lookup complete!');
                    }, 500);
                  }}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                >
                  Verify Standing
                </button>
              </div>

              {verifResult && (
                <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-mono font-bold text-amber-600 text-sm">{verifResult.permitNumber}</span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {verifResult.status}
                    </span>
                  </div>
                  <p><strong>Project:</strong> {verifResult.projectTitle}</p>
                  <p><strong>Owner:</strong> {verifResult.ownerApplicantName}</p>
                  <p><strong>Location:</strong> {verifResult.locationAddress}</p>
                  <p><strong>Floor Area:</strong> {verifResult.totalFloorArea}</p>
                  <p><strong>NBCP Score:</strong> <span className="text-emerald-600 font-bold">{verifResult.nbcpScore}</span></p>
                  <p><strong>Locational / Zoning:</strong> {verifResult.locationalClearance}</p>
                  <p><strong>Fire Safety Clearance:</strong> {verifResult.fsecNumber}</p>
                  <p><strong>Lead Architect:</strong> {verifResult.leadArchitect}</p>
                  <div className="pt-2 text-[10px] font-mono text-slate-400">
                    Cryptographic Signature: {verifResult.qrHash}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button onClick={() => setCurrentView('preview')} className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold">
                  Return to Overview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 8: GREEN BUILDING SEAL APPLICATION */}
        {/* ========================================================================= */}
        {currentView === 'green_seal' && (
          <GreenSealComplianceForm 
            onBack={() => setCurrentView('preview')}
            onSubmitSuccess={(pNo, rating) => {
              showToast(`Green Seal (${rating}) filed for permit ${pNo}!`);
              if (onAddNewApplication) {
                onAddNewApplication(`Green Seal Application (${rating}) - ${pNo}`, 'Building Permit');
              }
            }}
          />
        )}

        {/* ========================================================================= */}
        {/* MODAL: REQUEST E-COPY */}
        {/* ========================================================================= */}
        {ecopyModalOpen && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-in zoom-in-95 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <Download size={18} className="text-amber-600" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Request Official E-Copy</h3>
                </div>
                <button onClick={() => { setEcopyModalOpen(false); setEcopyGenerated(false); }} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              {!ecopyGenerated ? (
                <div className="space-y-4">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Enter Building Permit No. *</label>
                    <input
                      type="text"
                      value={ecopyPermitNo}
                      onChange={(e) => setEcopyPermitNo(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    The official e-copy is certified with the cryptographic QR signature of the City Building Official.
                  </p>
                  <button
                    onClick={() => {
                      setEcopyGenerated(true);
                      showToast('E-Copy generated!');
                    }}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
                  >
                    Generate E-Copy Document
                  </button>
                </div>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 mx-auto rounded-full flex items-center justify-center">
                    <CheckCircle2 size={28} />
                  </div>
                  <p className="font-bold">E-Copy Ready for Download</p>
                  <button
                    onClick={() => {
                      const item = adminPermits[0];
                      handleDownloadPermitCertificate(item);
                      setEcopyModalOpen(false);
                      setEcopyGenerated(false);
                    }}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl flex items-center justify-center space-x-2"
                  >
                    <Download size={14} />
                    <span>Download Building Permit E-Copy</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: ADMIN NBCP TECHNICAL REVIEW EVALUATION */}
        {/* ========================================================================= */}
        {activeReviewItem && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/20 text-white">
                    City Building Official Audit
                  </span>
                  <h3 className="text-lg font-black mt-1">
                    NBCP Technical Evaluation & Engineering Review
                  </h3>
                  <p className="text-xs text-amber-100 font-medium">
                    {activeReviewItem.id} • {activeReviewItem.projectTitle}
                  </p>
                </div>
                <button
                  onClick={() => setActiveReviewItem(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Evaluated Technical Score</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                      {calculateReviewScore()}%
                    </p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                    calculateReviewScore() >= 80
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                  }`}>
                    {calculateReviewScore() >= 80 ? '✓ PASSED NBCP STANDARDS' : '⚠ TECHNICAL DEFECTS FOUND'}
                  </div>
                </div>

                <div className="space-y-2">
                  {NBCP_REVIEW_ITEMS.map((item) => {
                    const checked = !!reviewChecklist[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => setReviewChecklist(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          checked
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-400'
                          }`}>
                            {checked && <Check size={12} />}
                          </div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500">+{item.weight}%</span>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">City Engineer Regulatory Notes</label>
                  <textarea
                    rows={3}
                    value={engineerNotes}
                    onChange={(e) => setEngineerNotes(e.target.value)}
                    placeholder="Enter technical audit remarks or revision requirements..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleSaveReviewDecision('Defect Revision Required')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs"
                >
                  Require Revision
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSaveReviewDecision('For Fire Inspection')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-xs"
                  >
                    Endorse to BFP
                  </button>
                  <button
                    onClick={() => handleSaveReviewDecision('Approved & Released')}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md"
                  >
                    Approve & Issue Permit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: AI BLUEPRINT & STRUCTURAL CAD SCANNER */}
        {/* ========================================================================= */}
        {activeBlueprintItem && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
              
              {/* Header */}
              <div className="p-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-white">
                    <Layers size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/30 text-blue-200">
                      AI OCR Blueprint & Structural Analyzer
                    </span>
                    <h3 className="text-base font-black mt-0.5">
                      {activeBlueprintItem.projectTitle}
                    </h3>
                    <p className="text-xs text-blue-200">
                      Ref: <span className="font-mono font-bold text-white">{activeBlueprintItem.id}</span> • Arch. {activeBlueprintItem.architectEngineer}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveBlueprintItem(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Blueprint Simulated Canvas */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs">
                
                {/* Visual CAD Canvas */}
                <div className="relative w-full h-72 sm:h-80 bg-[#061325] rounded-2xl border border-blue-900/50 p-5 overflow-hidden flex flex-col justify-between font-mono text-cyan-400">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                  {/* Top CAD Meta */}
                  <div className="relative z-10 flex justify-between items-start text-[10px]">
                    <div>
                      <p className="font-bold text-white">SHEET A-101: TYPICAL FLOOR PLAN & STRUCTURAL GRID</p>
                      <p className="text-cyan-300">SCALE: 1:100M • ORIENTATION: NORTH 12° E</p>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      ✓ AI OCR PARSED (100% CONFIDENCE)
                    </span>
                  </div>

                  {/* Simulated Blueprint Layout Shapes */}
                  <div className="relative z-10 grid grid-cols-3 gap-3 my-auto">
                    <div className="p-3 border-2 border-dashed border-emerald-400/80 bg-emerald-950/30 rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-emerald-300">
                        <span>FIRE EXIT CORRIDOR</span>
                        <CheckCircle2 size={12} />
                      </div>
                      <p className="text-[11px] text-white">Width: 1.50m</p>
                      <p className="text-[9px] text-emerald-400">P.D. 1096 / RA 9514 Cleared</p>
                    </div>

                    <div className="p-3 border-2 border-dashed border-cyan-400/80 bg-cyan-950/30 rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-cyan-300">
                        <span>RC COLUMN C-1 (600x600)</span>
                        <CheckCircle2 size={12} />
                      </div>
                      <p className="text-[11px] text-white">Moment Framing</p>
                      <p className="text-[9px] text-cyan-400">NSCP Zone 4 Seismic Cleared</p>
                    </div>

                    <div className="p-3 border-2 border-dashed border-amber-400/80 bg-amber-950/30 rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-amber-300">
                        <span>RROW ROAD SETBACK</span>
                        <CheckCircle2 size={12} />
                      </div>
                      <p className="text-[11px] text-white">Front: 5.50m (Req: 5.0m)</p>
                      <p className="text-[9px] text-amber-400">Zoning Setback Compliant</p>
                    </div>
                  </div>

                  {/* Bottom CAD Meta */}
                  <div className="relative z-10 flex justify-between items-end text-[10px] pt-2 border-t border-blue-900/60">
                    <span>SEALED BY: {activeBlueprintItem.architectEngineer}</span>
                    <span className="text-emerald-400 font-bold">DIGITAL BLUEPRINT HASH: SHA256-CAD-QC-9941</span>
                  </div>
                </div>

                {/* AI Findings Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="font-bold text-slate-500 text-[10px] uppercase">Seismic & Wind Safety</span>
                    <p className="text-sm font-black text-emerald-600">NSCP 2015 Zone 4</p>
                    <p className="text-[11px] text-slate-400">Moment-resisting concrete frame verified</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="font-bold text-slate-500 text-[10px] uppercase">Fire Life Safety</span>
                    <p className="text-sm font-black text-emerald-600">RA 9514 FSEC Ready</p>
                    <p className="text-[11px] text-slate-400">2 Dual staircases with panic hardware</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="font-bold text-slate-500 text-[10px] uppercase">Ventilation & Light</span>
                    <p className="text-sm font-black text-emerald-600">14.2% Ratio</p>
                    <p className="text-[11px] text-slate-400">Exceeds 10% minimum window area</p>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => showToast('Exported AI Blueprint Inspection Summary!')}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Export CAD Analysis PDF</span>
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      handleQuickApprove(activeBlueprintItem.id);
                      setActiveBlueprintItem(null);
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
                  >
                    <Check size={14} />
                    <span>Approve Structural Blueprints</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: NOTICE OF DEFICIENCIES & REVISION ORDER */}
        {/* ========================================================================= */}
        {activeDeficiencyItem && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 text-xs">
              
              <div className="p-5 bg-rose-600 text-white flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <AlertTriangle size={20} />
                  <div>
                    <h3 className="text-base font-black">Issue Notice of Deficiencies</h3>
                    <p className="text-xs text-rose-100">{activeDeficiencyItem.id} • {activeDeficiencyItem.projectTitle}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveDeficiencyItem(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Select Technical Non-Compliance Category *
                  </label>
                  <select
                    value={deficiencyReason}
                    onChange={(e) => setDeficiencyReason(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  >
                    <option value="Setback violation along Road Right-of-Way (RROW) - Section 704">Setback violation along Road Right-of-Way (RROW) - Section 704</option>
                    <option value="Missing Geotechnical Soil Boring Test (over 3 storeys requirement)">Missing Geotechnical Soil Boring Test (over 3 storeys requirement)</option>
                    <option value="Inadequate Fire Exit Stair Width & Lack of Panic Hardware (RA 9514)">Inadequate Fire Exit Stair Width & Lack of Panic Hardware (RA 9514)</option>
                    <option value="Deficient Concrete Beam-Column Moment Framing Calculations">Deficient Concrete Beam-Column Moment Framing Calculations</option>
                    <option value="Missing Sewage Treatment Plant (STP) / Sanitary Clearance">Missing Sewage Treatment Plant (STP) / Sanitary Clearance</option>
                    <option value="Unsealed / Expired PRC Licensed Professional Engineer Endorsement">Unsealed / Expired PRC Licensed Professional Engineer Endorsement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Specific Revision Instructions for Architect / Engineer
                  </label>
                  <textarea
                    rows={4}
                    value={deficiencyCustomNote}
                    onChange={(e) => setDeficiencyCustomNote(e.target.value)}
                    placeholder="Provide specific dimensions, recalculation formulas, or required documents to be resubmitted..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>

                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-2xl text-[11px] text-rose-800 dark:text-rose-200 font-medium">
                  ⚠️ This action will mark the application as <strong>"Defect Revision Required"</strong> and automatically notify the applicant with a 15-day compliance window.
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  onClick={() => setActiveDeficiencyItem(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyDeficiency}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <AlertTriangle size={14} />
                  <span>Dispatch Deficiency Notice</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

    </div>
  );
};
