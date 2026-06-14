import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
}

const item = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35 } }
}

export default function RedFlagCards({ flags = [], lang = 'en' }) {
  if (!flags.length) return null

  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-widest mb-3"
        style={{ color: 'var(--red)' }}>
        ⚠️ {'Red Flags Detected'}
      </h3>
      <motion.ul
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-2"
      >
        {flags.map((flag, i) => (
          <motion.li
            key={i}
            variants={item}
            className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm font-medium"
            style={{
              background: 'rgba(255, 75, 110, 0.08)',
              border: '1px solid rgba(255, 75, 110, 0.2)',
              color: 'var(--text-primary)',
            }}
          >
            <span className="text-base mt-0.5 flex-shrink-0">🚩</span>
            <span>{flag}</span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
