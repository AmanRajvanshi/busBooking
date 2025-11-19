// src/routes/bookingRoutes.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

// POST /api/bookings
router.post("/", async (req, res) => {
  const { busId, userId, seats_booked, journeyDate } = req.body;

  if (!busId || !userId || !journeyDate) {
    return res.status(400).json({
      message: "busId, userId and journeyDate are required",
    });
  }

  try {
    // Optional: check bus exists
    const [[bus]] = await pool.query("SELECT id FROM buses WHERE id = ?", [
      busId,
    ]);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    // Optional: check user exists
    const [[user]] = await pool.query("SELECT id FROM users WHERE id = ?", [
      userId,
    ]);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create booking (default status = 'pending')
    const [result] = await pool.query(
      `INSERT INTO bookings (bus_id, user_id, seats_booked, travel_date, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [busId, userId, seats_booked || 1, journeyDate]
    );

    const [rows] = await pool.query("SELECT * FROM bookings WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/bookings/user/:userId
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT 
         b.id,
         b.travel_date,
         b.seats_booked,
         b.status,
         b.created_at,
         u.phone        AS user_phone,
         bs.bus_name,
         bs.bus_number,
         bs.from_location,
         bs.to_location,
         bs.departure_time,
         bs.arrival_time,
         bs.fare
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN buses bs ON b.bus_id = bs.id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/bookings
router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        b.id,
        b.travel_date,
        b.seats_booked,
        b.status,
        b.created_at,
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        bs.id AS bus_id,
        bs.bus_name,
        bs.bus_number,
        bs.from_location,
        bs.to_location,
        bs.departure_time,
        bs.arrival_time,
        bs.fare
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN buses bs ON b.bus_id = bs.id
       ORDER BY b.created_at DESC`
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/bookings/:id/status
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["pending", "confirmed", "cancelled", "completed"];

  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: `Status is required and must be one of: ${allowedStatuses.join(
        ", "
      )}`,
    });
  }

  try {
    // Check booking exists
    const [[booking]] = await pool.query(
      "SELECT id FROM bookings WHERE id = ?",
      [id]
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update status
    await pool.query("UPDATE bookings SET status = ? WHERE id = ?", [
      status,
      id,
    ]);

    const [[updated]] = await pool.query(
      `SELECT 
         b.*,
         u.name AS user_name,
         bs.bus_name
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN buses bs ON b.bus_id = bs.id
       WHERE b.id = ?`,
      [id]
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
