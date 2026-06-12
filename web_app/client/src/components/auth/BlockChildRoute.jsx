import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useJwt } from '@/context/JwtProvider';

const BlockChildRoute = () => {
  const { decodedJwt } = useJwt();

  if (!decodedJwt) return <Outlet />;

  if (decodedJwt.role === 'child') return <Navigate to="/child/dashboard" replace />;

  return <Outlet />;
};

export { BlockChildRoute };
