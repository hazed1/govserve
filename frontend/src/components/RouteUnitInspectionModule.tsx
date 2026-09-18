import React, { useState } from 'react';
import { 
  Bus, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
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
  ChevronRight, 
  SlidersHorizontal,
  RefreshCw,
  Award,
  AlertCircle,
  FileCheck,
  Zap,
  Layers,
  Printer,
  Gauge,
  Activity,
  Flame,
  CheckSquare,
  Square,
  Share2,
  Navigation,
  Compass,
  Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TabType } from '../types';

interface InspectionUnit {
  id: string;
  mtopNo: string;
  operatorName: string;
  contactNumber: string;
  todaOrganization: string;
  unitType: 'Tricycle (MTOP)' | 'Jeepney (PUJ)' | 'Van / UV Express' | 'E-Trike / Modern PUV';
  bodyNo: string;
  plateNumber: string;
  engineNo: string;
  chassisNo: string;
  routeAssigned: string;
  scheduledDate: string;
  inspectorAssigned: string;
  inspectionStatus: 'Passed' | 'Pending Inspection' | 'Failed / For Re-test' | 'Scheduled';
  roadworthinessScore: number;
  emissionReading: string; // e.g. "0.85 K-Value (Passed)"
  brakeEfficiency: string; // e.g. "88% Balanced"
  stickerReleased: boolean;
  notes?: string;
}

const INITIAL_INSPECTIONS: InspectionUnit[] = [
  {
    id: 'INSP-2025-081',
    mtopNo: 'MTOP-2025-0412',
    operatorName: 'Juan Dela Cruz',
    contactNumber: '+63 917 555 1201',
    todaOrganization: 'Batasan Hills TODA (BHTODA)',
    unitType: 'Tricycle (MTOP)',
    bodyNo: 'Unit #088',
    plateNumber: 'PH-48192',
    engineNo: 'ENG-9981244',
    chassisNo: 'CHS-88192019',
    routeAssigned: 'Batasan Complex ↔ Commonwealth Market Terminal, Quezon City',
    scheduledDate: 'May 20, 2025 - 09:30 AM',
    inspectorAssigned: 'Engr. Carlos Mendoza (QC Motorpool Lead)',
    inspectionStatus: 'Passed',
    roadworthinessScore: 98,
    emissionReading: '0.42 K-Value (Euro-4 Compliant)',
    brakeEfficiency: '95% Dual Axle Balanced',
    stickerReleased: true,
    notes: 'Unit passed all 10 safety points with optimal brake performance.'
  },
  {
    id: 'INSP-2025-082',
    mtopNo: 'MTOP-2025-0413',
    operatorName: 'Rodrigo M. Santos',
    contactNumber: '+63 918 444 8821',
    todaOrganization: 'Quezon City Transport Service Cooperative (QCTSC)',
    unitType: 'Jeepney (PUJ)',
    bodyNo: 'PUJ #104',
    plateNumber: 'NVB-8921',
    engineNo: 'ENG-4410291',
    chassisNo: 'CHS-99201882',
    routeAssigned: 'QC Hall (Elliptical Road) ↔ Fairview Center Mall Corridor',
    scheduledDate: 'May 21, 2025 - 10:00 AM',
    inspectorAssigned: 'Insp. Danilo Gomez',
    inspectionStatus: 'Pending Inspection',
    roadworthinessScore: 0,
    emissionReading: 'Pending Smoke Meter Test',
    brakeEfficiency: 'Pending Roller Test',
    stickerReleased: false,
    notes: 'Awaiting bay 2 alignment test and smoke opacity reading.'
  },
  {
    id: 'INSP-2025-083',
    mtopNo: 'MTOP-2025-0414',
    operatorName: 'Elena V. Reyes',
    contactNumber: '+63 920 111 7733',
    todaOrganization: 'Commonwealth TODA (COMTODA)',
    unitType: 'E-Trike / Modern PUV',
    bodyNo: 'ET-012',
    plateNumber: 'ET-99201',
    engineNo: 'MOT-7782109',
    chassisNo: 'CHS-11029481',
    routeAssigned: 'Commonwealth Market ↔ Litex Terminal, Quezon City',
    scheduledDate: 'May 20, 2025 - 02:00 PM',
    inspectorAssigned: 'Engr. Carlos Mendoza',
    inspectionStatus: 'Passed',
    roadworthinessScore: 95,
    emissionReading: 'Zero-Emission (Electric Motor)',
    brakeEfficiency: '92% Regenerative Braking',
    stickerReleased: true,
    notes: 'Electric motor battery casing sealed. Lighting & hazard flashers clear.'
  },
  {
    id: 'INSP-2025-084',
    mtopNo: 'MTOP-2024-0198',
    operatorName: 'Mario P. Bautista',
    contactNumber: '+63 915 222 9012',
    todaOrganization: 'Novaliches-Fairview TODA (NOFATODA)',
    unitType: 'Tricycle (MTOP)',
    bodyNo: 'Unit #045',
    plateNumber: 'TX-10924',
    engineNo: 'ENG-3391821',
    chassisNo: 'CHS-44910281',
    routeAssigned: 'Novaliches Bayan ↔ Fairview Center Mall (FCM), Quezon City',
    scheduledDate: 'May 19, 2025 - 11:15 AM',
    inspectorAssigned: 'Insp. Danilo Gomez',
    inspectionStatus: 'Failed / For Re-test',
    roadworthinessScore: 68,
    emissionReading: '2.45 K-Value (High Smoke Density - Failed)',
    brakeEfficiency: '62% Rear Brake Pulling Left',
    stickerReleased: false,
    notes: 'Exhaust muffler requires maintenance. Left signal light bulb busted.'
  },
  {
    id: 'INSP-2025-085',
    mtopNo: 'MTOP-2025-0415',
    operatorName: 'Danilo C. Mendoza',
    contactNumber: '+63 922 888 3311',
    todaOrganization: 'Cubao-San Martin de Porres TODA (CSMP-TODA)',
    unitType: 'Van / UV Express',
    bodyNo: 'UV-88',
    plateNumber: 'ABC-5512',
    engineNo: 'ENG-8819201',
    chassisNo: 'CHS-77192033',
    routeAssigned: 'Cubao Aurora Terminal ↔ Katipunan QC Gateway',
    scheduledDate: 'May 22, 2025 - 08:30 AM',
    inspectorAssigned: 'Insp. Danilo Gomez',
    inspectionStatus: 'Scheduled',
    roadworthinessScore: 0,
    emissionReading: 'Scheduled',
    brakeEfficiency: 'Scheduled',
    stickerReleased: false,
    notes: 'Reserved bay 1 commercial vehicle lane.'
  }
];

