
import React, { useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword } from '../services/firebase';
import { Eye, EyeOff, Lock, Mail, ArrowRight, CheckSquare, Square } from 'lucide-react';
import { Logo } from './Logo';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ 
  onLoginSuccess, 
  onNavigateToRegister, 
  onNavigateToForgotPassword 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar e-mail salvo se existir
  useEffect(() => {
    const savedEmail = localStorage.getItem('pensa_prato_saved_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      onLoginSuccess();
    } catch (err: any) {
      console.error("Erro no login com Google:", err);
      setError("Erro ao conectar com o Google. Tente novamente.");
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;

      if (rememberMe) {
        localStorage.setItem('pensa_prato_saved_email', email);
      } else {
        localStorage.removeItem('pensa_prato_saved_email');
      }

      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (err: any) {
      console.error("Erro no login:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("E-mail ou senha incorretos.");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Muitas tentativas. Tente novamente mais tarde.");
      } else {
        setError("Erro ao fazer login. Verifique sua conexão.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[45vh] bg-gradient-to-br from-emerald-50 via-[#E8F5E9] to-white pointer-events-none z-0 rounded-b-[3rem]"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-20 left-0 w-32 h-32 bg-emerald-300/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto z-10 relative">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="p-4 bg-white/60 backdrop-blur-sm rounded-full shadow-lg shadow-emerald-100/50 mb-4 ring-1 ring-white">
            <Logo size={56} />
          </div>
          <h1 className="font-bold text-[38px] leading-tight text-gray-900 tracking-tight mb-2">
            Pensa <span className="text-[#00C853]">Prato</span>
          </h1>
          <p className="text-gray-500 font-medium text-base leading-snug max-w-[260px] mx-auto">
            Tire uma foto. O app pensa o prato por você.
          </p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-4 flex items-center justify-center gap-3 shadow-sm hover:shadow-md hover:border-emerald-200 hover:bg-emerald-50/30 active:scale-[0.98] transition-all group mb-6"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-[#00C853] border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26c.47-1.43 1.15-2.58 1.81-2.58z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-gray-700 font-bold">Continuar com Google</span>
            </>
          )}
        </button>

        <div className="w-full flex items-center gap-4 mb-6 px-2">
          <div className="flex-1 h-px bg-gray-100"></div>
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">ou entre com e-mail</span>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>

        <form onSubmit={handleEmailLogin} className="w-full space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#00C853]" />
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-50 rounded-2xl text-gray-800 placeholder-gray-400 outline-none font-medium"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#00C853]" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-50 rounded-2xl text-gray-800 placeholder-gray-400 outline-none font-medium"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex justify-between items-center px-1">
            <button type="button" onClick={() => setRememberMe(!rememberMe)} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-700">
              {rememberMe ? <CheckSquare className="w-4 h-4 text-[#00C853]" /> : <Square className="w-4 h-4 text-gray-300" />}
              Lembrar de mim
            </button>
            <button type="button" onClick={onNavigateToForgotPassword} className="text-xs font-bold text-gray-400 hover:text-[#00C853]">
              Esqueceu a senha?
            </button>
          </div>

          {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-2xl border border-red-100">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00C853] hover:bg-[#00b34a] text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70"
          >
            {loading ? "Processando..." : <>Entrar <ArrowRight className="w-5 h-5 ml-2" /></>}
          </button>
        </form>

        <div className="mt-auto pt-8 text-center pb-4">
          <button onClick={onNavigateToRegister} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1.5 mx-auto px-4 py-2 rounded-xl hover:bg-gray-50">
            Ainda não tem conta? <span className="font-bold text-[#00C853]">Criar agora</span>
          </button>
        </div>
      </div>
    </div>
  );
};
