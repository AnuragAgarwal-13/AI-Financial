import { useState } from "react";

export default function EMICalculator({setEmiData}) {
  const [form, setForm] = useState({
    loan: "",
    rate: "",
    years: "",
    income: ""
  });

  const [emi, setEmi] = useState(0);
  const [total, setTotal] = useState(0);
  const [interest, setInterest] = useState(0);

  // handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // calculate EMI
  const calc = () => {
    const p = Number(form.loan);
    const r = Number(form.rate);
    const t = Number(form.years);

    if (!p || !r || !t) {
      alert("Please fill all fields");
      return;
    }

    let monthly = r / 12 / 100;
    let months = t * 12;

    let e =
      (p * monthly * Math.pow(1 + monthly, months)) /
      (Math.pow(1 + monthly, months) - 1);

    const emiValue = Math.round(e);
    const totalPayment = emiValue * months;
    const totalInterest = totalPayment - p;

    setEmi(emiValue);
    setTotal(totalPayment);
    setInterest(totalInterest);
    setEmiData({
  emi: emiValue,
  principal: p,
  salary: Number(form.income),
  totalPayment: totalPayment,
  totalInterest: totalInterest
});
  };

  return (
    <div className="grid-2">
      {/* LEFT */}
      <div className="box">
        <h3>EMI Calculator</h3>

        <input
          name="loan"
          placeholder="Loan Amount"
          onChange={handleChange}
        />
        <input
          name="rate"
          placeholder="Interest Rate (%)"
          onChange={handleChange}
        />
        <input
          name="years"
          placeholder="Time (Years)"
          onChange={handleChange}
        />
        <input
          name="income"
          placeholder="Monthly Salary"
          onChange={handleChange}
        />

        <button className="btn" onClick={calc}>
          Calculate EMI
        </button>
      </div>

      {/* RIGHT */}
      <div className="box purple">
        <h3>AI Insights</h3>

        {!emi && <p>Enter values to calculate EMI</p>}

        {emi > 0 && (
          <>
            <p>💰 EMI: ₹{emi}</p>
            <p>📊 Total Payment: ₹{total}</p>
            <p>📈 Interest: ₹{interest}</p>

            {/* EMI vs Salary */}
            {form.income && (
              <>
                <p>
                  📉 EMI Ratio:{" "}
                  {(emi / Number(form.income) * 100).toFixed(1)}%
                </p>

                {emi > Number(form.income) * 0.2 ? (
                  <p style={{ color: "#ff4d4d" }}>
                    ⚠️ EMI is too high (above 20% of salary)
                  </p>
                ) : (
                  <p style={{ color: "#4caf50" }}>
                    ✅ EMI is manageable
                  </p>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}