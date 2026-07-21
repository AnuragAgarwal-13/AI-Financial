import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

export default function RiskGaugeChart({ riskData }) {

  // Get prediction safely
  const risk =
    riskData?.prediction ||
    riskData?.risk ||
    "";

  // Convert to uppercase so both
  // "High Risk" and "HIGH RISK" work
  const normalizedRisk = risk.toUpperCase();

  let riskValue = 0;
  let riskColor = "#64748b";

  if (normalizedRisk === "LOW RISK") {

    riskValue = 30;
    riskColor = "#22c55e";

  } else if (normalizedRisk === "MEDIUM RISK") {

    riskValue = 60;
    riskColor = "#facc15";

  } else if (normalizedRisk === "HIGH RISK") {

    riskValue = 90;
    riskColor = "#ef4444";

  }

  const data = [
    {
      name: "Risk",
      value: riskValue
    },
    {
      name: "Remaining",
      value: 100 - riskValue
    }
  ];

  return (

    <div className="card">

      <h3
        style={{
          marginBottom: "10px"
        }}
      >
        Risk Analysis
      </h3>

      <div
        style={{
          width: "100%",
          height: "250px",
          position: "relative"
        }}
      >

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={100}
              dataKey="value"
            >

              <Cell fill={riskColor} />

              <Cell fill="#334155" />

            </Pie>

          </PieChart>

        </ResponsiveContainer>


        {/* CENTER VALUE */}

        <div
          style={{
            position: "absolute",
            top: "55%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center"
          }}
        >

          <h2
            style={{
              color: riskColor,
              margin: 0
            }}
          >
            {riskValue}%
          </h2>

          <p
            style={{
              marginTop: "5px"
            }}
          >
            {risk || "No Prediction"}
          </p>

        </div>

      </div>

    </div>

  );
}