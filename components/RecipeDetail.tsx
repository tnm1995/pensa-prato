
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recipe, ShoppingItem, CookingMethod } from '../types';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  CheckCircle2, 
  ShoppingBasket, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  X,
  ChefHat,
  Timer,
  RotateCcw,
  Minus,
  Plus,
  Heart,
  Star,
  Home,
  ShoppingCart,
  Check,
  PlusCircle,
  Wind,
  Flame,
  UtensilsCrossed,
  Share2,
  Mic,
  Circle,
  Sparkles
} from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRate: (rating: number) => void;
  shoppingList: ShoppingItem[];
  onAddToShoppingList: (item: string, quantity?: string) => void;
  cookingMethod?: CookingMethod;
  onFinishCooking?: () => void;
  isExplore?: boolean;
}

// Pequeno componente interno para os "confetes" de celebração
const Confetti = () => {
  const particles = Array.from({ length: 20 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: "50%", y: "50%", scale: 0, opacity: 1 }}
          animate={{ 
            x: `${50 + (Math.random() - 0.5) * 150}%`, 
            y: `${50 + (Math.random() - 0.5) * 150}%`,
            scale: Math.random() * 1.5,
            opacity: 0,
            rotate: Math.random() * 360
          }}
          transition={{ 
            duration: 1.5, 
            ease: "easeOut",
            delay: 0.2
          }}
          className={`absolute w-3 h-3 rounded-sm ${
            ['bg-amber-400', 'bg-emerald-400', 'bg-white', 'bg-red-400'][i % 4]
          }`}
        />
      ))}
    </div>
  );
};

