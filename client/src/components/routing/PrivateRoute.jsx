import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../ui/Spinner';

const PrivateRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.ui);
  
  // Check if we're still loading auth
  if (loading['auth/loadUser']) {
    return <Spinner />;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If authenticated, render the child routes
  return <Outlet />;
};

export default PrivateRoute;