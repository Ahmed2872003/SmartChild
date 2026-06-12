import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { AppContextProvider } from './context/AppContext';

import LandingPage from './views/LandingPage';
import ParentDashboard from './views/Dashboards/ParentDashboard';
import ChildDashboard from './views/Dashboards/ChildDashboard';
import ReportsDashboard from './views/Dashboards/ReportsDashboard';
import AuthLayoutWrapper from './layouts/AuthLayout';
import Login from './views/Auth/Login';
import Register from './views/Auth/Register';
import ForgotPassword from './views/Auth/ForgotPassword';
import ConfirmEmail from './views/Auth/ConfirmEmail';
import VerifyEmail from './views/Auth/VerifyEmail';
import ResetPassword from './views/Auth/ResetPassword';
import { ToastContainer } from 'react-toastify';
import { NotFoundPage } from './views/NotFoundPage';
import { ParentProfile } from './views/ParentProfile';
import { ParentDashboardLayout } from './layouts/ParentDashboardLayout';
import CoparentActionPage from './views/CoparentActionPage';
import { ProtecteRoute } from './components/auth/ProtectRoute';
import { BlockChildRoute } from './components/auth/BlockChildRoute';
import { GuestRoute } from './components/auth/GuestRoute';
import { JwtProvider } from './context/JwtProvider';

import { FreePlayMenu } from './views/Games/FreePlayMenu';
import { FreePlay } from './views/Games/FreePlay';
import { DailyPlay } from './views/Games/DailyPlay';
import StoryPage from './views/StoryPage';

const basename = import.meta.env.VITE_URL_BASENAME;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <JwtProvider>
        <AppContextProvider>
          <Router basename={basename || '/'}>
            <Routes>
              <Route element={<BlockChildRoute />}>
                <Route path="/" element={<LandingPage />} />
              </Route>

              {/* Auth Routes */}
              <Route element={<GuestRoute />}>
                <Route element={<AuthLayoutWrapper />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                </Route>
              </Route>
              {/* Parent Routes */}
              <Route element={<ProtecteRoute allowedRole={'parent'} />}>
                <Route path="/parent" element={<ParentDashboardLayout />}>
                  <Route path="dashboard" element={<ParentDashboard />} />
                  <Route path="profile" element={<ParentProfile />} />
                  <Route path="child/reports" element={<ReportsDashboard />} />
                </Route>
              </Route>

              <Route path="/access-decision/:token" element={<CoparentActionPage />} />
              <Route element={<AuthLayoutWrapper />}>
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/confirm-email/:token" element={<ConfirmEmail />} />
              </Route>
              {/* Child Routes */}
              <Route element={<ProtecteRoute allowedRole={'child'} />}>
                <Route path="/child">
                  <Route path="dashboard" element={<ChildDashboard />} />
                  <Route path="free-play" element={<FreePlayMenu />} />
                  <Route path="free-play-game" element={<FreePlay />} />
                  <Route path="daily-play" element={<DailyPlay />} />
                  <Route path="story" element={<StoryPage />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
          <ToastContainer position="top-right" autoClose={3000} />
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </AppContextProvider>
      </JwtProvider>
    </QueryClientProvider>
  );
}
