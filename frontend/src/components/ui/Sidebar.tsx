import React, { useState } from 'react';
import { 
  Home, 
  FileText, 
  Building2, 
  Building,
  Truck, 
  Bus,
  QrCode,
  Landmark, 
  ChevronDown, 
  ChevronRight, 
  X,
  Bot,
  User,
  Shield,
  ShieldCheck,
  BarChart3,
  Layers,
  FileCheck,
  Calendar,
  Sparkles,
  Zap,
  Compass,
  Key
} from 'lucide-react';
import { TabType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { AISettingsModal } from './AISettingsModal';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const isAdmin = user?.role === 'admin';

  // Module accordion states
  const [m1Open, setM1Open] = useState(true);
  const [m2Open, setM2Open] = useState(false);
  const [m3Open, setM3Open] = useState(false);
  const [m4Open, setM4Open] = useState(false);
  const [m5Open, setM5Open] = useState(false);
  const [showAISettingsModal, setShowAISettingsModal] = useState(false);

  const handleSubItemClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-white dark:bg-[#0B192C] text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800/80 flex flex-col transition-all duration-300 ease-in-out shadow-xs overflow-hidden flex-shrink-0 ${
          sidebarOpen 
            ? 'w-72 translate-x-0 opacity-100' 
            : 'w-0 -translate-x-full lg:translate-x-0 lg:w-0 opacity-0 pointer-events-none border-none'
        }`}
      >
        {/* Brand Header */}
        <div 
          onClick={() => handleSubItemClick('Home')}
          className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between min-w-[288px] cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
          title="Return to Home Dashboard"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white p-0.5 shadow-xs flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200 dark:border-white/20 group-hover:scale-105 transition-transform">
              <img src="/government-logo.png" alt="Government Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight tracking-wide group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  GovServe
                </h1>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-600/40 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-500/30">
                  {isAdmin ? 'Admin Console' : 'Citizen Portal'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                {isAdmin ? 'Regulatory & Licensing Hub' : 'Citizen & Business E-Permits'}
              </p>
            </div>
          </div>
          <button
            className="lg:hidden text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Modules */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 text-xs font-medium scrollbar-thin min-w-[288px]">
          
          {/* Section 1: Main Citizen / Admin Hub Navigation */}
          {!isAdmin ? (
            <div className="space-y-1">
              <button
                onClick={() => handleSubItemClick('Dashboard')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  activeTab === 'Dashboard' || activeTab === 'My Applications' || activeTab === 'Application Status Tracking'
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/25'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Home size={18} className="text-amber-500 dark:text-amber-400 flex-shrink-0" />
                <span className="truncate">{t('Dashboard & Tracker', 'Dashboard & Tracker')}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleSubItemClick('Home')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                activeTab === 'Home' || activeTab === 'Dashboard'
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/25'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 size={18} />
              <span className="truncate">{t('Executive Dashboard', 'Executive Dashboard')}</span>
            </button>
          )}

          {/* ========================================================== */}
          {/* PERSPECTIVE A: CITIZEN / BUSINESS USER NAVIGATION */}
          {/* ========================================================== */}
          {!isAdmin ? (
            <>
              {/* ========================================================== */}
              {/* PERSPECTIVE A: CITIZEN / BUSINESS USER NAVIGATION (SIMPLE) */}
              {/* ========================================================== */}
              <div className="pt-2 space-y-4">
                
                {/* Section: PERMIT SERVICES */}
                <div className="space-y-1">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {t('Permit Applications', 'Permit Applications')}
                  </p>

                  <button
                    onClick={() => handleSubItemClick('Business Registration (New / Renewal)')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all text-xs font-medium cursor-pointer ${
                      activeTab === 'Business Registration (New / Renewal)' || activeTab === 'New Registration' || activeTab === 'Business Permit Application'
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/25'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Building2 size={17} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
                    <span className="truncate">{t('Business Permit', 'Business Permit')}</span>
                  </button>

                  <button
                    onClick={() => handleSubItemClick('Building Permit Filing')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all text-xs font-medium cursor-pointer ${
                      activeTab === 'Building Permit Filing' || activeTab === 'Building & Construction Permits'
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/25'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Building size={17} className="text-amber-500 dark:text-amber-400 flex-shrink-0" />
                    <span className="truncate">{t('Building & Construction', 'Building & Construction')}</span>
                  </button>

                  <button
                    onClick={() => handleSubItemClick('Franchise & Transport Permits')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all text-xs font-medium cursor-pointer ${
                      activeTab === 'Franchise & Transport Permits' || activeTab === 'Franchise Permit Filing'
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/25'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Bus size={17} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{t('Franchise & Transport (MTOP)', 'Franchise & Transport (MTOP)')}</span>
                  </button>

                  <button
                    onClick={() => handleSubItemClick('Barangay Permit Integration')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all text-xs font-medium cursor-pointer ${
                      activeTab === 'Barangay Permit Integration'
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/25'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <ShieldCheck size={17} className="text-purple-500 dark:text-purple-400 flex-shrink-0" />
                    <span className="truncate">{t('Barangay Clearance', 'Barangay Clearance')}</span>
                  </button>
                </div>

                {/* Section: CITIZEN SERVICES & TOOLS */}
                <div className="space-y-1 pt-1">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {t('Citizen Services', 'Citizen Services')}
                  </p>

                  <button
                    onClick={() => handleSubItemClick('Inspection Scheduling')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all text-xs font-medium cursor-pointer ${
                      activeTab === 'Inspection Scheduling'
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/25'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Calendar size={17} className="text-sky-500 dark:text-sky-400 flex-shrink-0" />
                    <span className="truncate">{t('Schedule Inspection', 'Schedule Inspection')}</span>
                  </button>

                  <button
                    onClick={() => handleSubItemClick('Requirements Submission')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all text-xs font-medium cursor-pointer ${
                      activeTab === 'Requirements Submission'
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/25'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <FileCheck size={17} className="text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                    <span className="truncate">{t('Upload Documents', 'Upload Documents')}</span>
                  </button>

                  <button
                    onClick={() => handleSubItemClick('Fee Assessment & Computation')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all text-xs font-medium cursor-pointer ${
                      activeTab === 'Fee Assessment & Computation'
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/25'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Zap size={17} className="text-rose-500 dark:text-rose-400 flex-shrink-0" />
                    <span className="truncate">{t('Fees & Payments', 'Fees & Payments')}</span>
                  </button>

                  <button
                    onClick={() => handleSubItemClick('E-Permit Tracker')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all text-xs font-medium cursor-pointer ${
                      activeTab === 'E-Permit Tracker' || activeTab === 'Public Reference Code Tracker' || activeTab === 'QR Code Authenticity Verification'
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/25'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <QrCode size={17} className="text-teal-500 dark:text-teal-400 flex-shrink-0" />
                    <span className="truncate">{t('Track & Verify E-Permit', 'Track & Verify E-Permit')}</span>
                  </button>
                </div>

              </div>
            </>
          ) : (
            
            /* ========================================================== */
            /* PERSPECTIVE B: LGU ADMINISTRATOR NAVIGATION (BLUE THEME)   */
            /* ========================================================== */
            <>
              {/* Module 1: Business Permit Application */}
              <div className="space-y-1 pt-1">
                <button
                  onClick={() => setM1Open(!m1Open)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Building2 size={18} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
                    <span className="font-bold text-slate-800 dark:text-white text-[12px] truncate">{t('Business Permit Application', 'Business Permit Application')}</span>
                  </div>
                  {m1Open ? <ChevronDown size={14} className="text-slate-400 dark:text-slate-500" /> : <ChevronRight size={14} className="text-slate-400 dark:text-slate-500" />}
                </button>

                {m1Open && (
                  <div className="pl-6 space-y-0.5 border-l border-slate-200 dark:border-slate-800 ml-3 my-1">
                    {[
                      { name: 'AI Document Verification OCR', tab: 'AI Document Verification', ai: true },
                      { name: 'Intelligent Approval AI Decision', tab: 'Intelligent Approval Recommendation', ai: true },
                      { name: 'Fee Assessment & Tax Engine', tab: 'Fee Assessment & Computation' },
                      { name: 'AI Zoning & Compliance Check', tab: 'AI Compliance Checking', ai: true },
                      { name: 'Digital Permit Signing & QR', tab: 'Permit Generation' },
                    ].map((sub) => {
                      const isActive = activeTab === sub.tab;
                      return (
                        <button
                          key={sub.name}
                          onClick={() => handleSubItemClick(sub.tab as TabType)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors text-[11px] cursor-pointer ${
                            isActive
                              ? 'bg-blue-600 text-white font-semibold shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          <span className="truncate">{t(sub.name, sub.name)}</span>
                          {sub.ai && (
                            <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold flex items-center">
                              AI
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Module 2: Building & Construction Permits */}
              <div className="space-y-1">
                <button
                  onClick={() => setM2Open(!m2Open)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Building size={18} className="text-amber-500 dark:text-amber-400 flex-shrink-0" />
                    <span className="font-bold text-slate-800 dark:text-white text-[12px] truncate">{t('Building & Construction Permits', 'Building & Construction Permits')}</span>
                  </div>
                  {m2Open ? <ChevronDown size={14} className="text-slate-400 dark:text-slate-500" /> : <ChevronRight size={14} className="text-slate-400 dark:text-slate-500" />}
                </button>

                {m2Open && (
                  <div className="pl-6 space-y-0.5 border-l border-slate-200 dark:border-slate-800 ml-3 my-1">
                    {[
                      { name: 'Building Permit Reviews', tab: 'Building Permit Reviews' },
                      { name: 'Blueprint & Plan Inspection', tab: 'Plan & Blueprint Upload' },
                      { name: 'Inspector Scheduling & Dispatch', tab: 'Inspection Scheduling' },
                    ].map((sub) => {
                      const isActive = activeTab === sub.tab;
                      return (
                        <button
                          key={sub.name}
                          onClick={() => handleSubItemClick(sub.tab as TabType)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors text-[11px] cursor-pointer ${
                            isActive
                              ? 'bg-blue-600 text-white font-semibold shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          <span className="truncate">{t(sub.name, sub.name)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Module 3: Franchise & Transport Permits */}
              <div className="space-y-1">
                <button
                  onClick={() => setM3Open(!m3Open)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Bus size={18} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                    <span className="font-bold text-slate-800 dark:text-white text-[12px] truncate">{t('Franchise & Transport Permits', 'Franchise & Transport Permits')}</span>
                  </div>
                  {m3Open ? <ChevronDown size={14} className="text-slate-400 dark:text-slate-500" /> : <ChevronRight size={14} className="text-slate-400 dark:text-slate-500" />}
                </button>

                {m3Open && (
                  <div className="pl-6 space-y-0.5 border-l border-slate-200 dark:border-slate-800 ml-3 my-1">
                    {[
                      { name: 'Franchise Permit Review', tab: 'Franchise Permit Review' },
                      { name: 'Route & Unit Inspection Audit', tab: 'Route & Unit Inspection' },
                    ].map((sub) => {
                      const isActive = activeTab === sub.tab;
                      return (
                        <button
                          key={sub.name}
                          onClick={() => handleSubItemClick(sub.tab as TabType)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors text-[11px] cursor-pointer ${
                            isActive
                              ? 'bg-blue-600 text-white font-semibold shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          <span className="truncate">{t(sub.name, sub.name)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Module 4: Barangay Permit Integration */}
              <div className="space-y-1">
                <button
                  onClick={() => setM4Open(!m4Open)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <ShieldCheck size={18} className="text-purple-500 dark:text-purple-400 flex-shrink-0" />
                    <span className="font-bold text-slate-800 dark:text-white text-[12px] truncate">{t('Barangay Permit Integration', 'Barangay Permit Integration')}</span>
                  </div>
                  {m4Open ? <ChevronDown size={14} className="text-slate-400 dark:text-slate-500" /> : <ChevronRight size={14} className="text-slate-400 dark:text-slate-500" />}
                </button>

                {m4Open && (
                  <div className="pl-6 space-y-0.5 border-l border-slate-200 dark:border-slate-800 ml-3 my-1">
                    {[
                      { name: 'Barangay Clearance Registry', tab: 'Barangay Clearance Registry' },
                      { name: '24-Barangay Network Grid', tab: '24-Barangay Network Grid' },
                    ].map((sub) => {
                      const isActive = activeTab === sub.tab;
                      return (
                        <button
                          key={sub.name}
                          onClick={() => handleSubItemClick(sub.tab as TabType)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors text-[11px] cursor-pointer ${
                            isActive
                              ? 'bg-blue-600 text-white font-semibold shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          <span className="truncate">{t(sub.name, sub.name)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Module 5: E-Permit Tracker */}
              <div className="space-y-1">
                <button
                  onClick={() => setM5Open(!m5Open)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <QrCode size={18} className="text-teal-500 dark:text-teal-400 flex-shrink-0" />
                    <span className="font-bold text-slate-800 dark:text-white text-[12px] truncate">{t('E-Permit Tracker', 'E-Permit Tracker')}</span>
                  </div>
                  {m5Open ? <ChevronDown size={14} className="text-slate-400 dark:text-slate-500" /> : <ChevronRight size={14} className="text-slate-400 dark:text-slate-500" />}
                </button>

                {m5Open && (
                  <div className="pl-6 space-y-0.5 border-l border-slate-200 dark:border-slate-800 ml-3 my-1">
                    {[
                      { name: 'Public Reference Code Tracker', tab: 'Public Reference Code Tracker' },
                      { name: 'QR Cryptographic Verification', tab: 'QR Code Authenticity Verification' },
                    ].map((sub) => {
                      const isActive = activeTab === sub.tab;
                      return (
                        <button
                          key={sub.name}
                          onClick={() => handleSubItemClick(sub.tab as TabType)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors text-[11px] cursor-pointer ${
                            isActive
                              ? 'bg-blue-600 text-white font-semibold shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          <span className="truncate">{t(sub.name, sub.name)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </>
          )}

        </div>

        {/* Sidebar Footer with Language Switcher */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 flex items-center justify-between min-w-[288px]">
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
            {language === 'tl' ? 'Piliin ang Wika:' : 'Language:'}
          </span>
          <LanguageToggle />
        </div>
      </aside>
    </>
  );
};