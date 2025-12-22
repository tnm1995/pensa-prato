
import React, { useEffect, useState } from 'react';
import { CircularProgress } from './CircularProgress';

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
            "Identificando vegetais...",
            "Verificando laticínios...",
            "Analisando garrafas e potes...",
            "Organizando ingredientes..."
        ];
    } else {
        texts = [
            "O Chef está pensando...",
            "Combinando ingredientes...",
            "Verificando restrições alimentares...",
            "Escrevendo o modo de preparo...",
            "Ajustando tempos de cozimento..."
        ];
    }

    let i = 0;
    setLoadingText(texts[0]);
    
    const interval = setInterval(() => {
      i = (i + 1) % texts.length;
      setLoadingText(texts[i]);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [mode]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <div className="relative w-64 h-64 mb-8 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
        {imagePreview ? (
          <>
            <img 
              src={imagePreview} 
              alt="Fridge Preview" 
              className="w-full h-full object-cover opacity-50 blur-sm scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent"></div>
          </>
        ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                {/* Placeholder if no image in recipe mode */}
            </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg">
             <CircularProgress size={60} color="text-emerald-600" />
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-2 animate-pulse">
        {mode === 'analyzing' ? 'Processando Imagem' : 'Preparando Receitas'}
      </h2>
      <p className="text-emerald-600 font-medium text-center">
        {loadingText}
      </p>
    </div>
  );
};