
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
const SESSION_KEY = 'pp_session_state';
const DEFAULT_CHECKOUT_PRO = "https://pay.hotmart.com/SEU_LINK_PRO_AQUI"; 
const DEFAULT_CHECKOUT_PACK = "https://pay.hotmart.com/SEU_LINK_PACK_GENERICO"; 

// Helper para redimensionar imagem antes de salvar no sessionStorage (evita estouro de 5MB)
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compressão de 70%
      };
    };
  });
};

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
    try { return localStorage.getItem('pp_demo_mode') === 'true'; } catch { return false; }
  });

  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
  };
  
  const isDemoModeRef = useRef(isDemoMode);
  useEffect(() => { isDemoModeRef.current = isDemoMode; }, [isDemoMode]);
  useEffect(() => { localStorage.setItem('pp_usage_count', usageCount.toString()); }, [usageCount]);

  const isLoggingOut = useRef(false);
  const unsubs = useRef<(() => void)[]>([]);
  const [loadingMode, setLoadingMode] = useState<'analyzing' | 'recipes'>('analyzing');
  const [memberToEdit, setMemberToEdit] = useState<FamilyMember | undefined>(undefined);
  const [editingReturnView, setEditingReturnView] = useState<AppView>(AppView.FAMILY_SELECTION);
  const [profileInitialTab, setProfileInitialTab] = useState<'history' | 'favorites' | 'settings'>('settings');

  // --- PERSISTÊNCIA DE SESSÃO (F5) ---
  useEffect(() => {
    const savedState = sessionStorage.getItem(SESSION_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.currentView) setCurrentView(parsed.currentView);
        if (parsed.scanResult) setScanResult(parsed.scanResult);
        if (parsed.recipes) setRecipes(parsed.recipes);
        if (parsed.imagePreview) setImagePreview(parsed.imagePreview);
        if (parsed.activeProfiles) setActiveProfiles(parsed.activeProfiles);
        if (parsed.cookingMethod) setCookingMethod(parsed.cookingMethod);
      } catch (e) { console.error("Erro ao restaurar sessão:", e); }
    }
  }, []);

  useEffect(() => {
    const viewsToIgnore = [AppView.LANDING, AppView.LOGIN, AppView.REGISTER, AppView.COMPLETE_PROFILE];
    if (!viewsToIgnore.includes(currentView)) {
        const stateToSave = { currentView, scanResult, recipes, imagePreview, activeProfiles, cookingMethod };
        try {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(stateToSave));
        } catch (e) {
          console.warn("SessionStorage limit reached, partial save.");
        }
    }
  }, [currentView, scanResult, recipes, imagePreview, activeProfiles, cookingMethod]);

  const clearListeners = () => {
      unsubs.current.forEach(u => u());
      unsubs.current = [];
  };

  const safeMapDocs = (snap: any, mapper: (doc: any) => any) => {
    if (snap && snap.docs) return snap.docs.map(mapper);
    return [];
  };

  const handleError = (err: any) => {
    if (err.code === 'permission-denied') {
        console.warn("Firestore: Permissão aguardando propagação ou negada temporariamente.");
    } else {
        console.error("Firestore Error:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: any) => {
      clearListeners();
      if (currentUser) {
        setUser(currentUser);
        setIsDemoMode(false);
        if (db) {
           const userDocRef = doc(db, 'users', currentUser.uid);
           
           // Listener principal de usuário
           const unsubUser = onSnapshot(userDocRef, (docSnap: any) => {
              if (isLoggingOut.current) return;
              const hasDoc = docSnap && (typeof docSnap.exists === 'function' ? docSnap.exists() : docSnap.exists);
              
              if (hasDoc) {
                  const data = typeof docSnap.data === 'function' ? docSnap.data() : docSnap.data;
                  setIsAdmin(data?.isAdmin === true);
                  setIsPro(data?.isPro === true);

                  setCurrentView((prev) => {
                      const isContentPrivileged = [AppView.RECIPES, AppView.RESULTS, AppView.ANALYZING, AppView.UPLOAD, AppView.EXPLORE, AppView.PROFILE, AppView.SHOPPING_LIST].includes(prev);
                      if (isContentPrivileged) return prev;
                      if (!data?.cpf) return AppView.COMPLETE_PROFILE;
                      if ([AppView.LANDING, AppView.LOGIN, AppView.REGISTER].includes(prev)) return AppView.WELCOME;
                      return prev;
                  });

                  // Só inscreve nos outros se o doc de usuário já existir
                  if (unsubs.current.length < 2) {
                    unsubs.current.push(onSnapshot(collection(db, 'users', currentUser.uid, 'family'), (snap: any) => setFamilyMembers(safeMapDocs(snap, d => ({ ...d.data(), id: d.id } as FamilyMember))), handleError));
                    unsubs.current.push(onSnapshot(collection(db, 'users', currentUser.uid, 'favorites'), (s: any) => setFavoriteRecipes(safeMapDocs(s, d => ({ ...d.data(), _firestoreId: d.id } as unknown as Recipe))), handleError));
                    unsubs.current.push(onSnapshot(collection(db, 'users', currentUser.uid, 'history'), (s: any) => setCookedHistory(safeMapDocs(s, d => d.data() as Recipe)), handleError));
                    unsubs.current.push(onSnapshot(collection(db, 'users', currentUser.uid, 'shopping'), (s: any) => setShoppingList(safeMapDocs(s, d => ({ ...d.data(), id: d.id } as ShoppingItem))), handleError));
                    unsubs.current.push(onSnapshot(doc(db, 'users', currentUser.uid, 'settings', 'pantry'), (s: any) => {
                        const d = typeof s.data === 'function' ? s.data() : s.data;
                        setPantryItems(d ? d.items || [] : []);
                    }, handleError));
                  }
              } else {
                  // Documento não existe ainda (novo usuário)
                  setCurrentView(AppView.COMPLETE_PROFILE);
              }
           }, handleError);
           unsubs.current.push(unsubUser);
        }
      } else {
        setUser(null);
        if (!isDemoModeRef.current) setCurrentView(prev => (prev === AppView.TERMS || prev === AppView.PRIVACY) ? prev : AppView.LANDING);
      }
      setIsAuthChecking(false);
    });
    return () => { unsubscribe(); clearListeners(); };
  }, []);

  const handleLogout = async () => {
      isLoggingOut.current = true;
      clearListeners();
      sessionStorage.removeItem(SESSION_KEY);
      try {
          setUser(null); 
          setIsDemoMode(false);
          setCurrentView(AppView.LANDING);
          await signOut(auth);
      } catch (e) { console.error(e); } finally { isLoggingOut.current = false; }
  };
  
  const handleFileSelect = async (file: File) => {
    if (!user && !isDemoMode) return;
    if (!isPro && usageCount >= MAX_FREE_USES) { setPaywallContext({ type: 'general' }); setShowPaywall(true); return; }
    
    setLoadingMode('analyzing');
    setCurrentView(AppView.ANALYZING);

    try {
      // 1. Comprimir imagem para persistência
      const compressedBase64 = await compressImage(file);
      setImagePreview(compressedBase64);

      // 2. Analisar
      const result = await analyzeFridgeImage(file);
      setScanResult(result);
      setCurrentView(AppView.RESULTS);
      if (!isPro) setUsageCount(prev => prev + 1);
    } catch (err: any) {
      setError(err.message || "Erro na análise.");
      setCurrentView(AppView.UPLOAD);
    }
  };

  const handleUpdatePantry = async (items: string[]) => {
    if (!user || !db) return;
    try { await setDoc(doc(db, 'users', user.uid, 'settings', 'pantry'), { items }); } catch(e) { console.error(e); }
  };

  const handleSaveMember = async (memberToSave: FamilyMember) => {
    if (isDemoMode) {
      setFamilyMembers(prev => prev.some(m => m.id === memberToSave.id) ? prev.map(m => m.id === memberToSave.id ? memberToSave : m) : [...prev, { ...memberToSave, id: Date.now().toString() }]);
      setCurrentView(editingReturnView);
      return;
    }
    if (!user || !db) return;
    try {
        const isNew = !memberToSave.id || memberToSave.id.startsWith('temp-');
        if (memberToSave.id === 'primary') await setDoc(doc(db, 'users', user.uid, 'family', 'primary'), memberToSave, { merge: true });
        else if (!isNew) await setDoc(doc(db, 'users', user.uid, 'family', memberToSave.id), memberToSave, { merge: true });
        else { const { id, ...data } = memberToSave; await addDoc(collection(db, 'users', user.uid, 'family'), data); }
        showToast("Perfil salvo!", "success");
    } catch (e) { console.error(e); }
    setCurrentView(editingReturnView);
  };

  const handleToggleFavorite = async (recipe: Recipe) => {
    if (isDemoMode) {
        setFavoriteRecipes(prev => prev.some(r => r.title === recipe.title) ? prev.filter(r => r.title !== recipe.title) : [...prev, recipe]);
        return;
    }
    if (!user || !db) return;
    try {
        const existing = favoriteRecipes.find(r => r.title === recipe.title);
        if (existing) { const docId = (existing as any)._firestoreId; if (docId) await deleteDoc(doc(db, 'users', user.uid, 'favorites', docId)); }
        else { await addDoc(collection(db, 'users', user.uid, 'favorites'), { ...recipe, image: recipe.image || '' }); }
    } catch (e) { console.error(e); }
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
      try { await updateDoc(doc(db, 'users', user.uid), { isPro: true }); setShowPaywall(false); showToast("Bem-vindo ao PRO! 👑", "success"); } catch (e) { console.error(e); }
  };

  const safeUserProfile = familyMembers.find(m => m.id === 'primary') || familyMembers[0] || { name: user?.displayName || 'Você', id: 'primary', restrictions: [], dislikes: '' };
  const showBottomMenu = ![AppView.LANDING, AppView.LOGIN, AppView.REGISTER, AppView.FORGOT_PASSWORD, AppView.COMPLETE_PROFILE, AppView.ANALYZING, AppView.RECIPE_DETAIL, AppView.PROFILE_EDITOR, AppView.ADMIN_PANEL].includes(currentView);

  if (isAuthChecking) return <SplashScreen />;

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-900 relative">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      <SubscriptionModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} onSubscribe={handleSubscribe} onBuyPack={() => {}} context={paywallContext} checkoutUrlProMonthly={checkoutConfig.proMonthlyUrl} checkoutUrlProAnnual={checkoutConfig.proAnnualUrl} checkoutUrlPack={DEFAULT_CHECKOUT_PACK} />

      {currentView === AppView.LANDING && <LandingPage onLogin={() => setCurrentView(AppView.LOGIN)} onStartTest={() => setCurrentView(AppView.REGISTER)} onTermsClick={() => setCurrentView(AppView.TERMS)} onPrivacyClick={() => setCurrentView(AppView.PRIVACY)} customSocialProofs={customSocialProofs} />}
      {currentView === AppView.LOGIN && <LoginScreen onLoginSuccess={() => {}} onNavigateToRegister={() => setCurrentView(AppView.REGISTER)} onNavigateToForgotPassword={() => setCurrentView(AppView.FORGOT_PASSWORD)} />}
      {currentView === AppView.REGISTER && <RegisterScreen onRegisterSuccess={() => setCurrentView(AppView.WELCOME)} onNavigateToLogin={() => setCurrentView(AppView.LOGIN)} />}
      {currentView === AppView.FORGOT_PASSWORD && <ForgotPasswordScreen onBack={() => setCurrentView(AppView.LOGIN)} />}
      {currentView === AppView.COMPLETE_PROFILE && user && <CompleteProfileScreen onCompleteSuccess={() => setCurrentView(AppView.WELCOME)} initialName={user.displayName} initialEmail={user.email} onBack={handleLogout} />}

      {currentView === AppView.WELCOME && <WelcomeScreen onSelectAny={() => { setActiveProfiles([]); setCurrentView(AppView.COOKING_METHOD); }} onSelectFamily={() => setCurrentView(AppView.FAMILY_SELECTION)} />}
      {currentView === AppView.FAMILY_SELECTION && <FamilySelectionScreen members={familyMembers} selectedMembers={activeProfiles} onToggleMember={m => setActiveProfiles(p => p.some(x => x.id === m.id) ? p.filter(x => x.id !== m.id) : [...p, m])} onSelectAll={() => setActiveProfiles(activeProfiles.length === familyMembers.length ? [] : [...familyMembers])} onContinue={() => setCurrentView(AppView.COOKING_METHOD)} onEditMember={m => { setMemberToEdit(m); setEditingReturnView(AppView.FAMILY_SELECTION); setCurrentView(AppView.PROFILE_EDITOR); }} onAddNew={() => { setMemberToEdit(undefined); setEditingReturnView(AppView.FAMILY_SELECTION); setCurrentView(AppView.PROFILE_EDITOR); }} onBack={() => setCurrentView(AppView.WELCOME)} />}
      {currentView === AppView.COOKING_METHOD && <CookingMethodScreen onSelectMethod={m => { setCookingMethod(m); setCurrentView(AppView.UPLOAD); }} onBack={() => setCurrentView(activeProfiles.length > 0 ? AppView.FAMILY_SELECTION : AppView.WELCOME)} />}
      {currentView === AppView.PROFILE_EDITOR && <ProfileEditorScreen initialMember={memberToEdit} onSave={handleSaveMember} onCancel={() => setCurrentView(editingReturnView)} />}
      {currentView === AppView.UPLOAD && <UploadScreen onFileSelected={handleFileSelect} onProfileClick={() => setCurrentView(AppView.PROFILE)} activeProfiles={activeProfiles} cookingMethod={cookingMethod} onChangeContext={() => setCurrentView(AppView.WELCOME)} error={error} onBack={() => setCurrentView(AppView.COOKING_METHOD)} onExploreClick={() => setCurrentView(AppView.EXPLORE)} freeUsageCount={usageCount} maxFreeUses={MAX_FREE_USES} isPro={isPro} />}
      {currentView === AppView.EXPLORE && <ExploreScreen onBack={() => setCurrentView(AppView.UPLOAD)} onSelectCategory={handleSelectCategory} isPro={isPro} usageCount={usageCount} maxFreeUses={MAX_FREE_USES} unlockedPacks={unlockedPacks} />}
      {currentView === AppView.SHOPPING_LIST && <ShoppingListScreen items={shoppingList} onAddItem={() => {}} onToggleItem={() => {}} onRemoveItem={() => {}} onEditItem={() => {}} onClearList={() => {}} onBack={() => setCurrentView(lastMainView)} />}
      {currentView === AppView.PROFILE && <ProfileScreen userProfile={safeUserProfile} pantryItems={pantryItems} onUpdatePantry={handleUpdatePantry} onSaveProfile={handleSaveMember} onBack={() => setCurrentView(AppView.UPLOAD)} favorites={favoriteRecipes} onSelectRecipe={r => { setSelectedRecipe(r); setCurrentView(AppView.RECIPE_DETAIL); }} initialTab={profileInitialTab} onLogout={handleLogout} recipesCount={cookedHistory.length} isAdmin={isAdmin} onOpenAdmin={() => setCurrentView(AppView.ADMIN_PANEL)} />}
      {currentView === AppView.ADMIN_PANEL && <AdminPanel onBack={() => setCurrentView(AppView.PROFILE)} currentUserEmail={user?.email} showToast={showToast} />}
      {currentView === AppView.TERMS && <TermsScreen onBack={() => setCurrentView(AppView.LANDING)} />}
      {currentView === AppView.PRIVACY && <PrivacyScreen onBack={() => setCurrentView(AppView.LANDING)} />}

      {currentView === AppView.ANALYZING && <LoadingScreen imagePreview={imagePreview} mode={loadingMode} />}
      {currentView === AppView.RESULTS && scanResult && <ScanResults result={scanResult} onFindRecipes={handleFindRecipes} onRetake={() => { sessionStorage.removeItem(SESSION_KEY); setCurrentView(AppView.UPLOAD); }} />}
      {currentView === AppView.RECIPES && <RecipeList recipes={recipes} onBack={() => setCurrentView(AppView.EXPLORE)} onSelectRecipe={r => { setSelectedRecipe(r); setCurrentView(AppView.RECIPE_DETAIL); }} favorites={favoriteRecipes} onToggleFavorite={handleToggleFavorite} cookingMethod={cookingMethod} />}
      {currentView === AppView.RECIPE_DETAIL && selectedRecipe && <RecipeDetail recipe={selectedRecipe} onBack={() => setCurrentView(AppView.RECIPES)} isFavorite={favoriteRecipes.some(r => r.title === selectedRecipe.title)} onToggleFavorite={() => handleToggleFavorite(selectedRecipe)} onRate={() => {}} shoppingList={shoppingList} onAddToShoppingList={() => {}} cookingMethod={cookingMethod} />}

      {showBottomMenu && <BottomMenu currentView={currentView} activeTab={profileInitialTab} onNavigate={(v, tab) => { if (tab) setProfileInitialTab(tab); setCurrentView(v); }} />}
    </div>
  );
}

export default App;
