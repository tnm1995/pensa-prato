import React, { useState, useEffect, useRef } from 'react';
import { AppView, FamilyMember, CookingMethod, ShoppingItem, Recipe, ScanResult } from './types';
import { analyzeFridgeImage, generateRecipes, getMockScanResult, getMockRecipes } from './services/geminiService';
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

function App() {
  const [user, setUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [cookedHistory, setCookedHistory] = useState<Recipe[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [pantryItems, setPantryItems] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
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
  
  // Admin State - Controlled strictly by DB
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Initialize Demo Mode from local storage to persist across refreshes
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
  
  // Use a ref for isDemoMode to use inside useEffect without triggering re-subscriptions
  const isDemoModeRef = useRef(isDemoMode);
  useEffect(() => { isDemoModeRef.current = isDemoMode; }, [isDemoMode]);

  const [loadingMode, setLoadingMode] = useState<'analyzing' | 'recipes'>('analyzing');
  
  // Track if it's the initial auth check (F5/Load) to enforce Welcome screen only then
  const isInitialAuthCheck = useRef(true);

  const viewRef = useRef(currentView);
  useEffect(() => { viewRef.current = currentView; }, [currentView]);

  // Safe map helper for snapshots
  const safeMapDocs = (snap: any, mapper: (doc: any) => any) => {
    if (snap && snap.docs && Array.isArray(snap.docs)) {
      return snap.docs.map(mapper);
    }
    return [];
  };

  // FAILSAFE TIMEOUT: Ensure Splash Screen disappears even if Firebase hangs
  useEffect(() => {
    const timer = setTimeout(() => {
        if (isAuthChecking) {
            console.warn("Auth check timed out. Forcing UI load.");
            setIsAuthChecking(false);
            if (!user && !isDemoMode) {
                setCurrentView(AppView.LOGIN);
            }
        }
    }, 2500); // 2.5 seconds timeout
    return () => clearTimeout(timer);
  }, [isAuthChecking, user, isDemoMode]);

  // FORCE NAVIGATION FAILSAFE: If user exists but view is stuck on Login/Register, force Welcome
  useEffect(() => {
    if (user && [AppView.LOGIN, AppView.REGISTER, AppView.FORGOT_PASSWORD].includes(currentView)) {
        console.log("Forcing navigation to WELCOME due to active session");
        setCurrentView(AppView.WELCOME);
    }
  }, [user, currentView]);

  // FIREBASE AUTH + SYNC
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: any) => {
      try {
        if (currentUser) {
          // Only update user if it's a login event (avoid redundant updates)
          setUser(currentUser);
          setIsDemoMode(false);
          localStorage.removeItem('pp_demo_mode');
          
          if (db) {
             try {
                 // 1. Check if user needs to complete profile (CPF Check)
                 const userDocRef = doc(db, 'users', currentUser.uid);
                 
                 // Use snapshot listener for admin status AND cpf check to be reactive
                 onSnapshot(userDocRef, (docSnap: any) => {
                    let adminStatus = false;
                    
                    if (docSnap && docSnap.exists) {
                        const data = typeof docSnap.data === 'function' ? docSnap.data() : docSnap.data;
                        if (data?.isAdmin === true) adminStatus = true;

                        // CHECK CPF: If missing, force Complete Profile
                        if (!data?.cpf) {
                            setCurrentView(AppView.COMPLETE_PROFILE);
                        } else if (currentView === AppView.COMPLETE_PROFILE) {
                            setCurrentView(AppView.WELCOME);
                        }
                    }
                    setIsAdmin(adminStatus);
                 }, (err: any) => {
                     // Permission denied expected if rules not set. Treat as non-admin.
                     console.warn("User/Admin check error:", err);
                 });

                 // FAMILY
                 const familyRef = collection(db, 'users', currentUser.uid, 'family');
                 onSnapshot(familyRef, (snap: any) => {
                   const data = safeMapDocs(snap, d => ({ ...d.data(), id: d.id } as FamilyMember));
                   setFamilyMembers(data);
                 }, (err: any) => console.warn("Family sync error (ignoring):", err));

                 // FAVORITES
                 const favRef = collection(db, 'users', currentUser.uid, 'favorites');
                 onSnapshot(favRef, (s: any) => setFavoriteRecipes(safeMapDocs(s, d => ({ ...d.data(), _firestoreId: d.id } as unknown as Recipe))), (err: any) => console.warn("Fav sync error (ignoring):", err));

                 // HISTORY
                 const historyRef = collection(db, 'users', currentUser.uid, 'history');
                 onSnapshot(historyRef, (s: any) => setCookedHistory(safeMapDocs(s, d => d.data() as Recipe)), (err: any) => console.warn("History sync error (ignoring):", err));

                 // SHOPPING
                 const shoppingRef = collection(db, 'users', currentUser.uid, 'shopping');
                 onSnapshot(shoppingRef, (s: any) => setShoppingList(safeMapDocs(s, d => ({ ...d.data(), id: d.id } as ShoppingItem))), (err: any) => console.warn("Shopping sync error (ignoring):", err));

                 // PANTRY
                 const pantryRef = doc(db, 'users', currentUser.uid, 'settings', 'pantry');
                 onSnapshot(pantryRef, (s: any) => {
                     if (!s) return;
                     const exists = typeof s.exists === 'function' ? s.exists() : s.exists;
                     const data = typeof s.data === 'function' ? s.data() : s.data;
                     setPantryItems(exists && data ? data.items || [] : []);
                 }, (err: any) => console.warn("Pantry sync error (ignoring):", err));
             } catch (syncError) {
                 console.warn("Sync setup error:", syncError);
             }
          }

        } else {
          // User is logged out
          setUser(null);
          
          // Access the ref value to avoid dependency loop
          if (isDemoModeRef.current) {
               if (isInitialAuthCheck.current) {
                   setCurrentView(AppView.WELCOME);
               }
          } else {
               setCurrentView(AppView.LOGIN);
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        setCurrentView(AppView.LOGIN);
      } finally {
        if (isInitialAuthCheck.current) {
            isInitialAuthCheck.current = false;
        }
        setIsAuthChecking(false);
      }
    });

    return unsubscribe;
  }, []); // Empty dependency array

  // ACTIVE PROFILES PERSISTENCE
  useEffect(() => {
    if (user && familyMembers.length > 0) {
      try {
        const saved = localStorage.getItem(`active_profiles_${user.uid}`);
        if (saved && activeProfiles.length === 0) {
          const ids = JSON.parse(saved);
          if (Array.isArray(ids)) {
             setActiveProfiles(familyMembers.filter(m => ids.includes(m.id)));
          }
        }
      } catch (e) {
        console.warn("Failed to parse active profiles from local storage", e);
        localStorage.removeItem(`active_profiles_${user.uid}`);
      }
    }
  }, [user, familyMembers]);

  // SYNC ACTIVE PROFILES WHEN FAMILY MEMBERS UPDATE
  useEffect(() => {
    if (activeProfiles.length > 0 && familyMembers.length > 0) {
        setActiveProfiles(prev => {
            const updated = prev.map(p => familyMembers.find(m => m.id === p.id)).filter(Boolean) as FamilyMember[];
            if (prev.length !== updated.length) return updated;
            return prev;
        });
    }
  }, [familyMembers]);

  useEffect(() => {
    if (user && activeProfiles.length > 0) {
      try {
          localStorage.setItem(`active_profiles_${user.uid}`, JSON.stringify(activeProfiles.map(m => m.id)));
      } catch (e) {
          console.warn("LocalStorage set error", e);
      }
    }
  }, [activeProfiles, user]);

  const handleLogout = async () => {
      try {
          // 1. Clear Local Data
          localStorage.removeItem('pp_demo_mode');
          if (user?.uid) {
              localStorage.removeItem(`active_profiles_${user.uid}`);
          }

          // 2. Reset App State immediately (Optimistic Update)
          setIsDemoMode(false);
          setUser(null); 
          setActiveProfiles([]);
          setIsAdmin(false);
          setScanResult(null);
          setRecipes([]);
          
          // 3. Force Navigation immediately
          setCurrentView(AppView.LOGIN);
          
          // 4. Perform Firebase SignOut
          await signOut(auth);
      } catch (error) {
          console.error("Logout failed", error);
          // Failsafe: force login view anyway
          setCurrentView(AppView.LOGIN);
          setUser(null);
      }
  };
  
  const handleUpdatePantry = async (items: string[]) => {
    if (!user || !db) return;
    try {
        await setDoc(doc(db, 'users', user.uid, 'settings', 'pantry'), { items });
    } catch(e) { console.error(e); }
  };
  
  const handleSaveMember = async (memberToSave: FamilyMember) => {
    if (isDemoMode) {
      setFamilyMembers(prev => {
        const exists = prev.some(m => m.id === memberToSave.id);
        if (exists) return prev.map(m => m.id === memberToSave.id ? memberToSave : m);
        return [...prev, { ...memberToSave, id: Date.now().toString() }];
      });
      if (currentView === AppView.PROFILE_EDITOR) setCurrentView(editingReturnView);
      return;
    }

    if (!user || !db) return;
    try {
        const isNew = !memberToSave.id || memberToSave.id.startsWith('temp-');
        
        if (memberToSave.id === 'primary') {
             await setDoc(doc(db, 'users', user.uid, 'family', 'primary'), memberToSave, { merge: true });
        } else if (!isNew && memberToSave.id !== 'default-user') {
             await setDoc(doc(db, 'users', user.uid, 'family', memberToSave.id), memberToSave, { merge: true });
        } else {
             const { id, ...data } = memberToSave; 
             await addDoc(collection(db, 'users', user.uid, 'family'), data);
        }
    } catch (e) { console.error("Error saving member", e); }
    if (currentView === AppView.PROFILE_EDITOR) setCurrentView(editingReturnView);
  };

  const handleToggleFavorite = async (recipe: Recipe) => {
    if (isDemoMode) {
        setFavoriteRecipes(prev => {
            const exists = prev.some(r => r.title === recipe.title);
            if (exists) return prev.filter(r => r.title !== recipe.title);
            return [...prev, recipe];
        });
        return;
    }
    if (!user || !db) return;
    try {
        const existing = favoriteRecipes.find(r => r.title === recipe.title);
        if (existing) {
            const docId = (existing as any)._firestoreId;
            if (docId) await deleteDoc(doc(db, 'users', user.uid, 'favorites', docId));
        } else {
            const dataToSave = { ...recipe, image: recipe.image || `https://picsum.photos/seed/${recipe.title.replace(/\s/g,'')}/600/400` };
            delete (dataToSave as any)._firestoreId; 
            await addDoc(collection(db, 'users', user.uid, 'favorites'), dataToSave);
        }
    } catch (e) { console.error(e); }
  };

  const handleFinishCooking = async (recipe: Recipe) => {
    if (isDemoMode) {
        setCookedHistory(prev => [...prev, recipe]);
        return;
    }
    if (user && db) {
        try {
          const dataToSave = { 
              ...recipe, 
              cookedAt: Date.now(),
              image: recipe.image || `https://picsum.photos/seed/${recipe.title.replace(/\s/g,'')}/600/400` 
          };
          delete (dataToSave as any)._firestoreId;
          await addDoc(collection(db, 'users', user.uid, 'history'), dataToSave);
        } catch(e) { console.error(e); }
    }
  };

  const handleRateRecipe = async (recipe: Recipe, rating: number) => {
    if (isDemoMode) return;
    if (!user || !db) return;
    try {
        const existing = favoriteRecipes.find(r => r.title === recipe.title);
        if (existing) {
             const docId = (existing as any)._firestoreId;
             if (docId) await updateDoc(doc(db, 'users', user.uid, 'favorites', docId), { rating });
        } else {
            if (selectedRecipe && selectedRecipe.title === recipe.title) {
                setSelectedRecipe(prev => prev ? ({ ...prev, rating }) : null);
            }
        }
    } catch (e) { console.error(e); }
  };

  const handleAddToShoppingList = async (name: string, quantity: string = '') => {
    if (isDemoMode) {
        setShoppingList(prev => [...prev, { id: Date.now().toString(), name, quantity, checked: false }]);
        return;
    }
    if (!user || !db) return;
    try {
        await addDoc(collection(db, 'users', user.uid, 'shopping'), {
            name, quantity, checked: false, createdAt: Date.now()
        });
    } catch (e) { console.error(e); }
  };

  const handleToggleShoppingItem = async (id: string) => {
    if (isDemoMode) {
        setShoppingList(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
        return;
    }
    if (!user || !db) return;
    try {
        const item = shoppingList.find(i => i.id === id);
        if (item) await updateDoc(doc(db, 'users', user.uid, 'shopping', id), { checked: !item.checked });
    } catch (e) { console.error(e); }
  };

  const handleEditShoppingItem = async (id: string, name: string, quantity: string) => {
    if (isDemoMode) {
        setShoppingList(prev => prev.map(i => i.id === id ? { ...i, name, quantity } : i));
        return;
    }
    if (!user || !db) return;
    try {
        await updateDoc(doc(db, 'users', user.uid, 'shopping', id), { name, quantity });
    } catch (e) { console.error(e); }
  };

  const handleRemoveShoppingItem = async (id: string) => {
    if (isDemoMode) {
        setShoppingList(prev => prev.filter(i => i.id !== id));
        return;
    }
    if (!user || !db) return;
    try {
        await deleteDoc(doc(db, 'users', user.uid, 'shopping', id));
    } catch (e) { console.error(e); }
  };

  const handleClearShoppingList = async () => {
    if (isDemoMode) {
        setShoppingList([]);
        return;
    }
    if (!user || !db) return;
    try {
        const promises = shoppingList.map(item => deleteDoc(doc(db, 'users', user.uid, 'shopping', item.id)));
        await Promise.all(promises);
    } catch (e) { console.error(e); }
  };

  const handleFileSelect = async (file: File) => {
    if (!user && !isDemoMode) return;
    setImagePreview(URL.createObjectURL(file));
    setLoadingMode('analyzing');
    setCurrentView(AppView.ANALYZING);
    setError(null);
    try {
      const result = await analyzeFridgeImage(file);
      setScanResult(result);
      setCurrentView(AppView.RESULTS);
    } catch (err: any) {
      console.error(err);
      const message = err.message || "Não foi possível analisar a imagem. Tente novamente.";
      setError(message);
      setCurrentView(AppView.UPLOAD);
    }
  };

  const handleFindRecipes = async (confirmedIngredients: string[]) => {
    setLoadingMode('recipes');
    setCurrentView(AppView.ANALYZING); 
    if (isDemoMode) setImagePreview(null);
    
    try {
        let recipeSuggestions: Recipe[] = [];
        if (isDemoMode) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            recipeSuggestions = getMockRecipes();
        } else {
            recipeSuggestions = await generateRecipes(confirmedIngredients, activeProfiles, cookingMethod, pantryItems);
        }
        setRecipes(recipeSuggestions);
        setCurrentView(AppView.RECIPES);
    } catch(err) {
        console.error(err);
        setError("Erro ao gerar receitas. Tente novamente.");
        setCurrentView(AppView.RESULTS);
    }
  };

  const safeUserProfile = familyMembers.find(m => m.id === 'primary') || familyMembers[0];

  const showBottomMenu = ![
    AppView.LOGIN, AppView.REGISTER, AppView.FORGOT_PASSWORD, AppView.COMPLETE_PROFILE,
    AppView.ANALYZING, AppView.RECIPE_DETAIL, AppView.PROFILE_EDITOR,
    AppView.ADMIN_PANEL
  ].includes(currentView);

  if (isAuthChecking) return <SplashScreen />;

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-900 relative">
      {currentView === AppView.LOGIN && <LoginScreen onLoginSuccess={() => setCurrentView(AppView.WELCOME)} onNavigateToRegister={() => setCurrentView(AppView.REGISTER)} onNavigateToForgotPassword={() => setCurrentView(AppView.FORGOT_PASSWORD)} />}
      {currentView === AppView.REGISTER && <RegisterScreen onRegisterSuccess={() => setCurrentView(AppView.WELCOME)} onNavigateToLogin={() => setCurrentView(AppView.LOGIN)} />}
      {currentView === AppView.FORGOT_PASSWORD && <ForgotPasswordScreen onBack={() => setCurrentView(AppView.LOGIN)} />}
      {currentView === AppView.COMPLETE_PROFILE && user && <CompleteProfileScreen onCompleteSuccess={() => setCurrentView(AppView.WELCOME)} initialName={user.displayName} initialEmail={user.email} />}

      {currentView === AppView.WELCOME && <WelcomeScreen onSelectAny={() => { setActiveProfiles([]); setCurrentView(AppView.COOKING_METHOD); }} onSelectFamily={() => setCurrentView(AppView.FAMILY_SELECTION)} />}
      {currentView === AppView.FAMILY_SELECTION && <FamilySelectionScreen members={familyMembers} selectedMembers={activeProfiles} onToggleMember={m => setActiveProfiles(p => p.some(x => x.id === m.id) ? p.filter(x => x.id !== m.id) : [...p, m])} onSelectAll={() => setActiveProfiles(activeProfiles.length === familyMembers.length ? [] : [...familyMembers])} onContinue={() => setCurrentView(AppView.COOKING_METHOD)} onEditMember={m => { setMemberToEdit(m); setEditingReturnView(AppView.FAMILY_SELECTION); setCurrentView(AppView.PROFILE_EDITOR); }} onAddNew={() => { setMemberToEdit(undefined); setCurrentView(AppView.PROFILE_EDITOR); }} onBack={() => setCurrentView(AppView.WELCOME)} />}
      {currentView === AppView.COOKING_METHOD && <CookingMethodScreen onSelectMethod={m => { setCookingMethod(m); setCurrentView(AppView.UPLOAD); }} onBack={() => setCurrentView(activeProfiles.length > 0 ? AppView.FAMILY_SELECTION : AppView.WELCOME)} />}
      {currentView === AppView.PROFILE_EDITOR && <ProfileEditorScreen initialMember={memberToEdit} onSave={handleSaveMember} onCancel={() => setCurrentView(editingReturnView)} />}
      {currentView === AppView.UPLOAD && <UploadScreen onFileSelected={handleFileSelect} onDemoClick={() => { setIsDemoMode(true); localStorage.setItem('pp_demo_mode', 'true'); setScanResult(getMockScanResult()); setCurrentView(AppView.RESULTS); }} onProfileClick={() => setCurrentView(AppView.PROFILE)} activeProfiles={activeProfiles} cookingMethod={cookingMethod} onChangeContext={() => setCurrentView(AppView.WELCOME)} error={error} onBack={() => setCurrentView(AppView.COOKING_METHOD)} />}
      
      {currentView === AppView.SHOPPING_LIST && <ShoppingListScreen items={shoppingList} onAddItem={handleAddToShoppingList} onToggleItem={handleToggleShoppingItem} onRemoveItem={handleRemoveShoppingItem} onEditItem={handleEditShoppingItem} onClearList={handleClearShoppingList} onBack={() => setCurrentView(lastMainView)} />}
      
      {currentView === AppView.PROFILE && (
        <ProfileScreen 
            userProfile={safeUserProfile} 
            pantryItems={pantryItems} 
            onUpdatePantry={handleUpdatePantry} 
            onSaveProfile={handleSaveMember} 
            onBack={() => scanResult ? setCurrentView(AppView.RESULTS) : setCurrentView(AppView.UPLOAD)} 
            favorites={favoriteRecipes} 
            onSelectRecipe={r => { setSelectedRecipe(r); setCurrentView(AppView.RECIPE_DETAIL); }} 
            initialTab={profileInitialTab} 
            onLogout={handleLogout} 
            recipesCount={cookedHistory.length} 
            isAdmin={isAdmin && !isDemoMode} 
            onOpenAdmin={() => setCurrentView(AppView.ADMIN_PANEL)}
        />
      )}
      
      {currentView === AppView.ADMIN_PANEL && !isDemoMode && <AdminPanel onBack={() => setCurrentView(AppView.PROFILE)} currentUserEmail={user?.email} />}

      {currentView === AppView.ANALYZING && <LoadingScreen imagePreview={imagePreview} mode={loadingMode} />}
      {currentView === AppView.RESULTS && scanResult && <ScanResults result={scanResult} onFindRecipes={handleFindRecipes} onRetake={() => { setImagePreview(null); setScanResult(null); setCurrentView(AppView.UPLOAD); }} />}
      {currentView === AppView.RECIPES && <RecipeList recipes={recipes} onBack={() => setCurrentView(AppView.RESULTS)} onSelectRecipe={r => { setSelectedRecipe(r); setCurrentView(AppView.RECIPE_DETAIL); }} favorites={favoriteRecipes} onToggleFavorite={handleToggleFavorite} cookingMethod={cookingMethod} />}
      {currentView === AppView.RECIPE_DETAIL && selectedRecipe && <RecipeDetail recipe={selectedRecipe} onBack={() => setCurrentView(AppView.RECIPES)} isFavorite={favoriteRecipes.some(r => r.title === selectedRecipe.title)} onToggleFavorite={() => handleToggleFavorite(selectedRecipe)} onRate={(r) => handleRateRecipe(selectedRecipe, r)} shoppingList={shoppingList} onAddToShoppingList={handleAddToShoppingList} cookingMethod={cookingMethod} onFinishCooking={() => handleFinishCooking(selectedRecipe)} />}

      {showBottomMenu && <BottomMenu currentView={currentView} activeTab={profileInitialTab} onNavigate={(v, tab) => { if (tab) setProfileInitialTab(tab); setCurrentView(v); }} />}
    </div>
  );
}

export default App;