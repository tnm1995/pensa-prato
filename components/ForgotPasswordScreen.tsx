
import React, { useState } from 'react';
import { Mail, ArrowRight, ChevronLeft, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { auth, sendPasswordResetEmail } from '../services/firebase';

interface ForgotPasswordScreenProps {
  onBack: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
        setError("Digite seu e-mail.");
        return;
    }

    setLoading(true);
    setError(null);

    try {
        await sendPasswordResetEmail(auth, email);
        setSuccess(true);
    } catch (err: any) {
        console.error(err);
        if (err.code === 'auth/user-not-found') {
            setError("E-mail não encontrado.");
        } else if (err.code === 'auth/invalid-email') {
            setError("E-mail inválido.");
        } else {
            setError("Erro ao enviar. Tente novamente.");
        }
    }
    setLoading(false);
  };

  if (success) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans p-6 animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">E-mail Enviado!</h2>
            <p className="text-gray-500 text-center max-w-xs mb-8">
                Verifique sua caixa de entrada (e spam). Enviamos um link para você redefinir sua senha.
            </p>
            <button 
                onClick={onBack}
                className="w-full max-w-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-colors"
            >
                Voltar para Login
            </button>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute top-0 left-0 w-full h-[35vh] bg-gradient-to-b from-blue-50 via-emerald-50/30 to-white pointer-events-none z-0"></div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto z-10 relative">
        
        {/* Botão Voltar */}
        <button 
            onClick={onBack}
            className="absolute top-6 left-4 p-3 text-gray-500 hover:text-emerald-600 bg-white/80 backdrop-blur-md shadow-sm border border-gray-100 rounded-full transition-all hover:scale-105 active:scale-95"
        >
            <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center mb-8 pt-10">
            <div className="inline-block p-4 bg-white rounded-full shadow-lg shadow-blue-100 mb-4 ring-1 ring-blue-50">
                <KeyRound className="w-10 h-10 text-emerald-500" />
            </div>
            <h1 className="font-bold text-3xl text-gray-900 mb-2">Recuperar Senha</h1>
            <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs mx-auto">
                Não se preocupe. Digite seu e-mail e nós ajudaremos você a voltar para a cozinha.
            </p>
        </div>

        <form onSubmit={handleResetPassword} className="w-full space-y-4">
            
            {/* Input Email */}
            <div className="relative group">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                    type="email"
                    placeholder="Seu e-mail cadastrado"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-50 rounded-2xl text-gray-800 placeholder-gray-400 outline-none transition-all font-medium"
                    required
                />
            </div>

            {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-2xl border border-red-100 flex items-center justify-center gap-2 animate-in slide-in-from-top-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all duration-300 mt-4 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed group"
            >
                {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <span className="flex items-center gap-2">
                        Enviar Link de Recuperação
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                )}
            </button>
        </form>

        <p className="mt-8 text-xs text-gray-400 text-center">
            Se você lembrou sua senha, <button onClick={onBack} className="text-emerald-600 font-bold hover:underline">faça login aqui</button>.
        </p>
      </div>
    </div>
  );
};
