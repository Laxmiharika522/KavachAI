import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Bell, Settings, Globe, LogOut, Menu, X, Activity, Sun, Moon, Search } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { supabase } from '../../supabaseClient';

export default function Navbar({ lang, onLangToggle, session }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <Activity className="w-4 h-4" /> },
    { path: '/analyzer', label: 'Analyzer', icon: <Shield className="w-4 h-4" /> },
    { path: '/encyclopedia', label: 'Encyclopedia', icon: <Globe className="w-4 h-4" /> },
    { path: '/breach-check', label: 'Breach Check', icon: <Search className="w-4 h-4" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#050B18]/80 backdrop-blur-lg transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300">
                <div className="w-full h-full bg-white dark:bg-[#050B18] rounded-[10px] flex items-center justify-center transition-colors duration-300">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="font-black text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1 transition-colors duration-300">
                  Kavach<span className="text-emerald-400 font-semibold">AI</span>
                  <span className="text-cyan-400 font-bold text-sm bg-cyan-400/10 px-1.5 py-0.5 rounded ml-1">AI</span>
                </div>
                <div className="text-[9px] font-bold tracking-[0.2em] text-gray-500 uppercase mt-0.5">
                  Threat Intelligence
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-slate-100 dark:bg-white/[0.02] p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 transition-colors duration-300">
            {navLinks.map(link => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    active 
                      ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' 
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-200 dark:hover:bg-white/5'
                  }`}
                >
                  <span className={`${active ? 'text-emerald-400' : 'text-gray-500'}`}>{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="hidden sm:flex items-center justify-center p-2.5 rounded-xl text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Language Toggle */}
            <button 
              onClick={onLangToggle}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors border border-transparent dark:hover:border-white/10"
            >
              <Globe className="w-4 h-4 text-slate-500 dark:text-gray-400" />
              <span>{lang === 'en' ? 'EN' : 'HI'}</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2.5 rounded-xl text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#050B18] animate-pulse"></span>
              </button>

              {/* Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0A1128] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-[fadeIn_0.2s_ease-out] transition-colors duration-300">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
                    <span className="text-xs bg-red-500/10 text-red-500 dark:text-red-400 px-2 py-0.5 rounded-md font-bold">3 New</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-2">
                    {[
                      { icon: '🚨', msg: 'New phishing campaign detected', time: '2m ago', type: 'danger' },
                      { icon: '⚠️', msg: 'High-risk URL flagged in SMS', time: '15m ago', type: 'warning' },
                      { icon: '✅', msg: 'Weekly threat scan complete', time: '1h ago', type: 'success' },
                    ].map((n, i) => (
                      <div key={i} className="flex gap-3 items-start p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer mb-1">
                        <span className="text-xl leading-none">{n.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800 dark:text-gray-200 mb-0.5">{n.msg}</p>
                          <p className="text-xs text-slate-500 dark:text-gray-500 font-medium">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <button className="hidden sm:block p-2.5 rounded-xl text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-white/10 mx-1"></div>

            {/* Auth Button */}
            {session ? (
              <button 
                onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-500/20"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <Link 
                to="/login"
                className="hidden sm:flex items-center justify-center px-5 py-2 rounded-xl text-sm font-bold text-white dark:text-[#050B18] bg-gradient-to-r from-emerald-500 to-cyan-600 dark:from-emerald-400 dark:to-cyan-500 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A1128] absolute w-full transition-colors duration-300">
          <div className="px-4 py-4 flex flex-col gap-2">
            {navLinks.map(link => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    active 
                      ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white' 
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <span className={`${active ? 'text-emerald-400' : 'text-gray-500'}`}>{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
            
            <div className="h-px bg-slate-200 dark:bg-white/10 my-2"></div>
            
            <div className="flex items-center justify-between px-4 py-2">
              <button 
                onClick={onLangToggle}
                className="flex items-center gap-3 py-2 rounded-xl text-base font-semibold text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <Globe className="w-5 h-5" />
                {lang === 'en' ? 'EN' : 'HI'}
              </button>
              
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 py-2 rounded-xl text-base font-semibold text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>

            {session ? (
              <button 
                onClick={async () => { await supabase.auth.signOut(); navigate('/login'); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all mt-2"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            ) : (
              <Link 
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-base font-bold text-white dark:text-[#050B18] bg-gradient-to-r from-emerald-500 to-cyan-600 dark:from-emerald-400 dark:to-cyan-500 mt-2"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
}