export const RecipeDetail: React.FC<RecipeDetailProps> = ({ 
  recipe, 
  onBack, 
  isFavorite, 
  onToggleFavorite, 
  onRate,
  shoppingList,
  onAddToShoppingList,
  cookingMethod,
  onFinishCooking,
  isExplore = false
}) => {
  const [cookingMode, setCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rating, setRating] = useState(recipe.rating || 0);
  const [isListening, setIsListening] = useState(false);
  const [timerDuration, setTimerDuration] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [desiredServings, setDesiredServings] = useState(recipe.servings);

  useEffect(() => { setRating(recipe.rating || 0); }, [recipe.rating]);

  const getMethodIcon = () => {
    switch(cookingMethod) {
        case CookingMethod.AIRFRYER: return <Wind className="w-4 h-4 text-emerald-300" />;
        case CookingMethod.STOVE: return <Flame className="w-4 h-4 text-orange-300" />;
        case CookingMethod.OVEN: return <ChefHat className="w-4 h-4 text-blue-300" />;
        default: return <UtensilsCrossed className="w-4 h-4 text-purple-300" />;
    }
  };

  const isInShoppingList = (ingredientName: string) => {
    const normalized = ingredientName.toLowerCase().trim();
    return shoppingList.some(item => item.name.toLowerCase().trim() === normalized && !item.checked);
  };

  const formatQuantity = (value: number): string => {
    const v = Math.round(value * 100) / 100;
    if (Number.isInteger(v)) return v.toString();
    return v.toFixed(1).replace('.', ',');
  };

  const scaleText = (text: string, originalServings: number, newServings: number): string => {
    if (!text) return "";
    const ratio = newServings / originalServings;
    return text.replace(/(\d+(?:[.,]\d+)?|\d+\/\d+)(\s*)([a-zA-ZÀ-ÿ°º]+)?/g, (match, numberStr, space, unit) => {
        const lowerUnit = unit ? unit.toLowerCase() : '';
        const forbiddenUnits = ['min', 'minuto', 'h', 'grau', '°', 'c', 'passo'];
        if (forbiddenUnits.some(u => lowerUnit.startsWith(u))) return match;
        let value = numberStr.includes('/') ? (parseFloat(numberStr.split('/')[0]) / parseFloat(numberStr.split('/')[1])) : parseFloat(numberStr.replace(',', '.'));
        if (isNaN(value)) return match;
        return `${formatQuantity(value * ratio)}${space}${unit || ''}`;
    });
  };

  const formatInstructionText = (text: string) => {
    if (!text) return null;
    let parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => index % 2 === 1 ? <strong key={index} className="font-bold text-gray-900 bg-emerald-50 px-1 rounded">{part}</strong> : part);
  };

  useEffect(() => {
    if (cookingMode && !isFinished) {
      const stepText = recipe.instructions[currentStep] || "";
      const match = stepText.match(/(\d+)\s*(?:minutos|minuto|min|m)\b/i);
      const seconds = match ? parseInt(match[1]) * 60 : 0;
      setTimerDuration(seconds);
      setTimeLeft(seconds);
      setIsTimerRunning(false);
    }
  }, [currentStep, cookingMode]);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timeLeft > 0) interval = setInterval(() => setTimeLeft(p => p - 1), 1000);
    else if (timeLeft === 0) setIsTimerRunning(false);
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const speakStep = (stepIndex: number) => {
    if (isFinished) return;
    const instruction = recipe.instructions[stepIndex];
    if (!instruction) return;
    window.speechSynthesis.cancel();
    const scaled = scaleText(instruction, recipe.servings, desiredServings).replace(/\*\*/g, '');
    const u = new SpeechSynthesisUtterance(`Passo ${stepIndex + 1}. ${scaled}`);
    u.lang = 'pt-BR';
    u.rate = 1.1;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  if (cookingMode) {
    if (isFinished) {
        return (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[110] bg-emerald-900 flex flex-col items-center justify-center text-white p-6 font-['Sora'] overflow-hidden"
            >
                <Confetti />
                
                <motion.div 
                  initial={{ scale: 0.8, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  transition={{ type: "spring", damping: 15, delay: 0.1 }}
                  className="relative bg-white/10 backdrop-blur-2xl p-8 pt-16 rounded-[3rem] w-full max-w-sm text-center border border-white/20 shadow-2xl z-10"
                >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2"
                    >
                        <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center shadow-xl border-4 border-emerald-400 rotate-12">
                          <CheckCircle2 className="w-12 h-12 text-white" />
                        </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <h2 className="text-4xl font-black mb-2 mt-4 tracking-tight">Perfeito!</h2>
                      <p className="text-emerald-100 mb-8 text-lg font-medium">Você concluiu esta receita com sucesso.</p>
                      
                      <div className="bg-black/20 rounded-3xl p-6 mb-8 border border-white/5">
                          <p className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.2em] mb-4">Como ficou seu prato?</p>
                          <div className="flex justify-center gap-3">
                              {[1, 2, 3, 4, 5].map((s) => (
                                  <motion.button 
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    key={s} 
                                    onClick={() => { setRating(s); onRate(s); }}
                                  >
                                    <Star className={`w-8 h-8 transition-colors ${rating >= s ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`} />
                                  </motion.button>
                              ))}
                          </div>
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setCookingMode(false); setIsFinished(false); if (onFinishCooking) onFinishCooking(); }} 
                        className="w-full bg-white text-emerald-900 font-black py-5 rounded-[2rem] shadow-xl hover:shadow-emerald-950/20 transition-all flex items-center justify-center gap-2"
                      >
                        Finalizar Jornada <Sparkles className="w-5 h-5 text-amber-500" />
                      </motion.button>
                    </motion.div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="mt-8 flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-widest"
                >
                  <ChefHat className="w-4 h-4" /> Impacto Positivo Registrado
                </motion.div>
            </motion.div>
        );
    }

    return (
      <div className="fixed inset-0 bg-neutral-950 z-[100] flex flex-col text-white overflow-hidden">
        {/* Header - Fixed height */}
        <div className="flex items-center justify-between p-6 shrink-0">
          <div className="flex items-center gap-3"><ChefHat className="w-6 h-6 text-emerald-400" /><span className="font-bold text-gray-300">{recipe.time_minutes} min</span></div>
          <button onClick={() => { window.speechSynthesis.cancel(); setCookingMode(false); }} className="p-2 bg-gray-800 rounded-full active:scale-95"><X className="w-5 h-5" /></button>
        </div>

        {/* Central Content - Scrollable if text is too long */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto min-h-0">
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 shrink-0">Passo {currentStep + 1} de {recipe.instructions.length}</p>
            
            <div className="max-w-md w-full mb-8">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-2xl sm:text-3xl font-medium leading-tight text-white duration-500"
                  >
                      {scaleText(recipe.instructions[currentStep], recipe.servings, desiredServings).replace(/\*\*/g, '')}
                  </motion.p>
                </AnimatePresence>
            </div>

            {timerDuration > 0 && (
                <div className="bg-gray-900/50 rounded-3xl p-5 border border-gray-800 w-full max-w-sm flex items-center justify-between shrink-0 mb-4">
                    <div className="text-left">
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Timer Automático</p>
                        <p className="text-4xl font-mono text-white tracking-tighter">{Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
                    </div>
                    <button 
                        onClick={() => setIsTimerRunning(!isTimerRunning)} 
                        className={`px-6 py-3 rounded-2xl font-bold transition-all ${isTimerRunning ? 'bg-gray-700 text-white' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'}`}
                    >
                        {isTimerRunning ? 'Pausar' : 'Iniciar'}
                    </button>
                </div>
            )}
        </div>

        {/* Control Bar - Account for Mobile Safe Areas */}
        <div className="bg-neutral-900 px-6 pt-6 pb-8 sm:pb-10 rounded-t-[2.5rem] border-t border-gray-800 flex justify-center gap-4 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 16px)' }}>
            <button 
                onClick={() => currentStep > 0 && setCurrentStep(c => c - 1)} 
                disabled={currentStep === 0}
                className="flex-1 p-5 bg-gray-800 disabled:opacity-20 rounded-[2rem] text-gray-400 flex items-center justify-center transition-all active:scale-95"
            >
                <SkipBack className="w-6 h-6" />
            </button>
            
            <button 
                onClick={() => isSpeaking ? window.speechSynthesis.cancel() : speakStep(currentStep)} 
                className={`flex-1 p-5 rounded-[2rem] flex items-center justify-center transition-all active:scale-95 ${isSpeaking ? 'bg-amber-500 shadow-lg shadow-amber-900/20' : 'bg-gray-800'}`}
            >
                <Volume2 className={`w-8 h-8 ${isSpeaking ? 'animate-pulse' : ''}`} />
            </button>
            
            <button 
                onClick={() => currentStep < recipe.instructions.length - 1 ? setCurrentStep(c => c + 1) : setIsFinished(true)} 
                className="flex-[1.5] p-5 bg-emerald-600 rounded-[2rem] text-white flex items-center justify-center gap-2 font-bold shadow-lg shadow-emerald-950 transition-all active:scale-95"
            >
                {currentStep === recipe.instructions.length - 1 ? 'Finalizar' : <><span className="hidden sm:inline">Próximo</span> <SkipForward className="w-6 h-6" /></>}
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-40 font-['Sora']">
      <div className={`pt-12 pb-8 px-6 rounded-b-[3rem] shadow-lg relative overflow-hidden text-white ${isExplore ? 'h-80' : 'bg-emerald-600'}`}>
        {isExplore && recipe.image && <div className="absolute inset-0"><ImageWithFallback src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30"></div></div>}
        <div className="flex justify-between items-center relative z-10 mb-20 md:mb-6">
            <button onClick={onBack} className="p-2 bg-white/20 backdrop-blur-md rounded-full active:scale-90 transition-transform"><ArrowLeft className="w-6 h-6" /></button>
            <div className="flex gap-2">
                <button onClick={onToggleFavorite} className="p-2.5 bg-white/20 backdrop-blur-md rounded-full active:scale-90 transition-transform"><Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-400 text-red-400' : 'text-white'}`} /></button>
            </div>
        </div>
        <div className="relative z-10 mt-auto">
            <div className="flex gap-2 mb-3">
                <span className="bg-emerald-800/50 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">{recipe.difficulty}</span>
                {recipe.rating && <span className="bg-amber-400 text-stone-900 px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1"><Star className="w-2.5 h-2.5 fill-current" />{recipe.rating}</span>}
            </div>
            <h1 className="text-3xl font-extrabold mb-4 leading-tight tracking-tight">{recipe.title}</h1>
            <div className="flex gap-3 text-emerald-50 text-xs font-bold">
                <span className="bg-black/30 px-3 py-1.5 rounded-xl backdrop-blur-sm flex gap-1.5 items-center"><Clock className="w-3.5 h-3.5" /> {recipe.time_minutes} min</span>
                <span className="bg-black/30 px-3 py-1.5 rounded-xl backdrop-blur-sm flex gap-1.5 items-center"><Users className="w-3.5 h-3.5" /> {desiredServings} {desiredServings === 1 ? 'pessoa' : 'pessoas'}</span>
            </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-10 -mt-6 relative z-20">
        {/* Ajuste de Porções */}
        <div className="bg-white rounded-[2rem] p-5 flex justify-between border border-stone-100 shadow-xl shadow-stone-200/40 items-center">
            <div className="flex gap-3 items-center">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><Users className="w-6 h-6" /></div>
                <div>
                    <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Rendimento</p>
                    <p className="text-sm font-extrabold text-stone-800">Ajustar Quantidades</p>
                </div>
            </div>
            <div className="flex items-center gap-4 bg-stone-50 rounded-2xl px-2 py-1 border border-stone-100">
                <button onClick={() => setDesiredServings(Math.max(1, desiredServings - 1))} className="p-3 text-stone-400 hover:text-emerald-600 transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="font-black text-lg text-stone-800 w-4 text-center">{desiredServings}</span>
                <button onClick={() => setDesiredServings(desiredServings + 1)} className="p-3 text-stone-400 hover:text-emerald-600 transition-colors"><Plus className="w-4 h-4" /></button>
            </div>
        </div>

        {/* Ingredientes */}
        <div>
          <h3 className="text-sm font-black text-stone-800 uppercase tracking-[0.2em] mb-6 flex gap-3 items-center">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
            Ingredientes
          </h3>
          <ul className="space-y-3">
            {[...recipe.used_ingredients, ...recipe.missing_ingredients].map((ing, i) => {
                const scaled = scaleText(ing, recipe.servings, desiredServings).replace(/\*\*/g, '');
                const isMissing = i >= recipe.used_ingredients.length;
                return (
                    <li key={i} className={`flex justify-between gap-3 p-4 rounded-2xl border transition-all ${isMissing ? 'bg-stone-50 border-stone-100 opacity-60' : 'bg-emerald-50/30 border-emerald-100'}`}>
                        <div className="flex gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isMissing ? 'bg-stone-200' : 'bg-emerald-500'}`}>
                                <Check className="w-3 h-3 text-white" />
                            </div>
                            <span className={`text-sm font-medium ${isMissing ? 'text-stone-500 italic' : 'text-stone-700'}`}>
                                {scaled}
                                {isMissing && <span className="block text-[10px] font-black text-orange-500 uppercase mt-0.5">Adicionar à lista?</span>}
                            </span>
                        </div>
                    </li>
                );
            })}
          </ul>
        </div>

        {/* Modo de Preparo (Overview) */}
        <div>
           <h3 className="text-sm font-black text-stone-800 uppercase tracking-[0.2em] mb-6 flex gap-3 items-center">
             <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
             Passo a Passo
           </h3>
           <div className="space-y-8 relative pl-4">
              <div className="absolute left-[1.6rem] top-4 bottom-4 w-px bg-stone-100"></div>
              {recipe.instructions.map((step, i) => (
                <div key={i} className="relative pl-10">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-2xl bg-white text-emerald-600 font-black flex items-center justify-center text-xs border border-stone-100 shadow-sm z-10">{i + 1}</div>
                  <div className="bg-stone-50/50 p-5 rounded-[2rem] border border-stone-100 shadow-sm group hover:bg-white hover:shadow-lg transition-all duration-300">
                    <p className="text-stone-600 text-sm leading-relaxed font-medium">
                        {formatInstructionText(scaleText(step, recipe.servings, desiredServings))}
                    </p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Botão Fixo - Respeitando Safe Area */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-[80] bg-gradient-to-t from-white via-white/90 to-transparent pt-10" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 24px)' }}>
        <button 
            onClick={() => { setCurrentStep(0); setIsFinished(false); setCookingMode(true); }} 
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-emerald-200 flex justify-center items-center gap-3 active:scale-95 transition-all transform"
        >
          <Play className="w-6 h-6 fill-current" /> Começar a Cozinhar
        </button>
      </div>
    </div>
  );
};
