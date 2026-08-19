import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase project config for Civic Connect App
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyForCivicConnectApp",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "civic-connect-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "civic-connect-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "civic-connect-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "109283746501",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:109283746501:web:abcdef123456",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Firestore Helper Functions for Issues & Citizen App Reports
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
  reportedBy?: string;
}

export const subscribeToIssues = (callback: (issues: FirebaseIssue[]) => void) => {
  try {
    const issuesRef = collection(db, "issues");
    const q = query(issuesRef, orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const issuesData = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as FirebaseIssue[];
      callback(issuesData);
    }, (err) => {
      console.warn("Firestore issues listener warning:", err);
    });
  } catch (e) {
    console.warn("Firestore error:", e);
    return () => {};
  }
};

export const updateIssueStatus = async (issueId: string, status: "Pending" | "In Progress" | "Resolved", officer?: string) => {
  try {
    const issueRef = doc(db, "issues", issueId);
    await updateDoc(issueRef, {
      status,
      ...(officer ? { officer } : {}),
    });
  } catch (e) {
    console.warn("Firestore update error:", e);
  }
};

// Firestore Field Tasks Helper Functions
export const subscribeToTasks = (callback: (tasks: any[]) => void) => {
  try {
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const tasksData = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        callback(tasksData);
      }
    }, (err) => {
      console.warn("Firestore tasks listener warning:", err);
    });
  } catch (e) {
    return () => {};
  }
};

export const addTaskToFirestore = async (task: any) => {
  try {
    const tasksRef = collection(db, "tasks");
    await addDoc(tasksRef, {
      ...task,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn("Firestore add task error:", e);
  }
};

export const updateTaskInFirestore = async (taskId: string, updates: any) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, updates);
  } catch (e) {
    console.warn("Firestore update task error:", e);
  }
};

// Firestore Leave Applications Helper Functions
export const subscribeToLeaves = (callback: (leaves: any[]) => void) => {
  try {
    const leavesRef = collection(db, "leaves");
    const q = query(leavesRef, orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const leavesData = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        callback(leavesData);
      }
    }, (err) => {
      console.warn("Firestore leaves listener warning:", err);
    });
  } catch (e) {
    return () => {};
  }
};

export const addLeaveToFirestore = async (leave: any) => {
  try {
    const leavesRef = collection(db, "leaves");
    await addDoc(leavesRef, {
      ...leave,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn("Firestore add leave error:", e);
  }
};

export const updateLeaveStatusInFirestore = async (leaveId: string, status: "Approved" | "Pending" | "Rejected") => {
  try {
    const leaveRef = doc(db, "leaves", leaveId);
    await updateDoc(leaveRef, { status });
  } catch (e) {
    console.warn("Firestore update leave error:", e);
  }
};
