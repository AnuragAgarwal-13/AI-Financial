import Sidebar from "../components/Sidebar";
import Predictor from "../components/Predictor";
import EMICalculator from "../components/EMICalculator";
import SavingsPlanner from "../components/SavingsPlanner";
import ExpenseTracker from "../components/ExpenseTracker";

import RiskGaugeChart from "../components/RiskGaugeChart";
import EMIBarChart from "../components/EMIBarChart";
import ExpensePieChart from "../components/ExpensePieChart";
import SavingsProgressChart from "../components/SavingsProgressChart";

import { useState } from "react";

export default function Dashboard() {

  const [active, setActive] = useState("dashboard");

  // 🔥 SHARED STATES
  const [riskData, setRiskData] = useState(null);
  const [emiData, setEmiData] = useState(null);
  const [expenseData, setExpenseData] = useState(null);
  const [savingData, setSavingData] = useState(null);

  return (

    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0f172a"
      }}
    >

      {/* ================= SIDEBAR ================= */}
      <Sidebar setActive={setActive} />

      {/* ================= MAIN CONTENT ================= */}
      <div
        style={{
          flex: 1,
          padding: "25px",
          color: "white"
        }}
      >

        <h1 style={{ marginBottom: "25px" }}>
          📊 Dashboard
        </h1>

        {/* ================= DASHBOARD ================= */}
        {active === "dashboard" && (
          <>

            {/* ================= SUMMARY CARDS ================= */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
                marginBottom: "30px"
              }}
            >

              {/* RISK */}
              <div className="card">
                <p style={{ marginBottom: "10px" }}>
                  ⚠️ Risk
                </p>

                <h2
                  style={{
                    color:
                      riskData?.risk === "High Risk"
                        ? "#ef4444"
                        : riskData?.risk === "Medium Risk"
                        ? "#facc15"
                        : "#22c55e"
                  }}
                >
                  {riskData?.risk || "N/A"}
                </h2>
              </div>

              {/* EMI */}
              <div className="card">
                <p style={{ marginBottom: "10px" }}>
                  💰 EMI
                </p>

                <h2>
                  ₹{emiData?.emi || 0}
                </h2>
              </div>

              {/* EXPENSES */}
              <div className="card">
                <p style={{ marginBottom: "10px" }}>
                  📉 Expenses
                </p>

                <h2>
                  ₹{expenseData?.totalExpense || 0}
                </h2>
              </div>

              {/* SAVINGS */}
              
              {/* SAVINGS */}
            <div className="card">
              <p>📊 Savings</p>

              <h2>
                  ₹{savingData?.monthlySavingsNeeded || 0}
              </h2>
            </div>

            </div>

            {/* ================= CHART SECTION ================= */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "20px"
              }}
            >

              {/* EMI CHART */}
              <EMIBarChart emiData={emiData} />

              {/* EXPENSE PIE */}
              <ExpensePieChart
                expenses={expenseData?.expenses || []}
                />

              {/* SAVINGS CHART */}
              <SavingsProgressChart savingsData={savingData} />
               
                {/* RISK GAUGE */}
              <RiskGaugeChart riskData={riskData} />              

            </div>

          </>
        )}

        {/* ================= RISK PREDICTOR ================= */}
        {active === "risk" && (
          <Predictor setRiskData={setRiskData} />
        )}

        {/* ================= EMI CALCULATOR ================= */}
        {active === "emi" && (
          <EMICalculator setEmiData={setEmiData} />
        )}

        {/* ================= EXPENSE TRACKER ================= */}
        {active === "expense" && (
          <ExpenseTracker setExpenseData={setExpenseData} />
        )}

        {/* ================= SAVINGS PLANNER ================= */}
        {active === "savings" && (
          <SavingsPlanner setSavingData={setSavingData} />
        )}

      </div>

    </div>
  );
}