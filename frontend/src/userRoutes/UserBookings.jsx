import { useEffect, useState } from "react";
import { Heading, Table, Input } from "rsuite";
import { useNavigate } from "react-router";

const { Column, HeaderCell, Cell } = Table;

// helper: mask contact number but show last 4 digits
const maskContact = (phone) => {
  if (!phone) return "";
  const last4 = phone.slice(-4);
  return `******${last4}`;
};

const UserBookings = () => {
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // get logged-in user & token from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!storedUser.id) {
      // not logged in – go to login
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:4000/api/bookings/user/${storedUser.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          console.error("Failed to fetch bookings:", data);
          return;
        }

        // data is array from backend
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [storedUser.id, token, navigate]);

  // search filter (using bus name + number from API)
  const filtered = bookings.filter((b) =>
    `${b.bus_name ?? ""} ${b.bus_number ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <Heading level={2} style={{ marginBottom: 16 }}>
        My Bookings
      </Heading>

      <div style={{ marginBottom: 12 }}>
        <Input
          placeholder="Search by bus name or number..."
          value={search}
          onChange={setSearch}
        />
      </div>

      <Table height={420} data={filtered} loading={loading}>
        <Column width={60} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column width={150} resizable>
          <HeaderCell>Bus Name</HeaderCell>
          <Cell dataKey="bus_name" />
        </Column>

        <Column width={120}>
          <HeaderCell>Bus Number</HeaderCell>
          <Cell dataKey="bus_number" />
        </Column>

        <Column width={120}>
          <HeaderCell>Travel Date</HeaderCell>
          {/* assuming travel_date from backend */}
          <Cell>
            {(rowData) =>
              rowData.travel_date
                ? new Date(rowData.travel_date).toLocaleDateString()
                : "-"
            }
          </Cell>
        </Column>

        <Column width={100}>
          <HeaderCell>Travel Time</HeaderCell>
          {/* you can use departure_time or arrival_time */}
          <Cell dataKey="departure_time" />
        </Column>

        <Column width={80}>
          <HeaderCell>No. of Seats</HeaderCell>
          {/* you called it seats_booked in DB */}
          <Cell dataKey="seats_booked" />
        </Column>

        <Column width={120}>
          <HeaderCell>Status</HeaderCell>
          <Cell dataKey="status" />
        </Column>
      </Table>
    </>
  );
};

export default UserBookings;
