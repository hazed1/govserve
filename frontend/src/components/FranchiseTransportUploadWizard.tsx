import React, { useState } from 'react';
import { 
  Bus,
  Upload, 
  Camera,
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  FileCheck, 
  User, 
  Car, 
  FileText,
  X,
  Eye
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
  const [orcrFile, setOrcrFile] = useState<string | null>(null);
  const [orcrFileUrl, setOrcrFileUrl] = useState<string | null>(null);
  const [orcrFileSize, setOrcrFileSize] = useState<string | null>(null);
  const [todaFile, setTodaFile] = useState<string | null>(null);
  const [todaFileUrl, setTodaFileUrl] = useState<string | null>(null);
  const [todaFileSize, setTodaFileSize] = useState<string | null>(null);
  const [operatorIdFile, setOperatorIdFile] = useState<string | null>(null);
  const [operatorIdFileUrl, setOperatorIdFileUrl] = useState<string | null>(null);
  const [operatorIdFileSize, setOperatorIdFileSize] = useState<string | null>(null);
  const [previewModalUrl, setPreviewModalUrl] = useState<{ url: string; title: string } | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractTarget, setExtractTarget] = useState<string | null>(null);
  const [detectedDocType, setDetectedDocType] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(99.4);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Extracted Transport & Franchise Data
  const [transportData, setTransportData] = useState({
    operatorName: '',
    operatorContact: '',
    operatorAddress: '',
    vehicleCategory: '',
    plateNumber: '',
    engineNumber: '',
    chassisNumber: '',
    makeModel: '',
    yearModel: '',
    fuelType: '',
    todaAssociation: '',
    todaBodyNumber: '',
    routeDesignation: '',
    driverLicenseNo: '',
    driverLicenseExpiry: ''
  });

  const [idData, setIdData] = useState({
    fullName: '',
    idType: '',
    idNumber: '',
    dateOfBirth: '',
    address: '',
    matchScore: 100
  });

  const [swornAgreed, setSwornAgreed] = useState<boolean>(true);
  const [submittedApp, setSubmittedApp] = useState<{
    applicationNo: string;
    franchiseNo: string;
    dateSubmitted: string;
    status: string;
  } | null>(null);

  // Sample Presets
  const applyPreset = (type: 'tricycle' | 'jeepney' | 'uv') => {
    setIsExtracting(true);
    setTimeout(() => {
      if (type === 'tricycle') {
        setOrcrFile('Screenshot (242).png');
        setOrcrFileUrl('/New Application.jpg');
        setOrcrFileSize('405.5 KB');
        setTodaFile('TODA_Barangay_Endorsement_FRV042.png');
        setTodaFileUrl('/New Application.jpg');
        setTodaFileSize('380.2 KB');
        setOperatorIdFile('LTO_Professional_License_RamonDelaCruz.png');
        setOperatorIdFileUrl('/New Application.jpg');
        setOperatorIdFileSize('412.0 KB');
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
        setOrcrFile('LTO_ORCR_Modern_PUJ_NBE8821.png');
        setOrcrFileUrl('/New Application.jpg');
        setOrcrFileSize('512.4 KB');
        setTodaFile('LTFRB_Route_CPC_Endorsement.png');
        setTodaFileUrl('/New Application.jpg');
        setTodaFileSize('430.8 KB');
        setOperatorIdFile('Operator_License_MateoReyes.png');
        setOperatorIdFileUrl('/New Application.jpg');
        setOperatorIdFileSize('395.0 KB');
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
        setOrcrFile('LTO_ORCR_UVExpress_NBP5510.png');
        setOrcrFileUrl('/New Application.jpg');
        setOrcrFileSize('480.0 KB');
        setTodaFile('LTFRB_UV_Route_Certificate.png');
        setTodaFileUrl('/New Application.jpg');
        setTodaFileSize('365.1 KB');
        setOperatorIdFile('Drivers_License_DaniloBautista.png');
        setOperatorIdFileUrl('/New Application.jpg');
        setOperatorIdFileSize('410.5 KB');
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
    const url = URL.createObjectURL(file);
    const sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
    setIsExtracting(true);
    setExtractTarget(target);
    setTimeout(() => {
      if (target === 'orcr') {
        setOrcrFile(file.name);
        setOrcrFileUrl(url);
        setOrcrFileSize(sizeStr);
        setDetectedDocType('LTO Official Receipt / Certificate of Registration (OR/CR)');
        setConfidence(99.4);
      } else if (target === 'toda') {
        setTodaFile(file.name);
        setTodaFileUrl(url);
        setTodaFileSize(sizeStr);
      } else if (target === 'operatorId') {
        setOperatorIdFile(file.name);
        setOperatorIdFileUrl(url);
        setOperatorIdFileSize(sizeStr);
      }
      setIsExtracting(false);
      setExtractTarget(null);
    }, 600);
  };

  const handleSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const appNo = `AR-2025-${randomSuffix}`;
    const franchiseNo = 'MTOP-2025-0412';

    setSubmittedApp({
      applicationNo: appNo,
      franchiseNo: franchiseNo,
      dateSubmitted: today,
      status: 'Pending Review'
    });

    if (onAddNewApplication) {
      onAddNewApplication(transportData.operatorName || 'New Applicant', 'Franchise & Transport Permit');
    }

    setWizardStep(5);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in pb-12">
      {/* Top Back Navigation (Text-link with arrow, no button frame) */}
      {wizardStep < 5 && (
        <div className="flex items-center justify-start -mb-2">
          <button
            type="button"
            onClick={wizardStep === 1 ? onBack : () => setWizardStep(wizardStep - 1)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors group cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="group-hover:underline">
              {wizardStep === 1 ? 'Back to Portal' : 'Back to Previous Step'}
            </span>
          </button>
        </div>
      )}

      {/* Wizard Step Indicator Bar */}
      {wizardStep < 5 && (
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center">
        <div className="flex items-center justify-center space-x-1.5 sm:space-x-3 flex-wrap gap-y-2">
          {[
            { step: 1, label: 'LTO OR/CR' },
            { step: 2, label: 'Route & Fleet' },
            { step: 3, label: 'Operator ID' },
            { step: 4, label: 'Review' }
          ].map((s) => (
            <div 
              key={s.step} 
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                wizardStep === s.step 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : wizardStep > s.step 
                    ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              <span className="text-[11px] font-black">{s.step}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* STEP 1: LTO OR/CR UPLOAD & AUTO-EXTRACTION */}
      {wizardStep === 1 && (
        <div className="space-y-6 animate-in fade-in">
          {/* Unified Single Card Container */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Column: Upload Section (Pic 1 Style) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-400 font-bold text-sm">1.</span>
                    <span className="bg-blue-600 text-white font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                      REQUIRED
                    </span>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-1.5">
                      <span>VALID LTO OR / CR</span>
                      <span className="text-rose-500 font-bold">*</span>
                      {orcrFile && (
                        <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-500/20 shrink-0" />
                      )}
                    </h3>
                  </div>

                  {/* Status Pill Badge */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start sm:self-auto border transition-colors ${
                    orcrFile
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800/80 dark:text-slate-400 dark:border-slate-700'
                  }`}>
                    Status: {orcrFile ? 'Uploaded' : 'Pending'}
                  </span>
                </div>

                {/* Description & Allowed File Types */}
                <div className="space-y-1">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Official Receipt (OR) and Certificate of Registration (CR) from the Land Transportation Office
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    Allowed file types: JPG, JPEG, PNG, WEBP
                  </p>
                </div>

                {/* Action Row: UPLOAD PHOTO button (when empty) OR Centered Enlarged Thumbnail Preview (when uploaded) */}
                <div className="pt-2 flex flex-col items-center justify-center gap-3 w-full">
                  {!orcrFile ? (
                    <div className="flex justify-center w-full py-4">
                      <label
                        htmlFor="doc-upload-orcr"
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide rounded-xl shadow-md shadow-blue-600/25 transition-all cursor-pointer group shrink-0"
                      >
                        <Upload size={15} className="group-hover:-translate-y-0.5 transition-transform" />
                        <span>UPLOAD PHOTO</span>
                        <input
                          id="doc-upload-orcr"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                          onChange={(e) => handleFileUpload(e, 'orcr')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="pt-2 w-full flex justify-center">
                      <div className="relative group/thumb p-3 rounded-2xl bg-[#091524] border border-slate-700/80 shadow-lg w-full max-w-[320px] sm:max-w-[340px] flex flex-col items-center animate-in fade-in zoom-in-95 mx-auto">
                        {/* Circular (X) remove button at top-right */}
                        <button
                          type="button"
                          onClick={() => {
                            setOrcrFile(null);
                            setOrcrFileUrl(null);
                            setOrcrFileSize(null);
                          }}
                          title="Remove Photo"
                          className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-slate-700 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition-colors cursor-pointer z-10"
                        >
                          <X size={15} />
                        </button>

                        {/* Photo Thumbnail */}
                        <div 
                          onClick={() => setPreviewModalUrl({ url: orcrFileUrl || '/New Application.jpg', title: 'LTO OR / CR' })}
                          className="w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 cursor-pointer relative group-hover/thumb:border-blue-500 transition-colors flex items-center justify-center p-1"
                          title="Click to view full photo"
                        >
                          <img
                            src={orcrFileUrl || '/New Application.jpg'}
                            alt="LTO OR/CR Preview"
                            className="w-full h-full object-contain rounded-lg group-hover/thumb:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                            <Eye size={20} className="text-white drop-shadow" />
                          </div>
                        </div>

                        {/* File Info */}
                        <div className="w-full text-center mt-2.5 px-2">
                          <span className="font-mono text-xs font-semibold text-slate-200 block truncate" title={orcrFile}>
                            {orcrFile}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                            {orcrFileSize || '405.5 KB'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Vehicle Information Review */}
              <div className="lg:col-span-7 space-y-4 lg:border-l lg:border-slate-200 dark:lg:border-slate-800 lg:pl-8">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Vehicle Information
                  </h3>
                </div>

                {isExtracting && extractTarget === 'orcr' ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-bold text-blue-600">Extracting vehicle registration and engine numbers...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="sm:col-span-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <label className="text-[11px] font-bold text-slate-400 uppercase block">Registered Operator / Owner</label>
                      <input 
                        type="text" 
                        value={transportData.operatorName} 
                        onChange={(e) => setTransportData({...transportData, operatorName: e.target.value})}
                        placeholder="Enter full name of registered operator / owner"
                        className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <label className="text-[11px] font-bold text-slate-400 uppercase block">Plate Number</label>
                      <input 
                        type="text" 
                        value={transportData.plateNumber} 
                        onChange={(e) => setTransportData({...transportData, plateNumber: e.target.value})}
                        placeholder="e.g. 4829-QC or NBE-8821"
                        className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-blue-600 dark:text-blue-400 font-mono font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <label className="text-[11px] font-bold text-slate-400 uppercase block">Vehicle Classification</label>
                      <select 
                        value={transportData.vehicleCategory} 
                        onChange={(e) => setTransportData({...transportData, vehicleCategory: e.target.value})}
                        className={`w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs cursor-pointer ${
                          !transportData.vehicleCategory 
                            ? 'text-slate-400 dark:text-slate-500 font-normal' 
                            : 'text-slate-800 dark:text-slate-200 font-bold'
                        }`}
                      >
                        <option value="" disabled>-- Select Vehicle Classification --</option>
                        <optgroup label="Tricycles & Light Vehicles">
                          <option value="Motorized Tricycle-for-Hire (MTOP)">🛺 Motorized Tricycle-for-Hire (MTOP)</option>
                          <option value="Electric Tricycle (E-Trike / Modern MTOP)">⚡ Electric Tricycle (E-Trike / Modern MTOP)</option>
                          <option value="Filcab / Multicab-for-Hire">🛺 Filcab / Multicab-for-Hire</option>
                        </optgroup>
                        <optgroup label="Public Utility Vehicles (PUV / Jeepney / Bus / UV)">
                          <option value="Public Utility Jeepney (Traditional PUJ)">🚌 Traditional Public Utility Jeepney (PUJ)</option>
                          <option value="Modern PUV / Minibus (Class 1 / Class 2 / Class 3)">🚐 Modern PUV / Minibus (Class 1 / 2 / 3)</option>
                          <option value="UV Express / Shuttle Van Service">🚐 UV Express / Shuttle Van Service</option>
                          <option value="Public Utility Bus (City / Provincial PUB)">🚍 Public Utility Bus (PUB / City / Provincial)</option>
                        </optgroup>
                        <optgroup label="Taxi, Car & Passenger Services">
                          <option value="Taxi / TNVS (Sedan / MPV / Hatchback)">🚕 Taxi / TNVS (Grab / Transport Network Vehicle)</option>
                          <option value="School Transport Service (Van / Coaster / Bus)">🚌 School Transport Service</option>
                          <option value="Tourist Transport Service / Rent-a-Car">🚘 Tourist Transport / Rent-a-Car</option>
                        </optgroup>
                        <optgroup label="Trucks, Freight & Delivery Services">
                          <option value="Cargo Truck / Logistics / Hauler (TH Freight)">🚚 Cargo Truck / Logistics / Hauler (TH Freight)</option>
                          <option value="Delivery Van / Closed Van / Pick-up (Commercial)">🚐 Delivery Van / Closed Van (Commercial)</option>
                          <option value="Motorcycle Taxi / Delivery Service (MC Taxi)">🛵 Motorcycle Taxi / Courier Delivery</option>
                          <option value="Specialized Commercial / Heavy Vehicle">🚜 Specialized Commercial / Heavy Vehicle</option>
                        </optgroup>
                      </select>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <label className="text-[11px] font-bold text-slate-400 uppercase block">Engine / Motor No.</label>
                      <input 
                        type="text" 
                        value={transportData.engineNumber} 
                        onChange={(e) => setTransportData({...transportData, engineNumber: e.target.value})}
                        placeholder="e.g. KB4-992140 or 4JB1-884920"
                        className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-mono font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <label className="text-[11px] font-bold text-slate-400 uppercase block">Chassis / Frame No.</label>
                      <input 
                        type="text" 
                        value={transportData.chassisNumber} 
                        onChange={(e) => setTransportData({...transportData, chassisNumber: e.target.value})}
                        placeholder="e.g. CH-2023-QC-88192"
                        className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-mono font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
                      />
                    </div>

                    <div className="sm:col-span-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <label className="text-[11px] font-bold text-slate-400 uppercase block">Make, Model &amp; Year</label>
                      <input 
                        type="text" 
                        value={transportData.makeModel} 
                        onChange={(e) => setTransportData({...transportData, makeModel: e.target.value})}
                        placeholder="e.g. Kawasaki Barako II 175cc with Sidecar (2023)"
                        className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center pt-2">
            <button
              type="button"
              disabled={!orcrFile}
              onClick={() => {
                if (orcrFile) setWizardStep(2);
              }}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                orcrFile
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              <span>Next: Route &amp; Fleet Endorsement</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: TODA & ROUTE ENDORSEMENT UPLOAD */}
      {wizardStep === 2 && (
        <div className="space-y-6 animate-in fade-in">
          {/* Unified Single Card Container */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Column: Upload Section (Pic 1 Style) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-400 font-bold text-sm">2.</span>
                    <span className="bg-blue-600 text-white font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                      REQUIRED
                    </span>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-1.5">
                      <span>ROUTE / TRANSPORT ENDORSEMENT</span>
                      <span className="text-rose-500 font-bold">*</span>
                      {todaFile && (
                        <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-500/20 shrink-0" />
                      )}
                    </h3>
                  </div>

                  {/* Status Pill Badge */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start sm:self-auto border transition-colors ${
                    todaFile
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800/80 dark:text-slate-400 dark:border-slate-700'
                  }`}>
                    Status: {todaFile ? 'Uploaded' : 'Pending'}
                  </span>
                </div>

                {/* Description & Allowed File Types */}
                <div className="space-y-1">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Valid Transport Cooperative, TODA, or Fleet Route Endorsement Certificate
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    Allowed file types: JPG, JPEG, PNG, WEBP
                  </p>
                </div>

                {/* Action Row: UPLOAD PHOTO button (when empty) OR Centered Enlarged Thumbnail Preview (when uploaded) */}
                <div className="pt-2 flex flex-col items-center justify-center gap-3 w-full">
                  {!todaFile ? (
                    <div className="flex justify-center w-full py-4">
                      <label
                        htmlFor="doc-upload-toda"
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide rounded-xl shadow-md shadow-blue-600/25 transition-all cursor-pointer group shrink-0"
                      >
                        <Upload size={15} className="group-hover:-translate-y-0.5 transition-transform" />
                        <span>UPLOAD PHOTO</span>
                        <input
                          id="doc-upload-toda"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                          onChange={(e) => handleFileUpload(e, 'toda')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="pt-2 w-full flex justify-center">
                      <div className="relative group/thumb p-3 rounded-2xl bg-[#091524] border border-slate-700/80 shadow-lg w-full max-w-[320px] sm:max-w-[340px] flex flex-col items-center animate-in fade-in zoom-in-95 mx-auto">
                        {/* Circular (X) remove button at top-right */}
                        <button
                          type="button"
                          onClick={() => {
                            setTodaFile(null);
                            setTodaFileUrl(null);
                            setTodaFileSize(null);
                          }}
                          title="Remove Photo"
                          className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-slate-700 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition-colors cursor-pointer z-10"
                        >
                          <X size={15} />
                        </button>

                        {/* Photo Thumbnail */}
                        <div 
                          onClick={() => setPreviewModalUrl({ url: todaFileUrl || '/New Application.jpg', title: 'Route / Transport Endorsement' })}
                          className="w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 cursor-pointer relative group-hover/thumb:border-blue-500 transition-colors flex items-center justify-center p-1"
                          title="Click to view full photo"
                        >
                          <img
                            src={todaFileUrl || '/New Application.jpg'}
                            alt="Route Endorsement Preview"
                            className="w-full h-full object-contain rounded-lg group-hover/thumb:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                            <Eye size={20} className="text-white drop-shadow" />
                          </div>
                        </div>

                        {/* File Info */}
                        <div className="w-full text-center mt-2.5 px-2">
                          <span className="font-mono text-xs font-semibold text-slate-200 block truncate" title={todaFile}>
                            {todaFile}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                            {todaFileSize || '380.2 KB'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Route, Fleet & Terminal Details */}
              <div className="lg:col-span-7 space-y-4 lg:border-l lg:border-slate-200 dark:lg:border-slate-800 lg:pl-8">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Route, Fleet &amp; Terminal Details
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <label className="text-[11px] font-bold text-slate-400 uppercase block">Transport Cooperative / Federation / Association / Operator</label>
                    <input
                      type="text"
                      value={transportData.todaAssociation}
                      onChange={(e) => setTransportData({...transportData, todaAssociation: e.target.value})}
                      placeholder="Enter Transport Cooperative, TODA, or Fleet Operator name"
                      className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <label className="text-[11px] font-bold text-slate-400 uppercase block">Body / Unit / Fleet Number</label>
                      <input
                        type="text"
                        value={transportData.todaBodyNumber}
                        onChange={(e) => setTransportData({...transportData, todaBodyNumber: e.target.value})}
                        placeholder="e.g. BODY-FRV-042 or FLEET-088"
                        className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-blue-600 dark:text-blue-400 font-mono font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] font-bold text-slate-400 uppercase block">Operating Status</span>
                      <div className="mt-2.5 font-bold text-blue-600 flex items-center space-x-1">
                        <CheckCircle2 size={13} />
                        <span>Certified Active Unit</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <label className="text-[11px] font-bold text-slate-400 uppercase block">Official Route Corridor / Area of Operation</label>
                    <input
                      type="text"
                      value={transportData.routeDesignation}
                      onChange={(e) => setTransportData({...transportData, routeDesignation: e.target.value})}
                      placeholder="Enter designated route corridor, terminal line, or area of operation"
                      className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setWizardStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors group cursor-pointer"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span className="group-hover:underline">Back</span>
            </button>
            <button
              type="button"
              disabled={!todaFile}
              onClick={() => {
                if (todaFile) setWizardStep(3);
              }}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                todaFile
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
              }`}
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
          {/* Unified Single Card Container */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Column: Upload Section (Pic 1 Style) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-400 font-bold text-sm">3.</span>
                    <span className="bg-blue-600 text-white font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                      REQUIRED
                    </span>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-1.5">
                      <span>VALID GOVERNMENT ID *</span>
                      {operatorIdFile && (
                        <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-500/20 shrink-0" />
                      )}
                    </h3>
                  </div>

                  {/* Status Pill Badge */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start sm:self-auto border transition-colors ${
                    operatorIdFile
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800/80 dark:text-slate-400 dark:border-slate-700'
                  }`}>
                    Status: {operatorIdFile ? 'Uploaded' : 'Pending'}
                  </span>
                </div>

                {/* Description & Allowed File Types */}
                <div className="space-y-1">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Philippine National ID (PhilID), Passport, Driver’s License, or UMID of Registered Proprietor
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    Allowed file types: JPG, JPEG, PNG, WEBP
                  </p>
                </div>

                {/* Action Row: UPLOAD PHOTO button (when empty) OR Centered Enlarged Thumbnail Preview (when uploaded) */}
                <div className="pt-2 flex flex-col items-center justify-center gap-3 w-full">
                  {!operatorIdFile ? (
                    <div className="flex justify-center w-full py-4">
                      <label
                        htmlFor="doc-upload-operatorId"
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide rounded-xl shadow-md shadow-blue-600/25 transition-all cursor-pointer group shrink-0"
                      >
                        <Upload size={15} className="group-hover:-translate-y-0.5 transition-transform" />
                        <span>UPLOAD PHOTO</span>
                        <input
                          id="doc-upload-operatorId"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                          onChange={(e) => handleFileUpload(e, 'operatorId')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="pt-2 w-full flex justify-center">
                      <div className="relative group/thumb p-3 rounded-2xl bg-[#091524] border border-slate-700/80 shadow-lg w-full max-w-[320px] sm:max-w-[340px] flex flex-col items-center animate-in fade-in zoom-in-95 mx-auto">
                        {/* Circular (X) remove button at top-right */}
                        <button
                          type="button"
                          onClick={() => {
                            setOperatorIdFile(null);
                            setOperatorIdFileUrl(null);
                            setOperatorIdFileSize(null);
                          }}
                          title="Remove Photo"
                          className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-slate-700 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition-colors cursor-pointer z-10"
                        >
                          <X size={15} />
                        </button>

                        {/* Photo Thumbnail */}
                        <div 
                          onClick={() => setPreviewModalUrl({ url: operatorIdFileUrl || '/New Application.jpg', title: 'Valid Government ID' })}
                          className="w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 cursor-pointer relative group-hover/thumb:border-blue-500 transition-colors flex items-center justify-center p-1"
                          title="Click to view full photo"
                        >
                          <img
                            src={operatorIdFileUrl || '/New Application.jpg'}
                            alt="Government ID Preview"
                            className="w-full h-full object-contain rounded-lg group-hover/thumb:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                            <Eye size={20} className="text-white drop-shadow" />
                          </div>
                        </div>

                        {/* File Info */}
                        <div className="w-full text-center mt-2.5 px-2">
                          <span className="font-mono text-xs font-semibold text-slate-200 block truncate" title={operatorIdFile}>
                            {operatorIdFile}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                            {operatorIdFileSize || '405.5 KB'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: License & Identity Data */}
              <div className="lg:col-span-7 space-y-4 lg:border-l lg:border-slate-200 dark:lg:border-slate-800 lg:pl-8">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    License &amp; Identity Data
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <label className="text-[11px] font-bold text-slate-400 uppercase block">Full Legal Name</label>
                    <input
                      type="text"
                      value={idData.fullName}
                      onChange={(e) => setIdData({...idData, fullName: e.target.value})}
                      placeholder="Enter complete legal name (Last, First, Middle)"
                      className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <label className="text-[11px] font-bold text-slate-400 uppercase block">ID / License Type</label>
                      <input
                        type="text"
                        value={idData.idType}
                        onChange={(e) => setIdData({...idData, idType: e.target.value})}
                        placeholder="e.g. Professional Driver's License or PhilSys ID"
                        className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <label className="text-[11px] font-bold text-slate-400 uppercase block">License / ID Number</label>
                      <input
                        type="text"
                        value={idData.idNumber}
                        onChange={(e) => setIdData({...idData, idNumber: e.target.value})}
                        placeholder="e.g. N02-14-884920 or PhilSys ID No."
                        className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-blue-600 dark:text-blue-400 font-mono font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <label className="text-[11px] font-bold text-slate-400 uppercase block">Date of Birth</label>
                      <input
                        type="date"
                        value={idData.dateOfBirth}
                        onChange={(e) => setIdData({...idData, dateOfBirth: e.target.value})}
                        className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <label className="text-[11px] font-bold text-slate-400 uppercase block">License Expiry</label>
                      <input
                        type="date"
                        value={transportData.driverLicenseExpiry}
                        onChange={(e) => setTransportData({...transportData, driverLicenseExpiry: e.target.value})}
                        className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <label className="text-[11px] font-bold text-slate-400 uppercase block">Verified Residential Address</label>
                    <input
                      type="text"
                      value={idData.address}
                      onChange={(e) => setIdData({...idData, address: e.target.value})}
                      placeholder="Enter house no., street, barangay, city, and province"
                      className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setWizardStep(2)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors group cursor-pointer"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span className="group-hover:underline">Back</span>
            </button>
            <button
              type="button"
              disabled={!operatorIdFile}
              onClick={() => {
                if (operatorIdFile) setWizardStep(4);
              }}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                operatorIdFile
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              <span>Next: Final Review</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: FINAL REVIEW & DECLARATION */}
      {wizardStep === 4 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
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
                <p className="font-black text-slate-900 dark:text-white text-sm">{transportData.operatorName || '—'}</p>
                <p className="text-slate-600 dark:text-slate-400">{transportData.operatorAddress || 'No address provided'}</p>
                <p className="text-slate-600 dark:text-slate-400 font-mono">{transportData.operatorContact || 'No contact provided'}</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Vehicle & Franchise Info</span>
                <p className="font-black text-blue-600 text-sm font-mono">
                  {(transportData.plateNumber || 'No Plate') + ' • ' + (transportData.todaBodyNumber || 'No Body No.')}
                </p>
                <p className="text-slate-600 dark:text-slate-400">{transportData.makeModel || 'Vehicle details not specified'}</p>
                <p className="text-slate-600 dark:text-slate-400">{transportData.routeDesignation || 'Route not specified'}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={swornAgreed} 
                  onChange={(e) => setSwornAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4" 
                />
                <span className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  I hereby solemnly swear under penalty of perjury that the attached LTO OR/CR and transport cooperative/route endorsement documents are genuine and that the registered vehicle complies with safety, emission, and municipal franchise standards under the Local Government Code of 1991 and national transportation laws.
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setWizardStep(3)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors group cursor-pointer"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span className="group-hover:underline">Back</span>
            </button>
            <button
              type="button"
              disabled={!swornAgreed}
              onClick={handleSubmit}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              <CheckCircle2 size={16} />
              <span>Confirm & Submit Application</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SUBMISSION SUCCESS (Kagaya sa unang picture) */}
      {wizardStep === 5 && submittedApp && (
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto animate-in fade-in duration-200">
          <div className="space-y-8 max-w-xl mx-auto text-center py-4">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center shadow-xl shadow-blue-600/20">
              <CheckCircle2 size={44} className="stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white block">
                🎉 Application Submitted!
              </span>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                "Your Franchise application has been successfully submitted."
              </p>
            </div>

            {/* Receipt Details Card */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 text-left space-y-3.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Application Number</span>
                <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-sm">
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
                type="button"
                onClick={() => onBack()}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 hover:dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                BACK TO PORTAL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHOTO PREVIEW MODAL */}
      {previewModalUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-4 space-y-3 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white">{previewModalUrl.title}</h4>
              <button 
                onClick={() => setPreviewModalUrl(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto rounded-xl flex items-center justify-center bg-black/40 p-2">
              <img src={previewModalUrl.url} alt={previewModalUrl.title} className="max-w-full max-h-[65vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
