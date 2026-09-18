import React, { useState, useRef } from 'react';
import { 
  FileText, 
  ArrowLeft, 
  Info, 
  CheckCircle2, 
  Eye, 
  Download, 
  Trash2, 
  Lock, 
  Lightbulb, 
  Maximize2, 
  Minus, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Ruler, 
  Layers, 
  Printer, 
  ShieldCheck, 
  Award, 
  Check, 
  X, 
  AlertTriangle, 
  Filter, 
  Search, 
  FileCheck, 
  Sparkles, 
  Building2, 
  User, 
  Clock, 
  UploadCloud, 
  RefreshCw,
  SlidersHorizontal,
  CloudUpload,
  CheckSquare,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PlanAndBlueprintUploadProps {
  onNavigateToTab?: (tab: string) => void;
  onNavigateToDashboard?: () => void;
}

interface DocumentItem {
  id: string;
  fileName: string;
  fileType: 'PDF' | 'DWG' | 'DXF' | 'DWF';
  discipline: 'Architectural' | 'Structural' | 'Electrical' | 'Sanitary/Plumbing' | 'Mechanical';
  size: string;
  uploadedOn: string;
  status: 'Approved' | 'Under Review' | 'Pending' | 'Needs Revision';
  totalPages: number;
  author?: string;
  prcLicense?: string;
  complianceRate?: number;
  notes?: string;
  isStamped?: boolean;
}

export const PlanAndBlueprintUpload: React.FC<PlanAndBlueprintUploadProps> = ({
  onNavigateToTab,
  onNavigateToDashboard
}) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLDivElement>(null);

  // User Building Project Summary
  const [projectInfo] = useState({
    refNo: 'BP-2025-0891',
    projectName: 'Santos Mixed-Use Commercial Complex',
    applicant: user?.name || 'Registered Citizen',
    location: 'Lot 14 Blk 5, Rizal Avenue, Brgy. Poblacion',
    buildingType: 'Commercial / Residential (Group E)',
    totalFloorArea: '485.50 sq.m (3-Storey)',
    submittedOn: 'May 10, 2025 09:30 AM',
    overallStatus: 'Under Engineering Review'
  });

  // Upload Form State for Citizen
  const [selectedDiscipline, setSelectedDiscipline] = useState<'Architectural' | 'Structural' | 'Electrical' | 'Sanitary/Plumbing' | 'Mechanical'>('Architectural');
  const [professionalName, setProfessionalName] = useState<string>('Arch. Maria Elena Santos, UAP');
  const [prcLicenseNumber, setPrcLicenseNumber] = useState<string>('PRC-0084721');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Documents list for Citizen
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-1',
      fileName: 'Architectural_Plan.pdf',
      fileType: 'PDF',
      discipline: 'Architectural',
      size: '2.45 MB',
      uploadedOn: 'May 10, 2025 10:15 AM',
      status: 'Approved',
      totalPages: 8,
      author: 'Arch. Maria Elena Santos, UAP',
      prcLicense: 'PRC-0084721',
      complianceRate: 100,
      notes: 'All floor layouts, setbacks, and room dimensions adhere to PD 1096 Sec 704.',
      isStamped: true
    },
    {
      id: 'doc-2',
      fileName: 'Structural_Plan.dwg',
      fileType: 'DWG',
      discipline: 'Structural',
      size: '4.12 MB',
      uploadedOn: 'May 10, 2025 10:18 AM',
      status: 'Under Review',
      totalPages: 4,
      author: 'Engr. Roberto M. Santos, CE, SE',
      prcLicense: 'PRC-0098412',
      complianceRate: 98,
      notes: 'Structural frame calculations and seismic load parameters are under evaluation by OBO.',
      isStamped: false
    },
    {
      id: 'doc-3',
      fileName: 'Sanitary_Plumbing_Plan.pdf',
      fileType: 'PDF',
      discipline: 'Sanitary/Plumbing',
      size: '1.80 MB',
      uploadedOn: 'May 10, 2025 10:22 AM',
      status: 'Pending',
      totalPages: 3,
      author: 'Engr. Carlos Mendoza, ME, RMP',
      prcLicense: 'PRC-0044192',
      complianceRate: 95,
      notes: 'Submitted and queued for sanitary evaluation.',
      isStamped: false
    },
    {
      id: 'doc-4',
      fileName: 'Electrical_Layout_Plan.pdf',
      fileType: 'PDF',
      discipline: 'Electrical',
      size: '2.10 MB',
      uploadedOn: 'May 10, 2025 10:25 AM',
      status: 'Pending',
      totalPages: 4,
      author: 'Engr. Danilo Ramos, PEE',
      prcLicense: 'PRC-0033108',
      complianceRate: 96,
      notes: 'Main distribution panel schedule and single-line diagram submitted.',
      isStamped: false
    }
  ]);

  const [selectedDoc, setSelectedDoc] = useState<DocumentItem>(documents[0]);
  const [disciplineFilter, setDisciplineFilter] = useState<string>('All');

  // Viewer controls
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [activeTabInspection, setActiveTabInspection] = useState<'blueprint' | 'compliance' | 'layers'>('blueprint');
  
  // Layer Toggles
  const [layerWalls, setLayerWalls] = useState<boolean>(true);
  const [layerDimensions, setLayerDimensions] = useState<boolean>(true);
  const [layerFurniture, setLayerFurniture] = useState<boolean>(true);
  const [layerSeal, setLayerSeal] = useState<boolean>(true);
  const [layerAdminApprovalStamp, setLayerAdminApprovalStamp] = useState<boolean>(true);
  
  // Interactive Measurement Mode
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [measurementResult, setMeasurementResult] = useState<string | null>(null);

  // Toast / Feedback State
  const [previewFeedback, setPreviewFeedback] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setPreviewFeedback(msg);
    setTimeout(() => setPreviewFeedback(null), 3500);
  };

  // Filtered Documents
  const filteredDocuments = documents.filter(doc => {
    return disciplineFilter === 'All' || doc.discipline === disciplineFilter;
  });

  // Handle Real File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const ext = (file.name.split('.').pop()?.toUpperCase() || 'PDF') as 'PDF' | 'DWG' | 'DXF' | 'DWF';
      
      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        fileName: file.name,
        fileType: ['PDF', 'DWG', 'DXF', 'DWF'].includes(ext) ? ext : 'PDF',
        discipline: selectedDiscipline,
        size: `${sizeMB} MB`,
        uploadedOn: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        status: 'Pending',
        totalPages: ext === 'PDF' ? 8 : 1,
        author: professionalName.trim() || 'Registered Professional Applicant',
        prcLicense: prcLicenseNumber.trim() || 'PRC-0099124',
        complianceRate: 100,
        notes: 'Newly uploaded file queued for Building Official evaluation.',
        isStamped: false
      };

      setDocuments((prev) => [newDoc, ...prev]);
      setSelectedDoc(newDoc);
      setCurrentPage(1);
      showToast(`Uploaded and submitted ${file.name} for ${selectedDiscipline} evaluation!`);
    }
  };

  const handleSelectDocInTable = (doc: DocumentItem) => {
    setSelectedDoc(doc);
    setCurrentPage(1);
    if (previewCanvasRef.current && window.innerWidth < 1024) {
      previewCanvasRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    showToast(`Loaded ${doc.fileName} into viewer`);
  };

  const handleEyeClick = (doc: DocumentItem, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedDoc(doc);
    setCurrentPage(1);
    setIsInspectorOpen(true);
    showToast(`Inspecting high-definition blueprint: ${doc.fileName}`);
  };

  const handleDownload = (doc: DocumentItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const element = document.createElement('a');
    const file = new Blob([`Construction plan document for ${doc.fileName}\nProject: ${projectInfo.projectName}\nDiscipline: ${doc.discipline}\nStatus: ${doc.status}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = doc.fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast(`Downloaded ${doc.fileName}`);
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const target = documents.find(d => d.id === id);
    if (target?.status === 'Approved') {
      showToast('⚠️ Approved plans cannot be deleted.');
      return;
    }
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    if (selectedDoc.id === id && updated.length > 0) {
      setSelectedDoc(updated[0]);
      setCurrentPage(1);
    }
    showToast(`Removed ${target?.fileName || 'document'}`);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 15, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 15, 50));
  };

  const handleRotate = () => {
    setRotationAngle((prev) => (prev + 90) % 360);
    showToast(`Rotated to ${(rotationAngle + 90) % 360}°`);
  };

  const handleNextPage = () => {
    if (currentPage < (selectedDoc?.totalPages || 8)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleSimulateMeasure = () => {
    setIsMeasuring(!isMeasuring);
    if (!isMeasuring) {
      setMeasurementResult('Measured: Wall-to-Wall Span = 4.25 meters (Clear Height = 2.70m)');
      showToast('Measurement Tool Active: Click two points to measure scale');
    } else {
      setMeasurementResult(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 relative">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".pdf,.dwg,.dxf,.dwf" 
        className="hidden" 
      />

      {/* Toast Feedback Notification */}
      {previewFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 flex items-center space-x-2 text-xs animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{previewFeedback}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOP HEADER: Clean Citizen Permitting Banner                               */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Plan & Blueprint Upload
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload and manage architectural and engineering plans for Building Official evaluation.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-center">
          <button 
            onClick={() => {
              if (onNavigateToDashboard) onNavigateToDashboard();
              else if (onNavigateToTab) onNavigateToTab('Dashboard');
            }}
            className="flex items-center space-x-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Upload Plans, My Documents & Feedback                        */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Upload Construction Plans */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <CloudUpload size={18} className="text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">Upload Construction Plan</h2>
              </div>
              <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                PDF / DWG
              </span>
            </div>

            {/* Discipline Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Plan Discipline / Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value as any)}
                className="w-full p-2.5 rounded-xl text-xs border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              >
                <option value="Architectural">Architectural Plan (Floor Layouts & Elevations)</option>
                <option value="Structural">Structural Plan & Framing Calculations</option>
                <option value="Electrical">Electrical Layout & Distribution Panel</option>
                <option value="Sanitary/Plumbing">Sanitary & Plumbing Layout</option>
                <option value="Mechanical">Mechanical & HVAC Layout</option>
              </select>
            </div>

            {/* Registered Architect / Engineer Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Signing Professional <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={professionalName}
                  onChange={(e) => setProfessionalName(e.target.value)}
                  placeholder="e.g. Arch. Maria Santos"
                  className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  PRC License Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={prcLicenseNumber}
                  onChange={(e) => setPrcLicenseNumber(e.target.value)}
                  placeholder="e.g. PRC-0084721"
                  className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Drag & Drop Zone */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  const input = fileInputRef.current;
                  if (input) {
                    input.files = e.dataTransfer.files;
                    const event = new Event('change', { bubbles: true });
                    input.dispatchEvent(event);
                  }
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center space-y-3 cursor-pointer transition-all ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' 
                  : 'border-blue-300 bg-blue-50/20 hover:bg-blue-50/40'
              }`}
            >
              <div className="w-12 h-12 bg-white border border-blue-100 shadow-2xs text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <CloudUpload size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-xs">Drag and drop your plan file here</p>
                <p className="text-[11px] text-slate-400 my-0.5">or</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                Browse Files
              </button>
              <p className="text-[10px] text-slate-400 pt-1 leading-relaxed">
                Accepted formats: PDF, DWG, DXF, DWF • Max size: 50MB per sheet
              </p>
            </div>

            {/* File Requirements Checklist */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <h3 className="font-bold text-slate-900 text-xs">Submission Requirements</h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  <span>Must be digitally signed & sealed by licensed professional (PRC)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  <span>Clear and readable dimension lines and room annotations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  <span>Complete ground floor, elevation, and cross-section details</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: My Uploaded Plans Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                My Submitted Plans <span className="text-slate-500 font-normal">({filteredDocuments.length})</span>
              </h2>
              <span className="text-[11px] text-slate-500">
                Click file to preview
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-xs">
              {['All', 'Architectural', 'Structural', 'Sanitary/Plumbing', 'Electrical'].map((discipline) => (
                <button
                  key={discipline}
                  type="button"
                  onClick={() => setDisciplineFilter(discipline)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap text-[11px] cursor-pointer ${
                    disciplineFilter === discipline
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {discipline}
                </button>
              ))}
            </div>

            {/* Document Table */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[11px]">
                    <th className="p-2.5 pl-3">Discipline & File</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5 pr-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {filteredDocuments.map((doc) => {
                    const isSelected = selectedDoc?.id === doc.id;

                    return (
                      <tr 
                        key={doc.id} 
                        onClick={() => handleSelectDocInTable(doc)}
                        className={`cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-blue-50/80 border-l-4 border-blue-600' 
                            : 'hover:bg-slate-50/70'
                        }`}
                      >
                        <td className="p-2.5 pl-3">
                          <div className="flex items-center space-x-2.5">
                            <div className={`w-7 h-7 rounded flex items-center justify-center font-bold text-[9px] text-white flex-shrink-0 shadow-2xs ${
                              doc.fileType === 'DWG' ? 'bg-indigo-900' : 'bg-rose-600'
                            }`}>
                              {doc.fileType}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-xs truncate max-w-[130px] sm:max-w-[160px]">{doc.fileName}</p>
                              <p className="text-[10px] text-slate-400">{doc.discipline} • {doc.size}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            doc.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : doc.status === 'Needs Revision'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : doc.status === 'Under Review'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="p-2.5 pr-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              type="button"
                              onClick={(e) => handleEyeClick(doc, e)}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-xs flex items-center space-x-1 font-bold text-[10px] cursor-pointer"
                              title="Inspect Plan"
                            >
                              <Eye size={12} />
                              <span>View</span>
                            </button>
                            
                            <button
                              type="button"
                              onClick={(e) => handleDownload(doc, e)}
                              className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-slate-200 bg-white cursor-pointer"
                              title="Download File"
                            >
                              <Download size={12} />
                            </button>

                            {doc.status !== 'Approved' && (
                              <button
                                type="button"
                                onClick={(e) => handleDelete(doc.id, e)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200 bg-white cursor-pointer"
                                title="Remove File"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Official Feedback Note for Citizen */}
            <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-xl space-y-1 text-xs">
              <div className="flex items-center space-x-1.5 text-blue-900 font-bold text-[11px]">
                <ShieldCheck size={14} className="text-blue-600" />
                <span>Office of the Building Official (OBO) Feedback</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-snug">
                "{selectedDoc.notes || 'Your submitted blueprint is under evaluation by the designated municipal building inspector.'}"
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Document Preview & Interactive Blueprint Viewer            */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-6" ref={previewCanvasRef}>
          
          {/* Card 1: Document Preview Canvas */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            
            {/* Header with Title & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
              <div className="flex items-center space-x-2">
                <Eye size={18} className="text-blue-600" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Blueprint Document Preview</h2>
                  <p className="text-[10px] text-slate-500 font-mono">Sheet A-1.01: Ground Floor Architectural Layout</p>
                </div>
              </div>

              {/* Controls: Pagination, Zoom, Rotate & Fullscreen */}
              <div className="flex items-center space-x-2 flex-wrap gap-1">
                {/* Page Selector */}
                <div className="flex items-center space-x-1.5 text-xs text-slate-600 bg-slate-100/80 px-2 py-1 rounded-lg">
                  <button 
                    type="button"
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1}
                    className="p-0.5 hover:text-slate-900 disabled:opacity-40 cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft size={13} />
                  </button>
                  <span className="font-semibold text-slate-800 text-[11px]">
                    Page {currentPage} of {selectedDoc?.totalPages || 8}
                  </span>
                  <button 
                    type="button"
                    onClick={handleNextPage}
                    disabled={currentPage >= (selectedDoc?.totalPages || 8)}
                    className="p-0.5 hover:text-slate-900 disabled:opacity-40 cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center space-x-1 text-xs text-slate-600 bg-slate-100/80 px-2 py-1 rounded-lg">
                  <button 
                    type="button"
                    onClick={handleZoomOut}
                    className="p-0.5 hover:text-slate-900 cursor-pointer"
                    title="Zoom Out"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="font-semibold text-slate-800 text-[11px] w-9 text-center font-mono">
                    {zoomLevel}%
                  </span>
                  <button 
                    type="button"
                    onClick={handleZoomIn}
                    className="p-0.5 hover:text-slate-900 cursor-pointer"
                    title="Zoom In"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Measurement Tool Button */}
                <button
                  type="button"
                  onClick={handleSimulateMeasure}
                  className={`p-1.5 rounded-lg transition-colors border text-xs font-semibold flex items-center space-x-1 cursor-pointer ${
                    isMeasuring
                      ? 'bg-indigo-600 text-white border-indigo-700'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                  title="Calibrated Measurement Tool"
                >
                  <Ruler size={13} />
                  <span className="text-[11px]">Ruler</span>
                </button>

                {/* Rotate Button */}
                <button
                  type="button"
                  onClick={handleRotate}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer"
                  title="Rotate 90°"
                >
                  <RotateCw size={13} />
                </button>

                {/* Expand / Open Inspector Button */}
                <button
                  type="button"
                  onClick={() => setIsInspectorOpen(true)}
                  className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors border border-blue-200 cursor-pointer"
                  title="Open Full Blueprint Inspector"
                >
                  <Maximize2 size={13} />
                </button>
              </div>
            </div>

            {/* Measurement Banner if active */}
            {measurementResult && (
              <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 font-semibold flex items-center justify-between animate-fadeIn">
                <div className="flex items-center space-x-2">
                  <Ruler size={15} className="text-indigo-600" />
                  <span>{measurementResult}</span>
                </div>
                <button 
                  onClick={() => setMeasurementResult(null)} 
                  className="text-indigo-500 hover:text-indigo-800 text-[11px] cursor-pointer font-bold"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Architectural Blueprint SVG Canvas */}
            <div 
              onClick={() => {
                setIsInspectorOpen(true);
                showToast(`Inspecting blueprint: ${selectedDoc.fileName}`);
              }}
              className="w-full bg-[#fdfdfd] border border-slate-300/80 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center min-h-[400px] overflow-hidden relative cursor-pointer group"
              title="Click anywhere to inspect in Full-Screen HD"
            >
              {/* Floating Hover Badge */}
              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-lg border border-slate-700">
                <Eye size={14} className="text-blue-400" />
                <span>Click to Inspect Fullscreen</span>
              </div>

              {/* Layer Floating Controller in Corner */}
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-xl p-2 shadow-sm text-[10px] space-y-1"
              >
                <p className="font-bold text-slate-700 flex items-center space-x-1">
                  <Layers size={11} className="text-blue-600" />
                  <span>Layer Controls</span>
                </p>
                <div className="flex items-center space-x-2">
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input type="checkbox" checked={layerDimensions} onChange={(e) => setLayerDimensions(e.target.checked)} className="w-3 h-3 text-blue-600 rounded" />
                    <span>Dims</span>
                  </label>
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input type="checkbox" checked={layerFurniture} onChange={(e) => setLayerFurniture(e.target.checked)} className="w-3 h-3 text-blue-600 rounded" />
                    <span>Rooms</span>
                  </label>
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input type="checkbox" checked={layerAdminApprovalStamp} onChange={(e) => setLayerAdminApprovalStamp(e.target.checked)} className="w-3 h-3 text-blue-600 rounded" />
                    <span className="text-emerald-700 font-bold">LGU Stamp</span>
                  </label>
                </div>
              </div>

              <div 
                className="w-full transition-all duration-300 flex items-center justify-center"
                style={{ 
                  transform: `scale(${zoomLevel / 100}) rotate(${rotationAngle}deg)`,
                  transformOrigin: 'center center'
                }}
              >
                {/* Clean Architectural Floor Plan Drawing */}
                <svg 
                  className="w-full max-w-[620px] text-slate-900 select-none" 
                  viewBox="0 0 600 420" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                >
                  {/* Outer Dimension Lines */}
                  {layerDimensions && (
                    <g stroke="#64748b" strokeWidth="0.8" fontSize="9" textAnchor="middle" fill="#475569">
                      <line x1="90" y1="25" x2="520" y2="25" />
                      <line x1="90" y1="20" x2="90" y2="30" />
                      <line x1="520" y1="20" x2="520" y2="30" />
                      <text x="305" y="20" stroke="none">17.20 M (TOTAL SPAN)</text>

                      <line x1="60" y1="50" x2="60" y2="370" />
                      <line x1="55" y1="50" x2="65" y2="50" />
                      <line x1="55" y1="370" x2="65" y2="370" />
                      <text x="48" y="210" stroke="none" transform="rotate(-90 48 210)">11.50 M</text>

                      <line x1="75" y1="50" x2="75" y2="190" />
                      <text x="70" y="120" stroke="none" transform="rotate(-90 70 120)">4.00</text>

                      <line x1="75" y1="190" x2="75" y2="280" />
                      <text x="70" y="235" stroke="none" transform="rotate(-90 70 235)">2.70</text>

                      <line x1="75" y1="280" x2="75" y2="370" />
                      <text x="70" y="325" stroke="none" transform="rotate(-90 70 325)">1.50</text>

                      <line x1="550" y1="50" x2="550" y2="190" />
                      <line x1="545" y1="50" x2="555" y2="50" />
                      <line x1="545" y1="190" x2="555" y2="190" />
                      <text x="560" y="120" stroke="none" transform="rotate(90 560 120)">4.00</text>

                      <line x1="550" y1="190" x2="550" y2="260" />
                      <line x1="545" y1="260" x2="555" y2="260" />
                      <text x="560" y="225" stroke="none" transform="rotate(90 560 225)">1.50</text>

                      <line x1="550" y1="260" x2="550" y2="370" />
                      <line x1="545" y1="370" x2="555" y2="370" />
                      <text x="560" y="315" stroke="none" transform="rotate(90 560 315)">3.20</text>
                    </g>
                  )}

                  {/* Main Building Outer Walls */}
                  {layerWalls && (
                    <>
                      <rect x="90" y="50" width="430" height="320" stroke="#0f172a" strokeWidth="3" fill="#ffffff" />
                      <line x1="90" y1="190" x2="520" y2="190" stroke="#1e293b" strokeWidth="2.2" />
                      <line x1="280" y1="50" x2="280" y2="190" stroke="#1e293b" strokeWidth="2.2" />
                      <line x1="420" y1="50" x2="420" y2="190" stroke="#1e293b" strokeWidth="2.2" />
                      <line x1="240" y1="190" x2="240" y2="370" stroke="#1e293b" strokeWidth="2.2" />
                      <line x1="390" y1="190" x2="390" y2="370" stroke="#1e293b" strokeWidth="2.2" />
                    </>
                  )}

                  {/* Doors */}
                  <path d="M 280 90 A 25 25 0 0 0 255 65" stroke="#64748b" strokeDasharray="2 2" />
                  <path d="M 240 230 A 25 25 0 0 1 265 255" stroke="#64748b" strokeDasharray="2 2" />
                  <path d="M 390 230 A 25 25 0 0 0 365 255" stroke="#64748b" strokeDasharray="2 2" />

                  {/* Room Text Labels */}
                  {layerFurniture && (
                    <g fontSize="8" fontWeight="bold" fill="#0f172a" textAnchor="middle">
                      <text x="185" y="120" stroke="none">LIVING AREA</text>
                      <text x="350" y="105" stroke="none">MASTER BEDROOM</text>
                      <text x="470" y="105" stroke="none">TERRACE</text>
                      <text x="165" y="270" stroke="none">KITCHEN & DINING</text>
                      <text x="315" y="285" stroke="none">BEDROOM 2</text>
                    </g>
                  )}

                  {/* Stairs */}
                  <g stroke="#94a3b8" strokeWidth="1">
                    <line x1="420" y1="270" x2="480" y2="270" />
                    <line x1="420" y1="285" x2="480" y2="285" />
                    <line x1="420" y1="300" x2="480" y2="300" />
                    <line x1="420" y1="315" x2="480" y2="315" />
                    <line x1="420" y1="330" x2="480" y2="330" />
                  </g>

                  {/* Professional Seal */}
                  {layerSeal && (
                    <g transform="translate(420, 310)">
                      <circle cx="35" cy="35" r="28" stroke="#2563eb" strokeWidth="1.2" strokeDasharray="3 1" fill="#eff6ff" />
                      <text x="35" y="30" fontSize="5" fontWeight="bold" fill="#1d4ed8" textAnchor="middle" stroke="none">LICENSED ENGR</text>
                      <text x="35" y="38" fontSize="4.5" fill="#1e40af" textAnchor="middle" stroke="none">PRC-0098412</text>
                      <text x="35" y="46" fontSize="4" fill="#60a5fa" textAnchor="middle" stroke="none">DIGITALLY SEALED</text>
                    </g>
                  )}

                  {/* OFFICIAL LGU APPROVAL STAMP (When Approved) */}
                  {layerAdminApprovalStamp && selectedDoc.isStamped && (
                    <g transform="translate(105, 65)">
                      <rect x="0" y="0" width="165" height="68" rx="8" stroke="#059669" strokeWidth="2" strokeDasharray="4 2" fill="#ecfdf5" fillOpacity="0.95" />
                      <text x="82" y="16" fontSize="7" fontWeight="900" fill="#047857" textAnchor="middle" stroke="none">REPUBLIC OF THE PHILIPPINES</text>
                      <text x="82" y="27" fontSize="7.5" fontWeight="900" fill="#065f46" textAnchor="middle" stroke="none">OFFICIAL LGU PLAN APPROVAL</text>
                      <line x1="10" y1="32" x2="155" y2="32" stroke="#10b981" strokeWidth="1" />
                      <text x="82" y="42" fontSize="5.5" fontWeight="bold" fill="#047857" textAnchor="middle" stroke="none">PASSED • PD 1096 SEC. 304</text>
                      <text x="82" y="51" fontSize="5" fill="#065f46" textAnchor="middle" stroke="none">Ref: {projectInfo.refNo} • {new Date().toLocaleDateString()}</text>
                      <text x="82" y="60" fontSize="4.5" fontStyle="italic" fill="#059669" textAnchor="middle" stroke="none">Office of the Building Official</text>
                    </g>
                  )}
                </svg>
              </div>
            </div>

            {/* Bottom Status Card inside Preview Box */}
            <div className="flex flex-wrap items-center justify-between p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-xl gap-3">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${selectedDoc.fileType === 'DWG' ? 'bg-indigo-900' : 'bg-rose-600'} text-white rounded-lg flex items-center justify-center font-bold text-[10px] shadow-2xs`}>
                  {selectedDoc.fileType}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{selectedDoc?.fileName}</h4>
                  <p className="text-[10px] text-slate-500">
                    Discipline: {selectedDoc?.discipline} • Size: {selectedDoc?.size} • PRC: {selectedDoc?.prcLicense}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] inline-block ${
                    selectedDoc.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : selectedDoc.status === 'Needs Revision'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {selectedDoc.status === 'Approved' ? '✓ Plan Approved & Stamped' : selectedDoc.status}
                  </span>
                  <p className="text-[9px] text-slate-400 mt-0.5">Scanned & Validated</p>
                </div>
                <CheckCircle2 size={18} className="text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Card 2: PRC License Validation & Permitting Tips for Citizen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50/50 border border-blue-200/80 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-blue-950 font-bold text-xs">
                <Award size={16} className="text-blue-600" />
                <span>PRC Professional Validation</span>
              </div>
              <p className="text-xs font-bold text-slate-800">{selectedDoc.author || 'Arch. Maria Elena Santos, UAP'}</p>
              <p className="text-[11px] text-slate-600 font-mono">License: {selectedDoc.prcLicense || 'PRC-0084721'}</p>
              <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                ✓ Valid & Verified in PRC Database
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
                <Lightbulb size={16} className="text-amber-500" />
                <span>Permit Applicant Reminders</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-600 list-disc pl-4 leading-relaxed">
                <li>Ensure all dimensions, setback lines, and labels are readable.</li>
                <li>Once all 4 disciplines pass OBO review, your permit fee will unlock.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULL BLUEPRINT INSPECTION & MEASUREMENT MODAL                             */}
      {/* ========================================================================= */}
      {isInspectorOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-blue-600/30 border border-blue-500/40 text-blue-400 rounded-xl">
                  <FileText size={22} />
                </div>
                <div>
                  <div className="flex items-center space-x-2 flex-wrap">
                    <h3 className="font-bold text-base text-white tracking-wide">{selectedDoc.fileName}</h3>
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded text-[10px] font-mono">
                      {selectedDoc.fileType}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded text-[10px] font-bold flex items-center space-x-1">
                      <CheckCircle2 size={11} className="text-emerald-400" />
                      <span>PRC Verified</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {selectedDoc.author || 'Licensed Engineer'} • {selectedDoc.prcLicense || 'PRC-0098412'} • Size: {selectedDoc.size}
                  </p>
                </div>
              </div>

              {/* Action Buttons in Header */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleDownload(selectedDoc)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Download size={14} />
                  <span className="hidden sm:inline">Download</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Printer size={14} />
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsInspectorOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Inspector Body */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-100">
              
              {/* Left Main Blueprint Canvas Area */}
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Canvas Toolbar */}
                <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setActiveTabInspection('blueprint')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                        activeTabInspection === 'blueprint'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Blueprint View
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTabInspection('compliance')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                        activeTabInspection === 'compliance'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Code Compliance Preview (PD 1096)
                    </button>
                  </div>

                  {/* Toolbar Controls */}
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={handleSimulateMeasure}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 border transition-colors cursor-pointer ${
                        isMeasuring
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                      title="Measure Distance on Canvas"
                    >
                      <Ruler size={14} />
                      <span className="hidden sm:inline">Measure</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRotate}
                      className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg cursor-pointer"
                      title="Rotate 90°"
                    >
                      <RotateCw size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={handleZoomOut}
                      className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg cursor-pointer"
                      title="Zoom Out"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-mono font-bold text-slate-700 text-xs px-1">
                      {zoomLevel}%
                    </span>
                    <button
                      type="button"
                      onClick={handleZoomIn}
                      className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg cursor-pointer"
                      title="Zoom In"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Main View Area */}
                <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-200/60 relative">
                  {isMeasuring && (
                    <div className="absolute top-4 left-4 z-20 bg-indigo-900/90 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-lg border border-indigo-500/40 flex items-center space-x-2">
                      <Ruler size={14} className="text-indigo-300 animate-pulse" />
                      <span>Ruler Active: Span = 4.25 meters</span>
                    </div>
                  )}

                  {activeTabInspection === 'blueprint' ? (
                    <div 
                      className="bg-white p-8 rounded-2xl shadow-xl border border-slate-300/80 transition-all duration-300 select-none max-w-3xl w-full"
                      style={{ 
                        transform: `scale(${zoomLevel / 100}) rotate(${rotationAngle}deg)`,
                        transformOrigin: 'center center'
                      }}
                    >
                      <svg 
                        className="w-full text-slate-900" 
                        viewBox="0 0 600 420" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="1.5"
                      >
                        {layerDimensions && (
                          <g stroke="#64748b" strokeWidth="0.8" fontSize="9" textAnchor="middle" fill="#475569">
                            <line x1="90" y1="25" x2="520" y2="25" />
                            <line x1="90" y1="20" x2="90" y2="30" />
                            <line x1="520" y1="20" x2="520" y2="30" />
                            <text x="305" y="20" stroke="none">17.20 M (TOTAL SPAN)</text>

                            <line x1="60" y1="50" x2="60" y2="370" />
                            <line x1="55" y1="50" x2="65" y2="50" />
                            <line x1="55" y1="370" x2="65" y2="370" />
                            <text x="48" y="210" stroke="none" transform="rotate(-90 48 210)">11.50 M</text>
                          </g>
                        )}

                        {layerWalls && (
                          <>
                            <rect x="90" y="50" width="430" height="320" stroke="#0f172a" strokeWidth="3.5" fill="#ffffff" />
                            <line x1="90" y1="190" x2="520" y2="190" stroke="#1e293b" strokeWidth="2.5" />
                            <line x1="280" y1="50" x2="280" y2="190" stroke="#1e293b" strokeWidth="2.5" />
                            <line x1="420" y1="50" x2="420" y2="190" stroke="#1e293b" strokeWidth="2.5" />
                            <line x1="240" y1="190" x2="240" y2="370" stroke="#1e293b" strokeWidth="2.5" />
                            <line x1="390" y1="190" x2="390" y2="370" stroke="#1e293b" strokeWidth="2.5" />
                          </>
                        )}

                        {layerFurniture && (
                          <g fontSize="9" fontWeight="bold" fill="#0f172a" textAnchor="middle">
                            <text x="185" y="115" stroke="none">LIVING AREA</text>
                            <text x="185" y="130" fontSize="7" fill="#64748b" stroke="none">AREA: 28.5 SQ.M</text>
                            
                            <text x="350" y="105" stroke="none">MASTER BEDROOM</text>
                            <text x="350" y="120" fontSize="7" fill="#64748b" stroke="none">AREA: 21.0 SQ.M</text>
                            
                            <text x="470" y="105" stroke="none">TERRACE</text>
                            <text x="165" y="270" stroke="none">KITCHEN & DINING</text>
                            <text x="315" y="285" stroke="none">BEDROOM 2</text>
                          </g>
                        )}

                        {layerSeal && (
                          <g transform="translate(420, 290)">
                            <circle cx="40" cy="40" r="32" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="4 1" fill="#eff6ff" />
                            <text x="40" y="32" fontSize="6" fontWeight="bold" fill="#1d4ed8" textAnchor="middle" stroke="none">GOVSERVE CERTIFIED</text>
                            <text x="40" y="42" fontSize="5" fill="#1e40af" textAnchor="middle" stroke="none">PRC NO. 0098412</text>
                            <text x="40" y="52" fontSize="4.5" fill="#60a5fa" textAnchor="middle" stroke="none">AUTHENTICATED</text>
                          </g>
                        )}

                        {layerAdminApprovalStamp && selectedDoc.isStamped && (
                          <g transform="translate(100, 65)">
                            <rect x="0" y="0" width="180" height="75" rx="10" stroke="#059669" strokeWidth="2.5" strokeDasharray="4 2" fill="#ecfdf5" fillOpacity="0.95" />
                            <text x="90" y="18" fontSize="7.5" fontWeight="900" fill="#047857" textAnchor="middle" stroke="none">REPUBLIC OF THE PHILIPPINES</text>
                            <text x="90" y="30" fontSize="8" fontWeight="900" fill="#065f46" textAnchor="middle" stroke="none">OFFICIAL LGU PLAN APPROVAL</text>
                            <line x1="12" y1="36" x2="168" y2="36" stroke="#10b981" strokeWidth="1.2" />
                            <text x="90" y="48" fontSize="6" fontWeight="bold" fill="#047857" textAnchor="middle" stroke="none">PASSED • PD 1096 SEC. 304</text>
                            <text x="90" y="58" fontSize="5.5" fill="#065f46" textAnchor="middle" stroke="none">Ref: {projectInfo.refNo} • {new Date().toLocaleDateString()}</text>
                            <text x="90" y="68" fontSize="5" fontStyle="italic" fill="#059669" textAnchor="middle" stroke="none">Office of the Building Official</text>
                          </g>
                        )}
                      </svg>
                    </div>
                  ) : (
                    /* Code Compliance Preview */
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full space-y-4 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center space-x-2">
                          <ShieldCheck size={20} className="text-emerald-600" />
                          <h4 className="font-extrabold text-slate-900 text-sm">National Building Code (PD 1096) Audit Status</h4>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200">
                          100% Compliant
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                          <p className="text-[10px] text-slate-500 font-semibold uppercase">Front Yard Setback</p>
                          <p className="font-bold text-slate-800 text-xs">3.50 m (Req: Min 3.00m)</p>
                          <span className="text-[10px] text-emerald-600 font-bold">✓ PASSED</span>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                          <p className="text-[10px] text-slate-500 font-semibold uppercase">Side & Rear Clearances</p>
                          <p className="font-bold text-slate-800 text-xs">2.20 m (Req: Min 2.00m)</p>
                          <span className="text-[10px] text-emerald-600 font-bold">✓ PASSED</span>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                          <p className="text-[10px] text-slate-500 font-semibold uppercase">Floor Area Ratio (FAR)</p>
                          <p className="font-bold text-slate-800 text-xs">1.85 / Max 2.50</p>
                          <span className="text-[10px] text-emerald-600 font-bold">✓ PASSED</span>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                          <p className="text-[10px] text-slate-500 font-semibold uppercase">Emergency Egress</p>
                          <p className="font-bold text-slate-800 text-xs">1.40 m Corridor Width</p>
                          <span className="text-[10px] text-emerald-600 font-bold">✓ PASSED</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar: Layer Controls & Metadata */}
              <div className="w-full lg:w-72 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 p-5 space-y-5 overflow-y-auto">
                {/* Layer Visibility */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                    <Layers size={16} className="text-blue-600" />
                    <h4 className="font-bold text-slate-900 text-xs">Layer Visibility</h4>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                      <span className="text-slate-700 font-medium">Walls & Structures</span>
                      <input 
                        type="checkbox" 
                        checked={layerWalls} 
                        onChange={(e) => setLayerWalls(e.target.checked)} 
                        className="rounded text-blue-600" 
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                      <span className="text-slate-700 font-medium">Dimension Lines</span>
                      <input 
                        type="checkbox" 
                        checked={layerDimensions} 
                        onChange={(e) => setLayerDimensions(e.target.checked)} 
                        className="rounded text-blue-600" 
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                      <span className="text-slate-700 font-medium">Room Names & Tags</span>
                      <input 
                        type="checkbox" 
                        checked={layerFurniture} 
                        onChange={(e) => setLayerFurniture(e.target.checked)} 
                        className="rounded text-blue-600" 
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                      <span className="text-slate-700 font-medium">Digital PRC Seal</span>
                      <input 
                        type="checkbox" 
                        checked={layerSeal} 
                        onChange={(e) => setLayerSeal(e.target.checked)} 
                        className="rounded text-blue-600" 
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 hover:bg-emerald-50/50 rounded-lg cursor-pointer">
                      <span className="text-emerald-800 font-bold">LGU Approval Stamp</span>
                      <input 
                        type="checkbox" 
                        checked={layerAdminApprovalStamp} 
                        onChange={(e) => setLayerAdminApprovalStamp(e.target.checked)} 
                        className="rounded text-emerald-600" 
                      />
                    </label>
                  </div>
                </div>

                {/* Professional Sign-off */}
                <div className="p-3.5 bg-blue-50/60 border border-blue-200/80 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center space-x-1.5 text-blue-900 font-bold">
                    <Award size={16} className="text-blue-600" />
                    <span>Certified Professional</span>
                  </div>
                  <p className="font-bold text-slate-800">{selectedDoc.author || 'Engr. Roberto M. Santos'}</p>
                  <p className="text-[11px] text-slate-600 font-mono">License: {selectedDoc.prcLicense || 'PRC-0098412'}</p>
                  <p className="text-[10px] text-emerald-700 font-semibold">✓ Verified Active in PRC Database</p>
                </div>

                {/* Page Jump */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-slate-800">Quick Page Jump</span>
                  <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setCurrentPage(p)}
                        className={`p-2 rounded-xl font-bold transition-colors cursor-pointer ${
                          currentPage === p
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        P. {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs flex-wrap gap-2">
              <span className="text-slate-500 font-medium">
                Blueprint Viewer • {selectedDoc.fileName} ({projectInfo.projectName})
              </span>
              <button
                type="button"
                onClick={() => setIsInspectorOpen(false)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
