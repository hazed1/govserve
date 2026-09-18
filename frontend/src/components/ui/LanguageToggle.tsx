import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div 
      className={`inline-flex items-center p-0.5 rounded-xl border border-slate-300/80 dark:border-slate-700 bg-slate-200/70 dark:bg-slate-800/90 shadow-2xs transition-colors ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLanguage('tl')}
        className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all duration-150 cursor-pointer ${
          language === 'tl'
            ? 'bg-[#0B192C] text-white shadow-xs dark:bg-slate-950 dark:border dark:border-slate-800'
            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
        }`}
        title="Tagalog / Filipino"
        aria-pressed={language === 'tl'}
      >
        TL
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all duration-150 cursor-pointer ${
          language === 'en'
            ? 'bg-[#0B192C] text-white shadow-xs dark:bg-slate-950 dark:border dark:border-slate-800'
            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
        }`}
        title="English"
        aria-pressed={language === 'en'}
      >
        EN
      </button>
    </div>
  );
};
