import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Replace with your Firebase project config from the Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Firestore Helper Functions for Issues & App Data
export interface FirebaseIssue {
  id?: string;
  photoUrl?: string;
  category: string;
  location: string;
  priority: "High" | "Medium" | "Low";
  department: string;
  status: "Pending" | "In Progress" | "Resolved";
  officer?: string;
  createdAt?: any;
  reportedBy?: string; // Citizen email/UID from mobile app
}

export const subscribeToIssues = (callback: (issues: FirebaseIssue[]) => void) => {
  const issuesRef = collection(db, "issues");
  const q = query(issuesRef, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const issuesData = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as FirebaseIssue[];
    callback(issuesData);
  });
};

export const updateIssueStatus = async (issueId: string, status: "Pending" | "In Progress" | "Resolved", officer?: string) => {
  const issueRef = doc(db, "issues", issueId);
  await updateDoc(issueRef, {
    status,
    ...(officer ? { officer } : {}),
  });
};
