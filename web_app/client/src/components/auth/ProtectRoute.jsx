import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useJwt } from '@/context/JwtProvider';

const ProtecteRoute = ({ allowedRole }) => {
  const { decodedJwt } = useJwt();

  if (!decodedJwt) return <Navigate to="/" replace />;

  if (decodedJwt.role !== allowedRole) {
    const redirectPath = decodedJwt.role === 'parent' ? '/parent/dashboard' : '/child/dashboard';

    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export { ProtecteRoute };
