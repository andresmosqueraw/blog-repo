import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../ui/Spinner';

const PublicRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.ui);
  
  // Check if we're still loading auth
  if (loading['auth/loadUser']) {
    return <Spinner />;
  }
  
  // If authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  // If not authenticated, render the child routes
  return <Outlet />;
};

export default PublicRoute;