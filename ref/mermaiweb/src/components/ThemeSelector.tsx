import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mermaidThemes, MermaidTheme } from '@/lib/mermaidConfig';
import { Palette } from 'lucide-react';
import { Language, translations } from '@/lib/i18n';

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (themeName: string) => void;
  lang: Language;
}

export default function ThemeSelector({ currentTheme, onThemeChange, lang }: ThemeSelectorProps) {
  const t = translations[lang];
  const selectedTheme = mermaidThemes.find((t) => t.name === currentTheme) || mermaidThemes[0];
  const selectedThemeLabel = t.themes[selectedTheme.name as keyof typeof t.themes] || selectedTheme.name;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-white hover:bg-gray-50 border-gray-200"
        >
          <Palette className="mr-2 h-4 w-4" />
          {selectedThemeLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>{t.themeLabel}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mermaidThemes.map((theme: MermaidTheme) => (
          <DropdownMenuItem
            key={theme.name}
            onClick={() => onThemeChange(theme.name)}
            className={`cursor-pointer ${
              currentTheme === theme.name ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{
                    backgroundColor: theme.config.themeVariables.primaryColor,
                    borderColor: theme.config.themeVariables.primaryBorderColor,
                  }}
                />
                <span className="font-medium">
                  {t.themes[theme.name as keyof typeof t.themes] || theme.name}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {t.themeDescriptions[theme.name as keyof typeof t.themeDescriptions] || ''}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}