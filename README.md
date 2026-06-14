# 🛡️ KavachAI -  Project

KavachAI is an AI-powered cybersecurity application designed to detect and prevent digital scams. It specializes in identifying modern phishing attempts, fraudulent URLs, and malicious images (like fake KYC requests, lottery scams, and OTP fraud).

The application is built with a **React Frontend** and a **Node.js (Express) Backend**, powered by Google's Gemini AI and Safe Browsing APIs.

---

## ✨ Features
- **💬 Message Analysis**: Paste suspicious texts, emails, or WhatsApp messages to get an instant AI risk assessment.
- **🔗 URL Scanner**: Checks links against the Google Safe Browsing API and Gemini AI to detect lookalike domains and credential-harvesting sites.
- **🖼️ Image Analysis**: Upload screenshots of suspicious SMS or WhatsApp conversations, and the AI will scan the text within the image for red flags.
- **⚡ Real-Time Scoring**: Provides a Risk Score (0-100), severity level, and actionable recommendations.

---

## 🛠️ Prerequisites
Before you run this project locally, ensure you have:
1. **[Node.js](https://nodejs.org/)** installed on your machine.
2. A **Google Gemini API Key** (from Google AI Studio).
3. A **Google Safe Browsing API Key** (from Google Cloud Console).

---

## 🚀 Setup Instructions

### 1. Install Dependencies
You need to install the Node modules for **both** the frontend and the backend.

Open your terminal and run:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install --legacy-peer-deps
```

### 2. Configure API Keys (Environment Variables)
We use a `.env` file to securely store your API keys. This file is **ignored by Git** (via `.gitignore`) so your keys will never be exposed publicly.

1. Navigate to the `backend/` directory.
2. Create a file named `.env` (or rename the provided `.env.example`).
3. Add your API keys to the file like this:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_key_here
SAFE_BROWSING_API_KEY=your_safe_browsing_key_here
```

---

## 💻 How to Run Locally

You will need to run the frontend and backend simultaneously in two separate terminal windows.

### Terminal 1: Start the Backend
```bash
cd backend
npm start
```
*The backend server will start on `http://localhost:5000`.*

### Terminal 2: Start the Frontend
```bash
cd frontend
npm start
```
*The React app will open automatically in your browser at `http://localhost:3000`.*

---

## 🔒 Security & Gitignore
This project uses a strict `.gitignore` file. Any file ending in `.env` or located at `backend/.env` is completely ignored by Git. **Your API keys are safe and will not be pushed to your repository.**



A project by Kathyayani, Harika, Dhatrri, Nanditha, 