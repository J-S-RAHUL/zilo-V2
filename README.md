# ZILO — Direct Worker-to-Employer Marketplace

> **"Find the Right Worker. Find the Right Job. Connect Directly."**

[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg?style=flat&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000.svg?style=flat&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Mongoose-47A248.svg?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ⚡ Quick Start & Run Commands

The project is organized into two separate folders:
* 🌐 `frontend/` — React 19 + TypeScript + Vite web application
* ⚙️ `backend/` — Node.js + Express REST API

### Option A: Run Separately (Recommended)

#### 1. Start the Backend API (Port 5000)
Open your first terminal:
```bash
# Navigate to the backend directory
cd backend

# Install dependencies (first time only)
npm install

# Start the backend server with live reload
npm run dev
# OR start in standard mode:
npm start
```
> The API will be live at: **[http://localhost:5000/](http://localhost:5000/)**  
> Health check: **[http://localhost:5000/api/health](http://localhost:5000/api/health)**

---

#### 2. Start the Frontend Application (Port 5173)
Open your second terminal:
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start the Vite local development server
npm run dev
```
> Open your browser to: **[http://localhost:5173/](http://localhost:5173/)**

---

### Option B: Quick Commands from Project Root

From the root directory (`zilo/`):

```bash
# Install all dependencies (both frontend & backend)
npm run install:all

# Run the frontend dev server
npm run dev:frontend

# Run the backend dev server
npm run dev:backend

# Build frontend for production
npm run build:frontend
```

---

## 💡 The ZILO Concept

**Zilo** is a direct, zero-friction worker-to-employer connection marketplace. It connects two types of users:

1. **People who NEED workers** (Homeowners, Contractors, Small Businesses, Event Organizers)
2. **People who ARE LOOKING FOR WORK** (Daily-wage workers, Masons, Electricians, Plumbers, Carpenters, Painters, Welders, Helpers)

### 🚫 What ZILO Is NOT
* **NO** complex application forms or resume uploads
* **NO** request-and-wait hiring workflows
* **NO** accept / reject / approval queues
* **NO** middleman commissions or escrow holding

### ✅ What ZILO IS
The core user flow is strictly:
```
SEARCH  ➜  VIEW DETAILS  ➜  CALL DIRECTLY (📞 CALL NOW)
```
Employers and workers speak directly on the phone, negotiate terms openly, and agree on wages without platform interference.

---

## 🎨 Design & UI Architecture

ZILO's user interface is built strictly around two primary reference designs:

### 1. Landing Page (Reference 1)
* **Hero Banner**:
  - High-impact headline: *"Find the Right Worker. Find the Right Job."* with custom brush-stroke accent underline.
  - Subtitle: *"Direct connections between workers and employers. No middleman. No commission."*
  - Dual-mode Search Box (*"Find Workers"* vs *"Find Jobs"*) with category input, location dropdown, and instant `Search` trigger.
  - Popular trade keyword tags (*Mason, Electrician, Plumber, Carpenter, Painter*).
  - High-visual worker cutout badge set against a modern geometric polygon accent backdrop.
* **8 Popular Categories Grid**:
  - Trade cards showing icon, trade title, and real-time active worker count.
  - Highlighted prominent card for featured trades.
* **3-Step "How Zilo Works"**:
  - `01 POST` — Post your requirement or worker profile in minutes.
  - `02 SEARCH` — Browse nearby verified workers or jobs with distance & skill filters.
  - `03 CALL` — Tap `CALL NOW` to connect directly over phone. Zero waiting.
* **Sample Workers & Jobs Carousel**:
  - Live preview cards showcasing verified badges, ratings, daily wages, and direct call buttons.
* **Dual Action CTA Banner**:
  - Card 1: **"Need a Worker?"** ➔ Instant Post Job action.
  - Card 2: **"Looking for Work?"** ➔ Instant Create Profile action.
* **Footer**:
  - Brand identity, quick links, category navigation, contact information, and copyright.

### 2. Marketplace & Search Dashboard (Reference 2)
* **Top Navigation Bar**:
  - Brand logo with tagline *"Direct Connections"*.
  - Global Search with location tag (`Vijayawada`, `Hyderabad`, `Guntur`, etc.).
  - Notification bell with unread count badge.
  - User profile avatar with role switcher and quick logout.
* **Breadcrumb Navigation**: `Home > Find Workers` or `Home > Find Jobs`.
* **Left Filter Sidebar**:
  - **Availability**: `All`, `Available Today`, `Available This Week`.
  - **Categories**: Radio list of all trades with live count badges.
  - **Experience**: `Any`, `1-3 yrs`, `3-5 yrs`, `5+ yrs`.
  - **Expected Payment**: `Any`, `Under ₹600`, `₹600 - ₹900`, `₹900+`.
  - **Location & Distance**: City selector + dynamic Haversine distance slider (`5 km` – `50 km`).
  - **Reset Button**: Single-tap filter reset.
* **Results Top Bar**:
  - Real-time result counter (e.g., *"Showing 12 workers"*).
  - Search keyword bar.
  - Sort dropdown: `Highest Rated`, `Lowest Daily Wage`, `Highest Daily Wage`, `Most Experienced`, `Nearest Distance`.
  - Active filter chips with one-click dismiss badges.
* **3-Column Worker Cards Grid**:
  - Verified trade badge overlay on worker photograph.
  - `🟢 Available Now` / `🔴 Currently Busy` live status pill.
  - Star ratings (`⭐ 4.9 (42 reviews)`).
  - Location badge with accurate distance calculation (e.g., `Benz Circle • 2.5 km away`).
  - Daily wage highlight box (e.g., `₹800 / day`).
  - Skill specialty tags.
  - Action buttons: Secondary `[ View Details ]` + Primary high-contrast `[ 📞 CALL NOW ]`.

---

## 📱 Core Features

| Feature | Description |
| :--- | :--- |
| **Direct Phone Dialing** | One-tap `tel:` links automatically open native mobile phone dialers on smartphones and laptops. |
| **Direct Call Modal** | Clean popup revealing verified phone numbers, one-tap number copying, WhatsApp direct messaging, and safety advice. |
| **Call History Tracking** | Automatically logs all dialed calls locally with timestamps, contact names, and phone numbers. |
| **4-Step Post a Job** | Employer wizard: `1. Worker Required` ➔ `2. Job Details` ➔ `3. Location & Pay` ➔ `4. Contact Details`. |
| **Worker Profile Creator** | Full onboarding form with `🟢 Available Now` vs `🔴 Busy` toggle, skills, daily wages, and experience. |
| **Separate Dashboards** | Custom views for **Employers** (posted jobs, active/closed status) and **Workers** (profile views, saved jobs, availability switch, dial history). |
| **Multilingual Support** | Instant locale switcher supporting **English**, **Telugu (తెలుగు)**, and **Hindi (हिन्दी)**. |
| **Demo Role Switching** | Switch between Employer and Worker test accounts in one click from the Auth modal. |

---

## ⚙️ Backend REST API Endpoints

The backend provides the following endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status check |
| `GET` | `/api/categories` | List all trade categories with worker counts |
| `GET` | `/api/stats` | Platform statistics (active workers, jobs, total calls) |
| `GET` | `/api/workers` | Fetch workers with query filters (`?category=&search=&minExp=&maxWage=`) |
| `GET` | `/api/workers/:id` | Fetch single worker profile details |
| `POST` | `/api/workers` | Create a new worker profile |
| `PATCH` | `/api/workers/:id/availability` | Toggle worker live availability (`isAvailable: true/false`) |
| `GET` | `/api/jobs` | Fetch job postings with filters (`?category=&city=&status=`) |
| `GET` | `/api/jobs/:id` | Fetch single job post details |
| `POST` | `/api/jobs` | Post a new job requirement |
| `PATCH` | `/api/jobs/:id/status` | Update job status (`active` / `closed`) |
| `GET` | `/api/calls` | Fetch call history logs |
| `POST` | `/api/calls` | Record a new direct call connection |
| `DELETE` | `/api/calls` | Clear call logs |

---

## 📂 Project Structure

```text
zilo/
├── package.json             # Root monorepo script runner
├── README.md                # Project documentation
│
├── frontend/                # Frontend React application
│   ├── public/              # Static assets and icons
│   ├── src/
│   │   ├── components/      # UI components (WorkerCard, JobCard, Modals, Navbar, Footer)
│   │   ├── context/         # AppContext (Workers, Jobs, Filters, Call History, Auth)
│   │   ├── data/            # Seed data & trade listings
│   │   ├── types/           # TypeScript interfaces
│   │   ├── views/           # Views (HomeView, FindWorkersView, FindJobsView, Dashboards, PostJob)
│   │   ├── App.tsx          # Root application component & routing
│   │   ├── index.css        # Unified CSS design system
│   │   └── main.tsx         # Entry point
│   ├── index.html           # HTML template
│   ├── package.json         # Frontend dependencies & scripts
│   ├── tsconfig.json        # TypeScript configuration
│   └── vite.config.ts       # Vite configuration
│
└── backend/                 # Backend Node.js / Express REST API
    ├── data/
    │   └── seedData.js      # Seed data (workers, jobs, categories, calls)
    ├── routes/
    │   ├── workerRoutes.js  # Worker listing, filter, creation, and status APIs
    │   ├── jobRoutes.js     # Job posting, listing, and status APIs
    │   └── callRoutes.js    # Direct phone call logging APIs
    ├── .env                 # Environment variables
    ├── .env.example         # Example environment template
    ├── package.json         # Backend dependencies & scripts
    └── server.js            # Express server entry point (port 5000)
```

---

## 🌐 How to Publish Online for FREE

You can host both your **Frontend** and **Backend** 100% for free with free SSL certificates and custom domain support.

### Step 1: Push Your Code to GitHub

1. Open your terminal in the `zilo` root directory:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Zilo platform"
   ```
2. Create a new repository on [GitHub.com](https://github.com/new) (e.g. `zilo`).
3. Push your code:
   ```bash
   git remote add origin https://github.com/<YOUR_USERNAME>/zilo.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 2: Deploy Backend to Render (Free Node.js Hosting)

1. Sign up for free at **[render.com](https://render.com/)** using your GitHub account.
2. Click **New +** ➔ **Web Service**.
3. Select your `zilo` GitHub repository.
4. Configure the settings:
   - **Name**: `zilo-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
   - **Environment Variables**:
     - `MONGODB_URI` = `mongodb+srv://<user>:<password>@cluster.mongodb.net/zilo` (from your free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)
5. Click **Deploy Web Service**.
6. Render will generate a live URL (e.g. `https://zilo-backend.onrender.com`).
   *On first connection, the backend auto-seeds MongoDB with verified workers, active jobs, and trade categories!*

---

### Step 3: Deploy Frontend to Vercel (Free Global CDN Hosting)

1. Sign up for free at **[vercel.com](https://vercel.com/)** using your GitHub account.
2. Click **Add New...** ➔ **Project**.
3. Select your `zilo` GitHub repository.
4. Configure the project settings:
   - **Root Directory**: Click *Edit* and select **`frontend`**
   - **Framework Preset**: `Vite` (automatically detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. *(Optional)* Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://zilo-backend.onrender.com`
6. Click **Deploy**.
7. In ~30 seconds, your site will be live with a free `.vercel.app` URL (e.g., `https://zilo.vercel.app`) with automatic HTTPS!

---

## 🛠️ Technology Stack

* **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite 8](https://vitejs.dev/)
* **Backend**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) + [CORS](https://www.npmjs.com/package/cors)
* **Styling**: Vanilla CSS Design System with CSS Custom Properties
* **Icons**: [Lucide React](https://lucide.dev/)
* **State Management**: Reactive Context API with persistent `localStorage` synchronization

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
