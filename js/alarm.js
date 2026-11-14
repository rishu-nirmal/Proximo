/**
 * StudyOrbit - Task Alarm & Smart Notification Engine
 * Provides Web Audio synthesizer alarms, device vibration, native notifications,
 * and an interactive dismiss/snooze alarm modal for mobile phones and desktops.
 */

const AlarmManager = {
  audioCtx: null,
  alarmIntervalId: null,
  isAlarmRinging: false,
  activeAlarmTaskId: null,
  acknowledgedAlarms: {}, // taskId -> timestamp of dismissal
  snoozedAlarms: {}, // taskId -> snooze expiration timestamp
  checkerTimerId: null,

  init() {
    this.initAudioContext();
    this.startBackgroundChecker();
    this.checkNotificationPermission();
  },

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
  },

  checkNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      // Permission not yet requested
    }
  },

  async requestNotificationPermission() {
    if ("Notification" in window) {
      try {
        const perm = await Notification.requestPermission();
        if (perm === "granted") {
          App.showToast("🔔 Push notifications enabled!");
          return true;
        } else {
          App.showToast("Push notifications were disabled in browser settings.");
          return false;
        }
      } catch (e) {
        console.warn("Notification permission error:", e);
      }
    }
    return false;
  },

  /**
   * Starts rhythmic academic alarm sound synthesis
   */
  startAlarmSound() {
    this.initAudioContext();
    if (!this.audioCtx) return;

    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }

    this.stopAlarmSound();
    this.isAlarmRinging = true;

    // Pulse sequence every 1.4 seconds
    const playChimePattern = () => {
      if (!this.isAlarmRinging) return;

      try {
        const now = this.audioCtx.currentTime;
        // Two alternating pleasant chime bursts (A5 880Hz -> E6 1318Hz)
        const notes = [
          { freq: 880, delay: 0.0, duration: 0.25 },
          { freq: 1174.66, delay: 0.18, duration: 0.35 },
          { freq: 880, delay: 0.55, duration: 0.2 },
          { freq: 1318.51, delay: 0.72, duration: 0.5 }
        ];

        notes.forEach(n => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(n.freq, now + n.delay);

          // Gentle envelope
          gain.gain.setValueAtTime(0.001, now + n.delay);
          gain.gain.linearRampToValueAtTime(0.28, now + n.delay + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + n.delay + n.duration);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now + n.delay);
          osc.stop(now + n.delay + n.duration + 0.1);
        });

        // Vibrate mobile phone if supported
        if ("vibrate" in navigator) {
          navigator.vibrate([200, 100, 200, 100, 300]);
        }
      } catch (e) {
        console.warn("Audio alarm synthesis error:", e);
      }
    };

    playChimePattern();
    this.alarmIntervalId = setInterval(playChimePattern, 1600);
  },

  stopAlarmSound() {
    this.isAlarmRinging = false;
    if (this.alarmIntervalId) {
      clearInterval(this.alarmIntervalId);
      this.alarmIntervalId = null;
    }
    if ("vibrate" in navigator) {
      navigator.vibrate(0); // Stop vibration immediately
    }
  },

  /**
   * Triggers the full in-app alarm modal + audio + notification
   */
  triggerAlarm(task, reasonTitle, reasonDetail) {
    this.activeAlarmTaskId = task ? task.id : null;

    // 1. Play audio chime in loop
    this.startAlarmSound();

    // 2. Fire native system notification if granted
    if ("Notification" in window && Notification.permission === "granted" && task) {
      try {
        new Notification(reasonTitle || `StudyOrbit Reminder: ${task.title}`, {
          body: `${reasonDetail || 'Due soon!'} Check it out on StudyOrbit.`,
          icon: "icon-192.png",
          tag: `task-${task.id}`,
          requireInteraction: true
        });
      } catch (e) {
        console.warn("Native notification error:", e);
      }
    }

    // 3. Populate Alarm Modal UI
    const modal = document.getElementById("modal-task-alarm");
    if (!modal) return;

    const subjectsMap = {};
    if (App.data && App.data.subjects) {
      App.data.subjects.forEach(s => { subjectsMap[s.id] = s; });
    }
    const subj = task && subjectsMap[task.subjectId] ? subjectsMap[task.subjectId] : { code: "TASK", name: "Course", color: "#6366F1" };

    const reasonEl = document.getElementById("alarm-reason-badge");
    const titleEl = document.getElementById("alarm-task-title");
    const courseEl = document.getElementById("alarm-course-tag");
    const deadlineEl = document.getElementById("alarm-deadline-text");
    const progressEl = document.getElementById("alarm-progress-bar");

    if (reasonEl) reasonEl.textContent = reasonTitle || "TASK DEADLINE ALARM";
    if (titleEl) titleEl.textContent = task ? task.title : "Sample Academic Task";
    if (courseEl) {
      courseEl.textContent = `${subj.code} · ${subj.name}`;
      courseEl.style.color = subj.color;
    }
    if (deadlineEl) {
      deadlineEl.textContent = task ? `📅 Deadline: ${App.formatDeadline(task.deadline)}` : "Due today";
    }
    if (progressEl && task) {
      progressEl.style.width = `${task.progress}%`;
      progressEl.style.background = subj.color;
    }

    modal.classList.add("active");
  },

  /**
   * Dismisses and shuts off the alarm immediately
   */
  dismissAlarm() {
    this.stopAlarmSound();

    if (this.activeAlarmTaskId) {
      // Mark as acknowledged for 2 hours so it doesn't immediately ring again
      this.acknowledgedAlarms[this.activeAlarmTaskId] = Date.now() + (2 * 60 * 60 * 1000);
    }

    const modal = document.getElementById("modal-task-alarm");
    if (modal) modal.classList.remove("active");

    App.showToast("✅ Alarm stopped and dismissed");
  },

  /**
   * Snoozes the alarm for N minutes
   */
  snoozeAlarm(minutes = 15) {
    this.stopAlarmSound();

    if (this.activeAlarmTaskId) {
      this.snoozedAlarms[this.activeAlarmTaskId] = Date.now() + (minutes * 60 * 1000);
    }

    const modal = document.getElementById("modal-task-alarm");
    if (modal) modal.classList.remove("active");

    App.showToast(`⏰ Alarm snoozed for ${minutes} minutes`);
  },

  /**
   * Stops alarm and opens the task in edit modal
   */
  openTaskFromAlarm() {
    const taskId = this.activeAlarmTaskId;
    this.stopAlarmSound();

    const modal = document.getElementById("modal-task-alarm");
    if (modal) modal.classList.remove("active");

    if (taskId) {
      App.openEditTaskModal(taskId);
    }
  },

  /**
   * Tests the alarm right away with sample data
   */
  testAlarmNow() {
    let sampleTask = null;
    if (App.data && App.data.tasks && App.data.tasks.length > 0) {
      sampleTask = App.data.tasks.find(t => t.status !== "completed") || App.data.tasks[0];
    } else {
      sampleTask = {
        id: "test-task",
        title: "DBMS B+ Trees Assignment (Sample)",
        subjectId: "dbms",
        deadline: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        progress: 35
      };
    }

    this.triggerAlarm(
      sampleTask,
      "⚡ TEST ALARM: DUE IN 30 MINUTES",
      "This is a demonstration of your mobile audio alarm & notification."
    );
  },

  /**
   * Periodic checker (runs every 30 seconds)
   */
  startBackgroundChecker() {
    if (this.checkerTimerId) clearInterval(this.checkerTimerId);

    this.checkerTimerId = setInterval(() => {
      this.checkTasksAndAlert();
    }, 30000);
  },

  checkTasksAndAlert() {
    if (!App.data || !App.data.tasks) return;
    if (this.isAlarmRinging) return; // Already ringing

    const now = Date.now();
    const tasks = App.data.tasks.filter(t => t.status !== "completed");

    for (const task of tasks) {
      // Check if snoozed
      if (this.snoozedAlarms[task.id] && now < this.snoozedAlarms[task.id]) {
        continue;
      }
      // Check if recently acknowledged
      if (this.acknowledgedAlarms[task.id] && now < this.acknowledgedAlarms[task.id]) {
        continue;
      }

      const deadline = new Date(task.deadline).getTime();
      const diffMs = deadline - now;
      const diffMinutes = Math.round(diffMs / (1000 * 60));

      // Overdue alarm: diff < 0
      if (diffMinutes < 0 && diffMinutes > -120) { // Overdue within last 2 hours
        this.triggerAlarm(
          task,
          "🚨 OVERDUE PENDING TASK!",
          `Submission deadline has passed. Submit immediately!`
        );
        break; // Trigger one alarm at a time
      }
      // Urgent imminent deadline: within 30 minutes
      else if (diffMinutes > 0 && diffMinutes <= 30) {
        this.triggerAlarm(
          task,
          `⏳ DUE IN ${diffMinutes} MINUTES!`,
          `Final stretch! Wrap up and submit.`
        );
        break;
      }
      // 1 hour warning
      else if (diffMinutes > 30 && diffMinutes <= 60 && !this.acknowledgedAlarms[task.id]) {
        this.triggerAlarm(
          task,
          "⏰ DUE IN 1 HOUR",
          `Approaching deadline. Time to review your checklist.`
        );
        break;
      }
    }
  }
};
