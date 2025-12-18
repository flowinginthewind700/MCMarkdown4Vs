"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotFoundPage;
const button_1 = require("@/components/ui/button");
function NotFoundPage() {
    return (<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6 text-center">
      <div className="space-y-6 max-w-md">
        <div className="space-y-3">
          <h1 className="text-8xl font-bold text-blue-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
          <p className="text-muted-foreground">The page you're looking for doesn't exist or may have been moved.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button_1.Button asChild>
            <a href="/">Return Home</a>
          </button_1.Button>
          <button_1.Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </button_1.Button>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=NotFound.js.map