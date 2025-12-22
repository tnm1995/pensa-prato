
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CircularProgress } from './CircularProgress';
import { ChefHat, Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  imagePreview: string | null;
  mode?: 'analyzing' | 'recipes';
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ imagePreview, mode = 'analyzing' }) => {
  const [loadingText, setLoadingText] = useState("");

  useEffect(() => {
    let texts: string[] = [];
    
    if (mode === 'analyzing') {
        texts = [
            "O Chef está olhando sua geladeira...",
            "Identificando vegetais frescos...",
            "Verificando laticínios...",
            "Organizando itens da despensa...",
            "Quase pronto para sugerir..."
        ];
    } else {
        texts = [
            "Combinando sabores...",
            "Verificando suas restrições...",
            "Escrevendo o modo de preparo...",
            "Finalizando temperos secretos...",
            "Empratando virtualmente..."
        ];
    }

    let i = 0;
    setLoadingText(texts[0]);
    
    const interval = setInterval(() => {
      i = (i + 1) % texts.length;
      setLoadingText(texts[i]);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [mode]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFCF8] p-8 overflow-hidden">
      
      {/* Visual Feedback Container */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-72 h-72 mb-12"
      >
        {/* Decorative Circles */}
        <div className="absolute inset-0 bg-emerald-100/50 rounded-[3rem] rotate-6 animate-pulse"></div>
        <div className="absolute inset-0 bg-emerald-50 rounded-[3rem] -rotate-3"></div>

        <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white z-10 bg-white">
          {imagePreview ? (
            <>
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full object-cover opacity-60 blur-md scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent"></div>
            </>
          ) : (
              <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                  <ChefHat className="w-20 h-20 text-emerald-200" />
              </div>
          )}
          
          {/* Central Spinner */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <div className="bg-white p-6 rounded-full shadow-2xl">
                <CircularProgress size={64} color="text-emerald-600" />
             </div>
          </div>
        </div>

        {/* Floating Icons */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-4 -right-4 p-4 bg-amber-400 rounded-2xl shadow-lg z-20"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </motion.div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          {mode === 'analyzing' ? 'Chef Analisando' : 'Criando Receitas'}
        </h2>
        <div className="h-6 flex items-center justify-center">
            <p className="text-emerald-600 font-bold text-sm">
              {loadingText}
            </p>
        </div>
      </motion.div>

      <div className="absolute bottom-12 left-0 right-0 flex justify-center">
          <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-200 animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
      </div>
    </div>
  );
};
