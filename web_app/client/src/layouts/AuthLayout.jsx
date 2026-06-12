import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { THEME } from '../constants/config';
import { ASSETS } from '../assets/index';

const AuthLayout = ({ children, onBack }) => (
  <div className={`min-h-screen ${THEME.bgBeige} flex`}>
    <div className="hidden md:block md:w-1/2 relative">
      <div className="absolute w-30 h-29 rounded-full top-8 left-8 z-10 flex justify-center items-center bg-white/90 backdrop-blur-sm shadow-sm">
        <img src={ASSETS.logo} alt="logo" className="w-22" />
      </div>
      <img src={ASSETS.auth} alt="Child playing" className="absolute inset-0 w-full h-full object-cover" />
    </div>
    <div className="w-full md:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-8 right-8 text-gray-400 hover:text-black flex items-center gap-2 transition-colors font-semibold bg-white px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft size={18} /> Back
        </button>
      )}
      <div className="md:hidden absolute top-8 text-center w-full flex justify-center">
        <img src={ASSETS.logo} alt="logo" className="w-22" />
      </div>
      <div className={`${THEME.cardWhite} w-full max-w-md p-10 md:p-14 relative z-10`}>{children}</div>
    </div>
  </div>
);

const AuthLayoutWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleBack = () => {
    if (location.pathname === '/login') navigate('/');
    else if (location.pathname === '/register') navigate('/login');
    else if (location.pathname === '/forgot-password') navigate('/login');
    else if (location.pathname === '/verify-email') navigate('/register');
    else if (location.pathname === '/reset-password') navigate('/login');
    else navigate(-1);
  };
  return (
    <AuthLayout onBack={handleBack}>
      <Outlet />
    </AuthLayout>
  );
};

export default AuthLayoutWrapper;
