import React, { useState } from 'react';
import { BrowserRouter, HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import SplashScreen from './components/common/SplashScreen';

// Pages
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import CandidateDashboard from './pages/CandidateDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 3, // 3 minutes
      refetchOnWindowFocus: false
    }
  }
});

// Guard: Ensures that without an account/login, user CANNOT access inside the portal
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  return children;
}

// Guard: Authenticated users accessing /login or /register are sent directly to the portal home
function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppLayout({ children }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // 2-Second Branded Splash Screen on Visit
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('jobyatra_splash_shown');
  });

  const handleSplashFinish = () => {
    sessionStorage.setItem('jobyatra_splash_shown', 'true');
    setShowSplash(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface-offwhite">
      {/* 2-Second Animated Splash Screen */}
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

      {isAuthenticated && !isAuthPage && <Navbar />}
      <main className="flex-grow">{children}</main>
      {isAuthenticated && !isAuthPage && <Footer />}
    </div>
  );
}

export default function App() {
  const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
  const Router = isGitHubPages ? HashRouter : BrowserRouter;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppLayout>
            <Routes>
              {/* Protected Portal Routes (Only accessible after login) */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs"
                element={
                  <ProtectedRoute>
                    <JobsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs/:id"
                element={
                  <ProtectedRoute>
                    <JobDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/companies"
                element={
                  <ProtectedRoute>
                    <CompaniesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/companies/:slug"
                element={
                  <ProtectedRoute>
                    <CompanyDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/candidate"
                element={
                  <ProtectedRoute>
                    <CandidateDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/employer"
                element={
                  <ProtectedRoute>
                    <EmployerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Public Authentication Routes */}
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <LoginPage />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicOnlyRoute>
                    <RegisterPage />
                  </PublicOnlyRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AppLayout>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
