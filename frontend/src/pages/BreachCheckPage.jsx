import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertTriangle, CheckCircle, Mail, Database, Globe } from 'lucide-react';

export default function BreachCheckPage() {
  const [email, setEmail] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsChecking(true);
    setResult(null);

    try {
      const response = await fetch(`https://api.xposedornot.com/v1/check-email/${email.toLowerCase()}`);
      
      if (response.status === 404) {
        setResult([]);
      } else {
        const data = await response.json();
        if (data.breaches && data.breaches.length > 0) {
          const breachNames = data.breaches[0];
          const formattedBreaches = breachNames.map(name => ({
            name: name,
            date: 'See xposedornot.com',
            compromised: ['Email addresses', 'Potentially Passwords'],
            logo: '⚠️'
          }));
          setResult(formattedBreaches);
        } else {
          setResult([]);
        }
      }
    } catch (error) {
      console.error(error);
      setResult([]);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-[#050B18] p-4 md:p-6 lg:p-8 font-sans transition-colors duration-300 flex flex-col items-center">
      <div className="max-w-3xl w-full z-10 relative mt-10">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-blue-50 dark:bg-blue-500/10 border-l-2 border-blue-500 mb-4">
            <Database className="w-3 h-3 text-blue-600 dark:text-blue-500" />
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 tracking-[0.2em] uppercase">Dark Web Exposure Check</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-4">
            Has your data been leaked?
          </h1>
          <p className="text-lg text-slate-600 dark:text-gray-400">
            Enter your email address to securely check if your personal information has been compromised in known data breaches.
          </p>
        </div>

        <form onSubmit={handleCheck} className="relative max-w-xl mx-auto mb-12">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-6 w-6 text-slate-400" />
          </div>
          <input
            type="email"
            required
            placeholder="Enter your email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full pl-12 pr-32 py-4 bg-white dark:bg-[#0A1128] border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition-all"
          />
          <button
            type="submit"
            disabled={isChecking}
            className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isChecking ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Check</span>
              </>
            )}
          </button>
        </form>

        <AnimatePresence mode="wait">
          {result !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              {result.length === 0 ? (
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Good news!</h2>
                  <p className="text-slate-600 dark:text-gray-400">
                    No pwnage found! Your email address was not found in any known data breaches.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-6 md:p-8 text-center mb-8">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Oh no — pwned!</h2>
                    <p className="text-slate-600 dark:text-gray-400">
                      Your email was found in <strong className="text-red-500 dark:text-red-400">{result.length}</strong> data breaches. You should change your passwords immediately.
                    </p>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 px-2">Breach Details</h3>
                  <div className="grid gap-4">
                    {result.map((breach, idx) => (
                      <div key={idx} className="bg-white dark:bg-[#0A1128] border border-slate-200 dark:border-white/10 p-6 rounded-2xl flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0 w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-3xl">
                          {breach.logo}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xl font-black text-slate-900 dark:text-white">{breach.name}</h4>
                            <span className="text-xs font-medium bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-gray-300 px-2 py-1 rounded">
                              {breach.date}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-1">Compromised Data:</p>
                          <div className="flex flex-wrap gap-2">
                            {breach.compromised.map((data, i) => (
                              <span key={i} className="text-xs bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-1 rounded border border-red-100 dark:border-red-500/20">
                                {data}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mt-12 text-center text-xs text-slate-500 dark:text-gray-600 font-medium flex items-center justify-center gap-1">
          <Globe className="w-3 h-3" />
          <span>Powered by the open-source XposedOrNot API</span>
        </div>
      </div>
    </div>
  );
}
