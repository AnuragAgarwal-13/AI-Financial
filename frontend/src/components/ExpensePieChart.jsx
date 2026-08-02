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
         Add expenses to see breakdown
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
      padding: "24px",
      height: "430px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <h3
      style={{
        color: "white",
        margin: 0,
        marginBottom: "18px",
        fontSize: "18px",
      }}
    >
      💳 Expense Breakdown
    </h3>

    <div
      style={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        gap: "25px",
      }}
    >
      {/* Pie Chart */}

      <div
        style={{
          width: "50%",
          height: "260px",
        }}
      >
        <Pie data={data} options={options} />
      </div>

      {/* Summary */}

      <div
        style={{
          width: "50%",
        }}
      >
        {labels.map((label, index) => {

          const total = values.reduce((a, b) => a + b, 0);

          const percent = (
            (values[index] / total) *
            100
          ).toFixed(1);

          return (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "14px",
                paddingBottom: "10px",
                borderBottom: "1px solid #334155",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#fff",
                    fontWeight: "600",
                  }}
                >
                  {label}
                </div>

                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: "13px",
                  }}
                >
                  {percent}%
                </div>
              </div>

              <div
                style={{
                  color: "#22c55e",
                  fontWeight: "700",
                }}
              >
                ₹{values[index].toLocaleString("en-IN")}
              </div>
            </div>
          );
        })}

        <div
          style={{
            marginTop: "20px",
            paddingTop: "15px",
            borderTop: "2px solid #334155",
            display: "flex",
            justifyContent: "space-between",
            color: "white",
            fontWeight: "700",
            fontSize: "16px",
          }}
        >
          <span>Total</span>

          <span>
            ₹
            {values
              .reduce((a, b) => a + b, 0)
              .toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  </div>
);
}