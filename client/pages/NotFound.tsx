import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../components/Layout";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center bg-[#F7FCFA] p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-6xl sm:text-8xl font-bold text-[#45A180] font-['Lexend'] mb-4">
              404
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0D1C17] font-['Lexend'] mb-2">
              Page Not Found
            </h2>
            <p className="text-[#45A180] font-['Lexend'] mb-6">
              Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
            </p>
          </div>
          
          <div className="space-y-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#45A180] text-white px-6 py-3 rounded-lg font-['Lexend'] font-medium hover:bg-[#3A8B6B] transition-colors"
            >
              <Home className="w-4 h-4" />
              Return to Dashboard
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="block w-full text-[#45A180] font-['Lexend'] hover:underline"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1" />
              Go Back
            </button>
          </div>

          <div className="mt-8 p-4 bg-white rounded-lg border border-[#E5E8EB] text-left">
            <h3 className="font-medium text-[#0D1C17] font-['Lexend'] mb-2">
              Quick Links:
            </h3>
            <div className="space-y-1 text-sm">
              <Link to="/" className="block text-[#45A180] hover:underline font-['Lexend']">
                • Dashboard
              </Link>
              <Link to="/supplies" className="block text-[#45A180] hover:underline font-['Lexend']">
                • Inventory Management
              </Link>
              <Link to="/ai-bot" className="block text-[#45A180] hover:underline font-['Lexend']">
                • AI Assistant
              </Link>
              <Link to="/alerts" className="block text-[#45A180] hover:underline font-['Lexend']">
                • Alerts & Notifications
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
