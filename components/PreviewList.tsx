
import React from 'react';
import { PreviewItem } from '../types';
import { translations } from '../locales';

interface PreviewListProps {
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  items: PreviewItem[];
  selectedIndex: number;
  onSelectItem: (idx: number) => void;
  onFocusItem: (id: string) => void;
}

const PreviewList: React.FC<PreviewListProps> = ({ theme, language, items, selectedIndex, onSelectItem, onFocusItem }) => {
  const isDark = theme === 'dark';
  const t = translations[language].preview;

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40">
        <p className="text-[11px] font-medium italic">{t.empty}</p>
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-y-auto transition-colors duration-200 ${isDark ? 'bg-[#1E1E1E]' : 'bg-slate-50/50'}`}>
      <div className={`px-4 py-2 border-b sticky top-0 z-10 flex justify-between items-center ${isDark ? 'bg-[#2C2C2C]/90 border-[#444444]' : 'bg-white/80 border-[#E6E6E6]'} backdrop-blur`}>
        <h2 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.subHeading}</h2>
        <span className="text-[9px] bg-brand/10 px-2 py-0.5 rounded-full text-brand font-black">{items.length} {t.results}</span>
      </div>

      <div className="p-3 space-y-2.5">
        {items.map((item, idx) => (
          <div 
            key={item.id}
            onClick={() => onSelectItem(idx)}
            className={`rounded-lg border transition-all cursor-pointer group shadow-sm overflow-hidden ${
              selectedIndex === idx 
                ? 'border-brand ring-2 ring-brand/10' 
                : isDark ? 'border-[#383838] bg-[#2C2C2C] hover:border-[#444444]' : 'border-[#E6E6E6] bg-white hover:border-brand/30'
            }`}
          >
            {/* Header */}
            <div className={`px-3 py-1.5 border-b flex items-center justify-between transition-colors ${isDark ? 'border-[#383838]' : 'border-[#F5F5F5]'}`}>
              <div className="flex items-center gap-2">
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md text-white ${
                  item.type === 'COMP' ? 'bg-brand' : 
                  item.type === 'SET' ? 'bg-indigo-500' : 
                  item.type === 'STYLE' ? 'bg-pink-500' : 'bg-amber-500'
                }`}>
                  {item.type}
                </span>
                <span className="text-[9px] font-bold text-slate-400 truncate max-w-[120px]">{item.pageName}</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onFocusItem(item.id); }}
                className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${selectedIndex === idx ? 'bg-brand text-white' : isDark ? 'bg-[#383838] text-[#888888] hover:bg-[#444444]' : 'bg-slate-100 text-slate-400 hover:text-brand-hover'}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 line-through truncate max-w-[45%] font-medium">{item.elementName.original}</span>
                <svg className="w-2.5 h-2.5 text-brand shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                <span className={`text-[10px] font-black break-all ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.elementName.processed}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviewList;
