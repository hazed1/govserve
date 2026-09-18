import React, { useState, useRef } from 'react';
import { 
  Info, 
  GripVertical, 
  FileText, 
  Image as ImageIcon, 
  UploadCloud, 
  Eye, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Bookmark, 
  Send, 
  ArrowLeft,
  ChevronRight,
  CheckCircle,
  FileCheck,
  Trash2,
  Download,
  X,
  RefreshCw,
  Copy,
  Lock,
  ShieldCheck
} from 'lucide-react';

interface DocumentItem {
  id: string;
  name: string;
  description: string;
  status: 'Uploaded' | 'Pending';
  file?: {
    filename: string;
    size: string;
    type: 'pdf' | 'image';
  };
}

interface RequirementsSubmissionProps {
  onNavigateToTab?: (tab: string) => void;
  onAddNewApplication?: (applicantName: string, permitType?: string) => void;
}

export const RequirementsSubmission: React.FC<RequirementsSubmissionProps> = ({
  onNavigateToTab,
  onAddNewApplication
}) => {
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadDocId, setActiveUploadDocId] = useState<string | null>(null);

  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-1',
      name: 'Business Registration (DTI/SEC)',
      description: 'Certified true copy of DTI or SEC registration',
      status: 'Uploaded',
      file: { filename: 'DTI_Registration.pdf', size: '245 KB', type: 'pdf' }
    },
    {
      id: 'doc-2',
      name: "Mayor's/Business Permit (Current)",
      description: "Current Mayor's/Business Permit or Certificate",
      status: 'Uploaded',
      file: { filename: 'Business_Permit.pdf', size: '312 KB', type: 'pdf' }
    },
    {
      id: 'doc-3',
      name: 'Barangay Clearance',
      description: 'Barangay clearance for the business location',
      status: 'Uploaded',
      file: { filename: 'Barangay_Clearance.jpg', size: '186 KB', type: 'image' }
    },
    {
      id: 'doc-4',
      name: 'Tax Identification Number (TIN)',
      description: 'Photocopy of TIN Certificate',
      status: 'Uploaded',
      file: { filename: 'TIN_Certificate.pdf', size: '201 KB', type: 'pdf' }
    },
    {
      id: 'doc-5',
      name: 'Lease/Proof of Ownership',
      description: 'Lease contract or proof of ownership',
      status: 'Uploaded',
      file: { filename: 'Lease_Agreement.pdf', size: '512 KB', type: 'pdf' }
    },
    {
      id: 'doc-6',
      name: 'Locational Map',
      description: 'Sketch or map of the business location',
      status: 'Uploaded',
      file: { filename: 'Location_Map.jpg', size: '98 KB', type: 'image' }
    },
    {
      id: 'doc-7',
      name: 'Fire Safety Inspection Certificate',
      description: 'Valid Fire Safety Inspection Certificate',
      status: 'Pending'
    },
    {
      id: 'doc-8',
      name: 'Sanitary Permit (if applicable)',
      description: 'Sanitary Permit or Health Certificate',
      status: 'Pending'
    }
  ]);

  // Modal Overlay States
  const [activeModal, setActiveModal] = useState<
    'none' | 'save_draft' | 'submit_review' | 'app_details' | 'preview_doc' | 'delete_doc'
  >('none');

  const [openContextMenuId, setOpenContextMenuId] = useState<string | null>(null);
  const [targetDoc, setTargetDoc] = useState<DocumentItem | null>(null);
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const completedCount = documents.filter(d => d.status === 'Uploaded').length;
  const pendingCount = documents.filter(d => d.status === 'Pending').length;
  const totalCount = documents.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  // Trigger File Upload
  const handleInitiateUpload = (docId: string) => {
    setActiveUploadDocId(docId);
    if (hiddenFileInputRef.current) {
      hiddenFileInputRef.current.click();
    }
  };

  const handleRealFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && activeUploadDocId) {
      const file = files[0];
      const sizeKB = (file.size / 1024).toFixed(0);
      const fileType = file.name.endsWith('.pdf') ? 'pdf' : 'image';

      setDocuments(prev => prev.map(doc => {
        if (doc.id === activeUploadDocId) {
          return {
            ...doc,
            status: 'Uploaded',
            file: {
              filename: file.name,
              size: `${sizeKB} KB`,
              type: fileType
            }
          };
        }
        return doc;
      }));
      setOpenContextMenuId(null);
    }
  };

  // Open Preview Modal
  const handleOpenPreview = (doc: DocumentItem) => {
    setTargetDoc(doc);
    setOpenContextMenuId(null);
    setActiveModal('preview_doc');
  };

  // Open Delete Confirmation Modal
  const handleOpenDelete = (doc: DocumentItem) => {
    setTargetDoc(doc);
    setOpenContextMenuId(null);
    setActiveModal('delete_doc');
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (targetDoc) {
      setDocuments(prev => prev.map(d => {
        if (d.id === targetDoc.id) {
          return {
            ...d,
            status: 'Pending',
            file: undefined
          };
        }
        return d;
      }));
      setActiveModal('none');
      setTargetDoc(null);
    }
  };

  // Download File Handler
  const handleDownloadDoc = (doc: DocumentItem) => {
    if (!doc.file) return;
    setDownloadingDocId(doc.id);
    
    setTimeout(() => {
      const content = `==========================================================\nGOVSERVE LGU REQUIREMENTS SUBMISSION FILE\n==========================================================\nDocument Name: ${doc.name}\nFile Name: ${doc.file?.filename}\nFile Size: ${doc.file?.size}\nStatus: Verified Upload\nReference No: NR-2024-000123\nDownloaded On: ${new Date().toLocaleString()}\n==========================================================\n`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.file?.filename || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadingDocId(null);
      setDownloadSuccessId(doc.id);
      setTimeout(() => setDownloadSuccessId(null), 3000);
    }, 600);
  };

  // Submit for Review Handler
  const handleSubmitForReview = () => {
    if (onAddNewApplication) {
      onAddNewApplication('Dela Cruz General Merchandise', 'Business Permit');
    }
    setActiveModal('submit_review');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={hiddenFileInputRef} 
        onChange={handleRealFileSelected}
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden" 
      />

      {/* Top Banner & Notice */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Requirements Submission
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload all required documents for your application. Please ensure all files are clear and legible.
          </p>
        </div>

        {/* Accepted File Types Info Banner */}
        <div className="bg-blue-50/70 border border-blue-100 p-4 rounded-xl flex items-start space-x-3 text-xs text-blue-900">
          <div className="p-1 bg-blue-600 text-white rounded-full mt-0.5">
            <Info size={14} />
          </div>
          <div>
            <p className="font-bold text-blue-950">Accepted file types: PDF, JPG, JPEG, PNG</p>
            <p className="text-blue-700 text-[11px] mt-0.5">Maximum file size: 10MB per file</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Document List (Left 8 cols) + Helper Summary Cards (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Required Documents Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Required Documents</h2>
              <p className="text-xs text-slate-500 mt-0.5">Please upload all documents listed below.</p>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 font-semibold">
                    <th className="p-3 pl-4">Document</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 pr-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors relative">
                      {/* Document Name */}
                      <td className="p-3 pl-4">
                        <div className="flex items-start space-x-2.5">
                          <GripVertical size={16} className="text-slate-300 mt-0.5 flex-shrink-0 cursor-grab" />
                          <div className="p-2 bg-red-50 text-red-500 rounded-lg flex-shrink-0">
                            <FileText size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-snug">{doc.name}</p>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="p-3 text-slate-500 text-[11px] max-w-[180px]">
                        {doc.description}
                      </td>

                      {/* Status */}
                      <td className="p-3 whitespace-nowrap">
                        {doc.status === 'Uploaded' ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={12} className="text-emerald-600" />
                            <span>Uploaded</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock size={12} className="text-amber-600" />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>

                      {/* Action Cell */}
                      <td className="p-3 pr-4">
                        {doc.status === 'Uploaded' && doc.file ? (
                          <div className="flex items-center space-x-2">
                            {/* Uploaded File Box */}
                            <div className="flex items-center space-x-2 p-2 bg-slate-50 border border-slate-200 rounded-xl max-w-[180px] truncate">
                              <div className={`p-1.5 rounded-md ${doc.file.type === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                {doc.file.type === 'pdf' ? <FileText size={16} /> : <ImageIcon size={16} />}
                              </div>
                              <div className="truncate text-left min-w-0">
                                <p className="font-bold text-slate-800 text-[11px] truncate">{doc.file.filename}</p>
                                <p className="text-[9px] text-slate-400">{doc.file.size}</p>
                              </div>
                            </div>

                            {/* Eye Icon (Preview Modal) */}
                            <button 
                              onClick={() => handleOpenPreview(doc)} 
                              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors"
                              title="Preview Document"
                            >
                              <Eye size={14} />
                            </button>

                            {/* Delete Trash Icon (Beside 3 Dots) */}
                            <button 
                              onClick={() => handleOpenDelete(doc)} 
                              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
                              title="Delete File"
                            >
                              <Trash2 size={14} />
                            </button>

                            {/* 3 Dots Menu Button */}
                            <div className="relative">
                              <button 
                                onClick={() => setOpenContextMenuId(openContextMenuId === doc.id ? null : doc.id)} 
                                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                                title="More Options"
                              >
                                <MoreVertical size={14} />
                              </button>

                              {/* 3 Dots Context Menu Dropdown */}
                              {openContextMenuId === doc.id && (
                                <div className="absolute right-0 top-10 z-30 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 space-y-1 text-xs text-slate-700 animate-in fade-in zoom-in-95">
                                  <button 
                                    onClick={() => handleOpenPreview(doc)}
                                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-lg flex items-center space-x-2 font-medium"
                                  >
                                    <Eye size={14} className="text-blue-600" />
                                    <span>Preview Document</span>
                                  </button>

                                  <button 
                                    onClick={() => { setOpenContextMenuId(null); handleDownloadDoc(doc); }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-lg flex items-center space-x-2 font-medium"
                                  >
                                    <Download size={14} className="text-emerald-600" />
                                    <span>Download File</span>
                                  </button>

                                  <button 
                                    onClick={() => { setOpenContextMenuId(null); handleInitiateUpload(doc.id); }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-lg flex items-center space-x-2 font-medium"
                                  >
                                    <RefreshCw size={14} className="text-amber-600" />
                                    <span>Re-upload File</span>
                                  </button>

                                  <hr className="my-1 border-slate-100" />

                                  <button 
                                    onClick={() => handleOpenDelete(doc)}
                                    className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 rounded-lg flex items-center space-x-2 font-medium"
                                  >
                                    <Trash2 size={14} />
                                    <span>Remove File</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* Pending Upload File Button */
                          <button
                            onClick={() => handleInitiateUpload(doc.id)}
                            className="w-full flex flex-col items-center justify-center py-2 px-3 border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/20 hover:bg-blue-50 rounded-xl text-blue-600 transition-colors group"
                          >
                            <div className="flex items-center space-x-1 font-semibold text-xs">
                              <UploadCloud size={14} className="group-hover:scale-110 transition-transform" />
                              <span>Upload File</span>
                            </div>
                            <span className="text-[9px] text-slate-400 mt-0.5">PDF, JPG, PNG (Max. 10MB)</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Warning Note Banner */}
            <div className="bg-amber-50/80 border border-amber-200/80 p-3.5 rounded-xl flex items-center space-x-2.5 text-xs text-amber-900 mt-4">
              <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
              <p className="text-[11px] leading-tight">
                <strong>Notice:</strong> Please ensure all documents are clear and legible. Unreadable documents may cause delays in processing.
              </p>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                if (onNavigateToTab) onNavigateToTab('Business Registration (New / Renewal)');
                else alert('Navigating back...');
              }}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <div className="flex items-center space-x-3">
              {/* Save Draft Button */}
              <button
                onClick={() => setActiveModal('save_draft')}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <Bookmark size={16} />
                <span>Save Draft</span>
              </button>

              {/* Submit for Review Button */}
              <button
                onClick={handleSubmitForReview}
                className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
              >
                <Send size={15} />
                <span>Submit for Review</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Helper Summary Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Application Summary */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-xs">Application Summary</h3>
            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="pt-1">
                <p className="text-slate-400 text-[11px]">Application Type</p>
                <p className="font-bold text-slate-800">New Registration</p>
              </div>
              <div className="pt-2">
                <p className="text-slate-400 text-[11px]">Business Name</p>
                <p className="font-bold text-slate-800">Dela Cruz General Merchandise</p>
              </div>
              <div className="pt-2">
                <p className="text-slate-400 text-[11px]">Reference No.</p>
                <p className="font-mono font-bold text-blue-600">NR-2024-000123</p>
              </div>
              <div className="pt-2">
                <p className="text-slate-400 text-[11px]">Date Started</p>
                <p className="font-medium text-slate-700">May 7, 2024</p>
              </div>
            </div>

            {/* View Application Details Link */}
            <button 
              onClick={() => setActiveModal('app_details')}
              className="w-full text-left text-xs font-semibold text-blue-600 hover:text-blue-700 pt-2 flex items-center justify-between group"
            >
              <span>View Application Details</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 2: Requirements Checklist Progress */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-xs">Requirements Checklist</h3>

            {/* Circular Progress Display */}
            <div className="flex items-center justify-center space-x-4 py-2">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500 transition-all duration-500"
                    strokeDasharray={`${completionPercentage}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="font-extrabold text-slate-900 text-sm">{completedCount} / {totalCount}</span>
                  <span className="text-[9px] text-slate-400 font-medium">Completed</span>
                </div>
              </div>
            </div>

            {/* Status Breakdown Legend */}
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-600">Completed</span>
                </div>
                <span className="font-bold text-slate-900">{completedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-slate-600">Pending</span>
                </div>
                <span className="font-bold text-slate-900">{pendingCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-slate-600">Missing</span>
                </div>
                <span className="font-bold text-slate-900">0</span>
              </div>
            </div>
          </div>

          {/* Card 3: File Upload Tips */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-xs">File Upload Tips</h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start space-x-2">
                <CheckCircle size={15} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Ensure all text is readable</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle size={15} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Upload clear, high-quality files</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle size={15} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span>All documents must be in color</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle size={15} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Maximum file size is 10MB per file</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: SAVE DRAFT MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'save_draft' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Requirements Draft Saved!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your uploaded documents ({completedCount} of {totalCount} completed) have been saved securely.
              </p>
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-blue-700 font-bold">
                Ref Code: DRAFT-2024-REQ99
              </div>
            </div>

            <button
              onClick={() => setActiveModal('none')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              Continue Work
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: SUBMIT FOR REVIEW CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'submit_review' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <Send size={28} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Submitted for Review!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your application and requirement documents for <strong className="text-slate-800">Dela Cruz General Merchandise</strong> have been submitted to LGU evaluators.
              </p>
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl font-mono text-xs text-blue-900 font-bold">
                Tracking Code: NR-2024-000123
              </div>
            </div>

            <div className="pt-2 flex space-x-2">
              <button
                onClick={() => {
                  setActiveModal('none');
                  if (onNavigateToTab) {
                    onNavigateToTab('Application Status Tracking');
                  }
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <span>Go to Application Tracking</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: VIEW APPLICATION DETAILS MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'app_details' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCheck size={20} className="text-blue-400" />
                <h3 className="font-bold text-sm">Application Specs — NR-2024-000123</h3>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <p className="text-[10px] text-slate-400">Business Name</p>
                <p className="font-extrabold text-blue-900 text-sm">Dela Cruz General Merchandise</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <p className="text-slate-400 text-[10px]">Application Type</p>
                  <p className="font-bold text-slate-800">New Registration</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px]">Date Started</p>
                  <p className="font-medium text-slate-700">May 7, 2024</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px]">Requirements Progress</p>
                  <p className="font-bold text-emerald-600">{completedCount} of {totalCount} Completed</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px]">Assigned LGU</p>
                  <p className="font-medium text-slate-700">San Isidro, Laguna</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button onClick={() => setActiveModal('none')} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DOCUMENT PREVIEW MODAL (EYE ICON) */}
      {/* ========================================================================= */}
      {activeModal === 'preview_doc' && targetDoc && targetDoc.file && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText size={18} className="text-blue-400" />
                <div>
                  <h3 className="font-bold text-xs">{targetDoc.name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{targetDoc.file.filename} ({targetDoc.file.size})</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Mock Viewer Document Content */}
            <div className="p-8 bg-slate-100 min-h-[300px] flex flex-col items-center justify-center border-b border-slate-200">
              <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 max-w-md w-full text-center space-y-3">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto font-bold text-xl uppercase">
                  {targetDoc.file.type}
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">{targetDoc.file.filename}</h4>
                <div className="text-[11px] text-slate-500 space-y-1">
                  <p>Requirement: {targetDoc.name}</p>
                  <p>File Size: {targetDoc.file.size}</p>
                  <p className="text-emerald-600 font-bold">✓ Security Check: Clean (No Viruses Found)</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-500">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>Document Status: Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleDownloadDoc(targetDoc)}
                  disabled={downloadingDocId === targetDoc.id}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-xs transition-all disabled:opacity-50"
                >
                  <Download size={14} />
                  <span>
                    {downloadingDocId === targetDoc.id 
                      ? 'Downloading...' 
                      : downloadSuccessId === targetDoc.id 
                      ? 'Downloaded ✓' 
                      : 'Download File'}
                  </span>
                </button>
                <button 
                  onClick={() => setActiveModal('none')} 
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
      {/* MODAL 5: DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'delete_doc' && targetDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <AlertTriangle size={28} />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Remove Uploaded Document?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove <strong className="text-slate-800 font-mono">{targetDoc.file?.filename || targetDoc.name}</strong>?
              </p>
            </div>

            <div className="pt-2 flex space-x-3">
              <button
                onClick={() => setActiveModal('none')}
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
