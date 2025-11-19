// src/adminRoutes/Dashboard.jsx
import { useEffect, useState } from "react";
import { Card, Heading } from "rsuite";
import { Table } from "rsuite";
import { notify } from "../components/Notification";

const { Column, HeaderCell, Cell } = Table;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBuses: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:4000/api/admin/dashboard", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // important
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load dashboard");
        }

        setStats({
          totalUsers: data.totalUsers,
          totalBuses: data.totalBuses,
          totalBookings: data.totalBookings,
          totalRevenue: data.totalRevenue,
        });

        setBookings(data.bookings || []);
        console.log("Dashboard bookings:", data.bookings); // debug
      } catch (err) {
        console.error(err);
        notify("error", err.message || "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <>
      <Heading level={2}>Dashboard</Heading>

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Card bordered>
          <Card.Header>Total Users</Card.Header>
          <Card.Body style={{ fontSize: 24 }}>{stats.totalUsers}</Card.Body>
        </Card>

        <Card bordered>
          <Card.Header>Total Buses</Card.Header>
          <Card.Body style={{ fontSize: 24 }}>{stats.totalBuses}</Card.Body>
        </Card>

        <Card bordered>
          <Card.Header>Total Bookings</Card.Header>
          <Card.Body style={{ fontSize: 24 }}>{stats.totalBookings}</Card.Body>
        </Card>

        <Card bordered>
          <Card.Header>Total Revenue</Card.Header>
          <Card.Body style={{ fontSize: 24 }}>₹{stats.totalRevenue}</Card.Body>
        </Card>
      </div>

      {/* Recent Bookings Table */}
      <Card bordered>
        <Card.Header as="h5">Recent Bookings</Card.Header>
        <Card.Body>
          <Table height={420} data={bookings} loading={loading} rowKey="id">
            <Column width={60} align="center" fixed>
              <HeaderCell>ID</HeaderCell>
              <Cell dataKey="id" />
            </Column>

            <Column width={180} resizable>
              <HeaderCell>User</HeaderCell>
              <Cell>
                {(rowData) => `${rowData.name == null ? "N/A" : rowData.name}`}
              </Cell>
            </Column>

            <Column width={220} resizable>
              <HeaderCell>Email</HeaderCell>
              <Cell dataKey="userEmail" />
            </Column>

            <Column width={200} resizable>
              <HeaderCell>Bus Name</HeaderCell>
              <Cell dataKey="busName" />
            </Column>

            <Column width={80} resizable>
              <HeaderCell>Seats</HeaderCell>
              <Cell dataKey="seats_booked" />
            </Column>

            <Column width={150} resizable>
              <HeaderCell>Date</HeaderCell>
              <Cell>
                {(rowData) =>
                  rowData.travel_date
                    ? new Date(rowData.travel_date).toLocaleDateString()
                    : "-"
                }
              </Cell>
            </Column>

            <Column width={140} resizable>
              <HeaderCell>Status</HeaderCell>
              <Cell dataKey="status" />
            </Column>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default Dashboard;
