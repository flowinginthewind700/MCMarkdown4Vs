"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toast = exports.Toaster = void 0;
const next_themes_1 = require("next-themes");
const sonner_1 = require("sonner");
Object.defineProperty(exports, "toast", { enumerable: true, get: function () { return sonner_1.toast; } });
const Toaster = ({ ...props }) => {
    const { theme = 'system' } = (0, next_themes_1.useTheme)();
    return (<sonner_1.Toaster theme={theme} className="toaster group" toastOptions={{
            classNames: {
                toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
                description: 'group-[.toast]:text-muted-foreground',
                actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
                cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
            },
        }} {...props}/>);
};
exports.Toaster = Toaster;
//# sourceMappingURL=sonner.js.map