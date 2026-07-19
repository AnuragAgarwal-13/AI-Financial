import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function EMIBarChart({ emiData = null }) {
  // emiData shape: { emi, totalInterest, principal, salary, totalPayment }
  const empty = !emiData || !emiData.emi;

  const principal    = emiData?.principal    || 0;
  const totalInterest= emiData?.totalInterest|| 0;
  const emi          = emiData?.emi          || 0;
  const salary       = emiData?.salary       || 1;
  const remaining    = Math.max(salary - emi, 0);
  const emiRatio     = Math.min((emi / salary) * 100, 100).toFixed(1);
  const isHighBurden = emi > salary * 0.2;

  const breakdownData = {
    labels: ["Loan Breakdown"],
    datasets: [
      {
        label: "Principal",
        data: [principal],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "#3b82f6",
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: "Total Interest",
        data: [totalInterest],
        backgroundColor: "rgba(251, 191, 36, 0.8)",
        borderColor: "#fbbf24",
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const salaryData = {
    labels: ["Monthly Salary Split"],
    datasets: [
      {
        label: "EMI",
        data: [emi],
        backgroundColor: isHighBurden
          ? "rgba(239, 68, 68, 0.85)"
          : "rgba(251, 191, 36, 0.85)",
        borderColor: isHighBurden ? "#ef4444" : "#fbbf24",
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: "Remaining",
        data: [remaining],
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "#22c55e",
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#cbd5e1",
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
          label: (ctx) => `  ₹${Number(ctx.parsed.x).toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: "#64748b",
          callback: (v) => `₹${(v / 1000).toFixed(0)}K`,
        },
        grid: { color: "rgba(51,65,85,0.5)" },
        border: { color: "#334155" },
      },
      y: {
        stacked: true,
        ticks: { color: "#94a3b8" },
        grid: { display: false },
        border: { color: "#334155" },
      },
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.icon}></span>
        <h3 style={styles.title}>EMI Analysis</h3>
        {!empty && (
          <span
            style={{
              ...styles.badge,
              background: isHighBurden
                ? "rgba(239,68,68,0.15)"
                : "rgba(34,197,94,0.15)",
              color: isHighBurden ? "#ef4444" : "#22c55e",
              border: `1px solid ${isHighBurden ? "#ef4444" : "#22c55e"}`,
            }}
          >
            {emiRatio}% of salary
          </span>
        )}
      </div>

      {empty ? (
        <div style={styles.empty}>
          <span style={styles.emptyIcon}></span>
          <p style={styles.emptyText}>Calculate EMI to see analysis</p>
        </div>
      ) : (
        <>
          {/* Stat pills */}
          <div style={styles.statsRow}>
            {[
              { label: "Monthly EMI",     value: `₹${emi.toLocaleString("en-IN")}`,           color: isHighBurden ? "#ef4444" : "#fbbf24" },
              { label: "Total Payment",   value: `₹${(emiData.totalPayment||0).toLocaleString("en-IN")}`, color: "#3b82f6" },
              { label: "Total Interest",  value: `₹${totalInterest.toLocaleString("en-IN")}`, color: "#fbbf24" },
            ].map((s) => (
              <div key={s.label} style={styles.statPill}>
                <span style={{ ...styles.statValue, color: s.color }}>{s.value}</span>
                <span style={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          <p style={styles.sectionLabel}>Loan Composition</p>
          <div style={{ height: "80px" }}>
            <Bar data={breakdownData} options={commonOptions} />
          </div>

          <p style={{ ...styles.sectionLabel, marginTop: "20px" }}>Salary Impact</p>
          <div style={{ height: "80px" }}>
            <Bar data={salaryData} options={commonOptions} />
          </div>

          {isHighBurden && (
            <div style={styles.warning}>
              ⚠️ Your EMI exceeds 20% of your monthly salary — consider a longer tenure or smaller loan.
            </div>
          )}
        </>
      )}
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
    flexWrap: "wrap",
  },
  icon:  { fontSize: "22px" },
  title: { margin: 0, color: "#f1f5f9", fontSize: "18px", fontWeight: 600, flex: 1 },
  badge: {
    fontSize: "12px",
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: "20px",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
    marginBottom: "20px",
  },
  statPill: {
    background: "rgba(15,23,42,0.6)",
    border: "1px solid #1e293b",
    borderRadius: "10px",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    alignItems: "center",
  },
  statValue: { fontSize: "15px", fontWeight: 700 },
  statLabel: { fontSize: "11px", color: "#64748b", textAlign: "center" },
  sectionLabel: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    marginBottom: "8px",
    marginTop: 0,
  },
  warning: {
    marginTop: "16px",
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: "10px",
    padding: "12px 14px",
    color: "#fca5a5",
    fontSize: "13px",
    lineHeight: 1.5,
  },
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
