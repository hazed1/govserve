import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Compass, 
  Layers, 
  Download, 
  Check, 
  X, 
  FileText, 
  Award, 
  RefreshCw, 
  Zap, 
  Navigation,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { TabType } from '../types';

interface ComplianceCheckItem {
  id: string;
  category: 'Zoning & Land Use' | 'Geohazard & Environmental' | 'Building Setbacks & Parking' | 'Sanitary & Waste Management';
  ruleName: string;
  requirement: string;
  actualMetric: string;
  status: 'Compliant' | 'Warning' | 'Non-Compliant';
  score: number;
  notes: string;
}

const MOCK_COMPLIANCE_CHECKS: ComplianceCheckItem[] = [
  {
    id: 'CMP-01',
    category: 'Zoning & Land Use',
    ruleName: 'CLUP 2025 Comprehensive Land Use Zoning',
    requirement: 'Commercial Zone (C-2) / Mixed Commercial-Residential',
    actualMetric: 'Zone C-2 (General Commercial)',
    status: 'Compliant',
    score: 100,
    notes: 'Business line matches municipal allowable land-use classification.'
  },
  {
    id: 'CMP-02',
    category: 'Building Setbacks & Parking',
    ruleName: 'Road Right-of-Way (RROW) Setback Allowance',
    requirement: 'Minimum 5.0m setback from arterial road centerline',
    actualMetric: '5.4m Setback Observed',
    status: 'Compliant',
    score: 95,
    notes: 'Adequate pedestrian sidewalk buffer provided.'
  },
  {
    id: 'CMP-03',
    category: 'Building Setbacks & Parking',
    ruleName: 'Customer Parking Slot Ratio (NBCP Rule VII)',
    requirement: '1 customer parking slot per 50 sq.m gross floor area',
    actualMetric: '4 Designated Parking Slots for 180 sq.m area',
    status: 'Compliant',
    score: 92,
    notes: 'Includes 1 designated PWD-accessible parking bay.'
  },
  {
    id: 'CMP-04',
    category: 'Geohazard & Environmental',
    ruleName: 'MGB Earthquake Faultline & Geohazard Clearance',
    requirement: 'Buffer distance > 500m from active West Valley Fault trace',
    actualMetric: '3.8 km Distance to Nearest Fault Trace',
    status: 'Compliant',
    score: 100,
    notes: 'Low seismic ground rupture vulnerability.'
  },
  {
    id: 'CMP-05',
    category: 'Geohazard & Environmental',
    ruleName: '100-Year Flood Inundation Susceptibility',
    requirement: 'Ground finish elevation > 1.2m above seasonal flood datum',
    actualMetric: '0.9m Elevation (Minor Flood Zone)',
    status: 'Warning',
    score: 78,
    notes: 'Recommend installing water retention sump pump and elevated electrical panel.'
  },
  {
    id: 'CMP-06',
    category: 'Sanitary & Waste Management',
    ruleName: 'Solid Waste Segregation & Grease Trap Facility',
    requirement: 'Dual-chamber grease interceptor & segregated MRF bin',
    actualMetric: 'Grease trap installed & DENR certified',
    status: 'Compliant',
    score: 96,
    notes: 'Environmental compliance certificate (ECC/CNC) on record.'
  }
];

interface AIComplianceCheckingProps {
  onNavigateToTab?: (tab: TabType) => void;
}

