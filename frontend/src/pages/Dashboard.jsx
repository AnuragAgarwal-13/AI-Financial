import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Predictor from "../components/Predictor";
import EMICalculator from "../components/EMICalculator";
import SavingsPlanner from "../components/SavingsPlanner";
import ExpenseTracker from "../components/ExpenseTracker";

import RiskGaugeChart from "../components/RiskGaugeChart";
import EMIBarChart from "../components/EMIBarChart";
import ExpensePieChart from "../components/ExpensePieChart";
import SavingsProgressChart from "../components/SavingsProgressChart";

export default function Dashboard() {
  const navigate = useNavigate();

  // ==========================================
  // SIDEBAR ACTIVE PAGE
  // ==========================================

  const [active, setActive] = useState("dashboard");

  // ==========================================
  // SHARED DASHBOARD STATES
  // ==========================================

  const [riskData, setRiskData] = useState(null);
  const [emiData, setEmiData] = useState(null);
  const [expenseData, setExpenseData] = useState(null);
  const [savingData, setSavingData] = useState(null);

  // ==========================================
  // LOGGED-IN USER
  // ==========================================

  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0f172a",
      }}
    >
      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <Sidebar setActive={setActive} />

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <div
        style={{
          flex: 1,
          padding: "25px",
          color: "white",
          minWidth: 0,
        }}
      >
        {/* ==========================================
            TOP HEADER
        ========================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          {/* LEFT HEADER */}

          <div>
            <h1
              style={{
                margin: 0,
              }}
            >
              Finora Dashboard
            </h1>

            <p
              style={{
                marginTop: "6px",
                color: "#94a3b8",
              }}
            >
              Welcome, {user?.name || "User"}
            </p>
          </div>

          {/* RIGHT HEADER */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {/* USER INFO */}

            <div
              style={{
                textAlign: "right",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontWeight: "600",
                }}
              >
                {user?.name || "User"}
              </p>

              <p
                style={{
                  margin: 0,
                  marginTop: "4px",
                  color: "#94a3b8",
                  fontSize: "14px",
                }}
              >
                {user?.email || ""}
              </p>
            </div>

            {/* LOGOUT */}

            <button
              onClick={handleLogout}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* ==========================================
            DASHBOARD HOME
        ========================================== */}

        {active === "dashboard" && (
          <>
            {/* ==========================================
                SUMMARY CARDS
            ========================================== */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                marginBottom: "30px",
              }}
            >
              {/* ======================================
                  RISK CARD
              ====================================== */}

              <div className="card">
                <p
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  Risk
                </p>

                <h2
                  style={{
                    color:
                      riskData?.risk === "HIGH RISK"
                        ? "#ef4444"
                        : riskData?.risk === "MEDIUM RISK"
                        ? "#facc15"
                        : riskData?.risk === "LOW RISK"
                        ? "#22c55e"
                        : "white",
                  }}
                >
                  {riskData?.prediction ||
                    riskData?.risk ||
                    "N/A"}
                </h2>
              </div>

              {/* ======================================
                  EMI CARD
              ====================================== */}

              <div className="card">
                <p
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  EMI
                </p>

                <h2>
                  ₹{emiData?.emi || 0}
                </h2>
              </div>

              {/* ======================================
                  EXPENSE CARD
              ====================================== */}

              <div className="card">
                <p
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  Expenses
                </p>

                <h2>
                  ₹{expenseData?.totalExpense || 0}
                </h2>
              </div>

              {/* ======================================
                  SAVINGS CARD
              ====================================== */}

              <div className="card">
                <p
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  Savings
                </p>

                <h2>
                  ₹
                  {savingData?.monthlySavingsNeeded ||
                    savingData?.saved_amount ||
                    0}
                </h2>
              </div>
            </div>

            {/* ==========================================
                CHART SECTION
                EXACTLY 2 CHARTS PER ROW
            ========================================== */}

            <div
              style={{
                display: "grid",

                // IMPORTANT:
                // Exactly TWO columns.
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",

                gap: "20px",

                width: "100%",
              }}
            >
              {/* ======================================
                  ROW 1 - LEFT
                  EMI ANALYSIS
              ====================================== */}

              <div
                style={{
                  minWidth: 0,
                  width: "100%",
                }}
              >
                <EMIBarChart
                  emiData={emiData}
                />
              </div>

              {/* ======================================
                  ROW 1 - RIGHT
                  EXPENSE BREAKDOWN
              ====================================== */}

              <div
                style={{
                  minWidth: 0,
                  width: "100%",
                }}
              >
                <ExpensePieChart
                  expenses={
                    expenseData?.expenses || []
                  }
                />
              </div>

              {/* ======================================
                  ROW 2 - LEFT
                  SAVINGS JOURNEY
              ====================================== */}

              <div
                style={{
                  minWidth: 0,
                  width: "100%",
                }}
              >
                <SavingsProgressChart
                  savingsData={savingData}
                />
              </div>

              {/* ======================================
                  ROW 2 - RIGHT
                  RISK ANALYSIS
              ====================================== */}

              <div
                style={{
                  minWidth: 0,
                  width: "100%",
                }}
              >
                <RiskGaugeChart
                  riskData={riskData}
                />
              </div>
            </div>
          </>
        )}

        {/* ==========================================
            RISK PREDICTOR
        ========================================== */}

        {active === "risk" && (
          <Predictor
            setRiskData={setRiskData}
          />
        )}

        {/* ==========================================
            EMI CALCULATOR
        ========================================== */}

        {active === "emi" && (
          <EMICalculator
            setEmiData={setEmiData}
          />
        )}

        {/* ==========================================
            EXPENSE TRACKER
        ========================================== */}

        {active === "expense" && (
          <ExpenseTracker
            setExpenseData={setExpenseData}
          />
        )}

        {/* ==========================================
            SAVINGS PLANNER
        ========================================== */}

        {active === "savings" && (
          <SavingsPlanner
            setSavingData={setSavingData}
          />
        )}
      </div>
    </div>
  );
}