import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl = "/india.topojson";

const threatData = {
  "Maharashtra": { level: "HIGH", fraudCount: 847, topScam: "Fake KYC SMS" },
  "NCT of Delhi": { level: "HIGH", fraudCount: 612, topScam: "UPI Collect Fraud" },
  "Delhi": { level: "HIGH", fraudCount: 612, topScam: "UPI Collect Fraud" },
  "Uttar Pradesh": { level: "HIGH", fraudCount: 745, topScam: "Fake Job Offer" },
  "Karnataka": { level: "MEDIUM", fraudCount: 432, topScam: "Crypto Fraud" },
  "West Bengal": { level: "MEDIUM", fraudCount: 389, topScam: "Fake Lottery" },
};

const lowScams = ["Phishing Link", "Fake Shopping Site", "Spam Calls", "WhatsApp Scam", "Fake Delivery", "Tech Support Scam", "Free Gift Trap"];

const getThreatDetails = (stateName) => {
  if (threatData[stateName]) return threatData[stateName];
  
  // Deterministic random selection based on stateName so it doesn't flicker on re-renders
  let hash = 0;
  for (let i = 0; i < stateName.length; i++) {
    hash = stateName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash);
  const index = absHash % lowScams.length;
  
  // Make the map more colorful by distributing threat levels (35% HIGH, 40% MEDIUM, 25% LOW)
  const levelVal = absHash % 100;
  let level = "LOW";
  let count = (absHash % 40) + 12;

  if (levelVal < 35) {
    level = "HIGH";
    count = (absHash % 500) + 300;
  } else if (levelVal < 75) {
    level = "MEDIUM";
    count = (absHash % 200) + 80;
  }

  return { level, fraudCount: count, topScam: lowScams[index] };
};

const cities = [
  { name: "Mumbai", coordinates: [72.8777, 19.0760] },
  { name: "Delhi", coordinates: [77.2090, 28.6139] },
  { name: "Bangalore", coordinates: [77.5946, 12.9716] },
  { name: "Kolkata", coordinates: [88.3639, 22.5726] },
  { name: "Chennai", coordinates: [80.2707, 13.0827] },
  { name: "Hyderabad", coordinates: [78.4867, 17.3850] },
  { name: "Pune", coordinates: [73.8567, 18.5204] },
  { name: "Ahmedabad", coordinates: [72.5714, 23.0225] },
  { name: "Jaipur", coordinates: [75.7873, 26.9124] },
  { name: "Lucknow", coordinates: [80.9462, 26.8467] }
];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
  "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Lakshadweep", "Puducherry"
];

