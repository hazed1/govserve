import React, { useState } from 'react';
import { 
  Bus, 
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
  Car,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FranchiseTransportUploadWizardProps {
  onBack: () => void;
  onAddNewApplication?: (applicantName: string, permitType: string) => void;
  onNavigateToDashboard?: () => void;
}

export const FranchiseTransportUploadWizard: React.FC<FranchiseTransportUploadWizardProps> = ({
  onBack,
  onAddNewApplication,
  onNavigateToDashboard
}) => {
  const { user } = useAuth();

  const [wizardStep, setWizardStep] = useState<number>(1);
  const [orcrFile, setOrcrFile] = useState<string | null>('LTO_ORCR_Official_Registration_Plate_4829QC.pdf');
  const [todaFile, setTodaFile] = useState<string | null>(null);
  const [operatorIdFile, setOperatorIdFile] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractTarget, setExtractTarget] = useState<string | null>(null);
  const [detectedDocType, setDetectedDocType] = useState<string | null>('LTO Certificate of Registration & Official Receipt');
  const [confidence, setConfidence] = useState<number>(99.4);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Extracted Transport & Franchise Data
  const [transportData, setTransportData] = useState({
    operatorName: user?.name || 'Ramon S. Dela Cruz',
    operatorContact: '+63 917 444 8899',
    operatorAddress: 'Block 14, Lot 22, Dahlia St., Brgy. Fairview, Quezon City',
    vehicleCategory: 'Motorized Tricycle-for-Hire (MTOP)',
    plateNumber: '4829-QC',
    engineNumber: 'KB4-992140',
    chassisNumber: 'CH-2023-QC-88192',
    makeModel: 'Kawasaki Barako II 175cc with Sidecar',
    yearModel: '2023',
    fuelType: 'Gasoline (Euro 4 Compliant)',
    todaAssociation: 'Fairview-Regalado TODA Federation Inc.',
    todaBodyNumber: 'BODY-FRV-042',
    routeDesignation: 'Route Zone 2: Fairview Terraces to Dahlia Wet Market via Regalado Highway',
    driverLicenseNo: 'N02-14-884920',
    driverLicenseExpiry: '2028-11-15'
  });

  const [idData, setIdData] = useState({
    fullName: user?.name || 'Ramon S. Dela Cruz',
    idType: 'Professional Driver’s License (LTO Philippines)',
    idNumber: 'N02-14-884920',
    dateOfBirth: '1984-06-22',
    address: 'Block 14, Lot 22, Dahlia St., Brgy. Fairview, Quezon City',
    matchScore: 100
  });

  const [generatedRef, setGeneratedRef] = useState<string>('');
  const [swornAgreed, setSwornAgreed] = useState<boolean>(true);

  // Sample Presets
  const applyPreset = (type: 'tricycle' | 'jeepney' | 'uv') => {
    setIsExtracting(true);
    setTimeout(() => {
      if (type === 'tricycle') {
        setOrcrFile('LTO_ORCR_Tricycle_4829QC.pdf');
        setTodaFile('TODA_Barangay_Endorsement_FRV042.pdf');
        setOperatorIdFile('LTO_Professional_License_RamonDelaCruz.jpg');
        setDetectedDocType('LTO Official Receipt / Certificate of Registration (OR/CR)');
        setConfidence(99.4);
        setTransportData({
          operatorName: 'Ramon S. Dela Cruz',
          operatorContact: '+63 917 444 8899',
          operatorAddress: 'Block 14, Lot 22, Dahlia St., Brgy. Fairview, Quezon City',
          vehicleCategory: 'Motorized Tricycle-for-Hire (MTOP)',
          plateNumber: '4829-QC',
          engineNumber: 'KB4-992140',
          chassisNumber: 'CH-2023-QC-88192',
          makeModel: 'Kawasaki Barako II 175cc with Sidecar',
          yearModel: '2023',
          fuelType: 'Gasoline (Euro 4 Compliant)',
          todaAssociation: 'Fairview-Regalado TODA Federation Inc.',
          todaBodyNumber: 'BODY-FRV-042',
          routeDesignation: 'Route Zone 2: Fairview Terraces to Dahlia Wet Market via Regalado Highway',
          driverLicenseNo: 'N02-14-884920',
          driverLicenseExpiry: '2028-11-15'
        });
        setIdData({
          fullName: 'Ramon S. Dela Cruz',
          idType: 'Professional Driver’s License (LTO Philippines)',
          idNumber: 'N02-14-884920',
          dateOfBirth: '1984-06-22',
          address: 'Block 14, Lot 22, Dahlia St., Brgy. Fairview, Quezon City',
          matchScore: 100
        });
      } else if (type === 'jeepney') {
        setOrcrFile('LTO_ORCR_Modern_PUJ_NBE8821.pdf');
        setTodaFile('LTFRB_Route_CPC_Endorsement.pdf');
        setOperatorIdFile('Operator_License_MateoReyes.jpg');
        setDetectedDocType('LTFRB CPC Certificate & LTO Motor Vehicle OR/CR');
        setConfidence(98.9);
        setTransportData({
          operatorName: 'Mateo G. Reyes',
          operatorContact: '+63 920 888 1122',
          operatorAddress: '88 Commonwealth Avenue, Brgy. Holy Spirit, Quezon City',
          vehicleCategory: 'Public Utility Jeepney (PUJ Modern)',
          plateNumber: 'NBE-8821',
          engineNumber: '4JB1-T-889021',
          chassisNumber: 'CH-ISZ-2024-55102',
          makeModel: 'Isuzu QKR Class 2 Euro 4 Modern PUJ',
          yearModel: '2024',
          fuelType: 'Clean Diesel (Euro 4)',
          todaAssociation: 'Commonwealth-Cubao Transport Cooperative',
          todaBodyNumber: 'COOP-QC-118',
          routeDesignation: 'Route 10: Fairview to Cubao Gateway via Quezon Avenue & EDSA',
          driverLicenseNo: 'N01-08-339182',
          driverLicenseExpiry: '2029-03-20'
        });
        setIdData({
          fullName: 'Mateo G. Reyes',
          idType: 'Unified Multi-Purpose ID (UMID)',
          idNumber: 'CRN-0033-991204-1',
          dateOfBirth: '1979-04-12',
          address: '88 Commonwealth Avenue, Brgy. Holy Spirit, Quezon City',
          matchScore: 100
        });
      } else {
        setOrcrFile('LTO_ORCR_UVExpress_NBP5510.pdf');
        setTodaFile('LTFRB_UV_Route_Certificate.pdf');
        setOperatorIdFile('Drivers_License_DaniloBautista.jpg');
        setDetectedDocType('UV Express Public Utility Van OR/CR & LTFRB Endorsement');
        setConfidence(99.1);
        setTransportData({
          operatorName: 'Danilo E. Bautista',
          operatorContact: '+63 918 222 3456',
          operatorAddress: '15 Mindanao Ave., Project 8, Quezon City',
          vehicleCategory: 'UV Express / Van-for-Hire',
          plateNumber: 'NBP-5510',
          engineNumber: '2KD-FTV-771239',
          chassisNumber: 'KDH200-0099412',
          makeModel: 'Toyota HiAce Commuter 15-Seater',
          yearModel: '2022',
          fuelType: 'Diesel Common-Rail',
          todaAssociation: 'Metro North UV Express Operators Alliance',
          todaBodyNumber: 'UV-QC-091',
          routeDesignation: 'Route 4B: SM Fairview to Ayala / Gil Puyat Makati via Skyway',
          driverLicenseNo: 'N03-99-441209',
          driverLicenseExpiry: '2027-08-10'
        });
        setIdData({
          fullName: 'Danilo E. Bautista',
          idType: 'Philippine National ID (PhilSys)',
          idNumber: '9921-4401-8821-3301',
          dateOfBirth: '1981-12-05',
          address: '15 Mindanao Ave., Project 8, Quezon City',
          matchScore: 100
        });
      }
      setIsExtracting(false);
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'orcr' | 'toda' | 'operatorId') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsExtracting(true);
    setExtractTarget(target);
    setTimeout(() => {
      if (target === 'orcr') {
        setOrcrFile(file.name);
        setDetectedDocType('LTO Official Receipt / Certificate of Registration (OR/CR)');
        setConfidence(99.4);
      } else if (target === 'toda') {
        setTodaFile(file.name);
      } else if (target === 'operatorId') {
        setOperatorIdFile(file.name);
      }
      setIsExtracting(false);
      setExtractTarget(null);
    }, 700);
  };

  const handleSubmit = () => {
    const ref = `FT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedRef(ref);
    setWizardStep(6);
    if (onAddNewApplication) {
      onAddNewApplication(transportData.operatorName, 'Franchise & Transport Permit');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in pb-12">
      {/* Wizard Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Bus size={26} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                UPLOAD-FIRST FRANCHISE WORKFLOW
              </span>
              <span className="text-xs text-slate-400 font-medium">MTOP & PUV Licensing</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              Franchise & Transport Permit Application
            </h2>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {[
            { step: 1, label: 'LTO OR/CR' },
            { step: 2, label: 'TODA Route' },
            { step: 3, label: 'Operator ID' },
            { step: 4, label: 'Fees' },
            { step: 5, label: 'Review' },
            { step: 6, label: 'Tracking' }
          ].map((s) => (
            <div 
              key={s.step} 
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                wizardStep === s.step 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                  : wizardStep > s.step 
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              <span>{s.step}</span>
              <span className="hidden md:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: LTO OR/CR UPLOAD & AUTO-EXTRACTION */}
      {wizardStep === 1 && (
        <div className="space-y-6 animate-in fade-in">
          {/* Preset Test Documents Bar */}
          <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs text-emerald-800 dark:text-emerald-300">
              <Sparkles size={16} className="text-emerald-600 animate-pulse" />
              <span className="font-bold">Test Presets (Click to Auto-Load Sample LTO Documents):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset('tricycle')}
                className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-500 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                🛺 Tricycle (MTOP Fairview)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('jeepney')}
                className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-500 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                🚌 Modern PUJ (Commonwealth)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('uv')}
                className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-500 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                🚐 UV Express (SM Fairview)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Upload Box */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                  <FileText size={16} className="text-emerald-600" />
                  <span>Upload LTO OR / CR</span>
                </h3>
                <span className="text-[11px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-full">Required</span>
              </div>

              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-800/30">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3">
                  <Upload size={22} />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {orcrFile ? orcrFile : 'Drag & drop your LTO OR/CR photo/PDF here'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Accepts .jpg, .png, .pdf up to 25MB</p>
                
                <label className="mt-4 inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-emerald-600/20">
                  <span>Browse Document File</span>
                  <input 
                    type="file" 
                    accept=".jpg,.jpeg,.png,.pdf" 
                    className="hidden" 
                    onChange={(e) => handleFileUpload(e, 'orcr')} 
                  />
                </label>
              </div>

              {detectedDocType && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">Detected Document:</span>
                    <span className="px-2 py-0.5 rounded-md font-bold bg-emerald-600 text-white text-[10px]">
                      {confidence}% Confidence
                    </span>
                  </div>
                  <p className="text-emerald-700 dark:text-emerald-400 font-medium">{detectedDocType}</p>
                </div>
              )}
            </div>

            {/* Extracted Review Card */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                    <Sparkles size={16} className="text-emerald-600" />
                    <span>Auto-Extracted Vehicle Information</span>
                  </h3>
                  <p className="text-xs text-slate-400">Review and verify extracted vehicle registration fields</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all"
                >
                  {isEditing ? 'Save Changes' : 'Edit Fields'}
                </button>
              </div>

              {isExtracting && extractTarget === 'orcr' ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-emerald-600">Extracting vehicle registration and engine numbers...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="sm:col-span-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Registered Operator / Owner</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={transportData.operatorName} 
                        onChange={(e) => setTransportData({...transportData, operatorName: e.target.value})}
                        className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border rounded-lg"
                      />
                    ) : (
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{transportData.operatorName}</p>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Plate Number</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={transportData.plateNumber} 
                        onChange={(e) => setTransportData({...transportData, plateNumber: e.target.value})}
                        className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border rounded-lg font-mono"
                      />
                    ) : (
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 text-base font-mono">{transportData.plateNumber}</p>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Vehicle Classification</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={transportData.vehicleCategory} 
                        onChange={(e) => setTransportData({...transportData, vehicleCategory: e.target.value})}
                        className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border rounded-lg"
                      />
                    ) : (
                      <p className="font-bold text-slate-800 dark:text-slate-200">{transportData.vehicleCategory}</p>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Engine / Motor No.</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 font-mono">{transportData.engineNumber}</p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Chassis / Frame No.</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 font-mono">{transportData.chassisNumber}</p>
                  </div>

                  <div className="sm:col-span-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Make, Model & Year</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{transportData.makeModel} ({transportData.yearModel}) • {transportData.fuelType}</p>
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
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-emerald-600/30"
            >
              <span>Next: TODA & Route Endorsement</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: TODA & ROUTE ENDORSEMENT UPLOAD */}
      {wizardStep === 2 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                  <FileCheck size={16} className="text-emerald-600" />
                  <span>Upload TODA / Route Clearance</span>
                </h3>
                <span className="text-[11px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-full">Required</span>
              </div>

              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-800/30">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3">
                  <Bus size={22} />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {todaFile ? todaFile : 'Upload TODA Certificate or Route Terminal Endorsement'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Accepts PDF, JPG, PNG</p>
                <label className="mt-4 inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all">
                  <span>Browse File</span>
                  <input 
                    type="file" 
                    accept=".jpg,.jpeg,.png,.pdf" 
                    className="hidden" 
                    onChange={(e) => handleFileUpload(e, 'toda')} 
                  />
                </label>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <p className="font-bold text-slate-900 dark:text-white">Validation Standards:</p>
                <ul className="text-slate-500 space-y-1 list-disc pl-4 text-[11px]">
                  <li>Current Year TODA Association Seal & President Signature</li>
                  <li>Barangay Council Transport Committee Resolution</li>
                  <li>Assigned Terminal Bay & Line Route Designation</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                <Sparkles size={16} className="text-emerald-600" />
                <span>Extracted Route & TODA Details</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Transport Federation / TODA</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{transportData.todaAssociation}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Body Number</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">{transportData.todaBodyNumber}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Operating Status</span>
                    <p className="font-bold text-emerald-600 flex items-center space-x-1">
                      <CheckCircle2 size={13} />
                      <span>Certified Active Member</span>
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Official Route Corridor</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{transportData.routeDesignation}</p>
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
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-emerald-600/30"
            >
              <span>Next: Operator ID & Cross-Match</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: OPERATOR ID & IDENTITY CROSS-MATCH */}
      {wizardStep === 3 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                  <User size={16} className="text-emerald-600" />
                  <span>Upload Operator ID / License</span>
                </h3>
                <span className="text-[11px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-full">Required</span>
              </div>

              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-800/30">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3">
                  <User size={22} />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {operatorIdFile ? operatorIdFile : 'Upload Driver’s License, PhilSys ID, or Passport'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Accepts JPG, PNG, PDF</p>
                <label className="mt-4 inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all">
                  <span>Browse ID</span>
                  <input 
                    type="file" 
                    accept=".jpg,.jpeg,.png,.pdf" 
                    className="hidden" 
                    onChange={(e) => handleFileUpload(e, 'operatorId')} 
                  />
                </label>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Identity Cross-Match Score</p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">Owner Name matches LTO OR/CR</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-emerald-600">{idData.matchScore}%</span>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">Verified</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                <Sparkles size={16} className="text-emerald-600" />
                <span>Extracted License & Identity Data</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Full Legal Name</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{idData.fullName}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">ID / License Type</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{idData.idType}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">License / ID Number</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{idData.idNumber}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Date of Birth</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{idData.dateOfBirth}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">License Expiry</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{transportData.driverLicenseExpiry}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Verified Residential Address</span>
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
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-emerald-600/30"
            >
              <span>Next: Fee Assessment</span>
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
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                <DollarSign size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Regulatory Fee Schedule (Itemized Computation)
                </h3>
                <p className="text-xs text-slate-500">Municipal Ordinance No. SP-2980 • Transport Regulatory Division</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">MTOP Franchise Filing & Legal Research Fee</p>
                  <p className="text-[11px] text-slate-400">Board docketing & regulatory verification</p>
                </div>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₱ 500.00</span>
              </div>

              <div className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Roadworthiness & Emission Testing Fee</p>
                  <p className="text-[11px] text-slate-400">Municipal Motor Vehicle Inspection System (MVIS)</p>
                </div>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₱ 350.00</span>
              </div>

              <div className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">TODA Terminal Supervision & Zone Route Fee</p>
                  <p className="text-[11px] text-slate-400">Barangay corridor access & traffic management</p>
                </div>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₱ 250.00</span>
              </div>

              <div className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Tamper-Proof QR Plate Sticker & RFID Tag</p>
                  <p className="text-[11px] text-slate-400">Official Municipal Tricycle/PUV Security Decal</p>
                </div>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₱ 150.00</span>
              </div>

              <div className="py-4 flex justify-between items-center bg-emerald-50/50 dark:bg-emerald-950/20 px-4 rounded-2xl">
                <div>
                  <p className="text-sm font-black text-emerald-900 dark:text-emerald-200 uppercase">Total Regulatory Assessment</p>
                  <p className="text-[11px] text-emerald-600">Payable online via GCash, Maya, or City Treasury Cashier</p>
                </div>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  ₱ 1,250.00
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
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-emerald-600/30"
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
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                <FileCheck size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Application Summary & Operator Sworn Declaration
                </h3>
                <p className="text-xs text-slate-500">Confirm all extracted records before official docketing</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Operator Profile</span>
                <p className="font-black text-slate-900 dark:text-white text-sm">{transportData.operatorName}</p>
                <p className="text-slate-600 dark:text-slate-400">{transportData.operatorAddress}</p>
                <p className="text-slate-600 dark:text-slate-400 font-mono">{transportData.operatorContact}</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Vehicle & Franchise Info</span>
                <p className="font-black text-emerald-600 text-sm font-mono">{transportData.plateNumber} • {transportData.todaBodyNumber}</p>
                <p className="text-slate-600 dark:text-slate-400">{transportData.makeModel}</p>
                <p className="text-slate-600 dark:text-slate-400">{transportData.routeDesignation}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={swornAgreed} 
                  onChange={(e) => setSwornAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4" 
                />
                <span className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  I hereby solemnly swear under penalty of perjury that the attached LTO OR/CR and TODA documents are genuine and that the registered vehicle complies with safety, emission, and municipal franchise standards under the Local Government Code of 1991.
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
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
            >
              <CheckCircle2 size={16} />
              <span>Confirm & Submit Application</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: DIGITAL PERMIT TRACKING */}
      {wizardStep === 6 && (
        <div className="space-y-6 animate-in zoom-in-95">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto rounded-full flex items-center justify-center">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                APPLICATION OFFICIALLY DOCKETED
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Franchise Application Submitted!
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your transport franchise application is now in the pipeline for physical roadworthiness check and Board confirmation.
              </p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-md mx-auto space-y-4">
              <div className="w-32 h-32 bg-white p-2 rounded-2xl mx-auto border border-slate-200 shadow-sm flex items-center justify-center">
                <QrCode size={110} className="text-slate-900" />
              </div>

              <div>
                <p className="text-[11px] text-slate-400 uppercase font-bold">Official Application Reference No.</p>
                <p className="text-xl font-black text-emerald-600 font-mono tracking-wider">{generatedRef}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-semibold">{transportData.operatorName} • {transportData.plateNumber}</p>
              </div>
            </div>

            {/* 4 Milestones */}
            <div className="max-w-2xl mx-auto pt-2">
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center font-bold text-xs">1</div>
                  <p className="font-bold text-emerald-600 text-[11px]">Submitted</p>
                  <p className="text-[10px] text-slate-400">Docs Extracted</p>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mx-auto flex items-center justify-center font-bold text-xs">2</div>
                  <p className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">Route Audit</p>
                  <p className="text-[10px] text-slate-400">TODA Verification</p>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mx-auto flex items-center justify-center font-bold text-xs">3</div>
                  <p className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">MVIS Inspection</p>
                  <p className="text-[10px] text-slate-400">Roadworthiness</p>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mx-auto flex items-center justify-center font-bold text-xs">4</div>
                  <p className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">Franchise Issuance</p>
                  <p className="text-[10px] text-slate-400">Plate & Decal</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-center space-x-3">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
              >
                Return to Hub
              </button>
              {onNavigateToDashboard && (
                <button
                  type="button"
                  onClick={onNavigateToDashboard}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
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
