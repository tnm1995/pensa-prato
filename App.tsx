
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
const XP_PER_LEVEL = 500;

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
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [pantryItems, setPantryItems] = useState<string[]>([]);
  const [wasteStats, setWasteStats] = useState<WasteStats>({ 
    kgSaved: 0, 
    moneySaved: 0, 
    recipesCompleted: 0, 
    badges: [],
    xp: 0,
    level: 1,
    streak: 0
  });
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

  const [recipeOriginView, setRecipeOriginView] = useState<AppView>(AppView.RECIPES);

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
                    badges: data?.badges || [],
                    xp: data?.xp || 0,
                    level: data?.level || 1,
                    streak: data?.streak || 0,
                    lastCookedDate: data?.lastCookedDate
                  });
              }
           }));
           unsubs.current.push(onSnapshot(collection(db, 'users', currentUser.uid, 'family'), (snap: any) => setFamilyMembers(snap.docs.map((d: any) => ({ ...d.data(), id: d.id })))));
           unsubs.current.push(onSnapshot(collection(db, 'users', currentUser.uid, 'favorites'), (snap: any) => setFavoriteRecipes(snap.docs.map((d: any) => d.data()))));
           unsubs.current.push(onSnapshot(doc(db, 'users', currentUser.uid, 'settings', 'pantry'), (docSnap: any) => {
               if (docSnap.exists) setPantryItems(docSnap.data().items || []);
           }));
           unsubs.current.push(onSnapshot(doc(db, 'users', currentUser.uid, 'settings', 'shoppingList'), (docSnap: any) => {
               if (docSnap.exists) setShoppingList(docSnap.data().items || []);
           }));
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setIsAuthChecking(false);
    });
    return () => { unsubscribe(); unsubs.current.forEach(u => u()); };
  }, []);

  const handleFinishCooking = async (recipe: Recipe) => {
    if (!user || !db) return;
    try {
        const kgAdded = 0.45; 
        const moneyAdded = 18.50; 
        const xpAdded = 100 + (recipe.used_ingredients.length * 10);
        
        const newTotalCompleted = wasteStats.recipesCompleted + 1;
        const newKg = wasteStats.kgSaved + kgAdded;
        const newMoney = wasteStats.moneySaved + moneyAdded;
        const newXpTotal = (wasteStats.xp || 0) + xpAdded;
        const newLevel = Math.floor(newXpTotal / XP_PER_LEVEL) + 1;

        // Gerenciar Streak
        let newStreak = wasteStats.streak || 0;
        const today = new Date().toISOString().split('T')[0];
        const lastDate = wasteStats.lastCookedDate;

        if (!lastDate) {
            newStreak = 1;
        } else {
            const last = new Date(lastDate);
            const curr = new Date(today);
            const diffTime = Math.abs(curr.getTime() - last.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                newStreak += 1;
            } else if (diffDays > 1) {
                newStreak = 1;
            }
        }
        
        const newBadges = [...wasteStats.badges];
        if (newTotalCompleted === 1 && !newBadges.includes('aprendiz')) newBadges.push('aprendiz');
        if (newTotalCompleted === 5 && !newBadges.includes('consciente')) newBadges.push('consciente');
        if (newLevel > wasteStats.level) {
            showToast(`🎉 UAU! Você subiu para o Nível ${newLevel}!`, "success");
        }

        await updateDoc(doc(db, 'users', user.uid), {
            kgSaved: newKg,
            moneySaved: newMoney,
            recipesCompleted: newTotalCompleted,
            badges: newBadges,
            xp: newXpTotal,
            level: newLevel,
            streak: newStreak,
            lastCookedDate: today
        });

        await addDoc(collection(db, 'users', user.uid, 'history'), {
            ...recipe,
            cookedAt: new Date(),
            xpGained: xpAdded
        });

        showToast(`+${xpAdded} XP! Sua cozinha está evoluindo 🚀`, "success");
    } catch (e) { console.error(e); }
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

  const parseQty = (qty: string): { val: number, unit: string } => {
    if (!qty) return { val: 1, unit: 'x' };
    const clean = qty.trim().replace(',', '.');
    const unitMatch = clean.match(/[a-zA-ZÀ-ÿ]+/);
    const unit = unitMatch ? unitMatch[0] : 'x';
    let val = 0;
    if (clean.includes(' ') && clean.includes('/')) {
        const [w, f] = clean.split(/\s+/);
        const [n, d] = f.split('/').map(Number);
        val = Number(w) + (n / d);
    } else if (clean.includes('/')) {
        const [n, d] = clean.split('/').map(Number);
        val = n / d;
    } else {
        val = parseFloat(clean) || 1;
    }
    return { val, unit };
  };

  const formatJoinedQty = (val: number, unit: string): string => {
      if (Number.isInteger(val)) return `${val}${unit === 'x' ? 'x' : unit}`;
      const whole = Math.floor(val);
      const frac = val - whole;
      let fStr = "";
      if (Math.abs(frac - 0.5) < 0.1) fStr = "1/2";
      else if (Math.abs(frac - 0.25) < 0.1) fStr = "1/4";
      else if (Math.abs(frac - 0.75) < 0.1) fStr = "3/4";
      else fStr = frac.toFixed(1);
      
      if (whole > 0) return `${whole} ${fStr}${unit === 'x' ? 'x' : unit}`;
      return `${fStr}${unit === 'x' ? 'x' : unit}`;
  };

  const handleAddItem = async (name: string, quantity?: string) => {
      const normalizedName = name.toLowerCase().trim();
      const existingIdx = shoppingList.findIndex(i => i.name.toLowerCase().trim() === normalizedName && !i.checked);

      let newList;
      if (existingIdx > -1) {
          const existing = shoppingList[existingIdx];
          const old = parseQty(existing.quantity || "1x");
          const added = parseQty(quantity || "1x");
          const combinedVal = old.val + added.val;
          const newQtyStr = formatJoinedQty(combinedVal, old.unit);

          newList = [...shoppingList];
          newList[existingIdx] = { ...existing, quantity: newQtyStr };
          showToast(`Quantidade de ${name} atualizada na lista!`, "info");
      } else {
          const newItem: ShoppingItem = { id: Date.now().toString(), name, quantity, checked: false };
          newList = [newItem, ...shoppingList];
          showToast(`Adicionado: ${name}`, "success");
      }

      setShoppingList(newList);
      if (user && db) await setDoc(doc(db, 'users', user.uid, 'settings', 'shoppingList'), { items: newList });
  };

  const showBottomMenu = [
    AppView.UPLOAD,
    AppView.SHOPPING_LIST,
    AppView.FAVORITES,
    AppView.PROFILE,
    AppView.EXPLORE,
    AppView.RECIPES,
    AppView.WELCOME
  ].includes(currentView);

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
      {currentView === AppView.PROFILE_EDITOR && <ProfileEditorScreen initialMember={editingMember || undefined} onSave={(m) => { handleSaveMember(m); }} onCancel={() => { setEditingMember(null); setCurrentView(AppView.FAMILY_SELECTION); }} onDelete={(id) => { handleDeleteMember(id); }} />}
      {currentView === AppView.COOKING_METHOD && <CookingMethodScreen onSelectMethod={(m) => { setCookingMethod(m); setCurrentView(AppView.UPLOAD); }} onBack={() => setCurrentView(AppView.FAMILY_SELECTION)} />}
      
      {currentView === AppView.UPLOAD && <UploadScreen onFileSelected={handleFileSelect} onProfileClick={() => setCurrentView(AppView.PROFILE)} activeProfiles={activeProfiles} cookingMethod={cookingMethod} onChangeContext={() => setCurrentView(AppView.WELCOME)} freeUsageCount={usageCount} maxFreeUses={MAX_FREE_USES} isPro={isPro} onBack={() => setCurrentView(AppView.WELCOME)} onExploreClick={() => setCurrentView(AppView.EXPLORE)} />}
      
      {currentView === AppView.EXPLORE && <ExploreScreen onBack={() => setCurrentView(AppView.UPLOAD)} onSelectCategory={(cat) => handleSelectCategory(cat)} isPro={isPro} usageCount={usageCount} maxFreeUses={MAX_FREE_USES} unlockedPacks={[]} />}
      
      {currentView === AppView.SHOPPING_LIST && <ShoppingListScreen items={shoppingList} onAddItem={(n, q) => handleAddItem(n, q)} onToggleItem={(id) => handleToggleItem(id)} onRemoveItem={(id) => handleRemoveItem(id)} onEditItem={(id, n, q) => handleEditItem(id, n, q)} onClearList={() => handleClearList()} onBack={() => setCurrentView(AppView.UPLOAD)} />}
      
      {currentView === AppView.FAVORITES && <RecipeList recipes={favoriteRecipes} onBack={() => setCurrentView(AppView.UPLOAD)} onSelectRecipe={r => { setSelectedRecipe(r); setRecipeOriginView(AppView.FAVORITES); setCurrentView(AppView.RECIPE_DETAIL); }} favorites={favoriteRecipes} onToggleFavorite={(r) => handleToggleFavorite(r)} isExplore={true} />}

      {currentView === AppView.PROFILE && <ProfileScreen userProfile={familyMembers.find(f => f.id === 'primary') || familyMembers[0]} wasteStats={wasteStats} pantry={pantryItems} onUpdatePantry={(items) => updateDoc(doc(db, 'users', user.uid, 'settings', 'pantry'), { items })} onSaveProfile={() => {}} onBack={() => setCurrentView(AppView.UPLOAD)} onLogout={() => handleLogout()} isAdmin={isAdmin} onAdminClick={() => setCurrentView(AppView.ADMIN_PANEL)} />}

      {currentView === AppView.ADMIN_PANEL && <AdminPanel onBack={() => setCurrentView(AppView.PROFILE)} currentUserEmail={user?.email} showToast={showToast} />}
      
      {currentView === AppView.ANALYZING && <LoadingScreen imagePreview={imagePreview} mode={loadingMode} />}
      {currentView === AppView.RESULTS && scanResult && <ScanResults result={scanResult} onFindRecipes={(ings) => handleFindRecipes(ings)} onRetake={() => setCurrentView(AppView.UPLOAD)} />}
      {currentView === AppView.RECIPES && <RecipeList recipes={recipes} onBack={() => setCurrentView(AppView.UPLOAD)} onSelectRecipe={r => { setSelectedRecipe(r); setRecipeOriginView(AppView.RECIPES); setCurrentView(AppView.RECIPE_DETAIL); }} favorites={favoriteRecipes} onToggleFavorite={(r) => handleToggleFavorite(r)} />}
      {currentView === AppView.RECIPE_DETAIL && selectedRecipe && <RecipeDetail recipe={selectedRecipe} onBack={() => setCurrentView(recipeOriginView)} isFavorite={favoriteRecipes.some(f => f.title === selectedRecipe.title)} onToggleFavorite={() => handleToggleFavorite(selectedRecipe)} onRate={() => {}} shoppingList={shoppingList} onAddToShoppingList={(n, q) => handleAddItem(n, q)} onFinishCooking={() => handleFinishCooking(selectedRecipe)} />}

      {showBottomMenu && <BottomMenu currentView={currentView} onNavigate={(v) => setCurrentView(v)} />}
    </div>
  );

  async function handleSelectCategory(category: string) {
    setLoadingMode('recipes');
    setCurrentView(AppView.ANALYZING);
    try {
        const catRecipes = await generateRecipesByCategory(category, activeProfiles, cookingMethod);
        setRecipes(catRecipes);
        setCurrentView(AppView.RECIPES);
    } catch (err) {
        setCurrentView(AppView.EXPLORE);
        showToast("Erro ao carregar categoria.", "error");
    }
  }

  async function handleToggleFavorite(recipe: Recipe) {
    if (!user || !db) return;
    const isFav = favoriteRecipes.some(f => f.title === recipe.title);
    try {
        const favRef = doc(db, 'users', user.uid, 'favorites', recipe.title.replace(/\//g, '-'));
        if (isFav) {
            await deleteDoc(favRef);
            showToast("Removido dos favoritos.");
        } else {
            await setDoc(favRef, recipe);
            showToast("Adicionado aos favoritos!", "success");
        }
    } catch (e) { console.error(e); }
  }

  async function handleToggleItem(id: string) {
      const newList = shoppingList.map(i => i.id === id ? { ...i, checked: !i.checked } : i);
      setShoppingList(newList);
      if (user && db) await setDoc(doc(db, 'users', user.uid, 'settings', 'shoppingList'), { items: newList });
  }

  async function handleRemoveItem(id: string) {
      const newList = shoppingList.filter(i => i.id !== id);
      setShoppingList(newList);
      if (user && db) await setDoc(doc(db, 'users', user.uid, 'settings', 'shoppingList'), { items: newList });
  }

  async function handleEditItem(id: string, name: string, quantity: string) {
      const newList = shoppingList.map(i => i.id === id ? { ...i, name, quantity } : i);
      setShoppingList(newList);
      if (user && db) await setDoc(doc(db, 'users', user.uid, 'settings', 'shoppingList'), { items: newList });
  }

  async function handleClearList() {
      if (confirm("Deseja limpar toda a sua lista?")) {
          setShoppingList([]);
          if (user && db) await setDoc(doc(db, 'users', user.uid, 'settings', 'shoppingList'), { items: [] });
      }
  }

  async function handleSaveMember(member: FamilyMember) {
    if (!user || !db) return;
    try {
        const familyRef = collection(db, 'users', user.uid, 'family');
        if (member.id && !member.id.startsWith('temp-')) {
            await setDoc(doc(familyRef, member.id), member, { merge: true });
        } else {
            const { id, ...data } = member;
            await addDoc(familyRef, data);
        }
        setEditingMember(null);
        setCurrentView(AppView.FAMILY_SELECTION);
    } catch (e) { showToast("Erro ao salvar.", "error"); }
  }

  async function handleDeleteMember(id: string) {
      if (!user || !db) return;
      try {
          await deleteDoc(doc(db, 'users', user.uid, 'family', id));
          setCurrentView(AppView.FAMILY_SELECTION);
      } catch (e) { showToast("Erro ao remover.", "error"); }
  }

  async function handleLogout() {
      try { await signOut(auth); setCurrentView(AppView.LANDING); } catch (e) { console.error(e); }
  }

  async function handleFindRecipes(confirmedIngredients: string[]) {
    setLoadingMode('recipes');
    setCurrentView(AppView.ANALYZING); 
    try {
        const suggestions = await generateRecipes(confirmedIngredients, activeProfiles, cookingMethod, pantryItems);
        setRecipes(suggestions);
        setCurrentView(AppView.RECIPES);
    } catch(err) { setCurrentView(AppView.RESULTS); }
  }
}

export default App;
