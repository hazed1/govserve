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
  const [bisRecordFound, setBisRecordFound] = useState<boolean>(true);
  const [bisSubmitted, setBisSubmitted] = useState<boolean>(false);
  const [bisCertType, setBisCertType] = useState<string>('ctc_permit');
  const [bisPurpose, setBisPurpose] = useState<string>('Bank Requirement / Loan Application');
  const [bisFiles, setBisFiles] = useState<{
    [key: string]: { name: string; size: string; date: string; previewUrl: string } | null;
  }>({
    owner_id: null,
    permit_copy: null,
    dti_sec: null,
    spa_sec_cert: null,
    affidavit_loss: null
  });
  const [bisActiveUploadId, setBisActiveUploadId] = useState<string | null>(null);
  const bisFileInputRef = useRef<HTMLInputElement>(null);
  const [bisTrackingNumber] = useState<string>('CTC-QC-2026-094182');

  const handleBisFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && bisActiveUploadId) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const fakeUrl = URL.createObjectURL(file);
      setBisFiles(prev => ({
        ...prev,
        [bisActiveUploadId]: {
          name: file.name,
          size: `${sizeMb} MB`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          previewUrl: fakeUrl
        }
      }));
    }
    if (e.target) e.target.value = '';
  };

  const removeBisFile = (id: string) => {
    setBisFiles(prev => ({ ...prev, [id]: null }));
  };

  const loadSampleBisDocuments = () => {
    setBisFiles({
      owner_id: {
        name: 'QC_Citizen_ID_Juan_Dela_Cruz.jpg',
        size: '2.8 MB',
        date: 'Sept 25, 2026',
        previewUrl: '/government-logo.png'
      },
      permit_copy: {
        name: 'Mayors_Permit_ABC_Trading_CY2025.pdf',
        size: '1.9 MB',
        date: 'Sept 25, 2026',
        previewUrl: '/government-logo.png'
      },
      dti_sec: {
        name: 'DTI_Certificate_Of_Business_Name_Registration.pdf',
        size: '1.4 MB',
        date: 'Sept 25, 2026',
        previewUrl: '/government-logo.png'
      },
      spa_sec_cert: {
        name: 'Special_Power_Of_Attorney_Notarized.pdf',
        size: '1.1 MB',
        date: 'Sept 25, 2026',
        previewUrl: '/government-logo.png'
      },
      affidavit_loss: null
    });
  };

  const [verificationQuery, setVerificationQuery] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<boolean>(false);
  const [verificationMode, setVerificationMode] = useState<'permit_no' | 'name' | 'upload_qr'>('permit_no');
  const [verificationQrFile, setVerificationQrFile] = useState<{ name: string; previewUrl: string } | null>(null);
  const qrFileInputRef = useRef<HTMLInputElement>(null);
  const [verificationSampleType, setVerificationSampleType] = useState<'active_abc' | 'active_apex' | 'active_food' | 'expired'>('active_abc');
  const [showVerificationGuide, setShowVerificationGuide] = useState<boolean>(true);

  const resetVerification = () => {
    setVerificationQuery('');
    setVerificationResult(false);
    setVerificationQrFile(null);
  };

  const handleQrFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setVerificationQrFile({ name: file.name, previewUrl: fakeUrl });
      setVerificationResult(true);
      setVerificationSampleType('active_abc');
    }
    if (e.target) e.target.value = '';
  };
  const [occSubmitted, setOccSubmitted] = useState<boolean>(false);

  // Occupational Permit State (QC E-Services Citizen's Charter Upload System)
  const [occAppType, setOccAppType] = useState<'regular' | 'first_time'>('regular');
  const [occWorkerData, setOccWorkerData] = useState({
    fullName: 'Juan Santos Dela Cruz',
    contactNumber: '+63 917 555 0192',
    email: 'juan.delacruz@gmail.com',
    occupationCategory: 'Food Handler / Kitchen Staff (Requires Green Health Card)',
    employerName: 'ABC Supermarket & Food Corp.',
    employerAddress: 'Diliman Commercial Strip, Quezon City',
    paymentChannel: 'gcash' as 'gcash' | 'maya' | 'landbank'
  });
  const [occFiles, setOccFiles] = useState<{
    [key: string]: { name: string; size: string; date: string; previewUrl: string } | null;
  }>({
    health_card: null,
    police_nbi: null,
    brgy_clearance: null,
    gov_id: null,
    special_doc: null
  });
  const [occActiveUploadId, setOccActiveUploadId] = useState<string | null>(null);
  const occFileInputRef = useRef<HTMLInputElement>(null);
  const [occPermitNumber] = useState<string>('QC-OCC-2026-084921');

  const handleOccFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && occActiveUploadId) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const fakeUrl = URL.createObjectURL(file);
      setOccFiles(prev => ({
        ...prev,
        [occActiveUploadId]: {
          name: file.name,
          size: `${sizeMb} MB`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          previewUrl: fakeUrl
        }
      }));
    }
    if (e.target) e.target.value = '';
  };

  const removeOccFile = (id: string) => {
    setOccFiles(prev => ({ ...prev, [id]: null }));
  };

  const loadSampleOccClearances = () => {
    setOccFiles({
      health_card: {
        name: 'QC_Health_Certificate_Green_Food_Handler.pdf',
        size: '1.4 MB',
        date: 'Sept 24, 2026',
        previewUrl: '/government-logo.png'
      },
      police_nbi: {
        name: 'PNP_Police_Clearance_QC_District.pdf',
        size: '2.1 MB',
        date: 'Sept 24, 2026',
        previewUrl: '/government-logo.png'
      },
      brgy_clearance: {
        name: 'Barangay_Work_Clearance_Diliman_QC.pdf',
        size: '1.2 MB',
        date: 'Sept 24, 2026',
        previewUrl: '/government-logo.png'
      },
      gov_id: {
        name: 'QC_Citizen_ID_Juan_Dela_Cruz.jpg',
        size: '2.8 MB',
        date: 'Sept 24, 2026',
        previewUrl: '/government-logo.png'
      },
      special_doc: {
        name: 'Community_Tax_Certificate_Cedula_2026.pdf',
        size: '850 KB',
        date: 'Sept 24, 2026',
        previewUrl: '/government-logo.png'
      }
    });
  };

  // Business Tax Paid Check Modal State (Picture 1 reference)
  const [showTaxPaidModal, setShowTaxPaidModal] = useState<boolean>(false);
  const [taxNotPaidNotice, setTaxNotPaidNotice] = useState<boolean>(false);
  const [showExemptionModal, setShowExemptionModal] = useState<boolean>(false);

  // Business Permit Amendment Modal State (Picture 1 reference)
  const [showRenewalModal, setShowRenewalModal] = useState<boolean>(false);
  const [renewalError, setRenewalError] = useState<boolean>(false);
  const [showAmendModal, setShowAmendModal] = useState<boolean>(false);
  const [amendError, setAmendError] = useState<boolean>(false);

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
  const [renewalPermitNo, setRenewalPermitNo] = useState<string>('');
  const [renewalOrNo, setRenewalOrNo] = useState<string>('');
  const [renewalRecord, setRenewalRecord] = useState<any>(null);
  const [renewalGrossSales, setRenewalGrossSales] = useState<string>('2,850,000.00');
  const [renewalSubmitted, setRenewalSubmitted] = useState<boolean>(false);

  // 3. Amendment State
  const [amendPermitNo, setAmendPermitNo] = useState<string>('');
  const [amendOrNo, setAmendOrNo] = useState<string>('');
  const [amendRecord, setAmendRecord] = useState<any>(null);
  const [amendmentType, setAmendmentType] = useState<'trade_name' | 'address' | 'line_of_business' | 'ownership'>('trade_name');
  const [amendedValue, setAmendedValue] = useState<string>('Apex Global Tech & Retail Enterprise');
  const [amendBarangay, setAmendBarangay] = useState<string>('Barangay San Antonio');
  const [amendReason, setAmendReason] = useState<string>('Corporate expansion and addition of electronic hardware distribution line in Quezon City.');
  // Document 1: Primary Registration (DTI / SEC / CDA)
  const [amendProofFile, setAmendProofFile] = useState<string | null>('Amended_DTI_Certificate_2026.pdf');
  const [amendProofFileSize, setAmendProofFileSize] = useState<string>('1.8 MB');
  const [amendProofPreview, setAmendProofPreview] = useState<string | null>('/Amendment.jpg');
  const [amendProofDate, setAmendProofDate] = useState<string>('Sep 25, 2026');
  const proofFileInputRef = useRef<HTMLInputElement>(null);

  // Document 2: Barangay Clearance
  const [amendBarangayFile, setAmendBarangayFile] = useState<string | null>('Barangay_Clearance_Amendment_QC.pdf');
  const [amendBarangayFileSize, setAmendBarangayFileSize] = useState<string>('940 KB');
  const [amendBarangayPreview, setAmendBarangayPreview] = useState<string | null>('/New Application.jpg');
  const [amendBarangayDate, setAmendBarangayDate] = useState<string>('Sep 24, 2026');
  const barangayFileInputRef = useRef<HTMLInputElement>(null);

  // Document 3: Notarized Legal Instrument
  const [amendLegalFile, setAmendLegalFile] = useState<string | null>('Notarized_Board_Resolution_Amendment.pdf');
  const [amendLegalFileSize, setAmendLegalFileSize] = useState<string>('2.4 MB');
  const [amendLegalPreview, setAmendLegalPreview] = useState<string | null>('/Special Permit.jpg');
  const [amendLegalDate, setAmendLegalDate] = useState<string>('Sep 23, 2026');
  const legalFileInputRef = useRef<HTMLInputElement>(null);

  // Drag-and-drop & notification states
  const [dragActiveDoc, setDragActiveDoc] = useState<'proof' | 'barangay' | 'legal' | null>(null);
  const [uploadToast, setUploadToast] = useState<string | null>(null);

  // Document Preview Modal State
  const [previewDocModal, setPreviewDocModal] = useState<{
    isOpen: boolean;
    title: string;
    fileName: string;
    fileSize: string;
    previewUrl: string;
    docCategory: string;
    date: string;
    docKey: string;
  } | null>(null);

  const handleAmendDocUpload = (
    docKey: 'proof' | 'barangay' | 'legal',
    files: FileList | null
  ) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;
    const previewUrl = file.type.startsWith('image/') 
      ? URL.createObjectURL(file) 
      : (docKey === 'proof' ? '/Amendment.jpg' : docKey === 'barangay' ? '/New Application.jpg' : '/Special Permit.jpg');
    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (docKey === 'proof') {
      setAmendProofFile(file.name);
      setAmendProofFileSize(sizeStr);
      setAmendProofPreview(previewUrl);
      setAmendProofDate(nowStr);
    } else if (docKey === 'barangay') {
      setAmendBarangayFile(file.name);
      setAmendBarangayFileSize(sizeStr);
      setAmendBarangayPreview(previewUrl);
      setAmendBarangayDate(nowStr);
    } else {
      setAmendLegalFile(file.name);
      setAmendLegalFileSize(sizeStr);
      setAmendLegalPreview(previewUrl);
      setAmendLegalDate(nowStr);
    }

    setUploadToast(`✓ Successfully uploaded: ${file.name} (${sizeStr})`);
    setTimeout(() => setUploadToast(null), 4000);
  };

  const handleDownloadDoc = (fileName: string, previewUrl?: string) => {
    const link = document.createElement('a');
    link.href = previewUrl || '/Amendment.jpg';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [amendSworn, setAmendSworn] = useState<boolean>(true);
  const [amendSubmitted, setAmendSubmitted] = useState<boolean>(false);
  const [amendRefNo, setAmendRefNo] = useState<string>('AMD-QC-2026-008194');

  // 4. Pay Business Tax State
  const [taxBin, setTaxBin] = useState<string>('BP-2024-00123');
  const [taxPaymentMethod, setTaxPaymentMethod] = useState<'gcash' | 'maya' | 'landbank' | 'eprovider'>('gcash');
  const [taxPaymentReceipt, setTaxPaymentReceipt] = useState<any>(null);
  const [isProcessingTax, setIsProcessingTax] = useState<boolean>(false);

  // 5. Special Permit (Short Term / Event) State - Unified Online Permit Flow (7 Steps)
  const [specialStep, setSpecialStep] = useState<number>(1);
  const [specialTermsAccepted, setSpecialTermsAccepted] = useState<boolean>(false);
  const [specialData, setSpecialData] = useState({
    businessName: 'Apex Media & Events Entertainment Inc.',
    tin: '008-912-345-000',
    dtiSecNumber: 'SEC CS2022091234',
    entityClassification: 'Corporation',
    registeredAddress: 'Unit 402 QC Hall of Justice Annex, Elliptical Road, Diliman, Quezon City',
    organizerName: 'Juan Dela Cruz',
    organizerContact: '+63 917 888 1234',
    organizerEmail: 'events@apexqc.ph',
    operationType: 'Promotional Events & Product Activations',
    operatingHours: '08:00 AM - 10:00 PM',
    expectedAttendees: '2,500 visitors / day',
    venueArea: '1,500 sq.m.',
    soundAmplification: true,
    ingressDate: '2026-10-14 06:00 AM',
    egressDate: '2026-10-19 11:00 PM',
    commercialActivity: 'Commercial Exhibitions, Tech Demos & Food Stalls',
    boothCount: '35 booths',
    admissionType: 'Free Admission',
    foodSelling: true,
    generatorEquipment: false,
    bannerSignage: true,
    eventTitle: 'QC Mid-Year Tech Expo & Food Festival 2026',
    venue: 'Quezon City Memorial Circle Grand Pavilion',
    venueAddress: 'Elliptical Road, Diliman, Quezon City',
    barangay: 'Central',
    startDate: '2026-10-15',
    endDate: '2026-10-18',
    safetyOfficer: 'Capt. Ricardo Gomez (Accredited Safety Marshall)',
    wasteManagementPlan: true
  });
  const [specialSubmitted, setSpecialSubmitted] = useState<boolean>(false);
  const [specialRefNumber, setSpecialRefNumber] = useState<string>('SP-QC-2026-004921');

  // Step 2: 8 Basic Documentary Requirements (Unified Online Permit - Picture 1 Checklist)
  const [basicDocItems, setBasicDocItems] = useState<{
    id: string;
    hasAsterisk: boolean;
    label: string;
    parenthetical: string;
    badge: 'Required' | 'when applicable' | 'optional';
    checked: boolean;
    file: { name: string; size: string; date: string; previewUrl: string } | null;
  }[]>([
    {
      id: 'req_letter',
      hasAsterisk: true,
      label: 'Request Letter to BPLD Head',
      parenthetical: '[should include the following: Period Covered, Venue Capacity, # of Attendees, Health Protocols, with ticket selling ?]',
      badge: 'Required',
      checked: true,
      file: null
    },
    {
      id: 'bus_reg',
      hasAsterisk: true,
      label: 'Proof of Business Registration (DTI for Sole Proprietorship/SEC for Corporations and Partnerships/CDA for Cooperatives)* TCT / Tax Declaration',
      parenthetical: '',
      badge: 'Required',
      checked: false,
      file: null
    },
    {
      id: 'contract_lease',
      hasAsterisk: true,
      label: 'Contract of Lease (if leased) or Tax Declaration (if owned)',
      parenthetical: '',
      badge: 'Required',
      checked: false,
      file: null
    },
    {
      id: 'swp',
      hasAsterisk: false,
      label: 'Special Working Permit (SWP) from Bureau of Immigration if applicant is a foreigner',
      parenthetical: '',
      badge: 'when applicable',
      checked: false,
      file: null
    },
    {
      id: 'councilor_permit',
      hasAsterisk: false,
      label: 'Special Permit from City Councilor for Seasonal Operations',
      parenthetical: '',
      badge: 'when applicable',
      checked: false,
      file: null
    },
    {
      id: 'occupancy_permit',
      hasAsterisk: false,
      label: 'Occupancy Permit',
      parenthetical: '',
      badge: 'when applicable',
      checked: false,
      file: null
    },
    {
      id: 'location_sketch',
      hasAsterisk: false,
      label: 'Sketch and photos of location of business',
      parenthetical: '',
      badge: 'when applicable',
      checked: false,
      file: null
    },
    {
      id: 'other_docs',
      hasAsterisk: false,
      label: 'Other documentary file/s as needed',
      parenthetical: '',
      badge: 'optional',
      checked: false,
      file: null
    }
  ]);

  const [activeUploadDocId, setActiveUploadDocId] = useState<string>('req_letter');
  const basicDocFileInputRef = useRef<HTMLInputElement>(null);

  const handleBasicDocFileUpload = (file: File) => {
    let sizeStr = '';
    if (file.size < 1024 * 1024) {
      sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
    } else {
      sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    const previewUrl = file.type.startsWith('image/') 
      ? URL.createObjectURL(file) 
      : (activeUploadDocId === 'req_letter' ? '/New Application.jpg' : activeUploadDocId === 'bus_reg' ? '/Amendment.jpg' : activeUploadDocId === 'contract_lease' ? '/Renewal.jpg' : '/Special Permit.jpg');
    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    setBasicDocItems(prev => prev.map(item => {
      if (item.id === activeUploadDocId) {
        return {
          ...item,
          checked: true,
          file: {
            name: file.name,
            size: sizeStr,
            date: nowStr,
            previewUrl
          }
        };
      }
      return item;
    }));

    setUploadToast(`✓ Successfully attached: ${file.name} (${sizeStr})`);
    setTimeout(() => setUploadToast(null), 4000);
  };

  const toggleDocItemCheck = (id: string) => {
    setBasicDocItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, checked: !item.checked };
      }
      return item;
    }));
  };

  const removeDocFile = (id: string) => {
    setBasicDocItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, file: null };
      }
      return item;
    }));
  };

  const loadSampleDocAttachments = () => {
    setBasicDocItems(prev => prev.map(item => {
      if (item.id === 'req_letter') {
        return {
          ...item,
          checked: true,
          file: {
            name: 'QC_BPLO_Request_Letter_Signed.pdf',
            size: '1.2 MB',
            date: '2026-09-24',
            previewUrl: '/New Application.jpg'
          }
        };
      }
      if (item.id === 'bus_reg') {
        return {
          ...item,
          checked: true,
          file: {
            name: 'DTI_SEC_Certificate_Apex_Events.pdf',
            size: '2.1 MB',
            date: '2026-09-24',
            previewUrl: '/Amendment.jpg'
          }
        };
      }
      if (item.id === 'contract_lease') {
        return {
          ...item,
          checked: true,
          file: {
            name: 'Venue_Lease_Contract_QCMC.pdf',
            size: '3.4 MB',
            date: '2026-09-24',
            previewUrl: '/Renewal.jpg'
          }
        };
      }
      return item;
    }));
    setUploadToast('✓ Loaded sample QC mandatory attachments');
    setTimeout(() => setUploadToast(null), 3000);
  };

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
            {/* 4 CORE SERVICES (RICH HORIZONTAL CARDS WITH BALANCED ZERO-WASTE LAYOUT) */}
            {/* ========================================================================= */}
            <div className="space-y-5 sm:space-y-6">
              
              {/* ======================================================================= */}
              {/* CARD 1: APPLY FOR MAYOR'S PERMIT (BUSINESS) - BLUE / SKY THEME */}
              {/* ======================================================================= */}
              <div 
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-sky-50/70 to-blue-50/50 dark:from-[#061426] dark:via-[#091e38] dark:to-[#030914] border border-sky-200 dark:border-sky-500/40 p-6 sm:p-8 shadow-xl shadow-sky-900/5 dark:shadow-2xl dark:shadow-sky-950/40 group transition-all duration-300 select-text"
              >
                {/* Ambient glow effects */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-sky-400/10 dark:bg-sky-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 relative z-10">
                  {/* Left Column: Info & Details */}
                  <div className="flex-1 space-y-4">
                    {/* Title */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        APPLY FOR MAYOR'S PERMIT (BUSINESS)
                      </h3>
                    </div>

                    {/* 5 Information Rows with Circular Icons */}
                    <div className="space-y-2.5 pt-1">
                      {/* Row 1: Target Users */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Users size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">TARGET USERS</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Business owners and applicants</p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Briefcase size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">SERVICE METHOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Online Business Permit Application</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Clock size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">TIME PERIOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Subject to document evaluation and approval</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Banknote size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">CHARGES & PAYMENT</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Based on the applicable business assessment</p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <CreditCard size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">PAYMENT METHOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Online payment / available payment method</p>
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

                      
                    </div>

                    {/* Picture 3 Moved to Right: Document Photo & Picture Upload Active */}
                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-black/45 border border-sky-200 dark:border-sky-500/30 backdrop-blur-xs space-y-2 shadow-xs dark:shadow-none">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-400">
                        <Camera size={14} />
                        <span>Document Photo & Picture Upload Active</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        Upload live photos or pictures of your Valid ID, Business Registration (DTI/SEC/CDA), Location Proof, and Storefront Photo.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2.5 py-1 rounded-md bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400"></span>Valid Gov ID
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400"></span>DTI / SEC / CDA
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400"></span>Location Proof
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400"></span>Storefront Photo
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* CARD 2: APPLY FOR OCCUPATIONAL / WORK PERMIT - GREEN / EMERALD THEME */}
              {/* ======================================================================= */}
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-emerald-50/70 to-teal-50/50 dark:from-[#051b13] dark:via-[#07291d] dark:to-[#020e0a] border border-emerald-200 dark:border-emerald-500/40 p-6 sm:p-8 shadow-xl shadow-emerald-900/5 dark:shadow-2xl dark:shadow-emerald-950/40 group transition-all duration-300">
                {/* Ambient glow effects */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-400/10 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-teal-500/10 dark:bg-teal-600/10 blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 relative z-10">
                  {/* Left Column: Info & Details */}
                  <div className="flex-1 space-y-4">
                    {/* Title */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        APPLY FOR OCCUPATIONAL / WORK PERMIT
                      </h3>
                    </div>

                    {/* 5 Information Rows with Circular Icons */}
                    <div className="space-y-2.5 pt-1">
                      {/* Row 1: Target Users */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-400/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                          <Users size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">TARGET USERS</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Non-professional commercial staff, food handlers, cashiers, salon/spa, security & service employees in QC <span className="text-slate-500 dark:text-slate-400 italic">(Exempt: Supervisors & PTR-licensed professionals)</span></p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-400/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                          <Briefcase size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">SERVICE METHOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Online clearance & document filing via QC E-Services with digital validation</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-400/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                          <Clock size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">TIME PERIOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">1 to 2 working days upon submission of complete health & police clearances</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-400/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                          <Banknote size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">CHARGES & PAYMENT</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">₱170.00 Standard QC BPLD Tariff <span className="text-emerald-700 dark:text-emerald-400 font-bold">(₱0.00 Free for First-Time Jobseekers under RA 11261)</span></p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-400/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                          <CreditCard size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">PAYMENT METHOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">QC Pay Easy (e-Wallets, Maya, GCash, Landbank Link.Biz, Credit/Debit)</p>
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

                    

                    {/* Right: Clearance Upload Portal Info */}
                    <div 
                      className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-black/45 border border-emerald-200 dark:border-emerald-500/30 backdrop-blur-xs space-y-2 select-text shadow-xs dark:shadow-none"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          <Camera size={14} />
                          <span>Clearance & Document Upload Portal Active</span>
                        </div>
                        
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        Fast-track online processing: Upload clear photos or PDF scans of your QC Health Card, Police/NBI Clearance, Barangay Clearance, and Photo ID.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50/80 dark:bg-white/5 border border-emerald-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>QC Health / Sanitary Card
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50/80 dark:bg-white/5 border border-emerald-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>Police or NBI Clearance
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50/80 dark:bg-white/5 border border-emerald-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>Barangay Work Clearance
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50/80 dark:bg-white/5 border border-emerald-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>Valid Government Photo ID
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50/80 dark:bg-white/5 border border-emerald-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>Cedula / RA 11261 PESO Cert
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* CARD 3: BUSINESS INFORMATION SYSTEM - PURPLE / FUCHSIA THEME */}
              {/* ======================================================================= */}
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-purple-50/70 to-fuchsia-50/50 dark:from-[#1c0c28] dark:via-[#281039] dark:to-[#0e0415] border border-purple-200 dark:border-purple-500/40 p-6 sm:p-8 shadow-xl shadow-purple-900/5 dark:shadow-2xl dark:shadow-purple-950/40 group transition-all duration-300">
                {/* Ambient glow effects */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-purple-400/10 dark:bg-purple-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-fuchsia-500/10 dark:bg-fuchsia-600/10 blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 relative z-10">
                  {/* Left Column: Info & Details */}
                  <div className="flex-1 space-y-4">
                    {/* Title */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        BUSINESS INFORMATION SYSTEM
                      </h3>
                    </div>

                    {/* 5 Information Rows with Circular Icons */}
                    <div className="space-y-2.5 pt-1">
                      {/* Row 1: Target Users */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-400/40 flex items-center justify-center text-purple-700 dark:text-purple-300 shrink-0">
                          <Users size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">TARGET USERS</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Registered business owners, corporate officers, legal counsel, and authorized representatives in QC</p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-400/40 flex items-center justify-center text-purple-700 dark:text-purple-300 shrink-0">
                          <Briefcase size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">SERVICE METHOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Online business registry verification & document upload via QC E-Services with digital certification</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-400/40 flex items-center justify-center text-purple-700 dark:text-purple-300 shrink-0">
                          <Clock size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">TIME PERIOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">1 to 2 working days (Instant verified preview / Authenticated electronic CTC with QR code)</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-400/40 flex items-center justify-center text-purple-700 dark:text-purple-300 shrink-0">
                          <Banknote size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">CHARGES & PAYMENT</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">₱220.00 Official QC BPLD Tariff <span className="text-purple-700 dark:text-purple-300 font-bold">(₱200.00 CTC Fee + ₱20.00 Legal Research & Documentary Stamp)</span></p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-400/40 flex items-center justify-center text-purple-700 dark:text-purple-300 shrink-0">
                          <CreditCard size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">PAYMENT METHOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">QC Pay Easy (e-Wallets, Maya, GCash, Landbank Link.Biz, Credit/Debit)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions & Document Upload Callout */}
                  <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 flex flex-col justify-between space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setBisSubmitted(false);
                        setBisRecordFound(true);
                        setIsBisModalOpen(true);
                      }}
                      className="w-full py-3.5 px-5 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-purple-600/40 hover:shadow-purple-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Request CTC Online →</span>
                    </button>

                    

                    {/* Right: Document Upload Info */}
                    <div 
                      className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-black/45 border border-purple-200 dark:border-purple-500/30 backdrop-blur-xs space-y-2 select-text shadow-xs dark:shadow-none"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-400">
                          <Camera size={14} />
                          <span>Clearance & Document Upload Portal Active</span>
                        </div>
                        
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        Fast-track CTC processing: Upload clear photos or PDF scans of your Valid Owner ID, Copy of Mayor's Permit / OR, DTI/SEC Registration, and SPA.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2.5 py-1 rounded-md bg-purple-50/80 dark:bg-white/5 border border-purple-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400"></span>Valid Government Photo ID
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-purple-50/80 dark:bg-white/5 border border-purple-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400"></span>Copy of Mayor's Permit / OR
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-purple-50/80 dark:bg-white/5 border border-purple-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400"></span>DTI / SEC Registration
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-purple-50/80 dark:bg-white/5 border border-purple-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400"></span>Letter of Authority / SPA
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-purple-50/80 dark:bg-white/5 border border-purple-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400"></span>Affidavit of Loss (if lost)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* CARD 4: MAYOR'S PERMIT VERIFICATION - AMBER / ORANGE THEME */}
              {/* ======================================================================= */}
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-amber-50/70 to-orange-50/50 dark:from-[#231405] dark:via-[#331c07] dark:to-[#120a02] border border-amber-200 dark:border-amber-500/40 p-6 sm:p-8 shadow-xl shadow-amber-900/5 dark:shadow-2xl dark:shadow-amber-950/40 group transition-all duration-300">
                {/* Ambient glow effects */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-amber-400/10 dark:bg-amber-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-orange-500/10 dark:bg-orange-600/10 blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 relative z-10">
                  {/* Left Column: Info & Details */}
                  <div className="flex-1 space-y-4">
                    {/* Title */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        MAYOR'S PERMIT VERIFICATION
                      </h3>
                    </div>

                    {/* 5 Information Rows with Circular Icons */}
                    <div className="space-y-2.5 pt-1">
                      {/* Row 1: Target Users */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-400/40 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                          <Users size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                            TARGET USERS
                          </span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">
                            General public, commercial partners, financial institutions, property owners, and official city inspectors
                          </p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-400/40 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                          <Briefcase size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                            SERVICE METHOD
                          </span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">
                            100% Online public verification via Permit No., Business Trade Name, or QR Code photo upload
                          </p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-400/40 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                          <Clock size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                            TIME PERIOD
                          </span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">
                            Instantaneous (0 seconds • Real-time live database validation • No waiting time)
                          </p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-400/40 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                          <Banknote size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                            CHARGES & PAYMENT
                          </span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">
                            Free Public Government Service - <span className="text-emerald-700 dark:text-emerald-400 font-bold">₱0.00 No Charge</span>
                          </p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-400/40 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                          <CreditCard size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                            PAYMENT METHOD
                          </span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">
                            Open Public Access (Free of charge / No payment or subscription required)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions & Easy Step-by-Step Callout */}
                  <div className="w-full lg:w-[420px] xl:w-[460px] shrink-0 flex flex-col justify-between space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setVerificationResult(true);
                        setIsVerificationModalOpen(true);
                      }}
                      className="w-full py-3.5 px-5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-amber-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Search size={16} />
                      <span>Verify Business Permit Now (100% Free) →</span>
                    </button>

                    

                    {/* Right: User-Friendly 3-Step Interactive Container */}
                    <div 
                      className="p-4 rounded-2xl bg-white/90 dark:bg-black/55 border border-amber-200 dark:border-amber-500/40 backdrop-blur-sm space-y-2.5 select-text shadow-xs dark:shadow-none"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                          <Camera size={15} />
                          <span>3 Simple Steps to Verify</span>
                        </div>
                        <span className="text-[10px] text-amber-700 dark:text-amber-300 font-extrabold group-hover:translate-x-0.5 transition-transform">Verify Here →</span>
                      </div>

                      {/* 3 Step Pills */}
                      <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                        <div className="p-1.5 rounded-lg bg-amber-50/80 dark:bg-white/5 border border-amber-200 dark:border-white/10 text-slate-700 dark:text-slate-200">
                          <span className="font-bold text-amber-700 dark:text-amber-400 block">1. Enter</span>
                          <span className="text-[9.5px] text-slate-600 dark:text-slate-400">Permit No. or QR</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-amber-50/80 dark:bg-white/5 border border-amber-200 dark:border-white/10 text-slate-700 dark:text-slate-200">
                          <span className="font-bold text-amber-700 dark:text-amber-400 block">2. Check</span>
                          <span className="text-[9.5px] text-slate-600 dark:text-slate-400">QC Database</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-amber-50/80 dark:bg-white/5 border border-amber-200 dark:border-white/10 text-slate-700 dark:text-slate-200">
                          <span className="font-bold text-amber-700 dark:text-amber-400 block">3. Result</span>
                          <span className="text-[9.5px] text-slate-600 dark:text-slate-400">Official Status</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-amber-100/60 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-400/20 text-[9.5px] font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-1">
                          <CheckCircle2 size={10} className="text-amber-600 dark:text-amber-400" /> Active Mayor's Permit
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100/60 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-400/20 text-[9.5px] font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-1">
                          <CheckCircle2 size={10} className="text-amber-600 dark:text-amber-400" /> Sanitary & Health
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100/60 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-400/20 text-[9.5px] font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-1">
                          <CheckCircle2 size={10} className="text-amber-600 dark:text-amber-400" /> BFP Fire Safety
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100/60 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-400/20 text-[9.5px] font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-1">
                          <CheckCircle2 size={10} className="text-amber-600 dark:text-amber-400" /> Zoning & Environmental
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
          <div className="flex items-center pb-1">
            <button
              type="button"
              onClick={() => setCurrentView('preview')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back to Services</span>
            </button>

          </div>

          {/* Heading Matching Picture 1 Background */}
          <div className="text-center pt-2 pb-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#0e5c7a] dark:text-sky-400 uppercase tracking-wider">
              TYPE OF APPLICATION
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              (Please choose one)
            </p>
          </div>

          {/* 4 Cards Matching Reference */}
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
              onClick={() => {
                setRenewalError(false);
                setRenewalPermitNo('');
                setRenewalOrNo('');
                setShowRenewalModal(true);
              }}
              className="w-full p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-500 dark:hover:border-sky-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
            >
              <span className="text-[#0e5c7a] dark:text-sky-400 font-extrabold text-base sm:text-lg tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                RENEWAL
              </span>
              <ArrowRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
            </div>

            {/* 3. AMENDMENT (Exact Picture 2 Representation) */}
            <div
              onClick={() => {
                setAmendError(false);
                setShowAmendModal(true);
              }}
              className="w-full p-5 sm:p-6 rounded-2xl bg-[#09101f] dark:bg-[#070d18] border border-slate-800/90 hover:border-sky-500/80 shadow-md hover:shadow-sky-500/10 transition-all cursor-pointer group flex items-center justify-between"
            >
              <span className="text-[#00c0f9] font-extrabold text-base sm:text-lg tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                AMENDMENT
              </span>
              <ArrowRight size={18} className="text-slate-500 group-hover:text-[#00c0f9] group-hover:translate-x-1 transition-all" />
            </div>

            {/* 4. SPECIAL PERMIT */}
            <div
              onClick={() => setCurrentView('special_permit')}
              className="w-full p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#09101f] border border-slate-200/90 dark:border-slate-800/90 hover:border-blue-500 dark:hover:border-sky-500/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
            >
              <span className="text-[#0e5c7a] dark:text-[#00c0f9] font-extrabold text-base sm:text-lg tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                SPECIAL PERMIT
              </span>
              <ArrowRight size={18} className="text-slate-300 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-[#00c0f9] group-hover:translate-x-1 transition-all" />
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
        <div className="space-y-6 animate-in fade-in max-w-2xl mx-auto">
          {/* Back link */}
          <div className="flex items-center justify-between pb-1">
            
            
          </div>

          {!renewalRecord ? (
            /* ======================================================================= */
            /* APPLICANT INPUT CARD (EXACT REPLICA OF PICTURE 1)                       */
            /* ======================================================================= */
            <div className="bg-[#0b1424] border border-slate-800/90 rounded-2xl shadow-2xl p-6 sm:p-9 relative animate-in zoom-in-95 duration-200 text-left">
              {/* Close (X) icon at top right */}
              <button
                type="button"
                onClick={() => setCurrentView('select_type')}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
                title="Cancel & Return"
              >
                <X size={18} />
              </button>

              {/* Title: APPLICANT INPUT */}
              <div className="text-center pb-6">
                <h3 className="text-base sm:text-lg font-bold tracking-wider text-blue-500 uppercase">
                  APPLICANT INPUT
                </h3>
              </div>

              <div className="space-y-4">
                {/* Field 1: Mayor's Permit Number */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">
                    Mayor's Permit Number:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={renewalPermitNo}
                      onChange={(e) => setRenewalPermitNo(e.target.value)}
                      placeholder="e.g. BP-2025-00123"
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-slate-700/80 bg-[#121c2e] text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                    <div 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors"
                      title="Enter your previous year's Mayor's Permit Number"
                    >
                      <HelpCircle size={18} />
                    </div>
                  </div>
                </div>

                {/* Field 2: Official Receipt No.: */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">
                    Official Receipt No.:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={renewalOrNo}
                      onChange={(e) => setRenewalOrNo(e.target.value)}
                      placeholder={`Input ${new Date().getFullYear()} Official Receipt`}
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-slate-700/80 bg-[#121c2e] text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                    <div 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors"
                      title={`Official Receipt issued by City Treasurer for ${new Date().getFullYear()} Annual Business Tax`}
                    >
                      <HelpCircle size={18} />
                    </div>
                  </div>
                </div>

                {/* Tax Exemption Link */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setShowExemptionModal(true)}
                    className="text-xs sm:text-sm text-sky-500 hover:text-sky-600 hover:underline font-medium cursor-pointer transition-colors"
                  >
                    Is your business qualified for any tax exemption program? Click here
                  </button>
                </div>

                {/* Action Buttons: CANCEL and NEXT */}
                <div className="flex items-center justify-center gap-4 pt-4">
                  

                  <button
                    type="button"
                    onClick={() => {
                      setRenewalRecord({
                        businessName: 'Apex Innovations Retail Hub',
                        owner: 'Juan Dela Cruz',
                        address: 'Unit 402, 4th Floor, 123 Ayala Avenue, QC',
                        previousGrossSales: '₱2,450,000.00',
                        validUntil: `December 31, ${new Date().getFullYear() - 1} (Expired)`,
                        status: `Eligible for ${new Date().getFullYear()} Renewal`
                      });
                    }}
                    className="px-8 sm:px-10 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                  >
                    NEXT
                  </button>
                </div>
              </div>
            </div>
          ) : (
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
        <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
          {/* Top Navigation */}
          <div className="flex items-center justify-between pb-1">
            
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Quezon City E-Services • BPLO Amendment
            </span>
          </div>

          {!amendRecord ? (
            /* ======================================================================= */
            /* APPLICANT INPUT CARD (EXACT REPLICA OF PICTURE 1)                       */
            /* ======================================================================= */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-9 relative animate-in zoom-in-95 duration-200">
              {/* Close (X) icon at top right */}
              <button
                type="button"
                onClick={() => setCurrentView('select_type')}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
                title="Cancel & Return"
              >
                <X size={18} />
              </button>

              {/* Title: APPLICANT INPUT */}
              <div className="text-center pb-5">
                <h3 className="text-lg sm:text-xl font-bold tracking-wide text-blue-700 uppercase">
                  APPLICANT INPUT
                </h3>
              </div>

              <div className="space-y-4">
                {/* Field 1: Mayor's Permit Number: */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                    Mayor's Permit Number:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={amendPermitNo}
                      onChange={(e) => {
                        setAmendPermitNo(e.target.value);
                        if (amendError) setAmendError(false);
                      }}
                      placeholder=""
                      className={`w-full pl-3.5 pr-10 py-2.5 rounded-lg border bg-white text-slate-900 text-xs sm:text-sm transition-colors ${
                        amendError
                          ? 'border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500'
                          : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
                      }`}
                    />
                    <div 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-600 cursor-pointer transition-colors"
                      title="Enter your existing Quezon City Mayor's Permit Number (e.g., BP-2025-004819)"
                      onClick={() => {
                        if (!amendPermitNo) {
                          setAmendPermitNo('BP-2025-004819');
                          setAmendOrNo('OR-2026-99214');
                          setAmendError(false);
                        }
                      }}
                    >
                      <HelpCircle size={18} />
                    </div>
                  </div>
                  {amendError && (
                    <p className="text-red-500 text-xs font-normal mt-1">
                      Required
                    </p>
                  )}
                </div>

                {/* Field 2: Official Receipt No.: */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                    Official Receipt No.:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={amendOrNo}
                      onChange={(e) => setAmendOrNo(e.target.value)}
                      placeholder={`Input ${new Date().getFullYear()} Official Receipt`}
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                    />
                    <div 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-600 cursor-pointer transition-colors"
                      title={`Enter Official Receipt (O.R.) issued by Quezon City Treasurer for ${new Date().getFullYear()} Annual Business Tax`}
                    >
                      <HelpCircle size={18} />
                    </div>
                  </div>
                </div>

                {/* Tax Exemption Link */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setShowExemptionModal(true)}
                    className="text-xs sm:text-sm text-sky-500 hover:text-sky-600 hover:underline font-medium cursor-pointer transition-colors"
                  >
                    Is your business qualified for any tax exemption program? Click here
                  </button>
                </div>

                {/* Action Buttons: CANCEL and NEXT */}
                <div className="flex items-center justify-center gap-4 pt-4">
                  

                  <button
                    type="button"
                    onClick={() => {
                      if (!amendPermitNo.trim()) {
                        setAmendError(true);
                        return;
                      }
                      setAmendError(false);
                      setAmendRecord({
                        permitNo: amendPermitNo.trim(),
                        orNo: amendOrNo.trim() || `OR-QC-${new Date().getFullYear()}-008219`,
                        businessName: 'Apex Innovations Retail Hub',
                        owner: 'Juan Dela Cruz',
                        address: 'Unit 402, 4th Floor, 123 Quezon Avenue, Barangay San Antonio, Quezon City',
                        tin: '284-918-301-000',
                        lineOfBusiness: 'Retail Sale of Consumer Electronics & General Merchandise',
                        psicCode: '4741',
                        validUntil: `December 31, ${new Date().getFullYear()}`,
                        status: `Active / Paid ${new Date().getFullYear()} Annual Business Tax`
                      });
                    }}
                    className="px-10 sm:px-12 py-2 sm:py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-95 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-md shadow-blue-700/25 transition-all cursor-pointer"
                  >
                    NEXT
                  </button>
                </div>

                {/* Quick Demo Pre-fill for testing */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAmendPermitNo('BP-2025-004819');
                      setAmendOrNo('OR-2026-99214');
                      setAmendError(false);
                    }}
                    className="text-[11px] text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    💡 Auto-fill QC BPLO Demo Permit (BP-2025-004819)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ======================================================================= */
            /* QUEZON CITY E-SERVICES BPLO AMENDMENT APPLICATION PORTAL               */
            /* ======================================================================= */
            <div className="space-y-6">
              {/* QC Official Header Card */}
              <div className="bg-gradient-to-r from-[#0038a8] to-[#0e5c7a] text-white p-6 sm:p-7 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[11px] font-black uppercase tracking-wider text-sky-100">
                      <Landmark size={13} />
                      <span>Quezon City E-Services • BPLO Online Portal</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black tracking-tight">
                      Application for Business Permit Amendment
                    </h2>
                    <p className="text-xs text-sky-100 max-w-xl">
                      Pursuant to Quezon City Revenue Code (Ordinance No. SP-2958, S-2020) and Executive Citizen's Charter standards.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAmendRecord(null)}
                    className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold transition-all text-white cursor-pointer"
                  >
                    Re-verify Permit No.
                  </button>
                </div>
              </div>

              {/* 1. Retrieved QC Registered Business Profile */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Building2 size={18} className="text-blue-600" />
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      Registered Business Profile (QC LGU Registry)
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    <span>Active & Verified</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Business / Trade Name</span>
                    <strong className="text-slate-900 dark:text-white text-sm">{amendRecord.businessName}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Mayor's Permit Reference</span>
                    <strong className="text-blue-600 dark:text-sky-400 font-mono text-sm">{amendRecord.permitNo}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">2026 Official Receipt No.</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{amendRecord.orNo}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 sm:col-span-2">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Physical Registered Address</span>
                    <p className="text-slate-800 dark:text-slate-200 font-semibold">{amendRecord.address}</p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Proprietor / Representative</span>
                    <p className="text-slate-800 dark:text-slate-200 font-bold">{amendRecord.owner}</p>
                  </div>
                </div>
              </div>

              {/* 2. Select Type of Amendment (QC BPLO Categories) */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center space-x-2">
                    <Edit3 size={18} className="text-blue-600" />
                    <span>Select Amendment Classification (QC BPLO)</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Select the specific legal modification you are requesting for your Quezon City Business License.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Category 1: Change of Trade Name */}
                  <div
                    onClick={() => {
                      setAmendmentType('trade_name');
                      setAmendedValue('Apex Global Tech & Retail Enterprise');
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      amendmentType === 'trade_name'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        1. Change of Business / Trade Name
                      </span>
                      {amendmentType === 'trade_name' && <CheckCircle2 size={16} className="text-blue-600" />}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                      Modification of registered corporate name or commercial trade moniker with DTI, SEC, or CDA.
                    </p>
                  </div>

                  {/* Category 2: Change of Address / Relocation */}
                  <div
                    onClick={() => {
                      setAmendmentType('address');
                      setAmendedValue('Unit 802, Cyber Tower 1, Commonwealth Avenue, Brgy. Batasan Hills, Quezon City');
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      amendmentType === 'address'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        2. Change of Address / Relocation
                      </span>
                      {amendmentType === 'address' && <CheckCircle2 size={16} className="text-blue-600" />}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                      Transfer of commercial premises within the territorial boundaries of Quezon City.
                    </p>
                  </div>

                  {/* Category 3: Line of Business */}
                  <div
                    onClick={() => {
                      setAmendmentType('line_of_business');
                      setAmendedValue('Wholesale & Retail of IT Equipment, Computer Networking & Software Solutions (PSIC 4651)');
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      amendmentType === 'line_of_business'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        3. Change / Additional Line of Business
                      </span>
                      {amendmentType === 'line_of_business' && <CheckCircle2 size={16} className="text-blue-600" />}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                      Addition, reduction, or modification of PSIC commercial activities and operations.
                    </p>
                  </div>

                  {/* Category 4: Ownership / Officers */}
                  <div
                    onClick={() => {
                      setAmendmentType('ownership');
                      setAmendedValue('Maria Clara Santos (New Managing General Partner)');
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      amendmentType === 'ownership'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        4. Change of Ownership / Corporate Structure
                      </span>
                      {amendmentType === 'ownership' && <CheckCircle2 size={16} className="text-blue-600" />}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                      Transfer of proprietorship, assignment of corporate shares, or new general partner.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. New Amended Particulars & Justification */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 text-xs">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Amended Particulars & Declaration
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                    Specify the exact new details to be reflected on the amended Quezon City Mayor's Permit.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Dynamic Field 1: New Particulars */}
                  <div>
                    <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">
                      {amendmentType === 'trade_name' && 'New Proposed Business / Trade Name *'}
                      {amendmentType === 'address' && 'New Complete Physical Address (within Quezon City) *'}
                      {amendmentType === 'line_of_business' && 'New / Additional Line of Business & PSIC Activity *'}
                      {amendmentType === 'ownership' && 'New Registered Owner / Corporate Representative Legal Name *'}
                    </label>
                    <input
                      type="text"
                      value={amendedValue}
                      onChange={(e) => setAmendedValue(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                    />
                  </div>

                  {/* Dynamic Field 2 for Address: QC Barangay */}
                  {amendmentType === 'address' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                          Concerned Quezon City Barangay *
                        </label>
                        <select
                          value={amendBarangay}
                          onChange={(e) => setAmendBarangay(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                        >
                          <option>Barangay San Antonio</option>
                          <option>Barangay Batasan Hills</option>
                          <option>Barangay Commonwealth</option>
                          <option>Barangay Diliman</option>
                          <option>Barangay Cubao / Socorro</option>
                          <option>Barangay South Triangle</option>
                          <option>Barangay Loyola Heights</option>
                          <option>Barangay Fairview</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                          Tenancy / Property Status *
                        </label>
                        <select className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold">
                          <option>Commercial Leased / Rented Space</option>
                          <option>Owned Commercial Property</option>
                          <option>Mall / Building Tenant</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Justification Field */}
                  <div>
                    <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">
                      Operational Reason / Justification for Amendment *
                    </label>
                    <textarea
                      rows={2}
                      value={amendReason}
                      onChange={(e) => setAmendReason(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* 4. QC BPLO Documentary Requirements Uploads */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 text-xs">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center space-x-2">
                      <FileCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Quezon City BPLO Documentary Requirements Checklist</span>
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                      Attach required clearances and legal instruments as mandated under QC BPLO Citizen's Charter.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 self-start sm:self-center">
                    Accepted: PDF, PNG, JPG (Max 25MB)
                  </span>
                </div>

                {/* Upload Notification Banner */}
                {uploadToast && (
                  <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-between animate-in slide-in-from-top-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 size={16} />
                      <span>{uploadToast}</span>
                    </div>
                    <button type="button" onClick={() => setUploadToast(null)} className="text-white/80 hover:text-white p-1">
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Hidden Native File Inputs */}
                <input
                  type="file"
                  ref={proofFileInputRef}
                  onChange={(e) => handleAmendDocUpload('proof', e.target.files)}
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  className="hidden"
                />
                <input
                  type="file"
                  ref={barangayFileInputRef}
                  onChange={(e) => handleAmendDocUpload('barangay', e.target.files)}
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  className="hidden"
                />
                <input
                  type="file"
                  ref={legalFileInputRef}
                  onChange={(e) => handleAmendDocUpload('legal', e.target.files)}
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  className="hidden"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* ======================================================== */}
                  {/* DOC 1: Amended Registration Certificate */}
                  {/* ======================================================== */}
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setDragActiveDoc('proof'); }}
                    onDragLeave={() => setDragActiveDoc(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActiveDoc(null);
                      handleAmendDocUpload('proof', e.dataTransfer.files);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all space-y-2.5 ${
                      dragActiveDoc === 'proof'
                        ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500/30'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px] truncate">
                        1. Amended DTI / SEC / CDA Certificate *
                      </span>
                    </div>

                    {amendProofFile ? (
                      <>
                        {/* File Pill Matching Screenshot */}
                        <div 
                          onClick={() => setPreviewDocModal({
                            isOpen: true,
                            title: 'Amended Primary Business Registration',
                            fileName: amendProofFile,
                            fileSize: amendProofFileSize,
                            previewUrl: amendProofPreview || '/Amendment.jpg',
                            docCategory: 'DTI / SEC / CDA Registration Amendment',
                            date: amendProofDate,
                            docKey: 'proof'
                          })}
                          className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-sky-500 flex items-center justify-between cursor-pointer transition-all shadow-2xs group"
                          title="Click to preview document"
                        >
                          <div className="flex items-center space-x-1.5 min-w-0 pr-1">
                            <FileText size={14} className="text-blue-600 dark:text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="font-mono text-[11px] text-blue-600 dark:text-sky-400 truncate max-w-[130px] font-semibold">
                              {amendProofFile}
                            </span>
            </div>
                          <div className="flex items-center space-x-1 shrink-0">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono hidden md:inline">
                              {amendProofFileSize}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-full font-bold">
                              Attached
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <button
                            type="button"
                            onClick={() => proofFileInputRef.current?.click()}
                            className="flex-1 py-1.5 px-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-sky-400 text-[11px] font-semibold transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <Upload size={12} />
                            <span>Upload File</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPreviewDocModal({
                              isOpen: true,
                              title: 'Amended Primary Business Registration',
                              fileName: amendProofFile,
                              fileSize: amendProofFileSize,
                              previewUrl: amendProofPreview || '/Amendment.jpg',
                              docCategory: 'DTI / SEC / CDA Registration Amendment',
                              date: amendProofDate,
                              docKey: 'proof'
                            })}
                            title="View Document Preview"
                            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                          >
                            <Eye size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDownloadDoc(amendProofFile, amendProofPreview || undefined)}
                            title="Download Attached Document"
                            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                          >
                            <Download size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setAmendProofFile(null)}
                            title="Remove File"
                            className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/60 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </>
                    ) : (
                      /* Empty State Dropzone */
                      <div className="space-y-2">
                        <div 
                          onClick={() => proofFileInputRef.current?.click()}
                          className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-sky-500 rounded-xl text-center cursor-pointer transition-colors bg-white/50 dark:bg-slate-900/50 space-y-1"
                        >
                          <UploadCloud size={20} className="mx-auto text-slate-400" />
                          <span className="block font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                            Click or drag file here
                          </span>
                          <span className="block text-[10px] text-slate-400">PDF, PNG, JPG (Max 25MB)</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => proofFileInputRef.current?.click()}
                            className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Browse File
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAmendProofFile('Amended_DTI_Certificate_2026.pdf');
                              setAmendProofFileSize('1.8 MB');
                              setAmendProofPreview('/Amendment.jpg');
                            }}
                            className="py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            title="Load official QC sample document"
                          >
                            Sample
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ======================================================== */}
                  {/* DOC 2: Barangay Clearance for Amendment */}
                  {/* ======================================================== */}
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setDragActiveDoc('barangay'); }}
                    onDragLeave={() => setDragActiveDoc(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActiveDoc(null);
                      handleAmendDocUpload('barangay', e.dataTransfer.files);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all space-y-2.5 ${
                      dragActiveDoc === 'barangay'
                        ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500/30'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px] truncate">
                        2. Barangay Clearance for Amendment *
                      </span>
                    </div>

                    {amendBarangayFile ? (
                      <>
                        {/* File Pill Matching Screenshot */}
                        <div 
                          onClick={() => setPreviewDocModal({
                            isOpen: true,
                            title: 'Quezon City Barangay Clearance for Amendment',
                            fileName: amendBarangayFile,
                            fileSize: amendBarangayFileSize,
                            previewUrl: amendBarangayPreview || '/New Application.jpg',
                            docCategory: 'Barangay Commercial Clearance (QC Integrated)',
                            date: amendBarangayDate,
                            docKey: 'barangay'
                          })}
                          className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-sky-500 flex items-center justify-between cursor-pointer transition-all shadow-2xs group"
                          title="Click to preview document"
                        >
                          <div className="flex items-center space-x-1.5 min-w-0 pr-1">
                            <FileText size={14} className="text-blue-600 dark:text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="font-mono text-[11px] text-blue-600 dark:text-sky-400 truncate max-w-[130px] font-semibold">
                              {amendBarangayFile}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 shrink-0">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono hidden md:inline">
                              {amendBarangayFileSize}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-full font-bold">
                              Attached
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <button
                            type="button"
                            onClick={() => barangayFileInputRef.current?.click()}
                            className="flex-1 py-1.5 px-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-sky-400 text-[11px] font-semibold transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <Upload size={12} />
                            <span>Upload File</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPreviewDocModal({
                              isOpen: true,
                              title: 'Quezon City Barangay Clearance for Amendment',
                              fileName: amendBarangayFile,
                              fileSize: amendBarangayFileSize,
                              previewUrl: amendBarangayPreview || '/New Application.jpg',
                              docCategory: 'Barangay Commercial Clearance (QC Integrated)',
                              date: amendBarangayDate,
                              docKey: 'barangay'
                            })}
                            title="View Document Preview"
                            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                          >
                            <Eye size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDownloadDoc(amendBarangayFile, amendBarangayPreview || undefined)}
                            title="Download Attached Document"
                            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                          >
                            <Download size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setAmendBarangayFile(null)}
                            title="Remove File"
                            className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/60 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </>
                    ) : (
                      /* Empty State Dropzone */
                      <div className="space-y-2">
                        <div 
                          onClick={() => barangayFileInputRef.current?.click()}
                          className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-sky-500 rounded-xl text-center cursor-pointer transition-colors bg-white/50 dark:bg-slate-900/50 space-y-1"
                        >
                          <UploadCloud size={20} className="mx-auto text-slate-400" />
                          <span className="block font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                            Click or drag file here
                          </span>
                          <span className="block text-[10px] text-slate-400">PDF, PNG, JPG (Max 25MB)</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => barangayFileInputRef.current?.click()}
                            className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Browse File
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAmendBarangayFile('Barangay_Clearance_Amendment_QC.pdf');
                              setAmendBarangayFileSize('940 KB');
                              setAmendBarangayPreview('/New Application.jpg');
                            }}
                            className="py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            title="Load official QC sample document"
                          >
                            Sample
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ======================================================== */}
                  {/* DOC 3: Notarized Legal Instrument / Lease */}
                  {/* ======================================================== */}
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setDragActiveDoc('legal'); }}
                    onDragLeave={() => setDragActiveDoc(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActiveDoc(null);
                      handleAmendDocUpload('legal', e.dataTransfer.files);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all space-y-2.5 ${
                      dragActiveDoc === 'legal'
                        ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500/30'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px] truncate">
                        3. Notarized Legal Instrument / Lease *
                      </span>
                    </div>

                    {amendLegalFile ? (
                      <>
                        {/* File Pill Matching Screenshot */}
                        <div 
                          onClick={() => setPreviewDocModal({
                            isOpen: true,
                            title: 'Notarized Legal Instrument / Board Resolution / Lease',
                            fileName: amendLegalFile,
                            fileSize: amendLegalFileSize,
                            previewUrl: amendLegalPreview || '/Special Permit.jpg',
                            docCategory: 'Notarized Legal Justification',
                            date: amendLegalDate,
                            docKey: 'legal'
                          })}
                          className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-sky-500 flex items-center justify-between cursor-pointer transition-all shadow-2xs group"
                          title="Click to preview document"
                        >
                          <div className="flex items-center space-x-1.5 min-w-0 pr-1">
                            <FileText size={14} className="text-blue-600 dark:text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="font-mono text-[11px] text-blue-600 dark:text-sky-400 truncate max-w-[130px] font-semibold">
                              {amendLegalFile}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 shrink-0">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono hidden md:inline">
                              {amendLegalFileSize}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-full font-bold">
                              Attached
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <button
                            type="button"
                            onClick={() => legalFileInputRef.current?.click()}
                            className="flex-1 py-1.5 px-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-sky-400 text-[11px] font-semibold transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <Upload size={12} />
                            <span>Upload File</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPreviewDocModal({
                              isOpen: true,
                              title: 'Notarized Legal Instrument / Board Resolution / Lease',
                              fileName: amendLegalFile,
                              fileSize: amendLegalFileSize,
                              previewUrl: amendLegalPreview || '/Special Permit.jpg',
                              docCategory: 'Notarized Legal Justification',
                              date: amendLegalDate,
                              docKey: 'legal'
                            })}
                            title="View Document Preview"
                            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                          >
                            <Eye size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDownloadDoc(amendLegalFile, amendLegalPreview || undefined)}
                            title="Download Attached Document"
                            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                          >
                            <Download size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setAmendLegalFile(null)}
                            title="Remove File"
                            className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/60 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </>
                    ) : (
                      /* Empty State Dropzone */
                      <div className="space-y-2">
                        <div 
                          onClick={() => legalFileInputRef.current?.click()}
                          className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-sky-500 rounded-xl text-center cursor-pointer transition-colors bg-white/50 dark:bg-slate-900/50 space-y-1"
                        >
                          <UploadCloud size={20} className="mx-auto text-slate-400" />
                          <span className="block font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                            Click or drag file here
                          </span>
                          <span className="block text-[10px] text-slate-400">PDF, PNG, JPG (Max 25MB)</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => legalFileInputRef.current?.click()}
                            className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Browse File
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAmendLegalFile('Notarized_Board_Resolution_Amendment.pdf');
                              setAmendLegalFileSize('2.4 MB');
                              setAmendLegalPreview('/Special Permit.jpg');
                            }}
                            className="py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            title="Load official QC sample document"
                          >
                            Sample
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 5. Quezon City Fee Assessment & Sworn Declaration */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 text-xs">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center space-x-2">
                    <CreditCard size={18} className="text-blue-600" />
                    <span>Quezon City Regulatory Assessment (Ordinance No. SP-2958)</span>
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                    Official schedule of regulatory filing and inspection fees for Mayor's Permit Amendment.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between py-1 text-slate-600 dark:text-slate-300">
                    <span>QC Amendment Processing & Filing Fee</span>
                    <strong className="font-mono">₱500.00</strong>
                  </div>
                  <div className="flex justify-between py-1 text-slate-600 dark:text-slate-300">
                    <span>QC BPLO Regulatory / Site Re-Inspection Fee</span>
                    <strong className="font-mono">₱350.00</strong>
                  </div>
                  <div className="flex justify-between py-1 text-slate-600 dark:text-slate-300">
                    <span>Electronic QR Code Permit Sticker & Holographic Seal</span>
                    <strong className="font-mono">₱250.00</strong>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between text-sm font-black text-[#0038a8] dark:text-sky-400">
                    <span>Total Regulatory Assessment:</span>
                    <span className="font-mono">₱1,100.00</span>
                  </div>
                </div>

                {/* Missing Documents Warning if any are removed */}
                {(!amendProofFile || !amendBarangayFile || !amendLegalFile) && (
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-start space-x-2.5 text-amber-900 dark:text-amber-200">
                    <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 text-xs">
                      <strong className="block font-bold">Incomplete Mandatory Attachments</strong>
                      <p className="text-[11px] text-amber-800 dark:text-amber-300">
                        Please upload all 3 mandatory requirements ({[
                          !amendProofFile && '1. Amended DTI/SEC/CDA',
                          !amendBarangayFile && '2. Barangay Clearance',
                          !amendLegalFile && '3. Legal Instrument'
                        ].filter(Boolean).join(', ')}) before submitting your Quezon City Amendment application.
                      </p>
                    </div>
                  </div>
                )}

                {/* Sworn Undertaking Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={amendSworn}
                      onChange={(e) => setAmendSworn(e.target.checked)}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      I, <strong>{amendRecord.owner}</strong>, hereby declare under oath and under penalty of perjury that all declarations and supporting documents submitted herein for Quezon City Mayor's Permit Amendment are true and correct pursuant to Republic Act No. 8792 (Electronic Commerce Act) and Quezon City Citizen's Charter standards.
                    </span>
                  </label>
                </div>

                {/* Submission State */}
                {amendSubmitted ? (
                  <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 rounded-2xl text-emerald-900 dark:text-emerald-200 space-y-3 animate-in zoom-in-95">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                        <CheckCircle2 size={22} />
                      </div>
                      <div>
                        <h4 className="font-black text-sm uppercase">Amendment Application Submitted Successfully!</h4>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300">
                          Application Tracking Reference: <strong className="font-mono">{amendRefNo}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-slate-600 dark:text-slate-300">
                      Your amendment request has been forwarded to the <strong>Quezon City Business Permits and Licensing Department (BPLD) Assessment Section</strong>. You may track this application using reference <strong>{amendRefNo}</strong> or proceed to fee payment of <strong>₱1,100.00</strong>.
                    </div>

                    <div className="flex flex-wrap gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => alert(`Official QC BPLO Amendment Filing Slip generated for ${amendRefNo}.`)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-sm"
                      >
                        <Download size={14} />
                        <span>Download Filing Summary (PDF)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentView('pay_tax')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-sm"
                      >
                        <CreditCard size={14} />
                        <span>Proceed to Pay (₱1,100.00)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAmendSubmitted(false);
                          setAmendRecord(null);
                          setCurrentView('select_type');
                        }}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs cursor-pointer"
                      >
                        Return to Permit Types
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={!amendSworn || !amendProofFile || !amendBarangayFile || !amendLegalFile}
                      onClick={() => {
                        setAmendSubmitted(true);
                        if (onAddNewApplication) {
                          onAddNewApplication(amendRecord.businessName, 'Business Permit (Amendment)', {
                            type: amendmentType,
                            value: amendedValue,
                            refNo: amendRefNo
                          });
                        }
                      }}
                      className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-blue-700/25 transition-all cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <CheckCircle2 size={16} />
                      <span>Submit Amendment Application (Quezon City BPLO)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
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
      {/* SUB-VIEW 5: SPECIAL PERMIT (SHORT TERM / EVENT) - 7-STEP QC E-SERVICES FLOW */}
      {/* ========================================================================= */}
      {currentView === 'special_permit' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-7 shadow-lg space-y-6 animate-in fade-in max-w-5xl mx-auto">
          {/* Top navigation */}
          <div className="flex items-center justify-between">
            

          </div>

          {/* ========================================================================= */}
          {/* 7-STEP SEGMENTED STEPPER BANNER (EXACT REPLICA OF PICTURE 1) */}
          {/* ========================================================================= */}
          <div className="w-full overflow-x-auto pb-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 min-w-[700px] border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden shadow-xs">
              {[
                { step: 1, label: 'General' },
                { step: 2, label: 'Basic Documentary Requirements' },
                { step: 3, label: 'Business information' },
                { step: 4, label: 'Business Operation' },
                { step: 5, label: 'Business Activity' },
                { step: 6, label: 'Event Information' },
                { step: 7, label: 'Summary Page' },
              ].map((s, idx) => {
                const isActive = specialStep === s.step;
                const isCompleted = specialStep > s.step;
                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setSpecialStep(s.step)}
                    className={`py-3.5 px-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative border-b md:border-b-0 ${
                      idx < 6 ? 'md:border-r border-slate-300 dark:border-slate-700' : ''
                    } ${
                      isActive
                        ? 'bg-[#0c4a60] text-white'
                        : isCompleted
                        ? 'bg-[#0e5c77] hover:bg-[#0c4a60] text-white'
                        : 'bg-[#b2b5ba] dark:bg-slate-700/80 hover:bg-[#a6a9af] text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {/* Circle Badge with Step Number */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-xs mb-1.5 ${
                        isActive
                          ? 'bg-white text-[#0c4a60]'
                          : isCompleted
                          ? 'bg-white text-[#0e5c77]'
                          : 'bg-white text-slate-700 dark:text-slate-800'
                      }`}
                    >
                      {s.step}
                    </div>

                    {/* Status Text (INCOMPLETE / COMPLETED) */}
                    <span
                      className={`text-[9.5px] font-bold tracking-wider uppercase mb-0.5 ${
                        isActive || isCompleted
                          ? 'text-white/95'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {isCompleted ? 'COMPLETED' : 'INCOMPLETE'}
                    </span>

                    {/* Step Title */}
                    <span
                      className={`text-[11px] font-bold leading-tight px-1 ${
                        isActive || isCompleted
                          ? 'text-white'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* HEADER TITLES (MATCHING PICTURE 1) */}
          {/* ========================================================================= */}
          <div className="text-center pt-2 pb-1">
            <h2 className="text-lg sm:text-2xl font-bold text-[#0c4a60] dark:text-sky-300 tracking-tight">
              Welcome To Unified Online Business Permit Application
            </h2>
          </div>

          <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wider uppercase">
              SHORT TERM / SPECIAL PERMIT APPLICATION
            </h3>
          </div>

          {/* Hidden File Input for Basic Documentary Requirements (allowed: .jpeg, .jpg, .png, .pdf, .doc, .docx) */}
          <input
            type="file"
            ref={basicDocFileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleBasicDocFileUpload(file);
              e.target.value = '';
            }}
            accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
            className="hidden"
          />

          {/* ========================================================================= */}
          {/* STEP 1: GENERAL (EXACT REPLICA OF PICTURE 1) */}
          {/* ========================================================================= */}
          {specialStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              {/* Card 1: Definition & Duration Scope */}
              <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed shadow-xs">
                A special permit is required for business activities with a short duration. Some examples are Promotional Events, Sporting Events, TV and Film Productions, Concert/Musical and Stage Shows and Seasonal operations like Bingo Games, Cockfight (limited to 1-3 days per year), and Carnivals (limited to 14 days).
              </div>

              {/* Card 2: Application Requirements List */}
              <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed shadow-xs space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  Application Requirements:
                </h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>Request letter to Business Permit and Licensing Department Head.</li>
                  <li>Venue Contract of Lease from the owner of the venue.</li>
                  <li>Special Working Permit (SWP) from Bureau of Immigration, if an applicant is a foreigner (when applicable)</li>
                  <li>DTI / SEC / Mayor's Permit as Promoter</li>
                  <li>Special Permit from City Councilor for Seasonal Operations (when applicable)</li>
                </ol>
              </div>

              {/* Card 3: General Instructions (Exact Match of User Image) */}
              <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed shadow-xs space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  General Instructions:
                </h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    Accomplish the application form by ticking the appropriate boxes, typing, and/or printing (UPPER CASE/CAPITAL LETTER). All required data fields/information should be completely and clearly filled-out by the applicant.
                  </li>
                  <li>
                    Please ensure that ALL required documents are properly attached and fill out ALL necessary information. Incomplete data on application form and/or requirements will be returned to the applicant / will not be processed.
                  </li>
                </ol>
              </div>

              {/* Card 4: Authorization Form (Exact Match of User Image with Tinted Box) */}
              <div className="bg-[#dbe4e8] dark:bg-slate-800/90 border border-[#c4d2d9] dark:border-slate-700 rounded-2xl p-5 text-xs text-slate-800 dark:text-slate-200 leading-relaxed shadow-xs space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  Authorization Form:
                </h4>
                <p className="text-slate-700 dark:text-slate-300">
                  For application that will be processed by an authorized representative, kindly download this{' '}
                  <button
                    type="button"
                    onClick={() => {
                      handleDownloadDoc('QC_BPLO_Special_Permit_Authorization_Form.pdf', '/Special Permit.jpg');
                      setPreviewDocModal({
                        isOpen: true,
                        title: 'QC BPLO Authorization Form Template',
                        fileName: 'QC_BPLO_Special_Permit_Authorization_Form.pdf',
                        fileSize: '420 KB',
                        previewUrl: '/Special Permit.jpg',
                        docCategory: 'Official Authorization Form for Representatives',
                        date: '2026 Edition',
                        docKey: 'auth_form'
                      });
                    }}
                    className="text-[#0284c7] dark:text-sky-400 font-bold underline hover:text-[#0369a1] cursor-pointer inline-flex items-center gap-0.5"
                  >
                    <span>Authorization Form</span>
                    <Download size={11} className="inline ml-0.5" />
                  </button>{' '}
                  and follow the steps below:
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>Make sure that the form is signed by the owner.</li>
                  <li>Scan the signed form and Valid IDs of the owner and the representative.</li>
                </ol>
              </div>

              {/* Terms and Acceptance */}
              <label className="flex items-start sm:items-center space-x-3 p-4 rounded-2xl bg-blue-50/70 dark:bg-slate-800/60 border border-blue-200 dark:border-slate-700/80 cursor-pointer transition-colors hover:bg-blue-100/60 dark:hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={specialTermsAccepted}
                  onChange={(e) => setSpecialTermsAccepted(e.target.checked)}
                  className="mt-0.5 sm:mt-0 w-4 h-4 text-[#0c4a60] focus:ring-[#0c4a60] rounded cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  I have read and agree to the Short-Term / Special Permitting terms, Quezon City Revenue Code (Ordinance SP-2958), and Event Safety Regulations.
                </span>
              </label>

              {/* Navigation Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCurrentView('select_type')}
                  className="w-full sm:w-auto px-8 py-2.5 rounded-xl border border-blue-600/40 bg-[#0b1424] hover:bg-slate-800 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  BACK
                </button>

                <button
                  type="button"
                  disabled={!specialTermsAccepted}
                  onClick={() => setSpecialStep(2)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#0c4a60] hover:bg-[#093747] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer sm:ml-auto"
                >
                  <span>Proceed to Step 2: Basic Documentary Requirements</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: BASIC DOCUMENTARY REQUIREMENTS (EXACT REPLICA OF PICTURE 1)      */}
          {/* ========================================================================= */}
          {specialStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              {/* Header Titles (Centered, Exact Match of Picture 1) */}
              <div className="text-center pt-1 pb-1">
                <h3 className="text-xl sm:text-2xl font-bold text-[#0c4a60] dark:text-[#38bdf8] tracking-tight">
                  Basic Documentary Requirements
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-normal">
                  (Allowed file types: .jpeg, .jpg, .png, .pdf, .doc and .docx)
                </p>
              </div>

              {/* White Container Box with 8 Requirements (Exact Replica of Picture 1) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-2.5">
                {basicDocItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
                  >
                    {/* Left: Checkbox + Requirement Label */}
                    <div
                      className="flex items-start gap-2.5 flex-1 cursor-pointer"
                      onClick={() => toggleDocItemCheck(item.id)}
                    >
                      {/* Square Checkbox matching Picture 1 [■] */}
                      <div
                        className="w-3.5 h-3.5 mt-0.5 rounded-[2px] border border-slate-900 dark:border-slate-200 flex items-center justify-center shrink-0 bg-white dark:bg-slate-900 transition-all"
                      >
                        {item.checked && (
                          <div className="w-2 h-2 bg-slate-900 dark:bg-slate-100" />
                        )}
                      </div>

                      {/* Label with Red Asterisk and (Required) / (when applicable) */}
                      <div className="text-xs sm:text-[12.5px] leading-relaxed select-none">
                        {item.hasAsterisk && <span className="text-red-500 font-bold mr-1">*</span>}
                        <span className="text-slate-800 dark:text-slate-200 font-medium">
                          {item.label}
                        </span>
                        {item.parenthetical && (
                          <span className="text-slate-700 dark:text-slate-300 ml-1">
                            {item.parenthetical}
                          </span>
                        )}
                        {item.badge === 'Required' && (
                          <span className="text-red-500 font-semibold ml-1.5">(Required)</span>
                        )}
                        {item.badge === 'when applicable' && (
                          <span className="text-slate-500 dark:text-slate-400 ml-1.5">(when applicable)</span>
                        )}
                      </div>
                    </div>

                    {/* Right: [ CHOOSE FILE ] NO FILE CHOSEN (Matches Picture 1 Row 1) */}
                    {item.checked && (
                      <div className="flex items-center gap-2.5 shrink-0 pl-6 md:pl-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveUploadDocId(item.id);
                            basicDocFileInputRef.current?.click();
                          }}
                          className="px-3 py-1.5 rounded border border-[#1e5c8a] dark:border-sky-500 text-[#1e5c8a] dark:text-sky-400 hover:bg-blue-50 dark:hover:bg-sky-950/40 text-[10.5px] sm:text-[11px] font-bold tracking-wider uppercase transition-colors cursor-pointer shrink-0 shadow-2xs"
                        >
                          CHOOSE FILE
                        </button>

                        {item.file ? (
                          <div className="flex items-center gap-1.5">
                            <span
                              className="text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 truncate max-w-[130px] sm:max-w-[200px]"
                              title={item.file.name}
                            >
                              {item.file.name}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">({item.file.size})</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewDocModal({
                                  isOpen: true,
                                  title: item.label,
                                  fileName: item.file!.name,
                                  fileSize: item.file!.size,
                                  previewUrl: item.file!.previewUrl,
                                  docCategory: 'QC BPLO Documentary Attachment',
                                  date: item.file!.date,
                                  docKey: item.id
                                });
                              }}
                              title="View Document Preview"
                              className="p-1 rounded text-blue-600 dark:text-sky-400 hover:bg-blue-50 dark:hover:bg-slate-800 cursor-pointer"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadDoc(item.file!.name, item.file!.previewUrl);
                              }}
                              title="Download Document"
                              className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            >
                              <Download size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeDocFile(item.id);
                              }}
                              title="Remove File"
                              className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] sm:text-[11px] font-medium tracking-wider text-[#1e5c8a] dark:text-sky-300 uppercase">
                            NO FILE CHOSEN
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Demo Helper Button */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={loadSampleDocAttachments}
                  className="text-[11px] font-bold text-[#0c4a60] dark:text-sky-400 hover:underline inline-flex items-center space-x-1 cursor-pointer"
                >
                  <Sparkles size={12} />
                  <span>Auto-attach Sample QC Required Documents</span>
                </button>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSpecialStep(1)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  ← Back to Step 1: General
                </button>

                <button
                  type="button"
                  onClick={() => setSpecialStep(3)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#0c4a60] hover:bg-[#093747] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Proceed to Step 3: Business Information</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: BUSINESS INFORMATION */}
          {/* ========================================================================= */}
          {specialStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Step 3 of 7: Business & Event Organizer Information
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSpecialData(prev => ({
                      ...prev,
                      businessName: 'Apex Media & Events Entertainment Inc.',
                      tin: '008-912-345-000',
                      dtiSecNumber: 'SEC CS2022091234',
                      registeredAddress: 'Unit 402 QC Hall of Justice Annex, Elliptical Road, Diliman, Quezon City',
                      organizerName: user?.name || 'Juan Dela Cruz',
                      organizerEmail: user?.email || 'events@apexqc.ph'
                    }));
                  }}
                  className="text-[11px] font-bold text-[#0c4a60] dark:text-sky-400 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <Sparkles size={12} />
                  <span>Auto-fill QC Citizen Profile</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Business Name / Organizing Entity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={specialData.businessName}
                    onChange={(e) => setSpecialData({ ...specialData, businessName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Taxpayer Identification Number (TIN)
                  </label>
                  <input
                    type="text"
                    value={specialData.tin}
                    onChange={(e) => setSpecialData({ ...specialData, tin: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    DTI / SEC / CDA Registration No.
                  </label>
                  <input
                    type="text"
                    value={specialData.dtiSecNumber}
                    onChange={(e) => setSpecialData({ ...specialData, dtiSecNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Registered Business Address (QC Jurisdiction)
                  </label>
                  <input
                    type="text"
                    value={specialData.registeredAddress}
                    onChange={(e) => setSpecialData({ ...specialData, registeredAddress: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Authorized Representative / Event Promoter Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={specialData.organizerName}
                    onChange={(e) => setSpecialData({ ...specialData, organizerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Contact Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={specialData.organizerContact}
                    onChange={(e) => setSpecialData({ ...specialData, organizerContact: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    value={specialData.organizerEmail}
                    onChange={(e) => setSpecialData({ ...specialData, organizerEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSpecialStep(2)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  ← Back to Step 2
                </button>

                <button
                  type="button"
                  onClick={() => setSpecialStep(4)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#0c4a60] hover:bg-[#093747] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Proceed to Step 4: Business Operation</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: BUSINESS OPERATION */}
          {/* ========================================================================= */}
          {specialStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block pb-2 border-b border-slate-200 dark:border-slate-800">
                Step 4 of 7: Business Operation & Short-Term Category
              </span>

              <div className="space-y-3 text-xs">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold">
                  Nature / Category of Short-Term Special Operation:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Promotional Events & Product Activations (Up to 15 days)',
                    'Concert, Musical & Stage Shows (1 to 3 days)',
                    'Sporting Events, Marathons & Tournaments',
                    'TV & Film Productions / Movie Location Shoots',
                    'Seasonal Carnivals / Perya (Limited to 14 days max)',
                    'Seasonal Bingo Games (Limited to 1-3 days/year)',
                    'Seasonal Cockfight (Limited to 1-3 days/year)',
                    'Bazaar, Temporary Flea Market & Food Festival'
                  ].map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSpecialData({ ...specialData, operationType: category })}
                      className={`p-3 rounded-xl border text-left font-semibold text-xs transition-all cursor-pointer flex items-center space-x-2 ${
                        specialData.operationType === category
                          ? 'border-[#0c4a60] bg-blue-50/70 dark:bg-blue-950/40 text-[#0c4a60] dark:text-sky-300 ring-2 ring-[#0c4a60]/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${
                        specialData.operationType === category ? 'border-[#0c4a60] bg-[#0c4a60]' : 'border-slate-400'
                      }`}>
                        {specialData.operationType === category && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                      </span>
                      <span className="leading-tight">{category}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Daily Operating Hours
                  </label>
                  <input
                    type="text"
                    value={specialData.operatingHours}
                    onChange={(e) => setSpecialData({ ...specialData, operatingHours: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Estimated Daily Foot Traffic / Expected Attendees
                  </label>
                  <input
                    type="text"
                    value={specialData.expectedAttendees}
                    onChange={(e) => setSpecialData({ ...specialData, expectedAttendees: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Total Venue Area (in sq. meters)
                  </label>
                  <input
                    type="text"
                    value={specialData.venueArea}
                    onChange={(e) => setSpecialData({ ...specialData, venueArea: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-6">
                  <input
                    type="checkbox"
                    id="soundAmp"
                    checked={specialData.soundAmplification}
                    onChange={(e) => setSpecialData({ ...specialData, soundAmplification: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0c4a60] cursor-pointer"
                  />
                  <label htmlFor="soundAmp" className="text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                    Sound Amplification / Loudspeakers used (Subject to QC Noise Ordinance)
                  </label>
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSpecialStep(3)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  ← Back to Step 3
                </button>

                <button
                  type="button"
                  onClick={() => setSpecialStep(5)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#0c4a60] hover:bg-[#093747] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Proceed to Step 5: Business Activity</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: BUSINESS ACTIVITY */}
          {/* ========================================================================= */}
          {specialStep === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block pb-2 border-b border-slate-200 dark:border-slate-800">
                Step 5 of 7: Business Activity & Ancillary Commercial Lines
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Specific Commercial Activity / Products Offered
                  </label>
                  <input
                    type="text"
                    value={specialData.commercialActivity}
                    onChange={(e) => setSpecialData({ ...specialData, commercialActivity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Number of Temporary Commercial Booths / Stalls
                  </label>
                  <input
                    type="text"
                    value={specialData.boothCount}
                    onChange={(e) => setSpecialData({ ...specialData, boothCount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Admission / Ticket Structure
                  </label>
                  <select
                    value={specialData.admissionType}
                    onChange={(e) => setSpecialData({ ...specialData, admissionType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Free Admission">Free Public Admission (No Tickets)</option>
                    <option value="Ticketed Event">Ticketed Event / With Admission Charge</option>
                    <option value="Invitation Only">Private / Invitation-Only Staging</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-2 pt-2">
                  <label className="flex items-center space-x-2.5 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={specialData.foodSelling}
                      onChange={(e) => setSpecialData({ ...specialData, foodSelling: e.target.checked })}
                      className="w-4 h-4 rounded text-[#0c4a60]"
                    />
                    <span>On-site Food & Beverage Handling / Cooking (Requires QC Health Sanitary Clearance)</span>
                  </label>

                  <label className="flex items-center space-x-2.5 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={specialData.generatorEquipment}
                      onChange={(e) => setSpecialData({ ...specialData, generatorEquipment: e.target.checked })}
                      className="w-4 h-4 rounded text-[#0c4a60]"
                    />
                    <span>High-Voltage Generator Set / Auxiliary Electrical Plant (Requires QC OBO Electrical Permit)</span>
                  </label>
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSpecialStep(4)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  ← Back to Step 4
                </button>

                <button
                  type="button"
                  onClick={() => setSpecialStep(6)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#0c4a60] hover:bg-[#093747] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Proceed to Step 6: Event Information</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 6: EVENT INFORMATION */}
          {/* ========================================================================= */}
          {specialStep === 6 && (
            <div className="space-y-4 animate-in fade-in">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block pb-2 border-b border-slate-200 dark:border-slate-800">
                Step 6 of 7: Event Location, Dates & Barangay Jurisdiction
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Event Title / Exhibition Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={specialData.eventTitle}
                    onChange={(e) => setSpecialData({ ...specialData, eventTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Venue / Facility Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={specialData.venue}
                    onChange={(e) => setSpecialData({ ...specialData, venue: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Quezon City Barangay Location <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={specialData.barangay}
                    onChange={(e) => setSpecialData({ ...specialData, barangay: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Central">Central (District 4)</option>
                    <option value="Diliman">Diliman / Teachers Village</option>
                    <option value="Batasan Hills">Batasan Hills (District 2)</option>
                    <option value="Cubao">Socorro / Cubao (District 3)</option>
                    <option value="Loyola Heights">Loyola Heights (District 3)</option>
                    <option value="South Triangle">South Triangle / Tomas Morato</option>
                    <option value="Commonwealth">Commonwealth (District 2)</option>
                    <option value="Novaliches Proper">Novaliches Proper (District 5)</option>
                    <option value="Fairview">Fairview (District 5)</option>
                    <option value="Bagong Pag-asa">Bagong Pag-asa / North EDSA (District 1)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Exact Venue Address in Quezon City
                  </label>
                  <input
                    type="text"
                    value={specialData.venueAddress}
                    onChange={(e) => setSpecialData({ ...specialData, venueAddress: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Event Start Date
                  </label>
                  <input
                    type="date"
                    value={specialData.startDate}
                    onChange={(e) => setSpecialData({ ...specialData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Event End Date
                  </label>
                  <input
                    type="date"
                    value={specialData.endDate}
                    onChange={(e) => setSpecialData({ ...specialData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Designated Safety Marshall / Emergency Officer
                  </label>
                  <input
                    type="text"
                    value={specialData.safetyOfficer}
                    onChange={(e) => setSpecialData({ ...specialData, safetyOfficer: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSpecialStep(5)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  ← Back to Step 5
                </button>

                <button
                  type="button"
                  onClick={() => setSpecialStep(7)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#0c4a60] hover:bg-[#093747] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Proceed to Step 7: Summary Page</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 7: SUMMARY PAGE & QC BPLO ASSESSMENT */}
          {/* ========================================================================= */}
          {specialStep === 7 && (
            <div className="space-y-5 animate-in fade-in">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block pb-2 border-b border-slate-200 dark:border-slate-800">
                Step 7 of 7: Application Summary & Official Assessment of Regulatory Fees
              </span>

              {/* Summary Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center space-x-2 text-[#0c4a60] dark:text-sky-400 font-bold">
                    <Calendar size={15} />
                    <span>Event Particulars</span>
                  </div>
                  <p><strong>Title:</strong> {specialData.eventTitle}</p>
                  <p><strong>Venue:</strong> {specialData.venue}, Brgy. {specialData.barangay}, QC</p>
                  <p><strong>Dates:</strong> {specialData.startDate} to {specialData.endDate}</p>
                  <p><strong>Category:</strong> {specialData.operationType}</p>
                  <p><strong>Booths & Scale:</strong> {specialData.boothCount} • {specialData.expectedAttendees}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center space-x-2 text-[#0c4a60] dark:text-sky-400 font-bold">
                    <Building2 size={15} />
                    <span>Entity & Promoter</span>
                  </div>
                  <p><strong>Entity:</strong> {specialData.businessName}</p>
                  <p><strong>TIN / SEC:</strong> {specialData.tin} • {specialData.dtiSecNumber}</p>
                  <p><strong>Promoter / Head:</strong> {specialData.organizerName}</p>
                  <p><strong>Contact:</strong> {specialData.organizerContact} • {specialData.organizerEmail}</p>
                  <p><strong>Safety Lead:</strong> {specialData.safetyOfficer}</p>
                </div>
              </div>

              {/* Attached Documents Checklist Status */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Documentary Requirements Checklist Status (Quezon City BPLO)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {basicDocItems.slice(0, 5).map((doc, idx) => (
                    <div key={doc.id} className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 size={13} className={doc.file ? "text-emerald-500 shrink-0" : "text-slate-400 shrink-0"} />
                      <span className="truncate">
                        {idx + 1}. {doc.label}: {doc.file ? `Attached (${doc.file.name})` : doc.checked ? 'File Pending' : 'Certified Not Applicable / Optional'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* QC Revenue Code Assessment Table */}
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-slate-800/90 border border-blue-200 dark:border-slate-700 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    Quezon City BPLO Assessment of Fees (Ordinance SP-2958)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0c4a60] text-white">
                    QC Electronic Order of Payment
                  </span>
                </div>

                <div className="space-y-1.5 border-t border-b border-blue-200 dark:border-slate-700 py-2">
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Mayor's Special Permit Base Fee (Short-Term Event):</span>
                    <span className="font-mono font-semibold">₱2,500.00</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Sound Amplification & PA System Regulatory Fee:</span>
                    <span className="font-mono font-semibold">₱500.00</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>EPWMD Environmental Cleanliness & Waste Disposal Fee:</span>
                    <span className="font-mono font-semibold">₱800.00</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>City Health Department Sanitary Inspection Fee:</span>
                    <span className="font-mono font-semibold">₱400.00</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white pt-1">
                  <span>Total Assessed Regulatory Fees:</span>
                  <span className="text-[#0c4a60] dark:text-sky-300 text-base font-mono">₱4,200.00</span>
                </div>
              </div>

              {/* Sworn Declaration */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Sworn Undertaking:</strong> I hereby declare under the penalty of perjury that all information, schedules, and documents submitted herein are true, correct, and in strict compliance with the Quezon City Revenue Code (Ordinance SP-2958, S-2020) and applicable national safety regulations.
              </div>

              {/* Submission State / Results */}
              {specialSubmitted ? (
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center space-x-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 size={18} />
                    <span>Special Permit Application Successfully Lodged!</span>
                  </div>
                  <p className="text-xs">
                    Ang iyong aplikasyon para sa Short-Term / Special Mayor's Permit ay naitala na sa Quezon City BPLO Electronic Tracking System.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                    <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 font-mono font-bold">
                      Tracking No.: {specialRefNumber}
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 font-semibold">
                      Status: Transmitted to QC BPLO & OBO
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadDoc('QC_Special_Permit_Payment_Order.pdf', '/Special Permit.jpg')}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
                    >
                      <Download size={13} />
                      <span>Download Order of Payment (₱4,200.00)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentView('select_type')}
                      className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Return to Permit Types
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSpecialStep(6)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                  >
                    ← Back to Step 6
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSpecialSubmitted(true);
                      if (onAddNewApplication) {
                        onAddNewApplication(
                          specialData.businessName || specialData.organizerName || user?.name || 'Event Organizer',
                          'Special Mayor\'s Permit'
                        );
                      }
                    }}
                    className="w-full sm:w-auto px-7 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <FileCheck size={16} />
                    <span>Submit Special Permit Application to QC BPLO</span>
                  </button>
                </div>
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
                    <CreditCard size={18} className="text-blue-600 dark:text-blue-300" />
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
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* MODAL: APPLICANT INPUT FOR RENEWAL (EXACT PICTURE 1 REPLICA)              */}
      {/* ========================================================================= */}
      {showRenewalModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => {
            setShowRenewalModal(false);
            setRenewalError(false);
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0b1424] border border-slate-800/90 rounded-2xl shadow-2xl p-6 sm:p-9 max-w-lg w-full relative animate-in zoom-in-95 duration-200 text-left space-y-4"
          >
            {/* Close (X) icon at top right */}
            <button
              type="button"
              onClick={() => {
                setShowRenewalModal(false);
                setRenewalError(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1 rounded-lg transition-colors cursor-pointer"
              title="Close"
            >
              <X size={18} />
            </button>

            {/* Title: APPLICANT INPUT */}
            <div className="text-center pb-4">
              <h3 className="text-base sm:text-lg font-bold tracking-wider text-blue-500 uppercase">
                APPLICANT INPUT
              </h3>
            </div>

            <div className="space-y-4">
              {/* Field 1: Mayor's Permit Number: */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">
                  Mayor's Permit Number:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={renewalPermitNo}
                    onChange={(e) => {
                      setRenewalPermitNo(e.target.value);
                      if (renewalError) setRenewalError(false);
                    }}
                    placeholder=""
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-slate-700/80 bg-[#121c2e] text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  />
                  <div 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors"
                    title="Enter your existing Quezon City Mayor's Permit Number"
                    onClick={() => {
                      if (!renewalPermitNo) {
                        setRenewalPermitNo('BP-2025-004819');
                        setRenewalOrNo(`OR-${new Date().getFullYear()}-88191`);
                        setRenewalError(false);
                      }
                    }}
                  >
                    <HelpCircle size={18} />
                  </div>
                </div>
                {renewalError && (
                  <p className="text-red-400 text-xs font-normal mt-1">
                    Required
                  </p>
                )}
              </div>

              {/* Field 2: Official Receipt No.: */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">
                  Official Receipt No.:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={renewalOrNo}
                    onChange={(e) => setRenewalOrNo(e.target.value)}
                    placeholder={`Input ${new Date().getFullYear()} Official Receipt`}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-slate-700/80 bg-[#121c2e] text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  />
                  <div 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors"
                    title={`Enter Official Receipt (O.R.) issued by Quezon City Treasurer for ${new Date().getFullYear()} Annual Business Tax`}
                  >
                    <HelpCircle size={18} />
                  </div>
                </div>
              </div>

              {/* Tax Exemption Link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowExemptionModal(true)}
                  className="text-xs sm:text-sm text-sky-400 hover:text-sky-300 hover:underline font-medium cursor-pointer transition-colors"
                >
                  Is your business qualified for any tax exemption program? Click here
                </button>
              </div>

              {/* Action Buttons: CANCEL and NEXT */}
              <div className="flex items-center justify-center gap-4 pt-4">

                <button
                  type="button"
                  onClick={() => {
                    setShowRenewalModal(false);
                    setRenewalRecord({
                      permitNo: renewalPermitNo.trim() || 'BP-2025-00123',
                      orNo: renewalOrNo.trim() || `OR-${new Date().getFullYear()}-88191`,
                      businessName: 'Apex Innovations Retail Hub',
                      owner: 'Juan Dela Cruz',
                      address: 'Unit 402, 4th Floor, 123 Ayala Avenue, QC',
                      previousGrossSales: '₱2,450,000.00',
                      validUntil: `December 31, ${new Date().getFullYear() - 1} (Expired)`,
                      status: `Eligible for ${new Date().getFullYear()} Renewal`
                    });
                    setCurrentView('renewal');
                  }}
                  className="px-8 sm:px-10 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                >
                  NEXT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: APPLICANT INPUT FOR AMENDMENT (EXACT PICTURE 1 REPLICA)            */}
      {/* ========================================================================= */}
      {showAmendModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => {
            setShowAmendModal(false);
            setAmendError(false);
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-9 max-w-lg w-full relative animate-in zoom-in-95 duration-200 text-left space-y-4"
          >
            {/* Close (X) icon at top right */}
            <button
              type="button"
              onClick={() => {
                setShowAmendModal(false);
                setAmendError(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
              title="Close"
            >
              <X size={18} />
            </button>

            {/* Title: APPLICANT INPUT */}
            <div className="text-center pb-4">
              <h3 className="text-lg sm:text-xl font-bold tracking-wide text-blue-700 uppercase">
                APPLICANT INPUT
              </h3>
            </div>

            <div className="space-y-4">
              {/* Field 1: Mayor's Permit Number: */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                  Mayor's Permit Number:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={amendPermitNo}
                    onChange={(e) => {
                      setAmendPermitNo(e.target.value);
                      if (amendError) setAmendError(false);
                    }}
                    placeholder=""
                    className={`w-full pl-3.5 pr-10 py-2.5 rounded-lg border bg-white text-slate-900 text-xs sm:text-sm transition-colors ${
                      amendError
                        ? 'border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500'
                        : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
                    }`}
                  />
                  <div 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-600 cursor-pointer transition-colors"
                    title="Enter your existing Quezon City Mayor's Permit Number (e.g. BP-2025-004819)"
                    onClick={() => {
                      if (!amendPermitNo) {
                        setAmendPermitNo('BP-2025-004819');
                        setAmendOrNo('OR-2026-99214');
                        setAmendError(false);
                      }
                    }}
                  >
                    <HelpCircle size={18} />
                  </div>
                </div>
                {amendError && (
                  <p className="text-red-500 text-xs font-normal mt-1">
                    Required
                  </p>
                )}
              </div>

              {/* Field 2: Official Receipt No.: */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                  Official Receipt No.:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={amendOrNo}
                    onChange={(e) => setAmendOrNo(e.target.value)}
                    placeholder={`Input ${new Date().getFullYear()} Official Receipt`}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                  />
                  <div 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-600 cursor-pointer transition-colors"
                    title={`Enter Official Receipt (O.R.) issued by Quezon City Treasurer for ${new Date().getFullYear()} Annual Business Tax`}
                  >
                    <HelpCircle size={18} />
                  </div>
                </div>
              </div>

              {/* Tax Exemption Link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowExemptionModal(true)}
                  className="text-xs sm:text-sm text-sky-500 hover:text-sky-600 hover:underline font-medium cursor-pointer transition-colors"
                >
                  Is your business qualified for any tax exemption program? Click here
                </button>
              </div>

              {/* Action Buttons: CANCEL and NEXT */}
              <div className="flex items-center justify-center gap-4 pt-4">
                

                <button
                  type="button"
                  onClick={() => {
                    if (!amendPermitNo.trim()) {
                      setAmendError(true);
                      return;
                    }
                    setAmendError(false);
                    setAmendRecord({
                      permitNo: amendPermitNo.trim(),
                      orNo: amendOrNo.trim() || `OR-QC-${new Date().getFullYear()}-008219`,
                      businessName: 'Apex Innovations Retail Hub',
                      owner: 'Juan Dela Cruz',
                      address: 'Unit 402, 4th Floor, 123 Quezon Avenue, Barangay San Antonio, Quezon City',
                      tin: '284-918-301-000',
                      lineOfBusiness: 'Retail Sale of Consumer Electronics & General Merchandise',
                      psicCode: '4741',
                      validUntil: `December 31, ${new Date().getFullYear()}`,
                      status: `Active / Paid ${new Date().getFullYear()} Annual Business Tax`
                    });
                    setShowAmendModal(false);
                    setCurrentView('amendment');
                  }}
                  className="px-10 sm:px-12 py-2 sm:py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-95 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-md shadow-blue-700/25 transition-all cursor-pointer"
                >
                  NEXT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TAX EXEMPTION PROGRAM QUALIFICATION GUIDE                         */}
      {/* ========================================================================= */}
      {showExemptionModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowExemptionModal(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 max-w-lg w-full relative animate-in zoom-in-95 duration-200 text-left space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-blue-700">
                <ShieldCheck size={20} />
                <h4 className="font-extrabold text-base text-slate-900">
                  Tax Exemption Programs Qualification
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowExemptionModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Your business may be eligible for statutory tax exemptions or special fiscal incentives under the following Philippine laws:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <p className="font-bold text-blue-900">1. Barangay Micro Business Enterprise (BMBE)</p>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Governed by Republic Act No. 9178. Enterprises with total assets of ₱3,000,000 or below (excluding land) are exempt from income tax and enjoy special financing windows.
                </p>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <p className="font-bold text-emerald-900">2. CDA Registered Cooperatives</p>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Governed by Republic Act No. 9520 (Philippine Cooperative Code of 2008). Cooperatives dealing with members are exempt from all local taxes and municipal regulatory fees.
                </p>
              </div>

              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
                <p className="font-bold text-purple-900">3. QC Local Investment Incentives Board (QC-LIIB)</p>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Pioneer and priority eco-friendly enterprises approved by the Local Investment Incentives Board for temporary tax holidays.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
              💡 <em>Note: Please prepare your active Certificate of Authority (BMBE) or Certificate of Good Standing (CDA) during documentary verification.</em>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowExemptionModal(false)}
                className="px-6 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DOCUMENT PREVIEW (QC BPLO VERIFICATION VIEWER)                     */}
      {/* ========================================================================= */}
      {previewDocModal?.isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setPreviewDocModal(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-sky-400 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-sky-400 block">
                    Quezon City BPLO Verification Viewer
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {previewDocModal.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDocModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Document Viewer Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              {/* Image Preview Box with Watermark */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 text-center shadow-inner group">
                <img 
                  src={previewDocModal.previewUrl} 
                  alt={previewDocModal.fileName}
                  className="w-full max-h-[360px] object-contain mx-auto"
                />
                
                {/* Official Watermark Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                  <div className="rotate-[-25deg] border-4 border-blue-500/20 text-blue-600/25 dark:text-sky-400/20 font-black text-xl sm:text-2xl uppercase tracking-widest px-6 py-2 rounded-2xl select-none text-center">
                    QUEZON CITY BPLO • OFFICIAL ASSESSMENT COPY
                  </div>
                </div>

                {/* Status Overlay Badge */}
                <div className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1.5 border border-white/20">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span>Verified Clean Scan • 300 DPI</span>
                </div>
              </div>

              {/* Metadata Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">File Name</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-bold truncate block" title={previewDocModal.fileName}>
                    {previewDocModal.fileName}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">File Size</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-bold block">
                    {previewDocModal.fileSize}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Upload Date</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold block">
                    {previewDocModal.date}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">BPLO OCR Scan</span>
                  <span className="text-emerald-600 font-bold block">
                    100% Passed
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const key = previewDocModal.docKey;
                  setPreviewDocModal(null);
                  if (key === 'proof') proofFileInputRef.current?.click();
                  else if (key === 'barangay') barangayFileInputRef.current?.click();
                  else legalFileInputRef.current?.click();
                }}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>Replace This File</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleDownloadDoc(previewDocModal.fileName, previewDocModal.previewUrl)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <Download size={13} />
                  <span>Download Document</span>
                </button>
                
              </div>
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
      {/* MODAL 1: APPLY FOR OCCUPATIONAL / WORK PERMIT (QC E-SERVICES UPLOAD-FIRST) */}
      {/* ========================================================================= */}
      {isOccupationalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          {/* Hidden File Input for Occupational Clearances */}
          <input 
            type="file" 
            ref={occFileInputRef} 
            onChange={handleOccFileUpload} 
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" 
            className="hidden" 
          />

          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 my-auto">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#063323] via-[#094732] to-[#042017] text-white flex items-center justify-between border-b border-emerald-500/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <ShieldCheck size={11} />
                    <span>QC BPLD • Occupational Licensing Portal</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200 border border-white/10 hidden sm:inline-block">
                    100% Upload-Driven
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-black tracking-wide uppercase text-white flex items-center gap-2">
                  <span>Apply for Occupational (Work) Permit</span>
                </h3>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  Quezon City E-Services Citizen's Charter Compliant • Direct Clearance & Document Upload System
                </p>
              </div>
              <button 
                onClick={() => setIsOccupationalModalOpen(false)} 
                className="text-white/80 hover:text-white p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 max-h-[78vh] overflow-y-auto space-y-6 text-xs">
              {occSubmitted ? (
                /* ================================================================= */
                /* SUCCESS VIEW: DIGITAL OCCUPATIONAL WORK PERMIT (QC BPLD E-PERMIT)  */
                /* ================================================================= */
                <div className="space-y-6 py-2">
                  {/* Status Banner */}
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-900 dark:text-emerald-200">
                    <div className="flex items-center gap-3 text-center sm:text-left">
                      <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <CheckCircle2 size={28} />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-black">
                          Occupational Permit Approved & Electronically Issued!
                        </h4>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300">
                          Clearances validated against Quezon City Health Department and BPLD Registry.
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 font-mono font-black text-xs text-emerald-700 dark:text-emerald-300 shrink-0 shadow-xs">
                      Permit No: {occPermitNumber}
                    </div>
                  </div>

                  {/* Official Digital Permit Card Representation */}
                  <div className="border-2 border-emerald-700/60 dark:border-emerald-600/50 rounded-2xl p-6 bg-gradient-to-b from-white to-emerald-50/20 dark:from-slate-900 dark:to-emerald-950/20 shadow-xl relative overflow-hidden space-y-5">
                    {/* Top Seal & Heading */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-emerald-200 dark:border-emerald-900">
                      <div className="flex items-center gap-3 text-center sm:text-left">
                        <div className="w-14 h-14 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0 border-2 border-amber-400">
                          QC
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                            Republic of the Philippines • City Government of Quezon City
                          </span>
                          <h5 className="text-sm font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-tight">
                            Business Permits and Licensing Department (BPLD)
                          </h5>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            ELECTRONIC OCCUPATIONAL WORK PERMIT
                          </span>
                        </div>
                      </div>

                      <div className="text-center sm:text-right shrink-0">
                        <div className="w-20 h-20 mx-auto sm:ml-auto p-1.5 bg-white rounded-xl border border-slate-300 shadow-xs flex flex-col items-center justify-center">
                          <QrCode size={56} className="text-slate-900" />
                          <span className="text-[7.5px] font-mono font-bold text-slate-600 uppercase">QC e-Verify</span>
                        </div>
                      </div>
                    </div>

                    {/* Worker Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 bg-white/70 dark:bg-slate-800/60 p-4 rounded-xl border border-emerald-100 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Worker Legal Name</span>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-100">{occWorkerData.fullName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Position / Category</span>
                        <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">{occWorkerData.occupationCategory}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Mobile Contact</span>
                        <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100">{occWorkerData.contactNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Employer Establishment</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{occWorkerData.employerName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Workplace Address</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{occWorkerData.employerAddress}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Validity Period</span>
                        <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">Valid until Dec 31, 2026</span>
                      </div>
                    </div>

                    {/* Clearances Status Row */}
                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-500" />
                        Health Card: Verified Active (QCHD)
                      </span>
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-500" />
                        Police / NBI Clearance: Valid
                      </span>
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-500" />
                        Barangay Clearance: On-File
                      </span>
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-500" />
                        Photo ID: Verified
                      </span>
                    </div>

                    {/* Official Signatures */}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 block">
                          MARGIE SANTOS
                        </span>
                        <span className="text-[9.5px] text-slate-500">Head, Business Permits & Licensing Dept. (BPLD)</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 block">
                          MA. JOSEFINA "JOY" BELMONTE
                        </span>
                        <span className="text-[9.5px] text-slate-500">City Mayor, Quezon City</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Date Issued: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  {/* Success Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        alert(`Downloading Official QC Occupational Permit ${occPermitNumber}...`);
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
                    >
                      <Download size={14} />
                      <span>Download Digital e-Permit (PDF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Printer size={14} />
                      <span>Print Permit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOccSubmitted(false);
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold cursor-pointer transition-colors"
                    >
                      File Another Application
                    </button>
                  </div>
                </div>
              ) : (
                /* ================================================================= */
                /* APPLICATION FORM: UPLOAD-FIRST CLEARANCES APPLICATION FLOW        */
                /* ================================================================= */
                <div className="space-y-6">
                  {/* Category Switcher: Standard vs First-Time Jobseeker */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        Select Applicant Category:
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        {occAppType === 'first_time' ? '🎉 RA 11261 Fee Exemption Active' : 'Standard Rate: ₱170.00'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setOccAppType('regular')}
                        className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                          occAppType === 'regular'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-4 h-4 mt-0.5 rounded-full border flex items-center justify-center shrink-0 ${
                          occAppType === 'regular' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-400'
                        }`}>
                          {occAppType === 'regular' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">Regular Employee Application</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">Standard QC BPLD Tariff: ₱170.00 (Permit + Doc Stamp)</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOccAppType('first_time')}
                        className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                          occAppType === 'first_time'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-4 h-4 mt-0.5 rounded-full border flex items-center justify-center shrink-0 ${
                          occAppType === 'first_time' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-400'
                        }`}>
                          {occAppType === 'first_time' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">First-Time Jobseeker (RA 11261)</span>
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">100% FREE (₱0.00) with Barangay / PESO Cert</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Worker & Employer Information (Compact & Pre-filled) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                        1. Worker & Employer Profile
                      </span>
                      <span className="text-[10px] text-slate-400">Pre-filled from QC Citizen Profile</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Worker Full Legal Name *
                        </label>
                        <input 
                          type="text" 
                          value={occWorkerData.fullName}
                          onChange={(e) => setOccWorkerData({ ...occWorkerData, fullName: e.target.value })}
                          className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold" 
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Mobile Contact Number *
                        </label>
                        <input 
                          type="text" 
                          value={occWorkerData.contactNumber}
                          onChange={(e) => setOccWorkerData({ ...occWorkerData, contactNumber: e.target.value })}
                          className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono font-bold" 
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Work Position / Category *
                        </label>
                        <select 
                          value={occWorkerData.occupationCategory}
                          onChange={(e) => setOccWorkerData({ ...occWorkerData, occupationCategory: e.target.value })}
                          className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold"
                        >
                          <option>Food Handler / Kitchen Staff (Requires Green Health Card)</option>
                          <option>Cashier / Retail Staff (Requires Yellow/Pink Health Card)</option>
                          <option>Salon / Barber / Spa Staff (Requires Pink Health Card)</option>
                          <option>Security Guard / Safety Officer</option>
                          <option>Hotel & Hospitality Personnel</option>
                          <option>Industrial / Commercial Staff</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Employer / Company Establishment Name in QC *
                        </label>
                        <input 
                          type="text" 
                          value={occWorkerData.employerName}
                          onChange={(e) => setOccWorkerData({ ...occWorkerData, employerName: e.target.value })}
                          className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold" 
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Workplace QC Address / Barangay *
                        </label>
                        <input 
                          type="text" 
                          value={occWorkerData.employerAddress}
                          onChange={(e) => setOccWorkerData({ ...occWorkerData, employerAddress: e.target.value })}
                          className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* DOCUMENT UPLOADS: THE MAIN EMPHASIS ("MORE ON UPLOAD LANG") */}
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-1.5">
                          <UploadCloud size={15} className="text-emerald-600 dark:text-emerald-400" />
                          <span>2. Mandatory Clearance & Document Uploads</span>
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Upload clear photos or PDF scans. Allowed file types: <span className="font-bold text-slate-700 dark:text-slate-300">.pdf, .jpg, .jpeg, .png</span> (up to 15MB)
                        </p>
                      </div>

                      {/* 1-Click Auto-Attach Demo Helper */}
                      <button
                        type="button"
                        onClick={loadSampleOccClearances}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
                      >
                        <Sparkles size={13} className="text-emerald-600 dark:text-emerald-400" />
                        <span>Auto-attach Sample QC Clearances</span>
                      </button>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-between text-[11px] px-1">
                      <span className="text-slate-500">
                        Upload Progress: <strong className="text-slate-800 dark:text-slate-200">
                          {Object.values(occFiles).filter(Boolean).length} / 4 Mandatory Files
                        </strong>
                      </span>
                      {Object.values(occFiles).filter(Boolean).length >= 4 && (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 size={13} />
                          Ready for Submission
                        </span>
                      )}
                    </div>

                    {/* 5 Detailed Document Upload Cards */}
                    <div className="space-y-3">
                      {[
                        {
                          id: 'health_card',
                          title: 'QC Health Certificate / Sanitary Permit Card',
                          note: 'Issued by QC Health Dept. (Green card for Food Handlers, Pink/Yellow for Non-Food & Personal Service)',
                          required: true,
                          file: occFiles.health_card
                        },
                        {
                          id: 'police_nbi',
                          title: 'Valid Police Clearance or NBI Clearance',
                          note: 'Issued within the last 6 months for employment in Quezon City',
                          required: true,
                          file: occFiles.police_nbi
                        },
                        {
                          id: 'brgy_clearance',
                          title: 'Barangay Work Clearance',
                          note: 'Issued by the QC Barangay where employer operates or where applicant resides',
                          required: true,
                          file: occFiles.brgy_clearance
                        },
                        {
                          id: 'gov_id',
                          title: 'Valid Government-Issued Photo ID with Signature',
                          note: 'QC Citizen ID, PhilSys National ID, UMID, Driver\'s License, Voter\'s ID, or Passport',
                          required: true,
                          file: occFiles.gov_id
                        },
                        {
                          id: 'special_doc',
                          title: occAppType === 'first_time' ? 'Barangay / PESO First-Time Jobseeker Certificate (RA 11261)' : 'Community Tax Certificate (Cedula) / Supporting Doc',
                          note: occAppType === 'first_time' ? 'Mandatory for 100% Free Permit Fee Waiver under RA 11261' : 'Optional / Supporting attachment',
                          required: occAppType === 'first_time',
                          file: occFiles.special_doc
                        }
                      ].map((item, index) => (
                        <div 
                          key={item.id}
                          className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                            item.file 
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-400 dark:border-emerald-700/60 shadow-xs' 
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            {/* Left: Info */}
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-[13px]">
                                  {index + 1}. {item.title}
                                </span>
                                {item.required ? (
                                  <span className="px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">
                                    Required
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                    Optional
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {item.note}
                              </p>
                            </div>

                            {/* Right: Upload Trigger or Uploaded State */}
                            <div className="shrink-0 flex items-center gap-2">
                              {item.file ? (
                                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-emerald-300 dark:border-emerald-700 shadow-2xs">
                                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                                    PDF
                                  </div>
                                  <div className="max-w-[130px] sm:max-w-[180px] overflow-hidden">
                                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block truncate" title={item.file.name}>
                                      {item.file.name}
                                    </span>
                                    <span className="text-[9.5px] text-emerald-600 font-bold block">
                                      ✓ Attached ({item.file.size})
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1 border-l pl-1.5 border-slate-200 dark:border-slate-700">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setPreviewDocModal({
                                          isOpen: true,
                                          title: item.title,
                                          fileName: item.file!.name,
                                          fileSize: item.file!.size,
                                          previewUrl: item.file!.previewUrl,
                                          docCategory: 'QC Occupational Clearance',
                                          date: item.file!.date,
                                          docKey: item.id
                                        });
                                      }}
                                      title="Preview Document"
                                      className="p-1.5 rounded-lg text-blue-600 dark:text-sky-400 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer"
                                    >
                                      <Eye size={13} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDownloadDoc(item.file!.name, item.file!.previewUrl)}
                                      title="Download Document"
                                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                                    >
                                      <Download size={13} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => removeOccFile(item.id)}
                                      title="Remove Document"
                                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 cursor-pointer"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOccActiveUploadId(item.id);
                                    occFileInputRef.current?.click();
                                  }}
                                  className="px-4 py-2 rounded-xl border border-emerald-600 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
                                >
                                  <Upload size={13} />
                                  <span>Choose File / Upload Photo</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fee Assessment & QC Pay Easy */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-[#072418] text-white border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        QC BPLD Assessment of Charges
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-xl sm:text-2xl font-black text-white">
                          {occAppType === 'first_time' ? '₱0.00' : '₱170.00'}
                        </span>
                        <span className="text-xs text-slate-300">
                          {occAppType === 'first_time' 
                            ? '(100% Free under RA 11261 First Time Jobseeker Act)' 
                            : '(₱150.00 Permit Fee + ₱20.00 Legal Research/Doc Stamp)'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-xs font-bold text-emerald-400 hidden sm:inline">Pay via:</span>
                      <div className="flex gap-1.5 w-full sm:w-auto justify-end">
                        <span className="px-2.5 py-1 rounded-lg bg-white/10 text-[11px] font-bold text-slate-200">QC Pay Easy</span>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30">GCash / Maya</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center">
              {!occSubmitted && (
                <button 
                  type="button"
                  onClick={() => {
                    // If user hasn't uploaded clearances, auto-attach for convenience
                    if (!occFiles.health_card || !occFiles.police_nbi) {
                      loadSampleOccClearances();
                    }
                    setOccSubmitted(true);
                  }}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl font-black shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all text-xs sm:text-sm"
                >
                  <span>Submit Work Permit Application →</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BUSINESS INFORMATION SYSTEM (CTC REQUEST - QC E-SERVICES UPLOAD-FIRST) */}
      {/* ========================================================================= */}
      {isBisModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          {/* Hidden File Input for BIS / CTC Uploads */}
          <input 
            type="file" 
            ref={bisFileInputRef} 
            onChange={handleBisFileUpload} 
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" 
            className="hidden" 
          />

          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 my-auto">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#190724] via-[#2d0e41] to-[#12041b] text-white flex items-center justify-between border-b border-purple-500/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-400/20 text-purple-300 border border-purple-400/30 flex items-center gap-1">
                    <ShieldCheck size={11} />
                    <span>QC BPLD • Records & Statistics Division</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200 border border-white/10 hidden sm:inline-block">
                    100% Upload-Driven
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-black tracking-wide uppercase text-white flex items-center gap-2">
                  <span>Request Certified True Copy (CTC) / Business Certification</span>
                </h3>
                <p className="text-xs text-purple-100/90 leading-relaxed">
                  Quezon City E-Services Citizen's Charter Compliant • Authenticated Electronic Document & Clearance Upload System
                </p>
              </div>
              <button 
                onClick={() => setIsBisModalOpen(false)} 
                className="text-white/80 hover:text-white p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 max-h-[78vh] overflow-y-auto space-y-6 text-xs">
              {bisSubmitted ? (
                /* ================================================================= */
                /* SUCCESS VIEW: AUTHENTICATED CERTIFIED TRUE COPY (QC BPLD CTC)     */
                /* ================================================================= */
                <div className="space-y-6 py-2">
                  {/* Status Banner */}
                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-purple-900 dark:text-purple-200">
                    <div className="flex items-center gap-3 text-center sm:text-left">
                      <div className="w-12 h-12 rounded-xl bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-md">
                        <CheckCircle2 size={28} />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-black">
                          Certified True Copy (CTC) Authenticated & Issued!
                        </h4>
                        <p className="text-xs text-purple-700 dark:text-purple-300">
                          Document verified against Quezon City Official Business Registry and Dry Seal archive.
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-700 font-mono font-black text-xs text-purple-700 dark:text-purple-300 shrink-0 shadow-xs">
                      Tracking No: {bisTrackingNumber}
                    </div>
                  </div>

                  {/* Official Certified True Copy Document Certificate Card */}
                  <div className="border-2 border-purple-800/60 dark:border-purple-600/50 rounded-2xl p-6 bg-gradient-to-b from-white to-purple-50/20 dark:from-slate-900 dark:to-purple-950/20 shadow-xl relative overflow-hidden space-y-5">
                    {/* Top Seal & Heading */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-purple-200 dark:border-purple-900">
                      <div className="flex items-center gap-3 text-center sm:text-left">
                        <div className="w-14 h-14 rounded-full bg-purple-800 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0 border-2 border-amber-400">
                          QC
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                            Republic of the Philippines • City Government of Quezon City
                          </span>
                          <h5 className="text-sm font-black text-purple-950 dark:text-purple-300 uppercase tracking-tight">
                            Business Permits and Licensing Department (BPLD)
                          </h5>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            RECORDS AND STATISTICS DIVISION • CERTIFIED TRUE COPY
                          </span>
                        </div>
                      </div>

                      <div className="text-center sm:text-right shrink-0">
                        <div className="w-20 h-20 mx-auto sm:ml-auto p-1.5 bg-white rounded-xl border border-slate-300 shadow-xs flex flex-col items-center justify-center">
                          <QrCode size={56} className="text-slate-900" />
                          <span className="text-[7.5px] font-mono font-bold text-slate-600 uppercase">QC e-Certify</span>
                        </div>
                      </div>
                    </div>

                    {/* Official Certification Text */}
                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-slate-800 dark:text-slate-200 leading-relaxed text-xs">
                      <p className="font-serif italic">
                        "THIS IS TO CERTIFY that according to official records on file with the Records and Statistics Division of the Business Permits and Licensing Department (BPLD), Quezon City, the attached document is a true, faithful, and official electronic reproduction of the Mayor's Permit issued to <strong className="text-purple-900 dark:text-purple-300 font-bold">ABC Computer Shop & Trading</strong> under Permit Reference No. <strong className="font-mono">MP-2026-48190</strong> for Calendar Year 2026."
                      </p>
                    </div>

                    {/* Business Record Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 bg-white/70 dark:bg-slate-800/60 p-4 rounded-xl border border-purple-100 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Registered Business Name</span>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-100">ABC Computer Shop & Trading</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Permit Reference No.</span>
                        <span className="text-xs font-mono font-black text-purple-700 dark:text-purple-400">MP-2026-48190</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Registered Proprietor</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Juan Santos Dela Cruz</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Official Business Address</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Unit 402, 123 Quezon Avenue, Brgy. San Antonio, QC</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Requested Purpose</span>
                        <span className="text-xs font-bold text-purple-700 dark:text-purple-300">{bisPurpose}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Electronic Dry-Seal Status</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">✓ Authenticated & Secured</span>
                      </div>
                    </div>

                    {/* Clearances Status Row */}
                    <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-purple-500" />
                        Owner ID: Verified On-File
                      </span>
                      <span className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-purple-500" />
                        Prior Permit Copy: Authenticated
                      </span>
                      <span className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-purple-500" />
                        DTI/SEC Registry: Active
                      </span>
                      <span className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-purple-500" />
                        Official Receipt: Paid (₱220.00)
                      </span>
                    </div>

                    {/* Signatures */}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 block">
                          MARGIE SANTOS
                        </span>
                        <span className="text-[9.5px] text-slate-500">Head, Business Permits & Licensing Dept. (BPLD)</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 block">
                          MA. JOSEFINA "JOY" BELMONTE
                        </span>
                        <span className="text-[9.5px] text-slate-500">City Mayor, Quezon City</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Date Issued: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => alert(`Downloading Official Authenticated CTC ${bisTrackingNumber}...`)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
                    >
                      <Download size={14} />
                      <span>Download Authenticated CTC (PDF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Printer size={14} />
                      <span>Print Certified Copy</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBisSubmitted(false)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold cursor-pointer transition-colors"
                    >
                      Request Another Certification
                    </button>
                  </div>
                </div>
              ) : (
                /* ================================================================= */
                /* APPLICATION FORM: UPLOAD-FIRST BIS / CTC APPLICATION FLOW         */
                /* ================================================================= */
                <div className="space-y-6">
                  {/* Step 1: Registered Business Verification */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Search size={13} className="text-purple-600 dark:text-purple-400" />
                        <span>1. Verified Registered Business in QC BPLD</span>
                      </span>

                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="text" 
                        value={bisSearchQuery} 
                        onChange={(e) => setBisSearchQuery(e.target.value)}
                        placeholder="Enter Permit No. or Business BIN (e.g. BP-2026-48190)..."
                        className="flex-1 p-2.5 border rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold" 
                      />
                      <button 
                        type="button"
                        onClick={() => setBisRecordFound(true)}
                        className="px-5 py-2.5 bg-purple-700 hover:bg-purple-600 text-white rounded-xl font-bold cursor-pointer transition-colors shrink-0"
                      >
                        Verify Record
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Business Name</span>
                        <strong className="text-slate-900 dark:text-white">ABC Computer Shop & Trading</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Permit Reference</span>
                        <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">MP-2026-48190</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Registered Owner</span>
                        <strong className="text-slate-900 dark:text-white">Juan Santos Dela Cruz</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Registered Location</span>
                        <span className="text-slate-700 dark:text-slate-300">Brgy. San Antonio, Quezon City</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Certification Type & Purpose Selection */}
                  <div className="space-y-3">
                    <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] block">
                      2. Certification Type & Purpose
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Document Requested *
                        </label>
                        <select 
                          value={bisCertType}
                          onChange={(e) => setBisCertType(e.target.value)}
                          className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold"
                        >
                          <option value="ctc_permit">Certified True Copy (CTC) of Mayor's Permit</option>
                          <option value="existence">Certificate of Business Existence & Registration</option>
                          <option value="tax_dec">Certified Copy of Business Tax Assessment / Official Receipt</option>
                          <option value="no_business">Certificate of No Business / Non-Operation</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Purpose of Request *
                        </label>
                        <select 
                          value={bisPurpose}
                          onChange={(e) => setBisPurpose(e.target.value)}
                          className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold"
                        >
                          <option value="Bank Requirement / Loan Application">Bank Requirement / Commercial Loan Application</option>
                          <option value="Government Procurement & Bidding">Government Bidding & LGU Procurement Accreditation</option>
                          <option value="Visa Application / Embassy Requirement">Visa Application / Embassy Documentation</option>
                          <option value="BIR / Tax Audit / Court Compliance">BIR / Tax Audit / Legal & Court Compliance</option>
                          <option value="Replacement for Lost / Damaged Permit">Replacement for Lost / Damaged Original Permit</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: DOCUMENT UPLOADS: THE MAIN EMPHASIS ("MORE ON UPLOADS") */}
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-1.5">
                          <UploadCloud size={15} className="text-purple-600 dark:text-purple-400" />
                          <span>3. Mandatory Document & ID Uploads</span>
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Upload clear photos or PDF scans. Allowed file types: <span className="font-bold text-slate-700 dark:text-slate-300">.pdf, .jpg, .jpeg, .png</span> (up to 15MB)
                        </p>
                      </div>

                      {/* 1-Click Auto-Attach Demo Helper */}
                      <button
                        type="button"
                        onClick={loadSampleBisDocuments}
                        className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/50 border border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-300 font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
                      >
                        <Sparkles size={13} className="text-purple-600 dark:text-purple-400" />
                        <span>Auto-attach Sample QC CTC Documents</span>
                      </button>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-between text-[11px] px-1">
                      <span className="text-slate-500">
                        Upload Progress: <strong className="text-slate-800 dark:text-slate-200">
                          {Object.values(bisFiles).filter(Boolean).length} / 3 Mandatory Files
                        </strong>
                      </span>
                      {Object.values(bisFiles).filter(Boolean).length >= 3 && (
                        <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1">
                          <CheckCircle2 size={13} />
                          Ready for Authentication
                        </span>
                      )}
                    </div>

                    {/* 5 Detailed Document Upload Cards */}
                    <div className="space-y-3">
                      {[
                        {
                          id: 'owner_id',
                          title: 'Valid Government-Issued Photo ID of Business Owner / Signatory',
                          note: 'QC Citizen ID, PhilSys National ID, UMID, Driver\'s License, or Passport with 3 specimen signatures',
                          required: true,
                          file: bisFiles.owner_id
                        },
                        {
                          id: 'permit_copy',
                          title: 'Copy of Previous Mayor\'s Permit or Official Receipt (OR)',
                          note: 'Scan or photo of previous year Mayor\'s Permit, Business Plate, or Tax Assessment / OR',
                          required: true,
                          file: bisFiles.permit_copy
                        },
                        {
                          id: 'dti_sec',
                          title: 'DTI Certificate of Business Name / SEC Certificate & Articles',
                          note: 'Certificate of Registration with DTI (Sole Prop) or SEC Registration & GIS (Corporation)',
                          required: true,
                          file: bisFiles.dti_sec
                        },
                        {
                          id: 'spa_sec_cert',
                          title: 'Special Power of Attorney (SPA) or Secretary\'s Certificate',
                          note: 'Notarized authorization letter / SPA if filed by a representative, or Board Resolution for Corporations',
                          required: false,
                          file: bisFiles.spa_sec_cert
                        },
                        {
                          id: 'affidavit_loss',
                          title: 'Affidavit of Loss (Required if Original Permit was Lost or Destroyed)',
                          note: 'Duly notarized Affidavit of Loss stating the circumstances of the lost or destroyed permit',
                          required: bisPurpose === 'Replacement for Lost / Damaged Permit',
                          file: bisFiles.affidavit_loss
                        }
                      ].map((item, index) => (
                        <div 
                          key={item.id}
                          className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                            item.file 
                              ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-400 dark:border-purple-700/60 shadow-xs' 
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            {/* Left: Info */}
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-[13px]">
                                  {index + 1}. {item.title}
                                </span>
                                {item.required ? (
                                  <span className="px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">
                                    Required
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                    Optional / Conditional
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {item.note}
                              </p>
                            </div>

                            {/* Right: Upload Trigger or Uploaded State */}
                            <div className="shrink-0 flex items-center gap-2">
                              {item.file ? (
                                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-purple-300 dark:border-purple-700 shadow-2xs">
                                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                                    PDF
                                  </div>
                                  <div className="max-w-[130px] sm:max-w-[180px] overflow-hidden">
                                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block truncate" title={item.file.name}>
                                      {item.file.name}
                                    </span>
                                    <span className="text-[9.5px] text-purple-600 dark:text-purple-400 font-bold block">
                                      ✓ Attached ({item.file.size})
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1 border-l pl-1.5 border-slate-200 dark:border-slate-700">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setPreviewDocModal({
                                          isOpen: true,
                                          title: item.title,
                                          fileName: item.file!.name,
                                          fileSize: item.file!.size,
                                          previewUrl: item.file!.previewUrl,
                                          docCategory: 'QC BIS / CTC Attachment',
                                          date: item.file!.date,
                                          docKey: item.id
                                        });
                                      }}
                                      title="Preview Document"
                                      className="p-1.5 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-slate-700 cursor-pointer"
                                    >
                                      <Eye size={13} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDownloadDoc(item.file!.name, item.file!.previewUrl)}
                                      title="Download Document"
                                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                                    >
                                      <Download size={13} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => removeBisFile(item.id)}
                                      title="Remove Document"
                                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 cursor-pointer"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setBisActiveUploadId(item.id);
                                    bisFileInputRef.current?.click();
                                  }}
                                  className="px-4 py-2 rounded-xl border border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
                                >
                                  <Upload size={13} />
                                  <span>Choose File / Upload Scan</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center">
              {!bisSubmitted && (
                <button 
                  type="button"
                  onClick={() => {
                    if (!bisFiles.owner_id || !bisFiles.permit_copy) {
                      loadSampleBisDocuments();
                    }
                    setBisSubmitted(true);
                  }}
                  className="px-8 py-3 bg-purple-700 hover:bg-purple-600 active:bg-purple-800 text-white rounded-xl font-black shadow-md shadow-purple-700/30 flex items-center justify-center gap-2 cursor-pointer transition-all text-xs sm:text-sm"
                >
                  <span>Submit CTC Request & Authenticate →</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: MAYOR'S PERMIT VERIFICATION (QC E-SERVICES / eBOSS PORTAL)      */}
      {/* ========================================================================= */}
      {isVerificationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          {/* Hidden File Input for QR Code Image Upload */}
          <input 
            type="file" 
            ref={qrFileInputRef} 
            onChange={handleQrFileUpload} 
            accept=".pdf,.jpg,.jpeg,.png" 
            className="hidden" 
          />

          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 my-auto">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#221203] via-[#381e05] to-[#140901] text-white flex items-center justify-between border-b border-amber-500/30">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                    <ShieldCheck size={11} />
                    <span>QC BPLD • QC eBOSS Public Registry</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    100% Free Public Service
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-black tracking-wide uppercase text-white flex items-center gap-2">
                  <span>Mayor's Business Permit Verification & QR Validation</span>
                </h3>
                <p className="text-xs text-amber-100/90 leading-relaxed">
                  Quezon City E-Services Citizen's Charter • Real-Time Business Registration & Regulatory Compliance Check
                </p>
              </div>
              <button 
                onClick={() => setIsVerificationModalOpen(false)} 
                title="Close window"
                className="text-white/80 hover:text-white p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 max-h-[78vh] overflow-y-auto space-y-5 text-xs">
              {/* Friendly Guide Banner */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-start gap-3 text-slate-700 dark:text-slate-200">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles size={16} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-amber-900 dark:text-amber-300 text-xs sm:text-sm">
                      💡 How to Verify (User Guide)
                    </h4>
                    <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold">Free of Charge</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Choose your preferred search method below: by <strong>Permit No. / BIN</strong>, <strong>Business Trade Name</strong>, or by uploading a photo of the <strong>Permit QR Code</strong>.
                  </p>
                </div>
              </div>

              {/* Verification Search & Mode Selector */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                {/* 3 Search Mode Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                  <button
                    type="button"
                    onClick={() => setVerificationMode('permit_no')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      verificationMode === 'permit_no'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    <Search size={13} />
                    <span>1. Permit No. / BIN</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerificationMode('name')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      verificationMode === 'name'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    <Building2 size={13} />
                    <span>2. Business Trade Name</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setVerificationMode('upload_qr');
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      verificationMode === 'upload_qr'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    <QrCode size={13} />
                    <span>3. Scan / Upload QR Code</span>
                  </button>
                </div>

                {/* Input Fields depending on Mode */}
                {verificationMode !== 'upload_qr' ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        value={verificationQuery} 
                        onChange={(e) => setVerificationQuery(e.target.value)}
                        placeholder={verificationMode === 'permit_no' ? 'e.g. MP-2026-48190 or BIN-QC-2026-08192...' : 'e.g. ABC Computer Shop or Apex Media...'}
                        className="w-full p-2.5 pr-8 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold focus:ring-2 focus:ring-amber-500 focus:outline-hidden" 
                      />
                      {verificationQuery && (
                        <button
                          type="button"
                          onClick={() => setVerificationQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1"
                          title="Clear input"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <button 
                      type="button"
                      onClick={() => setVerificationResult(true)}
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white rounded-xl font-bold cursor-pointer transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Search size={14} />
                      <span>Verify Record</span>
                    </button>
                  </div>
                ) : (
                  /* QR Code Upload Box */
                  <div className="p-5 rounded-2xl border-2 border-dashed border-amber-400 dark:border-amber-600/60 bg-amber-50/40 dark:bg-amber-950/20 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center shadow-xs">
                      <QrCode size={24} />
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 block text-xs sm:text-sm">
                        Scan or Upload Business Permit QR Code
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                        Upload a photo or scanned copy of your Quezon City Mayor's Permit or Business Plate. Our AI scanner reads and validates the encrypted QR code against City Hall records immediately.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => qrFileInputRef.current?.click()}
                        className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors text-xs"
                      >
                        <Upload size={14} />
                        <span>Choose Image / File (.jpg, .png, .pdf)</span>
                      </button>

                      
                    </div>

                    
                  </div>
                )}
              </div>

                          </div>


          </div>
        </div>
      )}

      </main>

      

    </div>
  );
};
