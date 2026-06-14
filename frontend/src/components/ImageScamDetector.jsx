import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import jsPDF from 'jspdf'

export default function ImageScamDetector({ lang = 'en', onResult }) {
  const [dragging, setDragging] = useState(false)
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [pdfDone, setPdfDone] = useState(false)
  const inputRef = useRef()

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResult(null)
    setError(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const analyzeImage = async () => {
    if (!file) return setError('Please upload an image first.')
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`/api/analyze-image?lang=${lang}`, {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setResult(data)
      onResult?.(data)
    } catch {
      setError('Could not analyze image. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = result?.risk_score > 70 ? '#ef4444'
    : result?.risk_score > 30 ? '#f97316'
    : '#00ff88'

  const threatLevel = result?.risk_score > 70 ? 'HIGH'
    : result?.risk_score > 30 ? 'MEDIUM'
    : 'LOW'

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

    doc.setFillColor(15, 23, 42)
    doc.rect(0, 0, 210, 40, 'F')
    doc.setTextColor(0, 255, 136)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('KavachAI', 14, 18)
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Threat Analysis Report', 14, 28)
    doc.text(`Generated: ${now} IST`, 14, 35)

    doc.setFillColor(30, 41, 59)
    doc.roundedRect(14, 50, 85, 40, 4, 4, 'F')
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(9)
    doc.text('RISK SCORE', 20, 62)
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    const rgb = result.risk_score > 70 ? [239, 68, 68] : result.risk_score > 30 ? [249, 115, 22] : [0, 255, 136]
    doc.setTextColor(...rgb)
    doc.text(`${result.risk_score}/100`, 20, 82)

    doc.setFillColor(30, 41, 59)
    doc.roundedRect(110, 50, 85, 40, 4, 4, 'F')
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('THREAT LEVEL', 116, 62)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...rgb)
    doc.text(threatLevel, 116, 82)

    doc.setFillColor(30, 41, 59)
    doc.roundedRect(14, 100, 181, 20, 4, 4, 'F')
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('SCAM TYPE DETECTED', 20, 110)
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(result.scam_type || 'Unknown', 20, 116)

    doc.setTextColor(0, 255, 136)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('RED FLAGS DETECTED', 14, 138)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    let y = 148
    ;(result.red_flags || []).forEach((flag) => {
      doc.setTextColor(239, 68, 68)
      doc.text('▶', 14, y)
      doc.setTextColor(60, 60, 60)
      const lines = doc.splitTextToSize(flag, 168)
      doc.text(lines, 22, y)
      y += lines.length * 6 + 4
    })

    y += 6
    doc.setDrawColor(0, 255, 136)
    doc.roundedRect(14, y, 181, 24, 4, 4, 'D')
    doc.setTextColor(0, 255, 136)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('RECOMMENDED ACTION', 20, y + 10)
    doc.setTextColor(40, 40, 40)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const actionLines = doc.splitTextToSize(result.recommended_action || '', 168)
    doc.text(actionLines, 20, y + 18)

    doc.setFillColor(15, 23, 42)
    doc.rect(0, 275, 210, 22, 'F')
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(8)
    doc.text('KavachAI · Protecting India from Digital Fraud', 14, 285)
    doc.text('cybercrime.gov.in', 160, 285)

    doc.save(`KavachAI-Report-${Date.now()}.pdf`)
    setPdfDone(true)
    setTimeout(() => setPdfDone(false), 3000)
  }

  const handleWhatsApp = () => {
    const flags = (result.red_flags || []).map(f => `  ⚠️ ${f}`).join('\n')
    const message =
      `🚨 *KavachAI Alert*\n\n` +
      `*Risk Score:* ${result.risk_score}/100 — ${threatLevel}\n` +
      `*Scam Type:* ${result.scam_type}\n\n` +
      `*Red Flags:*\n${flags}\n\n` +
      `*Action:* ${result.recommended_action}\n\n` +
      `_Analyzed by KavachAI · Stay safe online_ 🛡️`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div>
      {/* Upload card */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12, padding: 20,
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)',
          borderRadius: 20, padding: '3px 10px', fontSize: 11,
          color: '#00ff88', marginBottom: 16
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', animation: 'pulse 1.2s ease infinite' }} />
          Vision AI Active
        </div>

        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragging ? 'rgba(0,255,136,0.7)' : 'rgba(0,255,136,0.25)'}`,
            borderRadius: 10, padding: '36px 16px', textAlign: 'center',
            cursor: 'pointer', background: dragging ? 'rgba(0,255,136,0.06)' : 'rgba(0,255,136,0.03)',
            transition: 'all 0.2s'
          }}
        >
          <input ref={inputRef} type="file" accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files[0])} />
          {preview ? (
            <img src={preview} alt="Preview"
              style={{ maxHeight: 160, margin: '0 auto', borderRadius: 8, objectFit: 'contain' }} />
          ) : (
            <>
              <div style={{ fontSize: 32, color: '#00ff88', marginBottom: 10 }}>📷</div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0 }}>Drag & drop or click to upload</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 4 }}>JPG, PNG, WEBP · SMS, WhatsApp, Email screenshots</p>
            </>
          )}
        </div>

        <button onClick={analyzeImage} disabled={!file || loading} style={{
          width: '100%', marginTop: 14, padding: 13,
          borderRadius: 8,
          background: file && !loading ? '#00ff88' : 'rgba(0,255,136,0.3)',
          color: '#0a0f0d', fontSize: 14, fontWeight: 600,
          border: 'none', cursor: file ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
        }}>
          {loading ? '⏳ Analyzing...' : '🔍 Analyze Threat'}
        </button>

        {error && <p style={{ color: '#ef4444', fontSize: 12, textAlign: 'center', marginTop: 8 }}>{error}</p>}
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: 16,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: 20,
              backdropFilter: 'blur(12px)'
            }}>
            <p style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Analysis Result</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 14 }}>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 6px' }}>Risk Score</p>
                <p style={{ fontSize: 28, fontWeight: 600, color: scoreColor, margin: 0 }}>
                  {result.risk_score}<span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>/100</span>
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 14 }}>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 6px' }}>Scam Type</p>
                <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{result.scam_type}</p>
              </div>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 8px' }}>Red Flags</p>
            {result.red_flags?.map((flag, i) => (
              <div key={i} style={{
                display: 'flex', gap: 8, padding: '10px 12px',
                background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)',
                borderRadius: 8, marginBottom: 8
              }}>
                <span style={{ color: '#ef4444', fontSize: 14, flexShrink: 0 }}>⚠️</span>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, margin: 0, lineHeight: 1.4 }}>{flag}</p>
              </div>
            ))}

            <div style={{
              background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)',
              borderRadius: 10, padding: 14, marginTop: 4
            }}>
              <p style={{ color: '#00ff88', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 6px' }}>✅ Recommended Action</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{result.recommended_action}</p>
            </div>

            {/* Share actions */}
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Share Report</p>
              <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <button onClick={handleDownloadPDF} style={{
                  flex: 1, padding: '12px', borderRadius: 10, border: 'none',
                  background: '#f97316', color: '#fff', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer'
                }}>📄 Download PDF</button>
                <button onClick={handleWhatsApp} style={{
                  flex: 1, padding: '12px', borderRadius: 10, border: 'none',
                  background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer'
                }}>💬 WhatsApp</button>
              </div>
              <button onClick={() => window.open('https://cybercrime.gov.in', '_blank')} style={{
                width: '100%', padding: '12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 600, cursor: 'pointer'
              }}>🛡️ Report to Cybercrime Portal</button>

              {pdfDone && (
                <div style={{
                  marginTop: 10, padding: '10px 14px',
                  background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.25)',
                  borderRadius: 8, color: '#00ff88', fontSize: 13
                }}>✅ PDF downloaded successfully!</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}