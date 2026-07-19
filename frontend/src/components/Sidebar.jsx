export default function Sidebar({ setActive }) {
  return (
    <div className="sidebar">
      <h1 >FINORA</h1>

      <button onClick={() => setActive("dashboard")}>Dashboard</button>
      <button onClick={() => setActive("risk")}>Risk Predictor</button>
      <button onClick={() => setActive("emi")}>EMI Calculator</button>
      <button onClick={() => setActive("expense")}>Expense Tracker</button>
      <button onClick={() => setActive("savings")}>Savings Planner</button>
    </div>
  );
}