import { initializeApp } from "firebase/app";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  sendPasswordResetEmail,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  initializeAuth
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 1. Firebase configuration from your Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// 2. Initialize Firebase instances
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: browserPopupRedirectResolver,
});
export const db = getFirestore(app);

// Google Auth Provider setup
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// 7 days in milliseconds: 7 days * 24 hours * 60 mins * 60 secs * 1000 ms
const MAX_SESSION_MS = 7 * 24 * 60 * 60 * 1000;

// --- AUTH FUNCTIONS ---

// 1. Sign In with Email & Password
export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// 2. Sign Up with Email & Password 
export function registerWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// 3. Sign In with Google Popup
export function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

// 4. Logout
export function logoutUser() {
  return signOut(auth);
}

// reset email
export function sendResetEmail(email) {
  return sendPasswordResetEmail(auth, email);
}


// 5. Watch Auth State + Auto Log Out after 7 Days
export function watchAuthState(onUserActive, onUserInactive) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      onUserInactive();
      return;
    }

    try {
      // Force-refresh or fetch token claims to read server-issued auth_time
      const idTokenResult = await user.getIdTokenResult();
      const authTimeMs = new Date(idTokenResult.claims.auth_time * 1000).getTime();
      const currentTime = Date.now();

      // Check if session has exceeded 7 days
      if (currentTime - authTimeMs > MAX_SESSION_MS) {
        console.warn("Session exceeded 7 days. Signing user out...");
        await signOut(auth);
        onUserInactive();
        return;
      }

      // Session is valid and active
      onUserActive(user);
    } catch (error) {
      console.error("Auth state check failed:", error);
      await signOut(auth);
      onUserInactive();
    }
  });
}