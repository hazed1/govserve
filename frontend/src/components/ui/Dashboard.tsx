import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  TrendingDown, 
  LucideIcon, 
  Plus, 
  Zap, 
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  Eye,
  RefreshCw,
  BarChart2,
  PieChart,
  Layers,
  X,
  ChevronRight,
  User,
  Building,
  Building2,
  Calendar,
  DollarSign,
  Send,
  Check,
  CheckCircle,
  FileCheck,
  ShieldCheck,
  Info,
  Download,
  Bot,
  Bus,
  HardHat,
  Landmark,
  Shield,
  QrCode,
  AlertTriangle,
  FileSpreadsheet,
  RotateCcw,
  SlidersHorizontal,
  ExternalLink,
  ChevronDown,
  ArrowUpRight
} from 'lucide-react';
import { ApplicationItem, TabType } from '../../types';
import { AISettingsModal } from './AISettingsModal';

interface DashboardProps {
  onViewDetails: (id: string) => void;
  applications: ApplicationItem[];
  totalCount: number;
  forEvaluationCount: number;
  forApprovalCount: number;
  approvedCount: number;
  rejectedCount: number;
  onSimulateNewApplication: (data?: Partial<ApplicationItem>) => void;
  onApproveApplication?: (id: string) => void;
  onRejectApplication?: (id: string, reason?: string) => void;
  onUpdateStatus?: (id: string, status: string, remarks?: string) => void;
  onNavigateToTab?: (tab: TabType) => void;
}

interface StatCard {
  id: string;
  label: string;
  val: number;
  change: string;
  up: boolean;
  icon: LucideIcon;
  color: string;
  boxColor: string;
  badgeBg: string;
  filterValue: string;
}

// Helper: Catmull-Rom to Cubic Bezier curve generator for SVG
function generateSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  
  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    
    path += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return path;
}

