
import React from 'react';
import { Check, Star, Lock, X, Zap, Crown, ExternalLink, CheckCircle2, Calendar } from 'lucide-react';
import { Logo } from './Logo';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  onBuyPack: () => void;
  context?: { type: 'general' | 'category', id?: string };
  checkoutUrlProMonthly?: string;
  checkoutUrlProAnnual?: string;
  checkoutUrlPack?: string;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubscribe, 
  onBuyPack,
  context,
  checkoutUrlProMonthly = "#",
  checkoutUrlProAnnual = "#",
  checkoutUrlPack = "#"
}) => {
  if (!isOpen) return null;

  const isCategoryContext = context?.type === 'category' && context.id;

  const handleOpenCheckout = (url: string) => {
      window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header Image/Gradient */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-400 rounded-full blur-3xl opacity-30"></div>
            
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-5 h-5" />
            </button>

            <div className="relative z-10 flex flex-col items-center">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-4 shadow-lg ring-1 ring-white/30">
                    <Crown className="w-8 h-8 text-yellow-300 fill-yellow-300" />
                </div>
                <h2 className="text-2xl font-bold mb-1">
                    {isCategoryContext ? 'Desbloqueie esta Coleção' : 'Limite Gratuito Atingido'}
                </h2>
                <p className="text-emerald-100 text-sm font-medium opacity-90">
                    {isCategoryContext 
                        ? `Acesse todas as receitas de "${context.id}" e muito mais.` 
                        : 'Você usou seus 3 scans gratuitos. Torne-se Pro para continuar criando!'}
                </p>
            </div>
        </div>

        <div className="p-6 space-y-4">
            
            {/* Option 1: PRO Subscription */}
            <div className="space-y-3">
                <div className="bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm">
                            <Zap className="w-5 h-5 text-white fill-current" />
                        </div>
                        <div>
                            <h3 className="font-bold text-emerald-900 text-sm">Pensa Prato PRO</h3>
                            <p className="text-xs text-emerald-700 leading-tight">Scans ilimitados + Todas as categorias</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => handleOpenCheckout(checkoutUrlProMonthly)}
                            className="flex flex-col items-center justify-center bg-white border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 rounded-xl p-3 transition-all shadow-sm active:scale-95"
                        >
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Mensal</span>
                            <span className="text-lg font-bold text-emerald-700">R$ 19,90</span>
                        </button>

                        <button 
                            onClick={() => handleOpenCheckout(checkoutUrlProAnnual)}
                            className="relative flex flex-col items-center justify-center bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-xl p-3 transition-all shadow-md active:scale-95 text-white"
                        >
                            <div className="absolute -top-2 bg-yellow-400 text-yellow-900 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                ECONOMIZE
                            </div>
                            <span className="text-xs font-bold text-emerald-100 uppercase tracking-wide mb-1">Anual</span>
                            <span className="text-lg font-bold">R$ 199,90</span>
                        </button>
                    </div>
                </div>
                
                <button 
                    onClick={onSubscribe}
                    className="w-full text-center text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                    <CheckCircle2 className="w-3 h-3" /> Já realizei o pagamento (Liberar Acesso)
                </button>
            </div>

            {/* Separator */}
            <div className="flex items-center gap-4 py-1">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-xs font-bold text-gray-400 uppercase">Ou</span>
                <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Option 2: Single Pack (Only if category context) */}
            {isCategoryContext ? (
                <div className="space-y-2">
                    <button 
                        onClick={() => handleOpenCheckout(checkoutUrlPack)}
                        className="w-full border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all rounded-2xl p-4 flex items-center gap-4 text-left"
                    >
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                            <Lock className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-1">
                                <h3 className="font-bold text-gray-800">Comprar "{context.id}"</h3>
                                <ExternalLink className="w-3 h-3 text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-500">Acesso vitalício a esta categoria</p>
                        </div>
                        <div className="text-right">
                            <span className="block text-lg font-bold text-gray-800">R$ 4,90</span>
                            <span className="block text-[10px] text-gray-400">única vez</span>
                        </div>
                    </button>

                    <button 
                        onClick={onBuyPack}
                        className="w-full text-center text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                        <CheckCircle2 className="w-3 h-3" /> Já realizei o pagamento (Liberar Pacote)
                    </button>
                </div>
            ) : (
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Ao assinar, você desbloqueia o <strong>Chef IA ilimitado</strong>, remove anúncios e tem acesso a todas as coleções sazonais.
                    </p>
                </div>
            )}

            <p className="text-[10px] text-center text-gray-400 mt-4 px-4">
                Pagamento seguro processado externamente. O acesso é liberado após a confirmação.
            </p>
        </div>
      </div>
    </div>
  );
};
