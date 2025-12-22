
import React, { useState } from 'react';
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
  // Fix: Added missing icon import
  CheckCircle2
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
  const [tempPantry, setTempPantry] = useState(pantry.join(', '));

  const currentLevelXP = wasteStats.xp % XP_PER_LEVEL;
  const xpProgress = (currentLevelXP / XP_PER_LEVEL) * 100;
  const levelTitle = getLevelTitle(wasteStats.level || 1);

  const handleSavePantry = () => {
      const items = tempPantry.split(',').map(i => i.trim()).filter(i => i.length > 0);
      onUpdatePantry(items);
      setIsEditingPantry(false);
  };

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#F8F9F8] pb-32 font-['Sora']"
    >
      
      {/* --- PREMIUM HEADER --- */}
      <div className="relative bg-white pt-6 px-6 pb-12 rounded-b-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border-b border-stone-100 overflow-hidden">
        {/* Background Decor */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-40 -left-20 w-48 h-48 bg-amber-50 rounded-full blur-3xl opacity-40"></div>

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
                <button onClick={onAdminClick} className="p-2 bg-stone-900 text-emerald-400 rounded-2xl shadow-lg border border-stone-800">
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
                className="w-32 h-32 rounded-[3rem] bg-white border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden ring-4 ring-emerald-50"
              >
                {renderProfileAvatar()}
              </motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-2 -right-2 bg-amber-400 text-white p-2.5 rounded-2xl shadow-xl border-4 border-white"
              >
                  <Crown className="w-5 h-5 fill-current" />
              </motion.div>
          </div>

          <h2 className="text-2xl font-black text-stone-900 tracking-tight">{name}</h2>
          <div className="flex items-center gap-2 mt-1.5 px-4 py-1 bg-stone-100 rounded-full">
              <Award className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{levelTitle}</span>
          </div>
          
          {/* Enhanced XP Section */}
          <div className="w-full max-w-[280px] mt-8 bg-stone-50 p-4 rounded-3xl border border-stone-100">
              <div className="flex justify-between items-end mb-2 px-1">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-emerald-500 fill-current" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase">Nível {wasteStats.level}</span>
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
                      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent"></div>
                  </motion.div>
              </div>
              <p className="text-center text-[9px] text-stone-400 font-bold mt-2 uppercase tracking-tight">Faltam {XP_PER_LEVEL - currentLevelXP} XP para o próximo nível</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-6 relative z-20 space-y-8">
        
        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-2 gap-4">
            <motion.div variants={itemVariants} className="bg-white p-5 rounded-[2.5rem] shadow-xl shadow-stone-200/40 border border-stone-50 flex flex-col justify-between h-36">
                <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Leaf className="w-5 h-5 fill-current" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-1">Comida Salva</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-stone-800">{wasteStats.kgSaved.toFixed(1)}</span>
                        <span className="text-xs font-bold text-stone-400">kg</span>
                    </div>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white p-5 rounded-[2.5rem] shadow-xl shadow-stone-200/40 border border-stone-50 flex flex-col justify-between h-36">
                <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                    <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-1">Economia</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xs font-bold text-stone-400">R$</span>
                        <span className="text-3xl font-black text-stone-800">{wasteStats.moneySaved.toFixed(0)}</span>
                    </div>
                </div>
            </motion.div>
        </div>

        {/* --- CONQUISTAS --- */}
        <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-5 px-1">
                <h3 className="text-sm font-black text-stone-800 uppercase tracking-widest flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-500" /> Coleção de Emblemas
                </h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
                {ALL_BADGES.map((badge) => {
                    const isUnlocked = wasteStats.badges.includes(badge.id);
                    return (
                        <div key={badge.id} className={`flex-shrink-0 w-32 p-4 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col items-center text-center ${isUnlocked ? 'bg-white border-stone-100 shadow-lg shadow-stone-200/30' : 'bg-stone-50/50 border-transparent opacity-50 grayscale'}`}>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-sm ${isUnlocked ? badge.bg + ' ' + badge.color : 'bg-stone-200 text-stone-400'}`}>
                                {isUnlocked ? <badge.icon className="w-7 h-7" /> : <Lock className="w-6 h-6" />}
                            </div>
                            <p className="text-[10px] font-black text-stone-800 leading-tight">{badge.name}</p>
                            {isUnlocked && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-1.5 p-1 bg-emerald-500 text-white rounded-full">
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </div>
        </motion.div>

        {/* --- MINHA DESPENSA --- */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/30 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-sm font-black text-stone-800 uppercase tracking-widest flex items-center gap-2">
                    <ShoppingBasket className="w-5 h-5 text-emerald-600" /> Minha Despensa
                </h3>
                <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => isEditingPantry ? handleSavePantry() : setIsEditingPantry(true)} 
                    className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl transition-all ${isEditingPantry ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-emerald-600 bg-emerald-50'}`}
                >
                    {isEditingPantry ? 'Concluído' : 'Editar'}
                </motion.button>
            </div>

            <AnimatePresence mode="wait">
                {isEditingPantry ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        key="edit"
                    >
                        <textarea 
                            className="w-full p-4 bg-stone-50 border border-stone-200 rounded-[1.5rem] text-xs font-medium h-32 outline-none focus:ring-2 focus:ring-emerald-100 transition-all resize-none" 
                            value={tempPantry} 
                            onChange={(e) => setTempPantry(e.target.value)}
                            placeholder="Separe os itens por vírgula..."
                        />
                        <p className="text-[9px] text-stone-400 font-bold mt-2 px-1">Ex: Arroz, feijão, café, sal, açúcar...</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key="view"
                        className="flex flex-wrap gap-2 relative z-10"
                    >
                        {pantry.length > 0 ? pantry.map((item, idx) => (
                            <span key={idx} className="bg-stone-50 text-stone-600 text-[10px] font-black px-3 py-2 rounded-xl border border-stone-200 flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                {item}
                            </span>
                        )) : (
                            <div className="w-full py-4 text-center">
                                <p className="text-xs text-stone-400 font-medium italic">Sua despensa está vazia.</p>
                                <button onClick={() => setIsEditingPantry(true)} className="mt-3 text-emerald-600 font-black text-[10px] uppercase tracking-widest border-b border-emerald-200 pb-0.5">Começar a listar</button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>

        {/* --- RECENT ACTIVITY MOCK --- */}
        <motion.div variants={itemVariants} className="bg-stone-900 p-6 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                        <Target className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-sm font-black tracking-tight">Missão Diária</p>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Cozinhe algo novo hoje</p>
                    </div>
                </div>
                <div className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                    +150 XP
                </div>
            </div>
        </motion.div>

        <motion.button 
            variants={itemVariants}
            onClick={onLogout} 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-5 bg-white border border-stone-200 text-stone-400 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
        >
            <LogOut className="w-4 h-4" /> Sair da Conta
        </motion.button>
        
        <div className="text-center pt-4">
            <p className="text-[9px] text-stone-300 font-black uppercase tracking-[0.3em]">Pensa Prato 2.1v • Beta</p>
        </div>
      </div>
    </motion.div>
  );
};
