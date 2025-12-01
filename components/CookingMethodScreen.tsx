
import React from 'react';
import { Wind, Flame, ChefHat, UtensilsCrossed, ArrowLeft } from 'lucide-react';
import { CookingMethod } from '../types';

interface CookingMethodScreenProps {
  onSelectMethod: (method: CookingMethod) => void;
  onBack: () => void;
}

export const CookingMethodScreen: React.FC<CookingMethodScreenProps> = ({ onSelectMethod, onBack }) => {
  
  const methods = [
    {
      id: CookingMethod.AIRFRYER,
      label: 'AirFryer',
      description: 'Rápido e crocante',
      icon: Wind,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
      border: 'hover:border-emerald-400'
    },
    {
      id: CookingMethod.STOVE,
      label: 'Fogão',
      description: 'Clássico de panela',
      icon: Flame,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      border: 'hover:border-orange-400'
    },
    {
      id: CookingMethod.OVEN,
      label: 'Forno',
      description: 'Assados e pães',
      icon: ChefHat, 
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      border: 'hover:border-blue-400'
    },
    {
      id: CookingMethod.ANY,
      label: 'Todos',
      description: 'Qualquer método',
      icon: UtensilsCrossed,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      border: 'hover:border-purple-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6 pb-24">
      <div className="flex items-center pt-4 z-10 relative">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-white rounded-full transition-colors mr-2 shadow-sm bg-white/50">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 mx-auto pr-8 leading-tight">Onde preparar?</h1>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-4 w-full">
            {methods.map((method) => (
                <button
                    key={method.id}
                    onClick={() => onSelectMethod(method.id)}
                    className={`group relative bg-white border border-transparent ${method.border} rounded-[1.5rem] p-4 transition-all duration-300 flex flex-col items-center text-center shadow-sm hover:shadow-lg active:scale-[0.98] aspect-square justify-center`}
                >
                    <div className={`w-14 h-14 ${method.bg} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                        <method.icon className={`w-7 h-7 ${method.color}`} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-800 mb-0.5">{method.label}</h3>
                        <p className="text-[10px] text-gray-400 font-medium leading-tight">{method.description}</p>
                    </div>
                </button>
            ))}
        </div>

        <div className="text-center mt-8">
            <p className="text-xs text-gray-400 font-medium">Toque para selecionar</p>
        </div>
      </div>
    </div>
  );
};
