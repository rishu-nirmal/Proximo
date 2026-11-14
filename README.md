# 🪐 Proximo — Smart Academic Companion

> **"Proximo" (Latin for *Next*) — Know what to study next, stay in balance, and never miss a deadline.**  
> *Tailored for engineering students at SRM University - AP (Amaravati).*

Proximo is a mobile-first, responsive academic study planner and balanced-focus engine designed to help students organize college work, keep their study effort balanced across every subject, and receive timely alarms and reminders for upcoming deadlines.

---

## 🚀 Pushing to your GitHub Repo (`Proximo`) & Deploying on Vercel

### Step 1: Connect to your GitHub repository
In your terminal / PowerShell, navigate to this project folder and run:

```powershell
cd "C:\Users\Rishabh Nirmal\.gemini\antigravity\scratch\studyorbit"

# 1. Add your GitHub Proximo repository as origin:
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/Proximo.git

# 2. Ensure default branch is main:
git branch -M main

# 3. Push your code to GitHub:
git push -u origin main
```
*(If you already added a README on GitHub when creating the repo, run `git pull origin main --rebase` before `git push -u origin main`)*

---

### Step 2: Deploy on Vercel (1-Click)

1. Go to [vercel.com/new](https://vercel.com/new) and log in.
2. Under **"Import Git Repository"**, select **`Proximo`**.
3. Leave all build settings as default (Framework Preset: **Other**, Root Directory: `./`).
4. Click **Deploy**.
5. Within 20 seconds, your site is live with a fast HTTPS URL (e.g., `https://proximo-srmap.vercel.app`)!

---

### Step 3: Install Proximo on Your Mobile Phone (PWA)

* **On iPhone (Safari)**:
  1. Open your Vercel URL in Safari.
  2. Tap the **Share** button (box with upward arrow).
  3. Scroll down and tap **"Add to Home Screen"**.
  4. Tap **"Add"**. Proximo will launch in true fullscreen with its custom celestial icon!
* **On Android (Chrome / Brave / Edge)**:
  1. Open your Vercel URL.
  2. Tap the **three-dots menu (⋮)** in the top right.
  3. Tap **"Add to Home screen"** or **"Install App"**.

---

## 🌟 Key Features

### 1. 📋 Custom Student Onboarding Setup Wizard
- **First-time configuration**: Prompts the student for their Name, SRM AP Reg No, Branch, Year, and Semester before showing any data.
- **Dynamic Curriculum Pre-population**: Recommends the official syllabus subjects for 1st Year, 2nd Year, 3rd Year (AI/ML, Core), and 4th Year.
- **Custom Course Adder**: Add custom electives and labs with custom credits and colors.

### 2. 🔔 Task Alarms & Mobile Notifications
- **Web Audio Synthesizer Ringtone**: Rings a gentle repeating academic alarm chime when an assignment or lab record is due soon (<1h, <30m) or overdue.
- **Phone Vibration**: Vibrates mobile devices rhythmically in sync with the audio alarm.
- **Interactive Alarm Modal**:
  - **🛑 Dismiss & Stop Alarm**: Stops the audio ringtone immediately and marks the alert as checked.
  - **📋 Check Out / Open Task**: Stops the alarm and opens the task modal directly.
  - **⏰ Snooze (15 Mins)**: Pauses the alarm for 15 minutes.
- **⚡ Instant Test Button**: Tap *"⚡ Test Alarm Ringtone"* in the Notifications Drawer or Settings to test the ringtone and popup on your phone!

### 3. ⚖️ Balanced-Focus System ("What to Study Next")
- **Balance Meter & Live Distribution Track**: Analyzes hours spent across courses and warns the student of uneven focus (e.g. *"You've spent 47% of your week on ML. DBMS needs some love!"*).
- **Weekly Balance Score (0 - 100)**: Evaluates workload deviation from ideal credit weights.
- **Smart "What to Study Next" AI Advisor**: Prioritizes 3 actionable tasks based on urgency, subject deficit, and progress momentum.

### 4. 📊 Graphical Stats & Analytics
- **4 Interactive Charts (Chart.js + SVG Fallbacks)**:
  1. **Effort Split Donut Chart**: Logged hours by course with percentage tooltips.
  2. **Productivity Bar Chart**: Task completion rate across all subjects.
  3. **7-Day Trend Line Chart**: Hours studied per day vs. the daily 4h benchmark.
  4. **Holistic Radar Chart**: 5-axis comparison (*Effort, Syllabus, Tasks, Timeliness, Confidence*).
- **Triple Completion Rings**: Today's Target Ring, Weekly Study Goal Ring, and Semester Milestone Ring.
- **Strengths & Gaps**: Top-performing course vs. subjects needing immediate attention.

### 5. ⏱️ Pomodoro Focus Timer & Ambient Sounds
- **Subject-Linked Study Sessions**: Automatically logs study hours to that course.
- **Procedural Web Audio Engine**: Binaural Alpha Waves (40Hz), Campus Rain & White Noise, and Tibetan Bell Chime.
- **Auto-Logging**: Awards +50 XP and re-calculates the Balance Meter on session completion.

---

## 📁 File Structure
```
proximo/
├── index.html           # Single Page App with Setup Wizard & all views
├── css/
│   └── styles.css       # Complete responsive CSS, glassmorphism & safe area insets
├── js/
│   ├── data.js          # Curriculum presets & custom dataset generator
│   ├── balance.js       # Balanced-Focus engine & recommendation algorithms
│   ├── timer.js         # Pomodoro timer with Web Audio sound generator
│   ├── charts.js        # Chart.js analytics & SVG fallback renderers
│   ├── alarm.js         # Task alarm audio synthesizer, vibration & dismiss system
│   └── app.js           # Navigation router, task CRUD & modal handlers
├── manifest.webmanifest # PWA configuration (standalone, theme colors, icons)
├── sw.js                # Service Worker for offline campus caching
├── vercel.json          # Vercel deployment & security headers configuration
├── icon.svg             # High-res celestial app icon
└── README.md            # Documentation & setup guide
```
