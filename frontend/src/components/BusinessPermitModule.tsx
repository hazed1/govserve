import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  Building,
  FileText, 
  RotateCw, 
  Edit3, 
  CreditCard, 
  Calendar, 
  Search, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  FileCheck, 
  Layers, 
  Clock, 
  Upload, 
  QrCode, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Shield, 
  Award, 
  Lock, 
  Info, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Printer, 
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Receipt,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  ChevronRight,
  Briefcase,
  Landmark,
  Home,
  UploadCloud,
  Eye,
  Trash2,
  CheckSquare,
  RefreshCw,
  Users,
  Banknote,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { TabType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './ui/LanguageToggle';

interface BusinessPermitModuleProps {
  onNavigateToTab?: (tab: TabType) => void;
  onAddNewApplication?: (applicantName: string, permitType?: string) => void;
  onNavigateToDashboard?: () => void;
  initialView?: MainViewMode;
}

type MainViewMode = 
  | 'preview'
  | 'hub' 
  | 'new_app' 
  | 'renewal' 
  | 'amendment' 
  | 'pay_tax' 
  | 'special_permit' 
  | 'ctc_pulling' 
  | 'verification' 
  | 'safe_seal';

export const BusinessPermitModule: React.FC<BusinessPermitModuleProps> = ({
  onNavigateToTab,
  onAddNewApplication,
  onNavigateToDashboard,
  initialView
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, language } = useLanguage();
  const isAdmin = user?.role === 'admin';
  const [currentView, setCurrentView] = useState<MainViewMode>(initialView || 'preview');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Requirements Modal state
  const [isReqModalOpen, setIsReqModalOpen] = useState<boolean>(false);

  // =========================================================================
  // UPLOAD-FIRST WIZARD: STATE MANAGEMENT & EXTRACTION ENGINES
  // =========================================================================
  // Wizard Steps: 1=Reg Doc, 2=Proof of Address, 3=Owner ID, 4=Operations & Tax, 5=Review & Submit, 6=Success & Tracking
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [isSubmittingApp, setIsSubmittingApp] = useState<boolean>(false);
  const [submittedRefNo, setSubmittedRefNo] = useState<string>('BP-2026-004819');
  const [swornDeclared, setSwornDeclared] = useState<boolean>(true);

  // STEP 1: Registration Document State
  const [regFile, setRegFile] = useState<File | null>(null);
  const [regFileName, setRegFileName] = useState<string>('DTI_Business_Name_ABC_Trading.jpg');
  const [regImagePreview, setRegImagePreview] = useState<string | null>('/New Application.jpg');
  const [regDetectedType, setRegDetectedType] = useState<string>('DTI Business Name Registration');
  const [regIsExtracting, setRegIsExtracting] = useState<boolean>(false);
  const [regExtracted, setRegExtracted] = useState<boolean>(true);
  const [regConfidence, setRegConfidence] = useState<number>(99.4);
  const [regIsEditing, setRegIsEditing] = useState<boolean>(false);
  const [regData, setRegData] = useState({
    businessName: 'ABC Trading',
    registeredOwner: 'Juan Dela Cruz',
    registrationNumber: 'DTI-NCR-2025-081924',
    registrationDate: 'January 15, 2025',
    businessAddress: 'Unit 402, 123 Quezon Avenue, Barangay San Antonio, Quezon City',
    businessActivity: 'Retail Sale of Consumer Electronics & General Merchandise',
    psicCode: '4741 - Retail sale of information and communication equipment',
    orgType: 'Sole Proprietorship',
    tin: '284-918-301-000',
    validUntil: 'January 15, 2030'
  });

  // STEP 2: Proof of Address State
  const [locFile, setLocFile] = useState<File | null>(null);
  const [locFileName, setLocFileName] = useState<string>('Barangay_Business_Clearance_2025.jpg');
  const [locImagePreview, setLocImagePreview] = useState<string | null>('/Renewal.jpg');
  const [locDetectedType, setLocDetectedType] = useState<string>('Contract of Lease (Notarized)');
  const [locIsExtracting, setLocIsExtracting] = useState<boolean>(false);
  const [locExtracted, setLocExtracted] = useState<boolean>(true);
  const [locConfidence, setLocConfidence] = useState<number>(98.9);
  const [locIsEditing, setLocIsEditing] = useState<boolean>(false);
  const [locData, setLocData] = useState({
    businessAddress: 'Unit 402, 123 Quezon Avenue, Barangay San Antonio, Quezon City',
    barangay: 'Barangay San Antonio',
    city: 'Quezon City',
    lessorName: 'Ayala Commercial Land Corp.',
    floorArea: '85.50',
    monthlyRental: '35,000.00',
    propertyType: 'Commercial Leased Space',
    networkSynced: true
  });

  // STEP 3: Owner Government ID State
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idFileName, setIdFileName] = useState<string>('Philippine_National_ID_Juan_Dela_Cruz.jpg');
  const [idImagePreview, setIdImagePreview] = useState<string | null>('/Amendment.jpg');
  const [idDetectedType, setIdDetectedType] = useState<string>('Philippine National ID (PhilID)');
  const [idIsExtracting, setIdIsExtracting] = useState<boolean>(false);
  const [idExtracted, setIdExtracted] = useState<boolean>(true);
  const [idConfidence, setIdConfidence] = useState<number>(99.2);
  const [idIsEditing, setIdIsEditing] = useState<boolean>(false);
  const [idData, setIdData] = useState({
    fullName: 'Juan M. Dela Cruz',
    idType: 'Philippine National ID (PhilID)',
    idNumber: '1234-5678-9012-3456',
    dateOfBirth: 'August 20, 1985',
    nationality: 'Filipino',
    expiryDate: 'Perpetual / Lifetime',
    ownerMatch: '100% Match with DTI Registered Owner'
  });

  // STEP 4: Operational & Tax Assessment State
  const [opsData, setOpsData] = useState({
    contactPhone: '+63 917 555 0192',
    contactEmail: user?.email || 'applicant.delacruz@example.com',
    emergencyContactName: 'Maria Santos Dela Cruz',
    emergencyContactPhone: '+63 918 987 6543',
    capitalInvestment: '500,000.00',
    employeeCount: '4',
    deliveryVehicles: '1'
  });

  // Handlers for Sample Presets & File Uploads
  const handleSelectSampleReg = (type: 'dti' | 'sec' | 'cda' | 'hoa') => {
    setRegIsExtracting(true);
    setRegExtracted(false);
    setTimeout(() => {
      if (type === 'dti') {
        setRegFileName('DTI_Business_Name_ABC_Trading.jpg');
        setRegImagePreview('/New Application.jpg');
        setRegDetectedType('DTI Business Name Registration');
        setRegConfidence(99.4);
        setRegData({
          businessName: 'ABC Trading',
          registeredOwner: 'Juan Dela Cruz',
          registrationNumber: 'DTI-NCR-2025-081924',
          registrationDate: 'January 15, 2025',
          businessAddress: 'Unit 402, 123 Quezon Avenue, Barangay San Antonio, Quezon City',
          businessActivity: 'Retail Sale of Consumer Electronics & General Merchandise',
          psicCode: '4741 - Retail sale of information and communication equipment',
          orgType: 'Sole Proprietorship',
          tin: '284-918-301-000',
          validUntil: 'January 15, 2030'
        });
      } else if (type === 'sec') {
        setRegFileName('SEC_Certificate_Apex_Global_Tech.jpg');
        setRegImagePreview('/Renewal.jpg');
        setRegDetectedType('SEC Certificate of Incorporation');
        setRegConfidence(98.8);
        setRegData({
          businessName: 'Apex Global Tech Solutions Inc.',
          registeredOwner: 'Maria Clara Santos (President & CEO)',
          registrationNumber: 'CS2024-0091823',
          registrationDate: 'March 10, 2024',
          businessAddress: '8th Floor, Cyber Tower 1, Commonwealth Avenue, Quezon City',
          businessActivity: 'Software Development, IT Consulting & Cloud Services',
          psicCode: '6201 - Computer programming activities',
          orgType: 'Corporation',
          tin: '009-842-175-000',
          validUntil: 'Perpetual'
        });
      } else if (type === 'cda') {
        setRegFileName('CDA_Registration_Bagong_Silang_Coop.jpg');
        setRegImagePreview('/Special Permit.jpg');
        setRegDetectedType('CDA Registration Certificate');
        setRegConfidence(99.1);
        setRegData({
          businessName: 'Bagong Silang Multi-Purpose Cooperative',
          registeredOwner: 'Roberto M. Gomez (Chairman)',
          registrationNumber: 'CDA-NCR-9520-1049',
          registrationDate: 'November 22, 2023',
          businessAddress: 'Block 14 Lot 8, Katipunan Extension, Quezon City',
          businessActivity: 'Credit & Consumer Goods Cooperative Distribution',
          psicCode: '6492 - Other credit granting',
          orgType: 'Cooperative',
          tin: '410-829-330-000',
          validUntil: 'Active Good Standing'
        });
      } else {
        setRegFileName('HOA_Commercial_Authorization_Greenhills.jpg');
        setRegImagePreview('/Amendment.jpg');
        setRegDetectedType('HOA Registration & Authorization Document');
        setRegConfidence(97.6);
        setRegData({
          businessName: 'Greenhills Heights Home Enterprise',
          registeredOwner: 'Elena V. Reyes',
          registrationNumber: 'HOA-QC-2025-0412',
          registrationDate: 'February 01, 2025',
          businessAddress: '12 Emerald Street, Greenhills Subdivision, Quezon City',
          businessActivity: 'Catering Services, Bakery & Confectionery',
          psicCode: '1071 - Manufacture of bakery products',
          orgType: 'Home-Based Micro Enterprise',
          tin: '198-442-701-000',
          validUntil: 'December 31, 2025'
        });
      }
      setRegIsExtracting(false);
      setRegExtracted(true);
    }, 1200);
  };

  const handleRegFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRegFile(file);
    setRegFileName(file.name);
    setRegIsExtracting(true);
    setRegExtracted(false);

    if (file.type.startsWith('image/')) {
      try {
        setRegImagePreview(URL.createObjectURL(file));
      } catch (err) {
        console.warn('Preview object URL error:', err);
      }
    }
    
    const lower = file.name.toLowerCase();
    let detected = 'DTI Business Name Registration';
    if (lower.includes('sec') || lower.includes('corp') || lower.includes('inc')) {
      detected = 'SEC Registration';
    } else if (lower.includes('cda') || lower.includes('coop')) {
      detected = 'CDA Registration';
    } else if (lower.includes('hoa') || lower.includes('home')) {
      detected = 'HOA Registration/Authorization Document';
    }
    
    setTimeout(() => {
      setRegDetectedType(detected);
      setRegConfidence(99.4);
      setRegData(prev => ({
        ...prev,
        businessName: prev.businessName || 'ABC Trading'
      }));
      setRegIsExtracting(false);
      setRegExtracted(true);
    }, 1400);
  };

  const handleSelectSampleLoc = (type: 'lease' | 'brgy') => {
    setLocIsExtracting(true);
    setLocExtracted(false);
    setTimeout(() => {
      if (type === 'lease') {
        setLocFileName('Notarized_Lease_Contract_Ayala.jpg');
        setLocImagePreview('/Renewal.jpg');
        setLocDetectedType('Contract of Lease (Notarized)');
        setLocConfidence(98.9);
        setLocData({
          businessAddress: 'Unit 402, 123 Quezon Avenue, Barangay San Antonio, Quezon City',
          barangay: 'Barangay San Antonio',
          city: 'Quezon City',
          lessorName: 'Ayala Commercial Land Corp.',
          floorArea: '85.50',
          monthlyRental: '35,000.00',
          propertyType: 'Commercial Leased Space',
          networkSynced: true
        });
      } else {
        setLocFileName('Barangay_Business_Clearance_2025.jpg');
        setLocImagePreview('/Special Permit.jpg');
        setLocDetectedType('Barangay Business Clearance');
        setLocConfidence(99.6);
        setLocData({
          businessAddress: '123 Quezon Avenue, Barangay San Antonio, Quezon City',
          barangay: 'Barangay San Antonio',
          city: 'Quezon City',
          lessorName: 'Commercial Property Owner',
          floorArea: '90.00',
          monthlyRental: 'N/A (Owner Occupied)',
          propertyType: 'Commercial Owned',
          networkSynced: true
        });
      }
      setLocIsExtracting(false);
      setLocExtracted(true);
    }, 1100);
  };

  const handleLocFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocFile(file);
    setLocFileName(file.name);
    setLocIsExtracting(true);
    setLocExtracted(false);
    
    if (file.type.startsWith('image/')) {
      try {
        setLocImagePreview(URL.createObjectURL(file));
      } catch (err) {
        console.warn('Loc preview error:', err);
      }
    }

    setTimeout(() => {
      setLocDetectedType('Contract of Lease (Notarized)');
      setLocConfidence(98.7);
      setLocIsExtracting(false);
      setLocExtracted(true);
    }, 1300);
  };

  const handleSelectSampleId = (type: 'philid' | 'license') => {
    setIdIsExtracting(true);
    setIdExtracted(false);
    setTimeout(() => {
      if (type === 'philid') {
        setIdFileName('Philippine_National_ID_Juan_Dela_Cruz.jpg');
        setIdImagePreview('/Amendment.jpg');
        setIdDetectedType('Philippine National ID (PhilID)');
        setIdConfidence(99.2);
        setIdData({
          fullName: 'Juan M. Dela Cruz',
          idType: 'Philippine National ID (PhilID)',
          idNumber: '1234-5678-9012-3456',
          dateOfBirth: 'August 20, 1985',
          nationality: 'Filipino',
          expiryDate: 'Perpetual / Lifetime',
          ownerMatch: '100% Match with Registered Owner'
        });
      } else {
        setIdFileName('LTO_Drivers_License_Juan_Dela_Cruz.jpg');
        setIdImagePreview('/New Application.jpg');
        setIdDetectedType("Land Transportation Office Driver's License");
        setIdConfidence(99.5);
        setIdData({
          fullName: 'Juan M. Dela Cruz',
          idType: "Driver's License",
          idNumber: 'N01-85-123984',
          dateOfBirth: 'August 20, 1985',
          nationality: 'Filipino',
          expiryDate: '2030-08-20',
          ownerMatch: '100% Match with Registered Owner'
        });
      }
      setIdIsExtracting(false);
      setIdExtracted(true);
    }, 1100);
  };

  const handleIdFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIdFile(file);
    setIdFileName(file.name);
    setIdIsExtracting(true);
    setIdExtracted(false);

    if (file.type.startsWith('image/')) {
      try {
        setIdImagePreview(URL.createObjectURL(file));
      } catch (err) {
        console.warn('ID preview error:', err);
      }
    }
    
    setTimeout(() => {
      setIdDetectedType('Philippine National ID (PhilID)');
      setIdConfidence(99.1);
      setIdIsExtracting(false);
      setIdExtracted(true);
    }, 1300);
  };

  const handleSubmitUploadFirstApplication = () => {
    setIsSubmittingApp(true);
    const newRef = `BP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setTimeout(() => {
      setSubmittedRefNo(newRef);
      setIsSubmittingApp(false);
      setWizardStep(6);
      if (onAddNewApplication) {
        onAddNewApplication(regData.registeredOwner, 'Business Permit (New)');
      }
    }, 1500);
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // =========================================================================
  // CARD 1: APPLICATION ONLINE - STATE MANAGEMENT
  // =========================================================================
  
  // 1. New Application (7-Step Wizard)
  const [newAppStep, setNewAppStep] = useState<number>(1);
  const [newAppTermsAccepted, setNewAppTermsAccepted] = useState<boolean>(false);
  const [newAppData, setNewAppData] = useState({
    dtiSecNo: 'DTI-NCR-2025-99214',
    tin: '123-456-789-000',
    businessName: 'Apex Innovations Retail Hub',
    tradeName: 'Apex Innovations',
    orgType: 'Sole Proprietorship',
    unitNo: 'Unit 402, 4th Floor',
    street: '123 Ayala Avenue',
    barangay: 'Barangay San Antonio',
    city: 'Quezon City',
    province: 'Metro Manila',
    zipCode: '1105',
    floorArea: '120.5',
    ownershipType: 'Rented',
    lessorName: 'Ayala Commercial Land Corp.',
    lessorContact: '+63 917 123 4567',
    employeeCount: '8',
    deliveryVehicles: '2',
    lineOfBusiness: 'Retail of Consumer Electronics & Accessories',
    psicCode: '4741 - Retail sale of information and communication equipment',
    capitalInvestment: '1,500,000.00',
    natureOfActivity: 'Commercial Retail & After-sales Service',
    emergencyContactName: 'Maria Santos',
    emergencyContactPhone: '+63 918 987 6543',
    environmentalCertNo: 'ECC-NCR-2024-8841'
  });
  const [newAppSuccessRef, setNewAppSuccessRef] = useState<string | null>(null);

  // 2. Renewal State
  const [renewalPermitNo, setRenewalPermitNo] = useState<string>('BP-2024-00123');
  const [renewalOrNo, setRenewalOrNo] = useState<string>('OR-2024-88491');
  const [renewalRecord, setRenewalRecord] = useState<any>(null);
  const [renewalGrossSales, setRenewalGrossSales] = useState<string>('2,850,000.00');
  const [renewalSubmitted, setRenewalSubmitted] = useState<boolean>(false);

  // 3. Amendment State
  const [amendPermitNo, setAmendPermitNo] = useState<string>('BP-2024-00123');
  const [amendOrNo, setAmendOrNo] = useState<string>('OR-2024-88491');
  const [amendRecord, setAmendRecord] = useState<any>(null);
  const [amendmentType, setAmendmentType] = useState<'trade_name' | 'address' | 'line_of_business' | 'ownership'>('trade_name');
  const [amendedValue, setAmendedValue] = useState<string>('Apex Global Tech & Retail Enterprise');
  const [amendProofFile, setAmendProofFile] = useState<string | null>('DTI_Amended_Certificate_2025.pdf');
  const [amendSubmitted, setAmendSubmitted] = useState<boolean>(false);

  // 4. Pay Business Tax State
  const [taxBin, setTaxBin] = useState<string>('BP-2024-00123');
  const [taxPaymentMethod, setTaxPaymentMethod] = useState<'gcash' | 'maya' | 'landbank' | 'eprovider'>('gcash');
  const [taxPaymentReceipt, setTaxPaymentReceipt] = useState<any>(null);
  const [isProcessingTax, setIsProcessingTax] = useState<boolean>(false);

  // 5. Special Permit (Short Term / Event) State
  const [specialStep, setSpecialStep] = useState<number>(1);
  const [specialTermsAccepted, setSpecialTermsAccepted] = useState<boolean>(false);
  const [specialData, setSpecialData] = useState({
    businessName: 'Apex Innovations Retail Hub',
    eventTitle: 'QC Mid-Year Tech Expo & Electronics Bazaar 2025',
    venue: 'Quezon City Memorial Circle Grand Pavilion',
    startDate: '2025-09-15',
    endDate: '2025-09-20',
    operatingHours: '09:00 AM - 09:00 PM',
    expectedAttendees: '5,000 attendees / day',
    organizerName: 'Juan Dela Cruz',
    organizerContact: '+63 917 888 1234',
    boothCount: '45 display booths'
  });
  const [specialSubmitted, setSpecialSubmitted] = useState<boolean>(false);

  // Status Search State
  const [statusSearchCode, setStatusSearchCode] = useState<string>('');
  const [statusSearchResult, setStatusSearchResult] = useState<any>(null);

  // Request for E-Copy Modal State
  const [ecopyModalOpen, setEcopyModalOpen] = useState<boolean>(false);
  const [ecopyPermitNo, setEcopyPermitNo] = useState<string>('BP-2024-00123');
  const [ecopyGenerated, setEcopyGenerated] = useState<boolean>(false);

  // =========================================================================
  // CARD 2: BUSINESS INFORMATION SYSTEM (CTC PULLING) - STATE MANAGEMENT
  // =========================================================================
  const [ctcStep, setCtcStep] = useState<number>(1);
  const [ctcPermitNo, setCtcPermitNo] = useState<string>('BP-2024-00123');
  const [ctcBusinessName, setCtcBusinessName] = useState<string>('Apex Innovations Retail Hub');
  const [ctcRequestorName, setCtcRequestorName] = useState<string>(user?.name || 'Juan Dela Cruz');
  const [ctcRequestorContact, setCtcRequestorContact] = useState<string>('+63 917 555 4321');
  const [ctcRequestorEmail, setCtcRequestorEmail] = useState<string>(user?.email || 'juan.delacruz@govserve.ph');
  const [ctcIdType, setCtcIdType] = useState<string>('Philippine National ID (PhilID)');
  const [ctcIdNumber, setCtcIdNumber] = useState<string>('1234-5678-9012-3456');
  const [ctcRelation, setCtcRelation] = useState<string>('Business Owner / Registered Proprietor');
  const [ctcSelectedDocs, setCtcSelectedDocs] = useState<string[]>([
    'Certified True Copy of Mayor\'s Permit (Current Year)'
  ]);
  const [ctcPrivacyAgreed, setCtcPrivacyAgreed] = useState<boolean>(true);
  const [ctcIdUploaded, setCtcIdUploaded] = useState<boolean>(true);
  const [ctcReqRef, setCtcReqRef] = useState<string>('CTC-REQ-2025-00892');
  const [ctcAdminConfirmed, setCtcAdminConfirmed] = useState<boolean>(true);
  const [ctcAssessmentNo, setCtcAssessmentNo] = useState<string>('OP-CTC-2025-8842');
  const [ctcPaymentMethod, setCtcPaymentMethod] = useState<'gcash' | 'maya' | 'landbank' | 'card'>('gcash');
  const [ctcPaid, setCtcPaid] = useState<boolean>(false);
  const [ctcOrNo, setCtcOrNo] = useState<string>('OR-CTC-2025-77291');
  const [ctcIsProcessingPayment, setCtcIsProcessingPayment] = useState<boolean>(false);

  // =========================================================================
  // CARD 3: MAYOR'S PERMIT VERIFICATION - STATE MANAGEMENT
  // =========================================================================
  const [verifQuery, setVerifQuery] = useState<string>('BP-2024-00123');
  const [verifResult, setVerifResult] = useState<any>({
    permitNumber: 'BP-2024-00123',
    bin: 'BIN-QC-2024-88319',
    businessName: 'Apex Innovations Retail Hub',
    tradeName: 'Apex Innovations',
    ownerName: 'Juan Dela Cruz',
    address: 'Unit 402, 4th Floor, 123 Ayala Avenue, Brgy. San Antonio, QC',
    status: 'ACTIVE & VALID',
    validUntil: 'December 31, 2025',
    fsicStatus: 'COMPLIANT (FSIC-2025-00412)',
    sanitaryStatus: 'COMPLIANT (SAN-2025-9912)',
    zoningStatus: 'APPROVED (ZON-2025-441)',
    birTin: '123-456-789-000',
    qrHash: 'a7f92e3184bc912389adfe66201a4bc5'
  });
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // =========================================================================
  // CARD 4: SAFE SEAL (QC SAFE SEAL CERTIFICATION) - STATE MANAGEMENT
  // =========================================================================
  const [safePermitNo, setSafePermitNo] = useState<string>('BP-2024-00123');
  const [safeValidated, setSafeValidated] = useState<boolean>(true);
  const [safeFormData, setSafeFormData] = useState({
    businessName: 'Apex Innovations Retail Hub',
    address: 'Unit 402, 4th Floor, 123 Ayala Avenue, Brgy. San Antonio, QC',
    category: 'Commercial Retail / Electronics',
    employeeCount: '8 Employees',
    operatingHours: '09:00 AM - 09:00 PM',
    contactPerson: 'Juan Dela Cruz (General Manager)',
    contactNumber: '+63 917 123 4567',
    checklist: {
      antiTraffickingPolicy: true,
      hotlineSignagesPosted: true,
      employeeBackgroundVerified: true,
      cctvMonitoringPublicAreas: true,
      genderResponsiveWorkplace: true
    }
  });
  const [safeSealIssued, setSafeSealIssued] = useState<boolean>(false);

  // Copy helper
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      
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
                  Mayor's Permit & Business Licensing Hub
                </p>
              </div>
            </div>

            {/* Right: Quick Action Controls, Dark Mode & Profile */}
            <div className="flex items-center space-x-3">
              


              {/* Home Navigation Button */}
              <button
                onClick={() => onNavigateToTab ? onNavigateToTab('Home') : setCurrentView('preview')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 shadow-xs"
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
        <div className="hidden dark:block absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="hidden dark:block absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-3">
          {currentView !== 'preview' && (
            <div className="flex justify-end">
              <button
                onClick={() => setCurrentView('preview')}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <ArrowLeft size={13} />
                <span>Return to Business Overview</span>
              </button>
            </div>
          )}

          <div className="space-y-2 max-w-4xl">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Business Permits & Licensing Portal
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Review official business regulatory fee schedules, municipal tax tariffs, and documentary prerequisites before filing your enterprise application.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAIN BODY CONTAINER */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-9">

        {/* ========================================================================= */}
        {/* PREVIEW PAGE: OFFICIAL BUSINESS FEE SCHEDULE & REGULATORY TARIFF GUIDE */}
        {/* ========================================================================= */}
        {currentView === 'preview' && (
          <div className="space-y-8 animate-in fade-in pb-10">
            
            {/* ========================================================================= */}
            {/* TOP GATEWAY ACTION CTA */}
            {/* ========================================================================= */}
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-black">
                  Ready to Start Your Business Permit Application?
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                  Proceed to register a new commercial enterprise, renew your existing license, or file business record amendments.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setNewAppStep(1);
                    setNewAppTermsAccepted(true);
                    setCurrentView('new_app');
                  }}
                  className="px-8 py-4 bg-white hover:bg-slate-100 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-lg transition-all flex items-center space-x-2 cursor-pointer active:scale-[0.98]"
                >
                  <span>Start New Application</span>
                  <ArrowRight size={16} strokeWidth={3} className="text-blue-600" />
                </button>
              </div>
            </div>
            
            {/* ========================================================================= */}
            {/* ========================================================================= */}
            {/* HERO SECTION: OFFICIAL BUSINESS ONE STOP SHOP (BOSS) REFERENCE DESIGN */}
            {/* ========================================================================= */}
            <div className="relative rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-slate-900 via-[#071d3d] to-slate-950 border border-sky-500/30 text-white shadow-xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-sky-500/25 transition-all duration-700" />
              <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center space-x-3">
                    <span className="px-3.5 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-sky-500/20 text-sky-300 border border-sky-400/30">
                      Commercial & Retail
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                      Business Permit
                    </h2>
                    <p className="text-sm font-semibold text-sky-300 mt-1">
                      Business Permit Services
                    </p>
                  </div>

                  {/* Picture 2 Style 5 Feature Rows with Circular Badges */}
                  <div className="space-y-2.5 pt-2 border-t border-white/10">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0288d1] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <Users size={16} />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-white block">Target Users</span>
                        <span className="text-slate-300">Business owners in Quezon City (including Nano Enterprises)</span>
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
                        <span className="text-slate-300">3 days upon approval of Initial Evaluation</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0288d1] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <Banknote size={16} />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-white block">Charges & Payment</span>
                        <span className="text-slate-300">Depends on the business of the QCitizen</span>
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
                      <span>Document Photo & Picture Upload Active</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Upload clear photos or pictures of your DTI/SEC certificate, Barangay Clearance, Cedula, and Valid Government ID with instant AI OCR recognition.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                        <FileText size={10} className="text-sky-300" /> DTI / SEC
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                        <FileText size={10} className="text-sky-300" /> Barangay Clearance
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                        <FileText size={10} className="text-sky-300" /> Cedula / CTC
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                        <FileText size={10} className="text-sky-300" /> Valid Gov ID
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary & Secondary Action Controls */}
                <div className="w-full lg:w-80 flex flex-col space-y-3 flex-shrink-0">
                  <button
                    onClick={() => {
                      setWizardStep(1);
                      setCurrentView('new_app');
                    }}
                    className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5 cursor-pointer group/btn"
                  >
                    <span>Apply for Business Permit →</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setRenewalSubmitted(false);
                        setCurrentView('renewal');
                      }}
                      className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <RotateCw size={13} />
                      <span>Renew Permit</span>
                    </button>
                    <button
                      onClick={() => setIsReqModalOpen(true)}
                      className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Info size={13} />
                      <span>View Requirements</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 3 EXPANDED SERVICE MODULE CARDS (SAME FORMAT AS BUSINESS ONE STOP SHOP) */}
            {/* ========================================================================= */}
            <div className="space-y-6">
              
              {/* ======================================================================= */}
              {/* CARD 1: ANNUAL LICENSE RENEWAL (IDENTICAL HORIZONTAL DESIGN TO PICTURE 1) */}
              {/* ======================================================================= */}
              <div className="relative rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-slate-900 via-[#06241a] to-slate-950 border border-emerald-500/30 text-white shadow-xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/25 transition-all duration-700" />
                <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center space-x-3">
                      <span className="px-3.5 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        Commercial & Retail
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
                        <RotateCw className="text-emerald-400" size={26} />
                        <span>License Renewal</span>
                      </h2>
                      <p className="text-xs sm:text-sm font-medium text-emerald-300/90 mt-1">
                        License Renewal Services
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
                          <span className="text-slate-300">Registered QC businesses with existing Mayor's Permit and Tax Clearances</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Building2 size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Service Method</span>
                          <span className="text-slate-300">Online renewal via GovServe Services (with prior Year Permit No. & OR)</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Clock size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Time Period</span>
                          <span className="text-slate-300">1 to 2 working days upon verification of submitted gross sales</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Banknote size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Charges & Payment</span>
                          <span className="text-slate-300">₱3,850.00 Base Regulatory Tariff + LBT (Local Business Tax)</span>
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

                    {/* Document Photo Upload Callout with exact Chips from Picture 2 */}
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                      <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold">
                        <Camera size={15} className="text-emerald-400" />
                        <span>Document Photo & Picture Upload Active</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Upload clear photos or pictures of Previous Year Mayor's Permit, Official Receipt (OR), Barangay Business Clearance, and ITR / Audited Financials.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-emerald-300" /> Prior Permit
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-emerald-300" /> Official Receipt
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-emerald-300" /> Brgy. Renewal
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-emerald-300" /> Gross Sales / ITR
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary & Secondary Action Controls */}
                  <div className="w-full lg:w-80 flex flex-col space-y-3 flex-shrink-0">
                    <button
                      onClick={() => {
                        setRenewalSubmitted(false);
                        setCurrentView('renewal');
                      }}
                      className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5 cursor-pointer group/btn"
                    >
                      <span>Renew Business License →</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setRenewalSubmitted(false);
                          setCurrentView('renewal');
                        }}
                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Banknote size={13} className="text-emerald-400" />
                        <span>Base Tariff: ₱3,850</span>
                      </button>
                      <button
                        onClick={() => setIsReqModalOpen(true)}
                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Info size={13} />
                        <span>Requirements</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* CARD 2: BUSINESS AMENDMENT (IDENTICAL HORIZONTAL DESIGN TO PICTURE 1) */}
              {/* ======================================================================= */}
              <div className="relative rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-slate-900 via-[#1e0a2e] to-slate-950 border border-purple-500/30 text-white shadow-xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/25 transition-all duration-700" />
                <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center space-x-3">
                      <span className="px-3.5 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-400/30">
                        Corporate & Legal
                      </span>
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center space-x-1.5">
                        <Edit3 size={12} className="text-purple-400" />
                        <span>Registry Modification</span>
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
                        <Edit3 className="text-purple-400" size={26} />
                        <span>Business Amendment</span>
                      </h2>
                      <p className="text-xs sm:text-sm font-medium text-purple-300/90 mt-1">
                        Modification of Trade Name, Address, Capital, or Ownership
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
                          <span className="text-slate-300">QC business owners updating business address, trade name, or lines</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Building2 size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Service Method</span>
                          <span className="text-slate-300">Online filing via GovServe Services – Business Amendment & Registry Revision</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Clock size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Time Period</span>
                          <span className="text-slate-300">2 to 3 days upon submission of amended national registration certificate</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Banknote size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Charges & Payment</span>
                          <span className="text-slate-300">₱1,500.00 Legal Tariff & Certificate Amendment Assessment</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <CreditCard size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Payment Method</span>
                          <span className="text-slate-300">Via GovServe online portal (Online Banking, e-Wallets, Over-The-Counter)</span>
                        </div>
                      </div>
                    </div>

                    {/* Document Photo Upload Callout with exact Chips from Picture 2 */}
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                      <div className="flex items-center space-x-2 text-purple-300 text-xs font-bold">
                        <Camera size={15} className="text-purple-400" />
                        <span>Document Photo & Picture Upload Active</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Upload clear photos or pictures of Amended DTI/SEC Certificate, Board Resolution, New Lease Contract (address change), and BIR Form 1905.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-purple-300" /> Amended DTI/SEC
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-purple-300" /> Board Resolution
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-purple-300" /> New Lease Photo
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-purple-300" /> BIR Form 1905
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary & Secondary Action Controls */}
                  <div className="w-full lg:w-80 flex flex-col space-y-3 flex-shrink-0">
                    <button
                      onClick={() => {
                        setAmendSubmitted(false);
                        setCurrentView('amendment');
                      }}
                      className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5 cursor-pointer group/btn"
                    >
                      <span>File Business Amendment →</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setAmendSubmitted(false);
                          setCurrentView('amendment');
                        }}
                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Banknote size={13} className="text-purple-400" />
                        <span>Legal Tariff: ₱1,500</span>
                      </button>
                      <button
                        onClick={() => setIsReqModalOpen(true)}
                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Info size={13} />
                        <span>Requirements</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* CARD 3: SPECIAL EVENT PERMIT (IDENTICAL HORIZONTAL DESIGN TO PICTURE 1) */}
              {/* ======================================================================= */}
              <div className="relative rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-slate-900 via-[#271604] to-slate-950 border border-amber-500/30 text-white shadow-xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/25 transition-all duration-700" />
                <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center space-x-3">
                      <span className="px-3.5 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30">
                        Events & Commercial
                      </span>
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1.5">
                        <Calendar size={12} className="text-amber-400" />
                        <span>Short-Term Municipal Pass</span>
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
                        <Calendar className="text-amber-400" size={26} />
                        <span>Special Event Permit</span>
                      </h2>
                      <p className="text-xs sm:text-sm font-medium text-amber-300/90 mt-1">
                        Pop-Up Bazaar, Exhibit, Showcase & Outdoor Trade Clearance
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
                          <span className="text-slate-300">Event organizers, pop-up commercial booth operators, bazaar exhibitors</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Building2 size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Service Method</span>
                          <span className="text-slate-300">Online filing via GovServe Services – Special Permits & Short-Term Municipal Activity</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Clock size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Time Period</span>
                          <span className="text-slate-300">1 to 2 days express evaluation prior to scheduled event date</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Banknote size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Charges & Payment</span>
                          <span className="text-slate-300">₱1,200.00 Standard Pass per booth / event day</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <CreditCard size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white block">Payment Method</span>
                          <span className="text-slate-300">Instant digital checkout via GovServe online portal</span>
                        </div>
                      </div>
                    </div>

                    {/* Document Photo Upload Callout with exact Chips from Picture 2 */}
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                      <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold">
                        <Camera size={15} className="text-amber-400" />
                        <span>Document Photo & Picture Upload Active</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Upload clear photos or pictures of Venue Authorization / Mall Contract, Organizer DTI/SEC Certificate, Barangay Endorsement, and Layout Plan.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-amber-300" /> Venue Contract
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-amber-300" /> Organizer DTI/SEC
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-amber-300" /> Brgy. Endorsement
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-amber-300" /> Floor Plan Layout
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary & Secondary Action Controls */}
                  <div className="w-full lg:w-80 flex flex-col space-y-3 flex-shrink-0">
                    <button
                      onClick={() => {
                        setSpecialSubmitted(false);
                        setCurrentView('special_permit');
                      }}
                      className="w-full py-4 px-6 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-amber-600/30 hover:shadow-amber-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5 cursor-pointer group/btn"
                    >
                      <span>Apply for Special Permit →</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSpecialSubmitted(false);
                          setCurrentView('special_permit');
                        }}
                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Banknote size={13} className="text-amber-400" />
                        <span>Standard Pass: ₱1,200</span>
                      </button>
                      <button
                        onClick={() => setIsReqModalOpen(true)}
                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Info size={13} />
                        <span>Requirements</span>
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
                  <span>Mandatory Documentary Checklist Before Business Filing</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Prepare scanned or digital copies of these required legal documents before initiating your transaction
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">DTI / SEC Registration</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Valid DTI Certificate of Business Name Registration or SEC Certificate of Articles of Incorporation.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Barangay Business Clearance</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Official Barangay Clearance issued by the host barangay where the commercial business operates.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Contract of Lease / TCT</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Notarized Contract of Lease, Certificate of Title (TCT), or Tax Declaration of the business premises.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">CGLI Insurance Policy</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Comprehensive General Liability Insurance (CGLI) policy covering third-party liabilities and patrons.
                  </p>
                </div>
              </div>
            </div>





          </div>
        )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: UPLOAD-FIRST BUSINESS PERMIT APPLICATION WIZARD */}
      {/* ========================================================================= */}
      {currentView === 'new_app' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-md space-y-7 animate-in fade-in">
          
          {/* Stepper Header Bar */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Business Permit Wizard • {wizardStep === 6 ? 'Submission Confirmed' : `Step ${wizardStep} of 5`}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Upload-First Zero-Typing
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                {wizardStep === 1 && <span>1. Upload Business Registration</span>}
                {wizardStep === 2 && <span>2. Upload Proof of Address</span>}
                {wizardStep === 3 && <span>3. Upload Owner Government ID</span>}
                {wizardStep === 4 && <span>4. Operations & Tax Assessment</span>}
                {wizardStep === 5 && <span>5. Final Review & Submit</span>}
                {wizardStep === 6 && <span className="text-emerald-600 font-bold">Official Application Reference Issued</span>}
              </div>
            </div>

            {/* Stepper Visual Indicators */}
            <div className="grid grid-cols-5 gap-2">
              {[
                { s: 1, label: 'Registration' },
                { s: 2, label: 'Address' },
                { s: 3, label: 'Owner ID' },
                { s: 4, label: 'Assessment' },
                { s: 5, label: 'Submit' }
              ].map((stepItem) => (
                <div key={stepItem.s} className="space-y-1">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      wizardStep >= stepItem.s 
                        ? 'bg-blue-600 dark:bg-blue-500' 
                        : 'bg-slate-200 dark:bg-slate-800'
                    }`} 
                  />
                  <p className="text-[10px] font-semibold text-slate-400 hidden sm:block truncate">
                    {stepItem.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STEP 1 — UPLOAD BUSINESS REGISTRATION */}
          {/* ========================================================================= */}
          {wizardStep === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <UploadCloud className="text-blue-600" size={22} />
                  <span>Upload Business Registration</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Instead of manually typing business information, upload your official business registration certificate. Our AI extraction engine will automatically identify the document type and extract all business information.
                </p>
              </div>

              {/* Supported Documents Badges */}
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-blue-600" />
                    <span>Supported Registration Documents:</span>
                  </span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-semibold">
                    Formats: PDF, JPG, JPEG, PNG (Max 25MB)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-800/50 flex items-center space-x-2">
                    <FileText size={14} className="text-blue-600 flex-shrink-0" />
                    <span className="font-semibold text-[11px] text-slate-800 dark:text-slate-200 truncate">DTI Registration</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-800/50 flex items-center space-x-2">
                    <Building size={14} className="text-indigo-600 flex-shrink-0" />
                    <span className="font-semibold text-[11px] text-slate-800 dark:text-slate-200 truncate">SEC Registration</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-800/50 flex items-center space-x-2">
                    <Award size={14} className="text-emerald-600 flex-shrink-0" />
                    <span className="font-semibold text-[11px] text-slate-800 dark:text-slate-200 truncate">CDA Registration</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-800/50 flex items-center space-x-2">
                    <Home size={14} className="text-amber-600 flex-shrink-0" />
                    <span className="font-semibold text-[11px] text-slate-800 dark:text-slate-200 truncate">HOA Authorization</span>
                  </div>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="space-y-3">
                <div className="relative border-2 border-dashed border-blue-300 dark:border-blue-800/80 hover:border-blue-500 rounded-3xl p-8 bg-slate-50/50 dark:bg-slate-800/20 text-center transition-all group">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleRegFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="space-y-3 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                      <UploadCloud size={30} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Drop your registration document here, or <span className="text-blue-600 dark:text-blue-400 underline">browse files</span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Upload official certificate from DTI, SEC, CDA, or HOA
                      </p>
                    </div>
                    {regFileName && (
                      <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-xs font-mono text-blue-700 dark:text-blue-300">
                        <FileCheck size={14} className="text-blue-600" />
                        <span>Current file: {regFileName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Instant Test Presets (Zero manual typing needed for testing) */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Quick Sample Presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectSampleReg('dti')}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-400 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <span>Try Sample DTI Certificate</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectSampleReg('sec')}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-400 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <span>Try Sample SEC Certificate</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectSampleReg('cda')}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-400 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <span>Try Sample CDA Registration</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectSampleReg('hoa')}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-400 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <span>Try Sample HOA Authorization</span>
                    </button>
                  </div>
                </div>

                {/* Document Picture Preview (Live Photo View) */}
                {regImagePreview && (
                  <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Camera size={16} className="text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Uploaded Registration Document Photo Preview
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          ✓ Photo Loaded
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {regFileName}
                      </span>
                    </div>

                    <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900/5 max-h-56 flex items-center justify-center group/img">
                      <img 
                        src={regImagePreview} 
                        alt="Registration Document Picture" 
                        className="w-full max-h-56 object-contain rounded-lg transition-transform group-hover/img:scale-[1.01]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Extraction Progress Overlay */}
              {regIsExtracting && (
                <div className="p-6 rounded-3xl bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center space-x-4 animate-pulse">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 animate-spin">
                    <RefreshCw size={20} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                      Extracting Business Information...
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Analyzing certificate geometry, detecting issuing authority, and parsing trade records...
                    </p>
                  </div>
                </div>
              )}

              {/* Extracted Information Review Card (UPLOAD -> EXTRACT -> REVIEW) */}
              {regExtracted && !regIsExtracting && (
                <div className="rounded-3xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 p-6 sm:p-7 space-y-5 animate-in fade-in">
                  
                  {/* Document Detection Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-600 text-white flex items-center space-x-1.5 shadow-xs">
                          <CheckCircle2 size={13} />
                          <span>Document Detected</span>
                        </span>
                        <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                          {regDetectedType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        Source: {regFileName} • Confidence: {regConfidence}% • Tamper-Free Verified
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setRegIsEditing(!regIsEditing)}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
                      >
                        <Edit3 size={13} />
                        <span>{regIsEditing ? 'Save Edits' : 'Quick Correct / Edit'}</span>
                      </button>
                    </div>
                  </div>

                  {/* REVIEW CARD CONTENT: Business Information Found */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                        <Building2 size={16} className="text-blue-600" />
                        <span>Business Information Found</span>
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        {regIsEditing ? 'Edit mode enabled' : 'Auto-extracted from uploaded certificate'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      
                      {/* Business Name */}
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Business Name</span>
                        {regIsEditing ? (
                          <input
                            type="text"
                            value={regData.businessName}
                            onChange={(e) => setRegData({ ...regData, businessName: e.target.value })}
                            className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border rounded-lg font-bold text-xs"
                          />
                        ) : (
                          <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                            {regData.businessName}
                          </p>
                        )}
                      </div>

                      {/* Registered Owner */}
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registered Owner</span>
                        {regIsEditing ? (
                          <input
                            type="text"
                            value={regData.registeredOwner}
                            onChange={(e) => setRegData({ ...regData, registeredOwner: e.target.value })}
                            className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border rounded-lg font-bold text-xs"
                          />
                        ) : (
                          <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                            {regData.registeredOwner}
                          </p>
                        )}
                      </div>

                      {/* Registration Number */}
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registration Number</span>
                        {regIsEditing ? (
                          <input
                            type="text"
                            value={regData.registrationNumber}
                            onChange={(e) => setRegData({ ...regData, registrationNumber: e.target.value })}
                            className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border rounded-lg font-mono font-bold text-xs"
                          />
                        ) : (
                          <p className="font-mono font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                            {regData.registrationNumber}
                          </p>
                        )}
                      </div>

                      {/* Registration Date */}
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registration Date</span>
                        {regIsEditing ? (
                          <input
                            type="text"
                            value={regData.registrationDate}
                            onChange={(e) => setRegData({ ...regData, registrationDate: e.target.value })}
                            className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border rounded-lg font-bold text-xs"
                          />
                        ) : (
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            {regData.registrationDate}
                          </p>
                        )}
                      </div>

                      {/* Form of Organization */}
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Organization Type</span>
                        {regIsEditing ? (
                          <input
                            type="text"
                            value={regData.orgType}
                            onChange={(e) => setRegData({ ...regData, orgType: e.target.value })}
                            className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border rounded-lg font-bold text-xs"
                          />
                        ) : (
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            {regData.orgType}
                          </p>
                        )}
                      </div>

                      {/* TIN */}
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tax Identification No. (TIN)</span>
                        <p className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {regData.tin}
                        </p>
                      </div>

                      {/* Business Address (Spans 2 cols) */}
                      <div className="sm:col-span-2 p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Business Address</span>
                        {regIsEditing ? (
                          <input
                            type="text"
                            value={regData.businessAddress}
                            onChange={(e) => setRegData({ ...regData, businessAddress: e.target.value })}
                            className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border rounded-lg font-bold text-xs"
                          />
                        ) : (
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            {regData.businessAddress}
                          </p>
                        )}
                      </div>

                      {/* Business Activity (Spans full or 3 cols) */}
                      <div className="sm:col-span-2 lg:col-span-3 p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Business Activity / PSIC</span>
                        {regIsEditing ? (
                          <input
                            type="text"
                            value={regData.businessActivity}
                            onChange={(e) => setRegData({ ...regData, businessActivity: e.target.value })}
                            className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border rounded-lg font-bold text-xs"
                          />
                        ) : (
                          <div>
                            <p className="font-extrabold text-slate-900 dark:text-white">
                              {regData.businessActivity}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                              PSIC Code: {regData.psicCode}
                            </p>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Confirmation & Next Action */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentView('preview')}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel & Return
                    </button>

                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-2 cursor-pointer transition-all hover:scale-[1.01]"
                    >
                      <span>Confirm Business Information & Next Step</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2 — UPLOAD PROOF OF BUSINESS ADDRESS */}
          {/* ========================================================================= */}
          {wizardStep === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="text-blue-600" size={22} />
                  <span>Upload Proof of Business Address</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Upload your premises occupancy proof. The system will auto-extract your location, lessor, floor area, and verify jurisdiction via the 24-Barangay Clearance Network.
                </p>
              </div>

              {/* Supported Proofs */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Accepted Address Proofs:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    • Contract of Lease
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    • Land Title (TCT)
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    • Tax Declaration
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    • Barangay Clearance
                  </div>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="space-y-3">
                <div className="relative border-2 border-dashed border-blue-300 dark:border-blue-800/80 hover:border-blue-500 rounded-3xl p-7 bg-slate-50/50 dark:bg-slate-800/20 text-center transition-all group">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleLocFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="space-y-2.5 flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
                      <MapPin size={26} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Drop your lease contract or property title here
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Upload Contract of Lease or Barangay Business Clearance
                      </p>
                    </div>
                    {locFileName && (
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                        {locFileName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-400">Quick Samples:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectSampleLoc('lease')}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:border-blue-400 border rounded-xl font-bold cursor-pointer"
                    >
                      Sample: Notarized Lease Contract
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectSampleLoc('brgy')}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:border-blue-400 border rounded-xl font-bold cursor-pointer"
                    >
                      Sample: Barangay Clearance
                    </button>
                  </div>
                </div>

                {/* Proof of Address Document Picture Preview */}
                {locImagePreview && (
                  <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Camera size={16} className="text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Uploaded Address / Barangay Clearance Photo Preview
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          ✓ Photo Loaded
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {locFileName}
                      </span>
                    </div>

                    <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900/5 max-h-56 flex items-center justify-center group/img">
                      <img 
                        src={locImagePreview} 
                        alt="Address Document Picture" 
                        className="w-full max-h-56 object-contain rounded-lg transition-transform group-hover/img:scale-[1.01]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Extraction Progress */}
              {locIsExtracting && (
                <div className="p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center space-x-3 animate-pulse">
                  <RefreshCw size={18} className="text-blue-600 animate-spin" />
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-100">
                    Extracting location parameters & matching 24-Barangay clearance network...
                  </span>
                </div>
              )}

              {/* LOCATION REVIEW CARD */}
              {locExtracted && !locIsExtracting && (
                <div className="rounded-3xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 p-6 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white">
                        Detected
                      </span>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {locDetectedType}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      24-Barangay Network Synced ✓
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                    <div className="sm:col-span-2 p-3 bg-white dark:bg-slate-800 rounded-xl border space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Premises Address</span>
                      <p className="font-extrabold text-slate-900 dark:text-white">{locData.businessAddress}</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Jurisdiction Barangay</span>
                      <p className="font-bold text-blue-600 dark:text-blue-400">{locData.barangay}</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Lessor / Property Owner</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{locData.lessorName}</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Premises Floor Area</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{locData.floorArea} sq.m.</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Tenure & Monthly Rent</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">₱{locData.monthlyRental}</p>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 cursor-pointer shadow-md"
                    >
                      <span>Confirm Location Details & Next Step</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3 — UPLOAD PRIMARY GOVERNMENT ID OF OWNER */}
          {/* ========================================================================= */}
          {wizardStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="text-blue-600" size={22} />
                  <span>Upload Valid Government ID of Owner</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Upload a valid government-issued ID to verify the identity of the registered owner or authorized signatory with automatic biometric cross-match.
                </p>
              </div>

              {/* Supported IDs */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Accepted Government ID Types:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    • National ID (PhilID)
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    • Philippine Passport
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    • Driver's License (LTO)
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    • UMID / SSS Card
                  </div>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="space-y-3">
                <div className="relative border-2 border-dashed border-blue-300 dark:border-blue-800/80 hover:border-blue-500 rounded-3xl p-7 bg-slate-50/50 dark:bg-slate-800/20 text-center transition-all group">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleIdFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="space-y-2.5 flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
                      <User size={26} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Drop Government ID here, or click to upload
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        High-resolution front photo of valid government ID
                      </p>
                    </div>
                    {idFileName && (
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                        {idFileName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-400">Quick Samples:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectSampleId('philid')}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:border-blue-400 border rounded-xl font-bold cursor-pointer"
                    >
                      Sample: Philippine National ID (PhilID)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectSampleId('license')}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:border-blue-400 border rounded-xl font-bold cursor-pointer"
                    >
                      Sample: LTO Driver's License
                    </button>
                  </div>
                </div>

                {/* Government ID Document Picture Preview */}
                {idImagePreview && (
                  <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Camera size={16} className="text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Uploaded Government ID Photo Preview
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          ✓ Photo Loaded
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {idFileName}
                      </span>
                    </div>

                    <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900/5 max-h-56 flex items-center justify-center group/img">
                      <img 
                        src={idImagePreview} 
                        alt="Government ID Document Picture" 
                        className="w-full max-h-56 object-contain rounded-lg transition-transform group-hover/img:scale-[1.01]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Extraction Progress */}
              {idIsExtracting && (
                <div className="p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center space-x-3 animate-pulse">
                  <RefreshCw size={18} className="text-blue-600 animate-spin" />
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-100">
                    Performing OCR recognition & cross-matching applicant name with registered certificate owner...
                  </span>
                </div>
              )}

              {/* OWNER IDENTITY REVIEW CARD */}
              {idExtracted && !idIsExtracting && (
                <div className="rounded-3xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 p-6 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white">
                        ID Identified
                      </span>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {idDetectedType}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center space-x-1">
                      <ShieldCheck size={12} />
                      <span>{idData.ownerMatch}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Full Legal Name</span>
                      <p className="font-extrabold text-slate-900 dark:text-white">{idData.fullName}</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">ID Number</span>
                      <p className="font-mono font-bold text-blue-600 dark:text-blue-400">{idData.idNumber}</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Date of Birth</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{idData.dateOfBirth}</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Nationality</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{idData.nationality}</p>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(4)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 cursor-pointer shadow-md"
                    >
                      <span>Confirm Identity & Next Step</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4 — OPERATIONS & INSTANT TAX ASSESSMENT */}
          {/* ========================================================================= */}
          {wizardStep === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="text-blue-600" size={22} />
                  <span>Operations & Automated Tax Assessment</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  No long manual questionnaires. Verify your contact channel and review your transparent, automated local business tax computation.
                </p>
              </div>

              {/* Minimal Contact Verification */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Contact Channels & Enterprise Scale
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Mobile Phone</label>
                    <input
                      type="text"
                      value={opsData.contactPhone}
                      onChange={(e) => setOpsData({ ...opsData, contactPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl font-mono text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={opsData.contactEmail}
                      onChange={(e) => setOpsData({ ...opsData, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Declared Capital Investment</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₱</span>
                      <input
                        type="text"
                        value={opsData.capitalInvestment}
                        onChange={(e) => setOpsData({ ...opsData, capitalInvestment: e.target.value })}
                        className="w-full pl-7 pr-3 py-2 bg-white dark:bg-slate-900 border rounded-xl font-mono text-xs font-bold text-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* AUTOMATED LOCAL BUSINESS TAX & REGULATORY FEE CARD */}
              <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-950/40 dark:to-slate-900 p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-blue-200/60 dark:border-blue-800/60">
                  <div className="flex items-center space-x-2">
                    <Receipt size={18} className="text-blue-600" />
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Automated Municipal Tax & Fee Schedule
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                    Ordinance SP-1944 Tariff
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>1. Mayor's Business Permit Fee (Commercial Retail)</span>
                    <span className="font-mono font-bold">₱2,000.00</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>2. Local Business Tax (Initial 1/4 of 1% on Capital)</span>
                    <span className="font-mono font-bold">₱1,250.00</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>3. Sanitary & Health Inspection Fee</span>
                    <span className="font-mono font-bold">₱400.00</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>4. Garbage & Environmental Regulatory Service</span>
                    <span className="font-mono font-bold">₱300.00</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>5. Fire Safety Inspection Clearance Endorsement</span>
                    <span className="font-mono font-bold">₱500.00</span>
                  </div>
                  <div className="pt-3 border-t border-blue-200/80 dark:border-blue-800/80 flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                      Total Assessed Initial Regulatory Fees:
                    </span>
                    <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-base">
                      ₱4,450.00
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setWizardStep(3)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setWizardStep(5)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 cursor-pointer shadow-md"
                >
                  <span>Proceed to Final Review</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5 — FINAL REVIEW & SUBMIT */}
          {/* ========================================================================= */}
          {wizardStep === 5 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="text-blue-600" size={22} />
                  <span>Final Application Review & Confirmation</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  All applicant and enterprise data have been automatically extracted from your documents. Confirm the details below and submit your application.
                </p>
              </div>

              {/* 3 Verified Document Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center space-x-3">
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Registration Doc</p>
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{regDetectedType}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center space-x-3">
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Address & Location</p>
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{locData.barangay}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center space-x-3">
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Owner Identity</p>
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{idData.fullName}</p>
                  </div>
                </div>
              </div>

              {/* Consolidated Summary Review Card */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 bg-slate-50/50 dark:bg-slate-800/20 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                    Application Summary Card
                  </h4>
                  <span className="font-mono text-blue-600 font-bold">Queue: BPLO New Permits</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Business Trade Name</span>
                    <p className="font-black text-slate-900 dark:text-white text-sm">{regData.businessName}</p>
                    <p className="text-slate-500">{regData.orgType} • Reg #{regData.registrationNumber}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Registered Owner & Contact</span>
                    <p className="font-black text-slate-900 dark:text-white text-sm">{regData.registeredOwner}</p>
                    <p className="text-slate-500 font-mono">{opsData.contactPhone} • {opsData.contactEmail}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Business Premises</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{regData.businessAddress}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total Assessed Initial Fees</span>
                    <p className="font-mono font-black text-blue-600 dark:text-blue-400 text-sm">₱4,450.00</p>
                    <p className="text-[10px] text-slate-400">Payable via Revenue QR / Link upon submission</p>
                  </div>
                </div>
              </div>

              {/* Sworn Declaration Checkbox */}
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="swornDecl"
                  checked={swornDeclared}
                  onChange={(e) => setSwornDeclared(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
                <label htmlFor="swornDecl" className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed cursor-pointer">
                  I solemnly declare that all information and uploaded documents are true, genuine, and verified by me under Republic Act No. 11032 (Ease of Doing Business Act) and the Data Privacy Act of 2012.
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setWizardStep(4)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={!swornDeclared || isSubmittingApp}
                  onClick={handleSubmitUploadFirstApplication}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center space-x-2 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  {isSubmittingApp ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Submit Business Permit Application →</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 6 — SUBMISSION SUCCESS & DIGITAL APPLICATION TRACKING */}
          {/* ========================================================================= */}
          {wizardStep === 6 && (
            <div className="space-y-7 animate-in fade-in">
              <div className="text-center space-y-2 py-4">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-md">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Business Permit Application Submitted!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                  Your upload-based application has been received and logged in the municipal evaluation register.
                </p>
                <div className="inline-block mt-2 px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800">
                  <span className="text-xs text-slate-500 dark:text-slate-400 mr-2">Tracking Reference:</span>
                  <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-sm">
                    {submittedRefNo}
                  </span>
                </div>
              </div>

              {/* Cryptographic QR & Summary Box */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-5">
                    <div className="w-28 h-28 bg-white p-2 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center">
                      <QrCode size={90} className="text-slate-900" />
                    </div>
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        Pre-Verification Passed (Automated)
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {regData.businessName}
                      </h4>
                      <p className="text-xs text-slate-500">Applicant: {regData.registeredOwner}</p>
                      <p className="text-xs text-slate-500">{regData.businessAddress}</p>
                    </div>
                  </div>

                  <div className="text-right space-y-1 sm:border-l sm:pl-6 border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Order of Payment Ready</span>
                    <p className="font-mono font-black text-blue-600 dark:text-blue-400 text-lg">₱4,450.00</p>
                    <button
                      onClick={() => {
                        setTaxBin(submittedRefNo);
                        setCurrentView('pay_tax');
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
                    >
                      Pay Municipal Tax Online →
                    </button>
                  </div>
                </div>

                {/* 4-Stage Milestone Real-Time Tracker */}
                <div className="space-y-3">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                    Application Milestone Progress
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-1">
                      <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 font-bold">
                        <span>1. Document Extraction</span>
                        <CheckCircle2 size={14} />
                      </div>
                      <p className="text-[10px] text-emerald-600">Completed & Verified</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800 space-y-1">
                      <div className="flex items-center justify-between text-blue-700 dark:text-blue-300 font-bold">
                        <span>2. Evaluator Review</span>
                        <Clock size={14} className="animate-spin" />
                      </div>
                      <p className="text-[10px] text-blue-600">Under BPLO Review Queue</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1 opacity-70">
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-bold">
                        <span>3. Assessment Payment</span>
                        <CreditCard size={14} />
                      </div>
                      <p className="text-[10px] text-slate-400">Ready for Payment Settlement</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1 opacity-70">
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-bold">
                        <span>4. Permit QR Release</span>
                        <Award size={14} />
                      </div>
                      <p className="text-[10px] text-slate-400">Pending Final Sign-off</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    alert(`Official Application Receipt for ${submittedRefNo} downloaded.`);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center space-x-2 cursor-pointer transition-colors"
                >
                  <Download size={14} />
                  <span>Download Official Application Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentView('preview')}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-md cursor-pointer transition-all"
                >
                  Return to Business Overview
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: RENEWAL */}
      {/* ========================================================================= */}
      {currentView === 'renewal' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-md space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <RotateCw size={18} className="text-blue-600" />
                <span>Business Permit Annual Renewal</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Enter your Business Permit Number and Official Receipt (OR) Number to pull previous records and declare gross sales.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Business Permit Number (Applicant Input)</label>
              <input
                type="text"
                value={renewalPermitNo}
                onChange={(e) => setRenewalPermitNo(e.target.value)}
                placeholder="e.g. BP-2024-00123"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Previous Official Receipt (OR) Number</label>
              <input
                type="text"
                value={renewalOrNo}
                onChange={(e) => setRenewalOrNo(e.target.value)}
                placeholder="e.g. OR-2024-88491"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setRenewalRecord({
                businessName: 'Apex Innovations Retail Hub',
                owner: 'Juan Dela Cruz',
                address: 'Unit 402, 4th Floor, 123 Ayala Avenue, QC',
                previousGrossSales: '₱2,450,000.00',
                validUntil: 'December 31, 2024 (Expired)',
                status: 'Eligible for 2025 Renewal'
              });
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md shadow-blue-600/20"
          >
            <Search size={14} />
            <span>Validate & Pull Business Record</span>
          </button>

          {renewalRecord && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 text-xs animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-semibold">Registered Business:</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{renewalRecord.businessName}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Owner / Representative:</span>
                  <p className="font-bold text-slate-900 dark:text-white">{renewalRecord.owner}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Address:</span>
                  <p className="text-slate-700 dark:text-slate-300">{renewalRecord.address}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Current Standing:</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{renewalRecord.status}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-2">
                <label className="block text-slate-700 dark:text-slate-300 font-bold">
                  Annual Gross Sales Declaration for Previous Calendar Year (PHP ₱)
                </label>
                <input
                  type="text"
                  value={renewalGrossSales}
                  onChange={(e) => setRenewalGrossSales(e.target.value)}
                  className="w-full max-w-sm px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400"
                />
                <p className="text-[11px] text-slate-500">Auto-computed Local Business Tax (LBT) at 1.5% + Regulatory Fees: <strong>₱18,250.00</strong></p>
              </div>

              {renewalSubmitted ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 font-bold flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Renewal filed successfully! Reference: <strong>RNW-2025-00412</strong>. Proceed to Payment.</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setRenewalSubmitted(true);
                    if (onAddNewApplication && renewalRecord) {
                      onAddNewApplication(renewalRecord.businessName, 'Business Permit (Renewal)');
                    }
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md"
                >
                  <CheckCircle2 size={15} />
                  <span>Submit Annual Renewal Application</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: AMENDMENT */}
      {/* ========================================================================= */}
      {currentView === 'amendment' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-md space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Edit3 size={18} className="text-blue-600" />
                <span>Business Permit Amendment</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Enter your Business Permit Number and OR Number to apply for legal amendments to your business license.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Business Permit Number</label>
              <input
                type="text"
                value={amendPermitNo}
                onChange={(e) => setAmendPermitNo(e.target.value)}
                placeholder="e.g. BP-2024-00123"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Official Receipt (OR) Number</label>
              <input
                type="text"
                value={amendOrNo}
                onChange={(e) => setAmendOrNo(e.target.value)}
                placeholder="e.g. OR-2024-88491"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Select Type of Amendment</label>
              <select
                value={amendmentType}
                onChange={(e) => setAmendmentType(e.target.value as any)}
                className="w-full max-w-md px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xs"
              >
                <option value="trade_name">Change of Business / Trade Name</option>
                <option value="address">Change of Physical Business Address / Relocation</option>
                <option value="line_of_business">Change / Expansion of Line of Business</option>
                <option value="ownership">Change of Owner / Partner / Corporate Officers</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">New Amended Particulars</label>
              <input
                type="text"
                value={amendedValue}
                onChange={(e) => setAmendedValue(e.target.value)}
                className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Attach Amended DTI/SEC or Legal Proof</label>
              <div className="p-3 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-between text-xs">
                <span className="font-mono text-slate-700 dark:text-slate-300">{amendProofFile || 'No file chosen'}</span>
                <button className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-lg font-semibold hover:bg-slate-300 cursor-pointer">
                  Browse File
                </button>
              </div>
            </div>

            {amendSubmitted ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 font-bold flex items-center space-x-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Amendment filed! Reference: <strong>AMD-2025-8831</strong>. Awaiting BPLO evaluation.</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAmendSubmitted(true);
                  if (onAddNewApplication) {
                    onAddNewApplication(user?.name || amendPermitNo || 'Business Permit Owner', 'Business Permit Amendment');
                  }
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <CheckCircle2 size={15} />
                <span>Submit Amendment Request</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 4: PAY BUSINESS TAX (REVENUE & QR) */}
      {/* ========================================================================= */}
      {currentView === 'pay_tax' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-md space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <CreditCard size={18} className="text-emerald-600" />
              <span>Pay Business Tax & Municipal Fees (Revenue Integration)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Direct linkage to City Treasury & Revenue Collection System with live QR payment checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Assessment Breakdown */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Assessment Order of Payment (OPN-2025-9921)</span>
                  <span className="font-mono text-slate-500">BIN: {taxBin}</span>
                </div>

                <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Local Business Tax (LBT - Gross Sales Assessment)</span>
                    <span className="font-mono font-semibold">₱12,500.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mayor's Permit & Regulatory Licensing Fee</span>
                    <span className="font-mono font-semibold">₱1,200.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sanitary Inspection & Health Fee</span>
                    <span className="font-mono font-semibold">₱350.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Garbage Service Fee</span>
                    <span className="font-mono font-semibold">₱600.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fire Safety Inspection Fee (BFP)</span>
                    <span className="font-mono font-semibold">₱1,500.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Documentary Stamp Tax & Sticker Decal</span>
                    <span className="font-mono font-semibold">₱200.00</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center font-bold text-sm text-slate-900 dark:text-white">
                  <span>Total Assessed Dues:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-base">₱16,350.00</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Select Payment Channel</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {['gcash', 'maya', 'landbank', 'eprovider'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setTaxPaymentMethod(m as any)}
                      className={`p-3 rounded-xl border text-center font-bold capitalize transition-all cursor-pointer ${
                        taxPaymentMethod === m
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live QR Code & Checkout Card */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-between space-y-4 text-center">
              <div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-bold border border-emerald-500/30 uppercase">
                  Official Revenue QR
                </span>
                <h4 className="font-black text-sm mt-2">Scan & Settle Tax Dues</h4>
                <p className="text-[11px] text-slate-400">Merchant: City Government Revenue Treasury</p>
              </div>

              <div className="p-3 bg-white rounded-2xl shadow-inner flex items-center justify-center">
                <QrCode size={140} className="text-slate-900" />
              </div>

              <div className="w-full space-y-2">
                <p className="text-xs font-mono text-emerald-400 font-bold">Amount: ₱16,350.00</p>
                <button
                  disabled={isProcessingTax}
                  onClick={() => {
                    setIsProcessingTax(true);
                    setTimeout(() => {
                      setIsProcessingTax(false);
                      setTaxPaymentReceipt({
                        orNumber: `OR-2025-${Math.floor(10000 + Math.random() * 90000)}`,
                        date: new Date().toLocaleString(),
                        amount: '₱16,350.00',
                        method: taxPaymentMethod.toUpperCase(),
                        status: 'PAYMENT CLEARED'
                      });
                    }, 1200);
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  {isProcessingTax ? 'Processing Payment...' : 'Simulate Instant Payment'}
                </button>
              </div>
            </div>

          </div>

          {taxPaymentReceipt && (
            <div className="p-5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-200 font-bold text-sm">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span>Payment Confirmed! Official Receipt: {taxPaymentReceipt.orNumber}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Settled on <strong>{taxPaymentReceipt.date}</strong> via <strong>{taxPaymentReceipt.method}</strong>. Your Mayor's Permit has been validated and released.
              </p>
              <button
                onClick={() => setEcopyModalOpen(true)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Download Certified E-Permit
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 5: SPECIAL PERMIT (SHORT TERM / EVENT) */}
      {/* ========================================================================= */}
      {currentView === 'special_permit' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-md space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Calendar size={18} className="text-amber-600" />
                <span>Special Permit / Short-Term Event Application</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Flow: General ➔ Basic Documentary Requirements ➔ Business Information ➔ Business Operation ➔ Business Activity ➔ Event Information ➔ Summary Page
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600">
            <span>Step {specialStep} of 4:</span>
            <span className="text-slate-600 dark:text-slate-300">
              {specialStep === 1 && 'General & Terms'}
              {specialStep === 2 && 'Business & Operation Particulars'}
              {specialStep === 3 && 'Event Information & Venue'}
              {specialStep === 4 && 'Summary & Release'}
            </span>
          </div>

          {specialStep === 1 && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                Special permits are issued for short-term events, bazaars, promotional activations, food festivals, and temporary exhibitions lasting up to 30 days.
              </p>
              <label className="flex items-center space-x-2 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={specialTermsAccepted}
                  onChange={(e) => setSpecialTermsAccepted(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600"
                />
                <span>I agree to the Short-Term Special Permitting terms and event safety regulations</span>
              </label>
              <div className="flex justify-end">
                <button
                  disabled={!specialTermsAccepted}
                  onClick={() => setSpecialStep(2)}
                  className="px-6 py-2.5 bg-amber-600 disabled:opacity-50 hover:bg-amber-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Continue to Business Details
                </button>
              </div>
            </div>
          )}

          {specialStep === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Business Name / Entity</label>
                <input
                  type="text"
                  value={specialData.businessName}
                  onChange={(e) => setSpecialData({...specialData, businessName: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Organizer Contact Person</label>
                <input
                  type="text"
                  value={specialData.organizerName}
                  onChange={(e) => setSpecialData({...specialData, organizerName: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div className="sm:col-span-2 flex justify-between pt-2">
                <button onClick={() => setSpecialStep(1)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">Back</button>
                <button onClick={() => setSpecialStep(3)} className="px-6 py-2 bg-amber-600 text-white font-bold rounded-xl">Event Information</button>
              </div>
            </div>
          )}

          {specialStep === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Event Title / Exhibition Name</label>
                <input
                  type="text"
                  value={specialData.eventTitle}
                  onChange={(e) => setSpecialData({...specialData, eventTitle: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Venue / Event Location</label>
                <input
                  type="text"
                  value={specialData.venue}
                  onChange={(e) => setSpecialData({...specialData, venue: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Start Date</label>
                <input
                  type="date"
                  value={specialData.startDate}
                  onChange={(e) => setSpecialData({...specialData, startDate: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">End Date</label>
                <input
                  type="date"
                  value={specialData.endDate}
                  onChange={(e) => setSpecialData({...specialData, endDate: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div className="sm:col-span-2 flex justify-between pt-2">
                <button onClick={() => setSpecialStep(2)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">Back</button>
                <button onClick={() => setSpecialStep(4)} className="px-6 py-2 bg-amber-600 text-white font-bold rounded-xl">Summary & File</button>
              </div>
            </div>
          )}

          {specialStep === 4 && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border space-y-2">
                <p><strong>Event:</strong> {specialData.eventTitle}</p>
                <p><strong>Venue:</strong> {specialData.venue}</p>
                <p><strong>Duration:</strong> {specialData.startDate} to {specialData.endDate}</p>
                <p><strong>Special Permit Fee:</strong> ₱3,500.00</p>
              </div>

              {specialSubmitted ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 rounded-xl text-emerald-800 dark:text-emerald-200 font-bold">
                  Special Permit Registered! Reference: <strong>SP-2025-4412</strong>.
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSpecialSubmitted(true);
                    if (onAddNewApplication) {
                      onAddNewApplication(specialData.businessName || specialData.organizerName || user?.name || 'Event Organizer', 'Special Mayor\'s Permit');
                    }
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer"
                >
                  Submit Special Permit Application
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW: CARD 2 - BUSINESS INFORMATION SYSTEM (CTC PULLING) */}
      {/* ========================================================================= */}
      {currentView === 'ctc_pulling' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-md space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Layers size={18} className="text-purple-600" />
                <span>Business Information System: Pull Certified True Copies (CTC)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Official municipal registry pulling engine: Request ➔ Admin Review & Fee Confirmation ➔ Payment Linkage ➔ Document Issuance.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold border border-purple-200 dark:border-purple-800">
                Step {ctcStep} of 4: {ctcStep === 1 ? 'Request & Upload' : ctcStep === 2 ? 'Admin Review & Fee' : ctcStep === 3 ? 'Payment Linkage' : 'CTC Download'}
              </span>
            </div>
          </div>

          {/* Stepper Header Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
              ctcStep === 1 
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs' 
                : ctcStep > 1 
                  ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
            }`}>
              1. Request & Uploads
            </div>
            <div className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
              ctcStep === 2 
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs' 
                : ctcStep > 2 
                  ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
            }`}>
              2. Admin Fee Review
            </div>
            <div className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
              ctcStep === 3 
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs' 
                : ctcStep > 3 
                  ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
            }`}>
              3. Payment Linkage
            </div>
            <div className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
              ctcStep === 4 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
            }`}>
              4. CTC Provision
            </div>
          </div>

          {/* STEP 1: Request Form & Uploads */}
          {ctcStep === 1 && (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 space-y-3">
                <h4 className="font-bold text-purple-900 dark:text-purple-200">1. Business Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Business Permit Number</label>
                    <input
                      type="text"
                      value={ctcPermitNo}
                      onChange={(e) => setCtcPermitNo(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Registered Business Name</label>
                    <input
                      type="text"
                      value={ctcBusinessName}
                      onChange={(e) => setCtcBusinessName(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white">2. Requestor Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Requestor Full Name</label>
                    <input
                      type="text"
                      value={ctcRequestorName}
                      onChange={(e) => setCtcRequestorName(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Contact Number</label>
                    <input
                      type="text"
                      value={ctcRequestorContact}
                      onChange={(e) => setCtcRequestorContact(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      value={ctcRequestorEmail}
                      onChange={(e) => setCtcRequestorEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Presented ID Type</label>
                    <input
                      type="text"
                      value={ctcIdType}
                      onChange={(e) => setCtcIdType(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">ID Number</label>
                    <input
                      type="text"
                      value={ctcIdNumber}
                      onChange={(e) => setCtcIdNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Relationship to Business</label>
                    <input
                      type="text"
                      value={ctcRelation}
                      onChange={(e) => setCtcRelation(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white">3. Select Requested Document(s)</h4>
                <div className="space-y-2">
                  {[
                    'Certified True Copy of Mayor\'s Permit (Current Year)',
                    'Certified True Copy of Business Tax Assessment & Official Receipt',
                    'Certificate of Business Closure / Retirement',
                    'Certificate of No Existing Business Record',
                    'Business Plate / Window Decal Replacement Endorsement'
                  ].map((doc, idx) => (
                    <label key={idx} className="flex items-center space-x-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ctcSelectedDocs.includes(doc)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCtcSelectedDocs([...ctcSelectedDocs, doc]);
                          } else {
                            setCtcSelectedDocs(ctcSelectedDocs.filter(d => d !== doc));
                          }
                        }}
                        className="w-4 h-4 rounded text-purple-600"
                      />
                      <span className="text-slate-700 dark:text-slate-300">{doc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Supporting Documents Upload */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white">4. Supporting Documents Upload</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold">Government-Issued Valid ID</p>
                      <p className="text-[11px] text-emerald-600 font-mono">PhilID_JuanDelaCruz.pdf (Attached)</p>
                    </div>
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold">Special Power of Attorney / Authorization</p>
                      <p className="text-[11px] text-slate-400">Required if filing on behalf of owner</p>
                    </div>
                    <Upload size={16} className="text-slate-400" />
                  </div>
                </div>
              </div>

              <label className="flex items-center space-x-2 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={ctcPrivacyAgreed}
                  onChange={(e) => setCtcPrivacyAgreed(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600"
                />
                <span>I confirm that the requested documents will be used solely for legitimate legal and commercial purposes pursuant to RA 10173</span>
              </label>

              <div className="flex justify-end pt-2">
                <button
                  disabled={!ctcPrivacyAgreed || ctcSelectedDocs.length === 0}
                  onClick={() => {
                    setCtcReqRef(`CTC-REQ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`);
                    setCtcStep(2);
                  }}
                  className="px-6 py-2.5 bg-purple-600 disabled:opacity-50 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md shadow-purple-600/25"
                >
                  <span>Submit Request for Admin Review</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Admin Review & Fee Confirmation */}
          {ctcStep === 2 && (
            <div className="space-y-5 text-xs animate-in fade-in">
              
              {/* Review Status Banner */}
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 dark:text-white">Request Tracking Reference:</span>
                      <span className="font-mono font-black text-purple-600 dark:text-purple-400">{ctcReqRef}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                      Reviewed by: <strong>Office of the City Treasurer & BPLO Records Division</strong>
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center space-x-1">
                  <CheckCircle2 size={12} />
                  <span>Admin Evaluation & Fee Confirmed</span>
                </span>
              </div>

              {/* Admin Validation Checklist & Assessment Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Admin Audit Card */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <CheckCircle2 size={15} className="text-emerald-500" />
                    <span>LGU Records Custodian Verification</span>
                  </h4>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg border">
                      <span className="text-slate-600 dark:text-slate-400">Business Registry File:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">FOUND & ACTIVE ({ctcPermitNo})</strong>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg border">
                      <span className="text-slate-600 dark:text-slate-400">Identity & SPA Verification:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">VALIDATED (PhilID Match)</strong>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg border">
                      <span className="text-slate-600 dark:text-slate-400">Tax Liabilities Check:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">CLEARED (No Outstanding Dues)</strong>
                    </div>
                  </div>
                </div>

                {/* Confirmed Order of Payment Assessment */}
                <div className="p-4 bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-purple-900 dark:text-purple-200 flex items-center space-x-1.5">
                      <Receipt size={15} className="text-purple-600" />
                      <span>Confirmed Order of Payment (OP)</span>
                    </h4>
                    <span className="font-mono text-[10px] bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded font-bold">
                      {ctcAssessmentNo}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>CTC Certification Fee ({ctcSelectedDocs.length} Doc @ ₱150):</span>
                      <span className="font-mono font-semibold">₱{ctcSelectedDocs.length * 150}.00</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Documentary Stamp Tax (DST):</span>
                      <span className="font-mono font-semibold">₱30.00</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Archival Retrieval & Security Seal Fee:</span>
                      <span className="font-mono font-semibold">₱50.00</span>
                    </div>
                    <div className="border-t border-purple-200 dark:border-purple-800 pt-2 flex justify-between font-bold text-xs text-purple-950 dark:text-purple-200">
                      <span>Total Confirmed Fee:</span>
                      <span className="font-mono text-sm text-purple-700 dark:text-purple-300 font-black">
                        ₱{ctcSelectedDocs.length * 150 + 80}.00
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setCtcStep(1)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold flex items-center space-x-1.5 cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Modify Request</span>
                </button>

                <button
                  onClick={() => setCtcStep(3)}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30 flex items-center space-x-2 cursor-pointer"
                >
                  <span>Proceed to Payment Linkage</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: Payment Linkage (Revenue Link & QR Settlement) */}
          {ctcStep === 3 && (
            <div className="space-y-5 text-xs animate-in fade-in">
              
              {/* Payment Linkage Header */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                <div>
                  <div className="flex items-center space-x-2">
                    <CreditCard size={18} className="text-blue-300" />
                    <span className="font-bold text-sm">City Treasury Online Payment Linkage</span>
                  </div>
                  <p className="text-xs text-blue-200 mt-0.5">
                    Order of Payment: <strong className="font-mono">{ctcAssessmentNo}</strong> • Assessment Reference: <strong className="font-mono">{ctcReqRef}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-blue-200">Total Amount Payable</span>
                  <p className="text-xl font-black font-mono text-emerald-300">
                    ₱{ctcSelectedDocs.length * 150 + 80}.00
                  </p>
                </div>
              </div>

              {/* Payment Method Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setCtcPaymentMethod('gcash')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    ctcPaymentMethod === 'gcash'
                      ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-blue-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-blue-600 dark:text-blue-400">GCash</span>
                    <QrCode size={16} className="text-blue-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Scan Revenue QR & e-Wallet</p>
                </button>

                <button
                  onClick={() => setCtcPaymentMethod('maya')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    ctcPaymentMethod === 'maya'
                      ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 ring-2 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-emerald-600 dark:text-emerald-400">Maya</span>
                    <QrCode size={16} className="text-emerald-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Scan QR Ph / Instant Checkout</p>
                </button>

                <button
                  onClick={() => setCtcPaymentMethod('landbank')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    ctcPaymentMethod === 'landbank'
                      ? 'border-green-600 bg-green-50/80 dark:bg-green-950/60 ring-2 ring-green-600/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-green-700 dark:text-green-400">Landbank</span>
                    <CreditCard size={16} className="text-green-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Link.BizPortal / BancNet</p>
                </button>
              </div>

              {/* QR Code & Gateway Simulation Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-white p-2 rounded-xl border border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center shadow-xs flex-shrink-0">
                    <QrCode size={70} className="text-slate-900" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      Official Revenue QR Payment Link
                    </span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Scan using your banking or e-wallet app to settle the confirmed CTC fee.
                    </p>
                    <p className="font-mono text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                      Ref: LGU-QC-REV-{ctcAssessmentNo.replace('OP-', '')}
                    </p>
                  </div>
                </div>

                <button
                  disabled={ctcIsProcessingPayment}
                  onClick={() => {
                    setCtcIsProcessingPayment(true);
                    setTimeout(() => {
                      setCtcIsProcessingPayment(false);
                      setCtcPaid(true);
                      setCtcOrNo(`OR-CTC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`);
                      setCtcStep(4);
                    }, 1500);
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-2 cursor-pointer flex-shrink-0"
                >
                  {ctcIsProcessingPayment ? (
                    <>
                      <RotateCw size={14} className="animate-spin" />
                      <span>Verifying Payment Linkage...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={14} />
                      <span>Simulate Immediate Payment (₱{ctcSelectedDocs.length * 150 + 80}.00)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-start">
                <button
                  onClick={() => setCtcStep(2)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-semibold flex items-center space-x-1.5 cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Back to Assessment</span>
                </button>
              </div>

            </div>
          )}

          {/* STEP 4: Official CTC Provision & Download */}
          {ctcStep === 4 && (
            <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-3xl text-center space-y-5 animate-in zoom-in-95">
              
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                <FileCheck size={32} />
              </div>

              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-extrabold mb-2 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 size={13} />
                  <span>Payment Verified via Treasury • CTC Released</span>
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  Official Certified True Copy (CTC) Issued
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto mt-1">
                  Your document for <strong>{ctcBusinessName}</strong> has been pulled from the municipal archives with holographic seal, digital authentication watermark, and valid Official Receipt.
                </p>
              </div>

              {/* Digital Certificate Spec Card */}
              <div className="p-5 max-w-lg mx-auto bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/80 rounded-2xl text-left text-xs space-y-2 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <ShieldCheck size={14} className="text-purple-600" />
                    <span>Certified True Copy Credentials</span>
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-600">VALIDATED</span>
                </div>
                
                <div className="space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  <p><strong>Tracking Ref:</strong> {ctcReqRef}</p>
                  <p><strong>Official Receipt No:</strong> {ctcOrNo}</p>
                  <p><strong>Order of Payment No:</strong> {ctcAssessmentNo}</p>
                  <p><strong>Document:</strong> {ctcSelectedDocs[0]}</p>
                  <p><strong>Issued To:</strong> {ctcRequestorName} ({ctcRelation})</p>
                  <p><strong>Security Hash:</strong> e8f92a11b02c8901f44d87aa</p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => {
                    alert(`Official Certified True Copy (CTC) for ${ctcBusinessName} downloaded successfully.`);
                  }}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30 flex items-center space-x-2 cursor-pointer"
                >
                  <Download size={15} />
                  <span>Download Watermarked CTC (.PDF)</span>
                </button>

                <button
                  onClick={() => {
                    alert(`Official Receipt ${ctcOrNo} for CTC processing downloaded.`);
                  }}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 cursor-pointer"
                >
                  <Receipt size={14} />
                  <span>Download Official Receipt (OR)</span>
                </button>

                <button
                  onClick={() => {
                    setCtcStep(1);
                  }}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  File Another Request
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW: CARD 3 - MAYOR'S PERMIT VERIFICATION */}
      {/* ========================================================================= */}
      {currentView === 'verification' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-md space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              <span>Mayor's Permit Legal Verification & Compliance Audit</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verify whether a registered business establishment complies with municipal legal requirements, fire safety, sanitary, and zoning clearances.
            </p>
          </div>

          <div className="flex gap-2 max-w-xl">
            <input
              type="text"
              value={verifQuery}
              onChange={(e) => setVerifQuery(e.target.value)}
              placeholder="Enter Permit Number or BIN (e.g. BP-2024-00123)..."
              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
            />
            <button
              disabled={isVerifying}
              onClick={() => {
                setIsVerifying(true);
                setTimeout(() => {
                  setIsVerifying(false);
                }, 600);
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <Search size={14} />
              <span>{isVerifying ? 'Verifying...' : 'Verify Legal Standing'}</span>
            </button>
          </div>

          {verifResult && (
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-5 text-xs animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">{verifResult.businessName}</h4>
                  <p className="text-slate-500 text-[11px]">Trade: {verifResult.tradeName} • BIN: <span className="font-mono font-bold">{verifResult.bin}</span></p>
                </div>
                <div className="px-3.5 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold rounded-full text-xs border border-emerald-300 dark:border-emerald-700 flex items-center space-x-1.5">
                  <CheckCircle2 size={15} />
                  <span>{verifResult.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                  <span className="text-slate-400 font-semibold block">Fire Safety (FSIC):</span>
                  <strong className="text-emerald-600">{verifResult.fsicStatus}</strong>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                  <span className="text-slate-400 font-semibold block">Sanitary Clearance:</span>
                  <strong className="text-emerald-600">{verifResult.sanitaryStatus}</strong>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                  <span className="text-slate-400 font-semibold block">Zoning Compliance:</span>
                  <strong className="text-emerald-600">{verifResult.zoningStatus}</strong>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                  <span className="text-slate-400 font-semibold block">Validity Expiration:</span>
                  <strong className="text-slate-900 dark:text-white">{verifResult.validUntil}</strong>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center space-x-3">
                <Award size={20} className="text-emerald-600 flex-shrink-0" />
                <div className="text-[11px] text-emerald-900 dark:text-emerald-200">
                  <span>Cryptographic Seal Authenticated. The business is fully compliant with Quezon City Business Omnibus Ordinance & Republic Act 7160.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW: CARD 4 - SAFE SEAL (QC SAFE SEAL CERTIFICATION) */}
      {/* ========================================================================= */}
      {currentView === 'safe_seal' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-md space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Award size={18} className="text-amber-600" />
              <span>QC SAFE (Stop All Forms of Exploitation) Seal Certification</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Validate your Business Permit Number to automatically auto-fill and complete the QC SAFE SEAL Guidelines form.
            </p>
          </div>

          <div className="flex gap-2 max-w-xl">
            <input
              type="text"
              value={safePermitNo}
              onChange={(e) => setSafePermitNo(e.target.value)}
              placeholder="Enter Permit Number (e.g. BP-2024-00123)..."
              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-mono font-bold"
            />
            <button
              onClick={() => {
                setSafeValidated(true);
              }}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <Check size={14} />
              <span>Validate & Auto-Fill Form</span>
            </button>
          </div>

          {safeValidated && (
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-5 text-xs animate-in fade-in">
              <div className="pb-3 border-b border-slate-200 dark:border-slate-700">
                <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-400/20 rounded-full font-bold text-[10px] uppercase">
                  Auto-filled from Business Permit Registry
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                  QC SAFE SEAL Guidelines.pdf Compliance Form
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                  <span className="text-slate-400 font-semibold block">Business Name:</span>
                  <strong className="text-slate-900 dark:text-white">{safeFormData.businessName}</strong>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                  <span className="text-slate-400 font-semibold block">Operating Category:</span>
                  <strong className="text-slate-900 dark:text-white">{safeFormData.category}</strong>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                  <span className="text-slate-400 font-semibold block">Workforce & Schedule:</span>
                  <strong className="text-slate-900 dark:text-white">{safeFormData.employeeCount} ({safeFormData.operatingHours})</strong>
                </div>
              </div>

              {/* Checklist */}
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border space-y-2.5">
                <h5 className="font-bold text-slate-900 dark:text-white">SAFE Protocol Compliance Checklist:</h5>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-amber-600" />
                    <span>Establishment enforces zero-tolerance policy against illegal child labor and human trafficking</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-amber-600" />
                    <span>Official anti-exploitation helplines (QC Helpline 122 & 1343) clearly posted at public entrances</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-amber-600" />
                    <span>Employee background check & government ID verification protocol implemented</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-amber-600" />
                    <span>CCTV cameras functional and actively monitoring commercial access points</span>
                  </label>
                </div>
              </div>

              {safeSealIssued ? (
                <div className="p-5 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <Award size={24} />
                  </div>
                  <h4 className="text-sm font-black text-amber-900 dark:text-amber-200">
                    QC SAFE SEAL Certified & Issued!
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Certificate Number: <strong>QC-SAFE-2025-0081</strong>. Your establishment is recognized as a SAFE certified venue.
                  </p>
                  <div className="flex justify-center space-x-3 pt-2">
                    <button 
                      onClick={() => alert('QC SAFE SEAL Certificate & Window Decal PDF downloaded.')}
                      className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md"
                    >
                      Download Safe Seal Decal & QR Sticker
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSafeSealIssued(true)}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md"
                >
                  <Award size={15} />
                  <span>Issue QC Safe Seal Certificate</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REQUEST FOR E-COPY */}
      {/* ========================================================================= */}
      {ecopyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Download size={18} className="text-blue-400" />
                <h3 className="font-bold text-sm">Request Official Electronic Permit (E-Copy)</h3>
              </div>
              <button onClick={() => setEcopyModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Business Permit Reference Number</label>
                <input
                  type="text"
                  value={ecopyPermitNo}
                  onChange={(e) => setEcopyPermitNo(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono text-xs font-bold"
                />
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-slate-700 dark:text-slate-300 space-y-1.5">
                <p><strong>Permit File:</strong> Official_Mayors_Permit_2025_{ecopyPermitNo}.pdf</p>
                <p><strong>Digital Signature:</strong> Cryptographically Sealed by City Mayor & BPLO Head</p>
                <p><strong>Verification:</strong> Includes Tamper-Proof Scannable QR Code</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2.5">
              <button onClick={() => setEcopyModalOpen(false)} className="px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl text-xs font-semibold cursor-pointer">
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Official E-Copy for permit ${ecopyPermitNo} generated and downloaded.`);
                  setEcopyModalOpen(false);
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer flex items-center space-x-1.5"
              >
                <Download size={14} />
                <span>Download Certified E-Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BUSINESS PERMIT DOCUMENTARY REQUIREMENTS & UPLOAD-FIRST GUIDE */}
      {/* ========================================================================= */}
      {isReqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Business Permit Application Requirements
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Mayor's Permits & Business Licensing • Commercial & Retail Checklist
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsReqModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-slate-300">
              
              {/* Highlight Banner */}
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 space-y-1">
                <div className="flex items-center space-x-2 font-bold text-xs text-blue-700 dark:text-blue-300">
                  <Sparkles size={15} />
                  <span>Upload-First Zero-Typing Workflow:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  You do not need to manually type tedious application forms. Our AI extraction system extracts your business name, owner name, registration number, address, and line of business directly from your uploaded certificates.
                </p>
              </div>

              {/* Requirement Groups */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Primary Registration Documents */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                  <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white text-xs">
                    <FileText size={16} className="text-blue-600" />
                    <span>1. Primary Business Registration</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={13} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>DTI Certificate:</strong> For Sole Proprietorships</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={13} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>SEC Registration:</strong> Articles of Incorporation for Corp/Partnerships</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={13} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>CDA Certificate:</strong> For Cooperatives</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={13} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>HOA Authorization:</strong> For Home-based micro enterprises</span>
                    </li>
                  </ul>
                </div>

                {/* 2. Premises & Locational Clearance */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                  <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white text-xs">
                    <MapPin size={16} className="text-emerald-600" />
                    <span>2. Proof of Business Location</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={13} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Contract of Lease:</strong> If renting premises (notarized)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={13} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Land Title / Tax Declaration:</strong> If property is owned</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={13} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Barangay Clearance:</strong> 24-Barangay Network integrated</span>
                    </li>
                  </ul>
                </div>

                {/* 3. Applicant Identification */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                  <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white text-xs">
                    <User size={16} className="text-indigo-600" />
                    <span>3. Owner / Signatory Valid ID</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={13} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span>Philippine National ID (PhilID)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={13} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span>Philippine Passport / Driver's License</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={13} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span>UMID / SSS / PRC Identification Card</span>
                    </li>
                  </ul>
                </div>

                {/* 4. Supported Formats & Rules */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                  <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white text-xs">
                    <ShieldCheck size={16} className="text-amber-600" />
                    <span>4. File Specifications & Security</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={13} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Accepted formats: PDF, JPG, JPEG, PNG</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={13} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Max file size: Up to 25MB per document</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={13} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Clear scans or well-lit photos without glare</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="p-5 bg-slate-50/80 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Quezon City BPLO Citizen's Charter Compliance
              </span>
              <div className="flex items-center space-x-2.5">
                <button
                  onClick={() => setIsReqModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsReqModalOpen(false);
                    setWizardStep(1);
                    setCurrentView('new_app');
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-md shadow-blue-600/20 cursor-pointer flex items-center space-x-1.5"
                >
                  <span>Start Upload-First Application →</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      </main>

      {/* ========================================================================= */}
      {/* 4. FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-3">
            <Landmark size={18} className="text-blue-600" />
            <span>Republic of the Philippines • Business Permits and Licensing Office (BPLO)</span>
          </div>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-800 dark:hover:text-white cursor-pointer" onClick={() => onNavigateToTab?.('Home')}>
              Home
            </span>
            <span className="hover:text-slate-800 dark:hover:text-white cursor-pointer" onClick={() => onNavigateToTab?.('Home')}>
              Dashboard & Tracker
            </span>
            <span>Helpline: 122 / (02) 8888-BPLO</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
