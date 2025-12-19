
import React, { useState, useEffect } from 'react';
import { db, collection, doc, deleteDoc, updateDoc, setDoc, getDoc } from '../services/firebase';
import { ArrowLeft, Users, Trash2, Search, Shield, Eye, Database, ChefHat, RefreshCw, DollarSign, Link as LinkIcon, Save, Calendar, CheckCircle2, XCircle, Clock, Layout, Image as ImageIcon, Plus } from 'lucide-react';
import { FamilyMember, SocialProof } from '../types';

interface AdminPanelProps {
  onBack: () => void;
  currentUserEmail?: string;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface UserSummary {
  uid: string;
  email?: string; 
  familyCount: number;
  pantryCount: number;
  historyCount: number;
  primaryName: string;
  isAdmin: boolean;
  isPro: boolean;
  subscriptionExpiry?: any; // Firestore Timestamp
}

const KNOWN_CATEGORIES = [
  'Natal', 'Ano Novo', 'Páscoa', 'Festa Junina',
  'Café da Manhã', 'Almoço de Domingo', 'Jantar Romântico', 'Lanche Rápido',
  'Fitness / Saudável', 'Comfort Food', 'Vegetariano', 'Econômicas'
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, currentUserEmail, showToast }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'monetization' | 'landing'>('users');
  
  // User Management State
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  // Subscription Management Modal State
  const [subModalUser, setSubModalUser] = useState<UserSummary | null>(null);
  const [subLoading, setSubLoading] = useState(false);

