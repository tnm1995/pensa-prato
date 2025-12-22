
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  ScanLine, 
  Wind, 
  Flame, 
  ChefHat, 
  UtensilsCrossed, 
  ChevronDown, 
  AlertCircle, 
  ArrowLeft, 
  Compass, 
  Zap, 
  Star,
  FileText
} from 'lucide-react';
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

  const allRestrictions = [...new Set(activeProfiles.flatMap(p => p.restrictions || []))];

  const getMethodIcon = () => {
    switch(cookingMethod) {
        case CookingMethod.AIRFRYER: return <Wind className="w-3.5 h-3.5" />;
        case CookingMethod.STOVE: return <Flame className="w-3.5 h-3.5" />;
        case CookingMethod.OVEN: return <ChefHat className="w-3.5 h-3.5" />;
        default: return <UtensilsCrossed className="w-3.5 h-3.5" />;
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
    return <div className="w-full h-full flex items-center justify-center bg-white text-xs select-none">{profile.avatar || '👤'}</div>;
  };

  const remaining = Math.max(0, maxFreeUses - freeUsageCount);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col min-h-screen bg-[#F8FAF9] font-['Sora'] pb-32"
    >
      
      {/* --- HEADER --- */}
      <div className="px-6 pt-8 pb-4 flex items-center justify-between z-20">
        <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack} 
            className="p-3 bg-white border border-stone-100 shadow-sm rounded-2xl text-stone-600 hover:text-emerald-700 transition-all"
        >
            <ArrowLeft className="w-5 h-5" />
        </motion.button>
        
        {isPro ? (
            <div className="flex items-center gap-2 bg-stone-900 text-white pl-3 pr-4 py-2 rounded-2xl text-xs font-bold shadow-md">
                <Zap className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> 
                <span>CHEF PRO</span>
            </div>
        ) : (
            <div className="flex items-center gap-2 bg-white border border-emerald-100 text-emerald-700 pl-3 pr-4 py-2 rounded-2xl text-xs font-bold shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span>{remaining} Scans Grátis</span>
            </div>
        )}
      </div>

      <div className="flex-1 flex flex-col px-6 relative z-10 max-w-lg mx-auto w-full h-full">
        
        {/* --- CONTEXT CARD (MUI Style Paper) --- */}
        <motion.button 
            variants={itemVariants}
            onClick={onChangeContext}
            whileHover={{ y: -2 }}
            className="w-full bg-white p-5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 hover:border-emerald-200 transition-all flex items-center justify-between group mb-8"
        >
            <div className="flex items-center gap-4 overflow-hidden">
                <div className="flex -space-x-3 shrink-0">
                    {activeProfiles.length > 0 ? (
                        activeProfiles.slice(0, 3).map((profile, i) => (
                             <div key={i} className="w-12 h-12 rounded-full bg-stone-100 border-2 border-white overflow-hidden flex items-center justify-center shadow-sm">
                                {renderAvatar(profile)}
                            </div>
                        ))
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-white flex items-center justify-center text-emerald-600">
                            <UtensilsCrossed className="w-6 h-6" />
                        </div>
                    )}
                </div>
                
                <div className="text-left">
                    <p className="text-sm font-extrabold text-stone-800">
                        {activeProfiles.length === 0 ? "Qualquer pessoa" : 
                         activeProfiles.length === 1 ? activeProfiles[0].name : 
                         `${activeProfiles.length} Pessoas`
                        }
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                         <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            {getMethodIcon()}
                            <span>{cookingMethod === CookingMethod.ANY ? 'Livre' : cookingMethod}</span>
                         </div>
                    </div>
                </div>
            </div>
            
            <div className="p-2 bg-stone-50 rounded-xl text-stone-400 group-hover:text-emerald-600 transition-colors">
                <ChevronDown className="w-5 h-5" />
            </div>
        </motion.button>

        {/* --- MAIN TITLE --- */}
        <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-stone-900 mb-2 tracking-tight">O que temos hoje?</h1>
            <p className="text-stone-500 font-medium text-sm">Mostre os ingredientes e receba receitas da IA.</p>
        </motion.div>

        {/* --- UPLOAD AREA (Interactive Card) --- */}
        <motion.div
            variants={itemVariants}
            className={`relative cursor-pointer bg-white rounded-[3rem] shadow-xl transition-all duration-500 aspect-[4/5] flex flex-col items-center justify-center overflow-hidden border-2 ${
                dragActive 
                ? "border-emerald-500 bg-emerald-50 scale-[1.02] shadow-emerald-100" 
                : "border-stone-100 border-dashed hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-100/50"
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
            
            {/* Animated Glow Backdrop */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="w-64 h-64 bg-emerald-100/50 rounded-full blur-[100px] animate-pulse"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center p-8 text-center">
                <motion.div 
                  animate={dragActive ? { y: -10 } : { y: 0 }}
                  className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center mb-8 shadow-lg shadow-emerald-200"
                >
                    <Camera className="w-10 h-10 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-extrabold text-stone-800 mb-3">Tirar Foto</h3>
                <p className="text-stone-400 text-xs font-medium max-w-[200px] leading-relaxed mb-8">
                    Aponte para sua geladeira aberta ou para os ingredientes na bancada.
                </p>

                <div className="flex items-center gap-4 w-full">
                  <button className="flex-1 bg-stone-900 text-white h-14 rounded-2xl font-bold text-sm shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2">
                      <ScanLine className="w-4 h-4" />
                      Câmera
                  </button>
                  <div 
                    onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}
                    className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center hover:bg-emerald-100 transition-colors shadow-sm"
                  >
                      <ImageIcon className="w-6 h-6" />
                  </div>
                </div>
            </div>

            {dragActive && (
              <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="bg-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
                      <Upload className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold text-emerald-700">Solte para Enviar</span>
                  </div>
              </div>
            )}
        </motion.div>

        {/* --- EXPLORE SECTION --- */}
        <motion.button 
            variants={itemVariants}
            onClick={onExploreClick}
            className="mt-8 w-full bg-white border border-stone-100 rounded-3xl p-5 flex items-center justify-between group transition-all hover:shadow-md hover:border-amber-200"
        >
            <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
                    <Compass className="w-6 h-6" />
                </div>
                <div className="text-left">
                    <h3 className="text-sm font-extrabold text-stone-800">Sem ingredientes agora?</h3>
                    <p className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">Explorar categorias</p>
                </div>
            </div>
            <div className="p-2 rounded-full text-stone-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all">
                <ArrowLeft className="w-5 h-5 rotate-180" />
            </div>
        </motion.button>

        {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 w-full p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3 shadow-sm"
            >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
            </motion.div>
        )}

      </div>
    </motion.div>
  );
};
