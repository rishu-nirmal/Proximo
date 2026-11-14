## Live Demo
Check out the live app here: [Launch App](https://vercel.com/hello-world-d43f/proximo/7YMkxmNU7Rwq364pt5VofRNKvUcj)


# 🪐 Proximo — Smart Academic Companion

> **"Proximo" (Latin for *Next*) — Know what to study next, stay in balance, and never miss a deadline.**  
> *Tailored for engineering students at SRM University - AP (Amaravati).*

Proximo is a mobile-first, responsive academic study planner and balanced-focus engine designed to help students organize college work, keep their study effort balanced across every subject, and receive timely alarms and reminders for upcoming deadlines.

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
