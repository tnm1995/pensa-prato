
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  ChefHat, 
  LogOut, 
  Utensils, 
  Leaf, 
  Trophy, 
  Lock, 
  ShieldCheck, 
  TrendingUp, 
  ShoppingBasket, 
  Crown, 
  Flame, 
  Zap,
  Target,
  Award,
  CheckCircle2,
  Plus,
  X,
  Sparkles,
  Search
} from 'lucide-react';
import { FamilyMember, WasteStats } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileScreenProps {
  userProfile: FamilyMember;
  wasteStats: WasteStats;
  pantry: string[];
  onUpdatePantry: (items: string[]) => void;
  onSaveProfile: (member: FamilyMember) => void;
  onBack: () => void;
  onLogout: () => void;
  isAdmin?: boolean;
  onAdminClick?: () => void;
}

const XP_PER_LEVEL = 500;

const ALL_BADGES = [
    { id: 'aprendiz', name: 'Aprendiz', icon: ChefHat, color: 'text-blue-500', bg: 'bg-blue-100', desc: 'Primeira receita' },
    { id: 'consciente', name: 'Consciente', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-100', desc: 'Salvou alimentos' },
    { id: 'airfryer_master', name: 'Mestre AF', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-100', desc: 'Receita na AirFryer' },
    { id: 'heroi', name: 'Herói', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-100', desc: '20+ Receitas' },
];

const PANTRY_SUGGESTIONS = [
    "Arroz", "Feijão", "Sal", "Açúcar", "Óleo", "Azeite", "Café", 
    "Alho", "Cebola", "Ovos", "Manteiga", "Pimenta", "Farinha", "Leite"
];

const getLevelTitle = (level: number) => {
    if (level < 3) return "Ajudante de Cozinha";
    if (level < 7) return "Cozinheiro Amador";
    if (level < 12) return "Sous Chef";
    if (level < 20) return "Chef de Partie";
    return "Chef Executivo";
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
    userProfile, 
    wasteStats,
    pantry = [],
    onUpdatePantry,
    onBack, 
    onLogout,
    isAdmin = false,
    onAdminClick
}) => {
  const { name = 'Usuário', avatar = '' } = userProfile || {};
  const [isEditingPantry, setIsEditingPantry] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  const currentLevelXP = wasteStats.xp % XP_PER_LEVEL;
  const xpProgress = (currentLevelXP / XP_PER_LEVEL) * 100;
  const levelTitle = getLevelTitle(wasteStats.level || 1);

  const handleAddItem = (item: string) => {
      const normalized = item.trim();
      if (!normalized) return;
      if (pantry.some(p => p.toLowerCase() === normalized.toLowerCase())) {
          setNewItemName('');
          return;
      }
      onUpdatePantry([...pantry, normalized]);
      setNewItemName('');
  };

  const handleRemoveItem = (itemToRemove: string) => {
      onUpdatePantry(pantry.filter(p => p !== itemToRemove));
  };

  const pantrySuggestions = useMemo(() => {
    return PANTRY_SUGGESTIONS.filter(s => !pantry.some(p => p.toLowerCase() === s.toLowerCase()));
  }, [pantry]);

  const renderProfileAvatar = () => {
    const isImage = avatar && (avatar.startsWith('http') || avatar.startsWith('data:image'));
    if (isImage) {
      return <img src={avatar} alt={name} className="w-full h-full object-cover" />;
    }
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-600 text-white text-4xl font-black select-none">
        {avatar || name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8F9F8] pb-32 font-['Sora']"
    >
      
      {/* --- HEADER PREMIUM --- */}
      <div className="relative bg-white pt-6 px-6 pb-12 rounded-b-[4rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border-b border-stone-100 overflow-hidden">
        {/* Blur Decorativo */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-40 -left-20 w-56 h-56 bg-amber-50 rounded-full blur-3xl opacity-40"></div>

        <div className="flex items-center justify-between mb-8 relative z-10">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onBack} 
            className="p-3 bg-stone-50 hover:bg-stone-100 rounded-2xl transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </motion.button>
          
          <div className="flex gap-2">
            <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100 shadow-sm">
                <Flame className="w-4 h-4 text-orange-500 fill-current" />
                <span className="text-xs font-black text-orange-700">{wasteStats.streak || 0} Dias</span>
            </div>
            {isAdmin && (
                <button onClick={onAdminClick} className="p-3 bg-stone-900 text-emerald-400 rounded-2xl shadow-lg border border-stone-800">
                    <ShieldCheck className="w-5 h-5" />
                </button>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center relative z-10">
          <div className="relative mb-6">
              <motion.div 
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 3 }}
                className="w-32 h-32 rounded-[3.5rem] bg-white border-[6px] border-white shadow-2xl flex items-center justify-center overflow-hidden ring-4 ring-emerald-50"
              >
                {renderProfileAvatar()}
              </motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="absolute -bottom-2 -right-2 bg-amber-400 text-white p-2.5 rounded-2xl shadow-xl border-4 border-white"
              >
                  <Crown className="w-5 h-5 fill-current" />
              </motion.div>
          </div>

          <h2 className="text-2xl font-black text-stone-900 tracking-tight">{name}</h2>
          <div className="flex items-center gap-2 mt-2 px-4 py-1.5 bg-stone-100 rounded-full">
              <Award className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest">{levelTitle}</span>
          </div>
          
          {/* XP Progress Section */}
          <div className="w-full max-w-[280px] mt-8 bg-stone-50 p-5 rounded-[2.5rem] border border-stone-100">
              <div className="flex justify-between items-end mb-2.5 px-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Nível {wasteStats.level}</span>
                  </div>
                  <span className="text-[10px] font-bold text-stone-400">{currentLevelXP} / {XP_PER_LEVEL} XP</span>
              </div>
              <div className="h-4 w-full bg-stone-200 rounded-full overflow-hidden p-1 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 rounded-full relative"
                  >
                      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/30 to-transparent"></div>
                  </motion.div>
              </div>
              <p className="text-center text-[9px] text-stone-400 font-bold mt-3 uppercase tracking-widest">Faltam {XP_PER_LEVEL - currentLevelXP} XP para o próximo nível</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-8 relative z-20 space-y-8">
        
        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-[3rem] shadow-xl shadow-stone-200/40 border border-stone-50 flex flex-col justify-between h-40 group hover:scale-[1.02] transition-transform">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:rotate-12 transition-transform">
                    <Leaf className="w-6 h-6 fill-current" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-1">Comida Salva</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-stone-800">{wasteStats.kgSaved.toFixed(1)}</span>
                        <span className="text-xs font-bold text-stone-400">kg</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-[3rem] shadow-xl shadow-stone-200/40 border border-stone-50 flex flex-col justify-between h-40 group hover:scale-[1.02] transition-transform">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:-rotate-12 transition-transform">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-1">Economia</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xs font-bold text-stone-400">R$</span>
                        <span className="text-4xl font-black text-stone-800">{wasteStats.moneySaved.toFixed(0)}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* --- CONQUISTAS --- */}
        <div>
            <div className="flex items-center justify-between mb-5 px-2">
                <h3 className="text-sm font-black text-stone-800 uppercase tracking-widest flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-500" /> Emblemas Conquistados
                </h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
                {ALL_BADGES.map((badge) => {
                    const isUnlocked = wasteStats.badges.includes(badge.id);
                    return (
                        <div key={badge.id} className={`flex-shrink-0 w-32 p-5 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col items-center text-center ${isUnlocked ? 'bg-white border-stone-100 shadow-lg shadow-stone-200/30' : 'bg-stone-50/50 border-transparent opacity-50 grayscale'}`}>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-sm ${isUnlocked ? badge.bg + ' ' + badge.color : 'bg-stone-200 text-stone-400'}`}>
                                {isUnlocked ? <badge.icon className="w-7 h-7" /> : <Lock className="w-6 h-6" />}
                            </div>
                            <p className="text-[10px] font-black text-stone-800 leading-tight">{badge.name}</p>
                            {isUnlocked && (
                                <div className="mt-2 p-1 bg-emerald-500 text-white rounded-full">
                                    <CheckCircle2 className="w-3 h-3" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* --- MINHA DESPENSA INTELIGENTE --- */}
        <div className="bg-white p-8 rounded-[3.5rem] border border-stone-100 shadow-xl shadow-stone-200/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50/40 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-base font-black text-stone-800 uppercase tracking-widest flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-xl">
                        <ShoppingBasket className="w-5 h-5 text-emerald-600" />
                    </div>
                    Minha Despensa
                </h3>
                <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditingPantry(!isEditingPantry)} 
                    className={`text-[10px] font-black uppercase px-5 py-2.5 rounded-2xl transition-all ${isEditingPantry ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-emerald-600 bg-emerald-50 border border-emerald-100'}`}
                >
                    {isEditingPantry ? 'Salvar' : 'Gerenciar'}
                </motion.button>
            </div>

            <AnimatePresence mode="wait">
                {isEditingPantry ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        key="edit-pantry"
                        className="space-y-6"
                    >
                        {/* Input Direto */}
                        <div className="flex gap-2 p-1 bg-stone-50 rounded-3xl border border-stone-100 focus-within:border-emerald-200 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                            <input 
                                type="text" 
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddItem(newItemName)}
                                placeholder="Adicionar ingrediente..."
                                className="flex-1 bg-transparent px-5 py-3.5 text-sm font-bold text-stone-800 outline-none placeholder:text-stone-300"
                            />
                            <button 
                                onClick={() => handleAddItem(newItemName)}
                                className="p-3.5 bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-100 active:scale-90 transition-transform"
                            >
                                <Plus className="w-6 h-6 stroke-[3px]" />
                            </button>
                        </div>

                        {/* Chips de Itens Atuais */}
                        <div className="flex flex-wrap gap-2.5">
                            {pantry.map((item, idx) => (
                                <motion.span 
                                    layout
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    key={idx} 
                                    className="bg-emerald-50 text-emerald-700 text-[11px] font-black px-4 py-2.5 rounded-2xl border border-emerald-100 flex items-center gap-2 group hover:bg-emerald-100 transition-colors"
                                >
                                    {item}
                                    <button onClick={() => handleRemoveItem(item)} className="text-emerald-300 hover:text-red-500 transition-colors">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </motion.span>
                            ))}
                        </div>

                        {/* Sugestões Inteligentes */}
                        {pantrySuggestions.length > 0 && (
                            <div className="pt-4 border-t border-stone-100">
                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Sparkles className="w-3 h-3 text-amber-500" /> Sugestões para adicionar
                                </p>
                                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                    {pantrySuggestions.map((suggestion, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => handleAddItem(suggestion)}
                                            className="bg-stone-50 hover:bg-emerald-50 hover:border-emerald-200 text-stone-500 hover:text-emerald-700 text-[10px] font-bold px-4 py-2 rounded-xl border border-stone-200 transition-all flex items-center gap-2 whitespace-nowrap"
                                        >
                                            <Plus className="w-3 h-3" />
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key="view-pantry"
                        className="relative z-10"
                    >
                        {pantry.length > 0 ? (
                            <div className="flex flex-wrap gap-2.5">
                                {pantry.map((item, idx) => (
                                    <span key={idx} className="bg-stone-50 text-stone-700 text-[11px] font-black px-4 py-2.5 rounded-2xl border border-stone-100 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>
                                        {item}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full py-8 text-center bg-stone-50/50 rounded-[2rem] border border-dashed border-stone-200">
                                <p className="text-sm text-stone-400 font-bold italic mb-4">Sua despensa está vazia.</p>
                                <button 
                                    onClick={() => setIsEditingPantry(true)} 
                                    className="bg-white px-6 py-3 rounded-2xl text-emerald-600 font-black text-xs uppercase tracking-widest border border-emerald-100 shadow-sm hover:shadow-md transition-all"
                                >
                                    Adicionar Básicos
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* --- MISSÃO DIÁRIA --- */}
        <div className="bg-stone-900 p-8 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <Target className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-base font-black tracking-tight">Cozinheiro do Dia</p>
                        <p className="text-[11px] text-stone-400 font-bold uppercase tracking-[0.1em] mt-0.5">Finalize 1 receita hoje</p>
                    </div>
                </div>
                <div className="bg-emerald-500 text-white text-[11px] font-black px-4 py-2 rounded-2xl shadow-lg shadow-emerald-500/20">
                    +150 XP
                </div>
            </div>
        </div>

        {/* --- BOTÃO LOGOUT --- */}
        <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout} 
            className="w-full py-6 bg-white border border-stone-200 text-stone-400 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
        >
            <LogOut className="w-5 h-5" /> Sair da Conta
        </motion.button>
        
        <div className="text-center pt-4">
            <p className="text-[10px] text-stone-300 font-black uppercase tracking-[0.3em]">Pensa Prato 2.1v • Crafted for Foodies</p>
        </div>
      </div>
    </motion.div>
  );
};
