
import React from 'react';
import { Recipe, CookingMethod } from '../types';
import { Clock, Users, Flame, ArrowLeft, ShoppingBasket, ChevronRight, Heart, CheckCircle2, Wind, ChefHat, UtensilsCrossed, Sparkles } from 'lucide-react';

interface RecipeListProps {
  recipes: Recipe[];
  onBack: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
  favorites: Recipe[];
  onToggleFavorite: (recipe: Recipe) => void;
  cookingMethod?: CookingMethod;
  isExplore?: boolean;
}

export const RecipeList: React.FC<RecipeListProps> = ({ 
  recipes, 
  onBack, 
  onSelectRecipe, 
  favorites, 
  onToggleFavorite,
  cookingMethod,
  isExplore = false
}) => {
  
  const isFavorite = (recipe: Recipe) => favorites.some(r => r.title === recipe.title);

  const getMethodInfo = (recipe: Recipe) => {
    if (cookingMethod && cookingMethod !== CookingMethod.ANY) {
        switch(cookingMethod) {
            case CookingMethod.AIRFRYER: return { label: 'AirFryer', icon: Wind, color: 'text-emerald-500' };
            case CookingMethod.STOVE: return { label: 'Fogão', icon: Flame, color: 'text-orange-500' };
            case CookingMethod.OVEN: return { label: 'Forno', icon: ChefHat, color: 'text-blue-500' };
            default: return { label: cookingMethod, icon: UtensilsCrossed, color: 'text-purple-500' };
        }
    }
    const text = (recipe.title + ' ' + recipe.tags.join(' ')).toLowerCase();
    if (text.includes('airfryer')) return { label: 'AirFryer', icon: Wind, color: 'text-emerald-500' };
    if (text.includes('forno') || text.includes('assado')) return { label: 'Forno', icon: ChefHat, color: 'text-blue-500' };
    if (text.includes('fogão') || text.includes('frigideira')) return { label: 'Fogão', icon: Flame, color: 'text-orange-500' };
    return { label: 'Cozinha', icon: UtensilsCrossed, color: 'text-gray-500' };
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center p-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full mr-2 transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{isExplore ? 'Catálogo de Receitas' : 'Sugestões do Chef'}</h1>
            <p className="text-xs text-gray-500">{isExplore ? 'Sugestões selecionadas para você' : 'Baseado na sua imagem'}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {recipes.map((recipe, idx) => {
          const fav = isFavorite(recipe);
          const methodInfo = getMethodInfo(recipe);
          
          return (
            <div 
              key={idx} 
              onClick={() => onSelectRecipe(recipe)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all active:scale-[0.99] cursor-pointer relative group overflow-hidden"
            >
              {isExplore && recipe.image && (
                 <div className="absolute top-0 right-0 w-24 h-full">
                     <div className="w-full h-full bg-gradient-to-l from-white/0 to-white absolute z-10"></div>
                     <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" />
                 </div>
              )}

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight pr-8">{recipe.title}</h3>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(recipe);
                        }}
                        className="p-2 -mt-2 -mr-2 rounded-full hover:bg-red-50 transition-colors z-20 relative"
                    >
                        <Heart 
                            className={`w-5 h-5 transition-colors ${fav ? 'fill-red-500 text-red-500' : 'text-gray-300 hover:text-red-400'}`} 
                        />
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        {recipe.time_minutes} min
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                        <Flame className={`w-3.5 h-3.5 ${recipe.difficulty === 'Fácil' ? 'text-green-500' : 'text-orange-500'}`} />
                        {recipe.difficulty}
                    </div>
                    {!isExplore && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                            <methodInfo.icon className={`w-3.5 h-3.5 ${methodInfo.color}`} />
                            {methodInfo.label}
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        {recipe.servings}
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-1">
                    <div className="flex items-center gap-3 text-xs">
                        {isExplore ? (
                             <span className="text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-purple-500" /> 
                                {recipe.used_ingredients.length + recipe.missing_ingredients.length} ingredientes
                            </span>
                        ) : (
                            <>
                                <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> {recipe.used_ingredients.length} tem
                                </span>
                                {recipe.missing_ingredients.length > 0 ? (
                                    <span className="text-orange-700 font-medium bg-orange-50 px-2 py-0.5 rounded flex items-center gap-1">
                                        <ShoppingBasket className="w-3 h-3" /> {recipe.missing_ingredients.length} falta
                                    </span>
                                ) : (
                                    <span className="text-emerald-600 font-bold text-[10px] uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded">Completa</span>
                                )}
                            </>
                        )}
                    </div>
                    <div className="p-1.5 bg-gray-50 rounded-full text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
