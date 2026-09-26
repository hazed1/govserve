import React, { useState } from 'react';
import { 
  Bus,
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  FileCheck, 
  User, 
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
    if (onAddNewApplication) {
      onAddNewApplication(transportData.operatorName, 'Franchise & Transport Permit');
    }
    if (onNavigateToDashboard) {
      onNavigateToDashboard();
    } else {
      onBack();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in pb-12">
      {/* Wizard Step Indicator Bar */}
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
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                  : wizardStep > s.step 
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              <span className="text-[11px] font-black">{s.step}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: LTO OR/CR UPLOAD & AUTO-EXTRACTION */}
      {wizardStep === 1 && (
        <div className="space-y-6 animate-in fade-in">
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
            </div>

            {/* Vehicle Information Review Card */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Vehicle Information
                </h3>
              </div>

              {isExtracting && extractTarget === 'orcr' ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-emerald-600">Extracting vehicle registration and engine numbers...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="sm:col-span-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <label className="text-[11px] font-bold text-slate-400 uppercase block">Registered Operator / Owner</label>
                    <input 
                      type="text" 
                      value={transportData.operatorName} 
                      onChange={(e) => setTransportData({...transportData, operatorName: e.target.value})}
                      placeholder="Enter registered operator/owner name"
                      className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-xs"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <label className="text-[11px] font-bold text-slate-400 uppercase block">Plate Number</label>
                    <input 
                      type="text" 
                      value={transportData.plateNumber} 
                      onChange={(e) => setTransportData({...transportData, plateNumber: e.target.value})}
                      placeholder="e.g. 4829-QC"
                      className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-xs"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <label className="text-[11px] font-bold text-slate-400 uppercase block">Vehicle Classification</label>
                    <select 
                      value={transportData.vehicleCategory} 
                      onChange={(e) => setTransportData({...transportData, vehicleCategory: e.target.value})}
                      className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-xs cursor-pointer"
                    >
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
                      className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-mono font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-xs"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <label className="text-[11px] font-bold text-slate-400 uppercase block">Chassis / Frame No.</label>
                    <input 
                      type="text" 
                      value={transportData.chassisNumber} 
                      onChange={(e) => setTransportData({...transportData, chassisNumber: e.target.value})}
                      placeholder="e.g. CH-2023-QC-88192"
                      className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-mono font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-xs"
                    />
                  </div>

                  <div className="sm:col-span-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <label className="text-[11px] font-bold text-slate-400 uppercase block">Make, Model &amp; Year</label>
                    <input 
                      type="text" 
                      list="vehicle-models-list"
                      value={transportData.makeModel} 
                      onChange={(e) => setTransportData({...transportData, makeModel: e.target.value})}
                      placeholder="e.g. Toyota Vios, Isuzu Modern PUJ, or Kawasaki Barako II"
                      className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-xs"
                    />
                    <datalist id="vehicle-models-list">
                      <option value="Toyota Vios 1.3 XLE (Taxi / TNVS)" />
                      <option value="Toyota Innova 2.8E Diesel (Taxi / TNVS / Tourist)" />
                      <option value="Toyota HiAce Commuter Van 2.8L (UV Express / Shuttle)" />
                      <option value="Nissan NV350 Urvan Shuttle (UV Express / Shuttle)" />
                      <option value="Isuzu QKR Modern PUJ Class 2 (Modern PUV)" />
                      <option value="Hino Poncho Modern PUV Class 3 (Modern PUV)" />
                      <option value="Sarao Traditional PUJ Isuzu 4JB1 (Jeepney)" />
                      <option value="Isuzu Elf Closed Van / Aluminum Box (Delivery / Commercial)" />
                      <option value="Isuzu Giga 10-Wheeler Wing Van (Cargo Truck / Logistics)" />
                      <option value="Mitsubishi Fuso Canter 4-Wheeler Drop-side (Logistics)" />
                      <option value="Yutong 45-Seater Aircon City Bus (PUB)" />
                      <option value="Hino RK8J 60-Seater Commuter Bus (PUB)" />
                      <option value="Kawasaki Barako II 175cc with Sidecar (2023)" />
                      <option value="Honda TMX 125 Alpha with Sidecar (2024)" />
                      <option value="Bajaj RE 4S 198cc Compact Trike (2023)" />
                      <option value="TailG Commercial E-Trike 1500W (2024)" />
                      <option value="Yamaha Sight 115 / Honda Beat (MC Delivery / Courier)" />
                      <option value="Suzuki Carry Multicab FB Body (2023)" />
                    </datalist>
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
              <span>Next: Route &amp; Fleet Endorsement</span>
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
                  <span>Route / Transport Endorsement</span>
                </h3>
                <span className="text-[11px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-full">Required</span>
              </div>

              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-800/30">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3">
                  <Bus size={22} />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {todaFile ? todaFile : 'Upload Transport Cooperative, TODA, or Fleet Route Endorsement'}
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
                  <li>Valid Transport Cooperative, Federation, or Association Seal &amp; Officer Signature</li>
                  <li>Terminal Concurrence, LTFRB CPC, or LGU Route Regulatory Resolution</li>
                  <li>Assigned Terminal Bay / Authorized Route Line Designation</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
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
                    className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-xs"
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
                      className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-xs"
                    />
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Operating Status</span>
                    <div className="mt-2.5 font-bold text-emerald-600 flex items-center space-x-1">
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
                    className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-xs"
                  />
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
                    placeholder="Enter full legal name"
                    className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <label className="text-[11px] font-bold text-slate-400 uppercase block">ID / License Type</label>
                    <input
                      type="text"
                      value={idData.idType}
                      onChange={(e) => setIdData({...idData, idType: e.target.value})}
                      placeholder="e.g. Professional Driver's License"
                      className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-xs"
                    />
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <label className="text-[11px] font-bold text-slate-400 uppercase block">License / ID Number</label>
                    <input
                      type="text"
                      value={idData.idNumber}
                      onChange={(e) => setIdData({...idData, idNumber: e.target.value})}
                      placeholder="e.g. N02-14-884920"
                      className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-xs"
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
                      className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-xs"
                    />
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <label className="text-[11px] font-bold text-slate-400 uppercase block">License Expiry</label>
                    <input
                      type="date"
                      value={transportData.driverLicenseExpiry}
                      onChange={(e) => setTransportData({...transportData, driverLicenseExpiry: e.target.value})}
                      className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <label className="text-[11px] font-bold text-slate-400 uppercase block">Verified Residential Address</label>
                  <input
                    type="text"
                    value={idData.address}
                    onChange={(e) => setIdData({...idData, address: e.target.value})}
                    placeholder="Enter complete residential address"
                    className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-xs"
                  />
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
                  I hereby solemnly swear under penalty of perjury that the attached LTO OR/CR and transport cooperative/route endorsement documents are genuine and that the registered vehicle complies with safety, emission, and municipal franchise standards under the Local Government Code of 1991 and national transportation laws.
                </span>
              </label>
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
    </div>
  );
};
