// src/routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

// POST /api/auth/login
// If user exists -> login
// If user does NOT exist -> auto-register (as normal "user")
router.post("/login", async (req, res) => {
  const { identifier, password, role } = req.body; // identifier = email OR phone

  console.log("Login attempt:", { identifier, role });

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Email/phone and password required" });
  }

  try {
    // 1. Try to find user by email OR phone
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? OR phone = ? LIMIT 1",
      [identifier, identifier]
    );
    const user = rows[0];

    // 2. If user exists -> LOGIN
    if (user) {
      // If role is sent and is admin, enforce it
      if (role && user.role !== role) {
        return res
          .status(403)
          .json({ message: "Invalid role for this account" });
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    }

    // 3. If user does NOT exist -> REGISTER (only normal users)
    if (role === "admin") {
      return res.status(403).json({
        message: "You cannot register an admin from here",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Decide whether identifier is email or phone
    const isEmail = identifier.includes("@");

    const [result] = await pool.query(
      "INSERT INTO users (email, phone, password_hash, role) VALUES (?, ?, ?, ?)",
      [
        isEmail ? identifier : null,
        isEmail ? null : identifier,
        passwordHash,
        "user",
      ]
    );

    const newUser = {
      id: result.insertId,
      email: isEmail ? identifier : null,
      phone: isEmail ? null : identifier,
      role: "user",
      name: null,
    };

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      token,
      user: newUser,
      message: "User registered and logged in",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
