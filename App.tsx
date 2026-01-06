
import React, { useState, useEffect, useCallback } from 'react';
import { ElementType, Scope, NamingTab, CaseFormat, PreviewItem, NamingTarget } from './types';
import { formatName, applyReplace } from './utils';
import Sidebar from './components/Sidebar';
import PreviewList from './components/PreviewList';
import Header from './components/Header';
import About from './components/About';

const App: React.FC = () => {
  // --- UI State ---
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [view, setView] = useState<'main' | 'about'>('main');
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');

  // --- Logic State ---
  const [elementType, setElementType] = useState<ElementType>(ElementType.COMPONENT);
  const [scope, setScope] = useState<Scope>(Scope.CURRENT_PAGE);
  const [activeTab, setActiveTab] = useState<NamingTab>(NamingTab.FORMAT);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSearchOptions, setFilterSearchOptions] = useState({ caseSensitive: false, useRegex: false });
  const [replaceSearchOptions, setReplaceSearchOptions] = useState({ caseSensitive: false, useRegex: false });

  // Config State
  const [formatConfigs, setFormatConfigs] = useState<Partial<Record<NamingTarget, CaseFormat>>>({
    nodeName: CaseFormat.CAMEL,
    propName: CaseFormat.CAMEL,
    propValue: CaseFormat.CAMEL,
    textStyle: CaseFormat.CAMEL,
    colorStyle: CaseFormat.CAMEL,
    effectStyle: CaseFormat.CAMEL,
    gridStyle: CaseFormat.CAMEL,
    colorVar: CaseFormat.CAMEL,
    stringVar: CaseFormat.CAMEL,
    boolVar: CaseFormat.CAMEL,
    numberVar: CaseFormat.CAMEL,
  });
  
  const [selectedFormatTargets, setSelectedFormatTargets] = useState<Set<NamingTarget>>(new Set(['nodeName']));
  const [focusedFormatTarget, setFocusedFormatTarget] = useState<NamingTarget>('nodeName');
  const [selectedReplaceTargets, setSelectedReplaceTargets] = useState<Set<NamingTarget>>(new Set(['nodeName']));
  const [replaceState, setReplaceState] = useState({ from: '', to: '' });

  // Data State
  const [rawItems, setRawItems] = useState<any[]>([]); // Items from Figma
  const [previewItems, setPreviewItems] = useState<PreviewItem[]>([]); // Processed items for display
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Figma Communication ---

  const postToPlugin = useCallback((type: string, payload?: any) => {
    parent.postMessage({ pluginMessage: { type, payload } }, '*');
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;
      if (!msg) return;

      if (msg.type === 'SET_NODES') {
        setRawItems(msg.payload);
        setIsProcessing(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Fetch nodes when scope/type changes
  useEffect(() => {
    setIsProcessing(true);
    setRawItems([]); // Clear previous
    postToPlugin('GET_NODES', { type: elementType, scope });
  }, [elementType, scope, postToPlugin]);

  // Handle element type switching UI logic
  useEffect(() => {
    let initialTarget: NamingTarget = 'nodeName';
    if (elementType === ElementType.STYLE) initialTarget = 'colorStyle'; // Default to color for styles
    if (elementType === ElementType.VARIABLE) initialTarget = 'colorVar';
    
    setFocusedFormatTarget(initialTarget);
    setSelectedFormatTargets(new Set([initialTarget]));
    setSelectedReplaceTargets(new Set([initialTarget]));
    setSearchQuery('');
    setReplaceState({ from: '', to: '' });
  }, [elementType]);

  // --- Preview Logic ---

  const getTargetKey = useCallback((item: any): NamingTarget | null => {
    if (item.type === 'COMP') return 'nodeName';
    if (item.type === 'STYLE') {
      if (item.subType === 'COLOR') return 'colorStyle';
      if (item.subType === 'TEXT') return 'textStyle';
      if (item.subType === 'EFFECT') return 'effectStyle';
      if (item.subType === 'GRID') return 'gridStyle';
      // Fallback
      return 'textStyle';
    }
    if (item.type === 'VAR') {
      if (item.subType === 'COLOR') return 'colorVar';
      if (item.subType === 'STRING') return 'stringVar';
      if (item.subType === 'BOOL') return 'boolVar';
      if (item.subType === 'NUMBER') return 'numberVar';
      return 'stringVar';
    }
    return null;
  }, []);

  const updatePreview = useCallback(() => {
    if (!rawItems) {
      setPreviewItems([]);
      return;
    }

    const processed = rawItems
      .filter(item => {
        // Filter Logic
        if (!searchQuery) return true;
        const flags = filterSearchOptions.caseSensitive ? '' : 'i';
        const pattern = filterSearchOptions.useRegex ? searchQuery : searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        try {
          return new RegExp(pattern, flags).test(item.name);
        } catch {
          return item.name.toLowerCase().includes(searchQuery.toLowerCase());
        }
      })
      .map(item => {
        let newName = item.name;
        const targetKey = getTargetKey(item);
        
        if (targetKey) {
          if (activeTab === NamingTab.FORMAT) {
            if (selectedFormatTargets.has(targetKey)) {
              newName = formatName(item.name, formatConfigs[targetKey] || CaseFormat.NONE);
            }
          } else {
            // Replace Tab
            if (selectedReplaceTargets.has(targetKey)) {
              newName = applyReplace(
                item.name, 
                replaceState.from, 
                replaceState.to, 
                replaceSearchOptions.useRegex, 
                replaceSearchOptions.caseSensitive
              );
            }
          }
        }

        return {
          id: item.id,
          type: item.type,
          subType: item.subType,
          pageName: item.page,
          elementName: { original: item.name, processed: newName },
          properties: [],
          nodeType: item.type
        };
      });

    setPreviewItems(processed as PreviewItem[]);
    // Reset selection if out of bounds
    setSelectedIndex(prev => Math.min(prev, Math.max(0, processed.length - 1)));

  }, [
    rawItems,
    activeTab, 
    searchQuery, 
    filterSearchOptions,
    replaceSearchOptions,
    formatConfigs, 
    selectedFormatTargets, 
    selectedReplaceTargets, 
    replaceState,
    getTargetKey
  ]);

  useEffect(() => {
    // Debounce preview updates slightly to avoid jank on heavy typing
    const timer = setTimeout(updatePreview, 50);
    return () => clearTimeout(timer);
  }, [updatePreview]);

  // --- Actions ---

  const handleApplySelected = () => {
    if (!previewItems[selectedIndex]) return;
    const item = previewItems[selectedIndex];
    
    // Only apply if changed
    if (item.elementName.original === item.elementName.processed) return;

    setIsProcessing(true);
    postToPlugin('APPLY_CHANGES', {
      elementType,
      scope,
      changes: [{ id: item.id, name: item.elementName.processed }]
    });
  };

  const handleApplyAll = () => {
    const changes = previewItems
      .filter(i => i.elementName.original !== i.elementName.processed)
      .map(i => ({ id: i.id, name: i.elementName.processed }));

    if (changes.length === 0) return;

    setIsProcessing(true);
    postToPlugin('APPLY_CHANGES', {
      elementType,
      scope,
      changes
    });
  };

  const handleFocus = (id: string) => {
    postToPlugin('FOCUS_NODE', { id });
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-colors duration-200 ${theme === 'dark' ? 'bg-[#2C2C2C] text-[#E6E6E6]' : 'bg-[#FFFFFF] text-[#333333]'}`}>
      <Header 
        theme={theme}
        language={language} 
        onToggleLanguage={() => setLanguage(l => l === 'zh' ? 'en' : 'zh')} 
        onToggleTheme={toggleTheme}
        onOpenAbout={() => setView('about')}
      />
      
      {view === 'main' ? (
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            theme={theme}
            language={language}
            elementType={elementType}
            setElementType={setElementType}
            scope={scope}
            setScope={setScope}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterSearchOptions={filterSearchOptions}
            setFilterSearchOptions={setFilterSearchOptions}
            replaceSearchOptions={replaceSearchOptions}
            setReplaceSearchOptions={setReplaceSearchOptions}
            formatConfigs={formatConfigs}
            selectedFormatTargets={selectedFormatTargets}
            focusedFormatTarget={focusedFormatTarget}
            setFocusedFormatTarget={setFocusedFormatTarget}
            toggleFormatTarget={(t) => {
              const next = new Set(selectedFormatTargets);
              if (next.has(t)) next.delete(t); else next.add(t);
              setSelectedFormatTargets(next);
              setFocusedFormatTarget(t);
            }}
            updateFormatForTarget={(f) => setFormatConfigs(prev => ({ ...prev, [focusedFormatTarget]: f }))}
            selectedReplaceTargets={selectedReplaceTargets}
            toggleReplaceTarget={(t) => {
              const next = new Set(selectedReplaceTargets);
              if (next.has(t)) next.delete(t); else next.add(t);
              setSelectedReplaceTargets(next);
            }}
            replaceState={replaceState}
            setReplaceState={setReplaceState}
            onPrev={() => setSelectedIndex(i => Math.max(0, i - 1))}
            onNext={() => setSelectedIndex(i => Math.min(previewItems.length - 1, i + 1))}
            onReplace={handleApplySelected}
            onReplaceAll={handleApplyAll}
            canAction={previewItems.length > 0}
            isProcessing={isProcessing}
            currentIndex={selectedIndex}
            totalCount={previewItems.length}
          />
          <PreviewList
            theme={theme}
            language={language}
            items={previewItems}
            selectedIndex={selectedIndex}
            onSelectItem={setSelectedIndex}
            onFocusItem={handleFocus}
          />
        </div>
      ) : (
        <About 
          theme={theme} 
          language={language} 
          onBack={() => setView('main')} 
        />
      )}
    </div>
  );
};

export default App;
