import { useState, useCallback } from 'react'
import ImageScamDetector from './components/ImageScamDetector.jsx'

function loadStats() {
  try {
    return JSON.parse(localStorage.getItem('KavachAI_stats')) || {
      totalScans: 0, highRisk: 0, riskScores: [], scamTypes: {}
    }
  } catch {
    return { totalScans: 0, highRisk: 0, riskScores: [], scamTypes: {} }
  }
}

export default function App() {
  const [lang, setLang] = useState('en')
  const [stats, setStats] = useState(loadStats)

  const handleResult = useCallback((result) => {
    setStats(prev => {
      const riskScores = [...prev.riskScores, result.risk_score]
      const scamTypes = { ...prev.scamTypes }
      const key = result.scam_type || 'Unknown'
      scamTypes[key] = (scamTypes[key] || 0) + 1
      const next = {
        totalScans: prev.totalScans + 1,
        highRisk: prev.highRisk + (result.risk_score > 70 ? 1 : 0),
        riskScores,
        scamTypes
      }
      localStorage.setItem('KavachAI_stats', JSON.stringify(next))
      return next
    })
  }, [])

  const avgScore = stats.riskScores.length
    ? Math.round(stats.riskScores.reduce((a, b) => a + b, 0) / stats.riskScores.length)
    : null

  const topScam = Object.entries(stats.scamTypes).sort((a, b) => b[1] - a[1])[0]?.[0] || null

  const statCards = [
    { label: 'Total Scans', value: stats.totalScans, icon: '🔍', color: '#00ff88' },
    { label: 'High Risk Found', value: stats.highRisk, icon: '🚨', color: '#ef4444' },
    { label: 'Avg Risk Score', value: avgScore !== null ? `${avgScore}/100` : '—', icon: '📊', color: '#f97316' },
    { label: 'Top Scam Type', value: topScam ? topScam.split(' ').slice(0, 2).join(' ') : '—', icon: '🛡️', color: '#a78bfa', small: true },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f0d' }}>
      <nav style={{
        background: 'rgba(10,15,13,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 2rem',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #00ff88, #00c896)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16
          }}>🛡</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>
              <span style={{ color: "#00ff88" }}>Kavach</span>AI
            </div>
            <div style={{ fontSize: 9, color: '#8b949e', letterSpacing: '1.5px' }}>THREAT INTELLIGENCE</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem' }}>
          <span style={{
            fontSize: 13, color: '#e6edf3', cursor: 'pointer',
            borderBottom: '2px solid #00ff88', paddingBottom: 2
          }}>Analyzer</span>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {['en', 'hi'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
              border: '1px solid rgba(0,255,136,0.3)',
              background: lang === l ? 'rgba(0,255,136,0.15)' : 'transparent',
              color: lang === l ? '#00ff88' : '#8b949e'
            }}>
              {l === 'en' ? 'EN' : 'HI'}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ padding: '2.5rem 2rem 1rem', maxWidth: 700, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>
          Detect Scams <span style={{ color: '#00ff88' }}>Before They Reach You</span>
        </h1>
        <p style={{ fontSize: 14, color: '#8b949e', marginBottom: 16 }}>
          Upload suspicious screenshots — SMS, WhatsApp, email, or UPI — and get instant AI-powered scam analysis.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['✓ Real-time Analysis', '✓ Vision AI', '✓ Hindi Support', '✓ PDF Report'].map(b => (
            <span key={b} style={{
              fontSize: 11, padding: '3px 10px', borderRadius: 20,
              border: '1px solid rgba(0,255,136,0.25)',
              color: '#00ff88', background: 'rgba(0,255,136,0.07)'
            }}>{b}</span>
          ))}
        </div>
      </div>

      {/* Real Stats Bar */}
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {statCards.map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '14px 16px',
              transition: 'border-color 0.2s'
            }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
              <div style={{
                fontSize: s.small ? 12 : 20,
                fontWeight: 700, color: s.color, lineHeight: 1.2
              }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#8b949e', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 2rem 4rem' }}>
        <ImageScamDetector lang={lang} onResult={handleResult} />
      </div>
    </div>
  )
}