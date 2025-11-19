// src/routes/adminDashboardRoutes.js
import express from "express";
import pool from "../db.js";
import { auth, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/dashboard", auth, isAdmin, async (req, res) => {
  try {
    // summary numbers for cards
    const [[counts]] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users WHERE role = 'user') AS totalUsers,
        (SELECT COUNT(*) FROM buses) AS totalBuses,
        (SELECT COUNT(*) FROM bookings) AS totalBookings
    `);

    // total revenue from confirmed bookings
    const [[revenueRow]] = await pool.query(`
      SELECT COALESCE(SUM(b.fare * bk.seats_booked), 0) AS totalRevenue
      FROM bookings bk
      JOIN buses b ON bk.bus_id = b.id
      WHERE bk.status = 'confirmed'
    `);

    const totalRevenue = Number(revenueRow.totalRevenue) || 0;

    // recent bookings for table
    const [recentBookings] = await pool.query(`
      SELECT 
        bk.id,
        u.name       AS userName,
        u.email      AS userEmail,
        b.bus_name   AS busName,
        bk.seats_booked,
        bk.travel_date,
        bk.status,
        bk.created_at
      FROM bookings bk
      JOIN users u ON bk.user_id = u.id
      JOIN buses b ON bk.bus_id = b.id
      ORDER BY bk.created_at DESC
      LIMIT 10
    `);

    res.json({
      totalUsers: counts.totalUsers,
      totalBuses: counts.totalBuses,
      totalBookings: counts.totalBookings,
      totalRevenue,
      bookings: recentBookings,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
