const express = require("express");
const router = express.Router();

const { execFile } = require("child_process");
const path = require("path");

const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

// =====================================
// PREDICT RISK
// POST /api/predictions
// =====================================

router.post("/", authenticateToken, async (req, res) => {

    try {

        const {
            age,
            income,
            loan_amount,
            credit_score
        } = req.body;

        if (
            age == null ||
            income == null ||
            loan_amount == null ||
            credit_score == null
        ) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        const pythonScript = path.join(
            __dirname,
            "../../ml-model/predict.py"
        );

        execFile(
            process.env.PYTHON_EXECUTABLE,
            [
                pythonScript,
                age,
                income,
                loan_amount,
                credit_score
            ],
            async (error, stdout, stderr) => {

                if (error) {
                    console.log(stderr);

                    return res.status(500).json({
                        message: "Prediction failed"
                    });
                }

                const prediction = stdout.trim();

                let reason = "";

                if (prediction === "HIGH RISK") {

                    reason =
                        "Loan amount is high compared to income.";

                } else if (prediction === "MEDIUM RISK") {

                    reason =
                        "Financial profile needs improvement.";

                } else {

                    reason =
                        "Healthy financial profile.";

                }

                await pool.query(
                    `INSERT INTO prediction_history
                    (
                        user_id,
                        age,
                        income,
                        loan_amount,
                        credit_score,
                        risk,
                        reason
                    )
                    VALUES($1,$2,$3,$4,$5,$6,$7)`,
                    [
                        req.user.userId,
                        age,
                        income,
                        loan_amount,
                        credit_score,
                        prediction,
                        reason
                    ]
                );

                res.json({

                    prediction,
                    reason

                });

            }
        );

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Internal server error"

        });

    }

});


// =====================================
// GET PREDICTION HISTORY
// =====================================

router.get("/", authenticateToken, async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT *
             FROM prediction_history
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
// DELETE HISTORY
// =====================================

router.delete("/:id", authenticateToken, async (req, res) => {

    try {

        const result = await pool.query(
            `DELETE
             FROM prediction_history
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

                message: "Prediction not found"

            });

        }

        res.json({

            message: "Prediction deleted"

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Internal server error"

        });

    }

});

module.exports = router;