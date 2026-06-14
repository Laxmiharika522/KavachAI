import React, { useState, useEffect, useRef } from 'react';

const formatMoney = (amount) => `₹${amount.toLocaleString('en-IN')}`;
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Function to generate the badge value so we get fresh randoms every time
const scamBlueprints = [
  { type: "UPI Fraud",            city: "Mumbai",       state: "MH", badgeFn: () => formatMoney(randomBetween(5000, 50000)),    color: "red"    },
  { type: "Fake KYC",             city: "Delhi",        state: "DL", badgeFn: () => "Account Block",                            color: "yellow" },
  { type: "OTP Fraud",            city: "Pune",         state: "MH", badgeFn: () => formatMoney(randomBetween(3000, 30000)),    color: "red"    },
  { type: "Job Scam",             city: "Bangalore",    state: "KA", badgeFn: () => "₹2,500 Fee",                               color: "yellow" },
  { type: "Fake Police Call",     city: "Lucknow",      state: "UP", badgeFn: () => formatMoney(randomBetween(10000, 200000)),  color: "red"    },
  { type: "Phishing Link",        city: "Chennai",      state: "TN", badgeFn: () => "Link Blocked",                             color: "green"  },
  { type: "Loan App Scam",        city: "Hyderabad",    state: "TS", badgeFn: () => formatMoney(randomBetween(8000, 75000)),    color: "red"    },
  { type: "Sextortion",           city: "Jaipur",       state: "RJ", badgeFn: () => formatMoney(randomBetween(20000, 500000)), color: "red"    },
  { type: "Lottery Scam",         city: "Kolkata",      state: "WB", badgeFn: () => "₹50,000",                                 color: "red"    },
  { type: "Fake KYC",             city: "Ahmedabad",    state: "GJ", badgeFn: () => "OTP Leaked",                              color: "yellow" },
  { type: "Crypto Fraud",         city: "Surat",        state: "GJ", badgeFn: () => formatMoney(randomBetween(50000, 700000)), color: "red"    },
  { type: "Fake CBI Call",        city: "Noida",        state: "UP", badgeFn: () => formatMoney(randomBetween(30000, 300000)), color: "red"    },
  { type: "WhatsApp Scam",        city: "Bhopal",       state: "MP", badgeFn: () => "Data Stolen",                             color: "yellow" },
  { type: "Investment Fraud",     city: "Indore",       state: "MP", badgeFn: () => formatMoney(randomBetween(100000, 900000)),color: "red"    },
  { type: "QR Code Scam",         city: "Chandigarh",   state: "PB", badgeFn: () => formatMoney(randomBetween(2000, 20000)),   color: "red"    },
  { type: "Fake TRAI Notice",     city: "Nagpur",       state: "MH", badgeFn: () => "SIM Block Threat",                        color: "yellow" },
  { type: "Delivery Scam",        city: "Patna",        state: "BR", badgeFn: () => "₹199 Customs Fee",                        color: "yellow" },
  { type: "Tech Support Scam",    city: "Coimbatore",   state: "TN", badgeFn: () => formatMoney(randomBetween(5000, 40000)),   color: "red"    },
  { type: "Fake Electricity Bill",city: "Bhubaneswar",  state: "OD", badgeFn: () => "Link Clicked",                            color: "yellow" },
  { type: "Romance Scam",         city: "Kochi",        state: "KL", badgeFn: () => formatMoney(randomBetween(20000, 200000)), color: "red"    },
  { type: "Screen Share Fraud",   city: "Gurgaon",      state: "HR", badgeFn: () => formatMoney(randomBetween(15000, 150000)), color: "red"    },
  { type: "Fake RBI Notice",      city: "Srinagar",     state: "JK", badgeFn: () => "Account Freeze",                          color: "yellow" },
  { type: "SIM Swap Fraud",       city: "Visakhapatnam",state: "AP", badgeFn: () => formatMoney(randomBetween(10000, 80000)),  color: "red"    },
  { type: "Insurance Scam",       city: "Vadodara",     state: "GJ", badgeFn: () => "₹5,000 Premium",                          color: "yellow" },
  { type: "Fake Job Offer",       city: "Dehradun",     state: "UK", badgeFn: () => "₹3,000 Fee",                              color: "yellow" },
  { type: "Ponzi Scheme",         city: "Raipur",       state: "CG", badgeFn: () => formatMoney(randomBetween(50000, 500000)), color: "red"    },
  { type: "UPI Collect Fraud",    city: "Agra",         state: "UP", badgeFn: () => formatMoney(randomBetween(5000, 45000)),   color: "red"    },
  { type: "Fake Scholarship",     city: "Guwahati",     state: "AS", badgeFn: () => "₹1,500 Fee",                              color: "yellow" },
  { type: "Aadhaar Fraud",        city: "Thiruvananthapuram", state: "KL", badgeFn: () => "Identity Stolen",                   color: "red"    },
  { type: "Fake Amazon Refund",   city: "Mysore",       state: "KA", badgeFn: () => formatMoney(randomBetween(2000, 15000)),   color: "yellow" },
];

