import { Navigate, Outlet } from 'react-router-dom';
import { useJwt } from '@/context/JwtProvider';

const GuestRoute = () => {
  const { decodedJwt } = useJwt();

  if (!decodedJwt) return <Outlet />;

  if (decodedJwt.role === 'parent') return <Navigate to="/parent/dashboard" replace />;
  else if (decodedJwt.role === 'child') return <Navigate to="/child/dashboard" replace />;
  else return <Outlet />;
};

export { GuestRoute };
