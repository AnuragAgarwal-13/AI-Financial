const express = require("express");
const router = express.Router();

const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

// =====================================
// GET USER PROFILE
// =====================================

router.get("/", authenticateToken, async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT *
             FROM user_profile
             WHERE user_id=$1`,
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.json({
                message: "Profile not created yet",
                profile: null
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
// CREATE / UPDATE PROFILE
// =====================================

router.put("/", authenticateToken, async (req, res) => {

    try {

        const {
            occupation,
            monthly_income,
            city,
            state
        } = req.body;

        const existing = await pool.query(
            `SELECT id
             FROM user_profile
             WHERE user_id=$1`,
            [req.user.userId]
        );

        let result;

        if (existing.rows.length === 0) {

            result = await pool.query(
                `INSERT INTO user_profile
                (user_id, occupation, monthly_income, city, state)
                VALUES($1,$2,$3,$4,$5)
                RETURNING *`,
                [
                    req.user.userId,
                    occupation,
                    monthly_income,
                    city,
                    state
                ]
            );

        } else {

            result = await pool.query(
                `UPDATE user_profile
                 SET occupation=$1,
                     monthly_income=$2,
                     city=$3,
                     state=$4,
                     updated_at=CURRENT_TIMESTAMP
                 WHERE user_id=$5
                 RETURNING *`,
                [
                    occupation,
                    monthly_income,
                    city,
                    state,
                    req.user.userId
                ]
            );

        }

        res.json({
            message: "Profile saved successfully",
            profile: result.rows[0]
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Internal server error"
        });

    }

});

module.exports = router;