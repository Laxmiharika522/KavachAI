import { motion } from 'framer-motion'

const RADIUS = 80
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function getColor(score) {
  if (score >= 70) return '#ff4b6e'
  if (score >= 30) return '#f59e0b'
  return '#10b981'
}

function getLabel(score, lang) {
  if (score >= 70) return '🔴 HIGH RISK'
  if (score >= 30) return '🟡 MEDIUM RISK'
  return '🟢 LOW RISK'
}

export default function RiskMeter({ score = 0, scamType = '', lang = 'en' }) {
  const color = getColor(score)
  const dashOffset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE

  return (
    <div className="flex flex-col items-center gap-4">
      {/* SVG Gauge */}
      <div className="relative">
        <svg width="220" height="220" viewBox="0 0 220 220">
          {/* Background track */}
          <circle
            cx="110" cy="110" r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Glowing ring */}
          <motion.circle
            cx="110" cy="110" r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            transform="rotate(-90 110 110)"
            filter={`drop-shadow(0 0 8px ${color})`}
          />
          {/* Score text */}
          <text x="110" y="100" textAnchor="middle" fill={color}
            style={{ fontSize: '2.4rem', fontWeight: '900', fontFamily: 'Inter' }}>
            {score}
          </text>
          <text x="110" y="126" textAnchor="middle" fill="rgba(255,255,255,0.35)"
            style={{ fontSize: '0.75rem', fontFamily: 'Inter', fontWeight: '500' }}>
            {'/ 100'}
          </text>
        </svg>
      </div>

      {/* Risk Level Label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <div className="text-base font-bold tracking-wide mb-1" style={{ color }}>
          {getLabel(score, lang)}
        </div>
        {scamType && (
          <div className="text-sm px-4 py-1.5 rounded-full font-semibold"
            style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}>
            {scamType}
          </div>
        )}
      </motion.div>
    </div>
  )
}
