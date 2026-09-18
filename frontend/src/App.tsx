import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/ui/Sidebar';
import { Header } from './components/ui/Header';
import { Dashboard } from './components/ui/Dashboard';
import { CitizenDashboard } from './components/ui/CitizenDashboard';
import { CitizenPermitPortal } from './components/ui/CitizenPermitPortal';
import { BusinessPermitModule } from './components/BusinessPermitModule';
import { BusinessRegistrationWizard } from './components/BusinessRegistrationWizard';
import { RequirementsSubmission } from './components/RequirementsSubmission';
import { AIDocumentVerification } from './components/AIDocumentVerification';
import { FeeAssessmentComputation } from './components/FeeAssessmentComputation';
import { IntelligentApprovalDashboard } from './components/IntelligentApprovalDashboard';
import { PermitGeneration } from './components/PermitGeneration';
import { BuildingPermitFiling } from './components/BuildingPermitFiling';
import { PlanAndBlueprintUpload } from './components/PlanAndBlueprintUpload';
import { InspectionScheduling } from './components/InspectionScheduling';
import { LoginPage } from './components/auth/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { 
  BusinessRenewView, 
  BuildingPlanView, 
  PermitTrackerView
} from './components/ui/SubmoduleViews';
import { TabType, ApplicationItem, UserRole, NotificationItem } from './types';
import { Zap, CheckCircle2 } from 'lucide-react';
import { AIChatWidget } from './components/ui/AIChatWidget';
import { FranchiseTransportPermitModule } from './components/FranchiseTransportPermitModule';
import { RouteUnitInspectionModule } from './components/RouteUnitInspectionModule';
import { BarangayPermitIntegration } from './components/BarangayPermitIntegration';
import { EPermitTrackerModule } from './components/EPermitTrackerModule';
import { AIComplianceChecking } from './components/AIComplianceChecking';
import { PublicLandingPage } from './components/PublicLandingPage';
import { 
  fetchApplications, 
  fetchApplicationStats, 
  createApplication, 
  updateApplicationStatus, 
  deleteApplication,
  CreateApplicationPayload 
} from './lib/api';

