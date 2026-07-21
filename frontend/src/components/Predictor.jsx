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

    // ===============================
    // VALIDATION
    // ===============================

    if (!age || !income || !loan || !credit) {
      alert("Please enter all details");
      return;
    }

    try {

      setLoading(true);

      // ==========================================
      // UPDATED BACKEND CONNECTION
      // ==========================================
      //
      // OLD:
      // http://localhost:5000/predict
      //
      // NEW:
      // http://localhost:5000/api/predictions
      //
      // API automatically adds JWT token
      // from localStorage.

      const response = await API.post(
        "/predictions",
        {
          age: Number(age),
          income: Number(income),
          loan_amount: Number(loan),
          credit_score: Number(credit)
        }
      );

      console.log("Prediction Response:", response.data);

      // ==========================================
      // BACKEND RESPONSE
      // ==========================================

      const prediction = response.data.prediction;
      const reason = response.data.reason;

      // ==========================================
      // KEEP FORMAT COMPATIBLE WITH DASHBOARD
      // ==========================================

      const predictionResult = {
        risk: prediction,
        prediction: prediction,
        reason: reason
      };

      // Show inside Predictor AI Insights
      setResult(predictionResult);

      // Send result to Dashboard
      if (setRiskData) {
        setRiskData(predictionResult);
      }

    } catch (error) {

      console.error("Prediction Error:", error);

      // ==========================================
      // AUTHENTICATION ERROR
      // ==========================================

      if (error.response?.status === 401) {

        alert(
          "Your login session has expired. Please login again."
        );

        return;
      }

      // ==========================================
      // BACKEND ERROR
      // ==========================================

      alert(
        error.response?.data?.message ||
        "Prediction failed. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // AI INSIGHT MESSAGE
  // ==========================================

  const getInsight = () => {

    if (!result) {
      return "Enter details to get prediction";
    }

    if (result.prediction === "HIGH RISK") {

      return (
        <>
          <h2
            style={{
              color: "#ff4d4d",
              marginBottom: "15px"
            }}
          >
            HIGH RISK
          </h2>

          <p>
            {result.reason}
          </p>

          <p style={{ marginTop: "15px" }}>
            Your financial profile indicates a higher
            loan repayment risk.
          </p>

          <p style={{ marginTop: "10px" }}>
            Consider reducing the loan amount,
            increasing your income-to-loan ratio and
            improving your credit score.
          </p>
        </>
      );
    }

    if (result.prediction === "MEDIUM RISK") {

      return (
        <>
          <h2
            style={{
              color: "#facc15",
              marginBottom: "15px"
            }}
          >
            MEDIUM RISK
          </h2>

          <p>
            {result.reason}
          </p>

          <p style={{ marginTop: "15px" }}>
            Your financial profile is moderately stable,
            but some factors may increase repayment risk.
          </p>

          <p style={{ marginTop: "10px" }}>
            Try improving your credit score and maintaining
            a healthy loan-to-income ratio.
          </p>
        </>
      );
    }

    return (
      <>
        <h2
          style={{
            color: "#22c55e",
            marginBottom: "15px"
          }}
        >
          LOW RISK
        </h2>

        <p>
          {result.reason}
        </p>

        <p style={{ marginTop: "15px" }}>
          Your financial profile appears healthy.
        </p>

        <p style={{ marginTop: "10px" }}>
          Continue maintaining a good credit score and
          responsible borrowing habits.
        </p>
      </>
    );
  };


  return (

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "15px"
      }}
    >

      {/* ========================================== */}
      {/* AI RISK PREDICTOR */}
      {/* ========================================== */}

      <div
        style={{
          background: "#1e293b",
          borderRadius: "10px",
          overflow: "hidden"
        }}
      >

        <h2
          style={{
            padding: "20px",
            margin: 0
          }}
        >
          AI Risk Predictor
        </h2>


        {/* AGE */}

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            background: "#020617",
            color: "white",
            border: "none",
            marginBottom: "20px"
          }}
        />


        {/* INCOME */}

        <input
          type="number"
          placeholder="Income"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            background: "#020617",
            color: "white",
            border: "none",
            marginBottom: "20px"
          }}
        />


        {/* LOAN AMOUNT */}

        <input
          type="number"
          placeholder="Loan Amount"
          value={loan}
          onChange={(e) => setLoan(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            background: "#020617",
            color: "white",
            border: "none",
            marginBottom: "20px"
          }}
        />


        {/* CREDIT SCORE */}

        <input
          type="number"
          placeholder="Credit Score"
          value={credit}
          onChange={(e) => setCredit(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            background: "#020617",
            color: "white",
            border: "none",
            marginBottom: "10px"
          }}
        />


        {/* PREDICT BUTTON */}

        <button
          onClick={predictRisk}
          disabled={loading}
          style={{
            background: "#8b5cf6",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "7px",
            marginBottom: "20px",
            cursor: loading
              ? "not-allowed"
              : "pointer"
          }}
        >

          {loading
            ? "Predicting..."
            : "Predict Risk"}

        </button>

      </div>


      {/* ========================================== */}
      {/* AI INSIGHTS */}
      {/* ========================================== */}

      <div
        style={{
          background:
            "linear-gradient(135deg, #7e22ce, #581c87)",
          padding: "20px",
          borderRadius: "10px"
        }}
      >

        <h2>
          AI Insights
        </h2>

        <div
          style={{
            marginTop: "15px"
          }}
        >

          {getInsight()}

        </div>

      </div>

    </div>

  );
}