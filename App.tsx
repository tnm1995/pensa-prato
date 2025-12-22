
import React, { useState, useEffect, useRef } from 'react';
import { AppView, FamilyMember, CookingMethod, ShoppingItem, Recipe, ScanResult, SocialProof, WasteStats } from './types';
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
        if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } }
        else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    };
  });
};

function App() {
  const [user, setUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [pantryItems, setPantryItems] = useState<string[]>([]);
  const [wasteStats, setWasteStats] = useState<WasteStats>({ kgSaved: 0, moneySaved: 0, recipesCompleted: 0, badges: [] });
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [activeProfiles, setActiveProfiles] = useState<FamilyMember[]>([]);
  const [cookingMethod, setCookingMethod] = useState<CookingMethod>(CookingMethod.ANY);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState(() => parseInt(localStorage.getItem('pp_usage_count') || '0'));
  const [isPro, setIsPro] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
  };
  
  const unsubs = useRef<(() => void)[]>([]);
  const [loadingMode, setLoadingMode] = useState<'analyzing' | 'recipes'>('analyzing');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: any) => {
      unsubs.current.forEach(u => u());
      unsubs.current = [];
      if (currentUser) {
        setUser(currentUser);
        if (db) {
           const userDocRef = doc(db, 'users', currentUser.uid);
           unsubs.current.push(onSnapshot(userDocRef, (docSnap: any) => {
              if (docSnap && docSnap.exists) {
                  const data = docSnap.data();
                  setIsAdmin(data?.isAdmin === true);
                  setIsPro(data?.isPro === true);
                  setWasteStats({
                    kgSaved: data?.kgSaved || 0,
                    moneySaved: data?.moneySaved || 0,
                    recipesCompleted: data?.recipesCompleted || 0,
                    badges: data?.badges || []
                  });
              }
           }));
           unsubs.current.push(onSnapshot(collection(db, 'users', currentUser.uid, 'family'), (snap: any) => setFamilyMembers(snap.docs.map((d: any) => ({ ...d.data(), id: d.id })))));
           unsubs.current.push(onSnapshot(collection(db, 'users', currentUser.uid, 'favorites'), (snap: any) => setFavoriteRecipes(snap.docs.map((d: any) => d.data()))));
           unsubs.current.push(onSnapshot(doc(db, 'users', currentUser.uid, 'settings', 'pantry'), (docSnap: any) => {
               if (docSnap && docSnap.exists) setPantryItems(docSnap.data().items || []);
           }));
        }
      } else {
        setUser(null);
      }
      setIsAuthChecking(false);
    });
    return () => { unsubscribe(); unsubs.current.forEach(u => u()); };
  }, []);

  const handleSaveMember = async (member: FamilyMember) => {
    if (!user || !db) return;
    try {
        const familyRef = collection(db, 'users', user.uid, 'family');
        if (member.id && !member.id.startsWith('temp-')) {
            // Edição de membro existente
            await setDoc(doc(familyRef, member.id), member, { merge: true });
            showToast("Perfil atualizado!", "success");
        } else {
            // Novo membro
            const { id, ...data } = member;
            await addDoc(familyRef, data);
            showToast("Novo perfil adicionado!", "success");
        }
        setEditingMember(null);
        setCurrentView(AppView.FAMILY_SELECTION);
    } catch (e) {
        console.error(e);
        showToast("Erro ao salvar perfil.", "error");
    }
  };

  const handleDeleteMember = async (id: string) => {
      if (!user || !db) return;
      try {
          await deleteDoc(doc(db, 'users', user.uid, 'family', id));
          showToast("Perfil removido.", "success");
          setCurrentView(AppView.FAMILY_SELECTION);
      } catch (e) {
          showToast("Erro ao remover.", "error");
      }
  };

  const handleFinishCooking = async (recipe: Recipe) => {
    if (!user || !db) return;
    try {
        const kgAdded = 0.45; 
        const moneyAdded = 18.50; 
        const newTotalCompleted = wasteStats.recipesCompleted + 1;
        const newKg = wasteStats.kgSaved + kgAdded;
        const newMoney = wasteStats.moneySaved + moneyAdded;
        
        const newBadges = [...wasteStats.badges];
        if (newTotalCompleted === 1 && !newBadges.includes('aprendiz')) newBadges.push('aprendiz');
        if (newTotalCompleted === 5 && !newBadges.includes('consciente')) newBadges.push('consciente');
        if (recipe.title.toLowerCase().includes('airfryer') && !newBadges.includes('airfryer_master')) newBadges.push('airfryer_master');

        await updateDoc(doc(db, 'users', user.uid), {
            kgSaved: newKg,
            moneySaved: newMoney,
            recipesCompleted: newTotalCompleted,
            badges: newBadges
        });

        await addDoc(collection(db, 'users', user.uid, 'history'), {
            ...recipe,
            cookedAt: new Date()
        });

        showToast("Impacto Zero Desperdício atualizado! 🌿", "success");
    } catch (e) { console.error(e); }
  };

  const handleLogout = async () => {
      try { await signOut(auth); setCurrentView(AppView.LANDING); } catch (e) { console.error(e); }
  };
  
  const handleFileSelect = async (file: File) => {
    if (!isPro && usageCount >= MAX_FREE_USES) { setShowPaywall(true); return; }
    setLoadingMode('analyzing');
    setCurrentView(AppView.ANALYZING);
    try {
      const compressedBase64 = await compressImage(file);
      setImagePreview(compressedBase64);
      const result = await analyzeFridgeImage(file);
      setScanResult(result);
      setCurrentView(AppView.RESULTS);
      if (!isPro) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem('pp_usage_count', newCount.toString());
      }
    } catch (err: any) {
      setError(err.message);
      setCurrentView(AppView.UPLOAD);
    }
  };

  const handleFindRecipes = async (confirmedIngredients: string[]) => {
    setLoadingMode('recipes');
    setCurrentView(AppView.ANALYZING); 
    try {
        const suggestions = await generateRecipes(confirmedIngredients, activeProfiles, cookingMethod, pantryItems);
        setRecipes(suggestions);
        setCurrentView(AppView.RECIPES);
    } catch(err) { setCurrentView(AppView.RESULTS); }
  };

  if (isAuthChecking) return <SplashScreen />;

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-900 relative">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      <SubscriptionModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} onSubscribe={() => {}} onBuyPack={() => {}} />

      {currentView === AppView.LANDING && <LandingPage onLogin={() => setCurrentView(AppView.LOGIN)} onStartTest={() => setCurrentView(AppView.REGISTER)} />}
      {currentView === AppView.LOGIN && <LoginScreen onLoginSuccess={() => setCurrentView(AppView.WELCOME)} onNavigateToRegister={() => setCurrentView(AppView.REGISTER)} onNavigateToForgotPassword={() => setCurrentView(AppView.FORGOT_PASSWORD)} />}
      {currentView === AppView.REGISTER && <RegisterScreen onRegisterSuccess={() => setCurrentView(AppView.WELCOME)} onNavigateToLogin={() => setCurrentView(AppView.LOGIN)} />}
      {currentView === AppView.WELCOME && <WelcomeScreen onSelectAny={() => setCurrentView(AppView.COOKING_METHOD)} onSelectFamily={() => setCurrentView(AppView.FAMILY_SELECTION)} />}
      {currentView === AppView.FAMILY_SELECTION && <FamilySelectionScreen members={familyMembers} selectedMembers={activeProfiles} onToggleMember={(m) => setActiveProfiles(prev => prev.some(p => p.id === m.id) ? prev.filter(p => p.id !== m.id) : [...prev, m])} onSelectAll={() => setActiveProfiles(familyMembers)} onContinue={() => setCurrentView(AppView.COOKING_METHOD)} onEditMember={(m) => { setEditingMember(m); setCurrentView(AppView.PROFILE_EDITOR); }} onAddNew={() => { setEditingMember(null); setCurrentView(AppView.PROFILE_EDITOR); }} onBack={() => setCurrentView(AppView.WELCOME)} />}
      {currentView === AppView.PROFILE_EDITOR && <ProfileEditorScreen initialMember={editingMember || undefined} onSave={handleSaveMember} onCancel={() => { setEditingMember(null); setCurrentView(AppView.FAMILY_SELECTION); }} onDelete={handleDeleteMember} />}
      {currentView === AppView.COOKING_METHOD && <CookingMethodScreen onSelectMethod={(m) => { setCookingMethod(m); setCurrentView(AppView.UPLOAD); }} onBack={() => setCurrentView(AppView.FAMILY_SELECTION)} />}
      {currentView === AppView.UPLOAD && <UploadScreen onFileSelected={handleFileSelect} onProfileClick={() => setCurrentView(AppView.PROFILE)} activeProfiles={activeProfiles} cookingMethod={cookingMethod} onChangeContext={() => setCurrentView(AppView.WELCOME)} freeUsageCount={usageCount} maxFreeUses={MAX_FREE_USES} isPro={isPro} onBack={() => setCurrentView(AppView.WELCOME)} onExploreClick={() => setCurrentView(AppView.EXPLORE)} />}
      {currentView === AppView.PROFILE && <ProfileScreen userProfile={familyMembers.find(f => f.id === 'primary') || familyMembers[0]} wasteStats={wasteStats} pantry={pantryItems} onUpdatePantry={(items) => updateDoc(doc(db, 'users', user.uid, 'settings', 'pantry'), { items })} onSaveProfile={() => {}} onBack={() => setCurrentView(AppView.UPLOAD)} onLogout={handleLogout} isAdmin={isAdmin} />}
      
      {currentView === AppView.ANALYZING && <LoadingScreen imagePreview={imagePreview} mode={loadingMode} />}
      {currentView === AppView.RESULTS && scanResult && <ScanResults result={scanResult} onFindRecipes={handleFindRecipes} onRetake={() => setCurrentView(AppView.UPLOAD)} />}
      {currentView === AppView.RECIPES && <RecipeList recipes={recipes} onBack={() => setCurrentView(AppView.UPLOAD)} onSelectRecipe={r => { setSelectedRecipe(r); setCurrentView(AppView.RECIPE_DETAIL); }} favorites={favoriteRecipes} onToggleFavorite={() => {}} />}
      {currentView === AppView.RECIPE_DETAIL && selectedRecipe && <RecipeDetail recipe={selectedRecipe} onBack={() => setCurrentView(AppView.RECIPES)} isFavorite={favoriteRecipes.some(f => f.title === selectedRecipe.title)} onToggleFavorite={() => {}} onRate={() => {}} shoppingList={[]} onAddToShoppingList={() => {}} onFinishCooking={() => handleFinishCooking(selectedRecipe)} />}

      <BottomMenu currentView={currentView} onNavigate={(v) => setCurrentView(v)} />
    </div>
  );
}

export default App;