interface RouteCorridor {
  id: string;
  name: string;
  todaName: string;
  authorizedQuota: number;
  activeRegistered: number;
  pendingApplications: number;
  congestionLevel: 'Low' | 'Moderate' | 'Peak Congestion';
  routeStatus: 'Within Quota' | 'Near Capacity' | 'Quota Full';
  lengthKm: string;
}

const ROUTE_CORRIDORS: RouteCorridor[] = [
  {
    id: 'RC-01',
    name: 'Batasan Complex ↔ Commonwealth Market Terminal, QC',
    todaName: 'Batasan Hills TODA (BHTODA)',
    authorizedQuota: 900,
    activeRegistered: 850,
    pendingApplications: 12,
    congestionLevel: 'Peak Congestion',
    routeStatus: 'Near Capacity',
    lengthKm: '4.8 km'
  },
  {
    id: 'RC-02',
    name: 'QC Hall (Elliptical Road) ↔ Fairview Corridor',
    todaName: 'Quezon City Transport Service Cooperative (QCTSC)',
    authorizedQuota: 450,
    activeRegistered: 320,
    pendingApplications: 8,
    congestionLevel: 'Moderate',
    routeStatus: 'Within Quota',
    lengthKm: '8.2 km'
  },
  {
    id: 'RC-03',
    name: 'Commonwealth Market ↔ Litex Terminal, QC',
    todaName: 'Commonwealth TODA (COMTODA)',
    authorizedQuota: 600,
    activeRegistered: 590,
    pendingApplications: 25,
    congestionLevel: 'Peak Congestion',
    routeStatus: 'Quota Full',
    lengthKm: '6.1 km'
  },
  {
    id: 'RC-04',
    name: 'Cubao Aurora Terminal ↔ Katipunan QC Gateway',
    todaName: 'Cubao-San Martin de Porres TODA (CSMP-TODA)',
    authorizedQuota: 200,
    activeRegistered: 140,
    pendingApplications: 4,
    congestionLevel: 'Low',
    routeStatus: 'Within Quota',
    lengthKm: '12.5 km'
  }
];

