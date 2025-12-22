
import React from 'react';
import { Home, Heart, User, ChefHat, ShoppingCart } from 'lucide-react';
import { AppView } from '../types';

interface BottomMenuProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const BottomMenu: React.FC<BottomMenuProps> = ({ currentView, onNavigate }) => {
  
  const isHomeActive = [
    AppView.WELCOME, 
    AppView.FAMILY_SELECTION, 
    AppView.COOKING_METHOD, 
    AppView.UPLOAD, 
    AppView.RESULTS, 
    AppView.RECIPES
  ].includes(currentView);

  const isShoppingActive = currentView === AppView.SHOPPING_LIST;
  const isFavoritesActive = currentView === AppView.FAVORITES;
  const isProfileActive = currentView === AppView.PROFILE;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 pb-5 z-40 flex justify-around items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      
      <button 
        onClick={() => onNavigate(AppView.UPLOAD)}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[4rem] ${
          isHomeActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <div className={`p-1 rounded-full ${isHomeActive ? 'bg-emerald-50' : 'bg-transparent'}`}>
            {isHomeActive ? <ChefHat className="w-6 h-6" /> : <Home className="w-6 h-6" />}
        </div>
        <span className="text-[10px] font-bold">Início</span>
      </button>

      <button 
        onClick={() => onNavigate(AppView.SHOPPING_LIST)}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[4rem] ${
          isShoppingActive ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'
        }`}
      >
        <div className={`p-1 rounded-full ${isShoppingActive ? 'bg-orange-50' : 'bg-transparent'}`}>
            <ShoppingCart className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-bold">Lista</span>
      </button>

      <button 
        onClick={() => onNavigate(AppView.FAVORITES)}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[4rem] ${
          isFavoritesActive ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
        }`}
      >
        <div className={`p-1 rounded-full ${isFavoritesActive ? 'bg-red-50' : 'bg-transparent'}`}>
            <Heart className={`w-6 h-6 ${isFavoritesActive ? 'fill-current' : ''}`} />
        </div>
        <span className="text-[10px] font-bold">Favoritos</span>
      </button>

      <button 
        onClick={() => onNavigate(AppView.PROFILE)}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[4rem] ${
          isProfileActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <div className={`p-1 rounded-full ${isProfileActive ? 'bg-emerald-50' : 'bg-transparent'}`}>
            <User className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-bold">Perfil</span>
      </button>

    </div>
  );
};
