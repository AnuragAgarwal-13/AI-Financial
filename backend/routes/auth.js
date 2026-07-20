const authenticateToken = require("../middleware/authMiddleware");

const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwt = require("jsonwebtoken");

const router = express.Router();


// ==========================================
// SIGNUP API
// POST /api/auth/signup
// ==========================================

router.post("/signup", async (req, res) => {
  try {

    // Prevent error if request body is missing
    const { name, email, password } = req.body || {};

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into PostgreSQL
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, monthly_income, created_at`,
      [name, email, hashedPassword]
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });

  } catch (error) {

    console.error("Signup Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});


// ==========================================
// LOGIN API
// POST /api/auth/login
// ==========================================

router.post("/login", async (req, res) => {
  try {

    // Prevent error if request body is missing
    const { email, password } = req.body || {};

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user by email
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    // User does not exist
    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // Return token and user information
    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        monthly_income: user.monthly_income,
      },
    });

  } catch (error) {

    console.error("Login Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});


// ==========================================
// GET CURRENT LOGGED-IN USER
// GET /api/auth/me
// ==========================================

router.get("/me", authenticateToken, async (req, res) => {
  try {

    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT
        id,
        name,
        email,
        monthly_income,
        created_at,
        updated_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user: result.rows[0],
    });

  } catch (error) {

    console.error("Get User Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});


module.exports = router;