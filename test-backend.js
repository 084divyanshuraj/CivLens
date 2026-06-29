// test-backend.js
// A simple script to test the entire CivLens backend pipeline!

async function runTest() {
  console.log("🚀 Starting CivLens Backend Pipeline Test...\n");

  try {
    // 1. Hardcode a sample 1x1 transparent GIF image
    console.log("📸 1. Generating sample image...");
    const base64Image = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    console.log("✅ Image converted to Base64!\n");

    // 2. Upload to ImgBB via our API Route
    console.log("☁️ 2. Uploading image to ImgBB via our API...");
    const uploadRes = await fetch("http://localhost:3000/api/issues/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: base64Image })
    });
    
    const uploadData = await uploadRes.json();
    if (!uploadData.success) throw new Error("Upload Failed: " + JSON.stringify(uploadData));
    const publicUrl = uploadData.imageUrl;
    console.log("✅ Upload successful! ImgBB Public URL: " + publicUrl + "\n");

    // 3. Send to Gemini for AI Analysis and Firestore Storage
    console.log("🧠 3. Sending image to Gemini AI for analysis (this takes ~5-10 seconds)...");
    const analyzeRes = await fetch("http://localhost:3000/api/issues/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: publicUrl,
        base64Image: base64Image,
        mimeType: "image/jpeg",
        location: { lat: 28.6139, lng: 77.2090, address: "New Delhi, India" }
      })
    });
    
    const analyzeData = await analyzeRes.json();
    if (!analyzeData.success) throw new Error("Analysis Failed: " + JSON.stringify(analyzeData));
    console.log("✅ AI Analysis Complete & Saved to Firestore!");
    console.log("📝 AI Priority Score:", analyzeData.data.priority.score, "/ 100");
    console.log("📝 AI Executive Summary:", analyzeData.data.executiveSummary.title);
    console.log("📝 Document ID:", analyzeData.data.id, "\n");

    // 4. Fetch the Dashboard Analytics
    console.log("📊 4. Fetching Dashboard Analytics...");
    const dashboardRes = await fetch("http://localhost:3000/api/dashboard");
    const dashboardData = await dashboardRes.json();
    
    console.log("✅ Dashboard Stats Retrieved:");
    console.log("- Total Issues in Database:", dashboardData.data.totalIssues);
    console.log("- AI Insights:");
    dashboardData.data.aiInsights.forEach(insight => console.log("  *", insight));
    
    console.log("\n🎉 BACKEND IS WORKING PERFECTLY! 🎉");

  } catch (error) {
    console.error("\n❌ TEST FAILED:", error.message);
    console.log("Make sure your Next.js server is running (`npm run dev`)!");
  }
}

runTest();
