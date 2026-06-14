import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { Sun, Moon } from 'lucide-react'
import { supabase } from '../supabaseClient'


/* ─── Icons ─── */
const Icons = {
  Shield: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Eye: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Zap: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Lock: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Mail: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
}

const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const GitHubIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)

const MicrosoftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 21 21">
    <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
    <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
  </svg>
)

/* ─── Hero Illustration ─── */
function CyberIllustration() {
  return (
    <div className="relative w-full h-[360px] xl:h-[420px] flex items-center justify-center pointer-events-none drop-shadow-2xl">
      <svg viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-contain">
        <defs>
          <radialGradient id="shieldGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E676" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#00E676" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="cyberGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00BCD4" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="#00BCD4" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="shieldBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1220"/>
            <stop offset="100%" stopColor="#030712"/>
          </linearGradient>
          <linearGradient id="shieldEdge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E676"/>
            <stop offset="50%" stopColor="#00BCD4"/>
            <stop offset="100%" stopColor="#00E676"/>
          </linearGradient>
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="6" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Network Connections */}
        <g stroke="rgba(0,188,212,0.2)" strokeWidth="1.5">
          <path d="M400 300 L200 150 M400 300 L600 150 M400 300 L250 450 M400 300 L550 450 M200 150 L300 80 M600 150 L500 80" strokeDasharray="4 4" />
        </g>
        
        {/* Connection Nodes */}
        <g fill="#050B18" stroke="#00BCD4" strokeWidth="2" filter="url(#neonGlow)">
          <circle cx="200" cy="150" r="6"/>
          <circle cx="600" cy="150" r="6"/>
          <circle cx="250" cy="450" r="6"/>
          <circle cx="550" cy="450" r="6"/>
          <circle cx="300" cy="80" r="4"/>
          <circle cx="500" cy="80" r="4"/>
        </g>

        {/* Center Aura */}
        <circle cx="400" cy="300" r="220" fill="url(#shieldGlow)" />
        <circle cx="400" cy="200" r="280" fill="url(#cyberGlow)" />

        {/* 3D Shield Base */}
        <path d="M400 100 L540 150 L540 330 Q540 440 400 520 Q260 440 260 330 L260 150 Z" fill="url(#shieldBody)" stroke="url(#shieldEdge)" strokeWidth="3" filter="url(#neonGlow)"/>
        
        {/* Shield Inner Layer */}
        <path d="M400 120 L510 165 L510 320 Q510 415 400 480 Q290 415 290 320 L290 165 Z" fill="rgba(0,230,118,0.03)" stroke="rgba(0,188,212,0.4)" strokeWidth="1.5"/>
        <path d="M400 100 L540 150 L540 330 Q540 440 400 520 L400 100 Z" fill="rgba(255,255,255,0.02)"/>
        
        {/* AI Core */}
        <circle cx="400" cy="300" r="40" fill="#0B1220" stroke="#00E676" strokeWidth="2" filter="url(#neonGlow)"/>
        <circle cx="400" cy="300" r="18" fill="#00E676" filter="url(#neonGlow)"/>
        
        {/* Orbit Rings */}
        <g stroke="rgba(0,230,118,0.4)" strokeWidth="1.5" fill="none" filter="url(#neonGlow)">
          <ellipse cx="400" cy="300" rx="130" ry="40" transform="rotate(30 400 300)"/>
          <ellipse cx="400" cy="300" rx="130" ry="40" stroke="rgba(0,188,212,0.4)" transform="rotate(-30 400 300)"/>
        </g>
        
        {/* Particles */}
        <circle cx="350" cy="220" r="2" fill="#00E676" filter="url(#neonGlow)"/>
        <circle cx="450" cy="380" r="3" fill="#00BCD4" filter="url(#neonGlow)"/>
        <circle cx="480" cy="240" r="2" fill="#00E676" filter="url(#neonGlow)"/>
        <circle cx="320" cy="360" r="2.5" fill="#00BCD4" filter="url(#neonGlow)"/>
      </svg>
    </div>
  )
}

