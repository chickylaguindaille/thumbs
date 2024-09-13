import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from './authSlice';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import EventsPage from './pages/EventsPage';
import EventPage from './pages/EventPage';
import MessagesPage from './pages/MessagesPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SignupPage from './pages/SignupPage';

function MainLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  
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

  const ProtectedRoute = ({ element }) => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    console.log("Is Authenticated:", isAuthenticated);
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  const isPublicRoute = location.pathname === '/login' || location.pathname === '/forgot-password' || location.pathname === '/signup';

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
          {/* <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/:id" element={<ChatPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/signup" element={<SignupPage />} /> */}

          <Route path="/events" element={<ProtectedRoute element={<EventsPage />} />} />
          <Route path="/events/:id" element={<ProtectedRoute element={<EventPage />} />} />
          <Route path="/messages" element={<ProtectedRoute element={<MessagesPage />} />} />
          <Route path="/messages/:id" element={<ProtectedRoute element={<ChatPage />} />} />
          <Route path="/profile/:id" element={<ProtectedRoute element={<ProfilePage />} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
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