const getBadgeClasses = (color) => {
  switch(color) {
    case 'red': return "text-red-400 bg-red-400/10 border-red-400/20";
    case 'green': return "text-green-400 bg-green-400/10 border-green-400/20";
    case 'yellow':
    default: return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
  }
};

const getNextRandomScam = (recentTypes) => {
  // Filter out any type that is in the recentTypes array (up to 20)
  const available = scamBlueprints.filter(s => !recentTypes.includes(s.type));
  const pool = available.length > 0 ? available : scamBlueprints;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  return {
    id: Date.now() + Math.random(),
    type: picked.type,
    location: `${picked.city}, ${picked.state}`,
    time: "Just now",
    amount: picked.badgeFn(),
    badgeColor: picked.color,
    rawType: picked.type
  };
};

// Generate initial list
const generateInitialFeed = (history) => {
  const feed = [];
  for (let i = 0; i < 5; i++) {
    const item = getNextRandomScam(history);
    history.unshift(item.rawType);
    if (history.length > 20) history.pop();

    item.time = i === 0 ? "Just now" : `${i * 2 + 1} mins ago`;
    feed.push(item);
  }
  return feed;
};

export default function ScamFeed() {
  const [feed, setFeed] = useState([]);
  const historyRef = useRef([]);

  useEffect(() => {
    // Generate initial feed on mount to shuffle
    const initial = generateInitialFeed(historyRef.current);
    setFeed(initial);

    const interval = setInterval(() => {
      const newItem = getNextRandomScam(historyRef.current);
      historyRef.current.unshift(newItem.rawType);
      if (historyRef.current.length > 20) historyRef.current.pop();

      setFeed(prev => {
        const newFeed = [newItem, ...prev].slice(0, 10);
        return newFeed.map((item, idx) => {
           if (idx === 0) return item;
           // Simply increment time for older items to simulate feed scrolling
           return { ...item, time: `${idx * 2 + 1} mins ago` };
        });
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 h-[500px] flex flex-col shadow-xl dark:shadow-2xl transition-colors duration-300">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight transition-colors">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
          </span>
          Live Scam Feed
        </h2>
        <span className="bg-red-50 dark:bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-red-200 dark:border-red-500/20 shadow-sm dark:shadow-[0_0_10px_rgba(239,68,68,0.1)] transition-colors">
          LIVE
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {feed.map((item) => (
          <div key={item.id} className="bg-slate-50 dark:bg-[#0A1128] border border-slate-200 dark:border-white/5 p-4 rounded-xl hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300 transform shadow-sm dark:shadow-inner animate-[fadeIn_0.5s_ease-out]">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-800 dark:text-gray-200 text-sm tracking-wide transition-colors">{item.type}</h3>
              <span className="text-xs text-slate-500 dark:text-gray-500 font-medium transition-colors">{item.time}</span>
            </div>
            <div className="flex justify-between items-end mt-4">
               <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-gray-400 flex items-center gap-1.5 font-bold transition-colors">
                 <svg className="w-3.5 h-3.5 text-slate-400 dark:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                 {item.location}
               </p>
               <p className={`text-[10px] font-black tracking-wider uppercase px-2 py-1 rounded-md border ${getBadgeClasses(item.badgeColor)}`}>
                 {item.amount}
               </p>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
