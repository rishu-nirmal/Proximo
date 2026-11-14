/**
 * Proximo - Balanced-Focus System Engine
 * Calculates Weekly Balance Score, detects over-focus & neglect,
 * and generates smart "What to Study Next" recommendations.
 */

const BalanceEngine = {
  /**
   * Calculates overall academic balance score (0 to 100)
   * based on time logged vs ideal target distribution.
   */
  calculateBalanceMetrics(data) {
    const subjects = data.subjects || [];
    const totalLogged = subjects.reduce((sum, s) => sum + (s.hoursLoggedWeek || 0), 0);
    const totalTarget = subjects.reduce((sum, s) => sum + (s.targetWeeklyHours || 6), 0);

    if (totalLogged === 0) {
      return {
        score: 50,
        status: "No Study Time Logged Yet",
        statusColor: "#94A3B8",
        message: "Start a study session to initialize your balance orbit!",
        totalLogged: 0,
        totalTarget: totalTarget,
        subjectStats: [],
        overfocused: null,
        neglected: []
      };
    }

    let sumAbsDeviations = 0;
    const subjectStats = subjects.map(s => {
      const actualPct = (s.hoursLoggedWeek / totalLogged) * 100;
      const idealPct = (s.targetWeeklyHours / totalTarget) * 100;
      const diffPct = actualPct - idealPct;
      const ratio = s.hoursLoggedWeek / (s.targetWeeklyHours || 1);

      sumAbsDeviations += Math.abs(actualPct - idealPct);

      return {
        id: s.id,
        name: s.name,
        code: s.code,
        color: s.color,
        hours: s.hoursLoggedWeek,
        targetHours: s.targetWeeklyHours,
        actualPct: Math.round(actualPct),
        idealPct: Math.round(idealPct),
        diffPct: Math.round(diffPct),
        ratio: ratio,
        isOverfocused: diffPct > 12,
        isNeglected: diffPct < -8 || ratio < 0.4
      };
    });

    // Score calculation: 100 minus weighted deviation
    // sumAbsDeviations ranges typically from 0 to ~100
    const rawScore = 100 - (sumAbsDeviations * 0.58);
    const score = Math.max(15, Math.min(100, Math.round(rawScore)));

    // Categorization
    let status = "Harmonious Orbit";
    let statusClass = "status-emerald";
    let statusColor = "#10B981";
    let statusIcon = "⚖️";

    if (score < 55) {
      status = "Gravitational Drift";
      statusClass = "status-rose";
      statusColor = "#EC4899";
      statusIcon = "🚨";
    } else if (score < 72) {
      status = "Orbital Wobble";
      statusClass = "status-amber";
      statusColor = "#F59E0B";
      statusIcon = "⚠️";
    } else if (score < 88) {
      status = "Healthy Spread";
      statusClass = "status-indigo";
      statusColor = "#6366F1";
      statusIcon = "✨";
    }

    // Overfocused vs Neglected subjects
    const overfocused = [...subjectStats]
      .filter(s => s.diffPct > 8)
      .sort((a, b) => b.diffPct - a.diffPct)[0] || null;

    const neglected = [...subjectStats]
      .filter(s => s.isNeglected)
      .sort((a, b) => a.ratio - b.ratio);

    // Dynamic friendly nudge message
    let message = "";
    if (overfocused && neglected.length > 0) {
      const neglectedNames = neglected.map(n => n.code || n.name).join(" and ");
      message = `You’ve spent ${overfocused.actualPct}% of your week on ${overfocused.code || overfocused.name}. ${neglectedNames} needs some love!`;
    } else if (overfocused) {
      message = `You are heavily focusing on ${overfocused.name}. Try spreading out study blocks.`;
    } else if (neglected.length > 0) {
      message = `${neglected[0].name} is falling behind schedule. Dedicate your next Pomodoro session here.`;
    } else {
      message = "Brilliant job! Your study effort is beautifully balanced across all courses.";
    }

    return {
      score,
      status,
      statusClass,
      statusColor,
      statusIcon,
      message,
      totalLogged: Number(totalLogged.toFixed(1)),
      totalTarget: Number(totalTarget.toFixed(1)),
      subjectStats,
      overfocused,
      neglected
    };
  },

  /**
   * Generates prioritized "What to Study Next" cards
   * based on neglected subjects, upcoming deadlines, priority, and progress.
   */
  getSmartRecommendations(data, limit = 3) {
    const tasks = data.tasks || [];
    const subjectsMap = {};
    (data.subjects || []).forEach(s => { subjectsMap[s.id] = s; });

    const balanceMetrics = this.calculateBalanceMetrics(data);
    const neglectedMap = {};
    (balanceMetrics.neglected || []).forEach(n => {
      neglectedMap[n.id] = n;
    });

    const now = new Date();

    // Filter candidate tasks (not completed)
    const candidates = tasks.filter(t => t.status !== "completed");

    const scoredTasks = candidates.map(task => {
      const subject = subjectsMap[task.subjectId] || { name: "General", color: "#6366F1", code: "GEN" };
      let score = 0;
      let reasons = [];

      // Deadline proximity scoring
      const deadline = new Date(task.deadline);
      const diffHours = (deadline - now) / (1000 * 60 * 60);

      if (diffHours < 0) {
        score += 120;
        reasons.push("Overdue Task");
      } else if (diffHours <= 12) {
        score += 85;
        reasons.push("Due in < 12 Hours");
      } else if (diffHours <= 24) {
        score += 65;
        reasons.push("Due Tonight / Tomorrow");
      } else if (diffHours <= 48) {
        score += 40;
        reasons.push("Due in 2 Days");
      } else if (diffHours <= 96) {
        score += 20;
      }

      // Subject neglect scoring
      if (neglectedMap[task.subjectId]) {
        const neg = neglectedMap[task.subjectId];
        const boost = Math.round(55 * (1 - Math.min(1, neg.ratio)));
        score += boost;
        reasons.push(`Balances ${subject.code || subject.name}`);
      }

      // Priority scoring
      if (task.priority === "urgent") score += 35;
      else if (task.priority === "high") score += 20;
      else if (task.priority === "medium") score += 10;

      // In-progress momentum bonus
      if (task.progress > 0 && task.progress < 90) {
        score += 15;
        reasons.push(`${task.progress}% Started`);
      }

      // Type weight (exams & assignments take precedence)
      if (task.type === "exam_prep" || task.type === "assignment") score += 15;

      return {
        task,
        subject,
        score,
        primaryReason: reasons[0] || "Next in Schedule",
        allReasons: reasons,
        diffHours
      };
    });

    // Sort descending by score
    scoredTasks.sort((a, b) => b.score - a.score);

    return scoredTasks.slice(0, limit);
  },

  /**
   * Generates Strengths & Gaps analysis across all subjects
   */
  getStrengthsAndGaps(data) {
    const subjects = data.subjects || [];
    const tasks = data.tasks || [];

    const evaluated = subjects.map(s => {
      const subjectTasks = tasks.filter(t => t.subjectId === s.id);
      const completedTasks = subjectTasks.filter(t => t.status === "completed").length;
      const totalTasks = subjectTasks.length || 1;
      const taskCompletionPct = Math.round((completedTasks / totalTasks) * 100);

      // Average syllabus completion
      const units = s.syllabusUnits || [];
      const syllabusPct = units.length > 0
        ? Math.round(units.reduce((sum, u) => sum + u.completed, 0) / units.length)
        : 50;

      // Effort ratio
      const effortRatio = s.hoursLoggedWeek / (s.targetWeeklyHours || 1);

      // Overall health index (0 to 100)
      const healthIndex = Math.round(
        (syllabusPct * 0.4) + 
        (taskCompletionPct * 0.35) + 
        (Math.min(1.2, effortRatio) * 100 * 0.25)
      );

      return {
        ...s,
        taskCompletionPct,
        completedTasks,
        totalTasks,
        syllabusPct,
        effortRatio,
        healthIndex
      };
    });

    evaluated.sort((a, b) => b.healthIndex - a.healthIndex);

    const strongest = evaluated.slice(0, 2);
    const gaps = [...evaluated].reverse().slice(0, 2);

    return {
      all: evaluated,
      strongest,
      gaps
    };
  },

  /**
   * Computes Overall Day, Week, and Semester completion percentages
   */
  getCompletionRings(data) {
    const tasks = data.tasks || [];
    const subjects = data.subjects || [];
    const profile = data.profile || {};

    // 1. Day Progress: tasks due today or worked on today
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    
    // Tasks due or modified today
    const todayTasks = tasks.filter(t => {
      return t.deadline.startsWith(todayStr) || (t.progress > 0 && t.status !== "completed");
    });
    const todayDone = todayTasks.filter(t => t.status === "completed" || t.progress >= 90).length;
    const dayPct = todayTasks.length > 0 
      ? Math.round((todayDone / todayTasks.length) * 100) 
      : 75; // Sample healthy default if no tasks due today

    // 2. Week Progress: logged hours vs weekly goal
    const totalLogged = subjects.reduce((sum, s) => sum + (s.hoursLoggedWeek || 0), 0);
    const weeklyGoal = profile.weeklyGoalHours || 28;
    const weekPct = Math.min(100, Math.round((totalLogged / weeklyGoal) * 100));

    // 3. Semester Progress: based on calendar dates
    const start = new Date(profile.semesterStart || "2026-08-01").getTime();
    const end = new Date(profile.semesterEnd || "2026-12-20").getTime();
    const current = now.getTime();
    const totalDuration = end - start;
    const elapsed = Math.max(0, current - start);
    const semesterPct = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));

    return {
      day: {
        percent: dayPct,
        label: "Today's Target",
        detail: `${todayDone}/${todayTasks.length || 4} Tasks`
      },
      week: {
        percent: weekPct,
        label: "Weekly Study Goal",
        detail: `${totalLogged.toFixed(1)} / ${weeklyGoal} hrs`
      },
      semester: {
        percent: semesterPct,
        label: "Semester Timeline",
        detail: `Sem 5 (${semesterPct}%)`
      }
    };
  }
};
