

import React, { useState } from 'react';
import { User, Mail, Lock, FileText, ChevronLeft, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { auth, db, createUserWithEmailAndPassword, updateProfile, doc, setDoc, collection, query, where, getDocs } from '../services/firebase';
import { validateCPF, formatCPF } from '../utils/cpf';
import { Logo } from './Logo';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegisterSuccess, onNavigateToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cpfError, setCpfError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
    if (formatted.length >= 14) {
        setCpfError(!validateCPF(formatted));
    } else {
        setCpfError(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !cpf) {
      setError("Preencha todos os campos.");
      return;
    }

    if (!validateCPF(cpf)) {
        setError("CPF inválido.");
        setCpfError(true);
        return;
    }

    if (password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    setLoading(true);
    try {
      // 0. VERIFICAR CPF DUPLICADO
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('cpf', '==', cpf));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
          setError("Este CPF já está sendo utilizado por outra conta.");
          setCpfError(true);
          setLoading(false);
          return;
      }

      // 1. Criar usuário no Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        await updateProfile(user, { displayName: name });

        // 2. Inicializar dados no Firestore
        let attempts = 0;
        let success = false;

        while (attempts < 3 && !success) {
            try {
                if (attempts === 0) await new Promise(r => setTimeout(r, 500));

                if (db) {
                    // Create Root User Doc to store admin flag/metadata AND CPF
                    await setDoc(doc(db, 'users', user.uid), {
                        email: email,
                        cpf: cpf, // Salva o CPF no root para verificação futura
                        createdAt: new Date(),
                        isAdmin: false // Default to false
                    }, { merge: true });

                    // Perfil Principal
                    await setDoc(doc(db, 'users', user.uid, 'family', 'primary'), {
                        id: 'primary',
                        name: name.split(' ')[0],
                        avatar: '👨‍🍳',
                        dislikes: '',
                        restrictions: [],
                        isChild: false
                    });

                    // Despensa Vazia
                    await setDoc(doc(db, 'users', user.uid, 'settings', 'pantry'), {
                        items: []
                    });
                    success = true;
                    console.log("Banco de dados inicializado com sucesso.");
                } else {
                    console.warn("Firestore instance is null");
                    break; 
                }
            } catch (dbError) {
                console.warn(`Tentativa ${attempts + 1} de gravar no banco falhou:`, dbError);
                attempts++;
                if (attempts < 3) await new Promise(r => setTimeout(r, 1000));
            }
        }
      }
      
      setLoading(false);
      setShowSuccess(true);
      
      setTimeout(() => {
          onRegisterSuccess();
      }, 2000);

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Este e-mail já está cadastrado.");
      } else if (err.code === 'auth/invalid-api-key') {
         setError("Erro de configuração do servidor.");
      } else {
        setError("Erro ao criar conta. Verifique sua conexão.");
      }
      setLoading(false);
    }
  };

  if (showSuccess) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans p-6 animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cadastro Concluído!</h2>
            <p className="text-gray-500 text-center">Bem-vindo(a) ao Pensa Prato.<br/>Estamos preparando sua cozinha...</p>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative overflow-hidden">
      {/* Top Gradient */}
      <div className="absolute top-0 left-0 w-full h-[35vh] bg-gradient-to-b from-emerald-50 via-[#E8F5E9] to-white pointer-events-none z-0"></div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto z-10 relative">
        
        {/* Back Button */}
        <button 
            onClick={onNavigateToLogin}
            className="absolute top-6 left-4 p-3 text-gray-500 hover:text-[#00C853] bg-white/80 backdrop-blur-md shadow-sm border border-gray-100 rounded-full transition-all hover:scale-105 active:scale-95"
        >
            <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center mb-8 pt-10">
            <div className="inline-block p-3 bg-white rounded-full shadow-lg shadow-emerald-100 mb-4">
                <Logo size={48} />
            </div>
            <h1 className="font-bold text-3xl text-gray-900 mb-2">Criar Conta</h1>
            <p className="text-gray-500 text-sm font-medium">Junte-se a milhares de chefs caseiros</p>
        </div>

        <form onSubmit={handleRegister} className="w-full space-y-4">
            {/* Name */}
            <div className="relative group">
                <User className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#00C853] transition-colors" />
                <input
                    type="text"
                    placeholder="Nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-50 rounded-2xl text-gray-800 placeholder-gray-400 outline-none transition-all font-medium"
                    required
                />
            </div>

            {/* CPF */}
            <div className="relative group">
                <FileText className={`absolute left-4 top-4 w-5 h-5 transition-colors ${cpfError ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#00C853]'}`} />
                <input
                    type="text"
                    placeholder="CPF (000.000.000-00)"
                    value={cpf}
                    onChange={handleCpfChange}
                    maxLength={14}
                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 border focus:bg-white rounded-2xl text-gray-800 placeholder-gray-400 outline-none focus:ring-4 transition-all font-medium ${
                        cpfError 
                        ? 'border-red-200 focus:border-red-400 focus:ring-red-50 bg-red-50/50' 
                        : 'border-transparent focus:border-emerald-100 focus:ring-emerald-50'
                    }`}
                    required
                />
                {cpfError && (
                    <AlertCircle className="absolute right-4 top-4 w-5 h-5 text-red-500 animate-pulse" />
                )}
            </div>

            {/* Email */}
            <div className="relative group">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#00C853] transition-colors" />
                <input
                    type="email"
                    placeholder="Seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-50 rounded-2xl text-gray-800 placeholder-gray-400 outline-none transition-all font-medium"
                    required
                />
            </div>

            {/* Password */}
            <div className="relative group">
                <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#00C853] transition-colors" />
                <input
                    type="password"
                    placeholder="Criar senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-50 rounded-2xl text-gray-800 placeholder-gray-400 outline-none transition-all font-medium"
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
                className="w-full bg-[#00C853] hover:bg-[#00b34a] text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all duration-300 mt-6 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed group"
            >
                {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <span className="flex items-center gap-2">
                        Criar Conta Grátis
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                )}
            </button>
        </form>

        <p className="mt-8 text-xs text-gray-400 text-center px-6 leading-relaxed">
            Ao criar uma conta, você concorda com nossos <br/>
            <button className="text-[#00C853] font-bold hover:underline">Termos de Uso</button> e <button className="text-[#00C853] font-bold hover:underline">Política de Privacidade</button>.
        </p>
      </div>
    </div>
  );
};