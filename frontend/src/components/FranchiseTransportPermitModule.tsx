import React, { useState, useRef } from 'react';
import { 
  Bus, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Plus, 
  Download, 
  Eye, 
  FileText, 
  QrCode, 
  MapPin, 
  Calendar, 
  User, 
  Check, 
  X, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight, 
  RefreshCw, 
  Award, 
  AlertCircle, 
  FileCheck, 
  Printer,
  Trash2,
  Camera,
  UploadCloud,
  Copy,
  Hash,
  Send,
  HelpCircle,
  Layers,
  ChevronDown,
  LogOut,
  Sun,
  Moon,
  DollarSign,
  Truck,
  Car,
  Zap,
  CreditCard,
  Home,
  Users,
  Banknote
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './ui/LanguageToggle';
import { TabType } from '../types';
import { FranchiseTransportUploadWizard } from './FranchiseTransportUploadWizard';


export interface VehicleUnit {
  id: string;
  unitType: 'Tricycle (MTOP)' | 'Jeepney (PUJ)' | 'Van / UV Express' | 'E-Trike / Modern PUV';
  makeBrand: string;
  model: string;
  yearModel: string;
  plateNumber: string;
  motorNumber: string;
  chassisNumber: string;
  orCrNumber: string;
}

export interface FranchiseItem {
  id: string;
  mtopNo: string;
  operatorName: string;
  dateOfBirth: string;
  address: string;
  contactNumber: string;
  emailAddress: string;
  governmentIdType: string;
  governmentIdNo: string;
  applicationType: 'New' | 'Renewal';
  previousMtopNo?: string;
  todaOrganization: string;
  unitType: 'Tricycle (MTOP)' | 'Jeepney (PUJ)' | 'Van / UV Express' | 'E-Trike / Modern PUV';
  bodyNo: string;
  plateNumber: string;
  engineNo: string;
  chassisNo: string;
  orCrNumber: string;
  routeAssigned: string;
  startingPoint: string;
  destination: string;
  numberOfUnits: number;
  vehicles: VehicleUnit[];
  routeCapacityStatus: 'Within Quota' | 'Near Capacity' | 'Quota Full';
  status: 'Approved & Active' | 'For Unit Inspection' | 'Pending Review' | 'Renewal Required' | 'Rejected';
  dateApplied: string;
  expiryDate: string;
  inspectionScore?: string;
  feeAmount: string;
}

const INITIAL_MOCK_FRANCHISES: FranchiseItem[] = [
  {
    id: 'FR-2025-001',
    mtopNo: 'MTOP-2025-0412',
    operatorName: 'Juan Dela Cruz',
    dateOfBirth: '1984-06-15',
    address: '142 Batasan Road, Barangay Batasan Hills, Quezon City',
    contactNumber: '+63 917 555 1201',
    emailAddress: 'juan.delacruz@example.com',
    governmentIdType: "Driver's License",
    governmentIdNo: 'N01-08-123456',
    applicationType: 'New',
    todaOrganization: 'Batasan Hills TODA (BHTODA)',
    unitType: 'Tricycle (MTOP)',
    bodyNo: 'Unit #088',
    plateNumber: 'PH-48192',
    engineNo: 'ENG-9981244',
    chassisNo: 'CHS-88192019',
    orCrNumber: 'ORCR-2024-991204',
    routeAssigned: 'Batasan Complex ↔ Commonwealth Market Terminal, Quezon City',
    startingPoint: 'Batasan Complex',
    destination: 'Commonwealth Market Terminal',
    numberOfUnits: 1,
    vehicles: [
      {
        id: 'unit-1',
        unitType: 'Tricycle (MTOP)',
        makeBrand: 'Honda',
        model: 'TMX 125 Alpha',
        yearModel: '2024',
        plateNumber: 'PH-48192',
        motorNumber: 'ENG-9981244',
        chassisNumber: 'CHS-88192019',
        orCrNumber: 'ORCR-2024-991204'
      }
    ],
    routeCapacityStatus: 'Within Quota',
    status: 'Approved & Active',
    dateApplied: '2025-08-10',
    expiryDate: 'Dec 31, 2025',
    inspectionScore: '98% - Roadworthy & Clean Emissions',
    feeAmount: '₱1,250.00'
  },
  {
    id: 'FR-2025-002',
    mtopNo: 'MTOP-2025-0891',
    operatorName: 'Ramon S. Bautista',
    dateOfBirth: '1979-11-20',
    address: '88 Commonwealth Ave., Barangay Commonwealth, Quezon City',
    contactNumber: '+63 918 222 4433',
    emailAddress: 'ramon.bautista@example.com',
    governmentIdType: 'UMID Card',
    governmentIdNo: 'CRN-0012-998124-1',
    applicationType: 'Renewal',
    previousMtopNo: 'MTOP-2024-0319',
    todaOrganization: 'Commonwealth TODA (COMTODA)',
    unitType: 'Tricycle (MTOP)',
    bodyNo: 'Unit #024',
    plateNumber: 'QC-77129',
    engineNo: 'ENG-8812903',
    chassisNo: 'CHS-77189021',
    orCrNumber: 'ORCR-2023-881920',
    routeAssigned: 'Commonwealth Market ↔ Litex Terminal, Quezon City',
    startingPoint: 'Commonwealth Market',
    destination: 'Litex Terminal',
    numberOfUnits: 1,
    vehicles: [
      {
        id: 'unit-2',
        unitType: 'Tricycle (MTOP)',
        makeBrand: 'Kawasaki',
        model: 'Barako II 175',
        yearModel: '2023',
        plateNumber: 'QC-77129',
        motorNumber: 'ENG-8812903',
        chassisNumber: 'CHS-77189021',
        orCrNumber: 'ORCR-2023-881920'
      }
    ],
    routeCapacityStatus: 'Near Capacity',
    status: 'For Unit Inspection',
    dateApplied: '2025-08-16',
    expiryDate: 'Dec 31, 2025',
    inspectionScore: 'Scheduled for Thursday',
    feeAmount: '₱1,250.00'
  },
  {
    id: 'FR-2025-003',
    mtopNo: 'MTOP-2025-1102',
    operatorName: 'Elena V. Santos',
    dateOfBirth: '1988-03-08',
    address: '23 Commonwealth Ext., Barangay Batasan, Quezon City',
    contactNumber: '+63 920 888 9911',
    emailAddress: 'elena.santos@example.com',
    governmentIdType: 'Philippine Passport',
    governmentIdNo: 'P9812401A',
    applicationType: 'New',
    todaOrganization: 'Batasan Hills Drivers & Operators (BHDOA)',
    unitType: 'E-Trike / Modern PUV',
    bodyNo: 'Unit #105',
    plateNumber: 'EV-99014',
    engineNo: 'ENG-E-10029',
    chassisNo: 'CHS-E-881924',
    orCrNumber: 'ORCR-2025-00192',
    routeAssigned: 'Batasan Complex ↔ Ever Gotesco Commonwealth',
    startingPoint: 'Batasan Complex',
    destination: 'Ever Gotesco Commonwealth',
    numberOfUnits: 2,
    vehicles: [
      {
        id: 'unit-3a',
        unitType: 'E-Trike / Modern PUV',
        makeBrand: 'EcoTrike PH',
        model: 'Maxi Volt 6-Seater',
        yearModel: '2025',
        plateNumber: 'EV-99014',
        motorNumber: 'ENG-E-10029',
        chassisNumber: 'CHS-E-881924',
        orCrNumber: 'ORCR-2025-00192'
      },
      {
        id: 'unit-3b',
        unitType: 'E-Trike / Modern PUV',
        makeBrand: 'EcoTrike PH',
        model: 'Maxi Volt 6-Seater',
        yearModel: '2025',
        plateNumber: 'EV-99015',
        motorNumber: 'ENG-E-10030',
        chassisNumber: 'CHS-E-881925',
        orCrNumber: 'ORCR-2025-00193'
      }
    ],
    routeCapacityStatus: 'Within Quota',
    status: 'Pending Review',
    dateApplied: '2025-08-20',
    expiryDate: 'Dec 31, 2025',
    inspectionScore: 'Pending Roadworthiness Evaluation',
    feeAmount: '₱2,500.00'
  },
  {
    id: 'FR-2025-004',
    mtopNo: 'MTOP-2025-1490',
    operatorName: 'Danilo C. Ocampo',
    dateOfBirth: '1982-07-14',
    address: '55 Regalado Ave., Barangay Fairview, Quezon City',
    contactNumber: '+63 917 444 8812',
    emailAddress: 'danilo.ocampo@example.com',
    governmentIdType: "Driver's License",
    governmentIdNo: 'N02-09-654321',
    applicationType: 'New',
    todaOrganization: 'Fairview TODA (FTODA)',
    unitType: 'Tricycle (MTOP)',
    bodyNo: 'Unit #012',
    plateNumber: 'PH-99120',
    engineNo: 'ENG-3301924',
    chassisNo: 'CHS-99201948',
    orCrNumber: 'ORCR-2025-110294',
    routeAssigned: 'Fairview Center Mall ↔ Dahlia Commercial Strip',
    startingPoint: 'Fairview Center Mall',
    destination: 'Dahlia Commercial Strip',
    numberOfUnits: 1,
    vehicles: [
      {
        id: 'unit-4',
        unitType: 'Tricycle (MTOP)',
        makeBrand: 'Yamaha',
        model: 'Sight 115 Fi',
        yearModel: '2024',
        plateNumber: 'PH-99120',
        motorNumber: 'ENG-3301924',
        chassisNumber: 'CHS-99201948',
        orCrNumber: 'ORCR-2025-110294'
      }
    ],
    routeCapacityStatus: 'Within Quota',
    status: 'Pending Review',
    dateApplied: '2025-08-22',
    expiryDate: 'Dec 31, 2025',
    inspectionScore: 'Pending Evaluation',
    feeAmount: '₱1,250.00'
  },
  {
    id: 'FR-2025-005',
    mtopNo: 'MTOP-2025-0210',
    operatorName: 'Rodrigo M. Alcantara',
    dateOfBirth: '1975-04-19',
    address: '12 Quirino Highway, Barangay Novaliches Proper, Quezon City',
    contactNumber: '+63 919 777 3344',
    emailAddress: 'rodrigo.alcantara@example.com',
    governmentIdType: 'UMID Card',
    governmentIdNo: 'CRN-0033-881290-9',
    applicationType: 'Renewal',
    previousMtopNo: 'MTOP-2024-0099',
    todaOrganization: 'Novaliches Bayan TODA (NBTODA)',
    unitType: 'Tricycle (MTOP)',
    bodyNo: 'Unit #055',
    plateNumber: 'QC-44109',
    engineNo: 'ENG-4410928',
    chassisNo: 'CHS-55019283',
    orCrNumber: 'ORCR-2024-441092',
    routeAssigned: 'Novaliches Bayan Terminal ↔ Jordan Plains Phase 3',
    startingPoint: 'Novaliches Bayan Terminal',
    destination: 'Jordan Plains Phase 3',
    numberOfUnits: 1,
    vehicles: [
      {
        id: 'unit-5',
        unitType: 'Tricycle (MTOP)',
        makeBrand: 'Honda',
        model: 'TMX 125 Alpha',
        yearModel: '2023',
        plateNumber: 'QC-44109',
        motorNumber: 'ENG-4410928',
        chassisNumber: 'CHS-55019283',
        orCrNumber: 'ORCR-2024-441092'
      }
    ],
    routeCapacityStatus: 'Near Capacity',
    status: 'Renewal Required',
    dateApplied: '2025-08-18',
    expiryDate: 'Dec 31, 2025',
    inspectionScore: 'Passed Last Annual Audit (92%)',
    feeAmount: '₱1,250.00'
  },
  {
    id: 'FR-2025-006',
    mtopNo: 'MTOP-2025-2201',
    operatorName: 'Crisanto F. Dizon',
    dateOfBirth: '1986-12-05',
    address: '90 Visayas Ave., Barangay Vasra, Quezon City',
    contactNumber: '+63 921 555 7700',
    emailAddress: 'crisanto.dizon@example.com',
    governmentIdType: "Driver's License",
    governmentIdNo: 'N03-10-887766',
    applicationType: 'New',
    todaOrganization: 'Batasan Hills TODA (BHTODA)',
    unitType: 'E-Trike / Modern PUV',
    bodyNo: 'Unit #201',
    plateNumber: 'EV-88123',
    engineNo: 'ENG-E-99014',
    chassisNo: 'CHS-E-110294',
    orCrNumber: 'ORCR-2025-998811',
    routeAssigned: 'Batasan Complex ↔ San Mateo Boundary Corridor',
    startingPoint: 'Batasan Complex',
    destination: 'San Mateo Boundary Corridor',
    numberOfUnits: 1,
    vehicles: [
      {
        id: 'unit-6',
        unitType: 'E-Trike / Modern PUV',
        makeBrand: 'EcoTrike PH',
        model: 'Maxi Volt 6-Seater',
        yearModel: '2025',
        plateNumber: 'EV-88123',
        motorNumber: 'ENG-E-99014',
        chassisNumber: 'CHS-E-110294',
        orCrNumber: 'ORCR-2025-998811'
      }
    ],
    routeCapacityStatus: 'Within Quota',
    status: 'Approved & Active',
    dateApplied: '2025-08-12',
    expiryDate: 'Dec 31, 2025',
    inspectionScore: '100% - Zero Emission Certified',
    feeAmount: '₱2,500.00'
  }
];

interface FranchiseTransportPermitModuleProps {
  currentTab?: TabType | string;
  onNavigateToTab?: (tab: TabType | string) => void;
  onAddNewApplication?: (applicantName: string, permitType: string) => void;
  onNavigateToDashboard?: () => void;
}

export const FranchiseTransportPermitModule: React.FC<FranchiseTransportPermitModuleProps> = ({
  currentTab,
  onNavigateToTab,
  onAddNewApplication,
  onNavigateToDashboard
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, language } = useLanguage();
  const isAdmin = user?.role === 'admin';
  const isFranchiseReviewTab = isAdmin && (currentTab === 'Franchise Permit Review' || currentTab === 'Fleet Progress Monitoring' || currentTab === 'Franchise Fee Computation' || currentTab === 'Route & Unit Inspection Audit');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Current view controller: 'admin_reviews' | 'preview' | 'hub' | 'new_franchise_wizard' | 'renewal' | 'amendment' | 'pay_fees' | 'special_trip' | 'ctc_pulling' | 'verification' | 'safety_seal'
  const [currentView, setCurrentView] = useState<
    'admin_reviews' | 'preview' | 'hub' | 'new_franchise_wizard' | 'renewal' | 'amendment' | 'pay_fees' | 'special_trip' | 'ctc_pulling' | 'verification' | 'safety_seal'
  >(isFranchiseReviewTab ? 'admin_reviews' : 'preview');

  // Admin Review & Interactive States
  const [activeReviewItem, setActiveReviewItem] = useState<FranchiseItem | null>(null);
  const [evalTab, setEvalTab] = useState<'driver' | 'vehicle' | 'toda' | 'decal'>('driver');
  const [activeDeficiencyItem, setActiveDeficiencyItem] = useState<FranchiseItem | null>(null);
  const [deficiencyReason, setDeficiencyReason] = useState<string>('Expired LTO OR/CR or Lacking Smoke Emission Test');
  const [deficiencyNotes, setDeficiencyNotes] = useState<string>('');
  const [todaFilter, setTodaFilter] = useState<string>('All');
  const [unitFilter, setUnitFilter] = useState<string>('All');
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);
  
  // Interactive Inspection Simulator Modal State
  const [activeInspectModalItem, setActiveInspectModalItem] = useState<FranchiseItem | null>(null);
  const [inspectionChecks, setInspectionChecks] = useState<Record<string, boolean>>({
    lights: true,
    brakes: true,
    chassis: true,
    emissions: true,
    fareMatrix: true
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Franchise Registry
  const [franchises, setFranchises] = useState<FranchiseItem[]>(INITIAL_MOCK_FRANCHISES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedFranchise, setSelectedFranchise] = useState<FranchiseItem | null>(null);

  // =========================================================================
  // CARD 1: APPLICATION ONLINE STATES
  // =========================================================================
  // 1. New Application (5-Step Wizard)
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [applicantFullName, setApplicantFullName] = useState<string>(user?.name || 'Juan Dela Cruz');
  const [applicantDob, setApplicantDob] = useState<string>('1984-06-15');
  const [applicantAddress, setApplicantAddress] = useState<string>('142 Batasan Road, Barangay Batasan Hills, Quezon City');
  const [applicantContact, setApplicantContact] = useState<string>('+63 917 555 1201');
  const [applicantEmail, setApplicantEmail] = useState<string>(user?.email || 'citizen@govserve.ph');
  const [governmentIdType, setGovernmentIdType] = useState<string>("Driver's License");
  const [governmentIdNo, setGovernmentIdNo] = useState<string>('N01-08-123456');
  const [vehicleUsageType, setVehicleUsageType] = useState<'Public Utility (Pampubliko / For Hire)' | 'Private Vehicle (Pribado / Non-Commercial)'>('Public Utility (Pampubliko / For Hire)');
  const [applicationType, setApplicationType] = useState<'New' | 'Renewal'>('New');
  const [existingMtopNo, setExistingMtopNo] = useState<string>('');
  const [todaOrg, setTodaOrg] = useState<string>('Batasan Hills TODA (BHTODA)');
  const [startingPoint, setStartingPoint] = useState<string>('Batasan Complex');
  const [destination, setDestination] = useState<string>('Commonwealth Market Terminal, Quezon City');
  const [vehicles, setVehicles] = useState<VehicleUnit[]>([
    {
      id: 'unit-1',
      unitType: 'Tricycle (MTOP)',
      makeBrand: 'Honda',
      model: 'TMX 125 Alpha',
      yearModel: '2024',
      plateNumber: 'PH-48192',
      motorNumber: 'ENG-9981244',
      chassisNumber: 'CHS-88192019',
      orCrNumber: 'ORCR-2024-991204'
    }
  ]);
  const [isCertified, setIsCertified] = useState<boolean>(true);
  const [newFranchiseSubmitted, setNewFranchiseSubmitted] = useState<boolean>(false);

  // 2. Renewal State
  const [renewalMtopNo, setRenewalMtopNo] = useState<string>('MTOP-2025-0412');
  const [renewalInspectionCenter, setRenewalInspectionCenter] = useState<string>('QC Hall Central Motorpool (Elliptical Road)');
  const [renewalPreferredDate, setRenewalPreferredDate] = useState<string>('2025-09-05');
  const [renewalTimeSlot, setRenewalTimeSlot] = useState<string>('09:00 AM - 10:30 AM');
  const [renewalOrCrConfirmed, setRenewalOrCrConfirmed] = useState<boolean>(true);
  const [renewalBarangayConfirmed, setRenewalBarangayConfirmed] = useState<boolean>(true);
  const [renewalTodaConfirmed, setRenewalTodaConfirmed] = useState<boolean>(true);
  const [renewalSubmitted, setRenewalSubmitted] = useState<boolean>(false);

  // 3. Amendment State
  const [amendMtopNo, setAmendMtopNo] = useState<string>('MTOP-2025-0412');
  const [amendType, setAmendType] = useState<string>('Substitution of Vehicle Unit');
  const [amendNewMake, setAmendNewMake] = useState<string>('Yamaha Sight 115');
  const [amendNewPlate, setAmendNewPlate] = useState<string>('QC-99201');
  const [amendNewEngine, setAmendNewEngine] = useState<string>('ENG-550192');
  const [amendNewChassis, setAmendNewChassis] = useState<string>('CHS-2201948');
  const [amendNewRouteToda, setAmendNewRouteToda] = useState<string>('Batasan Hills TODA (BHTODA)');
  const [amendNewRoutePath, setAmendNewRoutePath] = useState<string>('Batasan Complex ↔ Commonwealth Market Terminal');
  const [amendNewTransfereeName, setAmendNewTransfereeName] = useState<string>('Maria Santos Dela Cruz');
  const [amendNewTransfereeContact, setAmendNewTransfereeContact] = useState<string>('0917-889-1234');
  const [amendNewTransfereeAddress, setAmendNewTransfereeAddress] = useState<string>('Brgy. Batasan Hills, Quezon City');
  const [amendReason, setAmendReason] = useState<string>('Replacement of aged unit with brand new compliant Euro-4 roadworthy unit.');
  const [amendSwornOath, setAmendSwornOath] = useState<boolean>(true);
  const [amendSubmitted, setAmendSubmitted] = useState<boolean>(false);

  // 4. Pay Franchise Fees State
  const [feeMtopNo, setFeeMtopNo] = useState<string>('MTOP-2025-0412');
  const [feePaymentMethod, setFeePaymentMethod] = useState<'gcash' | 'maya' | 'landbank' | 'card'>('gcash');
  const [feeReceipt, setFeeReceipt] = useState<any>(null);
  const [isProcessingFee, setIsProcessingFee] = useState<boolean>(false);

  // 5. Special Trip / Route Clearance
  const [specialTripData, setSpecialTripData] = useState({
    mtopNo: 'MTOP-2025-0412',
    purpose: 'Special Charter / Barangay Fiesta Transport Service',
    routeArea: 'Batasan Hills ↔ Quezon Memorial Circle / QC City Hall',
    transitStreets: 'IBP Road, Batasan-San Mateo Road, Commonwealth Service Road (Outer Lane)',
    durationDays: '3 Calendar Days',
    startDate: '2025-09-10',
    endDate: '2025-09-12',
    contactPerson: 'Juan Dela Cruz (0917-889-1234)',
    estimatedPassengers: '12 Passengers (Multiple Rotational Trips)'
  });
  const [specialTripSafetyConfirmed, setSpecialTripSafetyConfirmed] = useState<boolean>(true);
  const [specialTripNoHighwayConfirmed, setSpecialTripNoHighwayConfirmed] = useState<boolean>(true);
  const [specialTripSubmitted, setSpecialTripSubmitted] = useState<boolean>(false);

  // Status Search State
  const [statusSearchCode, setStatusSearchCode] = useState<string>('');
  const [statusSearchResult, setStatusSearchResult] = useState<any>(null);

  // Request for E-Copy State
  const [ecopyModalOpen, setEcopyModalOpen] = useState<boolean>(false);
  const [ecopyMtopNo, setEcopyMtopNo] = useState<string>('MTOP-2025-0412');
  const [ecopyGenerated, setEcopyGenerated] = useState<boolean>(false);

  // =========================================================================
  // CARD 2: TRANSPORT INFORMATION SYSTEM (CTC PULLING) STATES
  // =========================================================================
  const [ctcStep, setCtcStep] = useState<number>(1);
  const [ctcMtopNo, setCtcMtopNo] = useState<string>('MTOP-2025-0412');
  const [ctcOperatorName, setCtcOperatorName] = useState<string>(user?.name || 'Juan Dela Cruz');
  const [ctcSelectedDocs, setCtcSelectedDocs] = useState<string[]>([
    'Certified True Copy of MTOP Franchise Certificate (Current Year)',
    'Official TODA Route Endorsement & Authorization Certificate'
  ]);
  const [ctcPaid, setCtcPaid] = useState<boolean>(false);
  const [ctcIsProcessingPayment, setCtcIsProcessingPayment] = useState<boolean>(false);

  // =========================================================================
  // CARD 3: FRANCHISE VERIFICATION STATES
  // =========================================================================
  const [verifQuery, setVerifQuery] = useState<string>('MTOP-2025-0412');
  const [verifResult, setVerifResult] = useState<any>({
    mtopNo: 'MTOP-2025-0412',
    operatorName: 'Juan Dela Cruz',
    toda: 'Batasan Hills TODA (BHTODA)',
    unitType: 'Tricycle (MTOP)',
    plateNumber: 'PH-48192',
    bodyNo: 'Unit #088',
    route: 'Batasan Complex ↔ Commonwealth Market Terminal, Quezon City',
    status: 'ACTIVE & OFFICIALLY ISSUED',
    validUntil: 'December 31, 2025',
    inspectionStatus: 'COMPLIANT & ROADWORTHY (INSP-2025-0912)',
    qrHash: 'sha256-mtop-88192019a7f92e3184bc'
  });
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // =========================================================================
  // CARD 4: TRANSPORT SAFETY SEAL STATES
  // =========================================================================
  const [sealMtopNo, setSealMtopNo] = useState<string>('MTOP-2025-0412');
  const [sealSubmitted, setSealSubmitted] = useState<boolean>(false);

  // Download Franchise Certificate
  const handleDownloadPermitFile = (f: FranchiseItem) => {
    const content = `========================================================================================
REPUBLIC OF THE PHILIPPINES • CITY GOVERNMENT OF QUEZON CITY
MUNICIPAL TRANSPORT & FRANCHISING REGULATORY BOARD (MTFRB)
========================================================================================
OFFICIAL MOTORIZED TRICYCLE OPERATOR'S PERMIT (MTOP) & FRANCHISE CERTIFICATE

FRANCHISE GRANT NO       : ${f.mtopNo}
REGISTRATION RECORD ID   : ${f.id}
APPLICATION TYPE         : ${f.applicationType.toUpperCase()} FRANCHISE GRANT
----------------------------------------------------------------------------------------
GRANTEE / OPERATOR DETAILS:
Registered Operator Name : ${f.operatorName}
Residential Address      : ${f.address}
Contact Mobile Number    : ${f.contactNumber}
Email Address            : ${f.emailAddress}
Government ID Reference  : ${f.governmentIdType} (${f.governmentIdNo})
----------------------------------------------------------------------------------------
TRANSPORT UNIT & COOPERATIVE ASSIGNMENT:
Transport Cooperative    : ${f.todaOrganization}
Vehicle Classification   : ${f.unitType}
Body / Franchise Unit No : ${f.bodyNo}
Official Plate Number    : ${f.plateNumber}
Engine / Motor Serial    : ${f.engineNo}
Chassis Number           : ${f.chassisNo}
LTO Certificate of Reg.  : ${f.orCrNumber}
Designated Route Zone    : ${f.routeAssigned}
Total Authorized Fleet   : ${f.numberOfUnits} Unit(s)
----------------------------------------------------------------------------------------
ROADWORTHINESS & REGULATORY AUDIT:
Road Safety Inspection   : ${f.inspectionScore || '100% ROADWORTHY - PASSED PHYSICAL SAFETY TEST'}
Route Quota Status       : ${f.routeCapacityStatus}
Annual Regulatory Fee    : ${f.feeAmount} (PAID IN FULL - VALIDATED)
Official Validity Term   : ${f.dateApplied} UNTIL ${f.expiryDate}
----------------------------------------------------------------------------------------
AUTHORIZATION & LEGAL ATTESTATION:
Permission is hereby granted to operate public utility tricycle service along the authorized route,
subject strictly to municipal speed limits, passenger safety ordinances, and TODA fare matrices.

Chairman, Municipal Franchising Board : ATTY. GABRIEL R. ALFONSO
Head, Transport & Traffic Management   : ENGR. VICENTE P. MENDOZA
Digital Security Cryptographic Hash    : SHA256-MTOP-${f.id}-OFFICIALLY-SEALED
========================================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Official_Franchise_Grant_${f.mtopNo}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded Official Franchise Certificate for ${f.mtopNo}`);
  };

  const filteredFranchises = franchises.filter(f => {
    const matchesSearch = 
      f.mtopNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.operatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.todaOrganization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.bodyNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center space-x-2.5 animate-bounce">
          <Sparkles size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. STANDALONE TOP HEADER BAR (Hidden in Admin Mode) */}
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
                  Franchise, Transport & MTOP Licensing Hub
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

              {/* Dark/Light Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title={theme === 'dark' ? t('theme_light', 'Switch to Light Mode') : t('theme_dark', 'Switch to Dark Mode')}
              >
                {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
              </button>

              {/* Citizen Profile Dropdown */}
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
                      {user?.citizenId && (
                        <div className="mt-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                          ID: {user.citizenId}
                        </div>
                      )}
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
      <section className="w-full bg-white dark:bg-gradient-to-r dark:from-[#071326] dark:via-[#0E2744] dark:to-[#0A1A2F] text-slate-900 dark:text-white py-7 sm:py-9 px-4 sm:px-8 border-b border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors">
        <div className="hidden dark:block absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="hidden dark:block absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-3">
          {currentView !== 'preview' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentView('preview')}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <ArrowLeft size={13} />
                <span>Return to Franchise Overview</span>
              </button>
            </div>
          )}

          <div className="space-y-2 max-w-4xl">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              {isAdmin && currentView === 'admin_reviews'
                ? 'Franchise Permit Review & Fleet Dispatch Workspace'
                : 'Franchise & Transportation Portal'}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {isAdmin && currentView === 'admin_reviews'
                ? 'Review MTOP applications, evaluate driver credentials, verify LTO OR/CR documents, check TODA route quotas, and issue certified digital QR decals.'
                : 'Review the official regulatory fee schedule, requirements, and legal bases before proceeding to file your Motorized Tricycle Operator Permit (MTOP) or franchise transactions.'}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAIN BODY CONTAINER */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-9">

        {/* ========================================================================= */}
        {/* SUBVIEW 0: ADMIN FRANCHISE PERMIT REVIEW & FLEET DISPATCH CONSOLE */}
        {/* ========================================================================= */}
        {isAdmin && currentView === 'admin_reviews' && (
          <div className="space-y-6 animate-in fade-in pb-10">
            
            {/* 1. EXECUTIVE ANALYTICS CARDS (Interactive Click-to-Filter) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Metric 1: Total Fleet */}
              <div 
                onClick={() => setStatusFilter('All')}
                className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group shadow-xs ${
                  statusFilter === 'All'
                    ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700 shadow-md ring-2 ring-slate-400/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-black uppercase tracking-wider ${statusFilter === 'All' ? 'text-slate-300' : 'text-slate-500'}`}>
                    Total Registered Fleet
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold">
                    <Bus size={16} />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-3xl font-black font-mono">1,280</span>
                  <span className="text-xs font-bold text-emerald-500">Units</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    <span>98.4% City Compliance</span>
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">+14 this month</span>
                </div>
              </div>

              {/* Metric 2: Pending TRB Review */}
              <div 
                onClick={() => setStatusFilter('Pending Review')}
                className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group shadow-xs ${
                  statusFilter === 'Pending Review'
                    ? 'bg-gradient-to-br from-amber-950/80 to-slate-900 text-white border-amber-500/50 shadow-md ring-2 ring-amber-500/40'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Pending TRB Review
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center font-bold relative">
                    <Clock size={16} />
                    {franchises.filter(f => f.status === 'Pending Review').length > 0 && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
                    )}
                  </div>
                </div>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-3xl font-black font-mono text-amber-600 dark:text-amber-400">
                    {franchises.filter(f => f.status === 'Pending Review').length}
                  </span>
                  <span className="text-xs font-bold text-amber-500">In Docket</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-amber-500 font-bold">Awaiting Credentials Audit</span>
                  <span className="text-slate-400 text-[10px]">Action Required</span>
                </div>
              </div>

              {/* Metric 3: Road & Smoke Test */}
              <div 
                onClick={() => setStatusFilter('For Unit Inspection')}
                className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group shadow-xs ${
                  statusFilter === 'For Unit Inspection'
                    ? 'bg-gradient-to-br from-sky-950/80 to-slate-900 text-white border-sky-500/50 shadow-md ring-2 ring-sky-500/40'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    Road & Smoke Audit
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 flex items-center justify-center font-bold">
                    <Truck size={16} />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-3xl font-black font-mono text-sky-600 dark:text-sky-400">
                    {franchises.filter(f => f.status === 'For Unit Inspection').length}
                  </span>
                  <span className="text-xs font-bold text-sky-500">Queued</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-sky-500 font-bold">Motorpool Field Lane</span>
                  <span className="text-slate-400 text-[10px]">Physical Test</span>
                </div>
              </div>

              {/* Metric 4: Active & Cleared */}
              <div 
                onClick={() => setStatusFilter('Approved & Active')}
                className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group shadow-xs ${
                  statusFilter === 'Approved & Active'
                    ? 'bg-gradient-to-br from-emerald-950/80 to-slate-900 text-white border-emerald-500/50 shadow-md ring-2 ring-emerald-500/40'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Active & QR Decaled
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center font-bold">
                    <ShieldCheck size={16} />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {franchises.filter(f => f.status === 'Approved & Active').length}
                  </span>
                  <span className="text-xs font-bold text-emerald-500">Active</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-emerald-500 font-bold">Windshield Decal Issued</span>
                  <span className="text-slate-400 text-[10px]">LGU Verified</span>
                </div>
              </div>

            </div>

            {/* 2. TODA CORRIDOR CAPACITY & SECTORAL QUOTA MONITOR STRIP */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      TODA Sectoral Route Capacity & Fleet Allocation
                    </h3>
                    <p className="text-[11px] text-slate-500">Live regulatory slot capacity per authorized franchise zone in Quezon City</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>City Overall: 91.8% Allocated</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {[
                  { name: 'Batasan Hills TODA (BHTODA)', allocated: 94, max: 100, status: 'Near Capacity', color: 'emerald' },
                  { name: 'Commonwealth TODA (COMTODA)', allocated: 132, max: 150, status: 'Within Quota', color: 'emerald' },
                  { name: 'Fairview TODA (FTODA)', allocated: 76, max: 100, status: 'Within Quota', color: 'emerald' },
                  { name: 'Novaliches Bayan (NBTODA)', allocated: 110, max: 120, status: 'Near Capacity', color: 'amber' },
                ].map((toda, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white truncate max-w-[140px]">{toda.name}</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-[11px]">{toda.allocated}/{toda.max}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${toda.color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${(toda.allocated / toda.max) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{toda.max - toda.allocated} slots available</span>
                      <span className={`font-bold ${toda.color === 'amber' ? 'text-amber-600' : 'text-emerald-600'}`}>{toda.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. COMMAND & ACTION TOOLBAR */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by MTOP Reference, Operator Name, TODA Org, Plate, or Engine No..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                {/* Filters and Command Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={todaFilter}
                    onChange={(e) => setTodaFilter(e.target.value)}
                    className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <option value="All">All TODAs</option>
                    <option value="Batasan Hills">Batasan Hills TODA</option>
                    <option value="Commonwealth">Commonwealth TODA</option>
                    <option value="Fairview">Fairview TODA</option>
                    <option value="Novaliches">Novaliches TODA</option>
                  </select>

                  <select
                    value={unitFilter}
                    onChange={(e) => setUnitFilter(e.target.value)}
                    className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <option value="All">All Unit Types</option>
                    <option value="Tricycle (MTOP)">Tricycle (MTOP)</option>
                    <option value="E-Trike / Modern PUV">E-Trike / Modern PUV</option>
                    <option value="Jeepney (PUJ)">Jeepney (PUJ)</option>
                  </select>

                  {/* Simulate Inflow Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const newId = `FR-2025-${Math.floor(1000 + Math.random() * 9000)}`;
                      const newMtop = `MTOP-2025-${Math.floor(3000 + Math.random() * 6000)}`;
                      const newFr: FranchiseItem = {
                        id: newId,
                        mtopNo: newMtop,
                        operatorName: 'Arnel G. Villanueva',
                        dateOfBirth: '1985-09-12',
                        address: '77 Commonwealth Ave, QC',
                        contactNumber: '+63 917 888 2211',
                        emailAddress: 'arnel.v@example.com',
                        governmentIdType: "Driver's License",
                        governmentIdNo: 'N01-09-998811',
                        applicationType: 'New',
                        todaOrganization: 'Commonwealth TODA (COMTODA)',
                        unitType: 'Tricycle (MTOP)',
                        bodyNo: `Unit #${Math.floor(100 + Math.random() * 200)}`,
                        plateNumber: `QC-${Math.floor(10000 + Math.random() * 90000)}`,
                        engineNo: `ENG-${Math.floor(100000 + Math.random() * 900000)}`,
                        chassisNo: `CHS-${Math.floor(100000 + Math.random() * 900000)}`,
                        orCrNumber: `ORCR-2025-${Math.floor(100000 + Math.random() * 900000)}`,
                        routeAssigned: 'Commonwealth Market ↔ Litex Terminal, QC',
                        startingPoint: 'Commonwealth Market',
                        destination: 'Litex Terminal',
                        numberOfUnits: 1,
                        vehicles: [{
                          id: `unit-${Math.random()}`,
                          unitType: 'Tricycle (MTOP)',
                          makeBrand: 'Honda',
                          model: 'TMX 125 Alpha',
                          yearModel: '2024',
                          plateNumber: `QC-${Math.floor(10000 + Math.random() * 90000)}`,
                          motorNumber: `ENG-${Math.floor(100000 + Math.random() * 900000)}`,
                          chassisNumber: `CHS-${Math.floor(100000 + Math.random() * 900000)}`,
                          orCrNumber: `ORCR-2025-${Math.floor(100000 + Math.random() * 900000)}`
                        }],
                        routeCapacityStatus: 'Within Quota',
                        status: 'Pending Review',
                        dateApplied: new Date().toISOString().split('T')[0],
                        expiryDate: 'Dec 31, 2025',
                        inspectionScore: 'Pending Road Audit',
                        feeAmount: '₱1,250.00'
                      };
                      setFranchises(prev => [newFr, ...prev]);
                      showToast(`⚡ Real-time Inflow: New MTOP Application ${newMtop} filed by ${newFr.operatorName}!`);
                    }}
                    className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                    title="Simulate incoming citizen MTOP application"
                  >
                    <Sparkles size={13} className="text-amber-500" />
                    <span className="hidden sm:inline">Simulate Inflow</span>
                  </button>

                  {/* Export CSV Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const csvHeader = "MTOP No,Operator Name,TODA Organization,Plate Number,Unit Type,Status,Date Applied\n";
                      const csvRows = franchises.map(f => `"${f.mtopNo}","${f.operatorName}","${f.todaOrganization}","${f.plateNumber}","${f.unitType}","${f.status}","${f.dateApplied}"`).join("\n");
                      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `TRB_Franchise_Masterlist_${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                      window.URL.revokeObjectURL(url);
                      showToast('📄 Exported TRB Franchise Masterlist CSV successfully!');
                    }}
                    className="px-3.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    <Download size={13} />
                    <span>Export Masterlist</span>
                  </button>
                </div>
              </div>

              {/* Status Filter Tabs with dynamic counter badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {[
                    { id: 'All', label: 'All Records', count: franchises.length },
                    { id: 'Pending Review', label: 'Pending Review', count: franchises.filter(f => f.status === 'Pending Review').length, alert: true },
                    { id: 'For Unit Inspection', label: 'For Road Inspection', count: franchises.filter(f => f.status === 'For Unit Inspection').length },
                    { id: 'Approved & Active', label: 'Approved & Active', count: franchises.filter(f => f.status === 'Approved & Active').length },
                    { id: 'Renewal Required', label: 'Renewal Due', count: franchises.filter(f => f.status === 'Renewal Required').length },
                    { id: 'Rejected', label: 'Rejected', count: franchises.filter(f => f.status === 'Rejected').length }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setStatusFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                        statusFilter === tab.id
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        statusFilter === tab.id
                          ? 'bg-white/20 text-white'
                          : tab.alert && tab.count > 0
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Batch Action Indicators */}
                {selectedBatchIds.length > 0 && (
                  <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-300">
                    <span className="font-bold">{selectedBatchIds.length} items selected</span>
                    <button
                      onClick={() => {
                        setFranchises(prev => prev.map(f => selectedBatchIds.includes(f.id) ? { ...f, status: 'Approved & Active' } : f));
                        showToast(`✅ Batch approved ${selectedBatchIds.length} franchises!`);
                        setSelectedBatchIds([]);
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                    >
                      Batch Approve
                    </button>
                    <button
                      onClick={() => setSelectedBatchIds([])}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 4. HIGH-PERFORMANCE DATA TABLE */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3.5 w-10">
                        <input
                          type="checkbox"
                          checked={selectedBatchIds.length > 0 && selectedBatchIds.length === franchises.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBatchIds(franchises.map(f => f.id));
                            } else {
                              setSelectedBatchIds([]);
                            }
                          }}
                          className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </th>
                      <th className="px-4 py-3.5">MTOP Reference</th>
                      <th className="px-4 py-3.5">Operator & Contact</th>
                      <th className="px-4 py-3.5">TODA Org & Route</th>
                      <th className="px-4 py-3.5">Vehicle Specs</th>
                      <th className="px-4 py-3.5">Quota Standing</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                    {franchises
                      .filter(f => {
                        const matchesSearch =
                          f.mtopNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.operatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.todaOrganization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.engineNo.toLowerCase().includes(searchQuery.toLowerCase());
                        const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
                        const matchesToda = todaFilter === 'All' || f.todaOrganization.toLowerCase().includes(todaFilter.toLowerCase());
                        const matchesUnit = unitFilter === 'All' || f.unitType === unitFilter;
                        return matchesSearch && matchesStatus && matchesToda && matchesUnit;
                      })
                      .map((item) => (
                        <tr 
                          key={item.id} 
                          className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                            selectedBatchIds.includes(item.id) ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                          }`}
                        >
                          
                          {/* Checkbox Column */}
                          <td className="px-4 py-3.5">
                            <input
                              type="checkbox"
                              checked={selectedBatchIds.includes(item.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedBatchIds(prev => [...prev, item.id]);
                                } else {
                                  setSelectedBatchIds(prev => prev.filter(id => id !== item.id));
                                }
                              }}
                              className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                          </td>

                          {/* Column 1: MTOP No. */}
                          <td className="px-4 py-3.5">
                            <div className="space-y-0.5">
                              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 block text-xs">
                                {item.mtopNo}
                              </span>
                              <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                                <span className="font-mono">{item.id}</span>
                                <span>•</span>
                                <span>{item.dateApplied}</span>
                              </div>
                            </div>
                          </td>

                          {/* Column 2: Operator Name & Avatar */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 text-slate-800 dark:text-slate-100 font-bold flex items-center justify-center text-xs flex-shrink-0">
                                {item.operatorName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                              </div>
                              <div>
                                <div className="flex items-center space-x-1.5">
                                  <p className="font-bold text-slate-900 dark:text-white leading-snug">{item.operatorName}</p>
                                  <span className="text-[10px] text-emerald-600" title="Driver's License Verified">✓</span>
                                </div>
                                <p className="text-[11px] text-slate-500">{item.contactNumber}</p>
                              </div>
                            </div>
                          </td>

                          {/* Column 3: TODA & Route */}
                          <td className="px-4 py-3.5">
                            <div className="space-y-1">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                                {item.todaOrganization}
                              </span>
                              <p className="text-[10px] text-slate-500 truncate max-w-[200px]" title={item.routeAssigned}>
                                {item.routeAssigned}
                              </p>
                            </div>
                          </td>

                          {/* Column 4: Vehicle Specs */}
                          <td className="px-4 py-3.5">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1.5">
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-white text-[11px]">
                                  {item.plateNumber}
                                </span>
                                <span className="text-[11px] text-slate-500 font-semibold">{item.bodyNo}</span>
                                {item.unitType.includes('E-Trike') && (
                                  <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-white text-[9px] font-black flex items-center gap-0.5">
                                    <Zap size={8} /> EV
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 font-mono">
                                Engine: {item.engineNo}
                              </p>
                            </div>
                          </td>

                          {/* Column 5: Quota Standing */}
                          <td className="px-4 py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                              item.routeCapacityStatus === 'Within Quota'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-500/20'
                                : item.routeCapacityStatus === 'Near Capacity'
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-500/20'
                                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-500/20'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                item.routeCapacityStatus === 'Within Quota' ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}></span>
                              <span>{item.routeCapacityStatus}</span>
                            </span>
                          </td>

                          {/* Column 6: Status */}
                          <td className="px-4 py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide inline-flex items-center gap-1.5 ${
                              item.status === 'Approved & Active'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : item.status === 'Pending Review'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : item.status === 'For Unit Inspection'
                                ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                item.status === 'Approved & Active' ? 'bg-emerald-500' :
                                item.status === 'Pending Review' ? 'bg-amber-500' :
                                item.status === 'For Unit Inspection' ? 'bg-sky-500' : 'bg-rose-500'
                              }`} />
                              <span>{item.status}</span>
                            </span>
                          </td>

                          {/* Column 7: Actions */}
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              
                              {/* Comprehensive Evaluation Button */}
                              <button
                                onClick={() => {
                                  setActiveReviewItem(item);
                                  setEvalTab('driver');
                                }}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                                title="Evaluate Application Dossier"
                              >
                                <Eye size={13} />
                                <span>Evaluate</span>
                              </button>

                              {/* Road Test Simulator Button */}
                              <button
                                onClick={() => {
                                  setActiveInspectModalItem(item);
                                  setInspectionChecks({
                                    lights: true,
                                    brakes: true,
                                    chassis: true,
                                    emissions: true,
                                    fareMatrix: true
                                  });
                                }}
                                className="p-1.5 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-sky-600 dark:text-sky-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
                                title="Roadworthiness & Smoke Emission Audit"
                              >
                                <Truck size={13} />
                              </button>

                              {item.status === 'Pending Review' && (
                                <>
                                  <button
                                    onClick={() => {
                                      setFranchises(prev => prev.map(f => f.id === item.id ? { ...f, status: 'Approved & Active' } : f));
                                      showToast(`✅ Approved MTOP ${item.mtopNo}! Digital QR Decal released.`);
                                    }}
                                    className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                                    title="Fast Approve Franchise"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => setActiveDeficiencyItem(item)}
                                    className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-600 rounded-xl text-xs font-bold cursor-pointer"
                                    title="Issue Deficiency Notice"
                                  >
                                    <X size={13} />
                                  </button>
                                </>
                              )}

                              {item.status === 'For Unit Inspection' && (
                                <button
                                  onClick={() => {
                                    setFranchises(prev => prev.map(f => f.id === item.id ? { ...f, status: 'Approved & Active', inspectionScore: 'Passed (98%)' } : f));
                                    showToast(`🛺 Unit passed roadworthiness audit! MTOP ${item.mtopNo} certified.`);
                                  }}
                                  className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                                >
                                  Certify
                                </button>
                              )}
                            </div>
                          </td>

                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* PREVIEW PAGE: OFFICIAL FEE SCHEDULE & OPERATOR TARIFF GUIDE */}
        {/* ========================================================================= */}
        {(currentView === 'preview' || (!isAdmin && currentView === 'admin_reviews')) && (
          <div className="space-y-10 animate-in fade-in pb-10">
            


            {/* ========================================================================= */}
            {/* TOP GATEWAY ACTION CTA */}
            {/* ========================================================================= */}
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-black">
                  Ready to Start Your Franchise Application?
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                  Proceed to file a new MTOP franchise, renew your motorized tricycle license, or submit vehicle unit amendment & substitution filings.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setWizardStep(1);
                    setNewFranchiseSubmitted(false);
                    setApplicationType('New');
                    setCurrentView('new_franchise_wizard');
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
            <div className="relative rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-white via-sky-50/70 to-blue-50/50 dark:from-slate-900 dark:via-[#10243e] dark:to-slate-950 border border-sky-200 dark:border-sky-500/30 text-slate-900 dark:text-white shadow-xl shadow-sky-900/5 dark:shadow-sky-950/40 overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-sky-500/25 transition-all duration-700" />
              <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center space-x-3">
                    <span className="px-3.5 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-sky-100 dark:bg-sky-500/20 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-400/30">
                      Public Transport & Fleet
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                      Franchise & Transport Permit
                    </h2>
                  </div>

                  {/* 5 Feature Rows with Circular Badges matching Picture 3 */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-white/10">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0288d1] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <Users size={16} />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 dark:text-white block">Target Users</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Tricycle MTOP operators, TODA cooperative members, and PUV drivers</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0288d1] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <Bus size={16} />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 dark:text-white block">Service Method</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Online application through GovServe</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0288d1] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <Clock size={16} />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 dark:text-white block">Time Period</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">2 to 3 days upon TODA route verification & roadworthiness audit</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0288d1] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <Banknote size={16} />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 dark:text-white block">Charges & Payment</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">₱1,350.00 Base Franchise Regulatory Tariff + TODA clearance</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0288d1] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <CreditCard size={16} />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 dark:text-white block">Payment Method</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Via GovServe online portal</span>
                      </div>
                    </div>
                  </div>

                  {/* Document Photo Upload Callout */}
                  <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-white/10 border border-slate-200 dark:border-white/15 space-y-2 shadow-xs dark:shadow-none">
                    <div className="flex items-center space-x-2 text-sky-700 dark:text-sky-300 text-xs font-bold">
                      <Camera size={15} className="text-sky-400" />
                      <span>LTO Documents & Vehicle Photo Upload Active</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      Upload clear photos or scans of your LTO OR/CR, Professional Driver's License, TODA endorsement, and unit inspection pictures.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                        <FileText size={10} className="text-sky-600 dark:text-sky-300" /> LTO OR / CR
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                        <FileText size={10} className="text-sky-600 dark:text-sky-300" /> Driver's License
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                        <FileText size={10} className="text-sky-600 dark:text-sky-300" /> TODA Endorsement
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                        <FileText size={10} className="text-sky-600 dark:text-sky-300" /> Unit Vehicle Photo
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Controls matching Picture 3 */}
                <div className="w-full lg:w-80 flex flex-col space-y-3 flex-shrink-0">
                  <button
                    onClick={() => {
                      setWizardStep(1);
                      setNewFranchiseSubmitted(false);
                      setApplicationType('New');
                      setCurrentView('new_franchise_wizard');
                    }}
                    className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5 cursor-pointer group/btn"
                  >
                    <span>Apply for MTOP Franchise →</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setRenewalSubmitted(false);
                        setCurrentView('renewal');
                      }}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-950 border border-slate-300/80 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200 dark:hover:text-white dark:border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs dark:shadow-none"
                    >
                      <RefreshCw size={13} />
                      <span>Annual Renewal</span>
                    </button>

                    <button
                      onClick={() => {
                        showToast('Viewing Franchise Requirements & TODA Regulations');
                      }}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-950 border border-slate-300/80 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200 dark:hover:text-white dark:border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs dark:shadow-none"
                    >
                      <FileCheck size={13} />
                      <span>View Requirements</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Interactive Service Category Cards (Expanded Horizontal Cards matching Picture 1) */}
            <div className="space-y-6">
              
              {/* Card 1: Annual Franchise Renewal */}
              <div className="relative rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-white via-emerald-50/70 to-teal-50/50 dark:from-slate-900 dark:via-[#06241a] dark:to-slate-950 border border-emerald-200 dark:border-emerald-500/30 text-slate-900 dark:text-white shadow-xl shadow-emerald-900/5 dark:shadow-emerald-950/40 overflow-hidden group">
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all"></div>
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                  <div className="space-y-4 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-400/30 text-emerald-800 dark:text-emerald-300 text-[11px] font-black uppercase tracking-wider">
                        Fast-Track Franchise Renewal
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent text-[10px] font-bold">
                        ● Annual Compliance
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Annual Franchise Renewal
                      </h2>
                    </div>

                    {/* 5 Feature Rows with Circular Badges */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-white/10">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Users size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Target Users</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Registered tricycle operators, TODA member franchises with active MTOP numbers</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <RefreshCw size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Service Method</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Online application through GovServe</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Clock size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Time Period</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">1 to 2 business days upon TODA validation & record audit</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Banknote size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Charges & Payment</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">₱1,250.00 Annual MTOP Renewal Regulatory Tariff</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <CreditCard size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Payment Method</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Via GovServe online portal</span>
                        </div>
                      </div>
                    </div>

                    {/* Document Photo Upload Callout */}
                    <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-white/10 border border-slate-200 dark:border-white/15 space-y-2 shadow-xs dark:shadow-none">
                      <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                        <Camera size={15} className="text-emerald-400" />
                        <span>Renewal Documents & QR Sticker Verification Active</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        Upload updated LTO OR/CR, updated Barangay Clearance, TODA validation receipt, and previous MTOP certificate.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-emerald-600 dark:text-emerald-300" /> LTO OR / CR
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-emerald-600 dark:text-emerald-300" /> TODA Receipt
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-emerald-600 dark:text-emerald-300" /> Barangay Clearance
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-emerald-600 dark:text-emerald-300" /> Old MTOP Decal
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Controls matching Picture 1 */}
                  <div className="w-full lg:w-80 flex flex-col space-y-3 flex-shrink-0">
                    <button
                      onClick={() => {
                        setRenewalSubmitted(false);
                        setCurrentView('renewal');
                      }}
                      className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5 cursor-pointer group/btn"
                    >
                      <span>Renew MTOP Franchise →</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="py-2.5 px-3 rounded-xl bg-white/90 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-center flex flex-col justify-center shadow-xs dark:shadow-none">
                        <span className="text-[10px] uppercase text-emerald-700 dark:text-emerald-300 font-extrabold">Total Assessment</span>
                        <span className="text-slate-900 dark:text-white font-black font-mono">₱1,250.00</span>
                      </div>

                      <button
                        onClick={() => {
                          showToast('Viewing MTOP Renewal Requirements');
                        }}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-950 border border-slate-300/80 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200 dark:hover:text-white dark:border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs dark:shadow-none"
                      >
                        <FileCheck size={13} />
                        <span>View Requirements</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Amendment & Substitution */}
              <div className="relative rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-white via-purple-50/70 to-fuchsia-50/50 dark:from-slate-900 dark:via-[#1e0a2e] dark:to-slate-950 border border-purple-200 dark:border-purple-500/30 text-slate-900 dark:text-white shadow-xl shadow-purple-900/5 dark:shadow-purple-950/40 overflow-hidden group">
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/15 transition-all"></div>
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                  <div className="space-y-4 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-400/30 text-purple-800 dark:text-purple-300 text-[11px] font-black uppercase tracking-wider">
                        Unit & Route Modification
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent text-[10px] font-bold">
                        ● Legal Amendment
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Amendment & Substitution
                      </h2>
                    </div>

                    {/* 5 Feature Rows with Circular Badges */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-white/10">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Users size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Target Users</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Franchise holders changing motor unit, engine, plate number, or transfer of ownership</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <FileText size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Service Method</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Online application through GovServe</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Clock size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Time Period</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">2 to 3 days upon Legal Office & Traffic Board review</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Banknote size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Charges & Payment</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">₱900.00 Legal Tariff & Motorized Substitution Fee</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <CreditCard size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Payment Method</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Via GovServe online portal</span>
                        </div>
                      </div>
                    </div>

                    {/* Document Photo Upload Callout */}
                    <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-white/10 border border-slate-200 dark:border-white/15 space-y-2 shadow-xs dark:shadow-none">
                      <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-300 text-xs font-bold">
                        <Camera size={15} className="text-purple-400" />
                        <span>Legal Deeds & Vehicle Inspection Documents Active</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        Upload notarized Deed of Sale, new engine LTO certificate, physical motor inspection photos, and TODA concurrence.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-purple-600 dark:text-purple-300" /> Deed of Sale
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-purple-600 dark:text-purple-300" /> New Engine LTO
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-purple-600 dark:text-purple-300" /> Motor Inspection
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-purple-600 dark:text-purple-300" /> TODA Endorsement
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Controls matching Picture 1 */}
                  <div className="w-full lg:w-80 flex flex-col space-y-3 flex-shrink-0">
                    <button
                      onClick={() => {
                        setAmendSubmitted(false);
                        setCurrentView('amendment');
                      }}
                      className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5 cursor-pointer group/btn"
                    >
                      <span>File Unit Substitution →</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="py-2.5 px-3 rounded-xl bg-white/90 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-center flex flex-col justify-center shadow-xs dark:shadow-none">
                        <span className="text-[10px] uppercase text-purple-700 dark:text-purple-300 font-extrabold">Legal Tariff</span>
                        <span className="text-slate-900 dark:text-white font-black font-mono">₱900.00</span>
                      </div>

                      <button
                        onClick={() => {
                          showToast('Viewing Amendment & Substitution Requirements');
                        }}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-950 border border-slate-300/80 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200 dark:hover:text-white dark:border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs dark:shadow-none"
                      >
                        <FileCheck size={13} />
                        <span>View Requirements</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Special Trip Clearance */}
              <div className="relative rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-white via-amber-50/70 to-orange-50/50 dark:from-slate-900 dark:via-[#1c1303] dark:to-slate-950 border border-amber-200 dark:border-amber-500/30 text-slate-900 dark:text-white shadow-xl shadow-amber-900/5 dark:shadow-amber-950/40 overflow-hidden group">
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/15 transition-all"></div>
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                  <div className="space-y-4 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-400/30 text-amber-800 dark:text-amber-300 text-[11px] font-black uppercase tracking-wider">
                        Temporary Route Pass
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent text-[10px] font-bold">
                        ● Special Clearance
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Special Trip Clearance
                      </h2>
                    </div>

                    {/* 5 Feature Rows with Circular Badges */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-white/10">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Users size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Target Users</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Operators and groups requesting temporary out-of-zone transit clearance</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <MapPin size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Service Method</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Online application through GovServe</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Clock size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Time Period</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Same-day or within 24 hours approval</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Banknote size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Charges & Payment</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">₱350.00 Standard Pass Fee</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <CreditCard size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Payment Method</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Via GovServe online portal</span>
                        </div>
                      </div>
                    </div>

                    {/* Document Photo Upload Callout */}
                    <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-white/10 border border-slate-200 dark:border-white/15 space-y-2 shadow-xs dark:shadow-none">
                      <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-300 text-xs font-bold">
                        <Camera size={15} className="text-amber-400" />
                        <span>Route Itinerary & Special Transit Pass Active</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        Upload special trip destination itinerary, driver identification, passenger manifest, and dispatch clearance.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-amber-600 dark:text-amber-300" /> Trip Itinerary
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-amber-600 dark:text-amber-300" /> Passenger Manifest
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-amber-600 dark:text-amber-300" /> Driver ID
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-amber-600 dark:text-amber-300" /> Dispatch Slip
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Controls matching Picture 1 */}
                  <div className="w-full lg:w-80 flex flex-col space-y-3 flex-shrink-0">
                    <button
                      onClick={() => {
                        setSpecialTripSubmitted(false);
                        setCurrentView('special_trip');
                      }}
                      className="w-full py-4 px-6 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-amber-600/30 hover:shadow-amber-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5 cursor-pointer group/btn"
                    >
                      <span>Request Special Trip Pass →</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="py-2.5 px-3 rounded-xl bg-white/90 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-center flex flex-col justify-center shadow-xs dark:shadow-none">
                        <span className="text-[10px] uppercase text-amber-700 dark:text-amber-300 font-extrabold">Standard Pass</span>
                        <span className="text-slate-900 dark:text-white font-black font-mono">₱350.00</span>
                      </div>

                      <button
                        onClick={() => {
                          showToast('Viewing Special Trip Guidelines');
                        }}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-950 border border-slate-300/80 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200 dark:hover:text-white dark:border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs dark:shadow-none"
                      >
                        <FileCheck size={13} />
                        <span>View Guidelines</span>
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
                  <ShieldCheck className="text-emerald-500" size={20} />
                  <span>Mandatory Documentary Checklist Before Transport Franchise Filing</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Prepare official LTO vehicle registration, operator credentials, and TODA endorsements before initiating your application
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">LTO Official Receipt & CR</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Original and Certified True Copy of active LTO Official Receipt (OR) and Certificate of Registration (CR) under applicant's name.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">TODA Route Endorsement</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Certificate of Active Membership and authorized Body Number Allocation from accredited TODA Federation / Route Association.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Professional Driver's License</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Valid Professional Driver's License with authorized vehicle restriction codes and Government-issued ID of registered operator.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Roadworthiness & Emission</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Passed Motor Vehicle Inspection System (MVIS) roadworthiness clearance and QC EPWMD Anti-Smoke Belching emission certificate.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 1: NEW FRANCHISE (UPLOAD-FIRST WIZARD) */}
        {/* ========================================================================= */}
        {currentView === 'new_franchise_wizard' && (
          <FranchiseTransportUploadWizard
            onBack={() => setCurrentView('preview')}
            onAddNewApplication={onAddNewApplication}
            onNavigateToDashboard={onNavigateToDashboard}
          />
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 2: RENEWAL (ENHANCED FAST-TRACK PORTAL) */}
        {/* ========================================================================= */}
        {currentView === 'renewal' && (() => {
          const matchingFranchise = franchises.find(f => f.mtopNo.toLowerCase() === renewalMtopNo.trim().toLowerCase()) || franchises[0] || {
            mtopNo: renewalMtopNo || 'MTOP-2025-0412',
            operatorName: applicantFullName || user?.name || 'Juan Dela Cruz',
            todaOrganization: 'Batasan Hills TODA (BHTODA)',
            plateNumber: 'PH-48192',
            bodyNo: 'Unit #088',
            routeAssigned: 'Batasan Complex ↔ Commonwealth Market Terminal, Quezon City',
            status: 'Approved & Active',
            expiryDate: 'Dec 31, 2025',
            inspectionScore: '98% Roadworthy Passed'
          };

          return (
            <div className="space-y-4 max-w-5xl mx-auto animate-in fade-in pb-8">

              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold shadow-xs">
                      <RefreshCw size={26} className="animate-spin-slow" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                          Franchise Annual Renewal
                        </h2>
                        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <Zap size={11} className="text-emerald-500" />
                          QC Fast-Track Express
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Fast-track annual validation, physical inspection scheduling, and QR plate renewal for active QC MTOP holders
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700">
                      Term: 2025–2026
                    </span>
                  </div>
                </div>

                {!renewalSubmitted ? (
                  <div className="space-y-6 text-xs">
                    {/* MTOP Lookup Box */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/70 space-y-2">
                      <label className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
                        Registered Franchise Control No. (MTOP) *
                      </label>
                      <div className="relative">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={renewalMtopNo}
                          onChange={(e) => setRenewalMtopNo(e.target.value)}
                          placeholder="e.g. MTOP-2025-0412"
                          className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* 2-Column Main Content: Left Record & Schedule, Right Fee Breakdown */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left: Active Franchise Record & Compliance Checks (7 Cols) */}
                      <div className="lg:col-span-7 space-y-5">
                        
                        {/* Live Franchise Card */}
                        <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/30 space-y-3.5 shadow-2xs">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                                {matchingFranchise.operatorName?.charAt(0) || 'J'}
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                                  {matchingFranchise.operatorName}
                                </h4>
                                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                                  {matchingFranchise.todaOrganization}
                                </p>
                              </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                              ● {matchingFranchise.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 text-[11px]">
                            <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/60">
                              <span className="text-slate-400 block text-[10px] font-bold uppercase">Plate / Body</span>
                              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                                {matchingFranchise.plateNumber} • {matchingFranchise.bodyNo || 'Unit #088'}
                              </span>
                            </div>
                            <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/60">
                              <span className="text-slate-400 block text-[10px] font-bold uppercase">Validity Expiry</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {matchingFranchise.expiryDate}
                              </span>
                            </div>
                            <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/60 col-span-2 sm:col-span-1">
                              <span className="text-slate-400 block text-[10px] font-bold uppercase">Last Inspection</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {matchingFranchise.inspectionScore || '98% Passed'}
                              </span>
                            </div>
                          </div>

                          <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/60 text-[11px] flex items-center gap-2">
                            <span className="text-slate-400 font-bold uppercase text-[10px]">Route:</span>
                            <span className="text-slate-700 dark:text-slate-300 font-semibold truncate">
                              {matchingFranchise.routeAssigned}
                            </span>
                          </div>
                        </div>

                        {/* Mandatory Fast-Track Document Validations */}
                        <div className="space-y-2.5">
                          <label className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                            Annual Renewal Document Verification
                          </label>
                          
                          <div className="space-y-2">
                            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                              <div className="flex items-center space-x-2.5">
                                <input
                                  type="checkbox"
                                  checked={renewalOrCrConfirmed}
                                  onChange={(e) => setRenewalOrCrConfirmed(e.target.checked)}
                                  className="rounded text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="text-slate-800 dark:text-slate-200 font-semibold text-xs">
                                  Current Year LTO Official Receipt & Registration (OR/CR)
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">Verified</span>
                            </label>

                            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                              <div className="flex items-center space-x-2.5">
                                <input
                                  type="checkbox"
                                  checked={renewalBarangayConfirmed}
                                  onChange={(e) => setRenewalBarangayConfirmed(e.target.checked)}
                                  className="rounded text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="text-slate-800 dark:text-slate-200 font-semibold text-xs">
                                  Barangay Transport Clearance / Endorsement (Current Residence)
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">Verified</span>
                            </label>

                            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                              <div className="flex items-center space-x-2.5">
                                <input
                                  type="checkbox"
                                  checked={renewalTodaConfirmed}
                                  onChange={(e) => setRenewalTodaConfirmed(e.target.checked)}
                                  className="rounded text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="text-slate-800 dark:text-slate-200 font-semibold text-xs">
                                  TODA / Transport Cooperative Good Standing Clearance
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">Verified</span>
                            </label>
                          </div>
                        </div>

                        {/* Preferred Inspection Center & Schedule */}
                        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                          <label className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
                            Mandatory Vehicle Inspection Appointment
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="sm:col-span-2">
                              <span className="text-[10px] font-bold uppercase text-slate-400">QC Inspection Facility</span>
                              <select
                                value={renewalInspectionCenter}
                                onChange={(e) => setRenewalInspectionCenter(e.target.value)}
                                className="w-full mt-1 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                              >
                                <option value="QC Hall Central Motorpool (Elliptical Road)">QC Hall Central Motorpool (Elliptical Road, Diliman)</option>
                                <option value="Batasan Transport Inspection Center (IBP Road)">Batasan Transport Inspection Center (IBP Road)</option>
                                <option value="Novaliches District Center (Quirino Highway)">Novaliches District Center (Quirino Highway)</option>
                                <option value="Cubao Transport Hub (Aurora Boulevard)">Cubao Transport Hub (Aurora Boulevard)</option>
                              </select>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold uppercase text-slate-400">Preferred Date</span>
                              <input
                                type="date"
                                value={renewalPreferredDate}
                                onChange={(e) => setRenewalPreferredDate(e.target.value)}
                                className="w-full mt-1 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
                              />
                            </div>

                            <div>
                              <span className="text-[10px] font-bold uppercase text-slate-400">Time Slot</span>
                              <select
                                value={renewalTimeSlot}
                                onChange={(e) => setRenewalTimeSlot(e.target.value)}
                                className="w-full mt-1 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                              >
                                <option value="08:00 AM - 09:30 AM">08:00 AM - 09:30 AM (Morning Batch 1)</option>
                                <option value="09:30 AM - 11:00 AM">09:30 AM - 11:00 AM (Morning Batch 2)</option>
                                <option value="01:00 PM - 02:30 PM">01:00 PM - 02:30 PM (Afternoon Batch 1)</option>
                                <option value="02:30 PM - 04:00 PM">02:30 PM - 04:00 PM (Afternoon Batch 2)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Itemized Renewal Fee Breakdown & Submission (5 Cols) */}
                      <div className="lg:col-span-5 space-y-4">
                        
                        {/* Fee Assessment Table Card */}
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div>
                              <h4 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                                Annual Renewal Fee Schedule
                              </h4>
                              <p className="text-[11px] text-slate-500">QC Ordinance Assessment</p>
                            </div>
                            <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                              ₱1,250.00
                            </span>
                          </div>

                          <div className="space-y-2.5 text-[11px] divide-y divide-slate-100 dark:divide-slate-800">
                            <div className="flex justify-between pt-1 text-slate-600 dark:text-slate-400">
                              <span>Franchise Supervision Fee</span>
                              <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">₱350.00</span>
                            </div>
                            <div className="flex justify-between pt-2 text-slate-600 dark:text-slate-400">
                              <span>Filing & Processing Fee</span>
                              <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">₱200.00</span>
                            </div>
                            <div className="flex justify-between pt-2 text-slate-600 dark:text-slate-400">
                              <span>Annual Validation Sticker & QR Plate</span>
                              <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">₱150.00</span>
                            </div>
                            <div className="flex justify-between pt-2 text-slate-600 dark:text-slate-400">
                              <span>Motor Vehicle Inspection Fee</span>
                              <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">₱250.00</span>
                            </div>
                            <div className="flex justify-between pt-2 text-slate-600 dark:text-slate-400">
                              <span>Terminal & Route Management Fee</span>
                              <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">₱150.00</span>
                            </div>
                            <div className="flex justify-between pt-2 text-slate-600 dark:text-slate-400">
                              <span>Environmental & Anti-Smoke Belching Fee</span>
                              <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">₱100.00</span>
                            </div>
                            <div className="flex justify-between pt-2 text-slate-600 dark:text-slate-400">
                              <span>Legal Research Fund (LRF)</span>
                              <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">₱50.00</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t-2 border-slate-200 dark:border-slate-700 font-bold text-xs">
                              <span className="text-slate-900 dark:text-white">Total Assessment</span>
                              <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">₱1,250.00</span>
                            </div>
                          </div>
                        </div>

                        {/* Fast-Track Perks Card */}
                        <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-[11px] space-y-2">
                          <p className="font-bold text-emerald-900 dark:text-emerald-200">Fast-Track Renewal Benefits:</p>
                          <ul className="space-y-1 text-emerald-800 dark:text-emerald-300 list-disc pl-4">
                            <li>Express inspection lane with assigned slot reservation</li>
                            <li>Instant cryptographic QR Sticker release upon test pass</li>
                            <li>Integrated digital receipt & LGU compliance seal</li>
                          </ul>
                        </div>

                        {/* Action Submit Button */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setRenewalSubmitted(true);
                              showToast(`Renewal filed for ${renewalMtopNo}! Scheduled at ${renewalInspectionCenter.split('(')[0]}`);
                              if (onAddNewApplication) {
                                onAddNewApplication(matchingFranchise.operatorName || 'Franchise Operator', `Franchise Annual Renewal (${renewalMtopNo})`);
                              }
                            }}
                            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center space-x-2 active:scale-[0.99]"
                          >
                            <RefreshCw size={15} />
                            <span>Confirm Annual Renewal & Schedule</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ========================================================================= */
                  /* RENEWAL CONFIRMED SUCCESS VIEW */
                  /* ========================================================================= */
                  <div className="text-center py-8 sm:py-12 space-y-6 animate-in zoom-in-95 max-w-lg mx-auto">
                    <div className="w-18 h-18 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 mx-auto rounded-3xl flex items-center justify-center shadow-inner">
                      <CheckCircle2 size={42} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                        <Sparkles size={13} />
                        <span>Renewal Confirmation Ref: RNW-2025-0819</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        Annual Renewal Filed Successfully!
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Franchise <strong className="text-slate-900 dark:text-white font-mono">{renewalMtopNo}</strong> is now booked for mandatory physical inspection.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-left text-xs space-y-2">
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Assigned Bay:</span>
                        <span className="font-bold text-slate-800 dark:text-white truncate max-w-[200px]">{renewalInspectionCenter}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Appointment Date:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{renewalPreferredDate} ({renewalTimeSlot})</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Total Assessment:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-white">₱1,250.00</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFeeMtopNo(renewalMtopNo);
                          setCurrentView('pay_fees');
                        }}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                      >
                        Pay Renewal Fees Online
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRenewalSubmitted(false);
                          setCurrentView('preview');
                        }}
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Return to Overview
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ========================================================================= */}
        {/* SUBVIEW 3: AMENDMENT & ROUTE MODIFICATION (ENHANCED) */}
        {/* ========================================================================= */}
        {currentView === 'amendment' && (() => {
          const matchingFranchise = franchises.find(f => f.mtopNo.toLowerCase() === amendMtopNo.trim().toLowerCase()) || franchises[0] || {
            mtopNo: amendMtopNo || 'MTOP-2025-0412',
            operatorName: applicantFullName || user?.name || 'Juan Dela Cruz',
            todaOrganization: 'Batasan Hills TODA (BHTODA)',
            plateNumber: 'PH-48192',
            bodyNo: 'Unit #088',
            routeAssigned: 'Batasan Complex ↔ Commonwealth Market Terminal, Quezon City',
            status: 'Approved & Active',
            expiryDate: 'Dec 31, 2025'
          };

          return (
            <div className="space-y-4 max-w-5xl mx-auto animate-in fade-in pb-8">

              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold shadow-xs">
                      <FileCheck size={26} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                          Franchise Amendment & Route Modification
                        </h2>
                        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          QC Transport Board
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Substitution of unit, route reallocation, deed of sale operator transfer, or engine replacement
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700">
                      Ordinance SP-2990
                    </span>
                  </div>
                </div>

                {!amendSubmitted ? (
                  <div className="space-y-6 text-xs">
                    {/* Top Row: MTOP Reference & Type of Amendment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/70">
                      <div>
                        <label className="font-bold text-slate-800 dark:text-slate-200 text-xs block mb-1.5">
                          MTOP Franchise Reference *
                        </label>
                        <div className="relative">
                          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={amendMtopNo}
                            onChange={(e) => setAmendMtopNo(e.target.value)}
                            placeholder="e.g. MTOP-2025-0412"
                            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-slate-800 dark:text-slate-200 text-xs block mb-1.5">
                          Type of Amendment *
                        </label>
                        <select
                          value={amendType}
                          onChange={(e) => setAmendType(e.target.value)}
                          className="w-full py-2.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                        >
                          <option value="Substitution of Vehicle Unit">Substitution of Vehicle Unit (Dropping & Replacement)</option>
                          <option value="Change of Assigned Route">Change of Assigned TODA Route / Corridor</option>
                          <option value="Operator Transfer (Deed of Sale)">Operator Transfer (Deed of Absolute Sale / Rights)</option>
                          <option value="Change of Engine/Chassis">Change of Engine / Chassis Serial Number</option>
                        </select>
                      </div>
                    </div>

                    {/* Current Registered Record vs Amendment Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left: Current Record & Dynamic Amendment Fields (7 cols) */}
                      <div className="lg:col-span-7 space-y-5">
                        
                        {/* Currently Registered Base Info */}
                        <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                              Current Registered Franchise Record
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                              {matchingFranchise.mtopNo}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Grantee Operator</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{matchingFranchise.operatorName}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Affiliation</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{matchingFranchise.todaOrganization}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Registered Plate</span>
                              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{matchingFranchise.plateNumber}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Corridor</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">{matchingFranchise.routeAssigned}</span>
                            </div>
                          </div>
                        </div>

                        {/* DYNAMIC FORM FIELDS BASED ON AMENDMENT TYPE */}
                        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-2xs">
                          <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <Layers size={14} className="text-amber-500" />
                            <span>New Amended Specifications</span>
                          </h4>

                          {/* 1. Substitution of Unit */}
                          {amendType === 'Substitution of Vehicle Unit' && (
                            <div className="space-y-3 animate-in fade-in">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="font-bold text-slate-700 dark:text-slate-300">New Make / Brand *</label>
                                  <input
                                    type="text"
                                    value={amendNewMake}
                                    onChange={(e) => setAmendNewMake(e.target.value)}
                                    placeholder="e.g. Yamaha Sight 115"
                                    className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="font-bold text-slate-700 dark:text-slate-300">New Plate Number *</label>
                                  <input
                                    type="text"
                                    value={amendNewPlate}
                                    onChange={(e) => setAmendNewPlate(e.target.value)}
                                    placeholder="e.g. QC-99201"
                                    className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="font-bold text-slate-700 dark:text-slate-300">New Engine / Motor No. *</label>
                                  <input
                                    type="text"
                                    value={amendNewEngine}
                                    onChange={(e) => setAmendNewEngine(e.target.value)}
                                    placeholder="e.g. ENG-550192"
                                    className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="font-bold text-slate-700 dark:text-slate-300">New Chassis Serial No. *</label>
                                  <input
                                    type="text"
                                    value={amendNewChassis}
                                    onChange={(e) => setAmendNewChassis(e.target.value)}
                                    placeholder="e.g. CHS-2201948"
                                    className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 2. Change of Route */}
                          {amendType === 'Change of Assigned Route' && (
                            <div className="space-y-3 animate-in fade-in">
                              <div>
                                <label className="font-bold text-slate-700 dark:text-slate-300">Requested QC TODA Affiliation *</label>
                                <select
                                  value={amendNewRouteToda}
                                  onChange={(e) => setAmendNewRouteToda(e.target.value)}
                                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs cursor-pointer"
                                >
                                  <option value="Batasan Hills TODA (BHTODA)">Batasan Hills TODA (BHTODA)</option>
                                  <option value="Commonwealth TODA (COMTODA)">Commonwealth TODA (COMTODA)</option>
                                  <option value="Novaliches-Fairview TODA (NOFATODA)">Novaliches-Fairview TODA (NOFATODA)</option>
                                  <option value="Cubao-San Martin de Porres TODA (CSMP-TODA)">Cubao-San Martin de Porres TODA (CSMP-TODA)</option>
                                  <option value="Tandang Sora TODA (TASTODA)">Tandang Sora TODA (TASTODA)</option>
                                  <option value="Holy Spirit TODA (HSTODA)">Holy Spirit TODA (HSTODA)</option>
                                  <option value="Diliman-Philcoa TODA (DILP-TODA)">Diliman-Philcoa TODA (DILP-TODA)</option>
                                </select>
                              </div>
                              <div>
                                <label className="font-bold text-slate-700 dark:text-slate-300">Proposed New Corridor / Route Terminal *</label>
                                <input
                                  type="text"
                                  value={amendNewRoutePath}
                                  onChange={(e) => setAmendNewRoutePath(e.target.value)}
                                  placeholder="e.g. Novaliches Bayan ↔ Fairview Center Mall (FCM)"
                                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                                />
                              </div>
                            </div>
                          )}

                          {/* 3. Operator Transfer */}
                          {amendType === 'Operator Transfer (Deed of Sale)' && (
                            <div className="space-y-3 animate-in fade-in">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="sm:col-span-2">
                                  <label className="font-bold text-slate-700 dark:text-slate-300">New Transferee / Buyer Full Name *</label>
                                  <input
                                    type="text"
                                    value={amendNewTransfereeName}
                                    onChange={(e) => setAmendNewTransfereeName(e.target.value)}
                                    placeholder="e.g. Maria Santos Dela Cruz"
                                    className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="font-bold text-slate-700 dark:text-slate-300">Contact Number *</label>
                                  <input
                                    type="text"
                                    value={amendNewTransfereeContact}
                                    onChange={(e) => setAmendNewTransfereeContact(e.target.value)}
                                    placeholder="e.g. 0917-889-1234"
                                    className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="font-bold text-slate-700 dark:text-slate-300">QC Residential Address *</label>
                                  <input
                                    type="text"
                                    value={amendNewTransfereeAddress}
                                    onChange={(e) => setAmendNewTransfereeAddress(e.target.value)}
                                    placeholder="e.g. Brgy. Batasan Hills, Quezon City"
                                    className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 4. Engine/Chassis Change */}
                          {amendType === 'Change of Engine/Chassis' && (
                            <div className="space-y-3 animate-in fade-in">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="font-bold text-slate-700 dark:text-slate-300">New Engine Serial Number *</label>
                                  <input
                                    type="text"
                                    value={amendNewEngine}
                                    onChange={(e) => setAmendNewEngine(e.target.value)}
                                    placeholder="e.g. ENG-994102"
                                    className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="font-bold text-slate-700 dark:text-slate-300">New Chassis Serial Number *</label>
                                  <input
                                    type="text"
                                    value={amendNewChassis}
                                    onChange={(e) => setAmendNewChassis(e.target.value)}
                                    placeholder="e.g. CHS-8830192"
                                    className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Justification Textarea */}
                          <div>
                            <label className="font-bold text-slate-700 dark:text-slate-300">Reason / Justification for Amendment *</label>
                            <textarea
                              rows={2}
                              value={amendReason}
                              onChange={(e) => setAmendReason(e.target.value)}
                              className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs resize-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Fees, Requirements, & Submission (5 cols) */}
                      <div className="lg:col-span-5 space-y-4">
                        
                        {/* Fee Assessment Card */}
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div>
                              <h4 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                                Amendment Fee Assessment
                              </h4>
                              <p className="text-[11px] text-slate-500">QC Regulatory Tariff</p>
                            </div>
                            <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-sm">
                              ₱900.00
                            </span>
                          </div>

                          <div className="space-y-2.5 text-[11px] divide-y divide-slate-100 dark:divide-slate-800">
                            <div className="flex justify-between pt-1 text-slate-600 dark:text-slate-400">
                              <span>Filing & Legal Processing Fee</span>
                              <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">₱300.00</span>
                            </div>
                            <div className="flex justify-between pt-2 text-slate-600 dark:text-slate-400">
                              <span>Board Resolution & Endorsement</span>
                              <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">₱250.00</span>
                            </div>
                            <div className="flex justify-between pt-2 text-slate-600 dark:text-slate-400">
                              <span>Certificate of Dropping / Substitution</span>
                              <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">₱150.00</span>
                            </div>
                            <div className="flex justify-between pt-2 text-slate-600 dark:text-slate-400">
                              <span>Physical Roadworthiness Inspection</span>
                              <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">₱200.00</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t-2 border-slate-200 dark:border-slate-700 font-bold text-xs">
                              <span className="text-slate-900 dark:text-white">Total Assessment</span>
                              <span className="font-mono text-amber-600 dark:text-amber-400 text-sm">₱900.00</span>
                            </div>
                          </div>
                        </div>

                        {/* Document Requirements Checklist */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2 text-[11px]">
                          <p className="font-bold text-slate-800 dark:text-slate-200">Required Supporting Documents:</p>
                          <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
                            <li className="flex items-center gap-1.5">
                              <CheckCircle2 size={13} className="text-amber-500 shrink-0" />
                              <span>Notarized Petition for Franchise Amendment</span>
                            </li>
                            <li className="flex items-center gap-1.5">
                              <CheckCircle2 size={13} className="text-amber-500 shrink-0" />
                              <span>LTO Certificate of Registration / Dropping Clearance</span>
                            </li>
                            <li className="flex items-center gap-1.5">
                              <CheckCircle2 size={13} className="text-amber-500 shrink-0" />
                              <span>TODA Board Resolution / Cooperative Endorsement</span>
                            </li>
                          </ul>
                        </div>

                        {/* Sworn Oath Checkbox */}
                        <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 rounded-xl">
                          <label className="flex items-start space-x-2.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={amendSwornOath}
                              onChange={(e) => setAmendSwornOath(e.target.checked)}
                              className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                            />
                            <span className="text-slate-700 dark:text-slate-300 text-[10px] leading-relaxed">
                              I certify under penalty of perjury that the attached modifications are genuine and compliant with the Quezon City Transport Code.
                            </span>
                          </label>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="button"
                          disabled={!amendSwornOath}
                          onClick={() => {
                            setAmendSubmitted(true);
                            showToast(`Amendment petition for ${amendMtopNo} submitted to Board!`);
                            if (onAddNewApplication) {
                              onAddNewApplication(matchingFranchise.operatorName || 'Franchise Operator', `Franchise Amendment (${amendType.split(' ')[0]})`);
                            }
                          }}
                          className={`w-full py-3.5 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 ${
                            amendSwornOath 
                              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/25 cursor-pointer active:scale-[0.99]' 
                              : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <FileCheck size={15} />
                          <span>Submit Amendment Application</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ========================================================================= */
                  /* AMENDMENT SUBMITTED SUCCESS VIEW */
                  /* ========================================================================= */
                  <div className="text-center py-8 sm:py-12 space-y-6 animate-in zoom-in-95 max-w-lg mx-auto">
                    <div className="w-18 h-18 bg-amber-50 dark:bg-amber-950 text-amber-600 mx-auto rounded-3xl flex items-center justify-center shadow-inner">
                      <CheckCircle2 size={42} />
                    </div>

                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-full text-xs font-semibold border border-amber-200 dark:border-amber-800">
                        <Sparkles size={13} />
                        <span>Amendment Petition Docket: AMD-2025-0144</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        Amendment Petition Lodged!
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Your requested modification (<strong className="text-slate-800 dark:text-slate-200">{amendType}</strong>) for franchise <strong className="font-mono text-slate-900 dark:text-white">{amendMtopNo}</strong> has been transmitted to the Quezon City Municipal Transport Regulatory Board.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-left text-xs space-y-2">
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Petition Type:</span>
                        <span className="font-bold text-slate-800 dark:text-white">{amendType}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Board Assessment:</span>
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">₱900.00</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Evaluation Status:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">Queued for Board Evaluation</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFeeMtopNo(amendMtopNo);
                          setCurrentView('pay_fees');
                        }}
                        className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                      >
                        Pay Amendment Filing Fee
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAmendSubmitted(false);
                          setCurrentView('preview');
                        }}
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Return to Overview
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ========================================================================= */}
        {/* SUBVIEW 4: PAY FRANCHISE DUES */}
        {/* ========================================================================= */}
        {currentView === 'pay_fees' && (
          <div className="space-y-4 max-w-2xl mx-auto animate-in fade-in pb-8">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  <DollarSign size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Pay Franchise & Regulatory Dues
                  </h2>
                  <p className="text-xs text-slate-500">Official Municipal Receipt (OR) & Digital Payment Gateway</p>
                </div>
              </div>

              {!feeReceipt ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">MTOP Number / Assessment Code *</label>
                    <input
                      type="text"
                      value={feeMtopNo}
                      onChange={(e) => setFeeMtopNo(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex justify-between font-medium">
                      <span>MTOP Franchise Filing & Grant Fee:</span>
                      <span className="font-mono">₱ 750.00</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Roadworthiness & Smoke Emission Test:</span>
                      <span className="font-mono">₱ 350.00</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Official Windshield QR Decal & Sticker:</span>
                      <span className="font-mono">₱ 150.00</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-sm text-slate-900 dark:text-white">
                      <span>Total Regulatory Due:</span>
                      <span className="font-mono text-emerald-600">₱ 1,250.00</span>
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
                            orNo: 'OR-MTOP-2025-99214',
                            amount: '₱ 1,250.00',
                            date: new Date().toLocaleString(),
                            mtopNo: feeMtopNo
                          });
                          showToast('Payment confirmed! Official Receipt released.');
                        }, 1000);
                      }}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center space-x-2"
                    >
                      {isProcessingFee ? <span>Processing Secure Payment...</span> : <span>Confirm Payment of ₱ 1,250.00</span>}
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
                    <p><strong>FRANCHISE  :</strong> {feeReceipt.mtopNo}</p>
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
        {/* SUBVIEW 5: SPECIAL TRIP PERMIT (SIMPLE & USER-FRIENDLY) */}
        {/* ========================================================================= */}
        {currentView === 'special_trip' && (() => {
          const matchingFranchise = franchises.find(f => f.mtopNo.toLowerCase() === specialTripData.mtopNo.trim().toLowerCase()) || franchises[0] || {
            mtopNo: specialTripData.mtopNo || 'MTOP-2025-0412',
            operatorName: applicantFullName || user?.name || 'Juan Dela Cruz',
            todaOrganization: 'Batasan Hills TODA (BHTODA)',
            plateNumber: 'PH-48192',
            bodyNo: 'Unit #088',
            routeAssigned: 'Batasan Complex ↔ Commonwealth Market Terminal, Quezon City',
            status: 'Approved & Active',
            expiryDate: 'Dec 31, 2025'
          };

          return (
            <div className="space-y-4 max-w-2xl mx-auto animate-in fade-in pb-8">

              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center font-bold shadow-xs">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      Special Trip & Out-of-Line Clearance
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Fast route permit for events, school shuttles, medical assistance, and out-of-zone travel
                    </p>
                  </div>
                </div>

                {!specialTripSubmitted ? (
                  <div className="space-y-5 text-xs">
                    {/* Vehicle & Operator Banner */}
                    <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-xs">
                            {matchingFranchise.operatorName}
                          </span>
                          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                            {matchingFranchise.mtopNo}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                          {matchingFranchise.todaOrganization} • Plate: <strong className="font-mono text-slate-800 dark:text-slate-200">{matchingFranchise.plateNumber}</strong>
                        </p>
                      </div>
                      <span className="self-start sm:self-auto px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                        <Check size={11} /> Eligible for Clearance
                      </span>
                    </div>

                    {/* Field 1: Purpose of Trip */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                        1. Purpose of Special Trip *
                      </label>
                      <select
                        value={specialTripData.purpose}
                        onChange={(e) => setSpecialTripData({ ...specialTripData, purpose: e.target.value })}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                      >
                        <option value="Special Charter / Barangay Fiesta Transport Service">🎪 Barangay Fiesta / Festival Shuttle</option>
                        <option value="School Field Activity / Educational Shuttle">🎓 School Field Trip / Educational Shuttle</option>
                        <option value="Hospital & Medical Emergency Transport">🏥 Hospital & Medical Assistance</option>
                        <option value="Religious Pilgrimage / Church Delegation Service">⛪ Church / Religious Pilgrimage</option>
                        <option value="Family Gathering / Funeral Escort Service">👨‍👩‍👧 Family Event / Funeral Escort</option>
                        <option value="Government Community Outreach Mobilization">🏛️ Community Outreach & Relief Drive</option>
                      </select>
                    </div>

                    {/* Field 2: Destination Route */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                        2. Destination Route (Within Quezon City) *
                      </label>
                      <select
                        value={specialTripData.routeArea}
                        onChange={(e) => setSpecialTripData({ ...specialTripData, routeArea: e.target.value })}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                      >
                        <option value="Batasan Hills ↔ Quezon Memorial Circle / QC City Hall">📍 Batasan Hills ↔ QC Memorial Circle / QC City Hall</option>
                        <option value="Batasan Hills ↔ Amoranto Sports Stadium (Roces)">📍 Batasan Hills ↔ Amoranto Sports Stadium (Roces)</option>
                        <option value="Batasan Hills ↔ La Mesa Eco Park (Novaliches)">📍 Batasan Hills ↔ La Mesa Eco Park (Novaliches)</option>
                        <option value="Batasan Hills ↔ Novaliches Bayan Market">📍 Batasan Hills ↔ Novaliches Bayan Market</option>
                        <option value="Batasan Hills ↔ Cubao Aurora Corridor">📍 Batasan Hills ↔ Cubao Aurora Corridor</option>
                        <option value="Batasan Hills ↔ Fairview Center Mall (FCM)">📍 Batasan Hills ↔ Fairview Center Mall (FCM)</option>
                      </select>
                    </div>

                    {/* Field 3: Duration & Dates */}
                    <div className="space-y-2">
                      <label className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                        3. Travel Duration & Schedule *
                      </label>
                      
                      {/* Duration Buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { days: '1 Calendar Day', label: '1 Day', fee: '₱150' },
                          { days: '3 Calendar Days', label: '3 Days', fee: '₱350' },
                          { days: '7 Calendar Days', label: '7 Days', fee: '₱500' }
                        ].map((tier) => (
                          <button
                            key={tier.days}
                            type="button"
                            onClick={() => setSpecialTripData({ ...specialTripData, durationDays: tier.days })}
                            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                              specialTripData.durationDays === tier.days
                                ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-xs'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                            }`}
                          >
                            <span className="block text-xs font-bold">{tier.label}</span>
                            <span className={`text-[10px] block ${specialTripData.durationDays === tier.days ? 'text-amber-100' : 'text-slate-500'}`}>
                              {tier.fee}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Date Row */}
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-1">Start Date</span>
                          <input
                            type="date"
                            value={specialTripData.startDate}
                            onChange={(e) => setSpecialTripData({ ...specialTripData, startDate: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-1">End Date</span>
                          <input
                            type="date"
                            value={specialTripData.endDate}
                            onChange={(e) => setSpecialTripData({ ...specialTripData, endDate: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Fee Total & Agreement Card */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                            Special Trip Clearance Fee
                          </span>
                          <span className="text-[10px] text-slate-500">QC DPOS Permit & Traffic Monitoring</span>
                        </div>
                        <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-lg">
                          ₱350.00
                        </span>
                      </div>

                      <label className="flex items-start space-x-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-700/80 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={specialTripSafetyConfirmed}
                          onChange={(e) => setSpecialTripSafetyConfirmed(e.target.checked)}
                          className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                          I agree to use secondary roads and observe city passenger safety rules.
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="button"
                      disabled={!specialTripSafetyConfirmed}
                      onClick={() => {
                        setSpecialTripSubmitted(true);
                        showToast(`Special Trip clearance issued for ${specialTripData.mtopNo}!`);
                        if (onAddNewApplication) {
                          onAddNewApplication(matchingFranchise.operatorName || 'Franchise Operator', `Special Trip Clearance (${specialTripData.mtopNo})`);
                        }
                      }}
                      className={`w-full py-3.5 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 ${
                        specialTripSafetyConfirmed
                          ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/25 cursor-pointer active:scale-[0.99]'
                          : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <MapPin size={15} />
                      <span>Submit & Get Special Trip Permit</span>
                    </button>
                  </div>
                ) : (
                  /* ========================================================================= */
                  /* SPECIAL TRIP ISSUED SUCCESS VIEW */
                  /* ========================================================================= */
                  <div className="text-center py-8 space-y-5 animate-in zoom-in-95">
                    <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950 text-amber-600 mx-auto rounded-3xl flex items-center justify-center shadow-inner">
                      <CheckCircle2 size={38} />
                    </div>

                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-full text-xs font-semibold border border-amber-200 dark:border-amber-800">
                        <Sparkles size={13} />
                        <span>Clearance ID: STP-2025-0391</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        Special Route Clearance Issued!
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Franchise <strong className="font-mono text-slate-900 dark:text-white">{specialTripData.mtopNo}</strong> is cleared for out-of-zone travel.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-left text-xs space-y-2">
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Authorized Route:</span>
                        <span className="font-bold text-slate-800 dark:text-white truncate max-w-[200px]">{specialTripData.routeArea}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Validity Period:</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">{specialTripData.startDate} to {specialTripData.endDate} ({specialTripData.durationDays})</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Clearance Fee:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-white">₱350.00</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFeeMtopNo(specialTripData.mtopNo);
                          setCurrentView('pay_fees');
                        }}
                        className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                      >
                        Pay Clearance Fee Online
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSpecialTripSubmitted(false);
                          setCurrentView('preview');
                        }}
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Return to Overview
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ========================================================================= */}
        {/* SUBVIEW 6: CTC PULLING */}
        {/* ========================================================================= */}
        {currentView === 'ctc_pulling' && (
          <div className="space-y-4 max-w-3xl mx-auto animate-in fade-in pb-8">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                  <Layers size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Pulling of Certified True Copies (CTC) of MTOP Grants
                  </h2>
                  <p className="text-xs text-slate-500">Official Municipal Transport Archive Retrieval</p>
                </div>
              </div>

              {!ctcPaid ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">MTOP Franchise Reference *</label>
                    <input
                      type="text"
                      value={ctcMtopNo}
                      onChange={(e) => setCtcMtopNo(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Operator Name *</label>
                    <input
                      type="text"
                      value={ctcOperatorName}
                      onChange={(e) => setCtcOperatorName(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 mb-2 block">Select Documents to Pull *</label>
                    <div className="space-y-2">
                      {[
                        'Certified True Copy of MTOP Franchise Certificate (Current Year)',
                        'Official TODA Route Endorsement & Authorization Certificate',
                        'Certificate of Dropping / Substitution of Transport Unit'
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
                    <span className="font-bold text-purple-900 dark:text-purple-200">Archive Search & CTC Fee:</span>
                    <span className="font-mono font-bold text-purple-900 dark:text-purple-200">₱ 250.00</span>
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
                      {ctcIsProcessingPayment ? <span>Authenticating Watermark...</span> : <span>Pay ₱250.00 & Download CTC</span>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 mx-auto rounded-full flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold">Certified True Copy Unlocked</h3>
                  <p className="text-xs text-slate-500">Official watermarked documents for {ctcMtopNo} are ready for download.</p>
                  
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
        {/* SUBVIEW 7: VERIFICATION */}
        {/* ========================================================================= */}
        {currentView === 'verification' && (
          <div className="space-y-4 max-w-3xl mx-auto animate-in fade-in pb-8">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Franchise & Route Standing Verification
                  </h2>
                  <p className="text-xs text-slate-500">Live Quota, Roadworthiness & LTO Verification Lookup</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={verifQuery}
                  onChange={(e) => setVerifQuery(e.target.value)}
                  placeholder="Enter MTOP No. or Plate No..."
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
                  Verify Franchise
                </button>
              </div>

              {verifResult && (
                <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-mono font-bold text-emerald-600 text-sm">{verifResult.mtopNo}</span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {verifResult.status}
                    </span>
                  </div>
                  <p><strong>Operator:</strong> {verifResult.operatorName}</p>
                  <p><strong>TODA:</strong> {verifResult.toda}</p>
                  <p><strong>Vehicle Unit:</strong> {verifResult.unitType} (Plate: {verifResult.plateNumber} • Body: {verifResult.bodyNo})</p>
                  <p><strong>Route Coverage:</strong> {verifResult.route}</p>
                  <p><strong>Inspection Standing:</strong> <span className="text-emerald-600 font-bold">{verifResult.inspectionStatus}</span></p>
                  <p><strong>Validity:</strong> Valid Until {verifResult.validUntil}</p>
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
        {/* SUBVIEW 8: SAFETY SEAL APPLICATION */}
        {/* ========================================================================= */}
        {currentView === 'safety_seal' && (
          <div className="space-y-4 max-w-3xl mx-auto animate-in fade-in pb-8">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                  <Award size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Transport Safety & Roadworthiness Seal
                  </h2>
                  <p className="text-xs text-slate-500">Official Municipal Eco-Transport & Road Safety QR Decal</p>
                </div>
              </div>

              {!sealSubmitted ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Registered MTOP No. *</label>
                    <input
                      type="text"
                      value={sealMtopNo}
                      onChange={(e) => setSealMtopNo(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div className="p-4 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl space-y-2">
                    <p className="font-bold text-amber-900 dark:text-amber-200">Seal Benefits & Inclusions:</p>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">✓ Priority route queueing in LGU transport terminals</p>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">✓ Official Windshield QR Safety Decal for law enforcers</p>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">✓ Discounted annual franchise renewal rates</p>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setSealSubmitted(true);
                        showToast('Transport Safety Seal application lodged!');
                      }}
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md"
                    >
                      Submit Safety Seal Application
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-amber-50 text-amber-600 mx-auto rounded-full flex items-center justify-center">
                    <Award size={32} />
                  </div>
                  <h3 className="text-xl font-bold">Safety Seal Application Submitted</h3>
                  <p className="text-xs text-slate-500">Your unit is queued for emission and safety seal dispatch.</p>
                  <button onClick={() => setCurrentView('preview')} className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold">
                    Return to Overview
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: REQUEST E-COPY */}
        {/* ========================================================================= */}
        {ecopyModalOpen && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-in zoom-in-95 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <Download size={18} className="text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Request Official E-Copy</h3>
                </div>
                <button onClick={() => { setEcopyModalOpen(false); setEcopyGenerated(false); }} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              {!ecopyGenerated ? (
                <div className="space-y-4">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Enter MTOP Number *</label>
                    <input
                      type="text"
                      value={ecopyMtopNo}
                      onChange={(e) => setEcopyMtopNo(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    The official e-copy is certified with the cryptographic QR signature of the Municipal Franchising Board.
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
                      const item = franchises[0];
                      handleDownloadPermitFile(item);
                      setEcopyModalOpen(false);
                      setEcopyGenerated(false);
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center space-x-2"
                  >
                    <Download size={14} />
                    <span>Download MTOP Franchise E-Copy</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ADMIN MODAL: 4-TAB COMPREHENSIVE EVALUATION & DOSSIER SUITE */}
        {/* ========================================================================= */}
        {activeReviewItem && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
              
              {/* Modal Top Header */}
              <div className="px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-600/30">
                    <Bus size={22} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400">
                        {activeReviewItem.mtopNo}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        {activeReviewItem.status}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                      TRB Franchise Dossier & Legal Evaluation Suite
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
                  { id: 'driver', label: '1. Driver & Operator Dossier', icon: User },
                  { id: 'vehicle', label: '2. Vehicle Specs & LTO Verification', icon: Truck },
                  { id: 'toda', label: '3. TODA Route & Quota Analysis', icon: MapPin },
                  { id: 'decal', label: '4. Digital QR Decal & Certificate', icon: QrCode },
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = evalTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setEvalTab(tab.id as any)}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 border-b-2 cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40'
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
                
                {/* TAB 1: DRIVER & OPERATOR DOSSIER */}
                {evalTab === 'driver' && (
                  <div className="space-y-5 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Operator / Grantee Name</span>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{activeReviewItem.operatorName}</p>
                        <p className="text-slate-500 mt-1">Born: {activeReviewItem.dateOfBirth} (41 yrs old)</p>
                        <p className="text-slate-500">{activeReviewItem.address}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Contact & Government Credentials</span>
                        <p className="font-medium text-slate-900 dark:text-white mt-1">📱 {activeReviewItem.contactNumber}</p>
                        <p className="font-medium text-slate-900 dark:text-white">✉️ {activeReviewItem.emailAddress}</p>
                        <div className="mt-2 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px]">
                          <span>{activeReviewItem.governmentIdType}: </span>
                          <strong className="text-emerald-600">{activeReviewItem.governmentIdNo}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Legal Check Registry */}
                    <div className="space-y-2">
                      <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[11px]">Inter-Agency Verification Status</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/20 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-800 dark:text-emerald-300">LTO Driver License</span>
                            <CheckCircle2 size={14} className="text-emerald-600" />
                          </div>
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Valid Professional (0 Demerits)</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/20 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-800 dark:text-emerald-300">Barangay Clearance</span>
                            <CheckCircle2 size={14} className="text-emerald-600" />
                          </div>
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Clean Record & Good Standing</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/20 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-800 dark:text-emerald-300">QC Tax Standing</span>
                            <CheckCircle2 size={14} className="text-emerald-600" />
                          </div>
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Assessment Paid (₱1,250.00)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: VEHICLE TECHNICAL SPECS & LTO VERIFICATION */}
                {evalTab === 'vehicle' && (
                  <div className="space-y-5 animate-in fade-in">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-slate-900 dark:text-white uppercase">Primary Transport Unit</span>
                        <span className="font-mono font-bold text-emerald-600">{activeReviewItem.plateNumber}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Unit Make & Model</span>
                          <strong className="text-slate-900 dark:text-white">{activeReviewItem.vehicles?.[0]?.makeBrand || 'Honda'} {activeReviewItem.vehicles?.[0]?.model || 'TMX 125'}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Body Number</span>
                          <strong className="text-slate-900 dark:text-white">{activeReviewItem.bodyNo}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Engine Number</span>
                          <strong className="font-mono text-slate-700 dark:text-slate-300">{activeReviewItem.engineNo}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Chassis Number</span>
                          <strong className="font-mono text-slate-700 dark:text-slate-300">{activeReviewItem.chassisNo}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-2">
                      <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[11px]">LTO Digital Authentication Link</h4>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">{activeReviewItem.orCrNumber}</span>
                          <p className="text-[10px] text-slate-400">Authenticated via Land Transportation Office (LTO) Central API</p>
                        </div>
                        <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                          LTO GENUINE
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: TODA ROUTE & QUOTA ANALYSIS */}
                {evalTab === 'toda' && (
                  <div className="space-y-5 animate-in fade-in">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white uppercase">Assigned TODA & Corridor</span>
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {activeReviewItem.routeCapacityStatus}
                        </span>
                      </div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">{activeReviewItem.todaOrganization}</p>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-2">
                        <MapPin size={16} className="text-emerald-600 flex-shrink-0" />
                        <span className="font-medium text-slate-800 dark:text-slate-200">{activeReviewItem.routeAssigned}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/20 space-y-2">
                      <span className="font-bold text-emerald-900 dark:text-emerald-200 text-xs">Route Conflict & Overlap Analysis</span>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                        ✓ No route conflict detected with adjacent TODA zones. Unit is strictly confined to municipal feeder roads as prescribed in Ordinance SP-2751.
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 4: DIGITAL QR DECAL & CERTIFICATE */}
                {evalTab === 'decal' && (
                  <div className="space-y-5 animate-in fade-in">
                    <div className="p-6 rounded-3xl bg-gradient-to-tr from-slate-900 to-emerald-950 border border-emerald-500/40 text-white shadow-xl max-w-md mx-auto space-y-4 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                        Quezon City Official Windshield Decal 2025
                      </div>
                      
                      <div className="w-32 h-32 bg-white p-2 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                        <QrCode size={110} className="text-slate-900" />
                      </div>

                      <div>
                        <span className="font-mono text-2xl font-black text-emerald-400 tracking-wider block">
                          {activeReviewItem.mtopNo}
                        </span>
                        <p className="font-bold text-xs text-white">{activeReviewItem.operatorName}</p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">{activeReviewItem.todaOrganization} • Body {activeReviewItem.bodyNo}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-700 text-[10px] text-slate-400 font-mono">
                        Valid Until: Dec 31, 2025 • RSA-2048 Digital Signed
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
                  Issue Deficiency Notice / Reject
                </button>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      const itm = activeReviewItem;
                      setActiveReviewItem(null);
                      setActiveInspectModalItem(itm);
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <Truck size={14} />
                    <span>Run Roadworthiness Audit</span>
                  </button>

                  <button
                    onClick={() => {
                      setFranchises(prev => prev.map(f => f.id === activeReviewItem.id ? { ...f, status: 'Approved & Active' } : f));
                      showToast(`✅ Approved MTOP ${activeReviewItem.mtopNo}! Official QR Decal release dispatched.`);
                      setActiveReviewItem(null);
                    }}
                    className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle2 size={14} />
                    <span>Approve & Release Decal</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ADMIN MODAL: ROADWORTHINESS & SMOKE TEST AUDIT SIMULATOR */}
        {/* ========================================================================= */}
        {activeInspectModalItem && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 flex items-center justify-center font-bold">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Physical Roadworthiness & Smoke Audit Simulator
                    </h3>
                    <p className="text-xs text-slate-500">
                      Unit: <strong className="text-slate-800 dark:text-slate-200">{activeInspectModalItem.plateNumber}</strong> ({activeInspectModalItem.bodyNo}) • {activeInspectModalItem.mtopNo}
                    </p>
                  </div>
                </div>
                <button onClick={() => setActiveInspectModalItem(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              {/* 5 Physical Inspection Criteria Checklist */}
              <div className="space-y-2.5 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Inspector Safety Verification Checklist</span>
                
                {[
                  { key: 'lights', label: 'Headlight, Taillight & Turn Signal System Operational', desc: 'Compliant luminous intensity and working hazard flashers' },
                  { key: 'brakes', label: 'Hydraulic Dual Brake Response & Tire Tread Depth (≥3.0mm)', desc: 'Responsive stopping distance under full passenger load' },
                  { key: 'chassis', label: 'Heavy-Duty Sidecar Structural Welds & Weather Canopy', desc: 'No structural hairline cracks; secure passenger safety handrails' },
                  { key: 'emissions', label: 'Smoke Opacity (K-Value ≤ 1.5) / EV Battery Cell Balance', desc: 'Passed optical smoke test / zero tailpipe emission standard' },
                  { key: 'fareMatrix', label: 'Official LGU Fare Matrix Sticker Affixed on Windshield', desc: 'Clear visibility of standard TODA base fares for commuters' },
                ].map((item) => (
                  <div 
                    key={item.key}
                    onClick={() => setInspectionChecks(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      inspectionChecks[item.key]
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500/30 text-slate-900 dark:text-white'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs">{item.label}</p>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                      inspectionChecks[item.key] ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}>
                      {inspectionChecks[item.key] ? '✓' : ''}
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Roadworthiness Score Gauge */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Road Audit Score</span>
                  <span className="font-black text-lg text-emerald-600 dark:text-emerald-400">
                    {Object.values(inspectionChecks).filter(Boolean).length * 20}% Score
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full font-bold text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {Object.values(inspectionChecks).filter(Boolean).length >= 4 ? 'PASSED & ROADWORTHY' : 'DEFICIENT'}
                </span>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setActiveInspectModalItem(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const score = Object.values(inspectionChecks).filter(Boolean).length * 20;
                    setFranchises(prev => prev.map(f => f.id === activeInspectModalItem.id ? { 
                      ...f, 
                      status: 'Approved & Active',
                      inspectionScore: `Passed (${score}%) - Roadworthy Certified`
                    } : f));
                    showToast(`🛺 Certified Unit ${activeInspectModalItem.plateNumber} as Roadworthy (${score}%)! MTOP Approved.`);
                    setActiveInspectModalItem(null);
                  }}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <CheckCircle2 size={14} />
                  <span>Certify Unit & Release Decal</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ADMIN MODAL: ISSUE DEFICIENCY NOTICE */}
        {/* ========================================================================= */}
        {activeDeficiencyItem && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <AlertCircle size={22} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Issue Notice of Deficiencies
                  </h3>
                  <p className="text-xs text-slate-500">
                    MTOP Ref: <span className="font-mono font-bold text-rose-600">{activeDeficiencyItem.mtopNo}</span>
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
                    <option value="Expired LTO OR/CR or Lacking Smoke Emission Test">Expired LTO OR/CR or Lacking Smoke Emission Test</option>
                    <option value="TODA Route Quota Full in Target Zone">TODA Route Quota Full in Target Zone</option>
                    <option value="Non-Compliant Vehicle Age / Chassis Condition">Non-Compliant Vehicle Age / Chassis Condition</option>
                    <option value="Lacking Barangay Driver Clearance">Lacking Barangay Driver Clearance</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Inspector Directives & Instructions</label>
                  <textarea
                    rows={3}
                    value={deficiencyNotes}
                    onChange={(e) => setDeficiencyNotes(e.target.value)}
                    placeholder="Provide specific instructions for applicant resubmission..."
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
                    setFranchises(prev => prev.map(f => f.id === activeDeficiencyItem.id ? { ...f, status: 'Rejected' } : f));
                    showToast(`❌ Issued Deficiency Notice to ${activeDeficiencyItem.operatorName}. Application returned.`);
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
