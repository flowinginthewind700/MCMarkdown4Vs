"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const mermaid_1 = __importDefault(require("mermaid"));
const button_1 = require("@/components/ui/button");
const alert_1 = require("@/components/ui/alert");
const fi_1 = require("react-icons/fi");
const utils_1 = require("@/lib/utils");
const mermaidConfig_1 = require("@/lib/mermaidConfig");
const MermaidPreview = (0, react_1.forwardRef)(({ code, theme }, ref) => {
    const containerRef = (0, react_1.useRef)(null);
    const [error, setError] = (0, react_1.useState)('');
    const [scale, setScale] = (0, react_1.useState)(1);
    const [position, setPosition] = (0, react_1.useState)({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = (0, react_1.useState)(false);
    const [dragStart, setDragStart] = (0, react_1.useState)({ x: 0, y: 0 });
    (0, react_1.useImperativeHandle)(ref, () => ({
        getSvgElement: () => {
            return containerRef.current?.querySelector('svg') || null;
        },
        getCurrentScale: () => scale,
    }));
    (0, react_1.useEffect)(() => {
        const renderDiagram = async () => {
            if (!containerRef.current || !code.trim()) {
                setError('');
                return;
            }
            try {
                setError('');
                const id = `mermaid-${Date.now()}`;
                // Find the configuration for the current theme name
                const selectedTheme = mermaidConfig_1.mermaidThemes.find((t) => t.name === theme) || mermaidConfig_1.mermaidThemes[0];
                // Configure mermaid with the specific theme settings
                mermaid_1.default.initialize({
                    startOnLoad: false,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    theme: selectedTheme.config.theme,
                    themeVariables: selectedTheme.config.themeVariables,
                    securityLevel: 'loose',
                    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                    flowchart: {
                        curve: 'basis',
                        padding: 20,
                        nodeSpacing: 50,
                        rankSpacing: 50,
                        diagramPadding: 20,
                        useMaxWidth: true,
                        htmlLabels: true, // Explicitly enable HTML labels for better styling
                    },
                });
                const { svg } = await mermaid_1.default.render(id, code);
                if (containerRef.current) {
                    containerRef.current.innerHTML = svg;
                    // Remove fixed width/height from SVG to allow scaling
                    const svgElement = containerRef.current.querySelector('svg');
                    if (svgElement) {
                        svgElement.style.width = '100%';
                        svgElement.style.height = '100%';
                        svgElement.style.maxWidth = '100%';
                    }
                }
            }
            catch (err) {
                setError(err instanceof Error ? err.message : '渲染错误');
                console.error('Mermaid render error:', err);
            }
        };
        renderDiagram();
    }, [code, theme]);
    const handleZoomIn = () => {
        setScale((prev) => Math.min(prev + 0.2, 10));
    };
    const handleZoomOut = () => {
        setScale((prev) => Math.max(prev - 0.2, 0.2));
    };
    const handleReset = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };
    const handleMouseDown = (e) => {
        if (e.button !== 0)
            return; // Only left click
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };
    const handleMouseMove = (e) => {
        if (isDragging) {
            e.preventDefault();
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };
    const handleMouseUp = () => {
        setIsDragging(false);
    };
    // Calculate background pattern style
    const backgroundSize = 20 * scale;
    const backgroundPosition = `${position.x}px ${position.y}px`;
    return (<div className="relative h-full w-full flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm group select-none">
        {/* Dot Grid Background */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-40" style={{
            backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)',
            backgroundSize: `${backgroundSize}px ${backgroundSize}px`,
            backgroundPosition: backgroundPosition,
            transition: isDragging ? 'none' : 'background-size 0.2s ease-out',
        }}/>

        {/* Floating Controls */}
        <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2">
          <div className="flex flex-col gap-1 bg-white/90 backdrop-blur p-1.5 rounded-lg shadow-lg border border-gray-100">
            <button_1.Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8 hover:bg-gray-100 text-gray-600" title="放大">
              <fi_1.FiZoomIn className="h-4 w-4"/>
            </button_1.Button>
            <button_1.Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8 hover:bg-gray-100 text-gray-600" title="缩小">
              <fi_1.FiZoomOut className="h-4 w-4"/>
            </button_1.Button>
            <div className="h-px w-full bg-gray-200 my-0.5"/>
            <button_1.Button variant="ghost" size="icon" onClick={handleReset} className="h-8 w-8 hover:bg-gray-100 text-gray-600" title="重置视图">
              <fi_1.FiMaximize2 className="h-4 w-4"/>
            </button_1.Button>
          </div>
          
          {/* Scale Indicator */}
          <div className="bg-white/90 backdrop-blur px-2 py-1 rounded-md shadow-sm border border-gray-100 text-xs font-medium text-gray-500 text-center">
            {Math.round(scale * 100)}%
          </div>
        </div>

        {/* Error Toast */}
        {error && (<div className="absolute top-4 left-4 right-4 z-30 animate-in slide-in-from-top-2 fade-in duration-300">
            <alert_1.Alert variant="destructive" className="bg-red-50/95 backdrop-blur border-red-200 shadow-lg max-w-2xl mx-auto">
              <fi_1.FiAlertCircle className="h-4 w-4"/>
              <alert_1.AlertDescription className="ml-2 font-medium">
                {error}
              </alert_1.AlertDescription>
            </alert_1.Alert>
          </div>)}

        {/* Canvas Area */}
        <div className={(0, utils_1.cn)("relative w-full h-full flex items-center justify-center overflow-hidden z-10", isDragging ? "cursor-grabbing" : "cursor-grab")} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onWheel={(e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                if (e.deltaY < 0)
                    handleZoomIn();
                else
                    handleZoomOut();
            }
        }}>
          <div ref={containerRef} style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }} className="mermaid-container min-w-[100px] min-h-[100px]"/>
        </div>
      </div>);
});
MermaidPreview.displayName = 'MermaidPreview';
exports.default = MermaidPreview;
//# sourceMappingURL=MermaidPreview.js.map