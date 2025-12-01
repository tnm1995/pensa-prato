

export interface Ingredient {
  name: string;
  confidence: number;
}

export interface ScanResult {
  ingredients: Ingredient[];
  notes: string;
}

export interface TimerBreakdown {
  label: string; // ex: "Cozinhar Arroz", "Assar Frango", "Tempo de Forno"
  minutes: number;
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
  rating?: number; // Nova propriedade para armazenar a nota (1-5)
}

export interface FamilyMember {
  id: string;
  name: string;
  avatar?: string; // URL or emoji
  dislikes: string; // Comma separated string
  restrictions: string[]; // e.g. ["Vegano", "Sem Glúten", "APLV"]
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
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD', // Nova tela
  WELCOME = 'WELCOME',
  FAMILY_SELECTION = 'FAMILY_SELECTION',
  COOKING_METHOD = 'COOKING_METHOD',
  PROFILE_EDITOR = 'PROFILE_EDITOR',
  UPLOAD = 'UPLOAD',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  RECIPES = 'RECIPES',
  RECIPE_DETAIL = 'RECIPE_DETAIL',
  PROFILE = 'PROFILE',
  SHOPPING_LIST = 'SHOPPING_LIST',
  ADMIN_PANEL = 'ADMIN_PANEL' // Nova tela administrativa
}