import { Button } from '@/components/ui/button';
import { Language } from '@/lib/i18n';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LanguageSelectorProps {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
}

export default function LanguageSelector({ currentLang, onLangChange }: LanguageSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => onLangChange('zh')}
          className={currentLang === 'zh' ? 'bg-blue-50 text-blue-600' : ''}
        >
          中文
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onLangChange('en')}
          className={currentLang === 'en' ? 'bg-blue-50 text-blue-600' : ''}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}