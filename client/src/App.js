import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Layout components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import EventDetailPage from './pages/EventDetailPage';
import ChildrenPage from './pages/ChildrenPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

// Context hooks
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>School Events Hub - Never Miss Important School Activities</title>
        <meta name="description" content="A unified school events hub that syncs calendars, sends timely reminders, and ensures parents never miss important school activities." />
        <meta name="keywords" content="school events, parent communication, calendar sync, notifications, education" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph */}
        <meta property="og:title" content="School Events Hub" />
        <meta property="og:description" content="Never miss important school activities with our unified events hub." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.origin} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="School Events Hub" />
        <meta name="twitter:description" content="Never miss important school activities with our unified events hub." />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Helmet>

      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          user ? <Navigate to="/home" replace /> : <HomePage />
        } />
        <Route path="/login" element={
          user ? <Navigate to="/home" replace /> : <LoginPage />
        } />
        <Route path="/register" element={
          user ? <Navigate to="/home" replace /> : <RegisterPage />
        } />

        {/* Protected routes - Updated to match site map */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          {/* Home - Quick list of next events */}
          <Route path="home" element={<DashboardPage />} />
          
          {/* Calendar - Month/week view for planning ahead */}
          <Route path="calendar" element={<CalendarPage />} />
          
          {/* Event Details - Full info + "Add to My Calendar" button */}
          <Route path="events/:id" element={<EventDetailPage />} />
          
          {/* My Children - Manage profiles & school links */}
          <Route path="children" element={<ChildrenPage />} />
          
          {/* Notifications Settings - Adjust reminder preferences */}
          <Route path="notifications" element={<NotificationsPage />} />
          
          {/* Admin Dashboard - Create, edit, and delete events */}
          <Route path="admin" element={
            <ProtectedRoute requiredRole={['admin', 'school_admin']}>
              <AdminPage />
            </ProtectedRoute>
          } />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;