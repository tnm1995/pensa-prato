
import React, { useState, useEffect, useRef } from 'react';
import { AppView, FamilyMember, CookingMethod, ShoppingItem, Recipe, ScanResult, SocialProof } from './types';
import { analyzeFridgeImage, generateRecipes, getMockScanResult, getMockRecipes, generateRecipesByCategory } from './services/geminiService';
import { UploadScreen } from './components/UploadScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ScanResults } from './components/ScanResults';
import { RecipeList } from './components/RecipeList';
import { RecipeDetail } from './components/RecipeDetail';
import { ProfileScreen } from './components/ProfileScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { FamilySelectionScreen } from './components/FamilySelectionScreen';
import { ProfileEditorScreen } from './components/ProfileEditorScreen';
import { CookingMethodScreen } from './components/CookingMethodScreen';
import { BottomMenu } from './components/BottomMenu';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen';
import { ShoppingListScreen } from './components/ShoppingListScreen';
import { auth, db, onAuthStateChanged, signOut, collection, doc, onSnapshot, setDoc, addDoc, updateDoc, deleteDoc, getDoc } from './services/firebase';
import { SplashScreen } from './components/SplashScreen';
import { AdminPanel } from './components/AdminPanel';
import { CompleteProfileScreen } from './components/CompleteProfileScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { Toast } from './components/Toast';
import { SubscriptionModal } from './components/SubscriptionModal';
import { LandingPage } from './components/LandingPage';
import { TermsScreen } from './components/TermsScreen';
import { PrivacyScreen } from './components/PrivacyScreen';

const MAX_FREE_USES = 3;

const DEFAULT_CHECKOUT_PRO = "https://pay.hotmart.com/SEU_LINK_PRO_AQUI"; 
const DEFAULT_CHECKOUT_PACK = "https://pay.hotmart.com/SEU_LINK_PACK_GENERICO"; 

