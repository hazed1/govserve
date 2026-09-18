import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
  Building2,
  FileText,
  MapPin,
  Check,
  X,
  Sparkles,
  Info,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Download,
  Search,
  Building,
  Layers,
  LogOut,
  Sun,
  Moon,
  ShieldCheck,
  Award,
  DollarSign,
  Activity,
  HardHat,
  Flame,
  Bus,
  CheckCircle,
  FileSpreadsheet,
  AlertTriangle,
  FileCheck,
  UserCheck,
  Navigation as NavIcon,
  Phone,
  Eye,
  Wrench,
  Zap,
  Droplets,
  Truck,
  Compass,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { TabType } from '../types';

export interface AdminInspectionItem {
  id: string; // e.g. 'INSP-2025-089'
  category: 'Building & Structural' | 'Fire Safety (BFP FSIC)' | 'Sanitary & Environmental' | 'Tricycle & PUV Roadworthiness' | 'Special Re-Inspection';
  department: 'Office of the City Building Official (OBO)' | 'Bureau of Fire Protection (BFP R4)' | 'City Health Office (Sanitation)' | 'Tricycle Regulatory Unit (TRU)' | 'Joint Task Force';
  permitRef: string; // 'BLD-2025-00101'
  establishmentName: string; // 'Vertex Heights 18-Storey Commercial Complex'
  location: string; // 'Lot 12, Block 8, Commonwealth Ave., QC'
  barangay: string; // 'Batasan Hills'
  contactPerson: string;
  contactNumber: string;
  scheduledDate: string; // '2025-05-20'
  scheduledTime: string; // '09:00 AM'
  inspectorName: string; // 'Engr. Roberto S. Alcantara'
  inspectorBadge: string; // 'OBO-ENG-4491'
  inspectorPhone: string; // '+63 917 555 2011'
  status: 'Confirmed & Dispatched' | 'Pending Assignment' | 'In Field Audit' | 'Passed & Certified' | 'Defect Revision Required';
  safetyScore: number; // 0 - 100
  notes?: string;
  vehicleUnit?: string;
}

export interface AccreditedInspector {
  id: string;
  name: string;
  badge: string;
  department: AdminInspectionItem['department'];
  phone: string;
  specialty: string;
  activeWorkload: number;
}

export const ACCREDITED_INSPECTORS: AccreditedInspector[] = [
  {
    id: 'INSP-DOC-01',
    name: 'Engr. Roberto S. Alcantara, M.S.C.E.',
    badge: 'OBO-ENG-4491',
    department: 'Office of the City Building Official (OBO)',
    phone: '+63 917 555 2011',
    specialty: 'Structural Seismic & Foundation Audit',
    activeWorkload: 4
  },
  {
    id: 'INSP-DOC-02',
    name: 'FO3 Daniel G. Bautista, BFP',
    badge: 'BFP-FS-2819',
    department: 'Bureau of Fire Protection (BFP R4)',
    phone: '+63 918 444 8832',
    specialty: 'RA 9514 Fire Safety & Sprinkler Egress',
    activeWorkload: 3
  },
  {
    id: 'INSP-DOC-03',
    name: 'Dr. Maria Elena Santos, M.D. / R.S.',
    badge: 'CHO-SAN-1102',
    department: 'City Health Office (Sanitation)',
    phone: '+63 920 333 9104',
    specialty: 'Wastewater, STP & Commercial Hygiene',
    activeWorkload: 2
  },
  {
    id: 'INSP-DOC-04',
    name: 'Inspector Vicente P. Mendoza',
    badge: 'TRU-094',
    department: 'Tricycle Regulatory Unit (TRU)',
    phone: '+63 922 111 7733',
    specialty: 'PUV Mechanical & Emission Testing',
    activeWorkload: 5
  },
  {
    id: 'INSP-DOC-05',
    name: 'Engr. Carmela J. Dizon, P.E.C.E.',
    badge: 'OBO-ENG-5509',
    department: 'Office of the City Building Official (OBO)',
    phone: '+63 919 777 4410',
    specialty: 'High-Rise Architectural & Elevator Safety',
    activeWorkload: 3
  }
];

export const FIELD_AUDIT_CHECKLIST_ITEMS = [
  { id: 'chk_structural', label: 'Structural Foundation, Columns & Beam Moment Framing (NSCP 2015)', weight: 20 },
  { id: 'chk_fire', label: 'Fire Extinguishers, Emergency Lighting, Smoke Alarms & Dual Stair Egress (RA 9514)', weight: 25 },
  { id: 'chk_sanitary', label: 'Grease Traps, Drainage Grates & Certified STP Effluent Discharge', weight: 20 },
  { id: 'chk_electrical', label: 'Panel Board Circuit Breaker Labeling & Grounding Resistance (PEC)', weight: 20 },
  { id: 'chk_zoning', label: 'Road Right-of-Way (RROW) Setback Clearance & Sidewalk Buffer', weight: 15 }
];

const INITIAL_INSPECTIONS: AdminInspectionItem[] = [
  {
    id: 'INSP-2025-089',
    category: 'Building & Structural',
    department: 'Office of the City Building Official (OBO)',
    permitRef: 'BLD-2025-00101',
    establishmentName: 'Vertex Heights 18-Storey Commercial Complex',
    location: 'Lot 12, Block 8, Commonwealth Ave., QC',
    barangay: 'Batasan Hills',
    contactPerson: 'Engr. Julian Ramos',
    contactNumber: '+63 917 888 1234',
    scheduledDate: '2025-05-20',
    scheduledTime: '09:00 AM',
    inspectorName: 'Engr. Roberto S. Alcantara',
    inspectorBadge: 'OBO-ENG-4491',
    inspectorPhone: '+63 917 555 2011',
    status: 'Confirmed & Dispatched',
    safetyScore: 98,
    vehicleUnit: 'QC-ENGR-PATROL-02',
    notes: 'Structural moment frames and fire escape corridors 100% compliant with P.D. 1096.'
  },
  {
    id: 'INSP-2025-090',
    category: 'Fire Safety (BFP FSIC)',
    department: 'Bureau of Fire Protection (BFP R4)',
    permitRef: 'BP-2024-00123',
    establishmentName: 'Apex Innovations Retail Hub',
    location: 'Unit 402, 123 Ayala Ave., Brgy. San Antonio, QC',
    barangay: 'San Antonio',
    contactPerson: 'Beatriz Tan',
    contactNumber: '+63 918 222 3456',
    scheduledDate: '2025-05-22',
    scheduledTime: '01:30 PM',
    inspectorName: 'FO3 Daniel G. Bautista, BFP',
    inspectorBadge: 'BFP-FS-2819',
    inspectorPhone: '+63 918 444 8832',
    status: 'In Field Audit',
    safetyScore: 95,
    vehicleUnit: 'BFP-RESCUE-04',
    notes: 'Testing smoke dampers and fire sprinkler flow pressure.'
  },
  {
    id: 'INSP-2025-091',
    category: 'Tricycle & PUV Roadworthiness',
    department: 'Tricycle Regulatory Unit (TRU)',
    permitRef: 'MTOP-2025-0412',
    establishmentName: 'San Isidro TODA Unit #088 (Plate PH-48192)',
    location: 'San Isidro Integrated Terminal Inspection Bay, QC',
    barangay: 'San Isidro',
    contactPerson: 'Danilo Santos',
    contactNumber: '+63 922 999 1122',
    scheduledDate: '2025-05-24',
    scheduledTime: '10:30 AM',
    inspectorName: 'Inspector Vicente P. Mendoza',
    inspectorBadge: 'TRU-094',
    inspectorPhone: '+63 922 111 7733',
    status: 'Pending Assignment',
    safetyScore: 82,
    vehicleUnit: 'TRU-MOBILE-01',
    notes: 'Awaiting smoke emission and brake lining thickness verification.'
  },
  {
    id: 'INSP-2025-092',
    category: 'Sanitary & Environmental',
    department: 'City Health Office (Sanitation)',
    permitRef: 'BP-2025-00891',
    establishmentName: 'GreenSprout Hydroponics Commercial Warehouse',
    location: 'Bldg 4, Innovation Technopark, Brgy. Fairview, QC',
    barangay: 'Fairview',
    contactPerson: 'Clarissa Gomez',
    contactNumber: '+63 920 111 4455',
    scheduledDate: '2025-05-25',
    scheduledTime: '11:00 AM',
    inspectorName: 'Dr. Maria Elena Santos, M.D.',
    inspectorBadge: 'CHO-SAN-1102',
    inspectorPhone: '+63 920 333 9104',
    status: 'Confirmed & Dispatched',
    safetyScore: 100,
    vehicleUnit: 'CHO-HEALTH-08',
    notes: 'Wastewater filtration and chemical storage meet environmental standards.'
  },
  {
    id: 'INSP-2025-093',
    category: 'Special Re-Inspection',
    department: 'Joint Task Force',
    permitRef: 'BLD-2025-00088',
    establishmentName: 'Horizon Logistics Cold Storage Annex',
    location: 'KM 18 Quirino Highway, Brgy. Novaliches, QC',
    barangay: 'Novaliches Proper',
    contactPerson: 'Ferdinand Lim',
    contactNumber: '+63 919 666 7788',
    scheduledDate: '2025-05-26',
    scheduledTime: '02:00 PM',
    inspectorName: 'Engr. Roberto S. Alcantara',
    inspectorBadge: 'OBO-ENG-4491',
    inspectorPhone: '+63 917 555 2011',
    status: 'Defect Revision Required',
    safetyScore: 68,
    vehicleUnit: 'QC-TASKFORCE-01',
    notes: 'Notice of Deficiencies Issued: Inadequate emergency exit door width along North bay.'
  },
  {
    id: 'INSP-2025-094',
    category: 'Building & Structural',
    department: 'Office of the City Building Official (OBO)',
    permitRef: 'BLD-2025-00142',
    establishmentName: 'Metro Luxe Residences Tower 2 (Foundation Inspection)',
    location: 'Katipunan Ave. cor. Aurora Blvd., Brgy. Loyola Heights, QC',
    barangay: 'Loyola Heights',
    contactPerson: 'Arch. Patricia Cruz',
    contactNumber: '+63 917 444 3322',
    scheduledDate: '2025-05-27',
    scheduledTime: '08:30 AM',
    inspectorName: 'Engr. Carmela J. Dizon',
    inspectorBadge: 'OBO-ENG-5509',
    inspectorPhone: '+63 919 777 4410',
    status: 'Passed & Certified',
    safetyScore: 99,
    vehicleUnit: 'QC-ENGR-PATROL-05',
    notes: 'Mat foundation concrete cylinder compression test cleared at 4,500 PSI.'
  }
];

