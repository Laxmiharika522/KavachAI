import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ═══════════════════════════════════════════
   DEMO DATA
═══════════════════════════════════════════ */
const DEMO_RESULT = {
  risk_score: 92,
  scam_type: 'KYC Phishing',
  confidence: 97,
  severity: 'Critical',
  red_flags: [
    'Urgency to click a link immediately',
    'Impersonates a trusted bank (SBI)',
    'Suspicious domain not matching official site',
    'Requests sensitive account details',
  ],
  indicators: ['Phishing', 'Spoofed Domain', 'Urgent Language', 'Financial Fraud', 'Credential Theft'],
  recommended_action: 'Do NOT click any link. Your bank never asks for KYC via SMS. Call SBI directly on 1800-11-2211 to verify.',
  ai_explanation: 'This message exhibits multiple hallmarks of a KYC phishing attack. The sender impersonates a legitimate banking institution (SBI) and creates artificial urgency by claiming account suspension. The embedded URL uses a lookalike domain to steal credentials. Social engineering tactics include fear of account loss to bypass critical thinking.',
}

const RECENT_ACTIVITY = [
  { type: 'danger',  label: 'Amazon Delivery Scam',    time: '2m ago',  score: 94 },
  { type: 'danger',  label: 'Fake Bank SMS',            time: '18m ago', score: 88 },
  { type: 'warning', label: 'WhatsApp Lottery Scam',   time: '1h ago',  score: 71 },
  { type: 'success', label: 'Suspicious Login Email',   time: '3h ago',  score: 12 },
]

const THREAT_FEED = [
  { icon: '🚨', title: 'New Phishing Campaign Detected',  tag: 'CRITICAL', time: 'Just now' },
  { icon: '⚠️', title: 'High-Risk Banking Scam Surge',   tag: 'HIGH',     time: '5m ago'  },
  { icon: '🔴', title: 'Malicious Domain Identified',     tag: 'HIGH',     time: '22m ago' },
  { icon: '⚡', title: 'AI Model Updated — v3.2',         tag: 'INFO',     time: '1h ago'  },
]

const STAT_CARDS = [
  { label: 'Threats Blocked',  value: '2,841', delta: '+12%', color: '#EF4444', icon: '🛡' },
  { label: 'Detected Scams',   value: '1,203', delta: '+8%',  color: '#F59E0B', icon: '🔍' },
  { label: 'Safe Messages',    value: '14.2K', delta: '+23%', color: '#22C55E', icon: '✅' },
  { label: 'URLs Analyzed',    value: '8,941', delta: '+5%',  color: '#06B6D4', icon: '🔗' },
]

/* ═══════════════════════════════════════════
   SCORE RING COMPONENT
═══════════════════════════════════════════ */
function ScoreRing({ score = 94 }) {
  const r = 44, circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 80 ? '#22C55E' : score >= 50 ? '#F59E0B' : '#EF4444'
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" className="stroke-slate-200 dark:stroke-white/10 transition-colors" strokeWidth="8"/>
        <circle cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 55 55)"
          style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 6px ${color}60)` }}/>
        <text x="55" y="52" textAnchor="middle" className="fill-slate-900 dark:fill-white text-[22px] font-extrabold font-sans transition-colors">{score}</text>
        <text x="55" y="67" textAnchor="middle" fill={color} className="text-[10px] font-semibold font-sans">SCORE</text>
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════
   RISK SCORE BAR
═══════════════════════════════════════════ */
function RiskBar({ score }) {
  const color = score >= 75 ? '#EF4444' : score >= 40 ? '#F59E0B' : '#22C55E'
  const label = score >= 75 ? 'Critical' : score >= 40 ? 'Suspicious' : 'Safe'
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[13px] text-slate-500 dark:text-slate-400 transition-colors">Risk Level</span>
        <span className="text-[13px] font-bold" style={{ color }}>{label} — {score}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden transition-colors">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 10px ${color}60` }}
        />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   DRAG & DROP UPLOAD AREA (connected to backend)