  // Monetization State
  const [checkoutConfig, setCheckoutConfig] = useState<{ proMonthlyUrl: string, proAnnualUrl: string, packs: Record<string, string> }>({ 
      proMonthlyUrl: '', 
      proAnnualUrl: '',
      packs: {} 
  });
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);

  // Landing Page State
  const [landingProofs, setLandingProofs] = useState<SocialProof[]>([]);
  const [loadingLanding, setLoadingLanding] = useState(false);
  const [savingLanding, setSavingLanding] = useState(false);

  // --- USERS LOGIC ---
  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await usersRef.get();
      
      const userList: UserSummary[] = [];

      await Promise.all(snapshot.docs.map(async (userDoc: any) => {
        const uid = userDoc.id;
        const userData = userDoc.data();
        
        let primaryName = 'Sem Nome';
        let familyCount = 0;
        let pantryCount = 0;
        let historyCount = 0;

        try {
            const userRef = db.collection('users').doc(uid);
            
            const familySnap = await userRef.collection('family').get();
            familyCount = familySnap.size;
            
            const primaryDoc = familySnap.docs.find((d: any) => d.id === 'primary');
            if (primaryDoc) {
                primaryName = primaryDoc.data().name;
            } else if (familySnap.size > 0) {
                primaryName = familySnap.docs[0].data().name;
            }

            const pantryDoc = await userRef.collection('settings').doc('pantry').get();
            if (pantryDoc.exists) {
                pantryCount = pantryDoc.data()?.items?.length || 0;
            }

            const historySnap = await userRef.collection('history').get();
            historyCount = historySnap.size;

        } catch (subErr) {
            console.warn(`Error fetching subdata for ${uid}`, subErr);
        }

        userList.push({
            uid,
            email: userData.email || 'No Email',
            primaryName,
            familyCount,
            pantryCount,
            historyCount,
            isAdmin: userData.isAdmin === true,
            isPro: userData.isPro === true,
            subscriptionExpiry: userData.subscriptionExpiry
        });
      }));

      setUsers(userList);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      if (showToast) showToast("Erro ao buscar dados.", "error");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (confirm('TEM CERTEZA? Isso apagará os dados do Firestore deste usuário.')) {
        try {
            await deleteDoc(doc(db, 'users', uid));
            setUsers(users.filter(u => u.uid !== uid));
            if (showToast) showToast("Usuário excluído.", "success");
        } catch (e) { 
            console.error(e);
            if (showToast) showToast("Erro ao excluir usuário.", "error");
        }
    }
  };

  const handleToggleAdmin = async (uid: string, currentStatus: boolean) => {
    if (confirm(currentStatus ? 'Remover Admin?' : 'Tornar Admin?')) {
        try {
            await updateDoc(doc(db, 'users', uid), { isAdmin: !currentStatus });
            setUsers(users.map(u => u.uid === uid ? { ...u, isAdmin: !currentStatus } : u));
            if (showToast) showToast(`Admin ${!currentStatus ? 'concedido' : 'removido'}.`, "success");
        } catch(e) { 
            console.error(e);
            if (showToast) showToast("Erro ao alterar permissão.", "error");
        }
    }
  };

  const handleViewDetails = async (uid: string) => {
      setLoadingUsers(true);
      try {
          const userRef = db.collection('users').doc(uid);
          const familySnap = await userRef.collection('family').get();
          const family = familySnap.docs.map((d: any) => d.data());
          const pantrySnap = await userRef.collection('settings').doc('pantry').get();
          const pantry = pantrySnap.exists ? pantrySnap.data()?.items : [];
          const historySnap = await userRef.collection('history').get();
          const history = historySnap.docs.map((d: any) => d.data());

          setSelectedUser({ uid, family, pantry, history });
          setViewMode('detail');
      } catch (e) { 
          console.error(e);
          if (showToast) showToast("Erro ao carregar detalhes.", "error");
      } finally { setLoadingUsers(false); }
  };

  // --- SUBSCRIPTION LOGIC ---
  const handleUpdateSubscription = async (type: 'free' | 'month' | 'year' | 'lifetime') => {
      if (!subModalUser) return;
      setSubLoading(true);
      
      try {
          let updates: any = {};
          const now = new Date();

          if (type === 'free') {
              updates = { isPro: false, subscriptionExpiry: null };
          } else if (type === 'lifetime') {
              updates = { isPro: true, subscriptionExpiry: null }; // Null expiry means lifetime
          } else {
              const expiryDate = new Date();
              if (type === 'month') expiryDate.setDate(now.getDate() + 30);
              if (type === 'year') expiryDate.setDate(now.getDate() + 365);
              updates = { isPro: true, subscriptionExpiry: expiryDate };
          }

          await updateDoc(doc(db, 'users', subModalUser.uid), updates);
          
          setUsers(users.map(u => u.uid === subModalUser.uid ? { ...u, ...updates } : u));
          setSubModalUser(null);
          if (showToast) showToast("Assinatura atualizada!", "success");
      } catch (e) {
          console.error("Erro ao atualizar assinatura", e);
          if (showToast) showToast("Erro ao salvar assinatura.", "error");
      } finally {
          setSubLoading(false);
      }
  };

  const formatExpiry = (expiry: any) => {
      if (!expiry) return 'Vitalício';
      const date = expiry.toDate ? expiry.toDate() : new Date(expiry);
      return date.toLocaleDateString('pt-BR');
  };

  const isExpired = (user: UserSummary) => {
      if (!user.isPro) return false;
      if (!user.subscriptionExpiry) return false; 
      const expiry = user.subscriptionExpiry.toDate ? user.subscriptionExpiry.toDate() : new Date(user.subscriptionExpiry);
      return expiry < new Date();
  };

  // --- MONETIZATION LOGIC ---
  const fetchConfig = async () => {
      setLoadingConfig(true);
      try {
          const docSnap = await getDoc(doc(db, 'admin_settings', 'checkout'));
          const exists = docSnap && (typeof docSnap.exists === 'function' ? docSnap.exists() : docSnap.exists);
          if (exists) {
              const data = typeof docSnap.data === 'function' ? docSnap.data() : docSnap.data;
              setCheckoutConfig({
                  proMonthlyUrl: data.proMonthlyUrl || data.proUrl || '', 
                  proAnnualUrl: data.proAnnualUrl || '',
                  packs: data.packs || {}
              });
          }
      } catch (e) {
          console.error("Erro config:", e);
      } finally {
          setLoadingConfig(false);
      }
  };

  const handleSaveConfig = async () => {
      setSavingConfig(true);
      try {
          await setDoc(doc(db, 'admin_settings', 'checkout'), checkoutConfig);
          if (showToast) showToast("Configurações de venda salvas!", "success");
      } catch (e) {
          console.error("Erro ao salvar config:", e);
          if (showToast) showToast("Erro ao salvar configurações.", "error");
      } finally {
          setSavingConfig(false);
      }
  };

  const updatePackUrl = (category: string, url: string) => {
      setCheckoutConfig(prev => ({
          ...prev,
          packs: {
              ...prev.packs,
              [category]: url
          }
      }));
  };

  // --- LANDING LOGIC ---
  const fetchLanding = async () => {
      setLoadingLanding(true);
      try {
          const docSnap = await getDoc(doc(db, 'admin_settings', 'landing_page'));
          const exists = docSnap && (typeof docSnap.exists === 'function' ? docSnap.exists() : docSnap.exists);
          if (exists) {
              const data = typeof docSnap.data === 'function' ? docSnap.data() : docSnap.data;
              setLandingProofs(data.socialProofs || []);
          } else {
              setLandingProofs([]);
          }
      } catch (e) {
          console.error("Erro landing:", e);
      } finally {
          setLoadingLanding(false);
      }
  };

  const handleSaveLanding = async () => {
      setSavingLanding(true);
      try {
          // Garante que salvamos apenas os campos necessários na estrutura correta
          const socialProofsToSave = landingProofs.map(p => ({
              title: p.title || '',
              user: p.user || '',
              img: p.img || '',
              avatar: p.avatar || `https://ui-avatars.com/api/?name=${(p.user || 'User').replace(' ', '+')}&background=random`
          }));
          
          await setDoc(doc(db, 'admin_settings', 'landing_page'), { socialProofs: socialProofsToSave });
          if (showToast) showToast("Conteúdo da Landing Page atualizado!", "success");
      } catch (e) {
          console.error(e);
          if (showToast) showToast("Erro ao salvar Landing Page.", "error");
      } finally {
          setSavingLanding(false);
      }
  };

  const updateProof = (idx: number, field: keyof SocialProof, val: string) => {
      const newList = [...landingProofs];
      newList[idx] = { ...newList[idx], [field]: val };
      setLandingProofs(newList);
  };

  const removeProof = (idx: number) => {
      setLandingProofs(landingProofs.filter((_, i) => i !== idx));
  };

  const addProof = () => {
      setLandingProofs([...landingProofs, { 
          title: 'Novo Prato', 
          user: 'Nome do Usuário', 
          img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop' 
      }]);
  };

  useEffect(() => {
    if (activeTab === 'users') fetchAllUsers();
    if (activeTab === 'monetization') fetchConfig();
    if (activeTab === 'landing') fetchLanding();
  }, [activeTab]);

  const filteredUsers = users.filter(u => 
    u.uid.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.primaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (viewMode === 'detail' && selectedUser) {
      return (
          <div className="min-h-screen bg-gray-100 p-6">
              <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="bg-gray-800 p-6 flex items-center justify-between text-white">
                      <div className="flex items-center gap-4">
                          <button onClick={() => setViewMode('list')} className="p-2 hover:bg-white/20 rounded-full"><ArrowLeft /></button>
                          <div>
                              <h2 className="text-xl font-bold">{selectedUser.family.find((f:any) => f.id === 'primary')?.name || 'Usuário'}</h2>
                              <p className="text-xs text-gray-400 font-mono">{selectedUser.uid}</p>
                          </div>
                      </div>
                  </div>
                  <div className="p-6 space-y-8">
                      <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-gray-600" /> Família ({selectedUser.family.length})</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {selectedUser.family.map((member: FamilyMember, idx: number) => (
                                  <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                      <div className="flex items-center gap-3 mb-2">
                                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border text-xl">{member.avatar}</div>
                                          <div>
                                              <p className="font-bold text-gray-900">{member.name}</p>
                                              <p className="text-xs text-gray-500">{member.isChild ? 'Criança' : 'Adulto'}</p>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-3 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-emerald-600" /> Painel Admin
                    </h1>
                    <p className="text-sm text-gray-500">Logado como: {currentUserEmail}</p>
                </div>
            </div>
        </div>

        <div className="flex gap-4 mb-6 border-b border-gray-200 pb-1">
            <button 
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 font-bold text-sm rounded-t-lg transition-colors flex items-center gap-2 ${activeTab === 'users' ? 'bg-white text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <Users className="w-4 h-4" /> Usuários
            </button>
            <button 
                onClick={() => setActiveTab('landing')}
                className={`px-4 py-2 font-bold text-sm rounded-t-lg transition-colors flex items-center gap-2 ${activeTab === 'landing' ? 'bg-white text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <Layout className="w-4 h-4" /> Landing Page
            </button>
            <button 
                onClick={() => setActiveTab('monetization')}
                className={`px-4 py-2 font-bold text-sm rounded-t-lg transition-colors flex items-center gap-2 ${activeTab === 'monetization' ? 'bg-white text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <DollarSign className="w-4 h-4" /> Configurar Vendas
            </button>
        </div>

        {activeTab === 'users' && (
            <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Users /></div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{users.length}</h3>
                        <p className="text-gray-500 text-sm">Usuários</p>
                    </div>
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><ChefHat /></div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{users.reduce((acc, u) => acc + u.historyCount, 0)}</h3>
                        <p className="text-gray-500 text-sm">Receitas Feitas</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 /></div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{users.filter(u => u.isPro && !isExpired(u)).length}</h3>
                        <p className="text-gray-500 text-sm">Assinantes Ativos</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <h3 className="font-bold text-lg text-gray-800">Lista de Usuários</h3>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Buscar..." 
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-100 outline-none"
                                />
                            </div>
                            <button onClick={fetchAllUsers} className="p-2 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-200">
                                <RefreshCw className={`w-5 h-5 ${loadingUsers ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400">
                                <tr>
                                    <th className="px-6 py-4">Usuário / Email</th>
                                    <th className="px-6 py-4 text-center">Permissão</th>
                                    <th className="px-6 py-4 text-center">Assinatura</th>
                                    <th className="px-6 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loadingUsers && users.length === 0 ? (
                                    <tr><td colSpan={4} className="text-center py-8">Carregando...</td></tr>
                                ) : filteredUsers.map((user) => {
                                    const expired = isExpired(user);
                                    return (
                                    <tr key={user.uid} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{user.primaryName}</p>
                                            {user.email && <p className="text-xs text-emerald-600 font-medium">{user.email}</p>}
                                            <p className="text-xs font-mono text-gray-400 truncate max-w-[150px]" title={user.uid}>{user.uid}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => handleToggleAdmin(user.uid, user.isAdmin)}
                                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${user.isAdmin ? 'bg-gray-800 text-white hover:bg-gray-900' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                            >
                                                {user.isAdmin ? <Shield className="w-3 h-3" /> : null}
                                                {user.isAdmin ? 'ADMIN' : 'USER'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center">
                                                {user.isPro ? (
                                                    <>
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${expired ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                                                            {expired ? 'Expirado' : 'PRO Ativo'}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 mt-1">
                                                            {user.subscriptionExpiry ? `Até ${formatExpiry(user.subscriptionExpiry)}` : 'Vitalício'}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">Gratuito</span>
                                                )}
                                                <button 
                                                    onClick={() => setSubModalUser(user)}
                                                    className="text-[10px] text-amber-600 hover:underline mt-1"
                                                >
                                                    Gerenciar
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleViewDetails(user.uid)} className="p-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDeleteUser(user.uid)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        )}

        {activeTab === 'landing' && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
                 <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Conteúdo da Landing Page</h3>
                        <p className="text-sm text-gray-500">Gerencie as imagens e depoimentos da comunidade.</p>
                    </div>
                    <div className="flex gap-3">
                         <button 
                            onClick={addProof}
                            className="bg-stone-100 text-stone-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-stone-200 transition-colors"
                        >
                            <Plus className="w-5 h-5" /> Adicionar
                        </button>
                        <button 
                            onClick={handleSaveLanding}
                            disabled={savingLanding}
                            className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-emerald-700 transition-colors disabled:opacity-70"
                        >
                            {savingLanding ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Salvar Landing
                        </button>
                    </div>
                </div>

                {loadingLanding ? (
                    <div className="text-center py-20 text-gray-400">Carregando depoimentos...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {landingProofs.length === 0 && (
                            <div className="col-span-full py-12 bg-white rounded-3xl border border-dashed border-gray-300 text-center text-gray-400">
                                Clique em Adicionar para começar a configurar os depoimentos dinâmicos.
                            </div>
                        )}
                        {landingProofs.map((proof, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-200 relative group overflow-hidden transition-all hover:shadow-md">
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                                        <img src={proof.img} className="w-full h-full object-cover" alt="Preview" />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Título da Receita</label>
                                            <input 
                                                type="text" 
                                                value={proof.title}
                                                onChange={e => updateProof(idx, 'title', e.target.value)}
                                                className="w-full p-2 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-200 rounded-lg text-sm outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nome do Usuário</label>
                                            <input 
                                                type="text" 
                                                value={proof.user}
                                                onChange={e => updateProof(idx, 'user', e.target.value)}
                                                className="w-full p-2 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-200 rounded-lg text-sm outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1">
                                        <ImageIcon className="w-3 h-3" /> URL da Imagem
                                    </label>
                                    <input 
                                        type="text" 
                                        value={proof.img}
                                        onChange={e => updateProof(idx, 'img', e.target.value)}
                                        placeholder="https://images.unsplash.com/..."
                                        className="w-full p-2 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-200 rounded-lg text-xs outline-none font-mono"
                                    />
                                </div>
                                <button 
                                    onClick={() => removeProof(idx)}
                                    className="absolute top-4 right-4 p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {activeTab === 'monetization' && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-end mb-4">
                     <button 
                        onClick={handleSaveConfig}
                        disabled={savingConfig}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-emerald-700 transition-colors disabled:opacity-70"
                     >
                        {savingConfig ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Salvar Alterações
                     </button>
                </div>

                {loadingConfig ? (
                    <div className="text-center py-20 text-gray-400">Carregando configurações...</div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-200 ring-4 ring-emerald-50">
                            <h3 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5" /> Links de Checkout PRO
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">Configure os links para os planos de assinatura completa.</p>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Plano Mensal (URL)</label>
                                    <div className="flex items-center gap-3">
                                        <LinkIcon className="w-5 h-5 text-gray-400" />
                                        <input 
                                            type="text" 
                                            placeholder="https://pay.hotmart.com/mensal"
                                            value={checkoutConfig.proMonthlyUrl}
                                            onChange={(e) => setCheckoutConfig({...checkoutConfig, proMonthlyUrl: e.target.value})}
                                            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Plano Anual (URL)</label>
                                    <div className="flex items-center gap-3">
                                        <LinkIcon className="w-5 h-5 text-gray-400" />
                                        <input 
                                            type="text" 
                                            placeholder="https://pay.hotmart.com/anual"
                                            value={checkoutConfig.proAnnualUrl}
                                            onChange={(e) => setCheckoutConfig({...checkoutConfig, proAnnualUrl: e.target.value})}
                                            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Database className="w-5 h-5 text-emerald-500" /> Pacotes de Categoria (Venda Avulsa)
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {KNOWN_CATEGORIES.map(category => (
                                    <div key={category} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                                            {category}
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <LinkIcon className="w-4 h-4 text-gray-400" />
                                            <input 
                                                type="text" 
                                                placeholder={`Link checkout para ${category}`}
                                                value={checkoutConfig.packs[category] || ''}
                                                onChange={(e) => updatePackUrl(category, e.target.value)}
                                                className="flex-1 p-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-amber-400 outline-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}

      </div>

      {subModalUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
                  <div className="bg-gray-800 p-4 text-white flex justify-between items-center">
                      <h3 className="font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" /> 
                          Assinatura de {subModalUser.primaryName.split(' ')[0]}
                      </h3>
                      <button onClick={() => setSubModalUser(null)} className="p-1 hover:bg-white/20 rounded-full"><XCircle className="w-5 h-5" /></button>
                  </div>
                  <div className="p-6 space-y-3">
                      <p className="text-sm text-gray-500 mb-4">Selecione uma ação para alterar o status deste usuário:</p>
                      
                      <button 
                        onClick={() => handleUpdateSubscription('free')}
                        disabled={subLoading}
                        className="w-full p-3 rounded-xl border border-gray-200 hover:bg-red-50 hover:border-red-200 text-left flex items-center gap-3 transition-colors"
                      >
                          <div className="p-2 bg-gray-100 rounded-lg"><XCircle className="w-5 h-5 text-gray-500" /></div>
                          <div>
                              <p className="font-bold text-gray-800">Remover Assinatura</p>
                              <p className="text-xs text-gray-500">Voltar para Gratuito</p>
                          </div>
                      </button>

                      <button 
                        onClick={() => handleUpdateSubscription('month')}
                        disabled={subLoading}
                        className="w-full p-3 rounded-xl border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 text-left flex items-center gap-3 transition-colors"
                      >
                          <div className="p-2 bg-emerald-100 rounded-lg"><Calendar className="w-5 h-5 text-emerald-600" /></div>
                          <div>
                              <p className="font-bold text-gray-800">Adicionar 30 Dias</p>
                              <p className="text-xs text-gray-500">Plano Mensal</p>
                          </div>
                      </button>

                      <button 
                        onClick={() => handleUpdateSubscription('year')}
                        disabled={subLoading}
                        className="w-full p-3 rounded-xl border border-gray-200 hover:bg-amber-50 hover:border-amber-200 text-left flex items-center gap-3 transition-colors"
                      >
                          <div className="p-2 bg-amber-100 rounded-lg"><Calendar className="w-5 h-5 text-amber-600" /></div>
                          <div>
                              <p className="font-bold text-gray-800">Adicionar 1 Ano</p>
                              <p className="text-xs text-gray-500">Plano Anual</p>
                          </div>
                      </button>

                       <button 
                        onClick={() => handleUpdateSubscription('lifetime')}
                        disabled={subLoading}
                        className="w-full p-3 rounded-xl border border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-left flex items-center gap-3 transition-colors"
                      >
                          <div className="p-2 bg-gray-200 rounded-lg"><Clock className="w-5 h-5 text-gray-600" /></div>
                          <div>
                              <p className="font-bold text-gray-800">Vitalício</p>
                              <p className="text-xs text-gray-500">Sem data de expiração</p>
                          </div>
                      </button>
                  </div>
                  {subLoading && <div className="p-2 bg-gray-50 text-center text-xs text-gray-500 animate-pulse">Atualizando...</div>}
              </div>
          </div>
      )}
    </div>
  );
};
