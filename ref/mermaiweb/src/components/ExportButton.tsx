import { Button } from '@/components/ui/button';
import { toPng } from 'html-to-image';
import { FiDownload } from 'react-icons/fi';
import { toast } from 'sonner';
import { MermaidPreviewRef } from './MermaidPreview';
import { Language, translations } from '@/lib/i18n';

interface ExportButtonProps {
  previewRef: React.RefObject<MermaidPreviewRef>;
  lang: Language;
}

export default function ExportButton({ previewRef, lang }: ExportButtonProps) {
  const t = translations[lang];

  const handleExport = async () => {
    if (!previewRef.current) {
      toast.error(t.noContent);
      return;
    }

    try {
      const svgElement = previewRef.current.getSvgElement();
      if (!svgElement) {
        toast.error(t.noValidContent);
        return;
      }

      const currentScale = previewRef.current.getCurrentScale();
      
      toast.info(t.generating);

      // 使用当前缩放比例来计算导出的分辨率
      const dataUrl = await toPng(svgElement, {
        quality: 1,
        pixelRatio: currentScale * 2, // 使用当前缩放比例 * 2 来提高清晰度
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `mermaid-diagram-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      toast.success(`${t.exportSuccess} (${Math.round(currentScale * 100)}%)`);
    } catch (err) {
      console.error('Export error:', err);
      toast.error(t.exportError);
    }
  };

  return (
    <Button
      onClick={handleExport}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
    >
      <FiDownload className="mr-2 h-4 w-4" />
      {t.exportPng}
    </Button>
  );
}