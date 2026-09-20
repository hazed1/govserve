import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  QrCode, 
  FileCheck, 
  User, 
  DollarSign, 
  Landmark, 
  FileText,
  MapPin,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface BarangayPermitUploadWizardProps {
  onBack: () => void;
  onAddNewApplication?: (applicantName: string, permitType: string) => void;
  onNavigateToDashboard?: () => void;
}

export const BarangayPermitUploadWizard: React.FC<BarangayPermitUploadWizardProps> = ({
  onBack,
  onAddNewApplication,
  onNavigateToDashboard
}) => {
  const { user } = useAuth();

  const [wizardStep, setWizardStep] = useState<number>(1);
  const [cedulaFile, setCedulaFile] = useState<string | null>('Cedula_CTC_Official_2025_CC20248841029.pdf');
  const [businessDocFile, setBusinessDocFile] = useState<string | null>(null);
  const [applicantIdFile, setApplicantIdFile] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractTarget, setExtractTarget] = useState<string | null>(null);
  const [detectedDocType, setDetectedDocType] = useState<string | null>('Community Tax Certificate (Cedula CTC Form No. 0016)');
  const [confidence, setConfidence] = useState<number>(99.6);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Extracted Barangay & Clearance Data
  const [brgyData, setBrgyData] = useState({
    applicantName: user?.name || 'Teresa Santos Alcantara',
    contactNumber: '+63 917 555 3321',
    businessName: 'Batasan Supermart & Convenience Corp.',
    businessNature: 'General Merchandise / Grocery Retail',
    barangay: 'Barangay Batasan Hills',
    sitioZone: 'Zone 4, Sitio San Roque',
    businessAddress: '142 Batasan-San Mateo Road, Brgy. Batasan Hills, Quezon City',
    cedulaNumber: 'CC2024-8841029',
    cedulaDateIssued: '2025-01-14',
    cedulaPlaceIssued: 'Quezon City Hall Treasury Annex',
    luponStatus: 'Clean Record (No pending dispute / amicably settled)',
    gridSyncStatus: 'Connected to 24-Barangay Automated Integration Network'
  });

  const [idData, setIdData] = useState({
    fullName: user?.name || 'Teresa Santos Alcantara',
    idType: 'Philippine National ID (PhilSys)',
    idNumber: '8821-4901-3310-8841',
    dateOfBirth: '1987-03-18',
    address: '142 Batasan-San Mateo Road, Brgy. Batasan Hills, Quezon City',
    matchScore: 100
  });

  const [generatedRef, setGeneratedRef] = useState<string>('');
  const [swornAgreed, setSwornAgreed] = useState<boolean>(true);

  // Sample Presets
  const applyPreset = (type: 'retail' | 'cafe' | 'services') => {
    setIsExtracting(true);
    setTimeout(() => {
      if (type === 'retail') {
        setCedulaFile('Cedula_CTC_Batasan_CC20248841029.pdf');
        setBusinessDocFile('DTI_Certificate_BatasanSupermart.pdf');
        setApplicantIdFile('PhilID_TeresaAlcantara.jpg');
        setDetectedDocType('Community Tax Certificate (Cedula CTC) & DTI Certificate');
        setConfidence(99.6);
        setBrgyData({
          applicantName: 'Teresa Santos Alcantara',
          contactNumber: '+63 917 555 3321',
          businessName: 'Batasan Supermart & Convenience Corp.',
          businessNature: 'General Merchandise / Grocery Retail',
          barangay: 'Barangay Batasan Hills',
          sitioZone: 'Zone 4, Sitio San Roque',
          businessAddress: '142 Batasan-San Mateo Road, Brgy. Batasan Hills, Quezon City',
          cedulaNumber: 'CC2024-8841029',
          cedulaDateIssued: '2025-01-14',
          cedulaPlaceIssued: 'Quezon City Hall Treasury Annex',
          luponStatus: 'Clean Record (No pending dispute)',
          gridSyncStatus: 'Connected to 24-Barangay Automated Integration Network'
        });
        setIdData({
          fullName: 'Teresa Santos Alcantara',
          idType: 'Philippine National ID (PhilSys)',
          idNumber: '8821-4901-3310-8841',
          dateOfBirth: '1987-03-18',
          address: '142 Batasan-San Mateo Road, Brgy. Batasan Hills, Quezon City',
          matchScore: 100
        });
      } else if (type === 'cafe') {
        setCedulaFile('Cedula_CTC_Fairview_CC20241192084.pdf');
        setBusinessDocFile('SEC_Registration_FairviewBeans.pdf');
        setApplicantIdFile('Passport_GabrielNavarro.jpg');
        setDetectedDocType('Community Tax Certificate (Cedula CTC Form No. 0016)');
        setConfidence(99.1);
        setBrgyData({
          applicantName: 'Gabriel S. Navarro',
          contactNumber: '+63 918 333 7788',
          businessName: 'Fairview Artisan Coffee & Bakery',
          businessNature: 'Food & Beverage / Specialty Cafe',
          barangay: 'Barangay Fairview',
          sitioZone: 'Dahlia Commercial Center',
          businessAddress: '28 Dahlia Avenue, Brgy. Fairview, Quezon City',
          cedulaNumber: 'CC2024-1192084',
          cedulaDateIssued: '2025-01-20',
          cedulaPlaceIssued: 'Brgy. Fairview Satellite Sub-Treasury',
          luponStatus: 'Clean Record (No pending dispute)',
          gridSyncStatus: 'Connected to 24-Barangay Automated Integration Network'
        });
        setIdData({
          fullName: 'Gabriel S. Navarro',
          idType: 'Philippine Passport (DFA)',
          idNumber: 'P9920145B',
          dateOfBirth: '1990-08-11',
          address: '28 Dahlia Avenue, Brgy. Fairview, Quezon City',
          matchScore: 100
        });
      } else {
        setCedulaFile('Cedula_CTC_Central_CC20245501923.pdf');
        setBusinessDocFile('Contract_Of_Lease_QCPrime.pdf');
        setApplicantIdFile('UMID_Card_CorazonReyes.jpg');
        setDetectedDocType('Community Tax Certificate (Cedula CTC) & Notarized Lease');
        setConfidence(98.8);
        setBrgyData({
          applicantName: 'Corazon M. Reyes',
          contactNumber: '+63 920 111 9900',
          businessName: 'QC Prime Logistics & Forwarding',
          businessNature: 'Freight Logistics & Support Services',
          barangay: 'Barangay Central',
          sitioZone: 'Elliptical Commercial Arcade',
          businessAddress: 'Suite 302, 77 East Avenue, Brgy. Central, Quezon City',
          cedulaNumber: 'CC2024-5501923',
          cedulaDateIssued: '2025-01-25',
          cedulaPlaceIssued: 'City Treasurer Cashier Central',
          luponStatus: 'Clean Record (No pending dispute)',
          gridSyncStatus: 'Connected to 24-Barangay Automated Integration Network'
        });
        setIdData({
          fullName: 'Corazon M. Reyes',
          idType: 'Unified Multi-Purpose ID (UMID)',
          idNumber: 'CRN-0012-990145-8',
          dateOfBirth: '1982-11-29',
          address: 'Suite 302, 77 East Avenue, Brgy. Central, Quezon City',
          matchScore: 100
        });
      }
      setIsExtracting(false);
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'cedula' | 'businessDoc' | 'applicantId') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsExtracting(true);
    setExtractTarget(target);
    setTimeout(() => {
      if (target === 'cedula') {
        setCedulaFile(file.name);
        setDetectedDocType('Community Tax Certificate (Cedula CTC Form No. 0016)');
        setConfidence(99.6);
      } else if (target === 'businessDoc') {
        setBusinessDocFile(file.name);
      } else if (target === 'applicantId') {
        setApplicantIdFile(file.name);
      }
      setIsExtracting(false);
      setExtractTarget(null);
    }, 700);
  };

  const handleSubmit = () => {
    const ref = `BR-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedRef(ref);
    setWizardStep(6);
    if (onAddNewApplication) {
      onAddNewApplication(brgyData.applicantName, 'Barangay Permit Integration');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in pb-12">
      {/* Wizard Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <ShieldCheck size={26} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                UPLOAD-FIRST BARANGAY INTEGRATION
              </span>
              <span className="text-xs text-slate-400 font-medium">Community Clearance & Sync</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              Barangay Permit & Clearance Application
            </h2>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {[
            { step: 1, label: 'Cedula CTC' },
            { step: 2, label: 'Business Docs' },
            { step: 3, label: 'Applicant ID' },
            { step: 4, label: 'Fees' },
            { step: 5, label: 'Review' },
            { step: 6, label: 'Tracking' }
          ].map((s) => (
            <div 
              key={s.step} 
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                wizardStep === s.step 
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
                  : wizardStep > s.step 
                    ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              <span>{s.step}</span>
              <span className="hidden md:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: CEDULA CTC UPLOAD & EXTRACTION */}
      {wizardStep === 1 && (
        <div className="space-y-6 animate-in fade-in">
          {/* Preset Test Documents Bar */}
          <div className="p-4 bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs text-purple-800 dark:text-purple-300">
              <Sparkles size={16} className="text-purple-600 animate-pulse" />
              <span className="font-bold">Test Presets (Click to Auto-Load Sample Barangay Documents):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset('retail')}
                className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-purple-500 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                🏪 Retail Store (Brgy. Batasan Hills)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('cafe')}
                className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-purple-500 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                ☕ Specialty Cafe (Brgy. Fairview)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('services')}
                className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-purple-500 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                🏢 Logistics Center (Brgy. Central)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Upload Box */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                  <FileText size={16} className="text-purple-600" />
                  <span>Upload Cedula (CTC)</span>
                </h3>
                <span className="text-[11px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-full">Required</span>
              </div>

              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 rounded-2xl p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-800/30">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center mb-3">
                  <Upload size={22} />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {cedulaFile ? cedulaFile : 'Upload Community Tax Certificate (Cedula) photo or PDF'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Accepts .jpg, .png, .pdf up to 25MB</p>
                
                <label className="mt-4 inline-block px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-purple-600/20">
                  <span>Browse Cedula File</span>
                  <input 
                    type="file" 
                    accept=".jpg,.jpeg,.png,.pdf" 
                    className="hidden" 
                    onChange={(e) => handleFileUpload(e, 'cedula')} 
                  />
                </label>
              </div>

              {detectedDocType && (
                <div className="p-3.5 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-800 dark:text-purple-300">Detected Document:</span>
                    <span className="px-2 py-0.5 rounded-md font-bold bg-purple-600 text-white text-[10px]">
                      {confidence}% Confidence
                    </span>
                  </div>
                  <p className="text-purple-700 dark:text-purple-400 font-medium">{detectedDocType}</p>
                </div>
              )}
            </div>

            {/* Extracted Review Card */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                    <Sparkles size={16} className="text-purple-600" />
                    <span>Auto-Extracted CTC & Taxpayer Details</span>
                  </h3>
                  <p className="text-xs text-slate-400">Extracted from official municipal tax database</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all"
                >
                  {isEditing ? 'Save Changes' : 'Edit Fields'}
                </button>
              </div>

              {isExtracting && extractTarget === 'cedula' ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-purple-600">Extracting Cedula number, date, and place issued...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="sm:col-span-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Taxpayer / Applicant Name</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={brgyData.applicantName} 
                        onChange={(e) => setBrgyData({...brgyData, applicantName: e.target.value})}
                        className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border rounded-lg"
                      />
                    ) : (
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{brgyData.applicantName}</p>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Cedula (CTC) Number</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={brgyData.cedulaNumber} 
                        onChange={(e) => setBrgyData({...brgyData, cedulaNumber: e.target.value})}
                        className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border rounded-lg font-mono"
                      />
                    ) : (
                      <p className="font-bold text-purple-600 dark:text-purple-400 text-base font-mono">{brgyData.cedulaNumber}</p>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Barangay Jurisdiction</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={brgyData.barangay} 
                        onChange={(e) => setBrgyData({...brgyData, barangay: e.target.value})}
                        className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border rounded-lg"
                      />
                    ) : (
                      <p className="font-bold text-slate-800 dark:text-slate-200">{brgyData.barangay}</p>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Date of Issuance</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{brgyData.cedulaDateIssued}</p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Place of Issuance</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{brgyData.cedulaPlaceIssued}</p>
                  </div>

                  <div className="sm:col-span-2 p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900/40 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-purple-900 dark:text-purple-200 uppercase">Lupon Tagapamayapa Clearance</span>
                      <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">{brgyData.luponStatus}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center space-x-1">
                      <CheckCircle2 size={12} />
                      <span>NO DISPUTE</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setWizardStep(2)}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-purple-600/30"
            >
              <span>Next: Business Registration Docs</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: BUSINESS REGISTRATION & LEASE DOCS */}
      {wizardStep === 2 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                  <Building2 size={16} className="text-purple-600" />
                  <span>Upload DTI / SEC / Lease</span>
                </h3>
                <span className="text-[11px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-full">Required</span>
              </div>

              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 rounded-2xl p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-800/30">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center mb-3">
                  <Building2 size={22} />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {businessDocFile ? businessDocFile : 'Upload DTI Certificate, SEC Articles, or Contract of Lease'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Accepts PDF, JPG, PNG</p>
                <label className="mt-4 inline-block px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all">
                  <span>Browse Document</span>
                  <input 
                    type="file" 
                    accept=".jpg,.jpeg,.png,.pdf" 
                    className="hidden" 
                    onChange={(e) => handleFileUpload(e, 'businessDoc')} 
                  />
                </label>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <p className="font-bold text-slate-900 dark:text-white">Integration Network Checks:</p>
                <ul className="text-slate-500 space-y-1 list-disc pl-4 text-[11px]">
                  <li>Sitio/Purok boundary cross-verification</li>
                  <li>Barangay Revenue Code compliance for business lines</li>
                  <li>Automatic sync with Quezon City 24-Barangay Hub</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                <Sparkles size={16} className="text-purple-600" />
                <span>Extracted Business & Location Data</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Registered Enterprise Name</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{brgyData.businessName}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Line of Business</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{brgyData.businessNature}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Sitio / Zone</span>
                    <p className="font-bold text-purple-600 dark:text-purple-400 font-medium">{brgyData.sitioZone}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Complete Physical Business Address</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{brgyData.businessAddress}</p>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center space-x-2 text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span className="font-bold">{brgyData.gridSyncStatus}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setWizardStep(1)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center space-x-1"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setWizardStep(3)}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-purple-600/30"
            >
              <span>Next: Applicant ID & Identity Match</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: APPLICANT ID & CROSS-MATCH */}
      {wizardStep === 3 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                  <User size={16} className="text-purple-600" />
                  <span>Upload Government ID</span>
                </h3>
                <span className="text-[11px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-full">Required</span>
              </div>

              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 rounded-2xl p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-800/30">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center mb-3">
                  <User size={22} />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {applicantIdFile ? applicantIdFile : 'Upload PhilSys National ID, UMID, Passport, or Driver’s License'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Accepts JPG, PNG, PDF</p>
                <label className="mt-4 inline-block px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all">
                  <span>Browse ID File</span>
                  <input 
                    type="file" 
                    accept=".jpg,.jpeg,.png,.pdf" 
                    className="hidden" 
                    onChange={(e) => handleFileUpload(e, 'applicantId')} 
                  />
                </label>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Residency & Identity Cross-Match</p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">Matches CTC Taxpayer Records</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-emerald-600">{idData.matchScore}%</span>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">Verified</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                <Sparkles size={16} className="text-purple-600" />
                <span>Extracted Identity & Residency Data</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Taxpayer Legal Name</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{idData.fullName}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">ID Classification</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{idData.idType}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">National ID Number</span>
                    <p className="font-bold text-purple-600 dark:text-purple-400 font-mono">{idData.idNumber}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Date of Birth</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{idData.dateOfBirth}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Contact Mobile</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 font-mono">{brgyData.contactNumber}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Barangay Resident Address</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{idData.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setWizardStep(2)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center space-x-1"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setWizardStep(4)}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-purple-600/30"
            >
              <span>Next: Barangay Fees Schedule</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: FEE ASSESSMENT */}
      {wizardStep === 4 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                <DollarSign size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Barangay Regulatory Fee Schedule
                </h3>
                <p className="text-xs text-slate-500">Barangay Tax Ordinance & City-wide One-Stop Permitting Code</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Barangay Business Clearance Fee</p>
                  <p className="text-[11px] text-slate-400">Jurisdiction commercial endorsement & zoning</p>
                </div>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₱ 350.00</span>
              </div>

              <div className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Community Development & Sanitation Fee</p>
                  <p className="text-[11px] text-slate-400">Barangay environmental maintenance & waste disposal fund</p>
                </div>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₱ 200.00</span>
              </div>

              <div className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">CTC Verification & Document Stamp</p>
                  <p className="text-[11px] text-slate-400">Digital authentication of Cedula records</p>
                </div>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₱ 100.00</span>
              </div>

              <div className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Digital Security Hologram & QR Seal</p>
                  <p className="text-[11px] text-slate-400">Tamper-proof verifiable e-clearance certificate</p>
                </div>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₱ 100.00</span>
              </div>

              <div className="py-4 flex justify-between items-center bg-purple-50/50 dark:bg-purple-950/20 px-4 rounded-2xl">
                <div>
                  <p className="text-sm font-black text-purple-900 dark:text-purple-200 uppercase">Total Barangay Assessment</p>
                  <p className="text-[11px] text-purple-600">Integrated directly into your Mayor's Permit payment</p>
                </div>
                <span className="text-xl font-black text-purple-600 dark:text-purple-400 font-mono">
                  ₱ 750.00
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setWizardStep(3)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center space-x-1"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setWizardStep(5)}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-purple-600/30"
            >
              <span>Next: Final Review & Sworn Declaration</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: FINAL REVIEW & DECLARATION */}
      {wizardStep === 5 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                <FileCheck size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Barangay Clearance Summary & Undertaking
                </h3>
                <p className="text-xs text-slate-500">Confirm all extracted data before dispatching to the Punong Barangay</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Barangay & Applicant Profile</span>
                <p className="font-black text-slate-900 dark:text-white text-sm">{brgyData.applicantName}</p>
                <p className="text-purple-600 dark:text-purple-400 font-bold">{brgyData.barangay} • {brgyData.sitioZone}</p>
                <p className="text-slate-600 dark:text-slate-400 font-mono">CTC: {brgyData.cedulaNumber}</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Enterprise Data</span>
                <p className="font-black text-slate-900 dark:text-white text-sm">{brgyData.businessName}</p>
                <p className="text-slate-600 dark:text-slate-400">{brgyData.businessNature}</p>
                <p className="text-slate-600 dark:text-slate-400">{brgyData.businessAddress}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={swornAgreed} 
                  onChange={(e) => setSwornAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 w-4 h-4" 
                />
                <span className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  I solemnly declare that the attached Community Tax Certificate and business papers are authentic, and that the enterprise operates peacefully with no pending litigation or unresolved complaints before the Lupong Tagapamayapa.
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setWizardStep(4)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center space-x-1"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
            <button
              type="button"
              disabled={!swornAgreed}
              onClick={handleSubmit}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              <CheckCircle2 size={16} />
              <span>Confirm & Submit Clearance</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: DIGITAL PERMIT TRACKING */}
      {wizardStep === 6 && (
        <div className="space-y-6 animate-in zoom-in-95">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-950 text-purple-600 mx-auto rounded-full flex items-center justify-center">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                CLEARANCE FILED WITH BARANGAY SECRETARIAT
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Barangay Clearance Lodged!
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your clearance application is now synchronized with {brgyData.barangay} and queued for digital clearance issuance.
              </p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-md mx-auto space-y-4">
              <div className="w-32 h-32 bg-white p-2 rounded-2xl mx-auto border border-slate-200 shadow-sm flex items-center justify-center">
                <QrCode size={110} className="text-slate-900" />
              </div>

              <div>
                <p className="text-[11px] text-slate-400 uppercase font-bold">Barangay Clearance Reference No.</p>
                <p className="text-xl font-black text-purple-600 font-mono tracking-wider">{generatedRef}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-semibold">{brgyData.applicantName} • {brgyData.barangay}</p>
              </div>
            </div>

            {/* 4 Milestones */}
            <div className="max-w-2xl mx-auto pt-2">
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white mx-auto flex items-center justify-center font-bold text-xs">1</div>
                  <p className="font-bold text-purple-600 text-[11px]">Lodged</p>
                  <p className="text-[10px] text-slate-400">CTC Verified</p>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mx-auto flex items-center justify-center font-bold text-xs">2</div>
                  <p className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">Lupon Audit</p>
                  <p className="text-[10px] text-slate-400">Clean Records</p>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mx-auto flex items-center justify-center font-bold text-xs">3</div>
                  <p className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">Captain Review</p>
                  <p className="text-[10px] text-slate-400">Approval Seal</p>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mx-auto flex items-center justify-center font-bold text-xs">4</div>
                  <p className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">LGU Integration</p>
                  <p className="text-[10px] text-slate-400">Ready for Permit</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-center space-x-3">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
              >
                Return to Overview
              </button>
              {onNavigateToDashboard && (
                <button
                  type="button"
                  onClick={onNavigateToDashboard}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold"
                >
                  View in Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
