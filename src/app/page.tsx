"use client";

import { useState } from "react";
import { UploadCloud, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    
    // Compress image to avoid 4MB Gemini API limits and 1MB Firestore limits
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
        
        // Compress to JPEG with 0.6 quality
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
        setPreview(compressedBase64);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(selectedFile);
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

      // Generate realistic demo coordinates (New York City area)
      const demoLat = 40.7128 + (Math.random() - 0.5) * 0.05;
      const demoLng = -74.0060 + (Math.random() - 0.5) * 0.05;

      // 2. Analyze via Gemini
      const analyzeRes = await fetch("/api/issues/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: uploadData.imageUrl,
          base64Image: rawBase64,
          mimeType: file?.type || "image/jpeg",
          location: { lat: demoLat, lng: demoLng, address: address },
        }),
      });

      const analyzeData = await analyzeRes.json();
      if (!analyzeData.success) throw new Error("Analysis Failed");

      setResult(analyzeData.data);
    } catch (error) {
      alert("Something went wrong during analysis.");
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[70vh]">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-2xl glass-panel rounded-3xl p-10 relative overflow-hidden"
      >
        {/* Glow Effects */}
        <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-sky-500/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-50px] right-[-50px] w-40 h-40 bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-10 relative z-10">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-extrabold tracking-tight text-white mb-3"
          >
            Report a <span className="glow-text">Civic Issue</span>
          </motion.h1>
          <p className="text-slate-400 text-lg">Upload a photo to automatically analyze and report infrastructure problems.</p>
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
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
            </div>
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 sm:text-base outline-none transition shadow-inner text-white placeholder-slate-500" 
              placeholder="e.g. 123 Main St, New York" 
            />
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
                "Analyze & Submit Report"
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
              <h3 className="text-2xl font-bold text-white mb-2">Issue Reported</h3>
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
  );
}
