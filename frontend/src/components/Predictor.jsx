import { useState } from "react";
import API from "../services/api";

export default function Predictor({ setRiskData }) {
  const [age, setAge] = useState("");
  const [income, setIncome] = useState("");
  const [loan, setLoan] = useState("");
  const [credit, setCredit] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const predictRisk = async () => {
    if (!age || !income || !loan || !credit) {
      alert("Please enter all details");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/predictions", {
        age: Number(age),
        income: Number(income),
        loan_amount: Number(loan),
        credit_score: Number(credit),
      });

      const predictionResult = {
        risk: response.data.prediction,
        prediction: response.data.prediction,
        reason: response.data.reason,
      };

      setResult(predictionResult);

      if (setRiskData) {
        setRiskData(predictionResult);
      }
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Prediction failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = () => {
    if (!result) return "#9CA3AF";

    switch (result.prediction) {
      case "HIGH RISK":
        return "#ef4444";
      case "MEDIUM RISK":
        return "#f59e0b";
      default:
        return "#22c55e";
    }
  };[]

  const getRecommendation = () => {
    if (!result)
      return "Enter values to predict your loan repayment risk.";

    switch (result.prediction) {
      case "HIGH RISK":
        return "Reduce your loan amount, improve your credit score and increase your income before applying.";

      case "MEDIUM RISK":
        return "Improve your credit score and reduce your debt-to-income ratio for better approval chances.";

      default:
        return "Excellent financial profile. Continue maintaining your credit score and responsible borrowing habits.";
    }
  };

 const inputStyle = {
  width: "100%",
  height: "42px",
  padding: "0 16px",
  marginBottom: "14px",
  background: "#23273a",
  color: "white",
  border: "none",
  outline: "none",
  borderRadius: "10px",
  fontSize: "15px",
  boxSizing: "border-box",
};

return (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      alignItems: "stretch",
    }}
  >
    {/* Risk Predictor */}
    <div
      style={{
        background: "#1b1f2e",
        border: "1px solid #2e3448",
        borderRadius: "16px",
        padding: "24px",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: "28px",
          color: "white",
          fontSize: "32px",
          fontWeight: "700",
        }}
      >
        AI Risk Predictor
      </h2>

      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        style={inputStyle}
      />

      <input
        type="number"
        placeholder="Income"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
        style={inputStyle}
      />

      <input
        type="number"
        placeholder="Loan Amount"
        value={loan}
        onChange={(e) => setLoan(e.target.value)}
        style={inputStyle}
      />

      <input
        type="number"
        placeholder="Credit Score"
        value={credit}
        onChange={(e) => setCredit(e.target.value)}
        style={inputStyle}
      />

      <button
        onClick={predictRisk}
        disabled={loading}
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "12px 28px",
          borderRadius: "10px",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "600",
          fontSize: "16px",
        }}
      >
        {loading ? "Predicting..." : "Predict Risk"}
      </button>
    </div>

    {/* AI Insights */}
    <div
      style={{
        background: "#1b1f2e",
        border: "1px solid #2e3448",
        borderRadius: "16px",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          margin: 0,
          marginBottom: "25px",
          color: "white",
          fontSize: "22px",
          fontWeight: "700",
        }}
      >
        AI Insights
      </h2>

      {!result ? (
        <p
          style={{
            color: "#b7c0d1",
            fontSize: "15px",
          }}
        >
          Enter details to get prediction.
        </p>
      ) : (
        <>
          <h2
            style={{
              color: getRiskColor(),
              marginBottom: "20px",
            }}
          >
            {result.prediction}
          </h2>

          <div
            style={{
              background: "#23273a",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          >
            <strong style={{ color: "white" }}>
              Prediction Reason
            </strong>

            <p
              style={{
                color: "#d1d5db",
                lineHeight: "1.7",
                marginTop: "10px",
                marginBottom: 0,
              }}
            >
              {result.reason}
            </p>
          </div>

          <div
            style={{
              background: "#23273a",
              padding: "15px",
              borderRadius: "10px",
            }}
          >
            <strong style={{ color: "white" }}>
              AI Recommendation
            </strong>

            <p
              style={{
                color: "#d1d5db",
                lineHeight: "1.7",
                marginTop: "10px",
                marginBottom: 0,
              }}
            >
              {getRecommendation()}
            </p>
          </div>
        </>
      )}
    </div>
  </div>
);
}