/* ─── Floating Card Component ─── */
const FloatingCard = ({ title, status, icon, delay, top, left, right, bottom }) => (
  <motion.div 
    initial={{ y: 0, opacity: 0 }}
    animate={{ y: [-6, 6, -6], opacity: 1 }}
    transition={{ 
      y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay },
      opacity: { duration: 1, delay: delay * 0.5 }
    }}
    className="absolute z-20 flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] bg-white/90 dark:bg-[#050B18]/75 backdrop-blur-xl"
    style={{ top, left, right, bottom }}
  >
    <div className="w-8 h-8 rounded-full flex items-center justify-center border bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/25 text-emerald-600 dark:text-emerald-400">
      {React.cloneElement(icon, { width: 14, height: 14 })}
    </div>
    <div className="flex flex-col">
      <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mb-0.5">{title}</span>
      <span className="text-[12px] font-bold text-slate-900 dark:text-white tracking-tight">{status}</span>
    </div>
  </motion.div>
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!supabase) {
      setError('Supabase is not connected. Please add your API keys to the .env file and restart the server.')
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    navigate('/')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050B18] font-sans selection:bg-emerald-500/30 overflow-hidden flex flex-col lg:flex-row transition-colors duration-300">
      
      {/* ════════ LEFT HERO SECTION (55-60%) ════════ */}
      <div className="hidden lg:flex flex-col relative w-[55%] xl:w-[60%] overflow-hidden border-r border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#050B18] transition-colors duration-300">
        
        {/* Background Grid & Accents */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] dark:opacity-[0.03]"></div>
          <div className="absolute inset-0 hidden dark:block dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-emerald-500/5 dark:from-emerald-500/10 to-transparent"></div>
          <div className="absolute -top-[250px] -left-[200px] w-[700px] h-[700px] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-[250px] -right-[200px] w-[700px] h-[700px] bg-cyan-500/5 dark:bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
        </div>
        
        {/* Theme Toggle Button */}
        <div className="absolute top-6 right-6 z-50">
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-white dark:bg-[#0A1128] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white shadow-lg transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Brand Header */}
        <div className="relative z-10 px-10 py-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg text-white dark:text-[#050B18]" style={{ background: 'linear-gradient(135deg, #00E676, #00BCD4)' }}>
            {React.cloneElement(Icons.Shield(), { width: 16, height: 16 })}
          </div>
          <span className="text-[20px] font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
            Kavach<span className="text-emerald-500 dark:text-emerald-400 font-semibold">AI</span>
          </span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-10 pb-16">
          <div className="relative w-full max-w-[550px] mx-auto flex items-center justify-center mb-4">
            
            <CyberIllustration />
            
            {/* Floating Status Cards */}
            <FloatingCard title="Threats Blocked" status="Live Protection" icon={<Icons.Shield />} delay={0} top="15%" left="-2%" />
            <FloatingCard title="AI Scan" status="Active Monitoring" icon={<Icons.Eye />} delay={1.5} top="40%" right="-5%" />
            <FloatingCard title="Malware Detection" status="0 Threats" icon={<Icons.Zap />} delay={3} bottom="15%" left="8%" />

          </div>
          
          <div className="text-center mt-4 max-w-xl mx-auto">
            <h1 className="text-4xl xl:text-5xl font-extrabold leading-[1.15] tracking-tight mb-4 text-slate-900 dark:text-white transition-colors duration-300">
              Stay Protected From <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400">
                Modern Cyber Threats
              </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base xl:text-lg leading-relaxed font-medium mx-auto max-w-lg transition-colors duration-300">
              AI-powered protection against phishing, scams, malicious links, identity theft, and online fraud.
            </p>
          </div>
        </div>

        {/* Trust Metrics Footer */}
        <div className="relative z-10 px-10 py-6 border-t border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-white/[0.015] backdrop-blur-md flex justify-between items-center transition-colors duration-300">
          {[
            { val: '2M+', label: 'Threats Prevented' },
            { val: '99.9%', label: 'Detection Rate' },
            { val: '< 1s', label: 'Scan Time' },
            { val: '24/7', label: 'Monitoring' },
          ].map((metric, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-[22px] font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">{metric.val}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{metric.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ════════ RIGHT LOGIN SECTION (40%) ════════ */}
      <div className="flex-1 flex flex-col justify-center items-center relative px-6 py-12 lg:px-10 w-full lg:w-[45%] xl:w-[40%] overflow-hidden">
        
        {/* Ambient background for mobile & tablet */}
        <div className="lg:hidden absolute inset-0 bg-[#050B18]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[500px] relative z-10"
        >
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex justify-center items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#050B18]" style={{ background: 'linear-gradient(135deg, #00E676, #00BCD4)' }}>
              <Icons.Shield />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Kavach<span className="text-emerald-400 font-semibold">AI</span>
            </span>
          </div>

          {/* Floating Glassmorphism Login Card */}
          <div className="rounded-[28px] border border-slate-200 dark:border-white/10 shadow-[0_0_80px_-20px_rgba(16,185,129,0.15)] relative overflow-hidden bg-white/90 dark:bg-[#0A101C]/80 backdrop-blur-2xl p-8 sm:p-10 transition-colors duration-300">
            
            {/* Inner top glow accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 dark:via-emerald-400/60 to-transparent"></div>

            {/* Desktop Logo Inside Card */}
            <div className="hidden lg:flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg text-white dark:text-[#050B18]" style={{ background: 'linear-gradient(135deg, #00E676, #00BCD4)' }}>
                <Icons.Shield />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
                Kavach<span className="text-emerald-500 dark:text-emerald-400 font-semibold">AI</span>
              </span>
            </div>

            <div className="mb-8">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight transition-colors duration-300">Welcome Back</h2>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed transition-colors duration-300">Access your KavachAI Security Dashboard</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 28 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3.5 flex items-center gap-3 text-red-400 text-sm overflow-hidden font-medium"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 tracking-wide transition-colors duration-300">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors duration-300">
                    <Icons.Mail />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-[#050B18]/60 border border-slate-200 dark:border-white/10 rounded-xl text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wide transition-colors duration-300">Password</label>
                  <Link to="/forgot-password" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">Forgot password?</Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors duration-300">
                    <Icons.Lock />
                  </div>
                  <input 
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full h-14 pl-12 pr-12 bg-slate-50 dark:bg-[#050B18]/60 border border-slate-200 dark:border-white/10 rounded-xl text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPass ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <Icons.Eye />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center pt-2 pb-3">
                <button 
                  type="button"
                  onClick={() => setRemember(!remember)}
                  className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-all duration-200 ${remember ? 'bg-emerald-500/20 border-emerald-500' : 'bg-slate-50 dark:bg-[#050B18]/80 border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30'}`}
                >
                  {remember && <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-[#00E676]"><polyline points="20 6 9 17 4 12"/></motion.svg>}
                </button>
                <span className="ml-3 text-[14px] font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none transition-colors duration-300" onClick={() => setRemember(!remember)}>
                  Remember me for 30 days
                </span>
              </div>

              {/* Large Gradient CTA Button */}
              <motion.button
                whileHover={{ scale: 1.01, boxShadow: "0 10px 30px -10px rgba(16,185,129,0.4)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl flex items-center justify-center font-bold text-lg tracking-wide text-white dark:text-[#050B18] transition-all overflow-hidden relative group bg-gradient-to-r from-emerald-500 to-cyan-600 dark:from-emerald-400 dark:to-cyan-500"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                {loading ? (
                  <div className="flex items-center gap-2.5 relative z-10 text-white dark:text-[#050B18]">
                    <span className="w-4 h-4 border-2 border-white/30 dark:border-[#050B18]/30 border-t-white dark:border-t-[#050B18] rounded-full animate-spin"></span>
                    <span>Security Scan Active...</span>
                  </div>
                ) : (
                  <span className="relative z-10 flex items-center gap-2">
                    <Icons.Lock /> Secure Sign In
                  </span>
                )}
              </motion.button>
            </form>

            {/* Social Login Divider */}
            <div className="mt-8 mb-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-200 dark:bg-white/10"></div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors duration-300">Or continue with</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-white/10"></div>
            </div>

            {/* Social Login Options */}
            <div className="grid grid-cols-3 gap-4">
              <button type="button" className="h-14 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/10 transition-colors flex items-center justify-center text-slate-700 dark:text-white">
                <GoogleIcon />
              </button>
              <button type="button" className="h-14 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/10 transition-colors flex items-center justify-center text-slate-700 dark:text-white">
                <GitHubIcon />
              </button>
              <button type="button" className="h-14 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/10 transition-colors flex items-center justify-center text-slate-700 dark:text-white">
                <MicrosoftIcon />
              </button>
            </div>

          </div>

          <p className="text-center text-base font-medium text-slate-500 dark:text-slate-400 mt-8 transition-colors duration-300">
            Don't have an account?{' '}
            <Link to="/signup" className="text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors inline-flex items-center gap-1 group">
              Create account 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </p>

        </motion.div>
      </div>

    </div>
  )
}
