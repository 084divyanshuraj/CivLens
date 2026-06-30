"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert, Mail, Lock, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error: any) {
      console.error("Login failed", error);
      alert(`Failed to login with Google: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (isSignUp && !name) return;

    setLoading(true);
    try {
      if (isSignUp) {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      } else {
        // Sign In
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/");
    } catch (error: any) {
      console.error("Email Auth Failed:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[70vh]">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md glass-panel rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col items-center"
      >
        <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-sky-500/20 rounded-full blur-[80px] pointer-events-none" />
        
        <ShieldAlert className="h-12 w-12 text-sky-400 mb-4" />
        
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 text-center">
          Civic <span className="glow-text">Authentication</span>
        </h1>
        <p className="text-slate-400 mb-8 text-center text-sm">
          {isSignUp ? "Create an account to start earning Civic Points." : "Login to verify issues and climb the leaderboard."}
        </p>

        <form onSubmit={handleEmailAuth} className="w-full flex flex-col gap-4 mb-6">
          <AnimatePresence>
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name" 
                  required={isSignUp}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 outline-none text-white placeholder-slate-500 transition-all"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-500" />
            </div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address" 
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 outline-none text-white placeholder-slate-500 transition-all"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-500" />
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" 
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 outline-none text-white placeholder-slate-500 transition-all"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3.5 mt-2 rounded-xl font-bold text-white bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 transition-all shadow-[0_0_15px_rgba(2,132,199,0.3)] disabled:opacity-50 border border-sky-400/30"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5 text-white" /> : (isSignUp ? "Create Account" : "Sign In")}
          </button>
        </form>

        <div className="w-full flex items-center justify-between mb-6">
          <hr className="w-full border-slate-700" />
          <span className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">OR</span>
          <hr className="w-full border-slate-700" />
        </div>

        <button 
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center py-3.5 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all shadow-lg"
        >
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </div>
        </button>

        <p className="mt-8 text-sm text-slate-400">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sky-400 font-bold hover:text-sky-300 transition-colors underline underline-offset-4"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>

      </motion.div>
    </div>
  );
}
