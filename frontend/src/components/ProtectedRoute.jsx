// components/ProtectedRoute.jsx
import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lightSky to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-main border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-2 border-main opacity-20 rounded-full animate-ping"></div>
          </div>
          <h3 className="text-2xl font-bold text-darktext mb-2">Verifying Access</h3>
          <p className="text-lighttext">Please wait while we verify your credentials...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If authentication is not required but user is authenticated (login page)
  if (!requireAuth && isAuthenticated) {
    // Redirect to dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Render children if authentication checks pass
  return children;
};

export default ProtectedRoute;
