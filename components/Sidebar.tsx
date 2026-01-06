
import React from 'react';
import { ElementType, Scope, NamingTab, CaseFormat, NamingTarget } from '../types';
import { translations } from '../locales';

interface SidebarProps {
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  elementType: ElementType;
  setElementType: (t: ElementType) => void;
  scope: Scope;
  setScope: (s: Scope) => void;
  activeTab: NamingTab;
  setActiveTab: (t: NamingTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterSearchOptions: { caseSensitive: boolean; useRegex: boolean };
  setFilterSearchOptions: (o: any) => void;
  replaceSearchOptions: { caseSensitive: boolean; useRegex: boolean };
  setReplaceSearchOptions: (o: any) => void;
  formatConfigs: Partial<Record<NamingTarget, CaseFormat>>;
  selectedFormatTargets: Set<NamingTarget>;
  focusedFormatTarget: NamingTarget;
  setFocusedFormatTarget: (t: NamingTarget) => void;
  toggleFormatTarget: (t: NamingTarget) => void;
  updateFormatForTarget: (f: CaseFormat) => void;
  selectedReplaceTargets: Set<NamingTarget>;
  toggleReplaceTarget: (t: NamingTarget) => void;
  replaceState: { from: string, to: string };
  setReplaceState: (s: any) => void;
  onPrev: () => void;
  onNext: () => void;
  onReplace: () => void;
  onReplaceAll: () => void;
  canAction: boolean;
  isProcessing: boolean;
  currentIndex: number;
  totalCount: number;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { theme, language, scope, setScope, activeTab, setActiveTab, elementType, setElementType } = props;
  const isDark = theme === 'dark';
  const t = translations[language].sidebar;

  const formats = [
    { value: CaseFormat.CAMEL, label: 'camel' },
    { value: CaseFormat.SNAKE, label: 'snake' },
    { value: CaseFormat.KEBAB, label: 'kebab' },
    { value: CaseFormat.PASCAL, label: 'Pascal' },
    { value: CaseFormat.TITLE, label: 'Title' },
    { value: CaseFormat.UPPER, label: 'UPPER' },
  ];

  const targetGroups: Record<ElementType, NamingTarget[]> = {
    [ElementType.COMPONENT]: ['nodeName', 'propName', 'propValue'],
    [ElementType.STYLE]: ['textStyle', 'colorStyle', 'effectStyle', 'gridStyle'],
    [ElementType.VARIABLE]: ['colorVar', 'stringVar', 'boolVar', 'numberVar'],
  };

  const currentTargets = targetGroups[elementType];
  const isSearchDisabled = elementType !== ElementType.COMPONENT;

  const inputClasses = `w-full h-8 px-2 border text-[14px] outline-none transition-all ${
    isDark 
      ? 'bg-[#383838] border-[#444444] text-[#E6E6E6] focus:border-brand focus:ring-1 focus:ring-brand/30' 
      : 'bg-white border-[#E6E6E6] text-slate-700 focus:border-brand focus:ring-1 focus:ring-brand/30'
  }`;

  return (
    <div className={`w-[260px] border-r flex flex-col shrink-0 transition-colors duration-200 ${isDark ? 'bg-[#2C2C2C] border-[#444444]' : 'bg-white border-[#E6E6E6]'}`}>
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        
        {/* Section 1: Range */}
        <section className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[13px] uppercase tracking-widest">
            <span>1. {t.range}</span>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {[ElementType.COMPONENT, ElementType.STYLE, ElementType.VARIABLE].map(type => (
              <button
                key={type}
                onClick={() => setElementType(type)}
                className={`px-3 py-1 rounded-md text-[13px] font-black uppercase border-2 transition-all ${
                  elementType === type 
                    ? 'border-brand bg-brand/10 text-brand' 
                    : `${isDark ? 'border-[#444444] bg-[#383838] text-[#888888]' : 'border-[#F5F5F5] bg-white text-slate-400'} hover:border-[#E6E6E6]`
                }`}
              >
                {type === ElementType.COMPONENT ? t.comp : type === ElementType.STYLE ? t.style : t.variable}
              </button>
            ))}
          </div>

          <div className={`flex p-0.5 rounded-lg  ${isDark ? 'bg-[#383838]' : 'bg-slate-100'}`}>
            <button 
              onClick={() => setScope(Scope.CURRENT_PAGE)}
              className={`flex-1 flex py-1 items-center justify-center rounded-md text-[13px] font-bold transition-all ${scope === Scope.CURRENT_PAGE ? 'bg-brand text-white shadow-sm hover:bg-brand-hover' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t.currentPage}
            </button>
            <button 
              onClick={() => setScope(Scope.ALL_PAGES)}
              className={`flex-1 flex py-1 items-center justify-center rounded-md text-[13px] font-bold transition-all ${scope === Scope.ALL_PAGES ? 'bg-brand text-white shadow-sm hover:bg-brand-hover' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t.allPages}
            </button>
          </div>

          <div className={`relative transition-all duration-200 ${isSearchDisabled ? 'opacity-30 pointer-events-none' : ''}`}>
            <input 
              type="text"
              disabled={isSearchDisabled}
              placeholder={isSearchDisabled ? t.filterDisabled : t.filterHint}
              value={props.searchQuery}
              onChange={e => props.setSearchQuery(e.target.value)}
              className={`${inputClasses} rounded-md pr-12`}
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
              <button 
                onClick={() => props.setFilterSearchOptions({...props.filterSearchOptions, caseSensitive: !props.filterSearchOptions.caseSensitive})}
                className={`w-5 h-5 flex items-center justify-center rounded text-[14px] font-black border ${props.filterSearchOptions.caseSensitive ? 'border-brand text-brand bg-brand/10' : isDark ? 'border-[#444444] text-[#888888]' : 'border-transparent text-slate-300 hover:text-slate-500'}`}
                title="Filter Case Sensitive"
              >Aa</button>
              <button 
                onClick={() => props.setFilterSearchOptions({...props.filterSearchOptions, useRegex: !props.filterSearchOptions.useRegex})}
                className={`w-5 h-5 flex items-center justify-center rounded text-[14px] font-black border ${props.filterSearchOptions.useRegex ? 'border-brand text-brand bg-brand/10' : isDark ? 'border-[#444444] text-[#888888]' : 'border-transparent text-slate-300 hover:text-slate-500'}`}
                title="Filter Use Regex"
              >.*</button>
            </div>
          </div>
        </section>

        {/* Section 2: Mode */}
        <section className="space-y-3">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[13px] uppercase tracking-widest">
            <span>2. {t.mode}</span>
          </div>

          <div className={`p-0.5 rounded-lg flex ${isDark ? 'bg-[#383838]' : 'bg-slate-100'}`}>
            <button 
              onClick={() => setActiveTab(NamingTab.FORMAT)}
              className={`flex-1 py-1 text-[13px] font-bold rounded-md transition-all ${activeTab === NamingTab.FORMAT ? 'bg-brand shadow-sm text-white' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t.formatTab}
            </button>
            <button 
              onClick={() => setActiveTab(NamingTab.REPLACE)}
              className={`flex-1 py-1 text-[13px] font-bold rounded-md transition-all ${activeTab === NamingTab.REPLACE ? 'bg-brand shadow-sm text-white' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t.replaceTab}
            </button>
          </div>

          {activeTab === NamingTab.FORMAT ? (
            <div className="space-y-3">
              <div className={`grid gap-1.5 ${currentTargets.length > 3 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {currentTargets.map(targetKey => (
                  <TargetCard 
                    key={targetKey}
                    theme={theme}
                    label={(t.targets as any)[targetKey]} 
                    sub={props.selectedFormatTargets.has(targetKey) ? props.formatConfigs[targetKey] : t.maintain}
                    checked={props.selectedFormatTargets.has(targetKey)}
                    focused={props.focusedFormatTarget === targetKey}
                    onClick={() => {
                      if (!props.selectedFormatTargets.has(targetKey)) props.toggleFormatTarget(targetKey);
                      else props.setFocusedFormatTarget(targetKey);
                    }}
                    onToggle={() => props.toggleFormatTarget(targetKey)}
                  />
                ))}
              </div>

              <div className={`p-1.5 border rounded-lg grid grid-cols-2 gap-1 ${isDark ? 'bg-[#383838]/30 border-[#444444]' : 'bg-slate-50 border-slate-100'}`}>
                {formats.map(f => (
                  <button
                    key={f.value}
                    onClick={() => props.updateFormatForTarget(f.value)}
                    className={`px-2 h-7 rounded-md text-[12px] font-black border-2 transition-all ${
                      props.formatConfigs[props.focusedFormatTarget] === f.value 
                        ? 'border-brand bg-brand text-white hover:bg-brand-hover' 
                        : `${isDark ? 'border-[#444444] bg-[#2C2C2C] text-[#888888]' : 'border-[#E6E6E6] bg-white text-slate-500'} hover:border-brand/50`
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                 <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{t.applyTo}</label>
                 <div className={`grid gap-1 ${currentTargets.length > 3 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {currentTargets.map(targetKey => (
                      <SimpleCheck 
                        key={targetKey}
                        theme={theme}
                        label={(t.targets as any)[targetKey]} 
                        checked={props.selectedReplaceTargets.has(targetKey)} 
                        onClick={() => props.toggleReplaceTarget(targetKey)} 
                      />
                    ))}
                 </div>
              </div>
              <div className="flex flex-col">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder={t.findHint} 
                    value={props.replaceState.from}
                    onChange={e => props.setReplaceState({...props.replaceState, from: e.target.value})}
                    className={`${inputClasses} rounded-t-md relative focus:z-10 pr-12`}
                  />
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 z-20">
                    <button 
                      onClick={() => props.setReplaceSearchOptions({...props.replaceSearchOptions, caseSensitive: !props.replaceSearchOptions.caseSensitive})}
                      className={`w-5 h-5 flex items-center justify-center rounded text-[14px] font-black border ${props.replaceSearchOptions.caseSensitive ? 'border-brand text-brand bg-brand/10' : isDark ? 'border-[#444444] text-[#888888]' : 'border-transparent text-slate-300 hover:text-slate-500'}`}
                      title="Replace Case Sensitive"
                    >Aa</button>
                    <button 
                      onClick={() => props.setReplaceSearchOptions({...props.replaceSearchOptions, useRegex: !props.replaceSearchOptions.useRegex})}
                      className={`w-5 h-5 flex items-center justify-center rounded text-[14px] font-black border ${props.replaceSearchOptions.useRegex ? 'border-brand text-brand bg-brand/10' : isDark ? 'border-[#444444] text-[#888888]' : 'border-transparent text-slate-300 hover:text-slate-500'}`}
                      title="Replace Use Regex"
                    >.*</button>
                  </div>
                </div>
                <input 
                  type="text" 
                  placeholder={t.replaceHint} 
                  value={props.replaceState.to}
                  onChange={e => props.setReplaceState({...props.replaceState, to: e.target.value})}
                  className={`${inputClasses} rounded-b-md -mt-[1px] relative focus:z-10`}
                />
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Action Footer */}
      <div className={`p-3 border-t space-y-2 ${isDark ? 'border-[#444444]' : 'border-[#E6E6E6]'}`}>
        <div className="flex gap-2">
          <div className={`flex items-center h-8 border rounded-lg overflow-hidden ${isDark ? 'border-[#444444] bg-[#383838]' : 'border-[#E6E6E6] bg-slate-50'}`}>
            <button onClick={props.onPrev} className="w-8 h-full flex items-center justify-center hover:bg-slate-100 transition-colors border-r border-[#E6E6E6]/10">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="px-2 text-[12px] font-black min-w-[50px] text-center text-slate-500">
              {props.totalCount > 0 ? `${props.currentIndex + 1} / ${props.totalCount}` : '-'}
            </div>
            <button onClick={props.onNext} className="w-8 h-full flex items-center justify-center hover:bg-slate-100 transition-colors border-l border-[#E6E6E6]/10">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <button 
            onClick={props.onReplace} 
            disabled={!props.canAction} 
            className={`flex-1 h-8 border rounded-lg text-[12px] font-black transition-all ${isDark ? 'border-[#444444] text-[#888888] hover:bg-[#383838]' : 'border-[#E6E6E6] text-slate-500 hover:bg-slate-50'} disabled:opacity-30`}
          >
            {t.replace.toUpperCase()}
          </button>
        </div>
        <button 
          onClick={props.onReplaceAll} 
          disabled={!props.canAction || props.isProcessing} 
          className={`w-full h-9 rounded-lg text-[13px] font-black text-white shadow-md transition-all active:scale-[0.98] ${props.isProcessing ? 'bg-brand/50' : 'bg-brand hover:bg-brand-hover'} disabled:opacity-30`}
        >
          {t.replaceAll.toUpperCase()} ({props.totalCount})
        </button>
      </div>
    </div>
  );
};

const TargetCard = ({ theme, label, sub, checked, focused, onClick, onToggle }: any) => {
  const isDark = theme === 'dark';
  return (
    <div 
      onClick={onClick}
      className={`p-2 rounded-lg border-2 transition-all cursor-pointer select-none h-16 flex flex-col justify-between relative ${
        focused 
          ? 'border-brand bg-brand/5' 
          : `${isDark ? 'border-[#444444] bg-[#383838]/50' : 'border-[#F5F5F5] bg-white'} hover:border-[#E6E6E6]`
      }`}
    >
      <div 
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={`w-3.5 h-3.5 shrink-0 rounded-sm border flex items-center justify-center transition-all ${
          checked ? 'bg-brand border-brand' : isDark ? 'bg-[#2C2C2C] border-[#555555]' : 'bg-white border-slate-300'
        }`}
      >
          {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M5 13l4 4L19 7" /></svg>}
      </div>
      <div className="space-y-0.5">
        <div className={`text-[12px] font-black leading-tight ${checked ? (isDark ? 'text-white' : 'text-slate-800') : 'text-slate-400'}`}>{label}</div>
        <div className={`text-[9px] font-bold truncate ${checked ? 'text-brand' : 'text-slate-300'}`}>{sub}</div>
      </div>
    </div>
  );
};

const SimpleCheck = ({ theme, label, checked, onClick }: any) => {
  const isDark = theme === 'dark';
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-1.5 p-1.5 rounded-md border-2 transition-all cursor-pointer h-8 ${
        checked ? 'border-brand bg-brand/5' : `${isDark ? 'border-[#444444] bg-[#383838]/50' : 'border-[#F5F5F5] bg-white'}`
      }`}
    >
      <div className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center ${checked ? 'bg-brand border-brand' : 'bg-white border-slate-300'}`}>
          {checked && <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M5 13l4 4L19 7" /></svg>}
      </div>
      <span className={`text-[14px] font-black truncate ${checked ? (isDark ? 'text-white' : 'text-slate-800') : 'text-slate-500'}`}>{label}</span>
    </div>
  );
};

export default Sidebar;
