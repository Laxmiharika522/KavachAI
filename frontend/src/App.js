import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Navbar from './components/dashboard/Navbar';
import AnalyzerPage from './pages/AnalyzerPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './components/dashboard/Dashboard';
import Encyclopedia from './components/dashboard/Encyclopedia';
import './App.css';

function ProtectedRoute({ session, children }) {
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppLayout({ session }) {
  const [lang, setLang] = React.useState('en');
  const toggleLang = () => setLang(prev => (prev === 'en' ? 'hi' : 'en'));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar lang={lang} onLangToggle={toggleLang} />
      <Routes>
        <Route path="/analyzer" element={<AnalyzerPage />} />
        <Route path="/dashboard" element={<Dashboard lang={lang} />} />
        <Route path="/encyclopedia" element={<Encyclopedia lang={lang} />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050B18', color: '#00E676' }}>Loading Secure Core...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={session ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/signup" element={session ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
        <Route path="/*" element={
          <ProtectedRoute session={session}>
            <AppLayout session={session} />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
