import { useState, useRef, useEffect } from 'react';
import MermaidEditor from '@/components/MermaidEditor';
import MermaidPreview, { MermaidPreviewRef } from '@/components/MermaidPreview';
import ExportButton from '@/components/ExportButton';
import ThemeSelector from '@/components/ThemeSelector';
import TemplateSelector from '@/components/TemplateSelector';
import LanguageSelector from '@/components/LanguageSelector';
import { initializeMermaid, defaultMermaidCode } from '@/lib/mermaidConfig';
import { Language, translations } from '@/lib/i18n';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Index() {
  const [code, setCode] = useState(defaultMermaidCode);
  const [currentTheme, setCurrentTheme] = useState('modern-blue');
  
  // Initialize language based on browser preference
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language.toLowerCase();
      return browserLang.startsWith('zh') ? 'zh' : 'en';
    }
    return 'en';
  });
  
  const previewRef = useRef<MermaidPreviewRef>(null);
  const t = translations[lang];

  useEffect(() => {
    initializeMermaid(currentTheme);
  }, [currentTheme]);

  const handleThemeChange = (themeName: string) => {
    setCurrentTheme(themeName);
    initializeMermaid(themeName);
  };

  const handleTemplateSelect = (templateCode: string) => {
    setCode(templateCode);
  };

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="flex-none h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
            M
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 leading-none">
              {t.title}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <TemplateSelector onSelect={handleTemplateSelect} lang={lang} />
          <div className="h-4 w-px bg-gray-200 mx-1" />
          <ThemeSelector currentTheme={currentTheme} onThemeChange={handleThemeChange} lang={lang} />
          <div className="h-4 w-px bg-gray-200 mx-1" />
          <ExportButton previewRef={previewRef} lang={lang} />
          <div className="h-4 w-px bg-gray-200 mx-1" />
          <LanguageSelector currentLang={lang} onLangChange={setLang} />
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex gap-0 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          {/* Editor Pane */}
          <ResizablePanel defaultSize={50} minSize={20} className="bg-white">
            <div className="h-full w-full flex flex-col">
              <MermaidEditor code={code} onChange={setCode} />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-gray-200 hover:bg-blue-500 transition-colors" />
          
          {/* Preview Pane */}
          <ResizablePanel defaultSize={50} minSize={20} className="bg-gray-50/50">
            <div className="h-full w-full relative">
              <div className="absolute inset-2">
                <MermaidPreview ref={previewRef} code={code} theme={currentTheme} />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}