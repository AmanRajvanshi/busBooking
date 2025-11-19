import { useEffect, useState } from "react";
import { Card, Heading, HStack, Stat, StatGroup, VStack, Table } from "rsuite";
import { notify } from "../components/Notification";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBuses: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  const [bookings, setBookings] = useState([]);

  // Fetch dashboard API
  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        notify("error", data.message || "Failed to load dashboard");
        return;
      }

      setStats({
        totalUsers: data.totalUsers,
        totalBuses: data.totalBuses,
        totalBookings: data.totalBookings,
        totalRevenue: data.totalRevenue,
      });

      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
      notify("error", "Server error");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <>
      <Heading level={2}>Dashboard</Heading>
      <VStack spacing={10}>
        {/* Cards */}
        <Card size="md">
          <Card.Body>
            <StatGroup columns="4" spacing={10}>
              <Stat bordered>
                <Stat.Label>Total Users</Stat.Label>
                <HStack spacing={10}>
                  <Stat.Value>{stats.totalUsers}</Stat.Value>
                </HStack>
              </Stat>

              <Stat bordered>
                <Stat.Label>Total Buses</Stat.Label>
                <HStack spacing={10}>
                  <Stat.Value>{stats.totalBuses}</Stat.Value>
                </HStack>
              </Stat>

              <Stat bordered>
                <Stat.Label>Total Bookings</Stat.Label>
                <HStack spacing={10}>
                  <Stat.Value>{stats.totalBookings}</Stat.Value>
                </HStack>
              </Stat>

              <Stat bordered>
                <Stat.Label>Total Revenue</Stat.Label>
                <HStack spacing={10}>
                  <Stat.Value>₹{stats.totalRevenue}</Stat.Value>
                </HStack>
              </Stat>
            </StatGroup>
          </Card.Body>
        </Card>

        {/* Recent Bookings Table */}
        <Card size="md">
          <Card.Header as="h5">Recent Bookings</Card.Header>
          <Card.Body>
            <Table height={420} data={bookings}>
              <Column width={60} align="center" resizable>
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
              </Column>

              <Column width={150} resizable>
                <HeaderCell>User</HeaderCell>
                <Cell dataKey="userName" />
              </Column>

              <Column width={200} resizable>
                <HeaderCell>Email</HeaderCell>
                <Cell dataKey="userEmail" />
              </Column>

              <Column width={150} resizable>
                <HeaderCell>Bus Name</HeaderCell>
                <Cell dataKey="busName" />
              </Column>

              <Column width={100} resizable>
                <HeaderCell>Seats</HeaderCell>
                <Cell dataKey="seats" />
              </Column>

              <Column width={150} resizable>
                <HeaderCell>Date</HeaderCell>
                <Cell dataKey="journey_date" />
              </Column>

              <Column width={120} resizable>
                <HeaderCell>Status</HeaderCell>
                <Cell>
                  {(rowData) => (
                    <span
                      style={{
                        color:
                          rowData.status === "confirmed"
                            ? "green"
                            : rowData.status === "pending"
                            ? "orange"
                            : "red",
                        fontWeight: 600,
                      }}
                    >
                      {rowData.status}
                    </span>
                  )}
                </Cell>
              </Column>
            </Table>
          </Card.Body>
        </Card>
      </VStack>
    </>
  );
};

export default Dashboard;
