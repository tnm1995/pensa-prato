
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  Check, 
  MessageCircle, 
  Pencil, 
  X,
  MoreVertical
} from 'lucide-react';
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState('');

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const value = e.target.value;
    if (/^[\d\/.,a-zA-Z\s]*$/.test(value)) {
        setter(value);
    }
  };

  const handleAdd = () => {
    if (newItemName.trim()) {
      let formattedQuantity = newItemQuantity.trim();
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
    setMenuOpenId(null);
    setEditName(item.name);
    setEditQuantity(item.quantity ? item.quantity : '');
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
        let formattedQuantity = editQuantity.trim();
        if (/^\d+$/.test(formattedQuantity)) {
            formattedQuantity = `${formattedQuantity}x`;
        }
        onEditItem(editingId, editName, formattedQuantity);
        setEditingId(null);
    }
  };

  const handleExportWhatsApp = () => {
    const activeItems = items.filter(i => !i.checked);
    if (activeItems.length === 0 && items.length > 0) {
        alert("Todos os itens já foram marcados como comprados!");
        return;
    }
    
    let text = `🛒 *MINHA LISTA DE COMPRAS* - Pensa Prato\n\n`;
    activeItems.forEach(item => {
        text += `• ${item.quantity ? `*(${item.quantity})* ` : ''}${item.name}\n`;
    });
    text += `\n_Gerado por Pensa Prato 🍳_`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const activeItems = items.filter(i => !i.checked);
  const checkedItems = items.filter(i => i.checked);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-32 flex flex-col font-['Sora']">
      <div className="bg-white shadow-sm pt-6 px-6 pb-6 sticky top-0 z-40 border-b border-stone-200">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2.5 bg-stone-100 hover:bg-stone-200 rounded-2xl transition-all">
                    <ArrowLeft className="w-5 h-5 text-stone-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-stone-900 leading-tight tracking-tight">Lista</h1>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{items.length} itens totais</p>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <button 
                    onClick={handleExportWhatsApp}
                    className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all"
                    title="Enviar no WhatsApp"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
                <button 
                    onClick={onClearList}
                    className="p-3 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                    title="Limpar tudo"
                >
                    <Trash2 className="w-6 h-6" />
                </button>
            </div>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-lg mx-auto w-full">
        
        <div className="flex gap-2 mb-10 items-stretch">
          <div className="flex-1 bg-white flex items-center pl-4 pr-2 rounded-[1.5rem] border-2 border-stone-200 shadow-sm focus-within:border-emerald-500 transition-all overflow-hidden">
            <input 
              type="text"
              value={newItemQuantity}
              onChange={(e) => handleQuantityChange(e, setNewItemQuantity)}
              placeholder="Qtd"
              className="w-16 py-4 bg-transparent outline-none text-emerald-600 placeholder-stone-300 font-black text-center border-r border-stone-100 mr-2 text-sm"
            />
            <input 
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="O que falta comprar?"
              className="flex-1 py-4 bg-transparent outline-none text-stone-800 placeholder-stone-300 font-bold text-base"
            />
          </div>
          
          <button 
            onClick={handleAdd}
            disabled={!newItemName.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 text-white px-6 rounded-[1.5rem] shadow-lg shadow-emerald-100 transition-all active:scale-95 flex-shrink-0"
          >
            <Plus className="w-7 h-7 stroke-[3px]" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 opacity-40">
            <ShoppingCart className="w-16 h-16 text-stone-300 mb-4" />
            <h3 className="text-xl font-black text-stone-800">Sua lista está vazia</h3>
          </div>
        ) : (
          <div className="space-y-10">
            
            {activeItems.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-6 pl-1">Itens Pendentes ({activeItems.length})</h4>
                {activeItems.map((item) => {
                  const isEditing = editingId === item.id;
                  const isMenuOpen = menuOpenId === item.id;
                  
                  return (
                    <div 
                        key={item.id}
                        className={`relative flex items-center bg-white p-3 px-4 rounded-[2rem] shadow-sm border-2 transition-all duration-300 ${isEditing ? 'border-emerald-500 scale-[1.02]' : 'border-stone-100 hover:border-stone-200'}`}
                    >
                        {isEditing ? (
                            <div className="flex-1 flex items-center gap-2">
                                <input 
                                    type="text"
                                    value={editQuantity}
                                    onChange={(e) => handleQuantityChange(e, setEditQuantity)}
                                    className="w-16 p-3 bg-stone-50 rounded-xl text-center font-black text-emerald-600 outline-none text-sm"
                                    autoFocus
                                />
                                <input 
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                    className="flex-1 p-3 bg-stone-50 rounded-xl outline-none font-bold text-stone-800 text-sm"
                                />
                                <button onClick={saveEdit} className="p-3 bg-emerald-600 text-white rounded-xl shadow-md"><Check className="w-5 h-5 stroke-[3px]" /></button>
                                <button onClick={() => setEditingId(null)} className="p-3 bg-stone-100 text-stone-400 rounded-xl"><X className="w-5 h-5" /></button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => onToggleItem(item.id)}
                                    className="w-7 h-7 rounded-full border-4 border-stone-100 hover:border-emerald-200 mr-4 flex items-center justify-center transition-all bg-white shadow-inner shrink-0 active:scale-90"
                                />
                                
                                <div className="flex-1 flex items-center gap-2.5 min-w-0 mr-2">
                                    {item.quantity && (
                                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 whitespace-nowrap">
                                            {item.quantity}
                                        </span>
                                    )}
                                    <span className="font-extrabold text-stone-800 text-base truncate capitalize tracking-tight">
                                        {item.name}
                                    </span>
                                </div>

                                <div className="relative">
                                    <button 
                                        onClick={() => setMenuOpenId(isMenuOpen ? null : item.id)}
                                        className={`p-2 rounded-xl transition-all ${isMenuOpen ? 'bg-stone-100 text-stone-900' : 'text-stone-300 hover:text-stone-500'}`}
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>

                                    {isMenuOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-2xl shadow-xl border border-stone-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            <button 
                                                onClick={() => startEditing(item)}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 text-stone-600 transition-colors"
                                            >
                                                <Pencil className="w-4 h-4 text-emerald-500" />
                                                <span className="text-xs font-bold">Editar</span>
                                            </button>
                                            <button 
                                                onClick={() => { onRemoveItem(item.id); setMenuOpenId(null); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-rose-50 text-rose-600 transition-colors border-t border-stone-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span className="text-xs font-bold">Excluir</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                  );
                })}
              </div>
            )}

            {checkedItems.length > 0 && (
              <div className="pt-6 border-t border-stone-200 animate-in slide-in-from-bottom-4">
                <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-[0.3em] mb-4 pl-1">
                  Comprados ({checkedItems.length})
                </h4>
                <div className="space-y-2 opacity-40 grayscale">
                  {checkedItems.map((item) => (
                     <div 
                      key={item.id}
                      className="flex items-center p-3 px-4 rounded-[1.5rem] border border-transparent hover:bg-stone-50 transition-all group"
                    >
                      <button
                        onClick={() => onToggleItem(item.id)}
                        className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white transition-all shrink-0 shadow-lg shadow-emerald-100"
                      >
                        <Check className="w-4 h-4 stroke-[3px]" />
                      </button>
                      <div className="flex-1 min-w-0 mx-4">
                        <span className="text-sm font-bold text-stone-500 line-through decoration-stone-400 decoration-2 truncate block">
                            {item.quantity && <span className="mr-1.5 font-black">[{item.quantity}]</span>}
                            {item.name}
                        </span>
                      </div>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-300 hover:text-rose-500 p-2 transition-all"
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
      
      {/* Clique fora para fechar o menu */}
      {menuOpenId && (
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpenId(null)}></div>
      )}
    </div>
  );
};
