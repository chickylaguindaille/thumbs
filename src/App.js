import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import EventsPage from './pages/EventsPage';
import EventPage from './pages/EventPage';
import MessagesPage from './pages/MessagesPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import AssociationsPage from './pages/AssociationsPage';
import AssociationPage from './pages/AssociationPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SignupPage from './pages/SignupPage';
import TermsPage from './pages/TermsPage';

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  console.log("Is Authenticated:", isAuthenticated);
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function MainLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const isPublicRoute = location.pathname === '/login' || location.pathname === '/forgot-password' || location.pathname.startsWith('/reset-password') || location.pathname === '/signup' || location.pathname === '/terms';

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      {!isPublicRoute && (
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen && !isPublicRoute ? 'md:ml-64' : 'md:ml-0'}`}>
        {/* Header */}
        {!isPublicRoute && (
          <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        )}

        {/* Routes */}
        <Routes>
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/" element={<ProtectedRoute element={<EventsPage />} />} /> 
          <Route path="/events" element={<ProtectedRoute element={<EventsPage />} />} />
          <Route path="/events/:id" element={<ProtectedRoute element={<EventPage />} />} />
          <Route path="/messages" element={<ProtectedRoute element={<MessagesPage />} />} />
          <Route path="/messages/:id" element={<ProtectedRoute element={<ChatPage />} />} />
          <Route path="/profile/:id" element={<ProtectedRoute element={<ProfilePage />} />} />
          <Route path="/associations" element={<ProtectedRoute element={<AssociationsPage />} />} />
          <Route path="/association/:id" element={<ProtectedRoute element={<AssociationPage />} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;
