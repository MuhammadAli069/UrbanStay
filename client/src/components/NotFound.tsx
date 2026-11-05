import { useNavigate } from "react-router-dom";
import { Home, Search, AlertCircle } from "lucide-react";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-8xl mb-4">🏠</div>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <AlertCircle className="w-12 h-12 text-blue-600" />
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600">
            Sorry, we couldn't find the page you're looking for. It might have been removed or doesn't exist.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <Home className="w-5 h-5" />
            <span>Go to Homepage</span>
          </button>
          <button
            onClick={() => navigate("/listings")}
            className="w-full flex items-center justify-center space-x-2 px-6 py-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors font-semibold"
          >
            <Search className="w-5 h-5" />
            <span>Browse Properties</span>
          </button>
        </div>

        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-gray-600">
            Need help? <a href="mailto:support@urbanstay.com" className="text-blue-600 hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
