

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Sua config (100% correta)
const firebaseConfig = {
  apiKey: "AIzaSyB-jEv9mg1sgY4mSr3kWTbG2Tv5pvMn7eg",
  authDomain: "pensa-prato.firebaseapp.com",
  projectId: "pensa-prato",
  storageBucket: "pensa-prato.appspot.com",
  messagingSenderId: "1071505894842",
  appId: "1:1071505894842:web:23d41ab79fab3abf394183",
  measurementId: "G-1LZ1JFCRSN"
};

// Inicializa o Firebase
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

// Inicializa serviços (v8 style)
const authInstance = firebase.auth();
const dbInstance = firebase.firestore();
const googleProviderInstance = new firebase.auth.GoogleAuthProvider();

googleProviderInstance.addScope("profile");
googleProviderInstance.addScope("email");
// FORCE ACCOUNT SELECTION
googleProviderInstance.setCustomParameters({ prompt: 'select_account' });

export const auth = authInstance;
export const db = dbInstance;
export const googleProvider = googleProviderInstance;

// Shims to provide v9 modular API on top of v8 SDK

export const signInWithPopup = (auth: any, provider: any) => auth.signInWithPopup(provider);
export const signInWithEmailAndPassword = (auth: any, email: string, psw: string) => auth.signInWithEmailAndPassword(email, psw);
export const createUserWithEmailAndPassword = (auth: any, email: string, psw: string) => auth.createUserWithEmailAndPassword(email, psw);
export const signOut = (auth: any) => auth.signOut();
export const updateProfile = (user: any, updates: any) => user.updateProfile(updates);
export const sendPasswordResetEmail = (auth: any, email: string) => auth.sendPasswordResetEmail(email);
export const onAuthStateChanged = (auth: any, cb: any) => auth.onAuthStateChanged(cb);

export const setPersistence = (auth: any, persistence: any) => auth.setPersistence(persistence);
// FIX: Use string literals 'local' and 'session' to avoid build time errors with deep property access on firebase.auth.Auth.Persistence
export const browserLocalPersistence = 'local';
export const browserSessionPersistence = 'session';

export const getAuth = () => firebase.auth();

// Firestore Shims
export const getFirestore = () => firebase.firestore();

// Helper for collection/doc traversal
const traverse = (parent: any, paths: string[]) => {
  let ref = parent;
  for (const path of paths) {
    if (ref.collection) {
      // If it's DB or DocRef, we can get a collection
      ref = ref.collection(path);
    } else if (ref.doc) {
      // If it's CollectionRef, we get a doc
      ref = ref.doc(path);
    }
  }
  return ref;
};

export const collection = (dbOrRef: any, ...paths: string[]) => traverse(dbOrRef, paths);
export const doc = (dbOrRef: any, ...paths: string[]) => traverse(dbOrRef, paths);

export const getDoc = (ref: any) => ref.get();
export const getDocs = (queryOrRef: any) => queryOrRef.get(); // Added getDocs
export const setDoc = (ref: any, data: any, opts?: any) => ref.set(data, opts);
export const addDoc = (ref: any, data: any) => ref.add(data);
export const updateDoc = (ref: any, data: any) => ref.update(data);
export const deleteDoc = (ref: any) => ref.delete();
export const onSnapshot = (ref: any, cb: any, onError?: any) => ref.onSnapshot(cb, onError);

// Query Shims
export const query = (ref: any, ...constraints: any[]) => {
  let q = ref;
  constraints.forEach(c => {
    if (c.type === 'where') q = q.where(c.field, c.op, c.val);
  });
  return q;
};
export const where = (field: string, op: any, val: any) => ({ type: 'where', field, op, val });

export default app;