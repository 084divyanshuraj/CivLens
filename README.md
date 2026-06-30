# 🏛️ CivLens: AI-Powered Civic Infrastructure Analyst

CivLens is an intelligent, gamified platform designed to revolutionize municipal infrastructure reporting and maintenance. By leveraging AI image analysis, predictive budget modeling, and civic gamification, CivLens bridges the gap between citizens and local governments.

## 🚀 The Problem
Cities struggle to prioritize infrastructure repairs (potholes, broken streetlights, damaged sidewalks). Manual reporting is slow, unverified, and lacks priority categorization, leading to wasted municipal budgets and frustrated citizens.

## 💡 Our Solution
CivLens allows citizens to easily report issues by snapping a photo. Our backend uses **Google Gemini AI** to automatically analyze the image, detect the severity of the issue, and estimate potential taxpayer savings if fixed immediately (predictive maintenance). 

To drive engagement, the platform uses a **Gamified Civic Engine**. Users earn "Civic Points" for valid reports and upvotes, competing on a real-time leaderboard for civic recognition.

## ✨ Key Features
- **🤖 AI Issue Validation:** Powered by Gemini AI, reports are automatically validated, categorized, and assigned a severity level based purely on the uploaded image.
- **💰 Predictive ROI Widget:** An Admin Dashboard that visualizes estimated municipal budget savings based on proactive vs. reactive maintenance.
- **🏆 Civic Gamification:** A dynamic leaderboard and point system (using Framer Motion & Canvas Confetti) that rewards citizens for improving their community.
- **🗺️ Interactive Heatmap:** A real-time map displaying all reported issues, color-coded by severity, allowing city planners to visually identify infrastructure hotspots.

## 🛠️ Technologies Used
- **Frontend:** Next.js 14, React 19, Tailwind CSS, Framer Motion, Leaflet Maps
- **Backend:** Next.js API Routes (Serverless)
- **Database:** Firebase Firestore (Google Cloud)
- **Authentication:** Firebase Auth
- **AI Integration:** Google Gemini Pro Vision API
- **Deployment:** Vercel (Frontend/Backend) & Google Cloud (Database/Auth)

## ☁️ Google Cloud Integrations
This project relies heavily on Google Cloud Infrastructure:
1. **Google Gemini API:** Core image analysis and intelligence.
2. **Firebase Firestore:** Real-time NoSQL database for reports and leaderboard data.
3. **Firebase Authentication:** Secure user identity management.
4. **Firebase Admin SDK:** Secure backend data validation and score incrementation.

## 🏃‍♂️ Getting Started

First, clone the repository and install dependencies:

```bash
git clone https://github.com/084divyanshuraj/CivLens.git
cd CivLens
npm install
```

Create a `.env.local` file with your Firebase and Gemini credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=civlens
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key
GEMINI_API_KEY=your_gemini_key
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