const CHECKLIST_ITEMS = [
  { id: 'chk_1', label: 'Brake System & Emergency Handbrake Locking Mechanism', weight: 10 },
  { id: 'chk_2', label: 'Smoke Emission Opacity Test & Exhaust dB Silencer', weight: 15 },
  { id: 'chk_3', label: 'Headlights (High/Low Beam), Signal & Hazard Lights', weight: 10 },
  { id: 'chk_4', label: 'Sidecar / Passenger Cabin Structural Frame & Welds', weight: 10 },
  { id: 'chk_5', label: 'Official MTFRB Approved Fare Matrix Taripa Display', weight: 10 },
  { id: 'chk_6', label: 'Certified First Aid Kit & 1kg ABC Dry Chemical Extinguisher', weight: 10 },
  { id: 'chk_7', label: 'LGU Body Stencil Number & TODA Color Paint Scheme', weight: 10 },
  { id: 'chk_8', label: 'Tire Tread Depth (>2.0mm) & Wheel Rim Alignment', weight: 10 },
  { id: 'chk_9', label: 'Rearview Mirrors (Left & Right) & Windshield Clarity', weight: 5 },
  { id: 'chk_10', label: 'Operator LTO Official Receipt / Certificate of Registration (OR/CR)', weight: 10 }
];

interface RouteUnitInspectionModuleProps {
  onNavigateToTab?: (tab: TabType) => void;
}

