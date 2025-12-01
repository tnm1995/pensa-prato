
import React from 'react';
import { ChefHat, Sparkles } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 48 }) => {
  const uniqueId = `logo-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id={uniqueId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C853" />
            <stop offset="100%" stopColor="#69F0AE" />
          </linearGradient>
          <filter id={`${uniqueId}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
          </filter>
        </defs>
      </svg>

      {/* Círculo de Fundo (Simulado visualmente ou com SVG) */}
      <div 
        className="absolute inset-0 bg-white rounded-full shadow-md flex items-center justify-center"
        style={{ 
            boxShadow: '0 4px 12px rgba(0, 200, 83, 0.15)' 
        }}
      >
        <div className="relative flex items-center justify-center">
            {/* Ícone Principal: Chef Hat (Representando o App que pensa o prato) */}
            <ChefHat 
                size={size * 0.55} 
                stroke={`url(#${uniqueId})`}
                strokeWidth={2.5}
                className="relative z-10"
            />
            
            {/* Ícone Secundário: Sparkles (Representando a IA/Mágica) */}
            <Sparkles 
                size={size * 0.25}
                stroke={`url(#${uniqueId})`}
                strokeWidth={2.5}
                className="absolute -top-1 -right-3 z-20 animate-pulse"
                fill="white"
            />
        </div>
      </div>
    </div>
  );
};