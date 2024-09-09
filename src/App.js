import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import EventsPage from './pages/EventsPage';
import EventPage from './pages/EventPage';
import MessagesPage from './pages/MessagesPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SignupPage from './pages/SignupPage';

function MainLayout() {
  const location = useLocation(); // Obtenir l'URL actuelle

  return (
    <div className="flex flex-col">
      {location.pathname !== '/login' && location.pathname !== '/forgot-password'  && location.pathname !== '/signup' && <Header />}
      
      <Routes>
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventPage />} />

        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/messages/:id" element={<ChatPage />} />

        <Route path="/profile/:id" element={<ProfilePage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/signup" element={<SignupPage />} />


      </Routes>
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
