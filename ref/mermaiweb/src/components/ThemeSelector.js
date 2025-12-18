"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ThemeSelector;
const button_1 = require("@/components/ui/button");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const mermaidConfig_1 = require("@/lib/mermaidConfig");
const lucide_react_1 = require("lucide-react");
const i18n_1 = require("@/lib/i18n");
function ThemeSelector({ currentTheme, onThemeChange, lang }) {
    const t = i18n_1.translations[lang];
    const selectedTheme = mermaidConfig_1.mermaidThemes.find((t) => t.name === currentTheme) || mermaidConfig_1.mermaidThemes[0];
    const selectedThemeLabel = t.themes[selectedTheme.name] || selectedTheme.name;
    return (<dropdown_menu_1.DropdownMenu>
      <dropdown_menu_1.DropdownMenuTrigger asChild>
        <button_1.Button variant="outline" className="bg-white hover:bg-gray-50 border-gray-200">
          <lucide_react_1.Palette className="mr-2 h-4 w-4"/>
          {selectedThemeLabel}
        </button_1.Button>
      </dropdown_menu_1.DropdownMenuTrigger>
      <dropdown_menu_1.DropdownMenuContent align="end" className="w-64">
        <dropdown_menu_1.DropdownMenuLabel>{t.themeLabel}</dropdown_menu_1.DropdownMenuLabel>
        <dropdown_menu_1.DropdownMenuSeparator />
        {mermaidConfig_1.mermaidThemes.map((theme) => (<dropdown_menu_1.DropdownMenuItem key={theme.name} onClick={() => onThemeChange(theme.name)} className={`cursor-pointer ${currentTheme === theme.name ? 'bg-blue-50' : ''}`}>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border" style={{
                backgroundColor: theme.config.themeVariables.primaryColor,
                borderColor: theme.config.themeVariables.primaryBorderColor,
            }}/>
                <span className="font-medium">
                  {t.themes[theme.name] || theme.name}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {t.themeDescriptions[theme.name] || ''}
              </span>
            </div>
          </dropdown_menu_1.DropdownMenuItem>))}
      </dropdown_menu_1.DropdownMenuContent>
    </dropdown_menu_1.DropdownMenu>);
}
//# sourceMappingURL=ThemeSelector.js.map