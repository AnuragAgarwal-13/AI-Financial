const express = require("express");
const router = express.Router();

const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

// =====================================
// SAVE EMI
// POST /api/emi
// =====================================

router.post("/", authenticateToken, async (req, res) => {

    try {

        const {
            loan_amount,
            interest_rate,
            tenure,
            emi,
            total_payment,
            total_interest
        } = req.body;

        const result = await pool.query(
            `INSERT INTO emi_history
            (
                user_id,
                loan_amount,
                interest_rate,
                tenure,
                emi,
                total_payment,
                total_interest
            )
            VALUES($1,$2,$3,$4,$5,$6,$7)
            RETURNING *`,
            [
                req.user.userId,
                loan_amount,
                interest_rate,
                tenure,
                emi,
                total_payment,
                total_interest
            ]
        );

        res.status(201).json({
            message: "EMI saved successfully",
            emi: result.rows[0]
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Internal server error"
        });

    }

});


// =====================================
// GET EMI HISTORY
// =====================================

router.get("/", authenticateToken, async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT *
             FROM emi_history
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
// DELETE EMI
// =====================================

router.delete("/:id", authenticateToken, async (req, res) => {

    try {

        const result = await pool.query(
            `DELETE FROM emi_history
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
                message: "Record not found"
            });

        }

        res.json({
            message: "EMI deleted successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Internal server error"
        });

    }

});

module.exports = router;