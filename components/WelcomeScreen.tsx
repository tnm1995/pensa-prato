
import React from 'react';
import { Home, Utensils, Users } from 'lucide-react';

interface WelcomeScreenProps {
  onSelectAny: () => void;
  onSelectFamily: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectAny, onSelectFamily }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-emerald-600 rounded-b-[3rem] shadow-lg z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute top-20 -left-20 w-40 h-40 bg-emerald-300 rounded-full blur-2xl opacity-20"></div>

      <div className="relative z-10 pt-16 px-6 pb-6 flex-1 flex flex-col">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/30 backdrop-blur-md rounded-2xl mb-4 ring-1 ring-emerald-400/50 shadow-lg">
            <Utensils className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 shadow-sm">Quem vai comer hoje?</h1>
          <p className="text-emerald-100 text-sm font-medium">Escolha o perfil ideal para as sugestões</p>
        </div>

        <div className="flex-1 flex flex-col gap-5 w-full max-w-md mx-auto justify-start">
          {/* Top Button: Anyone */}
          <button
            onClick={onSelectAny}
            className="group relative bg-white rounded-3xl p-6 transition-all duration-300 flex flex-row items-center text-left shadow-lg shadow-emerald-900/5 hover:shadow-xl hover:shadow-emerald-900/10 active:scale-[0.98] border border-transparent hover:border-emerald-100"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mr-5 group-hover:bg-emerald-100 transition-colors shrink-0">
              <Utensils className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-emerald-700 transition-colors">Qualquer pessoa</h2>
              <p className="text-xs text-gray-500 font-medium">Receitas livres, sem restrições ou filtros.</p>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity -mr-2 group-hover:mr-0">
                {/* Arrow icon could go here */}
            </div>
          </button>

          {/* Bottom Button: Family */}
          <button
            onClick={onSelectFamily}
            className="group relative bg-white rounded-3xl p-6 transition-all duration-300 flex flex-row items-center text-left shadow-lg shadow-emerald-900/5 hover:shadow-xl hover:shadow-emerald-900/10 active:scale-[0.98] border border-transparent hover:border-emerald-100"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mr-5 group-hover:bg-blue-100 transition-colors shrink-0">
              <div className="relative">
                  <Home className="w-8 h-8 text-blue-600" />
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-blue-50">
                       <Users className="w-3 h-3 text-blue-600" />
                  </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-700 transition-colors">Família</h2>
              <p className="text-xs text-gray-500 font-medium">Adaptado para as restrições de cada um.</p>
            </div>
          </button>
        </div>

        <div className="text-center mt-auto pt-8 pb-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Geladeira Cheia • IA Inteligente</p>
        </div>
      </div>
    </div>
  );
};
