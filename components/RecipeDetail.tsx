
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recipe, ShoppingItem, CookingMethod } from '../types';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  CheckCircle2, 
  ShoppingBasket, 
  Play, 
  X,
  ChefHat,
  Minus,
  Plus,
  Heart,
  Star,
  Check,
  PlusCircle,
  Wind,
  Flame,
  UtensilsCrossed,
  Volume2,
  SkipBack,
  SkipForward,
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
  const [rating, setRating] = useState(recipe.rating || 0);
  const [timerDuration, setTimerDuration] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [desiredServings, setDesiredServings] = useState(recipe.servings);

  useEffect(() => { setRating(recipe.rating || 0); }, [recipe.rating]);

  // Simplificador de frações e conversor de decimais
  const formatCulinaryNumber = (num: number): string => {
    if (num <= 0) return "";
    if (Number.isInteger(num)) return num.toString();

    // Tolerância para arredondamento de IA
    const eps = 0.02;
    const whole = Math.floor(num);
    const frac = num - whole;

    const findFrac = (val: number) => {
      if (val < 0.125) return ""; // muito pequeno
      if (Math.abs(val - 0.25) < eps) return "1/4";
      if (Math.abs(val - 0.33) < 0.05) return "1/3";
      if (Math.abs(val - 0.5) < eps) return "1/2";
      if (Math.abs(val - 0.66) < 0.05) return "2/3";
      if (Math.abs(val - 0.75) < eps) return "3/4";
      if (Math.abs(val - 0.125) < eps) return "1/8";
      return null;
    };

    const fracLabel = findFrac(frac);
    if (fracLabel !== null) {
      return whole > 0 ? `${whole} ${fracLabel}` : fracLabel;
    }

    if (Math.abs(frac - 0.95) < 0.05) return (whole + 1).toString();

    return num.toFixed(1).replace('.', ',');
  };

  const normalizeString = (str: string) => 
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const isInShoppingList = (ingredientName: string) => {
    const rawName = ingredientName.replace(/(\d+(?:[.,]\d+)?|\d+\/\d+)(\s*)([a-zA-ZÀ-ÿ°º]+)?/g, '').trim();
    const normalized = normalizeString(rawName);
    if (!normalized) return false;
    
    return (shoppingList || []).some(item => {
      const itemName = normalizeString(item.name);
      return itemName.includes(normalized) || normalized.includes(itemName);
    });
  };

  const scaleText = (text: string, originalServings: number, newServings: number): string => {
    if (!text) return "";
    const ratio = newServings / originalServings;
    
    // Regex melhorada: captura números puros, decimais e frações (mesmo as estranhas como 2/8)
    return text.replace(/(\d+[\/.,]\d+|\d+)(\s*)([a-zA-ZÀ-ÿ°º]+)?/g, (match, numberStr, space, unit) => {
        const lowerUnit = unit ? unit.toLowerCase() : '';
        const forbiddenUnits = ['min', 'minuto', 'h', 'grau', '°', 'c', 'passo', 'º'];
        
        if (forbiddenUnits.some(u => lowerUnit.startsWith(u))) return match;

        let value: number;
        if (numberStr.includes('/')) {
            const parts = numberStr.split('/');
            value = parseInt(parts[0]) / parseInt(parts[1]);
        } else {
            value = parseFloat(numberStr.replace(',', '.'));
        }

        if (isNaN(value)) return match;
        
        const scaledValue = value * ratio;
        return `${formatCulinaryNumber(scaledValue)}${space}${unit || ''}`;
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
  }, [currentStep, cookingMode, recipe.instructions, isFinished]);

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

  const handleAddIngredientToList = (ing: string) => {
    // Regex para extrair a quantidade (primeira parte numérica + unidade)
    const qtyMatch = ing.match(/^(\d+[\/.,]\d+|\d+)(\s*)([a-zA-ZÀ-ÿ°º]+)?/);
    const quantity = qtyMatch ? qtyMatch[0] : "1x";
    
    // Nome do ingrediente é o que sobra
    const nameOnly = ing.replace(/^(\d+[\/.,]\d+|\d+)(\s*)([a-zA-ZÀ-ÿ°º]+)?\s*(de\s+)?/i, '').trim();
    
    onAddToShoppingList(nameOnly || ing, quantity);
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
                  className="relative bg-white/10 backdrop-blur-2xl p-8 pt-16 rounded-[3rem] w-full max-w-sm text-center border border-white/20 shadow-2xl z-10"
                >
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                        <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center shadow-xl border-4 border-emerald-400 rotate-12">
                          <CheckCircle2 className="w-12 h-12 text-white" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-black mb-2 mt-4 tracking-tight">Perfeito!</h2>
                    <p className="text-emerald-100 mb-8 text-lg font-medium">Você concluiu esta receita com sucesso.</p>
                    <div className="bg-black/20 rounded-3xl p-6 mb-8 border border-white/5">
                        <p className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.2em] mb-4">Como ficou seu prato?</p>
                        <div className="flex justify-center gap-3">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button key={s} onClick={() => { setRating(s); onRate(s); }}>
                                  <Star className={`w-8 h-8 transition-colors ${rating >= s ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <button 
                      onClick={() => { setCookingMode(false); setIsFinished(false); if (onFinishCooking) onFinishCooking(); }} 
                      className="w-full bg-white text-emerald-900 font-black py-5 rounded-[2rem] shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      Finalizar Jornada <Sparkles className="w-5 h-5 text-amber-500" />
                    </button>
                </motion.div>
            </motion.div>
        );
    }

    return (
      <div className="fixed inset-0 bg-neutral-950 z-[100] flex flex-col text-white overflow-hidden font-['Sora']">
        <div className="flex items-center justify-between p-6 shrink-0">
          <div className="flex items-center gap-3"><ChefHat className="w-6 h-6 text-emerald-400" /><span className="font-bold text-gray-300">{recipe.time_minutes} min</span></div>
          <button onClick={() => { window.speechSynthesis.cancel(); setCookingMode(false); }} className="p-2 bg-gray-800 rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto min-h-0">
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 shrink-0">Passo {currentStep + 1} de {recipe.instructions.length}</p>
            <div className="max-w-md w-full mb-8">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-2xl sm:text-3xl font-medium leading-tight text-white"
                  >
                      {scaleText(recipe.instructions[currentStep], recipe.servings, desiredServings).replace(/\*\*/g, '')}
                  </motion.p>
                </AnimatePresence>
            </div>

            {timerDuration > 0 && (
                <div className="bg-gray-900/50 rounded-3xl p-5 border border-gray-800 w-full max-w-sm flex items-center justify-between shrink-0 mb-4">
                    <div className="text-left">
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Timer</p>
                        <p className="text-4xl font-mono text-white tracking-tighter">{Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
                    </div>
                    <button 
                        onClick={() => setIsTimerRunning(!isTimerRunning)} 
                        className={`px-6 py-3 rounded-2xl font-bold transition-all ${isTimerRunning ? 'bg-gray-700 text-white' : 'bg-emerald-600 text-white'}`}
                    >
                        {isTimerRunning ? 'Pausar' : 'Iniciar'}
                    </button>
                </div>
            )}
        </div>

        <div className="bg-neutral-900 px-6 pt-6 pb-8 sm:pb-10 rounded-t-[2.5rem] border-t border-gray-800 flex justify-center gap-4 shrink-0" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 16px)' }}>
            <button 
                onClick={() => currentStep > 0 && setCurrentStep(c => c - 1)} 
                disabled={currentStep === 0}
                className="flex-1 p-5 bg-gray-800 disabled:opacity-20 rounded-[2rem] text-gray-400 flex items-center justify-center transition-all"
            >
                <SkipBack className="w-6 h-6" />
            </button>
            <button 
                onClick={() => isSpeaking ? window.speechSynthesis.cancel() : speakStep(currentStep)} 
                className={`flex-1 p-5 rounded-[2rem] flex items-center justify-center transition-all ${isSpeaking ? 'bg-amber-500' : 'bg-gray-800'}`}
            >
                <Volume2 className="w-8 h-8" />
            </button>
            <button 
                onClick={() => currentStep < recipe.instructions.length - 1 ? setCurrentStep(c => c + 1) : setIsFinished(true)} 
                className="flex-[1.5] p-5 bg-emerald-600 rounded-[2rem] text-white flex items-center justify-center gap-2 font-bold shadow-lg"
            >
                {currentStep === recipe.instructions.length - 1 ? 'Finalizar' : <SkipForward className="w-6 h-6" />}
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
            <button onClick={onBack} className="p-2 bg-white/20 backdrop-blur-md rounded-full"><ArrowLeft className="w-6 h-6" /></button>
            <button onClick={onToggleFavorite} className="p-2.5 bg-white/20 backdrop-blur-md rounded-full"><Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-400 text-red-400' : 'text-white'}`} /></button>
        </div>
        <div className="relative z-10 mt-auto">
            <div className="flex gap-2 mb-3">
                <span className="bg-emerald-800/50 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">{recipe.difficulty}</span>
                {recipe.rating && <span className="bg-amber-400 text-stone-900 px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1"><Star className="w-2.5 h-2.5 fill-current" />{recipe.rating}</span>}
            </div>
            <h1 className="text-3xl font-extrabold mb-4 leading-tight tracking-tight">{recipe.title}</h1>
            <div className="flex gap-3 text-emerald-50 text-xs font-bold">
                <span className="bg-black/30 px-3 py-1.5 rounded-xl backdrop-blur-sm flex gap-1.5 items-center"><Clock className="w-3.5 h-3.5" /> {recipe.time_minutes} min</span>
                <span className="bg-black/30 px-3 py-1.5 rounded-xl backdrop-blur-sm flex gap-1.5 items-center"><Users className="w-3.5 h-3.5" /> {desiredServings} pessoas</span>
            </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-10 -mt-6 relative z-20">
        <div className="bg-white rounded-[2rem] p-5 flex justify-between border border-stone-100 shadow-xl shadow-stone-200/40 items-center">
            <div className="flex gap-3 items-center">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><Users className="w-6 h-6" /></div>
                <div>
                    <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Rendimento</p>
                    <p className="text-sm font-extrabold text-stone-800">Ajustar Quantidades</p>
                </div>
            </div>
            <div className="flex items-center gap-4 bg-stone-50 rounded-2xl px-2 py-1 border border-stone-100">
                <button onClick={() => setDesiredServings(Math.max(1, desiredServings - 1))} className="p-3 text-stone-400 hover:text-emerald-600"><Minus className="w-4 h-4" /></button>
                <span className="font-black text-lg text-stone-800 w-4 text-center">{desiredServings}</span>
                <button onClick={() => setDesiredServings(desiredServings + 1)} className="p-3 text-stone-400 hover:text-emerald-600"><Plus className="w-4 h-4" /></button>
            </div>
        </div>

        <div>
          <h3 className="text-sm font-black text-stone-800 uppercase tracking-[0.2em] mb-6 flex gap-3 items-center">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
            Ingredientes
          </h3>
          <ul className="space-y-3">
            {[...recipe.used_ingredients, ...recipe.missing_ingredients].map((ing, i) => {
                const scaled = scaleText(ing, recipe.servings, desiredServings).replace(/\*\*/g, '');
                const isMissing = i >= recipe.used_ingredients.length;
                const alreadyInList = isInShoppingList(ing);
                
                return (
                    <li key={i} className={`flex items-center justify-between gap-3 p-4 rounded-2xl border transition-all ${isMissing ? 'bg-stone-50 border-stone-100' : 'bg-emerald-50/30 border-emerald-100'}`}>
                        <div className="flex gap-3 items-center">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isMissing ? 'bg-stone-200' : 'bg-emerald-500'}`}>
                                <Check className="w-3 h-3 text-white" />
                            </div>
                            <span className={`text-sm font-medium ${isMissing ? 'text-stone-500 italic' : 'text-stone-700'}`}>
                                {scaled}
                            </span>
                        </div>
                        
                        {isMissing && (
                            alreadyInList ? (
                                <div className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Na Lista
                                </div>
                            ) : (
                                <button 
                                    onClick={() => handleAddIngredientToList(ing)}
                                    className="p-2 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200 transition-colors"
                                    title="Adicionar à lista de compras"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                </button>
                            )
                        )}
                    </li>
                );
            })}
          </ul>
        </div>

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

      <div className="fixed bottom-0 left-0 right-0 p-6 z-[80] bg-gradient-to-t from-white via-white/90 to-transparent pt-10" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 24px)' }}>
        <button 
            onClick={() => { setCurrentStep(0); setIsFinished(false); setCookingMode(true); }} 
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-[2rem] shadow-2xl flex justify-center items-center gap-3 active:scale-95 transition-all transform"
        >
          <Play className="w-6 h-6 fill-current" /> Começar a Cozinhar
        </button>
      </div>
    </div>
  );
};
