/**
 * Proximo - Main Application Coordinator
 * Handles Navigation, Task CRUD, Balance System, Modals, Calendar,
 * and the Interactive Student Onboarding & Curriculum Setup Wizard.
 */

// Global State
window.App = {
  data: null,
  timer: null,
  currentTab: "home",
  activeFilter: "all",
  activeSort: "deadline",
  searchQuery: "",
  activeSubjectDetailId: null,
  selectedCalendarDate: new Date().toISOString().split("T")[0],

  // Onboarding Wizard State
  currentWizardStep: 1,
  wizardSelectedSubjects: [],
  wizardCustomCounter: 1,

  init() {
    // 1. Check if user has completed setup and has data
    const onboarded = hasCompletedOnboarding();
    const stored = loadData();

    if (!onboarded || !stored) {
      // First-time visit: Display full-screen interactive setup wizard
      this.showOnboardingWizard();
    } else {
      this.data = stored;
      this.launchMainDashboard();
    }
  },

  // ==========================================
  // ONBOARDING SETUP WIZARD
  // ==========================================
  showOnboardingWizard(isReconfigure = false) {
    const wizardEl = document.getElementById("onboarding-wizard-screen");
    const appEl = document.getElementById("main-app-container");

    if (wizardEl) wizardEl.style.display = "flex";
    if (appEl) appEl.style.display = "none";

    this.currentWizardStep = 1;
    this.updateWizardStepView();
    this.populateSemesterOptions();

    if (isReconfigure && this.data && this.data.profile) {
      const p = this.data.profile;
      const nameInput = document.getElementById("wiz-name");
      const regInput = document.getElementById("wiz-regno");
      if (nameInput) nameInput.value = p.name || "";
      if (regInput) regInput.value = p.regNo || "";

      this.wizardSelectedSubjects = JSON.parse(JSON.stringify(this.data.subjects || []));
    } else {
      // Load default presets for Year 3 CSE AI/ML
      this.loadPresetSubjectsForSelection("year_3", "cse_aiml");
    }
  },

  hideOnboardingWizard() {
    const wizardEl = document.getElementById("onboarding-wizard-screen");
    const appEl = document.getElementById("main-app-container");

    if (wizardEl) wizardEl.style.display = "none";
    if (appEl) appEl.style.display = "flex";
  },

  updateWizardStepView() {
    // Hide all step cards, show current
    document.querySelectorAll(".wizard-step-card").forEach(c => c.classList.remove("active"));
    const currentCard = document.getElementById(`wizard-step-${this.currentWizardStep}`);
    if (currentCard) currentCard.classList.add("active");

    // Update stepper indicators
    document.querySelectorAll(".step-indicator").forEach(ind => {
      const step = parseInt(ind.dataset.step, 10);
      ind.classList.remove("active", "completed");
      if (step === this.currentWizardStep) {
        ind.classList.add("active");
      } else if (step < this.currentWizardStep) {
        ind.classList.add("completed");
      }
    });

    // Update stepper line fill percentage
    const fillEl = document.getElementById("stepper-line-fill");
    if (fillEl) {
      const pct = ((this.currentWizardStep - 1) / 3) * 100;
      fillEl.style.width = `${pct}%`;
    }

    // Scroll wizard container to top
    const wrapper = document.getElementById("onboarding-wizard-screen");
    if (wrapper) wrapper.scrollTo({ top: 0, behavior: "smooth" });
  },

  nextWizardStep(targetStep) {
    // Validation before advancing
    if (this.currentWizardStep === 1) {
      const name = (document.getElementById("wiz-name").value || "").trim();
      if (!name) {
        alert("Please enter your name so Proximo can address you.");
        return;
      }
    } else if (this.currentWizardStep === 2) {
      // User picked branch and year, refresh curriculum list
      const branch = document.getElementById("wiz-branch").value;
      const year = document.getElementById("wiz-year").value;
      this.loadPresetSubjectsForSelection(year, branch);
      this.renderCurriculumOptions();
    } else if (this.currentWizardStep === 3) {
      // Validate at least 2 subjects are selected
      if (this.wizardSelectedSubjects.length < 2) {
        alert("Please select at least 2 courses for your semester.");
        return;
      }
      this.populateStep4Summary();
    }

    this.currentWizardStep = targetStep;
    this.updateWizardStepView();
  },

  prevWizardStep(targetStep) {
    this.currentWizardStep = targetStep;
    this.updateWizardStepView();
  },

  handleBranchOrYearChange() {
    this.populateSemesterOptions();
    const branch = document.getElementById("wiz-branch").value;
    const year = document.getElementById("wiz-year").value;
    this.loadPresetSubjectsForSelection(year, branch);
    this.renderCurriculumOptions();
  },

  populateSemesterOptions() {
    const yearSelect = document.getElementById("wiz-year");
    const semSelect = document.getElementById("wiz-semester");
    if (!yearSelect || !semSelect) return;

    const yearVal = yearSelect.value;
    let semOptions = [];

    if (yearVal === "year_1") {
      semOptions = ["Semester 1 (Fall)", "Semester 2 (Spring)"];
    } else if (yearVal === "year_2") {
      semOptions = ["Semester 3 (Fall)", "Semester 4 (Spring)"];
    } else if (yearVal === "year_3") {
      semOptions = ["Semester 5 (Monsoon 2026)", "Semester 6 (Spring 2027)"];
    } else {
      semOptions = ["Semester 7 (Fall 2026)", "Semester 8 (Spring 2027)"];
    }

    semSelect.innerHTML = semOptions.map((s, idx) => `
      <option value="${s}" ${idx === 0 ? 'selected' : ''}>${s}</option>
    `).join('');
  },

  loadPresetSubjectsForSelection(year, branch) {
    let presetList = [];
    if (year === "year_1") {
      presetList = CURRICULUM_PRESETS.year_1;
    } else if (year === "year_2") {
      presetList = CURRICULUM_PRESETS.year_2;
    } else if (year === "year_3") {
      if (branch === "cse_aiml") {
        presetList = CURRICULUM_PRESETS.year_3_aiml;
      } else {
        presetList = CURRICULUM_PRESETS.year_3_core;
      }
    } else if (year === "year_4") {
      presetList = CURRICULUM_PRESETS.year_4;
    } else {
      presetList = CURRICULUM_PRESETS.year_3_aiml;
    }

    // Clone into wizardSelectedSubjects
    this.wizardSelectedSubjects = JSON.parse(JSON.stringify(presetList));
  },

  renderCurriculumOptions() {
    const grid = document.getElementById("wiz-courses-grid");
    if (!grid) return;

    const branch = document.getElementById("wiz-branch");
    const branchText = branch ? branch.options[branch.selectedIndex].text : "Selected Program";
    const year = document.getElementById("wiz-year");
    const yearText = year ? year.options[year.selectedIndex].text : "Academic Year";

    const descEl = document.getElementById("wiz-subjects-desc");
    if (descEl) {
      descEl.textContent = `Recommended curriculum for ${yearText} · ${branchText}. Toggle courses on/off or add custom electives.`;
    }

    const yearVal = year ? year.value : "year_3";
    const branchVal = branch ? branch.value : "cse_aiml";

    // All available presets for this selection
    let fullOptions = [];
    if (yearVal === "year_1") fullOptions = CURRICULUM_PRESETS.year_1;
    else if (yearVal === "year_2") fullOptions = CURRICULUM_PRESETS.year_2;
    else if (yearVal === "year_3") {
      fullOptions = branchVal === "cse_aiml" ? CURRICULUM_PRESETS.year_3_aiml : CURRICULUM_PRESETS.year_3_core;
    } else fullOptions = CURRICULUM_PRESETS.year_4;

    // Merge with any custom courses user has added
    const customCourses = this.wizardSelectedSubjects.filter(s => s.isCustom);
    const combined = [...fullOptions, ...customCourses];

    grid.innerHTML = combined.map(subj => {
      const isSelected = this.wizardSelectedSubjects.some(s => s.id === subj.id);
      return `
        <div class="course-tile ${isSelected ? 'selected' : ''}" onclick="App.toggleWizardCourse('${subj.id}')">
          <input type="checkbox" ${isSelected ? 'checked' : ''} class="course-tile-checkbox" onclick="event.stopPropagation(); App.toggleWizardCourse('${subj.id}')" />
          <span class="course-tile-dot" style="background: ${subj.color};"></span>
          <div class="course-tile-info">
            <div class="course-tile-top">
              <span class="course-tile-code">${subj.code}</span>
              <span class="course-credits-badge">${subj.credits} Credits</span>
            </div>
            <div class="course-tile-name">${subj.name}</div>
            <div class="course-tile-meta">${subj.faculty || 'SRM AP'} · Target: ${subj.targetWeeklyHours || 6}h/wk</div>
          </div>
        </div>
      `;
    }).join('');

    this.updateWizardSelectedBadge();
  },

  toggleWizardCourse(subjectId) {
    const branch = document.getElementById("wiz-branch").value;
    const year = document.getElementById("wiz-year").value;

    let fullOptions = [];
    if (year === "year_1") fullOptions = CURRICULUM_PRESETS.year_1;
    else if (year === "year_2") fullOptions = CURRICULUM_PRESETS.year_2;
    else if (year === "year_3") fullOptions = branch === "cse_aiml" ? CURRICULUM_PRESETS.year_3_aiml : CURRICULUM_PRESETS.year_3_core;
    else fullOptions = CURRICULUM_PRESETS.year_4;

    const customCourses = this.wizardSelectedSubjects.filter(s => s.isCustom);
    const combined = [...fullOptions, ...customCourses];

    const idx = this.wizardSelectedSubjects.findIndex(s => s.id === subjectId);
    if (idx >= 0) {
      this.wizardSelectedSubjects.splice(idx, 1);
    } else {
      const target = combined.find(s => s.id === subjectId);
      if (target) {
        this.wizardSelectedSubjects.push(JSON.parse(JSON.stringify(target)));
      }
    }

    this.renderCurriculumOptions();
  },

  updateWizardSelectedBadge() {
    const badge = document.getElementById("wiz-selected-badge");
    if (badge) {
      const count = this.wizardSelectedSubjects.length;
      const totalCredits = this.wizardSelectedSubjects.reduce((sum, s) => sum + (s.credits || 4), 0);
      badge.textContent = `${count} Courses (${totalCredits} Credits)`;
    }
  },

  toggleAddCustomSubjectBox() {
    const box = document.getElementById("wiz-custom-course-box");
    if (box) box.classList.toggle("open");
  },

  addCustomSubjectToWizard() {
    const nameInput = document.getElementById("wiz-custom-name");
    const codeInput = document.getElementById("wiz-custom-code");
    const credSelect = document.getElementById("wiz-custom-credits");
    const colorSelect = document.getElementById("wiz-custom-color");

    const name = (nameInput.value || "").trim();
    if (!name) {
      alert("Please enter a course name.");
      return;
    }

    const code = (codeInput.value || "").trim().toUpperCase() || `CS${350 + this.wizardCustomCounter}`;
    const credits = parseInt(credSelect.value, 10) || 4;
    const color = colorSelect.value || "#6366F1";
    const id = `custom-${Date.now()}`;

    const newSubj = {
      id,
      code,
      name,
      credits,
      color,
      bgLight: color + "1F",
      icon: "book-open",
      faculty: "SRM AP Faculty",
      targetWeeklyHours: credits >= 4 ? 7.0 : (credits === 3 ? 5.5 : 4.0),
      isCustom: true
    };

    this.wizardSelectedSubjects.push(newSubj);
    this.wizardCustomCounter++;

    nameInput.value = "";
    codeInput.value = "";
    this.toggleAddCustomSubjectBox();
    this.renderCurriculumOptions();
    this.showToast(`Added custom course: ${code} - ${name}`);
  },

  quickFillWizardSample() {
    document.getElementById("wiz-name").value = "Aryan Sharma";
    document.getElementById("wiz-regno").value = "AP23110010452";
    document.getElementById("wiz-branch").value = "cse_aiml";
    document.getElementById("wiz-year").value = "year_3";
    this.populateSemesterOptions();
    document.getElementById("wiz-semester").value = "Semester 5 (Monsoon 2026)";
    document.getElementById("wiz-goal-slider").value = 28;
    document.getElementById("wiz-goal-display").textContent = "28 hrs/week";

    this.loadPresetSubjectsForSelection("year_3", "cse_aiml");
    this.showToast("⚡ Quick-filled with SRM AP 3rd Year AI/ML profile!");
    this.nextWizardStep(2);
  },

  populateStep4Summary() {
    const name = document.getElementById("wiz-name").value.trim();
    const regno = document.getElementById("wiz-regno").value.trim().toUpperCase() || "AP23110010452";
    const branchSelect = document.getElementById("wiz-branch");
    const branchName = branchSelect.options[branchSelect.selectedIndex].text;
    const yearSelect = document.getElementById("wiz-year");
    const yearName = yearSelect.options[yearSelect.selectedIndex].text;
    const semName = document.getElementById("wiz-semester").value;
    const goalHours = document.getElementById("wiz-goal-slider").value;

    document.getElementById("sum-name").textContent = name;
    document.getElementById("sum-regno").textContent = regno;
    document.getElementById("sum-program").textContent = `${yearName} · ${semName} · ${branchName}`;
    document.getElementById("sum-courses").textContent = `${this.wizardSelectedSubjects.length} Courses (${this.wizardSelectedSubjects.map(s => s.code).join(', ')})`;
    document.getElementById("sum-goal").textContent = `${goalHours} hours / week`;

    // Populate priority subject dropdown
    const prioritySelect = document.getElementById("wiz-priority-subject");
    if (prioritySelect) {
      prioritySelect.innerHTML = this.wizardSelectedSubjects.map(s => `
        <option value="${s.id}">${s.code} - ${s.name} (${s.credits} Credits)</option>
      `).join('');
    }
  },

  finishOnboardingAndLaunch() {
    const name = document.getElementById("wiz-name").value.trim();
    if (!name) {
      alert("Please enter your name.");
      this.currentWizardStep = 1;
      this.updateWizardStepView();
      return;
    }

    const regno = (document.getElementById("wiz-regno").value || "").trim().toUpperCase() || "AP23110010452";
    const branchSelect = document.getElementById("wiz-branch");
    const branchName = branchSelect.options[branchSelect.selectedIndex].text;
    const yearSelect = document.getElementById("wiz-year");
    const yearName = yearSelect.options[yearSelect.selectedIndex].text;
    const semName = document.getElementById("wiz-semester").value;
    const goalHours = parseInt(document.getElementById("wiz-goal-slider").value, 10) || 28;
    const prioritySubjId = document.getElementById("wiz-priority-subject").value;

    const userInput = {
      name,
      regNo: regno,
      university: "SRM University - AP, Amaravati",
      branchName,
      yearName,
      semName,
      weeklyGoalHours: goalHours,
      prioritySubjectId: prioritySubjId
    };

    // 1. Generate full tailored dataset
    this.data = createPersonalizedDataset(userInput, this.wizardSelectedSubjects);

    // 2. Persist to storage
    saveData(this.data);
    markOnboardingComplete();

    // 3. Switch views & celebrate
    this.hideOnboardingWizard();
    this.launchMainDashboard();
    this.triggerConfetti();

    this.showToast(`🚀 Welcome, ${name.split(' ')[0]}! Your academic orbit is launched!`);
  },

  openReconfigureWizard() {
    this.showOnboardingWizard(true);
  },

  resetToNewStudentSetup() {
    if (confirm("Reset all academic profile data and start the setup wizard again?")) {
      resetOnboarding();
      location.reload();
    }
  },

  // ==========================================
  // MAIN DASHBOARD LAUNCH & BINDINGS
  // ==========================================
  launchMainDashboard() {
    const appEl = document.getElementById("main-app-container");
    if (appEl) appEl.style.display = "flex";

    // 1. Apply theme
    this.applyTheme(this.data.profile.theme || "dark");

    // 2. Initialize timer & task alarm system
    this.initTimer();
    if (window.AlarmManager) {
      window.AlarmManager.init();
    }

    // 3. Bind events
    this.bindEvents();

    // 4. Update header tags
    const headerTag = document.getElementById("header-branch-tag");
    const sidebarBranchTag = document.getElementById("sidebar-branch-tag");
    const sidebarSemTag = document.getElementById("sidebar-sem-tag");

    const roleText = this.data.profile.role.replace("BTech ", "");
    if (headerTag) headerTag.textContent = `${this.data.profile.semester.split(' ')[0]} · ${roleText}`;
    if (sidebarBranchTag) sidebarBranchTag.textContent = roleText;
    if (sidebarSemTag) sidebarSemTag.textContent = this.data.profile.semester;

    // 5. Render screen
    this.switchTab("home");
    this.updateNotificationBadge();
  },

  // --- Theme Management ---
  applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
    if (this.data && this.data.profile) {
      this.data.profile.theme = theme;
      saveData(this.data);
    }

    if (this.currentTab === "stats" || this.currentTab === "home") {
      if (this.data) ChartsManager.renderAll(this.data);
    }
  },

  toggleTheme() {
    const isDark = document.body.classList.contains("dark-theme");
    this.applyTheme(isDark ? "light" : "dark");
  },

  // --- Navigation / Tab Switching ---
  switchTab(tabId) {
    this.currentTab = tabId;

    document.querySelectorAll(".screen-view").forEach(el => {
      el.classList.remove("active");
    });
    const targetScreen = document.getElementById(`screen-${tabId}`);
    if (targetScreen) targetScreen.classList.add("active");

    document.querySelectorAll(".nav-item").forEach(item => {
      if (item.dataset.tab === tabId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
    this.renderCurrentScreen();
  },

  renderCurrentScreen() {
    if (!this.data) return;

    switch (this.currentTab) {
      case "home":
        this.renderHomeScreen();
        break;
      case "tasks":
        this.renderTasksScreen();
        break;
      case "stats":
        this.renderStatsScreen();
        break;
      case "calendar":
        this.renderCalendarScreen();
        break;
      case "timer":
        this.renderTimerScreen();
        break;
      case "review":
        this.renderReviewScreen();
        break;
      case "subject-detail":
        this.renderSubjectDetailScreen();
        break;
      case "settings":
        this.renderSettingsScreen();
        break;
    }
  },

  // ==========================================
  // 1. HOME DASHBOARD
  // ==========================================
  renderHomeScreen() {
    const profile = this.data.profile;
    const balance = BalanceEngine.calculateBalanceMetrics(this.data);
    const recs = BalanceEngine.getSmartRecommendations(this.data, 3);
    const now = new Date();

    // Greeting & Morning Summary
    const greetingEl = document.getElementById("home-greeting");
    if (greetingEl) {
      const hours = now.getHours();
      let greeting = "Good morning";
      if (hours >= 12 && hours < 17) greeting = "Good afternoon";
      else if (hours >= 17) greeting = "Good evening";
      greetingEl.innerHTML = `${greeting}, <span class="gradient-text">${profile.name.split(' ')[0]}</span> 🚀`;
    }

    const subGreetingEl = document.getElementById("home-sub-greeting");
    if (subGreetingEl) {
      subGreetingEl.textContent = `${profile.semester} · ${profile.role} · ${profile.university}`;
    }

    // Daily Briefing Banner
    const todayStr = now.toISOString().split("T")[0];
    const todayTasks = this.data.tasks.filter(t => t.deadline.startsWith(todayStr) && t.status !== "completed");
    const overdueTasks = this.data.tasks.filter(t => t.status === "overdue");

    const briefingEl = document.getElementById("home-daily-briefing");
    if (briefingEl) {
      briefingEl.innerHTML = `
        <div class="briefing-card glass-panel">
          <div class="briefing-icon">🌅</div>
          <div class="briefing-content">
            <h4 class="briefing-title">Today's Academic Briefing</h4>
            <p class="briefing-desc">
              You have <strong>${todayTasks.length} task${todayTasks.length === 1 ? '' : 's'}</strong> due today
              ${overdueTasks.length > 0 ? ` and <span class="badge-pill pill-urgent">${overdueTasks.length} overdue</span>` : ''}.
              ${balance.message}
            </p>
          </div>
        </div>
      `;
    }

    // Balance Meter Widget (Signature Feature)
    const meterEl = document.getElementById("home-balance-meter");
    if (meterEl) {
      meterEl.innerHTML = `
        <div class="balance-card glass-panel glow-${balance.statusClass}">
          <div class="balance-top">
            <div class="balance-title-group">
              <span class="section-label">BALANCED-FOCUS METER</span>
              <h3 class="balance-status-heading">
                ${balance.statusIcon} ${balance.status}
              </h3>
            </div>
            <div class="balance-score-pill ${balance.statusClass}">
              <span class="score-number">${balance.score}</span>
              <span class="score-denom">/100</span>
            </div>
          </div>

          <!-- Balance distribution bar -->
          <div class="balance-distribution-track">
            ${balance.subjectStats.map(s => `
              <div class="balance-seg" style="width: ${s.actualPct}%; background: ${s.color};" title="${s.code}: ${s.hours}h (${s.actualPct}%)"></div>
            `).join('')}
          </div>

          <div class="balance-legend-chips">
            ${balance.subjectStats.map(s => `
              <span class="balance-chip" onclick="App.showSubjectDetail('${s.id}')">
                <span class="chip-dot" style="background: ${s.color};"></span>
                <span class="chip-text">${s.code}: ${s.hours}h</span>
                ${s.isOverfocused ? '<span class="chip-tag over">Over</span>' : ''}
                ${s.isNeglected ? '<span class="chip-tag lag">Neglected</span>' : ''}
              </span>
            `).join('')}
          </div>

          <div class="balance-nudge-box">
            <div class="nudge-text">💡 ${balance.message}</div>
            <button class="btn btn-ghost btn-xs" onclick="App.openBalanceInfoModal()">How it's calculated</button>
          </div>
        </div>
      `;
    }

    // Smart Recommendations: "What to Study Next"
    const recsContainer = document.getElementById("home-recommendations-container");
    if (recsContainer) {
      if (recs.length === 0) {
        recsContainer.innerHTML = `<div class="empty-state">🎉 All caught up! No urgent tasks.</div>`;
      } else {
        recsContainer.innerHTML = recs.map(r => `
          <div class="rec-card glass-panel" style="border-left: 4px solid ${r.subject.color};">
            <div class="rec-header">
              <span class="badge-pill" style="background: ${r.subject.bgLight}; color: ${r.subject.color}; font-weight: 700;">
                ${r.subject.code || r.subject.name}
              </span>
              <span class="badge-pill pill-reason">${r.primaryReason}</span>
            </div>
            <h4 class="rec-task-title">${r.task.title}</h4>
            <div class="rec-meta">
              <span class="meta-item">⏱️ ${r.task.estimatedMin}m est.</span>
              <span class="meta-item">📅 ${this.formatDeadline(r.task.deadline)}</span>
              <span class="meta-item">📊 ${r.task.progress}% done</span>
            </div>
            <div class="rec-actions">
              <button class="btn btn-primary btn-sm" onclick="App.startFocusForTask('${r.task.id}', '${r.task.subjectId}')">
                ▶️ Start 25m Focus
              </button>
              <button class="btn btn-secondary btn-sm" onclick="App.openEditTaskModal('${r.task.id}')">
                Details
              </button>
            </div>
          </div>
        `).join('');
      }
    }

    // Mini Stats overview
    const statsContainer = document.getElementById("home-quick-stats");
    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="stat-mini-card glass-panel">
          <div class="stat-mini-icon">🔥</div>
          <div class="stat-mini-info">
            <div class="stat-mini-val">${profile.streak} Days</div>
            <div class="stat-mini-label">Study Streak</div>
          </div>
        </div>
        <div class="stat-mini-card glass-panel">
          <div class="stat-mini-icon">⏱️</div>
          <div class="stat-mini-info">
            <div class="stat-mini-val">${balance.totalLogged}h</div>
            <div class="stat-mini-label">Logged This Week</div>
          </div>
        </div>
        <div class="stat-mini-card glass-panel">
          <div class="stat-mini-icon">⭐</div>
          <div class="stat-mini-info">
            <div class="stat-mini-val">Lvl ${profile.level}</div>
            <div class="stat-mini-label">${profile.levelTitle}</div>
          </div>
        </div>
      `;
    }

    // Active Timer Preview on Home
    this.updateHomeTimerWidget();

    // SRM AP Exam Countdown Cards
    const examCountdownEl = document.getElementById("home-exam-countdowns");
    if (examCountdownEl) {
      examCountdownEl.innerHTML = this.data.exams.map(exam => {
        const daysLeft = this.getDaysUntil(exam.date);
        return `
          <div class="exam-mini-card glass-panel" onclick="App.switchTab('calendar')">
            <div class="exam-mini-left">
              <span class="exam-mini-badge">🎯 ${exam.weight}</span>
              <h5 class="exam-mini-title">${exam.title}</h5>
              <span class="exam-mini-room">📍 ${exam.room}</span>
            </div>
            <div class="exam-mini-countdown">
              <span class="exam-days-val">${daysLeft > 0 ? daysLeft : 'Today'}</span>
              <span class="exam-days-label">${daysLeft === 1 ? 'day left' : 'days left'}</span>
            </div>
          </div>
        `;
      }).join('');
    }
  },

  // ==========================================
  // 2. TASKS SCREEN
  // ==========================================
  renderTasksScreen() {
    const listEl = document.getElementById("tasks-list-container");
    if (!listEl) return;

    let filtered = [...this.data.tasks];

    // Filter by Tab/Status
    if (this.activeFilter === "in_progress") {
      filtered = filtered.filter(t => t.status === "in_progress");
    } else if (this.activeFilter === "overdue") {
      filtered = filtered.filter(t => t.status === "overdue");
    } else if (this.activeFilter === "completed") {
      filtered = filtered.filter(t => t.status === "completed");
    } else if (this.activeFilter !== "all") {
      filtered = filtered.filter(t => t.subjectId === this.activeFilter);
    }

    // Search query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(q) ||
        (t.notes && t.notes.toLowerCase().includes(q))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (this.activeSort === "deadline") {
        return new Date(a.deadline) - new Date(b.deadline);
      } else if (this.activeSort === "priority") {
        const pOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return (pOrder[a.priority] || 2) - (pOrder[b.priority] || 2);
      } else if (this.activeSort === "progress") {
        return b.progress - a.progress;
      }
      return 0;
    });

    this.renderTaskFilterPills();

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state glass-panel">
          <div class="empty-icon">📂</div>
          <h4>No tasks found</h4>
          <p>Try clearing filters or add a new task using the button below!</p>
          <button class="btn btn-primary btn-sm" onclick="App.openAddTaskModal()">+ Add New Task</button>
        </div>
      `;
      return;
    }

    const subjectsMap = {};
    this.data.subjects.forEach(s => { subjectsMap[s.id] = s; });

    listEl.innerHTML = filtered.map(t => {
      const s = subjectsMap[t.subjectId] || { name: "General", color: "#6366F1", code: "GEN", bgLight: "rgba(99,102,241,0.1)" };
      const isDone = t.status === "completed";
      const isOverdue = t.status === "overdue";

      return `
        <div class="task-card glass-panel ${isDone ? 'task-done' : ''} ${isOverdue ? 'task-overdue' : ''}" id="task-card-${t.id}">
          <div class="task-card-header">
            <div class="task-header-left">
              <span class="subject-tag-pill" style="background: ${s.bgLight}; color: ${s.color};">
                ${s.code} · ${s.name}
              </span>
              <span class="badge-pill pill-type pill-type-${t.type}">${this.formatTaskType(t.type)}</span>
              ${t.priority === 'urgent' ? '<span class="badge-pill pill-urgent">⚡ Urgent</span>' : ''}
            </div>
            <div class="task-header-actions">
              <button class="icon-btn-sm" onclick="App.startFocusForTask('${t.id}', '${t.subjectId}')" title="Study with Pomodoro">
                ⏱️
              </button>
              <button class="icon-btn-sm" onclick="App.openEditTaskModal('${t.id}')" title="Edit Task">
                ✏️
              </button>
              <button class="icon-btn-sm" onclick="App.deleteTask('${t.id}')" title="Delete Task">
                🗑️
              </button>
            </div>
          </div>

          <div class="task-title-row">
            <label class="custom-checkbox-wrap">
              <input type="checkbox" ${isDone ? 'checked' : ''} onchange="App.toggleTaskComplete('${t.id}', this.checked)" />
              <span class="custom-checkmark"></span>
            </label>
            <div class="task-title-text-wrap">
              <h4 class="task-main-title ${isDone ? 'strikethrough' : ''}">${t.title}</h4>
              ${t.notes ? `<p class="task-notes-snippet">${t.notes}</p>` : ''}
            </div>
          </div>

          <!-- Manual Progress Slider (0-100%) -->
          <div class="task-slider-container">
            <div class="slider-label-row">
              <span class="slider-title">Progress: <strong id="slider-val-${t.id}">${t.progress}%</strong></span>
              <span class="slider-status-tag ${t.status}">${this.formatStatus(t.status)}</span>
            </div>
            <div class="slider-track-wrap">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value="${t.progress}" 
                class="task-progress-slider"
                style="--slider-color: ${s.color};"
                oninput="App.handleSliderInput('${t.id}', this.value)"
                onchange="App.handleSliderChange('${t.id}', this.value)"
              />
            </div>
          </div>

          <!-- Subtasks / Checklist toggle -->
          ${t.subtasks && t.subtasks.length > 0 ? `
            <div class="task-subtasks-section">
              <button class="btn-subtask-toggle" onclick="App.toggleSubtasksAccordion('${t.id}')">
                <span>📋 Checklist (${t.subtasks.filter(st => st.done).length}/${t.subtasks.length})</span>
                <span id="subtask-arrow-${t.id}">▼</span>
              </button>
              <div class="subtasks-dropdown" id="subtasks-list-${t.id}">
                ${t.subtasks.map(st => `
                  <label class="subtask-item">
                    <input type="checkbox" ${st.done ? 'checked' : ''} onchange="App.toggleSubtaskItem('${t.id}', '${st.id}', this.checked)" />
                    <span class="subtask-text ${st.done ? 'strikethrough' : ''}">${st.text}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Card Footer with Deadline & Time Estimate -->
          <div class="task-card-footer">
            <div class="footer-meta">
              <span class="deadline-pill ${isOverdue ? 'overdue' : ''}">
                📅 ${this.formatDeadline(t.deadline)}
              </span>
              <span class="time-est-pill">⏱️ ${t.estimatedMin}m</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  renderTaskFilterPills() {
    const container = document.getElementById("task-filter-pills-bar");
    if (!container) return;

    const subjects = this.data.subjects;
    container.innerHTML = `
      <button class="filter-pill ${this.activeFilter === 'all' ? 'active' : ''}" onclick="App.setTaskFilter('all')">
        All
      </button>
      <button class="filter-pill ${this.activeFilter === 'in_progress' ? 'active' : ''}" onclick="App.setTaskFilter('in_progress')">
        In Progress
      </button>
      <button class="filter-pill ${this.activeFilter === 'overdue' ? 'active' : ''}" onclick="App.setTaskFilter('overdue')">
        Overdue ⚠️
      </button>
      <button class="filter-pill ${this.activeFilter === 'completed' ? 'active' : ''}" onclick="App.setTaskFilter('completed')">
        Completed ✅
      </button>
      ${subjects.map(s => `
        <button class="filter-pill ${this.activeFilter === s.id ? 'active' : ''}" onclick="App.setTaskFilter('${s.id}')" style="--pill-color: ${s.color};">
          ${s.code}
        </button>
      `).join('')}
    `;
  },

  setTaskFilter(filter) {
    this.activeFilter = filter;
    this.renderTasksScreen();
  },

  handleTaskSearch(query) {
    this.searchQuery = query;
    this.renderTasksScreen();
  },

  handleTaskSort(sortVal) {
    this.activeSort = sortVal;
    this.renderTasksScreen();
  },

  handleSliderInput(taskId, value) {
    const valSpan = document.getElementById(`slider-val-${taskId}`);
    if (valSpan) valSpan.textContent = `${value}%`;
  },

  handleSliderChange(taskId, value) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.progress = parseInt(value, 10);
    if (task.progress >= 100) {
      task.status = "completed";
      task.progress = 100;
      this.triggerConfetti();
      this.awardXP(30, "Task Completed via 100% Progress!");
    } else if (task.progress > 0) {
      task.status = "in_progress";
    } else {
      task.status = "not_started";
    }

    saveData(this.data);
    this.renderTasksScreen();
    this.updateNotificationBadge();
  },

  toggleTaskComplete(taskId, isChecked) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (!task) return;

    if (isChecked) {
      task.status = "completed";
      task.progress = 100;
      if (task.subtasks) {
        task.subtasks.forEach(st => st.done = true);
      }
      this.triggerConfetti();
      this.awardXP(35, "Task Finished!");
    } else {
      task.status = "in_progress";
      task.progress = 50;
    }

    saveData(this.data);
    this.renderTasksScreen();
  },

  toggleSubtaskItem(taskId, subtaskId, isChecked) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (!task || !task.subtasks) return;

    const st = task.subtasks.find(s => s.id === subtaskId);
    if (st) st.done = isChecked;

    const doneCount = task.subtasks.filter(s => s.done).length;
    task.progress = Math.round((doneCount / task.subtasks.length) * 100);

    if (task.progress >= 100) {
      task.status = "completed";
      this.triggerConfetti();
    } else {
      task.status = "in_progress";
    }

    saveData(this.data);
    this.renderTasksScreen();
  },

  toggleSubtasksAccordion(taskId) {
    const list = document.getElementById(`subtasks-list-${taskId}`);
    const arrow = document.getElementById(`subtask-arrow-${taskId}`);
    if (list) {
      list.classList.toggle("open");
      if (arrow) arrow.textContent = list.classList.contains("open") ? "▲" : "▼";
    }
  },

  // ==========================================
  // 3. STATS & ANALYTICS SCREEN
  // ==========================================
  renderStatsScreen() {
    ChartsManager.renderAll(this.data);

    const analysis = BalanceEngine.getStrengthsAndGaps(this.data);

    const strengthsEl = document.getElementById("stats-strengths-container");
    if (strengthsEl) {
      strengthsEl.innerHTML = analysis.strongest.map(s => `
        <div class="strength-card glass-panel" onclick="App.showSubjectDetail('${s.id}')">
          <div class="strength-top">
            <span class="strength-icon">⭐</span>
            <div class="strength-meta">
              <h5>${s.code}: ${s.name}</h5>
              <span class="strength-sub">Performance Score: ${s.healthIndex}%</span>
            </div>
          </div>
          <p class="strength-desc">
            Syllabus: <strong>${s.syllabusPct}%</strong> · Attendance: <strong>${s.attendance}%</strong> · Logged: <strong>${s.hoursLoggedWeek}h</strong>
          </p>
        </div>
      `).join('');
    }

    const gapsEl = document.getElementById("stats-gaps-container");
    if (gapsEl) {
      gapsEl.innerHTML = analysis.gaps.map(g => `
        <div class="gap-card glass-panel" onclick="App.showSubjectDetail('${g.id}')">
          <div class="gap-top">
            <span class="gap-icon">⚠️</span>
            <div class="gap-meta">
              <h5>${g.code}: ${g.name}</h5>
              <span class="gap-sub" style="color: #EC4899;">Needs Immediate Effort</span>
            </div>
          </div>
          <p class="gap-desc">
            Logged only <strong>${g.hoursLoggedWeek}h</strong> of ${g.targetWeeklyHours}h target. Syllabus at <strong>${g.syllabusPct}%</strong>.
          </p>
          <button class="btn btn-sm btn-ghost" onclick="event.stopPropagation(); App.startFocusForSubject('${g.id}')">
            Boost Balance (+25m)
          </button>
        </div>
      `).join('');
    }
  },

  // ==========================================
  // 4. CALENDAR SCREEN
  // ==========================================
  renderCalendarScreen() {
    const gridEl = document.getElementById("calendar-grid-container");
    if (!gridEl) return;

    const totalDays = 30;
    const startDayIndex = 0; // Sunday

    let daysHtml = "";
    for (let i = 0; i < startDayIndex; i++) {
      daysHtml += `<div class="calendar-day-cell empty"></div>`;
    }

    const subjectsMap = {};
    this.data.subjects.forEach(s => { subjectsMap[s.id] = s; });

    for (let day = 1; day <= totalDays; day++) {
      const dayStr = `2026-11-${String(day).padStart(2, "0")}`;
      const isToday = day === 14;
      const isSelected = dayStr === this.selectedCalendarDate;

      const dayTasks = this.data.tasks.filter(t => t.deadline.startsWith(dayStr));
      const dayExams = this.data.exams.filter(e => e.date.startsWith(dayStr));

      daysHtml += `
        <div class="calendar-day-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" onclick="App.selectCalendarDate('${dayStr}')">
          <div class="day-number">${day}</div>
          <div class="day-indicators">
            ${dayExams.length > 0 ? '<span class="exam-dot" title="Exam"></span>' : ''}
            ${dayTasks.slice(0, 3).map(t => {
              const subj = subjectsMap[t.subjectId] || { color: '#6366F1' };
              return `<span class="task-dot" style="background: ${subj.color};"></span>`;
            }).join('')}
            ${dayTasks.length > 3 ? `<span class="more-dot">+${dayTasks.length - 3}</span>` : ''}
          </div>
        </div>
      `;
    }

    gridEl.innerHTML = daysHtml;
    this.renderSelectedDateTasks();

    const examListEl = document.getElementById("calendar-exams-list");
    if (examListEl) {
      examListEl.innerHTML = this.data.exams.map(e => `
        <div class="exam-card glass-panel">
          <div class="exam-header">
            <span class="badge-pill pill-urgent">Exam Countdown</span>
            <span class="exam-date-tag">📅 ${this.formatDeadline(e.date)}</span>
          </div>
          <h4 class="exam-title">${e.title}</h4>
          <div class="exam-details-row">
            <span>📍 ${e.room}</span>
            <span>⚖️ ${e.weight}</span>
          </div>
          <div class="exam-days-badge">
            ⏳ <strong>${this.getDaysUntil(e.date)} days</strong> until exam
          </div>
        </div>
      `).join('');
    }
  },

  selectCalendarDate(dateStr) {
    this.selectedCalendarDate = dateStr;
    this.renderCalendarScreen();
  },

  renderSelectedDateTasks() {
    const container = document.getElementById("calendar-date-tasks-container");
    if (!container) return;

    const dateStr = this.selectedCalendarDate;
    const tasks = this.data.tasks.filter(t => t.deadline.startsWith(dateStr));
    const exams = this.data.exams.filter(e => e.date.startsWith(dateStr));

    const dateFormatted = new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric"
    });

    if (tasks.length === 0 && exams.length === 0) {
      container.innerHTML = `
        <div class="calendar-agenda-box glass-panel">
          <h5>${dateFormatted}</h5>
          <p class="text-muted">No deadlines or exams scheduled on this day. Great day for deep focus!</p>
        </div>
      `;
      return;
    }

    const subjectsMap = {};
    this.data.subjects.forEach(s => { subjectsMap[s.id] = s; });

    container.innerHTML = `
      <div class="calendar-agenda-box glass-panel">
        <h5 class="agenda-heading">Agenda for ${dateFormatted}</h5>
        ${exams.map(e => `
          <div class="agenda-exam-pill">
            🎯 <strong>EXAM:</strong> ${e.title} (${e.room})
          </div>
        `).join('')}
        ${tasks.map(t => {
          const subj = subjectsMap[t.subjectId] || { name: 'General', color: '#6366F1' };
          return `
            <div class="agenda-task-item" onclick="App.openEditTaskModal('${t.id}')">
              <span class="agenda-dot" style="background: ${subj.color};"></span>
              <span class="agenda-title">${t.title}</span>
              <span class="badge-pill pill-sm">${t.progress}%</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // ==========================================
  // 5. POMODORO FOCUS TIMER SCREEN
  // ==========================================
  initTimer() {
    this.timer = new FocusTimer();

    this.timer.onTick = (state) => {
      this.updateTimerUI(state);
    };

    this.timer.onComplete = (result) => {
      this.handleTimerSessionFinished(result);
    };
  },

  renderTimerScreen() {
    const select = document.getElementById("timer-subject-select");
    if (select) {
      select.innerHTML = this.data.subjects.map(s => `
        <option value="${s.id}" ${s.id === this.timer.selectedSubjectId ? 'selected' : ''}>
          ${s.code} - ${s.name}
        </option>
      `).join('');
    }

    this.updateTimerUI(this.timer.getState());
  },

  updateTimerUI(state) {
    const timeDisplay = document.getElementById("timer-digits");
    if (timeDisplay) timeDisplay.textContent = state.formatted;

    const circle = document.getElementById("timer-progress-ring");
    if (circle) {
      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      const offset = circumference - (state.progressPct / 100) * circumference;
      circle.style.strokeDashoffset = offset;
    }

    const playBtn = document.getElementById("timer-play-btn");
    if (playBtn) {
      playBtn.innerHTML = state.isRunning ? "⏸️ Pause" : "▶️ Start Focus";
      playBtn.classList.toggle("btn-pause", state.isRunning);
    }

    if (state.isRunning) {
      document.title = `(${state.formatted}) Focus · Proximo`;
    } else {
      document.title = "Proximo - SRM AP Academic Companion";
    }

    this.updateHomeTimerWidget();
  },

  updateHomeTimerWidget() {
    const widget = document.getElementById("home-timer-widget");
    if (!widget || !this.data || !this.data.subjects || this.data.subjects.length === 0) return;

    const state = this.timer.getState();
    const subj = this.data.subjects.find(s => s.id === state.subjectId) || this.data.subjects[0];

    widget.innerHTML = `
      <div class="home-timer-box glass-panel" onclick="App.switchTab('timer')">
        <div class="home-timer-left">
          <span class="timer-mode-tag">${state.mode.toUpperCase()}</span>
          <span class="home-timer-subj" style="color: ${subj.color};">● ${subj.code}</span>
          <div class="home-timer-clock">${state.formatted}</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); App.toggleTimer();">
          ${state.isRunning ? '⏸️ Pause' : '▶️ Focus'}
        </button>
      </div>
    `;
  },

  toggleTimer() {
    if (this.timer.isRunning) {
      this.timer.pause();
    } else {
      this.timer.start();
    }
  },

  resetTimer() {
    this.timer.reset();
  },

  setTimerMode(mode) {
    document.querySelectorAll(".timer-mode-pill").forEach(p => {
      p.classList.toggle("active", p.dataset.mode === mode);
    });
    this.timer.setMode(mode);
  },

  setTimerSound(sound) {
    document.querySelectorAll(".timer-sound-pill").forEach(p => {
      p.classList.toggle("active", p.dataset.sound === sound);
    });
    this.timer.setSoundMode(sound);
  },

  handleTimerSubjectChange(subjectId) {
    this.timer.setSubject(subjectId);
    this.renderTimerScreen();
  },

  handleTimerSessionFinished(result) {
    const subject = this.data.subjects.find(s => s.id === result.subjectId);
    const hoursAdded = Number((result.loggedMinutes / 60).toFixed(2));

    if (subject) {
      subject.hoursLoggedWeek = Number((subject.hoursLoggedWeek + hoursAdded).toFixed(1));
    }

    const todayLog = this.data.dailyEffortLog[this.data.dailyEffortLog.length - 1];
    if (todayLog) {
      todayLog.hours = Number((todayLog.hours + hoursAdded).toFixed(1));
      if (!todayLog.breakdown[result.subjectId]) {
        todayLog.breakdown[result.subjectId] = 0;
      }
      todayLog.breakdown[result.subjectId] = Number((todayLog.breakdown[result.subjectId] + hoursAdded).toFixed(1));
    }

    this.awardXP(50, `Completed 25m Focus Session in ${subject ? subject.code : 'Course'}!`);
    this.triggerConfetti();

    saveData(this.data);
    this.showToast(`🎉 Focus Session complete! +0.42 hrs added to ${subject ? subject.code : 'course'}. Balance updated!`);
  },

  startFocusForSubject(subjectId) {
    this.timer.setSubject(subjectId);
    this.switchTab("timer");
    this.timer.start();
  },

  startFocusForTask(taskId, subjectId) {
    this.timer.setSubject(subjectId);
    this.switchTab("timer");
    this.timer.start();
  },

  // ==========================================
  // 6. WEEKLY REVIEW SCREEN
  // ==========================================
  renderReviewScreen() {
    const container = document.getElementById("review-content-container");
    if (!container) return;

    const balance = BalanceEngine.calculateBalanceMetrics(this.data);
    const profile = this.data.profile;
    const completedTasks = this.data.tasks.filter(t => t.status === "completed");

    container.innerHTML = `
      <div class="review-hero glass-panel">
        <span class="section-label">WEEKLY ACADEMIC AUDIT</span>
        <h2>Weekly Wrap-Up: <span class="gradient-text">${balance.status}</span></h2>
        <p class="review-intro">
          Great consistency ${profile.name.split(' ')[0]}! You have logged <strong>${balance.totalLogged} hours</strong> across ${this.data.subjects.length} SRM AP courses this week.
        </p>

        <div class="review-stats-grid">
          <div class="review-stat-item">
            <span class="review-stat-val">${balance.score}/100</span>
            <span class="review-stat-lbl">Balance Score</span>
          </div>
          <div class="review-stat-item">
            <span class="review-stat-val">${completedTasks.length}</span>
            <span class="review-stat-lbl">Tasks Crushed</span>
          </div>
          <div class="review-stat-item">
            <span class="review-stat-val">${profile.streak} Days</span>
            <span class="review-stat-lbl">Active Streak</span>
          </div>
        </div>
      </div>

      <div class="review-section glass-panel">
        <h4 class="review-section-title">🏆 Top Wins This Week</h4>
        <ul class="review-wins-list">
          <li><strong>Course Momentum:</strong> Logged steady sessions across core syllabus requirements.</li>
          <li><strong>Consistency Streak:</strong> Kept your academic habits alive for ${profile.streak} consecutive days!</li>
          <li><strong>Task Progress:</strong> Cleared key assignments ahead of the SRM AP continuous evaluation deadlines.</li>
        </ul>
      </div>

      <div class="review-section glass-panel">
        <h4 class="review-section-title">⚠️ Focus Gaps & Neglected Topics</h4>
        <div class="review-gaps-box">
          ${balance.neglected && balance.neglected.length > 0 ? balance.neglected.map(n => `
            <div class="gap-row">
              <span class="gap-tag">${n.code || n.name}</span>
              <span>Logged only ${n.hours}h of ${n.targetHours}h weekly target. Needs focus before exams.</span>
            </div>
          `).join('') : `
            <div class="gap-row">
              <span class="badge-pill pill-reason">All Good</span>
              <span>All courses have received study time this week. Maintain this orbit!</span>
            </div>
          `}
        </div>
      </div>

      <div class="review-section glass-panel highlight-plan">
        <h4 class="review-section-title">🎯 AI Strategic Gameplan for Next Week</h4>
        <div class="gameplan-step">
          <div class="step-num">1</div>
          <div class="step-content">
            <strong>Mon-Tue:</strong> Dedicate 2 Pomodoro sprints (50 min) to catch up on ${balance.neglected && balance.neglected.length > 0 ? balance.neglected[0].code : 'core theory'}.
          </div>
        </div>
        <div class="gameplan-step">
          <div class="step-num">2</div>
          <div class="step-content">
            <strong>Wed-Thu:</strong> Complete upcoming assignments at least 24h before submission deadline.
          </div>
        </div>
        <div class="gameplan-step">
          <div class="step-num">3</div>
          <div class="step-content">
            <strong>Fri-Sat:</strong> Solve 1 past CLA exam paper to test topic retention.
          </div>
        </div>
      </div>
    `;
  },

  // ==========================================
  // 7. SUBJECT DETAIL VIEW
  // ==========================================
  showSubjectDetail(subjectId) {
    this.activeSubjectDetailId = subjectId;
    this.switchTab("subject-detail");
  },

  renderSubjectDetailScreen() {
    const container = document.getElementById("subject-detail-container");
    if (!container) return;

    const s = this.data.subjects.find(sub => sub.id === this.activeSubjectDetailId) || this.data.subjects[0];
    const subjectTasks = this.data.tasks.filter(t => t.subjectId === s.id);
    const units = s.syllabusUnits || [];
    const avgCompletion = units.length > 0 
      ? Math.round(units.reduce((a, b) => a + b.completed, 0) / units.length) 
      : 0;

    container.innerHTML = `
      <div class="subject-hero glass-panel" style="border-top: 5px solid ${s.color};">
        <button class="btn btn-ghost btn-sm" onclick="App.switchTab('home')">← Back</button>
        <div class="subject-hero-header">
          <div>
            <span class="subject-code-tag" style="background: ${s.bgLight}; color: ${s.color}; font-weight: 700;">
              ${s.code} · ${s.credits} Credits
            </span>
            <h2 class="subject-hero-name">${s.name}</h2>
            <p class="subject-faculty">👨‍🏫 Faculty: ${s.faculty}</p>
          </div>
          <div class="subject-target-grade">
            <span class="grade-badge" style="border: 2px solid ${s.color}; color: ${s.color};">${s.targetGrade}</span>
            <span class="grade-label">Target Grade</span>
          </div>
        </div>

        <div class="subject-stats-bar">
          <div class="sub-stat">
            <span class="val">${s.hoursLoggedWeek}h / ${s.targetWeeklyHours}h</span>
            <span class="lbl">Weekly Hours</span>
          </div>
          <div class="sub-stat">
            <span class="val">${s.attendance}%</span>
            <span class="lbl">Attendance</span>
          </div>
          <div class="sub-stat">
            <span class="val">${avgCompletion}%</span>
            <span class="lbl">Syllabus Covered</span>
          </div>
        </div>

        <button class="btn btn-primary btn-sm" style="margin-top: 14px;" onclick="App.startFocusForSubject('${s.id}')">
          ▶️ Start ${s.code} Focus Session
        </button>
      </div>

      <!-- Syllabus Tracker -->
      <div class="subject-syllabus-card glass-panel">
        <h4 class="card-subtitle">📘 Course Syllabus & Units Progress</h4>
        <div class="units-list">
          ${units.map((u) => `
            <div class="unit-row">
              <div class="unit-info">
                <span class="unit-title">${u.name}</span>
                <span class="unit-pct">${u.completed}%</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width: ${u.completed}%; background: ${s.color};"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Tasks for this Subject -->
      <div class="subject-tasks-card glass-panel">
        <div class="card-header-flex">
          <h4 class="card-subtitle">📋 Tasks for ${s.code} (${subjectTasks.length})</h4>
          <button class="btn btn-secondary btn-xs" onclick="App.openAddTaskModal('${s.id}')">+ Add Task</button>
        </div>
        <div class="sub-tasks-list">
          ${subjectTasks.map(t => `
            <div class="mini-task-item" onclick="App.openEditTaskModal('${t.id}')">
              <span class="badge-pill pill-sm">${t.progress}%</span>
              <span class="mini-task-title">${t.title}</span>
              <span class="mini-task-deadline">📅 ${this.formatDeadline(t.deadline)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // ==========================================
  // 8. SETTINGS & PROFILE SCREEN
  // ==========================================
  renderSettingsScreen() {
    const profile = this.data.profile;

    const nameEl = document.getElementById("profile-name-display");
    if (nameEl) nameEl.textContent = profile.name;

    const uniEl = document.getElementById("profile-uni-display");
    if (uniEl) uniEl.textContent = `${profile.regNo} · ${profile.university}`;

    const progEl = document.getElementById("profile-program-display");
    if (progEl) progEl.textContent = `${profile.role} · ${profile.semester}`;

    const avatarEl = document.getElementById("profile-avatar-display");
    if (avatarEl) avatarEl.textContent = profile.avatar;

    const badgesEl = document.getElementById("badges-gallery-container");
    if (badgesEl) {
      badgesEl.innerHTML = this.data.badges.map(b => `
        <div class="badge-card glass-panel ${b.unlocked ? 'unlocked' : 'locked'}">
          <div class="badge-card-icon">${b.icon}</div>
          <h5 class="badge-card-name">${b.name}</h5>
          <p class="badge-card-desc">${b.desc}</p>
          <span class="badge-card-status">${b.unlocked ? `Unlocked ${b.unlockedDate}` : `${b.progress}% Complete`}</span>
        </div>
      `).join('');
    }
  },

  // ==========================================
  // 9. MODALS: ADD / EDIT / QUICK ADD
  // ==========================================
  openAddTaskModal(preselectedSubjectId = null) {
    document.getElementById("modal-task-title").textContent = "Add Academic Task";
    document.getElementById("task-form-id").value = "";
    document.getElementById("task-form-name").value = "";
    document.getElementById("task-form-notes").value = "";
    document.getElementById("task-form-progress").value = "0";
    document.getElementById("task-form-progress-val").textContent = "0%";
    document.getElementById("task-form-subtasks-container").innerHTML = "";

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 0, 0);
    const deadlineIso = tomorrow.toISOString().slice(0, 16);
    document.getElementById("task-form-deadline").value = deadlineIso;

    const subjSelect = document.getElementById("task-form-subject");
    subjSelect.innerHTML = this.data.subjects.map(s => `
      <option value="${s.id}" ${s.id === preselectedSubjectId ? 'selected' : ''}>${s.code} - ${s.name}</option>
    `).join('');

    this.openModal("modal-task-form");
  },

  openEditTaskModal(taskId) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (!task) return;

    document.getElementById("modal-task-title").textContent = "Edit Academic Task";
    document.getElementById("task-form-id").value = task.id;
    document.getElementById("task-form-name").value = task.title;
    document.getElementById("task-form-notes").value = task.notes || "";
    document.getElementById("task-form-deadline").value = task.deadline.slice(0, 16);
    document.getElementById("task-form-type").value = task.type;
    document.getElementById("task-form-priority").value = task.priority;
    document.getElementById("task-form-estimated").value = task.estimatedMin || 60;
    document.getElementById("task-form-progress").value = task.progress;
    document.getElementById("task-form-progress-val").textContent = `${task.progress}%`;

    const subjSelect = document.getElementById("task-form-subject");
    subjSelect.innerHTML = this.data.subjects.map(s => `
      <option value="${s.id}" ${s.id === task.subjectId ? 'selected' : ''}>${s.code} - ${s.name}</option>
    `).join('');

    const subContainer = document.getElementById("task-form-subtasks-container");
    subContainer.innerHTML = (task.subtasks || []).map(st => `
      <div class="subtask-edit-row" data-sub-id="${st.id}">
        <input type="checkbox" ${st.done ? 'checked' : ''} class="sub-check" />
        <input type="text" value="${st.text}" class="input-text sub-text" />
        <button type="button" class="btn-remove-sub" onclick="this.parentElement.remove()">✕</button>
      </div>
    `).join('');

    this.openModal("modal-task-form");
  },

  saveTaskForm(event) {
    if (event) event.preventDefault();

    const id = document.getElementById("task-form-id").value;
    const title = document.getElementById("task-form-name").value.trim();
    if (!title) {
      alert("Please enter a task title.");
      return;
    }

    const subjectId = document.getElementById("task-form-subject").value;
    const type = document.getElementById("task-form-type").value;
    const priority = document.getElementById("task-form-priority").value;
    const deadline = document.getElementById("task-form-deadline").value;
    const estimatedMin = parseInt(document.getElementById("task-form-estimated").value, 10) || 60;
    const progress = parseInt(document.getElementById("task-form-progress").value, 10) || 0;
    const notes = document.getElementById("task-form-notes").value.trim();

    const subRows = document.querySelectorAll(".subtask-edit-row");
    const subtasks = Array.from(subRows).map((row, idx) => ({
      id: row.dataset.subId || `st-new-${Date.now()}-${idx}`,
      text: row.querySelector(".sub-text").value.trim(),
      done: row.querySelector(".sub-check").checked
    })).filter(st => st.text.length > 0);

    let status = "not_started";
    if (progress >= 100) status = "completed";
    else if (progress > 0) status = "in_progress";

    if (id) {
      const task = this.data.tasks.find(t => t.id === id);
      if (task) {
        task.title = title;
        task.subjectId = subjectId;
        task.type = type;
        task.priority = priority;
        task.deadline = deadline;
        task.estimatedMin = estimatedMin;
        task.progress = progress;
        task.notes = notes;
        task.subtasks = subtasks;
        task.status = status;
      }
    } else {
      const newTask = {
        id: `task-${Date.now()}`,
        title,
        subjectId,
        type,
        priority,
        deadline,
        estimatedMin,
        progress,
        notes,
        subtasks,
        status
      };
      this.data.tasks.unshift(newTask);
      this.awardXP(25, "New Task Created!");
    }

    saveData(this.data);
    this.closeModal("modal-task-form");
    this.renderCurrentScreen();
    this.showToast(id ? "Task updated!" : "New task created!");
  },

  deleteTask(taskId) {
    if (confirm("Delete this academic task?")) {
      this.data.tasks = this.data.tasks.filter(t => t.id !== taskId);
      saveData(this.data);
      this.renderCurrentScreen();
      this.showToast("Task deleted");
    }
  },

  addFormSubtaskRow() {
    const subContainer = document.getElementById("task-form-subtasks-container");
    const row = document.createElement("div");
    row.className = "subtask-edit-row";
    row.innerHTML = `
      <input type="checkbox" class="sub-check" />
      <input type="text" placeholder="Checklist item description..." class="input-text sub-text" />
      <button type="button" class="btn-remove-sub" onclick="this.parentElement.remove()">✕</button>
    `;
    subContainer.appendChild(row);
  },

  openQuickAddModal() {
    document.getElementById("quick-task-title").value = "";
    const subjSelect = document.getElementById("quick-task-subject");
    subjSelect.innerHTML = this.data.subjects.map(s => `
      <option value="${s.id}">${s.code} - ${s.name}</option>
    `).join('');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(20, 0, 0, 0);
    document.getElementById("quick-task-deadline").value = tomorrow.toISOString().slice(0, 16);

    this.openModal("modal-quick-add");
  },

  saveQuickTask(event) {
    if (event) event.preventDefault();
    const title = document.getElementById("quick-task-title").value.trim();
    if (!title) return;

    const subjectId = document.getElementById("quick-task-subject").value;
    const deadline = document.getElementById("quick-task-deadline").value;
    const priority = document.getElementById("quick-task-priority").value;

    const newTask = {
      id: `task-${Date.now()}`,
      title,
      subjectId,
      type: "assignment",
      priority,
      deadline,
      estimatedMin: 45,
      progress: 0,
      status: "not_started",
      subtasks: []
    };

    this.data.tasks.unshift(newTask);
    this.awardXP(20, "Quick Task Added!");
    saveData(this.data);
    this.closeModal("modal-quick-add");
    this.renderCurrentScreen();
    this.showToast("Quick task added under 5 seconds! ⚡");
  },

  // ==========================================
  // 10. NOTIFICATIONS & REMINDERS DRAWER
  // ==========================================
  openNotificationsDrawer() {
    const listEl = document.getElementById("notifications-list");
    if (!listEl) return;

    const notifs = this.data.notifications || [];
    listEl.innerHTML = notifs.map(n => `
      <div class="notif-item glass-panel ${n.read ? 'read' : 'unread'}">
        <div class="notif-header">
          <span class="badge-pill pill-${n.type}">${n.type.toUpperCase()}</span>
          <span class="notif-time">${n.time}</span>
        </div>
        <h5 class="notif-title">${n.title}</h5>
        <p class="notif-msg">${n.message}</p>
        <div class="notif-actions">
          ${n.actionTaskId ? `
            <button class="btn btn-primary btn-xs" onclick="App.openEditTaskModal('${n.actionTaskId}'); App.closeModal('drawer-notifications');">
              Open Task
            </button>
            <button class="btn btn-secondary btn-xs" onclick="App.snoozeTask('${n.actionTaskId}')">
              Snooze 3h
            </button>
            <button class="btn btn-ghost btn-xs" onclick="App.rescheduleTask('${n.actionTaskId}')">
              Reschedule +1d
            </button>
          ` : ''}
        </div>
      </div>
    `).join('');

    this.openModal("drawer-notifications");
  },

  updateNotificationBadge() {
    const badge = document.getElementById("notif-unread-count");
    if (!badge || !this.data) return;
    const unread = (this.data.notifications || []).filter(n => !n.read).length;
    badge.textContent = unread;
    badge.style.display = unread > 0 ? "inline-flex" : "none";
  },

  snoozeTask(taskId) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (task) {
      const d = new Date(task.deadline);
      d.setHours(d.getHours() + 3);
      task.deadline = d.toISOString();
      saveData(this.data);
      this.showToast("Task deadline snoozed by 3 hours ⏰");
      this.renderCurrentScreen();
    }
  },

  rescheduleTask(taskId) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (task) {
      const d = new Date(task.deadline);
      d.setDate(d.getDate() + 1);
      task.deadline = d.toISOString();
      if (task.status === "overdue") task.status = "in_progress";
      saveData(this.data);
      this.showToast("Task rescheduled to tomorrow 📅");
      this.renderCurrentScreen();
    }
  },

  // Modal helpers
  openModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.add("active");
  },

  closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.remove("active");
  },

  openBalanceInfoModal() {
    this.openModal("modal-balance-info");
  },

  // XP & Gamification
  awardXP(points, reason) {
    const p = this.data.profile;
    p.xp += points;
    if (p.xp >= p.nextLevelXp) {
      p.level += 1;
      p.xp = p.xp - p.nextLevelXp;
      p.nextLevelXp = Math.round(p.nextLevelXp * 1.3);
      this.showToast(`🌟 LEVEL UP! You reached Level ${p.level}: ${p.levelTitle}!`);
      this.triggerConfetti();
    }
    saveData(this.data);
  },

  triggerConfetti() {
    if (window.confetti) {
      try {
        window.confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#6366F1', '#8B5CF6', '#06B6D4', '#EC4899', '#10B981', '#F59E0B']
        });
      } catch (e) {
        console.warn("Confetti error:", e);
      }
    }
  },

  showToast(message) {
    const toast = document.getElementById("app-toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  },

  exportData() {
    const str = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.data, null, 2));
    const dl = document.createElement("a");
    dl.setAttribute("href", str);
    dl.setAttribute("download", `proximo_backup_${new Date().toISOString().slice(0, 10)}.json`);
    dl.click();
  },

  importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.subjects && parsed.tasks) {
          this.data = parsed;
          saveData(this.data);
          this.renderCurrentScreen();
          this.showToast("Backup imported successfully!");
        } else {
          alert("Invalid backup file structure.");
        }
      } catch (err) {
        alert("Failed to parse JSON backup.");
      }
    };
    reader.readAsText(file);
  },

  formatDeadline(isoStr) {
    if (!isoStr) return "";
    const d = new Date(isoStr);
    const now = new Date();
    const diffHours = (d - now) / (1000 * 60 * 60);

    if (diffHours < 0 && Math.abs(diffHours) < 24) return "Overdue (Yesterday)";
    if (diffHours < 0) return `Overdue by ${Math.ceil(Math.abs(diffHours) / 24)}d`;
    if (diffHours < 12) return `Today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (diffHours < 36) return `Tomorrow at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  },

  getDaysUntil(isoStr) {
    const target = new Date(isoStr).getTime();
    const now = new Date().getTime();
    return Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));
  },

  formatTaskType(type) {
    const map = {
      assignment: "Assignment",
      lab_record: "Lab Record",
      quiz: "Quiz",
      exam_prep: "Exam Prep",
      project: "Project",
      reading: "Reading"
    };
    return map[type] || type;
  },

  formatStatus(status) {
    const map = {
      completed: "Completed",
      in_progress: "In Progress",
      not_started: "Not Started",
      overdue: "Overdue"
    };
    return map[status] || status;
  },

  bindEvents() {
    document.querySelectorAll(".nav-item").forEach(item => {
      item.addEventListener("click", () => {
        this.switchTab(item.dataset.tab);
      });
    });

    document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove("active");
        }
      });
    });
  }
};

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  window.App.init();
});