export default function IndiaMap({ selectedRegion, onRegionSelect }) {
  const [liveDots, setLiveDots] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Animated new threat dots
  useEffect(() => {
    const interval = setInterval(() => {
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const newDot = {
        id: Date.now(),
        ...randomCity
      };
      
      setLiveDots(prev => [...prev, newDot]);
      
      // Remove dot after 4 seconds
      setTimeout(() => {
        setLiveDots(prev => prev.filter(dot => dot.id !== newDot.id));
      }, 4000);
      
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-white dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-[2rem] flex flex-col md:flex-row shadow-xl dark:shadow-2xl min-h-[500px] transition-colors duration-300 overflow-hidden">

      {/* Map Side */}
      <div className="flex-1 relative flex flex-col">
        {/* Title Row */}
        <div className="flex items-center gap-3 px-8 pt-8 pb-0 z-20 relative">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Live Threat Radar</h2>
        </div>

        <div className="flex-1 p-4 relative flex items-center justify-center overflow-hidden">

         {/* Ambient radar background */}
         <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
           <div className="w-full h-full" style={{ 
             backgroundImage: 'radial-gradient(circle at center, #ef4444 1px, transparent 1px)', 
             backgroundSize: '40px 40px'
           }}></div>
         </div>

         <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 1000,
              center: [85.5, 22.5]
            }}
            className="w-full h-[500px] z-10 drop-shadow-xl"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateName = geo.properties.st_nm;
                  if (!stateName) return null;
                  
                  const details = getThreatDetails(stateName);
                  
                  let fillColor = "#064e3b"; // LOW - dark green
                  let strokeColor = "#10b981";
                  let strokeWidth = 0.5;
                  let extraClasses = "";

                  if (details.level === "HIGH") {
                    fillColor = "#7f1d1d"; // Dark Red
                    strokeColor = "#ef4444";
                    extraClasses = "animate-[pulse_2s_ease-in-out_infinite]";
                  } else if (details.level === "MEDIUM") {
                    fillColor = "#713f12"; // Dark Yellow
                    strokeColor = "#eab308";
                  }

                  const isSelected = selectedRegion && selectedRegion.name === (stateName === "NCT of Delhi" ? "Delhi" : stateName);
                  if (isSelected) {
                    strokeColor = "#ffffff";
                    strokeWidth = 1.5;
                    extraClasses += " drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] z-50";
                  }

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      className={`outline-none transition-colors duration-300 hover:brightness-150 cursor-pointer ${extraClasses}`}
                      onClick={() => {
                        const name = stateName === "NCT of Delhi" ? "Delhi" : stateName;
                        if (onRegionSelect) {
                          onRegionSelect({
                            name: name,
                            ...details
                          });
                        }
                      }}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: details.level === 'HIGH' ? '#b91c1c' : (details.level === 'MEDIUM' ? '#a16207' : '#059669') },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Live Threat Dots */}
            {liveDots.map(dot => (
              <Marker key={dot.id} coordinates={dot.coordinates}>
                <circle r={6} fill="#ef4444" className="animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
                <circle r={3} fill="#ffffff" />
              </Marker>
            ))}
          </ComposableMap>
        </div>
      </div>

      {/* Sidebar Details */}
      <div className="w-full md:w-72 bg-slate-50 dark:bg-[#0A1128] border-l border-slate-200 dark:border-white/5 px-8 pt-8 pb-8 flex flex-col z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] dark:shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transition-colors duration-300">
        <h3 className="text-xs font-black text-slate-500 dark:text-gray-600 uppercase tracking-[0.2em] mb-6 transition-colors leading-[28px]">Region Inspector</h3>
        
        {/* State Search Bar */}
        <div className="relative mb-6">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <svg className="h-4 w-4 text-slate-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
           </div>
           <input 
             type="text" 
             placeholder="Search state..." 
             value={searchQuery}
             onFocus={() => setShowDropdown(true)}
             onBlur={() => setShowDropdown(false)}
             onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
             className="w-full bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
           />
           {showDropdown && searchQuery && (
             <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto custom-scrollbar">
               {indianStates.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).map(s => (
                 <div 
                   key={s} 
                   className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer text-sm font-medium text-slate-700 dark:text-gray-300 transition-colors"
                   onMouseDown={(e) => {
                     e.preventDefault(); // Prevents input from losing focus immediately
                     setSearchQuery("");
                     setShowDropdown(false);
                     if (onRegionSelect) {
                       const details = getThreatDetails(s);
                       onRegionSelect({ name: s, ...details });
                     }
                   }}
                 >
                   {s}
                 </div>
               ))}
               {indianStates.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                 <div className="px-4 py-3 text-sm text-slate-500 dark:text-gray-500 text-center">No state found</div>
               )}
             </div>
           )}
        </div>

        {selectedRegion ? (
          <div className="animate-[fadeIn_0.3s_ease-in-out]">
             <div className="flex items-center gap-3 mb-8">
               {selectedRegion.level === "HIGH" && <span className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse"></span>}
               {selectedRegion.level === "MEDIUM" && <span className="w-3.5 h-3.5 rounded-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.8)] animate-pulse"></span>}
               {selectedRegion.level === "LOW" && <span className="w-3.5 h-3.5 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]"></span>}
               <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">{selectedRegion.name}</h2>
             </div>
             
             <div className="bg-white dark:bg-[#111] rounded-2xl p-5 border border-slate-200 dark:border-white/5 mb-5 shadow-sm dark:shadow-inner transition-colors">
                <p className="text-[10px] text-slate-500 dark:text-gray-500 uppercase font-black tracking-widest mb-1.5 transition-colors">Threat Level</p>
                <p className={`font-black tracking-widest text-lg ${selectedRegion.level === 'HIGH' ? 'text-red-500' : (selectedRegion.level === 'MEDIUM' ? 'text-yellow-500' : 'text-green-500')}`}>
                  {selectedRegion.level}
                </p>
             </div>

             <div className="bg-white dark:bg-[#111] rounded-2xl p-5 border border-slate-200 dark:border-white/5 mb-5 shadow-sm dark:shadow-inner transition-colors">
                <p className="text-[10px] text-slate-500 dark:text-gray-500 uppercase font-black tracking-widest mb-1.5 transition-colors">Reports Today</p>
                <p className="text-4xl font-black text-slate-900 dark:text-white transition-colors">{selectedRegion.fraudCount}</p>
             </div>

             <div className="bg-white dark:bg-[#111] rounded-2xl p-5 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-inner transition-colors">
                <p className="text-[10px] text-slate-500 dark:text-gray-500 uppercase font-black tracking-widest mb-2 transition-colors">Top Active Scam</p>
                <p className="text-sm font-bold text-red-500 dark:text-red-400 transition-colors">{selectedRegion.topScam}</p>
             </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 hover:opacity-70 transition-opacity">
            <svg className="w-16 h-16 text-slate-400 dark:text-gray-600 mb-6 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400 max-w-[200px] transition-colors">Select a region on the map to intercept live threat telemetry.</p>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