function GovServePortal() {
  const { isAuthenticated, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>('Home');
  const [selectedPermitId, setSelectedPermitId] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [authView, setAuthView] = useState<'login' | 'landing'>('landing');
  const [loginInitialRole, setLoginInitialRole] = useState<UserRole>('user');

  // Reset to landing page when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setAuthView('landing');
    }
  }, [isAuthenticated]);

  // Default active tab based on user role when logging in / signing up
  useEffect(() => {
    if (user?.role === 'admin') {
      setActiveTab('Home');
    } else {
      setActiveTab('E-Permit Portal');
    }
  }, [user?.role]);

  // Role Protection: Guard against regular users accessing strictly admin-only internal tools
  const adminOnlyTabRedirectMap: Partial<Record<TabType, TabType>> = {
    'AI Document Verification': 'Requirements Submission',
    'Intelligent Approval Recommendation': 'My Applications',
    'Permit Approval & Release': 'E-Permit Tracker',
    'AI Compliance Checking': 'Business Registration (New / Renewal)',
    'Building Permit Reviews': 'Building Permit Filing',
    'Automated Document Verification (OCR)': 'Building Permit Filing',
    'Route & Unit Inspection Audit': 'Franchise & Transport Permits',
    'Franchise Permit Review': 'Franchise & Transport Permits',
    'Barangay Clearance Registry': 'Barangay Permit Integration',
    '24-Barangay Network Grid': 'Barangay Permit Integration',
    '24-Barangay Clearance Network': 'Barangay Permit Integration',
    'Barangay Integration Review': 'Barangay Permit Integration',
    'AI Clearance Audit': 'E-Permit Tracker',
    'QR Cryptographic Verification': 'E-Permit Tracker',
  };

  useEffect(() => {
    if (user?.role === 'user' && adminOnlyTabRedirectMap[activeTab]) {
      setActiveTab(adminOnlyTabRedirectMap[activeTab] || 'Home');
    }
  }, [user?.role, activeTab]);

  const APPLICATIONS_STORAGE_KEY = 'govserve_applications_registry_v1';
  const STATS_STORAGE_KEY = 'govserve_applications_stats_v1';
  const NOTIFICATIONS_STORAGE_KEY = 'govserve_notifications_registry_v1';

  const DEFAULT_APPLICATIONS: ApplicationItem[] = [
    { 
      id: 'BP-2025-00045', 
      applicant: 'ABC Trading', 
      businessName: 'ABC Trading & General Merchandise',
      type: 'Business Permit', 
      category: 'business',
      status: 'For Evaluation', 
      statusColor: 'text-amber-600 bg-amber-50 border border-amber-200', 
      date: 'May 20, 2025',
      address: 'Block 4 Lot 10, Poblacion, Laguna',
      contact: '+63 917 111 2222',
      assessmentFee: 3450.00,
      assignedOfficer: 'LGU Licensing Officer'
    },
    { 
      id: 'BP-2025-00044', 
      applicant: 'XYZ Store', 
      businessName: 'XYZ Retail & Mini-Mart',
      type: 'Business Permit', 
      category: 'business',
      status: 'For Approval', 
      statusColor: 'text-blue-600 bg-blue-50 border border-blue-200', 
      date: 'May 19, 2025',
      address: '22 Rizal St, San Isidro, Laguna',
      contact: '+63 918 333 4444',
      assessmentFee: 2800.00,
      assignedOfficer: 'LGU Licensing Officer'
    },
    { 
      id: 'BC-2025-00125', 
      applicant: '2-Storey House', 
      businessName: 'Engr. D. Ramos (Owner)',
      type: 'Building Permit', 
      category: 'building',
      status: 'For Inspection', 
      statusColor: 'text-blue-600 bg-blue-50 border border-blue-200', 
      date: 'May 18, 2025',
      address: 'Emerald Hills Subd, Laguna',
      contact: '+63 920 555 6666',
      assessmentFee: 8500.00,
      assignedOfficer: 'City Engineering Officer'
    },
    { 
      id: 'FT-2025-00078', 
      applicant: 'XYZ Transport Co.', 
      businessName: 'XYZ Express Transport Operators',
      type: 'Franchise Permit', 
      category: 'transport',
      status: 'For Approval', 
      statusColor: 'text-blue-600 bg-blue-50 border border-blue-200', 
      date: 'May 17, 2025',
      address: 'National Highway Terminal, Laguna',
      contact: '+63 917 777 8888',
      assessmentFee: 1500.00,
      assignedOfficer: 'MTOP Officer'
    },
    { 
      id: 'BR-2025-00033', 
      applicant: 'Juan Dela Cruz', 
      businessName: 'Dela Cruz Trading',
      type: 'Barangay Clearance', 
      category: 'barangay',
      status: 'Approved', 
      statusColor: 'text-emerald-600 bg-emerald-50 border border-emerald-200', 
      date: 'May 16, 2025',
      address: 'Zone 2, Barangay Poblacion',
      contact: '+63 919 999 0000',
      assessmentFee: 500.00,
      assignedOfficer: 'Barangay Licensing Officer'
    },
  ];

  const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
    {
      id: 'notif-1',
      title: 'New Permit Application',
      message: 'BP-2025-00045 (ABC Trading) submitted for Business Permit evaluation.',
      time: '5m ago',
      type: 'info',
      read: false,
      applicationId: 'BP-2025-00045',
      targetTab: 'Home'
    },
    {
      id: 'notif-2',
      title: 'On-Site Inspection Scheduled',
      message: 'Inspection for Building Permit BC-2025-00125 set for Friday 10:00 AM.',
      time: '25m ago',
      type: 'warning',
      read: false,
      applicationId: 'BC-2025-00125',
      targetTab: 'Inspection Scheduling'
    },
    {
      id: 'notif-3',
      title: 'Official Permit Approved',
      message: 'Barangay Clearance BR-2025-00033 approved. Digital QR Permit generated.',
      time: '1h ago',
      type: 'success',
      read: true,
      applicationId: 'BR-2025-00033',
      targetTab: 'Permit Generation'
    }
  ];

  // Applications List (PostgreSQL backend connected + localStorage fallback)
  const [applications, setApplications] = useState<ApplicationItem[]>(() => {
    try {
      const saved = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_APPLICATIONS;
  });

  // Notifications List
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_NOTIFICATIONS;
  });

  // Stats Counters
  const [totalCount, setTotalCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) return JSON.parse(saved).totalCount || 1248;
    } catch {}
    return 1248;
  });
  const [forEvaluationCount, setForEvaluationCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) return JSON.parse(saved).forEvaluationCount || 312;
    } catch {}
    return 312;
  });
  const [forApprovalCount, setForApprovalCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) return JSON.parse(saved).forApprovalCount || 125;
    } catch {}
    return 125;
  });
  const [approvedCount, setApprovedCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) return JSON.parse(saved).approvedCount || 780;
    } catch {}
    return 780;
  });
  const [rejectedCount, setRejectedCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) return JSON.parse(saved).rejectedCount || 31;
    } catch {}
    return 31;
  });

  // Fetch applications & stats from PostgreSQL Database API
  const loadDatabaseData = async () => {
    try {
      const [dbApps, dbStats] = await Promise.all([
        fetchApplications(),
        fetchApplicationStats()
      ]);

      if (dbApps && dbApps.length > 0) {
        setApplications(dbApps);
      }
      if (dbStats) {
        setTotalCount(dbStats.totalCount);
        setForEvaluationCount(dbStats.forEvaluationCount);
        setForApprovalCount(dbStats.forApprovalCount);
        setApprovedCount(dbStats.approvedCount);
        setRejectedCount(dbStats.rejectedCount);
      }
    } catch (e) {
      console.warn('Sync with PostgreSQL backend failed:', e);
    }
  };

  // Initial load & periodic polling (every 4 seconds) for live multi-user sync
  useEffect(() => {
    loadDatabaseData();
    const interval = setInterval(loadDatabaseData, 4000);
    return () => clearInterval(interval);
  }, []);

  // Persist applications, stats, & notifications to localStorage as secondary cache
  useEffect(() => {
    try {
      localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(applications));
    } catch (e) {
      console.error('Failed to persist applications to localStorage', e);
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to persist notifications to localStorage', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify({
        totalCount,
        forEvaluationCount,
        forApprovalCount,
        approvedCount,
        rejectedCount
      }));
    } catch (e) {
      console.error('Failed to persist stats to localStorage', e);
    }
  }, [totalCount, forEvaluationCount, forApprovalCount, approvedCount, rejectedCount]);

  // Notification Handlers
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleSelectNotification = (notif: NotificationItem) => {
    if (notif.targetTab) {
      setActiveTab(notif.targetTab);
    }
    if (notif.applicationId) {
      setSelectedPermitId(notif.applicationId);
    }
  };

  const handleAddNewApplication = async (
    applicantOrData: string | Partial<ApplicationItem>, 
    permitTypeParam: string = 'Business Permit',
    extraDetails?: Partial<CreateApplicationPayload>
  ) => {
    const isObject = typeof applicantOrData === 'object' && applicantOrData !== null;
    const applicantName = isObject ? (applicantOrData.applicant || user?.name || 'Citizen Applicant') : (applicantOrData || user?.name || 'Citizen Applicant');
    const businessName = isObject ? (applicantOrData.businessName || applicantName) : (applicantName);
    const permitType = isObject ? (applicantOrData.type || permitTypeParam) : permitTypeParam;
    const address = isObject ? (applicantOrData.address || 'Poblacion District, Laguna') : 'Poblacion District, Laguna';
    const contact = isObject ? (applicantOrData.contact || '+63 917 000 0000') : '+63 917 000 0000';

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const prefix = permitType.includes('Building') ? 'BC' : 
                   permitType.includes('Franchise') || permitType.includes('Transport') || permitType.includes('MTOP') ? 'FT' : 
                   permitType.includes('Barangay') || permitType.includes('Cedula') ? 'BR' : 
                   permitType.includes('Inspection') ? 'IN' : 'BP';
    const newId = `${prefix}-${new Date().getFullYear()}-${randomNum}`;

    const category: 'business' | 'building' | 'transport' | 'barangay' | 'inspection' = 
      permitType.includes('Building') ? 'building' :
      permitType.includes('Franchise') || permitType.includes('Transport') ? 'transport' :
      permitType.includes('Barangay') ? 'barangay' :
      permitType.includes('Inspection') ? 'inspection' : 'business';

    const finalStatus = (extraDetails as any)?.status || 'For Evaluation';
    const finalStatusColor = (extraDetails as any)?.statusColor || (finalStatus === 'Approved' ? 'text-emerald-600 bg-emerald-50 border border-emerald-200' : 'text-amber-600 bg-amber-50 border border-amber-200');

    // Optimistic UI Update
    const newAppItem: ApplicationItem = {
      id: newId,
      applicant: applicantName,
      businessName,
      type: permitType,
      category,
      address,
      contact,
      status: finalStatus,
      statusColor: finalStatusColor,
      date: 'Just now',
      assessmentFee: extraDetails?.assessmentFee || 3450.00,
      assignedOfficer: 'LGU Licensing Officer'
    };

    setApplications(prev => [newAppItem, ...prev]);
    setTotalCount(prev => prev + 1);
    if (finalStatus === 'Approved') {
      setApprovedCount(prev => prev + 1);
    } else {
      setForEvaluationCount(prev => prev + 1);
    }

    // Push new notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: finalStatus === 'Approved' ? 'New Permit Approved & Issued' : 'New Application Filed',
      message: `${newId} (${businessName}) ${finalStatus === 'Approved' ? 'approved & added to live registry' : 'submitted for evaluation'}.`,
      time: 'Just now',
      type: finalStatus === 'Approved' ? 'success' : 'info',
      read: false,
      applicationId: newId,
      targetTab: 'Home'
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Toast feedback banner
    setNotificationMsg(`⚡ PostgreSQL Synced: Application ${newId} (${businessName}) saved to LGU Admin Board!`);
    setTimeout(() => setNotificationMsg(null), 5000);

    // Persist to PostgreSQL Database via REST API
    try {
      const created = await createApplication({
        id: newId,
        applicant: applicantName,
        applicantName: applicantName,
        type: permitType,
        permitType,
        category,
        status: finalStatus,
        statusColor: finalStatusColor,
        formData: extraDetails?.formData || {},
        requirements: extraDetails?.requirements || [],
        remarks: extraDetails?.remarks || '',
        assessmentFee: extraDetails?.assessmentFee || 3450.00
      });

      if (created) {
        setApplications(prev => prev.map(a => a.id === newId ? created : a));
      }
      await loadDatabaseData();
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
  };

  const handleApproveApplication = async (id: string) => {
    let prevStatus = 'For Approval';
    // Optimistic UI update
    setApplications(prev => prev.map(app => {
      if (app.id === id) {
        prevStatus = app.status;
        return {
          ...app,
          status: 'Approved',
          statusColor: 'text-emerald-600 bg-emerald-50 border border-emerald-200'
        };
      }
      return app;
    }));
    setApprovedCount(prev => prev + 1);
    if (prevStatus === 'For Approval') {
      setForApprovalCount(prev => Math.max(0, prev - 1));
    } else if (prevStatus === 'For Evaluation') {
      setForEvaluationCount(prev => Math.max(0, prev - 1));
    }

    // Push notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Permit Approved',
      message: `Official Permit ${id} approved and signed. Ready for QR verification.`,
      time: 'Just now',
      type: 'success',
      read: false,
      applicationId: id,
      targetTab: 'Permit Generation'
    };
    setNotifications(prev => [newNotif, ...prev]);

    setNotificationMsg(`✅ Application ${id} approved in Database! Official E-Permit released.`);
    setTimeout(() => setNotificationMsg(null), 5000);

    // Persist to PostgreSQL Database
    try {
      await updateApplicationStatus(id, 'Approved', 'Approved by LGU Licensing Authority');
      await loadDatabaseData();
    } catch (err) {
      console.warn(`Database update failed for ${id}:`, err);
    }
  };

  const handleRejectApplication = async (id: string, reason?: string) => {
    // Optimistic UI update
    setApplications(prev => prev.map(app => {
      if (app.id === id) {
        return {
          ...app,
          status: 'Rejected',
          statusColor: 'text-rose-600 bg-rose-50 border border-rose-200',
          remarks: reason
        };
      }
      return app;
    }));
    setRejectedCount(prev => prev + 1);
    setForEvaluationCount(prev => Math.max(0, prev - 1));

    // Push notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Notice of Deficiencies Issued',
      message: `Application ${id} rejected / returned for compliance revisions.`,
      time: 'Just now',
      type: 'error',
      read: false,
      applicationId: id,
      targetTab: 'Home'
    };
    setNotifications(prev => [newNotif, ...prev]);

    setNotificationMsg(`❌ Application ${id} rejected in Database. Notice of Deficiencies issued.`);
    setTimeout(() => setNotificationMsg(null), 5000);

    // Persist to PostgreSQL Database
    try {
      await updateApplicationStatus(id, 'Rejected', reason || 'Document non-compliance');
    } catch (err) {
      console.warn(`Database update failed for ${id}:`, err);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    // Optimistic UI update
    setApplications(prev => prev.filter(app => app.id !== id));
    setTotalCount(prev => Math.max(0, prev - 1));

    // Toast feedback banner
    setNotificationMsg(`🗑️ Transaction record ${id} has been deleted.`);
    setTimeout(() => setNotificationMsg(null), 4000);

    // Persist deletion to PostgreSQL backend
    try {
      await deleteApplication(id);
      await loadDatabaseData();
    } catch (err) {
      console.warn(`Database delete failed for ${id}:`, err);
    }
  };

  const handleDeleteAllApplications = async (ids?: string[]) => {
    if (ids && ids.length > 0) {
      setApplications(prev => prev.filter(app => !ids.includes(app.id)));
      setTotalCount(prev => Math.max(0, prev - ids.length));
      setNotificationMsg(`🗑️ Successfully deleted ${ids.length} transaction records.`);
      setTimeout(() => setNotificationMsg(null), 4000);

      try {
        await Promise.all(ids.map(id => deleteApplication(id)));
        await loadDatabaseData();
      } catch (err) {
        console.warn('Database batch delete failed:', err);
      }
    } else {
      const allIds = applications.map(a => a.id);
      setApplications([]);
      setTotalCount(0);
      setForEvaluationCount(0);
      setForApprovalCount(0);
      setApprovedCount(0);
      setRejectedCount(0);
      setNotificationMsg('🗑️ All transaction records have been deleted.');
      setTimeout(() => setNotificationMsg(null), 4000);

      try {
        await Promise.all(allIds.map(id => deleteApplication(id)));
        await loadDatabaseData();
      } catch (err) {
        console.warn('Database clear all failed:', err);
      }
    }
  };

  const handleSimulateNewApplication = (data?: Partial<ApplicationItem>) => {
    if (data) {
      handleAddNewApplication(data);
    } else {
      const sampleNames = ['MegaCorp Retail', 'Starlight Bakery', 'Global Logistics Inc.', 'Sunshine Grocery', 'Apex Tech Lab'];
      const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      handleAddNewApplication(randomName, 'Business Permit');
    }
  };

  const handleViewDetails = (id: string) => {
    setSelectedPermitId(id);
    setActiveTab('Business Registration (New / Renewal)');
  };

  const handleNavigateToDashboard = () => {
    setActiveTab('Home');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Requirements Submission':
        return (
          <RequirementsSubmission 
            onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
            onAddNewApplication={handleAddNewApplication}
          />
        );

      case 'AI Document Verification':
        return <AIDocumentVerification />;

      case 'Fee Assessment & Computation':
        return (
          <FeeAssessmentComputation 
            onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
          />
        );

      case 'Intelligent Approval Recommendation':
        return (
          <IntelligentApprovalDashboard 
            applications={applications}
            onApproveApplication={handleApproveApplication}
            onAddNewApplication={handleAddNewApplication}
            onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
          />
        );

      case 'Permit Generation':
        return (
          <PermitGeneration 
            onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
          />
        );

      case 'Business Permit Application':
      case 'Business Registration (New / Renewal)':
      case 'New Registration':
      case 'Renewal':
        return (
          <BusinessPermitModule 
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onAddNewApplication={handleAddNewApplication}
            onNavigateToDashboard={handleNavigateToDashboard}
          />
        );

      case 'E-Permit Portal':
      case 'Citizen Portal':
        return (
          <CitizenPermitPortal 
            onNavigateToTab={(tab) => setActiveTab(tab)}
            applications={applications}
          />
        );

      case 'Application Status Tracking':
      case 'My Applications':
      case 'Home':
      case 'Dashboard':
        if (user?.role === 'user') {
          return (
            <CitizenDashboard 
              onNavigateToTab={(tab) => setActiveTab(tab)}
              applications={applications}
              onViewDetails={handleViewDetails}
            />
          );
        }
        return (
          <Dashboard 
            onViewDetails={handleViewDetails}
            applications={applications}
            totalCount={totalCount}
            forEvaluationCount={forEvaluationCount}
            forApprovalCount={forApprovalCount}
            approvedCount={approvedCount}
            rejectedCount={rejectedCount}
            onSimulateNewApplication={handleSimulateNewApplication}
            onApproveApplication={handleApproveApplication}
            onRejectApplication={handleRejectApplication}
            onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
          />
        );

      case 'Plan & Blueprint Upload':
        return (
          <PlanAndBlueprintUpload
            onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
            onNavigateToDashboard={handleNavigateToDashboard}
          />
        );

      case 'Inspection Scheduling':
      case 'Inspector Scheduling & Dispatch':
      case 'On-Site Inspection & Scheduling':
      case 'On-Site Inspection & Scheduling Hub':
        return (
          <InspectionScheduling
            currentTab={activeTab}
            onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
            onAddNewApplication={handleAddNewApplication}
            onNavigateToDashboard={handleNavigateToDashboard}
          />
        );

      case 'Building & Construction Permits':
      case 'Building Permit Filing':
      case 'Building Permit Reviews':
      case 'Automated Document Verification (OCR)':
      case 'Permit Approval & Release':
      case 'Construction Progress Monitoring':
      case 'Permits & Licenses':
        return (
          <BuildingPermitFiling 
            initialStep={1}
            currentTab={activeTab}
            onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
            onAddNewApplication={handleAddNewApplication}
            onNavigateToDashboard={handleNavigateToDashboard}
          />
        );

      case 'AI Compliance Checking':
        return <AIComplianceChecking onNavigateToTab={(tab) => setActiveTab(tab as TabType)} />;

      case 'Route & Unit Inspection':
      case 'Route & Unit Inspection Audit':
      case 'Route & Unit Verification':
      case 'AI Route Conflict Check':
        return <RouteUnitInspectionModule onNavigateToTab={(tab) => setActiveTab(tab as TabType)} />;

      case 'Franchise & Transport Permits':
      case 'Franchise Permit Filing':
      case 'Franchise Permit Review':
      case 'Franchise Fee Computation':
      case 'Fleet Progress Monitoring':
        return (
          <FranchiseTransportPermitModule 
            currentTab={activeTab}
            onNavigateToTab={(tab) => setActiveTab(tab as TabType)} 
            onAddNewApplication={handleAddNewApplication}
            onNavigateToDashboard={handleNavigateToDashboard}
          />
        );

      case 'Barangay Permit Integration':
      case 'Barangay Clearance Registry':
      case '24-Barangay Network Grid':
      case '24-Barangay Clearance Network':
      case 'Barangay Integration Review':
      case 'Barangay Clearance Filing':
      case 'Community Clearance Validation':
      case 'Community Clearance Verification':
      case 'Inspection & Local Validation':
      case 'Barangay Permit Release':
      case 'Integration Status Tracking':
        return (
          <BarangayPermitIntegration 
            currentTab={activeTab} 
            onNavigateToTab={(tab) => setActiveTab(tab as TabType)} 
            onAddNewApplication={handleAddNewApplication}
            onNavigateToDashboard={handleNavigateToDashboard}
          />
        );

      case 'E-Permit Tracker':
      case 'Public Reference Code Tracker':
      case 'QR Code Authenticity Verification':
      case 'QR Cryptographic Verification':
      case 'Live Application Milestone Status':
      case 'AI Clearance Audit':
      case 'Digital Permit Download':
        return (
          <EPermitTrackerModule 
            currentTab={activeTab} 
            onNavigateToTab={(tab) => setActiveTab(tab as TabType)} 
            onAddNewApplication={handleAddNewApplication}
            onNavigateToDashboard={handleNavigateToDashboard}
          />
        );

      case 'AI Assistant (Chat)':
        return <AIChatWidget isFullView onNavigateToTab={(tab) => setActiveTab(tab)} />;

      default:
        return (
          <BusinessRegistrationWizard 
            onAddNewApplication={handleAddNewApplication}
            onNavigateToDashboard={handleNavigateToDashboard}
          />
        );
    }
  };

  // If user is not authenticated, display the Login Page or Public Landing Page
  if (!isAuthenticated) {
    if (authView === 'landing') {
      return (
        <PublicLandingPage 
          onNavigateToLogin={(role) => {
            if (role) setLoginInitialRole(role);
            setAuthView('login');
          }} 
        />
      );
    }
    return (
      <LoginPage 
        initialRole={loginInitialRole}
        onNavigateToLanding={() => setAuthView('landing')} 
      />
    );
  }

  // Dedicated Standalone E-Permit Portal View for Citizen (No Sidebar)
  if (user?.role === 'user' && (
    activeTab === 'E-Permit Portal' || 
    activeTab === 'Citizen Portal' || 
    activeTab === 'Home' || 
    activeTab === 'Dashboard' || 
    activeTab === 'My Applications' || 
    activeTab === 'Application Status Tracking'
  )) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased flex flex-col transition-colors duration-200">
        <CitizenPermitPortal 
          onNavigateToTab={(tab) => setActiveTab(tab)}
          applications={applications}
        />
        {/* Global Floating AI Permit Assistant Widget */}
        <AIChatWidget onNavigateToTab={(tab) => setActiveTab(tab)} />
      </div>
    );
  }

  // Dedicated Standalone Business Permit View for Citizen (No Sidebar)
  if (user?.role === 'user' && (
    activeTab === 'Business Registration (New / Renewal)' || 
    activeTab === 'Business Permit Application' || 
    activeTab === 'New Registration' || 
    activeTab === 'Renewal'
  )) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased flex flex-col transition-colors duration-200">
        <BusinessPermitModule 
          onNavigateToTab={(tab) => setActiveTab(tab)}
          onAddNewApplication={handleAddNewApplication}
          onNavigateToDashboard={handleNavigateToDashboard}
        />
        {/* Global Floating AI Permit Assistant Widget */}
        <AIChatWidget onNavigateToTab={(tab) => setActiveTab(tab)} />
      </div>
    );
  }

  // Dedicated Standalone Building Permit View for Citizen (No Sidebar)
  if (user?.role === 'user' && (
    activeTab === 'Building & Construction Permits' || 
    activeTab === 'Building Permit Filing' || 
    activeTab === 'Plan & Blueprint Upload' || 
    activeTab === 'Building Permit Reviews'
  )) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased flex flex-col transition-colors duration-200">
        <BuildingPermitFiling 
          onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
          onAddNewApplication={handleAddNewApplication}
          onNavigateToDashboard={handleNavigateToDashboard}
        />
        {/* Global Floating AI Permit Assistant Widget */}
        <AIChatWidget onNavigateToTab={(tab) => setActiveTab(tab as TabType)} />
      </div>
    );
  }

  // Dedicated Standalone Franchise & Transport View for Citizen (No Sidebar)
  if (user?.role === 'user' && (
    activeTab === 'Franchise & Transport Permits' || 
    activeTab === 'Franchise Permit Filing' || 
    activeTab === 'Franchise Fee Computation' || 
    activeTab === 'Fleet Progress Monitoring'
  )) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased flex flex-col transition-colors duration-200">
        <FranchiseTransportPermitModule 
          currentTab={activeTab}
          onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
          onAddNewApplication={handleAddNewApplication}
          onNavigateToDashboard={handleNavigateToDashboard}
        />
        {/* Global Floating AI Permit Assistant Widget */}
        <AIChatWidget onNavigateToTab={(tab) => setActiveTab(tab as TabType)} />
      </div>
    );
  }

  // Dedicated Standalone Barangay Clearance View for Citizen (No Sidebar)
  if (user?.role === 'user' && (
    activeTab === 'Barangay Permit Integration' ||
    activeTab === 'Barangay Clearance Registry' ||
    activeTab === '24-Barangay Network Grid' ||
    activeTab === '24-Barangay Clearance Network' ||
    activeTab === 'Barangay Clearance Filing' ||
    activeTab === 'Community Clearance Validation' ||
    activeTab === 'Community Clearance Verification' ||
    activeTab === 'Barangay Permit Release' ||
    activeTab === 'Integration Status Tracking'
  )) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased flex flex-col transition-colors duration-200">
        <BarangayPermitIntegration 
          currentTab={activeTab}
          onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
          onAddNewApplication={handleAddNewApplication}
          onNavigateToDashboard={handleNavigateToDashboard}
        />
        {/* Global Floating AI Permit Assistant Widget */}
        <AIChatWidget onNavigateToTab={(tab) => setActiveTab(tab as TabType)} />
      </div>
    );
  }

  // Dedicated Standalone Inspection Scheduling View for Citizen (No Sidebar)
  if (user?.role === 'user' && (
    activeTab === 'Inspection Scheduling' ||
    activeTab === 'Inspection & Local Validation'
  )) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased flex flex-col transition-colors duration-200">
        <InspectionScheduling 
          onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
          onAddNewApplication={handleAddNewApplication}
          onNavigateToDashboard={handleNavigateToDashboard}
        />
        {/* Global Floating AI Permit Assistant Widget */}
        <AIChatWidget onNavigateToTab={(tab) => setActiveTab(tab as TabType)} />
      </div>
    );
  }

  // Dedicated Standalone E-Permit Tracker & QR Verification View for Citizen (No Sidebar)
  if (user?.role === 'user' && (
    activeTab === 'E-Permit Tracker' ||
    activeTab === 'Public Reference Code Tracker' ||
    activeTab === 'QR Code Authenticity Verification' ||
    activeTab === 'QR Cryptographic Verification' ||
    activeTab === 'Live Application Milestone Status' ||
    activeTab === 'Digital Permit Download'
  )) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased flex flex-col transition-colors duration-200">
        <EPermitTrackerModule 
          currentTab={activeTab}
          onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
          onAddNewApplication={handleAddNewApplication}
          onNavigateToDashboard={handleNavigateToDashboard}
        />
        {/* Global Floating AI Permit Assistant Widget */}
        <AIChatWidget onNavigateToTab={(tab) => setActiveTab(tab as TabType)} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased overflow-hidden transition-colors duration-200">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header 
          activeTab={activeTab} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          onNavigateToTab={(tab) => setActiveTab(tab)}
          notifications={notifications}
          applications={applications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
          onClearNotifications={handleClearNotifications}
          onSelectNotification={handleSelectNotification}
          onDeleteApplication={handleDeleteApplication}
          onDeleteAllApplications={handleDeleteAllApplications}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50 dark:bg-slate-950 transition-all duration-300">
          {renderContent()}
        </main>

        {/* Global Floating AI Permit Assistant Widget */}
        <AIChatWidget onNavigateToTab={(tab) => setActiveTab(tab)} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <GovServePortal />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
