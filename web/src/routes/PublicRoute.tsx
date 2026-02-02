import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '@/utils/tokenManager';

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  if (isAuthenticated()) {
    return <Navigate to="/cliente" replace />;
  }

  return <>{children}</>;
}
