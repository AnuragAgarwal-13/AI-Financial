import { useState, useEffect } from "react"; // ✅ added useEffect

export default function ExpenseTracker({setExpenseData}) {
  const [income, setIncome] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const [expenses, setExpenses] = useState([]);

  // Add expense
  const addExpense = () => {
    if (!amount) {
      alert("Enter amount");
      return;
    }

    const newExpense = {
      amount: Number(amount),
      category
    };

    setExpenses([...expenses, newExpense]);
    setAmount("");
  };

  // Total expense
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Savings
  const balance = income - totalExpense;

  // ✅ 🔥 ADDED (DO NOT REMOVE)
  useEffect(() => {
    if (setExpenseData && income !== "") {
      setExpenseData({
        totalExpense,
        balance,
        income,
        expenses
      });
    }
  }, [expenses, income, totalExpense, balance, setExpenseData]);

  return (
    <div className="grid-2">

      {/* LEFT SIDE */}
      <div className="box">
        <h3>Expense Tracker</h3>

        <input
          placeholder="Monthly Income"
          onChange={(e) => setIncome(Number(e.target.value))}
        />

        <hr />

        <h4>Add Expense</h4>

        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select onChange={(e) => setCategory(e.target.value)}>
          <option>Food</option>
          <option>Rent</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Other</option>
        </select>

        <button className="btn" onClick={addExpense}>
          Add Expense
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="box purple">
        <h3>AI Insights</h3>

        {!income && <p>Enter income to see insights</p>}

        {income > 0 && (
          <>
            <p>💰 Income: ₹{income}</p>
            <p>💸 Expenses: ₹{totalExpense}</p>
            <p>📊 Savings: ₹{balance}</p>

            {/* 🔴 YOUR RULE */}
            {balance < 10000 ? (
              <p style={{ color: "#ff4d4d" }}>
                ⚠️ Overspending — Minimum ₹10,000 savings required
              </p>
            ) : (
              <p style={{ color: "#4caf50" }}>
                ✅ Good financial discipline
              </p>
            )}

            {/* EXTRA (optional but good) */}
            <p>
              📉 Savings Ratio:{" "}
              {(balance / income * 100).toFixed(1)}%
            </p>
          </>
        )}
      </div>

      {/* HISTORY */}
      <div className="box" style={{ gridColumn: "span 2" }}>
        <h3>Expense History</h3>

        {expenses.length === 0 && <p>No expenses added</p>}

        {expenses.map((e, i) => (
          <p key={i}>
            ₹{e.amount} - {e.category}
          </p>
        ))}
      </div>

    </div>
  );
}