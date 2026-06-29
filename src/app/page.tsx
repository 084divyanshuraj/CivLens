"use client";

import { useState } from "react";
import { UploadCloud, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";

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
      // 1. Upload Base64 (Using our bypassed Firestore method)
      const uploadRes = await fetch("/api/issues/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: preview }),
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error("Upload Failed");

      // Strip the data:image/jpeg;base64, prefix for Gemini
      const rawBase64 = preview.replace(/^data:image\/\w+;base64,/, "");

      // 2. Analyze via Gemini
      const analyzeRes = await fetch("/api/issues/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: uploadData.imageUrl,
          base64Image: rawBase64,
          mimeType: file?.type || "image/jpeg",
          location: { lat: 0, lng: 0, address: address }, // Using a generic location structure
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
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-black mb-2">Report a Civic Issue</h1>
          <p className="text-zinc-500">Upload a photo to automatically analyze and report infrastructure problems.</p>
        </div>

        {/* Upload Zone */}
        {!preview ? (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-zinc-300 rounded-xl cursor-pointer bg-zinc-50 hover:bg-zinc-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-10 h-10 mb-3 text-zinc-400" />
              <p className="mb-2 text-sm text-zinc-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-zinc-500">SVG, PNG, JPG or WEBP</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        ) : (
          <div className="relative w-full h-64 rounded-xl overflow-hidden border border-zinc-200 mb-6">
            <Image src={preview} alt="Preview" fill className="object-cover" />
            <button 
              onClick={() => { setPreview(null); setFile(null); setResult(null); }}
              className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-black/80 transition"
            >
              Change Photo
            </button>
          </div>
        )}

        {/* Location Input */}
        <div className="mt-6 mb-8">
          <label className="block text-sm font-medium text-black mb-2">Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-zinc-400" />
            </div>
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-zinc-300 rounded-xl focus:ring-black focus:border-black sm:text-sm outline-none transition" 
              placeholder="e.g. 123 Main St, New York" 
            />
          </div>
        </div>

        {/* Submit Button */}
        {!result && (
          <button 
            onClick={handleAnalyze}
            disabled={!preview || !address || isAnalyzing}
            className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-black hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Analyzing with AI...
              </>
            ) : (
              "Analyze & Submit Report"
            )}
          </button>
        )}

        {/* Result UI */}
        {result && (
          <div className="mt-4 p-6 bg-green-50 border border-green-100 rounded-xl flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-900 mb-1">Issue Reported Successfully</h3>
            <p className="text-sm text-green-700 mb-4">
              AI Priority Score: <span className="font-bold">{result.priority.score}/100</span>
            </p>
            <p className="text-sm text-zinc-600 bg-white px-4 py-2 rounded-lg border border-green-200">
              "{result.executiveSummary.title}"
            </p>
            
            <button 
              onClick={() => { setPreview(null); setFile(null); setAddress(""); setResult(null); }}
              className="mt-6 text-sm font-medium text-green-700 hover:text-green-900 underline underline-offset-4"
            >
              Submit another report
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
