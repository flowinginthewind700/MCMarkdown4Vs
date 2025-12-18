"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sonner_1 = require("@/components/ui/sonner");
const tooltip_1 = require("@/components/ui/tooltip");
const react_query_1 = require("@tanstack/react-query");
const react_router_dom_1 = require("react-router-dom");
const Index_1 = __importDefault(require("./pages/Index"));
const NotFound_1 = __importDefault(require("./pages/NotFound"));
const queryClient = new react_query_1.QueryClient();
const App = () => (<react_query_1.QueryClientProvider client={queryClient}>
    <tooltip_1.TooltipProvider>
      <sonner_1.Toaster />
      <react_router_dom_1.BrowserRouter>
        <react_router_dom_1.Routes>
          <react_router_dom_1.Route path="/" element={<Index_1.default />}/>
          <react_router_dom_1.Route path="*" element={<NotFound_1.default />}/>
        </react_router_dom_1.Routes>
      </react_router_dom_1.BrowserRouter>
    </tooltip_1.TooltipProvider>
  </react_query_1.QueryClientProvider>);
exports.default = App;
//# sourceMappingURL=App.js.map