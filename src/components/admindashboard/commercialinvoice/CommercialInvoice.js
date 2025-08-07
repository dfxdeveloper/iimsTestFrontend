import React, { useState, useEffect } from 'react';
import { FileText, Clock } from 'lucide-react';

function CommercialInvoice() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-24 bg-gradient-to-br from-indigo-900 via-blue-900 to-pink-900 relative overflow-hidden flex items-center justify-center">
      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Geometric shapes */}
      <div className="absolute top-32 right-32 w-32 h-32 border-2 border-pink-400/30 rounded-full animate-spin-slow opacity-60"></div>
      <div className="absolute bottom-32 left-32 w-24 h-24 border-2 border-purple-400/30 rotate-45 animate-pulse opacity-60"></div>

      {/* Main content */}
      <div className="text-center z-10 px-8">
        
        {/* Icon with glow */}
        <div className="relative mb-8 inline-block">
          <div className="absolute inset-0 bg-pink-500/50 rounded-full blur-xl animate-pulse scale-150"></div>
          <div className="relative bg-pink-500 p-6 rounded-full shadow-2xl">
            <FileText size={48} className="text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-wide">
          Commercial
        </h1>
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-8 tracking-wide">
          Invoice
        </h2>

        {/* Subtitle */}
        <p className="text-xl text-gray-300 mb-8 font-light">
          ✨ Something amazing is coming ✨
        </p>

        {/* Status */}
        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 shadow-lg">
          <Clock className="text-cyan-400 animate-pulse" size={20} />
          <span className="text-white font-medium">Under Development{dots}</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default CommercialInvoice;