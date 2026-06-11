import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend
);

const DIFFICULTY_STYLES = {
  Easy:     { color: "#22c55e", bg: "rgba(34,197,94,0.08)",   border: "#22c55e" },
  Moderate: { color: "#fbbf24", bg: "rgba(251,191,36,0.08)",  border: "#fbbf24" },
  Hard:     { color: "#ef4444", bg: "rgba(239,68,68,0.08)",   border: "#ef4444" },
};

export default function SavingsProgressChart({ savingsData = null }) {
  // savingsData: { goal, current, months, monthlySavingsNeeded, difficulty, income }
  const empty = !savingsData || !savingsData.goal;

  const buildProjection = () => {
    const { current = 0, monthlySavingsNeeded = 0, months = 12, goal = 0 } = savingsData;
    const labels = [];
    const projection = [];
    const goalLine = [];

    for (let i = 0; i <= months; i++) {
      labels.push(i === 0 ? "Now" : `M${i}`);
      projection.push(Math.min(current + monthlySavingsNeeded * i, goal * 1.05));
      goalLine.push(goal);
    }
    return { labels, projection, goalLine };
  };

  if (empty) {
    return (
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.icon}>🎯</span>
          <h3 style={styles.title}>Savings Journey</h3>
        </div>
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>🎯</span>
          <p style={styles.emptyText}>Set a savings goal to see your projection</p>
        </div>
      </div>
    );
  }

  const { labels, projection, goalLine } = buildProjection();
  const diff = DIFFICULTY_STYLES[savingsData.difficulty] || DIFFICULTY_STYLES.Moderate;
  const progressPct = Math.min(
    ((savingsData.current / savingsData.goal) * 100), 100
  ).toFixed(1);
  const remaining = Math.max(savingsData.goal - savingsData.current, 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Projected Savings",
        data: projection,
        fill: true,
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 220);
          gradient.addColorStop(0, diff.color + "55");
          gradient.addColorStop(1, diff.color + "05");
          return gradient;
        },
        borderColor: diff.color,
        borderWidth: 2.5,
        pointRadius: 3,
        pointBackgroundColor: diff.color,
        tension: 0.4,
      },
      {
        label: "Goal",
        data: goalLine,
        fill: false,
        borderColor: "rgba(148,163,184,0.4)",
        borderWidth: 1.5,
        borderDash: [6, 4],
        pointRadius: 0,
        tension: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#94a3b8",
          font: { size: 12 },
          padding: 14,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#f1f5f9",
        bodyColor: "#94a3b8",
        borderColor: "#334155",
        borderWidth: 1,
        callbacks: {
          label: (ctx) =>
            `  ${ctx.dataset.label}: ₹${Number(ctx.parsed.y).toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#64748b", font: { size: 11 }, maxTicksLimit: 8 },
        grid:  { color: "rgba(51,65,85,0.4)" },
        border:{ color: "#334155" },
      },
      y: {
        ticks: {
          color: "#64748b",
          callback: (v) =>
            v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`,
        },
        grid:  { color: "rgba(51,65,85,0.4)" },
        border:{ color: "#334155" },
      },
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.icon}>🎯</span>
        <h3 style={styles.title}>Savings Journey</h3>
        <span
          style={{
            ...styles.badge,
            background: diff.bg,
            color: diff.color,
            border: `1px solid ${diff.border}`,
          }}
        >
          {savingsData.difficulty}
        </span>
      </div>

      {/* Progress bar */}
      <div style={styles.progressSection}>
        <div style={styles.progressMeta}>
          <span style={styles.progressLabel}>Progress to goal</span>
          <span style={{ color: diff.color, fontWeight: 700 }}>{progressPct}%</span>
        </div>
        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progressPct}%`,
              background: `linear-gradient(90deg, ${diff.color}aa, ${diff.color})`,
            }}
          />
        </div>
      </div>

      {/* Stat row */}
      <div style={styles.statsRow}>
        {[
          { label: "Goal",            value: `₹${savingsData.goal.toLocaleString("en-IN")}`,                  color: "#f1f5f9" },
          { label: "Saved",           value: `₹${savingsData.current.toLocaleString("en-IN")}`,               color: diff.color },
          { label: "Remaining",       value: `₹${remaining.toLocaleString("en-IN")}`,                         color: "#94a3b8" },
          { label: "Monthly Needed",  value: `₹${(savingsData.monthlySavingsNeeded||0).toLocaleString("en-IN")}`, color: "#3b82f6" },
        ].map((s) => (
          <div key={s.label} style={styles.statBox}>
            <span style={{ ...styles.statValue, color: s.color }}>{s.value}</span>
            <span style={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Line chart */}
      <div style={{ height: "200px", marginTop: "8px" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    border: "1px solid #334155",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  icon:  { fontSize: "22px" },
  title: { margin: 0, color: "#f1f5f9", fontSize: "18px", fontWeight: 600, flex: 1 },
  badge: {
    fontSize: "12px",
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: "20px",
  },
  progressSection: { marginBottom: "20px" },
  progressMeta: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  progressLabel: { color: "#64748b", fontSize: "13px" },
  progressTrack: {
    height: "8px",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "100px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "100px",
    transition: "width 0.8s ease",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px",
    marginBottom: "16px",
  },
  statBox: {
    background: "rgba(15,23,42,0.6)",
    border: "1px solid #1e293b",
    borderRadius: "10px",
    padding: "10px 8px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    alignItems: "center",
  },
  statValue: { fontSize: "13px", fontWeight: 700 },
  statLabel: { fontSize: "10px", color: "#64748b", textAlign: "center" },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "160px",
    gap: "12px",
  },
  emptyIcon: { fontSize: "40px", opacity: 0.4 },
  emptyText: { color: "#475569", fontSize: "14px", margin: 0 },
};
