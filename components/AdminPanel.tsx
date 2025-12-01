
import React, { useState, useEffect } from 'react';
import { db, collection, getDoc, doc, deleteDoc, updateDoc } from '../services/firebase';
import { ArrowLeft, Users, Trash2, Search, Shield, Eye, Database, ChefHat, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { FamilyMember } from '../types';

interface AdminPanelProps {
  onBack: () => void;
  currentUserEmail?: string;
}

interface UserSummary {
  uid: string;
  email?: string; 
  familyCount: number;
  pantryCount: number;
  historyCount: number;
  primaryName: string;
  isAdmin: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, currentUserEmail }) => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  // Fetch all users data
  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await usersRef.get();
      
      const userList: UserSummary[] = [];

      await Promise.all(snapshot.docs.map(async (userDoc: any) => {
        const uid = userDoc.id;
        const userData = userDoc.data();
        
        // Fetch Primary Profile
        let primaryName = 'Sem Nome';
        try {
            const primaryRef = await db.collection('users').doc(uid).collection('family').doc('primary').get();
            if (primaryRef.exists) {
                primaryName = primaryRef.data()?.name || 'Sem Nome';
            }
        } catch (e) {}

        const familySnap = await db.collection('users').doc(uid).collection('family').get();
        const pantrySnap = await db.collection('users').doc(uid).collection('settings').doc('pantry').get();
        const historySnap = await db.collection('users').doc(uid).collection('history').get();

        const pantryCount = pantrySnap.exists ? (pantrySnap.data()?.items?.length || 0) : 0;

        userList.push({
            uid,
            email: userData.email || '',
            primaryName,
            familyCount: familySnap.size,
            pantryCount: pantryCount,
            historyCount: historySnap.size,
            isAdmin: userData.isAdmin === true
        });
      }));

      setUsers(userList);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      alert("Erro ao buscar dados. Verifique as regras de segurança do Firebase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleDeleteUser = async (uid: string) => {
    if (confirm('TEM CERTEZA? Isso apagará os dados do Firestore deste usuário. A conta de autenticação precisaria ser apagada via Firebase Console.')) {
        try {
            await deleteDoc(doc(db, 'users', uid));
            setUsers(users.filter(u => u.uid !== uid));
            alert('Dados do usuário apagados.');
        } catch (e) {
            console.error(e);
            alert('Erro ao apagar.');
        }
    }
  };

  const handleToggleAdmin = async (uid: string, currentStatus: boolean) => {
    if (confirm(currentStatus ? 'Remover privilégio de Admin?' : 'Tornar este usuário um Admin?')) {
        try {
            await updateDoc(doc(db, 'users', uid), { isAdmin: !currentStatus });
            setUsers(users.map(u => u.uid === uid ? { ...u, isAdmin: !currentStatus } : u));
        } catch(e) {
            console.error(e);
            alert('Erro ao atualizar permissão.');
        }
    }
  };

  const handleViewDetails = async (uid: string) => {
      setLoading(true);
      try {
          const familySnap = await db.collection('users').doc(uid).collection('family').get();
          const family = familySnap.docs.map((d: any) => d.data());
          
          const pantrySnap = await db.collection('users').doc(uid).collection('settings').doc('pantry').get();
          const pantry = pantrySnap.exists ? pantrySnap.data()?.items : [];

          const historySnap = await db.collection('users').doc(uid).collection('history').get();
          const history = historySnap.docs.map((d: any) => d.data());

          setSelectedUser({
              uid,
              family,
              pantry,
              history
          });
          setViewMode('detail');
      } catch (e) {
          console.error(e);
          alert('Erro ao carregar detalhes.');
      } finally {
          setLoading(false);
      }
  };

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
                      {/* Family Section */}
                      <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-blue-500" /> Família ({selectedUser.family.length})</h3>
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
                                      {member.restrictions && member.restrictions.length > 0 && (
                                          <div className="flex flex-wrap gap-1">
                                              {member.restrictions.map((r, i) => <span key={i} className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{r}</span>)}
                                          </div>
                                      )}
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Pantry Section */}
                      <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Database className="w-5 h-5 text-emerald-500" /> Despensa ({selectedUser.pantry.length})</h3>
                          <div className="flex flex-wrap gap-2">
                              {selectedUser.pantry.length > 0 ? selectedUser.pantry.map((item: string, idx: number) => (
                                  <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm border border-emerald-100">{item}</span>
                              )) : <p className="text-gray-400 italic">Despensa vazia.</p>}
                          </div>
                      </div>

                      {/* History Section */}
                      <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><ChefHat className="w-5 h-5 text-orange-500" /> Histórico ({selectedUser.history.length})</h3>
                          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                              {selectedUser.history.map((recipe: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                                      <span className="font-medium text-gray-700">{recipe.title}</span>
                                      <span className="text-gray-400 text-xs">{new Date(recipe.cookedAt).toLocaleDateString()}</span>
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
            <button onClick={fetchAllUsers} className="p-3 bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-700 transition-colors">
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users /></div>
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">Total</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{users.length}</h3>
                <p className="text-gray-500 text-sm">Usuários Cadastrados</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><ChefHat /></div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{users.reduce((acc, u) => acc + u.historyCount, 0)}</h3>
                <p className="text-gray-500 text-sm">Receitas Cozinhadas (Total)</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Database /></div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{users.reduce((acc, u) => acc + u.pantryCount, 0)}</h3>
                <p className="text-gray-500 text-sm">Itens em Despensas</p>
            </div>
        </div>

        {/* Search & List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                <h3 className="font-bold text-lg text-gray-800">Gerenciar Usuários</h3>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar UID ou Nome..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-100 outline-none"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400">
                        <tr>
                            <th className="px-6 py-4">Usuário / Email</th>
                            <th className="px-6 py-4 text-center">Permissão</th>
                            <th className="px-6 py-4 text-center">Família</th>
                            <th className="px-6 py-4 text-center">Despensa</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading && users.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-8">Carregando...</td></tr>
                        ) : filteredUsers.map((user) => (
                            <tr key={user.uid} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-900">{user.primaryName}</p>
                                    {user.email && <p className="text-xs text-emerald-600 font-medium">{user.email}</p>}
                                    <p className="text-xs font-mono text-gray-400 truncate max-w-[150px]" title={user.uid}>{user.uid}</p>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => handleToggleAdmin(user.uid, user.isAdmin)}
                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${user.isAdmin ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                        title={user.isAdmin ? 'Remover Admin' : 'Tornar Admin'}
                                    >
                                        {user.isAdmin ? <Shield className="w-3 h-3" /> : null}
                                        {user.isAdmin ? 'ADMIN' : 'USER'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {user.familyCount}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                        {user.pantryCount}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleViewDetails(user.uid)}
                                            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                            title="Ver Detalhes"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteUser(user.uid)}
                                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                            title="Apagar Dados"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-400">Nenhum usuário encontrado.</div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
