import React, { useState, useEffect, useRef } from 'react';
import {
  RefreshCw,
  Upload,
  Camera,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Search,
  Check,
  X,
  Eye,
  Download,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  User,
  Phone,
  Mail,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Plus,
  AlertCircle,
  FileCheck,
  History,
  Send,
  Building,
  ExternalLink,
  ChevronRight,
  Filter,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TabType } from '../types';

export interface RenewalDocItem {
  id: string;
  key: 'franchisePermit' | 'govId' | 'paymentProof' | 'vehicleDoc' | 'otherDoc';
  title: string;
  subtitle: string;
  iconName: string;
  required: boolean;
  fileName: string | null;
  fileType: string | null;
  fileSize: number | null;
  previewUrl: string | null;
  uploadedAt: string | null;
  qualityStatus: 'optimal' | 'warning_blur' | 'warning_dark' | 'warning_crop' | 'none';
  qualityMessage?: string;
  adminRemark?: string;
  status: 'pending' | 'accepted' | 'needs_correction';
}

export interface RenewalApplication {
  id: string;
  applicationNo: string;
  franchiseNo: string;
  ownerName: string;
  contactNo: string;
  email: string;
  vehicleType: string;
  plateNo: string;
  todaAssociation: string;
  dateSubmitted: string;
  status: 'Submitted' | 'Document Verification' | 'For Review' | 'Needs Correction' | 'Approved' | 'Renewed' | 'Rejected';
  statusStep: 1 | 2 | 3 | 4 | 5;
  documents: Record<string, RenewalDocItem>;
  correctionRemarks?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  auditTrail: {
    action: string;
    timestamp: string;
    actor: string;
    notes?: string;
  }[];
}

const INITIAL_RENEWAL_DOCS: Record<string, RenewalDocItem> = {
  franchisePermit: {
    id: 'doc-1',
    key: 'franchisePermit',
    title: '1. Previous Franchise Permit',
    subtitle: 'Upload your latest issued MTOP Franchise Certificate or Plate Decal',
    iconName: 'FileText',
    required: true,
    fileName: null,
    fileType: null,
    fileSize: null,
    previewUrl: null,
    uploadedAt: null,
    qualityStatus: 'none',
    status: 'pending'
  },
  govId: {
    id: 'doc-2',
    key: 'govId',
    title: '2. Valid Government ID',
    subtitle: "Professional Driver's License, PhilSys National ID, or Passport",
    iconName: 'User',
    required: true,
    fileName: null,
    fileType: null,
    fileSize: null,
    previewUrl: null,
    uploadedAt: null,
    qualityStatus: 'none',
    status: 'pending'
  },
  paymentProof: {
    id: 'doc-3',
    key: 'paymentProof',
    title: '3. Official Receipt / Payment Proof',
    subtitle: 'LGU City Treasurer Official Receipt or GovPay Electronic Receipt',
    iconName: 'Receipt',
    required: true,
    fileName: null,
    fileType: null,
    fileSize: null,
    previewUrl: null,
    uploadedAt: null,
    qualityStatus: 'none',
    status: 'pending'
  },
  vehicleDoc: {
    id: 'doc-4',
    key: 'vehicleDoc',
    title: '4. Vehicle Documents',
    subtitle: 'Current LTO Official Receipt (OR) and Certificate of Registration (CR)',
    iconName: 'Bus',
    required: true,
    fileName: null,
    fileType: null,
    fileSize: null,
    previewUrl: null,
    uploadedAt: null,
    qualityStatus: 'none',
    status: 'pending'
  }
};

const SAMPLE_FRANCHISES_DATABASE = [
  {
    franchiseNo: 'MTOP-2024-0099',
    ownerName: 'Rodrigo M. Alcantara',
    contactNo: '+63 919 777 3344',
    email: 'rodrigo.alcantara@example.com',
    vehicleType: 'Tricycle (MTOP)',
    plateNo: 'QC-44109',
    todaAssociation: 'Novaliches Bayan TODA (NBTODA)'
  },
  {
    franchiseNo: 'MTOP-2024-0319',
    ownerName: 'Ramon S. Bautista',
    contactNo: '+63 918 222 3344',
    email: 'ramon.bautista@example.com',
    vehicleType: 'Tricycle (MTOP)',
    plateNo: 'QC-77129',
    todaAssociation: 'Commonwealth TODA (COMTODA)'
  },
  {
    franchiseNo: 'MTOP-2025-0412',
    ownerName: 'Juan Dela Cruz',
    contactNo: '+63 917 889 1234',
    email: 'citizen@govserve.ph',
    vehicleType: 'Tricycle (MTOP)',
    plateNo: 'PH-48192',
    todaAssociation: 'Batasan Hills TODA (BHTODA)'
  },
  {
    franchiseNo: 'MTOP-2025-1102',
    ownerName: 'Elena V. Santos',
    contactNo: '+63 920 888 9911',
    email: 'elena.santos@example.com',
    vehicleType: 'E-Trike / Modern PUV',
    plateNo: 'EV-99014',
    todaAssociation: 'Batasan Hills Drivers & Operators (BHDOA)'
  },
  {
    franchiseNo: 'MTOP-2025-1490',
    ownerName: 'Danilo C. Ocampo',
    contactNo: '+63 917 444 8812',
    email: 'danilo.ocampo@example.com',
    vehicleType: 'Tricycle (MTOP)',
    plateNo: 'QC-33819',
    todaAssociation: 'Fairview TODA (FTODA)'
  }
];