function App() {
  const [user, setUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [cookedHistory, setCookedHistory] = useState<Recipe[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [pantryItems, setPantryItems] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [lastMainView, setLastMainView] = useState<AppView>(AppView.WELCOME);
  const [activeProfiles, setActiveProfiles] = useState<FamilyMember[]>([]);
  const [cookingMethod, setCookingMethod] = useState<CookingMethod>(CookingMethod.ANY);
  const [memberToEdit, setMemberToEdit] = useState<FamilyMember | undefined>(undefined);
  const [editingReturnView, setEditingReturnView] = useState<AppView>(AppView.FAMILY_SELECTION);
  const [profileInitialTab, setProfileInitialTab] = useState<'history' | 'favorites' | 'settings'>('settings');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [usageCount, setUsageCount] = useState(() => parseInt(localStorage.getItem('pp_usage_count') || '0'));
  const [isPro, setIsPro] = useState(false);
  const [unlockedPacks, setUnlockedPacks] = useState<string[]>(() => {
      try { return JSON.parse(localStorage.getItem('pp_unlocked_packs') || '[]'); } catch { return []; }
  });
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallContext, setPaywallContext] = useState<{ type: 'general' | 'category', id?: string }>({ type: 'general' });

  const [checkoutConfig, setCheckoutConfig] = useState<{ proMonthlyUrl: string, proAnnualUrl: string, packs: Record<string, string> }>({
      proMonthlyUrl: DEFAULT_CHECKOUT_PRO,
      proAnnualUrl: '',
      packs: {}
  });

  const [customSocialProofs, setCustomSocialProofs] = useState<SocialProof[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [isDemoMode, setIsDemoMode] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
          return localStorage.getItem('pp_demo_mode') === 'true';
      }
    } catch (e) {
      console.warn("LocalStorage access error:", e);
    }
    return false;
  });

  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
  };
  
  const isDemoModeRef = useRef(isDemoMode);
  useEffect(() => { isDemoModeRef.current = isDemoMode; }, [isDemoMode]);

  useEffect(() => { localStorage.setItem('pp_usage_count', usageCount.toString()); }, [usageCount]);
  useEffect(() => { localStorage.setItem('pp_unlocked_packs', JSON.stringify(unlockedPacks)); }, [unlockedPacks]);

  const isLoggingOut = useRef(false);
  const unsubs = useRef<(() => void)[]>([]);
  const [loadingMode, setLoadingMode] = useState<'analyzing' | 'recipes'>('analyzing');
  const isInitialAuthCheck = useRef(true);

  const clearListeners = () => {
      unsubs.current.forEach(u => u());
      unsubs.current = [];
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        if (isAuthChecking) {
            setIsAuthChecking(false);
            if (!user && !isDemoMode) setCurrentView(AppView.LANDING);
        }
    }, 2500);
    return () => clearTimeout(timer);
  }, [isAuthChecking, user, isDemoMode]);

  // ESCUTA EM TEMPO REAL: Configurações Globais (Checkout e Landing)
  useEffect(() => {
    if (db) {
        // Escutar Checkout
        const unsubCheckout = onSnapshot(doc(db, 'admin_settings', 'checkout'), (snap: any) => {
            const hasDoc = snap && (typeof snap.exists === 'function' ? snap.exists() : snap.exists);
            if (hasDoc) {
                const data = typeof snap.data === 'function' ? snap.data() : snap.data;
                setCheckoutConfig({
                    proMonthlyUrl: data.proMonthlyUrl || data.proUrl || DEFAULT_CHECKOUT_PRO,
                    proAnnualUrl: data.proAnnualUrl || '',
                    packs: data.packs || {}
                });
            }
        }, (err: any) => {
            if (err.code !== 'permission-denied') console.warn("Erro ao carregar checkout:", err);
        });

        // Escutar Landing Page
        const unsubLanding = onSnapshot(doc(db, 'admin_settings', 'landing_page'), (snap: any) => {
            const hasDoc = snap && (typeof snap.exists === 'function' ? snap.exists() : snap.exists);
            if (hasDoc) {
                const data = typeof snap.data === 'function' ? snap.data() : snap.data;
                if (data && data.socialProofs) {
                    setCustomSocialProofs(data.socialProofs);
                }
            }
        }, (err: any) => {
            if (err.code !== 'permission-denied') console.warn("Erro ao carregar landing page:", err);
        });

        return () => {
            unsubCheckout();
            unsubLanding();
        };
    }
  }, [user]); // Re-executa quando o usuário muda para lidar com permissões do Admin

  // FIREBASE AUTH + SYNC USUÁRIO
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: any) => {
      clearListeners();

      try {
        if (currentUser) {
          setUser(currentUser);
          setIsDemoMode(false);
          localStorage.removeItem('pp_demo_mode');
          
          if (db) {
             const userDocRef = doc(db, 'users', currentUser.uid);
             const unsubUser = onSnapshot(userDocRef, (docSnap: any) => {
                if (isLoggingOut.current) return;
                let adminStatus = false;
                const hasDoc = docSnap && (typeof docSnap.exists === 'function' ? docSnap.exists() : docSnap.exists);
                let hasCpf = false;
                let proStatus = false;
                
                if (hasDoc) {
                    const data = typeof docSnap.data === 'function' ? docSnap.data() : docSnap.data;
                    if (data?.isAdmin === true) adminStatus = true;
                    if (data?.cpf) hasCpf = true;
                    if (data?.isPro) proStatus = true;
                }
                setIsAdmin(adminStatus);
                setIsPro(proStatus);

                setCurrentView((prev) => {
                    if (prev === AppView.TERMS || prev === AppView.PRIVACY) return prev;
                    const isAuthFlow = [AppView.LANDING, AppView.LOGIN, AppView.REGISTER, AppView.FORGOT_PASSWORD, AppView.COMPLETE_PROFILE].includes(prev);
                    if (!hasDoc || !hasCpf) return AppView.COMPLETE_PROFILE;
                    if (isAuthFlow) return AppView.WELCOME;
                    return prev;
                });
             }, (err: any) => {
                if (err.code !== 'permission-denied') console.warn("Erro no listener de usuário:", err);
             });
             unsubs.current.push(unsubUser);

             unsubs.current.push(onSnapshot(collection(db, 'users', currentUser.uid, 'family'), (snap: any) => setFamilyMembers(safeMapDocs(snap, d => ({ ...d.data(), id: d.id } as FamilyMember))), (err) => {}));
             unsubs.current.push(onSnapshot(collection(db, 'users', currentUser.uid, 'favorites'), (s: any) => setFavoriteRecipes(safeMapDocs(s, d => ({ ...d.data(), _firestoreId: d.id } as unknown as Recipe))), (err) => {}));
             unsubs.current.push(onSnapshot(collection(db, 'users', currentUser.uid, 'history'), (s: any) => setCookedHistory(safeMapDocs(s, d => d.data() as Recipe)), (err) => {}));
             unsubs.current.push(onSnapshot(collection(db, 'users', currentUser.uid, 'shopping'), (s: any) => setShoppingList(safeMapDocs(s, d => ({ ...d.data(), id: d.id } as ShoppingItem))), (err) => {}));
             unsubs.current.push(onSnapshot(doc(db, 'users', currentUser.uid, 'settings', 'pantry'), (s: any) => {
                 const data = typeof s.data === 'function' ? s.data() : s.data;
                 setPantryItems(data ? data.items || [] : []);
             }, (err) => {}));
          }
        } else {
          setUser(null);
          if (isDemoModeRef.current) {
               if (isInitialAuthCheck.current) setCurrentView(AppView.WELCOME);
          } else {
               setCurrentView(prev => (prev === AppView.TERMS || prev === AppView.PRIVACY) ? prev : AppView.LANDING);
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        setCurrentView(AppView.LANDING);
      } finally {
        if (isInitialAuthCheck.current) isInitialAuthCheck.current = false;
        setIsAuthChecking(false);
      }
    });

    return () => { unsubscribe(); clearListeners(); };
  }, []);

  const safeMapDocs = (snap: any, mapper: (doc: any) => any) => {
    if (snap && snap.docs && Array.isArray(snap.docs)) return snap.docs.map(mapper);
    return [];
  };

  const handleLogout = async () => {
      isLoggingOut.current = true;
      clearListeners();
      try {
          localStorage.removeItem('pp_demo_mode');
          setIsDemoMode(false);
          setUser(null); 
          setActiveProfiles([]);
          setIsAdmin(false);
          setCurrentView(AppView.LANDING);
          await signOut(auth);
      } catch (error) { console.error("Logout failed", error); setCurrentView(AppView.LANDING); } finally { setTimeout(() => { isLoggingOut.current = false; }, 1000); }
  };
  
  const handleUpdatePantry = async (items: string[]) => {
    if (!user || !db) return;
    try { await setDoc(doc(db, 'users', user.uid, 'settings', 'pantry'), { items }); showToast("Despensa atualizada!", "success"); } catch(e) { console.error(e); }
  };
  
  const handleSaveMember = async (memberToSave: FamilyMember) => {
    if (isDemoMode) {
      setFamilyMembers(prev => prev.some(m => m.id === memberToSave.id) ? prev.map(m => m.id === memberToSave.id ? memberToSave : m) : [...prev, { ...memberToSave, id: Date.now().toString() }]);
      if (currentView === AppView.PROFILE_EDITOR) setCurrentView(editingReturnView);
      return;
    }
    if (!user || !db) return;
    try {
        const isNew = !memberToSave.id || memberToSave.id.startsWith('temp-');
        if (memberToSave.id === 'primary') await setDoc(doc(db, 'users', user.uid, 'family', 'primary'), memberToSave, { merge: true });
        else if (!isNew && memberToSave.id !== 'default-user') await setDoc(doc(db, 'users', user.uid, 'family', memberToSave.id), memberToSave, { merge: true });
        else { const { id, ...data } = memberToSave; await addDoc(collection(db, 'users', user.uid, 'family'), data); }
        showToast("Perfil salvo!", "success");
    } catch (e) { console.error(e); }
    if (currentView === AppView.PROFILE_EDITOR) setCurrentView(editingReturnView);
  };

  const handleToggleFavorite = async (recipe: Recipe) => {
    if (isDemoMode) {
        setFavoriteRecipes(prev => prev.some(r => r.title === recipe.title) ? (showToast("Removido", "info"), prev.filter(r => r.title !== recipe.title)) : (showToast("Salvo!", "success"), [...prev, recipe]));
        return;
    }
    if (!user || !db) return;
    try {
        const existing = favoriteRecipes.find(r => r.title === recipe.title);
        if (existing) { const docId = (existing as any)._firestoreId; if (docId) await deleteDoc(doc(db, 'users', user.uid, 'favorites', docId)); showToast("Removido", "info"); }
        else { const dataToSave = { ...recipe, image: recipe.image || `https://picsum.photos/seed/${recipe.title.replace(/\s/g,'')}/600/400` }; delete (dataToSave as any)._firestoreId; await addDoc(collection(db, 'users', user.uid, 'favorites'), dataToSave); showToast("Salvo!", "success"); }
    } catch (e) { console.error(e); }
  };

  const handleFinishCooking = async (recipe: Recipe) => {
    showToast("Receita concluída!", "success");
    if (isDemoMode) { setCookedHistory(prev => [...prev, recipe]); return; }
    if (user && db) { try { await addDoc(collection(db, 'users', user.uid, 'history'), { ...recipe, cookedAt: Date.now(), image: recipe.image || `https://picsum.photos/seed/${recipe.title.replace(/\s/g,'')}/600/400` }); } catch(e) { console.error(e); } }
  };

  const handleFileSelect = async (file: File) => {
    if (!user && !isDemoMode) return;
    if (!isPro && usageCount >= MAX_FREE_USES) { setPaywallContext({ type: 'general' }); setShowPaywall(true); return; }
    setImagePreview(URL.createObjectURL(file));
    setLoadingMode('analyzing');
    setCurrentView(AppView.ANALYZING);
    try {
      const result = await analyzeFridgeImage(file);
      setScanResult(result);
      setCurrentView(AppView.RESULTS);
      if (!isPro) setUsageCount(prev => prev + 1);
    } catch (err: any) {
      setError(err.message || "Erro na análise.");
      setCurrentView(AppView.UPLOAD);
    }
  };

  const handleFindRecipes = async (confirmedIngredients: string[]) => {
    setLoadingMode('recipes');
    setCurrentView(AppView.ANALYZING); 
    try {
        const suggestions = isDemoMode ? getMockRecipes() : await generateRecipes(confirmedIngredients, activeProfiles, cookingMethod, pantryItems);
        setRecipes(suggestions);
        setCurrentView(AppView.RECIPES);
    } catch(err) { console.error(err); setCurrentView(AppView.RESULTS); }
  };

  const handleSelectCategory = async (category: string) => {
      const isPackUnlocked = unlockedPacks.includes(category);
      if (!isPro && !isPackUnlocked && usageCount >= MAX_FREE_USES) { setPaywallContext({ type: 'category', id: category }); setShowPaywall(true); return; }
      setLoadingMode('recipes');
      setCurrentView(AppView.ANALYZING);
      try {
          const suggestions = isDemoMode ? getMockRecipes() : await generateRecipesByCategory(category, activeProfiles, cookingMethod);
          setRecipes(suggestions);
          setCurrentView(AppView.RECIPES);
          if (!isPro && !isPackUnlocked) setUsageCount(prev => prev + 1);
      } catch(err) { console.error(err); setCurrentView(AppView.EXPLORE); }
  };

  const handleSubscribe = async () => {
      if (!user) return;
      try { const expiry = new Date(); expiry.setDate(expiry.getDate() + 30); await updateDoc(doc(db, 'users', user.uid), { isPro: true, subscriptionExpiry: expiry }); setShowPaywall(false); showToast("Bem-vindo ao PRO! 👑", "success"); } catch (e) { console.error(e); }
  };

  const safeUserProfile = familyMembers.find(m => m.id === 'primary') || familyMembers[0];
  const showBottomMenu = ![AppView.LANDING, AppView.LOGIN, AppView.REGISTER, AppView.FORGOT_PASSWORD, AppView.COMPLETE_PROFILE, AppView.ANALYZING, AppView.RECIPE_DETAIL, AppView.PROFILE_EDITOR, AppView.ADMIN_PANEL, AppView.TERMS, AppView.PRIVACY].includes(currentView);

  if (isAuthChecking) return <SplashScreen />;

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-900 relative">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      
      <SubscriptionModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} onSubscribe={handleSubscribe} onBuyPack={() => {}} context={paywallContext} checkoutUrlProMonthly={checkoutConfig.proMonthlyUrl} checkoutUrlProAnnual={checkoutConfig.proAnnualUrl} checkoutUrlPack={DEFAULT_CHECKOUT_PACK} />

      {currentView === AppView.LANDING && (
        <LandingPage 
            onLogin={() => setCurrentView(AppView.LOGIN)} 
            onStartTest={() => setCurrentView(AppView.REGISTER)} 
            onTermsClick={() => setCurrentView(AppView.TERMS)}
            onPrivacyClick={() => setCurrentView(AppView.PRIVACY)}
            customSocialProofs={customSocialProofs}
        />
      )}
      
      {currentView === AppView.LOGIN && <LoginScreen onLoginSuccess={() => {}} onNavigateToRegister={() => setCurrentView(AppView.REGISTER)} onNavigateToForgotPassword={() => setCurrentView(AppView.FORGOT_PASSWORD)} />}
      {currentView === AppView.REGISTER && <RegisterScreen onRegisterSuccess={() => setCurrentView(AppView.WELCOME)} onNavigateToLogin={() => setCurrentView(AppView.LOGIN)} />}
      {currentView === AppView.FORGOT_PASSWORD && <ForgotPasswordScreen onBack={() => setCurrentView(AppView.LOGIN)} />}
      {currentView === AppView.COMPLETE_PROFILE && user && <CompleteProfileScreen onCompleteSuccess={() => setCurrentView(AppView.WELCOME)} initialName={user.displayName} initialEmail={user.email} onBack={handleLogout} />}

      {currentView === AppView.WELCOME && <WelcomeScreen onSelectAny={() => { setActiveProfiles([]); setCurrentView(AppView.COOKING_METHOD); }} onSelectFamily={() => setCurrentView(AppView.FAMILY_SELECTION)} />}
      {currentView === AppView.FAMILY_SELECTION && <FamilySelectionScreen members={familyMembers} selectedMembers={activeProfiles} onToggleMember={m => setActiveProfiles(p => p.some(x => x.id === m.id) ? p.filter(x => x.id !== m.id) : [...p, m])} onSelectAll={() => setActiveProfiles(activeProfiles.length === familyMembers.length ? [] : [...familyMembers])} onContinue={() => setCurrentView(AppView.COOKING_METHOD)} onEditMember={m => { setMemberToEdit(m); setEditingReturnView(AppView.FAMILY_SELECTION); setCurrentView(AppView.PROFILE_EDITOR); }} onAddNew={() => { setMemberToEdit(undefined); setCurrentView(AppView.PROFILE_EDITOR); }} onBack={() => setCurrentView(AppView.WELCOME)} />}
      {currentView === AppView.COOKING_METHOD && <CookingMethodScreen onSelectMethod={m => { setCookingMethod(m); setCurrentView(AppView.UPLOAD); }} onBack={() => setCurrentView(activeProfiles.length > 0 ? AppView.FAMILY_SELECTION : AppView.WELCOME)} />}
      {currentView === AppView.PROFILE_EDITOR && <ProfileEditorScreen initialMember={memberToEdit} onSave={handleSaveMember} onCancel={() => setCurrentView(editingReturnView)} />}
      
      {currentView === AppView.UPLOAD && <UploadScreen onFileSelected={handleFileSelect} onProfileClick={() => setCurrentView(AppView.PROFILE)} activeProfiles={activeProfiles} cookingMethod={cookingMethod} onChangeContext={() => setCurrentView(AppView.WELCOME)} error={error} onBack={() => setCurrentView(AppView.COOKING_METHOD)} onExploreClick={() => setCurrentView(AppView.EXPLORE)} freeUsageCount={usageCount} maxFreeUses={MAX_FREE_USES} isPro={isPro} />}
      
      {currentView === AppView.EXPLORE && <ExploreScreen onBack={() => setCurrentView(AppView.UPLOAD)} onSelectCategory={handleSelectCategory} isPro={isPro} usageCount={usageCount} maxFreeUses={MAX_FREE_USES} unlockedPacks={unlockedPacks} />}
      
      {currentView === AppView.SHOPPING_LIST && <ShoppingListScreen items={shoppingList} onAddItem={() => {}} onToggleItem={() => {}} onRemoveItem={() => {}} onEditItem={() => {}} onClearList={() => {}} onBack={() => setCurrentView(lastMainView)} />}
      
      {currentView === AppView.PROFILE && (
        <ProfileScreen 
            userProfile={safeUserProfile} 
            pantryItems={pantryItems} 
            onUpdatePantry={handleUpdatePantry} 
            onSaveProfile={handleSaveMember} 
            onBack={() => setCurrentView(AppView.UPLOAD)} 
            favorites={favoriteRecipes} 
            onSelectRecipe={r => { setSelectedRecipe(r); setCurrentView(AppView.RECIPE_DETAIL); }} 
            initialTab={profileInitialTab} 
            onLogout={handleLogout} 
            recipesCount={cookedHistory.length} 
            isAdmin={isAdmin && !isDemoMode} 
            onOpenAdmin={() => setCurrentView(AppView.ADMIN_PANEL)}
        />
      )}
      
      {currentView === AppView.ADMIN_PANEL && !isDemoMode && <AdminPanel onBack={() => setCurrentView(AppView.PROFILE)} currentUserEmail={user?.email} showToast={showToast} />}

      {currentView === AppView.TERMS && <TermsScreen onBack={() => setCurrentView(AppView.LANDING)} />}
      {currentView === AppView.PRIVACY && <PrivacyScreen onBack={() => setCurrentView(AppView.LANDING)} />}

      {currentView === AppView.ANALYZING && <LoadingScreen imagePreview={imagePreview} mode={loadingMode} />}
      {currentView === AppView.RESULTS && scanResult && <ScanResults result={scanResult} onFindRecipes={handleFindRecipes} onRetake={() => setCurrentView(AppView.UPLOAD)} />}
      {currentView === AppView.RECIPES && <RecipeList recipes={recipes} onBack={() => setCurrentView(AppView.EXPLORE)} onSelectRecipe={r => { setSelectedRecipe(r); setCurrentView(AppView.RECIPE_DETAIL); }} favorites={favoriteRecipes} onToggleFavorite={handleToggleFavorite} cookingMethod={cookingMethod} />}
      {currentView === AppView.RECIPE_DETAIL && selectedRecipe && <RecipeDetail recipe={selectedRecipe} onBack={() => setCurrentView(AppView.RECIPES)} isFavorite={favoriteRecipes.some(r => r.title === selectedRecipe.title)} onToggleFavorite={() => handleToggleFavorite(selectedRecipe)} onRate={() => {}} shoppingList={shoppingList} onAddToShoppingList={() => {}} cookingMethod={cookingMethod} onFinishCooking={() => handleFinishCooking(selectedRecipe)} />}

      {showBottomMenu && <BottomMenu currentView={currentView} activeTab={profileInitialTab} onNavigate={(v, tab) => { if (tab) setProfileInitialTab(tab); setCurrentView(v); }} />}
    </div>
  );
}

export default App;
