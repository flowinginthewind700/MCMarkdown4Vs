"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LanguageSelector;
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
function LanguageSelector({ currentLang, onLangChange }) {
    return (<dropdown_menu_1.DropdownMenu>
      <dropdown_menu_1.DropdownMenuTrigger asChild>
        <button_1.Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
          <lucide_react_1.Globe className="h-5 w-5"/>
        </button_1.Button>
      </dropdown_menu_1.DropdownMenuTrigger>
      <dropdown_menu_1.DropdownMenuContent align="end">
        <dropdown_menu_1.DropdownMenuItem onClick={() => onLangChange('zh')} className={currentLang === 'zh' ? 'bg-blue-50 text-blue-600' : ''}>
          中文
        </dropdown_menu_1.DropdownMenuItem>
        <dropdown_menu_1.DropdownMenuItem onClick={() => onLangChange('en')} className={currentLang === 'en' ? 'bg-blue-50 text-blue-600' : ''}>
          English
        </dropdown_menu_1.DropdownMenuItem>
      </dropdown_menu_1.DropdownMenuContent>
    </dropdown_menu_1.DropdownMenu>);
}
//# sourceMappingURL=LanguageSelector.js.map