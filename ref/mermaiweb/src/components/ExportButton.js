"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExportButton;
const button_1 = require("@/components/ui/button");
const html_to_image_1 = require("html-to-image");
const fi_1 = require("react-icons/fi");
const sonner_1 = require("sonner");
const i18n_1 = require("@/lib/i18n");
function ExportButton({ previewRef, lang }) {
    const t = i18n_1.translations[lang];
    const handleExport = async () => {
        if (!previewRef.current) {
            sonner_1.toast.error(t.noContent);
            return;
        }
        try {
            const svgElement = previewRef.current.getSvgElement();
            if (!svgElement) {
                sonner_1.toast.error(t.noValidContent);
                return;
            }
            const currentScale = previewRef.current.getCurrentScale();
            sonner_1.toast.info(t.generating);
            // 使用当前缩放比例来计算导出的分辨率
            const dataUrl = await (0, html_to_image_1.toPng)(svgElement, {
                quality: 1,
                pixelRatio: currentScale * 2, // 使用当前缩放比例 * 2 来提高清晰度
                backgroundColor: '#ffffff',
            });
            const link = document.createElement('a');
            link.download = `mermaid-diagram-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
            sonner_1.toast.success(`${t.exportSuccess} (${Math.round(currentScale * 100)}%)`);
        }
        catch (err) {
            console.error('Export error:', err);
            sonner_1.toast.error(t.exportError);
        }
    };
    return (<button_1.Button onClick={handleExport} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
      <fi_1.FiDownload className="mr-2 h-4 w-4"/>
      {t.exportPng}
    </button_1.Button>);
}
//# sourceMappingURL=ExportButton.js.map