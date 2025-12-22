
import React, { useState } from 'react';
import { ArrowLeft, Scale, Heart, ChevronRight, AlertCircle, ChefHat, LogOut, Star, Save, X, Utensils, Coins, Leaf, Trophy, Lock, ShieldCheck, TrendingUp, ShoppingBasket, Settings, Info, LayoutDashboard } from 'lucide-react';
import { Recipe, FamilyMember, WasteStats } from '../types';

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

const ALL_BADGES = [
    { id: 'aprendiz', name: 'Aprendiz de Chef', icon: ChefHat, color: 'text-blue-500', bg: 'bg-blue-50', desc: 'Sua primeira receita com a IA' },
    { id: 'consciente', name: 'Chef Consciente', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-50', desc: '5 receitas salvando ingredientes' },
    { id: 'airfryer_master', name: 'Mestre da AirFryer', icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-50', desc: 'Receita perfeita na AirFryer' },
    { id: 'heroi', name: 'Herói da Cozinha', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50', desc: '20 receitas concluídas' },
];

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
  const { name = 'Usuário', avatar = '', restrictions = [], dislikes = '' } = userProfile || {};
  const [isEditingPantry, setIsEditingPantry] = useState(false);
  const [tempPantry, setTempPantry] = useState(pantry.join(', '));

  const handleSavePantry = () => {
      const items = tempPantry.split(',').map(i => i.trim()).filter(i => i.length > 0);
      onUpdatePantry(items);
      setIsEditingPantry(false);
  };

  const renderProfileAvatar = () => {
    const isImage = avatar && (avatar.startsWith('http') || avatar.startsWith('data:image'));
    
    if (isImage) {
      return (
        <img 
          src={avatar} 
          alt={name} 
          className="w-full h-full object-cover" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${name}&background=10b981&color=fff`;
          }}
        />
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center bg-white text-5xl select-none">
        {avatar || name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] pb-32 font-['Sora']">
      
      {/* --- HEADER --- */}
      <div className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] pb-8 pt-6 px-6 rounded-b-[3rem] z-10 relative border-b border-stone-100">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 -ml-2 bg-stone-50 hover:bg-stone-100 rounded-2xl transition-all">
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </button>
          <h1 className="text-lg font-bold text-stone-800">Minha Cozinha</h1>
          <div className="p-3 bg-stone-50 rounded-2xl">
             <ShieldCheck className="w-5 h-5 text-stone-400" />
          </div>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative">
              <div className="w-28 h-28 rounded-[2.5rem] bg-emerald-50 border-4 border-white shadow-2xl flex items-center justify-center mb-4 overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500">
                {renderProfileAvatar()}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-white p-2 rounded-xl shadow-lg border-2 border-white">
                  <Star className="w-4 h-4 fill-current" />
              </div>
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900">{name}</h2>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest">Premium Ativo</span>
            </div>
            {isAdmin && (
                <div className="bg-stone-900 px-3 py-1 rounded-full border border-stone-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] text-white font-black uppercase tracking-widest">Admin</span>
                </div>
            )}
          </div>
        </div>

        {/* --- IMPACT DASHBOARD --- */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 rounded-[2rem] shadow-xl shadow-emerald-100 relative overflow-hidden group">
                <Leaf className="absolute -right-4 -bottom-4 w-20 h-20 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                <div className="relative z-10">
                    <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mb-1">Comida Salva</p>
                    <div className="flex items-baseline gap-1 text-white">
                        <span className="text-3xl font-black">{wasteStats.kgSaved.toFixed(1)}</span>
                        <span className="text-xs font-bold opacity-80">kg</span>
                    </div>
                </div>
            </div>
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-5 rounded-[2rem] shadow-xl shadow-orange-100 relative overflow-hidden group">
                <TrendingUp className="absolute -right-4 -bottom-4 w-20 h-20 text-white/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                <div className="relative z-10">
                    <p className="text-[10px] font-bold text-amber-100 uppercase tracking-widest mb-1">Economia Total</p>
                    <div className="flex items-baseline gap-1 text-white">
                        <span className="text-xs font-bold opacity-80">R$</span>
                        <span className="text-3xl font-black">{wasteStats.moneySaved.toFixed(0)}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="px-6 mt-10 space-y-10">
        
        {/* --- ADMIN QUICK ACCESS --- */}
        {isAdmin && (
            <button 
                onClick={onAdminClick}
                className="w-full p-6 bg-stone-900 text-white rounded-[2.5rem] flex items-center justify-between group hover:bg-black transition-all shadow-2xl shadow-stone-200 animate-in slide-in-from-top-4"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform">
                        <LayoutDashboard className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold">Painel de Controle</p>
                        <p className="text-[10px] text-stone-400 font-bold uppercase">Gerenciar Usuários & Vendas</p>
                    </div>
                </div>
                <div className="p-2 bg-white/5 rounded-full">
                    <ChevronRight className="w-5 h-5 text-stone-500" />
                </div>
            </button>
        )}

        {/* --- CONQUISTAS (BADGES) --- */}
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-stone-800 uppercase tracking-widest flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" /> Minhas Conquistas
                </h3>
                <span className="text-[10px] font-black text-emerald-600 bg-white border border-stone-100 px-3 py-1 rounded-xl shadow-sm">
                    {wasteStats.badges.length} / {ALL_BADGES.length}
                </span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
                {ALL_BADGES.map((badge) => {
                    const isUnlocked = wasteStats.badges.includes(badge.id);
                    return (
                        <div key={badge.id} className={`flex-shrink-0 w-36 p-5 rounded-[2.5rem] border transition-all duration-500 flex flex-col items-center text-center ${isUnlocked ? 'bg-white border-stone-100 shadow-xl shadow-stone-200/40 scale-100' : 'bg-stone-50 border-transparent opacity-40 grayscale scale-95'}`}>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${isUnlocked ? badge.bg + ' ' + badge.color : 'bg-stone-200 text-stone-400'}`}>
                                {isUnlocked ? <badge.icon className="w-7 h-7" /> : <Lock className="w-6 h-6" />}
                            </div>
                            <p className="text-[11px] font-black text-stone-800 leading-tight mb-2">{badge.name}</p>
                            {isUnlocked ? (
                                <p className="text-[9px] text-stone-400 font-bold leading-relaxed">{badge.desc}</p>
                            ) : (
                                <div className="h-4 w-8 bg-stone-200 rounded-full animate-pulse"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* --- MINHA DESPENSA --- */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-stone-800 uppercase tracking-widest flex items-center gap-2">
                    <ShoppingBasket className="w-5 h-5 text-emerald-600" /> Minha Despensa
                </h3>
                <button 
                    onClick={() => {
                        if (isEditingPantry) handleSavePantry();
                        else setIsEditingPantry(true);
                    }}
                    className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl transition-all active:scale-95"
                >
                    {isEditingPantry ? 'Salvar' : 'Editar'}
                </button>
            </div>

            {isEditingPantry ? (
                <div className="space-y-3">
                    <textarea 
                        className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl text-xs font-medium text-stone-600 focus:ring-2 focus:ring-emerald-100 outline-none h-24"
                        value={tempPantry}
                        onChange={(e) => setTempPantry(e.target.value)}
                        placeholder="Ex: Sal, Açúcar, Óleo, Arroz..."
                    />
                    <p className="text-[9px] text-stone-400 font-bold italic">* Separe os itens por vírgula</p>
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {pantry.length > 0 ? (
                        pantry.map((item, idx) => (
                            <span key={idx} className="bg-stone-50 text-stone-600 text-[10px] font-bold px-3 py-1.5 rounded-xl border border-stone-100">
                                {item}
                            </span>
                        ))
                    ) : (
                        <p className="text-[10px] text-stone-400 font-bold italic py-2">Sua despensa básica está vazia.</p>
                    )}
                </div>
            )}
        </div>

        {/* --- RESTRIÇÕES & GOSTOS --- */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm">
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-widest flex items-center gap-2 mb-6">
                <AlertCircle className="w-5 h-5 text-red-500" /> Perfil Alimentar
            </h3>
            
            <div className="space-y-6">
                <div>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Restrições Críticas</p>
                    <div className="flex flex-wrap gap-2">
                        {restrictions.length > 0 ? (
                            restrictions.map((res, idx) => (
                                <span key={idx} className="bg-red-50 text-red-600 text-[10px] font-black px-3 py-1.5 rounded-xl border border-red-100 flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                    {res}
                                </span>
                            ))
                        ) : (
                            <span className="text-[10px] text-emerald-600 font-bold italic">Nenhuma restrição de saúde</span>
                        )}
                    </div>
                </div>

                <div>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Evitar Ingredientes</p>
                    <div className="flex flex-wrap gap-2">
                        {dislikes ? (
                            dislikes.split(',').map((item, idx) => (
                                <span key={idx} className="bg-stone-100 text-stone-500 text-[10px] font-bold px-3 py-1.5 rounded-xl border border-stone-200">
                                    {item.trim()}
                                </span>
                            ))
                        ) : (
                            <span className="text-[10px] text-stone-400 font-bold italic">Sem desgostos cadastrados</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-stone-50 flex items-center gap-3 text-stone-400">
                <Info className="w-4 h-4 flex-shrink-0" />
                <p className="text-[9px] font-bold leading-relaxed">A IA filtrará automaticamente todas as receitas baseada nessas preferências para sua segurança.</p>
            </div>
        </div>

        {/* --- AÇÕES --- */}
        <div className="pt-4 space-y-4">
            <button onClick={onLogout} className="w-full py-5 bg-white border border-stone-200 text-stone-500 rounded-[2rem] font-bold text-sm flex items-center justify-center gap-3 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all active:scale-95">
                <LogOut className="w-5 h-5" /> Sair da Conta
            </button>

            <div className="text-center space-y-2 pb-10">
                <p className="text-[10px] text-stone-300 font-black uppercase tracking-[0.2em]">Versão 2.6.0 • Pensa Prato</p>
                <div className="flex justify-center gap-4 text-[9px] font-bold text-stone-400">
                    <button className="hover:text-emerald-500">Termos</button>
                    <button className="hover:text-emerald-500">Privacidade</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
