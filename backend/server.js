const express = require("express");
const cors = require("cors");

// ✅ Create app FIRST
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ Server is running perfectly");
});

// ✅ Prediction API
app.post("/predict", (req, res) => {
  const { age, income, loan_amount, credit_score } = req.body;

  let risk = "";
  let reason = "";

  // 🚨 HIGH RISK CONDITIONS
  if (loan_amount >= income * 50) {
    risk = "High Risk";
    reason = "Loan too large compared to income";
  } 
  else if (age > 60) {
    risk = "High Risk";
    reason = "Senior citizen risk";
  } 
  else if (credit_score <= 350) {
    risk = "High Risk";
    reason = "Very low credit score";
  } 

  // ⚖️ MEDIUM RISK
  else if (credit_score <= 650) {
    risk = "Medium Risk";
    reason = "Moderate credit score";
  } 

  // ✅ LOW RISK
  else {
    risk = "Low Risk";
    reason = "Good financial profile";
  }

  res.json({ risk, reason });
});

// ✅ Start server
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});