interface InspectionSchedulingProps {
  currentTab?: string;
  onNavigateToTab?: (tab: TabType | string) => void;
  onAddNewApplication?: (applicantName: string, permitType: string) => void;
  onNavigateToDashboard?: () => void;
}

export const InspectionScheduling: React.FC<InspectionSchedulingProps> = ({
  currentTab,
  onNavigateToTab,
  onAddNewApplication,
  onNavigateToDashboard
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isAdmin = user?.role === 'admin';
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Default view: For admin or when navigating to Inspector Scheduling & Dispatch, open the admin dispatch workspace!
  const isDispatchTab = currentTab?.includes('Dispatch') || currentTab?.includes('Inspection Scheduling') || isAdmin;
  const [currentView, setCurrentView] = useState<
    'admin_dispatch' | 'preview' | 'book_wizard' | 're_inspection' | 'calendar_view' | 'ctc_pulling' | 'verification' | 'safety_seal' | 'pay_fees'
  >(isDispatchTab ? 'admin_dispatch' : 'preview');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Main Inspections State synchronized with localStorage
  const [inspections, setInspections] = useState<AdminInspectionItem[]>(() => {
    try {
      const stored = localStorage.getItem('govserve_applications_registry_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        const inspectionApps = parsed.filter((app: any) => 
          (app.permitType && (app.permitType.includes('Inspection') || app.permitType.includes('Safety Seal') || app.permitType.includes('BFP')))
        );
        if (inspectionApps.length > 0) {
          const mapped: AdminInspectionItem[] = inspectionApps.map((app: any, idx: number) => ({
            id: app.id.startsWith('INSP-') ? app.id : `INSP-2025-${idx + 100}`,
            category: app.permitType.includes('Fire') 
              ? 'Fire Safety (BFP FSIC)' 
              : app.permitType.includes('Sanitary') 
              ? 'Sanitary & Environmental' 
              : app.permitType.includes('Tricycle') || app.permitType.includes('PUV')
              ? 'Tricycle & PUV Roadworthiness'
              : 'Building & Structural',
            department: app.permitType.includes('Fire') 
              ? 'Bureau of Fire Protection (BFP R4)' 
              : app.permitType.includes('Sanitary') 
              ? 'City Health Office (Sanitation)' 
              : app.permitType.includes('Tricycle')
              ? 'Tricycle Regulatory Unit (TRU)'
              : 'Office of the City Building Official (OBO)',
            permitRef: app.id,
            establishmentName: app.businessName || `${app.applicantName} Facility`,
            location: app.address || 'Quezon City Central Business District',
            barangay: 'Brgy. Central',
            contactPerson: app.applicantName || 'Citizen Applicant',
            contactNumber: '+63 917 888 1234',
            scheduledDate: app.dateSubmitted || new Date().toISOString().split('T')[0],
            scheduledTime: '09:00 AM',
            inspectorName: 'Engr. Roberto S. Alcantara',
            inspectorBadge: 'OBO-ENG-4491',
            inspectorPhone: '+63 917 555 2011',
            status: app.status === 'Approved' ? 'Passed & Certified' : 'Confirmed & Dispatched',
            safetyScore: 96,
            vehicleUnit: 'QC-LGU-PATROL-01',
            notes: 'Citizen on-site inspection booking synchronized from live registry.'
          }));
          return [...mapped, ...INITIAL_INSPECTIONS];
        }
      }
    } catch (e) {
      console.error('Error reading localStorage for inspection items:', e);
    }
    return INITIAL_INSPECTIONS;
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');

  // Modals
  const [activeDispatchItem, setActiveDispatchItem] = useState<AdminInspectionItem | null>(null);
  const [selectedInspectorId, setSelectedInspectorId] = useState<string>(ACCREDITED_INSPECTORS[0].id);
  const [dispatchVehicle, setDispatchVehicle] = useState<string>('QC-ENGR-PATROL-02');
  const [dispatchTimeSlot, setDispatchTimeSlot] = useState<string>('09:00 AM');

  const [activeAuditItem, setActiveAuditItem] = useState<AdminInspectionItem | null>(null);
  const [auditChecklist, setAuditChecklist] = useState<{ [key: string]: boolean }>({
    chk_structural: true,
    chk_fire: true,
    chk_sanitary: true,
    chk_electrical: true,
    chk_zoning: true
  });
  const [auditRemarks, setAuditRemarks] = useState<string>('');

  const [activeGpsItem, setActiveGpsItem] = useState<AdminInspectionItem | null>(null);
  const [activeDeficiencyItem, setActiveDeficiencyItem] = useState<AdminInspectionItem | null>(null);
  const [deficiencyReason, setDeficiencyReason] = useState<string>('Obstructed emergency exit corridor & expired BFP fire extinguishers');
  const [deficiencyCustomNote, setDeficiencyCustomNote] = useState<string>('');

  // Citizen Booking Form State
  const [bookingType, setBookingType] = useState<string>('Building Structural & Architectural Inspection');
  const [permitRef, setPermitRef] = useState<string>('BLD-2025-00101');
  const [locationAddress, setLocationAddress] = useState<string>('Lot 12, Block 8, Commonwealth Ave., QC');
  const [targetDate, setTargetDate] = useState<string>('2025-05-28');
  const [targetTime, setTargetTime] = useState<string>('09:00 AM');
  const [contactPerson, setContactPerson] = useState<string>(user?.name || 'Juan Dela Cruz');
  const [contactNumber, setContactNumber] = useState<string>('+63 917 888 1234');
  const [bookingSubmitted, setBookingSubmitted] = useState<boolean>(false);

  // Citizen Tools
  const [statusSearchCode, setStatusSearchCode] = useState<string>('');
  const [statusSearchResult, setStatusSearchResult] = useState<any>(null);
  const [ecopyModalOpen, setEcopyModalOpen] = useState<boolean>(false);
  const [ecopyInspNo, setEcopyInspNo] = useState<string>('INSP-2025-089');
  const [ctcInspNo, setCtcInspNo] = useState<string>('INSP-2025-089');
  const [ctcPaid, setCtcPaid] = useState<boolean>(false);
  const [feeTicketNo, setFeeTicketNo] = useState<string>('INSP-2025-089');
  const [feeReceipt, setFeeReceipt] = useState<any>(null);

  const calculateAuditScore = () => {
    return FIELD_AUDIT_CHECKLIST_ITEMS.reduce((total, item) => {
      return total + (auditChecklist[item.id] ? item.weight : 0);
    }, 0);
  };

  const handleSaveAuditDecision = (newStatus: AdminInspectionItem['status']) => {
    if (!activeAuditItem) return;
    const finalScore = calculateAuditScore();
    setInspections(prev => prev.map(item => {
      if (item.id === activeAuditItem.id) {
        return {
          ...item,
          status: newStatus,
          safetyScore: finalScore,
          notes: auditRemarks || item.notes
        };
      }
      return item;
    }));
    setActiveAuditItem(null);
    showToast(`Audit recorded for ${activeAuditItem.id}. Status: ${newStatus}`);
  };

  const handleConfirmDispatch = () => {
    if (!activeDispatchItem) return;
    const inspectorObj = ACCREDITED_INSPECTORS.find(i => i.id === selectedInspectorId) || ACCREDITED_INSPECTORS[0];
    setInspections(prev => prev.map(item => {
      if (item.id === activeDispatchItem.id) {
        return {
          ...item,
          inspectorName: inspectorObj.name,
          inspectorBadge: inspectorObj.badge,
          inspectorPhone: inspectorObj.phone,
          department: inspectorObj.department,
          vehicleUnit: dispatchVehicle,
          scheduledTime: dispatchTimeSlot,
          status: 'Confirmed & Dispatched'
        };
      }
      return item;
    }));
    setActiveDispatchItem(null);
    showToast(`Dispatched ${inspectorObj.name} to ${activeDispatchItem.establishmentName}!`);
  };

  const handleApplyDeficiency = () => {
    if (!activeDeficiencyItem) return;
    const combinedReason = `${deficiencyReason}${deficiencyCustomNote ? `: ${deficiencyCustomNote}` : ''}`;
    setInspections(prev => prev.map(item => {
      if (item.id === activeDeficiencyItem.id) {
        return {
          ...item,
          status: 'Defect Revision Required',
          safetyScore: 65,
          notes: `Inspection Non-Compliance Notice: ${combinedReason}`
        };
      }
      return item;
    }));
    setActiveDeficiencyItem(null);
    setDeficiencyCustomNote('');
    showToast(`Notice of Inspection Deficiencies issued for ${activeDeficiencyItem.id}!`);
  };

  const handleDownloadAppointmentSlip = (item: AdminInspectionItem) => {
    const text = `========================================================================================
REPUBLIC OF THE PHILIPPINES • CITY GOVERNMENT OF QUEZON CITY
JOINT MUNICIPAL INSPECTION TEAM (BUILDING, FIRE, SANITARY & TRANSPORT)
========================================================================================
OFFICIAL ON-SITE INSPECTION & DISPATCH ORDER (FORM 48-B)

INSPECTION TICKET NO    : ${item.id}
DEPARTMENT JURISDICTION : ${item.department.toUpperCase()}
INSPECTION CATEGORY     : ${item.category.toUpperCase()}
SCHEDULE STATUS         : ${item.status.toUpperCase()}
----------------------------------------------------------------------------------------
FACILITY & SITE SPECIFICATIONS:
Establishment / Project : ${item.establishmentName}
Associated Permit Code  : ${item.permitRef}
Site Location / Address : ${item.location} (Brgy. ${item.barangay})
Contact Officer         : ${item.contactPerson} (${item.contactNumber})
----------------------------------------------------------------------------------------
DISPATCH & INSPECTOR CREDENTIALS:
Lead Deputized Inspector: ${item.inspectorName}
Official LGU Badge No.  : ${item.inspectorBadge}
Mobile Field Contact    : ${item.inspectorPhone}
Assigned Vehicle Unit   : ${item.vehicleUnit || 'LGU-PATROL-01'}
Scheduled Date & Slot   : ${item.scheduledDate} at ${item.scheduledTime}
Evaluated Safety Score  : ${item.safetyScore}%
Field Notes / Findings  : ${item.notes || 'Full compliance with Joint Municipal Inspection guidelines.'}
----------------------------------------------------------------------------------------
INSPECTION DIRECTIVES & PROTOCOLS:
1. Building owner, safety officer, or authorized engineer must be present during the audit.
2. Complete approved blueprints, fire safety certificates, and permits must be presented.
3. Official QR compliance plaque will be issued upon scoring 95%+ without critical defects.
----------------------------------------------------------------------------------------
Chief of Inspection & Dispatch : ENGR. CARLOS M. DELA ROSA, CESO IV
Digital Security Seal Hash     : SHA256-INSP-DISPATCH-${item.id}-AUTHENTICATED
========================================================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Official_Inspection_Order_${item.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded Form 48-B Inspection Order for ${item.id}`);
  };

  const handleExportCSV = () => {
    const headers = 'Inspection Ticket,Category,Department,Permit Ref,Establishment,Barangay,Location,Scheduled Date,Time,Inspector,Badge,Safety Score,Status\n';
    const rows = inspections.map(i => 
      `"${i.id}","${i.category}","${i.department}","${i.permitRef}","${i.establishmentName.replace(/"/g, '""')}","${i.barangay}","${i.location.replace(/"/g, '""')}","${i.scheduledDate}","${i.scheduledTime}","${i.inspectorName}","${i.inspectorBadge}",${i.safetyScore}%,"${i.status}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Inspector_Dispatch_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Inspection Dispatch Ledger exported to CSV!');
  };

  const filteredInspections = inspections.filter(item => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.establishmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.permitRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.inspectorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barangay.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesDept = departmentFilter === 'All' || item.department === departmentFilter || item.category.includes(departmentFilter);
    return matchesSearch && matchesStatus && matchesDept;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center space-x-2.5 animate-bounce">
          <Sparkles size={16} className="text-sky-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. CITIZEN STANDALONE TOP HEADER BAR (Hidden in Admin Mode) */}
      {/* ========================================================================= */}
      {!isAdmin && (
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs px-4 sm:px-8 py-3.5 transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Left */}
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
                  On-Site Inspection & Scheduling Hub
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center space-x-3">
              {/* Home Navigation Button */}
              <button
                onClick={() => onNavigateToTab ? onNavigateToTab('Home') : setCurrentView('preview')}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-xl text-xs font-bold transition-all border border-blue-200 dark:border-blue-800 cursor-pointer shadow-xs"
                title="Return to Home Portal"
              >
                <Home size={15} />
                <span>Home</span>
              </button>



              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
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
                      <p className="text-[11px] text-slate-500 font-mono truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <button onClick={() => { setProfileDropdownOpen(false); onNavigateToTab?.('Home'); }} className="w-full px-4 py-2 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2">
                        <Home size={14} className="text-blue-500" />
                        <span>Home Portal</span>
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
      <section className="w-full bg-gradient-to-r from-[#071326] via-[#0E2744] to-[#0A1A2F] text-white py-7 sm:py-8 px-4 sm:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-3">
          {currentView !== 'preview' && currentView !== 'admin_dispatch' && (
            <div className="flex justify-end">
              <button
                onClick={() => setCurrentView('preview')}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <ArrowLeft size={13} />
                <span>Return to Inspection Overview</span>
              </button>
            </div>
          )}

          <div className="space-y-2 max-w-4xl">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              {currentView === 'admin_dispatch'
                ? 'Inspector Scheduling & Field Dispatch Console'
                : 'On-Site Inspection & Scheduling Portal'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentView === 'admin_dispatch'
                ? 'Real-Time Field Inspector Assignment, Joint Engineering & Fire Safety Walkthroughs, and Compliance Scorecard Audit Suite.'
                : 'Review official inspection regulatory tariffs, multi-agency audit protocols (OBO, BFP, Health, TRU), and mandatory documentary requirements before booking your site validation.'}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAIN BODY CONTAINER */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-7">

        {/* ========================================================================= */}
        {/* SUBVIEW 0: ADMIN INSPECTOR SCHEDULING & DISPATCH CONSOLE */}
        {/* ========================================================================= */}
        {currentView === 'admin_dispatch' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* 1. EXECUTIVE METRICS CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Scheduled</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{inspections.length}</p>
                <p className="text-[10px] text-slate-400">All bookings</p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Building & Struct</span>
                <p className="text-2xl font-black text-amber-600">
                  {inspections.filter(i => i.category === 'Building & Structural').length}
                </p>
                <p className="text-[10px] text-slate-400">Structural audits</p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">BFP Fire Safety</span>
                <p className="text-2xl font-black text-rose-600">
                  {inspections.filter(i => i.category === 'Fire Safety (BFP FSIC)').length}
                </p>
                <p className="text-[10px] text-slate-400">BFP inspections</p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Sanitary & PUV</span>
                <p className="text-2xl font-black text-purple-600">
                  {inspections.filter(i => i.category === 'Sanitary & Environmental' || i.category === 'Tricycle & PUV Roadworthiness').length}
                </p>
                <p className="text-[10px] text-slate-400">Health & transit</p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Certified Safe</span>
                <p className="text-2xl font-black text-emerald-600">
                  {inspections.filter(i => i.status === 'Passed & Certified').length}
                </p>
                <p className="text-[10px] text-slate-400">Completed visits</p>
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
                  placeholder="Search by Ticket ID, Permit Ref, Establishment, or Inspector..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {[
                  { id: 'All', label: 'All Dispatches' },
                  { id: 'Confirmed & Dispatched', label: 'Dispatched' },
                  { id: 'In Field Audit', label: 'In Audit' },
                  { id: 'Pending Assignment', label: 'Pending Dispatch' },
                  { id: 'Passed & Certified', label: 'Passed & Certified' },
                  { id: 'Defect Revision Required', label: 'Deficiencies' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      statusFilter === tab.id
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. DISPATCH & INSPECTIONS QUEUE TABLE */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    On-Site Inspection Operations & Dispatch Matrix
                  </h3>
                  <p className="text-xs text-slate-500">Showing {filteredInspections.length} active scheduled appointments</p>
                </div>
                <span className="px-2.5 py-1 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 rounded-full text-xs font-bold border border-sky-200 dark:border-sky-800">
                  Form 48-B Dispatch Standard
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Ticket ID & Category</th>
                      <th className="px-4 py-3.5">Establishment / Site</th>
                      <th className="px-4 py-3.5">Location & Barangay</th>
                      <th className="px-4 py-3.5">Date & Time Slot</th>
                      <th className="px-4 py-3.5">Assigned Inspector</th>
                      <th className="px-4 py-3.5">Safety Score</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Dispatcher Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                    {filteredInspections.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        
                        {/* Ticket & Category */}
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <span className="font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                              {item.id}
                            </span>
                            <p className="font-bold text-slate-900 dark:text-white text-xs">{item.category}</p>
                            <span className="text-[10px] text-slate-500">{item.department}</span>
                          </div>
                        </td>

                        {/* Establishment & Permit */}
                        <td className="px-4 py-4">
                          <p className="font-bold text-slate-900 dark:text-white max-w-xs line-clamp-1">{item.establishmentName}</p>
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded font-mono text-[10px] font-bold border border-blue-200 dark:border-blue-800">
                            {item.permitRef}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-0.5">{item.contactPerson} • {item.contactNumber}</p>
                        </td>

                        {/* Location */}
                        <td className="px-4 py-4">
                          <p className="text-slate-700 dark:text-slate-300 max-w-[180px] truncate" title={item.location}>
                            {item.location}
                          </p>
                          <div className="flex items-center space-x-1 mt-0.5">
                            <MapPin size={11} className="text-rose-500 flex-shrink-0" />
                            <span className="text-[11px] text-slate-500 font-semibold">{item.barangay}</span>
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="px-4 py-4">
                          <span className="font-bold text-slate-900 dark:text-white">{item.scheduledDate}</span>
                          <p className="text-[11px] text-slate-500 font-semibold">{item.scheduledTime}</p>
                          {item.vehicleUnit && (
                            <span className="text-[10px] text-sky-600 font-mono">🚙 {item.vehicleUnit}</span>
                          )}
                        </td>

                        {/* Assigned Inspector */}
                        <td className="px-4 py-4">
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-900 dark:text-white">{item.inspectorName}</p>
                            <span className="inline-block px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-mono text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                              {item.inspectorBadge}
                            </span>
                            <p className="text-[10px] text-slate-400">{item.inspectorPhone}</p>
                          </div>
                        </td>

                        {/* Safety Score */}
                        <td className="px-4 py-4">
                          <div className="space-y-1 w-24">
                            <div className="flex justify-between items-center text-[10px] font-bold">
                              <span>Audit</span>
                              <span className={item.safetyScore >= 95 ? 'text-emerald-600' : item.safetyScore >= 80 ? 'text-amber-600' : 'text-rose-600'}>
                                {item.safetyScore}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  item.safetyScore >= 95 ? 'bg-emerald-500' : item.safetyScore >= 80 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${item.safetyScore}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap inline-flex items-center space-x-1 ${
                            item.status === 'Passed & Certified'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : item.status === 'Confirmed & Dispatched'
                              ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                              : item.status === 'In Field Audit'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : item.status === 'Pending Assignment'
                              ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          }`}>
                            <span>{item.status}</span>
                          </span>
                        </td>

                        {/* Dispatcher Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            
                            {/* Assign / Reassign Inspector */}
                            <button
                              onClick={() => {
                                setActiveDispatchItem(item);
                                setDispatchVehicle(item.vehicleUnit || 'QC-ENGR-PATROL-02');
                                setDispatchTimeSlot(item.scheduledTime);
                              }}
                              className="p-1.5 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/80 text-sky-700 dark:text-sky-300 rounded-lg font-bold transition-colors cursor-pointer border border-sky-200 dark:border-sky-800"
                              title="Assign / Reassign Inspector & Dispatch Vehicle"
                            >
                              <UserCheck size={14} />
                            </button>

                            {/* Field Audit & Checklist */}
                            <button
                              onClick={() => {
                                setActiveAuditItem(item);
                                setAuditRemarks(item.notes || '');
                              }}
                              className="p-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/80 text-amber-700 dark:text-amber-300 rounded-lg font-bold transition-colors cursor-pointer border border-amber-200 dark:border-amber-800"
                              title="Input Field Audit Findings & Scorecard"
                            >
                              <FileCheck size={14} />
                            </button>

                            {/* View GPS Map Route */}
                            <button
                              onClick={() => setActiveGpsItem(item)}
                              className="p-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 rounded-lg font-bold transition-colors cursor-pointer border border-indigo-200 dark:border-indigo-800"
                              title="View GPS Field Route & Location Pin"
                            >
                              <Compass size={14} />
                            </button>

                            {/* Flag Defect */}
                            {item.status !== 'Passed & Certified' && (
                              <button
                                onClick={() => {
                                  setActiveDeficiencyItem(item);
                                  setDeficiencyReason('Obstructed emergency exit corridor & expired BFP fire extinguishers');
                                }}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-700 dark:text-rose-300 rounded-lg font-bold transition-colors cursor-pointer border border-rose-200 dark:border-rose-800"
                                title="Issue Notice of Deficiencies"
                              >
                                <AlertTriangle size={14} />
                              </button>
                            )}

                            {/* Download Form 48-B Order */}
                            <button
                              onClick={() => handleDownloadAppointmentSlip(item)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                              title="Download Form 48-B Official Inspection Order"
                            >
                              <Download size={14} />
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredInspections.length === 0 && (
                <div className="text-center py-12 space-y-2 text-slate-400">
                  <CalendarIcon size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="font-bold text-sm">No inspections matching your search filters</p>
                  <p className="text-xs">Try adjusting your keywords or department filter.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* PREVIEW PAGE: OFFICIAL INSPECTION FEE SCHEDULE & REGULATORY TARIFF GUIDE */}
        {/* ========================================================================= */}
        {currentView === 'preview' && (
          <div className="space-y-10 animate-in fade-in pb-10">
            


            {/* 4 Interactive Service Category Cards (Direct Action Functional Buttons) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Building & Structural Safety */}
              <button
                type="button"
                onClick={() => {
                  setBookingType('Building Structural & Architectural Inspection');
                  setBookingSubmitted(false);
                  setCurrentView('book_wizard');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-200 dark:border-sky-800 group-hover:scale-105 transition-transform">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                      Building & Structural Audit
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      Pagsusuri sa pundasyon, moment frames, at seismic safety alinsunod sa P.D. 1096 NBCP.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-black text-sky-600 dark:text-sky-400 font-mono">₱1,200.00</span>
                  <span className="text-[11px] font-bold text-sky-600 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Book Audit</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </button>

              {/* Card 2: BFP Fire Safety (FSIC) */}
              <button
                type="button"
                onClick={() => {
                  setBookingType('Fire Safety Inspection (BFP FSIC)');
                  setBookingSubmitted(false);
                  setCurrentView('book_wizard');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-800 group-hover:scale-105 transition-transform">
                    <Flame size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
                      Fire Safety Inspection (FSIC)
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      Pagsusuri sa mga sprinkler, smoke alarm, lagusan (egress), at BFP fire safety clearance (RA 9514).
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-black text-rose-600 dark:text-rose-400 font-mono">₱1,500.00</span>
                  <span className="text-[11px] font-bold text-rose-600 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Book Inspection</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </button>

              {/* Card 3: Sanitary & Health Site Walkthrough */}
              <button
                type="button"
                onClick={() => {
                  setBookingType('Sanitary & Health Facility Inspection');
                  setBookingSubmitted(false);
                  setCurrentView('book_wizard');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-800 group-hover:scale-105 transition-transform">
                    <Droplets size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                      Sanitary & Health Walkthrough
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      Pagsunod sa grease trap ng kusina, ligtas na inuming tubig, at wastong pamamahala ng wastewater.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-black text-purple-600 dark:text-purple-400 font-mono">₱600.00</span>
                  <span className="text-[11px] font-bold text-purple-600 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Book Sanitation</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </button>

              {/* Card 4: PUV Roadworthiness Test */}
              <button
                type="button"
                onClick={() => {
                  setBookingType('Tricycle & PUV Roadworthiness Inspection');
                  setBookingSubmitted(false);
                  setCurrentView('book_wizard');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 group-hover:scale-105 transition-transform">
                    <Bus size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                      Tricycle & PUV Roadworthiness
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      Pagsusuri sa chassis ng traysikel, mechanical brake testing, at beripikasyon sa emission.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">₱350.00</span>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Book Test</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </button>

            </div>

            {/* Itemized Statutory Fee Schedule & Tariffs (2-Column Tables) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Table 1: Building, Structural & Fire Safety Audits */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
                      <HardHat size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        Building, Structural & Fire Safety Audits
                      </h3>
                      <p className="text-[11px] text-slate-500">P.D. 1096 (NBCP) & R.A. 9514 (Fire Code)</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    Statutory
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-3.5 py-2.5">Audit Code & Description</th>
                        <th className="px-3 py-2.5">Agency</th>
                        <th className="px-3.5 py-2.5 text-right">Statutory Fee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                      <tr>
                        <td className="px-3.5 py-3">
                          <span className="font-mono font-bold text-sky-600 block text-[10px]">INSP-01</span>
                          <p className="font-bold text-slate-900 dark:text-white">Structural & Foundation Audit</p>
                          <span className="text-[10px] text-slate-500">Seismic framing & load testing</span>
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-400">OBO</td>
                        <td className="px-3.5 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">₱1,200.00</td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-3">
                          <span className="font-mono font-bold text-sky-600 block text-[10px]">INSP-02</span>
                          <p className="font-bold text-slate-900 dark:text-white">BFP Fire Safety Clearance (FSIC)</p>
                          <span className="text-[10px] text-slate-500">Sprinkler, alarm, & egress check</span>
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-400">BFP R4</td>
                        <td className="px-3.5 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">₱1,500.00</td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-3">
                          <span className="font-mono font-bold text-sky-600 block text-[10px]">INSP-03</span>
                          <p className="font-bold text-slate-900 dark:text-white">Electrical & Grounding Test</p>
                          <span className="text-[10px] text-slate-500">PEC breaker & transformer load</span>
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-400">OBO-ELEC</td>
                        <td className="px-3.5 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">₱800.00</td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-3">
                          <span className="font-mono font-bold text-sky-600 block text-[10px]">INSP-04</span>
                          <p className="font-bold text-slate-900 dark:text-white">Mechanical & Elevator Audit</p>
                          <span className="text-[10px] text-slate-500">Hoisting cables, HVAC & boiler</span>
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-400">OBO-MECH</td>
                        <td className="px-3.5 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">₱600.00</td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-3">
                          <span className="font-mono font-bold text-sky-600 block text-[10px]">INSP-05</span>
                          <p className="font-bold text-slate-900 dark:text-white">Deficiency Re-Inspection Surcharge</p>
                          <span className="text-[10px] text-slate-500">Post-rectification re-audit fee</span>
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-400">Joint Team</td>
                        <td className="px-3.5 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">₱500.00</td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-800/60 font-bold border-t border-slate-200 dark:border-slate-800">
                      <tr>
                        <td colSpan={2} className="px-3.5 py-2.5 text-slate-900 dark:text-white">Standard Joint Building Package Total</td>
                        <td className="px-3.5 py-2.5 text-right font-mono text-sky-600 dark:text-sky-400 text-sm">₱4,600.00</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Table 2: Health, Sanitation & Transit Roadworthiness */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                      <Droplets size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        Health, Sanitation & Transit Tariffs
                      </h3>
                      <p className="text-[11px] text-slate-500">City Health Sanitation & PUV Regulatory Tariffs</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    Operational
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-3.5 py-2.5">Tariff Code & Service</th>
                        <th className="px-3 py-2.5">Department</th>
                        <th className="px-3.5 py-2.5 text-right">Prescribed Tariff</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                      <tr>
                        <td className="px-3.5 py-3">
                          <span className="font-mono font-bold text-purple-600 block text-[10px]">SAN-01</span>
                          <p className="font-bold text-slate-900 dark:text-white">Commercial Food Sanitary Audit</p>
                          <span className="text-[10px] text-slate-500">Kitchen hygiene & water potability</span>
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-400">CHO-Sanitation</td>
                        <td className="px-3.5 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">₱600.00</td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-3">
                          <span className="font-mono font-bold text-purple-600 block text-[10px]">SAN-02</span>
                          <p className="font-bold text-slate-900 dark:text-white">Wastewater & STP Effluent Verification</p>
                          <span className="text-[10px] text-slate-500">Grease trap discharge compliance</span>
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-400">CHO-Env</td>
                        <td className="px-3.5 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">₱850.00</td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-3">
                          <span className="font-mono font-bold text-purple-600 block text-[10px]">TRU-01</span>
                          <p className="font-bold text-slate-900 dark:text-white">Tricycle Roadworthiness Test</p>
                          <span className="text-[10px] text-slate-500">Braking, lighting, & sidecar frame</span>
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-400">TRU-Unit</td>
                        <td className="px-3.5 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">₱350.00</td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-3">
                          <span className="font-mono font-bold text-purple-600 block text-[10px]">TRU-02</span>
                          <p className="font-bold text-slate-900 dark:text-white">Smoke Emission & Decibel Test</p>
                          <span className="text-[10px] text-slate-500">Clean air compliance verification</span>
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-400">TRU-CleanAir</td>
                        <td className="px-3.5 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">₱200.00</td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-3">
                          <span className="font-mono font-bold text-purple-600 block text-[10px]">REC-01</span>
                          <p className="font-bold text-slate-900 dark:text-white">Form 48-B Certified Copy (CTC)</p>
                          <span className="text-[10px] text-slate-500">Official authenticated report</span>
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-400">Records Div</td>
                        <td className="px-3.5 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">₱150.00</td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-800/60 font-bold border-t border-slate-200 dark:border-slate-800">
                      <tr>
                        <td colSpan={2} className="px-3.5 py-2.5 text-slate-900 dark:text-white">Health & Transit Package Total</td>
                        <td className="px-3.5 py-2.5 text-right font-mono text-purple-600 dark:text-purple-400 text-sm">₱2,150.00</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

            </div>

            {/* Mandatory Documentary Checklist Before Field Inspection */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Mandatory Documentary Checklist Before On-Site Inspection
                  </h3>
                  <p className="text-xs text-slate-500">
                    Prepare the following authenticated documents on-site for immediate inspector validation.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">1</div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Approved Blueprints / Permit Ref</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Signed and sealed architectural plans, OBO building permit, or active business permit filing reference.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">2</div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">BFP Fire Maintenance Log</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Inspection tags for ABC fire extinguishers, dual emergency exit pathways, and fire alarm functional test log.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">3</div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Sanitation & Water Test</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Bacteriological potable water certificate, grease trap maintenance log, and pest control vendor contract.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">4</div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Form 48-B Appointment Order</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Official inspection scheduling booking slip with deputized inspector verification code and QR badge.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Regulatory Services & Digital Document Portal Dock */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Quick Regulatory Services & Digital Document Portal
                </h3>
                <span className="text-xs text-slate-500">24/7 Digital Field Services</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Pull Certified True Copies (CTC) */}
                <button
                  type="button"
                  onClick={() => {
                    setCtcPaid(false);
                    setCurrentView('ctc_pulling');
                  }}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-800">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                        Pull Certified True Copy (CTC)
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Download authenticated Form 48-B inspection reports with cryptographic QR hash.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-600">
                    <span>Pull Records</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 2. Inspector Authenticity Verification */}
                <button
                  type="button"
                  onClick={() => setCurrentView('verification')}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                        Inspector Verification
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Anti-extortion tool to verify LGU engineer credentials and dispatch orders.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600">
                    <span>Verify Credentials</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 3. Pay Inspection Dues */}
                <button
                  type="button"
                  onClick={() => {
                    setFeeReceipt(null);
                    setCurrentView('pay_fees');
                  }}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-200 dark:border-sky-800">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                        Pay Inspection Dues
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Settle structural, BFP, and sanitary inspection assessments online.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-sky-600">
                    <span>Pay Assessment</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 4. Verified Safe Site Seal */}
                <button
                  type="button"
                  onClick={() => setCurrentView('safety_seal')}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800">
                      <Award size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                        Verified Safe Site Seal
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Apply for the official 100% inspection passed QR disaster plaque.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-600">
                    <span>View Recognition</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

              </div>
            </div>

            {/* Bottom Gateway Action CTA Banner */}
            <div className="rounded-3xl p-7 bg-gradient-to-r from-sky-900 via-slate-900 to-blue-900 border border-sky-500/30 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
              <div className="space-y-1 max-w-2xl">
                <h3 className="text-lg sm:text-xl font-black">
                  Ready to Book Your On-Site Safety Inspection?
                </h3>
                <p className="text-xs text-slate-300">
                  Select your establishment's category, choose a preferred date and time slot, and receive automated SMS appointment confirmation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setBookingType('Building Structural & Architectural Inspection');
                  setBookingSubmitted(false);
                  setCurrentView('book_wizard');
                }}
                className="px-6 py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-xl shadow-sky-500/25 transition-all flex items-center space-x-2 shrink-0 cursor-pointer active:scale-[0.98]"
              >
                <span>Book Inspection Appointment</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW: BOOK WIZARD */}
        {/* ========================================================================= */}
        {currentView === 'book_wizard' && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center font-bold">
                    <CalendarIcon size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Schedule Inspection Booking</h2>
                    <p className="text-xs text-slate-500">Joint Municipal Inspection Team • Step 1 of 2</p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentView(isAdmin ? 'admin_dispatch' : 'preview')}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Back
                </button>
              </div>

              {!bookingSubmitted ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Inspection Category *</label>
                    <select value={bookingType} onChange={(e) => setBookingType(e.target.value)} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl">
                      <option value="Building Structural & Architectural Inspection">Building Structural & Architectural Inspection</option>
                      <option value="Fire Safety Inspection (BFP FSIC)">Fire Safety Inspection (BFP FSIC)</option>
                      <option value="Sanitary & Health Facility Inspection">Sanitary & Health Facility Inspection</option>
                      <option value="Tricycle & PUV Roadworthiness Inspection">Tricycle & PUV Roadworthiness Inspection</option>
                      <option value="Special / Re-Inspection for Defect Clearance">Special / Re-Inspection for Defect Clearance</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Permit Reference Code (e.g. BLD, BP, MTOP) *</label>
                    <input type="text" value={permitRef} onChange={(e) => setPermitRef(e.target.value)} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Site Location / Address *</label>
                    <input type="text" value={locationAddress} onChange={(e) => setLocationAddress(e.target.value)} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300">Preferred Date *</label>
                      <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300">Time Slot *</label>
                      <select value={targetTime} onChange={(e) => setTargetTime(e.target.value)} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl">
                        <option value="09:00 AM">09:00 AM - Morning Slot</option>
                        <option value="10:30 AM">10:30 AM - Morning Slot</option>
                        <option value="01:30 PM">01:30 PM - Afternoon Slot</option>
                        <option value="03:00 PM">03:00 PM - Afternoon Slot</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        const newInspNo = `INSP-2025-0${Math.floor(100 + Math.random() * 900)}`;
                        const newInspItem: AdminInspectionItem = {
                          id: newInspNo,
                          category: bookingType.includes('Building') 
                            ? 'Building & Structural' 
                            : bookingType.includes('Fire') 
                            ? 'Fire Safety (BFP FSIC)' 
                            : bookingType.includes('Sanitary') 
                            ? 'Sanitary & Environmental' 
                            : bookingType.includes('Tricycle') 
                            ? 'Tricycle & PUV Roadworthiness' 
                            : 'Special Re-Inspection',
                          department: bookingType.includes('Building')
                            ? 'Office of the City Building Official (OBO)'
                            : bookingType.includes('Fire')
                            ? 'Bureau of Fire Protection (BFP R4)'
                            : bookingType.includes('Sanitary')
                            ? 'City Health Office (Sanitation)'
                            : 'Tricycle Regulatory Unit (TRU)',
                          permitRef: permitRef,
                          establishmentName: `${contactPerson || 'Citizen'} On-Site Facility`,
                          location: locationAddress,
                          barangay: 'Brgy. Central',
                          contactPerson: contactPerson || user?.name || 'Applicant',
                          contactNumber: contactNumber,
                          scheduledDate: targetDate,
                          scheduledTime: targetTime,
                          inspectorName: 'Engr. Roberto S. Alcantara',
                          inspectorBadge: 'OBO-ENG-4491',
                          inspectorPhone: '+63 917 555 2011',
                          status: 'Confirmed & Dispatched',
                          safetyScore: 95,
                          vehicleUnit: 'QC-LGU-PATROL-01',
                          notes: 'On-site inspection booked via portal.'
                        };
                        setInspections(prev => [newInspItem, ...prev]);
                        setBookingSubmitted(true);
                        showToast('Inspection appointment confirmed!');
                        if (onAddNewApplication) {
                          onAddNewApplication(contactPerson || user?.name || 'Citizen Applicant', `On-Site Inspection (${bookingType.split(' ')[0]})`);
                        }
                      }}
                      className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold shadow-md cursor-pointer"
                    >
                      Confirm Appointment Booking
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 mx-auto rounded-full flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Inspection Appointment Confirmed</h3>
                  <p className="text-xs text-slate-500">Your inspection ticket has been confirmed for {targetDate} at {targetTime}.</p>
                  <button onClick={() => setCurrentView(isAdmin ? 'admin_dispatch' : 'preview')} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer">
                    Return to Overview
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW: CTC PULLING */}
        {/* ========================================================================= */}
        {currentView === 'ctc_pulling' && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Layers size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Pull Certified True Copy (CTC)</h2>
                    <p className="text-xs text-slate-500">Inspection Records & Official Archives</p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentView(isAdmin ? 'admin_dispatch' : 'preview')}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Back
                </button>
              </div>

              {!ctcPaid ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Enter Inspection Ticket No. *</label>
                    <input
                      type="text"
                      value={ctcInspNo}
                      onChange={(e) => setCtcInspNo(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs"
                    />
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800/80 space-y-2">
                    <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                      <span>Certified Copy Filing Fee:</span>
                      <span className="text-purple-600 font-mono">₱150.00</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Includes authenticated digital signature & cryptographic QR hash.</p>
                  </div>
                  <button
                    onClick={() => {
                      setCtcPaid(true);
                      showToast('CTC fee settled & report authenticated!');
                    }}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    Pay ₱150.00 & Pull Official CTC
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 mx-auto rounded-full flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Official Certified Report Ready</h3>
                  <p className="text-xs text-slate-500">Document authenticated with City Building Official seal.</p>
                  <button
                    onClick={() => {
                      handleDownloadAppointmentSlip(inspections[0]);
                      setCurrentView(isAdmin ? 'admin_dispatch' : 'preview');
                    }}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 mx-auto cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Download Certified True Copy (PDF/TXT)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW: AUTHENTICITY VERIFICATION */}
        {/* ========================================================================= */}
        {currentView === 'verification' && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Inspector Authenticity Verification</h2>
                    <p className="text-xs text-slate-500">Official Anti-Extortion & LGU Credential Registry</p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentView(isAdmin ? 'admin_dispatch' : 'preview')}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Back
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter Ticket ID (e.g. INSP-2025-089) or Inspector Name..."
                    className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono text-xs"
                  />
                  <button
                    onClick={() => showToast('Verified official inspector credentials!')}
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer"
                  >
                    Verify
                  </button>
                </div>

                <div className="p-5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white">
                      ✓ OFFICIALLY DEPUTIZED & ACTIVE
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      OBO-ENG-4491
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">Engr. Roberto S. Alcantara, M.S.C.E.</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Office of the City Building Official (OBO) • Lead Structural Auditor</p>
                    <p className="text-[11px] text-slate-500">Contact: +63 917 555 2011 • PRC License: #0088912</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW: PAY INSPECTION DUES */}
        {/* ========================================================================= */}
        {currentView === 'pay_fees' && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center font-bold">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Pay Inspection Dues & Assessment</h2>
                    <p className="text-xs text-slate-500">Quezon City Treasury • Electronic Inspection Settlement</p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentView(isAdmin ? 'admin_dispatch' : 'preview')}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Back
                </button>
              </div>

              {!feeReceipt ? (
                <div className="space-y-5 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Inspection Ticket Number *</label>
                    <input
                      type="text"
                      value={feeTicketNo}
                      onChange={(e) => setFeeTicketNo(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono text-xs"
                    />
                  </div>

                  <div className="p-4 bg-sky-50 dark:bg-sky-950/40 rounded-2xl border border-sky-200 dark:border-sky-800 space-y-2">
                    <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                      <span>Inspection Assessment Dues:</span>
                      <span className="text-sky-600 font-mono text-sm">₱1,200.00</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>BFP Fire Code Surcharge:</span>
                      <span className="font-mono">₱300.00</span>
                    </div>
                    <div className="pt-2 border-t border-sky-200 dark:border-sky-800 flex justify-between font-black text-slate-900 dark:text-white">
                      <span>Total Payable:</span>
                      <span className="font-mono text-sky-600 dark:text-sky-400">₱1,500.00</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setFeeReceipt({
                        receiptNo: `OR-INSP-2025-${Math.floor(1000 + Math.random() * 9000)}`,
                        ticketNo: feeTicketNo,
                        amountPaid: 1500,
                        datePaid: new Date().toLocaleDateString()
                      });
                      showToast('Inspection payment processed successfully!');
                    }}
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl shadow-md cursor-pointer text-xs"
                  >
                    Pay ₱1,500.00 via GCash / Online Banking
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 mx-auto rounded-full flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Payment Successful</h3>
                  <p className="text-xs text-slate-500">Official Receipt: <strong className="font-mono text-slate-900 dark:text-white">{feeReceipt.receiptNo}</strong></p>
                  <button
                    onClick={() => setCurrentView(isAdmin ? 'admin_dispatch' : 'preview')}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Return to Overview
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW: SAFE SITE SEAL */}
        {/* ========================================================================= */}
        {currentView === 'safety_seal' && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Award size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Verified Safe Site & Facility Seal</h2>
                    <p className="text-xs text-slate-500">100% Joint Inspection Compliance Recognition</p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentView(isAdmin ? 'admin_dispatch' : 'preview')}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Back
                </button>
              </div>

              <div className="space-y-4 text-xs text-center py-4">
                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950 text-amber-600 rounded-3xl mx-auto flex items-center justify-center border-2 border-amber-300 shadow-md">
                  <Award size={40} />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Quezon City Safe Site Gold Accreditation</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Establishments with 95%+ audit ratings across Structural, Fire Safety, and Sanitary codes receive the official holographic entrance plaque.
                </p>
                <button
                  onClick={() => showToast('Safe Site QR Plaque certificate generated!')}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-md cursor-pointer inline-flex items-center space-x-2"
                >
                  <Award size={14} />
                  <span>Download Safe Site Plaque (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 1: ASSIGN / REASSIGN INSPECTOR & DISPATCH VEHICLE */}
        {/* ========================================================================= */}
        {activeDispatchItem && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 text-xs">
              
              <div className="p-5 bg-gradient-to-r from-sky-600 to-blue-700 text-white flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <UserCheck size={20} />
                  <div>
                    <h3 className="text-base font-black">Assign Deputized Field Inspector</h3>
                    <p className="text-xs text-sky-100">{activeDispatchItem.id} • {activeDispatchItem.establishmentName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveDispatchItem(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                    Select Accredited LGU Inspector *
                  </label>
                  <div className="space-y-2">
                    {ACCREDITED_INSPECTORS.map((insp) => (
                      <div
                        key={insp.id}
                        onClick={() => setSelectedInspectorId(insp.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          selectedInspectorId === insp.id
                            ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-500 text-sky-900 dark:text-sky-200 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs">{insp.name}</span>
                            <span className="px-1.5 py-0.2 rounded font-mono text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                              {insp.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">{insp.department} • {insp.specialty}</p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">
                          {insp.activeWorkload} active visits
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Assigned Vehicle Unit *
                    </label>
                    <select
                      value={dispatchVehicle}
                      onChange={(e) => setDispatchVehicle(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                    >
                      <option value="QC-ENGR-PATROL-02">QC-ENGR-PATROL-02 (Hilux)</option>
                      <option value="BFP-RESCUE-04">BFP-RESCUE-04 (Pumper)</option>
                      <option value="CHO-HEALTH-08">CHO-HEALTH-08 (Mobile Van)</option>
                      <option value="TRU-MOBILE-01">TRU-MOBILE-01 (Motorcycle)</option>
                      <option value="QC-TASKFORCE-01">QC-TASKFORCE-01 (Joint Bus)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Scheduled Time Slot *
                    </label>
                    <select
                      value={dispatchTimeSlot}
                      onChange={(e) => setDispatchTimeSlot(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                    >
                      <option value="08:30 AM">08:30 AM - Early Slot</option>
                      <option value="09:00 AM">09:00 AM - Morning Slot</option>
                      <option value="10:30 AM">10:30 AM - Midday Slot</option>
                      <option value="01:30 PM">01:30 PM - Afternoon Slot</option>
                      <option value="03:00 PM">03:00 PM - Late Afternoon</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  onClick={() => setActiveDispatchItem(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDispatch}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <UserCheck size={14} />
                  <span>Dispatch Inspector Team</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: FIELD AUDIT & SAFETY SCORECARD */}
        {/* ========================================================================= */}
        {activeAuditItem && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 text-xs">
              
              <div className="p-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20">
                    Field Inspection Audit
                  </span>
                  <h3 className="text-base font-black mt-0.5">Joint Municipal Safety Scorecard</h3>
                  <p className="text-xs text-amber-100">{activeAuditItem.id} • {activeAuditItem.establishmentName}</p>
                </div>
                <button
                  onClick={() => setActiveAuditItem(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                
                {/* Evaluated Score Banner */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Evaluated Safety Score</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                      {calculateAuditScore()}%
                    </p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                    calculateAuditScore() >= 95
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : calculateAuditScore() >= 80
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                  }`}>
                    {calculateAuditScore() >= 95 ? '✓ 100% PASSED (SAFE SITE QUALIFIED)' : calculateAuditScore() >= 80 ? '⚠ MINOR CORRECTIONS REQUIRED' : '⛔ FAILED CRITICAL SAFETY STANDARDS'}
                  </div>
                </div>

                {/* 5-Criteria Checklist */}
                <div className="space-y-2">
                  {FIELD_AUDIT_CHECKLIST_ITEMS.map((item) => {
                    const checked = !!auditChecklist[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => setAuditChecklist(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
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
                  <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">Lead Inspector Remarks & Field Observations</label>
                  <textarea
                    rows={3}
                    value={auditRemarks}
                    onChange={(e) => setAuditRemarks(e.target.value)}
                    placeholder="Enter on-site findings, concrete test readings, fire extinguisher dates, or drainage status..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleSaveAuditDecision('Defect Revision Required')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs cursor-pointer"
                >
                  Flag Deficiencies
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSaveAuditDecision('In Field Audit')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Save As In-Progress
                  </button>
                  <button
                    onClick={() => handleSaveAuditDecision('Passed & Certified')}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md cursor-pointer flex items-center space-x-1"
                  >
                    <Check size={14} />
                    <span>Pass & Issue Certificate</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 3: LIVE GPS FIELD MAP ROUTE VIEWER */}
        {/* ========================================================================= */}
        {activeGpsItem && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 text-xs">
              
              <div className="p-5 bg-gradient-to-r from-indigo-700 to-blue-800 text-white flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Compass size={20} />
                  <div>
                    <h3 className="text-base font-black">Live GPS Field Route & Navigation</h3>
                    <p className="text-xs text-indigo-100">{activeGpsItem.id} • {activeGpsItem.establishmentName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveGpsItem(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Map Canvas Simulation */}
              <div className="p-6 space-y-4">
                <div className="relative w-full h-72 bg-[#091B33] rounded-2xl border border-indigo-900/60 p-5 overflow-hidden flex flex-col justify-between font-mono text-cyan-300">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

                  <div className="relative z-10 flex justify-between text-[11px]">
                    <div>
                      <p className="font-bold text-white">QUEZON CITY JOINT DISPATCH GIS SECTOR 4</p>
                      <p className="text-cyan-400">COORDINATES: 14.6507° N, 121.0503° E • BRGY. {activeGpsItem.barangay.toUpperCase()}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      ● GPS ACTIVE (ETA: 12 MINS)
                    </span>
                  </div>

                  {/* Visual Map Pins */}
                  <div className="relative z-10 flex items-center justify-around my-auto">
                    <div className="text-center space-y-1">
                      <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-500/40 animate-pulse">
                        <Truck size={18} />
                      </div>
                      <p className="text-[10px] text-white font-bold">{activeGpsItem.vehicleUnit || 'LGU-PATROL-02'}</p>
                      <p className="text-[9px] text-cyan-300">{activeGpsItem.inspectorName.split(',')[0]}</p>
                    </div>

                    <div className="flex-1 max-w-[160px] border-t-2 border-dashed border-cyan-400/60 flex items-center justify-center">
                      <span className="px-2 py-0.5 bg-blue-950 text-cyan-300 text-[9px] rounded font-bold">
                        3.4 KM ROUTE
                      </span>
                    </div>

                    <div className="text-center space-y-1">
                      <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-rose-500/40">
                        <Building2 size={18} />
                      </div>
                      <p className="text-[10px] text-white font-bold">{activeGpsItem.establishmentName.split(' ')[0]}</p>
                      <p className="text-[9px] text-rose-300">Target Inspection Site</p>
                    </div>
                  </div>

                  <div className="relative z-10 flex justify-between text-[10px] pt-2 border-t border-indigo-900/80 text-slate-300">
                    <span>SITE ADDRESS: {activeGpsItem.location}</span>
                    <span className="text-emerald-400 font-bold">OFFICER PHONE: {activeGpsItem.inspectorPhone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Dispatch Route</span>
                    <p className="text-xs font-black text-slate-900 dark:text-white">Commonwealth Ave → Tandang Sora</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Arrival</span>
                    <p className="text-xs font-black text-emerald-600">{activeGpsItem.scheduledTime} Today</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Contact On-Site</span>
                    <p className="text-xs font-black text-slate-900 dark:text-white">{activeGpsItem.contactPerson}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  onClick={() => showToast('Radio ping sent to field vehicle!')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer flex items-center space-x-1.5"
                >
                  <Phone size={13} />
                  <span>Call Field Officer</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 4: NOTICE OF DEFICIENCIES */}
        {/* ========================================================================= */}
        {activeDeficiencyItem && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 text-xs">
              
              <div className="p-5 bg-rose-600 text-white flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <AlertTriangle size={20} />
                  <div>
                    <h3 className="text-base font-black">Issue Notice of Deficiencies</h3>
                    <p className="text-xs text-rose-100">{activeDeficiencyItem.id} • {activeDeficiencyItem.establishmentName}</p>
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
                    Select Non-Compliance Infraction Category *
                  </label>
                  <select
                    value={deficiencyReason}
                    onChange={(e) => setDeficiencyReason(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  >
                    <option value="Obstructed emergency exit corridor & expired BFP fire extinguishers">Obstructed emergency exit corridor & expired BFP fire extinguishers</option>
                    <option value="Unlicensed structural alteration not conforming to approved blueprint">Unlicensed structural alteration not conforming to approved blueprint</option>
                    <option value="Malfunctioning grease trap & untreated sanitary wastewater discharge">Malfunctioning grease trap & untreated sanitary wastewater discharge</option>
                    <option value="Missing structural rebar spacing proof / unvibrated concrete honeycomb">Missing structural rebar spacing proof / unvibrated concrete honeycomb</option>
                    <option value="Defective PUV headlight / worn out tire tread depth under 1.6mm">Defective PUV headlight / worn out tire tread depth under 1.6mm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Specific Corrective Actions Required
                  </label>
                  <textarea
                    rows={4}
                    value={deficiencyCustomNote}
                    onChange={(e) => setDeficiencyCustomNote(e.target.value)}
                    placeholder="Enter explicit architectural, mechanical, or plumbing revisions required within 15 days..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>

                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-2xl text-[11px] text-rose-800 dark:text-rose-200 font-medium">
                  ⚠️ The establishment will be marked as <strong>"Defect Revision Required"</strong> and given a 15-day compliance window before re-inspection.
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
