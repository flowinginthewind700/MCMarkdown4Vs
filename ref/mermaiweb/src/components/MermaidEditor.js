"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MermaidEditor;
const react_1 = require("react");
function MermaidEditor({ code, onChange }) {
    const textareaRef = (0, react_1.useRef)(null);
    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.currentTarget.selectionStart;
            const end = e.currentTarget.selectionEnd;
            const value = e.currentTarget.value;
            const newValue = value.substring(0, start) + '  ' + value.substring(end);
            onChange(newValue);
            // Restore cursor position
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
                }
            }, 0);
        }
    };
    return (<div className="h-full flex flex-col">
      <div className="flex-none p-3 border-b bg-gray-50/50 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          代码编辑
        </h2>
        <span className="text-xs text-gray-400">Auto-saving</span>
      </div>
      <div className="flex-1 relative">
        <textarea ref={textareaRef} value={code} onChange={(e) => onChange(e.target.value)} onKeyDown={handleKeyDown} className="absolute inset-0 w-full h-full p-4 font-mono text-sm resize-none focus:outline-none bg-white text-gray-800 leading-relaxed" spellCheck={false} placeholder="在这里输入 Mermaid 代码..."/>
      </div>
    </div>);
}
//# sourceMappingURL=MermaidEditor.js.map