import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function ExpensePieChart({ expenses = [] }) {

  // Empty state
  if (!expenses.length) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg,#1e293b,#0f172a)",
          border: "1px solid #334155",
          borderRadius: "16px",
          padding: "20px",
          minHeight: "350px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#94a3b8",
        }}
      >
        📉 Add expenses to see breakdown
      </div>
    );
  }

  // Calculate totals by category
  const categoryTotals = {};

  expenses.forEach((expense) => {
    const category = expense.category;

    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }

    categoryTotals[category] += Number(expense.amount);
  });

  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#3b82f6",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
          "#a855f7",
        ],
        borderColor: "#0f172a",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          color: "#ffffff",
          padding: 15,
        },
      },

      tooltip: {
        callbacks: {
          label: function (context) {
            return `₹${context.raw.toLocaleString("en-IN")}`;
          },
        },
      },
    },
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg,#1e293b,#0f172a)",
        border: "1px solid #334155",
        borderRadius: "16px",
        padding: "20px",
      }}
    >
      <h3
        style={{
          color: "white",
          marginBottom: "15px",
        }}
      >
        🥧 Expense Breakdown
      </h3>

      <div
        style={{
          height: "280px",
        }}
      >
        <Pie
          data={data}
          options={options}
        />
      </div>
    </div>
  );
}