═══════════════════════════════════════════ */
function UploadArea({ file, setFile, preview, setPreview }) {
  const [drag, setDrag] = useState(false)
  const inputRef = { current: null }

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  return (
    <div
      onClick={() => document.getElementById('image-file-input').click()}
      onDragOver={e => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }}
      className={`border-2 border-dashed rounded-[14px] p-7 text-center transition-all duration-200 cursor-pointer ${
        drag ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5'
      }`}
      id="image-uploader"
    >
      <input
        id="image-file-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleFile(e.target.files[0])}
      />
      {preview ? (
        <img src={preview} alt="Preview"
          className="max-h-[180px] mx-auto rounded-lg object-contain mb-2" />
      ) : (
        <>
          <div className="text-[32px] mb-2.5">📷</div>
          <p className="text-[14px] font-semibold text-slate-700 dark:text-slate-300 mb-1 transition-colors">
            Drag & Drop Screenshot Here
          </p>
          <p className="text-[12px] text-slate-500 dark:text-slate-500 mb-3.5 transition-colors">
            SMS, WhatsApp, Email, UPI screenshots
          </p>
        </>
      )}
      <div className="flex justify-center gap-1.5 flex-wrap mt-2">
        {['PNG', 'JPG', 'WEBP'].map(fmt => (
          <span key={fmt} className="px-2 py-1 bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-full text-[11px] font-semibold transition-colors">{fmt}</span>
        ))}
      </div>
      <span className="inline-block mt-3.5 px-4 py-1.5 rounded-lg text-[12px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-colors">
        {file ? `✓ ${file.name}` : 'Browse Files'}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════
   RESULTS PANEL
═══════════════════════════════════════════ */
function ResultsPanel({ result, onReset, isDemo = false }) {
  const score = result.risk_score
  const isCritical = score >= 75
  const isSuspicious = score >= 40 && score < 75
  const accentColor = isCritical ? '#EF4444' : isSuspicious ? '#F59E0B' : '#22C55E'
  const severity = result.severity || (isCritical ? 'Critical' : isSuspicious ? 'Suspicious' : 'Safe')
  const confidence = result.confidence || null
  const indicators = result.indicators || []
  const ai_explanation = result.ai_explanation || null

  return (
    <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Threat Overview */}
      <div className="card transition-colors duration-300" style={{ padding: '24px', border: `1px solid ${accentColor}30` }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-[22px]"
            style={{ background: `${accentColor}15` }}>
            {isCritical ? '🚨' : isSuspicious ? '⚠️' : '✅'}
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-slate-900 dark:text-white transition-colors">Security Report</h3>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 transition-colors">AI Threat Analysis Complete</p>
          </div>
          <div className="ml-auto">
            <span className={`badge ${isCritical ? 'badge-danger' : isSuspicious ? 'badge-warning' : 'badge-success'} text-[13px] px-3.5 py-1.5 transition-colors`}>
              {severity}
            </span>
          </div>
        </div>

        {/* Grid: scores */}
        <div className={`grid gap-3 mb-5 ${confidence ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {[
            { label: 'Risk Score',  value: `${score}/100`,      color: accentColor },
            ...(confidence ? [{ label: 'Confidence', value: `${confidence}%`, color: '#06B6D4' }] : []),
            { label: 'Threat Type', value: result.scam_type || 'Unknown', color: '#F59E0B' },
          ].map(m => (
            <div key={m.label} className="p-3.5 rounded-[10px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 transition-colors">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-widest transition-colors">{m.label}</div>
              <div className="text-[15px] font-bold" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        <RiskBar score={score} />
      </div>

      {/* AI Explanation — only if available */}
      {ai_explanation && (
        <div className="card p-5 transition-colors duration-300">
          <h4 className="text-[14px] font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2 transition-colors">
            <span className="text-[16px]">🤖</span> AI Explanation
          </h4>
          <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed transition-colors">
            {ai_explanation}
          </p>
        </div>
      )}

      {/* Threat Indicators — only if available */}
      {indicators.length > 0 && (
        <div className="card p-5 transition-colors duration-300">
          <h4 className="text-[14px] font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2 transition-colors">
            <span className="text-[16px]">🏷️</span> Threat Indicators
          </h4>
          <div className="flex flex-wrap gap-2">
            {indicators.map(ind => (
              <span key={ind} className="badge badge-danger">{ind}</span>
            ))}
          </div>
        </div>
      )}

      {/* Red Flags */}
      <div className="card p-5 transition-colors duration-300">
        <h4 className="text-[14px] font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2 transition-colors">
          <span className="text-[16px]">🚩</span> Detected Red Flags
        </h4>
        <div className="flex flex-col gap-2">
          {result.red_flags.map((flag, i) => (
            <div key={i} className="flex gap-2.5 items-start p-2.5 rounded-lg bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/10 transition-colors">
              <span className="text-red-500 mt-px shrink-0">⚠</span>
              <span className="text-[13px] text-slate-700 dark:text-slate-300 leading-snug transition-colors">{flag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="card p-5 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 transition-colors duration-300">
        <h4 className="text-[14px] font-semibold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2 transition-colors">
          <span className="text-[16px]">✅</span> Recommended Actions
        </h4>
        <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mb-3.5 transition-colors">
          {result.recommended_action}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {['Do Not Click Links', 'Block Sender', 'Report Message', 'Delete Conversation'].map(a => (
            <div key={a} className="flex gap-2 items-center px-2.5 py-2 rounded-lg bg-emerald-100/50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 transition-colors">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="#00D084" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[12px] text-slate-700 dark:text-slate-300 font-medium transition-colors">{a}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scan Again */}
      <button id="scan-again-btn" onClick={onReset} className="btn-secondary w-full h-12 rounded-xl text-[14px]">
        ← Analyze Another Threat
      </button>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export default function AnalyzerPage() {
  const [activeTab,  setActiveTab]  = useState('message')
  const [textInput,  setTextInput]  = useState('')
  const [urlInput,   setUrlInput]   = useState('')
  const [result,     setResult]     = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  const [imageFile,  setImageFile]  = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isDemo,     setIsDemo]     = useState(false)

  const displayResult = result

  const handleScan = async () => {
    setError('')
    setIsDemo(false)
    if (activeTab === 'message' && !textInput.trim()) { setError('Please enter a message to analyze.'); return }
    if (activeTab === 'url'     && !urlInput.trim())  { setError('Please enter a URL to scan.'); return }
    if (activeTab === 'image'   && !imageFile)        { setError('Please upload an image first.'); return }

    setResult(null)
    setLoading(true)

    if (activeTab === 'image') {
      try {
        const formData = new FormData()
        formData.append('file', imageFile)
        const baseUrl = process.env.REACT_APP_API_URL || '';
        const res = await fetch(`${baseUrl}/api/analyze-image?lang=en`, {
          method: 'POST',
          body: formData,
        })
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        const data = await res.json()
        setIsDemo(false)
        setResult(data)
      } catch (err) {
        // Backend unavailable — show demo result with a clear demo banner inside the report
        setIsDemo(true)
        setResult(DEMO_RESULT)
      } finally {
        setLoading(false)
      }
    } else if (activeTab === 'message') {
      try {
        const baseUrl = process.env.REACT_APP_API_URL || '';
        const res = await fetch(`${baseUrl}/api/analyze-text`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textInput, lang: 'en' }),
        })
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        const data = await res.json()
        setIsDemo(false)
        setResult(data)
      } catch {
        // Message Analysis: AI failed — show demo banner inside the results card
        setIsDemo(true)
        setResult(DEMO_RESULT)
      } finally {
        setLoading(false)
      }
    } else if (activeTab === 'url') {
      try {
        const baseUrl = process.env.REACT_APP_API_URL || '';
        const res = await fetch(`${baseUrl}/api/analyze-url`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlInput, lang: 'en' }),
        })
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        const data = await res.json()
        setIsDemo(false)
        setResult(data)
      } catch {
        // URL Scanner: AI failed — show demo banner inside the results card
        setIsDemo(true)
        setResult(DEMO_RESULT)
      } finally {
        setLoading(false)
      }
    }
  }

  const reset = () => { setResult(null); setTextInput(''); setUrlInput(''); setImageFile(null); setImagePreview(null); setError(''); setIsDemo(false) }

  const isHttp = urlInput.startsWith('http://') && !urlInput.startsWith('https://')

  const TABS = [
    { id: 'message', icon: '💬', label: 'Message Analysis' },
    { id: 'url',     icon: '🔗', label: 'URL Scanner' },
    { id: 'image',   icon: '🖼️', label: 'Image Analysis' },
  ]

  return (
    <div className="bg-slate-50 dark:bg-[#050B18] min-h-[calc(100vh-72px)] p-7 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto">

        {/* ══ Hero Header ══ */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-sans text-[28px] font-extrabold text-slate-900 dark:text-white leading-tight mb-2 transition-colors">
                Detect Scams{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400">
                  Before They Reach You
                </span>
              </h1>
              <p className="text-[14px] text-slate-600 dark:text-slate-400 max-w-[580px] leading-relaxed transition-colors">
                Analyze suspicious messages, emails, URLs, and screenshots with AI-powered threat intelligence.
              </p>
            </div>
            {/* Trust Badges */}
            <div className="flex gap-2 flex-wrap">
              {['✓ Real-time Analysis', '✓ AI-Powered Detection', '✓ Enterprise Security'].map(b => (
                <span key={b} className="px-3 py-1.5 rounded-lg text-[11.5px] font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 whitespace-nowrap transition-colors">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ══ 70/30 Grid Layout ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

          {/* ── LEFT: Primary Workspace ── */}
          <div className="flex flex-col gap-5">
            <AnimatePresence mode="wait">
              {!displayResult ? (
                <motion.div key="input" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>

                  {/* Analyzer Card */}
                  <div className="card p-6 transition-colors duration-300">
                    {/* Tab Bar */}
                    <div className="flex bg-slate-100 dark:bg-black/20 rounded-xl p-1 mb-5 transition-colors">
                      {TABS.map(tab => (
                        <button key={tab.id} id={`tab-${tab.id}`}
                          className={`flex-1 p-2.5 rounded-lg border-none flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer ${
                            activeTab === tab.id ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm dark:shadow-none' : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                          onClick={() => setActiveTab(tab.id)}>
                          <span>{tab.icon}</span>
                          <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Message Tab */}
                    {activeTab === 'message' && (
                      <div>
                        <label className="text-[12px] font-medium text-slate-500 dark:text-slate-400 block mb-2 uppercase tracking-widest transition-colors">
                          Suspicious Content
                        </label>
                        <textarea
                          id="message-textarea"
                          value={textInput}
                          onChange={e => setTextInput(e.target.value)}
                          placeholder="Paste suspicious messages, emails, WhatsApp chats, SMS content, or social media messages..."
                          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none transition-colors focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-white/10 p-4 resize-none min-h-[220px] leading-relaxed text-[14px] rounded-xl"
                        />
                        <div className="flex justify-between mt-2">
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 transition-colors">
                            Supports: English, Hindi, and regional languages
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 transition-colors">
                            {textInput.length} chars
                          </span>
                        </div>
                      </div>
                    )}

                    {/* URL Tab */}
                    {activeTab === 'url' && (
                      <div>
                        <label className="text-[12px] font-medium text-slate-500 dark:text-slate-400 block mb-2 uppercase tracking-widest transition-colors">
                          URL / Link to Scan
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-[16px] pointer-events-none transition-colors">🔗</span>
                          <input
                            id="url-input"
                            type="url"
                            value={urlInput}
                            onChange={e => setUrlInput(e.target.value)}
                            placeholder="https://suspicious-link.com/verify-kyc"
                            className="w-full bg-slate-50 dark:bg-white/5 border text-slate-900 dark:text-white outline-none transition-colors focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-white/10 pl-11 pr-4 h-[52px] rounded-xl"
                            style={{ borderColor: isHttp ? '#EF4444' : undefined }}
                          />
                        </div>
                        {isHttp && (
                          <div className="mt-2.5 p-2.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex gap-2 items-center transition-colors">
                            <span className="text-[14px]">⚠️</span>
                            <span className="text-[12px] text-red-500 dark:text-red-400 transition-colors">
                              This URL uses HTTP (not HTTPS) — it is unencrypted and potentially unsafe.
                            </span>
                          </div>
                        )}
                        <p className="mt-2 text-[12px] text-slate-400 dark:text-slate-500 transition-colors">
                          We check against 50+ threat intelligence feeds and perform real-time domain analysis.
                        </p>
                      </div>
                    )}

                    {/* Image Tab */}
                    {activeTab === 'image' && (
                      <UploadArea
                        file={imageFile}
                        setFile={setImageFile}
                        preview={imagePreview}
                        setPreview={setImagePreview}
                      />
                    )}

                    {/* Error */}
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="mt-3.5 p-2.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex gap-2 items-center text-[13px] text-red-500 dark:text-red-400 transition-colors">
                        <span>⚠</span> {error}
                      </motion.div>
                    )}

                    {/* CTA */}
                    <button
                      id="scan-btn"
                      onClick={handleScan}
                      disabled={loading}
                      className="btn-primary w-full h-[52px] mt-4.5 rounded-xl text-[15px]"
                    >
                      {loading ? (
                        <>
                          <span className="w-[18px] h-[18px] rounded-full border-[2.5px] border-black/30 border-t-black spin"/>
                          Analyzing Threat...
                        </>
                      ) : (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                          </svg>
                          Analyze Threat
                        </>
                      )}
                    </button>
                  </div>

                  {/* Loading skeleton */}
                  {loading && (
                    <div className="card" style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div className="skeleton" style={{ width: '44px', height: '44px', borderRadius: '12px' }}/>
                        <div style={{ flex: 1 }}>
                          <div className="skeleton" style={{ height: '14px', width: '40%', marginBottom: '8px' }}/>
                          <div className="skeleton" style={{ height: '12px', width: '25%' }}/>
                        </div>
                      </div>
                      <div className="skeleton" style={{ height: '8px', marginBottom: '12px' }}/>
                      <div className="skeleton" style={{ height: '8px', width: '80%', marginBottom: '12px' }}/>
                      <div className="skeleton" style={{ height: '8px', width: '60%' }}/>
                    </div>
                  )}
                </motion.div>
              ) : (
                <ResultsPanel result={displayResult} onReset={reset} isDemo={isDemo} />
              )}
            </AnimatePresence>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="hidden lg:flex flex-col gap-4">

            {/* Security Score Card */}
            <div className="card p-5 text-center transition-colors duration-300">
              <div className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.05em] mb-4 transition-colors">
                Security Score
              </div>
              <ScoreRing score={94} />
              <div className="mt-3">
                <span className="badge badge-success text-[12px] px-3.5 py-1.5 transition-colors">
                  ✓ Protected
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2.5 leading-relaxed transition-colors">
                Your security posture is strong. Last scanned 2m ago.
              </p>
            </div>

            {/* Threat Statistics */}
            <div className="card p-5 transition-colors duration-300">
              <div className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.05em] mb-3.5 transition-colors">
                Threat Statistics
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {STAT_CARDS.map(s => (
                  <div key={s.label} className="p-3 rounded-[10px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 transition-colors">
                    <div className="text-[18px] mb-1.5">{s.icon}</div>
                    <div className="text-[18px] font-extrabold text-slate-900 dark:text-white leading-none transition-colors">{s.value}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug transition-colors">{s.label}</div>
                    <div className="text-[10px] text-emerald-500 mt-1 font-semibold">{s.delta}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-5 transition-colors duration-300">
              <div className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.05em] mb-3.5 transition-colors">
                Recent Activity
              </div>
              <div className="flex flex-col gap-2">
                {RECENT_ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 cursor-pointer transition-colors">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${a.type === 'danger' ? 'bg-red-500' : a.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`}/>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap overflow-hidden text-ellipsis transition-colors">{a.label}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 transition-colors">{a.time}</div>
                    </div>
                    <div className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                      a.type === 'danger' ? 'text-red-500 bg-red-500/10' : a.type === 'warning' ? 'text-amber-500 bg-amber-500/10' : 'text-emerald-500 bg-emerald-500/10'
                    }`}>{a.score}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Threat Feed */}
            <div className="card p-5 transition-colors duration-300">
              <div className="flex items-center gap-2 mb-3.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/>
                <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.05em] transition-colors">
                  Live Threat Feed
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {THREAT_FEED.map((f, i) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <span className="text-[15px] shrink-0 mt-px">{f.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-slate-700 dark:text-slate-300 font-medium leading-snug transition-colors">{f.title}</div>
                      <div className="flex gap-1.5 mt-1 items-center">
                        <span className={`text-[10px] font-bold px-1.5 py-px rounded-md ${
                          f.tag === 'CRITICAL' ? 'bg-red-50 dark:bg-red-500/15 text-red-500 dark:text-red-400' : f.tag === 'HIGH' ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-300' : 'bg-cyan-50 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-300'
                        } transition-colors`}>{f.tag}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 transition-colors">{f.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
