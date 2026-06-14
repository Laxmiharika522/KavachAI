import { motion } from 'framer-motion'

export default function ActionCard({ action = '', lang = 'en' }) {
  if (!action) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl p-5"
      style={{
        background: 'linear-gradient(135deg, rgba(0,255,65,0.15), rgba(0,255,65,0.05))',
        border: '1px solid rgba(0,255,65,0.35)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">✅</span>
        <h3 className="font-bold text-sm uppercase tracking-widest"
          style={{ color: 'var(--accent)' }}>
          {lang === 'en' ? 'Recommended Action' : 'अनुशंसित कार्रवाई'}
        </h3>
      </div>
      <p className="text-base font-semibold leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {action}
      </p>

      {/* Cybercrime report link */}
      <a
        href="https://cybercrime.gov.in"
        target="_blank"
        rel="noopener noreferrer"
        id="cybercrime-report-link"
        className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200"
        style={{
          background: 'rgba(255,75,110,0.15)',
          border: '1px solid rgba(255,75,110,0.35)',
          color: 'var(--red)',
        }}
      >
        🚨 {lang === 'en' ? 'Report on Cybercrime.gov.in' : 'साइबरक्राइम पोर्टल पर रिपोर्ट करें'}
        <span>↗</span>
      </a>
    </motion.div>
  )
}
