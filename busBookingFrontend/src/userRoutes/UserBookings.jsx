import { useState } from "react";
import { Heading, Table, Input } from "rsuite";
import { useNavigate } from "react-router";

const { Column, HeaderCell, Cell } = Table;

const initialBookings = [
  {
    id: 1,
    busName: "Express 101",
    busNumber: "AB-1234",
    date: "2025-01-20",
    time: "10:00 AM",
    contactMasked: "******3210",
    seats: 2,
    status: "Confirmed",
  },
  {
    id: 2,
    busName: "Night Rider",
    busNumber: "XY-5678",
    date: "2025-01-22",
    time: "11:30 PM",
    contactMasked: "******9876",
    seats: 1,
    status: "Pending",
  },
];

const UserBookings = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = initialBookings.filter((b) =>
    `${b.busName} ${b.busNumber}`.toLowerCase().includes(search.toLowerCase())
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

      <Table height={420} data={filtered}>
        <Column width={60} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column width={150} resizable>
          <HeaderCell>Bus Name</HeaderCell>
          <Cell dataKey="busName" />
        </Column>

        <Column width={120}>
          <HeaderCell>Bus Number</HeaderCell>
          <Cell dataKey="busNumber" />
        </Column>

        <Column width={120}>
          <HeaderCell>Date</HeaderCell>
          <Cell dataKey="date" />
        </Column>

        <Column width={100}>
          <HeaderCell>Time</HeaderCell>
          <Cell dataKey="time" />
        </Column>

        <Column width={150}>
          <HeaderCell>Contact</HeaderCell>
          <Cell dataKey="contactMasked" />
        </Column>

        <Column width={80}>
          <HeaderCell>Seats</HeaderCell>
          <Cell dataKey="seats" />
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
