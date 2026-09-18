import React from 'react';
import {
  Home,
  FileText,
  Building2,
  HardHat,
  Bus,
  ShieldCheck,
  Calendar,
  Upload,
  CreditCard,
  QrCode,
  LogOut,
  User,
  Layers
} from 'lucide-react';

interface AppSidebarProps {
  activeTab?: string;
  onNavigate?: (tab: string) => void;
}

export const Sidebar: React.FC<AppSidebarProps> = ({ activeTab = 'Home', onNavigate }) => {
  return (
    <aside className="w-64 bg-[#0B192C] text-slate-300 flex flex-col justify-between min-h-screen border-r border-slate-800">
      <div>
        {/* Branding Header */}
        <div className="p-5 flex items-center space-x-3 border-b border-slate-800">
          <div className="w-9 h-9 bg-white rounded-xl p-0.5 shadow-md flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/20">
            <img src="/government-logo.png" alt="Government Logo" className="w-full h-full object-contain rounded-lg" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm tracking-wide">GovServe</h1>
            <p className="text-[10px] text-blue-400 font-semibold">Citizen Portal</p>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="px-3 py-4 space-y-5">
          {/* Main Navigation */}
          <div className="space-y-1">
            <button
              onClick={() => onNavigate?.('E-Permit Portal')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'E-Permit Portal' || activeTab === 'Citizen Portal'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Layers size={16} className="text-blue-400" />
              <span>E-Permit Portal</span>
            </button>

            <button
              onClick={() => onNavigate?.('Home')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'Home' || activeTab === 'Dashboard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Home size={16} className="text-amber-400" />
              <span>Dashboard & Tracker</span>
            </button>
          </div>

          {/* Permit Applications */}
          <div>
            <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2">
              Apply for Permit
            </p>
            <div className="space-y-1">
              <button
                onClick={() => onNavigate?.('Business Registration (New / Renewal)')}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
              >
                <Building2 size={16} className="text-blue-400" />
                <span>Business Permit</span>
              </button>

              <button
                onClick={() => onNavigate?.('Building Permit Filing')}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
              >
                <HardHat size={16} className="text-amber-400" />
                <span>Building & Construction</span>
              </button>

              <button
                onClick={() => onNavigate?.('Franchise & Transport Permits')}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
              >
                <Bus size={16} className="text-emerald-400" />
                <span>Franchise & Transport (MTOP)</span>
              </button>

              <button
                onClick={() => onNavigate?.('Barangay Permit Integration')}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
              >
                <ShieldCheck size={16} className="text-purple-400" />
                <span>Barangay Clearance</span>
              </button>
            </div>
          </div>

          {/* Citizen Services */}
          <div>
            <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2">
              Citizen Services
            </p>
            <div className="space-y-1">
              <button
                onClick={() => onNavigate?.('Inspection Scheduling')}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
              >
                <Calendar size={16} className="text-sky-400" />
                <span>Schedule Inspection</span>
              </button>

              <button
                onClick={() => onNavigate?.('Requirements Submission')}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
              >
                <Upload size={16} className="text-indigo-400" />
                <span>Upload Documents</span>
              </button>

              <button
                onClick={() => onNavigate?.('Fee Assessment & Computation')}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
              >
                <CreditCard size={16} className="text-rose-400" />
                <span>Fees & Payments</span>
              </button>

              <button
                onClick={() => onNavigate?.('E-Permit Tracker')}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
              >
                <QrCode size={16} className="text-teal-400" />
                <span>Track & Verify E-Permit</span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-[#091526]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xs">
            <User size={16} />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Citizen Account</p>
          </div>
        </div>
        <button 
          title="Sign Out"
          className="text-slate-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;