const express = require("express");
const router = express.Router();

const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

// =====================================
// ADD SAVINGS GOAL
// POST /api/savings
// =====================================

router.post("/", authenticateToken, async (req, res) => {

    try {

        const {
            goal_name,
            target_amount,
            saved_amount,
            target_date
        } = req.body;

        if (!goal_name || !target_amount) {
            return res.status(400).json({
                message: "Goal name and target amount are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO savings
            (user_id, goal_name, target_amount, saved_amount, target_date)
            VALUES($1,$2,$3,$4,$5)
            RETURNING *`,
            [
                req.user.userId,
                goal_name,
                target_amount,
                saved_amount || 0,
                target_date
            ]
        );

        res.status(201).json({
            message: "Savings goal created",
            saving: result.rows[0]
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Internal server error"
        });

    }

});


// =====================================
// GET ALL SAVINGS
// =====================================

router.get("/", authenticateToken, async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT *
             FROM savings
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


// =====================================
// GET SINGLE GOAL
// =====================================

router.get("/:id", authenticateToken, async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT *
             FROM savings
             WHERE id=$1
             AND user_id=$2`,
            [
                req.params.id,
                req.user.userId
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Goal not found"
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


// =====================================
// UPDATE GOAL
// =====================================

router.put("/:id", authenticateToken, async (req, res) => {

    try {

        const {
            goal_name,
            target_amount,
            saved_amount,
            target_date
        } = req.body;

        const result = await pool.query(
            `UPDATE savings
             SET goal_name=$1,
                 target_amount=$2,
                 saved_amount=$3,
                 target_date=$4
             WHERE id=$5
             AND user_id=$6
             RETURNING *`,
            [
                goal_name,
                target_amount,
                saved_amount,
                target_date,
                req.params.id,
                req.user.userId
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Goal not found"
            });

        }

        res.json({
            message: "Goal updated",
            saving: result.rows[0]
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Internal server error"
        });

    }

});


// =====================================
// DELETE GOAL
// =====================================

router.delete("/:id", authenticateToken, async (req, res) => {

    try {

        const result = await pool.query(
            `DELETE FROM savings
             WHERE id=$1
             AND user_id=$2
             RETURNING *`,
            [
                req.params.id,
                req.user.userId
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Goal not found"
            });

        }

        res.json({
            message: "Goal deleted successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Internal server error"
        });

    }

});


// =====================================
// SAVINGS SUMMARY
// =====================================

router.get("/summary/dashboard", authenticateToken, async (req, res) => {

    try {

        const totals = await pool.query(
            `SELECT
                COALESCE(SUM(target_amount),0) AS total_target,
                COALESCE(SUM(saved_amount),0) AS total_saved
             FROM savings
             WHERE user_id=$1`,
            [req.user.userId]
        );

        const latest = await pool.query(
            `SELECT *
             FROM savings
             WHERE user_id=$1
             ORDER BY created_at DESC
             LIMIT 5`,
            [req.user.userId]
        );

        res.json({
            summary: totals.rows[0],
            latestGoals: latest.rows
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Internal server error"
        });

    }

});

module.exports = router;