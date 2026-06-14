import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CreditCard, Landmark, ShoppingBag, Briefcase, Bitcoin, Siren, Ticket, ShieldOff, AlertTriangle, Activity, Crosshair, Terminal, Zap, Fingerprint, Search, X } from 'lucide-react';

const scams = [
  {
    id: "upi-collect",
    name: "UPI Collect Fraud",
    icon: <CreditCard className="w-5 h-5" />,
    severity: "CRITICAL",
    color: "red",
    trigger: `"Accept this payment request to receive funds"`,
    metadata: { vector: "UPI Apps", avgLoss: "₹15,000", target: "Sellers / Public" },
    steps: [
      { title: "The Hook", desc: "Scammer contacts you pretending to buy an item or send a refund." },
      { title: "The Bait", desc: "They send a UPI 'Collect Request' instead of sending money." },
      { title: "The Trap", desc: "You enter your UPI PIN thinking you are receiving money, but funds are instantly deducted." }
    ],
    redFlags: [
      "Request comes from an unknown/unverified number",
      "Creates extreme urgency to act immediately",
      "Requires UPI PIN to 'receive' money (PIN is only for sending)"
    ],
    whatToDo: "NEVER enter your UPI PIN to receive money. Decline the request and block the sender."
  },
  {
    id: "fake-kyc",
    name: "Fake KYC SMS",
    icon: <Landmark className="w-5 h-5" />,
    severity: "CRITICAL",
    color: "red",
    trigger: `"Your bank account will be blocked today"`,
    metadata: { vector: "SMS / WhatsApp", avgLoss: "₹45,000", target: "Bank Customers" },
    steps: [
      { title: "The Hook", desc: "Fake SMS warns of imminent account block due to pending KYC." },
      { title: "The Bait", desc: "You panic and click the malicious link to 'update KYC' online." },
      { title: "The Trap", desc: "You enter banking credentials and OTP on a fake phishing site, giving them full access." }
    ],
    redFlags: [
      "SMS contains a random, unofficial link (e.g., bit.ly or random domains)",
      "Threatens immediate account block to cause panic",
      "Asks for sensitive info like OTP, CVV, or Aadhaar online"
    ],
    whatToDo: "Never click links in SMS. Call your bank directly using the official number on your debit card."
  },
  {
    id: "digital-arrest",
    name: "Digital Arrest / Fake Police",
    icon: <Siren className="w-5 h-5" />,
    severity: "CRITICAL",
    color: "red",
    trigger: `"Your Aadhaar is linked to money laundering"`,
    metadata: { vector: "Voice Call / Skype", avgLoss: "₹5 Lakhs+", target: "Professionals" },
    steps: [
      { title: "The Hook", desc: "Automated call claims your FedEx parcel has illegal items (drugs/passports)." },
      { title: "The Bait", desc: "Transferred to fake 'Cyber Crime Police' via Skype/WhatsApp video call." },
      { title: "The Trap", desc: "Forced to transfer all savings to a 'secure RBI account' to verify innocence." }
    ],
    redFlags: [
      "Police officer is calling via Skype or WhatsApp",
      "Demands secrecy and forbids you from calling family",
      "Asks you to transfer money to a 'safe account' for verification"
    ],
    whatToDo: "Real police never interrogate via Skype or ask for money transfers. Disconnect immediately."
  },
  {
    id: "job-scam",
    name: "Task-Based Job Scam",
    icon: <Briefcase className="w-5 h-5" />,
    severity: "HIGH",
    color: "orange",
    trigger: `"Work from home, earn ₹5,000 daily"`,
    metadata: { vector: "Telegram / WhatsApp", avgLoss: "₹85,000", target: "Job Seekers" },
    steps: [
      { title: "The Hook", desc: "Received unsolicited WhatsApp message for an easy YouTube liking job." },
      { title: "The Bait", desc: "You do tasks, see 'virtual' earnings, and even get paid a tiny initial amount." },
      { title: "The Trap", desc: "You are asked to pay 'pre-paid task fees' or 'tax' to withdraw the larger accumulated earnings." }
    ],
    redFlags: [
      "Unrealistic high salary for zero skills or basic clicking",
      "Communication shifts exclusively to Telegram groups",
      "You have to pay money to 'unlock' your salary"
    ],
    whatToDo: "Never pay money to get a job or withdraw earnings. Block the recruiter."
  },
  {
    id: "crypto-fraud",
    name: "Crypto Investment Fraud",
    icon: <Bitcoin className="w-5 h-5" />,
    severity: "CRITICAL",
    color: "red",
    trigger: `"Guaranteed 10x returns in 30 days"`,
    metadata: { vector: "Social Media", avgLoss: "₹2.5 Lakhs", target: "Investors" },
    steps: [
      { title: "The Hook", desc: "Added to a VIP Telegram/WhatsApp group showing massive daily profits." },
      { title: "The Bait", desc: "Instructed to download a specific, unknown crypto exchange app." },
      { title: "The Trap", desc: "App shows huge fake gains, but when you try to withdraw, your account is frozen." }
    ],
    redFlags: [
      "Promises of 'guaranteed' or 'risk-free' astronomical returns",
      "Urged to download unverified APK files or unknown apps",
      "Platform is not registered with SEBI or RBI"
    ],
    whatToDo: "Only invest through globally recognized, verified, and legally compliant platforms."
  },
  {
    id: "olx-buyer",
    name: "Marketplace Overpay Scam",
    icon: <ShoppingBag className="w-5 h-5" />,
    severity: "HIGH",
    color: "orange",
    trigger: `"I'll send extra money via NEFT right now"`,
    metadata: { vector: "OLX / Marketplace", avgLoss: "₹12,000", target: "Online Sellers" },
    steps: [
      { title: "The Hook", desc: "Scammer agrees to buy your listed item immediately without seeing it." },
      { title: "The Bait", desc: "Claims they overpaid by mistake and sends a fake SMS/screenshot of the payment." },
      { title: "The Trap", desc: "Sends a QR code and asks you to scan it to 'refund' the excess amount." }
    ],
    redFlags: [
      "Buyer agrees to pay instantly without negotiating or inspecting",
      "Sends fake payment confirmation SMS that didn't come from your bank",
      "Asks you to scan a QR code to 'receive' the payment"
    ],
    whatToDo: "Check your actual bank app statement, not SMS. Never scan a QR code to receive money."
  },
  {
    id: "fake-lottery",
    name: "KBC / Fake Lottery",
    icon: <Ticket className="w-5 h-5" />,
    severity: "HIGH",
    color: "orange",
    trigger: `"Congratulations! You won KBC ₹25 lakhs"`,
    metadata: { vector: "WhatsApp Audio", avgLoss: "₹35,000", target: "Elderly / Rural" },
    steps: [
      { title: "The Hook", desc: "Receive a WhatsApp audio/image message claiming you won a massive lottery." },
      { title: "The Bait", desc: "Asked to call a specific 'Bank Manager' number to claim the prize." },
      { title: "The Trap", desc: "Manager demands you pay GST, processing fees, or taxes upfront before releasing the prize." }
    ],
    redFlags: [
      "You won a lottery you never even bought tickets for",
      "Communication via WhatsApp calls/audio from unknown numbers",
      "Demands upfront payment to release winnings"
    ],
    whatToDo: "No legitimate lottery asks for an upfront fee. Ignore and delete the message."
  },
  {
    id: "atm-skimmer",
    name: "ATM Card Skimming",
    icon: <ShieldOff className="w-5 h-5" />,
    severity: "MEDIUM",
    color: "yellow",
    trigger: `Hidden device copies card data`,
    metadata: { vector: "Physical ATMs", avgLoss: "₹50,000", target: "ATM Users" },
    steps: [
      { title: "The Hook", desc: "Scammer installs a hidden magnetic skimmer inside the ATM card slot." },
      { title: "The Bait", desc: "A tiny hidden camera is placed pointing at the keypad to record your PIN." },
      { title: "The Trap", desc: "They clone your card onto a blank plastic card and withdraw cash from another location." }
    ],
    redFlags: [
      "ATM card slot looks bulky, loose, or misaligned",
      "Keypad feels unnaturally thick or spongy",
      "Unusual attachments near the top of the ATM machine"
    ],
    whatToDo: "Always wiggle the card slot before inserting, and cover the keypad with your hand while typing PIN."
  }
];

