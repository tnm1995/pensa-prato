
import React, { useState, useEffect, useRef } from 'react';
import { FamilyMember } from '../types';
import { ArrowLeft, Save, User, X, Baby, Camera, Image as ImageIcon, Smile, ChevronDown, ChevronUp, Utensils, Loader2 } from 'lucide-react';

interface ProfileEditorScreenProps {
  onSave: (member: FamilyMember) => void;
  onCancel: () => void;
  initialMember?: FamilyMember; // Optional for editing
}

const EMOJI_OPTIONS = [
  // Kids/Babies
  "👶", "👧", "👼", "🧒", "👦", 
  // Women
  "👩", "👩‍🦰", "👩‍🦱", "👩‍🦳", "👱‍♀️", "👵", "🧕",
  // Men
  "👨", "👨‍🦰", "👨‍🦱", "👨‍🦳", "👱‍♂️", "👴", "🧔",
  // Fun/Animals
  "😺", "🐶", "🦄", "🐸", "🐼", "🦁", "🦊",
  // Others
  "😎", "🤓", "🤠", "🥳", "🤖", "👽", "👻"
];

export const ProfileEditorScreen: React.FC<ProfileEditorScreenProps> = ({ onSave, onCancel, initialMember }) => {
  const [name, setName] = useState(initialMember?.name || '');
  const [avatar, setAvatar] = useState(initialMember?.avatar || '');
  const [dislikes, setDislikes] = useState(initialMember?.dislikes || '');
  const [restrictions, setRestrictions] = useState<string[]>(initialMember?.restrictions || []);
  const [isBabyMode, setIsBabyMode] = useState(initialMember?.isChild || false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [avatarMode, setAvatarMode] = useState<'emoji' | 'upload'>('emoji');
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  
  // Logic to determine if restrictions section should be open initially
  const hasInitialRestrictions = (initialMember?.dislikes && initialMember.dislikes.length > 0) || (initialMember?.restrictions && initialMember.restrictions.length > 0);
  const [showDietaryOptions, setShowDietaryOptions] = useState(hasInitialRestrictions || false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const commonRestrictions = [
    "Vegano", "Vegetariano", "Sem Glúten", "Sem Lactose", "APLV", "Diabético", "Hipertenso"
  ];

  // Effect to handle Baby Mode defaults
  useEffect(() => {
    if (isBabyMode) {
        // Add baby safe restrictions if not present
        const babyRestrictions = ["Sem Açúcar", "Sem Mel", "Bebê (< 2 anos)"];
        const newRestrictions = [...new Set([...restrictions, ...babyRestrictions])];
        
        // Only update if changed to avoid infinite loop
        if (JSON.stringify(newRestrictions) !== JSON.stringify(restrictions)) {
             setRestrictions(newRestrictions);
        }

        // Add safety hazards to dislikes if not present
        const hazards = "mel, açúcar, sal em excesso, pipoca, amendoim inteiro";
        if (!dislikes.toLowerCase().includes("mel")) {
             setDislikes(prev => prev ? `${prev}, ${hazards}` : hazards);
        }
        
        // Suggest baby emoji if no avatar set
        if (!avatar || avatar === "im_baby") setAvatar("👶");

        // Auto-open the section so user sees the safety rules applied
        setShowDietaryOptions(true);
    }
  }, [isBabyMode]);

  const toggleRestriction = (res: string) => {
    if (restrictions.includes(res)) {
      setRestrictions(restrictions.filter(r => r !== res));
    } else {
      setRestrictions([...restrictions, res]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSaving(true);

    // Se tiver ID (edição), usa o mesmo. Se não, cria um ID temporário que o App.tsx vai substituir por um do Firestore.
    // Usamos 'temp-' prefix para facilitar a detecção de novos itens no App.tsx
    const tempId = `temp-${Date.now()}`;
    const idToUse = initialMember?.id || tempId;
    
    const newMember: FamilyMember = {
      id: idToUse,
      name,
      dislikes,
      restrictions,
      avatar: avatar || (name.length > 0 ? `https://ui-avatars.com/api/?name=${name}` : '👤'),
      isChild: isBabyMode
    };

    // Pequeno delay para feedback visual
    await new Promise(r => setTimeout(r, 300));
    
    onSave(newMember);
    setIsSaving(false);
  };

  const toggleSelector = (mode: 'emoji' | 'upload') => {
    if (avatarMode === mode && isSelectorOpen) {
      setIsSelectorOpen(false);
    } else {
      setAvatarMode(mode);
      setIsSelectorOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 pb-24">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onCancel} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{initialMember ? 'Editar Pessoa' : 'Nova Pessoa'}</h1>
          <div className="w-10"></div>
        </div>

        <div className="space-y-6">
          
          {/* Avatar Selection Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
                <div className="w-28 h-28 rounded-full border-4 border-emerald-100 overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center">
                    {avatar ? (
                        avatar.startsWith('data:') || avatar.startsWith('http') ? (
                            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-6xl">{avatar === "im_baby" ? "👶" : avatar}</span>
                        )
                    ) : (
                        <User className="w-12 h-12 text-gray-300" />
                    )}
                </div>
                <button 
                    onClick={() => {
                        setAvatarMode('upload');
                        setIsSelectorOpen(true);
                    }}
                    className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 shadow-md border-2 border-white"
                >
                    <Camera className="w-4 h-4" />
                </button>
            </div>

            {/* Avatar Type Toggle Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl mt-6 w-full max-w-xs transition-all">
                <button 
                    onClick={() => toggleSelector('emoji')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${avatarMode === 'emoji' && isSelectorOpen ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200/50'}`}
                >
                    <Smile className="w-4 h-4" /> Emojis 
                    {avatarMode === 'emoji' && isSelectorOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                <button 
                    onClick={() => toggleSelector('upload')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${avatarMode === 'upload' && isSelectorOpen ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200/50'}`}
                >
                    <ImageIcon className="w-4 h-4" /> Foto
                    {avatarMode === 'upload' && isSelectorOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
            </div>

            {/* Avatar Selection Content - Collapsible */}
            {isSelectorOpen && (
                <div className="w-full mt-4 animate-in slide-in-from-top-2 fade-in duration-300">
                    {avatarMode === 'emoji' ? (
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="grid grid-cols-6 gap-2 sm:gap-3">
                                {EMOJI_OPTIONS.map((emoji, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setAvatar(emoji)}
                                        className={`aspect-square flex items-center justify-center text-2xl hover:bg-white hover:scale-110 transition-all rounded-xl ${avatar === emoji ? 'bg-white shadow-md ring-2 ring-emerald-400' : ''}`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors text-gray-500"
                        >
                            <Camera className="w-8 h-8 mb-2 text-gray-400" />
                            <span className="text-sm font-medium">Toque para enviar foto</span>
                            <input 
                                ref={fileInputRef}
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleFileChange}
                            />
                        </div>
                    )}
                </div>
            )}
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome / Apelido</label>
            <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Filha, Marido, Bebê Theo..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-gray-50"
                />
            </div>
          </div>

          {/* Baby Mode Toggle */}
          <div 
            onClick={() => setIsBabyMode(!isBabyMode)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${isBabyMode ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-100'}`}
          >
            <div className={`p-2 rounded-full ${isBabyMode ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                 <Baby className="w-6 h-6" />
            </div>
            <div className="flex-1">
                <p className={`font-bold ${isBabyMode ? 'text-blue-800' : 'text-gray-700'}`}>Modo Bebê (0-2 anos)</p>
                <p className="text-xs text-gray-500">Preenche automaticamente restrições de segurança.</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isBabyMode ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                {isBabyMode && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </div>

          {/* Collapsible Dietary Options Button */}
          <button
            onClick={() => setShowDietaryOptions(!showDietaryOptions)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all group"
          >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-full text-emerald-600 shadow-sm border border-gray-100 group-hover:border-emerald-200">
                    <Utensils className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <span className="block font-bold text-gray-800 text-sm">Preferências Alimentares</span>
                    <span className="block text-xs text-gray-500">
                        {showDietaryOptions ? 'Toque para recolher' : 'Definir gostos e restrições'}
                    </span>
                </div>
            </div>
            {showDietaryOptions ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {/* Collapsible Content */}
          {showDietaryOptions && (
              <div className="space-y-6 animate-in slide-in-from-top-2 fade-in duration-300 border-l-2 border-emerald-100 pl-4">
                {/* Dislikes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isBabyMode ? "Alimentos a evitar / Perigosos" : "Não gosta de (separado por vírgula)"}
                    </label>
                    <textarea
                    value={dislikes}
                    onChange={(e) => setDislikes(e.target.value)}
                    placeholder="Ex: cebola, coentro, pimentão, quiabo..."
                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-gray-50 h-24 resize-none"
                    />
                    {isBabyMode && <p className="text-[10px] text-blue-600 mt-1">* Itens perigosos adicionados automaticamente.</p>}
                </div>

                {/* Restrictions Toggles */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Restrições e Dietas</label>
                    <div className="flex flex-wrap gap-2">
                    {commonRestrictions.map((res) => {
                        const isActive = restrictions.includes(res);
                        return (
                        <button
                            key={res}
                            type="button"
                            onClick={() => toggleRestriction(res)}
                            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                            isActive 
                                ? 'bg-red-50 border-red-200 text-red-600 shadow-sm' 
                                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            {res} {isActive && <X className="w-3 h-3 inline ml-1" />}
                        </button>
                        );
                    })}
                    {isBabyMode && restrictions.includes("Sem Açúcar") && (
                        <span className="px-4 py-2 rounded-full text-sm font-medium border bg-blue-50 border-blue-200 text-blue-600 shadow-sm">
                            Sem Açúcar (Auto)
                        </span>
                    )}
                    </div>
                </div>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={!name.trim() || isSaving}
            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8 flex items-center justify-center gap-2"
          >
            {isSaving ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Salvando...
                </>
            ) : (
                <>
                    <Save className="w-5 h-5" />
                    Salvar Pessoa
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
