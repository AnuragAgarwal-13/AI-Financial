const express = require("express");
const router = express.Router();

const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");


// ========================================
// ADD EXPENSE
// POST /api/expenses
// ========================================

router.post("/", authenticateToken, async (req, res) => {
    try {

        const { amount, category } = req.body;

        if (!amount || !category) {
            return res.status(400).json({
                message: "Amount and category are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO expenses
            (user_id, amount, category)
            VALUES($1,$2,$3)
            RETURNING *`,
            [
                req.user.userId,
                amount,
                category
            ]
        );

        res.status(201).json({
            message: "Expense added successfully",
            expense: result.rows[0]
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Internal server error"
        });

    }
});


// ========================================
// GET ALL EXPENSES
// ========================================

router.get("/", authenticateToken, async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT *
             FROM expenses
             WHERE user_id=$1
             ORDER BY created_at DESC`,
            [req.user.userId]
        );

        res.json(result.rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Internal server error"
        });

    }

});


// ========================================
// GET SINGLE EXPENSE
// ========================================

router.get("/:id", authenticateToken, async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT *
             FROM expenses
             WHERE id=$1
             AND user_id=$2`,
            [
                req.params.id,
                req.user.userId
            ]
        );

        if (result.rows.length == 0) {

            return res.status(404).json({
                message: "Expense not found"
            });

        }

        res.json(result.rows[0]);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Internal server error"
        });

    }

});


// ========================================
// UPDATE EXPENSE
// ========================================

router.put("/:id", authenticateToken, async (req, res) => {

    try {

        const { amount, category } = req.body;

        const result = await pool.query(
            `UPDATE expenses
             SET amount=$1,
                 category=$2
             WHERE id=$3
             AND user_id=$4
             RETURNING *`,
            [
                amount,
                category,
                req.params.id,
                req.user.userId
            ]
        );

        if (result.rows.length == 0) {

            return res.status(404).json({
                message: "Expense not found"
            });

        }

        res.json({
            message: "Expense updated successfully",
            expense: result.rows[0]
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Internal server error"
        });

    }

});


// ========================================
// DELETE EXPENSE
// ========================================

router.delete("/:id", authenticateToken, async (req, res) => {

    try {

        const result = await pool.query(
            `DELETE FROM expenses
             WHERE id=$1
             AND user_id=$2
             RETURNING *`,
            [
                req.params.id,
                req.user.userId
            ]
        );

        if (result.rows.length == 0) {

            return res.status(404).json({
                message: "Expense not found"
            });

        }

        res.json({
            message: "Expense deleted successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Internal server error"
        });

    }

});


// ========================================
// EXPENSE SUMMARY
// ========================================

router.get("/summary/dashboard", authenticateToken, async (req, res) => {

    try {

        const totalExpense = await pool.query(
            `SELECT
            COALESCE(SUM(amount),0) AS total
            FROM expenses
            WHERE user_id=$1`,
            [req.user.userId]
        );

        const categoryWise = await pool.query(
            `SELECT
                category,
                SUM(amount) AS total
             FROM expenses
             WHERE user_id=$1
             GROUP BY category`,
            [req.user.userId]
        );

        const latestExpenses = await pool.query(
            `SELECT *
             FROM expenses
             WHERE user_id=$1
             ORDER BY created_at DESC
             LIMIT 5`,
            [req.user.userId]
        );

        res.json({

            totalExpense:
                totalExpense.rows[0].total,

            categoryWise:
                categoryWise.rows,

            latestExpenses:
                latestExpenses.rows

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Internal server error"
        });

    }

});

module.exports = router;