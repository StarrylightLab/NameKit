
import React from 'react';
import { translations } from '../locales';

interface AboutProps {
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  onBack: () => void;
}

const About: React.FC<AboutProps> = ({ theme, language, onBack }) => {
  const isDark = theme === 'dark';
  const t = translations[language].about;

  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-8 space-y-6 overflow-hidden ${isDark ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
      <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand/30">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </div>
      
      <div className="text-center space-y-2 max-w-xs">
        <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{t.title}</h2>
        <span className="text-[10px] bg-brand/10 text-brand px-2 py-0.5 rounded-full font-black">{t.version}</span>
        <p className={`text-xs leading-relaxed ${isDark ? 'text-[#888888]' : 'text-slate-500'}`}>{t.desc}</p>
      </div>

      <div className={`w-full max-w-xs p-4 rounded-lg border flex flex-col items-center gap-3 ${isDark ? 'border-[#444444] bg-[#2C2C2C]' : 'border-[#F5F5F5] bg-slate-50'}`}>
         <div className="flex gap-4">
           <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand cursor-pointer hover:bg-brand-hover hover:text-white transition-all">
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.192.694.805.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
           </div>
           <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand cursor-pointer hover:bg-brand-hover hover:text-white transition-all">
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.599 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
           </div>
         </div>
         <span className="text-[10px] font-bold text-brand uppercase tracking-widest">{t.contact}</span>
      </div>

      <button 
        onClick={onBack}
        className={`px-6 h-10 rounded-lg text-xs font-black transition-all active:scale-[0.98] ${isDark ? 'bg-[#383838] text-white hover:bg-[#444444]' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
      >
        {t.back}
      </button>
    </div>
  );
};

export default About;
