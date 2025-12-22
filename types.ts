
export interface Ingredient {
  name: string;
  confidence: number;
}

export interface ScanResult {
  ingredients: Ingredient[];
  notes: string;
}

export interface TimerBreakdown {
  label: string; 
  minutes: number;
}

export interface SocialProof {
    img: string;
    title: string;
    user: string;
    avatar?: string;
}

export interface Recipe {
  title: string;
  time_minutes: number;
  difficulty: string;
  servings: number;
  used_ingredients: string[];
  missing_ingredients: string[];
  instructions: string[];
  tags: string[];
  image?: string;
  timers?: TimerBreakdown[];
  rating?: number; 
}

export interface WasteStats {
  kgSaved: number;
  moneySaved: number;
  recipesCompleted: number;
  badges: string[];
  xp: number;
  level: number;
  streak: number;
  lastCookedDate?: string; // ISO string
}

export interface FamilyMember {
  id: string;
  name: string;
  avatar?: string; 
  dislikes: string; 
  restrictions: string[]; 
  isChild?: boolean;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity?: string;
  checked: boolean;
}

export enum CookingMethod {
  ANY = 'Todos os jeitos',
  AIRFRYER = 'AirFryer',
  STOVE = 'Fogão',
  OVEN = 'Forno'
}

export enum AppView {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  COMPLETE_PROFILE = 'COMPLETE_PROFILE',
  WELCOME = 'WELCOME',
  FAMILY_SELECTION = 'FAMILY_SELECTION',
  COOKING_METHOD = 'COOKING_METHOD',
  PROFILE_EDITOR = 'PROFILE_EDITOR',
  UPLOAD = 'UPLOAD',
  EXPLORE = 'EXPLORE',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  RECIPES = 'RECIPES',
  RECIPE_DETAIL = 'RECIPE_DETAIL',
  PROFILE = 'PROFILE',
  SHOPPING_LIST = 'SHOPPING_LIST',
  FAVORITES = 'FAVORITES',
  ADMIN_PANEL = 'ADMIN_PANEL',
  TERMS = 'TERMS',
  PRIVACY = 'PRIVACY'
}
