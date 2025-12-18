"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Index;
const react_1 = require("react");
const MermaidEditor_1 = __importDefault(require("@/components/MermaidEditor"));
const MermaidPreview_1 = __importDefault(require("@/components/MermaidPreview"));
const ExportButton_1 = __importDefault(require("@/components/ExportButton"));
const ThemeSelector_1 = __importDefault(require("@/components/ThemeSelector"));
const TemplateSelector_1 = __importDefault(require("@/components/TemplateSelector"));
const LanguageSelector_1 = __importDefault(require("@/components/LanguageSelector"));
const mermaidConfig_1 = require("@/lib/mermaidConfig");
const i18n_1 = require("@/lib/i18n");
const resizable_1 = require("@/components/ui/resizable");
function Index() {
    const [code, setCode] = (0, react_1.useState)(mermaidConfig_1.defaultMermaidCode);
    const [currentTheme, setCurrentTheme] = (0, react_1.useState)('modern-blue');
    // Initialize language based on browser preference
    const [lang, setLang] = (0, react_1.useState)(() => {
        if (typeof window !== 'undefined') {
            const browserLang = navigator.language.toLowerCase();
            return browserLang.startsWith('zh') ? 'zh' : 'en';
        }
        return 'en';
    });
    const previewRef = (0, react_1.useRef)(null);
    const t = i18n_1.translations[lang];
    (0, react_1.useEffect)(() => {
        (0, mermaidConfig_1.initializeMermaid)(currentTheme);
    }, [currentTheme]);
    const handleThemeChange = (themeName) => {
        setCurrentTheme(themeName);
        (0, mermaidConfig_1.initializeMermaid)(themeName);
    };
    const handleTemplateSelect = (templateCode) => {
        setCode(templateCode);
    };
    return (<div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
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
          <TemplateSelector_1.default onSelect={handleTemplateSelect} lang={lang}/>
          <div className="h-4 w-px bg-gray-200 mx-1"/>
          <ThemeSelector_1.default currentTheme={currentTheme} onThemeChange={handleThemeChange} lang={lang}/>
          <div className="h-4 w-px bg-gray-200 mx-1"/>
          <ExportButton_1.default previewRef={previewRef} lang={lang}/>
          <div className="h-4 w-px bg-gray-200 mx-1"/>
          <LanguageSelector_1.default currentLang={lang} onLangChange={setLang}/>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex gap-0 overflow-hidden">
        <resizable_1.ResizablePanelGroup direction="horizontal" className="h-full w-full">
          {/* Editor Pane */}
          <resizable_1.ResizablePanel defaultSize={50} minSize={20} className="bg-white">
            <div className="h-full w-full flex flex-col">
              <MermaidEditor_1.default code={code} onChange={setCode}/>
            </div>
          </resizable_1.ResizablePanel>
          
          <resizable_1.ResizableHandle withHandle className="bg-gray-200 hover:bg-blue-500 transition-colors"/>
          
          {/* Preview Pane */}
          <resizable_1.ResizablePanel defaultSize={50} minSize={20} className="bg-gray-50/50">
            <div className="h-full w-full relative">
              <div className="absolute inset-2">
                <MermaidPreview_1.default ref={previewRef} code={code} theme={currentTheme}/>
              </div>
            </div>
          </resizable_1.ResizablePanel>
        </resizable_1.ResizablePanelGroup>
      </main>
    </div>);
}
//# sourceMappingURL=Index.js.map