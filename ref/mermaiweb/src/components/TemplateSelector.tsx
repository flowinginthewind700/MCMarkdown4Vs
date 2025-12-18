import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exampleTemplates } from "@/lib/mermaidConfig";
import { LayoutTemplate } from "lucide-react";
import { Language, translations } from "@/lib/i18n";

interface TemplateSelectorProps {
  onSelect: (code: string) => void;
  lang: Language;
}

export default function TemplateSelector({ onSelect, lang }: TemplateSelectorProps) {
  const t = translations[lang];

  return (
    <div className="flex items-center gap-2">
      <Select onValueChange={onSelect}>
        <SelectTrigger className="w-[180px] h-9 bg-white border-gray-200 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2 text-gray-600 truncate">
            <LayoutTemplate className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              <SelectValue placeholder={t.selectTemplate} />
            </span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {exampleTemplates.map((template) => (
            <SelectItem 
              key={template.name} 
              value={template.code}
              className="cursor-pointer"
            >
              {/* Use the template name as key to look up translation, fallback to name itself */}
              {t.templates[template.name as keyof typeof t.templates] || template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}