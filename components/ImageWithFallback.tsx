import React, { useState } from 'react';
import { ChefHat, ImageOff } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  fallbackIcon?: 'chef' | 'error';
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  alt, 
  className, 
  fallbackText,
  fallbackIcon = 'chef',
  ...props 
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 text-gray-400 ${className}`}>
        {fallbackIcon === 'chef' ? (
          <ChefHat className="w-1/3 h-1/3 mb-2 opacity-20" />
        ) : (
          <ImageOff className="w-1/3 h-1/3 mb-2 opacity-20" />
        )}
        {fallbackText && (
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">{fallbackText}</span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
        {loading && (
             <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setLoading(false)}
            onError={() => {
                setLoading(false);
                setError(true);
            }}
            {...props}
        />
    </div>
  );
};