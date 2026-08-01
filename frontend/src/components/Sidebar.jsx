import {
  LayoutDashboard,
  ShieldCheck,
  Calculator,
  Wallet,
  PiggyBank,
} from "lucide-react";

export default function Sidebar({ setActive }) {
  return (
    <aside className="sidebar">

      {/* Logo */}

      <div className="sidebar-logo">

        <div className="logo-box">
          F
        </div>

        <div>
          <h2>Finora</h2>
          <span>AI Financial Suite</span>
        </div>

      </div>

      {/* Navigation */}

      <nav className="sidebar-menu">

        <button onClick={() => setActive("dashboard")}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>

        <button onClick={() => setActive("risk")}>
          <ShieldCheck size={20} />
          <span>Risk Predictor</span>
        </button>

        <button onClick={() => setActive("emi")}>
          <Calculator size={20} />
          <span>EMI Calculator</span>
        </button>

        <button onClick={() => setActive("expense")}>
          <Wallet size={20} />
          <span>Expense Tracker</span>
        </button>

        <button onClick={() => setActive("savings")}>
          <PiggyBank size={20} />
          <span>Savings Planner</span>
        </button>

      </nav>

    </aside>
  );
}