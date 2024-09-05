import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import EventsPage from './pages/EventsPage';
import EventPage from './pages/EventPage';
import MessagesPage from './pages/MessagesPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
    <div className="flex flex-col ">
      <Header/>
      <Routes>
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventPage />} />

          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/:id" element={<ChatPage />} />

          <Route path="/profile/:id" element={<ProfilePage />} />
          {/* Ajoutez ici d'autres routes si nécessaire */}
        </Routes>
      {/* <Footer /> */}
    </div>
    </Router>
  );
}

export default App;
