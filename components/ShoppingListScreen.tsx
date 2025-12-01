
import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, ShoppingCart, Check, MessageCircle, Pencil, X } from 'lucide-react';
import { ShoppingItem } from '../types';

interface ShoppingListScreenProps {
  items: ShoppingItem[];
  onAddItem: (name: string, quantity?: string) => void;
  onToggleItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onEditItem: (id: string, name: string, quantity: string) => void;
  onClearList: () => void;
  onBack: () => void;
}

export const ShoppingListScreen: React.FC<ShoppingListScreenProps> = ({ 
  items, 
  onAddItem, 
  onToggleItem, 
  onRemoveItem, 
  onEditItem,
  onClearList, 
  onBack 
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');

  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState('');

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const value = e.target.value;
    // Allow numbers, slash (for fractions), dots, commas
    if (/^[\d\/.,a-zA-Z\s]*$/.test(value)) {
        setter(value);
    }
  };

  const handleAdd = () => {
    if (newItemName.trim()) {
      let formattedQuantity = newItemQuantity.trim();
      // Only append 'x' if it's purely digits. Fractions like "1/2" should stay "1/2".
      if (/^\d+$/.test(formattedQuantity)) {
          formattedQuantity = `${formattedQuantity}x`;
      }
      
      onAddItem(newItemName, formattedQuantity);
      setNewItemName('');
      setNewItemQuantity('');
    }
  };

  const startEditing = (item: ShoppingItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditQuantity(item.quantity ? item.quantity.replace('x', '') : '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditQuantity('');
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
        let formattedQuantity = editQuantity.trim();
        // Only append 'x' if it's purely digits
        if (/^\d+$/.test(formattedQuantity)) {
            formattedQuantity = `${formattedQuantity}x`;
        }
        onEditItem(editingId, editName, formattedQuantity);
        cancelEditing();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  const handleExportWhatsApp = () => {
    const activeItems = (items || []).filter(i => !i.checked);
    const checkedItems = (items || []).filter(i => i.checked);
    
    let text = `🛒 *LISTA DE COMPRAS* - Pensa Prato\n\n`;

    if (activeItems.length > 0) {
        text += `*Falta Comprar:*\n`;
        activeItems.forEach(item => {
            text += `[ ] ${item.quantity ? `_${item.quantity}_ ` : ''}*${item.name}*\n`;
        });
    }

    if (checkedItems.length > 0) {
        text += `\n*Já Peguei:*\n`;
        checkedItems.forEach(item => {
            text += `[x] ~${item.quantity ? `${item.quantity} ` : ''}${item.name}~\n`;
        });
    }

    if ((items || []).length === 0) {
        text += `Minha lista está vazia!`;
    }

    text += `\n_Gerado pelo App Pensa Prato_ 🍳`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Prevent crash if items is undefined initially
  const activeItems = (items || []).filter(i => !i.checked);
  const checkedItems = (items || []).filter(i => i.checked);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex flex-col">
      <div className="bg-white shadow-sm pt-4 px-6 pb-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Lista</h1>
            </div>
            
            <div className="flex items-center gap-2">
                <button 
                    onClick={handleExportWhatsApp}
                    className="p-2 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 sm:pr-3"
                    title="Enviar no WhatsApp"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-xs font-bold hidden sm:inline">WhatsApp</span>
                </button>
                <button 
                    onClick={onClearList}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Limpar tudo"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-lg mx-auto w-full">
        
        <div className="flex gap-2 mb-8 items-stretch">
          <div className="flex-1 bg-white flex items-center pl-3 pr-2 rounded-2xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-emerald-100 focus-within:border-emerald-400 transition-all overflow-hidden">
            <Plus className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
            
            <input 
              type="text"
              value={newItemQuantity}
              onChange={(e) => handleQuantityChange(e, setNewItemQuantity)}
              onKeyDown={(e) => handleKeyDown(e, handleAdd)}
              placeholder="Qtd"
              className="w-16 py-4 bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium text-center border-r border-gray-100 mr-2"
            />
            
            <input 
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, handleAdd)}
              placeholder="Nome do item..."
              className="flex-1 py-4 bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium min-w-0"
            />
          </div>
          
          <button 
            onClick={handleAdd}
            disabled={!newItemName.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-95 flex-shrink-0"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {activeItems.length === 0 && checkedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
               <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Sua lista está vazia</h3>
            <p className="text-sm text-gray-500 text-center max-w-[200px] mt-2">
              Adicione itens manualmente ou direto das receitas.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {activeItems.length > 0 && (
              <div className="space-y-3">
                {activeItems.map((item) => {
                  const isEditing = editingId === item.id;
                  
                  return (
                    <div 
                        key={item.id}
                        className={`flex items-center bg-white p-3 rounded-2xl shadow-sm border border-gray-100 group animate-in slide-in-from-bottom-2 duration-300 ${isEditing ? 'ring-2 ring-emerald-200' : ''}`}
                    >
                        {isEditing ? (
                            <div className="flex-1 flex items-center gap-2">
                                <input 
                                    type="text"
                                    value={editQuantity}
                                    onChange={(e) => handleQuantityChange(e, setEditQuantity)}
                                    placeholder="Qtd"
                                    className="w-12 p-2 bg-gray-50 rounded-lg text-center font-bold text-emerald-600 outline-none focus:ring-1 focus:ring-emerald-300"
                                    autoFocus
                                />
                                <input 
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, saveEdit)}
                                    placeholder="Nome do item"
                                    className="flex-1 p-2 bg-gray-50 rounded-lg outline-none focus:ring-1 focus:ring-emerald-300"
                                />
                                <button onClick={saveEdit} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                    <Check className="w-4 h-4" />
                                </button>
                                <button onClick={cancelEditing} className="p-2 bg-gray-100 text-gray-500 rounded-lg">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                onClick={() => onToggleItem(item.id)}
                                className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-emerald-500 mr-4 flex items-center justify-center transition-colors flex-shrink-0"
                                >
                                </button>
                                <div className="flex-1 min-w-0">
                                    <span className="font-medium text-gray-800 block truncate">
                                        {item.quantity && <span className="text-emerald-600 font-bold mr-1">{item.quantity}</span>}
                                        {item.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => startEditing(item)}
                                        className="text-gray-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors p-2"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => onRemoveItem(item.id)}
                                        className="text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors p-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                  );
                })}
              </div>
            )}

            {checkedItems.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pl-2">
                  Comprados ({checkedItems.length})
                </h4>
                <div className="space-y-3 opacity-60">
                  {checkedItems.map((item) => (
                     <div 
                      key={item.id}
                      className="flex items-center bg-gray-50 p-3 rounded-2xl border border-transparent group"
                    >
                      <button
                        onClick={() => onToggleItem(item.id)}
                        className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-emerald-500 mr-4 flex items-center justify-center text-white transition-colors flex-shrink-0"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <span className="flex-1 font-medium text-gray-500 line-through decoration-gray-400 decoration-2 truncate">
                          {item.quantity && <span className="mr-1">{item.quantity}</span>}
                          {item.name}
                      </span>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1 ml-2 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};
