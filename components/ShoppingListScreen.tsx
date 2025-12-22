
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
  Drumstick,
  Egg,
  Milk,
  Apple,
  Droplets,
  Zap,
  Info,
  Package,
  GlassWater
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
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState('');

  const getItemCategory = (name: string) => {
      const n = name.toLowerCase();
      if (n.includes('carne') || n.includes('frango') || n.includes('bacon') || n.includes('calabresa') || n.includes('presunto') || n.includes('costelinha') || n.includes('lombo') || n.includes('tender')) 
          return { icon: Drumstick, color: 'text-rose-500', bg: 'bg-rose-50' };
      if (n.includes('ovo')) 
          return { icon: Egg, color: 'text-amber-500', bg: 'bg-amber-50' };
      if (n.includes('leite') || n.includes('queijo') || n.includes('creme') || n.includes('iogurte') || n.includes('manteiga') || n.includes('requeijão') || n.includes('mussarela') || n.includes('parmesão')) 
          return { icon: Milk, color: 'text-blue-500', bg: 'bg-blue-50' };
      if (n.includes('cebola') || n.includes('tomate') || n.includes('batata') || n.includes('cenoura') || n.includes('abobrinha') || n.includes('pimentão') || n.includes('alface') || n.includes('fruta') || n.includes('maçã')) 
          return { icon: Apple, color: 'text-emerald-500', bg: 'bg-emerald-50' };
      if (n.includes('azeite') || n.includes('oleo') || n.includes('vinagre') || n.includes('shoyu') || n.includes('agua') || n.includes('suco')) 
          return { icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-50' };
      if (n.includes('sal') || n.includes('pimenta') || n.includes('açúcar') || n.includes('tempero') || n.includes('oregano') || n.includes('canela')) 
          return { icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50' };
      if (n.includes('farinha') || n.includes('macarrão') || n.includes('arroz') || n.includes('feijão') || n.includes('biscoito') || n.includes('pão')) 
          return { icon: Package, color: 'text-orange-500', bg: 'bg-orange-50' };
      return { icon: ShoppingCart, color: 'text-stone-400', bg: 'bg-stone-50' };
  };

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
    setEditName(item.name);
    setEditQuantity(item.quantity ? item.quantity.replace('x', '') : '');
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
    <div className="min-h-screen bg-[#FDFCF8] pb-32 flex flex-col font-['Sora']">
      <div className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] pt-6 px-6 pb-6 sticky top-0 z-40 rounded-b-[2.5rem] border-b border-stone-100">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-3 bg-stone-50 hover:bg-stone-100 rounded-2xl transition-all">
                    <ArrowLeft className="w-5 h-5 text-stone-600" />
                </button>
                <div>
                    <h1 className="text-xl font-black text-stone-900 leading-tight">Lista de Compras</h1>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{items.length} itens no total</p>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <button 
                    onClick={handleExportWhatsApp}
                    className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-100 transition-all flex items-center justify-center gap-2 shadow-sm border border-emerald-100"
                    title="Enviar no WhatsApp"
                >
                    <MessageCircle className="w-5 h-5" />
                </button>
                <button 
                    onClick={onClearList}
                    className="p-3 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-2xl transition-all shadow-sm border border-rose-100"
                    title="Limpar tudo"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-lg mx-auto w-full">
        
        {/* INPUT DE ADICIONAR */}
        <div className="flex gap-2 mb-10 items-stretch">
          <div className="flex-1 bg-white flex items-center pl-4 pr-2 rounded-[1.5rem] border border-stone-200 shadow-sm focus-within:ring-4 focus-within:ring-emerald-50 focus-within:border-emerald-400 transition-all overflow-hidden group">
            <input 
              type="text"
              value={newItemQuantity}
              onChange={(e) => handleQuantityChange(e, setNewItemQuantity)}
              placeholder="Qtd"
              className="w-14 py-4 bg-transparent outline-none text-stone-800 placeholder-stone-300 font-black text-center border-r border-stone-100 mr-2 text-sm"
            />
            <input 
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="O que falta comprar?"
              className="flex-1 py-4 bg-transparent outline-none text-stone-800 placeholder-stone-300 font-bold text-sm"
            />
          </div>
          
          <button 
            onClick={handleAdd}
            disabled={!newItemName.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 disabled:grayscale text-white px-5 rounded-[1.5rem] shadow-lg shadow-emerald-200 transition-all active:scale-95 flex-shrink-0"
          >
            <Plus className="w-6 h-6 stroke-[3px]" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
            <div className="w-28 h-28 bg-stone-100 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner rotate-3">
               <ShoppingCart className="w-12 h-12 text-stone-300" />
            </div>
            <h3 className="text-xl font-black text-stone-800">Geladeira Vazia?</h3>
            <p className="text-sm text-stone-400 text-center max-w-[220px] mt-2 font-medium leading-relaxed">
              Sua lista está vazia. Adicione itens ou deixe o Chef IA sugerir o que falta!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {activeItems.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-4 pl-1">Para Comprar ({activeItems.length})</h4>
                {activeItems.map((item) => {
                  const isEditing = editingId === item.id;
                  const cat = getItemCategory(item.name);
                  const Icon = cat.icon;
                  
                  return (
                    <div 
                        key={item.id}
                        className={`flex items-center bg-white p-3.5 rounded-[2rem] shadow-sm border transition-all duration-300 ${isEditing ? 'border-emerald-300 ring-4 ring-emerald-50 scale-[1.02]' : 'border-stone-100 hover:border-emerald-200 hover:shadow-md'}`}
                    >
                        {isEditing ? (
                            <div className="flex-1 flex items-center gap-2">
                                <input 
                                    type="text"
                                    value={editQuantity}
                                    onChange={(e) => handleQuantityChange(e, setEditQuantity)}
                                    className="w-12 p-2 bg-stone-50 rounded-xl text-center font-black text-emerald-600 outline-none text-xs"
                                    autoFocus
                                />
                                <input 
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                    className="flex-1 p-2 bg-stone-50 rounded-xl outline-none font-bold text-stone-800 text-sm"
                                />
                                <button onClick={saveEdit} className="p-2 bg-emerald-600 text-white rounded-xl shadow-md"><Check className="w-4 h-4 stroke-[3px]" /></button>
                                <button onClick={() => setEditingId(null)} className="p-2 bg-stone-100 text-stone-400 rounded-xl"><X className="w-4 h-4" /></button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => onToggleItem(item.id)}
                                    className="w-7 h-7 rounded-full border-2 border-stone-200 hover:border-emerald-500 mr-4 flex items-center justify-center transition-all bg-white shadow-sm shrink-0 active:scale-90"
                                />
                                
                                <div className="flex-1 flex items-center gap-3 min-w-0 mr-2">
                                    <div className={`p-2.5 rounded-2xl shrink-0 ${cat.bg} ${cat.color} shadow-sm`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center flex-wrap gap-x-2">
                                            {item.quantity && (
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border shadow-sm ${cat.bg} ${cat.color} border-current/10`}>
                                                    {item.quantity}
                                                </span>
                                            )}
                                            <span className="font-extrabold text-stone-800 text-sm truncate capitalize">
                                                {item.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => startEditing(item)}
                                        className="text-stone-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl p-2 transition-all active:scale-90"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => onRemoveItem(item.id)}
                                        className="text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl p-2 transition-all active:scale-90"
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
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-4 pl-1">
                  Já no Carrinho ({checkedItems.length})
                </h4>
                <div className="space-y-2 opacity-50 grayscale">
                  {checkedItems.map((item) => (
                     <div 
                      key={item.id}
                      className="flex items-center bg-stone-50/50 p-3 rounded-[1.5rem] border border-transparent group"
                    >
                      <button
                        onClick={() => onToggleItem(item.id)}
                        className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-emerald-500 mr-4 flex items-center justify-center text-white transition-all shrink-0 shadow-lg shadow-emerald-100"
                      >
                        <Check className="w-4 h-4 stroke-[3px]" />
                      </button>
                      <div className="flex-1 min-w-0 mr-4">
                        <span className="text-sm font-bold text-stone-500 line-through decoration-stone-400 decoration-2 truncate block">
                            {item.quantity && <span className="mr-1">({item.quantity})</span>}
                            {item.name}
                        </span>
                      </div>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-300 hover:text-rose-500 transition-all p-2"
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
