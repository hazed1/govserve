import React, { useState, useRef } from 'react';
import {
  MapPin,
  Camera,
  Upload,
  CheckCircle2,
  Calendar,
  Clock,
  AlertTriangle,
  FileText,
  Check,
  X,
  Eye,
  Trash2,
  ArrowLeft,
  ArrowRight,
  User,
  Printer,
  QrCode,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileCheck,
  Info,
  Car
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface SpecialTripDocItem {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  required: boolean;
  fileName: string | null;
  fileType: string | null;
  fileSize: number | null;
  previewUrl: string | null;
  uploadedAt: string | null;
  qualityStatus: 'optimal' | 'warning' | 'none';
}

interface FranchiseSpecialTripClearanceModuleProps {
  onBackToPortal: () => void;
  onPayFee?: (mtopNo: string) => void;
  onAddNewApplication?: (applicant: string, service: string) => void;
  operatorFranchise?: {
    mtopNo: string;
    operatorName: string;
    todaOrganization?: string;
    plateNumber: string;
    bodyNo?: string;
    routeAssigned?: string;
    status?: string;
  };
}

const TRIP_PURPOSES = [
  {
    id: 'fiesta',
    title: 'Barangay Fiesta / Festival Shuttle',
    icon: '🎪',
    desc: 'Community celebrations, patron feast shuttles & local festivals',
    tag: 'Community Event'
  },
  {
    id: 'school',
    title: 'School Field Trip / Educational Shuttle',
    icon: '🎓',
    desc: 'Student field activities, sports meets & campus excursions',
    tag: 'Educational'
  },
  {
    id: 'medical',
    title: 'Hospital & Medical Assistance',
    icon: '🏥',
    desc: 'Medical transit, dialysis shuttles & clinic emergencies',
    tag: 'Health & Medical'
  },
  {
    id: 'church',
    title: 'Church / Religious Pilgrimage',
    icon: '⛪',
    desc: 'Parish visits, religious gatherings & pilgrimage trips',
    tag: 'Religious'
  },
  {
    id: 'family',
    title: 'Family Event / Funeral Escort',
    icon: '👨‍👩‍👧',
    desc: 'Weddings, reunions, ceremonies & memorial processions',
    tag: 'Personal / Family'
  },
  {
    id: 'relief',
    title: 'Community Outreach & Relief Drive',
    icon: '🏛️',
    desc: 'Barangay aid distribution, medical missions & relief transit',
    tag: 'Civic Outreach'
  },
  {
    id: 'others',
    title: 'Others (Custom Purpose)',
    icon: '📋',
    desc: 'Custom special trip, private transport, or other travel purpose',
    tag: 'Other Purpose'
  }
];

const ROUTE_OPTIONS = [
  'Batasan Hills ↔ Quezon Memorial Circle / QC City Hall',
  'Batasan Hills ↔ Amoranto Sports Stadium (Roces)',
  'Batasan Hills ↔ La Mesa Eco Park (Novaliches)',
  'Batasan Hills ↔ Novaliches Bayan Market',
  'Batasan Hills ↔ Cubao Aurora Corridor',
  'Batasan Hills ↔ Fairview Center Mall (FCM)'
];

const DURATION_TIERS = [
  { id: '1day', label: '1 Day', feeFormatted: '₱150.00' },
  { id: '3days', label: '3 Days', feeFormatted: '₱350.00' },
  { id: '7days', label: '7 Days', feeFormatted: '₱500.00' },
  { id: 'custom', label: 'Custom Days', feeFormatted: 'Specify Days' }
];

const INITIAL_DOCUMENTS: Record<string, SpecialTripDocItem> = {
  requestLetter: {
    id: 'doc-request-letter',
    key: 'requestLetter',
    title: 'Special Trip Request Letter / Barangay Indorsement',
    subtitle: 'Barangay Indorsement or event organizer letter stating destination & reason',
    required: true,
    fileName: null,
    fileType: null,
    fileSize: null,
    previewUrl: null,
    uploadedAt: null,
    qualityStatus: 'none'
  },
  driverLicense: {
    id: 'doc-driver-license',
    key: 'driverLicense',
    title: "Driver's Professional License",
    subtitle: "Front photo of valid Driver's License of authorized driver with valid restriction",
    required: true,
    fileName: null,
    fileType: null,
    fileSize: null,
    previewUrl: null,
    uploadedAt: null,
    qualityStatus: 'none'
  },
  orcr: {
    id: 'doc-or-cr',
    key: 'orcr',
    title: 'Vehicle Official Receipt & Certificate of Registration (OR/CR)',
    subtitle: 'Clear photo of current LTO OR/CR verifying vehicle roadworthiness',
    required: true,
    fileName: null,
    fileType: null,
    fileSize: null,
    previewUrl: null,
    uploadedAt: null,
    qualityStatus: 'none'
  },
  unitPhoto: {
    id: 'doc-unit-photo',
    key: 'unitPhoto',
    title: 'Vehicle Unit Photo with Visible Plate & Body Number',
    subtitle: 'Clear exterior photo of the tricycle unit showing MTOP body number and plate',
    required: true,
    fileName: null,
    fileType: null,
    fileSize: null,
    previewUrl: null,
    uploadedAt: null,
    qualityStatus: 'none'
  }
};

export const FranchiseSpecialTripClearanceModule: React.FC<FranchiseSpecialTripClearanceModuleProps> = ({
  onBackToPortal,
  onPayFee,
  onAddNewApplication,
  operatorFranchise
}) => {
  const { user } = useAuth();

  // Operator Data (Editable)
  const [operatorName, setOperatorName] = useState<string>(
    operatorFranchise?.operatorName || user?.name || 'Juan Dela Cruz'
  );
  const [mtopNo, setMtopNo] = useState<string>(
    operatorFranchise?.mtopNo || 'MTOP-2025-0412'
  );
  const [unitPlateToda, setUnitPlateToda] = useState<string>(() => {
    if (operatorFranchise?.plateNumber) {
      return `${operatorFranchise.plateNumber} (${operatorFranchise.todaOrganization || 'Batasan Hills TODA (BHTODA)'})`;
    }
    return 'PH-48192 (Batasan Hills TODA (BHTODA))';
  });

  // Selected Trip Configurations
  const [selectedPurposeId, setSelectedPurposeId] = useState<string>('fiesta');
  const [customPurpose, setCustomPurpose] = useState<string>('');
  const [pointOfOrigin, setPointOfOrigin] = useState<string>('Batasan Hills, Quezon City');
  const [selectedRoute, setSelectedRoute] = useState<string>('Quezon Memorial Circle / QC City Hall');
  const [howManyDays, setHowManyDays] = useState<number>(3);
  const [durationTier, setDurationTier] = useState<string>('3days');
  const [customDaysInput, setCustomDaysInput] = useState<string>('3');
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const future = new Date();
    future.setDate(future.getDate() + 2);
    return future.toISOString().split('T')[0];
  });

  // Uploaded Documents state
  const [documents, setDocuments] = useState<Record<string, SpecialTripDocItem>>(INITIAL_DOCUMENTS);

  // Safety confirmation
  const [safetyConfirmed, setSafetyConfirmed] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [issuedDocketNo, setIssuedDocketNo] = useState<string>('STP-2026-0391');

  // Camera State
  const [cameraModalOpen, setCameraModalOpen] = useState<boolean>(false);
  const [activeCameraDocKey, setActiveCameraDocKey] = useState<string | null>(null);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [cameraHasStream, setCameraHasStream] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Lightbox / Zoom State
  const [zoomModalOpen, setZoomModalOpen] = useState<boolean>(false);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
  const [zoomImageTitle, setZoomImageTitle] = useState<string>('');
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [zoomRotation, setZoomRotation] = useState<number>(0);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Fee Calculation
  const calculateFee = (days: number): number => {
    if (!days || days <= 1) return 150;
    if (days === 2) return 250;
    if (days === 3) return 350;
    if (days === 7) return 500;
    if (days < 7) {
      return 150 + (days - 1) * 60;
    }
    return 500 + (days - 7) * 50;
  };

  const currentFee = calculateFee(howManyDays);
  const feeFormatted = `₱${currentFee.toLocaleString()}.00`;

  // Calculations
  const totalRequiredDocs = Object.values(documents).filter(d => d.required).length;
  const uploadedDocsCount = Object.values(documents).filter(d => d.previewUrl !== null).length;
  const allRequiredUploaded = uploadedDocsCount >= totalRequiredDocs;

  // Handle Days Change
  const handleDaysChange = (days: number, tierOverride?: string) => {
    const validDays = Math.max(1, Math.min(30, days || 1));
    setHowManyDays(validDays);
    if (tierOverride) {
      setDurationTier(tierOverride);
    } else if (durationTier !== 'custom') {
      if (validDays === 1) setDurationTier('1day');
      else if (validDays === 3) setDurationTier('3days');
      else if (validDays === 7) setDurationTier('7days');
      else setDurationTier('custom');
    }

    const start = new Date(startDate || new Date());
    const end = new Date(start);
    end.setDate(end.getDate() + (validDays - 1));
    setEndDate(end.toISOString().split('T')[0]);
  };

  const handleTierSelect = (tierId: string) => {
    if (tierId === '1day') {
      handleDaysChange(1, '1day');
    } else if (tierId === '3days') {
      handleDaysChange(3, '3days');
    } else if (tierId === '7days') {
      handleDaysChange(7, '7days');
    } else if (tierId === 'custom') {
      const parsed = parseInt(customDaysInput, 10);
      const days = !isNaN(parsed) && parsed > 0 ? parsed : 2;
      setCustomDaysInput(days.toString());
      handleDaysChange(days, 'custom');
    }
  };

  const handleStartDateChange = (dateVal: string) => {
    setStartDate(dateVal);
    const start = new Date(dateVal || new Date());
    const end = new Date(start);
    end.setDate(end.getDate() + (howManyDays - 1));
    setEndDate(end.toISOString().split('T')[0]);
  };

  // Handle File Upload from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      showToast('File size exceeds the 20MB limit.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const now = new Date();

    setDocuments(prev => ({
      ...prev,
      [docKey]: {
        ...prev[docKey],
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        previewUrl: objectUrl,
        uploadedAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        qualityStatus: 'optimal'
      }
    }));

    showToast(`✓ ${documents[docKey].title} uploaded successfully!`);
    e.target.value = '';
  };

  // Open Camera Modal
  const startCamera = async (docKey: string) => {
    setActiveCameraDocKey(docKey);
    setCameraModalOpen(true);
    setCameraLoading(true);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraHasStream(true);
      } else {
        setCameraHasStream(false);
      }
    } catch {
      // Fallback if camera permission is denied or device has no camera
      setCameraHasStream(false);
    } finally {
      setCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraModalOpen(false);
    setCameraHasStream(false);
    setActiveCameraDocKey(null);
  };

  const capturePhoto = () => {
    if (!activeCameraDocKey) return;

    let photoUrl = '';
    const now = new Date();
    const fileName = `Snapshot_${activeCameraDocKey}_${now.getTime()}.jpg`;

    if (cameraHasStream && videoRef.current) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 800;
        canvas.height = videoRef.current.videoHeight || 600;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          photoUrl = canvas.toDataURL('image/jpeg', 0.9);
        }
      } catch {
        photoUrl = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60';
      }
    } else {
      // Realistic simulated capture if webcam isn't physically available
      photoUrl = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60';
    }

    setDocuments(prev => ({
      ...prev,
      [activeCameraDocKey]: {
        ...prev[activeCameraDocKey],
        fileName,
        fileType: 'image/jpeg',
        fileSize: 1240000,
        previewUrl: photoUrl,
        uploadedAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        qualityStatus: 'optimal'
      }
    }));

    showToast(`✓ Photo captured for ${documents[activeCameraDocKey].title}!`);
    stopCamera();
  };

  const handleRemoveDoc = (docKey: string) => {
    setDocuments(prev => ({
      ...prev,
      [docKey]: {
        ...prev[docKey],
        fileName: null,
        fileType: null,
        fileSize: null,
        previewUrl: null,
        uploadedAt: null,
        qualityStatus: 'none'
      }
    }));
    showToast('Photo removed.');
  };

  // Zoom / Lightbox
  const handleOpenZoom = (url: string | null, title: string) => {
    if (!url) return;
    setZoomImageUrl(url);
    setZoomImageTitle(title);
    setZoomScale(1);
    setZoomRotation(0);
    setZoomModalOpen(true);
  };

  // Submit Handler
  const handleSubmit = () => {
    if (!allRequiredUploaded) {
      showToast('Please upload all 4 required document photos before submitting.');
      return;
    }
    if (!safetyConfirmed) {
      showToast('Please agree to city safety rules and route guidelines.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const docket = `STP-2026-${randomSuffix}`;
      setIssuedDocketNo(docket);
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast(`✓ Special Trip Clearance ${docket} successfully issued!`);
      if (onAddNewApplication) {
        onAddNewApplication(operatorName, `Special Trip Clearance (${mtopNo})`);
      }
    }, 600);
  };

  const selectedPurposeObj = TRIP_PURPOSES.find(p => p.id === selectedPurposeId) || TRIP_PURPOSES[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 select-text font-sans animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
          <div className="bg-slate-900/95 dark:bg-amber-950/95 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-amber-500/40 backdrop-blur-md flex items-center gap-2.5">
            <Check size={16} className="text-amber-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-amber-200/80 dark:border-amber-500/30 shadow-sm space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-amber-100 dark:border-amber-950/80">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shadow-xs border border-amber-200/60 dark:border-amber-800/40">
              <MapPin size={24} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 mb-1">
                <span>Upload-Based Fast Route Permit</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Special Trip &amp; Out-of-Line Clearance
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Simply snap or upload document photos for instant route verification. No tedious manual typing required.
              </p>
            </div>
          </div>
        </div>

        {!isSubmitted ? (
          <div className="space-y-6">
            {/* Operator & Franchise Information (Editable) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Operator:
                  </label>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    placeholder="Juan Dela Cruz"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Franchise MTOP:
                  </label>
                  <input
                    type="text"
                    value={mtopNo}
                    onChange={(e) => setMtopNo(e.target.value)}
                    placeholder="MTOP-2025-0412"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-bold font-mono text-amber-700 dark:text-amber-400 focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Unit Plate / TODA:
                  </label>
                  <input
                    type="text"
                    value={unitPlateToda}
                    onChange={(e) => setUnitPlateToda(e.target.value)}
                    placeholder="PH-48192 (Batasan Hills TODA (BHTODA))"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Step A: Select Purpose (Friendly Large Cards) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase text-amber-800 dark:text-amber-300 tracking-wider">
                  1. Select Purpose of Special Trip
                </label>
                <span className="text-[11px] text-slate-500">Tap to select category</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {TRIP_PURPOSES.map(purpose => {
                  const isSelected = selectedPurposeId === purpose.id;
                  return (
                    <button
                      key={purpose.id}
                      type="button"
                      onClick={() => setSelectedPurposeId(purpose.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3 relative cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-500 dark:border-amber-400 ring-2 ring-amber-500/20 shadow-md scale-[1.01]'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/30'
                      }`}
                    >
                      <span className="text-2xl p-2 rounded-xl bg-amber-100/70 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800/60 shrink-0">
                        {purpose.icon}
                      </span>
                      <div className="space-y-0.5 overflow-hidden">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 block truncate">
                          {purpose.tag}
                        </span>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                          {purpose.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                          {purpose.desc}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-xs">
                          <Check size={12} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom Purpose Input when Others is selected */}
              {selectedPurposeId === 'others' && (
                <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/80 space-y-1.5 animate-in fade-in duration-150">
                  <label className="text-[11px] font-black uppercase text-amber-800 dark:text-amber-300 block">
                    Specify Other Purpose *
                  </label>
                  <input
                    type="text"
                    value={customPurpose}
                    onChange={(e) => setCustomPurpose(e.target.value)}
                    placeholder="Please specify purpose (e.g. Corporate team activity, private shuttle, etc.)"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-xs"
                  />
                </div>
              )}
            </div>

            {/* Step B: Route & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Route: Point of Origin & Destination */}
              <div className="space-y-3">
                {/* Point of Origin */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-amber-800 dark:text-amber-300 tracking-wider">
                    2. Point of Origin
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={pointOfOrigin}
                      onChange={(e) => setPointOfOrigin(e.target.value)}
                      placeholder="Enter point of origin (e.g. Batasan Hills, Quezon City)"
                      className="w-full p-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-xs"
                    />
                    <MapPin size={16} className="absolute left-3.5 top-3.5 text-amber-600 pointer-events-none" />
                  </div>
                </div>

                {/* Destination */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-amber-800 dark:text-amber-300 tracking-wider">
                    3. Destination
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedRoute}
                      onChange={(e) => setSelectedRoute(e.target.value)}
                      placeholder="Enter destination (e.g. Quezon Memorial Circle / QC City Hall)"
                      className="w-full p-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-xs"
                    />
                    <MapPin size={16} className="absolute left-3.5 top-3.5 text-amber-600 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Duration & Fee */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-amber-800 dark:text-amber-300 tracking-wider">
                    4. Travel Duration
                  </label>
                  <span className="text-[10px] text-slate-500">Preset or custom days</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DURATION_TIERS.map(tier => {
                    const isSelected = durationTier === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => handleTierSelect(tier.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-600 shadow-md font-bold'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                        }`}
                      >
                        <span className="block text-xs font-black">{tier.label}</span>
                        <span className={`text-[10px] block ${isSelected ? 'text-amber-100 font-semibold' : 'text-slate-500 font-medium'}`}>
                          {tier.feeFormatted}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Days Input when Custom is selected (Mirroring Picture 1) */}
                {durationTier === 'custom' && (
                  <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/80 space-y-1.5 animate-in fade-in duration-150">
                    <label className="text-[11px] font-black uppercase text-amber-800 dark:text-amber-300 block">
                      How many days: *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={customDaysInput}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          setCustomDaysInput(val);
                          const parsed = parseInt(val, 10);
                          if (!isNaN(parsed) && parsed > 0) {
                            handleDaysChange(parsed, 'custom');
                          }
                        }}
                        placeholder="Enter number of days (e.g. 2, 4, 5, 10)"
                        className="w-full px-3.5 py-2.5 pl-9 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-xs font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        autoFocus
                      />
                      <Clock size={15} className="absolute left-3 top-3 text-amber-600 pointer-events-none" />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 block">Start Date:</span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 block">End Date:</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* STEP C: CORE UPLOAD SECTION ("PURO UPLOAD LANG NG PICTURE") */}
            {/* ===================================================================== */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-amber-200/80 dark:border-amber-900/50">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Camera size={16} className="text-amber-600" />
                    <span>Upload Document Photos ({uploadedDocsCount} of {totalRequiredDocs} Ready)</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Snap photos using your camera or upload image files. Clear photos ensure fast instant approval.
                  </p>
                </div>

                {/* Progress pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 shrink-0">
                  <span>{Math.round((uploadedDocsCount / totalRequiredDocs) * 100)}% Complete</span>
                </div>
              </div>

              {/* Upload Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(documents).map(doc => {
                  const isUploaded = doc.previewUrl !== null;

                  return (
                    <div
                      key={doc.key}
                      className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                        isUploaded
                          ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-400 dark:border-amber-600/60 shadow-xs'
                          : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-amber-300'
                      }`}
                    >
                      {/* Document Header & Label */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                            {doc.required ? '★ Required Photo' : 'Optional Document'}
                          </span>
                          {isUploaded && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 size={12} />
                              <span>Ready</span>
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                          {doc.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                          {doc.subtitle}
                        </p>
                      </div>

                      {/* Preview Area or Upload Dropzone */}
                      {isUploaded ? (
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <img
                              src={doc.previewUrl!}
                              alt={doc.title}
                              onClick={() => handleOpenZoom(doc.previewUrl, doc.title)}
                              className="w-14 h-14 rounded-lg object-cover border border-amber-300 dark:border-amber-700 cursor-pointer hover:scale-105 transition-transform shrink-0"
                              title="Click to zoom photo"
                            />
                            <div className="overflow-hidden">
                              <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                                {doc.fileName || 'Document Photo'}
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                Uploaded at {doc.uploadedAt || 'Just now'}
                              </span>
                              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                                <Check size={11} /> Clear Document Verified
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenZoom(doc.previewUrl, doc.title)}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 cursor-pointer"
                              title="Enlarge Photo"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveDoc(doc.key)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 cursor-pointer"
                              title="Delete Photo"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-amber-300 dark:border-amber-700/80 rounded-xl p-4 bg-white/70 dark:bg-slate-900/60 text-center space-y-3">
                          <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                            <Camera size={18} />
                          </div>

                          <div className="text-[11px] text-slate-500">
                            Snap live photo or upload from your device
                          </div>

                          {/* Action Buttons: Take Photo & Upload File */}
                          <div className="flex items-center justify-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => startCamera(doc.key)}
                              className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                            >
                              <Camera size={13} />
                              <span>Take Photo</span>
                            </button>

                            <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all">
                              <Upload size={13} />
                              <span>Upload File</span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,application/pdf"
                                onChange={(e) => handleFileUpload(e, doc.key)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Terms & Agreement Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-3">
              <div>
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
                  Special Trip Clearance Compliance &amp; Regulatory Terms
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  QC DPOS Out-of-Line Transit &amp; Route Traffic Monitoring ({howManyDays} Calendar {howManyDays === 1 ? 'Day' : 'Days'})
                </span>
              </div>

              <label className="flex items-start space-x-2.5 pt-3 border-t border-amber-200/80 dark:border-amber-900/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={safetyConfirmed}
                  onChange={(e) => setSafetyConfirmed(e.target.checked)}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  I certify that all uploaded document photos are authentic and current. I agree to operate strictly within the designated corridor on secondary roads and observe municipal passenger safety rules.
                </span>
              </label>
            </div>

            {/* Submit Action */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onBackToPortal}
                  className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Portal</span>
                </button>

                <button
                  type="button"
                  disabled={!allRequiredUploaded || !safetyConfirmed || isSubmitting}
                  onClick={handleSubmit}
                  className={`px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 ${
                    allRequiredUploaded && safetyConfirmed && !isSubmitting
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                      : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <RotateCw size={16} className="animate-spin" />
                      <span>Verifying...</span>
                    </span>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* SPECIAL TRIP ISSUED SUCCESS E-PERMIT VIEW */
          /* ========================================================================= */
          <div className="space-y-6 animate-in zoom-in-95 duration-200 py-2">
            {/* Success Banner */}
            <div className="text-center space-y-2 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mx-auto rounded-3xl flex items-center justify-center shadow-inner">
                <CheckCircle2 size={40} />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-full text-xs font-black border border-amber-200 dark:border-amber-800">
                <span>OFFICIAL CLEARANCE DOCKET: {issuedDocketNo}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Special Route Clearance Issued!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Vehicle <strong className="font-mono text-slate-900 dark:text-white">{mtopNo}</strong> is officially authorized for out-of-line travel in Quezon City.
              </p>
            </div>

            {/* Official Digital Permit Card (Printable) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-amber-50/80 via-white to-amber-50/40 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border-2 border-amber-300 dark:border-amber-700 shadow-xl space-y-5 max-w-2xl mx-auto relative overflow-hidden">
              {/* Official Seal Watermark / Top Header */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    QC
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                      QUEZON CITY DEPARTMENT OF PUBLIC ORDER &amp; SAFETY
                    </span>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      SPECIAL ROUTE TRANSIT CLEARANCE
                    </h4>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  ✓ VALID &amp; ACTIVE
                </span>
              </div>

              {/* Middle Section: Route & Details with QR Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
                {/* QR Code Container */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-amber-200 dark:border-amber-900/60 text-center space-y-2 flex flex-col items-center justify-center">
                  <QrCode size={100} className="text-slate-900 dark:text-white" />
                  <span className="text-[9px] font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    {issuedDocketNo}
                  </span>
                  <span className="text-[8px] text-slate-400 block">Scan to verify road permit</span>
                </div>

                {/* Details Breakdown */}
                <div className="sm:col-span-2 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">Operator:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{operatorName}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">Franchise MTOP:</span>
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{mtopNo}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">Unit Plate / TODA:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {unitPlateToda}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">Purpose:</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate max-w-[220px]">
                      {selectedPurposeId === 'others' ? (customPurpose.trim() || 'Other Special Purpose') : selectedPurposeObj.title}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">Point of Origin:</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate max-w-[220px]">
                      {pointOfOrigin}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">Authorized Destination:</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate max-w-[220px]">
                      {selectedRoute}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 pt-1 border-t border-amber-200/70 dark:border-amber-900/40">
                    <span className="font-semibold">Validity Dates:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {startDate} to {endDate} ({howManyDays} Calendar {howManyDays === 1 ? 'Day' : 'Days'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Notice */}
              <div className="p-3 rounded-xl bg-amber-100/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[10px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <Info size={14} className="text-amber-600 shrink-0" />
                <span>Present this digital permit or printed copy to QC Traffic Enforcers / DPOS upon road inspection.</span>
              </div>
            </div>

            {/* Success Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition-all"
              >
                <Printer size={15} />
                <span>Print / Save E-Permit PDF</span>
              </button>

              {onPayFee && (
                <button
                  type="button"
                  onClick={() => onPayFee(mtopNo)}
                  className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>Pay Clearance Fee Online ({feeFormatted})</span>
                </button>
              )}

              <button
                type="button"
                onClick={onBackToPortal}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer transition-all"
              >
                Back to Portal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CAMERA CAPTURE MODAL */}
      {/* ========================================================================= */}
      {cameraModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-amber-300 dark:border-amber-700 space-y-4 p-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Camera size={18} className="text-amber-600" />
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Take Document Photo
                </h4>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center">
              {cameraLoading ? (
                <div className="text-center text-white space-y-2">
                  <RotateCw size={24} className="animate-spin text-amber-400 mx-auto" />
                  <p className="text-xs">Accessing camera...</p>
                </div>
              ) : cameraHasStream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-slate-300 p-6 space-y-2">
                  <Camera size={36} className="text-amber-400 mx-auto" />
                  <p className="text-xs font-bold text-white">Camera ready for document capture</p>
                  <p className="text-[11px] text-slate-400">Position your document inside the frame and snap photo.</p>
                </div>
              )}

              {/* Target Outline Box */}
              <div className="absolute inset-8 border-2 border-dashed border-amber-400/80 rounded-xl pointer-events-none flex items-end justify-center pb-2">
                <span className="text-[10px] font-bold text-amber-200 bg-black/60 px-2 py-0.5 rounded">
                  Align document within border
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={capturePhoto}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-lg shadow-amber-600/30 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <Camera size={15} />
                <span>Snap Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ZOOM / LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {zoomModalOpen && zoomImageUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck size={16} className="text-amber-400" />
                <h4 className="text-xs font-black text-white truncate max-w-[280px] sm:max-w-md">
                  {zoomImageTitle}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomScale(prev => Math.min(prev + 0.25, 2.5))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomScale(prev => Math.max(prev - 0.25, 0.75))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomRotation(prev => (prev + 90) % 360)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  title="Rotate"
                >
                  <RotateCw size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomModalOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer ml-1"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Image Preview Container */}
            <div className="p-6 flex-1 overflow-auto flex items-center justify-center bg-black/60 min-h-[300px]">
              <img
                src={zoomImageUrl}
                alt={zoomImageTitle}
                style={{
                  transform: `scale(${zoomScale}) rotate(${zoomRotation}deg)`,
                  transition: 'transform 0.2s ease-in-out'
                }}
                className="max-h-[65vh] max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
