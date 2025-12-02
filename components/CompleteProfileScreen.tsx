import React, { useState } from 'react';
import { User, FileText, AlertCircle, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';
import { db, doc, setDoc, collection, query, where, getDocs, updateProfile, auth } from '../services/firebase';
import { validateCPF, formatCPF } from '../utils/cpf';
import { Logo } from './Logo';

interface CompleteProfileScreenProps {
  onCompleteSuccess: () => void;
  initialName?: string;
  initialEmail?: string;
  onBack: () => void;
}

export const CompleteProfileScreen: React.FC<CompleteProfileScreenProps> = ({ onCompleteSuccess, initialName = '', initialEmail = '', onBack }) => {
  const [name, setName] = useState(initialName);
  const [cpf, setCpf] = useState('');
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

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const currentUser = auth.currentUser;
    if (!currentUser) {
        setError("Sessão inválida. Faça login novamente.");
        return;
    }

    if (!name || !cpf) {
      setError("Preencha todos os campos.");
      return;
    }

    if (!validateCPF(cpf)) {
        setError("CPF inválido.");
        setCpfError(true);
        return;
    }

    setLoading(true);
    try {
      // 0. VERIFICAR CPF DUPLICADO
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('cpf', '==', cpf));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
          setError("Este CPF já está associado a outra conta.");
          setCpfError(true);
          setLoading(false);
          return;
      }

      // 1. Atualizar Profile no Auth se mudou nome
      if (name !== initialName) {
         await updateProfile(currentUser, { displayName: name });
      }

      // 2. Salvar no Firestore
      await setDoc(doc(db, 'users', currentUser.uid), {
            email: currentUser.email || initialEmail,
            cpf: cpf,
            createdAt: new Date(),
            isAdmin: false
        }, { merge: true });

        // Perfil Principal (caso ainda não exista)
        await setDoc(doc(db, 'users', currentUser.uid, 'family', 'primary'), {
            id: 'primary',
            name: name.split(' ')[0],
            avatar: currentUser.photoURL || '👨‍🍳',
            dislikes: '',
            restrictions: [],
            isChild: false
        }, { merge: true });

        // Despensa Vazia (caso ainda não exista)
        await setDoc(doc(db, 'users', currentUser.uid, 'settings', 'pantry'), {
            items: []
        }, { merge: true });

      setLoading(false);
      setShowSuccess(true);
      
      setTimeout(() => {
          onCompleteSuccess();
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setError("Erro ao salvar perfil. Tente novamente.");
      setLoading(false);
    }
  };

  if (showSuccess) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans p-6 animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tudo Pronto!</h2>
            <p className="text-gray-500 text-center">Vamos cozinhar!</p>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[35vh] bg-gradient-to-b from-blue-50 via-emerald-50/30 to-white pointer-events-none z-0"></div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto z-10 relative">
        
        {/* Back Button - Allows logout/cancel */}
        <button 
            onClick={onBack}
            className="absolute top-6 left-4 p-3 text-gray-500 hover:text-[#00C853] bg-white/80 backdrop-blur-md shadow-sm border border-gray-100 rounded-full transition-all hover:scale-105 active:scale-95"
            title="Voltar / Sair"
        >
            <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center mb-8 pt-10">
            <div className="inline-block p-3 bg-white rounded-full shadow-lg shadow-emerald-100 mb-4">
                <Logo size={48} />
            </div>
            <h1 className="font-bold text-3xl text-gray-900 mb-2">Quase lá!</h1>
            <p className="text-gray-500 text-sm font-medium">Complete seus dados para continuar</p>
        </div>

        <form onSubmit={handleComplete} className="w-full space-y-4">
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

            {/* Email (Readonly) */}
            <div className="p-4 bg-gray-50 rounded-2xl text-center text-sm text-gray-400 border border-gray-100">
               Logado como <span className="font-bold text-gray-600">{initialEmail}</span>
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
                        Finalizar Cadastro
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                )}
            </button>
        </form>
      </div>
    </div>
  );
};