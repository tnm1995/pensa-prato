
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Scale, Heart, ChevronRight, AlertCircle, ChefHat, LogOut, Star, Save, X, Utensils, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { Recipe, FamilyMember } from '../types';

interface ProfileScreenProps {
  userProfile: FamilyMember;
  onSaveProfile: (member: FamilyMember) => void;
  onBack: () => void;
  favorites: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  initialTab?: 'history' | 'favorites' | 'settings';
  onLogout: () => void;
  pantryItems?: string[];
  onUpdatePantry?: (items: string[]) => void;
  recipesCount?: number;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
    userProfile, 
    onSaveProfile, 
    onBack, 
    favorites = [], 
    onSelectRecipe, 
    initialTab = 'settings', 
    onLogout,
    pantryItems = [],
    onUpdatePantry,
    recipesCount = 0
}) => {
  // Safe destructuring with defaults to avoid crash if profile is temporarily undefined
  const { name = 'Usuário', avatar = '', dislikes: initialDislikes = '', restrictions: initialRestrictions = [] } = userProfile || {};

  // If initialTab is favorites, we treat it as a separate view mode. 
  // Otherwise, we default to the main profile view (which now contains settings directly).
  const isFavoritesView = initialTab === 'favorites';
  
  // Local state for editing profile
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [restrictions, setRestrictions] = useState<string[]>(initialRestrictions);
  
  // Refs for scrolling
  const pantryRef = useRef<HTMLDivElement>(null);

  // Collapsible state
  // Auto-open Pantry if it's empty to encourage filling it out
  const [showPantryOptions, setShowPantryOptions] = useState(pantryItems.length === 0);
  
  const hasInitialData = (initialDislikes && initialDislikes.length > 0) || (initialRestrictions && initialRestrictions.length > 0);
  const [showDietaryOptions, setShowDietaryOptions] = useState(hasInitialData);

  const commonRestrictions = [
    "Vegano", "Vegetariano", "Sem Glúten", "Sem Lactose", "APLV", "Diabético", "Hipertenso"
  ];

  const commonPantry = [
      "Sal", "Açúcar", "Óleo", "Azeite", "Pimenta", "Café", 
      "Arroz", "Feijão", "Farinha de Trigo", "Leite", "Ovos", 
      "Manteiga", "Vinagre", "Alho", "Cebola"
  ];

  // Sync state with prop if it changes
  useEffect(() => {
    if (userProfile) {
        setDislikes(userProfile.dislikes || '');
        setRestrictions(userProfile.restrictions || []);
    }
  }, [userProfile]);

  const toggleRestriction = (res: string) => {
    if (restrictions.includes(res)) {
      setRestrictions(restrictions.filter(r => r !== res));
    } else {
      setRestrictions([...restrictions, res]);
    }
  };

  const togglePantryItem = (item: string) => {
      if (onUpdatePantry) {
          if (pantryItems.includes(item)) {
              onUpdatePantry(pantryItems.filter(i => i !== item));
          } else {
              onUpdatePantry([...pantryItems, item]);
          }
      }
  };

  const handleSavePreferences = () => {
    const updatedProfile: FamilyMember = {
        ...userProfile,
        dislikes,
        restrictions
    };
    onSaveProfile(updatedProfile);
  };

  const scrollToPantry = () => {
      setShowPantryOptions(true);
      setTimeout(() => {
          pantryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
  };

  // Stats vinculados aos dados reais
  const stats = [
    { label: "Receitas Feitas", value: recipesCount.toString(), icon: ChefHat, color: "text-blue-500", bg: "bg-blue-50" }, 
    { 
        label: "Na Despensa", 
        value: pantryItems.length.toString(), 
        icon: Scale, 
        color: "text-emerald-500", 
        bg: "bg-emerald-50",
        action: scrollToPantry // Link to open pantry
    },
    { label: "Favoritos", value: favorites.length.toString(), icon: Heart, color: "text-red-500", bg: "bg-red-50" },
  ];

  // Helper to render avatar
  const renderAvatar = () => {
      const isImage = avatar && (avatar.startsWith('http') || avatar.startsWith('data:'));
      
      if (isImage) {
        return <img src={avatar} alt={name} className="w-full h-full object-cover" />;
      }
      if (avatar) {
        return <div className="w-full h-full flex items-center justify-center bg-white text-5xl">{avatar}</div>;
      }
      return <img src={`https://ui-avatars.com/api/?name=${name}&background=10b981&color=fff`} alt={name} className="w-full h-full object-cover" />;
  };

  // --- LAYOUT EXCLUSIVO DE FAVORITOS ---
  if (isFavoritesView) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header Favoritos */}
        <div className="bg-white shadow-sm pt-4 px-6 pb-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
             <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
             </button>
             <h1 className="text-xl font-bold text-gray-900">Meus Favoritos</h1>
             <div className="w-10"></div>
          </div>
        </div>

        <div className="px-4 mt-6 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {favorites.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm mx-auto max-w-sm">
                <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Heart className="w-10 h-10 text-red-300 fill-current" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Nenhuma favorita</h3>
                <p className="text-sm text-gray-500 max-w-[200px] mx-auto">
                    Toque no coração ❤️ nas receitas para salvar aqui.
                </p>
            </div>
          ) : (
            favorites.map((recipe, idx) => (
                <div 
                    key={idx} 
                    onClick={() => onSelectRecipe(recipe)}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-emerald-200 hover:shadow-md transition-all group"
                >
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900 text-lg leading-tight pr-4">{recipe.title}</h4>
                        <div className="p-1 bg-red-50 rounded-full">
                            <Heart className="w-4 h-4 text-red-500 fill-current" />
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="flex items-center gap-1 text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-md">
                            <ClockIcon className="w-3 h-3" /> {recipe.time_minutes} min
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-md">
                            {recipe.difficulty}
                        </span>
                        {recipe.rating && recipe.rating > 0 && (
                            <span className="flex items-center gap-0.5 text-amber-50 bg-amber-50 px-2 py-1 rounded-md text-xs font-bold">
                                <Star className="w-3 h-3 fill-current" />
                                {recipe.rating}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                        <div className="flex gap-1">
                            {recipe.tags.slice(0, 3).map((t, i) => (
                                <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase tracking-wide">{t}</span>
                            ))}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                    </div>
                </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // --- LAYOUT DE PERFIL PRINCIPAL ---
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Profile */}
      <div className="bg-white shadow-sm pb-6 pt-4 px-6 rounded-b-[2rem] z-10 relative">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Meu Perfil</h1>
          <div className="w-10 h-10"></div> {/* Spacer */}
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 rounded-full bg-emerald-100 border-4 border-white shadow-xl flex items-center justify-center mb-4 overflow-hidden relative">
            {renderAvatar()}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
          <p className="text-sm text-gray-500 font-medium">Membro Principal</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <button 
                key={idx} 
                onClick={stat.action ? stat.action : undefined}
                className={`bg-gray-50 border border-gray-100 rounded-2xl p-3 py-4 flex flex-col items-center text-center transition-all ${stat.action ? 'active:scale-95 hover:bg-gray-100 cursor-pointer' : ''}`}
            >
              <div className={`p-2 rounded-full ${stat.bg} ${stat.color} mb-2 shadow-sm`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-gray-900 leading-none mb-1">{stat.value}</span>
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">{stat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area (Settings & Configs) */}
      <div className="px-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-4">
            
            {/* Pantry Section */}
            <div ref={pantryRef} className={`bg-white rounded-[1.5rem] shadow-sm border overflow-hidden p-6 transition-colors ${pantryItems.length === 0 ? 'border-blue-200 ring-2 ring-blue-50' : 'border-gray-100'}`}>
                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-500" />
                    Despensa Permanente
                </h3>
                
                <button
                    onClick={() => setShowPantryOptions(!showPantryOptions)}
                    className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100/50 border border-blue-100 rounded-xl transition-all group mb-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-full text-blue-600 shadow-sm">
                            <Scale className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <span className="block font-bold text-gray-800 text-sm">O que sempre tem em casa</span>
                            <span className="block text-xs text-gray-500">
                                {pantryItems.length} itens selecionados
                            </span>
                        </div>
                    </div>
                    {showPantryOptions ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                {showPantryOptions && (
                    <div className="flex flex-col gap-3 animate-in slide-in-from-top-2">
                        <p className="text-xs text-gray-400 font-medium mb-1">
                            Marque os itens que você já possui. Eles serão considerados automaticamente nas receitas.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {commonPantry.map(item => {
                                const hasItem = pantryItems.includes(item);
                                return (
                                    <button
                                        key={item}
                                        onClick={() => togglePantryItem(item)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                            hasItem 
                                            ? 'bg-blue-50 border-blue-500 text-white shadow-sm' 
                                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        {item} {hasItem && <X className="w-3 h-3 inline ml-1 opacity-50 hover:opacity-100" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Dietary Section */}
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden p-6 space-y-6">
                <div>
                    <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-500" />
                            Preferências Alimentares
                    </h3>
                    
                    {/* Collapsible Button */}
                    <button
                        onClick={() => setShowDietaryOptions(!showDietaryOptions)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all group mb-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-full text-emerald-600 shadow-sm border border-gray-100 group-hover:border-emerald-200">
                                <Utensils className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                                <span className="block font-bold text-gray-800 text-sm">Editar Restrições</span>
                                <span className="block text-xs text-gray-500">
                                    {showDietaryOptions ? 'Toque para recolher' : 'Definir o que não gosta'}
                                </span>
                            </div>
                        </div>
                        {showDietaryOptions ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                    
                    {showDietaryOptions && (
                        <div className="animate-in slide-in-from-top-2 fade-in duration-300 border-l-2 border-emerald-100 pl-4 space-y-4">
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                    Não gosta de (separado por vírgula)
                                </label>
                                <textarea
                                    value={dislikes}
                                    onChange={(e) => setDislikes(e.target.value)}
                                    placeholder="Ex: cebola, coentro, pimentão, quiabo..."
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-gray-50 text-sm h-20 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                    Restrições e Dietas
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {commonRestrictions.map((res) => {
                                        const isActive = restrictions.includes(res);
                                        return (
                                        <button
                                            key={res}
                                            onClick={() => toggleRestriction(res)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                            isActive 
                                                ? 'bg-red-50 border-red-200 text-red-600 shadow-sm' 
                                                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {res} {isActive && <X className="w-3 h-3 inline ml-1" />}
                                        </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={handleSavePreferences}
                        className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Salvar Preferências
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <button className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600"><ChefHat className="w-5 h-5" /></div>
                        <span className="font-bold text-gray-800">Ajuda e Suporte</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                </button>
            </div>

            <button 
                onClick={onLogout}
                className="w-full bg-red-50 text-red-600 border border-red-100 font-bold p-5 rounded-[1.5rem] flex items-center justify-center gap-2 hover:bg-red-100 transition-colors mt-6 shadow-sm"
            >
                <LogOut className="w-5 h-5" />
                Sair do App
            </button>
            
            <p className="text-center text-[10px] text-gray-400 font-medium pt-4 pb-2">
                Versão 2.7.0 • Pensa Prato
            </p>
        </div>
      </div>
    </div>
  );
};

// Helper icon component
const ClockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
