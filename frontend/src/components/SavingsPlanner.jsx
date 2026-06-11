import { useState } from "react";

// ✅ accept prop
export default function SavingsPlanner({ setSavingData }) {

  const [form, setForm] = useState({
    goal: "",
    months: "",
    income: "",
    current: ""
  });

  const [result, setResult] = useState(null);

  // handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // calculate savings
  const calculate = () => {

    const goal = Number(form.goal);
    const months = Number(form.months);
    const income = Number(form.income);
    const current = Number(form.current || 0);

    // validation
    if (!goal || !months) {
      alert("Enter goal and time");
      return;
    }

    // remaining amount
    const remaining = goal - current;

    // monthly savings required
    const monthly = Math.ceil(remaining / months);

    // difficulty
    let level = "Easy";
    let suggestion = "Plan looks achievable 👍";

    if (income) {

      if (monthly > income * 0.5) {

        level = "Hard";
        suggestion = "Increase time or reduce goal ❌";

      }
      else if (monthly > income * 0.3) {

        level = "Moderate";
        suggestion = "Manage carefully ⚠️";

      }
    }

    // smart recommendation
    let recommendedMonths = months;

    if (income && monthly > income * 0.3) {

      recommendedMonths = Math.ceil(
        remaining / (income * 0.3)
      );
    }

    // store result locally
    setResult({
      monthly,
      remaining,
      level,
      suggestion,
      recommendedMonths
    });

    // ✅ send data to dashboard
    if (setSavingData) {

  setSavingData({

    goal,
    current,
    months,
    income,

    monthlySavingsNeeded: monthly,

    difficulty: level,

    remaining,
    suggestion,
    recommendedMonths
  });
}
  };

  return (

    <div className="grid-2">

      {/* LEFT SIDE */}
      <div className="box">

        <h3>Savings Planner</h3>

        <input
          name="goal"
          placeholder="Goal Amount (₹)"
          onChange={handleChange}
        />

        <input
          name="current"
          placeholder="Current Savings (₹)"
          onChange={handleChange}
        />

        <input
          name="months"
          placeholder="Time (Months)"
          onChange={handleChange}
        />

        <input
          name="income"
          placeholder="Monthly Income"
          onChange={handleChange}
        />

        <button
          className="btn"
          onClick={calculate}
        >
          Plan Savings
        </button>

      </div>

      {/* RIGHT SIDE */}
      <div className="box purple">

        <h3>AI Insights</h3>

        {!result && (
          <p>
            Enter details to plan savings
          </p>
        )}

        {result && (
          <>

            <p>
              🎯 Remaining Goal:
              ₹{result.remaining}
            </p>

            <p>
              💰 Monthly Saving Needed:
              ₹{result.monthly}
            </p>

            <p>
              📊 Difficulty:
              {" "}
              <span
                style={{
                  color:
                    result.level === "Hard"
                      ? "#ff4d4d"
                      : result.level === "Moderate"
                      ? "#ffa500"
                      : "#4caf50"
                }}
              >
                {result.level}
              </span>
            </p>

            <p>
              💡 {result.suggestion}
            </p>

            {/* recommendation */}
            {result.recommendedMonths !== Number(form.months) && (
              <p>
                📅 Recommended Time:
                {" "}
                {result.recommendedMonths} months
              </p>
            )}

          </>
        )}

      </div>

    </div>
  );
}