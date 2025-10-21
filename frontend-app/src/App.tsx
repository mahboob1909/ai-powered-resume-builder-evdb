import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ResumeProvider } from './contexts/ResumeContext';
import { CoverLetterProvider } from './contexts/CoverLetterContext';
import { ToastProvider } from './hooks/useToast';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ResumeEditor from './pages/ResumeEditor';
import CoverLetterEditor from './pages/CoverLetterEditor';
import AuthCallback from './pages/AuthCallback';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ResumeProvider>
            <CoverLetterProvider>
              <Router>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/editor/:resumeId?" element={
                      <ProtectedRoute>
                        <ResumeEditor />
                      </ProtectedRoute>
                    } />
                    <Route path="/cover-letter-editor/:coverLetterId?" element={
                      <ProtectedRoute>
                        <CoverLetterEditor />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </div>
              </Router>
            </CoverLetterProvider>
          </ResumeProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;