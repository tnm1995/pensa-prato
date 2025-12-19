import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon, ScanLine, Wind, Flame, ChefHat, UtensilsCrossed, ChevronDown, AlertCircle, ArrowLeft, Compass, Zap, Lock, MoreHorizontal, Star } from 'lucide-react';
import { FamilyMember, CookingMethod } from '../types';

interface UploadScreenProps {
  onFileSelected: (file: File) => void;
  onProfileClick: () => void;
  activeProfiles: FamilyMember[];
  cookingMethod: CookingMethod;
  onChangeContext: () => void;
  error?: string | null;
  onBack: () => void;
  onExploreClick: () => void;
  freeUsageCount: number;
  maxFreeUses: number;
  isPro: boolean;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({ 
    onFileSelected, 
    onProfileClick, 
    activeProfiles, 
    cookingMethod, 
    onChangeContext,
    error,
    onBack,
    onExploreClick,
    freeUsageCount,
    maxFreeUses,
    isPro
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Combine restrictions for display
  const allRestrictions = [...new Set(activeProfiles.flatMap(p => p.restrictions || []))];

  const inspirations = [
    {
        img: "https://images.unsplash.com/photo-1626202167732-2d1ec7ab7445?q=80&w=800&auto=format&fit=crop",
        title: "Escondidinho",
        user: "Fernanda L."
    },
    {
        img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop",
        title: "Moqueca",
        user: "Thiago S."
    },
    {
        img: "https://images.unsplash.com/photo-1626804475315-9988a034222c?q=80&w=800&auto=format&fit=crop",
        title: "Arroz Cremoso",
        user: "Carla D."
    },
    {
        img: "https://images.unsplash.com/photo-1604432299882-990a42428c03?q=80&w=800&auto=format&fit=crop",
        title: "Picadinho",
        user: "Rodrigo M."
    },
    {
        img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
        title: "Salada Colorida",
        user: "Ana J."
    }
  ];

  const getMethodIcon = () => {
    switch(cookingMethod) {
        case CookingMethod.AIRFRYER: return <Wind className="w-3 h-3 text-emerald-600" />;
        case CookingMethod.STOVE: return <Flame className="w-3 h-3 text-orange-500" />;
        case CookingMethod.OVEN: return <ChefHat className="w-3 h-3 text-amber-600" />;
        default: return <UtensilsCrossed className="w-3 h-3 text-stone-400" />;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const renderAvatar = (profile: FamilyMember) => {
    const isImage = profile.avatar && (profile.avatar.startsWith('http') || profile.avatar.startsWith('data:'));
    if (isImage && profile.avatar) {
        return <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />;
    }
    if (profile.avatar) {
        return <div className="w-full h-full flex items-center justify-center bg-white text-xs select-none">{profile.avatar}</div>;
    }
    return <img src={`https://ui-avatars.com/api/?name=${profile.name}&background=random&color=fff`} alt={profile.name} className="w-full h-full object-cover" />;
  };

  const remaining = Math.max(0, maxFreeUses - freeUsageCount);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCF8] relative overflow-x-hidden font-['Sora'] pb-20">
      
      {/* --- HEADER --- */}
      <div className="px-6 pt-6 pb-2 flex items-center justify-between z-20">
        <button 
            onClick={onBack} 
            className="p-3 bg-white border border-stone-100 shadow-sm rounded-full text-stone-600 hover:text-emerald-700 hover:border-emerald-200 transition-all active:scale-95"
        >
            <ArrowLeft className="w-5 h-5" />
        </button>
        
        {isPro ? (
            <div className="flex items-center gap-2 bg-stone-900 text-white pl-3 pr-4 py-2 rounded-full text-xs font-bold shadow-sm">
                <Zap className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> 
                <span>PRO ATIVO</span>
            </div>
        ) : (
            <div className="flex items-center gap-2 bg-white border border-stone-200 text-stone-600 pl-3 pr-4 py-2 rounded-full text-xs font-medium shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-50 animate-pulse"></span>
                <span>{remaining} restantes</span>
            </div>
        )}
      </div>

      <div className="flex-1 flex flex-col px-6 relative z-10 max-w-lg mx-auto w-full pt-4">
        
        {/* --- CONTEXT CARD --- */}
        <button 
            onClick={onChangeContext}
            className="w-full bg-white p-4 rounded-3xl shadow-sm border border-stone-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300 flex items-center justify-between group mb-8"
        >
            <div className="flex items-center gap-4 overflow-hidden">
                {/* Avatar Stack */}
                <div className="flex -space-x-3 pl-1 shrink-0">
                    {activeProfiles.length > 0 ? (
                        activeProfiles.slice(0, 3).map((profile, i) => (
                             <div key={i} className="w-11 h-11 rounded-full bg-stone-100 border-2 border-white ring-1 ring-stone-50 overflow-hidden relative z-10 flex items-center justify-center shadow-sm">
                                {renderAvatar(profile)}
                            </div>
                        ))
                    ) : (
                        <div className="w-11 h-11 rounded-full bg-stone-50 border-2 border-white flex items-center justify-center text-stone-300 ring-1 ring-stone-100">
                            <UtensilsCrossed className="w-5 h-5" />
                        </div>
                    )}
                    {activeProfiles.length > 3 && (
                        <div className="w-11 h-11 rounded-full bg-stone-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-stone-500 relative z-20 ring-1 ring-stone-50">
                            +{activeProfiles.length - 3}
                        </div>
                    )}
                </div>
                
                <div className="text-left flex-1 min-w-0">
                    <p className="text-sm font-bold text-stone-800 truncate">
                        {activeProfiles.length === 0 ? "Para quem?" : 
                         activeProfiles.length === 1 ? activeProfiles[0].name : 
                         "Família & Amigos"
                        }
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                         <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-500 bg-stone-50 px-2 py-1 rounded-md border border-stone-100">
                            {getMethodIcon()}
                            <span>{cookingMethod === CookingMethod.ANY ? 'Livre' : cookingMethod}</span>
                         </div>
                         {allRestrictions.length > 0 && (
                            <span className="text-[10px] text-red-600 bg-red-50 px-2 py-1 rounded-md font-bold border border-red-100 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {allRestrictions.length}
                            </span>
                         )}
                    </div>
                </div>
            </div>
            
            <div className="p-2 bg-stone-50 rounded-full text-stone-300 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                <ChevronDown className="w-5 h-5" />
            </div>
        </button>

        {/* --- MAIN ACTION AREA --- */}
        <div className="flex-1 flex flex-col justify-start pb-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-stone-900 mb-2 tracking-tight">O que tem pra hoje?</h1>
                <p className="text-stone-500 font-medium">Tire uma foto dos ingredientes e deixe a mágica acontecer.</p>
            </div>

            <div
                className={`relative group cursor-pointer bg-white rounded-[2.5rem] shadow-xl transition-all duration-500 aspect-[4/5] max-h-[360px] flex flex-col items-center justify-center overflow-hidden border-[3px] border-dashed ${
                    dragActive 
                    ? "border-emerald-500 bg-emerald-50 scale-[1.02]" 
                    : "border-stone-100 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-100"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="w-64 h-64 bg-emerald-50 rounded-full blur-3xl animate-pulse"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-stone-50 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:bg-emerald-100 shadow-sm group-hover:shadow-lg ring-4 ring-white">
                        <Camera className="w-10 h-10 text-stone-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    
                    <button className="bg-stone-900 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-lg hover:bg-black transition-all active:scale-95 flex items-center gap-2 group-hover:translate-y-[-2px]">
                        <ScanLine className="w-4 h-4" />
                        Abrir Câmera
                    </button>
                    
                    <div className="mt-6 flex items-center gap-6 text-stone-400">
                        <div className="flex flex-col items-center gap-1 hover:text-emerald-600 transition-colors" onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}>
                            <div className="p-2 bg-stone-50 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all"><ImageIcon className="w-5 h-5" /></div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Galeria</span>
                        </div>
                        <div className="w-px h-8 bg-stone-100"></div>
                        <div className="flex flex-col items-center gap-1 hover:text-emerald-600 transition-colors">
                            <div className="p-2 bg-stone-50 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all"><Upload className="w-5 h-5" /></div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Arquivo</span>
                        </div>
                    </div>
                </div>
            </div>

            <button 
                onClick={onExploreClick}
                className="mt-6 w-full bg-white hover:bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center justify-between group transition-all shadow-sm hover:shadow-md"
            >
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-yellow-50 text-yellow-600 rounded-xl border border-yellow-100">
                        <Compass className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-sm font-bold text-stone-800">Sem ingredientes?</h3>
                        <p className="text-[11px] text-stone-500">Explore receitas por categoria</p>
                    </div>
                </div>
                <div className="bg-stone-100 p-2 rounded-full text-stone-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                </div>
            </button>

            {error && (
                <div className="mt-4 w-full p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium flex items-center gap-3 animate-in slide-in-from-bottom-2 shadow-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* --- INSPIRATION CAROUSEL --- */}
            <div className="mt-8 mb-4">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest text-center mb-4 flex items-center justify-center gap-2 opacity-80">
                    <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                    Feito pela comunidade hoje
                    <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                </p>
                
                <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-8">
                    {[0, 1].map((arr) => (
                        <ul key={arr} className="flex items-center justify-center md:justify-start [&_li]:mx-3 animate-infinite-scroll-slow">
                            {inspirations.map((item, idx) => (
                                <li key={`${arr}-${idx}`} className="flex-shrink-0">
                                    <div className="w-32 bg-white rounded-2xl p-2 shadow-sm border border-stone-100 flex flex-col hover:scale-110 transition-transform duration-300">
                                        <div className="h-24 rounded-xl overflow-hidden mb-2 relative bg-stone-100">
                                            <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="px-1 text-center pb-1">
                                            <p className="font-bold text-[10px] text-stone-800 leading-tight truncate">{item.title}</p>
                                            <div className="flex items-center justify-center gap-1 mt-1">
                                                <div className="w-3 h-3 rounded-full bg-emerald-100 flex items-center justify-center text-[6px] font-bold text-emerald-700">
                                                    {item.user.charAt(0)}
                                                </div>
                                                <p className="text-[9px] text-stone-400 truncate max-w-[60px]">{item.user}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ))}
                </div>
            </div>

        </div>
      </div>

      <style>{`
        @keyframes infinite-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-100%); }
        }
        .animate-infinite-scroll-slow {
            animation: infinite-scroll 25s linear infinite;
        }
      `}</style>
    </div>
  );
};