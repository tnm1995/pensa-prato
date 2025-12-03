
import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon, ScanLine, Wind, Flame, ChefHat, UtensilsCrossed, ChevronDown, AlertCircle, ArrowLeft, Compass, Zap } from 'lucide-react';
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

  const getMethodIcon = () => {
    switch(cookingMethod) {
        case CookingMethod.AIRFRYER: return <Wind className="w-3 h-3 text-emerald-600" />;
        case CookingMethod.STOVE: return <Flame className="w-3 h-3 text-orange-500" />;
        case CookingMethod.OVEN: return <ChefHat className="w-3 h-3 text-blue-500" />;
        default: return <UtensilsCrossed className="w-3 h-3 text-purple-500" />;
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
        return <div className="w-full h-full flex items-center justify-center bg-white text-lg">{profile.avatar}</div>;
    }

    return <img src={`https://ui-avatars.com/api/?name=${profile.name}&background=random&color=fff`} alt={profile.name} className="w-full h-full object-cover" />;
  };

  const remaining = Math.max(0, maxFreeUses - freeUsageCount);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 pb-24 relative overflow-hidden">
      
      {/* Decorative bg */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-100/50 to-transparent pointer-events-none z-0"></div>

      {/* Floating Context Header - Glassmorphism */}
      <div className="w-full px-4 pt-4 z-20 sticky top-0">
        <button 
            onClick={onChangeContext}
            className="w-full flex items-center gap-3 bg-white/80 backdrop-blur-lg p-2.5 rounded-2xl shadow-sm border border-white/50 hover:bg-white transition-all ring-1 ring-gray-100"
        >
            <div className="flex -space-x-2 overflow-hidden pl-1">
                {activeProfiles.length > 0 ? (
                    activeProfiles.slice(0, 3).map((profile, i) => (
                         <div key={i} className="w-9 h-9 rounded-full bg-gray-100 border-2 border-white overflow-hidden shadow-sm flex-shrink-0 relative z-10 flex items-center justify-center">
                            {renderAvatar(profile)}
                        </div>
                    ))
                ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden border-2 border-white flex-shrink-0">
                        <img src="https://ui-avatars.com/api/?name=Qualquer+Pessoa&background=e5e7eb&color=6b7280" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                )}
                {activeProfiles.length > 3 && (
                    <div className="w-9 h-9 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500 relative z-20">
                        +{activeProfiles.length - 3}
                    </div>
                )}
            </div>
            
            <div className="text-left flex-1 min-w-0 flex flex-col justify-center h-full">
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-gray-800 truncate">
                        {activeProfiles.length === 0 ? "Qualquer pessoa" : 
                         activeProfiles.length === 1 ? activeProfiles[0].name : 
                         `${activeProfiles.length} pessoas`
                        }
                    </span>
                </div>
                
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                     <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded-md">
                        {getMethodIcon()}
                        <span>{cookingMethod === CookingMethod.ANY ? 'Todos' : cookingMethod}</span>
                     </div>
                     {allRestrictions.length > 0 && (
                        <span className="text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md">{allRestrictions.length} restrições</span>
                     )}
                </div>
            </div>
            
            <div className="pr-2 text-gray-300">
                <ChevronDown className="w-5 h-5" />
            </div>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md px-6 z-10 mt-4">
        
        {/* Back Button Area */}
        <div className="w-full flex justify-between items-center mb-2">
            <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-full transition-all flex items-center gap-1">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-xs font-bold">Voltar</span>
            </button>
            
            {/* Status Indicator (Pro/Free) */}
            {isPro ? (
                <div className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
                    <Zap className="w-3 h-3 fill-current" /> PRO
                </div>
            ) : (
                <div className="flex items-center gap-1 bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold">
                    {remaining} / {maxFreeUses} gratuitos
                </div>
            )}
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-[2rem] mb-6 shadow-lg shadow-emerald-900/5 ring-4 ring-emerald-50 transform rotate-3">
            <ScanLine className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">O que tem na geladeira?</h1>
          <p className="text-sm text-gray-500 max-w-[260px] mx-auto leading-relaxed">
            Tire uma foto dos seus ingredientes e nós criaremos a receita perfeita.
          </p>
        </div>

        {/* Upload Area */}
        <div
          className={`w-full relative group cursor-pointer bg-white rounded-[2rem] shadow-xl shadow-emerald-900/5 transition-all duration-300 p-8 flex flex-col items-center text-center overflow-hidden ${
            dragActive ? "border-2 border-emerald-500 bg-emerald-50" : "border border-transparent hover:border-emerald-200"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          {/* Glow effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400"></div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 group-hover:bg-emerald-100">
            <Camera className="w-8 h-8 text-emerald-600" />
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-1">Tirar Foto</h3>
          <p className="text-xs text-gray-400 font-medium mb-6">ou selecione da galeria</p>

          <div className="w-full h-px bg-gray-100 mb-6"></div>

          <div className="flex gap-8 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <span className="flex flex-col items-center gap-1 group-hover:text-emerald-600 transition-colors">
                <ImageIcon className="w-4 h-4" /> Galeria
            </span>
            <span className="flex flex-col items-center gap-1 group-hover:text-emerald-600 transition-colors">
                <Upload className="w-4 h-4" /> Arquivo
            </span>
          </div>
        </div>

        {/* Explore Button (New) */}
        <button 
          onClick={onExploreClick}
          className="w-full mt-4 bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 rounded-[1.5rem] p-4 flex items-center justify-between group transition-all shadow-sm"
        >
          <div className="flex items-center gap-3">
             <div className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-100 transition-colors">
                 <Compass className="w-5 h-5" />
             </div>
             <div className="text-left">
                 <h3 className="text-sm font-bold text-gray-800">Sem foto? Explore Receitas</h3>
                 <p className="text-[10px] text-gray-500">Categorias, Festas e Ocasiões</p>
             </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-300 -rotate-90" />
        </button>

        {/* Error Message Below Upload */}
        {error && (
            <div className="mt-4 w-full p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-2 text-left shadow-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
            </div>
        )}
      </div>
    </div>
  );
};