const INITIAL_MOCK_APPLICATIONS: RenewalApplication[] = [
  {
    id: 'ren-app-001',
    applicationNo: 'AR-2025-00482',
    franchiseNo: 'MTOP-2024-0099',
    ownerName: 'Rodrigo M. Alcantara',
    contactNo: '+63 919 777 3344',
    email: 'rodrigo.alcantara@example.com',
    vehicleType: 'Tricycle (MTOP)',
    plateNo: 'QC-44109',
    todaAssociation: 'Novaliches Bayan TODA (NBTODA)',
    dateSubmitted: '2025-08-25',
    status: 'Needs Correction',
    statusStep: 4,
    correctionRemarks: 'Please upload a clearer picture of your Previous Franchise Permit (cut-off control seal).',
    reviewedBy: 'Atty. Gabriel Alfonso (MTFRB Officer)',
    reviewedAt: '2025-08-26',
    documents: {
      franchisePermit: {
        id: 'doc-s1',
        key: 'franchisePermit',
        title: '1. Previous Franchise Permit',
        subtitle: 'Latest issued MTOP Franchise Certificate',
        iconName: 'FileText',
        required: true,
        fileName: 'Franchise_Permit_2024_Rodrigo.jpg',
        fileType: 'image/jpeg',
        fileSize: 1420000,
        previewUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60',
        uploadedAt: '2025-08-25 10:14 AM',
        qualityStatus: 'warning_crop',
        qualityMessage: 'Putol ang ibabang selyo ng dokumento.',
        adminRemark: 'Please upload a clearer picture of the Franchise Permit.',
        status: 'needs_correction'
      },
      govId: {
        id: 'doc-s2',
        key: 'govId',
        title: '2. Valid Government ID',
        subtitle: "Professional Driver's License",
        iconName: 'User',
        required: true,
        fileName: 'Drivers_License_Alcantara.jpg',
        fileType: 'image/jpeg',
        fileSize: 980000,
        previewUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=60',
        uploadedAt: '2025-08-25 10:16 AM',
        qualityStatus: 'optimal',
        status: 'accepted'
      },
      paymentProof: {
        id: 'doc-s3',
        key: 'paymentProof',
        title: '3. Official Receipt / Payment Proof',
        subtitle: 'LGU City Treasurer Official Receipt',
        iconName: 'Receipt',
        required: true,
        fileName: 'LGU_Official_Receipt_1250.jpg',
        fileType: 'image/jpeg',
        fileSize: 840000,
        previewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60',
        uploadedAt: '2025-08-25 10:18 AM',
        qualityStatus: 'optimal',
        status: 'accepted'
      },
      vehicleDoc: {
        id: 'doc-s4',
        key: 'vehicleDoc',
        title: '4. Vehicle Documents',
        subtitle: 'LTO OR/CR for QC-44109',
        iconName: 'Bus',
        required: true,
        fileName: 'LTO_ORCR_Registration.pdf',
        fileType: 'image/jpeg',
        fileSize: 1850000,
        previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
        uploadedAt: '2025-08-25 10:20 AM',
        qualityStatus: 'optimal',
        status: 'accepted'
      }
    },
    auditTrail: [
      { action: 'Application Filed', timestamp: '2025-08-25 10:22 AM', actor: 'Rodrigo M. Alcantara (Applicant)' },
      { action: 'Initial Document OCR Completed', timestamp: '2025-08-25 10:23 AM', actor: 'GovServe Automated Engine' },
      { action: 'Deficiency Notice Issued', timestamp: '2025-08-26 09:15 AM', actor: 'Atty. Gabriel Alfonso (MTFRB Officer)', notes: 'Please upload a clearer picture of your Previous Franchise Permit (cut-off control seal).' }
    ]
  },
  {
    id: 'ren-app-002',
    applicationNo: 'AR-2025-00483',
    franchiseNo: 'MTOP-2024-0319',
    ownerName: 'Ramon S. Bautista',
    contactNo: '+63 918 222 3344',
    email: 'ramon.bautista@example.com',
    vehicleType: 'Tricycle (MTOP)',
    plateNo: 'QC-77129',
    todaAssociation: 'Commonwealth TODA (COMTODA)',
    dateSubmitted: '2025-08-26',
    status: 'Document Verification',
    statusStep: 2,
    documents: {
      franchisePermit: {
        id: 'doc-b1',
        key: 'franchisePermit',
        title: '1. Previous Franchise Permit',
        subtitle: 'Latest MTOP Certificate',
        iconName: 'FileText',
        required: true,
        fileName: 'MTOP_Permit_Bautista.jpg',
        fileType: 'image/jpeg',
        fileSize: 1200000,
        previewUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60',
        uploadedAt: '2025-08-26 02:10 PM',
        qualityStatus: 'optimal',
        status: 'pending'
      },
      govId: {
        id: 'doc-b2',
        key: 'govId',
        title: '2. Valid Government ID',
        subtitle: 'UMID Card',
        iconName: 'User',
        required: true,
        fileName: 'UMID_Card_Bautista.jpg',
        fileType: 'image/jpeg',
        fileSize: 920000,
        previewUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=60',
        uploadedAt: '2025-08-26 02:12 PM',
        qualityStatus: 'optimal',
        status: 'pending'
      },
      paymentProof: {
        id: 'doc-b3',
        key: 'paymentProof',
        title: '3. Official Receipt / Payment Proof',
        subtitle: 'Treasurer Receipt ₱1,250',
        iconName: 'Receipt',
        required: true,
        fileName: 'OR_Treasurer_Receipt.jpg',
        fileType: 'image/jpeg',
        fileSize: 760000,
        previewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60',
        uploadedAt: '2025-08-26 02:14 PM',
        qualityStatus: 'optimal',
        status: 'pending'
      },
      vehicleDoc: {
        id: 'doc-b4',
        key: 'vehicleDoc',
        title: '4. Vehicle Documents',
        subtitle: 'LTO OR/CR Document',
        iconName: 'Bus',
        required: true,
        fileName: 'LTO_ORCR_QC77129.jpg',
        fileType: 'image/jpeg',
        fileSize: 1650000,
        previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
        uploadedAt: '2025-08-26 02:16 PM',
        qualityStatus: 'optimal',
        status: 'pending'
      }
    },
    auditTrail: [
      { action: 'Application Filed', timestamp: '2025-08-26 02:20 PM', actor: 'Ramon S. Bautista (Applicant)' },
      { action: 'Queued for Document Verification', timestamp: '2025-08-26 02:21 PM', actor: 'System' }
    ]
  },
  {
    id: 'ren-app-003',
    applicationNo: 'AR-2025-00450',
    franchiseNo: 'MTOP-2025-1102',
    ownerName: 'Elena V. Santos',
    contactNo: '+63 920 888 9911',
    email: 'elena.santos@example.com',
    vehicleType: 'E-Trike / Modern PUV',
    plateNo: 'EV-99014',
    todaAssociation: 'Batasan Hills Drivers & Operators (BHDOA)',
    dateSubmitted: '2025-08-20',
    status: 'Renewed',
    statusStep: 5,
    reviewedBy: 'Engr. Vicente Mendoza (Traffic Board)',
    reviewedAt: '2025-08-21',
    documents: {
      franchisePermit: {
        id: 'doc-e1',
        key: 'franchisePermit',
        title: '1. Previous Franchise Permit',
        subtitle: 'Latest MTOP Certificate',
        iconName: 'FileText',
        required: true,
        fileName: 'Elena_Santos_Franchise.jpg',
        fileType: 'image/jpeg',
        fileSize: 1100000,
        previewUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60',
        uploadedAt: '2025-08-20 09:30 AM',
        qualityStatus: 'optimal',
        status: 'accepted'
      },
      govId: {
        id: 'doc-e2',
        key: 'govId',
        title: '2. Valid Government ID',
        subtitle: 'Philippine Passport',
        iconName: 'User',
        required: true,
        fileName: 'Passport_Elena.jpg',
        fileType: 'image/jpeg',
        fileSize: 900000,
        previewUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=60',
        uploadedAt: '2025-08-20 09:32 AM',
        qualityStatus: 'optimal',
        status: 'accepted'
      },
      paymentProof: {
        id: 'doc-e3',
        key: 'paymentProof',
        title: '3. Official Receipt / Payment Proof',
        subtitle: 'Official Receipt',
        iconName: 'Receipt',
        required: true,
        fileName: 'OR_Elena_Paid.jpg',
        fileType: 'image/jpeg',
        fileSize: 780000,
        previewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60',
        uploadedAt: '2025-08-20 09:34 AM',
        qualityStatus: 'optimal',
        status: 'accepted'
      },
      vehicleDoc: {
        id: 'doc-e4',
        key: 'vehicleDoc',
        title: '4. Vehicle Documents',
        subtitle: 'LTO OR/CR EV-99014',
        iconName: 'Bus',
        required: true,
        fileName: 'ORCR_EV_99014.jpg',
        fileType: 'image/jpeg',
        fileSize: 1400000,
        previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
        uploadedAt: '2025-08-20 09:36 AM',
        qualityStatus: 'optimal',
        status: 'accepted'
      }
    },
    auditTrail: [
      { action: 'Application Filed', timestamp: '2025-08-20 09:40 AM', actor: 'Elena V. Santos' },
      { action: 'All Documents Validated', timestamp: '2025-08-20 11:15 AM', actor: 'Automated OCR Engine' },
      { action: 'Franchise Renewed & QR Decal Generated', timestamp: '2025-08-21 02:00 PM', actor: 'Engr. Vicente Mendoza (Traffic Board)' }
    ]
  }
];

