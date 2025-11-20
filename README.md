<img width="1879" height="905" alt="image" src="https://github.com/user-attachments/assets/964ab0f6-0d9d-49a6-8f0a-65ca28cb60fa" />
# Smart Resume Analyser – AI-Powered Resume Evaluation Platform:
Smart Resume Analyser is a web platform designed to help students, freshers, and professionals improve their resumes using AI-driven insights. The platform focuses on ATS optimization, formatting accuracy, grammar correction, keyword relevance, and industry-specific enhancement. It enables users to build strong, job-ready resumes using intelligent guidance, analytics, and interactive tools.

**URL**: https://smartresumeanalyser-project.vercel.app/

**Table of Contents**

Features

Project Structure

Setup & Installation

Main Code Sequences & Architecture

Frontend (HTML/CSS/JS)

Backend (Node.js/Express/OpenAI)

Resume Analysis Engine

Authentication

AI Chatbot Integration

Customization

License

Contact

Example Screenshots

Deployment Instructions

## Features:

**AI Resume Evaluation:** ATS-style scoring with feedback on grammar, formatting, keywords, and job-specific optimization.

**Keyword Optimization:** Auto-suggests missing skills, action verbs, and domain keywords.

**ATS Score Generator:** Real-time scoring based on structure, readability, job match, and industry standards.

**PDF/Text Extractor:** Upload resumes in PDF/DOCX/TXT for parsing and AI analysis.

**Job Role Templates:** Preloaded resume templates for roles like SDE, Full-Stack Developer, Salesforce Developer, and more.

**AI Chat Assistant:** Guides users on resume writing, interview preparation, and job readiness.

**Authentication:** Email/password and Google login via Firebase.

**Responsive UI:** Clean, fast, mobile-friendly dashboard.

## Project Structure:
/
├── index.html                 # Main UI (upload panel, dashboard, analysis cards)
├── stylesheet.css             # All styles (responsive, dark mode, modern UI)
├── main.js                    # Resume upload, UI handling, analysis loader
├── auth.js                    # Firebase authentication logic
├── analyser.js                # Handles resume parsing & AI integration
├── server.js                  # Node.js backend (Express + OpenAI API)
├── parser.js                  # Extracts text from PDF/DOCX
├── templates/                 # Prebuilt resume formats & sample structures
├── assets/                    # Icons, logos, and media
├── package.json               # Dependencies and scripts
└── .env                       # Your OpenAI API key & configs

## Setup & Installation:
**1. Clone the Repository**
git clone https://github.com/yourusername/smart-resume-analyser.git
cd smart-resume-analyser

**2. Install Dependencies**
npm install

**3. Configure Environment Variables**
Create a .env file:

OPENAI_API_KEY=your_openai_api_key_here

**4. Start the Server**
npm start

The app will run at:
http://localhost:3000

## Main Code Sequences & Architecture:
**Frontend (HTML/CSS/JS)**
**index.html**

Layout: Navbar, dashboard, upload card, ATS score cards, suggestions panel.

Sections: Resume Analyzer, Templates, Chat Assistant, Profile.

Loads: main.js, analyser.js, auth.js.

**stylesheet.css**

Modern UI with neumorphism, flex layouts, and responsive design.

Dark/Light modes using CSS variables.

Components: upload box, score cards, charts, buttons, modal dialogs.

**main.js**

Resume Upload: Drag-and-drop & file picker.

Loader Animations: Progress bar, analysis animations.

UI Updates: Rendering ATS score, charts, keyword lists.

Notifications: Success/error toast messages.

**auth.js**

Firebase email/password and Google authentication.

Tracks user sessions.

Updates navbar based on login state.

Stores user analysis history.

**analyser.js**

Sends extracted resume text to the backend.

Renders AI feedback in categorized sections:

-Formatting

-Experience & Action Verbs

-Skills & ATS Keywords

-Grammar Corrections

-Job Match Percentage

Displays improvement suggestions with visual indicators.

## Backend (Node.js/Express/OpenAI)
**server.js**

Handles routes for:

Resume analysis

Parsing files

Template delivery

Integrates OpenAI for:

ATS scoring

Keyword extraction

Resume rewriting

Conversation-based context for the AI chatbot.

Health endpoint: /api/health

**parser.js**

Uses pdf-parse & docx libraries.

Extracts clean text while removing formatting issues.

Prepares data for the AI analyser.

**package.json**

Dependencies:

express

openai

multer (file upload)

pdf-parse / docx (resume parsing)

dotenv

firebase-admin

## Resume Analysis Engine:

**Text Processing:** Splits resume into Skills, Experience, Education, Projects.

**Keyword Matching:** Compares against job-role specific skill banks.

**ATS Simulation:**
Header structure

Readability metrics

Proper section ordering

Bullet-based achievements

Quantified impact

**AI Suggestions:**

Concise rewrites

Missing metrics

Recommended keywords

Strengths & weaknesses summary

**Authentication:**

Email & Password Login

Google Authentication

Password Reset

Session Tracking

Saved analysis history

**AI Chatbot Integration:**

Resume rewriting assistant

Job role-specific advice

ATS keyword suggestions

Interview preparation tips

Context-aware responses

**Customization:**

Change theme, colors, fonts in stylesheet.css.

Add new resume templates in /templates/.

Modify job-role keyword banks in analyser.js.

Extend backend routes for advanced AI features.

**License:**

This project is for educational and non-commercial use.
Contact the developer for professional or commercial licensing.

**Contact:**

For feedback, contributions, or queries, reach out:
**Pranjal Khandelwal**

LinkedIn: https://www.linkedin.com/in/pranjal-khandelwal-1a46682a4/

GitHub: https://github.com/golu19102003

Twitter: https://x.com/Pranjal76009498

Instagram: https://www.instagram.com/pranjal19102003_2.0/

**Example Screenshots**
Dashboard Home

<img width="1873" height="892" alt="image" src="https://github.com/user-attachments/assets/2e36905b-745d-4265-859b-ab8e8520de50" />

Resume Upload

<img width="1879" height="902" alt="image" src="https://github.com/user-attachments/assets/e182589c-a895-481e-9829-5f92126dbb24" />

ATS Score Report

<img width="1883" height="892" alt="image" src="https://github.com/user-attachments/assets/222718e8-9f16-42fa-af70-9043393b190d" />

AI Suggestions Panel

<img width="1870" height="885" alt="image" src="https://github.com/user-attachments/assets/f423e3b3-6f08-4710-be0d-00c125abde26" />


## Deployment Instructions:
Local Deployment
git clone https://github.com/yourusername/smart-resume-analyser.git
npm install
npm start


Runs at: http://localhost:3000

**Cloud Deployment (Render/Heroku/Vercel)**

Push project to GitHub.

Create new web service.

Add env variables:

OPENAI_API_KEY

Deploy.

**Firebase Setup**

Enable Email/Password + Google Auth.

Add Firebase config to auth.js.

**Optional**

Custom Domain

HTTPS (auto in most cloud platforms)

Analytics

Performance Optimization
Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