export const AIComplianceChecking: React.FC<AIComplianceCheckingProps> = ({ 
  onNavigateToTab 
}) => {
  const [checks, setChecks] = useState<ComplianceCheckItem[]>(MOCK_COMPLIANCE_CHECKS);
  const [businessName, setBusinessName] = useState<string>('ABC Trading & Commercial Merchandise');
  const [lotAddress, setLotAddress] = useState<string>('Lot 12 Blk 4, Rizal Street, Barangay San Isidro');
  const [gpsCoordinates, setGpsCoordinates] = useState<string>('14.2140° N, 121.1643° E');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const overallScore = Math.round(
    checks.reduce((acc, curr) => acc + curr.score, 0) / checks.length
  );

  const handleReRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      showToast('⚡ AI Locational Zoning & Environmental Compliance Check complete!');
    }, 800);
  };

  const handleDownloadZoningCert = () => {
    const cert = `========================================================================================
MUNICIPAL PLANNING & DEVELOPMENT COORDINATOR (MPDC) • ZONING DIVISION
AI-ASSISTED LOCATIONAL ZONING & COMPREHENSIVE COMPLIANCE CERTIFICATE
========================================================================================
Certificate Control No. : ZC-2025-00412
Business Trade Entity   : ${businessName}
Property / Lot Address  : ${lotAddress}
GPS Coordinates         : ${gpsCoordinates}
Overall Compliance Score: ${overallScore}% (PASSED REGULATORY THRESHOLD)
CLUP Land Use Category  : Commercial Zone (C-2)
----------------------------------------------------------------------------------------
AUDIT SUMMARY:
1. Land Use Zoning Compatibility : PASSED (100% Match with Comprehensive Land Use Plan)
2. Road Right-of-Way Setback     : PASSED (5.4m setback compliant with NBCP Rule VII)
3. Mandatory Parking Ratio       : PASSED (4 Slots provided for 180 sq.m floor area)
4. MGB Geohazard & Faultline     : PASSED (3.8 km buffer to active faultline)
5. Flood Susceptibility Rating   : MODERATE (Elevated electrical & sump pump recommended)
6. Ecological Solid Waste ECC    : PASSED (Segregated MRF & grease interceptor verified)
----------------------------------------------------------------------------------------
RECOMMENDATION:
LOCATIONAL CLEARANCE FOR BUSINESS PERMIT OPERATION IS HEREBY APPROVED.
Issuing Authority : Municipal Zoning Administrator & MPDC Board
Digital Seal      : SHA256-ZONING-SANISIDRO-2025-AUTHENTICATED
========================================================================================`;

    const blob = new Blob([cert], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Zoning_Clearance_Certificate.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded Official Locational Zoning Clearance Certificate');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Realtime Toast */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center space-x-2.5 animate-bounce">
          <Sparkles size={16} className="text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP HERO BANNER */}
      {/* ========================================================================= */}
      <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            AI Zoning & Regulatory Compliance Check
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Automated evaluation against the Comprehensive Land Use Plan (CLUP), GIS locational zoning ordinances, MGB geohazards, setbacks, and parking requirements.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. OVERVIEW CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Overall AI Compliance</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{overallScore}%</h3>
            <span className="text-[11px] text-emerald-600 font-bold">✓ Cleared for Clearance</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Zoning Classification</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Zone C-2</h3>
            <span className="text-[11px] text-blue-600 font-bold">General Commercial</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
            <Building2 size={24} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Geohazard Risk</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Low / Safe</h3>
            <span className="text-[11px] text-emerald-600 font-bold">&gt; 3.8 km Fault Buffer</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold">
            <Compass size={24} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Locational Clearance</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">APPROVED</h3>
            <span className="text-[11px] text-slate-400 font-medium">Ready for Release</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck size={24} />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. GIS LOCATION & CHECKLIST GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: GIS Coordinates & Site Metadata */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              GIS Property & Site Location
            </h3>
            <p className="text-xs text-slate-500">Cadastral & locational coordinates</p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Business Entity</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold dark:text-white"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Lot & Street Address</label>
              <input
                type="text"
                value={lotAddress}
                onChange={(e) => setLotAddress(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold dark:text-white"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">GPS Coordinates</label>
              <input
                type="text"
                value={gpsCoordinates}
                onChange={(e) => setGpsCoordinates(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-semibold dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleDownloadZoningCert}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Download size={15} />
              <span>Download Locational Clearance</span>
            </button>
          </div>
        </div>

        {/* Right: Automated Compliance Checks Matrix */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Municipal Regulatory Ordinance Matrix
              </h3>
              <p className="text-xs text-slate-500">6-point automated AI compliance audit</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
              Score: {overallScore}%
            </span>
          </div>

          <div className="space-y-3">
            {checks.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">
                      {c.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                      {c.ruleName}
                    </h4>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    c.status === 'Compliant'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border border-amber-200'
                  }`}>
                    {c.status} ({c.score}%)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400">Requirement: </span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{c.requirement}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Actual Metric: </span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{c.actualMetric}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  Note: {c.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
