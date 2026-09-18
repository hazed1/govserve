import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  HelpCircle, 
  Bell, 
  ChevronDown, 
  User, 
  Settings, 
  Shield, 
  LogOut 
} from 'lucide-react';

interface HeaderProps {
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input */}
      <div className="relative w-80">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search applications, records..."
          className="w-full pl-10 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Right Header Controls */}
      <div className="flex items-center space-x-5">
        <button 
          aria-label="Help"
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <HelpCircle size={20} />
        </button>
        <button 
          aria-label="Notifications"
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors relative"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-xs border border-slate-300">
              JD
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-gray-800 leading-tight">Jane Doe</p>
              <p className="text-[11px] text-gray-500 leading-tight">Staff</p>
            </div>
            <ChevronDown 
              size={14} 
              className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Dropdown Content */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">Jane Doe</p>
                <p className="text-xs text-gray-500">jane.doe@govserve.ph</p>
              </div>

              <div className="py-1">
                <a
                  href="#profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                >
                  <User size={16} className="mr-3 text-gray-400" />
                  View Profile
                </a>
                <a
                  href="#settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                >
                  <Settings size={16} className="mr-3 text-gray-400" />
                  Account Settings
                </a>
                <a
                  href="#security"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                >
                  <Shield size={16} className="mr-3 text-gray-400" />
                  MFA & Security
                </a>
              </div>

              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut size={16} className="mr-3 text-red-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};