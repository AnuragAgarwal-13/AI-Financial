const express = require("express");
const router = express.Router();

const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

// =====================================
// DASHBOARD API
// GET /api/dashboard
// =====================================

router.get("/", authenticateToken, async (req, res) => {

    try {

        const userId = req.user.userId;

        const profile = await pool.query(
            `SELECT occupation, monthly_income, city, state
             FROM user_profile
             WHERE user_id=$1`,
            [userId]
        );

        const expenseSummary = await pool.query(
            `SELECT
                COALESCE(SUM(amount),0) AS total_expense
             FROM expenses
             WHERE user_id=$1`,
            [userId]
        );

        const savingsSummary = await pool.query(
            `SELECT
                COALESCE(SUM(target_amount),0) AS total_target,
                COALESCE(SUM(saved_amount),0) AS total_saved
             FROM savings
             WHERE user_id=$1`,
            [userId]
        );

        const latestExpenses = await pool.query(
            `SELECT *
             FROM expenses
             WHERE user_id=$1
             ORDER BY created_at DESC
             LIMIT 5`,
            [userId]
        );

        const latestPredictions = await pool.query(
            `SELECT *
             FROM prediction_history
             WHERE user_id=$1
             ORDER BY created_at DESC
             LIMIT 5`,
            [userId]
        );

        const emiHistory = await pool.query(
            `SELECT *
             FROM emi_history
             WHERE user_id=$1
             ORDER BY created_at DESC
             LIMIT 5`,
            [userId]
        );

        const categoryChart = await pool.query(
            `SELECT
                category,
                SUM(amount) AS total
             FROM expenses
             WHERE user_id=$1
             GROUP BY category`,
            [userId]
        );

        res.json({

            profile:
                profile.rows[0] || {},

            expenseSummary:
                expenseSummary.rows[0],

            savingsSummary:
                savingsSummary.rows[0],

            latestExpenses:
                latestExpenses.rows,

            latestPredictions:
                latestPredictions.rows,

            emiHistory:
                emiHistory.rows,

            categoryChart:
                categoryChart.rows

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Internal server error"
        });

    }

});

module.exports = router;