
import React from 'react';
import { Logo } from './Logo';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decorativo Sutil */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700">
        <div className="mb-6 relative">
            <div className="absolute inset-0 bg-emerald-200/20 rounded-full blur-xl animate-pulse"></div>
            <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-emerald-100/50 ring-1 ring-emerald-50 relative animate-bounce-slow">
                <Logo size={72} />
            </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
            Pensa <span className="text-[#00C853]">Prato</span>
        </h1>
        
        <div className="flex items-center gap-2 mt-4">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>

      <div className="absolute bottom-8 text-center">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Carregando sua cozinha...</p>
      </div>
      
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(5%); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
