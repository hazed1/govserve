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
import { BusinessPermitUploadWizard } from './BusinessPermitUploadWizard';

interface BusinessPermitModuleProps {
  onNavigateToTab?: (tab: TabType) => void;
  onAddNewApplication?: (applicantName: any, permitType?: string, extraDetails?: any) => void;
  onNavigateToDashboard?: () => void;
  initialView?: MainViewMode;
}

type MainViewMode = 
  | 'preview'
  | 'hub' 
  | 'select_type'
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

  // States for the 4 Reference Cards (Pictures 1-4)
  const [isOccupationalModalOpen, setIsOccupationalModalOpen] = useState<boolean>(false);
  const [isBisModalOpen, setIsBisModalOpen] = useState<boolean>(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState<boolean>(false);
  const [isServiceDetailsOpen, setIsServiceDetailsOpen] = useState<boolean>(false);
  const [bisSearchQuery, setBisSearchQuery] = useState<string>('BP-2026-48190');
  const [bisRecordFound, setBisRecordFound] = useState<boolean>(false);
  const [verificationQuery, setVerificationQuery] = useState<string>('ABC Computer Shop');
  const [verificationResult, setVerificationResult] = useState<boolean>(false);
  const [occSubmitted, setOccSubmitted] = useState<boolean>(false);

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
            {/* 4 CORE SERVICES (RICH HORIZONTAL CARDS WITH BALANCED ZERO-WASTE LAYOUT) */}
            {/* ========================================================================= */}
            <div className="space-y-5 sm:space-y-6">
              
              {/* ======================================================================= */}
              {/* CARD 1: APPLY FOR MAYOR'S PERMIT (BUSINESS) - BLUE / SKY THEME */}
              {/* ======================================================================= */}
              <div 
                onClick={() => setCurrentView('select_type')}
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#061426] via-[#091e38] to-[#030914] border border-sky-500/40 p-6 sm:p-8 shadow-2xl shadow-sky-950/40 group transition-all duration-300 cursor-pointer"
              >
                {/* Ambient glow effects */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 relative z-10">
                  {/* Left Column: Info & Details */}
                  <div className="flex-1 space-y-4">
                    {/* Title & Subtitle */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        APPLY FOR MAYOR'S PERMIT (BUSINESS)
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 italic mt-1 leading-relaxed max-w-2xl">
                        "Submit a Mayor's Permit Application, pay business tax, check the status of current applications, or request a Mayor's Permit online."
                      </p>
                    </div>

                    {/* 5 Information Rows with Circular Icons */}
                    <div className="space-y-2.5 pt-1">
                      {/* Row 1: Target Users */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shrink-0">
                          <Users size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">TARGET USERS</span>
                          <p className="text-xs text-slate-400 font-medium">Business owners and applicants</p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shrink-0">
                          <Briefcase size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">SERVICE METHOD</span>
                          <p className="text-xs text-slate-400 font-medium">Online Business Permit Application</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shrink-0">
                          <Clock size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">TIME PERIOD</span>
                          <p className="text-xs text-slate-400 font-medium">Subject to document evaluation and approval</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shrink-0">
                          <Banknote size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">CHARGES & PAYMENT</span>
                          <p className="text-xs text-slate-400 font-medium">Based on the applicable business assessment</p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shrink-0">
                          <CreditCard size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">PAYMENT METHOD</span>
                          <p className="text-xs text-slate-400 font-medium">Online payment / available payment method</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions & Document Upload Callout (Zero Wasted Space) */}
                  <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 flex flex-col justify-between space-y-3">
                    {/* Action Buttons */}
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentView('select_type');
                        }}
                        className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-blue-600/40 hover:shadow-blue-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Apply for Business Permit →</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToTab?.('Application Status Tracking');
                          }}
                          className="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Search size={13} className="text-sky-400" />
                          <span>Track Application</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsReqModalOpen(true);
                          }}
                          className="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Info size={13} className="text-sky-400" />
                          <span>View Requirements</span>
                        </button>
                      </div>
                    </div>

                    {/* Picture 3 Moved to Right: Document Photo & Picture Upload Active */}
                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-black/45 border border-sky-500/30 backdrop-blur-xs space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                        <Camera size={14} />
                        <span>Document Photo & Picture Upload Active</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Upload live photos or pictures of your Valid ID, Business Registration (DTI/SEC/CDA), Location Proof, and Storefront Photo.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>Valid Gov ID
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>DTI / SEC / CDA
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>Location Proof
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>Storefront Photo
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* CARD 2: APPLY FOR OCCUPATIONAL / WORK PERMIT - GREEN / EMERALD THEME */}
              {/* ======================================================================= */}
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#051b13] via-[#07291d] to-[#020e0a] border border-emerald-500/40 p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 group transition-all duration-300">
                {/* Ambient glow effects */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-teal-600/10 blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 relative z-10">
                  {/* Left Column: Info & Details */}
                  <div className="flex-1 space-y-4">
                    {/* Title & Subtitle */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        APPLY FOR OCCUPATIONAL / WORK PERMIT
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 italic mt-1 leading-relaxed max-w-2xl">
                        "Complete the online application for an occupational permit and await an email notification."
                      </p>
                    </div>

                    {/* 5 Information Rows with Circular Icons */}
                    <div className="space-y-2.5 pt-1">
                      {/* Row 1: Target Users */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
                          <Users size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">TARGET USERS</span>
                          <p className="text-xs text-slate-400 font-medium">Commercial workers, food handlers, cashier staff, security, professionals</p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
                          <Briefcase size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">SERVICE METHOD</span>
                          <p className="text-xs text-slate-400 font-medium">Online occupational permit filing with digital clearance validation</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
                          <Clock size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">TIME PERIOD</span>
                          <p className="text-xs text-slate-400 font-medium">1 to 2 working days upon verification of submitted health clearances</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
                          <Banknote size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">CHARGES & PAYMENT</span>
                          <p className="text-xs text-slate-400 font-medium">₱650.00 Base Regulatory Tariff + Sanitary Examination</p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
                          <CreditCard size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">PAYMENT METHOD</span>
                          <p className="text-xs text-slate-400 font-medium">Via online portal (e-Wallets, Maya, GCash, Landbank)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions & Document Upload Callout */}
                  <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 flex flex-col justify-between space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setOccSubmitted(false);
                        setIsOccupationalModalOpen(true);
                      }}
                      className="w-full py-3.5 px-5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/40 hover:shadow-emerald-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Apply for Work Permit →</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2.5 w-full">
                      <button
                        type="button"
                        onClick={() => {
                          setOccSubmitted(false);
                          setIsOccupationalModalOpen(true);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Banknote size={13} className="text-emerald-400" />
                        <span>Base Tariff: ₱650</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setOccSubmitted(false);
                          setIsOccupationalModalOpen(true);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <FileText size={13} className="text-emerald-400" />
                        <span>Requirements</span>
                      </button>
                    </div>

                    {/* Moved to Right: Document Upload Info */}
                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-black/45 border border-emerald-500/30 backdrop-blur-xs space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                        <Camera size={14} />
                        <span>Document Photo & Picture Upload Active</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Upload live photos or pictures of your Health Card, Barangay Clearance, Police/NBI Clearance, and Photo ID.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Health / Medical Exam
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Barangay Work Clearance
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Police / NBI Clearance
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Valid Photo ID
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* CARD 3: BUSINESS INFORMATION SYSTEM - PURPLE / FUCHSIA THEME */}
              {/* ======================================================================= */}
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1c0c28] via-[#281039] to-[#0e0415] border border-purple-500/40 p-6 sm:p-8 shadow-2xl shadow-purple-950/40 group transition-all duration-300">
                {/* Ambient glow effects */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-fuchsia-600/10 blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 relative z-10">
                  {/* Left Column: Info & Details */}
                  <div className="flex-1 space-y-4">
                    {/* Title & Subtitle */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        BUSINESS INFORMATION SYSTEM
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 italic mt-1 leading-relaxed max-w-2xl">
                        "Request and secure Certified True Copies (CTC) of your Mayor's Permit"
                      </p>
                    </div>

                    {/* 5 Information Rows with Circular Icons */}
                    <div className="space-y-2.5 pt-1">
                      {/* Row 1: Target Users */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0">
                          <Users size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">TARGET USERS</span>
                          <p className="text-xs text-slate-400 font-medium">Registered business owners, legal representatives, and financial institutions</p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0">
                          <Briefcase size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">SERVICE METHOD</span>
                          <p className="text-xs text-slate-400 font-medium">Online business registry pulling & authenticated electronic CTC generation</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0">
                          <Clock size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">TIME PERIOD</span>
                          <p className="text-xs text-slate-400 font-medium">Instant online verification / 24 hours for authenticated dry-seal copy</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0">
                          <Banknote size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">CHARGES & PAYMENT</span>
                          <p className="text-xs text-slate-400 font-medium">₱250.00 Document Authentication & Certified True Copy Fee</p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0">
                          <CreditCard size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">PAYMENT METHOD</span>
                          <p className="text-xs text-slate-400 font-medium">Via online portal (Online Banking, e-Wallets, Over-The-Counter)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions & Document Upload Callout */}
                  <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 flex flex-col justify-between space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setBisRecordFound(true);
                        setIsBisModalOpen(true);
                      }}
                      className="w-full py-3.5 px-5 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-purple-600/40 hover:shadow-purple-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Request CTC Online →</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2.5 w-full">
                      <button
                        type="button"
                        onClick={() => {
                          setBisRecordFound(true);
                          setIsBisModalOpen(true);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Banknote size={13} className="text-purple-400" />
                        <span>Legal Tariff: ₱250</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setBisRecordFound(false);
                          setIsBisModalOpen(true);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Search size={13} className="text-purple-400" />
                        <span>Search Records</span>
                      </button>
                    </div>

                    {/* Moved to Right: Document Upload Info */}
                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-black/45 border border-purple-500/30 backdrop-blur-xs space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                        <Camera size={14} />
                        <span>Document Photo & Picture Upload Active</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Upload live photos or pictures of Registered Permit No., Business BIN Record, Owner ID, and DTI/SEC Articles.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>Registered Permit No.
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>Business BIN Record
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>Owner Photo ID
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>DTI/SEC Articles
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* CARD 4: MAYOR'S PERMIT VERIFICATION - AMBER / ORANGE THEME */}
              {/* ======================================================================= */}
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#231405] via-[#331c07] to-[#120a02] border border-amber-500/40 p-6 sm:p-8 shadow-2xl shadow-amber-950/40 group transition-all duration-300">
                {/* Ambient glow effects */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 relative z-10">
                  {/* Left Column: Info & Details */}
                  <div className="flex-1 space-y-4">
                    {/* Title & Subtitle */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        MAYOR'S PERMIT VERIFICATION
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 italic mt-1 leading-relaxed max-w-2xl">
                        "Verify whether the business adheres to legal requirements."
                      </p>
                    </div>

                    {/* 5 Information Rows with Circular Icons */}
                    <div className="space-y-2.5 pt-1">
                      {/* Row 1: Target Users */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                          <Users size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">TARGET USERS</span>
                          <p className="text-xs text-slate-400 font-medium">General public, commercial clients, partner vendors, and official city inspectors</p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                          <Briefcase size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">SERVICE METHOD</span>
                          <p className="text-xs text-slate-400 font-medium">Real-time public permit registry verification and QR cryptographic validation</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                          <Clock size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">TIME PERIOD</span>
                          <p className="text-xs text-slate-400 font-medium">Instantaneous real-time database validation</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                          <Banknote size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">CHARGES & PAYMENT</span>
                          <p className="text-xs text-slate-400 font-medium">Free public government service - ₱0.00 No Charge</p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                          <CreditCard size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">PAYMENT METHOD</span>
                          <p className="text-xs text-slate-400 font-medium">Public transparency service (Free of charge)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions & Document Upload Callout */}
                  <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 flex flex-col justify-between space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setVerificationResult(true);
                        setIsVerificationModalOpen(true);
                      }}
                      className="w-full py-3.5 px-5 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-amber-600/40 hover:shadow-amber-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Verify Business Permit →</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2.5 w-full">
                      <button
                        type="button"
                        onClick={() => {
                          setVerificationResult(true);
                          setIsVerificationModalOpen(true);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShieldCheck size={13} className="text-amber-400" />
                        <span>Free Public Service</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setVerificationResult(true);
                          setIsVerificationModalOpen(true);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <QrCode size={13} className="text-amber-400" />
                        <span>Scan QR</span>
                      </button>
                    </div>

                    {/* Moved to Right: Document Upload Info */}
                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-black/45 border border-amber-500/30 backdrop-blur-xs space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                        <Camera size={14} />
                        <span>Document Photo & Picture Upload Active</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Live public verification against official city registry database with QR code validation.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Live Compliance Check
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Sanitary Cleared
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Fire Safety Cleared
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Zoning Validated
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>





          </div>
        )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 0: SELECT APPLICATION TYPE (MATCHING PICTURE 2 REFERENCE) */}
      {/* ========================================================================= */}
      {currentView === 'select_type' && (
        <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200 max-w-5xl mx-auto">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between pb-1">
            <button
              type="button"
              onClick={() => setCurrentView('preview')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back to Services</span>
            </button>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Business Permit Filing Type
            </span>
          </div>

          {/* 4 Cards Exactly Matching Picture 2 */}
          <div className="space-y-3 sm:space-y-4">
            {/* 1. NEW */}
            <div
              onClick={() => {
                setWizardStep(1);
                setCurrentView('new_app');
              }}
              className="w-full p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-500 dark:hover:border-sky-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
            >
              <span className="text-[#0e5c7a] dark:text-sky-400 font-extrabold text-base sm:text-lg tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                NEW
              </span>
              <ArrowRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
            </div>

            {/* 2. RENEWAL */}
            <div
              onClick={() => setCurrentView('renewal')}
              className="w-full p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-500 dark:hover:border-sky-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
            >
              <span className="text-[#0e5c7a] dark:text-sky-400 font-extrabold text-base sm:text-lg tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                RENEWAL
              </span>
              <ArrowRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
            </div>

            {/* 3. AMENDMENT */}
            <div
              onClick={() => setCurrentView('amendment')}
              className="w-full p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-500 dark:hover:border-sky-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
            >
              <span className="text-[#0e5c7a] dark:text-sky-400 font-extrabold text-base sm:text-lg tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                AMENDMENT
              </span>
              <ArrowRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
            </div>

            {/* 4. SPECIAL PERMIT */}
            <div
              onClick={() => setCurrentView('special_permit')}
              className="w-full p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-500 dark:hover:border-sky-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
            >
              <span className="text-[#0e5c7a] dark:text-sky-400 font-extrabold text-base sm:text-lg tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                SPECIAL PERMIT
              </span>
              <ArrowRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: QUEZON CITY BOSS WORKFLOW WIZARD */}
      {/* ========================================================================= */}
      {currentView === 'new_app' && (
        <BusinessPermitUploadWizard
          onBack={() => setCurrentView('select_type')}
          onAddNewApplication={onAddNewApplication}
          onNavigateToDashboard={onNavigateToDashboard}
          onNavigateToTab={onNavigateToTab}
          initialAppType="NEW"
        />
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: RENEWAL */}
      {/* ========================================================================= */}
      {currentView === 'renewal' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-md space-y-6 animate-in fade-in max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <button
                type="button"
                onClick={() => setCurrentView('select_type')}
                className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-400 cursor-pointer transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Back to Permit Types</span>
              </button>
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
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-md space-y-6 animate-in fade-in max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <button
                type="button"
                onClick={() => setCurrentView('select_type')}
                className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-400 cursor-pointer transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Back to Permit Types</span>
              </button>
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
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-md space-y-6 animate-in fade-in max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <button
                type="button"
                onClick={() => setCurrentView('select_type')}
                className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 cursor-pointer transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Back to Permit Types</span>
              </button>
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

      {/* ========================================================================= */}
      {/* MODAL 1: APPLY FOR OCCUPATIONAL / WORK PERMIT */}
      {/* ========================================================================= */}
      {isOccupationalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 space-y-0">
            <div className="p-6 bg-[#0e5c7a] text-white flex items-center justify-between">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-white/20 text-white border border-white/20">
                  Workforce & Labor Licensing
                </span>
                <h3 className="text-base sm:text-lg font-black tracking-wide uppercase">
                  APPLY FOR OCCUPATIONAL / WORK PERMIT
                </h3>
                <p className="text-xs text-sky-100">
                  Complete the online application for an occupational permit and await an email notification.
                </p>
              </div>
              <button 
                onClick={() => setIsOccupationalModalOpen(false)} 
                className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs">
              {occSubmitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    Occupational Permit Application Received!
                  </h4>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Your work permit application has been filed. An official reference code has been issued and evaluation is underway.
                  </p>
                  <div className="inline-block p-2.5 bg-blue-50 dark:bg-blue-950/60 rounded-xl border border-blue-200 dark:border-blue-800 font-mono font-bold text-blue-700 dark:text-blue-300">
                    Tracking No: WP-2026-88192
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Worker Full Legal Name *
                      </label>
                      <input 
                        type="text" 
                        defaultValue={user?.name || "Juan Dela Cruz"} 
                        className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 font-bold" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Mobile Contact Number *
                      </label>
                      <input 
                        type="text" 
                        defaultValue="+63 917 555 0192" 
                        className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 font-mono font-bold" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Occupational Position / Category *
                      </label>
                      <select className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 font-bold">
                        <option>Food Handler / Kitchen Staff</option>
                        <option>Retail Cashier / Sales Representative</option>
                        <option>Service & Hospitality Personnel</option>
                        <option>Security & Building Safety Officer</option>
                        <option>Professional / Technical Executive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Employer / Commercial Establishment *
                      </label>
                      <input 
                        type="text" 
                        defaultValue="ABC Computer Shop" 
                        className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 font-bold" 
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 space-y-2">
                    <span className="font-bold text-blue-900 dark:text-blue-200 block">
                      Required Clearance Uploads (Photo or PDF):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border flex items-center justify-between">
                        <span>1. Health / Sanitary Clearance</span>
                        <span className="text-emerald-600 font-bold">✓ Attached</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border flex items-center justify-between">
                        <span>2. Barangay Work Clearance</span>
                        <span className="text-emerald-600 font-bold">✓ Attached</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border flex items-center justify-between">
                        <span>3. Police / NBI Clearance</span>
                        <span className="text-emerald-600 font-bold">✓ Attached</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border flex items-center justify-between">
                        <span>4. Valid Government Photo ID</span>
                        <span className="text-emerald-600 font-bold">✓ Attached</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t flex justify-end gap-2">
              <button 
                onClick={() => setIsOccupationalModalOpen(false)}
                className="px-4 py-2 border rounded-xl font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              {!occSubmitted && (
                <button 
                  onClick={() => setOccSubmitted(true)}
                  className="px-5 py-2 bg-[#0e5c7a] hover:bg-[#0c4e68] text-white rounded-xl font-black shadow-md"
                >
                  Submit Application →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BUSINESS INFORMATION SYSTEM (CTC REQUEST) */}
      {/* ========================================================================= */}
      {isBisModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 space-y-0">
            <div className="p-6 bg-[#0e5c7a] text-white flex items-center justify-between">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-white/20 text-white border border-white/20">
                  Official Records & Certifications
                </span>
                <h3 className="text-base sm:text-lg font-black tracking-wide uppercase">
                  BUSINESS INFORMATION SYSTEM
                </h3>
                <p className="text-xs text-sky-100">
                  Request and secure Certified True Copies (CTC) of your Mayor's Permit
                </p>
              </div>
              <button 
                onClick={() => setIsBisModalOpen(false)} 
                className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={bisSearchQuery} 
                  onChange={(e) => setBisSearchQuery(e.target.value)}
                  placeholder="Enter Business Permit No. or BIN (e.g. BP-2026-48190)..."
                  className="flex-1 p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 font-bold" 
                />
                <button 
                  onClick={() => setBisRecordFound(true)}
                  className="px-5 py-2.5 bg-[#0e5c7a] hover:bg-[#0c4e68] text-white rounded-xl font-bold cursor-pointer"
                >
                  Search
                </button>
              </div>

              {bisRecordFound && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 uppercase">Registered Business Record</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">ACTIVE & REGISTERED</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Business Name:</span>
                      <strong className="text-slate-900 dark:text-white">ABC Computer Shop</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Proprietor:</span>
                      <strong className="text-slate-900 dark:text-white">Juan Dela Cruz</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Permit Reference:</span>
                      <span className="font-mono text-blue-600">MP-2026-48190</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Validity:</span>
                      <span>Calendar Year 2026</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Certified True Copy (CTC) Issuance</span>
                      <span className="text-[11px] text-slate-500">Government certified official electronic document with dry seal and QR</span>
                    </div>
                    <button 
                      onClick={() => alert('Official Certified True Copy (CTC) generated and downloaded with authenticated QR signature.')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Request & Download CTC
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t flex justify-end">
              <button 
                onClick={() => setIsBisModalOpen(false)}
                className="px-4 py-2 border rounded-xl font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: MAYOR'S PERMIT VERIFICATION */}
      {/* ========================================================================= */}
      {isVerificationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 space-y-0">
            <div className="p-6 bg-[#0e5c7a] text-white flex items-center justify-between">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-white/20 text-white border border-white/20">
                  Public Transparency & Regulatory Compliance
                </span>
                <h3 className="text-base sm:text-lg font-black tracking-wide uppercase">
                  MAYOR'S PERMIT VERIFICATION
                </h3>
                <p className="text-xs text-sky-100">
                  Verify whether the business adheres to legal requirements.
                </p>
              </div>
              <button 
                onClick={() => setIsVerificationModalOpen(false)} 
                className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={verificationQuery} 
                  onChange={(e) => setVerificationQuery(e.target.value)}
                  placeholder="Enter Business Name or Permit Number..."
                  className="flex-1 p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 font-bold" 
                />
                <button 
                  onClick={() => setVerificationResult(true)}
                  className="px-5 py-2.5 bg-[#0e5c7a] hover:bg-[#0c4e68] text-white rounded-xl font-bold cursor-pointer"
                >
                  Verify
                </button>
              </div>

              {verificationResult && (
                <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border-2 border-emerald-400 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 size={20} />
                      <span className="font-black text-sm uppercase">VERIFIED & FULLY COMPLIANT</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-emerald-700 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-full border">
                      Active LGU Registry Record
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-white dark:bg-slate-900 p-4 rounded-xl border">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Establishment:</span>
                      <strong className="text-slate-900 dark:text-white">ABC Computer Shop</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Proprietor:</span>
                      <strong className="text-slate-900 dark:text-white">Juan Dela Cruz</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Mayor's Permit No:</span>
                      <span className="font-mono font-bold text-blue-600">MP-2026-48190</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Zoning & Environmental:</span>
                      <span className="text-emerald-600 font-bold">PASSED & CLEARED</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Cryptographic Seal: QC-BOSS-AUTH-48190</span>
                    <span className="text-emerald-600 font-bold">Valid until: Dec 31, 2026</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t flex justify-end">
              <button 
                onClick={() => setIsVerificationModalOpen(false)}
                className="px-4 py-2 border rounded-xl font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
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
