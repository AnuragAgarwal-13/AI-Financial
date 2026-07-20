require("dotenv").config();

const express = require("express");
const cors = require("cors");

// ================================
// IMPORT ROUTES
// ================================

const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expenses");
const savingsRoutes = require("./routes/savings");
const profileRoutes = require("./routes/profile");
const emiRoutes = require("./routes/emi");
const predictionRoutes = require("./routes/predictions");
const dashboardRoutes = require("./routes/dashboard");

// ================================
// CREATE APP
// ================================

const app = express();

// ================================
// MIDDLEWARE
// ================================

// Allow requests from frontend
app.use(cors());

// Parse JSON
app.use(express.json());

// Parse URL Encoded Data
app.use(express.urlencoded({ extended: true }));

// ================================
// ROUTES
// ================================

// Authentication
app.use("/api/auth", authRoutes);

// Expenses
app.use("/api/expenses", expenseRoutes);

// Savings
app.use("/api/savings", savingsRoutes);

// User Profile
app.use("/api/profile", profileRoutes);

// EMI
app.use("/api/emi", emiRoutes);

// AI Risk Prediction
app.use("/api/predictions", predictionRoutes);

// Dashboard
app.use("/api/dashboard", dashboardRoutes);

// ================================
// HOME ROUTE
// ================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Finora Backend API"
    });
});

// ================================
// HEALTH CHECK
// ================================

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend is healthy"
    });
});

// ================================
// 404 HANDLER
// ================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

// ================================
// GLOBAL ERROR HANDLER
// ================================

app.use((err, req, res, next) => {

    console.error("Global Error:", err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });

});

// ================================
// START SERVER
// ================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Finora Backend running on http://localhost:${PORT}`);
});