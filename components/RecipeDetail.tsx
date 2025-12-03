import React, { useState, useEffect, useMemo } from 'react';
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
  Circle
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
  // State for Cooking Mode
  const [cookingMode, setCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rating, setRating] = useState(recipe.rating || 0);
  const [isListening, setIsListening] = useState(false);
  
  // Timer State
  const [timerDuration, setTimerDuration] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Portion Control
  const [desiredServings, setDesiredServings] = useState(recipe.servings);

  // Sync local rating state with recipe prop
  useEffect(() => {
    setRating(recipe.rating || 0);
  }, [recipe.rating]);

  const getMethodIcon = () => {
    switch(cookingMethod) {
        case CookingMethod.AIRFRYER: return <Wind className="w-4 h-4 text-emerald-300" />;
        case CookingMethod.STOVE: return <Flame className="w-4 h-4 text-orange-300" />;
        case CookingMethod.OVEN: return <ChefHat className="w-4 h-4 text-blue-300" />;
        default: return <UtensilsCrossed className="w-4 h-4 text-purple-300" />;
    }
  };

  const parseIngredientForList = (ingredient: string) => {
    const clean = ingredient.trim();
    const numberRegex = /^(\d+\s*\/\s*\d+|\d+(?:[.,]\d+)?)\s*/;
    const match = clean.match(numberRegex);
    
    if (!match) return { name: clean, quantity: '1x' };
    
    const numberPart = match[1].replace(/\s/g, ''); 
    const restOfString = clean.substring(match[0].length).trim();
    
    const UNITS = [
        'g', 'kg', 'mg', 'l', 'ml', 'dl', 'grama', 'gramas', 'kilo', 'litro',
        'xicara', 'xícara', 'colher', 'lata', 'caixa', 'pacote', 'saco', 'vidro',
        'fatia', 'dente', 'maço', 'ramo', 'tablete', 'pitada', 'copo', 'garrafa'
    ];
    
    const firstWord = restOfString.split(' ')[0].toLowerCase().replace(/[.,]$/, '');
    const isUnit = UNITS.some(u => firstWord.startsWith(u));
    const isFraction = numberPart.includes('/');
    
    if (isUnit) {
        return { name: clean, quantity: '1x' };
    } 
    
    if (isFraction) {
        return { name: restOfString, quantity: numberPart };
    } else {
        return { name: restOfString, quantity: numberPart + 'x' };
    }
  };

  const isInShoppingList = (ingredientName: string) => {
    const { name } = parseIngredientForList(ingredientName);
    const normalized = name.toLowerCase().trim();
    const originalNormalized = ingredientName.toLowerCase().trim();
    return shoppingList.some(item => {
        const itemNorm = item.name.toLowerCase().trim();
        return (itemNorm === normalized || itemNorm === originalNormalized) && !item.checked;
    });
  };

  const confettiParticles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      backgroundColor: ['#fbbf24', '#34d399', '#f87171', '#60a5fa', '#a78bfa'][Math.floor(Math.random() * 5)],
      rotation: Math.random() * 360
    }));
  }, []);

  const formatQuantity = (value: number): string => {
    const v = Math.round(value * 100) / 100;
    if (v === 0) return "0";
    if (Number.isInteger(v)) return v.toString();

    const whole = Math.floor(v);
    const decimal = v - whole;
    if (decimal < 0.05) return whole.toString();
    if (decimal > 0.95) return (whole + 1).toString();

    const fractions = [
        { val: 0.25, label: '1/4' },
        { val: 0.33, label: '1/3' },
        { val: 0.5,  label: '1/2' },
        { val: 0.66, label: '2/3' },
        { val: 0.75, label: '3/4' },
        { val: 0.125, label: '1/8' }
    ];
    const match = fractions.find(f => Math.abs(decimal - f.val) < 0.06); 
    if (match) {
        return whole > 0 ? `${whole} ${match.label}` : match.label;
    }
    return v.toFixed(1).replace('.', ',').replace(',0', '');
  };

  const scaleText = (text: string, originalServings: number, newServings: number): string => {
    if (!text) return "";
    const ratio = newServings / originalServings;
    return text.replace(/(\d+(?:[.,]\d+)?|\d+\/\d+)(\s*)([a-zA-ZÀ-ÿ°º]+)?/g, (match, numberStr, space, unit) => {
        const lowerUnit = unit ? unit.toLowerCase() : '';
        const forbiddenUnits = ['min', 'minuto', 'h', 'grau', '°', 'c', 'passo'];
        if (forbiddenUnits.some(u => lowerUnit.startsWith(u))) return match;

        let value: number;
        if (numberStr.includes('/')) {
            const [num, den] = numberStr.split('/').map(Number);
            value = num / den;
        } else {
            value = parseFloat(numberStr.replace(',', '.'));
        }
        
        if (isNaN(value)) return match;
        const newValue = value * ratio;
        return `${formatQuantity(newValue)}${space}${unit || ''}`;
    });
  };

  const formatIngredientDisplay = (text: string) => {
      const regex = /^((?:\d+(?:[.,]\d+)?|\d+\/\d+)\s*(?:[a-zA-ZÀ-ÿ°º]+\s+)?)(.*)/;
      const match = text.match(regex);
      if (match) {
          return (
              <>
                  <span className="font-bold text-gray-900">{match[1]}</span>
                  <span className="text-gray-600">{match[2]}</span>
              </>
          );
      }
      return <span className="text-gray-700 font-medium">{text}</span>;
  };

  const formatInstructionText = (text: string) => {
    if (!text) return null;
    const timeRegex = /\b(\d+(?:[.,]\d+)?\s*(?:minutos?|min|h(?:oras?)?|s(?:egundos?)?))\b/gi;
    let parts = text.split(/\*\*(.*?)\*\*/g);
    
    return parts.map((part, index) => {
        if (index % 2 === 1) return <strong key={index} className="font-bold text-gray-900 bg-emerald-50 px-1 rounded mx-0.5">{part}</strong>;
        const timeParts = part.split(timeRegex);
        return (
            <span key={index}>
                {timeParts.map((tp, i) => {
                    if (tp.match(timeRegex)) return <span key={`${index}-${i}`} className="text-emerald-600 font-bold">{tp}</span>;
                    return tp;
                })}
            </span>
        );
    });
  };

  const formatInstructionTextCookingMode = (text: string) => {
    if (!text) return null;
    const timeRegex = /\b(\d+(?:[.,]\d+)?\s*(?:minutos?|min|h(?:oras?)?|s(?:egundos?)?))\b/gi;
    let parts = text.split(/\*\*(.*?)\*\*/g);
    
    return parts.map((part, index) => {
        if (index % 2 === 1) return <strong key={index} className="font-bold text-emerald-400">{part}</strong>;
        const timeParts = part.split(timeRegex);
        return (
            <span key={index}>
                {timeParts.map((tp, i) => {
                    if (tp.match(timeRegex)) return <span key={`${index}-${i}`} className="text-emerald-400 font-bold">{tp}</span>;
                    return tp;
                })}
            </span>
        );
    });
  };

  const extractTimeFromStep = (text: string): number => {
    if (!text) return 0;
    const match = text.match(/(\d+)\s*(?:minutos|minuto|min|m)\b/i);
    if (match && match[1]) return parseInt(match[1]) * 60;
    return 0;
  };

  useEffect(() => {
    if (cookingMode && !isFinished) {
      const instruction = recipe.instructions[currentStep] || "";
      const seconds = extractTimeFromStep(instruction);
      setTimerDuration(seconds);
      setTimeLeft(seconds);
      setIsTimerRunning(false);
    }
  }, [currentStep, cookingMode]);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(p => p - 1), 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const ptVoice = availableVoices.find(v => v.lang === 'pt-BR') || availableVoices[0];
      setVoice(ptVoice);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    if (!cookingMode || isFinished) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [cookingMode, isFinished]);

  useEffect(() => {
    if (cookingMode && !isFinished) {
      const timer = setTimeout(() => speakStep(currentStep), 500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, cookingMode, isFinished]);

  useEffect(() => {
    let recognition: any = null;
    if (cookingMode && !isFinished) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.lang = 'pt-BR';
            recognition.interimResults = false;
            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => {
                if (cookingMode && !isFinished) {
                    try { recognition.start(); } catch(e) {}
                } else {
                    setIsListening(false);
                }
            };
            recognition.onresult = (event: any) => {
                const last = event.results.length - 1;
                const command = event.results[last][0].transcript.toLowerCase().trim();
                if (command.includes('próximo') || command.includes('seguinte') || command.includes('avançar')) {
                    handleNextStep();
                } else if (command.includes('voltar') || command.includes('anterior')) {
                    if (currentStep > 0) setCurrentStep(prev => prev - 1);
                } else if (command.includes('repetir') || command.includes('ler') || command.includes('fala')) {
                    speakStep(currentStep);
                } else if (command.includes('parar') || command.includes('pausar') || command.includes('quieto')) {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                }
            };
            try { recognition.start(); } catch(e) { console.error(e); }
        }
    } else {
        setIsListening(false);
    }
    return () => {
        if (recognition) recognition.stop();
    };
  }, [cookingMode, isFinished, currentStep]); 

  const speakStep = (stepIndex: number) => {
    if (isFinished) return;
    const instruction = recipe.instructions[stepIndex];
    if (!instruction) return;
    window.speechSynthesis.cancel();
    const scaled = scaleText(instruction, recipe.servings, desiredServings).replace(/\*\*/g, '');
    const u = new SpeechSynthesisUtterance(`Passo ${stepIndex + 1}. ${scaled}`);
    if (voice) u.voice = voice;
    u.rate = 1.1;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  const togglePlayPause = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      speakStep(currentStep);
    }
  };

  const handleNextStep = () => {
    if (currentStep < recipe.instructions.length - 1) setCurrentStep(p => p + 1);
    else {
        setIsFinished(true);
        window.speechSynthesis.cancel();
    }
  };

  const handleAddToList = (scaledIng: string) => {
      const cleanIng = scaledIng.replace(/\*\*/g, '');
      const { name, quantity } = parseIngredientForList(cleanIng);
      onAddToShoppingList(name, quantity);
  };

  const handleShareRecipe = () => {
    let text = `🍽️ *${recipe.title}* - Pensa Prato\n\n`;
    text += `⏱️ Tempo: ${recipe.time_minutes} min\n`;
    text += `👥 Porções: ${desiredServings}\n`;
    text += `🔥 Dificuldade: ${recipe.difficulty}\n\n`;
    text += `*Ingredientes:*\n`;
    const allIngredients = [...recipe.used_ingredients, ...recipe.missing_ingredients];
    allIngredients.forEach(ing => {
        const scaled = scaleText(ing, recipe.servings, desiredServings).replace(/\*\*/g, '');
        text += `• ${scaled}\n`;
    });
    text += `\n*Modo de Preparo:*\n`;
    recipe.instructions.forEach((step, i) => {
        const scaled = scaleText(step, recipe.servings, desiredServings).replace(/\*\*/g, '');
        text += `${i + 1}. ${scaled}\n`;
    });
    text += `\n_Encontre mais receitas no App Pensa Prato!_ 📲`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (cookingMode) {
    if (isFinished) {
        return (
            <div className="fixed inset-0 z-[100] bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 flex flex-col items-center justify-center text-white p-6 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                     {confettiParticles.map(c => (
                        <div key={c.id} className="absolute w-3 h-3 rounded-sm" style={{ top: '-10%', left: c.left, backgroundColor: c.backgroundColor, animation: `confetti-fall ${c.animationDuration} linear infinite` }} />
                     ))}
                     <style>{`@keyframes confetti-fall { 100% { transform: translateY(110vh) rotate(720deg); } }`}</style>
                </div>

                <div className="relative bg-white/10 backdrop-blur-2xl p-8 pt-12 rounded-[2.5rem] w-full max-w-sm text-center border border-white/20 shadow-2xl animate-in zoom-in-95 duration-500">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-900/50 ring-4 ring-emerald-800/50 animate-in bounce-in duration-700">
                            <CheckCircle2 className="w-12 h-12 text-white drop-shadow-md" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold mb-2 mt-4 text-white drop-shadow-sm">Delícia!</h2>
                    <p className="text-emerald-100 mb-8 text-lg font-medium">Você arrasou na cozinha.</p>
                    <div className="bg-black/20 rounded-2xl p-6 mb-8 backdrop-blur-sm">
                        <p className="text-xs font-bold text-emerald-200 uppercase tracking-widest mb-4">Avalie o prato</p>
                        <div className="flex justify-center gap-3">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button 
                                    key={s} 
                                    type="button"
                                    onClick={() => {
                                        setRating(s);
                                        onRate(s);
                                    }}
                                    className="transition-transform active:scale-90 hover:scale-110 focus:outline-none"
                                >
                                    <Star 
                                        className={`w-10 h-10 transition-all duration-300 ${
                                            rating >= s 
                                            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' 
                                            : 'text-white/20 hover:text-white/40'
                                        }`} 
                                        strokeWidth={rating >= s ? 0 : 1.5}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <button 
                            onClick={handleShareRecipe}
                            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 border border-white/10"
                        >
                            <Share2 className="w-5 h-5" />
                            Compartilhar Resultado
                        </button>
                        <button 
                            onClick={() => { 
                                setCookingMode(false); 
                                setIsFinished(false); 
                                if (onFinishCooking) onFinishCooking(); 
                            }} 
                            className="w-full bg-white text-emerald-900 hover:bg-emerald-50 font-bold py-4 rounded-xl shadow-lg transition-colors"
                        >
                            Concluir
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const progress = ((currentStep + 1) / recipe.instructions.length) * 100;
    const currentText = recipe.instructions[currentStep] || "";
    const scaledText = scaleText(currentText, recipe.servings, desiredServings);

    return (
      <div className="fixed inset-0 bg-neutral-950 z-[90] flex flex-col text-white">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
             <div className="bg-gray-800 p-2 rounded-full"><ChefHat className="w-6 h-6 text-emerald-400" /></div>
             <span className="font-bold text-gray-300">{recipe.time_minutes} min</span>
          </div>
          <div className="flex items-center gap-4">
              {isListening && (
                  <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 animate-pulse">
                      <Mic className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">Ouvindo</span>
                  </div>
              )}
              <button onClick={() => setCookingMode(false)} className="p-2 bg-gray-800 rounded-full"><X className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative">
            <p className="text-gray-500 text-sm uppercase tracking-widest mb-8">Passo {currentStep + 1} / {recipe.instructions.length}</p>
            <p className="text-3xl md:text-4xl font-medium leading-relaxed mb-10">{formatInstructionTextCookingMode(scaledText)}</p>
            {timerDuration > 0 && (
                <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 w-full max-w-md flex items-center justify-between animate-in slide-in-from-bottom-4">
                    <div className="text-left pl-2">
                        <p className={`text-[10px] uppercase font-bold mb-1 ${isTimerRunning ? 'text-emerald-400 animate-pulse' : 'text-gray-500'}`}>
                            {isTimerRunning ? 'Contando...' : (timeLeft < timerDuration ? 'Pausado' : 'Aguardando Início')}
                        </p>
                        <p className="text-4xl font-mono text-white tracking-wider">{formatTime(timeLeft)}</p>
                    </div>
                    <button 
                        onClick={() => setIsTimerRunning(!isTimerRunning)} 
                        className={`px-6 py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2 ${
                            isTimerRunning 
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                            : 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50 hover:bg-emerald-500'
                        } ${!isTimerRunning && timeLeft === timerDuration ? 'animate-pulse ring-2 ring-emerald-500/50' : ''}`}
                    >
                        {isTimerRunning ? (
                            <>
                                <Pause className="w-5 h-5 fill-current" /> Pausar
                            </>
                        ) : (
                            <>
                                <Play className="w-5 h-5 fill-current" /> {timeLeft < timerDuration ? 'Retomar' : 'Iniciar'}
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
        <div className="bg-neutral-900 p-6 pb-10 rounded-t-[2.5rem] border-t border-gray-800 flex justify-center gap-6">
            <button onClick={() => currentStep > 0 && setCurrentStep(c => c - 1)} className="p-5 bg-gray-800 rounded-2xl text-gray-400"><SkipBack className="w-6 h-6" /></button>
            <button onClick={togglePlayPause} className={`p-5 rounded-2xl ${isSpeaking ? 'bg-amber-500 text-white' : 'bg-gray-800 text-white'}`}>{isSpeaking ? <Pause className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}</button>
            <button onClick={handleNextStep} className="p-5 bg-emerald-600 rounded-2xl text-white"><SkipForward className="w-6 h-6" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className={`pt-12 pb-8 px-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden text-white ${isExplore ? 'h-80' : 'bg-emerald-600'}`}>
        
        {isExplore && recipe.image ? (
            <>
                <div className="absolute inset-0">
                    <ImageWithFallback 
                        src={recipe.image} 
                        alt={recipe.title} 
                        className="w-full h-full object-cover" 
                        fallbackIcon="chef"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30"></div>
                </div>
            </>
        ) : (
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
        )}

        <div className="flex justify-between items-center relative z-10 mb-20 md:mb-6">
            <button onClick={onBack} className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"><ArrowLeft className="w-6 h-6" /></button>
            <div className="flex gap-2">
                <button onClick={handleShareRecipe} className="p-2.5 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors">
                    <Share2 className="w-6 h-6 text-white" />
                </button>
                <button onClick={onToggleFavorite} className="p-2.5 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors">
                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-400 text-red-400' : 'text-white'}`} />
                </button>
            </div>
        </div>

        <div className="relative z-10 mt-auto">
            <div className="flex gap-2 mb-3">
                <span className="bg-emerald-800/50 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-emerald-500/30 backdrop-blur-md">{recipe.difficulty}</span>
                
                {recipe.rating && (
                    <span className="bg-emerald-800/50 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-emerald-500/30 backdrop-blur-md flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {recipe.rating}
                    </span>
                )}

                {cookingMethod && cookingMethod !== CookingMethod.ANY && (
                    <span className="bg-emerald-800/50 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex gap-1 items-center border border-emerald-500/30 backdrop-blur-md">{getMethodIcon()} {cookingMethod}</span>
                )}
            </div>
            <h1 className="text-3xl font-bold mb-4 leading-tight">{recipe.title}</h1>
            <div className="flex gap-4 text-emerald-100 text-sm font-medium">
                <span className="bg-black/30 px-3 py-1.5 rounded-xl backdrop-blur-sm flex gap-1 items-center border border-white/10"><Clock className="w-4 h-4" /> {recipe.time_minutes} min</span>
                <span className="bg-black/30 px-3 py-1.5 rounded-xl backdrop-blur-sm flex gap-1 items-center border border-white/10"><Users className="w-4 h-4" /> {desiredServings} pessoas</span>
            </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8 -mt-6 relative z-20">
        
        {/* Portion Control */}
        <div className="bg-white rounded-2xl p-4 flex justify-between border border-gray-100 shadow-lg items-center">
            <div className="flex gap-3 items-center">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Users className="w-5 h-5" /></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase">Porções</p><p className="text-sm font-bold">Ajustar receita</p></div>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-2 py-1">
                <button onClick={() => setDesiredServings(Math.max(1, desiredServings - 1))} className="p-2 text-gray-400 hover:bg-white rounded-lg"><Minus className="w-4 h-4" /></button>
                <span className="font-bold w-4 text-center">{desiredServings}</span>
                <button onClick={() => setDesiredServings(desiredServings + 1)} className="p-2 text-gray-400 hover:bg-white rounded-lg"><Plus className="w-4 h-4" /></button>
            </div>
        </div>

        {/* Ingredients Section */}
        <div>
          <h3 className="text-lg font-bold mb-4 flex gap-2 items-center">
              <ShoppingBasket className="w-5 h-5 text-emerald-600" /> 
              {isExplore ? 'Lista de Ingredientes' : 'Ingredientes'}
          </h3>
          <div className="space-y-6">
            {recipe.used_ingredients.length > 0 && (
                <ul className="space-y-3">
                    {recipe.used_ingredients.map((ing, i) => {
                        const scaled = scaleText(ing, recipe.servings, desiredServings);
                        const clean = scaled.replace(/\*\*/g, '');
                        const inList = isInShoppingList(clean);
                        return (
                            <li key={i} className={`flex justify-between gap-3 p-3 rounded-xl border ${isExplore ? 'bg-white border-gray-100' : 'bg-gray-50 border-gray-100'}`}>
                                <div className="flex gap-3">
                                    {isExplore ? (
                                        <Circle className="w-2 h-2 text-emerald-400 mt-2 flex-shrink-0 fill-current" />
                                    ) : (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    )}
                                    <span>{formatIngredientDisplay(clean)}</span>
                                </div>
                                <button onClick={() => handleAddToList(scaled)} disabled={inList} className={`p-1.5 rounded-lg ${inList ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-50 text-gray-300 hover:text-emerald-500 shadow-sm'}`}>{inList ? <Check className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}</button>
                            </li>
                        );
                    })}
                </ul>
            )}
            
            {!isExplore && recipe.missing_ingredients.length > 0 && (
                <div>
                    <p className="text-xs font-bold text-orange-400 uppercase mb-3 pl-1">Falta comprar</p>
                    <ul className="space-y-3">
                        {recipe.missing_ingredients.map((ing, i) => {
                            const scaled = scaleText(ing, recipe.servings, desiredServings);
                            const clean = scaled.replace(/\*\*/g, '');
                            const inList = isInShoppingList(clean);
                            return (
                                <li key={i} className="flex justify-between gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
                                    <div className="flex gap-3"><div className="w-5 h-5 rounded-full border-2 border-orange-300 mt-0.5 flex-shrink-0" /><span>{formatIngredientDisplay(clean)}</span></div>
                                    <button onClick={() => handleAddToList(scaled)} disabled={inList} className={`p-1.5 rounded-lg ${inList ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-orange-400 shadow-sm'}`}>{inList ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}</button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
          </div>
        </div>

        <div>
           <h3 className="text-lg font-bold mb-4 flex gap-2 items-center"><ChefHat className="w-5 h-5 text-emerald-600" /> Modo de Preparo</h3>
           <div className="space-y-6 relative pl-3">
              <div className="absolute left-[1.6rem] top-4 bottom-4 w-0.5 bg-gray-100"></div>
              {recipe.instructions.map((step, i) => (
                <div key={i} className="relative pl-8">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm ring-4 ring-white shadow-sm">{i + 1}</div>
                  <p className="text-gray-600 leading-relaxed bg-white p-4 rounded-xl shadow-sm border border-gray-100">{formatInstructionText(scaleText(step, recipe.servings, desiredServings))}</p>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-6 right-6 z-30">
        <button onClick={() => { setCurrentStep(0); setIsFinished(false); setCookingMode(true); }} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-xl flex justify-center gap-2 active:scale-95"><Play className="w-5 h-5 fill-current" /> Começar a Cozinhar</button>
      </div>
    </div>
  );
};