// src/routes/busRoutes.js
import express from "express";
import pool from "../db.js";
import { auth, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/buses  (public or logged-in users)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM buses ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/buses (admin only)
router.post("/", auth, isAdmin, async (req, res) => {
  const {
    bus_number,
    bus_name,
    fare,
    seats,
    arrival_time,
    departure_time,
    from_location,
    to_location,
  } = req.body;

  if (
    !bus_number ||
    !bus_name ||
    !fare ||
    !seats ||
    !arrival_time ||
    !departure_time ||
    !from_location ||
    !to_location
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO buses
       (bus_number, bus_name, fare, seats, arrival_time, departure_time, from_location, to_location)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bus_number,
        bus_name,
        fare,
        seats,
        arrival_time,
        departure_time,
        from_location,
        to_location,
      ]
    );

    const [rows] = await pool.query("SELECT * FROM buses WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/buses/:id (admin only)
router.put("/:id", auth, isAdmin, async (req, res) => {
  const id = req.params.id;
  const {
    bus_number,
    bus_name,
    fare,
    seats,
    arrival_time,
    departure_time,
    from_location,
    to_location,
  } = req.body;

  try {
    await pool.query(
      `UPDATE buses
       SET bus_number=?, bus_name=?, fare=?, seats=?, arrival_time=?, departure_time=?,
           from_location=?, to_location=?
       WHERE id=?`,
      [
        bus_number,
        bus_name,
        fare,
        seats,
        arrival_time,
        departure_time,
        from_location,
        to_location,
        id,
      ]
    );
    const [rows] = await pool.query("SELECT * FROM buses WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/buses/:id (admin only)
router.delete("/:id", auth, isAdmin, async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query("DELETE FROM bookings WHERE bus_id = ?", [id]); // optional: cascade bookings
    await pool.query("DELETE FROM buses WHERE id = ?", [id]);
    res.json({ message: "Bus deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// SEARCH BUSES (partial match using LIKE)
router.get("/search", async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({
      message: "Both 'from' and 'to' locations are required"
    });
  }

  try {
    const [rows] = await pool.query(
      `SELECT *
       FROM buses
       WHERE LOWER(from_location) LIKE LOWER(?)
       AND LOWER(to_location) LIKE LOWER(?)`,
      [`%${from}%`, `%${to}%`]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
