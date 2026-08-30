import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { CompleteProfilePage } from './pages/CompleteProfilePage';
import { RecipientDashboard } from './pages/RecipientDashboard';
import { DonorDashboard } from './pages/DonorDashboard';
import { NotFoundPage } from './pages/NotFoundPage';
import { PostRequestModal } from './components/PostRequestModal';

const ProtectedRoute = ({ children, allowedRole = null }) => {
  const { currentUser, userProfile, isProfileComplete, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user signed in with Google or Email but has not completed mandatory org/donor profile details:
  if (!isProfileComplete) {
    return <Navigate to="/complete-profile" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === 'recipient' ? '/dashboard' : '/donor'} replace />;
  }

  return children;
};

const MainLayout = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const { role, currentUser, isProfileComplete } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar onOpenPostModal={() => setIsPostModalOpen(true)} />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route 
            path="/complete-profile" 
            element={
              currentUser ? <CompleteProfilePage /> : <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRole="recipient">
                <RecipientDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/donor" 
            element={
              <ProtectedRoute allowedRole="donor">
                <DonorDashboard />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />

      {role === 'recipient' && isProfileComplete && (
        <PostRequestModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ToastProvider>
          <AuthProvider>
            <DataProvider>
              <MainLayout />
            </DataProvider>
          </AuthProvider>
        </ToastProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
