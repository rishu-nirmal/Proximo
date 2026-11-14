# 🪐 StudyOrbit — Smart Academic Companion

> **Interactive, Mobile-First Academic Planner with Custom Student Onboarding & Balanced-Focus Engine**  
> *Designed for SRM University - AP (Amaravati)*

StudyOrbit transforms how engineering students organize their coursework, prepare for examinations, and maintain academic equilibrium. Rather than acting as a static or generic to-do list, StudyOrbit first asks the student for their personal and academic details (Name, Registration Number, Branch, Year, Semester, and Course List), and then tailors all schedules, metrics, and study suggestions directly to them.

---

## 🚀 First-Time Interactive Onboarding Setup Wizard

When a user opens the app for the first time, StudyOrbit displays a multi-step setup flow before showing any dashboard data:

1. **Step 1: Student Identity**
   - Full Name (e.g. *Rishabh Nirmal*)
   - Registration Number (e.g. *AP23110010452*)
   - University Campus (*SRM University - AP, Amaravati*)
   - Optional *⚡ Quick Fill Sample Profile* button for instant testing.
2. **Step 2: Academic Program & Year**
   - Branch / Specialization:
     - BTech CSE (AI & Machine Learning)
     - BTech CSE (General / Core)
     - BTech CSE (Data Science)
     - BTech CSE (Cyber Security)
     - BTech Electronics & Communication (ECE)
     - Other Engineering Branch
   - Year: 1st Year (Fresher), 2nd Year (Sophomore), 3rd Year (Pre-Final), 4th Year (Final).
   - Semester: Dynamically updates to match the selected year (e.g., Year 3 -> Semester 5 or 6).
   - Weekly Study Target: Custom slider from 15h to 45h/week (default: 28h).
3. **Step 3: Select Your Courses**
   - Automatically loads the recommended SRM AP curriculum for that specific Branch and Year.
   - Interactive course tiles with Course Code, Course Name, Credits, and Faculty.
   - Check or uncheck any subject.
   - **➕ Add Custom Course**: Easily add any custom elective, lab, or departmental course with custom credits and colors.
4. **Step 4: Academic Priority & Launch**
   - Identifies which course needs the most attention or is most challenging to prime the **Balanced-Focus Engine**.
   - Live summary card previewing student credentials, courses, and targets.
   - **🚀 Launch My Academic Orbit**: Generates personalized starter tasks, syllabus units, upcoming exam countdowns, and launches the personalized dashboard with celebration confetti!

> [!NOTE]
> Students can reconfigure their profile, switch years or semesters, or add/remove courses at any time by clicking **"🔄 Reconfigure"** in the Settings tab.

---

## 🌟 Core App Capabilities

### 1. 📚 Course & Task Management
- **Course Metadata**: Code, Name, Credits, Faculty, Syllabus Units, and Attendance target.
- **Task Types**: Assignment, Lab Record, Quiz, Exam Prep, Project, Reading.
- **Manual Progress Slider (0% to 100%)**: Drag or tap to set exact partial completion on any task.
- **Interactive Checklists & Subtasks**: Expandable subtasks that automatically calculate and update task completion percentage.
- **Quick-Add Modal**: Floating Action Button (FAB) and header button allowing task entry in under **5 seconds**.

---

### 2. ⚖️ Balanced-Focus System (Signature Feature)
- **Balance Meter & Live Distribution Track**: Analyzes hours spent across courses and warns the student of uneven focus:
  > *"You’ve spent 47% of your week on ML. DBMS and Operating Systems need some love!"*
- **Weekly Balance Score (0 - 100)**: Evaluates workload deviation from ideal credit weights. Categorized into:
  - **Harmonious Orbit** (85–100) 🌟
  - **Healthy Spread** (70–84) ⚖️
  - **Orbital Wobble** (55–69) ⚠️
  - **Gravitational Drift** (<55) 🚨
- **Smart "What to Study Next" AI Advisor**:
  - Automatically identifies top 3 actionable tasks based on deadline urgency (<12h, <24h), course neglect penalty, priority, and progress momentum.
  - Direct 1-click **"Start 25m Focus"** button that initializes the Pomodoro timer for that exact course.

