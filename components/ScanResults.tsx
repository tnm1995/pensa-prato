
import React, { useState, useMemo } from 'react';
import { ScanResult } from '../types';
import { commonIngredients } from '../data/ingredients';
import { Check, Plus, X, ChefHat, Search, Trash2, ChevronRight, ShoppingBasket, ScanLine, ArrowLeft } from 'lucide-react';

interface ScanResultsProps {
  result: ScanResult;
  onFindRecipes: (confirmedIngredients: string[]) => void;
  onRetake: () => void;
}

export const ScanResults: React.FC<ScanResultsProps> = ({ result, onFindRecipes, onRetake }) => {
  // Initialize with high confidence items first, or all if user prefers
  const [ingredients, setIngredients] = useState<string[]>(
    result.ingredients.map(i => i.name)
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter suggestions based on search term and exclude already selected ingredients
  const suggestions = useMemo(() => {
    if (searchTerm.length < 2) return [];
    return commonIngredients
      .filter(item => 
        item.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !ingredients.includes(item)
      )
      .slice(0, 5); // Limit to 5 suggestions
  }, [searchTerm, ingredients]);

  const handleAddIngredient = (name: string) => {
    if (!ingredients.includes(name)) {
      setIngredients([...ingredients, name]);
    }
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm) {
        // Allow adding custom ingredients not in the list
        handleAddIngredient(searchTerm);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative pb-32">
      
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-50 to-transparent -z-10"></div>

      {/* Header */}
      <div className="pt-8 px-6 pb-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Confira a lista</h1>
            <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                {ingredients.length} itens
            </div>
        </div>
        <p className="text-sm text-gray-500">
          O Chef identificou estes alimentos. Adicione o que faltou ou remova erros.
        </p>
      </div>

      <div className="px-6 max-w-md mx-auto space-y-6">
        
        {/* Search / Add Bar */}
        <div className="relative z-20">
            <div className="bg-white p-1.5 rounded-2xl shadow-lg shadow-gray-200/50 flex items-center gap-2 border border-gray-100 focus-within:border-emerald-300 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                <div className="p-2 bg-gray-50 rounded-xl text-gray-400">
                    <Search className="w-5 h-5" />
                </div>
                <input 
                    type="text"
                    placeholder="Adicionar ingrediente manual..."
                    className="flex-1 outline-none bg-transparent text-gray-800 placeholder-gray-400 py-2 text-sm font-medium"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
                    onKeyDown={handleKeyDown}
                />
                <button 
                    onClick={() => searchTerm && handleAddIngredient(searchTerm)}
                    disabled={!searchTerm}
                    className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-200"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-30">
                    {suggestions.map((item) => (
                        <button
                            key={item}
                            className="w-full text-left px-4 py-3 hover:bg-emerald-50 text-gray-700 border-b border-gray-50 last:border-0 flex justify-between items-center bg-white transition-colors group"
                            onClick={() => handleAddIngredient(item)}
                        >
                            <span className="capitalize font-medium">{item}</span>
                            <Plus className="w-4 h-4 text-gray-300 group-hover:text-emerald-500" />
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* Ingredients List */}
        <div className="space-y-3">
            {ingredients.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center opacity-60">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <ShoppingBasket className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Sua lista está vazia.</p>
                    <p className="text-xs text-gray-400 mt-1">Adicione ingredientes acima.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-2">
                    {ingredients.map((item, idx) => (
                        <div 
                            key={idx} 
                            className="group flex items-center justify-between p-3 pl-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300 animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                <span className="text-gray-700 font-medium capitalize text-base">{item}</span>
                            </div>
                            <button 
                                onClick={() => handleRemoveIngredient(idx)}
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            {ingredients.length > 0 && (
                <div className="flex justify-center pt-4">
                    <button 
                        onClick={() => setIngredients([])}
                        className="text-xs text-red-400 hover:text-red-600 font-medium px-4 py-2 hover:bg-red-50 rounded-full transition-colors"
                    >
                        Limpar lista inteira
                    </button>
                </div>
            )}
        </div>

        {/* Action Buttons - Inline Flow */}
        <div className="pt-4 flex gap-3">
            <button 
                onClick={onRetake}
                className="flex-1 py-4 rounded-2xl font-bold text-gray-600 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                Voltar
            </button>
            <button 
                onClick={() => onFindRecipes(ingredients)}
                disabled={ingredients.length === 0}
                className="flex-[2] py-4 rounded-2xl font-bold text-white bg-emerald-600 shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-sm"
            >
                <ChefHat className="w-5 h-5" />
                Gerar Receitas
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );
};
