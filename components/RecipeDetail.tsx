
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recipe, ShoppingItem, CookingMethod } from '../types';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  CheckCircle2, 
  Play, 
  X,
  ChefHat,
  Minus,
  Plus,
  Heart,
  Star,
  Check,
  PlusCircle,
  Volume2,
  SkipBack,
  SkipForward,
  Sparkles,
  Trophy
} from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[120]">
      {Array.from({ length: 80 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: "50%", 
            y: "60%", 
            scale: 0, 
            opacity: 1,
            rotate: 0 
          }}
          animate={{ 
            x: `${Math.random() * 120 - 10}%`, 
            y: `${Math.random() * 120 - 10}%`,
            scale: Math.random() * 1.5 + 0.5,
            opacity: [1, 1, 0],
            rotate: Math.random() * 1080
          }}
          transition={{ 
            duration: Math.random() * 2.5 + 1.5, 
            ease: "easeOut",
            delay: Math.random() * 0.2
          }}
          className={`absolute w-3 h-3 rounded-sm ${
            ['bg-amber-400', 'bg-emerald-400', 'bg-rose-400', 'bg-blue-400', 'bg-white', 'bg-purple-400'][i % 6]
          }`}
        />
      ))}
    </div>
  );
};

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

  const formatCulinaryNumber = (num: number): string => {
    if (num <= 0) return "";
    if (Number.isInteger(num)) return num.toString();

    const whole = Math.floor(num);
    const frac = num - whole;
    const eps = 0.05;

    const getFracPart = (f: number) => {
      if (Math.abs(f - 0.25) < eps) return "1/4";
      if (Math.abs(f - 0.33) < 0.06) return "1/3";
      if (Math.abs(f - 0.5) < eps) return "1/2";
      if (Math.abs(f - 0.66) < 0.06) return "2/3";
      if (Math.abs(f - 0.75) < eps) return "3/4";
      if (Math.abs(f - 0.125) < eps) return "1/8";
      return null;
    };

    const fracStr = getFracPart(frac);
    if (fracStr) return whole > 0 ? `${whole} ${fracStr}` : fracStr;
    return num.toFixed(1).replace('.', ',');
  };

  const scaleText = (text: string, originalServings: number, newServings: number): string => {
    if (!text) return "";
    const ratio = newServings / originalServings;
    
    if (text.toLowerCase().includes("a gosto")) return text;

    return text.replace(/(\d+\s+\d+\/\d+|\d+\/\d+|\d+[.,]\d+|\d+)(\s*)([a-zA-ZÀ-ÿ°º]+)?/g, (match, numberStr, space, unit) => {
        const lowerUnit = (unit || '').toLowerCase();
        const forbiddenUnits = ['min', 'minuto', 'h', 'hora', 'grau', '°', 'c', 'passo', 'º'];
        
        if (forbiddenUnits.some(u => lowerUnit.startsWith(u))) return match;

        let value: number = 0;
        try {
            if (numberStr.includes(' ') && numberStr.includes('/')) {
                const [w, f] = numberStr.split(/\s+/);
                const [n, d] = f.split('/').map(Number);
                value = Number(w) + (n / d);
            } else if (numberStr.includes('/')) {
                const [n, d] = numberStr.split('/').map(Number);
                value = n / d;
            } else {
                value = parseFloat(numberStr.replace(',', '.'));
            }
        } catch (e) { return match; }

        if (isNaN(value)) return match;
        
        const discreteUnits = ['caixa', 'lata', 'pote', 'unidade', 'unidades'];
        if (ratio < 1 && value <= 0.5 && discreteUnits.some(u => lowerUnit.includes(u))) {
            return match;
        }

        const scaledValue = value * ratio;
        return `${formatCulinaryNumber(scaledValue)}${space}${unit || ''}`;
    });
  };

  const normalizeString = (str: string) => 
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  // Helper centralizado para extrair o nome do ingrediente ignorando quantidades e conectivos
  const extractCleanName = (ing: string) => {
      return ing
          .replace(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+[.,]\d+|\d+)\s*(?:[a-zA-ZÀ-ÿ°º]+\s+)?(?:de\s+)?/i, '')
          .trim();
  };

  const isInShoppingList = (ingredientName: string) => {
    const cleanName = extractCleanName(ingredientName);
    const normalized = normalizeString(cleanName);
    if (!normalized) return false;
    
    return (shoppingList || []).some(item => {
      if (item.checked) return false;
      const itemName = normalizeString(item.name);
      return itemName.includes(normalized) || normalized.includes(itemName);
    });
  };

  const handleAddIngredientToList = (ing: string) => {
    // Captura apenas o valor numérico/fração inicial (ex: "1", "1/2", "1 1/2", "0.5")
    const qtyMatch = ing.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+[.,]\d+|\d+)/);
    const quantity = qtyMatch ? qtyMatch[1] : "1";
    
    const nameOnly = extractCleanName(ing);
                       
    onAddToShoppingList(nameOnly || ing, quantity);
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

  if (cookingMode) {
    if (isFinished) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[110] bg-emerald-900 flex flex-col items-center justify-center text-white p-6 font-['Sora'] overflow-hidden">
                <Confetti />
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white p-8 pt-16 rounded-[3rem] w-full max-w-sm text-center shadow-2xl z-10">
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2">
                        <div className="w-28 h-28 bg-amber-400 rounded-[2.5rem] flex items-center justify-center shadow-xl border-4 border-white rotate-6"><Trophy className="w-14 h-14 text-white" /></div>
                    </div>
                    <h2 className="text-3xl font-black text-stone-900 mb-2 mt-4">Sensacional!</h2>
                    <p className="text-stone-500 mb-8 text-sm font-medium">Você concluiu esta receita com maestria.</p>
                    <div className="bg-stone-50 rounded-3xl p-6 mb-8 border border-stone-100">
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-4">Nota do Prato</p>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button key={s} onClick={() => { setRating(s); onRate(s); }}>
                                  <Star className={`w-8 h-8 transition-all ${rating >= s ? 'fill-amber-400 text-amber-400 scale-110' : 'text-stone-200'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <button onClick={() => { setCookingMode(false); setIsFinished(false); if (onFinishCooking) onFinishCooking(); }} className="w-full bg-emerald-600 text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                      Concluir <Sparkles className="w-5 h-5" />
                    </button>
                </motion.div>
            </motion.div>
        );
    }

    return (
      <div className="fixed inset-0 bg-neutral-950 z-[100] flex flex-col text-white overflow-hidden font-['Sora']">
        <div className="flex items-center justify-between p-6 shrink-0">
          <div className="flex items-center gap-3"><ChefHat className="w-6 h-6 text-emerald-400" /><span className="font-bold text-gray-300">{recipe.time_minutes} min</span></div>
          <button onClick={() => { window.speechSynthesis.cancel(); setCookingMode(false); }} className="p-2 bg-neutral-800 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto min-h-0">
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 shrink-0">Passo {currentStep + 1} de {recipe.instructions.length}</p>
            <div className="max-w-md w-full mb-8">
                <AnimatePresence mode="wait">
                  <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-2xl sm:text-3xl font-medium leading-tight text-white px-4">
                      {formatInstructionText(scaleText(recipe.instructions[currentStep], recipe.servings, desiredServings))}
                  </motion.div>
                </AnimatePresence>
            </div>
            {timerDuration > 0 && (
                <div className="bg-neutral-900/80 rounded-[2.5rem] p-6 border border-neutral-800 w-full max-w-sm flex items-center justify-between shrink-0 mb-4 shadow-xl">
                    <div className="text-left">
                        <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Timer</p>
                        <p className="text-4xl font-mono text-white tracking-tighter">{Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
                    </div>
                    <button onClick={() => setIsTimerRunning(!isTimerRunning)} className={`px-8 py-3 rounded-2xl font-bold active:scale-95 ${isTimerRunning ? 'bg-neutral-700 text-white' : 'bg-emerald-600 text-white'}`}>
                        {isTimerRunning ? 'Pausar' : 'Iniciar'}
                    </button>
                </div>
            )}
        </div>
        <div className="bg-neutral-900 px-6 pt-6 pb-8 sm:pb-10 rounded-t-[3rem] border-t border-neutral-800 flex justify-center gap-4 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.4)]" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 16px)' }}>
            <button onClick={() => currentStep > 0 && setCurrentStep(c => c - 1)} disabled={currentStep === 0} className="flex-1 p-5 bg-neutral-800 disabled:opacity-20 rounded-[2rem] text-gray-400 flex items-center justify-center transition-all"><SkipBack className="w-6 h-6" /></button>
            <button onClick={() => isSpeaking ? window.speechSynthesis.cancel() : speakStep(currentStep)} className={`flex-1 p-5 rounded-[2rem] flex items-center justify-center transition-all ${isSpeaking ? 'bg-amber-500 shadow-lg' : 'bg-neutral-800'}`}><Volume2 className="w-8 h-8" /></button>
            <button onClick={() => currentStep < recipe.instructions.length - 1 ? setCurrentStep(c => c + 1) : setIsFinished(true)} className="flex-[1.5] p-5 bg-emerald-600 rounded-[2rem] text-white flex items-center justify-center gap-2 font-bold shadow-lg">{currentStep === recipe.instructions.length - 1 ? 'Concluir' : <SkipForward className="w-6 h-6" />}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-40 font-['Sora']">
      <div className={`pt-12 pb-8 px-6 rounded-b-[3.5rem] shadow-lg relative overflow-hidden text-white ${isExplore ? 'h-80' : 'bg-emerald-600'}`}>
        {isExplore && recipe.image && (
            <div className="absolute inset-0">
                <ImageWithFallback src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20"></div>
            </div>
        )}
        <div className="flex justify-between items-center relative z-10 mb-20 md:mb-6">
            <button onClick={onBack} className="p-3 bg-white/20 backdrop-blur-md rounded-2xl active:scale-90 transition-transform"><ArrowLeft className="w-6 h-6" /></button>
            <button onClick={onToggleFavorite} className="p-3 bg-white/20 backdrop-blur-md rounded-2xl active:scale-90 transition-transform"><Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-400 text-red-400' : 'text-white'}`} /></button>
        </div>
        <div className="relative z-10 mt-auto">
            <div className="flex gap-2 mb-3">
                <span className="bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{recipe.difficulty}</span>
                {recipe.rating && <span className="bg-amber-400 text-stone-900 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1"><Star className="w-3 h-3 fill-current" />{recipe.rating}</span>}
            </div>
            <h1 className="text-3xl font-extrabold mb-4 leading-tight tracking-tight drop-shadow-sm">{recipe.title}</h1>
            <div className="flex gap-3 text-emerald-50 text-xs font-bold">
                <span className="bg-black/30 px-3.5 py-2 rounded-2xl backdrop-blur-md flex gap-2 items-center border border-white/10"><Clock className="w-4 h-4" /> {recipe.time_minutes} min</span>
                <span className="bg-black/30 px-3.5 py-2 rounded-2xl backdrop-blur-md flex gap-2 items-center border border-white/10"><Users className="w-4 h-4" /> {desiredServings} pessoas</span>
            </div>
        </div>
      </div>

      <div className="px-6 py-10 space-y-12 -mt-6 relative z-20">
        <div className="bg-white rounded-[2.5rem] p-6 flex justify-between border border-stone-100 shadow-xl shadow-stone-200/40 items-center">
            <div className="flex gap-4 items-center">
                <div className="p-3.5 bg-emerald-50 rounded-[1.5rem] text-emerald-600 shadow-sm"><Users className="w-6 h-6" /></div>
                <div>
                    <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-0.5">Ajuste de Rendimento</p>
                    <p className="text-base font-extrabold text-stone-800">Servir {desiredServings} {desiredServings === 1 ? 'pessoa' : 'pessoas'}</p>
                </div>
            </div>
            <div className="flex items-center gap-1 bg-stone-50 rounded-2xl p-1 border border-stone-100">
                <button onClick={() => setDesiredServings(Math.max(1, desiredServings - 1))} className="p-3 text-stone-400 hover:text-emerald-600 active:bg-white rounded-xl transition-all"><Minus className="w-4 h-4" /></button>
                <span className="font-black text-lg text-stone-800 w-8 text-center">{desiredServings}</span>
                <button onClick={() => setDesiredServings(desiredServings + 1)} className="p-3 text-stone-400 hover:text-emerald-600 active:bg-white rounded-xl transition-all"><Plus className="w-4 h-4" /></button>
            </div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-stone-800 uppercase tracking-[0.2em] flex gap-3 items-center">
                <div className="w-2 h-6 bg-emerald-500 rounded-full shadow-sm"></div>
                Ingredientes
            </h3>
          </div>
          <ul className="space-y-4">
            {[...recipe.used_ingredients, ...recipe.missing_ingredients].map((ing, i) => {
                const scaled = scaleText(ing, recipe.servings, desiredServings).replace(/\*\*/g, '');
                const isMissing = i >= recipe.used_ingredients.length;
                const alreadyInList = isInShoppingList(ing);
                
                return (
                    <motion.li key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`flex items-center justify-between gap-4 p-5 rounded-3xl border transition-all ${isMissing ? 'bg-stone-50 border-stone-100 shadow-sm' : 'bg-emerald-50/20 border-emerald-100'}`}>
                        <div className="flex gap-4 items-center flex-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm ${isMissing ? 'bg-stone-200' : 'bg-emerald-500'}`}>
                                <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className={`text-sm font-semibold leading-snug ${isMissing ? 'text-stone-500 italic' : 'text-stone-700'}`}>{scaled}</span>
                        </div>
                        {alreadyInList ? (
                            <div className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase flex items-center gap-1.5 shadow-sm border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" /> Na Lista
                            </div>
                        ) : (
                            <button onClick={() => handleAddIngredientToList(ing)} className="p-2.5 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200 transition-colors shadow-sm active:scale-90" title="Adicionar à lista">
                                <PlusCircle className="w-5 h-5" />
                            </button>
                        )}
                    </motion.li>
                );
            })}
          </ul>
        </section>

        <section>
           <h3 className="text-sm font-black text-stone-800 uppercase tracking-[0.2em] mb-8 flex gap-3 items-center">
             <div className="w-2 h-6 bg-emerald-500 rounded-full shadow-sm"></div>
             Passo a Passo
           </h3>
           <div className="space-y-6">
              {recipe.instructions.map((step, i) => (
                <div key={i} className="bg-stone-50/40 p-6 rounded-[2.5rem] border border-stone-100 shadow-sm group hover:bg-white hover:shadow-xl transition-all duration-500">
                    <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 shrink-0 rounded-2xl bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-sm shadow-sm border border-emerald-200">
                            {i + 1}
                        </div>
                        <p className="text-stone-600 text-sm leading-relaxed font-medium pt-1.5">
                            {formatInstructionText(scaleText(step, recipe.servings, desiredServings))}
                        </p>
                    </div>
                </div>
              ))}
           </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 z-[80] bg-gradient-to-t from-white via-white/95 to-transparent pt-12" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 24px)' }}>
        <button onClick={() => { setCurrentStep(0); setIsFinished(false); setCookingMode(true); }} className="w-full bg-stone-900 hover:bg-black text-white font-black py-6 rounded-[2.5rem] shadow-2xl flex justify-center items-center gap-4 active:scale-95 transition-all transform group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <Play className="w-6 h-6 fill-current text-emerald-400" /> 
          <span className="relative z-10">Entrar no Modo Preparo</span>
        </button>
      </div>
    </div>
  );
};
