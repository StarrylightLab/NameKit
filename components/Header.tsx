
import React from 'react';

interface HeaderProps {
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  onToggleLanguage: () => void;
  onToggleTheme: () => void;
  onOpenAbout: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, language, onToggleLanguage, onToggleTheme, onOpenAbout }) => {
  const isDark = theme === 'dark';
  return (
    <header className={`h-11 border-b flex items-center justify-between px-3 shrink-0 ${isDark ? 'bg-[#2C2C2C] border-[#444444]' : 'bg-white border-[#E6E6E6]'}`}>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-brand rounded-lg flex items-center justify-center text-white shadow-sm">
           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
           </svg>
        </div>
        <h1 className="font-black text-sm tracking-tight">NameKit</h1>
      </div>
      
      <div className="flex items-center gap-1.5">
        <button 
          onClick={onToggleTheme}
          className={`w-7 h-7 flex items-center justify-center rounded-md border transition-all ${isDark ? 'border-[#444444] hover:bg-[#383838]' : 'border-[#E6E6E6] hover:bg-slate-50'}`}
          title="Toggle Theme"
        >
          {isDark ? (
            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
          ) : (
            <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
          )}
        </button>
        <button 
          onClick={onToggleLanguage}
          className={`px-2 h-7 text-[9px] font-black border rounded-md transition-all uppercase tracking-tighter ${isDark ? 'border-[#444444] text-[#888888] hover:bg-[#383838]' : 'border-[#E6E6E6] text-slate-500 hover:bg-slate-50'}`}
        >
          {language === 'zh' ? 'EN' : 'CN'}
        </button>
        <button 
          onClick={onOpenAbout}
          className={`w-7 h-7 flex items-center justify-center rounded-md border transition-all ${isDark ? 'border-[#444444] text-[#888888] hover:bg-[#383838]' : 'border-[#E6E6E6] text-slate-400 hover:bg-slate-50'}`}
          title="About"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
