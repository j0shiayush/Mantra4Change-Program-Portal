# 🚀 Mantra4Change: PBL Program & Grant Intelligence Portal

![Next.js](https://img.shields.io/badge/Next.js-Black?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

## 📖 Overview

This application is an enterprise-grade, full-stack Next.js dashboard engineered for Mantra4Change. It is designed to provide deterministic program intelligence and AI-assisted grant reporting for Project-Based Learning (PBL) initiatives.

The platform processes thousands of school records, synthesizes financial and performance data into actionable insights, and operates with a strict architectural separation between **deterministic factual data** and **AI-generated narratives** to ensure zero hallucinations.

---

<!-- 📸 IMAGE PLACEHOLDER: MAIN PAGE / DASHBOARD VIEW -->
<!-- Add an image showing the first tab (PBL Program Intelligence) with all the stats and the dark mode theme. -->
<img width="1887" height="926" alt="image" src="https://github.com/user-attachments/assets/afbbdecf-3e63-419f-817c-2a9a4672e9a3" />
<img width="1894" height="926" alt="image" src="https://github.com/user-attachments/assets/b8f8d81d-061b-496d-8ba3-95c49d41ea73" />



---

## 📑 Table of Contents
- [📖 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture & Engineering Principles](#️-architecture--engineering-principles)
- [💻 Tech Stack](#-tech-stack)
- [🚀 Local Setup & Installation](#-local-setup--installation)
- [📸 Application Previews](#-application-previews)
- [👨‍💻 Author](#-author)

---

## ✨ Key Features

### Phase 1 & 2: Deterministic Analytics Engine
*   **Massive Data Ingestion:** Safely parses and loads heavy CSV datasets of school responses into a structured SQLite relational database.
*   **Rigorous Mathematical Metrics:** Calculates Total Active Schools, Project Participation Rates, Evidence Verification Rates, and Overall Attendance Indexes on the fly.
*   **Geographic Risk Tiering:** A deterministic classification system categorizes districts into strict system statuses (`On Track`, `Behind`, `At Risk`, `Critical`) based on health indices.

### Phase 3: Grounded AI Grant Reporting Assistant
*   **Clear Fact/Narrative Separation:** A custom-built Fact Panel renders hard-coded SQLite metrics (Ledgers, Milestones, Progress Rates) entirely independent of the AI pipeline.
*   **Zero-Hallucination AI Synthesis:** Integrates **Google Gemini 2.5 Flash** using strict prompt engineering. The LLM is forced to synthesize prose directly from the provided JSON database payload.
*   **Verification Fallback Testing:** Includes a physical UI toggle allowing users to disable the AI layer to test standard baseline drafts and ensure the system degrades gracefully.

---

## 🏗️ Architecture & Engineering Principles

*   **Deterministic Fallback Logic:** The core analytics dashboard operates entirely independent of the AI layer. Risk categorizations are calculated via a hardcoded engine to ensure 100% auditability.
*   **Database Stability:** Utilizes **Prisma 6** with a native `sqlite` provider. This choice eliminates the need for complex external driver adapters, ensuring reviewers can spin up the project locally with zero friction.
*   **Grounded AI Pipeline:** The LLM is strictly constrained. It does not fetch outside knowledge; it relies exclusively on the deterministic payload from the `GrantFinance`, `GrantPerformance`, and `GrantMedia` tables.

---

## 💻 Tech Stack

*   **Framework:** Next.js (App Router, React 18)
*   **Language:** TypeScript
*   **Database:** SQLite
*   **ORM:** Prisma (v6)
*   **Styling:** Tailwind CSS (v4) & Lucide Icons
*   **AI Provider:** Google Gemini API (`@google/generative-ai`)

---

## 🚀 Local Setup & Installation

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/mantra-pbl-intelligence.git](https://github.com/your-username/mantra-pbl-intelligence.git)
cd mantra-pbl-intelligence
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
```
*(Note: Do not commit this file to version control).*

### 4. Database Initialization & Seeding
Generate the Prisma client, push the schema to the local SQLite database, and seed the data:
```bash
# Push schema to database
npx prisma db push

# Seed Phase 1 & 2 Data (School Responses)
npx tsx prisma/seed.ts

# Seed Phase 3 Data (Grant Profiles & Media)
npx tsx prisma/seedGrants.ts
```

### 5. Start the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

---

## 📸 Application Previews

### 1. Tabbed Navigation & Media Indexing
<!-- 📸 IMAGE PLACEHOLDER: MEDIA / TABS VIEW -->
<!-- Add a screenshot showing the dynamic images loaded from the public/images folder in the AI Grant Assistant Tab. -->
<img width="1888" height="925" alt="image" src="https://github.com/user-attachments/assets/b0ae4243-420b-4213-abd2-8407af14eefe" />
<img width="1894" height="925" alt="image" src="https://github.com/user-attachments/assets/564f4cc5-71c0-4ae2-b2d6-d5b4daf0abdd" />



### 2. Gemini-Powered Narrative Synthesis
<!-- 📸 IMAGE PLACEHOLDER: GENERATED RESPONSE -->
<!-- Add the amazing screenshot you just shared showing the AI generating the report text with the "Synthesize Report Narrative" button clicked. -->
<img width="1888" height="922" alt="image" src="https://github.com/user-attachments/assets/4727442c-acc1-4333-a0e9-bff428aaeb15" />


---
*Built for the Mantra4Change Engineering Assessment.*
