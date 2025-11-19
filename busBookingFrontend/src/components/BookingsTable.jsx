import { Table } from "rsuite";

const { Column, HeaderCell, Cell } = Table;
const data = [
  {
    id: 1,
    firstName: "Amanraj",
    lastName: "Vanshi",
    city: "New York",
    email: "Amanraj@gmail.com",
  },
  {
    id: 2,
    firstName: "John",
    lastName: "Doe",
    city: "Los Angeles",
    email: "John@gmail.com",
  },
  {
    id: 3,
    firstName: "Jane",
    lastName: "Smith",
    city: "Chicago",
    email: "Jane@gmail.com",
  },
];

const BookingsTable = () => {
  return (
    <Table height={420} data={data}>
      <Column width={50} align="center" resizable>
        <HeaderCell>Id</HeaderCell>
        <Cell dataKey="id" />
      </Column>

      <Column width={100} resizable>
        <HeaderCell>First Name</HeaderCell>
        <Cell dataKey="firstName" />
      </Column>

      <Column width={100} resizable>
        <HeaderCell>Last Name</HeaderCell>
        <Cell dataKey="lastName" />
      </Column>

      <Column width={200} resizable>
        <HeaderCell>City</HeaderCell>
        <Cell dataKey="city" />
      </Column>

      <Column width={200} resizable>
        <HeaderCell>Email</HeaderCell>
        <Cell dataKey="email" />
      </Column>
    </Table>
  );
};

export default BookingsTable;
