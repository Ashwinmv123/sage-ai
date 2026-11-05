# 🛡️ Sage AI — Digital Safety & Harassment Response Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Better--SQLite3-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)

**Sage AI** is an all-in-one digital safety and threat response platform designed to empower individuals—especially students and vulnerable users—facing online harassment, cyberstalking, phishing scams, coercive extortion, and impersonation.

Sage AI couples an **explainable threat analysis engine** with a **tamper-evident cryptographic evidence vault**, emergency response tools, and actionable platform playbooks.

---

## ✨ Key Features

### 🔍 Threat & Harassment Scanner
- **Explainable Rule Engine**: Analyzes suspicious messages, emails, and screenshots with real-time risk indicators and severity scoring (Low, Medium, High, Critical).
- **Keyword & Pattern Detection**: Identifies urgency cues, financial coercion, impersonation attempts, and doxxing risks.

### 🔐 Cryptographic Evidence Vault
- **Tamper-Evident Integrity**: Calculates SHA-256 cryptographic hashes for uploaded screenshots and files to ensure chain of custody.
- **Forensic Metadata**: Captures original timestamps, file sizes, MIME types, and forensic audit logs ready for legal or platform submission.

### 📋 Incident Management & Tracking
- **Lifecycle Tracking**: Log incidents with severity levels, platform identifiers, and timestamps.
- **Categorization**: Supports Cyberstalking, Coercive Extortion / Blackmail, Image-Based Abuse, Impersonation, and Phishing.

### 📄 Cyber Crime & Formal Report Generator
- **Audit-Ready Dossiers**: Compiles preserved evidence, incident timelines, and verified hashes into standardized, printable reporting documents.
- **Police / Cyber Cell Ready**: Formatted for direct handover to law enforcement authorities and platform Trust & Safety teams.

### 🎭 Stealth / Disguise Mode (Quick Exit)
- **Instant Privacy Cloak**: Press `ESC` or click the disguise toggle to immediately mask the interface as a benign academic research document or calculator if someone walks into view.

### 🤝 Safety Circle & Crisis Assistance
- **Trusted Circle Alerts**: Pre-configure emergency contacts to broadcast alerts with incident details when safety is compromised.
- **Verified Hotlines**: Direct access to cyber crime helplines, suicide prevention hotlines, and crisis support centers.

### 💬 De-Escalation Assistant
- **Conflict Reduction**: Generates neutral, non-escalating responses to defuse harassment or intimidation attempts without compromising evidence.

### 📖 Platform Response Playbooks
- Step-by-step guides for evidence collection and reporting across **Instagram**, **WhatsApp**, **Discord**, **Telegram**, **X (Twitter)**, and **Email**.

---

## 🛠️ Tech Stack

- **Frontend**:
  - [React 18](https://react.dev/)
  - [Vite](https://vitejs.dev/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Framer Motion](https://www.framer.com/motion/) (Smooth transitions & modal animations)
  - [Lucide React](https://lucide.dev/) (Icons)
- **Backend**:
  - [Node.js](https://nodejs.org/) & [Express 5](https://expressjs.com/)
  - [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3) with Write-Ahead Logging (WAL) mode
  - [Cors](https://www.npmjs.com/package/cors) & [Dotenv](https://www.npmjs.com/package/dotenv)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ashwinmv123/sage-ai.git
   cd sage-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the Application

You can run both the Express backend server and the Vite frontend concurrently with a single command:

```bash
npm run dev:all
```

Or run them individually in separate terminal sessions:

- **Start Express Backend Server (Port 5000)**:
  ```bash
  npm run server
  ```

- **Start Vite Frontend (Port 5173)**:
  ```bash
  npm run dev
  ```

Open your browser and navigate to `http://localhost:5173`.

---

## 📂 Project Structure

```plaintext
sage-ai/
├── server/
│   ├── db.js             # SQLite database setup & table schemas
│   ├── index.js          # Express API server & routes
│   └── view-db.js        # Helper script for inspecting database records
├── src/
│   ├── components/
│   │   ├── DeEscalationAssistant.jsx # Crisis response generator
│   │   ├── DisguiseScreen.jsx        # Quick-exit disguise interface
│   │   ├── EvidencePreserveModal.jsx # Evidence intake modal with hash computation
│   │   ├── EvidenceViewModal.jsx     # Evidence viewer with metadata verification
│   │   ├── LoginPage.jsx             # Secure authentication & signup
│   │   ├── SafetyCircleModal.jsx     # Emergency contact management
│   │   └── UserProfileView.jsx       # User profile & security settings
│   ├── services/
│   │   └── api.js                    # Frontend API client service
│   ├── App.jsx                       # Main application shell, tabs & threat engine
│   ├── index.css                     # Tailwind CSS & global styling
│   └── main.jsx                      # React application entrypoint
├── index.html                        # HTML template
├── package.json                      # Scripts and dependencies
├── tailwind.config.js                # Tailwind configuration
└── vite.config.js                    # Vite bundler configuration
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Authenticate user credentials |
| `GET` | `/api/incidents` | Fetch user incidents |
| `POST` | `/api/incidents` | Create a new incident entry |
| `DELETE` | `/api/incidents/:id` | Remove an incident |
| `GET` | `/api/evidence` | Retrieve preserved evidence files & hashes |
| `POST` | `/api/evidence` | Save preserved evidence with SHA-256 checksum |
| `DELETE` | `/api/evidence/:id` | Delete evidence record |
| `GET` | `/api/contacts` | Get trusted safety circle contacts |
| `POST` | `/api/contacts` | Add new emergency contact |

---

## 🔒 Privacy & Safety Notice

Sage AI was built with privacy-first principles:
- **Client-Side Hashing**: Evidence files are hashed cryptographically to verify authenticity.
- **Local Database**: All incident metadata and evidence entries are stored securely in your dedicated SQLite database (`sage_vault.sqlite`).
- **Zero Third-Party Tracking**: No analytics or external tracking trackers are injected into user sessions.

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
