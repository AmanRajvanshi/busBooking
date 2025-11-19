import { Heading, Table } from "rsuite";

const { Column, HeaderCell, Cell } = Table;

// Mask contact number but show last 4 digits
const maskContact = (phone) => {
  if (!phone) return "";
  const last4 = phone.slice(-4);
  return `******${last4}`;
};

const data = [
  {
    id: 1,
    busName: "Express 101",
    busNumber: "BUS-5678",
    userName: "Amanraj Vanshi",
    dateTime: "2025-02-12 10:30 AM",
    userContact: "9876543210",
    seats: 2,
  },
  {
    id: 2,
    busName: "City Rider",
    busNumber: "BUS-1123",
    userName: "John Doe",
    dateTime: "2025-02-15 08:00 PM",
    userContact: "9012345678",
    seats: 1,
  },
  {
    id: 3,
    busName: "Night Cruiser",
    busNumber: "BUS-3344",
    userName: "Jane Smith",
    dateTime: "2025-02-20 06:15 AM",
    userContact: "9998887777",
    seats: 3,
  },
];

const Bookings = () => {
  return (
    <>
      <Heading level={2}>Bookings</Heading>

      <Table height={420} data={data}>
        <Column width={60} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column width={150} resizable>
          <HeaderCell>Bus Name</HeaderCell>
          <Cell dataKey="busName" />
        </Column>

        <Column width={120} resizable>
          <HeaderCell>Bus Number</HeaderCell>
          <Cell dataKey="busNumber" />
        </Column>

        <Column width={180} resizable>
          <HeaderCell>User Name</HeaderCell>
          <Cell dataKey="userName" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell>Date & Time</HeaderCell>
          <Cell dataKey="dateTime" />
        </Column>

        <Column width={160} resizable>
          <HeaderCell>User Contact</HeaderCell>
          <Cell>{(rowData) => maskContact(rowData.userContact)}</Cell>
        </Column>

        <Column width={120} resizable>
          <HeaderCell>Seats</HeaderCell>
          <Cell dataKey="seats" />
        </Column>
      </Table>
    </>
  );
};

export default Bookings;