interface FranchiseAnnualRenewalModuleProps {
  onBackToPortal?: () => void;
  onNavigateToTab?: (tab: TabType | string) => void;
  initialMode?: 'user_flow' | 'admin_dashboard';
}

export const FranchiseAnnualRenewalModule: React.FC<FranchiseAnnualRenewalModuleProps> = ({
  onBackToPortal,
  onNavigateToTab,
  initialMode
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Mode: 'wizard' (the 5-step flow) | 'admin' (admin view)
  const [currentMode, setCurrentMode] = useState<'wizard' | 'admin'>(
    initialMode === 'admin_dashboard' || (isAdmin && !initialMode) ? 'admin' : 'wizard'
  );

  // Persistence Key
  const STORAGE_KEY = 'govserve_franchise_renewal_apps_v2';
  const [applications, setApplications] = useState<RenewalApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_MOCK_APPLICATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [applications]);

  // WIZARD STATE (5 Steps)
  // Step 1: Start
  // Step 2: Franchise Information
  // Step 3: Document Upload
  // Step 4: Review Application
  // Step 5: Submission Success
  const [wizardStep, setWizardStep] = useState<number>(1);

  // Step 2 Form States
  const [franchiseNo, setFranchiseNo] = useState<string>('MTOP-2025-0412');
  const [ownerName, setOwnerName] = useState<string>(user?.name || 'Juan Dela Cruz');
  const [contactNo, setContactNo] = useState<string>('+63 917 889 1234');
  const [email, setEmail] = useState<string>(user?.email || 'citizen@govserve.ph');
  const [vehicleType, setVehicleType] = useState<string>('Tricycle (MTOP)');
  const [plateNo, setPlateNo] = useState<string>('PH-48192');
  const [todaAssociation, setTodaAssociation] = useState<string>('Batasan Hills TODA (BHTODA)');

  // Step 3 Document Upload States
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, RenewalDocItem>>(INITIAL_RENEWAL_DOCS);
  const [activeUploadTarget, setActiveUploadTarget] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Step 4 Confirmation Dialog
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState<boolean>(false);

  // Step 5 Result Details
  const [submittedApp, setSubmittedApp] = useState<RenewalApplication | null>(null);

  // Re-Upload / Correction Modal for user
  const [correctionModalApp, setCorrectionModalApp] = useState<RenewalApplication | null>(null);
  const [correctionTargetDoc, setCorrectionTargetDoc] = useState<string>('franchisePermit');

  // ADMIN STATES
  const [adminSearch, setAdminSearch] = useState<string>('');
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>('All');
  const [selectedAdminApp, setSelectedAdminApp] = useState<RenewalApplication | null>(null);
  const [remarksModalOpen, setRemarksModalOpen] = useState<boolean>(false);
  const [adminRemarksText, setAdminRemarksText] = useState<string>('');
  const [remarksError, setRemarksError] = useState<string | null>(null);

  // Zoom & Image Viewer Modal
  const [zoomModalOpen, setZoomModalOpen] = useState<boolean>(false);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
  const [zoomImageTitle, setZoomImageTitle] = useState<string>('');
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [zoomRotation, setZoomRotation] = useState<number>(0);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Auto-Fill Handler from Franchise Number
  const handleAutoFillByFranchise = (numberToLookup: string) => {
    setFranchiseNo(numberToLookup);
    const found = SAMPLE_FRANCHISES_DATABASE.find(
      f => f.franchiseNo.trim().toLowerCase() === numberToLookup.trim().toLowerCase()
    );
    if (found) {
      setOwnerName(found.ownerName);
      setContactNo(found.contactNo);
      setEmail(found.email);
      setVehicleType(found.vehicleType);
      setPlateNo(found.plateNo);
      setTodaAssociation(found.todaAssociation);
    }
  };

  // Simulate Smart Quality Inspection on uploaded file
  const evaluatePhotoQuality = (file: File): { status: 'optimal' | 'warning_blur' | 'warning_dark' | 'warning_crop'; message?: string } => {
    // Simulated smart heuristic based on size / name
    const randomSeed = file.name.length % 4;
    if (file.size < 40000) {
      return {
        status: 'warning_blur',
        message: 'Malabo ang larawan. Paki-upload muli ang mas malinaw na picture.'
      };
    }
    if (randomSeed === 1 && file.name.toLowerCase().includes('dark')) {
      return {
        status: 'warning_dark',
        message: 'Masyadong madilim ang kuha. Paki-upload ang may sapat na ilaw.'
      };
    }
    return {
      status: 'optimal',
      message: 'Malinaw at kumpleto ang dokumento.'
    };
  };

  // Handle File Input Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      alert('Sukat ng file ay lumampas sa 25MB limit.');
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Ang pinapayagan lamang ay JPG, PNG, o PDF file.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const quality = evaluatePhotoQuality(file);

    setUploadedDocs(prev => ({
      ...prev,
      [docKey]: {
        ...prev[docKey],
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        previewUrl: objectUrl,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        qualityStatus: quality.status,
        qualityMessage: quality.message,
        status: 'pending'
      }
    }));

    showToast(`✅ Na-upload ang ${uploadedDocs[docKey]?.title || docKey}!`);
    e.target.value = '';
  };

  // Remove uploaded file
  const handleRemoveFile = (docKey: string) => {
    setUploadedDocs(prev => ({
      ...prev,
      [docKey]: {
        ...prev[docKey],
        fileName: null,
        fileType: null,
        fileSize: null,
        previewUrl: null,
        uploadedAt: null,
        qualityStatus: 'none',
        qualityMessage: undefined
      }
    }));
  };

  // Start Camera
  const startCamera = async (docKey: string) => {
    setActiveUploadTarget(docKey);
    setIsCameraActive(true);
    setCameraLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      // Fallback if camera not permitted / available: simulated camera snapshot
      console.warn('Real webcam not accessible; simulated capture will be offered.');
    } finally {
      setCameraLoading(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setActiveUploadTarget(null);
  };

  // Capture Snapshot from Camera
  const capturePhoto = () => {
    if (!activeUploadTarget) return;

    let snapshotUrl = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60';
    if (activeUploadTarget === 'govId') {
      snapshotUrl = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=60';
    } else if (activeUploadTarget === 'paymentProof') {
      snapshotUrl = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60';
    } else if (activeUploadTarget === 'vehicleDoc') {
      snapshotUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60';
    }

    // If real video element is active, capture onto canvas
    if (videoRef.current && videoRef.current.videoWidth > 0) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          snapshotUrl = canvas.toDataURL('image/jpeg', 0.9);
        }
      } catch (err) {
        console.warn('Canvas capture error:', err);
      }
    }

    setUploadedDocs(prev => ({
      ...prev,
      [activeUploadTarget]: {
        ...prev[activeUploadTarget],
        fileName: `Photo_Capture_${activeUploadTarget}_${Date.now()}.jpg`,
        fileType: 'image/jpeg',
        fileSize: 1250000,
        previewUrl: snapshotUrl,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        qualityStatus: 'optimal',
        qualityMessage: 'Malinaw at kumpleto ang larawan.',
        status: 'pending'
      }
    }));

    stopCamera();
    showToast('📸 Matagumpay na nakuha ang larawan!');
  };

  // Submit Renewal Application (Step 4 -> 5)
  const handleConfirmSubmit = () => {
    setConfirmSubmitOpen(false);

    const newAppNo = `AR-2025-${Math.floor(10000 + Math.random() * 90000)}`;
    const newRecord: RenewalApplication = {
      id: `ren-app-${Date.now()}`,
      applicationNo: newAppNo,
      franchiseNo: franchiseNo.trim() || 'MTOP-2025-0412',
      ownerName: ownerName.trim() || 'Juan Dela Cruz',
      contactNo: contactNo.trim() || '+63 917 889 1234',
      email: email.trim() || 'citizen@govserve.ph',
      vehicleType,
      plateNo,
      todaAssociation,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      statusStep: 1,
      documents: { ...uploadedDocs },
      auditTrail: [
        {
          action: 'Renewal Application Submitted',
          timestamp: new Date().toLocaleString(),
          actor: `${ownerName} (Applicant)`,
          notes: 'Upload-based annual renewal filed with 4+ verified documents.'
        }
      ]
    };

    setApplications(prev => [newRecord, ...prev]);
    setSubmittedApp(newRecord);
    setWizardStep(5);
    showToast('🎉 Tagumpay na naisumite ang iyong Franchise Renewal!');
  };

  // Download Acknowledgement Receipt
  const handleDownloadReceipt = (app: RenewalApplication) => {
    const text = `========================================================================================
REPUBLIC OF THE PHILIPPINES • CITY GOVERNMENT OF QUEZON CITY
MUNICIPAL TRANSPORT & FRANCHISING REGULATORY BOARD (MTFRB)
========================================================================================
FRANCHISE RENEWAL ACKNOWLEDGEMENT RECEIPT

TRANSACTION CODE        : ${app.applicationNo}
FRANCHISE NUMBER (MTOP) : ${app.franchiseNo}
DATE SUBMITTED          : ${app.dateSubmitted}
APPLICATION STATUS      : ${app.status.toUpperCase()}
----------------------------------------------------------------------------------------
REGISTERED OWNER / OPERATOR:
Name                    : ${app.ownerName}
Contact Mobile          : ${app.contactNo}
Email Address           : ${app.email}
Transport Organization  : ${app.todaAssociation}
Authorized Vehicle Type : ${app.vehicleType}
Vehicle Plate / Body    : ${app.plateNo}
----------------------------------------------------------------------------------------
UPLOADED DOCUMENTS SUMMARY:
1. Previous Franchise Permit : ${app.documents.franchisePermit?.fileName ? 'VERIFIED ATTACHED' : 'NONE'}
2. Valid Government ID       : ${app.documents.govId?.fileName ? 'VERIFIED ATTACHED' : 'NONE'}
3. Official Receipt / Payment: ${app.documents.paymentProof?.fileName ? 'VERIFIED ATTACHED' : 'NONE'}
4. Vehicle Documents (OR/CR) : ${app.documents.vehicleDoc?.fileName ? 'VERIFIED ATTACHED' : 'NONE'}
5. Other Endorsements        : ${app.documents.otherDoc?.fileName ? 'VERIFIED ATTACHED' : 'NOT APPLICABLE'}
----------------------------------------------------------------------------------------
IMPORTANT REMINDERS:
- Keep this official acknowledgement receipt for your records.
- Track status anytime via the GovServe portal using your Reference Code: ${app.applicationNo}.
- You will receive an SMS and email notification once review is completed.

DIGITAL AUDIT SIGNATURE : QC-MTFRB-RENEWAL-${app.applicationNo}-VALIDATED
========================================================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QC_Franchise_Renewal_Receipt_${app.applicationNo}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('⬇️ Na-download ang Acknowledgement Receipt!');
  };

  // User re-uploads a corrected document
  const handleExecuteCorrectionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !correctionModalApp) return;

    const objectUrl = URL.createObjectURL(file);
    const updatedDocs = {
      ...correctionModalApp.documents,
      [correctionTargetDoc]: {
        ...correctionModalApp.documents[correctionTargetDoc],
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        previewUrl: objectUrl,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        qualityStatus: 'optimal' as const,
        qualityMessage: 'Malinaw at kumpleto ang bagong upload.',
        status: 'pending' as const
      }
    };

    const updatedApp: RenewalApplication = {
      ...correctionModalApp,
      status: 'Document Verification',
      statusStep: 2,
      documents: updatedDocs,
      correctionRemarks: undefined,
      auditTrail: [
        {
          action: `Resubmitted Corrected Document: ${updatedDocs[correctionTargetDoc]?.title || correctionTargetDoc}`,
          timestamp: new Date().toLocaleString(),
          actor: `${correctionModalApp.ownerName} (Applicant)`,
          notes: `Uploaded new clear copy: ${file.name}`
        },
        ...correctionModalApp.auditTrail
      ]
    };

    setApplications(prev => prev.map(a => a.id === updatedApp.id ? updatedApp : a));
    setCorrectionModalApp(null);
    showToast('✅ Matagumpay na na-upload ang bagong dokumento! Binalik sa verification.');
  };

  // ADMIN ACTIONS
  const handleAdminApprove = (app: RenewalApplication) => {
    const updated: RenewalApplication = {
      ...app,
      status: 'Renewed',
      statusStep: 5,
      reviewedBy: user?.name || 'LGU Licensing Officer',
      reviewedAt: new Date().toISOString().split('T')[0],
      auditTrail: [
        {
          action: 'Franchise Renewal Approved',
          timestamp: new Date().toLocaleString(),
          actor: user?.name || 'LGU Licensing Officer',
          notes: 'All documents verified and compliant. Digital QR validation decal officially renewed.'
        },
        ...app.auditTrail
      ]
    };
    setApplications(prev => prev.map(a => a.id === app.id ? updated : a));
    setSelectedAdminApp(updated);
    showToast(`✅ Approved MTOP ${app.franchiseNo}! Application marked as Renewed.`);
  };

  const handleAdminReject = (app: RenewalApplication) => {
    const reason = prompt('Please enter reason for rejection:', 'Unverified records or non-compliant vehicle specifications');
    if (!reason) return;

    const updated: RenewalApplication = {
      ...app,
      status: 'Rejected',
      statusStep: 4,
      correctionRemarks: reason,
      reviewedBy: user?.name || 'LGU Licensing Officer',
      reviewedAt: new Date().toISOString().split('T')[0],
      auditTrail: [
        {
          action: 'Franchise Renewal Rejected',
          timestamp: new Date().toLocaleString(),
          actor: user?.name || 'LGU Licensing Officer',
          notes: reason
        },
        ...app.auditTrail
      ]
    };
    setApplications(prev => prev.map(a => a.id === app.id ? updated : a));
    setSelectedAdminApp(updated);
    showToast(`❌ Rejected MTOP ${app.franchiseNo}. Notice dispatched.`);
  };

  const handleOpenRemarksModal = (app: RenewalApplication) => {
    setSelectedAdminApp(app);
    setAdminRemarksText('Please upload a clearer picture of the Franchise Permit.');
    setRemarksError(null);
    setRemarksModalOpen(true);
  };

  const handleConfirmCorrectionRequest = () => {
    if (!adminRemarksText.trim()) {
      setRemarksError('Required ang Remarks / Reason bago humingi ng correction.');
      return;
    }
    if (!selectedAdminApp) return;

    const updated: RenewalApplication = {
      ...selectedAdminApp,
      status: 'Needs Correction',
      statusStep: 4,
      correctionRemarks: adminRemarksText.trim(),
      reviewedBy: user?.name || 'LGU Licensing Officer',
      reviewedAt: new Date().toISOString().split('T')[0],
      auditTrail: [
        {
          action: 'Correction Requested',
          timestamp: new Date().toLocaleString(),
          actor: user?.name || 'LGU Licensing Officer',
          notes: adminRemarksText.trim()
        },
        ...selectedAdminApp.auditTrail
      ]
    };

    setApplications(prev => prev.map(a => a.id === selectedAdminApp.id ? updated : a));
    setSelectedAdminApp(updated);
    setRemarksModalOpen(false);
    showToast(`⚠️ Humingi ng correction para sa ${selectedAdminApp.franchiseNo}.`);
  };

  // Open Image Zoom Modal
  const openZoomModal = (url: string | null, title: string) => {
    if (!url) return;
    setZoomImageUrl(url);
    setZoomImageTitle(title);
    setZoomScale(1);
    setZoomRotation(0);
    setZoomModalOpen(true);
  };

  // Filter admin applications
  const filteredAdminApps = applications.filter(a => {
    const q = adminSearch.toLowerCase().trim();
    const matchesSearch =
      a.franchiseNo.toLowerCase().includes(q) ||
      a.ownerName.toLowerCase().includes(q) ||
      a.applicationNo.toLowerCase().includes(q);
    const matchesStatus = adminStatusFilter === 'All' || a.status === adminStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // User dashboard metric counts
  const activeCount = 1; // current demo active franchise
  const pendingCount = applications.filter(a => a.status === 'Submitted' || a.status === 'Document Verification' || a.status === 'For Review' || a.status === 'Needs Correction').length;
  const historyCount = applications.filter(a => a.status === 'Renewed' || a.status === 'Rejected').length;

  return (
    <div className="space-y-8 animate-in fade-in pb-12">

      {/* Global Toast */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center space-x-2.5 animate-bounce">
          <Sparkles size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5-STEP UPLOAD-BASED FRANCHISE RENEWAL WIZARD */}
      {/* ========================================================================= */}
      {currentMode === 'wizard' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 animate-in fade-in">
          
          {/* Progress Indicator */}
          <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5">
                {isAdmin && (
                  <button
                    onClick={() => setCurrentMode('admin')}
                    className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <ShieldCheck size={13} />
                    <span>Admin Review</span>
                  </button>
                )}
                <span className="font-black text-emerald-600 uppercase tracking-wider">
                  Step {wizardStep} of 5
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${(wizardStep / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 1: START ANNUAL RENEWAL */}
          {/* ----------------------------------------------------------------------- */}
          {wizardStep === 1 && (
            <div className="space-y-8 max-w-2xl mx-auto text-center py-6 animate-in fade-in">
              <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <RefreshCw size={40} className="stroke-[2.5]" />
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Franchise Renewal Online
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto font-medium">
                  "Please prepare clear photos of your required documents before starting."
                </p>
              </div>

              {/* Requirement Checklist Icons Preview */}
              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-left space-y-3">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Quick Checklist Before Starting:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>Previous Franchise Permit (MTOP)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>Valid Government ID or Driver's License</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>Official Receipt of Payment (Treasurer OR)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>LTO Official Receipt &amp; Certificate of Registration (OR/CR)</span>
                  </div>
                </div>
              </div>

              {/* Big START Button & Cancel Button */}
              <div className="pt-4 flex flex-col items-center gap-3">
                <button
                  onClick={() => setWizardStep(2)}
                  className="w-full sm:w-auto px-10 py-5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-2xl text-base font-black shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-3 mx-auto cursor-pointer"
                >
                  <span>START FRANCHISE RENEWAL</span>
                  <ArrowRight size={20} />
                </button>

                {onBackToPortal && (
                  <button
                    type="button"
                    onClick={onBackToPortal}
                    className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft size={16} />
                    <span>Back to Portal</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 2: FRANCHISE INFORMATION */}
          {/* ----------------------------------------------------------------------- */}
          {wizardStep === 2 && (
            <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Franchise &amp; Owner Information
                </h3>
                <p className="text-xs text-slate-500">
                  Please review and verify your registered franchise details and owner information before proceeding.
                </p>
              </div>

              {/* Minimal Form Fields */}
              <div className="space-y-4 text-xs">
                {/* Field 1: Franchise/Permit Number */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Franchise / Permit Number *
                  </label>
                  <div className="relative">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={franchiseNo}
                      onChange={(e) => handleAutoFillByFranchise(e.target.value)}
                      placeholder="e.g. MTOP-2025-0412"
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Field 2: Owner Name */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Owner Name *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Enter registered owner name"
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Field 3: Contact Number */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Contact Number *
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={contactNo}
                      onChange={(e) => setContactNo(e.target.value)}
                      placeholder="e.g. +63 917 889 1234"
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Field 4: Email Address */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. citizen@govserve.ph"
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer flex items-center space-x-1"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!franchiseNo || !ownerName) {
                      alert('Paki-fill up ang Franchise Number at Owner Name.');
                      return;
                    }
                    setWizardStep(3);
                  }}
                  className="px-7 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <span>Next: Upload Documents</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 3: DOCUMENT UPLOAD (PICTURE UPLOAD) */}
          {/* ----------------------------------------------------------------------- */}
          {wizardStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Document Picture Upload
                </h3>
                <p className="text-xs text-slate-500">
                  Simply upload a clear photo of each required document. The system includes an automated photo quality checker.
                </p>
              </div>

              {/* Camera Modal (Mobile or Web Camera) */}
              {isCameraActive && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full space-y-4 border border-slate-700 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Camera size={18} className="text-emerald-500" />
                        Take Live Document Photo
                      </span>
                      <button onClick={stopCamera} className="p-1 rounded-full text-slate-400 hover:text-white">
                        <X size={18} />
                      </button>
                    </div>

                    <div className="relative aspect-4/3 bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                      {cameraLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xs">
                          Loading camera...
                        </div>
                      )}
                      {/* Document frame viewfinder overlay */}
                      <div className="absolute inset-6 border-2 border-dashed border-emerald-400/70 rounded-xl pointer-events-none flex items-end justify-center pb-2">
                        <span className="text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full font-mono">
                          I-frame ang buong dokumento dito
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        onClick={stopCamera}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={capturePhoto}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-emerald-600/30"
                      >
                        <Camera size={16} />
                        <span>Kumuha ng Larawan (Capture)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 5 Distinct Upload Boxes / Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Object.keys(uploadedDocs).map((key) => {
                  const item = uploadedDocs[key];
                  const hasFile = Boolean(item.previewUrl);

                  return (
                    <div
                      key={key}
                      className={`p-5 rounded-3xl border transition-all space-y-4 relative ${
                        hasFile
                          ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800 shadow-sm'
                          : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                        {!hasFile ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                            ○ Not uploaded
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 size={13} />
                            ✓ Uploaded
                          </span>
                        )}
                      </div>

                      {/* File State: Already Uploaded with Preview */}
                      {hasFile ? (
                        <div className="space-y-3">
                          <div className="relative aspect-16/9 bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                            <img
                              src={item.previewUrl || ''}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            {/* Hover overlay actions */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => openZoomModal(item.previewUrl, item.title)}
                                className="px-3 py-1.5 bg-white text-slate-900 rounded-xl text-[11px] font-bold flex items-center space-x-1 shadow-md cursor-pointer"
                              >
                                <Eye size={12} />
                                <span>Preview</span>
                              </button>
                            </div>
                          </div>

                          {/* File info bar & quality check notice */}
                          <div className="flex items-center justify-between text-[11px] px-1">
                            <span className="font-mono text-slate-600 dark:text-slate-300 truncate max-w-[180px]">
                              {item.fileName}
                            </span>
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 size={12} /> Ready
                            </span>
                          </div>

                          {/* Smart Photo Quality Warning Banner */}
                          {item.qualityStatus === 'warning_blur' && (
                            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-[11px] text-amber-800 dark:text-amber-200 flex items-start space-x-2">
                              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                              <span>{item.qualityMessage || 'Malabo ang larawan. Paki-upload muli ang mas malinaw na picture.'}</span>
                            </div>
                          )}

                          {item.qualityStatus === 'warning_crop' && (
                            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-[11px] text-amber-800 dark:text-amber-200 flex items-start space-x-2">
                              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                              <span>Siguraduhing kita ang buong document bago mag-submit.</span>
                            </div>
                          )}

                          {/* Action Buttons: Retake / Replace / Remove */}
                          <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <button
                              type="button"
                              onClick={() => startCamera(key)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1"
                            >
                              <Camera size={12} />
                              <span>Retake</span>
                            </button>

                            <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1">
                              <RefreshCw size={12} />
                              <span>Replace</span>
                              <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, key)}
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => handleRemoveFile(key)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-all cursor-pointer"
                              title="Remove"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Not Yet Uploaded: Large Upload Box */
                        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center space-y-3 transition-all bg-white dark:bg-slate-900/60">
                          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                            <Camera size={22} />
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              Take a photo or upload file
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Accepted: JPG, JPEG, PNG, PDF up to 25MB
                            </p>
                          </div>

                          {/* Dual Action: Take Photo (Camera) OR Upload from Device */}
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => startCamera(key)}
                              className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                            >
                              <Camera size={14} />
                              <span>Take Photo</span>
                            </button>

                            <label className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer">
                              <Upload size={14} />
                              <span>Upload from Device</span>
                              <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, key)}
                              />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer flex items-center space-x-1"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  disabled={(() => {
                    const requiredKeys = ['franchisePermit', 'govId', 'paymentProof', 'vehicleDoc'];
                    return requiredKeys.some(k => !uploadedDocs[k]?.previewUrl);
                  })()}
                  onClick={() => {
                    setWizardStep(4);
                  }}
                  className={`px-7 py-3 rounded-xl text-xs sm:text-sm font-black shadow-lg transition-all flex items-center space-x-2 ${
                    ['franchisePermit', 'govId', 'paymentProof', 'vehicleDoc'].every(k => uploadedDocs[k]?.previewUrl)
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                      : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Review Application</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 4: REVIEW APPLICATION */}
          {/* ----------------------------------------------------------------------- */}
          {wizardStep === 4 && (
            <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Franchise Renewal Application Review
                </h3>
                <p className="text-xs text-slate-500">
                  Please verify that your franchise details are correct and all attached documents are complete.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Franchise Number</span>
                    <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                      {franchiseNo}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Owner Name</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {ownerName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Contact Number</span>
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                      {contactNo}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Email Address</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {email}
                    </span>
                  </div>
                </div>

                {/* Documents Checklist Review */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                    Attached Documents Checklist:
                  </span>
                  <div className="space-y-2">
                    {Object.keys(uploadedDocs).map(k => {
                      const item = uploadedDocs[k];
                      const isAttached = Boolean(item.previewUrl);
                      if (!isAttached && !item.required) return null;

                      return (
                        <div
                          key={k}
                          className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                        >
                          <div className="flex items-center space-x-2.5">
                            {isAttached ? (
                              <CheckCircle2 size={16} className="text-emerald-500" />
                            ) : (
                              <X size={16} className="text-rose-500" />
                            )}
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {item.title}
                            </span>
                          </div>
                          {isAttached && (
                            <button
                              type="button"
                              onClick={() => openZoomModal(item.previewUrl, item.title)}
                              className="text-[11px] font-bold text-emerald-600 flex items-center space-x-1"
                            >
                              <Eye size={12} />
                              <span>View</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Big Action Submit Button */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setWizardStep(3)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer flex items-center space-x-1"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConfirmSubmitOpen(true)}
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-black shadow-xl shadow-emerald-600/30 transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Send size={16} />
                  <span>SUBMIT RENEWAL APPLICATION</span>
                </button>
              </div>

              {/* Confirmation Modal */}
              {confirmSubmitOpen && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 text-center shadow-2xl">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center font-bold">
                      <HelpCircle size={28} />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        Are you sure you want to submit your Franchise Renewal?
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Pakitiyak na tama ang iyong mga detalye at malinaw ang lahat ng nakalakip na dokumento.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => setConfirmSubmitOpen(false)}
                        className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        CANCEL
                      </button>
                      <button
                        onClick={handleConfirmSubmit}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                      >
                        YES, SUBMIT
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 5: SUBMISSION SUCCESS */}
          {/* ----------------------------------------------------------------------- */}
          {wizardStep === 5 && submittedApp && (
            <div className="space-y-8 max-w-xl mx-auto text-center py-6 animate-in fade-in">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-xl shadow-emerald-600/20">
                <CheckCircle2 size={44} className="stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white block">
                  🎉 Renewal Application Submitted!
                </span>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  "Your Franchise Renewal application has been successfully submitted."
                </p>
              </div>

              {/* Receipt Details Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 text-left space-y-3.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Application Number</span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    {submittedApp.applicationNo}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Franchise Number</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {submittedApp.franchiseNo}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Date Submitted</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {submittedApp.dateSubmitted}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Application Status</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300">
                    Pending Review
                  </span>
                </div>
              </div>

              {/* Action Button: BACK TO PORTAL */}
              <div className="flex items-center justify-center pt-4">
                <button
                  onClick={() => {
                    if (onBackToPortal) onBackToPortal();
                    else setWizardStep(1);
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 hover:dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  BACK TO PORTAL
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ADMIN DASHBOARD SIDE */}
      {/* ========================================================================= */}
      {currentMode === 'admin' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Admin Header with Filters & Search */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCurrentMode('wizard')}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer shrink-0"
                >
                  <ArrowLeft size={14} />
                  <span>Citizen View</span>
                </button>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck size={20} className="text-emerald-600" />
                    <span>Admin Renewal Review Console</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Search, review uploaded documents, zoom verification images, approve or request corrections.
                  </p>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['All', 'Submitted', 'Document Verification', 'Needs Correction', 'Renewed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setAdminStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      adminStatusFilter === status
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Search by Franchise Number (MTOP), Owner Name, or Application Ref..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Applications Grid / Table View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 5 Cols: Application List */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Submitted Applications ({filteredAdminApps.length})
              </span>

              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                {filteredAdminApps.map((app) => {
                  const isSelected = selectedAdminApp?.id === app.id;
                  return (
                    <div
                      key={app.id}
                      onClick={() => setSelectedAdminApp(app)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-xs text-slate-900 dark:text-white">
                          {app.franchiseNo}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'Renewed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Needs Correction'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {app.ownerName}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span>Ref: {app.applicationNo}</span>
                        <span>{app.dateSubmitted}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 7 Cols: Detailed Application Review Panel */}
            <div className="lg:col-span-7">
              {selectedAdminApp ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                  
                  {/* Header Details */}
                  <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-mono font-black text-lg text-slate-900 dark:text-white">
                          {selectedAdminApp.franchiseNo}
                        </h4>
                        <span className="text-xs font-mono font-semibold text-slate-400">
                          ({selectedAdminApp.applicationNo})
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                        {selectedAdminApp.ownerName} • {selectedAdminApp.todaAssociation}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {selectedAdminApp.contactNo} • {selectedAdminApp.email}
                      </p>
                    </div>

                    {/* Admin Action Buttons */}
                    <div className="flex items-center gap-2">
                      {selectedAdminApp.status !== 'Renewed' && (
                        <>
                          <button
                            onClick={() => handleAdminApprove(selectedAdminApp)}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all flex items-center space-x-1"
                          >
                            <Check size={14} />
                            <span>Approve</span>
                          </button>

                          <button
                            onClick={() => handleOpenRemarksModal(selectedAdminApp)}
                            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all flex items-center space-x-1"
                          >
                            <AlertTriangle size={14} />
                            <span>Request Correction</span>
                          </button>

                          <button
                            onClick={() => handleAdminReject(selectedAdminApp)}
                            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all flex items-center space-x-1"
                          >
                            <X size={14} />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Uploaded Documents Gallery with Zoom */}
                  <div className="space-y-3">
                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
                      Uploaded Documents for Inspection
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.keys(selectedAdminApp.documents).map((key) => {
                        const doc = selectedAdminApp.documents[key];
                        if (!doc?.previewUrl) return null;

                        return (
                          <div
                            key={key}
                            className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5"
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                                {doc.title}
                              </span>
                              <button
                                onClick={() => openZoomModal(doc.previewUrl, doc.title)}
                                className="text-emerald-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                              >
                                <ZoomIn size={12} /> Zoom
                              </button>
                            </div>

                            <div
                              onClick={() => openZoomModal(doc.previewUrl, doc.title)}
                              className="aspect-16/10 rounded-xl overflow-hidden bg-black/40 border border-slate-300 dark:border-slate-700 cursor-pointer group relative"
                            >
                              <img
                                src={doc.previewUrl}
                                alt={doc.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                <ZoomIn size={16} /> Click to Inspect
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Audit Log Trail */}
                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
                      Application History &amp; Audit Logs
                    </span>
                    <div className="space-y-2 text-xs">
                      {selectedAdminApp.auditTrail.map((log, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {log.action}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {log.timestamp}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">By: {log.actor}</p>
                          {log.notes && (
                            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                              Note: {log.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-2">
                  <FileText size={32} className="mx-auto text-slate-300" />
                  <p className="text-xs font-bold">Pumili ng application mula sa listahan upang masuri ang mga dokumento.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODALS (IMAGE ZOOM & CORRECTION REQUEST & USER RE-UPLOAD) */}
      {/* ========================================================================= */}
      
      {/* Zoom Image Modal */}
      {zoomModalOpen && zoomImageUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          {/* Controls Bar */}
          <div className="w-full max-w-4xl flex items-center justify-between text-white pb-3">
            <span className="text-xs sm:text-sm font-bold truncate max-w-md">
              {zoomImageTitle}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomScale(s => Math.min(3, s + 0.25))}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={() => setZoomScale(s => Math.max(0.5, s - 0.25))}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <button
                onClick={() => setZoomRotation(r => r + 90)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl cursor-pointer"
                title="Rotate"
              >
                <RotateCw size={16} />
              </button>
              <button
                onClick={() => setZoomModalOpen(false)}
                className="p-2 bg-rose-600 hover:bg-rose-500 rounded-xl cursor-pointer ml-2"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Image Display */}
          <div className="w-full max-w-4xl h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black/50 border border-white/10">
            <img
              src={zoomImageUrl}
              alt={zoomImageTitle}
              style={{
                transform: `scale(${zoomScale}) rotate(${zoomRotation}deg)`,
                transition: 'transform 0.2s ease-out'
              }}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Admin Request Correction Remarks Modal */}
      {remarksModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                <span>Request Document Correction</span>
              </h4>
              <button onClick={() => setRemarksModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Reason / Remarks (Required) *
              </label>
              <textarea
                rows={3}
                value={adminRemarksText}
                onChange={(e) => {
                  setAdminRemarksText(e.target.value);
                  setRemarksError(null);
                }}
                placeholder="e.g. Please upload a clearer picture of the Franchise Permit."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              {remarksError && (
                <p className="text-rose-500 font-bold text-[11px]">{remarksError}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRemarksModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCorrectionRequest}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/30"
              >
                Submit Correction Directive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Re-Upload Document Modal */}
      {correctionModalApp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">
                  Upload Corrected Document
                </h4>
                <p className="text-[11px] text-slate-500">
                  {correctionModalApp.franchiseNo} • {correctionModalApp.applicationNo}
                </p>
              </div>
              <button onClick={() => setCorrectionModalApp(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            {correctionModalApp.correctionRemarks && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs text-rose-800 dark:text-rose-300">
                <strong className="block mb-0.5">Admin Directive:</strong>
                {correctionModalApp.correctionRemarks}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Pumili ng dokumentong papalitan:
              </label>
              <select
                value={correctionTargetDoc}
                onChange={(e) => setCorrectionTargetDoc(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-200"
              >
                <option value="franchisePermit">1. Previous Franchise Permit</option>
                <option value="govId">2. Valid Government ID</option>
                <option value="paymentProof">3. Official Receipt / Payment Proof</option>
                <option value="vehicleDoc">4. Vehicle Documents (LTO OR/CR)</option>
              </select>

              <div className="border-2 border-dashed border-emerald-400 rounded-2xl p-6 text-center space-y-2 bg-emerald-50/30 dark:bg-emerald-950/10">
                <Camera size={26} className="mx-auto text-emerald-600" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Piliin ang bagong malinaw na larawan
                </p>
                <p className="text-[11px] text-slate-400">Accepted: JPG, PNG, PDF up to 25MB</p>
                <label className="mt-3 inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md">
                  <span>Browse at I-upload</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    onChange={handleExecuteCorrectionUpload}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCorrectionModalApp(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