---

### 3. 📊 Graphical Stats & Analytics
- **4 Interactive Charts (Chart.js + Responsive SVG Fallbacks)**:
  1. **Effort Split Donut Chart**: Logged hours by course with percentage tooltips.
  2. **Productivity Bar Chart**: Task completion rate across all subjects.
  3. **7-Day Trend Line Chart**: Hours studied per day vs. the daily 4h benchmark.
  4. **Holistic Radar Chart**: 5-axis comparison (*Effort, Syllabus, Tasks, Timeliness, Confidence*).
- **Triple Completion Rings**:
  - **Today's Target Ring** (Tasks due or worked on today).
  - **Weekly Study Goal Ring** (Logged hours vs. weekly target).
  - **Semester Milestone Ring** (Semester timeline progress).
- **Strengths & Gaps**: Highlights top-performing courses vs. subjects needing immediate attention.
- **Syllabus & Topic Tracker**: Unit-by-unit progress for every course.

---

### 4. 🔔 Smart Reminders & Nudges
- **Notification Drawer**:
  - Simulated deadline alerts (1 day, 3 hours, and 30 minutes before).
  - Urgent alerts for overdue portal submissions.
  - Inline **"Snooze 3h"**, **"Reschedule to Tomorrow"**, and **"Open Task"** actions.
- **Daily Morning Briefing**: Top-of-dashboard summary tailored with the student's name.

---

### 5. ⏱️ Pomodoro Focus Timer & Ambient Sounds
- **Subject-Linked Study Sessions**: Choose any course to link your focus sprint.
- **Modes**: 25m Focus, 5m Short Break, 15m Long Break.
- **Procedural Web Audio Engine**:
  - 🎧 *Binaural Alpha Waves (40Hz)* for deep cognitive focus.
  - 🌧️ *Campus Rain & White Noise* generated via real-time synthesis.
  - 🔔 *Tibetan Bell Chime* on completion.
  - *100% offline — requires no external audio downloads.*
- **Automatic Logging**: Finishing a session adds +0.42 hrs to that course's weekly tally, awards **+50 XP**, rebalances the meter, and triggers celebration confetti.

---

### 6. 🏆 Academic Gamification, Calendar & Review
- **Consistency Engine**: Active study streak 🔥, Level badges, and XP bar.
- **Academic Calendar**: Interactive month view with color-coded subject indicator dots and countdowns to SRM AP Mid-Terms, Lab Vivas, and End-Semesters.
- **Weekly Review Screen**: Sunday academic audit with hours summary, wins, focus gaps, and a 3-step AI gameplan for the coming week.
- **Theme & Offline Persistence**: Deep space dark mode (default) and crisp light mode toggle. All data persists in `localStorage` with JSON export and import backups.

---

## 🚀 How to Run

1. **Directly in your Browser**:  
   Open [index.html](file:///C:/Users/Rishabh%20Nirmal/.gemini/antigravity/scratch/studyorbit/index.html) in Chrome, Edge, Firefox, or Safari.
2. **Via Local Server** (Optional):  
   ```powershell
   cd "C:\Users\Rishabh Nirmal\.gemini\antigravity\scratch\studyorbit"
   python -m http.server 8080
   ```
   Then visit `http://localhost:8080` in your browser.

---

## 📁 File Structure
```
studyorbit/
├── index.html           # SPA with full-screen Onboarding Wizard + all 8 screen views
├── css/
│   └── styles.css       # Complete responsive CSS, glassmorphism, themes & wizard styles
├── js/
│   ├── data.js          # Curriculum presets (Years 1-4, AI/ML, Core) & custom dataset generator
│   ├── balance.js       # Balanced-Focus engine & recommendation algorithms
│   ├── timer.js         # Pomodoro timer with Web Audio sound synthesis
│   ├── charts.js        # Chart.js analytics & SVG fallback renderers
│   └── app.js           # Onboarding wizard manager, task CRUD & modal handlers
└── README.md            # Documentation & setup guide
```
