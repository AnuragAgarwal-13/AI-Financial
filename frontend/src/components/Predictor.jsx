import { useState } from "react";
import axios from "axios";

export default function Predictor({ setRiskData }) {
  const [form, setForm] = useState({
    age: "",
    income: "",
    loan: "",
    credit: ""
  });

  const [result, setResult] = useState({
    risk: "",
    reason: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handlePredict = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/predict",
        {
          age: Number(form.age),
          income: Number(form.income),
          loan_amount: Number(form.loan),
          credit_score: Number(form.credit)
        }
      );

      // Store result locally
      setResult(res.data);

      // 🔥 Send risk data to dashboard for gauge chart
      setRiskData({
        risk: res.data.risk,

        score:
          res.data.risk === "High Risk"
            ? 90
            : res.data.risk === "Medium Risk"
            ? 55
            : 20
      });

    } catch (err) {
      console.error(err);
      alert("Backend not connected ❌");
    }
  };

  return (
    <div className="grid-2">

      {/* LEFT SIDE */}
      <div className="box">
        <h3>AI Risk Predictor</h3>

        <input
          name="age"
          placeholder="Age"
          onChange={handleChange}
        />

        <input
          name="income"
          placeholder="Income"
          onChange={handleChange}
        />

        <input
          name="loan"
          placeholder="Loan Amount"
          onChange={handleChange}
        />

        <input
          name="credit"
          placeholder="Credit Score"
          onChange={handleChange}
        />

        <button
          className="btn"
          onClick={handlePredict}
        >
          Predict Risk
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="box purple">
        <h3>AI Insights</h3>

        {!result.risk && (
          <p>Enter details to get prediction</p>
        )}

        {result.risk && (
          <>
            <p
              style={{
                fontWeight: "bold",
                color:
                  result.risk === "High Risk"
                    ? "#ef4444"
                    : result.risk === "Medium Risk"
                    ? "#facc15"
                    : "#22c55e"
              }}
            >
              {result.risk}
            </p>

            <p style={{ color: "#ccc" }}>
              {result.reason}
            </p>

            {result.risk === "High Risk" && (
              <>
                <p>
                  💡 Consider reducing loan or improving
                  credit score
                </p>

                <p>
                  ⚠️ Age should be less than 60 for better
                  approval chances
                </p>
              </>
            )}

            {result.risk === "Medium Risk" && (
              <p>
                💡 Maintain stable income and reduce liabilities
              </p>
            )}

            {result.risk === "Low Risk" && (
              <p>
                💡 You are financially stable 👍
              </p>
            )}
          </>
        )}
      </div>

    </div>
  );
}