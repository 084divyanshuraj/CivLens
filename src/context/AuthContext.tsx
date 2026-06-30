"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  civicScore: number;
  refreshScore: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, civicScore: 0, refreshScore: () => {} });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [civicScore, setCivicScore] = useState(0);

  const fetchScore = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setCivicScore(userDoc.data().civicScore || 0);
      } else {
        // Create user profile if it doesn't exist
        await setDoc(doc(db, "users", uid), {
          email: user?.email || "",
          displayName: user?.displayName || "Citizen",
          civicScore: 0,
          createdAt: new Date(),
        });
        setCivicScore(0);
      }
    } catch (error) {
      console.error("Failed to fetch user score:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchScore(currentUser.uid);
      } else {
        setCivicScore(0);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshScore = () => {
    if (user) fetchScore(user.uid);
  };

  return (
    <AuthContext.Provider value={{ user, loading, civicScore, refreshScore }}>
      {children}
    </AuthContext.Provider>
  );
};
