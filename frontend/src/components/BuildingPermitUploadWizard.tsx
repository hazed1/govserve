import React, { useState } from 'react';
import { 
  Building, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  QrCode, 
  FileCheck, 
  User, 
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface BuildingPermitUploadWizardProps {
  onBack: () => void;
  onAddNewApplication?: (applicantName: string, permitType: string) => void;
  onNavigateToDashboard?: () => void;
}

export const BuildingPermitUploadWizard: React.FC<BuildingPermitUploadWizardProps> = ({
  onBack,
  onAddNewApplication,
  onNavigateToDashboard
}) => {
  const { user } = useAuth();

  const [wizardStep, setWizardStep] = useState<number>(1);
  const [bldFile, setBldFile] = useState<string | null>('Commercial_Tower_Architectural_Blueprint_Signed.pdf');
  const [engrFile, setEngrFile] = useState<string | null>(null);
  const [ownerIdFile, setOwnerIdFile] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractTarget, setExtractTarget] = useState<string | null>(null);
  const [detectedDocType, setDetectedDocType] = useState<string | null>('Architectural Blueprint Plan (P.D. 1096 Group E)');
  const [confidence, setConfidence] = useState<number>(99.2);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Extracted Building & Project Data
  const [bldData, setBldData] = useState({
    projectTitle: 'Vertex Prime High-Density Commercial Tower',
    ownerApplicant: user?.name || 'Vertex Prime Real Estate Corp.',
    locationAddress: 'Lot 4-B, Block 12, Commonwealth Ave., Brgy. Batasan, Quezon City',
    tctNo: 'TCT-QC-2022-88190',
    taxDecNo: 'TD-04-99120-02',
    buildingUse: 'Commercial Retail & High-Density BPO Offices (Group E)',
    totalFloorArea: '14,250.00 sqm',
    noOfStoreys: '18 Storeys + 2 Basements',
    estimatedCost: '₱ 285,000,000.00',
    contactNumber: '+63 917 888 1234',
    contactEmail: user?.email || 'vertex.prime@govserve.ph'
  });

  // Extracted Engineering & Clearances Data
  const [engrData, setEngrData] = useState({
    leadArchitect: 'Arch. Roberto S. Alcantara, UAP',
    architectPrc: 'PRC-ARCH-0044912 (Valid until 2028)',
    leadCivilEngineer: 'Engr. Danilo K. Villanueva, MSCE',
    civilEngineerPrc: 'PRC-CE-0033104 (Valid until 2027)',
    seismicStandard: 'NSCP 2015 7th Ed. Zone 4 Compliant (Ductile Shear Wall)',
    fsecNumber: 'FSEC-2026-BFP-0091',
    fsecStatus: 'BFP Station 4 Bureau Clearance Approved',
    confidence: 99.4
  });

  // Extracted Owner ID & Cross-Match Data
  const [ownerIdData, setOwnerIdData] = useState({
    idType: 'Philippine National ID (PhilID)',
    idNumber: '4819-2091-8841-2093',
    fullName: user?.name || 'Vertex Prime Real Estate Corp.',
    dob: '1980-08-14',
    matchScore: 100,
    matchVerified: true,
    confidence: 99.8
  });

  // Assessed Fees (Itemized National Building Code Tariff)
  const [fees] = useState({
    permitFee: 2450,
    structuralInspectionFee: 1200,
    ancillaryFee: 850,
    zoningFee: 350,
    total: 4850
  });

  const [submittedRefNo, setSubmittedRefNo] = useState<string>('BC-2026-891042');
  const [swornDeclared, setSwornDeclared] = useState<boolean>(false);

  // One-click Sample Triggers
  const handleSelectSampleBlueprint = (type: 'commercial' | 'residential' | 'tct') => {
    setIsExtracting(true);
    setExtractTarget('blueprint');
    setTimeout(() => {
      if (type === 'commercial') {
        setBldFile('Commercial_Tower_Architectural_Blueprint_Signed.pdf');
        setDetectedDocType('Signed & Sealed Architectural Blueprint (P.D. 1096 Group E)');
        setConfidence(99.4);
        setBldData(prev => ({
          ...prev,
          projectTitle: 'Vertex Prime High-Density Commercial Tower',
          ownerApplicant: 'Vertex Prime Real Estate Corp.',
          locationAddress: 'Lot 4-B, Block 12, Commonwealth Ave., Brgy. Batasan, Quezon City',
          tctNo: 'TCT-QC-2022-88190',
          taxDecNo: 'TD-04-99120-02',
          buildingUse: 'Commercial Retail & High-Density BPO Offices (Group E)',
          totalFloorArea: '14,250.00 sqm',
          noOfStoreys: '18 Storeys + 2 Basements',
          estimatedCost: '₱ 285,000,000.00'
        }));
      } else if (type === 'residential') {
        setBldFile('Townhouse_Complex_Architectural_Plan.jpg');
        setDetectedDocType('Single-Family Residential Blueprint (NBCP Group A)');
        setConfidence(98.9);
        setBldData(prev => ({
          ...prev,
          projectTitle: 'GreenHorizon 3-Storey Residential Townhouse Complex',
          ownerApplicant: user?.name || 'Engr. Ferdinand Santos',
          locationAddress: 'Lot 9, Block 3, Pearl St., Brgy. Fairview, Quezon City',
          tctNo: 'TCT-QC-2020-44102',
          taxDecNo: 'TD-04-77123-01',
          buildingUse: 'Residential Multi-Family Dwelling (Group A)',
          totalFloorArea: '850.00 sqm',
          noOfStoreys: '3 Storeys',
          estimatedCost: '₱ 18,500,000.00'
        }));
      } else {
        setBldFile('Transfer_Certificate_of_Title_TCT_Official.pdf');
        setDetectedDocType('Transfer Certificate of Title (TCT Land Registration)');
        setConfidence(99.2);
        setBldData(prev => ({
          ...prev,
          projectTitle: 'Eastside Logistics & Warehousing Center',
          ownerApplicant: 'Apex Industrial Logistics Inc.',
          locationAddress: 'Lot 14-A, Block 7, Regalado Highway, Brgy. North Fairview, Quezon City',
          tctNo: 'TCT-QC-2019-33104',
          taxDecNo: 'TD-04-55102-09',
          buildingUse: 'Industrial Storage & Logistics Facility (Group G)',
          totalFloorArea: '6,200.00 sqm',
          noOfStoreys: '2 Storeys + High-Bay Mezzanine',
          estimatedCost: '₱ 45,000,000.00'
        }));
      }
      setIsExtracting(false);
      setExtractTarget(null);
    }, 500);
  };

  const handleSelectSampleEngr = (type: 'structural' | 'fsec') => {
    setIsExtracting(true);
    setExtractTarget('engr');
    setTimeout(() => {
      if (type === 'structural') {
        setEngrFile('NSCP_Structural_Analysis_Seismic_Calculation.pdf');
        setEngrData({
          leadArchitect: 'Arch. Roberto S. Alcantara, UAP',
          architectPrc: 'PRC-ARCH-0044912 (Valid until 2028)',
          leadCivilEngineer: 'Engr. Danilo K. Villanueva, MSCE',
          civilEngineerPrc: 'PRC-CE-0033104 (Valid until 2027)',
          seismicStandard: 'NSCP 2015 7th Ed. Zone 4 Compliant (Ductile Shear Wall)',
          fsecNumber: 'FSEC-2026-BFP-0091',
          fsecStatus: 'BFP Station 4 Bureau Clearance Approved',
          confidence: 99.3
        });
      } else {
        setEngrFile('Fire_Safety_Evaluation_Clearance_FSEC_Official.pdf');
        setEngrData({
          leadArchitect: 'Arch. Maria Elena C. Dizon, UAP',
          architectPrc: 'PRC-ARCH-0088219 (Valid until 2027)',
          leadCivilEngineer: 'Engr. Teresa G. Ramos, RSE',
          civilEngineerPrc: 'PRC-CE-0099411 (Valid until 2028)',
          seismicStandard: 'NSCP 2015 Structural Safety Seal Verified',
          fsecNumber: 'FSEC-2026-BFP-0105',
          fsecStatus: 'RA 9514 Fire Code Certified (Sprinkler & Egress Compliant)',
          confidence: 99.5
        });
      }
      setIsExtracting(false);
      setExtractTarget(null);
    }, 500);
  };

  const handleSelectSampleOwnerId = (type: 'philid' | 'prc' | 'passport') => {
    setIsExtracting(true);
    setExtractTarget('id');
    setTimeout(() => {
      if (type === 'philid') {
        setOwnerIdFile('Philippine_National_ID_PhilID_Front.jpg');
        setOwnerIdData({
          idType: 'Philippine National ID (PhilID)',
          idNumber: '4819-2091-8841-2093',
          fullName: bldData.ownerApplicant,
          dob: '1980-08-14',
          matchScore: 100,
          matchVerified: true,
          confidence: 99.8
        });
      } else if (type === 'prc') {
        setOwnerIdFile('PRC_Professional_License_Card.jpg');
        setOwnerIdData({
          idType: 'PRC Professional Engineer ID Card',
          idNumber: 'PRC-CE-0044912',
          fullName: bldData.ownerApplicant,
          dob: '1979-11-20',
          matchScore: 100,
          matchVerified: true,
          confidence: 99.6
        });
      } else {
        setOwnerIdFile('Philippine_DFA_Passport_Biometric_Page.jpg');
        setOwnerIdData({
          idType: 'Philippine DFA Biometric Passport',
          idNumber: 'P8921402B',
          fullName: bldData.ownerApplicant,
          dob: '1985-08-30',
          matchScore: 100,
          matchVerified: true,
          confidence: 99.5
        });
      }
      setIsExtracting(false);
      setExtractTarget(null);
    }, 500);
  };

  const handleNativeUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'blueprint' | 'engr' | 'id') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsExtracting(true);
    setExtractTarget(target);
    setTimeout(() => {
      if (target === 'blueprint') {
        setBldFile(file.name);
        setDetectedDocType('Architectural Blueprint / Title Document (P.D. 1096)');
        setConfidence(99.0);
      } else if (target === 'engr') {
        setEngrFile(file.name);
      } else {
        setOwnerIdFile(file.name);
      }
      setIsExtracting(false);
      setExtractTarget(null);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Wizard Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shadow-xs border border-amber-200/60 dark:border-amber-800/60">
              <Building size={24} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Building and Construction Permit
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 uppercase tracking-wide">
                  Upload-First
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                National Building Code (P.D. 1096) • Automatic Blueprint & Engineering Document Extraction
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer flex items-center space-x-1"
            >
              <ArrowLeft size={14} />
              <span>Back to Overview</span>
            </button>
          </div>
        </div>

        {/* Step Progress Bar (1 to 5) */}
        {wizardStep <= 5 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-amber-600 dark:text-amber-400">
                Step {wizardStep} of 5: {
                  wizardStep === 1 ? 'Upload Blueprint & Title' :
                  wizardStep === 2 ? 'Engineering & Clearances' :
                  wizardStep === 3 ? 'Owner Identification' :
                  wizardStep === 4 ? 'Operations & Fee Assessment' :
                  'Final Review & Declaration'
                }
              </span>
              <span className="text-slate-400 font-mono">{Math.round((wizardStep / 5) * 100)}% Completed</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 rounded-full"
                style={{ width: `${(wizardStep / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: UPLOAD ARCHITECTURAL BLUEPRINT & LAND TITLE */}
        {/* ========================================================================= */}
        {wizardStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Step 1: Upload Architectural Blueprint & Property Title
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Upload your signed architectural plan, CAD drawing, or land title (TCT/Tax Dec). Key project details are automatically extracted into your review card.
              </p>
            </div>

            {/* Drag and drop upload zone */}
            <div className="relative border-2 border-dashed border-amber-300 dark:border-amber-700/60 rounded-3xl p-6 sm:p-8 text-center bg-amber-50/30 dark:bg-amber-950/10 hover:bg-amber-50/50 transition-all group">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleNativeUpload(e, 'blueprint')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                  <Upload size={26} />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    {bldFile ? (
                      <span className="text-amber-600 dark:text-amber-400 font-mono font-bold flex items-center justify-center gap-1.5">
                        <CheckCircle2 size={16} />
                        {bldFile}
                      </span>
                    ) : 'Click to Browse or Drag Blueprint / Land Title Photo here'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Supports Signed Blueprint PDF, CAD Plan JPG, PNG, TCT Document up to 25MB
                  </p>
                </div>
              </div>
            </div>

            {/* One-Click Quick Presets for Evaluators */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                ⚡ Or choose a sample blueprint document to test instant extraction:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSelectSampleBlueprint('commercial')}
                  className="p-3 text-left rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 bg-white dark:bg-slate-900 transition-all cursor-pointer group"
                >
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white block group-hover:text-amber-600">
                    🏢 Commercial Tower
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">18-Storey Mixed Use (Group E)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectSampleBlueprint('residential')}
                  className="p-3 text-left rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 bg-white dark:bg-slate-900 transition-all cursor-pointer group"
                >
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white block group-hover:text-amber-600">
                    🏡 Townhouse Complex
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">3-Storey Residential (Group A)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectSampleBlueprint('tct')}
                  className="p-3 text-left rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 bg-white dark:bg-slate-900 transition-all cursor-pointer group"
                >
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white block group-hover:text-amber-600">
                    📜 Land Title (TCT)
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Registered Warehouse Facility</span>
                </button>
              </div>
            </div>

            {/* Extraction Animation Indicator */}
            {isExtracting && extractTarget === 'blueprint' && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center space-x-3 animate-pulse">
                <Sparkles size={18} className="text-amber-600 dark:text-amber-400 animate-spin" />
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Scanning architectural blueprints and extracting structural dimensions...
                </span>
              </div>
            )}

            {/* Extracted Review Card */}
            {bldFile && !isExtracting && (
              <div className="rounded-3xl border border-amber-200 dark:border-amber-800/80 bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-950/20 dark:to-slate-900 p-5 sm:p-6 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                      <Check size={12} strokeWidth={3} />
                      <span>Document Detected: {detectedDocType}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">Confidence: {confidence}%</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline self-start sm:self-auto cursor-pointer"
                  >
                    {isEditing ? 'Done Editing' : 'Edit Information ✏️'}
                  </button>
                </div>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Building & Project Information Found:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Project Title</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={bldData.projectTitle}
                        onChange={(e) => setBldData({...bldData, projectTitle: e.target.value})}
                        className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border rounded-lg text-xs"
                      />
                    ) : (
                      <p className="font-bold text-slate-900 dark:text-white mt-0.5">{bldData.projectTitle}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Owner / Proponent</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={bldData.ownerApplicant}
                        onChange={(e) => setBldData({...bldData, ownerApplicant: e.target.value})}
                        className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border rounded-lg text-xs"
                      />
                    ) : (
                      <p className="font-bold text-slate-900 dark:text-white mt-0.5">{bldData.ownerApplicant}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Project Lot & Location Address</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={bldData.locationAddress}
                        onChange={(e) => setBldData({...bldData, locationAddress: e.target.value})}
                        className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border rounded-lg text-xs"
                      />
                    ) : (
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{bldData.locationAddress}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">TCT / Tax Dec No.</label>
                    <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{bldData.tctNo} ({bldData.taxDecNo})</p>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Building Use & Classification</label>
                    <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{bldData.buildingUse}</p>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Floor Area & Height</label>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{bldData.totalFloorArea} • {bldData.noOfStoreys}</p>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Estimated Construction Cost</label>
                    <p className="font-mono font-black text-amber-600 dark:text-amber-400 mt-0.5">{bldData.estimatedCost}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Navigation */}
            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setWizardStep(2)}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl text-xs shadow-md shadow-amber-600/25 flex items-center space-x-2 cursor-pointer"
              >
                <span>Next: Engineering Clearances →</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: ENGINEERING SIGN-OFF & FSEC CLEARANCES */}
        {/* ========================================================================= */}
        {wizardStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Step 2: Upload Engineering Sign-off & Fire Clearance (FSEC)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Attach your structural analysis calculations, PRC engineer endorsements, and BFP Fire Safety Evaluation Clearance.
              </p>
            </div>

            <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-6 sm:p-8 text-center bg-slate-50/50 dark:bg-slate-800/30 hover:border-amber-500 transition-all group">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleNativeUpload(e, 'engr')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                  <FileCheck size={26} />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    {engrFile ? (
                      <span className="text-amber-600 dark:text-amber-400 font-mono font-bold flex items-center justify-center gap-1.5">
                        <CheckCircle2 size={16} />
                        {engrFile}
                      </span>
                    ) : 'Click or Drag Engineering Calculations / FSEC Document'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">PDF or Scanned Plans with PRC Official Seal</p>
                </div>
              </div>
            </div>

            {/* Sample presets */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                ⚡ Quick samples for evaluation:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSelectSampleEngr('structural')}
                  className="p-3 text-left rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 bg-white dark:bg-slate-900 transition-all cursor-pointer group"
                >
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white block group-hover:text-amber-600">
                    📐 NSCP Structural Analysis Plan
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Zone 4 Seismic & Wind Speed Specs</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectSampleEngr('fsec')}
                  className="p-3 text-left rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 bg-white dark:bg-slate-900 transition-all cursor-pointer group"
                >
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white block group-hover:text-amber-600">
                    🚒 BFP Fire Safety Evaluation (FSEC)
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">RA 9514 Code Certified Clearance</span>
                </button>
              </div>
            </div>

            {/* Extracted Engineering Review Card */}
            {engrFile && !isExtracting && (
              <div className="rounded-3xl border border-amber-200 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/20 p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-amber-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    <span>PRC Licensed Professionals & FSEC Verified ({engrData.confidence}%)</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Architect-of-Record</label>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{engrData.leadArchitect}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{engrData.architectPrc}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Civil / Structural Engineer</label>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{engrData.leadCivilEngineer}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{engrData.civilEngineerPrc}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Structural Seismic Standard</label>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{engrData.seismicStandard}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Fire Safety (FSEC) No.</label>
                    <p className="font-mono font-bold text-amber-600 dark:text-amber-400 mt-0.5">{engrData.fsecNumber}</p>
                    <p className="text-[10px] text-emerald-600 font-semibold">{engrData.fsecStatus}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setWizardStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setWizardStep(3)}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl text-xs shadow-md shadow-amber-600/25 flex items-center space-x-2 cursor-pointer"
              >
                <span>Next: Owner Identification →</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: OWNER IDENTIFICATION & CROSS-MATCH */}
        {/* ========================================================================= */}
        {wizardStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Step 3: Upload Owner / Authorized Proponent Valid ID
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Upload your government-issued ID to execute automatic identity cross-matching against the building plan and land title.
              </p>
            </div>

            <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-6 sm:p-8 text-center bg-slate-50/50 dark:bg-slate-800/30 hover:border-amber-500 transition-all group">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleNativeUpload(e, 'id')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                  <User size={26} />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    {ownerIdFile ? (
                      <span className="text-amber-600 dark:text-amber-400 font-mono font-bold flex items-center justify-center gap-1.5">
                        <CheckCircle2 size={16} />
                        {ownerIdFile}
                      </span>
                    ) : 'Click or Drag PhilID / Passport / PRC License ID Photo'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Clear color photo or PDF scan</p>
                </div>
              </div>
            </div>

            {/* Sample presets */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                ⚡ Quick ID sample for testing:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSelectSampleOwnerId('philid')}
                  className="p-3 text-left rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 bg-white dark:bg-slate-900 transition-all cursor-pointer group"
                >
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white block group-hover:text-amber-600">
                    🪪 National ID (PhilID)
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Biometric PSA Registered</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectSampleOwnerId('prc')}
                  className="p-3 text-left rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 bg-white dark:bg-slate-900 transition-all cursor-pointer group"
                >
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white block group-hover:text-amber-600">
                    📋 PRC Professional Card
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Licensed Engineer Proponent</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectSampleOwnerId('passport')}
                  className="p-3 text-left rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 bg-white dark:bg-slate-900 transition-all cursor-pointer group"
                >
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white block group-hover:text-amber-600">
                    📘 DFA Passport
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Biometric Photo ID</span>
                </button>
              </div>
            </div>

            {ownerIdFile && !isExtracting && (
              <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/20 p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 size={15} />
                    <span>100% Identity Cross-Match Verified: Owner Matches Title & Building Plans</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-600 font-bold">Match: {ownerIdData.matchScore}%</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">ID Type</label>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{ownerIdData.idType}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">ID Number</label>
                    <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{ownerIdData.idNumber}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Verified Name</label>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{ownerIdData.fullName}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 mt-0.5">
                      Authenticated
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setWizardStep(2)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setWizardStep(4)}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl text-xs shadow-md shadow-amber-600/25 flex items-center space-x-2 cursor-pointer"
              >
                <span>Next: Operations & Fee Assessment →</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: OPERATIONS & TRANSPARENT FEE ASSESSMENT */}
        {/* ========================================================================= */}
        {wizardStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Step 4: Contact Operations & Transparent Fee Assessment
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Confirm your contact details for official site inspection notifications and review the computed municipal building fees.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Project Engineer / Owner Contact Number *</label>
                <input
                  type="text"
                  value={bldData.contactNumber}
                  onChange={(e) => setBldData({...bldData, contactNumber: e.target.value})}
                  className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Official Notice Email Address *</label>
                <input
                  type="email"
                  value={bldData.contactEmail}
                  onChange={(e) => setBldData({...bldData, contactEmail: e.target.value})}
                  className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Transparent NBCP Fee Schedule Breakdown */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-5 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign size={16} className="text-amber-500" />
                <span>Itemized National Building Code Fee Assessment (P.D. 1096):</span>
              </h4>

              <div className="space-y-2 divide-y divide-slate-200/70 dark:divide-slate-700/60">
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600 dark:text-slate-400">Building Permit Division (Floor Area Base)</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">₱{fees.permitFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600 dark:text-slate-400">Structural Safety & Geotechnical Audit</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">₱{fees.structuralInspectionFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600 dark:text-slate-400">Ancillary Plan Review (Sanitary & Electrical)</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">₱{fees.ancillaryFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600 dark:text-slate-400">Locational & Zoning Clearance Verification</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">₱{fees.zoningFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between pt-2.5 text-sm font-bold text-slate-900 dark:text-white">
                  <span>Total Assessed Municipal Regulatory Fees:</span>
                  <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-base">
                    ₱{fees.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setWizardStep(3)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setWizardStep(5)}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl text-xs shadow-md shadow-amber-600/25 flex items-center space-x-2 cursor-pointer"
              >
                <span>Next: Final Review & Submit →</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: FINAL REVIEW & SWORN DECLARATION */}
        {/* ========================================================================= */}
        {wizardStep === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Step 5: Final Application Review & Sworn Declaration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Verify all extracted blueprint parameters and sign the sworn affidavit before submitting to the Office of the Building Official.
              </p>
            </div>

            {/* Summary card */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white text-sm">Building Application Summary</span>
                <button onClick={() => setWizardStep(1)} className="text-amber-600 font-bold hover:underline">
                  Edit Blueprint Details
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Project Name</span>
                  <span className="font-bold text-slate-900 dark:text-white">{bldData.projectTitle}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Owner / Proponent</span>
                  <span className="font-bold text-slate-900 dark:text-white">{bldData.ownerApplicant}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Site Location</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{bldData.locationAddress}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Architect-of-Record</span>
                  <span className="font-bold text-slate-900 dark:text-white">{engrData.leadArchitect}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Assessment</span>
                  <span className="font-mono font-black text-amber-600 text-sm">₱{fees.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Sworn Legal Declaration */}
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={swornDeclared}
                  onChange={(e) => setSwornDeclared(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  I hereby declare under penalties of perjury that all drawings, architectural blueprints, structural calculations, and certificates attached to this application have been duly prepared by registered PRC professionals in full compliance with the <strong>National Building Code of the Philippines (P.D. 1096)</strong> and Fire Code (R.A. 9514).
                </span>
              </label>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setWizardStep(4)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={!swornDeclared}
                onClick={() => {
                  const newRef = `BC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
                  setSubmittedRefNo(newRef);
                  setWizardStep(6);
                  if (onAddNewApplication) {
                    onAddNewApplication(bldData.projectTitle, 'Building Permit');
                  }
                }}
                className={`px-8 py-3.5 rounded-2xl text-xs font-bold shadow-lg transition-all flex items-center space-x-2 ${
                  swornDeclared
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30 cursor-pointer'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Submit Building Permit Application →</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 6: SUBMISSION SUCCESS & DIGITAL APPLICATION TRACKING */}
        {/* ========================================================================= */}
        {wizardStep === 6 && (
          <div className="space-y-6 text-center py-4 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1.5 max-w-lg mx-auto">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Building Permit Application Successfully Filed!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your documents have been verified and endorsed to the Office of the Building Official (OBO) and BFP Fire Safety Bureau.
              </p>
            </div>

            {/* Reference & QR Code Box */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 max-w-md mx-auto space-y-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Official Tracking Reference Code</p>
                <p className="font-mono text-2xl font-black text-amber-600 dark:text-amber-400 tracking-wider mt-0.5">
                  {submittedRefNo}
                </p>
              </div>

              <div className="w-32 h-32 mx-auto bg-white p-2 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-center">
                <QrCode size={112} className="text-slate-900" />
              </div>
              <p className="text-[11px] text-slate-500 font-mono">Scan for Live OBO Engineering Audit</p>
            </div>

            {/* 4-Milestone Pipeline */}
            <div className="max-w-xl mx-auto space-y-3 text-left">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                Application Milestone Pipeline:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center mx-auto mb-1">✓</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-200 text-[11px] block">1. Filed</span>
                  <span className="text-[10px] text-emerald-600">Extracted</span>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-center">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center mx-auto mb-1">●</span>
                  <span className="font-bold text-amber-800 dark:text-amber-200 text-[11px] block">2. Zoning</span>
                  <span className="text-[10px] text-amber-600">In Progress</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-center">
                  <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-600 font-bold text-[10px] flex items-center justify-center mx-auto mb-1">3</span>
                  <span className="font-bold text-[11px] block">3. Joint Audit</span>
                  <span className="text-[10px]">OBO & BFP</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-center">
                  <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-600 font-bold text-[10px] flex items-center justify-center mx-auto mb-1">4</span>
                  <span className="font-bold text-[11px] block">4. Released</span>
                  <span className="text-[10px]">Mayor's Seal</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  setWizardStep(1);
                  onBack();
                }}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Return to Permit Overview
              </button>
              {onNavigateToDashboard && (
                <button
                  onClick={onNavigateToDashboard}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-600/25 cursor-pointer flex items-center space-x-1.5"
                >
                  <span>View on Dashboard & Tracker</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
