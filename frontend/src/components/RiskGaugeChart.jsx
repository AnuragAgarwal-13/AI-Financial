import { Doughnut } from "react-chartjs-2";
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

export default function RiskGaugeChart({ riskData }) {
  
  const score =
    riskData?.risk === "High Risk"
      ? 90
      : riskData?.risk === "Medium Risk"
      ? 55
      : riskData?.risk === "Low Risk"
      ? 20
      : 0;

  const color =
    score >= 70
      ? "#ef4444"
      : score >= 40
      ? "#facc15"
      : "#22c55e";

  const data = {
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [
          color,
          "#1e293b"
        ],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
        cutout: "75%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg,#1e293b,#0f172a)",
        border: "1px solid #334155",
        borderRadius: "16px",
        padding: "20px",
        minHeight: "350px",
      }}
    >
      <h3
        style={{
          color: "white",
          marginBottom: "20px",
        }}
      >
         Risk Score
      </h3>

      {!riskData ? (
        <div
          style={{
            height: "250px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#94a3b8",
          }}
        >
          Calculate risk to see score
        </div>
      ) : (
        <>
          <div
            style={{
              position: "relative",
              height: "220px",
            }}
          >
            <Doughnut
              data={data}
              options={options}
            />

            <div
              style={{
                position: "absolute",
                top: "60%",
                left: "50%",
                transform:
                  "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              <h1
                style={{
                  color,
                  margin: 0,
                  fontSize: "42px",
                }}
              >
                {score}
              </h1>

              <p
                style={{
                  color: "#94a3b8",
                  margin: 0,
                }}
              >
                Risk Score
              </p>
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "-10px",
            }}
          >
            <h2
              style={{
                color,
                margin: 0,
              }}
            >
              {riskData.risk}
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "15px",
              color: "#94a3b8",
              fontSize: "13px",
            }}
          >
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </>
      )}
    </div>
  );
}