"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_react_swc_1 = __importDefault(require("@vitejs/plugin-react-swc"));
const path_1 = __importDefault(require("path"));
const vite_plugin_source_locator_1 = require("@metagptx/vite-plugin-source-locator");
// https://vitejs.dev/config/
exports.default = (0, vite_1.defineConfig)(({ mode }) => ({
    plugins: [
        (0, vite_plugin_source_locator_1.viteSourceLocator)({
            prefix: 'mgx',
        }),
        (0, plugin_react_swc_1.default)(),
    ],
    server: {
        watch: { usePolling: true, interval: 800 /* 300~1500 */ },
    },
    resolve: {
        alias: {
            '@': path_1.default.resolve(__dirname, './src'),
        },
    },
}));
//# sourceMappingURL=vite.config.js.map