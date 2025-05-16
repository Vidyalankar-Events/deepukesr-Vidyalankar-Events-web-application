import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Features } from './pages/Features';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Events } from './pages/Events';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { StudentDashboard } from './pages/dashboard/StudentDashboard';
import { FacultyDashboard } from './pages/dashboard/FacultyDashboard';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { EventRegistration } from './pages/EventRegistration';
import { RegisteredEvents } from './pages/RegisteredEvents';
import { useAuth } from './context/AuthContext';
import { Forum } from './pages/Forum';
import { ForumTopic } from './pages/ForumTopic';
import { CreateTopic } from './pages/CreateTopic';
import { CmsAdmin } from './pages/cms/CmsAdmin';
import { CmsEditor } from './pages/cms/CmsEditor';
import { CmsArticle } from './pages/cms/CmsArticle';
import { AddUser } from './pages/admin/AddUser';
import { ManageEvents } from './pages/admin/ManageEvents';
import { Reports } from './pages/admin/Reports';
import { Settings } from './pages/admin/Settings';
import { FacultyCalendar } from './pages/faculty/FacultyCalendar';
import { FacultyAnalytics } from './pages/faculty/FacultyAnalytics';
import { FacultySettings } from './pages/faculty/FacultySettings';

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f14621]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/events/register/:eventId" element={<EventRegistration />} />
        <Route path="/events/registered" element={<RegisteredEvents />} />
        
        {/* Forum Routes */}
        <Route path="/forum" element={<Forum />} />
        <Route path="/forum/topic/:topicId" element={<ForumTopic />} />
        <Route path="/forum/create" element={<CreateTopic />} />
        
        {/* CMS Routes */}
        <Route path="/cms/article/:articleId" element={<CmsArticle />} />
        
        {/* Admin Routes */}
        <Route path="/admin/add-user" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AddUser />
          </ProtectedRoute>
        } />
        <Route path="/admin/manage-events" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageEvents />
          </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Settings />
          </ProtectedRoute>
        } />
        
        {/* Faculty Routes */}
        <Route path="/faculty/calendar" element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultyCalendar />
          </ProtectedRoute>
        } />
        <Route path="/faculty/analytics" element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultyAnalytics />
          </ProtectedRoute>
        } />
        <Route path="/faculty/settings" element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultySettings />
          </ProtectedRoute>
        } />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard/student" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/faculty" 
          element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <FacultyDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cms/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'faculty']}>
              <CmsAdmin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cms/editor/:articleId?" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'faculty']}>
              <CmsEditor />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;