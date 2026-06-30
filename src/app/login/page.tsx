"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error) {
      console.error("Login failed", error);
      alert("Failed to login with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[70vh]">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md glass-panel rounded-3xl p-10 relative overflow-hidden flex flex-col items-center text-center"
      >
        <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-sky-500/20 rounded-full blur-[80px] pointer-events-none" />
        
        <ShieldAlert className="h-16 w-16 text-sky-400 mb-6" />
        
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-3">
          Civic <span className="glow-text">Authentication</span>
        </h1>
        <p className="text-slate-400 mb-10">
          Login to report issues, verify problems, and climb the civic leaderboard.
        </p>

        <button 
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center py-4 px-4 rounded-2xl font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all shadow-lg"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5 text-sky-400" />
          ) : (
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </div>
          )}
        </button>
      </motion.div>
    </div>
  );
}
