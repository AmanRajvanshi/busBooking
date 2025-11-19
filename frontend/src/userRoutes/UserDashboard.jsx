// src/userRoutes/UserDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Button,
  DatePicker,
  Form,
  Heading,
  Input,
  InputNumber,
  Loader,
  Modal,
  Panel,
  Table,
  VStack,
} from "rsuite";
import { notify } from "../components/Notification"; // 👈 only notify
const { Column, HeaderCell, Cell } = Table;

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [bookingSeats, setBookingSeats] = useState(1);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [bookingLoading, setBookingLoading] = useState(false);

  // Load current user
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchMe = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
            return;
          }
          const data = await res.json().catch(() => ({}));
          notify("error", data.message || "Failed to load user");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        notify("error", "Server error while loading user");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchMe();
  }, [navigate]);

  const handleSearch = async () => {
    if (!from || !to) {
      notify("warning", "Please enter both 'From' and 'To' locations.");
      return;
    }

    try {
      setSearchLoading(true);
      const res = await fetch(
        `http://localhost:4000/api/buses/search?from=${encodeURIComponent(
          from
        )}&to=${encodeURIComponent(to)}`
      );
      const data = await res.json();

      if (Array.isArray(data) && data.length === 0) {
        notify("info", "No buses found for the selected route.");
      }

      setSearchResults(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      notify("error", "Failed to search buses");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleQuickBook = (bus) => {
    setSelectedBus(bus);
    setBookingSeats(1);
    setBookingDate(null);
    setBookingModalOpen(true);
  };

  if (loadingUser) {
    return (
      <div style={{ paddingTop: 40, textAlign: "center" }}>
        <Loader size="lg" />
      </div>
    );
  }

  const handleConfirmBooking = async () => {
    if (!bookingDate) {
      notify("warning", "Please select a journey date");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      notify("error", "You must be logged in");
      navigate("/login");
      return;
    }

    setBookingLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          busId: selectedBus.id,
          userId: user.id,
          seats: bookingSeats,
          journeyDate: bookingDate?.toISOString().split("T")[0], // YYYY-MM-DD
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        notify("error", data.message || "Booking failed");
      } else {
        notify("success", "Bus booked successfully!");
        setBookingModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      notify("error", "Server error while booking");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <>
      <Heading level={2} style={{ marginBottom: 16 }}>
        User Dashboard
      </Heading>

      {/* Search buses */}
      <Panel bordered shaded style={{ marginBottom: 16 }}>
        <h4>Search Buses</h4>

        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 8,
            flexWrap: "wrap",
          }}
        >
          <Input
            placeholder="From"
            value={from}
            onChange={setFrom}
            style={{ minWidth: 200 }}
          />
          <Input
            placeholder="To"
            value={to}
            onChange={setTo}
            style={{ minWidth: 200 }}
          />
          <Button
            appearance="primary"
            onClick={handleSearch}
            loading={searchLoading}
          >
            Search
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: "1px solid #eee",
            }}
          >
            <h5>Search Results</h5>

            <Table
              data={searchResults}
              loading={searchLoading}
              bordered
              cellBordered
              hover
              headerHeight={30}
              rowHeight={50}
              style={{ marginTop: 10 }}
            >
              {/* ID */}
              <Column width={60} align="center" fixed>
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
              </Column>

              {/* Bus Name */}
              <Column width={160}>
                <HeaderCell>Bus Name</HeaderCell>
                <Cell dataKey="bus_name" />
              </Column>

              {/* Bus Number */}
              <Column width={120}>
                <HeaderCell>Bus Number</HeaderCell>
                <Cell dataKey="bus_number" />
              </Column>

              {/* From */}
              <Column width={150}>
                <HeaderCell>From</HeaderCell>
                <Cell dataKey="from_location" />
              </Column>

              {/* To */}
              <Column width={150}>
                <HeaderCell>To</HeaderCell>
                <Cell dataKey="to_location" />
              </Column>

              {/* Departure Time */}
              <Column width={140}>
                <HeaderCell>Departure</HeaderCell>
                <Cell dataKey="departure_time" />
              </Column>

              {/* Arrival Time */}
              <Column width={140}>
                <HeaderCell>Arrival</HeaderCell>
                <Cell dataKey="arrival_time" />
              </Column>

              {/* Fare */}
              <Column width={100}>
                <HeaderCell>Fare</HeaderCell>
                <Cell>{(row) => `₹${row.fare}`}</Cell>
              </Column>

              {/* Book Button */}
              <Column width={100} fixed="right">
                <HeaderCell>Action</HeaderCell>
                <Cell>
                  {(rowData) => (
                    <Button
                      size="xs"
                      appearance="primary"
                      onClick={() => handleQuickBook(rowData)}
                    >
                      Book
                    </Button>
                  )}
                </Cell>
              </Column>
            </Table>
          </div>
        )}
      </Panel>

      {/* User details summary */}
      <Panel bordered style={{ marginBottom: 16 }}>
        <h4>Your Details</h4>
        <p>
          <strong>Name:</strong> {user?.name || "-"}
        </p>
        <p>
          <strong>Email:</strong> {user?.email || "-"}
        </p>
        <p>
          <strong>Contact:</strong> {user?.phone || "-"}
        </p>
        <Button appearance="link" onClick={() => navigate("/user/profile")}>
          Edit Details
        </Button>
      </Panel>
      <Modal open={bookingModalOpen} onClose={() => setBookingModalOpen(false)}>
        <Modal.Header>
          <Modal.Title>Book Bus</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedBus && (
            <VStack spacing={20}>
              <p>
                <strong>Bus:</strong> {selectedBus.bus_name}
              </p>
              <p>
                <strong>Route:</strong> {selectedBus.from_location} →{" "}
                {selectedBus.to_location}
              </p>
              <p>
                <strong>Fare per seat:</strong> ₹{selectedBus.fare}
              </p>

              <Form fluid style={{}}>
                <Form.Group>
                  <Form.ControlLabel>Journey Date</Form.ControlLabel>
                  <Form.Control
                    accepter={DatePicker}
                    oneTap
                    value={bookingDate}
                    onChange={setBookingDate}
                    shouldDisableDate={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Seats</Form.ControlLabel>
                  <Form.Control
                    accepter={InputNumber}
                    min={1}
                    value={bookingSeats}
                    onChange={setBookingSeats}
                  />
                </Form.Group>
              </Form>
            </VStack>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            appearance="primary"
            loading={bookingLoading}
            onClick={handleConfirmBooking}
          >
            Confirm Booking
          </Button>

          <Button
            appearance="subtle"
            onClick={() => setBookingModalOpen(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserDashboard;