export default function Encyclopedia() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredScams = scams.filter(scam => {
    const matchesSeverity = severityFilter === 'ALL' || scam.severity === severityFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      scam.name.toLowerCase().includes(q) ||
      scam.metadata.vector.toLowerCase().includes(q) ||
      scam.trigger.toLowerCase().includes(q);
    return matchesSeverity && matchesSearch;
  });

  useEffect(() => {
    setActiveIndex(0);
  }, [searchQuery, severityFilter]);

  const activeScam = filteredScams[activeIndex];

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-[#050B18] p-4 md:p-6 lg:p-8 font-sans selection:bg-red-500/30 overflow-hidden flex flex-col transition-colors duration-300">
       <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col z-10 relative">
          
          <header className="mb-8 flex items-center justify-between">
             <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-red-50 dark:bg-red-500/10 border-l-2 border-red-500 mb-3 transition-colors">
                  <Terminal className="w-3 h-3 text-red-600 dark:text-red-500 transition-colors" />
                  <span className="text-[10px] font-black text-red-600 dark:text-red-400 tracking-[0.2em] uppercase transition-colors">Threat Intelligence Database</span>
               </div>
               <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white transition-colors">
                  Scam Dossier
               </h1>
             </div>
             
             <div className="hidden md:flex items-center gap-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-3 rounded-lg shadow-sm dark:shadow-none backdrop-blur-md transition-colors">
               <Fingerprint className="w-5 h-5 text-slate-400 dark:text-gray-500 transition-colors" />
               <div>
                 <p className="text-[10px] text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest transition-colors">Active Records</p>
                 <p className="text-lg font-black text-slate-900 dark:text-white font-mono transition-colors">{String(scams.length).padStart(2, '0')}</p>
               </div>
             </div>
          </header>

          <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
             
             {/* Left Panel - Threat Index */}
             <div className="w-full lg:w-96 flex flex-col gap-3">

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search threats..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/40 transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Severity Filter Tabs */}
                <div className="flex gap-1.5 flex-wrap">
                  {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(level => (
                    <button
                      key={level}
                      onClick={() => setSeverityFilter(level)}
                      className={`px-3 py-1 rounded-md text-[10px] font-black tracking-widest uppercase transition-all duration-200 ${
                        severityFilter === level
                          ? level === 'ALL'      ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                          : level === 'CRITICAL' ? 'bg-red-500 text-white shadow-sm'
                          : level === 'HIGH'     ? 'bg-orange-500 text-white shadow-sm'
                          :                        'bg-yellow-500 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-500 hover:bg-slate-200 dark:hover:bg-white/10'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>

                {/* Scam List */}
                <div className="flex flex-col gap-2 overflow-y-auto pr-2 flex-1" style={{ scrollbarWidth: 'none' }}>
                  {filteredScams.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Search className="w-8 h-8 text-slate-300 dark:text-gray-700 mb-3" />
                      <p className="text-sm font-bold text-slate-500 dark:text-gray-600">No threats found</p>
                      <p className="text-xs text-slate-400 dark:text-gray-700 mt-1">Try a different search or filter</p>
                    </div>
                  ) : (
                    filteredScams.map((scam, index) => {
                      const isActive = index === activeIndex;
                      return (
                        <button 
                          key={scam.id}
                          onClick={() => setActiveIndex(index)}
                          className={`relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group text-left ${
                            isActive 
                              ? 'bg-white dark:bg-white/10 border-slate-200 dark:border-white/20 shadow-md dark:shadow-lg' 
                              : 'bg-slate-100/50 dark:bg-white/[0.02] border-transparent dark:border-white/5 hover:bg-white dark:hover:bg-white/[0.05] hover:border-slate-200 dark:hover:border-white/10 shadow-sm dark:shadow-none'
                          } border`}
                        >
                          {isActive && (
                            <motion.div 
                              layoutId="active-indicator" 
                              className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl shadow-[0_0_10px_rgba(239,68,68,0.4)] dark:shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                            />
                          )}
                          
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                            isActive ? 'bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-500/30' : 'bg-slate-200 dark:bg-gray-800 text-slate-500 dark:text-gray-400 border border-slate-300 dark:border-gray-700'
                          }`}>
                            {scam.icon}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className={`font-bold tracking-tight text-sm transition-colors ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-gray-200'}`}>
                              {scam.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive ? 'bg-red-500 animate-pulse' : 'bg-slate-400 dark:bg-gray-600'}`}></span>
                              <span className="text-[9px] font-black tracking-widest uppercase text-slate-500 dark:text-gray-500 transition-colors">
                                {scam.metadata.vector}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
             </div>

             {/* Right Panel - Threat Dossier */}
             <div className="flex-1 bg-white dark:bg-[#0A1128] border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-none rounded-2xl relative overflow-hidden flex flex-col transition-colors duration-300">
                <AnimatePresence mode="wait">
                  {!activeScam ? (
                    <motion.div key="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-center p-10">
                      <Search className="w-16 h-16 text-slate-200 dark:text-gray-800 mb-4" />
                      <p className="text-2xl font-black text-slate-300 dark:text-gray-700">No records match</p>
                      <p className="text-sm text-slate-400 dark:text-gray-600 mt-2">Adjust your search or filter</p>
                    </motion.div>
                  ) : (
                  <motion.div 
                    key={activeScam.id}
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex-1 overflow-y-auto p-6 md:p-10"
                  >
                    
                    {/* Dossier Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-10 border-b border-slate-200 dark:border-white/5 transition-colors">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                           <span className={`px-3 py-1 rounded-sm text-[10px] font-black tracking-widest uppercase border flex items-center gap-1.5 transition-colors ${
                             activeScam.severity === "CRITICAL" ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 border-red-200 dark:border-red-500/30" :
                             activeScam.severity === "HIGH" ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 border-orange-200 dark:border-orange-500/30" :
                             "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-200 dark:border-yellow-500/30"
                           }`}>
                             <AlertTriangle className="w-3 h-3" />
                             Severity: {activeScam.severity}
                           </span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-lg mb-2 transition-colors">
                          {activeScam.name}
                        </h2>
                        <p className="text-xl italic text-slate-600 dark:text-gray-400 font-medium transition-colors">
                           <span className="text-red-500/80 dark:text-red-500/50 mr-1 font-serif">"</span>
                           {activeScam.trigger}
                           <span className="text-red-500/80 dark:text-red-500/50 ml-1 font-serif">"</span>
                        </p>
                      </div>

                      {/* Metadata Cards */}
                      <div className="flex gap-4">
                         <div className="bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/5 p-4 rounded-xl backdrop-blur-sm transition-colors">
                           <p className="text-[10px] text-slate-500 dark:text-gray-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1.5 transition-colors">
                             <Crosshair className="w-3 h-3 text-slate-400 dark:text-gray-400 transition-colors" />
                             Target Profile
                           </p>
                           <p className="font-bold text-slate-900 dark:text-gray-200 transition-colors">{activeScam.metadata.target}</p>
                         </div>
                         <div className="bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/5 p-4 rounded-xl backdrop-blur-sm transition-colors">
                           <p className="text-[10px] text-red-600/80 dark:text-red-500/80 uppercase font-black tracking-widest mb-1 flex items-center gap-1.5 transition-colors">
                             <Activity className="w-3 h-3 text-red-600 dark:text-red-500 transition-colors" />
                             Avg. Financial Loss
                           </p>
                           <p className="font-bold text-red-600 dark:text-red-400 font-mono transition-colors">{activeScam.metadata.avgLoss}</p>
                         </div>
                      </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                      
                      {/* Left Col: Modus Operandi Timeline */}
                      <div>
                        <h3 className="text-xs font-black text-slate-900 dark:text-white tracking-[0.2em] uppercase mb-8 flex items-center gap-2 transition-colors">
                          <Zap className="w-4 h-4 text-blue-500" />
                          Modus Operandi Timeline
                        </h3>
                        
                        <div className="relative border-l border-slate-200 dark:border-white/10 ml-3 space-y-8 pb-4 transition-colors">
                          {activeScam.steps.map((step, idx) => (
                            <div key={idx} className="relative pl-8">
                               <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-white dark:bg-[#0A1128] border-2 border-blue-500/50 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.1)] dark:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-colors">
                                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 transition-colors">{idx + 1}</span>
                               </div>
                               <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 transition-colors">{step.title}</h4>
                               <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-medium transition-colors">{step.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Col: Red Flags & Defense */}
                      <div className="flex flex-col gap-8">
                         
                         {/* Red Flags Terminal */}
                         <div className="bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-500/10 rounded-2xl p-6 relative overflow-hidden transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl"></div>
                            <h3 className="text-xs font-black text-red-600 dark:text-red-400 tracking-[0.2em] uppercase mb-6 flex items-center gap-2 relative z-10 transition-colors">
                              <ShieldAlert className="w-4 h-4" />
                              Detected Anomalies (Red Flags)
                            </h3>
                            <ul className="space-y-4 relative z-10">
                              {activeScam.redFlags.map((flag, idx) => (
                                 <li key={idx} className="flex items-start gap-3">
                                    <div className="mt-1 min-w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)] dark:shadow-[0_0_5px_rgba(239,68,68,1)]"></div>
                                    <span className="text-sm text-slate-700 dark:text-red-100/70 font-medium leading-snug transition-colors">{flag}</span>
                                 </li>
                              ))}
                            </ul>
                         </div>

                         {/* Defensive Protocol */}
                         <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden mt-auto transition-colors">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9InJnYmEoMTYsMTg1LDEyOSwwLjA1KSIvPjwvc3ZnPg==')] opacity-[0.15] dark:opacity-50 transition-opacity"></div>
                            <h3 className="text-xs font-black text-emerald-600 dark:text-emerald-400 tracking-[0.2em] uppercase mb-4 flex items-center gap-2 relative z-10 transition-colors">
                              <ShieldOff className="w-4 h-4" />
                              Countermeasure Protocol
                            </h3>
                            <p className="text-base text-slate-800 dark:text-emerald-100 font-bold leading-relaxed relative z-10 border-l-2 border-emerald-500/50 pl-4 transition-colors">
                              {activeScam.whatToDo}
                            </p>
                         </div>

                      </div>

                    </div>
                  </motion.div>
                  )}
                </AnimatePresence>
             </div>
             
          </div>
       </div>
    </div>
  );
}
