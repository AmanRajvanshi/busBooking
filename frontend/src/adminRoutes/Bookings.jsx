// src/adminRoutes/Bookings.jsx
import { useEffect, useState } from "react";
import { Col, Heading, SelectPicker, Table } from "rsuite";
import { notify } from "../components/Notification";

const { Column, HeaderCell, Cell } = Table;

// Mask contact number but show last 4 digits
const maskContact = (phone) => {
  if (!phone) return "";
  const last4 = phone.slice(-4);
  return `******${last4}`;
};

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Completed", value: "completed" },
];

const Bookings = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load all bookings from backend
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/bookings", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to load bookings");
      }

      setData(json);
    } catch (err) {
      console.error(err);
      notify("error", err.message || "Error loading bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Update booking status via PATCH /api/bookings/:id/status
  const handleStatusChange = async (bookingId, status) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:4000/api/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ status }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to update status");
      }

      notify("success", "Booking status updated");

      // Update local state
      setData((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: json.status } : b
        )
      );
    } catch (err) {
      console.error(err);
      notify("error", err.message || "Error updating status");
    }
  };

  return (
    <>
      <Heading level={2}>Bookings</Heading>

      <Table height={420} data={data} loading={loading}>
        <Column width={60} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column width={150} resizable>
          <HeaderCell>Bus Name</HeaderCell>
          <Cell dataKey="bus_name" />
        </Column>

        <Column width={120} resizable>
          <HeaderCell>Bus Number</HeaderCell>
          <Cell dataKey="bus_number" />
        </Column>

        <Column width={180} resizable>
          <HeaderCell>User Name</HeaderCell>
          <Cell>
            {(rowData) => (rowData.user_name == null ? "-" : rowData.user_name)}
          </Cell>
        </Column>

        <Column width={200} resizable>
          <HeaderCell>Travel Date (IST)</HeaderCell>
          <Cell>
            {(rowData) => {
              const utcDate = new Date(rowData.travel_date);

              const istDate = utcDate.toLocaleDateString("en-IN", {
                timeZone: "Asia/Kolkata",
              });

              return <span>{istDate}</span>;
            }}
          </Cell>
        </Column>

        <Column width={140} resizable>
          <HeaderCell>Departure Time</HeaderCell>
          <Cell dataKey="departure_time" />
        </Column>

        <Column width={140} resizable>
          <HeaderCell>Arrival Time</HeaderCell>
          <Cell dataKey="arrival_time" />
        </Column>

        <Column width={160} resizable>
          <HeaderCell>User Email</HeaderCell>
          <Cell>{(rowData) => rowData.user_email}</Cell>
        </Column>

        <Column width={100} resizable>
          <HeaderCell>Seats</HeaderCell>
          <Cell dataKey="seats_booked" />
        </Column>

        <Column width={140} resizable>
          <HeaderCell>Status</HeaderCell>
          <Cell>
            {(rowData) => (
              <SelectPicker
                data={statusOptions}
                cleanable={false}
                searchable={false}
                size="xs"
                value={rowData.status}
                style={{ width: 130 }}
                onChange={(value) => handleStatusChange(rowData.id, value)}
              />
            )}
          </Cell>
        </Column>
      </Table>
    </>
  );
};

export default Bookings;
