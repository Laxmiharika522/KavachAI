import React, { useState, useEffect } from 'react';
import ScamFeed from './ScamFeed';
import IndiaMap from './IndiaMap';

// Stats will be dynamic inside the component

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const INR = (n) => "\u20b9" + n.toLocaleString("en-IN");

const generateTickerItems = () => [
  { text: "Fake SBI KYC SMS reported in Delhi \u2014 Account Block Attempt", type: "warn" },
  { text: "UPI Fraud of " + INR(rnd(10000, 49000)) + " reported in Mumbai", type: "alert" },
  { text: "Fake Job Offer targeting students in Bangalore \u2014 " + INR(rnd(1500, 5000)) + " Fee", type: "warn" },
  { text: "OTP Fraud " + INR(rnd(5000, 29000)) + " reported in Pune", type: "alert" },
  { text: "Fake Police Call reported in Lucknow \u2014 Demanded " + INR(rnd(15000, 120000)), type: "warn" },
  { text: "Phishing Link impersonating ICICI Bank detected in Chennai", type: "alert" },
  { text: "Lottery Scam SMS blast detected across Gujarat", type: "warn" },
  { text: "Loan App Scam " + INR(rnd(8000, 70000)) + " reported in Hyderabad", type: "alert" },
  { text: "Crypto Investment Fraud " + INR(rnd(50000, 500000)) + " reported in Ahmedabad", type: "warn" },
  { text: "Fake CBI Call demanding " + INR(rnd(50000, 200000)) + " reported in Kolkata", type: "alert" },
  { text: "Fake TRAI Disconnection Threat reported in Jaipur", type: "warn" },
  { text: "QR Code Scam " + INR(rnd(3000, 15000)) + " reported in Surat", type: "alert" },
  { text: "Fake RBI Freeze Notice reported in Noida", type: "warn" },
  { text: "Investment Fraud " + INR(rnd(100000, 700000)) + " reported in Bengaluru", type: "alert" },
];

const NewsTicker = () => {
  const [items, setItems] = useState(() => generateTickerItems());

  useEffect(() => {
    const interval = setInterval(() => {
      setItems(generateTickerItems());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Duplicate for seamless loop
  const allItems = [...items, ...items];

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 h-12 flex items-center overflow-hidden bg-white dark:bg-[#030712] border-t border-slate-200 dark:border-white/5 shadow-[0_-4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_30px_rgba(0,0,0,0.6)] transition-colors duration-300">
      
      {/* Fixed LIVE badge */}
      <div className="h-full px-5 flex items-center gap-3 flex-shrink-0 bg-slate-50 dark:bg-[#030712] border-l-4 border-red-500 shadow-[20px_0_30px_#f8fafc] dark:shadow-[20px_0_30px_#030712] z-20 transition-colors duration-300">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.9)]"></span>
        <span className="text-red-500 text-xs font-black tracking-widest uppercase">LIVE</span>
      </div>

      {/* Scrolling text */}
      <div className="flex-1 overflow-hidden h-full flex items-center relative">
        <div className="flex items-center whitespace-nowrap" style={{ animation: 'ticker 40s linear infinite' }}>
          {allItems.map((item, idx) => (
            <span key={idx} className="inline-flex items-center">
              <span className={`text-sm font-medium px-2 tracking-wide transition-colors duration-300 ${item.type === 'alert' ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-slate-700 dark:text-gray-300'}`}>
                <span className="mr-2">{item.type === 'alert' ? '🔴' : '⚠️'}</span>
                {item.text}
              </span>
              <span className="text-red-600 mx-6 text-lg">&bull;</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [liveStats, setLiveStats] = useState({
    scamsDetected: 12453,
    activeThreats: 45,
    moneySaved: 4.20
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        scamsDetected: prev.scamsDetected + Math.floor(Math.random() * 3), // +0 to 2
        activeThreats: Math.max(30, Math.min(60, prev.activeThreats + (Math.floor(Math.random() * 3) - 1))), // fluctuate +/- 1
        moneySaved: prev.moneySaved + (Math.random() * 0.01) // +0 to 0.01 Cr
      }));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Scams Detected Today", value: liveStats.scamsDetected.toLocaleString("en-IN"), color: "text-red-500" },
    { label: "Active Threats", value: liveStats.activeThreats.toString(), color: "text-red-400" },
    { label: "Total Money Saved", value: `\u20b9${liveStats.moneySaved.toFixed(2)} Cr`, color: "text-green-500" },
    { label: "National Threat Level", value: "HIGH", color: "text-red-500" }
  ];

  return (
    <div className="p-4 md:p-8 lg:p-12 text-slate-900 dark:text-white font-sans max-w-[1600px] mx-auto pb-20 transition-colors duration-300">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 mb-4 transition-colors">
           <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
           <span className="text-[10px] font-black text-red-500 dark:text-red-400 tracking-[0.2em] uppercase">System Armed</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tighter text-slate-900 dark:text-white transition-colors">
          Live Threat Dashboard
        </h1>
        <p className="text-slate-600 dark:text-gray-400 text-lg font-medium transition-colors">Real-time scam monitoring and intelligence network across India.</p>
      </header>

      {/* Stats Row */}
      <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 mb-8 shadow-xl dark:shadow-2xl transition-colors duration-300">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200 dark:divide-white/5 transition-colors">
          {stats.map((stat, idx) => (
            <div key={idx} className={`px-4 ${idx === 0 ? 'pl-0' : 'md:pl-8'}`}>
              <h3 className="text-[10px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-3 transition-colors">{stat.label}</h3>
              <p className={`text-3xl md:text-4xl font-black tracking-tight ${stat.color} drop-shadow-sm dark:drop-shadow-md`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
         <div className="xl:col-span-2">
           <IndiaMap selectedRegion={selectedRegion} onRegionSelect={setSelectedRegion} />
         </div>
         <div className="xl:col-span-1">
           <ScamFeed />
         </div>
      </div>

      <NewsTicker />
    </div>
  );
}
