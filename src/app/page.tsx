"use client";

import { useState, useEffect } from "react";
import { UploadCloud, MapPin, Loader2, CheckCircle2, ThumbsUp, ShieldCheck, Trophy, Sparkles, Navigation } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, civicScore, refreshScore } = useAuth();
  const router = useRouter();

  // Upload State
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);

  // Community Feed State
  const [recentIssues, setRecentIssues] = useState<any[]>([]);
  const [isFetchingFeed, setIsFetchingFeed] = useState(true);
  const [upvotingId, setUpvotingId] = useState<string | null>(null);

  // Gamification State
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    fetchCommunityFeed();
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      if (data.success) {
        setLeaderboard(data.data.slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    }
  };

  const fetchCommunityFeed = async () => {
    try {
      const res = await fetch("/api/issues");
      const data = await res.json();
      if (data.success) {
        const activeIssues = data.data.filter((i: any) => i.status !== "resolved");
        setRecentIssues(activeIssues.slice(0, 5)); // Just show top 5 recent active issues
      }
    } catch (error) {
      console.error("Failed to fetch feed:", error);
    } finally {
      setIsFetchingFeed(false);
    }
  };

  const awardPoints = async (points: number) => {
    if (!user) return;
    try {
      await fetch("/api/users/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, points })
      });
      refreshScore();
      fetchLeaderboard(); // Refresh global ranks
    } catch (error) {
      console.error("Failed to award points:", error);
    }
  };

  const handleUpvote = async (id: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    setUpvotingId(id);
    try {
      await fetch(`/api/issues/${id}/upvote`, { method: "POST" });
      await awardPoints(10); // +10 pts for verifying!
      fetchCommunityFeed(); // Refresh feed
    } catch (error) {
      console.error("Upvote failed:", error);
    } finally {
      setUpvotingId(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    
    // Compress image to avoid API limits
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
        setPreview(compressedBase64);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });

        try {
          // Reverse Geocoding using OpenStreetMap (Nominatim API)
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            setAddress(data.display_name);
          } else {
            setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch (error) {
          console.error("Failed to reverse geocode:", error);
          setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Failed to get location. Please ensure you have granted location permissions.");
        setIsLocating(false);
      }
    );
  };

  const handleAnalyze = async () => {
    if (!preview || !address) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      // 1. Upload Base64
      const uploadRes = await fetch("/api/issues/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: preview }),
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error("Upload Failed");

      // Strip the data:image/jpeg;base64, prefix for Gemini
      const rawBase64 = preview.replace(/^data:image\/\w+;base64,/, "");

      // Use real GPS coordinates if available, otherwise fallback to demo NY coordinates
      const finalLat = coordinates?.lat || (40.7128 + (Math.random() - 0.5) * 0.05);
      const finalLng = coordinates?.lng || (-74.0060 + (Math.random() - 0.5) * 0.05);

      // 2. Analyze via Gemini
      const analyzeRes = await fetch("/api/issues/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: uploadData.imageUrl,
          base64Image: rawBase64,
          mimeType: file?.type || "image/jpeg",
          location: { lat: finalLat, lng: finalLng, address: address },
        }),
      });

      const analyzeData = await analyzeRes.json();
      if (!analyzeData.success) throw new Error("Analysis Failed");

      setResult(analyzeData.data);
      await awardPoints(50); // Gamification: +50 pts for reporting!
      fetchCommunityFeed(); // Refresh feed to show new post
    } catch (error) {
      alert("Something went wrong during analysis.");
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRankTitle = (score: number) => {
    if (score >= 1000) return "City Guardian";
    if (score >= 500) return "Local Hero";
    if (score >= 100) return "Active Citizen";
    return "Newcomer";
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh]">
      
      {/* Header Banner (Gamification display) */}
      <div className="w-full flex justify-between items-center bg-slate-900/50 backdrop-blur-md border border-slate-700/50 p-4 rounded-2xl mb-10 shadow-lg">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-sky-400" />
          <h2 className="text-white font-bold tracking-widest uppercase text-sm">Civic Hero Portal</h2>
        </div>
        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-sky-500/30 cursor-pointer hover:bg-slate-900 transition-colors" onClick={() => !user && router.push("/login")}>
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Your Civic Score:</span>
          <span className="text-white font-black text-lg">{user ? civicScore : "Login"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Upload Form */}
        <div className="lg:col-span-7 flex flex-col items-center w-full">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full glass-panel rounded-3xl p-8 sm:p-10 relative overflow-hidden"
          >
            {/* Glow Effects */}
            <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-sky-500/20 rounded-full blur-[80px] pointer-events-none" />
            
            {/* Header */}
            <div className="text-center mb-10 relative z-10">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
                Report a <span className="glow-text">Civic Issue</span>
              </h1>
              <p className="text-slate-400 text-base sm:text-lg">Earn +50 Civic Points for improving your community.</p>
            </div>

            {/* Upload Zone */}
            <AnimatePresence mode="wait">
              {!preview ? (
                <motion.label 
                  key="upload"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative z-10 flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-slate-600/50 rounded-2xl cursor-pointer bg-slate-800/40 hover:bg-slate-800/80 hover:border-sky-500/50 transition-all shadow-inner group"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-14 h-14 mb-4 text-slate-500 group-hover:text-sky-400 transition-colors duration-300" />
                    <p className="mb-2 text-base text-slate-300"><span className="font-semibold text-white">Click to upload</span> or drag and drop</p>
                    <p className="text-sm text-slate-500">SVG, PNG, JPG or WEBP</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </motion.label>
              ) : (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative z-10 w-full h-72 rounded-2xl overflow-hidden border border-slate-600 mb-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                >
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                  <button 
                    onClick={() => { setPreview(null); setFile(null); setResult(null); }}
                    className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-semibold border border-slate-700 hover:bg-slate-800 transition"
                  >
                    Change Photo
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Location Input */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 mb-8 relative z-10"
            >
              <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1">Location</label>
              <div className="flex gap-2">
                <div className="relative group flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 sm:text-base outline-none transition shadow-inner text-white placeholder-slate-500" 
                    placeholder="e.g. 123 Main St, New Delhi" 
                  />
                </div>
                <button
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="px-4 bg-slate-800 border border-slate-700 rounded-2xl text-sky-400 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2 font-semibold disabled:opacity-50 shadow-md"
                  title="Use My Location"
                >
                  {isLocating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Navigation className="h-5 w-5" />}
                  <span className="hidden sm:inline">Use GPS</span>
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <AnimatePresence>
              {!result && (
                <motion.button 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, margin: 0, overflow: 'hidden' }}
                  transition={{ delay: 0.4 }}
                  onClick={handleAnalyze}
                  disabled={!preview || !address || isAnalyzing}
                  className="relative z-10 w-full flex items-center justify-center py-4 px-4 rounded-2xl shadow-[0_0_20px_rgba(2,132,199,0.2)] text-lg font-bold text-white bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 hover:shadow-[0_0_30px_rgba(2,132,199,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden border border-sky-400/30"
                >
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                  )}
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Analyzing with AI...
                    </>
                  ) : (
                    "Submit & Earn +50 Pts"
                  )}
                </motion.button>
              )}
            </AnimatePresence>

            {/* Result UI */}
            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="mt-4 p-8 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl flex flex-col items-center text-center shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden z-10 backdrop-blur-md"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  <div className="h-16 w-16 bg-emerald-900/50 border border-emerald-500/50 rounded-full flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Issue Reported! +50 Pts</h3>
                  <p className="text-base text-slate-300 mb-6">
                    AI Priority Score: <span className="font-bold text-emerald-300 bg-emerald-900/50 border border-emerald-500/30 px-3 py-1 rounded-lg ml-2">{result.priority.score}/100</span>
                  </p>
                  <div className="text-sm text-slate-200 bg-slate-900/80 px-6 py-4 rounded-xl border border-slate-700 w-full font-medium leading-relaxed shadow-inner">
                    "{result.executiveSummary?.summary || result.executiveSummary?.title}"
                  </div>
                  
                  <button 
                    onClick={() => { setPreview(null); setFile(null); setAddress(""); setResult(null); }}
                    className="mt-8 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    Submit another report
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>

        {/* RIGHT COLUMN: Community Gamification */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Top Leaderboard */}
          <div className="glass-panel rounded-3xl p-6 border-t-2 border-t-amber-500/50 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none" />
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-amber-400" />
              Civic Leaderboard
            </h2>
            <div className="space-y-3 relative z-10">
              {leaderboard.length === 0 ? (
                <div className="text-slate-500 text-sm py-4 text-center">Loading heroes...</div>
              ) : (
                leaderboard.map((lbUser, idx) => (
                  <div key={lbUser.id} className={`flex items-center justify-between p-3 rounded-xl ${user?.uid === lbUser.id ? 'bg-slate-900/80 border border-amber-500/30 shadow-[0_0_10px_rgba(251,191,36,0.1)]' : 'bg-slate-900/40 border border-slate-700/50'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`font-black text-lg ${idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-700' : 'text-slate-500'}`}>{idx + 1}</span>
                      <div>
                        <span className="block text-white font-bold text-sm truncate max-w-[120px]">
                          {user?.uid === lbUser.id ? "You" : lbUser.displayName || "Citizen"}
                        </span>
                        <span className="block text-xs text-amber-500/80 uppercase tracking-wider font-semibold">
                          {getRankTitle(lbUser.civicScore)}
                        </span>
                      </div>
                    </div>
                    <span className="text-white font-bold">{lbUser.civicScore} pts</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Local Feed */}
          <div className="flex-1 glass-panel rounded-3xl p-6 relative shadow-lg flex flex-col">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4 shrink-0">
              <MapPin className="h-5 w-5 text-sky-400" />
              Community Verification Feed
            </h2>
            <p className="text-xs text-slate-400 mb-4 shrink-0">Verify nearby issues to help the city prioritize them. Earn +10 pts per verification.</p>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
              {isFetchingFeed ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-slate-500" /></div>
              ) : recentIssues.length === 0 ? (
                <div className="text-center text-slate-500 text-sm py-10">No recent community issues found.</div>
              ) : (
                recentIssues.map(issue => (
                  <div key={issue.id} className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition group">
                    <div className="flex gap-4">
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0 border border-slate-700">
                        {issue.imageUrl ? (
                          <Image src={issue.imageUrl} alt="issue" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-800" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase tracking-widest text-sky-400 font-bold block mb-1">
                          {issue.vision?.issueType || "Issue"}
                        </span>
                        <h4 className="text-sm font-bold text-slate-200 truncate mb-1">
                          {issue.executiveSummary?.summary?.substring(0, 50)}...
                        </h4>
                        <span className="text-xs text-slate-500 truncate block">
                          {issue.location?.address}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded-md">
                        <CheckCircle2 className="h-3 w-3" /> {issue.upvotes || 0} Verifications
                      </div>
                      <button 
                        onClick={() => handleUpvote(issue.id)}
                        disabled={upvotingId === issue.id}
                        className="flex items-center gap-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-sky-600 hover:border-sky-500 border border-slate-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {upvotingId === issue.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <ThumbsUp className="h-3 w-3" />}
                        Verify (+10)
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
