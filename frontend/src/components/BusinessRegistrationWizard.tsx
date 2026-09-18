import React, { useState, useRef } from 'react';
import { 
  CheckCircle2, 
  Bookmark, 
  ChevronRight, 
  FilePlus, 
  RotateCw, 
  Save, 
  Check, 
  Info, 
  AlertCircle,
  UserCheck,
  Shield,
  Edit,
  Lock,
  User,
  Building,
  Upload,
  FileText,
  Calendar,
  Phone,
  Mail,
  Home,
  HelpCircle,
  CheckCircle,
  Zap,
  MapPin,
  Search,
  Eye,
  Trash2,
  UploadCloud,
  FileCheck,
  Paperclip,
  ChevronDown,
  ChevronUp,
  X,
  Copy,
  Send,
  ZoomIn,
  ZoomOut,
  Download,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { RegistrationFormData } from '../types';

interface BusinessRegistrationWizardProps {
  onAddNewApplication?: (applicantName: string, permitType?: string) => void;
  onNavigateToDashboard?: () => void;
}

export const BusinessRegistrationWizard: React.FC<BusinessRegistrationWizardProps> = ({
  onAddNewApplication,
  onNavigateToDashboard,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isDraftSaved, setIsDraftSaved] = useState<boolean>(true);
  const [isDeclarationChecked, setIsDeclarationChecked] = useState<boolean>(true);

  // Hidden File Input Ref for real file selection
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  // Modal Overlay States
  const [wizardModal, setWizardModal] = useState<
    'none' | 'save_draft' | 'continue_later' | 'preview_file' | 'delete_file' | 'upload_progress'
  >('none');

  const [activeUploadDocName, setActiveUploadDocName] = useState<string>('');
  const [previewFileTarget, setPreviewFileTarget] = useState<any>(null);
  const [fileToDeleteTarget, setFileToDeleteTarget] = useState<any>(null);
  const [uploadProgressVal, setUploadProgressVal] = useState<number>(0);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Accordion toggle states for Step 4
  const [expandSec1, setExpandSec1] = useState<boolean>(true);
  const [expandSec2, setExpandSec2] = useState<boolean>(true);
  const [expandSec3, setExpandSec3] = useState<boolean>(true);

  // Step 1: Business Form State
  const [businessData, setBusinessData] = useState<RegistrationFormData>({
    registrationType: 'new',
    businessName: 'Dela Cruz General Merchandise',
    tradeName: 'DC General Merchandise',
    businessType: 'Sole Proprietorship',
    businessSize: 'Small (1 - 10 employees)',
    natureOfBusiness: 'Retail / General Merchandise',
    businessDescription: 'Retail store selling general merchandise such as groceries, household items, and personal care products.',
    unitFloorBuilding: 'Unit 2, Ground Floor',
    streetNameNo: 'Rizal Street, No. 123',
    barangay: 'Barangay San Isidro',
    cityMunicipality: 'San Isidro',
    province: 'Laguna',
    zipCode: '4000'
  });

  // Step 2: Owner / Applicant Information State
  const [ownerData, setOwnerData] = useState({
    ownerType: 'Individual',
    firstName: 'Juan',
    middleName: '',
    lastName: 'Dela Cruz',
    dob: '',
    nationality: 'Filipino',
    civilStatus: 'Single',
    mobileNumber: '09XXXXXXXXX',
    emailAddress: 'juan.delacruz@email.com',
    telephoneNumber: '',
    houseNo: '123',
    streetName: 'Main St.',
    barangay: 'Barangay 1',
    cityMunicipality: 'Quezon City',
    province: 'Metro Manila',
    zipCode: '1100'
  });

  // Step 3: Uploaded Files State
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 'up-1',
      docName: 'Business Permit Application Form',
      fileName: 'business_permit_form.pdf',
      dateUploaded: 'May 19, 2025 02:35 PM',
      size: '1.2 MB'
    }
  ]);

  const [requiredDocsList, setRequiredDocsList] = useState([
    {
      id: 'req-1',
      name: 'Business Permit Application Form',
      description: 'Duly accomplished and signed application form.',
      status: 'Uploaded',
      isOptional: false
    },
    {
      id: 'req-2',
      name: 'Valid Government ID',
      description: 'Any valid ID of the owner or authorized representative.',
      status: 'Uploaded',
      isOptional: false
    },
    {
      id: 'req-3',
      name: 'Proof of Business Address',
      description: 'Proof of ownership or rental agreement / utility bill.',
      status: 'Uploaded',
      isOptional: false
    },
    {
      id: 'req-4',
      name: 'DTI / SEC Registration (if applicable)',
      description: 'For registered businesses or corporations.',
      status: 'Uploaded',
      isOptional: false
    },
    {
      id: 'req-5',
      name: 'Barangay Clearance',
      description: 'Clearance from the business location.',
      status: 'Uploaded',
      isOptional: false
    },
    {
      id: 'req-6',
      name: 'Other Supporting Documents (optional)',
      description: 'Additional documents that may support your application.',
      status: 'Uploaded',
      isOptional: true
    }
  ]);

  const [showDOBPicker, setShowDOBPicker] = useState<boolean>(false);

  const handleSelectDOB = (dobStr: string) => {
    setOwnerData(prev => ({ ...prev, dob: dobStr }));
    setShowDOBPicker(false);
  };

  // Barangay to ZIP Code Auto-Generation Mapping Table
  const BARANGAY_ZIP_MAP: Record<string, string> = {
    'Barangay San Isidro': '4008',
    'Barangay 1': '4000',
    'Barangay 2': '4001',
    'Barangay 3': '4002',
    'Barangay 4': '4003',
    'Barangay 5': '4004',
    'Barangay Poblacion': '4009',
    'Barangay San Jose': '4010',
    'Barangay San Pedro': '4011',
    'Barangay San Antonio': '4012'
  };

  // Comprehensive Philippine Address Dataset for Autocomplete & Auto-Suggest
  const PHILIPPINE_ADDRESSES = [
    { street: 'Rizal Street, No. 123', barangay: 'Barangay San Isidro', city: 'San Pedro', province: 'Laguna', zipCode: '4000', region: 'CALABARZON' },
    { street: 'Ayala Avenue, No. 6789', barangay: 'Barangay Poblacion', city: 'Makati City', province: 'Metro Manila', zipCode: '1226', region: 'NCR' },
    { street: 'EDSA Corner Quezon Ave', barangay: 'Barangay Poblacion', city: 'Quezon City', province: 'Metro Manila', zipCode: '1100', region: 'NCR' },
    { street: 'McKinley Road, No. 45', barangay: 'Barangay 1', city: 'Taguig City (BGC)', province: 'Metro Manila', zipCode: '1634', region: 'NCR' },
    { street: 'Shaw Boulevard, No. 88', barangay: 'Barangay 2', city: 'Pasig City', province: 'Metro Manila', zipCode: '1603', region: 'NCR' },
    { street: 'Dr. A. Santos Avenue, No. 500', barangay: 'Barangay 3', city: 'Parañaque City', province: 'Metro Manila', zipCode: '1720', region: 'NCR' },
    { street: 'MacArthur Highway, No. 321', barangay: 'Barangay 4', city: 'Angeles City', province: 'Pampanga', zipCode: '2009', region: 'Central Luzon' },
    { street: 'Mango Avenue, No. 101', barangay: 'Barangay 5', city: 'Cebu City', province: 'Cebu', zipCode: '6000', region: 'Central Visayas' },
    { street: 'JP Laurel Avenue, No. 77', barangay: 'Barangay San Jose', city: 'Davao City', province: 'Davao del Sur', zipCode: '8000', region: 'Davao Region' },
    { street: 'Aguinaldo Highway, No. 200', barangay: 'Barangay San Pedro', city: 'Imus City', province: 'Cavite', zipCode: '4103', region: 'CALABARZON' },
    { street: 'Santa Rosa - Tagaytay Road', barangay: 'Barangay San Antonio', city: 'Santa Rosa City', province: 'Laguna', zipCode: '4026', region: 'CALABARZON' },
    { street: 'Governor Drive, No. 15', barangay: 'Barangay San Isidro', city: 'Dasmariñas City', province: 'Cavite', zipCode: '4114', region: 'CALABARZON' }
  ];

  const [showAddressDropdown, setShowAddressDropdown] = useState<boolean>(false);
  const [addressToastMsg, setAddressToastMsg] = useState<string | null>(null);

  const handleSelectAutoSuggestAddress = (item: typeof PHILIPPINE_ADDRESSES[0]) => {
    setBusinessData(prev => ({
      ...prev,
      streetNameNo: item.street,
      barangay: item.barangay,
      zipCode: item.zipCode
    }));
    setShowAddressDropdown(false);
    setAddressToastMsg(`✓ Auto-filled: ${item.street}, ${item.barangay}, ${item.city} (ZIP ${item.zipCode})`);
    setTimeout(() => setAddressToastMsg(null), 4000);
    setIsDraftSaved(false);
  };

  const handleAutoFillAddress = () => {
    setBusinessData(prev => ({
      ...prev,
      unitFloorBuilding: 'Unit 2, Ground Floor',
      streetNameNo: 'Rizal Street, No. 123',
      barangay: 'Barangay San Isidro',
      zipCode: '4000'
    }));
    setAddressToastMsg(`✓ Auto-filled sample address (ZIP 4000)`);
    setTimeout(() => setAddressToastMsg(null), 4000);
    setIsDraftSaved(false);
  };

  const handleBusinessInputChange = (field: keyof RegistrationFormData, value: string) => {
    setBusinessData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'barangay' && BARANGAY_ZIP_MAP[value]) {
        updated.zipCode = BARANGAY_ZIP_MAP[value];
      }
      return updated;
    });
    setIsDraftSaved(false);
  };

  const handleOwnerInputChange = (field: keyof typeof ownerData, value: string) => {
    setOwnerData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'barangay' && BARANGAY_ZIP_MAP[value]) {
        updated.zipCode = BARANGAY_ZIP_MAP[value];
      }
      return updated;
    });
    setIsDraftSaved(false);
  };

  // Trigger file selection or simulate file upload progress
  const handleInitiateUpload = (docName: string) => {
    setActiveUploadDocName(docName);
    if (hiddenFileInputRef.current) {
      hiddenFileInputRef.current.click();
    }
  };

  const handleRealFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      
      setWizardModal('upload_progress');
      setUploadProgressVal(10);

      const interval = setInterval(() => {
        setUploadProgressVal(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              const newFile = {
                id: `up-${Date.now()}`,
                docName: activeUploadDocName || 'Uploaded Document',
                fileName: file.name,
                dateUploaded: 'Just now',
                size: `${sizeMB} MB`
              };
              setUploadedFiles(prev => [newFile, ...prev]);
              setRequiredDocsList(prev => prev.map(doc => doc.name === activeUploadDocName ? { ...doc, status: 'Uploaded' } : doc));
              setIsDraftSaved(false);
              setWizardModal('none');
            }, 400);
            return 100;
          }
          return prev + 30;
        });
      }, 300);
    }
  };

  // Open Preview Modal
  const handleOpenPreview = (file: any) => {
    setPreviewFileTarget(file);
    setWizardModal('preview_file');
  };

  // Open Delete Confirmation Modal
  const handleOpenDelete = (file: any) => {
    setFileToDeleteTarget(file);
    setWizardModal('delete_file');
  };

  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  // Real File Download Handler
  const handleDownloadFile = (file: { id: string; docName: string; fileName: string; size: string }) => {
    setDownloadingFileId(file.id);
    
    setTimeout(() => {
      const content = `==========================================================\nGOVSERVE LGU BUSINESS PERMIT PORTAL — VERIFIED ATTACHMENT\n==========================================================\nDocument Title: ${file.docName}\nFile Name: ${file.fileName}\nFile Size: ${file.size}\nStatus: Verified (Security Scan Passed)\nReference ID: REF-2025-${Math.floor(100000 + Math.random() * 900000)}\nDownloaded On: ${new Date().toLocaleString()}\n==========================================================\nThis file is verified for official LGU Business Permitting.\n`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadingFileId(null);
      setDownloadSuccessId(file.id);
      setTimeout(() => setDownloadSuccessId(null), 3000);
    }, 800);
  };

  // Confirm Delete Handler
  const handleConfirmDelete = () => {
    if (fileToDeleteTarget) {
      setUploadedFiles(prev => prev.filter(f => f.id !== fileToDeleteTarget.id));
      setRequiredDocsList(prev => prev.map(doc => {
        if (doc.name === fileToDeleteTarget.docName) {
          return { ...doc, status: doc.isOptional ? 'Optional' : 'Not Uploaded' };
        }
        return doc;
      }));
      setWizardModal('none');
      setFileToDeleteTarget(null);
    }
  };

  // Save Draft Handler
  const handleSaveDraft = () => {
    setIsDraftSaved(true);
    setWizardModal('save_draft');
  };

  // Continue Later Handler
  const handleContinueLater = () => {
    setIsDraftSaved(true);
    setWizardModal('continue_later');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://govserve.ph/resume?code=GOV-2025-RESUME-8849');
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleSubmitFinal = () => {
    if (!isDeclarationChecked) {
      alert('Please check the declaration box before submitting.');
      return;
    }
    const applicantName = businessData.businessName || `${ownerData.firstName} ${ownerData.lastName}`;
    if (onAddNewApplication) {
      onAddNewApplication(applicantName, 'Business Permit');
    }
    alert(`Application Submitted Successfully!\n\nYour application for "${applicantName}" has been transmitted to the LGU Admin Evaluation Desk in real-time.\n\nYou can track the milestone progress from your Citizen Portal under "My Applications".`);
    if (onNavigateToDashboard) {
      onNavigateToDashboard();
    }
  };

  const steps = [
    { number: 1, label: 'Business Information' },
    { number: 2, label: 'Owner / Applicant Information' },
    { number: 3, label: 'Attachments' },
    { number: 4, label: 'Review & Submit' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Hidden File Input Element */}
      <input 
        type="file" 
        ref={hiddenFileInputRef} 
        onChange={handleRealFileSelected} 
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden" 
      />

      {/* Top Banner & Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Business Registration (New / Renewal)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete the steps below to register or renew your business.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-end md:self-center">
          {/* Draft Saved Indicator */}
          {isDraftSaved && (
            <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3 py-1.5 rounded-lg text-xs font-semibold">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Draft saved</span>
            </div>
          )}

          {/* Save Draft Button */}
          <button
            onClick={handleSaveDraft}
            className="flex items-center space-x-1.5 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors"
          >
            <Bookmark size={16} />
            <span>Save Draft</span>
          </button>

          {/* Continue Later Button */}
          <button 
            onClick={handleContinueLater}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <span>Continue Later</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Stepper Process Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative flex items-center justify-between max-w-4xl mx-auto">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;

            return (
              <div 
                key={step.number} 
                className="relative z-10 flex flex-col items-center cursor-pointer"
                onClick={() => setCurrentStep(step.number)}
              >
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md scale-110'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check size={18} /> : step.number}
                </div>
                <span 
                  className={`text-[11px] mt-2 font-medium max-w-[110px] text-center leading-tight ${
                    isCurrent ? 'font-extrabold text-blue-700' : isCompleted ? 'font-bold text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Layout: Step Form (Left 8 cols) + Helper Column (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Area (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: BUSINESS INFORMATION */}
          {currentStep === 1 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    1
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-sm">Business Information</h2>
                    <p className="text-xs text-slate-500">Please provide the basic details of your business.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-white hover:bg-blue-50/60 text-blue-600 rounded-full border border-blue-200 text-xs font-semibold shadow-2xs transition-all"
                >
                  <Bookmark size={14} className="text-blue-600" />
                  <span>Save as Draft</span>
                </button>
              </div>

              {/* Registration Type Radio Options */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Registration Type <span className="text-red-500">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label 
                    className={`flex items-start space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      businessData.registrationType === 'new'
                        ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600/30'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="registrationType" 
                      value="new"
                      checked={businessData.registrationType === 'new'}
                      onChange={() => handleBusinessInputChange('registrationType', 'new')}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <FilePlus size={16} className="text-blue-600" />
                        <span className="font-bold text-slate-900 text-xs">New Registration</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Register a brand new business entity in the municipality.
                      </p>
                    </div>
                  </label>

                  <label 
                    className={`flex items-start space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      businessData.registrationType === 'renewal'
                        ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600/30'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="registrationType" 
                      value="renewal"
                      checked={businessData.registrationType === 'renewal'}
                      onChange={() => handleBusinessInputChange('registrationType', 'renewal')}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <RotateCw size={16} className="text-blue-600" />
                        <span className="font-bold text-slate-900 text-xs">Renewal</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Renew an existing business permit for the current year.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={businessData.businessName}
                      onChange={(e) => handleBusinessInputChange('businessName', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Trade Name / DBA (if applicable)
                    </label>
                    <input
                      type="text"
                      value={businessData.tradeName}
                      onChange={(e) => handleBusinessInputChange('tradeName', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Business Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={businessData.businessType}
                      onChange={(e) => handleBusinessInputChange('businessType', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Corporation">Corporation</option>
                      <option value="Cooperative">Cooperative</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Business Size <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={businessData.businessSize}
                      onChange={(e) => handleBusinessInputChange('businessSize', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                      <option value="Micro (1 - 4 employees)">Micro (1 - 4 employees)</option>
                      <option value="Small (1 - 10 employees)">Small (1 - 10 employees)</option>
                      <option value="Medium (11 - 99 employees)">Medium (11 - 99 employees)</option>
                      <option value="Large (100+ employees)">Large (100+ employees)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nature of Business <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={businessData.natureOfBusiness}
                      onChange={(e) => handleBusinessInputChange('natureOfBusiness', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                      <option value="Retail / General Merchandise">Retail / General Merchandise</option>
                      <option value="Food & Restaurant Services">Food & Restaurant Services</option>
                      <option value="Professional Services">Professional Services</option>
                      <option value="Manufacturing & Industrial">Manufacturing & Industrial</option>
                      <option value="IT & Digital Services">IT & Digital Services</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business Description
                  </label>
                  <textarea
                    rows={3}
                    value={businessData.businessDescription}
                    onChange={(e) => handleBusinessInputChange('businessDescription', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                {/* Business Address Section */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900 text-xs">Business Address</h3>
                    <button
                      type="button"
                      onClick={handleAutoFillAddress}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1 rounded-lg transition-all flex items-center space-x-1 shadow-2xs"
                    >
                      <Zap size={13} className="fill-blue-600" />
                      <span>Auto-fill Sample Address</span>
                    </button>
                  </div>

                  {addressToastMsg && (
                    <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                      <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                      <span>{addressToastMsg}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Unit / Floor / Building No.
                        </label>
                        <input
                          type="text"
                          placeholder="Unit 2, Ground Floor"
                          value={businessData.unitFloorBuilding}
                          onChange={(e) => handleBusinessInputChange('unitFloorBuilding', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-2xs"
                        />
                      </div>

                      <div className="relative">
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-semibold text-slate-700">
                            Street Name & No. <span className="text-red-500">*</span>
                          </label>
                          <span className="text-[10px] text-blue-600 font-semibold flex items-center space-x-1">
                            <Search size={10} />
                            <span>Auto-suggest active</span>
                          </span>
                        </div>
                        
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Type street or location (e.g. Rizal Street, Ayala Ave)..."
                            value={businessData.streetNameNo}
                            onFocus={() => setShowAddressDropdown(true)}
                            onChange={(e) => {
                              handleBusinessInputChange('streetNameNo', e.target.value);
                              setShowAddressDropdown(true);
                            }}
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-2xs"
                          />
                          <MapPin size={15} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Interactive Auto-Suggest Dropdown List */}
                        {showAddressDropdown && (
                          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100 animate-in fade-in">
                            <div className="p-2 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between sticky top-0 border-b border-slate-200">
                              <span className="flex items-center space-x-1">
                                <Search size={12} className="text-blue-600" />
                                <span>Philippine Address Database</span>
                              </span>
                              <button 
                                type="button" 
                                onClick={() => setShowAddressDropdown(false)}
                                className="text-slate-400 hover:text-slate-600 font-normal text-[11px]"
                              >
                                Close
                              </button>
                            </div>
                            
                            {PHILIPPINE_ADDRESSES.filter(item => 
                              !businessData.streetNameNo || 
                              item.street.toLowerCase().includes(businessData.streetNameNo.toLowerCase()) ||
                              item.barangay.toLowerCase().includes(businessData.streetNameNo.toLowerCase()) ||
                              item.city.toLowerCase().includes(businessData.streetNameNo.toLowerCase()) ||
                              item.province.toLowerCase().includes(businessData.streetNameNo.toLowerCase())
                            ).length > 0 ? (
                              PHILIPPINE_ADDRESSES.filter(item => 
                                !businessData.streetNameNo || 
                                item.street.toLowerCase().includes(businessData.streetNameNo.toLowerCase()) ||
                                item.barangay.toLowerCase().includes(businessData.streetNameNo.toLowerCase()) ||
                                item.city.toLowerCase().includes(businessData.streetNameNo.toLowerCase()) ||
                                item.province.toLowerCase().includes(businessData.streetNameNo.toLowerCase())
                              ).map((item, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleSelectAutoSuggestAddress(item)}
                                  className="w-full text-left p-3 hover:bg-blue-50/70 transition-colors flex items-start space-x-2.5 group"
                                >
                                  <MapPin size={15} className="text-blue-600 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-900 text-xs truncate group-hover:text-blue-700">
                                      {item.street}
                                    </p>
                                    <p className="text-[11px] text-slate-500 truncate">
                                      {item.barangay}, {item.city}, {item.province}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <span className="bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                        ZIP {item.zipCode}
                                      </span>
                                      <span className="bg-blue-50 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                        {item.region}
                                      </span>
                                    </div>
                                  </div>
                                </button>
                              ))
                            ) : (
                              <div className="p-4 text-center text-xs text-slate-500">
                                No exact matching Philippine address found. You can type your custom street address.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Barangay <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={businessData.barangay}
                          onChange={(e) => handleBusinessInputChange('barangay', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white font-medium shadow-2xs"
                        >
                          <option value="Barangay San Isidro">Barangay San Isidro</option>
                          <option value="Barangay 1">Barangay 1</option>
                          <option value="Barangay 2">Barangay 2</option>
                          <option value="Barangay 3">Barangay 3</option>
                          <option value="Barangay 4">Barangay 4</option>
                          <option value="Barangay 5">Barangay 5</option>
                          <option value="Barangay Poblacion">Barangay Poblacion</option>
                          <option value="Barangay San Jose">Barangay San Jose</option>
                          <option value="Barangay San Pedro">Barangay San Pedro</option>
                          <option value="Barangay San Antonio">Barangay San Antonio</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-semibold text-slate-700">
                            ZIP Code <span className="text-red-500">*</span>
                          </label>
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center space-x-1 shadow-2xs">
                            <Zap size={11} className="fill-emerald-600 text-emerald-600" />
                            <span>Auto-generated</span>
                          </span>
                        </div>
                        <input
                          type="text"
                          value={businessData.zipCode}
                          onChange={(e) => handleBusinessInputChange('zipCode', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono font-bold text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50/70 shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button disabled className="px-5 py-2.5 bg-slate-100 text-slate-400 rounded-xl text-xs font-semibold cursor-not-allowed">
                  Back
                </button>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                >
                  <span>Next Step</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: OWNER / APPLICANT INFORMATION */}
          {currentStep === 2 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    2
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-sm">Owner / Applicant Information</h2>
                    <p className="text-xs text-slate-500">Please provide the owner or authorized representative details.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-white hover:bg-blue-50/60 text-blue-600 rounded-full border border-blue-200 text-xs font-semibold shadow-2xs transition-all"
                >
                  <Bookmark size={14} className="text-blue-600" />
                  <span>Save as Draft</span>
                </button>
              </div>

              {/* Owner Type Selection */}
              <div className="space-y-2">
                <div className="flex items-center space-x-6 text-xs">
                  <span className="font-bold text-slate-800">Owner Type</span>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="ownerType"
                      value="Individual"
                      checked={ownerData.ownerType === 'Individual'}
                      onChange={() => handleOwnerInputChange('ownerType', 'Individual')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-slate-800">Individual</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="ownerType"
                      value="Business / Corporation"
                      checked={ownerData.ownerType === 'Business / Corporation'}
                      onChange={() => handleOwnerInputChange('ownerType', 'Business / Corporation')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-slate-800">Business / Corporation</span>
                  </label>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-3 pt-1">
                <h3 className="font-bold text-blue-700 text-xs tracking-wide">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      placeholder="Juan"
                      value={ownerData.firstName}
                      onChange={(e) => handleOwnerInputChange('firstName', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Middle Name</label>
                    <input
                      type="text"
                      placeholder="Enter middle name"
                      value={ownerData.middleName}
                      onChange={(e) => handleOwnerInputChange('middleName', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      placeholder="Dela Cruz"
                      value={ownerData.lastName}
                      onChange={(e) => handleOwnerInputChange('lastName', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth *</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="MM/DD/YYYY"
                        value={ownerData.dob}
                        onChange={(e) => handleOwnerInputChange('dob', e.target.value)}
                        className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowDOBPicker(!showDOBPicker)}
                        className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                        title="Open Calendar Picker"
                      >
                        <Calendar size={16} />
                      </button>

                      {/* Interactive DOB Date Picker Dropdown Popover */}
                      {showDOBPicker && (
                        <div className="absolute left-0 top-12 z-50 w-64 bg-white p-3.5 rounded-2xl shadow-2xl border border-slate-200 text-xs space-y-3 animate-in fade-in zoom-in-95">
                          <div className="flex items-center justify-between font-bold text-slate-800 border-b border-slate-100 pb-2">
                            <span>Select Date of Birth</span>
                            <button 
                              type="button" 
                              onClick={() => setShowDOBPicker(false)} 
                              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-100"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          {/* Quick Year Shortcuts */}
                          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                            <button 
                              type="button"
                              onClick={() => handleSelectDOB('05/12/1990')} 
                              className="p-2 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-colors text-center"
                            >
                              May 12, 1990
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleSelectDOB('08/24/1995')} 
                              className="p-2 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors text-center"
                            >
                              Aug 24, 1995
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleSelectDOB('11/04/1988')} 
                              className="p-2 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors text-center"
                            >
                              Nov 04, 1988
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleSelectDOB('03/15/2000')} 
                              className="p-2 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors text-center"
                            >
                              Mar 15, 2000
                            </button>
                          </div>

                          {/* Custom Date Input Picker */}
                          <div className="pt-2 border-t border-slate-100 space-y-1">
                            <label className="block text-[10px] text-slate-400 font-medium">Pick Custom Birth Date</label>
                            <input 
                              type="date"
                              onChange={(e) => {
                                if (e.target.value) {
                                  const [y, m, d] = e.target.value.split('-');
                                  handleSelectDOB(`${m}/${d}/${y}`);
                                }
                              }}
                              className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium" 
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nationality *</label>
                    <select
                      value={ownerData.nationality}
                      onChange={(e) => handleOwnerInputChange('nationality', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                      <option value="Filipino">Filipino</option>
                      <option value="American">American</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Civil Status</label>
                    <select
                      value={ownerData.civilStatus}
                      onChange={(e) => handleOwnerInputChange('civilStatus', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 pt-1">
                <h3 className="font-bold text-blue-700 text-xs tracking-wide">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                    <input
                      type="text"
                      placeholder="09XXXXXXXXX"
                      value={ownerData.mobileNumber}
                      onChange={(e) => handleOwnerInputChange('mobileNumber', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      placeholder="juan.delacruz@email.com"
                      value={ownerData.emailAddress}
                      onChange={(e) => handleOwnerInputChange('emailAddress', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Telephone Number</label>
                    <input
                      type="text"
                      placeholder="(02) 8XX XXXX"
                      value={ownerData.telephoneNumber}
                      onChange={(e) => handleOwnerInputChange('telephoneNumber', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Residential Address */}
              <div className="space-y-3 pt-1">
                <h3 className="font-bold text-blue-700 text-xs tracking-wide">Residential Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">House / Unit No. *</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={ownerData.houseNo}
                      onChange={(e) => handleOwnerInputChange('houseNo', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Street Name *</label>
                    <input
                      type="text"
                      placeholder="Sampaloc St."
                      value={ownerData.streetName}
                      onChange={(e) => handleOwnerInputChange('streetName', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Barangay *</label>
                    <input
                      type="text"
                      placeholder="Barangay 5"
                      value={ownerData.barangay}
                      onChange={(e) => handleOwnerInputChange('barangay', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City / Municipality *</label>
                    <input
                      type="text"
                      placeholder="Quezon City"
                      value={ownerData.cityMunicipality}
                      onChange={(e) => handleOwnerInputChange('cityMunicipality', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Province *</label>
                    <input
                      type="text"
                      placeholder="Metro Manila"
                      value={ownerData.province}
                      onChange={(e) => handleOwnerInputChange('province', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">ZIP / Postal Code *</label>
                    <input
                      type="text"
                      placeholder="1100"
                      value={ownerData.zipCode}
                      onChange={(e) => handleOwnerInputChange('zipCode', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Form Features Banner */}
              <div className="bg-blue-50/60 border border-blue-200/80 p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-blue-900 text-xs">Features</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] text-blue-950">
                  <div className="flex items-center space-x-1.5">
                    <UserCheck size={14} className="text-blue-600 flex-shrink-0" />
                    <span>Auto-fill for returning applicants</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Shield size={14} className="text-blue-600 flex-shrink-0" />
                    <span>Input validation and error checks</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Bookmark size={14} className="text-blue-600 flex-shrink-0" />
                    <span>Save as Draft anytime</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Edit size={14} className="text-blue-600 flex-shrink-0" />
                    <span>Edit information before submission</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Lock size={14} className="text-blue-600 flex-shrink-0" />
                    <span>Secure and confidential information handling</span>
                  </div>
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors"
                >
                  Back
                </button>

                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                >
                  <span>Next Step</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ATTACHMENTS (WITH FUNCTIONAL UPLOAD, SAVES & EYE/TRASH ICONS) */}
          {currentStep === 3 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    3
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-sm">Attachments</h2>
                    <p className="text-xs text-slate-500">Upload the required documents below. Ensure files are clear and complete.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-white hover:bg-blue-50/60 text-blue-600 rounded-full border border-blue-200 text-xs font-semibold shadow-2xs transition-all"
                >
                  <Bookmark size={14} className="text-blue-600" />
                  <span>Save as Draft</span>
                </button>
              </div>

              {/* Accepted File Banner */}
              <div className="bg-blue-50/70 border border-blue-100 p-3.5 rounded-xl flex items-center space-x-2 text-xs text-blue-900 font-medium">
                <Info size={15} className="text-blue-600 flex-shrink-0" />
                <span>Accepted file types: PDF, JPG, PNG</span>
                <span>•</span>
                <span className="font-bold">Max file size per file: 5MB</span>
              </div>

              {/* Required Documents Table */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-xs">Required Documents</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 font-semibold">
                        <th className="p-3 pl-4">Document</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">File</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 pr-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {requiredDocsList.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 pl-4">
                            <div className="flex items-center space-x-2.5">
                              <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg flex-shrink-0">
                                <FileText size={16} />
                              </div>
                              <span className="font-bold text-slate-900">{doc.name}</span>
                            </div>
                          </td>
                          <td className="p-3 text-slate-500 text-[11px] max-w-[200px]">{doc.description}</td>
                          <td className="p-3">
                            <button
                              onClick={() => handleInitiateUpload(doc.name)}
                              className="flex items-center space-x-1.5 px-3 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-semibold transition-colors"
                            >
                              <UploadCloud size={14} />
                              <span>Upload File</span>
                            </button>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {doc.status === 'Uploaded' ? (
                              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold">
                                Uploaded
                              </span>
                            ) : doc.isOptional ? (
                              <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold">
                                Optional
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[10px] font-bold">
                                Not Uploaded
                              </span>
                            )}
                          </td>
                          <td className="p-3 pr-4 text-center text-slate-300 font-semibold">—</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Uploaded Documents Section (with Eye Preview & Delete Trash Icons) */}
              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-slate-900 text-xs">Uploaded Documents ({uploadedFiles.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 font-semibold">
                        <th className="p-3 pl-4">Document</th>
                        <th className="p-3">File Name</th>
                        <th className="p-3">Date Uploaded</th>
                        <th className="p-3">Size</th>
                        <th className="p-3 pr-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {uploadedFiles.map((file) => (
                        <tr key={file.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 pl-4 font-semibold text-slate-900">
                            <div className="flex items-center space-x-2">
                              <FileText size={16} className="text-blue-600" />
                              <span>{file.docName}</span>
                            </div>
                          </td>
                          <td className="p-3 text-slate-600 font-mono text-[11px]">{file.fileName}</td>
                          <td className="p-3 text-slate-500 text-[11px]">{file.dateUploaded}</td>
                          <td className="p-3 text-slate-500 text-[11px]">{file.size}</td>
                          <td className="p-3 pr-4 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              {/* Eye Icon Button (Opens Document Preview Modal) */}
                              <button 
                                onClick={() => handleOpenPreview(file)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors"
                                title="Preview Document"
                              >
                                <Eye size={15} />
                              </button>
                              {/* Delete Trash Icon Button (Opens Delete Confirmation Modal) */}
                              <button 
                                onClick={() => handleOpenDelete(file)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
                                title="Remove File"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Light Green Validation Banner */}
              <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl flex items-start space-x-3 text-xs text-emerald-950">
                <Shield size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-900">
                    Make sure all required documents are uploaded before proceeding to the next step.
                  </p>
                  <p className="text-emerald-700 text-[11px] mt-0.5">
                    Incomplete documents may delay the processing of your application.
                  </p>
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors"
                >
                  Back
                </button>

                <button
                  onClick={() => setCurrentStep(4)}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                >
                  <span>Next Step</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & SUBMIT */}
          {currentStep === 4 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    4
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-sm">Review & Submit</h2>
                    <p className="text-xs text-slate-500">Please review all the details below. You can edit any section before final submission.</p>
                  </div>
                </div>

                <button
                  onClick={handleSaveDraft}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 border border-slate-300 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Bookmark size={14} />
                  <span>Save as Draft</span>
                </button>
              </div>

              {/* Application Summary Section */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-slate-900 text-xs">Application Summary</h3>
                  <div className="flex items-center space-x-1 text-[11px] text-emerald-600 font-medium">
                    <CheckCircle2 size={13} />
                    <span>All required sections are complete.</span>
                  </div>
                </div>

                {/* 4 Summary Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-blue-50/40 rounded-xl border border-blue-100 flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">Application Type</p>
                      <p className="font-bold text-slate-800 text-xs">New Registration</p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-blue-50/40 rounded-xl border border-blue-100 flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">Date Started</p>
                      <p className="font-bold text-slate-800 text-xs">May 19, 2025 01:45 PM</p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-blue-50/40 rounded-xl border border-blue-100 flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">Applicant</p>
                      <p className="font-bold text-slate-800 text-xs">{ownerData.firstName} {ownerData.lastName}</p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-blue-50/40 rounded-xl border border-blue-100 flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <Paperclip size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">Total Attachments</p>
                      <p className="font-bold text-slate-800 text-xs">{uploadedFiles.length} file(s) uploaded</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Your Information Accordion Section */}
              <div className="space-y-4 pt-1">
                <h3 className="font-bold text-slate-900 text-xs">Review Your Information</h3>

                {/* Section 1: Business Information */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  <div className="p-3.5 bg-slate-50/80 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <Building size={16} className="text-blue-600" />
                      <span className="font-bold text-blue-900 text-xs">1. Business Information</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setCurrentStep(1)} 
                        className="flex items-center space-x-1 px-3 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        <Edit size={12} />
                        <span>Edit</span>
                      </button>
                      <button onClick={() => setExpandSec1(!expandSec1)} className="p-1 text-slate-400 hover:text-slate-600">
                        {expandSec1 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {expandSec1 && (
                    <div className="p-4 text-xs space-y-2 border-t border-slate-100 divide-y divide-slate-50">
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400 w-44">Business Name</span>
                        <span className="font-bold text-slate-800 flex-1">{businessData.businessName}</span>
                      </div>
                      <div className="flex justify-between py-1 pt-2">
                        <span className="text-slate-400 w-44">Nature of Business</span>
                        <span className="font-medium text-slate-800 flex-1">{businessData.natureOfBusiness}</span>
                      </div>
                      <div className="flex justify-between py-1 pt-2">
                        <span className="text-slate-400 w-44">Business Address</span>
                        <span className="font-medium text-slate-800 flex-1">
                          {businessData.streetNameNo}, {businessData.barangay}, {businessData.cityMunicipality}, {businessData.province} {businessData.zipCode}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 2: Owner / Applicant Information */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  <div className="p-3.5 bg-slate-50/80 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <User size={16} className="text-blue-600" />
                      <span className="font-bold text-blue-900 text-xs">2. Owner / Applicant Information</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setCurrentStep(2)} 
                        className="flex items-center space-x-1 px-3 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        <Edit size={12} />
                        <span>Edit</span>
                      </button>
                      <button onClick={() => setExpandSec2(!expandSec2)} className="p-1 text-slate-400 hover:text-slate-600">
                        {expandSec2 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {expandSec2 && (
                    <div className="p-4 text-xs space-y-2 border-t border-slate-100 divide-y divide-slate-50">
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400 w-44">Owner Type</span>
                        <span className="font-medium text-slate-800 flex-1">{ownerData.ownerType}</span>
                      </div>
                      <div className="flex justify-between py-1 pt-2">
                        <span className="text-slate-400 w-44">Name</span>
                        <span className="font-bold text-slate-800 flex-1">{ownerData.firstName} {ownerData.lastName}</span>
                      </div>
                      <div className="flex justify-between py-1 pt-2">
                        <span className="text-slate-400 w-44">Contact Number</span>
                        <span className="font-mono text-slate-800 flex-1">{ownerData.mobileNumber}</span>
                      </div>
                      <div className="flex justify-between py-1 pt-2">
                        <span className="text-slate-400 w-44">Email Address</span>
                        <span className="font-medium text-slate-800 flex-1">{ownerData.emailAddress}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 3: Attachments */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  <div className="p-3.5 bg-slate-50/80 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <Paperclip size={16} className="text-blue-600" />
                      <span className="font-bold text-blue-900 text-xs">3. Attachments</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setCurrentStep(3)} 
                        className="flex items-center space-x-1 px-3 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        <Edit size={12} />
                        <span>Edit</span>
                      </button>
                      <button onClick={() => setExpandSec3(!expandSec3)} className="p-1 text-slate-400 hover:text-slate-600">
                        {expandSec3 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {expandSec3 && (
                    <div className="p-4 text-xs flex justify-between items-center border-t border-slate-100">
                      <span className="text-slate-400">Uploaded Files</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-700">{uploadedFiles.length} of 6 required documents</span>
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold">
                          Complete
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Declaration Checkbox Box */}
              <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-emerald-950 text-xs">Declaration</h4>
                <label className="flex items-start space-x-2.5 cursor-pointer text-xs text-emerald-950">
                  <input
                    type="checkbox"
                    checked={isDeclarationChecked}
                    onChange={(e) => setIsDeclarationChecked(e.target.checked)}
                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500 rounded"
                  />
                  <div>
                    <span className="font-bold">
                      I hereby certify that all information provided in this application is true, correct, and complete.
                    </span>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      I understand that any false or misleading information may result in the delay, rejection, or cancellation of my application.
                    </p>
                  </div>
                </label>
              </div>

              {/* Disclaimer Banner */}
              <div className="bg-blue-50/70 border border-blue-100 p-3.5 rounded-xl flex items-center space-x-2 text-xs text-blue-950">
                <Info size={16} className="text-blue-600 flex-shrink-0" />
                <span className="text-[11px]">
                  Please review all information carefully before submitting. After submission, you will receive a confirmation and reference number.
                </span>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors"
                >
                  Back
                </button>

                <button
                  onClick={handleSubmitFinal}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                >
                  <Lock size={15} />
                  <span>Submit Application</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Info Cards Column (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Auto-Fill for Returning Applicants */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-xs">
              Auto-Fill for Returning Applicants
            </h3>
            <div className="flex items-start space-x-2 text-xs">
              <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-emerald-800 text-xs">
                  We found your previous application.
                </p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  We've auto-filled your information from your last registration.
                </p>
              </div>
            </div>

            <button 
              onClick={() => alert('Auto-filled previous registration details!')}
              className="w-full mt-2 py-2 px-3 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold transition-colors"
            >
              Review Auto-Filled Data
            </button>
          </div>

          {/* Card 2: What you can do (Light Blue) */}
          <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-100/80 space-y-3">
            <h3 className="font-bold text-blue-900 text-xs">What you can do</h3>
            <ul className="space-y-2 text-xs text-blue-950">
              <li className="flex items-start space-x-2">
                <Check size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Fill out the form and click Next to continue.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Save Draft to continue later.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span>You can edit auto-filled information if needed.</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Information Needed (Light Amber) */}
          <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-100/80 space-y-3">
            <h3 className="font-bold text-amber-900 text-xs">Information Needed</h3>
            <ul className="space-y-1.5 text-xs text-amber-950 pl-1">
              <li className="flex items-center space-x-2">
                <span className={`w-1.5 h-1.5 rounded-full ${currentStep === 1 ? 'bg-amber-800 font-bold' : 'bg-amber-700'}`} />
                <span className={currentStep === 1 ? 'font-bold text-amber-950' : ''}>Business Information</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className={`w-1.5 h-1.5 rounded-full ${currentStep === 2 ? 'bg-amber-800 font-bold' : 'bg-amber-700'}`} />
                <span className={currentStep === 2 ? 'font-bold text-amber-950' : ''}>Owner / Applicant Information</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className={`w-1.5 h-1.5 rounded-full ${currentStep === 3 ? 'bg-amber-800 font-bold' : 'bg-amber-700'}`} />
                <span className={currentStep === 3 ? 'font-bold text-amber-950' : ''}>Required Documents</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className={`w-1.5 h-1.5 rounded-full ${currentStep === 4 ? 'bg-amber-800 font-bold' : 'bg-amber-700'}`} />
                <span className={currentStep === 4 ? 'font-bold text-amber-950' : ''}>Review & Submit</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Reminders (Light Emerald) */}
          <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-100/80 space-y-3">
            <h3 className="font-bold text-emerald-900 text-xs">Reminders</h3>
            <p className="text-xs text-emerald-950 leading-relaxed">
              Ensure all information is accurate. Incomplete or incorrect details may delay the processing of your application.
            </p>
            <div className="pt-2 border-t border-emerald-200/60 flex items-start space-x-2 text-xs text-emerald-900">
              <Shield size={16} className="text-emerald-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold">Your information is safe with us.</p>
                <p className="text-[11px] text-emerald-800">We use secure encryption to protect your data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: SAVE DRAFT CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {wizardModal === 'save_draft' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Draft Saved Successfully!</h3>
              <p className="text-xs text-slate-500 mt-1">Your progress up to Step {currentStep} has been saved securely.</p>
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-blue-700 font-bold">
                Reference Code: DRAFT-2025-9941
              </div>
            </div>

            <button
              onClick={() => setWizardModal('none')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              Continue Working
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CONTINUE LATER MODAL */}
      {/* ========================================================================= */}
      {wizardModal === 'continue_later' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Bookmark size={20} className="text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Continue Application Later</h3>
              </div>
              <button onClick={() => setWizardModal('none')} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              We've saved your draft. You can resume filling out this application anytime using your secure resume link or code below.
            </p>

            <div className="space-y-2 text-xs">
              <label className="block font-bold text-slate-700">Resume Link</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  readOnly 
                  value="https://govserve.ph/resume?code=GOV-2025-RESUME-8849"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono text-[11px]"
                />
                <button 
                  onClick={handleCopyLink}
                  className="px-3 py-2.5 bg-blue-600 text-white rounded-xl font-semibold flex items-center space-x-1 flex-shrink-0 text-xs"
                >
                  <Copy size={14} />
                  <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center space-x-2 text-xs text-blue-900">
              <Send size={16} className="text-blue-600 flex-shrink-0" />
              <span>A resume link has also been sent to <strong>{ownerData.emailAddress}</strong></span>
            </div>

            <div className="pt-2 flex space-x-2">
              <button
                onClick={() => setWizardModal('none')}
                className="w-full py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold"
              >
                Close & Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: UPLOAD PROGRESS OVERLAY */}
      {/* ========================================================================= */}
      {wizardModal === 'upload_progress' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <UploadCloud size={24} className="animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Uploading Document...</h3>
              <p className="text-xs text-slate-500 mt-0.5">{activeUploadDocName}</p>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgressVal}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-blue-600">{uploadProgressVal}%</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DOCUMENT PREVIEW MODAL (EYE ICON & DOWNLOAD BUTTON) */}
      {/* ========================================================================= */}
      {wizardModal === 'preview_file' && previewFileTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText size={18} className="text-blue-400" />
                <div>
                  <h3 className="font-bold text-xs">{previewFileTarget.docName}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{previewFileTarget.fileName} ({previewFileTarget.size})</p>
                </div>
              </div>
              <button onClick={() => setWizardModal('none')} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 bg-slate-100 min-h-[320px] flex flex-col items-center justify-center border-b border-slate-200">
              <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 max-w-md w-full text-center space-y-3">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto font-bold text-xl">
                  PDF
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">{previewFileTarget.fileName}</h4>
                <div className="text-[11px] text-slate-500 space-y-1">
                  <p>Uploaded: {previewFileTarget.dateUploaded}</p>
                  <p>File Size: {previewFileTarget.size}</p>
                  <p className="text-emerald-600 font-bold">✓ Security Check: Clean (No Viruses Found)</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-500">
                <Eye size={14} className="text-blue-600" />
                <span>Document Status: Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleDownloadFile(previewFileTarget)}
                  disabled={downloadingFileId === previewFileTarget.id}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-xs transition-all disabled:opacity-50"
                >
                  <Download size={14} />
                  <span>
                    {downloadingFileId === previewFileTarget.id 
                      ? 'Downloading...' 
                      : downloadSuccessId === previewFileTarget.id 
                      ? 'Downloaded ✓' 
                      : 'Download'}
                  </span>
                </button>
                <button 
                  onClick={() => setWizardModal('none')} 
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-xl font-semibold"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: DELETE FILE CONFIRMATION MODAL (TRASH ICON) */}
      {/* ========================================================================= */}
      {wizardModal === 'delete_file' && fileToDeleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <AlertTriangle size={28} />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Remove Uploaded File?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete <strong className="text-slate-800 font-mono">{fileToDeleteTarget.fileName}</strong>?
              </p>
            </div>

            <div className="pt-2 flex space-x-3">
              <button
                onClick={() => setWizardModal('none')}
                className="w-1/2 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
