import { Navigate } from 'react-router-dom';
import { useAuth } from './auth';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return currentUser ? children : <Navigate to="/" />;
};

export default PrivateRoute;
