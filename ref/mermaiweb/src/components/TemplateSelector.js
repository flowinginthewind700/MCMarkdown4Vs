"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TemplateSelector;
const select_1 = require("@/components/ui/select");
const mermaidConfig_1 = require("@/lib/mermaidConfig");
const lucide_react_1 = require("lucide-react");
const i18n_1 = require("@/lib/i18n");
function TemplateSelector({ onSelect, lang }) {
    const t = i18n_1.translations[lang];
    return (<div className="flex items-center gap-2">
      <select_1.Select onValueChange={onSelect}>
        <select_1.SelectTrigger className="w-[180px] h-9 bg-white border-gray-200 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2 text-gray-600 truncate">
            <lucide_react_1.LayoutTemplate className="h-4 w-4 flex-shrink-0"/>
            <span className="truncate">
              <select_1.SelectValue placeholder={t.selectTemplate}/>
            </span>
          </div>
        </select_1.SelectTrigger>
        <select_1.SelectContent>
          {mermaidConfig_1.exampleTemplates.map((template) => (<select_1.SelectItem key={template.name} value={template.code} className="cursor-pointer">
              {/* Use the template name as key to look up translation, fallback to name itself */}
              {t.templates[template.name] || template.name}
            </select_1.SelectItem>))}
        </select_1.SelectContent>
      </select_1.Select>
    </div>);
}
//# sourceMappingURL=TemplateSelector.js.map