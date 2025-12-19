
import React from 'react';
import { ArrowLeft, Search, Calendar, Heart, Flame, Leaf, Coffee, Wine, Utensils, Lock } from 'lucide-react';

interface ExploreScreenProps {
  onBack: () => void;
  onSelectCategory: (category: string) => void;
  isPro: boolean;
  usageCount: number;
  maxFreeUses: number;
  unlockedPacks: string[];
}

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ 
    onBack, 
    onSelectCategory,
    isPro,
    usageCount,
    maxFreeUses,
    unlockedPacks
}) => {
  
  const seasonalCategories: Category[] = [
    { id: 'Festa Junina', label: 'Festa Junina 🌽', icon: <Flame className="w-5 h-5" />, color: 'text-orange-600', bg: 'bg-orange-100' },
    { id: 'Páscoa', label: 'Páscoa 🐰', icon: <span className="text-xl">🍫</span>, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { id: 'Natal', label: 'Natal 🎄', icon: <span className="text-xl">🎅</span>, color: 'text-red-600', bg: 'bg-red-100' },
    { id: 'Ano Novo', label: 'Ano Novo 🥂', icon: <span className="text-xl">✨</span>, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  ];

  const mealCategories: Category[] = [
    { id: 'Café da Manhã', label: 'Café da Manhã', icon: <Coffee className="w-5 h-5" />, color: 'text-amber-700', bg: 'bg-amber-100' },
    { id: 'Almoço de Domingo', label: 'Almoço de Domingo', icon: <Utensils className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-100' },
    { id: 'Jantar Romântico', label: 'Jantar Romântico', icon: <Wine className="w-5 h-5" />, color: 'text-rose-600', bg: 'bg-rose-100' },
    { id: 'Lanche Rápido', label: 'Lanche Rápido', icon: <span className="text-xl">🥪</span>, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  const dietCategories: Category[] = [
    { id: 'Fitness / Saudável', label: 'Fitness / Saudável', icon: <Leaf className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { id: 'Comfort Food', label: 'Conforto (Comfort Food)', icon: <Heart className="w-5 h-5" />, color: 'text-pink-600', bg: 'bg-pink-100' },
    { id: 'Vegetariano', label: 'Vegetariano', icon: <span className="text-xl">🥦</span>, color: 'text-lime-600', bg: 'bg-lime-100' },
    { id: 'Econômicas', label: 'Econômicas', icon: <span className="text-xl">💰</span>, color: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  // Logic to determine if a category is locked
  const isLocked = (catId: string) => {
      if (isPro) return false;
      if (unlockedPacks.includes(catId)) return false;
      if (usageCount < maxFreeUses) return false;
      return true; // Locked if limit reached and not pro/owned
  };

  const renderSection = (title: string, categories: Category[]) => (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => {
          const locked = isLocked(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative p-4 rounded-2xl border border-transparent hover:border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 bg-white active:scale-95 group h-32 overflow-hidden`}
            >
              {locked && (
                  <div className="absolute top-2 right-2 bg-gray-100 p-1.5 rounded-full z-10">
                      <Lock className="w-3 h-3 text-gray-400" />
                  </div>
              )}
              
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform ${locked ? 'opacity-50 grayscale' : ''}`}>
                {cat.icon}
              </div>
              <span className={`font-bold text-sm text-gray-700 text-center leading-tight ${locked ? 'opacity-50' : ''}`}>{cat.label}</span>
              
              {/* Optional: Lock Overlay if desired, but subtle icon is cleaner */}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10 px-6 py-4">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Explorar Receitas</h1>
        </div>
      </div>

      <div className="p-6">
        {/* Search Placeholder */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-3 text-gray-400">
            <Search className="w-5 h-5" />
            <span className="text-sm font-medium">O que você quer comer hoje?</span>
        </div>

        {renderSection("Sazonais & Festas", seasonalCategories)}
        {renderSection("Ocasiões", mealCategories)}
        {renderSection("Estilos & Dietas", dietCategories)}
        
        <div className="mt-8 p-6 bg-emerald-50 rounded-3xl text-center border border-emerald-100">
            <p className="text-emerald-800 font-bold mb-2">Não achou o que queria?</p>
            <p className="text-sm text-emerald-600 mb-4">Use a câmera para escanear seus ingredientes e criar algo novo.</p>
            <button 
                onClick={onBack}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors"
            >
                Voltar para Câmera
            </button>
        </div>
      </div>
    </div>
  );
};
