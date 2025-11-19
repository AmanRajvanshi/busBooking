// src/routes/userRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import pool from "../db.js";
import { auth, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/users/me  (current logged-in user)
router.get("/me", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, phone, role, created_at FROM users WHERE id=?",
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/users/me  (user edits their profile)
router.put("/me", auth, async (req, res) => {
  const { name, phone } = req.body;

  try {
    await pool.query("UPDATE users SET name=?, phone=? WHERE id=?", [
      name,
      phone,
      req.user.id,
    ]);

    const [rows] = await pool.query(
      "SELECT id, name, email, phone, role, created_at FROM users WHERE id=?",
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// (optional) Admin: get all users
router.get("/", auth, isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
