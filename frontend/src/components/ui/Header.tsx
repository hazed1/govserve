import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  User, 
  LogOut, 
  ChevronDown, 
  Building, 
  Sun, 
  Moon, 
  Home, 
  Check, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  Settings,
  X,
  Lock,
  Mail,
  Phone,
  Save,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Sparkles,
  History,
  Search,
  FileCheck,
  Tag,
  ArrowRight
} from 'lucide-react';
import { TabType, UserRole, NotificationItem, ApplicationItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { fetchAIStatus, AIStatusResponse } from '../../services/aiApi';
import { AISettingsModal } from './AISettingsModal';

interface HeaderProps {
  activeTab: TabType;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onNavigateToTab?: (tab: TabType) => void;
  notifications?: NotificationItem[];
  applications?: ApplicationItem[];
  onDeleteApplication?: (id: string) => void;
  onDeleteAllApplications?: (ids?: string[]) => void;
  onMarkNotificationAsRead?: (id: string) => void;
  onMarkAllNotificationsAsRead?: () => void;
  onClearNotifications?: () => void;
  onSelectNotification?: (notif: NotificationItem) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  sidebarOpen, 
  setSidebarOpen, 
  onNavigateToTab,
  notifications = [],
  applications = [],
  onDeleteApplication,
  onDeleteAllApplications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onClearNotifications,
  onSelectNotification
}) => {
  const { user, logout, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<'All' | 'Approved' | 'For Evaluation' | 'For Approval' | 'Rejected'>('All');
  const [localDeletedIds, setLocalDeletedIds] = useState<string[]>([]);
  
  // Dialog States
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAISettingsModal, setShowAISettingsModal] = useState(false);
  const [aiStatus, setAiStatus] = useState<AIStatusResponse | null>(null);

  useEffect(() => {
    fetchAIStatus().then(setAiStatus).catch(() => {});
  }, []);
  
  // Profile edit state
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editDept, setEditDept] = useState(user?.department || '');
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Settings edit state
  const [mfaEnabled, setMfaEnabled] = useState(user?.mfaEnabled ?? true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  const [badgeDismissed, setBadgeDismissed] = useState(false);
  const [historyBadgeDismissed, setHistoryBadgeDismissed] = useState(() => {
    try {
      return localStorage.getItem('govserve_history_badge_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const rawUnreadCount = notifications.filter(n => !n.read).length;
  const unreadCount = badgeDismissed ? 0 : rawUnreadCount;

  const getDisplayTitle = (tab: TabType) => {
    if (tab === 'Home' || tab === 'Dashboard') {
      return user?.role === 'admin' ? 'Executive Dashboard' : 'Dashboard & Tracker';
    }
    if (tab === 'Business Registration (New / Renewal)' || tab === 'New Registration' || tab === 'Business Permit Application') {
      return user?.role === 'admin' ? 'Business Permit Applications' : 'Business Registration (New / Renewal)';
    }
    if (tab === 'Building Permit Filing' || tab === 'Building Permit Reviews' || tab === 'Building & Construction Permits') {
      return user?.role === 'admin' ? 'Building Permit Reviews' : 'Building Permit Filing';
    }
    if (tab === 'Plan & Blueprint Upload') {
      return 'Plan & Blueprint Upload';
    }
    if (tab === 'Route & Unit Inspection' || tab === 'Route & Unit Inspection Audit' || tab === 'Route & Unit Verification') {
      return user?.role === 'admin' ? 'Route & Unit Inspection Audit' : 'Route & Unit Verification';
    }
    if (tab === 'Franchise & Transport Permits' || tab === 'Franchise Permit Filing' || tab === 'Franchise Permit Review') {
      return user?.role === 'admin' ? 'Franchise Permit Review' : 'Franchise & Transport Permit Application';
    }
    if (tab === '24-Barangay Network Grid') {
      return '24-Barangay Network Grid';
    }
    if (tab === 'Barangay Permit Integration' || tab === 'Barangay Clearance Registry' || tab === '24-Barangay Clearance Network' || tab === 'Barangay Integration Review' || tab === 'Barangay Clearance Filing' || tab === 'Community Clearance Validation') {
      return user?.role === 'admin' ? 'Barangay Clearance Registry' : 'Barangay Clearance Integration';
    }
    if (tab === 'E-Permit Tracker' || tab === 'Public Reference Code Tracker' || tab === 'QR Code Authenticity Verification' || tab === 'QR Cryptographic Verification') {
      return user?.role === 'admin' ? 'E-Permit Tracking & Cryptographic Issuance Hub' : 'E-Permit & Reference Tracker';
    }
    if (tab === 'Public Services Portal' || tab === 'Landing Page') {
      return 'Public Services & Licensing Portal';
    }
    if (tab === 'AI Compliance Checking') {
      return 'AI Zoning & Regulatory Compliance Check';
    }
    return tab;
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      phone: editPhone,
      department: editDept
    });
    setProfileSavedToast(true);
    setTimeout(() => {
      setProfileSavedToast(false);
      setShowProfileModal(false);
    }, 1500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      mfaEnabled
    });
    setSettingsSavedToast(true);
    setTimeout(() => {
      setSettingsSavedToast(false);
      setShowSettingsModal(false);
      setCurrentPassword('');
      setNewPassword('');
    }, 1500);
  };

  const getRoleBadgeStyle = (role?: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-700';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700';
    }
  };

  return (
    <>
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shadow-xs transition-colors duration-200">
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Toggle Sidebar Button */}
          <button
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            onClick={() => setSidebarOpen(prev => !prev)}
            aria-label="Toggle Sidebar Navigation"
            title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            <Menu size={22} />
          </button>

          {/* Clickable Home Button */}
          <button
            onClick={() => onNavigateToTab?.('Home')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'Home' || activeTab === 'Dashboard'
                ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600'
            }`}
            title="Return to Home Dashboard"
          >
            <Home size={16} />
            <span>Home</span>
          </button>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">/</span>

          <div>
            <button 
              onClick={() => onNavigateToTab?.(activeTab)}
              className="text-left cursor-pointer group"
            >
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                {getDisplayTitle(activeTab)}
              </h2>
            </button>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block">GovServe Unified Business Permit Portal</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">


          {/* Dark Mode / Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 relative group cursor-pointer"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun size={20} className="text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon size={20} className="text-slate-600 group-hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* Notification Bell Dropdown */}
          <div className="relative" ref={notifDropdownRef}>
            <button 
              onClick={() => {
                setNotificationDropdownOpen(!notificationDropdownOpen);
                setProfileDropdownOpen(false);
                setBadgeDismissed(true);
                if (onMarkAllNotificationsAsRead) {
                  onMarkAllNotificationsAsRead();
                }
              }}
              className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              title="System Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {notificationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-fadeIn">
                <div className="px-4 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell size={16} className="text-blue-600" />
                    <h3 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      Live Notifications ({notifications.length})
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px]">
                    {unreadCount > 0 && onMarkAllNotificationsAsRead && (
                      <button
                        onClick={onMarkAllNotificationsAsRead}
                        className="text-blue-600 hover:underline font-bold cursor-pointer"
                      >
                        Read All
                      </button>
                    )}
                    {notifications.length > 0 && onClearNotifications && (
                      <button
                        onClick={onClearNotifications}
                        className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Clear Notifications"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          onMarkNotificationAsRead?.(n.id);
                          onSelectNotification?.(n);
                          setNotificationDropdownOpen(false);
                        }}
                        className={`p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors flex items-start space-x-3 ${
                          !n.read ? 'bg-blue-50/50 dark:bg-blue-950/30 font-semibold' : 'opacity-80'
                        }`}
                      >
                        <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                          !n.read ? 'bg-blue-600 animate-ping' : 'bg-transparent'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{n.title}</p>
                            <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                          {n.applicationId && (
                            <span className="inline-block mt-1 text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline">
                              View {n.applicationId} →
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-slate-400 text-xs italic">
                      No notifications at this time.
                    </div>
                  )}
                </div>

                <div className="px-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-center">
                  <p className="text-[10px] text-slate-400">
                    Events synchronized live with LGU Permitting Stream
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* User Info Badge & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setNotificationDropdownOpen(false);
              }}
              className="flex items-center space-x-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-full ${user?.avatarBg || 'bg-blue-600'} flex items-center justify-center text-white font-bold text-xs shadow-xs`}>
                {user ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('') : <User size={18} />}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate max-w-[130px]">
                  {user?.name || 'Citizen'}
                </p>
                <div className="flex items-center space-x-1">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${getRoleBadgeStyle(user?.role)}`}>
                    {user?.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
              </div>
              <ChevronDown size={14} className="text-slate-400 dark:text-slate-500 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fadeIn text-xs">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">{user?.citizenId || 'ID: PH-847291'}</p>
                  {user?.organization && (
                    <div className="mt-1.5 flex items-center space-x-1 text-[11px] text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 rounded-md font-medium">
                      <Building size={12} />
                      <span className="truncate">{user.organization}</span>
                    </div>
                  )}
                  {user?.role === 'user' && (
                    <div className="mt-2 text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 px-2 py-1 rounded-lg flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      <span className="font-semibold">Verified Citizen Account</span>
                    </div>
                  )}
                </div>

                {/* Profile & Settings Links */}
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 space-y-1">
                  <button
                    onClick={() => {
                      setEditName(user?.name || '');
                      setEditPhone(user?.phone || '');
                      setEditDept(user?.department || '');
                      setShowProfileModal(true);
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors cursor-pointer"
                  >
                    <User size={15} className="text-blue-500" />
                    <span>My Profile</span>
                  </button>

                  {/* History Records Button below My Profile */}
                  <button
                    onClick={() => {
                      setShowHistoryModal(true);
                      setProfileDropdownOpen(false);
                      setHistoryBadgeDismissed(true);
                      try {
                        localStorage.setItem('govserve_history_badge_dismissed', 'true');
                      } catch {}
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors cursor-pointer"
                  >
                    <History size={15} className="text-emerald-500" />
                    <span>History Records</span>
                    {!historyBadgeDismissed && (
                      <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                        {applications.length > 0 ? applications.length : 8}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setShowSettingsModal(true);
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors cursor-pointer"
                  >
                    <Settings size={15} className="text-indigo-500" />
                    <span>Account Settings</span>
                  </button>

                </div>

                {/* Logout Action */}
                <div className="pt-1 px-2">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Sign Out of Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* USER PROFILE MODAL */}
      {/* ========================================================================= */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 text-xs">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User size={18} className="text-blue-400" />
                <h3 className="font-extrabold text-sm">Citizen / Officer Profile</h3>
              </div>
              <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 space-y-4">
              {profileSavedToast && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center space-x-2 font-bold">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Citizen / Officer ID</label>
                  <input
                    type="text"
                    value={user?.citizenId || ''}
                    disabled
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department / Organization</label>
                <input
                  type="text"
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-md cursor-pointer"
                >
                  <Save size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ACCOUNT SETTINGS MODAL */}
      {/* ========================================================================= */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 text-xs">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings size={18} className="text-indigo-400" />
                <h3 className="font-extrabold text-sm">Account Security & Settings</h3>
              </div>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="p-5 space-y-4">
              {settingsSavedToast && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center space-x-2 font-bold">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Security settings updated!</span>
                </div>
              )}

              {/* 2FA Toggle */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Require 6-digit OTP via Gmail for logins</p>
                </div>
                <input
                  type="checkbox"
                  checked={mfaEnabled}
                  onChange={(e) => setMfaEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>

              {/* Password update */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password (min. 6 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-md cursor-pointer"
                >
                  <Save size={14} />
                  <span>Update Settings</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CITIZEN APPLICATION HISTORY RECORDS MODAL */}
      {/* ========================================================================= */}
      {showHistoryModal && (() => {
        const sourceApps = (applications && applications.length > 0)
          ? applications
          : (() => {
              try {
                const cached = localStorage.getItem('govserve_applications');
                return cached ? JSON.parse(cached) : [];
              } catch {
                return [];
              }
            })();

        const filteredHistory = sourceApps
          .filter(app => !localDeletedIds.includes(app.id))
          .filter(app => {
          const matchQuery = 
            (app.id || '').toLowerCase().includes(historySearch.toLowerCase()) ||
            (app.applicant || '').toLowerCase().includes(historySearch.toLowerCase()) ||
            (app.businessName || '').toLowerCase().includes(historySearch.toLowerCase()) ||
            (app.type || '').toLowerCase().includes(historySearch.toLowerCase());

          const matchStatus = 
            historyStatusFilter === 'All' ? true :
            historyStatusFilter === 'Approved' ? app.status === 'Approved' :
            historyStatusFilter === 'For Evaluation' ? app.status === 'For Evaluation' :
            historyStatusFilter === 'For Approval' ? app.status === 'For Approval' :
            historyStatusFilter === 'Rejected' ? app.status === 'Rejected' : true;

          return matchQuery && matchStatus;
        });

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
              {/* Modal Header */}
              <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                    <History size={17} />
                  </div>
                  <div>
                    <h3 className="font-black text-xs sm:text-sm text-white">Citizen Application History Records</h3>
                    <p className="text-[10px] text-slate-300">
                      Comprehensive log of all applications submitted by citizen users.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Toolbar: Search (Top) + Status Filter Tabs (Below) */}
              <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col gap-2.5">
                <div className="relative w-full">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Search by Ref ID, Citizen Name, or Business..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
                  <div className="flex flex-wrap items-center gap-1">
                    {(['All', 'Approved', 'For Evaluation', 'For Approval', 'Rejected'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setHistoryStatusFilter(tab)}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          historyStatusFilter === tab
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {filteredHistory.length > 0 && (
                    <button
                      onClick={() => {
                        const count = filteredHistory.length;
                        const confirmMsg = historyStatusFilter === 'All'
                          ? `Are you sure you want to delete all ${count} transaction records?`
                          : `Are you sure you want to delete all ${count} records under '${historyStatusFilter}'?`;
                        if (window.confirm(confirmMsg)) {
                          const idsToDelete = filteredHistory.map(item => item.id);
                          setLocalDeletedIds(prev => [...prev, ...idsToDelete]);
                          if (onDeleteAllApplications) {
                            onDeleteAllApplications(idsToDelete);
                          } else if (onDeleteApplication) {
                            idsToDelete.forEach(id => onDeleteApplication(id));
                          }
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg font-bold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/60 transition-all flex items-center space-x-1 cursor-pointer whitespace-nowrap ml-auto"
                      title="Delete all records in this view"
                    >
                      <Trash2 size={12} />
                      <span>Delete All</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Records List Body */}
              <div className="p-3.5 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 space-y-2">
                {filteredHistory.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 space-y-2">
                    <History size={28} className="mx-auto text-slate-300 dark:text-slate-600" />
                    <p className="font-bold text-xs">No application records found matching this filter.</p>
                  </div>
                ) : (
                  filteredHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700/60 shadow-2xs transition-all space-y-1"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-black text-xs text-blue-600 dark:text-blue-400">
                            {item.id}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {item.category ? item.category.toUpperCase() : 'REGULATORY'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'Approved' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' :
                            item.status === 'Rejected' ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300' :
                            'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          }`}>
                            {item.status}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLocalDeletedIds(prev => [...prev, item.id]);
                              if (onDeleteApplication) {
                                onDeleteApplication(item.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer"
                            title="Delete transaction record"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <p className="font-bold text-xs text-slate-900 dark:text-white">
                        {item.businessName || item.applicant}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                        <span><strong>Citizen:</strong> {item.applicant}</span>
                        <span><strong>Permit:</strong> {item.type}</span>
                        <span><strong>Date:</strong> {item.date}</span>
                        {item.assessmentFee && (
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold ml-auto">
                            ₱{Number(item.assessmentFee).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>Total Records: <strong>{filteredHistory.length}</strong> applications</span>
              </div>
            </div>
          </div>
        );
      })()}

    </>
  );
};