export const RouteUnitInspectionModule: React.FC<RouteUnitInspectionModuleProps> = ({ 
  onNavigateToTab 
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [activeSubTab, setActiveSubTab] = useState<'queue' | 'routes' | 'stickers'>('queue');
  const [inspections, setInspections] = useState<InspectionUnit[]>(INITIAL_INSPECTIONS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // Interactive Live Inspection Modal
  const [activeInspectionUnit, setActiveInspectionUnit] = useState<InspectionUnit | null>(null);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({
    chk_1: true,
    chk_2: true,
    chk_3: true,
    chk_4: true,
    chk_5: true,
    chk_6: true,
    chk_7: true,
    chk_8: true,
    chk_9: true,
    chk_10: true
  });
  const [inspectionNotes, setInspectionNotes] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sticker Modal
  const [selectedStickerUnit, setSelectedStickerUnit] = useState<InspectionUnit | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredInspections = inspections.filter(item => {
    // If citizen/user, only show their own vehicle inspections
    if (!isAdmin) {
      const currentUserName = user?.name || 'Juan Dela Cruz';
      if (item.operatorName.toLowerCase() !== currentUserName.toLowerCase() && item.operatorName !== 'Juan Dela Cruz') {
        return false;
      }
    }

    const matchesSearch = 
      item.mtopNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.operatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bodyNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.routeAssigned.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.inspectionStatus === statusFilter;
    const matchesType = typeFilter === 'All' || item.unitType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate live checklist score
  const calculateCurrentScore = () => {
    let score = 0;
    CHECKLIST_ITEMS.forEach(item => {
      if (checklistState[item.id]) {
        score += item.weight;
      }
    });
    return score;
  };

  const handleOpenInspection = (unit: InspectionUnit) => {
    setActiveInspectionUnit(unit);
    if (unit.inspectionStatus === 'Passed') {
      const allTrue: Record<string, boolean> = {};
      CHECKLIST_ITEMS.forEach(i => (allTrue[i.id] = true));
      setChecklistState(allTrue);
    } else if (unit.inspectionStatus === 'Failed / For Re-test') {
      setChecklistState({
        chk_1: false,
        chk_2: false,
        chk_3: true,
        chk_4: true,
        chk_5: true,
        chk_6: false,
        chk_7: true,
        chk_8: true,
        chk_9: false,
        chk_10: true
      });
    } else {
      const defaultState: Record<string, boolean> = {};
      CHECKLIST_ITEMS.forEach(i => (defaultState[i.id] = true));
      setChecklistState(defaultState);
    }
    setInspectionNotes(unit.notes || '');
  };

  const handleSaveInspection = () => {
    if (!activeInspectionUnit) return;
    const score = calculateCurrentScore();
    const isPassed = score >= 80;
    const newStatus: 'Passed' | 'Failed / For Re-test' = isPassed ? 'Passed' : 'Failed / For Re-test';

    setInspections(prev => prev.map(item => {
      if (item.id === activeInspectionUnit.id) {
        return {
          ...item,
          inspectionStatus: newStatus,
          roadworthinessScore: score,
          emissionReading: isPassed ? '0.52 K-Value (Compliant)' : '2.80 K-Value (Exceeds Smoke Limit)',
          brakeEfficiency: isPassed ? '91% Balanced' : '58% Uneven Calibration',
          notes: inspectionNotes || (isPassed ? 'Passed roadworthiness audit' : 'Failed inspection points. Scheduled re-test.'),
          stickerReleased: isPassed
        };
      }
      return item;
    }));

    setActiveInspectionUnit(null);
    showToast(isPassed 
      ? `✅ Unit ${activeInspectionUnit.bodyNo} Passed Inspection (${score}% Score)! QR Sticker Issued.` 
      : `⚠️ Unit ${activeInspectionUnit.bodyNo} Failed (${score}%). Required adjustments noted.`
    );
  };

  const handlePrintInspectionReport = (unit: InspectionUnit) => {
    const report = `========================================================================================
MUNICIPAL TRANSPORT & FRANCHISING REGULATORY BOARD (MTFRB)
MOTOR VEHICLE PHYSICAL ROADWORTHINESS INSPECTION CERTIFICATE (MVRIC)
========================================================================================
Inspection Control ID  : ${unit.id}
MTOP Franchise Code    : ${unit.mtopNo}
Operator / Grantee     : ${unit.operatorName}
TODA Organization      : ${unit.todaOrganization}
Vehicle Class          : ${unit.unitType}
Body / Unit Stencil No : ${unit.bodyNo}
Plate Number           : ${unit.plateNumber}
Engine Serial No       : ${unit.engineNo}
Chassis Serial No      : ${unit.chassisNo}
Authorized Route       : ${unit.routeAssigned}
Inspection Date        : ${unit.scheduledDate}
Lead Motorpool Officer : ${unit.inspectorAssigned}
----------------------------------------------------------------------------------------
ROADWORTHINESS AUDIT RESULTS:
Overall Inspection Score: ${unit.roadworthinessScore}% (${unit.inspectionStatus.toUpperCase()})
Smoke Emission Test     : ${unit.emissionReading}
Braking & Balance Test  : ${unit.brakeEfficiency}
Sticker Authorization   : ${unit.stickerReleased ? 'ISSUED & CRYPTOGRAPHICALLY SIGNED' : 'HELD'}
Inspector Remarks       : ${unit.notes || 'No adverse safety defects noted.'}
----------------------------------------------------------------------------------------
Security Authentication : SHA256-MTFRB-INSP-${unit.id}-${Date.now()}
Republic of the Philippines - Local Government Permitting & Licensing Hub
========================================================================================`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Inspection_Certificate_${unit.mtopNo}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded Inspection Certificate for ${unit.mtopNo}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Realtime Toast Banner */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center space-x-2.5 animate-bounce">
          <Sparkles size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP HERO BANNER & HEADER */}
      {/* ========================================================================= */}
      <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Route & Unit Inspection Audit
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Automated vehicle physical safety evaluation, smoke emission compliance testing, TODA corridor capacity tracking, and digital QR inspection sticker verification.
            </p>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('queue')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
              activeSubTab === 'queue'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Activity size={15} />
            <span>Motorpool Inspection Queue</span>
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
              activeSubTab === 'queue' ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            }`}>
              {inspections.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('routes')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
              activeSubTab === 'routes'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <MapPin size={15} />
            <span>TODA Route Quota & Corridors</span>
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
              activeSubTab === 'routes' ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
            }`}>
              {ROUTE_CORRIDORS.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('stickers')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
              activeSubTab === 'stickers'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <QrCode size={15} />
            <span>QR Compliance Stickers</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STATS & METRICS OVERVIEW */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Passed Roadworthiness</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">2,314 Units</h3>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1 mt-1">
              <span>✓ 96.2% Pass Rate</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">For Re-test / Defects</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">18 Units</h3>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center space-x-1 mt-1">
              <AlertTriangle size={12} />
              <span>Smoke & Brake Fixes</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800">
            <AlertCircle size={24} />
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Route Quota Capacity</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">2,150 / 2,480</h3>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold flex items-center space-x-1 mt-1">
              <MapPin size={12} />
              <span>86.7% Municipal Cap</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
            <Navigation size={24} />
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">QR Stickers Released</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">2,298 Issued</h3>
            <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold flex items-center space-x-1 mt-1">
              <span>✓ Cryptographically Signed</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200 dark:border-teal-800">
            <QrCode size={24} />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SUBTAB CONTENT A: MOTORPOOL INSPECTION QUEUE */}
      {/* ========================================================================= */}
      {activeSubTab === 'queue' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4">
          {/* Filter and Search Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search unit by MTOP, Plate, Body No, or Operator..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium focus:outline-none"
              >
                <option value="All">All Inspection Statuses</option>
                <option value="Passed">Passed</option>
                <option value="Pending Inspection">Pending Inspection</option>
                <option value="Failed / For Re-test">Failed / For Re-test</option>
                <option value="Scheduled">Scheduled</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium focus:outline-none"
              >
                <option value="All">All Vehicle Types</option>
                <option value="Tricycle (MTOP)">Tricycle (MTOP)</option>
                <option value="Jeepney (PUJ)">Jeepney (PUJ)</option>
                <option value="Van / UV Express">Van / UV Express</option>
                <option value="E-Trike / Modern PUV">E-Trike / Modern PUV</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider">
                  <th className="p-4 pl-6">Unit / MTOP Reference</th>
                  <th className="p-4">Operator & Contact</th>
                  <th className="p-4">Assigned Corridor Route</th>
                  <th className="p-4">Emission & Brake Diagnostics</th>
                  <th className="p-4">Safety Score & Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredInspections.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No inspection records found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredInspections.map((unit) => (
                    <tr key={unit.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                      {/* Unit & MTOP */}
                      <td className="p-4 pl-6">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                          <span>{unit.bodyNo}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                            {unit.plateNumber}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">{unit.mtopNo}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{unit.unitType}</p>
                      </td>

                      {/* Operator & TODA */}
                      <td className="p-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{unit.operatorName}</p>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{unit.todaOrganization}</p>
                        <p className="text-[10px] text-slate-400">{unit.contactNumber}</p>
                      </td>

                      {/* Route */}
                      <td className="p-4 max-w-xs">
                        <div className="flex items-start space-x-1.5">
                          <MapPin size={13} className="text-slate-400 flex-shrink-0 mt-0.5" />
                          <span className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                            {unit.routeAssigned}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Schedule: {unit.scheduledDate}</p>
                      </td>

                      {/* Diagnostics */}
                      <td className="p-4">
                        <div className="space-y-1 text-[11px]">
                          <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                            <Flame size={12} className="text-amber-500" />
                            <span>{unit.emissionReading}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                            <Gauge size={12} className="text-blue-500" />
                            <span>{unit.brakeEfficiency}</span>
                          </div>
                        </div>
                      </td>

                      {/* Status & Score */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            unit.inspectionStatus === 'Passed'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                              : unit.inspectionStatus === 'Failed / For Re-test'
                              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                          }`}>
                            {unit.inspectionStatus === 'Passed' ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}
                            <span>{unit.inspectionStatus}</span>
                          </span>

                          {unit.roadworthinessScore > 0 && (
                            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                              Score: <span className={unit.roadworthinessScore >= 80 ? 'text-emerald-600' : 'text-rose-600'}>{unit.roadworthinessScore}%</span>
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Live Inspect Button: Approve (Passed) / Reject (Failed) */}
                          <button
                            onClick={() => handleOpenInspection(unit)}
                            title={
                              unit.inspectionStatus === 'Passed'
                                ? 'View Approved Inspection Audit'
                                : unit.inspectionStatus === 'Failed / For Re-test'
                                ? 'View Rejection & Defect Details'
                                : 'Conduct Safety Inspection'
                            }
                            className={`px-3 py-1.5 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1 cursor-pointer ${
                              unit.inspectionStatus === 'Passed'
                                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                                : unit.inspectionStatus === 'Failed / For Re-test'
                                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                            }`}
                          >
                            {unit.inspectionStatus === 'Passed' ? (
                              <CheckCircle2 size={13} />
                            ) : unit.inspectionStatus === 'Failed / For Re-test' ? (
                              <X size={13} />
                            ) : (
                              <FileCheck size={13} />
                            )}
                            <span>
                              {unit.inspectionStatus === 'Passed'
                                ? 'Approve'
                                : unit.inspectionStatus === 'Failed / For Re-test'
                                ? 'Reject'
                                : 'Conduct Inspection'}
                            </span>
                          </button>

                          {/* Print Certificate */}
                          <button
                            onClick={() => handlePrintInspectionReport(unit)}
                            title="Download Official MVRIC Certificate"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Download size={15} />
                          </button>

                          {/* QR Sticker View */}
                          {unit.stickerReleased && (
                            <button
                              onClick={() => setSelectedStickerUnit(unit)}
                              title="View QR Compliance Sticker"
                              className="p-1.5 text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                              <QrCode size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SUBTAB CONTENT B: TODA ROUTE QUOTA & CORRIDORS */}
      {/* ========================================================================= */}
      {activeSubTab === 'routes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ROUTE_CORRIDORS.map(corridor => {
              const fillPercentage = Math.min(100, Math.round((corridor.activeRegistered / corridor.authorizedQuota) * 100));
              return (
                <div key={corridor.id} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 uppercase font-mono">
                        {corridor.id} • {corridor.lengthKm}
                      </span>
                      <h3 className="text-base font-black text-slate-800 dark:text-white mt-2">
                        {corridor.name}
                      </h3>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{corridor.todaName}</p>
                    </div>

                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                      corridor.routeStatus === 'Within Quota'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : corridor.routeStatus === 'Near Capacity'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}>
                      {corridor.routeStatus}
                    </span>
                  </div>

                  {/* Quota Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">Authorized Quota Utilization</span>
                      <span className="text-slate-800 dark:text-slate-200">{corridor.activeRegistered} / {corridor.authorizedQuota} Units ({fillPercentage}%)</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          fillPercentage > 95 ? 'bg-rose-500' : fillPercentage > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${fillPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Pending Applications</p>
                      <p className="font-bold text-slate-800 dark:text-white mt-0.5">{corridor.pendingApplications} in Queue</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Congestion Index</p>
                      <p className="font-bold text-slate-800 dark:text-white mt-0.5">{corridor.congestionLevel}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SUBTAB CONTENT C: QR COMPLIANCE STICKERS GALLERY */}
      {/* ========================================================================= */}
      {activeSubTab === 'stickers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {inspections.filter(i => i.stickerReleased).map(unit => (
            <div key={unit.id} className="p-6 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl border-2 border-emerald-500/40 shadow-xl relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-900 flex items-center justify-center font-black text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-black text-xs tracking-wider uppercase text-emerald-400">MTFRB COMPLIANCE STICKER</h4>
                    <p className="text-[10px] text-slate-400">Valid CY 2025-2026</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  PASSED
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Unit Body / Stencil</p>
                  <p className="text-xl font-black text-white">{unit.bodyNo}</p>
                  <p className="text-xs font-mono text-emerald-300 mt-0.5">{unit.plateNumber}</p>
                  <p className="text-[11px] text-slate-300 mt-2 font-medium">{unit.todaOrganization}</p>
                </div>

                <div className="w-24 h-24 bg-white p-2 rounded-2xl shadow-lg flex flex-col items-center justify-center">
                  <QrCode size={64} className="text-slate-900" />
                  <span className="text-[8px] font-mono text-slate-600 mt-1 font-bold">{unit.mtopNo}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                <span>Score: {unit.roadworthinessScore}% Roadworthy</span>
                <button
                  onClick={() => handlePrintInspectionReport(unit)}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Download size={12} />
                  <span>Download Sticker SVG</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: LIVE 10-POINT INSPECTION CHECKLIST */}
      {/* ========================================================================= */}
      {activeInspectionUnit && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/20">
                  Vehicle Safety Audit
                </span>
                <h3 className="text-lg font-black mt-1">
                  10-Point Motorpool Roadworthiness Check
                </h3>
                <p className="text-xs text-emerald-100">
                  {activeInspectionUnit.bodyNo} ({activeInspectionUnit.plateNumber}) • {activeInspectionUnit.todaOrganization}
                </p>
              </div>
              <button
                onClick={() => setActiveInspectionUnit(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Checklist Items */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Real-time Roadworthiness Score</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {calculateCurrentScore()}%
                  </p>
                </div>
                <div className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                  calculateCurrentScore() >= 80
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                }`}>
                  {calculateCurrentScore() >= 80 ? '✓ PASSED (≥80%)' : '⚠ FAILED (<80%)'}
                </div>
              </div>

              <div className="space-y-2.5">
                {CHECKLIST_ITEMS.map((item) => {
                  const checked = !!checklistState[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => setChecklistState(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        checked
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold ${
                          checked ? 'bg-emerald-600 text-white' : 'border border-slate-400 text-transparent'
                        }`}>
                          ✓
                        </div>
                        <span className={`text-xs font-semibold ${checked ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 line-through'}`}>
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">+{item.weight}%</span>
                    </div>
                  );
                })}
              </div>

              {/* Remarks Box */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Inspector Audit Notes & Observations
                </label>
                <textarea
                  rows={3}
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  placeholder="Enter detailed safety notes or defects found during bay testing..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveInspectionUnit(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveInspection}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer"
              >
                <CheckCircle2 size={15} />
                <span>Save & Certify Inspection Result</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
