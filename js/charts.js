/**
 * Proximo - Interactive Analytics & Charts Module
 * Powered by Chart.js with responsive SVG fallbacks for offline reliability.
 */

const ChartsManager = {
  charts: {
    effortDonut: null,
    completionBar: null,
    weeklyLine: null,
    subjectRadar: null
  },

  /**
   * Initializes or refreshes all 4 charts and completion rings
   */
  renderAll(data) {
    this.renderEffortDonut(data);
    this.renderCompletionBar(data);
    this.renderWeeklyLine(data);
    this.renderSubjectRadar(data);
    this.renderCompletionRings(data);
    this.renderTopicBars(data);
  },

  /**
   * 1. Effort Split Donut Chart
   */
  renderEffortDonut(data) {
    const canvas = document.getElementById("chart-effort-donut");
    if (!canvas) return;

    const subjects = data.subjects || [];
    const labels = subjects.map(s => s.code || s.name);
    const hours = subjects.map(s => s.hoursLoggedWeek || 0);
    const colors = subjects.map(s => s.color);
    const totalHours = hours.reduce((a, b) => a + b, 0);

    if (this.charts.effortDonut) {
      this.charts.effortDonut.destroy();
    }

    if (window.Chart) {
      const isDark = document.body.classList.contains("dark-theme");
      const ctx = canvas.getContext("2d");

      this.charts.effortDonut = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [{
            data: hours,
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: isDark ? "#1E1E2E" : "#FFFFFF",
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "72%",
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: isDark ? "#E2E8F0" : "#334155",
                font: { family: "Inter, sans-serif", size: 11, weight: "500" },
                padding: 12,
                usePointStyle: true,
                pointStyle: "circle"
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const val = context.raw || 0;
                  const pct = totalHours > 0 ? Math.round((val / totalHours) * 100) : 0;
                  return ` ${context.label}: ${val.toFixed(1)} hrs (${pct}%)`;
                }
              }
            }
          }
        }
      });
    } else {
      // SVG Fallback
      this.renderSvgDonutFallback(canvas, subjects, totalHours);
    }
  },

  /**
   * 2. Subject Task Completion Rate Bar Chart
   */
  renderCompletionBar(data) {
    const canvas = document.getElementById("chart-completion-bar");
    if (!canvas) return;

    const subjects = data.subjects || [];
    const tasks = data.tasks || [];

    const labels = subjects.map(s => s.code || s.name);
    const rates = subjects.map(s => {
      const subTasks = tasks.filter(t => t.subjectId === s.id);
      if (subTasks.length === 0) return 0;
      const done = subTasks.filter(t => t.status === "completed").length;
      return Math.round((done / subTasks.length) * 100);
    });
    const colors = subjects.map(s => s.color);

    if (this.charts.completionBar) {
      this.charts.completionBar.destroy();
    }

    if (window.Chart) {
      const isDark = document.body.classList.contains("dark-theme");
      const ctx = canvas.getContext("2d");

      this.charts.completionBar = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{
            label: "Task Completion %",
            data: rates,
            backgroundColor: colors.map(c => c + "CC"),
            borderColor: colors,
            borderWidth: 1.5,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: { color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" },
              ticks: {
                color: isDark ? "#94A3B8" : "#64748B",
                callback: val => val + "%",
                font: { size: 10 }
              }
            },
            x: {
              grid: { display: false },
              ticks: {
                color: isDark ? "#E2E8F0" : "#334155",
                font: { size: 11, weight: "600" }
              }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ` Completion: ${ctx.raw}%`
              }
            }
          }
        }
      });
    }
  },

  /**
   * 3. Weekly Progress Line / Trend Chart
   */
  renderWeeklyLine(data) {
    const canvas = document.getElementById("chart-weekly-line");
    if (!canvas) return;

    const dailyLog = data.dailyEffortLog || [];
    const labels = dailyLog.map(d => d.day);
    const hours = dailyLog.map(d => d.hours);
    const targetHours = 4.0; // Daily benchmark target

    if (this.charts.weeklyLine) {
      this.charts.weeklyLine.destroy();
    }

    if (window.Chart) {
      const isDark = document.body.classList.contains("dark-theme");
      const ctx = canvas.getContext("2d");

      this.charts.weeklyLine = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Hours Studied",
              data: hours,
              borderColor: "#6366F1",
              backgroundColor: "rgba(99, 102, 241, 0.15)",
              fill: true,
              tension: 0.35,
              borderWidth: 3,
              pointBackgroundColor: "#8B5CF6",
              pointRadius: 4,
              pointHoverRadius: 6
            },
            {
              label: "Daily Target (4h)",
              data: labels.map(() => targetHours),
              borderColor: "rgba(16, 185, 129, 0.6)",
              borderDash: [5, 5],
              borderWidth: 2,
              pointRadius: 0,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" },
              ticks: {
                color: isDark ? "#94A3B8" : "#64748B",
                callback: val => val + "h",
                font: { size: 10 }
              }
            },
            x: {
              grid: { display: false },
              ticks: {
                color: isDark ? "#E2E8F0" : "#334155",
                font: { size: 10 }
              }
            }
          },
          plugins: {
            legend: {
              position: "top",
              labels: {
                color: isDark ? "#E2E8F0" : "#334155",
                font: { size: 10 }
              }
            }
          }
        }
      });
    }
  },

  /**
   * 4. Multi-Axis Radar Chart (Subject Mastery & Readiness)
   */
  renderSubjectRadar(data) {
    const canvas = document.getElementById("chart-subject-radar");
    if (!canvas) return;

    const subjects = data.subjects || [];
    const labels = subjects.map(s => s.code || s.name);

    // Metrics for each subject
    // We compute 5 balanced attributes:
    // 1. Effort ratio, 2. Syllabus progress, 3. Attendance, 4. Task Completion Rate
    const effortScores = subjects.map(s => Math.min(100, Math.round((s.hoursLoggedWeek / (s.targetWeeklyHours || 1)) * 100)));
    const syllabusScores = subjects.map(s => {
      const units = s.syllabusUnits || [];
      return units.length > 0 ? Math.round(units.reduce((a, b) => a + b.completed, 0) / units.length) : 50;
    });
    const attendanceScores = subjects.map(s => s.attendance || 85);

    if (this.charts.subjectRadar) {
      this.charts.subjectRadar.destroy();
    }

    if (window.Chart) {
      const isDark = document.body.classList.contains("dark-theme");
      const ctx = canvas.getContext("2d");

      this.charts.subjectRadar = new Chart(ctx, {
        type: "radar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Weekly Effort %",
              data: effortScores,
              borderColor: "#6366F1",
              backgroundColor: "rgba(99, 102, 241, 0.25)",
              borderWidth: 2,
              pointRadius: 3
            },
            {
              label: "Syllabus Covered %",
              data: syllabusScores,
              borderColor: "#10B981",
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              borderWidth: 2,
              pointRadius: 3
            },
            {
              label: "Attendance %",
              data: attendanceScores,
              borderColor: "#F59E0B",
              backgroundColor: "rgba(245, 158, 11, 0.15)",
              borderWidth: 1.5,
              pointRadius: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: { color: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" },
              grid: { color: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" },
              pointLabels: {
                color: isDark ? "#E2E8F0" : "#1E293B",
                font: { size: 11, weight: "600" }
              },
              ticks: { display: false, max: 100, min: 0 }
            }
          },
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: isDark ? "#CBD5E1" : "#475569",
                font: { size: 10 }
              }
            }
          }
        }
      });
    }
  },

  /**
   * Day, Week, and Semester Circular Progress Rings
   */
  renderCompletionRings(data) {
    const rings = BalanceEngine.getCompletionRings(data);

    this.updateRingElement("ring-day", rings.day.percent, rings.day.detail);
    this.updateRingElement("ring-week", rings.week.percent, rings.week.detail);
    this.updateRingElement("ring-semester", rings.semester.percent, rings.semester.detail);
  },

  updateRingElement(elementId, percent, detailText) {
    const container = document.getElementById(elementId);
    if (!container) return;

    const circle = container.querySelector(".ring-circle-progress");
    const label = container.querySelector(".ring-percent-text");
    const detail = container.querySelector(".ring-detail-text");

    if (circle) {
      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      const offset = circumference - (percent / 100) * circumference;
      circle.style.strokeDashoffset = offset;
    }

    if (label) label.textContent = `${percent}%`;
    if (detail) detail.textContent = detailText;
  },

  /**
   * Renders Per-Subject & Per-Topic Completion percentage bars
   */
  renderTopicBars(data) {
    const container = document.getElementById("topics-completion-container");
    if (!container) return;

    const subjects = data.subjects || [];
    container.innerHTML = subjects.map(s => {
      const units = s.syllabusUnits || [];
      const avg = units.length > 0
        ? Math.round(units.reduce((a, b) => a + b.completed, 0) / units.length)
        : 0;

      return `
        <div class="subject-topic-card glass-panel" onclick="App.showSubjectDetail('${s.id}')">
          <div class="topic-header">
            <div class="topic-title-wrap">
              <span class="topic-dot" style="background: ${s.color};"></span>
              <span class="topic-code">${s.code}</span>
              <span class="topic-name">${s.name}</span>
            </div>
            <span class="topic-pct-badge" style="color: ${s.color}; font-weight: 700;">${avg}%</span>
          </div>

          <div class="progress-track" style="margin-top: 8px;">
            <div class="progress-fill" style="width: ${avg}%; background: ${s.color};"></div>
          </div>

          <div class="topic-units-mini">
            ${units.slice(0, 3).map(u => `
              <span class="mini-unit-pill">
                ${u.name.split(':')[0]}: ${u.completed}%
              </span>
            `).join('')}
            ${units.length > 3 ? `<span class="mini-unit-pill">+${units.length - 3} more</span>` : ''}
          </div>
        </div>
      `;
    }).join("");
  },

  /**
   * Fallback SVG Donut Chart if CDN is offline
   */
  renderSvgDonutFallback(canvas, subjects, totalHours) {
    const parent = canvas.parentElement;
    if (!parent) return;

    let cumulativePercent = 0;
    const slices = subjects.map(s => {
      const pct = totalHours > 0 ? (s.hoursLoggedWeek / totalHours) : (1 / subjects.length);
      const start = cumulativePercent;
      cumulativePercent += pct;
      return { ...s, pct: Math.round(pct * 100), start, end: cumulativePercent };
    });

    // Render simple SVG donut
    parent.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%;">
        <svg viewBox="0 0 100 100" style="width: 160px; height: 160px; transform: rotate(-90deg);">
          ${slices.map(sl => {
            const strokeDash = `${sl.pct} ${100 - sl.pct}`;
            return `<circle cx="50" cy="50" r="38" fill="transparent" stroke="${sl.color}" stroke-width="12" stroke-dasharray="${sl.pct * 2.38} 238" stroke-dashoffset="${-(sl.start * 238)}" />`;
          }).join('')}
        </svg>
        <div style="display:flex; flex-wrap:wrap; gap:6px; justify-content:center; margin-top:8px;">
          ${slices.map(sl => `
            <span style="font-size:10px; display:inline-flex; align-items:center; gap:4px;">
              <span style="width:8px; height:8px; border-radius:50%; background:${sl.color}"></span>
              ${sl.code}: ${sl.pct}%
            </span>
          `).join('')}
        </div>
      </div>
    `;
  }
};
