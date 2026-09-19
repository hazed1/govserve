import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageToggle: React.FC<{ className?: string; showIcon?: boolean }> = ({ 
  className = '',
  showIcon = true
}) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div 
      className={`inline-flex items-center p-1 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-inner transition-colors duration-200 ${className}`}
      role="group"
      aria-label="Language Selector"
    >
      {showIcon && (
        <div className="pl-1.5 pr-1 text-slate-500 dark:text-slate-400 hidden xs:flex items-center">
          <Globe size={13} className="text-blue-600 dark:text-blue-400" />
        </div>
      )}

      {/* English Button */}
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 text-xs font-black rounded-full transition-all duration-200 cursor-pointer select-none ${
          language === 'en'
            ? 'bg-blue-600 text-white shadow-sm scale-105'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
        }`}
        title="Switch to English"
        aria-pressed={language === 'en'}
      >
        EN
      </button>

      {/* Tagalog Button */}
      <button
        type="button"
        onClick={() => setLanguage('tl')}
        className={`px-2.5 py-1 text-xs font-black rounded-full transition-all duration-200 cursor-pointer select-none ${
          language === 'tl'
            ? 'bg-blue-600 text-white shadow-sm scale-105'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
        }`}
        title="Lumipat sa Tagalog / Filipino"
        aria-pressed={language === 'tl'}
      >
        TL
      </button>
    </div>
  );
};
