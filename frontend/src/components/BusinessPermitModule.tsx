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
  Image as ImageIcon,
  ArrowLeft
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  | 'new_app_overview'
  | 'new_app' 
  | 'renewal_overview'
  | 'renewal' 
  | 'amendment_overview'
  | 'amendment' 
  | 'special_permit_overview'
  | 'special_permit' 
  | 'occupational_permit'
  | 'pay_tax' 
  | 'ctc_pulling' 
  | 'verification' 
  | 'safe_seal';

export const BusinessPermitModule: React.FC<BusinessPermitModuleProps> = ({
  onNavigateToTab,
  onAddNewApplication,
  onNavigateToDashboard,
  initialView
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, language } = useLanguage();
  const isAdmin = user?.role === 'admin';

  const getInitialView = (): MainViewMode => {
    const p = window.location.pathname;
    if (p === '/portal/business/occupational') return 'occupational_permit';
    if (p === '/portal/business/apply') return 'select_type';
    if (p === '/portal/business/info') return 'ctc_pulling';
    if (p === '/portal/business/verify') return 'verification';
    if (p === '/portal/business/renew') return 'renewal_overview';
    return initialView || 'preview';
  };

  const [currentView, setCurrentView] = useState<MainViewMode>(getInitialView);

  // Synchronize currentView bidirectionally with URL
  useEffect(() => {
    const p = location.pathname;
    if (p === '/portal/business/occupational') {
      setCurrentView('occupational_permit');
    } else if (p === '/portal/business/apply') {
      setCurrentView('select_type');
    } else if (p === '/portal/business/info') {
      setCurrentView('ctc_pulling');
    } else if (p === '/portal/business/verify') {
      setCurrentView('verification');
      setIsVerificationModalOpen(true);
    } else if (p === '/portal/business/renew') {
      setCurrentView('renewal_overview');
    } else if (p === '/portal/business' || p === '/portal/business/') {
      setCurrentView('preview');
      setIsVerificationModalOpen(false);
    }
  }, [location.pathname]);

  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Requirements Modal state
  const [isReqModalOpen, setIsReqModalOpen] = useState<boolean>(false);

  // States for the 4 Reference Cards (Pictures 1-4)
  const [isOccupationalModalOpen, setIsOccupationalModalOpen] = useState<boolean>(false);
  const [isBisModalOpen, setIsBisModalOpen] = useState<boolean>(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState<boolean>(false);
  const [bisSearchQuery, setBisSearchQuery] = useState<string>('');
  const [bisRecordFound, setBisRecordFound] = useState<boolean>(false);
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
      const sizeStr = file.size < 1024 * 1024
        ? `${(file.size / 1024).toFixed(1)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      const fakeUrl = URL.createObjectURL(file);
      setBisFiles(prev => ({
        ...prev,
        [bisActiveUploadId]: {
          name: file.name,
          size: sizeStr,
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

  const resetBisForm = () => {
    setBisSearchQuery('');
    setBisRecordFound(false);
    setBisFiles({
      owner_id: null,
      permit_copy: null,
      dti_sec: null,
      spa_sec_cert: null,
      affidavit_loss: null
    });
    setBisSubmitted(false);
    setBisActiveUploadId(null);
    if (bisFileInputRef.current) bisFileInputRef.current.value = '';
  };

  const [verificationQuery, setVerificationQuery] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<boolean>(false);
  const [verificationMode, setVerificationMode] = useState<'permit_no' | 'name' | 'upload_qr'>('permit_no');
  const [verificationQrFile, setVerificationQrFile] = useState<{ name: string; previewUrl: string; size?: string } | null>(null);
  const qrFileInputRef = useRef<HTMLInputElement>(null);
  const [verificationSampleType, setVerificationSampleType] = useState<'active_abc' | 'active_apex' | 'active_food' | 'expired'>('active_abc');
  const [showVerificationGuide, setShowVerificationGuide] = useState<boolean>(true);
  const [isScanningCamera, setIsScanningCamera] = useState<boolean>(false);

  const resetVerification = () => {
    setVerificationQuery('');
    setVerificationResult(false);
    setVerificationQrFile(null);
    setIsScanningCamera(false);
    if (qrFileInputRef.current) qrFileInputRef.current.value = '';
  };

  const handleQrFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVerificationQuery('MP-2026-48190');
      setVerificationResult(true);
      setVerificationSampleType('active_abc');
    }
    if (e.target) e.target.value = '';
  };
  const [occSubmitted, setOccSubmitted] = useState<boolean>(false);

  // Occupational Permit State (QC E-Services Citizen's Charter Upload System)
  const [occAppType, setOccAppType] = useState<'regular' | 'first_time' | ''>('');
  const [occWorkerData, setOccWorkerData] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    occupationCategory: '',
    employerName: '',
    employerAddress: '',
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
      const sizeStr = file.size < 1024 * 1024
        ? `${(file.size / 1024).toFixed(1)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      const fakeUrl = URL.createObjectURL(file);
      setOccFiles(prev => ({
        ...prev,
        [occActiveUploadId]: {
          name: file.name,
          size: sizeStr,
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

  const resetOccForm = () => {
    setOccWorkerData({
      fullName: '',
      contactNumber: '',
      email: '',
      occupationCategory: '',
      employerName: '',
      employerAddress: '',
      paymentChannel: 'gcash'
    });
    setOccFiles({
      health_card: null,
      police_nbi: null,
      brgy_clearance: null,
      gov_id: null,
      special_doc: null
    });
    setOccAppType('');
    setOccSubmitted(false);
    setOccActiveUploadId(null);
    if (occFileInputRef.current) occFileInputRef.current.value = '';
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
  const [showNewAppModal, setShowNewAppModal] = useState<boolean>(false);
  const [showSpecialPermitModal, setShowSpecialPermitModal] = useState<boolean>(false);

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
  const [renewalPaymentPlan, setRenewalPaymentPlan] = useState<'annual' | 'quarterly'>('annual');
  const [renewalAgreed, setRenewalAgreed] = useState<boolean>(true);
  const [renewalStep, setRenewalStep] = useState<number>(2);
  const [renewalTrackingNo] = useState<string>('RNW-QC-2026-094182');
  const [oldPermitData, setOldPermitData] = useState({
    businessName: 'Apex Innovations Retail Hub',
    owner: 'Juan Dela Cruz',
    permitNo: 'BP-2025-00123',
    bin: 'BIN-QC-2025-008921',
    address: 'Unit 402, 4th Floor, 123 Ayala Avenue, QC',
    orNo: 'OR-2025-88191',
    lineOfBusiness: 'Retail Sale of Electronics & Goods'
  });
  const [newPermitData, setNewPermitData] = useState({
    businessName: 'Apex Innovations Retail Hub',
    owner: 'Juan Dela Cruz',
    permitNo: 'BP-2026-004819',
    bin: 'BIN-QC-2026-008921',
    address: 'Unit 402, 4th Floor, 123 Ayala Avenue, QC',
    orNo: 'OR-2026-88191',
    lineOfBusiness: 'Retail Sale of Electronics & Goods'
  });
  const [renewalDocs, setRenewalDocs] = useState<{
    gross_statement: { name: string; size: string; date: string; previewUrl?: string } | null;
    brgy_clearance: { name: string; size: string; date: string; previewUrl?: string } | null;
    prior_permit: { name: string; size: string; date: string; previewUrl?: string } | null;
  }>({
    gross_statement: null,
    brgy_clearance: null,
    prior_permit: null
  });
  const [renewalPreviewImage, setRenewalPreviewImage] = useState<{ url: string; title: string } | null>(null);

  const handleRenewalFileUpload = (
    docKey: 'gross_statement' | 'brgy_clearance' | 'prior_permit',
    file: File | null
  ) => {
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    let previewUrl: string | undefined = undefined;
    if (isImage) {
      previewUrl = URL.createObjectURL(file);
    } else {
      previewUrl = docKey === 'gross_statement' ? '/New Application.jpg' : docKey === 'brgy_clearance' ? '/Renewal.jpg' : '/Special Permit.jpg';
    }
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = `${parseFloat(sizeInMb) < 0.1 ? (file.size / 1024).toFixed(0) + ' KB' : sizeInMb + ' MB'}`;
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    setRenewalDocs((prev) => ({
      ...prev,
      [docKey]: {
        name: file.name,
        size: sizeStr,
        date: todayStr,
        previewUrl
      }
    }));
  };

  // 3. Amendment State
  const [amendPermitNo, setAmendPermitNo] = useState<string>('');
  const [amendOrNo, setAmendOrNo] = useState<string>('');
  const [amendRecord, setAmendRecord] = useState<any>(null);
  const [amendmentType, setAmendmentType] = useState<'' | 'trade_name' | 'address' | 'line_of_business' | 'ownership'>('');
  const [amendDropdownOpen, setAmendDropdownOpen] = useState<boolean>(false);
  const [amendedValue, setAmendedValue] = useState<string>('');
  const [amendBarangay, setAmendBarangay] = useState<string>('Barangay San Antonio');
  const [amendReason, setAmendReason] = useState<string>('');
  // Document 1: Primary Registration (DTI / SEC / CDA)
  const [amendProofFile, setAmendProofFile] = useState<string | null>(null);
  const [amendProofFileSize, setAmendProofFileSize] = useState<string>('');
  const [amendProofPreview, setAmendProofPreview] = useState<string | null>(null);
  const [amendProofDate, setAmendProofDate] = useState<string>('');
  const proofFileInputRef = useRef<HTMLInputElement>(null);

  // Document 2: Barangay Clearance
  const [amendBarangayFile, setAmendBarangayFile] = useState<string | null>(null);
  const [amendBarangayFileSize, setAmendBarangayFileSize] = useState<string>('');
  const [amendBarangayPreview, setAmendBarangayPreview] = useState<string | null>(null);
  const [amendBarangayDate, setAmendBarangayDate] = useState<string>('');
  const barangayFileInputRef = useRef<HTMLInputElement>(null);

  // Document 3: Notarized Legal Instrument
  const [amendLegalFile, setAmendLegalFile] = useState<string | null>(null);
  const [amendLegalFileSize, setAmendLegalFileSize] = useState<string>('');
  const [amendLegalPreview, setAmendLegalPreview] = useState<string | null>(null);
  const [amendLegalDate, setAmendLegalDate] = useState<string>('');
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
    businessName: '',
    tin: '',
    dtiSecNumber: '',
    entityClassification: 'Corporation',
    registeredAddress: '',
    organizerName: '',
    organizerContact: '',
    organizerEmail: '',
    operationType: '',
    operatingHours: '',
    expectedAttendees: '',
    venueArea: '',
    soundAmplification: false,
    ingressDate: '',
    egressDate: '',
    commercialActivity: '',
    boothCount: '',
    admissionType: '',
    foodSelling: false,
    generatorEquipment: false,
    bannerSignage: false,
    eventTitle: '',
    venue: '',
    venueAddress: '',
    barangay: '',
    startDate: '',
    endDate: '',
    safetyOfficer: '',
    wasteManagementPlan: false
  });
  const [specialSubmitted, setSpecialSubmitted] = useState<boolean>(false);
  const [specialSwornUndertaking, setSpecialSwornUndertaking] = useState<boolean>(true);
  const [specialRefNumber, setSpecialRefNumber] = useState<string>('SP-QC-2026-004921');
  const [specialOpDropdownOpen, setSpecialOpDropdownOpen] = useState<boolean>(false);

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

  // Session Key to ensure New Business Permit wizard is completely reset when closed
  const [newAppKey, setNewAppKey] = useState<number>(0);

  // Form Reset Handlers when clicking X or Background / Backdrop (Discard all pictures and typed inputs)
  const resetRenewalForm = () => {
    setRenewalPermitNo('');
    setRenewalOrNo('');
    setRenewalRecord(null);
    setRenewalGrossSales('');
    setRenewalSubmitted(false);
    setRenewalPaymentPlan('annual');
    setRenewalAgreed(false);
    setRenewalStep(1);
    setRenewalError(false);
    setRenewalDocs({
      gross_statement: null,
      brgy_clearance: null,
      prior_permit: null
    });
    setRenewalPreviewImage(null);
  };

  const resetAmendForm = () => {
    setAmendPermitNo('');
    setAmendOrNo('');
    setAmendRecord(null);
    setAmendmentType('trade_name');
    setAmendedValue('');
    setAmendBarangay('');
    setAmendReason('');
    setAmendProofFile(null);
    setAmendProofFileSize('');
    setAmendProofPreview(null);
    setAmendProofDate('');
    setAmendBarangayFile(null);
    setAmendBarangayFileSize('');
    setAmendBarangayPreview(null);
    setAmendBarangayDate('');
    setAmendLegalFile(null);
    setAmendLegalFileSize('');
    setAmendLegalPreview(null);
    setAmendLegalDate('');
    setAmendSworn(false);
    setAmendSubmitted(false);
    setAmendError(false);
  };

  const resetSpecialPermitForm = () => {
    setSpecialStep(1);
    setSpecialTermsAccepted(false);
    setSpecialSubmitted(false);
    setSpecialSwornUndertaking(false);
    setSpecialData({
      businessName: '',
      tin: '',
      dtiSecNumber: '',
      entityClassification: 'Corporation',
      registeredAddress: '',
      organizerName: '',
      organizerContact: '',
      organizerEmail: '',
      operationType: '',
      operatingHours: '',
      expectedAttendees: '',
      venueArea: '',
      soundAmplification: false,
      ingressDate: '',
      egressDate: '',
      commercialActivity: '',
      boothCount: '',
      admissionType: '',
      foodSelling: false,
      generatorEquipment: false,
      bannerSignage: false,
      eventTitle: '',
      venue: '',
      venueAddress: '',
      barangay: '',
      startDate: '',
      endDate: '',
      safetyOfficer: '',
      wasteManagementPlan: false
    });
    setBasicDocItems(prev => prev.map(item => ({ ...item, file: null, checked: false })));
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
    <div className="min-h-screen bg-white dark:bg-[#0B1220] text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      
      {/* ========================================================================= */}
      {/* 1. STANDALONE TOP HEADER BAR (Hidden in Admin Mode) */}
      {/* ========================================================================= */}
      {!isAdmin && (
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0B1220]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-xs px-4 sm:px-8 py-3.5 transition-colors">
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
      {/* 2. FULL-WIDTH HERO SECTION (CENTERED HERO LAYOUT) */}
      {/* ========================================================================= */}
      {(currentView === 'preview' || currentView === 'select_type' || currentView === 'new_app_overview' || currentView === 'new_app') && (
        <section className="w-full bg-transparent text-slate-900 dark:text-white pt-8 pb-4 px-4 sm:px-8 relative transition-colors">
          <div className="max-w-4xl mx-auto relative z-10 text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              {currentView === 'new_app_overview' || currentView === 'new_app'
                ? 'New Business Permit Application'
                : "Business Permits & Licensing Portal"}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
              {currentView === 'new_app_overview' || currentView === 'new_app'
                ? 'Review prerequisites, documentary requirements, and register your new enterprise.'
                : "Apply for or renew your Mayor's business permit, occupational clearances, and commercial licenses online."}
            </p>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN BODY CONTAINER */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-9">

        {/* ========================================================================= */}
        {/* PREVIEW PAGE: OFFICIAL BUSINESS FEE SCHEDULE & REGULATORY TARIFF GUIDE */}
        {/* ========================================================================= */}
        {(currentView === 'preview' || currentView === 'select_type') && (
          <div className="space-y-8 animate-in fade-in pb-10">
            
            
            
            {/* ========================================================================= */}
            {/* 4 CORE SERVICES (RICH HORIZONTAL CARDS WITH BALANCED ZERO-WASTE LAYOUT) */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
              
              {/* ======================================================================= */}
              {/* CARD 1: APPLY FOR MAYOR'S PERMIT (BUSINESS) - BLUE / SKY THEME */}
              {/* ======================================================================= */}
              <div 
                className="relative overflow-hidden rounded-2xl glass-card p-4 group select-text flex flex-col justify-between w-full max-w-[430px] mx-auto"
              >

                <div className="flex flex-col justify-between gap-3.5 relative z-10 flex-1">
                  {/* Info & Details */}
                  <div className="space-y-2 min-w-0">
                    {/* Title */}
                    <div>
                      <h3 className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                        APPLY FOR MAYOR'S PERMIT (BUSINESS)
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
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Business owners and applicants</p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Briefcase size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">SERVICE METHOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Online Business Permit Application</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Clock size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">TIME PERIOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Subject to evaluation and approval</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Banknote size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">CHARGES & PAYMENT</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Based on applicable business assessment</p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <CreditCard size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">PAYMENT METHOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Online payment / available payment method</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Document Upload & Action Section (Placed directly below payment method) */}
                  <div className="w-full flex flex-col space-y-2 pt-0.5">
                    {/* Document Upload Box */}
                    <div className="p-2.5 rounded-xl bg-white/90 dark:bg-white/[0.04] border border-sky-200 dark:border-white/10 backdrop-blur-md space-y-1 shadow-xs dark:shadow-none">
                      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-sky-700 dark:text-sky-400">
                        <Camera size={12} />
                        <span>Document Upload Active</span>
                      </div>
                      <p className="text-[9.5px] text-slate-600 dark:text-slate-400 leading-snug">
                        Upload live photos of Valid ID, DTI/SEC/CDA, Location Proof & Storefront.
                      </p>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[8.5px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-sky-500 dark:bg-sky-400"></span>Valid Gov ID
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[8.5px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-sky-500 dark:bg-sky-400"></span>DTI / SEC
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[8.5px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-sky-500 dark:bg-sky-400"></span>Location Proof
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[8.5px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-sky-500 dark:bg-sky-400"></span>Storefront
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentView('select_type');
                          navigate('/portal/business/apply');
                        }}
                        className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 hover:scale-[1.005] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Apply for Business Permit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* CARD 2: APPLY FOR OCCUPATIONAL / WORK PERMIT - GREEN / EMERALD THEME */}
              {/* ======================================================================= */}
              <div 
                className="relative overflow-hidden rounded-2xl glass-card p-4 group select-text flex flex-col justify-between w-full max-w-[430px] mx-auto"
              >

                <div className="flex flex-col justify-between gap-3.5 relative z-10 flex-1">
                  {/* Info & Details */}
                  <div className="space-y-2 min-w-0">
                    {/* Title */}
                    <div>
                      <h3 className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                        APPLY FOR OCCUPATIONAL / WORK PERMIT
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
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Commercial staff, cashiers, security & service employees</p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Briefcase size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">SERVICE METHOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Online clearance & document filing via QC E-Services</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Clock size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">TIME PERIOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">1 to 2 working days upon submission of clearances</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Banknote size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">CHARGES & PAYMENT</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">₱170.00 Standard Tariff <span className="text-sky-700 dark:text-sky-400 font-bold">(₱0 Free for 1st Time)</span></p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <CreditCard size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">PAYMENT METHOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">QC Pay Easy (Maya, GCash, Landbank Link.Biz, Cards)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Document Upload & Action Section (Placed directly below payment method) */}
                  <div className="w-full flex flex-col space-y-2 pt-0.5">
                    {/* Clearance Upload Portal Info */}
                    <div className="p-2.5 rounded-xl bg-white/90 dark:bg-white/[0.04] border border-sky-200 dark:border-white/10 backdrop-blur-md space-y-1 select-text shadow-xs dark:shadow-none">
                      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-sky-700 dark:text-sky-400">
                        <Camera size={12} />
                        <span>Clearance Upload Active</span>
                      </div>
                      <p className="text-[9.5px] text-slate-600 dark:text-slate-400 leading-snug">
                        Fast-track processing: Upload Health Card, Police/NBI & Barangay Clearances.
                      </p>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[8.5px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-sky-500 dark:bg-sky-400"></span>Health Card
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[8.5px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-sky-500 dark:bg-sky-400"></span>Police/NBI
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[8.5px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-sky-500 dark:bg-sky-400"></span>Barangay
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[8.5px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-sky-500 dark:bg-sky-400"></span>Photo ID
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          resetOccForm();
                          setCurrentView('occupational_permit');
                          navigate('/portal/business/occupational');
                        }}
                        className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 hover:scale-[1.005] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Apply for Work Permit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* CARD 3: BUSINESS INFORMATION SYSTEM - PURE BLUE THEME */}
              {/* ======================================================================= */}
              <div 
                className="relative overflow-hidden rounded-2xl glass-card p-4 group select-text flex flex-col justify-between w-full max-w-[430px] mx-auto"
              >

                <div className="flex flex-col justify-between gap-3.5 relative z-10 flex-1">
                  {/* Info & Details */}
                  <div className="space-y-2 min-w-0">
                    {/* Title */}
                    <div>
                      <h3 className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                        BUSINESS INFORMATION SYSTEM
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
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Registered business owners, officers & legal counsel</p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Briefcase size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">SERVICE METHOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Online business registry verification & CTC request</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Clock size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">TIME PERIOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">1 to 2 working days (Electronic CTC with QR code)</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Banknote size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">CHARGES & PAYMENT</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">₱220.00 Official QC BPLD Tariff <span className="text-sky-700 dark:text-sky-300 font-bold">(CTC + Legal Doc Stamp)</span></p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <CreditCard size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">PAYMENT METHOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">QC Pay Easy (e-Wallets, Maya, GCash, Cards)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Document Upload & Action Section (Placed directly below payment method) */}
                  <div className="w-full flex flex-col space-y-2 pt-0.5">
                    {/* Document Upload Info */}
                    <div className="p-2.5 rounded-xl bg-white/90 dark:bg-white/[0.04] border border-sky-200 dark:border-white/10 backdrop-blur-md space-y-1 select-text shadow-xs dark:shadow-none">
                      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-sky-700 dark:text-sky-400">
                        <Camera size={12} />
                        <span>Clearance Upload Active</span>
                      </div>
                      <p className="text-[9.5px] text-slate-600 dark:text-slate-400 leading-snug">
                        Fast-track CTC processing: Upload Owner ID, Copy of Permit / OR & SPA.
                      </p>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[8.5px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-sky-500 dark:bg-sky-400"></span>Gov ID
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[8.5px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-sky-500 dark:bg-sky-400"></span>Permit / OR
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[8.5px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-sky-500 dark:bg-sky-400"></span>DTI / SEC
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[8.5px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-sky-500 dark:bg-sky-400"></span>SPA
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          resetBisForm();
                          setIsBisModalOpen(false);
                          setCurrentView('ctc_pulling');
                          navigate('/portal/business/info');
                        }}
                        className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 hover:scale-[1.005] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Request CTC Online</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* CARD 4: MAYOR'S PERMIT VERIFICATION - PURE BLUE THEME */}
              {/* ======================================================================= */}
              <div 
                className="relative overflow-hidden rounded-2xl glass-card p-4 group select-text flex flex-col justify-between w-full max-w-[430px] mx-auto"
              >

                <div className="flex flex-col justify-between gap-3.5 relative z-10 flex-1">
                  {/* Info & Details */}
                  <div className="space-y-2 min-w-0">
                    {/* Title */}
                    <div>
                      <h3 className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                        MAYOR'S PERMIT VERIFICATION
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
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">General public, partners & city inspectors</p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Briefcase size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">SERVICE METHOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Online verification via Permit No., Trade Name, or QR</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Clock size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">TIME PERIOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Instantaneous (Real-time live database validation)</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Banknote size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">CHARGES & PAYMENT</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Free Public Service - <span className="text-sky-700 dark:text-sky-400 font-bold">₱0.00 No Charge</span></p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <CreditCard size={11} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block leading-tight">PAYMENT METHOD</span>
                          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">Open Public Access (No payment required)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Document Upload & Action Section (Placed directly below payment method) */}
                  <div className="w-full flex flex-col space-y-2 pt-0.5">
                    {/* User-Friendly 3-Step Interactive Container */}
                    <div className="p-2.5 rounded-xl bg-white/90 dark:bg-white/[0.04] border border-sky-200 dark:border-white/10 backdrop-blur-md space-y-1 select-text shadow-xs dark:shadow-none">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-sky-700 dark:text-sky-400">
                          <Camera size={12} />
                          <span>3 Steps to Verify</span>
                        </div>
                      </div>

                      {/* 3 Step Pills */}
                      <div className="grid grid-cols-3 gap-1 text-center text-[8.5px]">
                        <div className="p-0.5 rounded bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-slate-700 dark:text-slate-200">
                          <span className="font-bold text-sky-700 dark:text-sky-400 block text-[9px]">1. Enter</span>
                          <span className="text-[8px] text-slate-600 dark:text-slate-400">Permit/QR</span>
                        </div>
                        <div className="p-0.5 rounded bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-slate-700 dark:text-slate-200">
                          <span className="font-bold text-sky-700 dark:text-sky-400 block text-[9px]">2. Check</span>
                          <span className="text-[8px] text-slate-600 dark:text-slate-400">Database</span>
                        </div>
                        <div className="p-0.5 rounded bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-slate-700 dark:text-slate-200">
                          <span className="font-bold text-sky-700 dark:text-sky-400 block text-[9px]">3. Result</span>
                          <span className="text-[8px] text-slate-600 dark:text-slate-400">Status</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-sky-100/60 dark:bg-sky-500/10 border border-sky-300 dark:border-sky-400/20 text-[8.5px] font-semibold text-sky-800 dark:text-sky-200 flex items-center gap-1">
                          <CheckCircle2 size={8.5} className="text-sky-600 dark:text-sky-400" /> Active Permit
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-sky-100/60 dark:bg-sky-500/10 border border-sky-300 dark:border-sky-400/20 text-[8.5px] font-semibold text-sky-800 dark:text-sky-200 flex items-center gap-1">
                          <CheckCircle2 size={8.5} className="text-sky-600 dark:text-sky-400" /> Sanitary
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-sky-100/60 dark:bg-sky-500/10 border border-sky-300 dark:border-sky-400/20 text-[8.5px] font-semibold text-sky-800 dark:text-sky-200 flex items-center gap-1">
                          <CheckCircle2 size={8.5} className="text-sky-600 dark:text-sky-400" /> Fire Safety
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          resetVerification();
                          setIsVerificationModalOpen(true);
                          setCurrentView('verification');
                          navigate('/portal/business/verify');
                        }}
                        className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 hover:scale-[1.005] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Search size={13} />
                        <span>Verify Permit Now (Free)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>





          </div>
        )}

        {/* ========================================================================= */}
        {/* INLINE SUB-PAGE: NEW BUSINESS PERMIT APPLICATION OVERVIEW (OPTION 1)      */}
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* INLINE SUB-PAGE: NEW BUSINESS PERMIT APPLICATION OVERVIEW                 */}
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* INLINE SUB-PAGE: BUSINESS PERMIT APPLICATION REQUIREMENTS (1-4 GUIDE)     */}
        {/* ========================================================================= */}
        {currentView === 'new_app_overview' && (
          <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 pb-12">
            {/* Top Navigation: Clean text links */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <button 
                type="button"
                onClick={() => {
                  setCurrentView('preview');
                  navigate('/portal/business');
                }}
                className="text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors cursor-pointer text-left"
              >
                &larr; Back to Business Permit Hub
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('select_type');
                    navigate('/portal/business/apply');
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  Change Application Type
                </button>
              </div>
            </div>

            {/* Header: Title and subtitle from screenshot */}
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Business Permit Application Requirements
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Mayor's Permits &amp; Business Licensing • Commercial &amp; Retail Checklist
              </p>
            </div>

            {/* Main Container Card (Inline Page Content - NOT a dialog) */}
            <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 sm:p-7 space-y-6">
              
              {/* Highlight Banner: Upload-First Zero-Typing Workflow */}
              <div className="p-4 rounded-xl bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200 space-y-1.5">
                <div className="flex items-center space-x-2 font-bold text-xs sm:text-[13px] text-blue-700 dark:text-sky-400">
                  <Sparkles size={16} />
                  <span>Upload-First Zero-Typing Workflow:</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  You do not need to manually type tedious application forms. Our AI extraction system extracts your business name, owner name, registration number, address, and line of business directly from your uploaded certificates.
                </p>
              </div>

              {/* The 4 Guide Cards (2x2 Grid) from screenshot */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Primary Business Registration */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    <FileText size={16} className="text-blue-600 dark:text-sky-400" />
                    <span>1. Primary Business Registration</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={14} className="text-blue-600 dark:text-sky-400 mt-0.5 shrink-0" />
                      <span><strong>DTI Certificate:</strong> For Sole Proprietorships</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={14} className="text-blue-600 dark:text-sky-400 mt-0.5 shrink-0" />
                      <span><strong>SEC Registration:</strong> Articles of Incorporation for Corp/Partnerships</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={14} className="text-blue-600 dark:text-sky-400 mt-0.5 shrink-0" />
                      <span><strong>CDA Certificate:</strong> For Cooperatives</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={14} className="text-blue-600 dark:text-sky-400 mt-0.5 shrink-0" />
                      <span><strong>HOA Authorization:</strong> For Home-based micro enterprises</span>
                    </li>
                  </ul>
                </div>

                {/* 2. Proof of Business Location */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    <MapPin size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <span>2. Proof of Business Location</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                      <span><strong>Contract of Lease:</strong> If renting premises (notarized)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                      <span><strong>Land Title / Tax Declaration:</strong> If property is owned</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                      <span><strong>Barangay Clearance:</strong> 24-Barangay Network integrated</span>
                    </li>
                  </ul>
                </div>

                {/* 3. Owner / Signatory Valid ID */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    <User size={16} className="text-indigo-600 dark:text-indigo-400" />
                    <span>3. Owner / Signatory Valid ID</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={14} className="text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                      <span>Philippine National ID (PhilID)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={14} className="text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                      <span>Philippine Passport / Driver's License</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={14} className="text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                      <span>UMID / SSS / PRC Identification Card</span>
                    </li>
                  </ul>
                </div>

                {/* 4. File Specifications & Security */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    <ShieldCheck size={16} className="text-amber-600 dark:text-amber-400" />
                    <span>4. File Specifications &amp; Security</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={14} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                      <span><strong>Accepted formats:</strong> PDF, JPG, JPEG, PNG</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={14} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                      <span><strong>Max file size:</strong> Up to 25MB per document</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={14} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                      <span>Clear scans or well-lit photos without glare</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* Action Footer: Single Button */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[11px] text-slate-400 text-center sm:text-left">
                  Quezon City BPLO Citizen's Charter Compliance
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setNewAppKey(prev => prev + 1);
                    setWizardStep(1);
                    setCurrentView('new_app');
                  }}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] whitespace-nowrap"
                >
                  Start Upload-First Application &rarr;
                </button>
              </div>

            </div>
          </div>
        )}

      {/* ========================================================================= */}
      {/* INLINE SUB-PAGE: BUSINESS PERMIT RENEWAL PREREQUISITES & VERIFICATION     */}
      {/* ========================================================================= */}
      {currentView === 'renewal_overview' && (
        <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-200 pb-12">
          {/* Top Navigation: Clean text links */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <button 
              type="button"
              onClick={() => {
                resetRenewalForm();
                setCurrentView('preview');
                navigate('/portal/business');
              }}
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors cursor-pointer text-left inline-flex items-center gap-1.5"
            >
              &larr; Back to Business Permit Hub
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  resetRenewalForm();
                  setCurrentView('select_type');
                  navigate('/portal/business/apply');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Change Application Type
              </button>
            </div>
          </div>

          {/* Header (Centered) */}
          <div className="space-y-1.5 text-center">
            <div className="flex items-center justify-center space-x-2.5">
              <Info size={24} className="text-[#1976d2] shrink-0" strokeWidth={2.2} />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Business Permit Renewal
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Access and review renewal prerequisites, verify existing business status, and process renewals as needed.
            </p>
          </div>

          {/* Single Unified Container: No left or right columns, No BPLO badge */}
          <div className="w-full bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Renewal Prerequisites / Checklist */}
            <div className="space-y-3">
              <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 font-semibold">
                <strong className="font-bold text-slate-900 dark:text-white">Renew</strong> my registration:
              </p>
              <div className="space-y-2 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <div className="flex items-start space-x-2">
                  <span className="shrink-0 font-medium">1.</span>
                  <span>Input your existing Mayor's Permit Number.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="shrink-0 font-medium">2.</span>
                  <span>Provide current year Official Receipt (O.R.) from City Treasury.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="shrink-0 font-medium">3.</span>
                  <span>Secure Barangay Business Clearance for your registered location.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="shrink-0 font-medium">4.</span>
                  <span>Click Next to pull records and proceed with renewal.</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-700/60" />

            {/* Steps to Verify & Renew + Input Form */}
            <div className="space-y-5">
              <div>
                <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 mb-1">
                  Steps to <strong className="font-bold text-slate-900 dark:text-white">Verify &amp; Renew</strong>:
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Enter your existing municipal credentials to pull your enterprise record.
                </p>
              </div>

              <div className="space-y-4">
                {/* Field 1: Mayor's Permit Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Mayor's Permit Number: <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={renewalPermitNo}
                      onChange={(e) => {
                        setRenewalPermitNo(e.target.value);
                        if (renewalError) setRenewalError(false);
                      }}
                      placeholder="e.g. BP-2025-004819"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#121c2e] text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  {renewalError && !renewalPermitNo.trim() && (
                    <p className="text-red-500 text-xs font-normal mt-1">
                      Required
                    </p>
                  )}
                </div>

                {/* Field 2: Official Receipt No. */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Official Receipt No.: <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={renewalOrNo}
                      onChange={(e) => {
                        setRenewalOrNo(e.target.value);
                        if (renewalError) setRenewalError(false);
                      }}
                      placeholder={`Input ${new Date().getFullYear()} Official Receipt`}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#121c2e] text-slate-900 dark:text-white text-xs sm:text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  {renewalError && !renewalOrNo.trim() && (
                    <p className="text-red-500 text-xs font-normal mt-1">
                      Required
                    </p>
                  )}
                </div>

                {/* Tax Exemption Link */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setShowExemptionModal(true)}
                    className="text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline font-medium cursor-pointer transition-colors"
                  >
                    Is your business qualified for any tax exemption program? Click here
                  </button>
                </div>
              </div>

              {/* Centered Next Button */}
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  disabled={!renewalPermitNo.trim() || !renewalOrNo.trim()}
                  onClick={() => {
                    if (!renewalPermitNo.trim() || !renewalOrNo.trim()) {
                      setRenewalError(true);
                      return;
                    }
                    setRenewalError(false);
                    const pNo = renewalPermitNo.trim();
                    const oNo = renewalOrNo.trim();
                    const bName = 'Apex Innovations Retail Hub';
                    const bOwner = 'Juan Dela Cruz';
                    const bAddr = 'Unit 402, 4th Floor, 123 Ayala Avenue, QC';
                    const bLine = 'Retail Sale of Electronics & Goods';
                    const bBin = 'BIN-QC-2025-008921';

                    setRenewalRecord({
                      permitNo: pNo,
                      orNo: oNo,
                      businessName: bName,
                      owner: bOwner,
                      address: bAddr,
                      previousGrossSales: '₱2,450,000.00',
                      validUntil: `December 31, ${new Date().getFullYear() - 1} (Expired)`,
                      status: `Eligible for ${new Date().getFullYear()} Renewal`
                    });
                    setOldPermitData({
                      businessName: bName,
                      owner: bOwner,
                      permitNo: pNo,
                      bin: bBin,
                      address: bAddr,
                      orNo: oNo,
                      lineOfBusiness: bLine
                    });
                    setNewPermitData({
                      businessName: bName,
                      owner: bOwner,
                      permitNo: 'BP-2026-004819',
                      bin: 'BIN-QC-2026-008921',
                      address: bAddr,
                      orNo: 'OR-2026-88191',
                      lineOfBusiness: bLine
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setCurrentView('renewal');
                  }}
                  className="px-8 py-3 bg-[#1976d2] hover:bg-[#1565c0] disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INLINE SUB-PAGE: BUSINESS PERMIT AMENDMENT PREREQUISITES & VERIFICATION    */}
      {/* ========================================================================= */}
      {currentView === 'amendment_overview' && (
        <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-200 pb-12">
          {/* Top Navigation: Clean text links */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <button 
              type="button"
              onClick={() => {
                resetAmendForm();
                setCurrentView('preview');
                navigate('/portal/business');
              }}
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors cursor-pointer text-left inline-flex items-center gap-1.5"
            >
              &larr; Back to Business Permit Hub
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  resetAmendForm();
                  setCurrentView('select_type');
                  navigate('/portal/business/apply');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Change Application Type
              </button>
            </div>
          </div>

          {/* Header (Option A: Centered) */}
          <div className="space-y-1.5 text-center">
            <div className="flex items-center justify-center space-x-2.5">
              <Info size={24} className="text-[#1976d2] shrink-0" strokeWidth={2.2} />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Business Permit Amendment
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Review prerequisites, verify existing business credentials, and submit municipal amendments.
            </p>
          </div>

          {/* Single Unified Container */}
          <div className="w-full bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-4">
              <p className="text-center text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto">
                Review amendment prerequisites before filing requested changes (Trade Name, Address, Line of Business, Ownership).
              </p>

              <div>
                <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 mb-3 font-semibold">
                  <strong className="font-bold text-slate-900 dark:text-white">Requirements</strong> for amendment:
                </p>
                <div className="space-y-2 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  <div className="flex items-start space-x-2">
                    <span className="shrink-0 font-medium">1.</span>
                    <span>Amended DTI / SEC / CDA Registration Certificate.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="shrink-0 font-medium">2.</span>
                    <span>Updated Barangay Clearance reflecting amended details.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="shrink-0 font-medium">3.</span>
                    <span>Valid Government ID of owner or authorized representative.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="shrink-0 font-medium">4.</span>
                    <span>Current Year Mayor's Permit and Treasury clearance.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider Line */}
            <div className="border-t border-slate-100 dark:border-slate-700/60 pt-6 space-y-5">
              <div>
                <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 mb-1">
                  Steps to <strong className="font-bold text-slate-900 dark:text-white">Verify &amp; Amend</strong>:
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Enter your existing municipal credentials to pull your enterprise record.
                </p>
              </div>

              <div className="space-y-4">
                {/* Field 1: Mayor's Permit Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Mayor's Permit Number: <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={amendPermitNo}
                      onChange={(e) => {
                        setAmendPermitNo(e.target.value);
                        if (amendError) setAmendError(false);
                      }}
                      placeholder="e.g. BP-2025-004819"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#121c2e] text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  {amendError && !amendPermitNo.trim() && (
                    <p className="text-red-500 text-xs font-normal mt-1">
                      Required
                    </p>
                  )}
                </div>

                {/* Field 2: Official Receipt No. */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Official Receipt No.: <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={amendOrNo}
                      onChange={(e) => {
                        setAmendOrNo(e.target.value);
                        if (amendError) setAmendError(false);
                      }}
                      placeholder={`Input ${new Date().getFullYear()} Official Receipt`}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#121c2e] text-slate-900 dark:text-white text-xs sm:text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  {amendError && !amendOrNo.trim() && (
                    <p className="text-red-500 text-xs font-normal mt-1">
                      Required
                    </p>
                  )}
                </div>

                {/* Tax Exemption Link */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setShowExemptionModal(true)}
                    className="text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline font-medium cursor-pointer transition-colors"
                  >
                    Is your business qualified for any tax exemption program? Click here
                  </button>
                </div>
              </div>

              {/* Centered Next Button */}
              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  disabled={!amendPermitNo.trim() || !amendOrNo.trim()}
                  onClick={() => {
                    if (!amendPermitNo.trim() || !amendOrNo.trim()) {
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
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setCurrentView('amendment');
                  }}
                  className="px-8 py-3 bg-[#1976d2] hover:bg-[#1565c0] disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INLINE SUB-PAGE: SPECIAL PERMIT APPLICATION PREREQUISITES & OVERVIEW      */}
      {/* ========================================================================= */}
      {currentView === 'special_permit_overview' && (
        <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-200 pb-12">
          {/* Top Navigation: Clean text links */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <button 
              type="button"
              onClick={() => {
                resetSpecialPermitForm();
                setCurrentView('preview');
                navigate('/portal/business');
              }}
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors cursor-pointer text-left inline-flex items-center gap-1.5"
            >
              &larr; Back to Business Permit Hub
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  resetSpecialPermitForm();
                  setCurrentView('select_type');
                  navigate('/portal/business/apply');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Change Application Type
              </button>
            </div>
          </div>

          {/* Header (Option A: Centered) */}
          <div className="space-y-1.5 text-center">
            <div className="flex items-center justify-center space-x-2.5">
              <Info size={24} className="text-[#1976d2] shrink-0" strokeWidth={2.2} />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Special Permit Application
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Access guidelines, verify venue clearances, and file temporary municipal activity registrations.
            </p>
          </div>

          {/* Single Unified Container */}
          <div className="w-full bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-4">
              <p className="text-center text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto">
                A special permit is required for short-duration business activities, promotional events, and seasonal commercial operations.
              </p>

              <div>
                <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 mb-3 font-semibold">
                  <strong className="font-bold text-slate-900 dark:text-white">Covered</strong> activities &amp; events:
                </p>
                <div className="space-y-2 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  <div className="flex items-start space-x-2">
                    <span className="shrink-0 font-medium">1.</span>
                    <span>Promotional Events &amp; Mall Product Exhibitions.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="shrink-0 font-medium">2.</span>
                    <span>Sporting Events, Tournaments, &amp; Outdoor Marathons.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="shrink-0 font-medium">3.</span>
                    <span>TV and Film Productions / Commercial Shoots.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="shrink-0 font-medium">4.</span>
                    <span>Concerts, Stage Shows, &amp; Seasonal Carnivals/Bazaars.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider Line */}
            <div className="border-t border-slate-100 dark:border-slate-700/60 pt-6 space-y-5">
              <div>
                <p className="text-center text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto mb-3">
                  Register your special permit request with venue clearances and promoter credentials.
                </p>

                <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 mb-3 font-semibold">
                  Steps to <strong className="font-bold text-slate-900 dark:text-white">File</strong>:
                </p>
                <div className="space-y-2 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  <div className="flex items-start space-x-2">
                    <span className="shrink-0 font-medium">1.</span>
                    <span>Secure Venue Contract of Lease from venue owner/manager.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="shrink-0 font-medium">2.</span>
                    <span>Attach Special Working Permit (SWP) for foreign artists/staff.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="shrink-0 font-medium">3.</span>
                    <span>Upload Promoter/Organizer Mayor's Permit or DTI/SEC registration.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="shrink-0 font-medium">4.</span>
                    <span>Complete filing form and submit for BPLO issuance.</span>
                  </div>
                </div>
              </div>

              {/* Centered New Registration Button */}
              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setCurrentView('special_permit');
                  }}
                  className="px-8 py-3 bg-[#1976d2] hover:bg-[#1565c0] text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>New Registration</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 0: SELECT APPLICATION TYPE MODAL (FLOATING MODAL WITH X BUTTON)  */}
      {/* ========================================================================= */}
      {currentView === 'select_type' && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200 cursor-pointer"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setCurrentView('preview');
            }
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#0f172a] w-full max-w-[480px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 my-auto flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-900/90 flex items-start justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 shadow-2xs">
                  <Building2 size={16} />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                    Business Permits &amp; Licensing Portal
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Review official business regulatory fee schedules, municipal tax tariffs, and documentary prerequisites before filing your enterprise application.
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setCurrentView('preview');
                  navigate('/portal/business');
                }} 
                className="text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 -mr-1 -mt-0.5"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-3.5">
              {/* Heading */}
              <div className="text-center pb-0.5">
                <h2 className="text-sm sm:text-base font-black text-[#0e5c7a] dark:text-sky-400 uppercase tracking-wider">
                  TYPE OF APPLICATION
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  (Please choose one)
                </p>
              </div>

              {/* 4 Cards */}
              <div className="space-y-2.5">
                {/* 1. NEW */}
                <div
                  onClick={() => {
                    setCurrentView('new_app_overview');
                    navigate('/portal/business/apply');
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 hover:bg-sky-50/70 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex items-center justify-between"
                >
                  <span className="text-[#0e5c7a] dark:text-sky-400 font-bold text-xs sm:text-sm tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                    NEW
                  </span>
                  <ChevronRight size={15} className="text-slate-400 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all" />
                </div>

                {/* 2. RENEWAL */}
                <div
                  onClick={() => {
                    setCurrentView('renewal_overview');
                    setRenewalError(false);
                    setRenewalPermitNo('');
                    setRenewalOrNo('');
                    setShowRenewalModal(false);
                    navigate('/portal/business/renew');
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 hover:bg-sky-50/70 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex items-center justify-between"
                >
                  <span className="text-[#0e5c7a] dark:text-sky-400 font-bold text-xs sm:text-sm tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                    RENEWAL
                  </span>
                  <ChevronRight size={15} className="text-slate-400 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all" />
                </div>

                {/* 3. AMENDMENT */}
                <div
                  onClick={() => {
                    setCurrentView('amendment_overview');
                    setAmendError(false);
                    setShowAmendModal(false);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 hover:bg-sky-50/70 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex items-center justify-between"
                >
                  <span className="text-[#0e5c7a] dark:text-sky-400 font-bold text-xs sm:text-sm tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                    AMENDMENT
                  </span>
                  <ChevronRight size={15} className="text-slate-400 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all" />
                </div>

                {/* 4. SPECIAL PERMIT */}
                <div
                  onClick={() => {
                    setCurrentView('special_permit_overview');
                    setShowSpecialPermitModal(false);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 hover:bg-sky-50/70 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex items-center justify-between"
                >
                  <span className="text-[#0e5c7a] dark:text-[#00c0f9] font-bold text-xs sm:text-sm tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                    SPECIAL PERMIT
                  </span>
                  <ChevronRight size={15} className="text-slate-400 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INLINE SUB-PAGE: QUEZON CITY BOSS WORKFLOW WIZARD (7-STEP APPLICATION)    */}
      {/* ========================================================================= */}
      {currentView === 'new_app' && (
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 pb-12">
          {/* Top Navigation: Breadcrumb and Back Links */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <button 
              type="button"
              onClick={() => {
                setNewAppKey(prev => prev + 1);
                setCurrentView('new_app_overview');
              }}
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors cursor-pointer text-left inline-flex items-center gap-1.5"
            >
              &larr; Back to Requirements Overview
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setNewAppKey(prev => prev + 1);
                  setCurrentView('preview');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Back to Permit Hub
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewAppKey(prev => prev + 1);
                  setCurrentView('select_type');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Change Application Type
              </button>
            </div>
          </div>

          {/* Header Matching Picture 1 */}
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              Application for New Business Permit
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Quezon City E-Services Citizen's Charter Compliant • Direct Clearance &amp; Document Upload System
            </p>
          </div>

          {/* Main Container Card (Inline Page Content - NOT a dialog) */}
          <div className="bg-white dark:bg-[#050A14] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm p-4 sm:p-7">
            <BusinessPermitUploadWizard
              key={newAppKey}
              onBack={() => {
                setNewAppKey(prev => prev + 1);
                setCurrentView('new_app_overview');
              }}
              onAddNewApplication={onAddNewApplication}
              onNavigateToDashboard={onNavigateToDashboard}
              onNavigateToTab={onNavigateToTab}
              initialAppType="NEW"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: RENEWAL */}
      {/* ========================================================================= */}
      {currentView === 'renewal' && (() => {
        const cleaned = (renewalGrossSales || '').replace(/[^0-9.]/g, '');
        const grossNum = parseFloat(cleaned) || 2850000;
        const lbtTax = grossNum * 0.015;
        const promptDiscount = renewalPaymentPlan === 'annual' ? lbtTax * 0.10 : 0;
        const netLbtTax = lbtTax - promptDiscount;
        const mayorPermitFee = 4500;
        const sanitaryFee = 1200;
        const garbageFee = 2500;
        const fsicFee = 3500;
        const signboardFee = 850;
        const docStamp = 200;
        const regulatoryTotal = mayorPermitFee + sanitaryFee + garbageFee + fsicFee + signboardFee + docStamp;
        const grandTotal = netLbtTax + regulatoryTotal;
        const quarterlyFirstPayment = grandTotal / 4;

        return (
          <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 pb-12">
            {/* Top Navigation: Breadcrumb and Back Links */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <button 
                type="button"
                onClick={() => {
                  setCurrentView('renewal_overview');
                }}
                className="text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors cursor-pointer text-left inline-flex items-center gap-1.5"
              >
                &larr; Back to Verification Step
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetRenewalForm();
                    setCurrentView('preview');
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  Back to Permit Hub
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetRenewalForm();
                    setCurrentView('select_type');
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  Change Application Type
                </button>
              </div>
            </div>

            {/* Header */}
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                Application for Business Permit Renewal
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Quezon City E-Services Citizen's Charter Compliant • Renewal &amp; Verification System
              </p>
            </div>

            {renewalSubmitted ? (
              /* DEDICATED STANDALONE PAGE FOR OFFICIAL ELECTRONIC TAX ORDER OF PAYMENT (e-TOP) */
              <div className="w-full max-w-5xl animate-in zoom-in-95 mx-auto">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-500/60 p-6 sm:p-8 shadow-2xl space-y-6">
                  {/* Header with Seal & Tracking */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-emerald-100 dark:border-emerald-900/60">
                    <div className="flex items-center gap-3.5 text-center sm:text-left">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-amber-400 shrink-0">
                        QC
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                          Republic of the Philippines • City Government of Quezon City
                        </span>
                        <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                          Official Electronic Tax Order of Payment (e-TOP)
                        </h3>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          Business Permits &amp; Licensing Department (BPLD) • CY 2026 Assessment
                        </span>
                      </div>
                    </div>

                    <div className="text-center sm:text-right shrink-0">
                      <div className="w-20 h-20 mx-auto sm:ml-auto p-1.5 bg-white rounded-xl border border-slate-300 shadow-xs flex flex-col items-center justify-center">
                        <QrCode size={56} className="text-slate-900" />
                        <span className="text-[7.5px] font-mono font-bold text-slate-600 uppercase">QC e-Pay</span>
                      </div>
                    </div>
                  </div>

                  {/* Assessment Reference & Due Date Bar */}
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase block">Assessment Bill Reference</span>
                      <span className="font-mono font-black text-sm text-emerald-950 dark:text-emerald-200">{renewalTrackingNo}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase block">Assessment Status</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-300">✓ Assessed &amp; Ready for Payment</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase block">Payment Due Date</span>
                      <span className="font-bold text-amber-700 dark:text-amber-300">January 20, 2026 (Prompt Window)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Net Amount Due</span>
                      <span className="font-mono font-black text-base text-emerald-700 dark:text-emerald-300">
                        ₱{(renewalPaymentPlan === 'annual' ? grandTotal : quarterlyFirstPayment).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Business Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Registered Business</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">{oldPermitData.businessName || renewalRecord?.businessName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Permit Reference Number</span>
                      <span className="font-mono font-bold text-blue-600 dark:text-sky-400">{oldPermitData.permitNo || renewalRecord?.permitNo || 'BP-2025-00123'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Taxpayer / Signatory</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{oldPermitData.owner || renewalRecord?.owner}</span>
                    </div>
                  </div>

                  {/* Payment Channels */}
                  <div className="space-y-2">
                    <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block">Accepted Quezon City Official Payment Options:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-blue-600 dark:text-sky-400 block">1. GCash / Maya (e-Wallet)</span>
                        <p className="text-[10.5px] text-slate-500 leading-tight">Instant confirmation with electronic Official Receipt (e-OR).</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 block">2. Landbank Link.Biz Portal</span>
                        <p className="text-[10.5px] text-slate-500 leading-tight">Select Quezon City BPLO • Input Bill Ref: {renewalTrackingNo}.</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-purple-600 dark:text-purple-400 block">3. City Hall Treasury Counter</span>
                        <p className="text-[10.5px] text-slate-500 leading-tight">Cash, Manager's Check, or POS Debit at QC Hall of Justice.</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => alert(`Downloading Official Tax Order of Payment (TOP) ${renewalTrackingNo}...`)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors text-xs"
                    >
                      <Download size={14} />
                      <span>Download Official TOP (PDF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-xs"
                    >
                      <Printer size={14} />
                      <span>Print Assessment Bill</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRenewalSubmitted(false);
                        setRenewalRecord(null);
                        setCurrentView('select_type');
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold cursor-pointer transition-colors text-xs"
                    >
                      Return to Portal
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto">
                    {/* ======================================================================= */}
                    {/* ENHANCED BPLO ANNUAL RENEWAL PORTAL                                     */}
                    {/* ======================================================================= */}
                    <div className="space-y-5 text-xs text-left animate-in fade-in duration-200">
                  {/* COMBINED BOX: OLD BUSINESS PERMIT RECORD & MANDATORY DOCUMENTS */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
                    {/* SECTION 1: OLD BUSINESS PERMIT RECORD */}
                    <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                          <Building2 size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                              Old Business Permit Record
                            </h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                              Previous Permit
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Recorded details from previous Mayor's Business Permit masterfile database
                          </p>
                        </div>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Business Name</span>
                        <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate" title={oldPermitData.businessName || renewalRecord?.businessName}>
                          {oldPermitData.businessName || renewalRecord?.businessName}
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Owner / Taxpayer</span>
                        <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate" title={oldPermitData.owner || renewalRecord?.owner}>
                          {oldPermitData.owner || renewalRecord?.owner}
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mayor's Permit Ref No.</span>
                        <p className="font-mono font-black text-xs text-blue-600 dark:text-sky-400 truncate">
                          {oldPermitData.permitNo || renewalRecord?.permitNo || 'BP-2025-00123'}
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Business ID Number (BIN)</span>
                        <p className="font-mono font-black text-xs text-slate-800 dark:text-slate-200 truncate">
                          {oldPermitData.bin || 'BIN-QC-2025-008921'}
                        </p>
                      </div>

                      <div className="sm:col-span-2 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Location / Address</span>
                        <p className="font-medium text-xs text-slate-800 dark:text-slate-200 truncate" title={oldPermitData.address || renewalRecord?.address}>
                          {oldPermitData.address || renewalRecord?.address}
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Prior Official Receipt (O.R.)</span>
                        <p className="font-mono font-bold text-xs text-purple-700 dark:text-purple-300 truncate">
                          {oldPermitData.orNo || renewalRecord?.orNo || 'OR-2025-88191'}
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Line of Business (PSIC 4741)</span>
                        <p className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                          {oldPermitData.lineOfBusiness || 'Retail Sale of Electronics & Goods'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="text-[11px] text-slate-400 italic">
                        * If you need to update your registered address or commercial activity, please file a Business Amendment.
                      </span>
                    </div>
                  </div>

                  {/* SUBTLE SECTION DIVIDER */}
                  <div className="border-t border-slate-200/80 dark:border-slate-800" />

                  {/* SECTION 2: MANDATORY DOCUMENT ATTACHMENTS & SWORN STATEMENT */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                          <FileCheck size={18} />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                            Mandatory Document Attachments &amp; Sworn Statement
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Verified records synchronized from your secure Quezon City Citizen Cloud Vault
                          </p>
                        </div>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      {/* Document 1: BIR ITR */}
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                        <input
                          type="file"
                          id="renewal-upload-gross"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            handleRenewalFileUpload('gross_statement', e.target.files?.[0] || null);
                            e.target.value = '';
                          }}
                          className="hidden"
                        />
                        <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200 block truncate">
                          1. BIR ITR / Certified Gross Receipts
                        </span>

                        {renewalDocs.gross_statement ? (
                          <div className="relative bg-slate-900 dark:bg-slate-950 rounded-2xl p-2.5 border border-slate-700/80 shadow-md flex flex-col items-center animate-in fade-in zoom-in-95 duration-150">
                            {/* Floating X Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRenewalDocs((p) => ({ ...p, gross_statement: null }));
                              }}
                              className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-slate-700 hover:bg-slate-600 active:scale-95 text-white flex items-center justify-center shadow-lg border border-slate-600/80 z-20 transition-transform cursor-pointer"
                              title="Remove Photo"
                            >
                              <X size={13} />
                            </button>

                            {/* Clickable Image Preview */}
                            <div
                              onClick={() => setRenewalPreviewImage({
                                url: renewalDocs.gross_statement!.previewUrl || '/New Application.jpg',
                                title: '1. BIR ITR / Certified Gross Receipts'
                              })}
                              className="w-full h-32 rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 flex items-center justify-center cursor-pointer group/img relative shadow-2xs"
                              title="Click photo to view full size"
                            >
                              <img
                                src={renewalDocs.gross_statement.previewUrl || '/New Application.jpg'}
                                alt={renewalDocs.gross_statement.name}
                                className="w-full h-full object-contain p-1 group-hover/img:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Eye size={20} className="drop-shadow-md" />
                              </div>
                            </div>

                            {/* File Info Matching Screenshot */}
                            <p className="font-extrabold text-[11px] text-white dark:text-slate-100 tracking-wide truncate max-w-full text-center mt-2 uppercase" title={renewalDocs.gross_statement.name}>
                              {renewalDocs.gross_statement.name}
                            </p>
                            <p className="text-[10px] text-sky-400 font-bold text-center mt-0.5">
                              {renewalDocs.gross_statement.size}
                            </p>
                          </div>
                        ) : (
                          <label
                            htmlFor="renewal-upload-gross"
                            className="p-3 bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-sky-500 flex flex-col items-center justify-center text-center gap-1 cursor-pointer transition-colors"
                          >
                            <UploadCloud size={20} className="text-slate-400 shrink-0" />
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Click to upload picture</span>
                            <span className="text-[9px] text-slate-400">JPG, PNG, PDF up to 10MB</span>
                          </label>
                        )}

                      </div>

                      {/* Document 2: Barangay Clearance */}
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                        <input
                          type="file"
                          id="renewal-upload-brgy"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            handleRenewalFileUpload('brgy_clearance', e.target.files?.[0] || null);
                            e.target.value = '';
                          }}
                          className="hidden"
                        />
                        <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200 block truncate">
                          2. Barangay Business Clearance (CY 2026)
                        </span>

                        {renewalDocs.brgy_clearance ? (
                          <div className="relative bg-slate-900 dark:bg-slate-950 rounded-2xl p-2.5 border border-slate-700/80 shadow-md flex flex-col items-center animate-in fade-in zoom-in-95 duration-150">
                            {/* Floating X Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRenewalDocs((p) => ({ ...p, brgy_clearance: null }));
                              }}
                              className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-slate-700 hover:bg-slate-600 active:scale-95 text-white flex items-center justify-center shadow-lg border border-slate-600/80 z-20 transition-transform cursor-pointer"
                              title="Remove Photo"
                            >
                              <X size={13} />
                            </button>

                            {/* Clickable Image Preview */}
                            <div
                              onClick={() => setRenewalPreviewImage({
                                url: renewalDocs.brgy_clearance!.previewUrl || '/Renewal.jpg',
                                title: '2. Barangay Business Clearance (CY 2026)'
                              })}
                              className="w-full h-32 rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 flex items-center justify-center cursor-pointer group/img relative shadow-2xs"
                              title="Click photo to view full size"
                            >
                              <img
                                src={renewalDocs.brgy_clearance.previewUrl || '/Renewal.jpg'}
                                alt={renewalDocs.brgy_clearance.name}
                                className="w-full h-full object-contain p-1 group-hover/img:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Eye size={20} className="drop-shadow-md" />
                              </div>
                            </div>

                            {/* File Info Matching Screenshot */}
                            <p className="font-extrabold text-[11px] text-white dark:text-slate-100 tracking-wide truncate max-w-full text-center mt-2 uppercase" title={renewalDocs.brgy_clearance.name}>
                              {renewalDocs.brgy_clearance.name}
                            </p>
                            <p className="text-[10px] text-sky-400 font-bold text-center mt-0.5">
                              {renewalDocs.brgy_clearance.size}
                            </p>
                          </div>
                        ) : (
                          <label
                            htmlFor="renewal-upload-brgy"
                            className="p-3 bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-sky-500 flex flex-col items-center justify-center text-center gap-1 cursor-pointer transition-colors"
                          >
                            <UploadCloud size={20} className="text-slate-400 shrink-0" />
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Click to upload picture</span>
                            <span className="text-[9px] text-slate-400">JPG, PNG, PDF up to 10MB</span>
                          </label>
                        )}

                      </div>

                      {/* Document 3: Prior Mayor's Permit */}
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                        <input
                          type="file"
                          id="renewal-upload-prior"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            handleRenewalFileUpload('prior_permit', e.target.files?.[0] || null);
                            e.target.value = '';
                          }}
                          className="hidden"
                        />
                        <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200 block truncate">
                          3. Prior Year Mayor's Permit (CY 2025)
                        </span>

                        {renewalDocs.prior_permit ? (
                          <div className="relative bg-slate-900 dark:bg-slate-950 rounded-2xl p-2.5 border border-slate-700/80 shadow-md flex flex-col items-center animate-in fade-in zoom-in-95 duration-150">
                            {/* Floating X Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRenewalDocs((p) => ({ ...p, prior_permit: null }));
                              }}
                              className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-slate-700 hover:bg-slate-600 active:scale-95 text-white flex items-center justify-center shadow-lg border border-slate-600/80 z-20 transition-transform cursor-pointer"
                              title="Remove Photo"
                            >
                              <X size={13} />
                            </button>

                            {/* Clickable Image Preview */}
                            <div
                              onClick={() => setRenewalPreviewImage({
                                url: renewalDocs.prior_permit!.previewUrl || '/Special Permit.jpg',
                                title: "3. Prior Year Mayor's Permit (CY 2025)"
                              })}
                              className="w-full h-32 rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 flex items-center justify-center cursor-pointer group/img relative shadow-2xs"
                              title="Click photo to view full size"
                            >
                              <img
                                src={renewalDocs.prior_permit.previewUrl || '/Special Permit.jpg'}
                                alt={renewalDocs.prior_permit.name}
                                className="w-full h-full object-contain p-1 group-hover/img:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Eye size={20} className="drop-shadow-md" />
                              </div>
                            </div>

                            {/* File Info Matching Screenshot */}
                            <p className="font-extrabold text-[11px] text-white dark:text-slate-100 tracking-wide truncate max-w-full text-center mt-2 uppercase" title={renewalDocs.prior_permit.name}>
                              {renewalDocs.prior_permit.name}
                            </p>
                            <p className="text-[10px] text-sky-400 font-bold text-center mt-0.5">
                              {renewalDocs.prior_permit.size}
                            </p>
                          </div>
                        ) : (
                          <label
                            htmlFor="renewal-upload-prior"
                            className="p-3 bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-sky-500 flex flex-col items-center justify-center text-center gap-1 cursor-pointer transition-colors"
                          >
                            <UploadCloud size={20} className="text-slate-400 shrink-0" />
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Click to upload picture</span>
                            <span className="text-[9px] text-slate-400">JPG, PNG, PDF up to 10MB</span>
                          </label>
                        )}

                      </div>
                    </div>

                    <label className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={renewalAgreed}
                        onChange={(e) => setRenewalAgreed(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 mt-0.5 shrink-0"
                      />
                      <span className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                        I hereby certify under penalties of perjury that the foregoing gross sales declaration and documentary attachments are true, correct, and complete representations of the financial receipts of <strong>{renewalRecord.businessName}</strong>, pursuant to the Quezon City Revenue Code (SP-2958) and National Internal Revenue Code.
                      </span>
                    </label>

                    {/* SUBMISSION AREA INSIDE UNIFIED BOX */}
                    <div className="pt-2 flex items-center justify-center">
                      <button
                        type="button"
                        disabled={!renewalAgreed || !renewalDocs.gross_statement || !renewalDocs.brgy_clearance || !renewalDocs.prior_permit}
                        onClick={() => {
                          if (!renewalAgreed || !renewalDocs.gross_statement || !renewalDocs.brgy_clearance || !renewalDocs.prior_permit) {
                            return;
                          }
                          setRenewalSubmitted(true);
                          setRenewalStep(4);
                          if (onAddNewApplication && renewalRecord) {
                            onAddNewApplication(oldPermitData.businessName || renewalRecord.businessName, 'Business Permit (Renewal)');
                          }
                        }}
                        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-95 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-blue-700/25 transition-all cursor-pointer flex items-center justify-center"
                      >
                        <span>Submit Renewal Application</span>
                      </button>
                    </div>
                  </div>
                </div>

                  {/* Uploaded Picture Full Preview Modal */}
                  {renewalPreviewImage && (
                    <div
                      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
                      onClick={() => setRenewalPreviewImage(null)}
                    >
                      <div
                        className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-4 sm:p-5 space-y-3.5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                          <span className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-white truncate">
                            {renewalPreviewImage.title}
                          </span>
                          <button
                            type="button"
                            onClick={() => setRenewalPreviewImage(null)}
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden p-2 max-h-[70vh]">
                          <img
                            src={renewalPreviewImage.url}
                            alt="Uploaded attachment preview"
                            className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl shadow-xs"
                          />
                        </div>
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => setRenewalPreviewImage(null)}
                            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Close Preview
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
  })()}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: AMENDMENT */}
      {/* ========================================================================= */}
      {currentView === 'amendment' && (() => {
        const activeAmendRecord = amendRecord || {
          permitNo: amendPermitNo.trim() || 'BP-2025-004819',
          orNo: amendOrNo.trim() || `OR-QC-${new Date().getFullYear()}-008219`,
          businessName: 'Apex Innovations Retail Hub',
          owner: 'Juan Dela Cruz',
          address: 'Unit 402, 4th Floor, 123 Quezon Avenue, Barangay San Antonio, Quezon City',
          tin: '284-918-301-000',
          lineOfBusiness: 'Retail Sale of Consumer Electronics & General Merchandise',
          psicCode: '4741',
          validUntil: `December 31, ${new Date().getFullYear()}`,
          status: `Active / Paid ${new Date().getFullYear()} Annual Business Tax`
        };

        return (
          <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 pb-12">
            {/* Top Navigation: Breadcrumb and Back Links */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <button 
                type="button"
                onClick={() => {
                  resetAmendForm();
                  setCurrentView('amendment_overview');
                }}
                className="text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors cursor-pointer text-left inline-flex items-center gap-1.5"
              >
                &larr; Back to Amendment Guidelines
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetAmendForm();
                    setCurrentView('preview');
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  Back to Permit Hub
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetAmendForm();
                    setCurrentView('select_type');
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  Change Application Type
                </button>
              </div>
            </div>

            {/* Header */}
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                Application for Business Permit Amendment
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Quezon City E-Services Citizen's Charter Compliant • Municipal Amendment Registry
              </p>
            </div>

            {amendSubmitted ? (
              /* DEDICATED STANDALONE PAGE FOR AMENDMENT SUBMISSION (MATCHING PICTURE 2) */
              <div className="w-full max-w-4xl mx-auto animate-in zoom-in-95 cursor-default">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
                  {/* Sworn Undertaking Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start space-x-3 cursor-default">
                      <input
                        type="checkbox"
                        checked={true}
                        readOnly
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 pointer-events-none"
                      />
                      <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        I, <strong>{activeAmendRecord.owner}</strong>, hereby declare under oath and under penalty of perjury that all declarations and supporting documents submitted herein for Quezon City Mayor's Permit Amendment are true and correct pursuant to Republic Act No. 8792 (Electronic Commerce Act) and Quezon City Citizen's Charter standards.
                      </span>
                    </label>
                  </div>

                  {/* Submission State Card */}
                  <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 rounded-2xl text-emerald-900 dark:text-emerald-200 space-y-3">
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
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="space-y-6">
              

              {/* 1. Retrieved QC Registered Business Profile */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Building2 size={18} className="text-blue-600" />
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      Registered Business Profile (QC LGU Registry)
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Business / Trade Name</span>
                    <strong className="text-slate-900 dark:text-white text-sm">{activeAmendRecord.businessName}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Mayor's Permit Reference</span>
                    <strong className="text-blue-600 dark:text-sky-400 font-mono text-sm">{activeAmendRecord.permitNo}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">2026 Official Receipt No.</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{activeAmendRecord.orNo}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 sm:col-span-2">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Physical Registered Address</span>
                    <p className="text-slate-800 dark:text-slate-200 font-semibold">{activeAmendRecord.address}</p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Proprietor / Representative</span>
                    <p className="text-slate-800 dark:text-slate-200 font-bold">{activeAmendRecord.owner}</p>
                  </div>
                </div>
              </div>

              {/* 2. Select Type of Amendment (QC BPLO Dropdown Selection) */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center space-x-2">
                    <Edit3 size={18} className="text-blue-600" />
                    <span>Select Amendment Classification (QC BPLO)</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Select the specific legal modification you are requesting for your Quezon City Business License.
                  </p>
                </div>

                <div className="space-y-2 max-w-2xl">
                  <label className="block text-slate-800 dark:text-slate-200 font-bold text-xs">
                    Classification / Amendment Type *
                  </label>

                  {/* Dropdown Container */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setAmendDropdownOpen(!amendDropdownOpen)}
                      className={`w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/90 border transition-all flex items-center justify-between text-left text-xs sm:text-sm font-bold shadow-xs cursor-pointer ${
                        amendDropdownOpen
                          ? 'rounded-t-2xl border-blue-500 dark:border-sky-500 bg-white dark:bg-slate-800 border-b-slate-200 dark:border-b-slate-750 text-slate-900 dark:text-white'
                          : 'rounded-2xl border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-sky-500 text-slate-900 dark:text-white'
                      }`}
                    >
                      <span className={`truncate ${!amendmentType ? 'text-slate-400 dark:text-slate-500 font-normal' : ''}`}>
                        {!amendmentType && 'Select Amendment Type...'}
                        {amendmentType === 'trade_name' && 'Change of Business / Trade Name'}
                        {amendmentType === 'address' && 'Change of Address / Relocation'}
                        {amendmentType === 'line_of_business' && 'Change / Additional Line of Business'}
                        {amendmentType === 'ownership' && 'Change of Ownership / Corporate Structure'}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                          amendDropdownOpen ? 'rotate-180 text-blue-600 dark:text-sky-400' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu Options (Seamlessly attached) */}
                    {amendDropdownOpen && (
                      <div className="w-full bg-white dark:bg-slate-850 border border-t-0 border-blue-500 dark:border-sky-500 rounded-b-2xl shadow-xl overflow-hidden z-20 divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in duration-150">
                        {/* Option 0: Unselected / Placeholder option */}
                        <button
                          type="button"
                          onClick={() => {
                            setAmendmentType('');
                            setAmendDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left flex items-start space-x-3 transition-colors cursor-pointer ${
                            !amendmentType
                              ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0 w-4 flex justify-center text-blue-600 dark:text-sky-400 font-black">
                            {!amendmentType ? <Check size={16} /> : <span className="opacity-0">•</span>}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs sm:text-sm font-semibold">
                              -- Choose Amendment Type --
                            </div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-normal leading-relaxed">
                              Please select a legal amendment category below
                            </div>
                          </div>
                        </button>

                        {[
                          {
                            id: 'trade_name' as const,
                            label: 'Change of Business / Trade Name',
                            desc: 'Modification of registered corporate name or commercial trade moniker with DTI, SEC, or CDA.'
                          },
                          {
                            id: 'address' as const,
                            label: 'Change of Address / Relocation',
                            desc: 'Transfer of commercial premises within the territorial boundaries of Quezon City.'
                          },
                          {
                            id: 'line_of_business' as const,
                            label: 'Change / Additional Line of Business',
                            desc: 'Addition, reduction, or modification of PSIC commercial activities and operations.'
                          },
                          {
                            id: 'ownership' as const,
                            label: 'Change of Ownership / Corporate Structure',
                            desc: 'Transfer of proprietorship, assignment of corporate shares, or new general partner.'
                          }
                        ].map((option) => {
                          const isSelected = amendmentType === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => {
                                setAmendmentType(option.id);
                                setAmendDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-3.5 text-left flex items-start space-x-3 transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className="mt-0.5 shrink-0 w-4 flex justify-center text-blue-600 dark:text-sky-400 font-black">
                                {isSelected ? <Check size={16} /> : <span className="opacity-0">•</span>}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs sm:text-sm font-bold tracking-tight">
                                  {option.label}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal leading-relaxed">
                                  {option.desc}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Context Note underneath */}
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Selected Scope:</span>
                    <span>
                      {!amendmentType && 'No category selected. Please choose a modification type above.'}
                      {amendmentType === 'trade_name' && 'Modification of registered corporate name or commercial trade moniker with DTI, SEC, or CDA.'}
                      {amendmentType === 'address' && 'Transfer of commercial premises within the territorial boundaries of Quezon City.'}
                      {amendmentType === 'line_of_business' && 'Addition, reduction, or modification of PSIC commercial activities and operations.'}
                      {amendmentType === 'ownership' && 'Transfer of proprietorship, assignment of corporate shares, or new general partner.'}
                    </span>
                  </p>
                </div>
              </div>

              {/* 3. New Amended Particulars & Justification */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4 text-xs">
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
                      {!amendmentType && 'New Particulars (Select Amendment Classification above) *'}
                      {amendmentType === 'trade_name' && 'New Proposed Business / Trade Name *'}
                      {amendmentType === 'address' && 'New Complete Physical Address (within Quezon City) *'}
                      {amendmentType === 'line_of_business' && 'New / Additional Line of Business & PSIC Activity *'}
                      {amendmentType === 'ownership' && 'New Registered Owner / Corporate Representative Legal Name *'}
                    </label>
                    <input
                      type="text"
                      disabled={!amendmentType}
                      value={amendedValue}
                      onChange={(e) => setAmendedValue(e.target.value)}
                      placeholder={
                        !amendmentType ? 'Please select an Amendment Classification in Section 2 first...' :
                        amendmentType === 'trade_name' ? 'Enter new proposed business / trade name...' :
                        amendmentType === 'address' ? 'Enter new physical address in Quezon City...' :
                        amendmentType === 'line_of_business' ? 'Enter new / additional line of business...' :
                        'Enter new registered owner / legal representative name...'
                      }
                      className={`w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs transition-colors ${
                        !amendmentType ? 'opacity-60 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
                      }`}
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
                      placeholder="State the operational reason or legal justification for amendment..."
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* 4. QC BPLO Documentary Requirements Uploads */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4 text-xs">
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                      dragActiveDoc === 'proof'
                        ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500/30'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Top Header Row with Status Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-2xs">
                            REQUIRED
                          </span>
                          <h5 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1">
                            <span>Amended DTI / SEC / CDA *</span>
                            {amendProofFile && (
                              <CheckCircle2 size={14} className="text-emerald-500 inline shrink-0" />
                            )}
                          </h5>
                        </div>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                          amendProofFile
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/80'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          Status: {amendProofFile ? 'Uploaded' : 'NOT UPLOADED'}
                        </span>
                      </div>

                      {/* Description & Allowed Formats */}
                      <div className="space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        <p>Philippine primary registration reflecting approved corporate amendment</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">Allowed file types: JPG, JPEG, PNG, WEBP, PDF</p>
                      </div>

                      {/* Action Button: UPLOAD PHOTO */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => proofFileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide rounded-xl shadow-xs transition-all cursor-pointer"
                        >
                          <Upload size={13} />
                          <span>UPLOAD PHOTO</span>
                        </button>
                      </div>
                    </div>

                    {/* When Uploaded: Matching user's live thumbnail preview card */}
                    {amendProofFile && (
                      <div className="pt-2">
                        <div className="relative group/thumb p-2 rounded-2xl bg-[#091524] border border-slate-700/80 shadow-md w-36 flex flex-col items-center animate-in fade-in zoom-in-95">
                          {/* Floating circular (X) button at top-right */}
                          <button
                            type="button"
                            onClick={() => {
                              setAmendProofFile(null);
                              setAmendProofPreview(null);
                            }}
                            title="Remove Photo"
                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-700 hover:bg-rose-600 text-white flex items-center justify-center shadow transition-colors cursor-pointer z-10"
                          >
                            <X size={12} />
                          </button>

                          {/* Photo Thumbnail */}
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
                            className="w-full h-22 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 cursor-pointer relative group-hover/thumb:border-blue-500 transition-colors flex items-center justify-center"
                            title="Click to view full photo"
                          >
                            <img
                              src={amendProofPreview || '/Amendment.jpg'}
                              alt="DTI/SEC Certificate"
                              className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                              <Eye size={16} className="text-white drop-shadow" />
                            </div>
                          </div>

                          {/* File Info */}
                          <div className="w-full text-center mt-1.5 px-1">
                            <span className="font-mono text-[11px] font-semibold text-slate-200 block truncate" title={amendProofFile}>
                              {amendProofFile}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                              {amendProofFileSize || '593.2 KB'}
                            </span>
                          </div>
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
                    className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                      dragActiveDoc === 'barangay'
                        ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500/30'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Top Header Row with Status Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-2xs">
                            REQUIRED
                          </span>
                          <h5 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1">
                            <span>Barangay Clearance *</span>
                            {amendBarangayFile && (
                              <CheckCircle2 size={14} className="text-emerald-500 inline shrink-0" />
                            )}
                          </h5>
                        </div>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                          amendBarangayFile
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/80'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          Status: {amendBarangayFile ? 'Uploaded' : 'NOT UPLOADED'}
                        </span>
                      </div>

                      {/* Description & Allowed Formats */}
                      <div className="space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        <p>Commercial amendment clearance issued by host Quezon City barangay</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">Allowed file types: JPG, JPEG, PNG, WEBP, PDF</p>
                      </div>

                      {/* Action Button: UPLOAD PHOTO */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => barangayFileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide rounded-xl shadow-xs transition-all cursor-pointer"
                        >
                          <Upload size={13} />
                          <span>UPLOAD PHOTO</span>
                        </button>
                      </div>
                    </div>

                    {/* When Uploaded: Matching user's live thumbnail preview card */}
                    {amendBarangayFile && (
                      <div className="pt-2">
                        <div className="relative group/thumb p-2 rounded-2xl bg-[#091524] border border-slate-700/80 shadow-md w-36 flex flex-col items-center animate-in fade-in zoom-in-95">
                          {/* Floating circular (X) button at top-right */}
                          <button
                            type="button"
                            onClick={() => {
                              setAmendBarangayFile(null);
                              setAmendBarangayPreview(null);
                            }}
                            title="Remove Photo"
                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-700 hover:bg-rose-600 text-white flex items-center justify-center shadow transition-colors cursor-pointer z-10"
                          >
                            <X size={12} />
                          </button>

                          {/* Photo Thumbnail */}
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
                            className="w-full h-22 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 cursor-pointer relative group-hover/thumb:border-blue-500 transition-colors flex items-center justify-center"
                            title="Click to view full photo"
                          >
                            <img
                              src={amendBarangayPreview || '/New Application.jpg'}
                              alt="Barangay Clearance"
                              className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                              <Eye size={16} className="text-white drop-shadow" />
                            </div>
                          </div>

                          {/* File Info */}
                          <div className="w-full text-center mt-1.5 px-1">
                            <span className="font-mono text-[11px] font-semibold text-slate-200 block truncate" title={amendBarangayFile}>
                              {amendBarangayFile}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                              {amendBarangayFileSize || '412.5 KB'}
                            </span>
                          </div>
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
                    className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                      dragActiveDoc === 'legal'
                        ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500/30'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Top Header Row with Status Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-2xs">
                            REQUIRED
                          </span>
                          <h5 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1">
                            <span>Notarized Legal Instrument *</span>
                            {amendLegalFile && (
                              <CheckCircle2 size={14} className="text-emerald-500 inline shrink-0" />
                            )}
                          </h5>
                        </div>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                          amendLegalFile
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/80'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          Status: {amendLegalFile ? 'Uploaded' : 'NOT UPLOADED'}
                        </span>
                      </div>

                      {/* Description & Allowed Formats */}
                      <div className="space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        <p>Board resolution, deed of sale/assignment, or lease contract</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">Allowed file types: JPG, JPEG, PNG, WEBP, PDF</p>
                      </div>

                      {/* Action Button: UPLOAD PHOTO */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => legalFileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide rounded-xl shadow-xs transition-all cursor-pointer"
                        >
                          <Upload size={13} />
                          <span>UPLOAD PHOTO</span>
                        </button>
                      </div>
                    </div>

                    {/* When Uploaded: Matching user's live thumbnail preview card */}
                    {amendLegalFile && (
                      <div className="pt-2">
                        <div className="relative group/thumb p-2 rounded-2xl bg-[#091524] border border-slate-700/80 shadow-md w-36 flex flex-col items-center animate-in fade-in zoom-in-95">
                          {/* Floating circular (X) button at top-right */}
                          <button
                            type="button"
                            onClick={() => {
                              setAmendLegalFile(null);
                              setAmendLegalPreview(null);
                            }}
                            title="Remove Photo"
                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-700 hover:bg-rose-600 text-white flex items-center justify-center shadow transition-colors cursor-pointer z-10"
                          >
                            <X size={12} />
                          </button>

                          {/* Photo Thumbnail */}
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
                            className="w-full h-22 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 cursor-pointer relative group-hover/thumb:border-blue-500 transition-colors flex items-center justify-center"
                            title="Click to view full photo"
                          >
                            <img
                              src={amendLegalPreview || '/Special Permit.jpg'}
                              alt="Legal Instrument"
                              className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                              <Eye size={16} className="text-white drop-shadow" />
                            </div>
                          </div>

                          {/* File Info */}
                          <div className="w-full text-center mt-1.5 px-1">
                            <span className="font-mono text-[11px] font-semibold text-slate-200 block truncate" title={amendLegalFile}>
                              {amendLegalFile}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                              {amendLegalFileSize || '680.1 KB'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 5. Quezon City Fee Assessment & Sworn Declaration */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4 text-xs">
                

                {/* Missing Classification Warning */}
                {!amendmentType && (
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-start space-x-2.5 text-amber-900 dark:text-amber-200">
                    <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 text-xs">
                      <strong className="block font-bold">No Amendment Classification Selected</strong>
                      <p className="text-[11px] text-amber-800 dark:text-amber-300">
                        Please choose a valid amendment category in Section 2 before submitting your application.
                      </p>
                    </div>
                  </div>
                )}

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

                {/* Missing Particulars Warning */}
                {(!amendedValue?.trim() || !amendReason?.trim()) && (
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-start space-x-2.5 text-amber-900 dark:text-amber-200">
                    <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 text-xs">
                      <strong className="block font-bold">Incomplete Amended Particulars</strong>
                      <p className="text-[11px] text-amber-800 dark:text-amber-300">
                        Please provide both the new amended details and operational reason / justification in Section 3 before submitting.
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
                      I, <strong>{activeAmendRecord.owner}</strong>, hereby declare under oath and under penalty of perjury that all declarations and supporting documents submitted herein for Quezon City Mayor's Permit Amendment are true and correct pursuant to Republic Act No. 8792 (Electronic Commerce Act) and Quezon City Citizen's Charter standards.
                    </span>
                  </label>
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex flex-col items-center justify-center space-y-2">
                  <button
                    type="button"
                    disabled={!amendSworn || !amendmentType || !amendProofFile || !amendBarangayFile || !amendLegalFile || !amendedValue?.trim() || !amendReason?.trim()}
                    onClick={() => {
                      if (!amendSworn || !amendmentType || !amendProofFile || !amendBarangayFile || !amendLegalFile || !amendedValue?.trim() || !amendReason?.trim()) {
                        return;
                      }
                      setAmendSubmitted(true);
                      if (onAddNewApplication) {
                        onAddNewApplication(activeAmendRecord.businessName, 'Business Permit (Amendment)', {
                          type: amendmentType,
                          value: amendedValue,
                          refNo: amendRefNo
                        });
                      }
                    }}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-95 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-blue-700/25 transition-all cursor-pointer flex items-center justify-center"
                  >
                    <span>Submit Amendment Application</span>
                  </button>
                  {(!amendedValue?.trim() || !amendReason?.trim()) && (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium text-center">
                      * Please fill out the Amended Particulars & Declaration fields above to enable submission.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  })()}

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
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 pb-12">
          {/* Top Navigation: Breadcrumb and Back Links */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <button 
              type="button"
              onClick={() => {
                resetSpecialPermitForm();
                setCurrentView('special_permit_overview');
              }}
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors cursor-pointer text-left inline-flex items-center gap-1.5"
            >
              &larr; Back to Special Permit Guidelines
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  resetSpecialPermitForm();
                  setCurrentView('preview');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Back to Permit Hub
              </button>
              <button
                type="button"
                onClick={() => {
                  resetSpecialPermitForm();
                  setCurrentView('select_type');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Change Application Type
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              Short Term / Special Permit Application
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Quezon City E-Services Citizen's Charter Compliant • Event &amp; Promotional Clearances
            </p>
          </div>

          {/* Main Container Card (Inline Page Content - NOT a dialog) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-7 space-y-6">
              {specialSubmitted ? (
                /* Dedicated Standalone Page for Submitted Application */
                <div className="space-y-7 animate-in fade-in">
                  {/* Top Green Banner */}
                  <div className="text-center space-y-2 py-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-3xl border border-emerald-200 dark:border-emerald-800/80 p-6">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                      <CheckCircle2 size={32} />
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      SHORT TERM / SPECIAL PERMIT - APPLICATION SUBMITTED
                    </h3>

                    <div className="inline-block mt-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 shadow-xs">
                      <span className="text-xs text-slate-500 dark:text-slate-400 mr-2">Application Number:</span>
                      <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-base">
                        {specialRefNumber}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300 pt-1">
                      <span>Date Submitted: <strong className="text-slate-900 dark:text-white">September 24, 2026</strong></span>
                      <span>•</span>
                      <span>Status: <strong className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase">SUBMITTED</strong></span>
                    </div>
                  </div>

                  {/* Card with Details & Timeline */}
                  <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs space-y-6">
                    {/* Top Details Summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Application Number:</span>
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{specialRefNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Business Name:</span>
                        <span className="font-bold text-slate-900 dark:text-white truncate block">{specialData.eventTitle || specialData.businessName || 'Special Event'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Application Type:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Short Term / Special Permit</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Date Submitted:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">September 24, 2026</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Status:</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800">
                          SUBMITTED
                        </span>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-3">
                      <h5 className="font-black text-xs uppercase tracking-wider text-slate-400">
                        Application Processing Timeline
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-7 gap-2.5 text-xs">
                        {[
                          { id: 1, title: 'Application Submitted', done: true, active: true },
                          { id: 2, title: 'Initial Evaluation', done: false, active: false },
                          { id: 3, title: 'Document Evaluation', done: false, active: false },
                          { id: 4, title: 'Assessment', done: false, active: false },
                          { id: 5, title: 'Approval', done: false, active: false },
                          { id: 6, title: 'Payment', done: false, active: false },
                          { id: 7, title: 'Permit Release', done: false, active: false }
                        ].map((stage) => (
                          <div
                            key={stage.id}
                            className={`p-3 rounded-2xl border space-y-1 transition-all ${
                              stage.done
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`font-black text-[11px] ${
                                stage.done ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500'
                              }`}>
                                {stage.done ? '✓' : '○'}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">0{stage.id}</span>
                            </div>
                            <p className="font-bold text-[11px] text-slate-800 dark:text-slate-200 leading-tight">
                              {stage.title}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Return Button */}
                  <div className="flex justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        resetSpecialPermitForm();
                        setCurrentView('preview');
                        setShowSpecialPermitModal(true);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-md cursor-pointer transition-all"
                    >
                      Return to Special Permit Application
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* ========================================================================= */}
                  {/* 7-STEP SEGMENTED STEPPER BANNER (EXACT REPLICA OF PICTURE 1) */}
                  {/* ========================================================================= */}
                  <div className="w-full overflow-x-auto pb-1">
                    <div className="grid grid-cols-7 min-w-[700px] border border-slate-300 dark:border-slate-700 rounded-t-xl overflow-hidden shadow-xs">
                      {[
                        { step: 1, label: 'General' },
                        { step: 2, label: 'Basic Documentary Requirements' },
                        { step: 3, label: 'Business information' },
                        { step: 4, label: 'Business Operation' },
                        { step: 5, label: 'Business Activity' },
                        { step: 6, label: 'Event Information' },
                        { step: 7, label: 'Submit Page' },
                      ].map((item) => {
                        const isActive = specialStep === item.step;
                        const isPassed = specialStep > item.step;
                        return (
                          <div
                            key={item.step}
                            className={`py-3 px-1 sm:px-2 border-r last:border-r-0 border-white/50 dark:border-slate-700/60 flex flex-col items-center justify-center text-center transition-all cursor-default select-none ${
                              isActive
                                ? 'bg-[#154760] text-white shadow-inner'
                                : isPassed
                                ? 'bg-[#82929e] text-white'
                                : 'bg-[#b6bec5] dark:bg-slate-800 text-slate-800 dark:text-slate-300'
                            }`}
                          >
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm mb-1 shadow-xs ${
                              isActive 
                                ? 'bg-white text-[#154760] ring-2 ring-white/60' 
                                : isPassed
                                ? 'bg-white text-[#154760]'
                                : 'bg-white text-slate-700'
                            }`}>
                              {item.step}
                            </div>
                            <span className={`text-[9px] sm:text-[11px] leading-tight block max-w-[120px] line-clamp-2 sm:line-clamp-none ${
                              isActive ? 'font-bold text-white' : 'font-medium'
                            }`}>
                              {item.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
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
          {/* STEP 1: GENERAL (SEAMLESS WITHIN MAIN CONTAINER - NO INNER BOX)            */}
          {/* ========================================================================= */}
          {specialStep === 1 && (
            <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed animate-in fade-in pt-1">
              {/* 1. Definition & Duration Scope */}
              <div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  A special permit is required for business activities with a short duration. Some examples are Promotional Events, Sporting Events, TV and Film Productions, Concert/Musical and Stage Shows and Seasonal operations like Bingo Games, Cockfight (limited to 1-3 days per year), and Carnivals (limited to 14 days).
                </p>
              </div>

              {/* 2. Application Requirements List */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-2.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  Application Requirements:
                </h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>Request letter to Business Permit and Licensing Department Head.</li>
                  <li>Venue Contract of Lease from the owner of the venue.</li>
                  <li>Special Working Permit (SWP) from Bureau of Immigration, if an applicant is a foreigner (when applicable)</li>
                  <li>DTI / SEC / Mayor's Permit as Promoter</li>
                  <li>Special Permit from City Councilor for Seasonal Operations (when applicable)</li>
                </ol>
              </div>

              {/* 3. General Instructions */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-2.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  General Instructions:
                </h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    Accomplish the application form by ticking the appropriate boxes, typing, and/or printing (UPPER CASE/CAPITAL LETTER). All required data fields/information should be completely and clearly filled-out by the applicant.
                  </li>
                  <li>
                    Please ensure that ALL required documents are properly attached and fill out ALL necessary information. Incomplete data on application form and/or requirements will be returned to the applicant / will not be processed.
                  </li>
                </ol>
              </div>

              {/* 4. Authorization Form */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-2.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  Authorization Form:
                </h4>
                <p className="text-slate-700 dark:text-slate-300">
                  For application that will be processed by an authorized representative, kindly download this{' '}
                  <button
                    type="button"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '/Special Permit.jpg';
                      link.download = 'QC_BPLO_Special_Permit_Authorization_Form.jpg';
                      link.click();
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

              {/* 5. Terms and Acceptance */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={specialTermsAccepted}
                    onChange={(e) => setSpecialTermsAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500 rounded cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    I have read and agree to the Short-Term / Special Permitting terms, Quezon City Revenue Code (Ordinance SP-2958), and Event Safety Regulations.
                  </span>
                </label>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentView('select_type')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white border border-slate-500/50 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs inline-flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Permit Selection</span>
                </button>

                <button
                  type="button"
                  disabled={!specialTermsAccepted}
                  onClick={() => setSpecialStep(2)}
                  className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer sm:ml-auto"
                >
                  <span>Continue to Basic Documentary Requirements</span>
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

              {/* REQUIRED DOCUMENTS Container matching Picture 1 */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    REQUIRED DOCUMENTS
                  </h3>
                </div>

                {basicDocItems.map((item, idx) => {
                  const isUploaded = Boolean(item.file);
                  return (
                    <div
                      key={item.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                        isUploaded
                          ? 'border-emerald-200 dark:border-emerald-900/60 bg-white dark:bg-slate-900 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs'
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Top Header Row with Status Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-black text-slate-400">
                              {idx + 1}.
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                              item.badge === 'Required'
                                ? 'bg-blue-600 text-white shadow-2xs'
                                : 'bg-slate-700 text-slate-300'
                            }`}>
                              {item.badge === 'Required' ? 'REQUIRED' : 'OPTIONAL'}
                            </span>
                            <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm flex items-center gap-1">
                              <span>{item.label}</span>
                              {isUploaded && (
                                <CheckCircle2 size={15} className="text-emerald-500 inline shrink-0" />
                              )}
                            </h4>
                          </div>

                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                            isUploaded
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/80'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            Status: {isUploaded ? 'Uploaded' : 'NOT UPLOADED'}
                          </span>
                        </div>

                        {/* Description & Allowed Formats */}
                        <div className="space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {item.parenthetical && (
                            <p>{item.parenthetical}</p>
                          )}
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">
                            Allowed file types: JPG, JPEG, PNG, WEBP, PDF
                          </p>
                        </div>

                        {/* Action Button: UPLOAD PHOTO */}
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveUploadDocId(item.id);
                              basicDocFileInputRef.current?.click();
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide rounded-xl shadow-xs transition-all cursor-pointer"
                          >
                            <Upload size={13} />
                            <span>UPLOAD PHOTO</span>
                          </button>
                        </div>
                      </div>

                      {/* When Uploaded: Matching user's live thumbnail preview card */}
                      {isUploaded && item.file && (
                        <div className="pt-2">
                          <div className="relative group/thumb p-2 rounded-2xl bg-[#091524] border border-slate-700/80 shadow-md w-36 flex flex-col items-center animate-in fade-in zoom-in-95">
                            {/* Floating circular (X) button at top-right */}
                            <button
                              type="button"
                              onClick={() => removeDocFile(item.id)}
                              title="Remove Photo"
                              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-700 hover:bg-rose-600 text-white flex items-center justify-center shadow transition-colors cursor-pointer z-10"
                            >
                              <X size={12} />
                            </button>

                            {/* Photo Thumbnail */}
                            <div 
                              onClick={() => setPreviewDocModal({
                                isOpen: true,
                                title: item.label,
                                fileName: item.file!.name,
                                fileSize: item.file!.size,
                                previewUrl: item.file!.previewUrl,
                                docCategory: 'QC BPLO Documentary Attachment',
                                date: item.file!.date,
                                docKey: item.id
                              })}
                              className="w-full h-22 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 cursor-pointer relative group-hover/thumb:border-blue-500 transition-colors flex items-center justify-center"
                              title="Click to view full photo"
                            >
                              <img
                                src={item.file.previewUrl}
                                alt={item.label}
                                className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                                <Eye size={16} className="text-white drop-shadow" />
                              </div>
                            </div>

                            {/* File Info */}
                            <div className="w-full text-center mt-1.5 px-1">
                              <span className="font-mono text-[11px] font-semibold text-slate-200 block truncate" title={item.file.name}>
                                {item.file.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                                {item.file.size}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSpecialStep(1)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white border border-slate-500/50 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs inline-flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  <span>Back to General</span>
                </button>

                <button
                  type="button"
                  disabled={!basicDocItems.filter(item => item.badge === 'Required').every(item => Boolean(item.file))}
                  onClick={() => {
                    if (!basicDocItems.filter(item => item.badge === 'Required').every(item => Boolean(item.file))) return;
                    setSpecialStep(3);
                  }}
                  className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <span>Continue to Business Information</span>
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
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
                    type="tel"
                    inputMode="numeric"
                    maxLength={11}
                    placeholder="e.g. 09171234567 (11 digits)"
                    value={specialData.organizerContact}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
                      setSpecialData({ ...specialData, organizerContact: digits });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                  {specialData.organizerContact && specialData.organizerContact.length < 11 && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
                      Must be exactly 11 digits ({specialData.organizerContact.length}/11)
                    </p>
                  )}
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
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white border border-slate-500/50 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs inline-flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Basic Documentary Requirements</span>
                </button>

                <button
                  type="button"
                  disabled={!(
                    specialData.businessName?.trim() &&
                    specialData.tin?.trim() &&
                    specialData.dtiSecNumber?.trim() &&
                    specialData.registeredAddress?.trim() &&
                    specialData.organizerName?.trim() &&
                    specialData.organizerContact?.replace(/\D/g, '').length === 11 &&
                    specialData.organizerEmail?.trim()
                  )}
                  onClick={() => {
                    if (!(
                      specialData.businessName?.trim() &&
                      specialData.tin?.trim() &&
                      specialData.dtiSecNumber?.trim() &&
                      specialData.registeredAddress?.trim() &&
                      specialData.organizerName?.trim() &&
                      specialData.organizerContact?.replace(/\D/g, '').length === 11 &&
                      specialData.organizerEmail?.trim()
                    )) return;
                    setSpecialStep(4);
                  }}
                  className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <span>Continue to Business Operation</span>
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

              <div className="space-y-2 text-xs">
                <label className="block text-slate-800 dark:text-slate-200 font-bold">
                  Nature / Category of Short-Term Special Operation *
                </label>
                
                {/* Custom Selection Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSpecialOpDropdownOpen(!specialOpDropdownOpen)}
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/90 border transition-all flex items-center justify-between text-left text-xs sm:text-sm font-semibold shadow-xs cursor-pointer ${
                      specialOpDropdownOpen
                        ? 'rounded-t-2xl border-blue-500 dark:border-sky-500 bg-white dark:bg-slate-800 border-b-slate-200 dark:border-b-slate-750 text-slate-900 dark:text-white'
                        : 'rounded-2xl border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-sky-500 text-slate-900 dark:text-white'
                    }`}
                  >
                    <span className={`truncate ${!specialData.operationType ? 'text-slate-400 dark:text-slate-500 font-normal' : 'font-bold'}`}>
                      {specialData.operationType || 'Select Category of Special Operation...'}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                        specialOpDropdownOpen ? 'rotate-180 text-blue-600 dark:text-sky-400' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu Options (Seamlessly attached, NO '--') */}
                  {specialOpDropdownOpen && (
                    <div className="w-full bg-white dark:bg-slate-850 border border-t-0 border-blue-500 dark:border-sky-500 rounded-b-2xl shadow-xl overflow-hidden z-20 divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in duration-150">
                      {[
                        'Promotional Events & Product Activations (Up to 15 days)',
                        'Concert, Musical & Stage Shows (1 to 3 days)',
                        'Sporting Events, Marathons & Tournaments',
                        'TV & Film Productions / Movie Location Shoots',
                        'Seasonal Carnivals / Perya (Limited to 14 days max)',
                        'Seasonal Bingo Games (Limited to 1-3 days/year)',
                        'Seasonal Cockfight (Limited to 1-3 days/year)',
                        'Bazaar, Temporary Flea Market & Food Festival'
                      ].map((category) => {
                        const isSelected = specialData.operationType === category;
                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() => {
                              setSpecialData({ ...specialData, operationType: category });
                              setSpecialOpDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="shrink-0 w-4 flex justify-center text-blue-600 dark:text-sky-400 font-black">
                              {isSelected ? <Check size={16} /> : <span className="opacity-0">•</span>}
                            </div>
                            <span className="text-xs sm:text-sm font-medium tracking-tight">
                              {category}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Daily Operating Hours
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 8"
                    value={specialData.operatingHours}
                    onChange={(e) => setSpecialData({ ...specialData, operatingHours: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Estimated Daily Foot Traffic / Expected Attendees
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 2500"
                    value={specialData.expectedAttendees}
                    onChange={(e) => setSpecialData({ ...specialData, expectedAttendees: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Total Venue Area (in sq. meters)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 1500"
                    value={specialData.venueArea}
                    onChange={(e) => setSpecialData({ ...specialData, venueArea: e.target.value.replace(/\D/g, '') })}
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
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white border border-slate-500/50 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs inline-flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Business Information</span>
                </button>

                <button
                  type="button"
                  disabled={!(
                    specialData.operationType?.trim() &&
                    specialData.operatingHours?.trim() &&
                    specialData.expectedAttendees?.trim() &&
                    specialData.venueArea?.trim()
                  )}
                  onClick={() => {
                    if (!(
                      specialData.operationType?.trim() &&
                      specialData.operatingHours?.trim() &&
                      specialData.expectedAttendees?.trim() &&
                      specialData.venueArea?.trim()
                    )) return;
                    setSpecialStep(5);
                  }}
                  className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <span>Continue to Business Activity</span>
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
                    inputMode="numeric"
                    placeholder="e.g. 10"
                    value={specialData.boothCount}
                    onChange={(e) => setSpecialData({ ...specialData, boothCount: e.target.value.replace(/\D/g, '') })}
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
                    <option value="" disabled>Select Admission / Ticket Structure...</option>
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
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white border border-slate-500/50 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs inline-flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Business Operation</span>
                </button>

                <button
                  type="button"
                  disabled={!(
                    specialData.commercialActivity?.trim() &&
                    specialData.boothCount?.trim() &&
                    specialData.admissionType?.trim()
                  )}
                  onClick={() => {
                    if (!(
                      specialData.commercialActivity?.trim() &&
                      specialData.boothCount?.trim() &&
                      specialData.admissionType?.trim()
                    )) return;
                    setSpecialStep(6);
                  }}
                  className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <span>Continue to Event Information</span>
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
                    <option value="" disabled>Select Quezon City Barangay...</option>
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
                    min="1900-01-01"
                    max="2099-12-31"
                    value={specialData.startDate}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (val) {
                        const parts = val.split('-');
                        if (parts[0] && parts[0].length > 4) {
                          parts[0] = parts[0].slice(0, 4);
                          val = parts.join('-');
                        }
                      }
                      setSpecialData({ ...specialData, startDate: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Event End Date
                  </label>
                  <input
                    type="date"
                    min="1900-01-01"
                    max="2099-12-31"
                    value={specialData.endDate}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (val) {
                        const parts = val.split('-');
                        if (parts[0] && parts[0].length > 4) {
                          parts[0] = parts[0].slice(0, 4);
                          val = parts.join('-');
                        }
                      }
                      setSpecialData({ ...specialData, endDate: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
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
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white border border-slate-500/50 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs inline-flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Business Activity</span>
                </button>

                <button
                  type="button"
                  disabled={!(
                    specialData.eventTitle?.trim() &&
                    specialData.venue?.trim() &&
                    specialData.barangay?.trim() &&
                    specialData.venueAddress?.trim() &&
                    specialData.startDate?.trim() &&
                    specialData.endDate?.trim() &&
                    specialData.safetyOfficer?.trim()
                  )}
                  onClick={() => {
                    if (!(
                      specialData.eventTitle?.trim() &&
                      specialData.venue?.trim() &&
                      specialData.barangay?.trim() &&
                      specialData.venueAddress?.trim() &&
                      specialData.startDate?.trim() &&
                      specialData.endDate?.trim() &&
                      specialData.safetyOfficer?.trim()
                    )) return;
                    setSpecialStep(7);
                  }}
                  className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <span>Continue to Submit Page</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 7: SUBMIT PAGE & QC BPLO ASSESSMENT */}
          {/* ========================================================================= */}
          {specialStep === 7 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200 dark:border-slate-800 gap-2">
                <div>
                  <span className="text-xs font-bold text-blue-600 dark:text-sky-400 block uppercase tracking-wider">
                    Step 7 of 7: Submit Page & Final Application Review
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    Review & Confirm Special Permit Application (Steps 2 to 6 Summary)
                  </h3>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-sky-300 rounded-full border border-blue-300 dark:border-blue-800 self-start sm:self-auto">
                  Short Term / Special Permit
                </span>
              </div>

              {/* STEP 2: Basic Documentary Requirements Review */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center space-x-2 text-slate-800 dark:text-white">
                    <FileCheck size={16} className="text-blue-500 dark:text-sky-400" />
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      Step 2: Documentary Attachments & Photo Gallery Review
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/80">
                    {basicDocItems.filter(item => Boolean(item.file)).length} Uploaded Document(s)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3 text-xs">
                  {basicDocItems.map((item) => {
                    const isUploaded = Boolean(item.file);
                    return (
                      <div 
                        key={item.id}
                        className={`p-2.5 rounded-xl border flex flex-col justify-between space-y-2 transition-all ${
                          isUploaded
                            ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20'
                            : 'border-slate-200 dark:border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="relative w-full h-24 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                          {item.file?.previewUrl ? (
                            <img 
                              src={item.file.previewUrl} 
                              alt={item.label}
                              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                              onClick={() => setPreviewDocModal({
                                isOpen: true,
                                title: item.label,
                                fileName: item.file!.name,
                                fileSize: item.file!.size,
                                previewUrl: item.file!.previewUrl,
                                docCategory: 'QC BPLO Documentary Attachment',
                                date: item.file!.date,
                                docKey: item.id
                              })}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                              <Camera size={20} />
                              <span className="text-[10px] mt-1 font-medium">No Photo</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-2" title={item.label}>
                            {item.label}
                          </p>
                          <div className="mt-1 flex items-center justify-between">
                            <span className={`text-[10px] font-bold uppercase ${
                              item.badge === 'Required' ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'
                            }`}>
                              {item.badge}
                            </span>
                            <span className={`text-[10px] font-bold flex items-center gap-1 ${
                              isUploaded ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                            }`}>
                              {isUploaded ? <><Check size={11} /> Attached</> : 'Not Attached'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Grid for Steps 3, 4, 5, 6 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* STEP 3: Business Information */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs">
                  <div className="flex items-center space-x-2 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                    <Building2 size={15} className="text-blue-500 dark:text-sky-400" />
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Step 3: Business & Organizer Information</span>
                  </div>
                  <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
                    <p><strong className="text-slate-900 dark:text-white">Entity / Business Name:</strong> {specialData.businessName || 'N/A'}</p>
                    <p><strong className="text-slate-900 dark:text-white">TIN / SEC / CDA:</strong> {specialData.tin || 'N/A'} • {specialData.dtiSecNumber || 'N/A'}</p>
                    <p><strong className="text-slate-900 dark:text-white">Registered Address:</strong> {specialData.registeredAddress || 'N/A'}</p>
                    <p><strong className="text-slate-900 dark:text-white">Authorized Promoter / Head:</strong> {specialData.organizerName || 'N/A'}</p>
                    <p><strong className="text-slate-900 dark:text-white">Contact Mobile:</strong> <span className="font-mono">{specialData.organizerContact || 'N/A'}</span></p>
                    <p><strong className="text-slate-900 dark:text-white">Official Email:</strong> {specialData.organizerEmail || 'N/A'}</p>
                  </div>
                </div>

                {/* STEP 4: Business Operation */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs">
                  <div className="flex items-center space-x-2 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                    <Briefcase size={15} className="text-blue-500 dark:text-sky-400" />
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Step 4: Business Operation & Staging Scope</span>
                  </div>
                  <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
                    <p><strong className="text-slate-900 dark:text-white">Operation Category:</strong> {specialData.operationType || 'N/A'}</p>
                    <p><strong className="text-slate-900 dark:text-white">Operating Hours:</strong> {specialData.operatingHours || 'N/A'}</p>
                    <p><strong className="text-slate-900 dark:text-white">Expected Crowd Footprint:</strong> {specialData.expectedAttendees || '0'} Daily Attendees</p>
                    <p><strong className="text-slate-900 dark:text-white">Total Venue Floor Area:</strong> {specialData.venueArea ? `${specialData.venueArea} sqm` : 'N/A'}</p>
                    <p><strong className="text-slate-900 dark:text-white">Ingress / Setup Date:</strong> {specialData.ingressDate || 'N/A'}</p>
                    <p><strong className="text-slate-900 dark:text-white">Egress / Dismantling Date:</strong> {specialData.egressDate || 'N/A'}</p>
                    <p><strong className="text-slate-900 dark:text-white">Sound Amplification:</strong> {specialData.soundAmplification ? 'Yes (Subject to QC Noise Ordinance)' : 'No Loudspeakers'}</p>
                  </div>
                </div>

                {/* STEP 5: Business Activity */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs">
                  <div className="flex items-center space-x-2 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                    <Sparkles size={15} className="text-blue-500 dark:text-sky-400" />
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Step 5: Business Activity & Ancillary Commercial Lines</span>
                  </div>
                  <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
                    <p><strong className="text-slate-900 dark:text-white">Specific Commercial Activity:</strong> {specialData.commercialActivity || 'N/A'}</p>
                    <p><strong className="text-slate-900 dark:text-white">Temporary Commercial Booths:</strong> {specialData.boothCount ? `${specialData.boothCount} Booth(s)` : 'N/A'}</p>
                    <p><strong className="text-slate-900 dark:text-white">Admission / Ticket Structure:</strong> {specialData.admissionType || 'N/A'}</p>
                    <p><strong className="text-slate-900 dark:text-white">Food & Beverage Cooking:</strong> {specialData.foodSelling ? 'Yes (Requires QC Health Sanitary Clearance)' : 'No Food Cooking'}</p>
                    <p><strong className="text-slate-900 dark:text-white">Auxiliary Generator Set:</strong> {specialData.generatorEquipment ? 'Yes (Requires QC OBO Electrical Permit)' : 'No / Utility Power Only'}</p>
                  </div>
                </div>

                {/* STEP 6: Event Information */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs">
                  <div className="flex items-center space-x-2 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                    <Calendar size={15} className="text-blue-500 dark:text-sky-400" />
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Step 6: Event Location, Dates & Safety Jurisdiction</span>
                  </div>
                  <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
                    <p><strong className="text-slate-900 dark:text-white">Event Title:</strong> {specialData.eventTitle || 'N/A'}</p>
                    <p><strong className="text-slate-900 dark:text-white">Venue Name:</strong> {specialData.venue || 'N/A'}</p>
                    <p><strong className="text-slate-900 dark:text-white">Barangay Jurisdiction:</strong> Brgy. {specialData.barangay || 'N/A'}, Quezon City</p>
                    <p><strong className="text-slate-900 dark:text-white">Exact Address:</strong> {specialData.venueAddress || 'N/A'}</p>
                    <p><strong className="text-slate-900 dark:text-white">Staging Duration:</strong> {specialData.startDate || 'N/A'} to {specialData.endDate || 'N/A'}</p>
                    <p><strong className="text-slate-900 dark:text-white">Designated Safety Lead:</strong> {specialData.safetyOfficer || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSpecialStep(6)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white border border-slate-500/50 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs inline-flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Event Information</span>
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
                  className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <FileCheck size={16} />
                  <span>Submit Special Permit Application to QC BPLO</span>
                </button>
              </div>
            </div>
          )}
                </>
              )}
            </div>
          </div>
        )}

      {/* ========================================================================= */}
      {/* SUB-VIEW: CARD 2 - BUSINESS INFORMATION SYSTEM (CTC PULLING) [REMOVED/OBSOLETE] */}
      {/* ========================================================================= */}
      {false && (
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
                  <span>Modify Request</span>
                </button>

                <button
                  onClick={() => setCtcStep(3)}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30 flex items-center space-x-2 cursor-pointer"
                >
                  <span>Proceed to Payment Linkage</span>
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
      {/* SUB-VIEW: CARD 3 - MAYOR'S PERMIT VERIFICATION (LEGACY - DISABLED)       */}
      {/* ========================================================================= */}
      {false && currentView === 'verification' && (
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



      {/* Retired floating showAmendModal in favor of inline amendment_overview sub-page */}
      {/* Retired floating showNewAppModal in favor of Option 1 inline sub-page content */}

      {/* Retired floating showSpecialPermitModal in favor of inline special_permit_overview sub-page */}

      {/* ========================================================================= */}
      {/* MODAL: TAX EXEMPTION PROGRAM QUALIFICATION GUIDE                         */}
      {/* ========================================================================= */}
      {showExemptionModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
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
            {/* Header: Title and X button sa taas */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
              <div className="flex items-center space-x-3 truncate pr-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <FileText size={18} />
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-sky-400 block">
                    Document Photo Preview
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    {previewDocModal.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDocModal(null)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Document Viewer Body: Pure Image Display */}
            <div className="p-4 sm:p-6 overflow-y-auto flex items-center justify-center bg-slate-950/90 min-h-[260px] max-h-[75vh]">
              <img 
                src={previewDocModal.previewUrl} 
                alt={previewDocModal.fileName}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-lg border border-slate-800"
              />
            </div>
          </div>
        </div>
      )}



      {/* ========================================================================= */}
      {/* SUB-VIEW: APPLY FOR OCCUPATIONAL / WORK PERMIT (QC E-SERVICES UPLOAD-FIRST) */}
      {/* ========================================================================= */}
      {currentView === 'occupational_permit' && (
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 pb-12">
          {/* Hidden File Input for Occupational Clearances */}
          <input 
            type="file" 
            ref={occFileInputRef} 
            onChange={handleOccFileUpload} 
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" 
            className="hidden" 
          />

          {/* Top Navigation: Breadcrumb and Back Links */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <button 
              type="button"
              onClick={() => {
                resetOccForm();
                setCurrentView('preview');
                navigate('/portal/business');
              }}
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors cursor-pointer text-left inline-flex items-center gap-1.5"
            >
              &larr; Back to Business Permit Hub
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
            {/* Header */}
            <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <h3 className="text-base sm:text-xl font-black tracking-wide uppercase text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Apply for Occupational (Work) Permit</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Quezon City E-Services Citizen's Charter Compliant • Direct Clearance & Document Upload System
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-7 space-y-6 text-xs">
              {occSubmitted ? (
                /* ================================================================= */
                /* SUCCESS VIEW: DIGITAL OCCUPATIONAL WORK PERMIT (QC BPLD E-PERMIT)  */
                /* ================================================================= */
                <div className="space-y-6 py-2">
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
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 cursor-pointer transition-all"
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
                        resetOccForm();
                        setCurrentView('preview');
                        navigate('/portal/business');
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold cursor-pointer transition-colors"
                    >
                      Return to Permit Hub
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
                  {/* Category Switcher: Dropdown Selection */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Select Applicant Category *
                    </label>
                    <select
                      value={occAppType}
                      onChange={(e) => setOccAppType(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-bold text-xs cursor-pointer"
                    >
                      <option value="" disabled>Select Applicant Category...</option>
                      <option value="regular">Regular Employee Application — Standard QC BPLD Tariff: ₱170.00 (Permit + Doc Stamp)</option>
                      <option value="first_time">First-Time Jobseeker (RA 11261) — 100% FREE (₱0.00) with Barangay / PESO Cert</option>
                    </select>
                  </div>

                  {/* Worker & Employer Information */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                        1. Worker & Employer Profile
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Worker Full Legal Name *
                        </label>
                        <input 
                          type="text" 
                          placeholder="Enter worker's full legal name"
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
                          placeholder="e.g. 09171234567"
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
                          <option value="" disabled>Select Work Position / Category...</option>
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
                          placeholder="Enter employer or company name"
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
                          placeholder="e.g. Brgy. Diliman, Quezon City"
                          value={occWorkerData.employerAddress}
                          onChange={(e) => setOccWorkerData({ ...occWorkerData, employerAddress: e.target.value })}
                          className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* DOCUMENT UPLOADS: THE MAIN EMPHASIS ("MORE ON UPLOAD LANG") */}
                  <div className="space-y-3 pt-2">
                    <div className="pb-1 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-1.5">
                          <UploadCloud size={15} className="text-emerald-600 dark:text-emerald-400" />
                          <span>2. Mandatory Clearance & Document Uploads</span>
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Upload clear photos or PDF scans. Allowed file types: <span className="font-bold text-slate-700 dark:text-slate-300">.pdf, .jpg, .jpeg, .png</span> (up to 15MB)
                        </p>
                      </div>
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
                          className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#071324] transition-all shadow-xs space-y-3"
                        >
                          {/* Top Header Row: Number, Badge, Title with asterisk & checkmark, and Status pill */}
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-slate-500 dark:text-slate-400 font-black text-xs sm:text-sm">
                                {index + 1}.
                              </span>
                              {item.required ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                  REQUIRED
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                  OPTIONAL
                                </span>
                              )}
                              <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-1.5">
                                <span>{item.title} {item.required && '*'}</span>
                                {item.file && (
                                  <CheckCircle2 size={16} className="text-emerald-500 inline shrink-0" />
                                )}
                              </h4>
                            </div>

                            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                              item.file
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/80'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}>
                              Status: {item.file ? 'Uploaded' : 'NOT UPLOADED'}
                            </span>
                          </div>

                          {/* Description & Allowed Types */}
                          <div className="space-y-0.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {item.note && (
                              <p>{item.note}</p>
                            )}
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">
                              Allowed file types: JPG, JPEG, PNG, WEBP
                            </p>
                          </div>

                          {/* Action Button: UPLOAD PHOTO */}
                          <div>
                            <button
                              type="button"
                              onClick={() => {
                                setOccActiveUploadId(item.id);
                                occFileInputRef.current?.click();
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide rounded-xl shadow-xs transition-all cursor-pointer"
                            >
                              <Upload size={13} />
                              <span>UPLOAD PHOTO</span>
                            </button>
                          </div>

                          {/* When Uploaded: Matching user's live thumbnail preview card */}
                          {item.file && (
                            <div className="pt-1">
                              <div className="relative group/thumb p-2 rounded-2xl bg-[#091524] border border-slate-700/80 shadow-md w-36 flex flex-col items-center animate-in fade-in zoom-in-95">
                                {/* Floating circular (X) button at top-right */}
                                <button
                                  type="button"
                                  onClick={() => removeOccFile(item.id)}
                                  title="Remove Photo"
                                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-700 hover:bg-rose-600 text-white flex items-center justify-center shadow transition-colors cursor-pointer z-10"
                                >
                                  <X size={12} />
                                </button>

                                {/* Photo Thumbnail */}
                                <div 
                                  onClick={() => setPreviewDocModal({
                                    isOpen: true,
                                    title: item.title,
                                    fileName: item.file!.name,
                                    fileSize: item.file!.size,
                                    previewUrl: item.file!.previewUrl,
                                    docCategory: 'QC Occupational Clearance',
                                    date: item.file!.date,
                                    docKey: item.id
                                  })}
                                  className="w-full h-22 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 cursor-pointer relative group-hover/thumb:border-blue-500 transition-colors flex items-center justify-center"
                                  title="Click to view full photo"
                                >
                                  <img
                                    src={item.file.previewUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-200"
                                  />
                                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                                    <Eye size={16} className="text-white drop-shadow" />
                                  </div>
                                </div>

                                {/* File Info */}
                                <div className="w-full text-center mt-1.5 px-1">
                                  <span className="font-mono text-[11px] font-semibold text-slate-200 block truncate" title={item.file.name}>
                                    {item.file.name}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                                    {item.file.size}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-5 sm:p-6 bg-transparent flex items-center justify-center pt-2 pb-6">
              {!occSubmitted && (
                <button 
                  type="button"
                  onClick={() => {
                    setOccSubmitted(true);
                  }}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl font-black shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all text-xs sm:text-sm"
                >
                  <span>Submit Work Permit Application</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BUSINESS INFORMATION SYSTEM (CTC REQUEST - QC E-SERVICES UPLOAD-FIRST) */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* SUB-VIEW: BUSINESS INFORMATION SYSTEM (CTC REQUEST - QC E-SERVICES)      */}
      {/* ========================================================================= */}
      {(currentView === 'ctc_pulling' || isBisModalOpen) && (
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 pb-12">
          {/* Hidden File Input for BIS / CTC Uploads */}
          <input 
            type="file" 
            ref={bisFileInputRef} 
            onChange={handleBisFileUpload} 
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" 
            className="hidden" 
          />

          {/* Top Navigation: Breadcrumb and Back Links */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <button 
              type="button"
              onClick={() => {
                resetBisForm();
                setIsBisModalOpen(false);
                setCurrentView('preview');
                navigate('/portal/business');
              }}
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors cursor-pointer text-left inline-flex items-center gap-1.5"
            >
              &larr; Back to Business Permit Hub
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
            {/* Header */}
            <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <h3 className="text-base sm:text-xl font-black tracking-wide uppercase text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Request Certified True Copy (CTC) / Business Certification</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Quezon City E-Services Citizen's Charter Compliant • Authenticated Electronic Document & Clearance Upload System
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-7 space-y-6 text-xs">
              {bisSubmitted ? (
                /* ================================================================= */
                /* SUCCESS VIEW: AUTHENTICATED CERTIFIED TRUE COPY (QC BPLD CTC)     */
                /* ================================================================= */
                <div className="space-y-6 py-2">
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
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 cursor-pointer transition-all"
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
                    <button
                      type="button"
                      onClick={() => {
                        resetBisForm();
                        setCurrentView('preview');
                        navigate('/portal/business');
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center justify-center cursor-pointer transition-colors"
                    >
                      Return to Permit Hub
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
                        <Search size={13} className="text-blue-600 dark:text-blue-400" />
                        <span>1. Verified Registered Business in QC BPLD</span>
                      </span>

                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="text" 
                        value={bisSearchQuery} 
                        onChange={(e) => {
                          setBisSearchQuery(e.target.value);
                          if (!e.target.value.trim()) setBisRecordFound(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (bisSearchQuery.trim()) setBisRecordFound(true);
                          }
                        }}
                        placeholder="Enter Permit No. or Business BIN (e.g. BP-2026-48190)..."
                        className="flex-1 p-2.5 border rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold" 
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          if (bisSearchQuery.trim()) {
                            setBisRecordFound(true);
                          }
                        }}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl font-bold cursor-pointer transition-all shrink-0 shadow-xs"
                      >
                        Verify Record
                      </button>
                    </div>

                    {bisRecordFound && bisSearchQuery.trim() && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Business Name</span>
                          <strong className="text-slate-900 dark:text-white">ABC Computer Shop & Trading</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Permit Reference</span>
                          <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                            {bisSearchQuery.trim().toUpperCase()}
                          </span>
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
                    )}
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
                          <UploadCloud size={15} className="text-blue-600 dark:text-blue-400" />
                          <span>3. Mandatory Document & ID Uploads</span>
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Upload clear photos or PDF scans. Allowed file types: <span className="font-bold text-slate-700 dark:text-slate-300">.pdf, .jpg, .jpeg, .png</span> (up to 15MB)
                        </p>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-between text-[11px] px-1">
                      <span className="text-slate-500">
                        Upload Progress: <strong className="text-slate-800 dark:text-slate-200">
                          {Object.values(bisFiles).filter(Boolean).length} / 3 Mandatory Files
                        </strong>
                      </span>
                      {Object.values(bisFiles).filter(Boolean).length >= 3 && (
                        <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
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
                          className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#071324] transition-all shadow-xs space-y-3"
                        >
                          {/* Top Header Row: Number, Badge, Title with asterisk & checkmark, and Status pill */}
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-slate-500 dark:text-slate-400 font-black text-xs sm:text-sm">
                                {index + 1}.
                              </span>
                              {item.required ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                  REQUIRED
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                  OPTIONAL / CONDITIONAL
                                </span>
                              )}
                              <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-1.5">
                                <span>{item.title} {item.required && '*'}</span>
                                {item.file && (
                                  <CheckCircle2 size={16} className="text-emerald-500 inline shrink-0" />
                                )}
                              </h4>
                            </div>

                            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                              item.file
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/80'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}>
                              Status: {item.file ? 'Uploaded' : 'NOT UPLOADED'}
                            </span>
                          </div>

                          {/* Description & Allowed Types */}
                          <div className="space-y-0.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {item.note && (
                              <p>{item.note}</p>
                            )}
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">
                              Allowed file types: JPG, JPEG, PNG, WEBP
                            </p>
                          </div>

                          {/* Action Button: UPLOAD PHOTO */}
                          <div>
                            <button
                              type="button"
                              onClick={() => {
                                setBisActiveUploadId(item.id);
                                bisFileInputRef.current?.click();
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide rounded-xl shadow-xs transition-all cursor-pointer"
                            >
                              <Upload size={13} />
                              <span>UPLOAD PHOTO</span>
                            </button>
                          </div>

                          {/* When Uploaded: Matching user's live thumbnail preview card */}
                          {item.file && (
                            <div className="pt-1">
                              <div className="relative group/thumb p-2 rounded-2xl bg-[#091524] border border-slate-700/80 shadow-md w-36 flex flex-col items-center animate-in fade-in zoom-in-95">
                                {/* Floating circular (X) button at top-right */}
                                <button
                                  type="button"
                                  onClick={() => removeBisFile(item.id)}
                                  title="Remove Photo"
                                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-700 hover:bg-rose-600 text-white flex items-center justify-center shadow transition-colors cursor-pointer z-10"
                                >
                                  <X size={12} />
                                </button>

                                {/* Photo Thumbnail */}
                                <div 
                                  onClick={() => setPreviewDocModal({
                                    isOpen: true,
                                    title: item.title,
                                    fileName: item.file!.name,
                                    fileSize: item.file!.size,
                                    previewUrl: item.file!.previewUrl,
                                    docCategory: 'QC BIS / CTC Attachment',
                                    date: item.file!.date,
                                    docKey: item.id
                                  })}
                                  className="w-full h-22 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 cursor-pointer relative group-hover/thumb:border-blue-500 transition-colors flex items-center justify-center"
                                  title="Click to view full photo"
                                >
                                  <img
                                    src={item.file.previewUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-200"
                                  />
                                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                                    <Eye size={16} className="text-white drop-shadow" />
                                  </div>
                                </div>

                                {/* File Info */}
                                <div className="w-full text-center mt-1.5 px-1">
                                  <span className="font-mono text-[11px] font-semibold text-slate-200 block truncate" title={item.file.name}>
                                    {item.file.name}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                                    {item.file.size}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-5 sm:p-6 bg-transparent flex items-center justify-center pt-2 pb-6">
              {!bisSubmitted && (
                <button 
                  type="button"
                  onClick={() => {
                    if (!bisFiles.owner_id || !bisFiles.permit_copy) {
                      loadSampleBisDocuments();
                    }
                    setBisSubmitted(true);
                  }}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl font-black shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all text-xs sm:text-sm"
                >
                  <span>Submit CTC Request & Authenticate</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW / MODAL 3: MAYOR'S PERMIT VERIFICATION (QC E-SERVICES / eBOSS)    */}
      {/* ========================================================================= */}
      {(currentView === 'verification' || isVerificationModalOpen) && (
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 pb-12">
          {/* Hidden File Input for QR Code Image Upload */}
          <input 
            type="file" 
            ref={qrFileInputRef} 
            onChange={handleQrFileUpload} 
            accept=".pdf,.jpg,.jpeg,.png,.webp" 
            className="hidden" 
          />

          {/* Breadcrumb Navigation & Back to Hub Header */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 px-1 pt-1">
            <button
              type="button"
              onClick={() => {
                resetVerification();
                setCurrentView('preview');
                setIsVerificationModalOpen(false);
                navigate('/portal/business');
              }}
              className="hover:text-blue-600 dark:hover:text-blue-400 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Return to Permit Hub</span>
            </button>
            <span className="text-slate-400 dark:text-slate-600">/</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">Mayor's Permit Verification</span>
          </div>

          {/* Main Card Container */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#071324] shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
            
            {/* Header Section */}
            <div className="space-y-1 pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2.5">
                <ShieldCheck size={26} className="text-blue-500" />
                <span>Mayor's Business Permit Verification &amp; QR Validation</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quezon City E-Services Citizen's Charter • Real-Time Database Validation for Businesses, Inspectors &amp; Public
              </p>
            </div>


            {/* SECTION 1: UNIFIED OMNI-SEARCH & SCANNER CONTROLS */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div>
                <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-2">
                  <Search size={14} className="text-blue-500" />
                  <span>1. Verify by Permit No., Business Name, or QR Code</span>
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Type any Mayor's Permit Number, BIN, or Registered Trade Name, or scan the permit's QR code:
                </p>
              </div>

              {/* Single Unified Input Row */}
              <div className="flex flex-col md:flex-row gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={verificationQuery}
                    onChange={(e) => {
                      setVerificationQuery(e.target.value);
                      if (!e.target.value.trim()) setVerificationResult(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (verificationQuery.trim()) {
                          setVerificationResult(true);
                        }
                      }
                    }}
                    placeholder="Enter Permit No., BIN, or Trade Name (e.g. MP-2026-48190, ABC Computer Shop)..."
                    className="w-full p-3 pr-9 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  {verificationQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setVerificationQuery('');
                        setVerificationResult(false);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                      title="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Direct Upload QR Photo Button */}
                <button
                  type="button"
                  onClick={() => qrFileInputRef.current?.click()}
                  title="Upload picture or scan of QR code"
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0"
                >
                  <Upload size={14} className="text-blue-500" />
                  <span>Upload QR Photo</span>
                </button>



                {/* Solid Blue VERIFY Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (verificationQuery.trim()) {
                      setVerificationResult(true);
                    } else {
                      setVerificationQuery('MP-2026-48190');
                      setVerificationResult(true);
                    }
                  }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-black uppercase tracking-wide cursor-pointer transition-all shrink-0 flex items-center justify-center gap-2 shadow-md shadow-blue-600/30"
                >
                  <Search size={14} />
                  <span>Verify Record</span>
                </button>
              </div>
            </div>

            {/* SECTION 2: VERIFIED OFFICIAL RECORD CARD (Directly displayed, no messy image left) */}
            {verificationResult && (
              <div className="p-6 sm:p-7 rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-50/20 via-white to-white dark:from-emerald-950/20 dark:via-[#091524] dark:to-[#091524] space-y-6 animate-in fade-in zoom-in-95 shadow-xl">
                
                {/* Status Header Banner */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200 dark:border-emerald-800/80">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <CheckCircle2 size={26} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg">
                          Official Mayor's Business Permit Validated
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Active Record</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Matched against Quezon City BPLO Master Registry • Encrypted Cryptographic QR Verified
                      </p>
                    </div>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0 shadow-xs">
                    Seal: <span className="text-emerald-600 dark:text-emerald-400">QC-BPLD-AUTH-2026</span>
                  </div>
                </div>

                {/* Registered Business Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white/90 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Business Trade Name</span>
                    <strong className="text-sm font-black text-slate-900 dark:text-white block mt-0.5">
                      ABC Computer Shop &amp; Trading
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mayor's Permit No.</span>
                    <span className="text-sm font-mono font-black text-blue-600 dark:text-blue-400 block mt-0.5">
                      {verificationQuery.trim().toUpperCase() || 'MP-2026-48190'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Business ID Number (BIN)</span>
                    <span className="text-sm font-mono font-black text-slate-800 dark:text-slate-200 block mt-0.5">
                      BIN-QC-2026-08192
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Owner / Taxpayer</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block mt-0.5">
                      Juan Santos Dela Cruz
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Business Address</span>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 block mt-0.5">
                      Unit 402, 123 Quezon Avenue, Brgy. San Antonio, QC
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registration Validity</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                      Valid until December 31, 2026
                    </span>
                  </div>
                </div>

                {/* Clearances Status Row */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span>Barangay Clearance: <strong>Cleared</strong></span>
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span>Sanitary / Health: <strong>Complied</strong></span>
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span>Fire Safety (FSIC): <strong>Issued</strong></span>
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span>Business Tax: <strong>Fully Paid (CY2026)</strong></span>
                  </span>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      </main>

      

    </div>
  );
};
