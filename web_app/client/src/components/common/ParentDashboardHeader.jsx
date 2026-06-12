import { ASSETS } from '@/assets';
import { useGetUser } from '@/hooks/user';
import authService from '@/services/authService';
import { LogOut, Menu, X, Home, LayoutDashboard, UserCircle, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const ParentDashboardHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userQuery = useGetUser({});

  const isDashboard = location.pathname === '/parent/dashboard';
  const isProfile = location.pathname === '/parent/profile';

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isMenuOpen]);

  return (
    <>
      {/* 1. THE MAIN HEADER BAR */}
      <header className="no-print bg-[#FFFDF8] w-full sticky top-0 z-50 border-b border-gray-100 h-20 md:h-24 flex items-center">
        <div className="w-full px-6 md:px-20 flex items-center justify-between">
          {/* Logo */}
          <img
            className="w-14 md:w-16 cursor-pointer active:scale-95 transition-transform"
            src={ASSETS.logo}
            alt="logo"
            onClick={() => navigate('/')}
          />

          {/* DESKTOP NAV (Hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-10 font-bold text-gray-800 text-sm">
            <Link
              to="/"
              className="text-gray-500 hover:text-black border-b-2 border-transparent hover:border-yellow-400 pb-1 transition-all"
            >
              Home
            </Link>
            <Link
              to="/parent/dashboard"
              className={`${isDashboard ? 'text-black border-yellow-400' : 'text-gray-500'} border-b-2 border-transparent hover:border-yellow-400 pb-1 transition-all`}
            >
              Dashboard
            </Link>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            <Link
              to="/parent/profile"
              className={`p-0.5 rounded-full transition-all ${isProfile ? 'ring-2 ring-yellow-400 ring-offset-2' : 'hover:scale-110'}`}
            >
              <img
                src={userQuery.isSuccess ? `${import.meta.env.VITE_IMG_BASE_URL}/${userQuery.data.photo}` : undefined}
                className="w-10 h-10 rounded-full border border-gray-100"
                alt="Profile"
              />
            </Link>

            <button onClick={authService.logout} className="text-gray-400 hover:text-red-500 transition-colors">
              <LogOut size={20} />
            </button>
          </nav>

          {/* MOBILE TOGGLE (Hidden on desktop) */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-3 bg-gray-50 rounded-2xl text-gray-900 active:scale-90 transition-all"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* 2. MOBILE DRAWER OVERLAY (Backdrop) */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* 3. THE ACTUAL DRAWER */}
      <aside
        className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-[#FFFDF8] z-[70] md:hidden shadow-2xl transform transition-transform duration-300 ease-out p-8 flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between mb-12">
          <img src={ASSETS.logo} className="w-12" alt="logo" />
          <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Profile Snapshot in Drawer */}
        <div className="bg-yellow-50 p-5 rounded-[2rem] mb-8 border border-yellow-100 flex items-center gap-4">
          <img
            src={userQuery.isSuccess ? `${import.meta.env.VITE_IMG_BASE_URL}/${userQuery.data.photo}` : undefined}
            className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
            alt="Me"
          />
          <div>
            <p className="text-xs font-black text-yellow-600 uppercase tracking-widest">Parent Account</p>
            <p className="text-lg font-bold text-gray-900 leading-tight">
              {userQuery.isSuccess ? userQuery.data.name : 'Loading...'}
            </p>
          </div>
        </div>

        {/* Links */}
        <nav className="space-y-3 grow">
          <MobileLink
            icon={<Home size={20} />}
            label="Home"
            onClick={() => {
              navigate('/');
              setIsMenuOpen(false);
            }}
          />
          <MobileLink
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={isDashboard}
            onClick={() => {
              navigate('/parent/dashboard');
              setIsMenuOpen(false);
            }}
          />
          <MobileLink
            icon={<UserCircle size={20} />}
            label="My Profile"
            active={isProfile}
            onClick={() => {
              navigate('/parent/profile');
              setIsMenuOpen(false);
            }}
          />
        </nav>

        {/* Footer of Drawer */}
        <div className="pt-8 border-t border-gray-100">
          <button
            onClick={authService.logout}
            className="flex items-center justify-between w-full p-4 rounded-2xl bg-red-50 text-red-600 font-bold active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3">
              <LogOut size={20} />
              <span>Logout</span>
            </div>
            <ChevronRight size={18} />
          </button>
        </div>
      </aside>
    </>
  );
};

const MobileLink = ({ icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between w-full p-4 rounded-2xl font-bold transition-all ${active ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-100' : 'text-gray-600 hover:bg-gray-50'}`}
  >
    <div className="flex items-center gap-4">
      {icon}
      <span>{label}</span>
    </div>
    {active && <ChevronRight size={18} />}
  </button>
);

export { ParentDashboardHeader };