function generateAreaPath(points: { x: number; y: number }[], baselineY: number = 135): string {
  if (points.length === 0) return '';
  const linePath = generateSmoothPath(points);
  const firstX = points[0].x;
  const lastX = points[points.length - 1].x;
  return `${linePath} L ${lastX},${baselineY} L ${firstX},${baselineY} Z`;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onViewDetails,
  applications,
  totalCount,
  forEvaluationCount,
  forApprovalCount,
  approvedCount,
  rejectedCount,
  onSimulateNewApplication,
  onApproveApplication,
  onRejectApplication,
  onUpdateStatus,
  onNavigateToTab
}) => {
  const [latestAppId, setLatestAppId] = useState<string | null>(null);
  const [showAISettingsModal, setShowAISettingsModal] = useState<boolean>(false);

  // ==========================================
  // UNIFIED CONNECTED FILTER STATES
  // ==========================================
  const [selectedStatFilter, setSelectedStatFilter] = useState<string>('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('All');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [chartPeriod, setChartPeriod] = useState<'6m' | 'q1' | 'q2' | 'year'>('6m');
  const [chartMetricView, setChartMetricView] = useState<'all' | 'approved' | 'pending'>('all');

  // Interactivity hover feedback states
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const [hoveredAppId, setHoveredAppId] = useState<string | null>(null);

  // AI & Risk Intelligence States
  const [selectedConfidenceCategory, setSelectedConfidenceCategory] = useState<string>('Approve');
  const [activeRiskSubsystem, setActiveRiskSubsystem] = useState<string | null>(null);

  // Modal States
  const [activeModalApp, setActiveModalApp] = useState<ApplicationItem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'requirements' | 'inspection' | 'timeline'>('overview');
  const [showSimulateModal, setShowSimulateModal] = useState<boolean>(false);
  const [rejectModalApp, setRejectModalApp] = useState<ApplicationItem | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('Incomplete locational sketch and expired Barangay clearance.');
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Simulation Form State
  const [simApplicant, setSimApplicant] = useState('');
  const [simBusiness, setSimBusiness] = useState('');
  const [simType, setSimType] = useState('Business Permit');
  const [simAddress, setSimAddress] = useState('');
  const [simContact, setSimContact] = useState('');
  const [simAppType, setSimAppType] = useState<'New' | 'Renewal'>('New');
  const [simDocuments, setSimDocuments] = useState<string[]>([
    'DTI / SEC Registration Certificate',
    'Barangay Business Clearance',
    'Locational & Zoning Clearance',
    'Fire Safety Inspection Certificate (FSIC)'
  ]);

  // Dynamic aggregates
  const computedTotal = applications.length;
  const computedForEval = applications.filter(a => a.status === 'For Evaluation' || a.status === 'In Progress' || a.status === 'Under Review').length;
  const computedForAppr = applications.filter(a => a.status === 'For Approval' || a.status === 'For Inspection').length;
  const computedApproved = applications.filter(a => a.status === 'Approved').length;
  const computedRejected = applications.filter(a => a.status === 'Rejected').length;

  const displayTotal = totalCount || computedTotal;
  const displayEval = forEvaluationCount || computedForEval;
  const displayAppr = forApprovalCount || computedForAppr;
  const displayApproved = approvedCount || computedApproved;
  const displayRejected = rejectedCount || computedRejected;

  // Has any active filter
  const hasActiveFilters = selectedStatFilter !== 'All' || selectedTypeFilter !== 'All' || selectedMonthFilter !== null || searchQuery.trim() !== '';

  const handleResetAllFilters = () => {
    setSelectedStatFilter('All');
    setSelectedTypeFilter('All');
    setSelectedMonthFilter(null);
    setSearchQuery('');
  };

  // ==========================================
  // 1. FILTERED RECENT APPLICATIONS (BIDIRECTIONAL)
  // ==========================================
  const filteredRecentApplications = useMemo(() => {
    return applications.filter(app => {
      // 1. Status Filter
      const matchesStat = 
        selectedStatFilter === 'All' ? true :
        selectedStatFilter === 'For Evaluation' ? (app.status === 'For Evaluation' || app.status === 'In Progress' || app.status === 'Under Review') :
        selectedStatFilter === 'For Approval' ? (app.status === 'For Approval' || app.status === 'For Inspection') :
        selectedStatFilter === 'Approved' ? app.status === 'Approved' :
        selectedStatFilter === 'Rejected' ? app.status === 'Rejected' : true;

      // 2. Type / Category Filter
      const matchesType =
        selectedTypeFilter === 'All' ? true :
        selectedTypeFilter === 'Business' ? (app.type?.includes('Business') || app.id.startsWith('BP') || app.category === 'business') :
        selectedTypeFilter === 'Building' ? (app.type?.includes('Building') || app.id.startsWith('BC') || app.category === 'building') :
        selectedTypeFilter === 'Franchise' ? (app.type?.includes('Franchise') || app.id.startsWith('FT') || app.category === 'transport') :
        selectedTypeFilter === 'Barangay' ? (app.type?.includes('Barangay') || app.id.startsWith('BR') || app.category === 'barangay') : true;

      // 3. Month Filter
      const matchesMonth =
        !selectedMonthFilter || selectedMonthFilter === 'All' ? true :
        (app.date && app.date.toLowerCase().includes(selectedMonthFilter.toLowerCase())) ||
        (app.createdAt && new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short' }).toLowerCase() === selectedMonthFilter.toLowerCase());

      // 4. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        app.applicant.toLowerCase().includes(q) ||
        app.id.toLowerCase().includes(q) ||
        app.status.toLowerCase().includes(q) ||
        (app.businessName && app.businessName.toLowerCase().includes(q)) ||
        (app.type && app.type.toLowerCase().includes(q)) ||
        (app.category && app.category.toLowerCase().includes(q)) ||
        (app.address && app.address.toLowerCase().includes(q));

      return matchesStat && matchesType && matchesMonth && matchesSearch;
    });
  }, [applications, selectedStatFilter, selectedTypeFilter, selectedMonthFilter, searchQuery]);

  // ==========================================
  // 2. APPLICATIONS BY TYPE (DONUT & BREAKDOWN)
  // ==========================================
  const categoryStats = useMemo(() => {
    // Base pool of applications filtered by currently selected status and month
    const pool = applications.filter(app => {
      const matchesStat = 
        selectedStatFilter === 'All' ? true :
        selectedStatFilter === 'For Evaluation' ? (app.status === 'For Evaluation' || app.status === 'In Progress' || app.status === 'Under Review') :
        selectedStatFilter === 'For Approval' ? (app.status === 'For Approval' || app.status === 'For Inspection') :
        selectedStatFilter === 'Approved' ? app.status === 'Approved' :
        selectedStatFilter === 'Rejected' ? app.status === 'Rejected' : true;

      const matchesMonth =
        !selectedMonthFilter || selectedMonthFilter === 'All' ? true :
        (app.date && app.date.toLowerCase().includes(selectedMonthFilter.toLowerCase())) ||
        (app.createdAt && new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short' }).toLowerCase() === selectedMonthFilter.toLowerCase());

      return matchesStat && matchesMonth;
    });

    const countBusiness = pool.filter(a => a.type?.includes('Business') || a.id.startsWith('BP') || a.category === 'business').length;
    const countBuilding = pool.filter(a => a.type?.includes('Building') || a.id.startsWith('BC') || a.category === 'building').length;
    const countFranchise = pool.filter(a => a.type?.includes('Franchise') || a.id.startsWith('FT') || a.category === 'transport').length;
    const countBarangay = pool.filter(a => a.type?.includes('Barangay') || a.id.startsWith('BR') || a.category === 'barangay').length;

    const rawCategories = [
      { 
        type: 'Business', 
        label: 'Business Permits', 
        rawCount: countBusiness, 
        color: 'bg-blue-500', 
        textColor: 'text-blue-500', 
        strokeColor: '#3b82f6', 
        gradId: 'pie-grad-business',
        icon: Building2, 
        desc: 'Retail, Dining & Enterprise' 
      },
      { 
        type: 'Building', 
        label: 'Building & Civil', 
        rawCount: countBuilding, 
        color: 'bg-amber-500', 
        textColor: 'text-amber-500', 
        strokeColor: '#f59e0b', 
        gradId: 'pie-grad-building',
        icon: HardHat, 
        desc: 'Construction & Structural' 
      },
      { 
        type: 'Franchise', 
        label: 'Franchise & MTOP', 
        rawCount: countFranchise, 
        color: 'bg-emerald-500', 
        textColor: 'text-emerald-500', 
        strokeColor: '#10b981', 
        gradId: 'pie-grad-franchise',
        icon: Bus, 
        desc: 'Public Transport & Fleet' 
      },
      { 
        type: 'Barangay', 
        label: 'Barangay Clearances', 
        rawCount: countBarangay, 
        color: 'bg-cyan-500', 
        textColor: 'text-cyan-500', 
        strokeColor: '#06b6d4', 
        gradId: 'pie-grad-barangay',
        icon: Landmark, 
        desc: 'Local Community Units' 
      },
    ];

    const sumRaw = countBusiness + countBuilding + countFranchise + countBarangay;
    const targetTotal = displayTotal > 0 ? displayTotal : (sumRaw || 1);

    // Calculate exact count allocations proportionally summing to targetTotal
    let allocatedSum = 0;
    const categoriesWithCount = rawCategories.map((cat, idx) => {
      let count = 0;
      if (sumRaw > 0) {
        count = Math.round((cat.rawCount / sumRaw) * targetTotal);
      } else {
        const defaultRatios = [0.35, 0.25, 0.20, 0.20];
        count = Math.round(defaultRatios[idx] * targetTotal);
      }
      allocatedSum += count;
      return { ...cat, count };
    });

    // Reconcile any rounding difference so sum strictly equals targetTotal
    const diff = targetTotal - allocatedSum;
    if (diff !== 0 && categoriesWithCount.length > 0) {
      const highest = categoriesWithCount.reduce((prev, curr) => (curr.count > prev.count ? curr : prev), categoriesWithCount[0]);
      highest.count += diff;
    }

    const totalCountComputed = categoriesWithCount.reduce((sum, c) => sum + c.count, 0) || 1;
    const radius = 52;
    const C = 2 * Math.PI * radius; // ≈ 326.7256

    const activeCount = categoriesWithCount.filter(c => c.count > 0).length;
    const gap = activeCount > 1 ? 3.5 : 0;

    let accumulatedOffset = 0;
    return categoriesWithCount.map(cat => {
      const rawRatio = totalCountComputed > 0 ? (cat.count / totalCountComputed) : 0;
      const percent = Math.round(rawRatio * 100);
      const arcLength = rawRatio * C;
      const segmentLength = Math.max(0, arcLength - gap);
      const strokeDashoffset = -accumulatedOffset;
      accumulatedOffset += arcLength;

      return {
        ...cat,
        percent,
        arcLength,
        segmentLength,
        strokeDashoffset,
        circumference: C,
        radius
      };
    });
  }, [applications, selectedStatFilter, selectedMonthFilter, displayTotal]);

  // Active Category Details for Donut Center
  const activeCategoryDetail = useMemo(() => {
    const targetType = hoveredCategory || (selectedTypeFilter !== 'All' ? selectedTypeFilter : null);
    if (!targetType) return null;
    return categoryStats.find(c => c.type === targetType) || null;
  }, [hoveredCategory, selectedTypeFilter, categoryStats]);

  // ==========================================
  // 3. APPLICATIONS OVERVIEW (MONTHLY TIMELINE)
  // ==========================================
  const monthlyData = useMemo(() => {
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    if (chartPeriod === 'q1') months = ['Jan', 'Feb', 'Mar'];
    if (chartPeriod === 'q2') months = ['Apr', 'May', 'Jun'];
    if (chartPeriod === 'year') months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const weights: Record<string, { totalPct: number; apprRate: number }> = {
      Jan: { totalPct: 0.13, apprRate: 0.72 },
      Feb: { totalPct: 0.17, apprRate: 0.76 },
      Mar: { totalPct: 0.28, apprRate: 0.82 },
      Apr: { totalPct: 0.22, apprRate: 0.79 },
      May: { totalPct: 0.35, apprRate: 0.86 },
      Jun: { totalPct: 0.40, apprRate: 0.89 },
      Jul: { totalPct: 0.25, apprRate: 0.82 },
      Aug: { totalPct: 0.21, apprRate: 0.80 },
      Sep: { totalPct: 0.26, apprRate: 0.83 },
      Oct: { totalPct: 0.28, apprRate: 0.85 },
      Nov: { totalPct: 0.31, apprRate: 0.87 },
      Dec: { totalPct: 0.38, apprRate: 0.90 }
    };

    let baseTotal = displayTotal;
    let baseApproved = displayApproved;

    // Adapt to type filter
    if (selectedTypeFilter !== 'All') {
      const cat = categoryStats.find(c => c.type === selectedTypeFilter);
      if (cat) {
        baseTotal = cat.count;
        baseApproved = Math.round(cat.count * 0.78);
      }
    }

    // Adapt to status filter
    if (selectedStatFilter !== 'All') {
      if (selectedStatFilter === 'Approved') baseTotal = displayApproved;
      else if (selectedStatFilter === 'For Evaluation') baseTotal = displayEval;
      else if (selectedStatFilter === 'For Approval') baseTotal = displayAppr;
      else if (selectedStatFilter === 'Rejected') baseTotal = displayRejected;
    }

    return months.map(m => {
      const w = weights[m] || { totalPct: 0.2, apprRate: 0.8 };
      const realAppsInMonth = applications.filter(a => {
        const matchesMonth = (a.date && a.date.toLowerCase().includes(m.toLowerCase())) ||
          (a.createdAt && new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short' }).toLowerCase() === m.toLowerCase());
        const matchesType = selectedTypeFilter === 'All' ? true :
          selectedTypeFilter === 'Business' ? (a.type?.includes('Business') || a.id.startsWith('BP')) :
          selectedTypeFilter === 'Building' ? (a.type?.includes('Building') || a.id.startsWith('BC')) :
          selectedTypeFilter === 'Franchise' ? (a.type?.includes('Franchise') || a.id.startsWith('FT')) :
          selectedTypeFilter === 'Barangay' ? (a.type?.includes('Barangay') || a.id.startsWith('BR')) : true;
        return matchesMonth && matchesType;
      });

      const realApprovedInMonth = realAppsInMonth.filter(a => a.status === 'Approved');

      const totalVal = Math.max(realAppsInMonth.length, Math.round(baseTotal * (w.totalPct / (months.length * 0.18))));
      const approvedVal = Math.max(realApprovedInMonth.length, Math.round(totalVal * w.apprRate));
      const pendingVal = Math.max(0, totalVal - approvedVal);

      return {
        month: m,
        total: totalVal,
        approved: approvedVal,
        pending: pendingVal,
        realCount: realAppsInMonth.length,
        approvalRate: Math.round((approvedVal / (totalVal || 1)) * 100)
      };
    });
  }, [chartPeriod, displayTotal, displayApproved, displayEval, displayAppr, displayRejected, selectedTypeFilter, selectedStatFilter, applications, categoryStats]);

  // Chart Coordinate Calculations for SVG
  const chartWidth = 400;
  const chartHeight = 150;
  const chartPaddingX = 30;
  const chartPaddingTop = 20;
  const chartBaselineY = 130;

  const maxChartVal = useMemo(() => {
    const maxVal = Math.max(...monthlyData.map(d => d.total), 10);
    return maxVal * 1.15;
  }, [monthlyData]);

  const totalPoints = useMemo(() => {
    return monthlyData.map((d, idx) => {
      const step = (chartWidth - chartPaddingX * 2) / (monthlyData.length - 1 || 1);
      const x = chartPaddingX + idx * step;
      const y = chartBaselineY - (d.total / maxChartVal) * (chartBaselineY - chartPaddingTop);
      return { x, y, data: d };
    });
  }, [monthlyData, maxChartVal]);

  const approvedPoints = useMemo(() => {
    return monthlyData.map((d, idx) => {
      const step = (chartWidth - chartPaddingX * 2) / (monthlyData.length - 1 || 1);
      const x = chartPaddingX + idx * step;
      const y = chartBaselineY - (d.approved / maxChartVal) * (chartBaselineY - chartPaddingTop);
      return { x, y, data: d };
    });
  }, [monthlyData, maxChartVal]);

  const totalPathString = useMemo(() => generateSmoothPath(totalPoints), [totalPoints]);
  const totalAreaPathString = useMemo(() => generateAreaPath(totalPoints, chartBaselineY), [totalPoints]);
  const approvedPathString = useMemo(() => generateSmoothPath(approvedPoints), [approvedPoints]);
  const approvedAreaPathString = useMemo(() => generateAreaPath(approvedPoints, chartBaselineY), [approvedPoints]);

  // Active Month Data for Tooltip & Detail Banner
  const activeMonthData = useMemo(() => {
    const target = hoveredMonth || selectedMonthFilter;
    if (!target) return null;
    return monthlyData.find(m => m.month.toLowerCase() === target.toLowerCase()) || null;
  }, [hoveredMonth, selectedMonthFilter, monthlyData]);

  // ==========================================
  // 4. STAT CARDS BAR
  // ==========================================
  const statCards: StatCard[] = [
    { 
      id: 'All', 
      label: 'Total Applications', 
      val: displayTotal, 
      change: '+12%', 
      up: true, 
      icon: FileText, 
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400', 
      boxColor: 'bg-blue-600/10 border-blue-500/20', 
      badgeBg: 'bg-blue-600',
      filterValue: 'All'
    },
    { 
      id: 'For Evaluation', 
      label: 'For Evaluation', 
      val: displayEval, 
      change: '+8%', 
      up: true, 
      icon: Clock, 
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400', 
      boxColor: 'bg-amber-600/10 border-amber-500/20', 
      badgeBg: 'bg-amber-500',
      filterValue: 'For Evaluation'
    },
    { 
      id: 'For Approval', 
      label: 'For Approval', 
      val: displayAppr, 
      change: '-5%', 
      up: false, 
      icon: FileText, 
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400', 
      boxColor: 'bg-indigo-600/10 border-indigo-500/20', 
      badgeBg: 'bg-indigo-600',
      filterValue: 'For Approval'
    },
    { 
      id: 'Approved', 
      label: 'Approved Permits', 
      val: displayApproved, 
      change: '+15%', 
      up: true, 
      icon: CheckCircle2, 
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400', 
      boxColor: 'bg-emerald-600/10 border-emerald-500/20', 
      badgeBg: 'bg-emerald-600',
      filterValue: 'Approved'
    },
    { 
      id: 'Rejected', 
      label: 'Deficiencies / Rejected', 
      val: displayRejected, 
      change: '-2%', 
      up: false, 
      icon: XCircle, 
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400', 
      boxColor: 'bg-rose-600/10 border-rose-500/20', 
      badgeBg: 'bg-rose-600',
      filterValue: 'Rejected'
    },
  ];

  // ==========================================
  // EXPORT CSV HANDLER
  // ==========================================
  const handleExportReport = () => {
    const dataToExport = filteredRecentApplications.length > 0 ? filteredRecentApplications : applications;
    
    const headers = [
      "Application Number",
      "Applicant Name",
      "Business Name",
      "Permit Type",
      "Category",
      "Status",
      "Date Submitted",
      "Assessment Fee (PHP)",
      "Assigned Officer",
      "Inspection Status",
      "Review Date"
    ];

    const rows = dataToExport.map(a => [
      `"${a.id}"`,
      `"${a.applicant || 'Citizen Applicant'}"`,
      `"${a.businessName || a.applicant || 'N/A'}"`,
      `"${a.type || 'Business Permit'}"`,
      `"${a.category || 'business'}"`,
      `"${a.status}"`,
      `"${a.date || 'May 20, 2025'}"`,
      `"${a.assessmentFee ? a.assessmentFee.toFixed(2) : '3,450.00'}"`,
      `"${a.assignedOfficer || 'LGU Permitting Officer'}"`,
      `"${a.inspectionStatus || (a.status === 'Approved' ? 'Passed' : 'Pending')}"`,
      `"${new Date().toLocaleDateString('en-US')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GovServe_Permits_Ledger_${selectedTypeFilter !== 'All' ? selectedTypeFilter + '_' : ''}${selectedStatFilter !== 'All' ? selectedStatFilter.replace(/\s+/g, '_') + '_' : ''}${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setExportSuccess(true);
    setToastMsg(`Ledger exported (${dataToExport.length} records) to CSV!`);
    setTimeout(() => {
      setExportSuccess(false);
      setToastMsg(null);
    }, 3500);
  };

  // Quick Preset for Simulate Modal
  const handleAutoFillSimulation = () => {
    const sampleBusinesses = [
      { name: 'Apex Logistics & Freight Hub', applicant: 'Roberto M. Tan', type: 'Franchise Permit', addr: 'Block 12 Lot 5 Industrial Valley, Laguna', contact: '+63 917 882 1923' },
      { name: 'Starlight Commercial Bakery & Cafe', applicant: 'Elena C. Bautista', type: 'Business Permit', addr: '74 Rizal Ave, Barangay San Isidro', contact: '+63 920 445 9912' },
      { name: '4-Storey Mixed-Use Commercial Complex', applicant: 'Solid Rock Construction Corp.', type: 'Building Permit', addr: 'Highway Corner Emerald St, San Antonio', contact: '+63 918 333 4455' },
      { name: 'San Isidro Community Trading Enterprise', applicant: 'Juan Dela Cruz Jr.', type: 'Barangay Clearance', addr: 'Zone 3, Barangay Poblacion', contact: '+63 915 777 8899' }
    ];
    const pick = sampleBusinesses[Math.floor(Math.random() * sampleBusinesses.length)];
    setSimApplicant(pick.applicant);
    setSimBusiness(pick.name);
    setSimType(pick.type);
    setSimAddress(pick.addr);
    setSimContact(pick.contact);
    setSimAppType('New');
  };

  // Submit Simulated Application
  const handleSubmitSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simApplicant.trim()) return;

    const applicant = simApplicant.trim();
    const businessName = simBusiness.trim() || `${applicant} Enterprise`;
    const permitType = simType;
    const address = simAddress.trim() || 'Poblacion Business District, Laguna';
    const contact = simContact.trim() || '+63 917 000 1234';

    const category: 'business' | 'building' | 'transport' | 'barangay' | 'inspection' = 
      permitType.includes('Building') ? 'building' :
      permitType.includes('Franchise') || permitType.includes('Transport') ? 'transport' :
      permitType.includes('Barangay') ? 'barangay' :
      permitType.includes('Inspection') ? 'inspection' : 'business';

    onSimulateNewApplication({
      applicant,
      businessName,
      type: permitType,
      category,
      address,
      contact,
      status: 'For Evaluation',
      statusColor: 'text-amber-600 bg-amber-50 border border-amber-200',
      assessmentFee: permitType.includes('Building') ? 8500 : permitType.includes('Franchise') ? 1500 : 3450.00,
      assignedOfficer: 'LGU Licensing Officer',
      requirements: simDocuments.map(d => ({ name: d, status: 'Pending' }))
    });

    setShowSimulateModal(false);
    setSimApplicant('');
    setSimBusiness('');
    setSimAddress('');
    setSimContact('');
    setToastMsg(`🎉 Application submitted for ${businessName}! Status set to 'For Evaluation'.`);
    setTimeout(() => setToastMsg(null), 5000);
  };

  // Trigger pulse highlight when applications array updates
  useEffect(() => {
    if (applications.length > 0) {
      setLatestAppId(applications[0].id);
      const timer = setTimeout(() => setLatestAppId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [applications]);

  // Helper for category badge styling in table
  const getCategoryBadge = (type: string = '', cat?: string) => {
    if (type.includes('Business') || cat === 'business') {
      return { label: 'Business', icon: Building2, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800' };
    }
    if (type.includes('Building') || cat === 'building') {
      return { label: 'Building', icon: HardHat, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
    }
    if (type.includes('Franchise') || cat === 'transport') {
      return { label: 'Franchise', icon: Bus, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
    }
    return { label: 'Barangay', icon: Landmark, color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800' };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="p-3.5 bg-blue-600 text-white text-xs font-bold rounded-2xl shadow-xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <Sparkles size={16} />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-white hover:opacity-75 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Realtime Action Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md flex-shrink-0">
            <Zap size={22} />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
                LGU Executive Permitting & Regulatory Console
              </h3>
              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center shadow-2xs">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping mr-1.5" /> LIVE SYNC
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Executive overview, AI compliance engines, and automated permit issuance for LGU Licensing Officers.
            </p>
          </div>
        </div>

      </div>



      {/* 5 Interactive Stat Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((m) => {
          const Icon = m.icon;
          const isSelected = selectedStatFilter === m.filterValue;

          return (
            <div 
              key={m.id} 
              onClick={() => setSelectedStatFilter(isSelected && m.filterValue !== 'All' ? 'All' : m.filterValue)}
              className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border transition-all cursor-pointer shadow-xs hover:shadow-md relative overflow-hidden group ${
                isSelected 
                  ? 'border-blue-600 ring-2 ring-blue-500/30 scale-[1.02] shadow-md' 
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{m.label}</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
                    {m.val.toLocaleString()}
                  </h3>
                  <p className={`text-[11px] flex items-center mt-2 font-semibold ${m.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                    {m.up ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                    {m.change}
                    <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">from last month</span>
                  </p>
                </div>
                <div className={`p-2.5 rounded-xl ${m.color} shadow-xs group-hover:scale-110 transition-transform`}>
                  <Icon size={20} />
                </div>
              </div>

              {isSelected && m.filterValue !== 'All' && (
                <div className="mt-2.5 pt-2 border-t border-blue-100 dark:border-blue-900 flex items-center justify-between text-[10px] text-blue-700 dark:text-blue-300 font-bold">
                  <span className="flex items-center"><Check size={12} className="mr-1" /> Filter Active</span>
                  <span className="hover:underline">Reset ✕</span>
                </div>
              )}
            </div>
          );
        })}
      </div>


      {/* ========================================================================= */}
      {/* MAIN 3-CARD CONNECTED TRIAD */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ======================================================================= */}
        {/* CARD 1: APPLICATIONS OVERVIEW (CONNECTED SPLINE CHART) */}
        {/* ======================================================================= */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 relative">
          
          {/* Card Header & Period Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Applications Overview</h4>
                {selectedTypeFilter !== 'All' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-md">
                    {selectedTypeFilter}
                  </span>
                )}
                {selectedMonthFilter && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-md">
                    {selectedMonthFilter} Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                Real-time monthly trend monitor (Click a month to filter table)
              </p>
            </div>
            
            <div className="flex items-center space-x-1.5 text-xs">
              {(['6m', 'q1', 'q2', 'year'] as const).map((period) => (
                <button 
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer uppercase ${
                    chartPeriod === period 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {period === '6m' ? '6 Months' : period === 'year' ? '1 Year' : period}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Legend & Metric Filter */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
            <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
              <button 
                onClick={() => setChartMetricView('all')}
                className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                  chartMetricView === 'all' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold' : 'hover:opacity-75'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Total Applications</span>
              </button>

              <button 
                onClick={() => setChartMetricView(chartMetricView === 'approved' ? 'all' : 'approved')}
                className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                  chartMetricView === 'approved' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold' : 'hover:opacity-75'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Approved Permits</span>
              </button>
            </div>

            {selectedMonthFilter && (
              <button 
                onClick={() => setSelectedMonthFilter(null)}
                className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer flex items-center space-x-1"
              >
                <RotateCcw size={11} />
                <span>Show All Months</span>
              </button>
            )}
          </div>

          {/* Interactive SVG Chart Canvas with Gradient Fill */}
          <div className="h-48 w-full relative pt-2 select-none">
            <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
              <defs>
                <linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="gradient-green" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={chartPaddingX} y1="30" x2={chartWidth - chartPaddingX} y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" className="dark:stroke-slate-800" />
              <line x1={chartPaddingX} y1="65" x2={chartWidth - chartPaddingX} y2="65" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" className="dark:stroke-slate-800" />
              <line x1={chartPaddingX} y1="100" x2={chartWidth - chartPaddingX} y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" className="dark:stroke-slate-800" />
              <line x1={chartPaddingX} y1={chartBaselineY} x2={chartWidth - chartPaddingX} y2={chartBaselineY} stroke="#e2e8f0" strokeWidth="1" className="dark:stroke-slate-700" />

              {/* Vertical Guide when month is selected or hovered */}
              {totalPoints.map(pt => {
                const isSelected = selectedMonthFilter?.toLowerCase() === pt.data.month.toLowerCase();
                const isHovered = hoveredMonth?.toLowerCase() === pt.data.month.toLowerCase();
                if (!isSelected && !isHovered) return null;

                return (
                  <line 
                    key={`guide-${pt.data.month}`}
                    x1={pt.x} 
                    y1={chartPaddingTop} 
                    x2={pt.x} 
                    y2={chartBaselineY} 
                    stroke={isSelected ? "#3b82f6" : "#94a3b8"} 
                    strokeWidth={isSelected ? 2 : 1}
                    strokeDasharray={isSelected ? "none" : "2 2"}
                    className="transition-all opacity-80"
                  />
                );
              })}

              {/* Area Fills */}
              {(chartMetricView === 'all' || chartMetricView === 'approved') && (
                <path d={approvedAreaPathString} fill="url(#gradient-green)" className="transition-all duration-500" />
              )}
              {chartMetricView === 'all' && (
                <path d={totalAreaPathString} fill="url(#gradient-blue)" className="transition-all duration-500" />
              )}

              {/* Spline Lines */}
              {(chartMetricView === 'all' || chartMetricView === 'approved') && (
                <path 
                  d={approvedPathString} 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  className="transition-all duration-500 drop-shadow-xs"
                />
              )}
              {chartMetricView === 'all' && (
                <path 
                  d={totalPathString} 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                  className="transition-all duration-500 drop-shadow-xs"
                />
              )}

              {/* Interactive Data Point Handles */}
              {totalPoints.map((pt) => {
                const isSelected = selectedMonthFilter?.toLowerCase() === pt.data.month.toLowerCase();
                const isHovered = hoveredMonth?.toLowerCase() === pt.data.month.toLowerCase();
                const appPoint = approvedPoints.find(a => a.data.month === pt.data.month);

                return (
                  <g key={`pt-${pt.data.month}`}>
                    {/* Approved Point */}
                    {appPoint && (chartMetricView === 'all' || chartMetricView === 'approved') && (
                      <circle
                        cx={appPoint.x}
                        cy={appPoint.y}
                        r={isSelected || isHovered ? 6 : 3.5}
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="cursor-pointer transition-all hover:scale-125 drop-shadow-xs"
                        onMouseEnter={() => setHoveredMonth(pt.data.month)}
                        onMouseLeave={() => setHoveredMonth(null)}
                        onClick={() => setSelectedMonthFilter(isSelected ? null : pt.data.month)}
                      />
                    )}

                    {/* Total Point */}
                    {chartMetricView === 'all' && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected || isHovered ? 7 : 4.5}
                        fill="#3b82f6"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="cursor-pointer transition-all hover:scale-125 drop-shadow-xs"
                        onMouseEnter={() => setHoveredMonth(pt.data.month)}
                        onMouseLeave={() => setHoveredMonth(null)}
                        onClick={() => setSelectedMonthFilter(isSelected ? null : pt.data.month)}
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Rich Hover / Active Month Tooltip */}
            {activeMonthData && (
              <div className="absolute top-1 right-2 bg-slate-900/95 dark:bg-slate-950/95 text-white p-3 rounded-xl shadow-xl text-[11px] space-y-1.5 animate-in fade-in z-20 border border-slate-700/80 backdrop-blur-sm min-w-[170px]">
                <div className="flex items-center justify-between border-b border-slate-700 pb-1 font-bold">
                  <span className="text-blue-400">{activeMonthData.month} 2025</span>
                  <span className="text-[10px] text-emerald-400">{activeMonthData.approvalRate}% Approved</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Total Filed:</span>
                  <span className="font-mono font-bold text-white">{activeMonthData.total}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-emerald-400">Approved Permits:</span>
                  <span className="font-mono font-bold text-emerald-400">{activeMonthData.approved}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-amber-400">In Pipeline:</span>
                  <span className="font-mono font-bold text-amber-400">{activeMonthData.pending}</span>
                </div>
                <div className="pt-1 border-t border-slate-800 text-[9px] text-slate-400 italic text-center">
                  {selectedMonthFilter === activeMonthData.month ? '✓ Filtering Active' : 'Click to filter recent list'}
                </div>
              </div>
            )}
          </div>

          {/* Month Column Selectors */}
          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold pt-2 border-t border-slate-100 dark:border-slate-800">
            {monthlyData.map((m) => {
              const isSelected = selectedMonthFilter?.toLowerCase() === m.month.toLowerCase();
              const isHovered = hoveredMonth?.toLowerCase() === m.month.toLowerCase();

              return (
                <button 
                  key={m.month}
                  onClick={() => setSelectedMonthFilter(isSelected ? null : m.month)}
                  onMouseEnter={() => setHoveredMonth(m.month)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  className={`px-2 py-1 rounded-lg cursor-pointer transition-all font-bold ${
                    isSelected 
                      ? 'bg-blue-600 text-white shadow-xs scale-105' 
                      : isHovered 
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60' 
                      : 'hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {m.month}
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================================= */}
        {/* CARD 2: APPLICATIONS BY TYPE (INTERACTIVE DONUT & BREAKDOWN) */}
        {/* ======================================================================= */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 relative">
          
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Applications by Type</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Live regulatory distribution</p>
            </div>
            {selectedTypeFilter !== 'All' && (
              <button 
                onClick={() => setSelectedTypeFilter('All')} 
                className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer flex items-center space-x-0.5"
              >
                <RotateCcw size={11} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Donut Chart Visual */}
          <div className="relative flex items-center justify-center py-2">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
              <defs>
                <linearGradient id="pie-grad-business" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <linearGradient id="pie-grad-building" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
                <linearGradient id="pie-grad-franchise" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
                <linearGradient id="pie-grad-barangay" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>

              {/* Background Track */}
              <circle 
                cx="80" 
                cy="80" 
                r="52" 
                stroke="#e2e8f0" 
                strokeWidth="14" 
                fill="transparent" 
                className="dark:stroke-slate-800" 
              />
              
              {/* Dynamic Slices */}
              {categoryStats.map((cat) => {
                const isSelected = selectedTypeFilter === cat.type;
                const isHovered = hoveredCategory === cat.type;
                const isAnyActive = hoveredCategory !== null || selectedTypeFilter !== 'All';
                const isDimmed = isAnyActive && !isSelected && !isHovered;

                return (
                  <circle 
                    key={cat.type} 
                    cx="80" 
                    cy="80" 
                    r="52" 
                    stroke={`url(#${cat.gradId})`} 
                    strokeWidth={isSelected || isHovered ? 18 : 14}
                    strokeDasharray={`${cat.segmentLength} ${cat.circumference - cat.segmentLength}`}
                    strokeDashoffset={cat.strokeDashoffset}
                    fill="transparent"
                    strokeLinecap="butt"
                    className={`cursor-pointer transition-all duration-300 ${
                      isDimmed ? 'opacity-35' : 'opacity-100'
                    }`}
                    style={{
                      transformOrigin: '80px 80px',
                      filter: (isSelected || isHovered) ? 'drop-shadow(0 0 6px rgba(0,0,0,0.3))' : 'none'
                    }}
                    onClick={() => setSelectedTypeFilter(selectedTypeFilter === cat.type ? 'All' : cat.type)}
                    onMouseEnter={() => setHoveredCategory(cat.type)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                );
              })}
            </svg>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                {activeCategoryDetail ? activeCategoryDetail.type : 'Total Permits'}
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                {activeCategoryDetail ? `${activeCategoryDetail.percent}%` : displayTotal.toLocaleString()}
              </span>
              <span className="text-[9px] text-slate-500 font-medium">
                {activeCategoryDetail ? `${activeCategoryDetail.count.toLocaleString()} permits` : 'All Categories'}
              </span>
            </div>
          </div>

          {/* Interactive Legend List */}
          <div className="space-y-1.5 pt-1 text-xs">
            {categoryStats.map((cat) => {
              const isSelected = selectedTypeFilter === cat.type;
              const isHovered = hoveredCategory === cat.type;

              return (
                <div 
                  key={cat.type}
                  onClick={() => setSelectedTypeFilter(isSelected ? 'All' : cat.type)}
                  onMouseEnter={() => setHoveredCategory(cat.type)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`flex justify-between items-center p-2 rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 font-bold text-blue-700 dark:text-blue-300 shadow-2xs' 
                      : isHovered 
                      ? 'bg-slate-100 dark:bg-slate-800 scale-[1.01]' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className={`w-3 h-3 rounded-full ${cat.color} flex-shrink-0 shadow-xs ring-2 ring-white dark:ring-slate-900`} />
                    <div className="truncate">
                      <p className="font-bold truncate text-[11px]">{cat.type}</p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate">{cat.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span className="font-mono text-[11px] text-slate-400 dark:text-slate-400">({cat.count.toLocaleString()})</span>
                    <span className="font-black text-slate-900 dark:text-white min-w-[32px] text-right">{cat.percent}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AI RECOMMENDATION SUMMARY & RISK LEVEL INTELLIGENCE CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: AI Recommendation Summary */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs">AI Recommendation Summary</h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Algorithmic Assessment</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 transition-all duration-500"
                  strokeDasharray="92, 100"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">92%</span>
              </div>
            </div>

            <div className="space-y-1 text-right">
              <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full text-[10px] font-bold">
                {selectedConfidenceCategory}
              </span>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Confidence Score</p>
            </div>
          </div>

          <div className="space-y-1.5 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
            <div 
              onClick={() => setSelectedConfidenceCategory('Approve')}
              className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition-colors ${
                selectedConfidenceCategory === 'Approve' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 font-bold text-slate-900 dark:text-white' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Approve</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">92%</span>
            </div>

            <div 
              onClick={() => setSelectedConfidenceCategory('Reject')}
              className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition-colors ${
                selectedConfidenceCategory === 'Reject' 
                  ? 'bg-rose-50 dark:bg-rose-950/50 font-bold text-slate-900 dark:text-white' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Reject</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">5%</span>
            </div>

            <div 
              onClick={() => setSelectedConfidenceCategory('Needs Review')}
              className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition-colors ${
                selectedConfidenceCategory === 'Needs Review' 
                  ? 'bg-amber-50 dark:bg-amber-950/50 font-bold text-slate-900 dark:text-white' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Needs Review</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">3%</span>
            </div>
          </div>
        </div>

        {/* Card 2: Risk Level */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400">
              Risk Level
            </h3>
            {activeRiskSubsystem && (
              <button 
                onClick={() => setActiveRiskSubsystem(null)} 
                className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <ShieldCheck size={20} className="text-emerald-500" />
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">Low Risk</span>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            {/* Compliance Risk Bar */}
            <div 
              onClick={() => setActiveRiskSubsystem(activeRiskSubsystem === 'compliance' ? null : 'compliance')}
              className="space-y-1 cursor-pointer group p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400">
                <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 font-semibold">Compliance Risk</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Low (0.15)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: '15%' }} />
              </div>
            </div>

            {/* Document Risk Bar */}
            <div 
              onClick={() => setActiveRiskSubsystem(activeRiskSubsystem === 'document' ? null : 'document')}
              className="space-y-1 cursor-pointer group p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400">
                <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 font-semibold">Document Risk</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Low (0.18)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: '18%' }} />
              </div>
            </div>

            {/* Business Risk Bar */}
            <div 
              onClick={() => setActiveRiskSubsystem(activeRiskSubsystem === 'business' ? null : 'business')}
              className="space-y-1 cursor-pointer group p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400">
                <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 font-semibold">Business Risk</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Low (0.22)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: '22%' }} />
              </div>
            </div>

            {/* Interactive Subsystem Detail Drawer */}
            {activeRiskSubsystem && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-[10px] space-y-1 text-emerald-950 dark:text-emerald-200 animate-in fade-in">
                <p className="font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  {activeRiskSubsystem} Risk Sub-factors
                </p>
                <p>✓ Negative Watchlist: 0.0 (Clean)</p>
                <p>✓ Tax Delinquency: 0.0 (No Arrears)</p>
                <p>✓ OCR Quality Score: 98.6% (Passed)</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SIMULATE INCOMING APPLICATION MODAL FORM */}
      {/* ========================================================================= */}
      {showSimulateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 text-xs">
            <div className="p-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Plus size={20} className="text-blue-200" />
                <div>
                  <h3 className="font-extrabold text-sm">Simulate Incoming Application</h3>
                  <p className="text-[11px] text-blue-200">Create a real application record for LGU permit evaluation</p>
                </div>
              </div>
              <button onClick={() => setShowSimulateModal(false)} className="text-blue-200 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitSimulation} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-950/50 p-2.5 rounded-xl border border-blue-200 dark:border-blue-900">
                <span className="text-[11px] text-blue-700 dark:text-blue-300 font-semibold">Need test data quickly?</span>
                <button
                  type="button"
                  onClick={handleAutoFillSimulation}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold shadow-xs transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <RotateCcw size={11} />
                  <span>Auto-Fill Sample Data</span>
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Applicant Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Maria Santos"
                  value={simApplicant}
                  onChange={(e) => setSimApplicant(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Business / Entity Name</label>
                <input
                  type="text"
                  placeholder="e.g. ABC Trading & Commercial Enterprise"
                  value={simBusiness}
                  onChange={(e) => setSimBusiness(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Permit Type</label>
                  <select
                    value={simType}
                    onChange={(e) => setSimType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
                  >
                    <option value="Business Permit">Business Permit</option>
                    <option value="Building Permit">Building Permit</option>
                    <option value="Franchise Permit">Franchise & Transport Permit</option>
                    <option value="Barangay Clearance">Barangay Clearance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Filing Category</label>
                  <select
                    value={simAppType}
                    onChange={(e) => setSimAppType(e.target.value as 'New' | 'Renewal')}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
                  >
                    <option value="New">New Application</option>
                    <option value="Renewal">Renewal Permit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Business Address</label>
                <input
                  type="text"
                  placeholder="e.g. Block 4 Lot 10, Poblacion, San Isidro, Laguna"
                  value={simAddress}
                  onChange={(e) => setSimAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Number</label>
                <input
                  type="tel"
                  placeholder="+63 917 123 4567"
                  value={simContact}
                  onChange={(e) => setSimContact(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Attached Requirements</label>
                <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  {simDocuments.map((doc, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-[11px] text-slate-700 dark:text-slate-300">
                      <CheckCircle2 size={13} className="text-blue-500 flex-shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSimulateModal(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md cursor-pointer flex items-center space-x-2"
                >
                  <Plus size={15} />
                  <span>Create Application Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* COMPREHENSIVE APPLICATION DETAIL & WORKFLOW MODAL */}
      {/* ========================================================================= */}
      {activeModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 text-xs">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
                  <FileCheck size={22} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-sm tracking-wide">{activeModalApp.id}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${activeModalApp.statusColor}`}>
                      {activeModalApp.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{activeModalApp.type || 'Business Permit'}</p>
                </div>
              </div>
              <button onClick={() => setActiveModalApp(null)} className="text-slate-400 hover:text-white cursor-pointer p-1">
                <X size={20} />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-5 pt-2 gap-2 text-xs font-bold">
              {[
                { id: 'overview', label: 'Application Info' },
                { id: 'requirements', label: 'Document Checklist' },
                { id: 'inspection', label: 'Inspection & Fees' },
                { id: 'timeline', label: 'Audit Timeline' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveModalTab(t.id as any)}
                  className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
                    activeModalTab === t.id
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="p-6 space-y-4 max-h-[55vh] overflow-y-auto">
              {activeModalTab === 'overview' && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Registered Entity</p>
                      <p className="font-extrabold text-slate-900 dark:text-white text-sm mt-0.5">
                        {activeModalApp.businessName || activeModalApp.applicant}
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">Owner / Authorized: {activeModalApp.applicant}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Assessment Fee</p>
                      <p className="font-extrabold text-blue-700 dark:text-blue-300 text-sm mt-0.5">
                        PHP {activeModalApp.assessmentFee ? activeModalApp.assessmentFee.toLocaleString() : '3,450.00'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase">Submission Date</p>
                      <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{activeModalApp.date || 'May 20, 2025'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase">Assigned Office / LGU</p>
                      <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">BPLO • San Isidro, Laguna</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase">Business Location</p>
                      <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{activeModalApp.address || 'Poblacion District, Laguna'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase">Contact Information</p>
                      <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 font-mono">{activeModalApp.contact || '+63 917 555 0192'}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeModalTab === 'requirements' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Mandatory LGU Clearances</span>
                    <button 
                      onClick={() => onNavigateToTab?.('AI Document Verification')}
                      className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer flex items-center space-x-1"
                    >
                      <Bot size={13} />
                      <span>Run AI OCR Scanner →</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: 'DTI / SEC Registration Certificate', status: 'Verified', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                      { name: 'Barangay Business Clearance (2025)', status: 'Verified', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                      { name: 'Locational & Zoning Compliance Certificate', status: 'Verified', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                      { name: 'Fire Safety Inspection Certificate (FSIC)', status: 'Pending Review', color: 'text-amber-600 bg-amber-50 border-amber-200' }
                    ].map((doc, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText size={16} className="text-slate-400" />
                          <span className="font-medium text-slate-800 dark:text-slate-200">{doc.name}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${doc.color}`}>
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeModalTab === 'inspection' && (
                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700 dark:text-slate-300">On-Site Inspection Status</span>
                      <span className="text-emerald-600 font-bold">Scheduled ✓</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Inspector: Engr. Ronald C. Santos (City Engineering / BFP)</p>
                    <p className="text-[11px] text-slate-500">Scheduled Date: Friday, 10:00 AM</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Statutory Tax & Regulatory Breakdown</span>
                    <div className="text-[11px] space-y-1 pt-1 text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between"><span>Mayor's Permit Fee</span><span className="font-mono">PHP 1,500.00</span></div>
                      <div className="flex justify-between"><span>Sanitary & Health Inspection</span><span className="font-mono">PHP 650.00</span></div>
                      <div className="flex justify-between"><span>Garbage & Environmental Clearance</span><span className="font-mono">PHP 800.00</span></div>
                      <div className="flex justify-between"><span>Signboard & Electrical Assessment</span><span className="font-mono">PHP 500.00</span></div>
                      <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                        <span>Total Payable Assessment</span>
                        <span className="font-mono text-blue-600 dark:text-blue-400">PHP 3,450.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeModalTab === 'timeline' && (
                <div className="space-y-3">
                  {[
                    { title: 'Application Filed', time: 'May 20, 2025 • 09:30 AM', actor: 'Citizen Portal', desc: 'Application received and indexed in database.' },
                    { title: 'AI OCR Document Analysis', time: 'May 20, 2025 • 09:32 AM', actor: 'AI Engine', desc: 'Confidence score: 98.4% — No discrepancies detected.' },
                    { title: 'Fee Assessment Computed', time: 'May 20, 2025 • 10:15 AM', actor: 'BPLO Officer', desc: 'Assessed at PHP 3,450.00 standard schedule.' }
                  ].map((evt, idx) => (
                    <div key={idx} className="flex items-start space-x-3 pb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{evt.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{evt.time} • by {evt.actor}</p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{evt.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Workflow Action Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 justify-between items-center">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    const appId = activeModalApp.id;
                    setActiveModalApp(null);
                    onViewDetails(appId);
                  }}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>Open Full Workspace</span>
                  <ChevronRight size={14} />
                </button>

                {activeModalApp.status !== 'Approved' && onApproveApplication && (
                  <button
                    onClick={() => {
                      onApproveApplication(activeModalApp.id);
                      setActiveModalApp(null);
                    }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <CheckCircle2 size={14} />
                    <span>Approve Permit</span>
                  </button>
                )}

                {activeModalApp.status !== 'Rejected' && onRejectApplication && (
                  <button
                    onClick={() => {
                      setRejectModalApp(activeModalApp);
                      setActiveModalApp(null);
                    }}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <XCircle size={14} />
                    <span>Reject / Issue Deficiencies</span>
                  </button>
                )}

                {activeModalApp.status === 'Approved' && (
                  <button
                    onClick={() => {
                      setActiveModalApp(null);
                      onNavigateToTab?.('Permit Generation');
                    }}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <QrCode size={14} />
                    <span>Generate Digital Permit & QR</span>
                  </button>
                )}
              </div>

              <button 
                onClick={() => setActiveModalApp(null)} 
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REJECTION & NOTICE OF DEFICIENCIES MODAL */}
      {/* ========================================================================= */}
      {rejectModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 text-xs">
            <div className="p-5 bg-rose-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <XCircle size={20} />
                <div>
                  <h3 className="font-extrabold text-sm">Issue Notice of Deficiencies / Rejection</h3>
                  <p className="text-[11px] text-rose-100">{rejectModalApp.id} • {rejectModalApp.applicant}</p>
                </div>
              </div>
              <button onClick={() => setRejectModalApp(null)} className="text-white hover:text-rose-200 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Select Preset Reason / Deficiency Category
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    'Incomplete locational sketch and expired Barangay clearance.',
                    'Zoning clearance non-compliance (R-1 Low Density Zone conflict).',
                    'Failure of physical roadworthiness & emission inspection test.',
                    'Discrepancy in declared gross revenue and BIR ITR submission.',
                    'Structural & Architectural blueprint seal not authenticated by PECE/CE.'
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setRejectReason(preset)}
                      className={`text-left p-2.5 rounded-xl border text-[11px] font-medium transition-colors cursor-pointer ${
                        rejectReason === preset 
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Licensing Officer Notes & Citizen Rectification Instructions
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Provide specific instructions for the applicant to rectify and resubmit..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
              <button
                onClick={() => setRejectModalApp(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-xl font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onRejectApplication) {
                    onRejectApplication(rejectModalApp.id, rejectReason);
                  }
                  setRejectModalApp(null);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-md cursor-pointer flex items-center space-x-1.5"
              >
                <XCircle size={14} />
                <span>Confirm Rejection & Dispatch Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};