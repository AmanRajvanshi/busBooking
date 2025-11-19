import { useState } from "react";
import {
  Button,
  Heading,
  Modal,
  Table,
  Form,
  Input,
  InputNumber,
} from "rsuite";

const { Column, HeaderCell, Cell } = Table;

const initialBuses = [
  {
    id: 1,
    busName: "Express 101",
    busNumber: "BUS-5678", // ← added
    fare: 500,
    seats: 40,
    arrivalTime: "10:00 AM",
    departureTime: "06:00 AM",
    fromLocation: "City A",
    toLocation: "City B",
  },
  {
    id: 2,
    busName: "Night Rider",
    busNumber: "BUS-1123", // ← added
    fare: 750,
    seats: 32,
    arrivalTime: "05:00 AM",
    departureTime: "11:00 PM",
    fromLocation: "City B",
    toLocation: "City C",
  },
];

const emptyBus = {
  busName: "",
  busNumber: "", // ← added
  fare: null,
  seats: null,
  arrivalTime: "",
  departureTime: "",
  fromLocation: "",
  toLocation: "",
};

const Busses = () => {
  const [buses, setBuses] = useState(initialBuses);
  const [open, setOpen] = useState(false);
  const [formValue, setFormValue] = useState(emptyBus);
  const [editingId, setEditingId] = useState(null); // null = adding, number = editing

  const handleAddOpen = () => {
    setEditingId(null);
    setFormValue(emptyBus);
    setOpen(true);
  };

  const handleEditOpen = (rowData) => {
    setEditingId(rowData.id);
    setFormValue({
      busName: rowData.busName,
      busNumber: rowData.busNumber, // ← added
      fare: rowData.fare,
      seats: rowData.seats,
      arrivalTime: rowData.arrivalTime,
      departureTime: rowData.departureTime,
      fromLocation: rowData.fromLocation,
      toLocation: rowData.toLocation,
    });

    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleDelete = (id) => {
    setBuses((prev) => prev.filter((bus) => bus.id !== id));
  };

  const handleSubmit = () => {
    if (!formValue.busName) {
      // you can add more proper validation if needed
      alert("Please enter Bus Name");
      return;
    }

    if (editingId === null) {
      // Add new bus
      const newId =
        buses.length > 0 ? Math.max(...buses.map((b) => b.id)) + 1 : 1;
      setBuses((prev) => [...prev, { id: newId, ...formValue }]);
    } else {
      // Edit existing bus
      setBuses((prev) =>
        prev.map((bus) =>
          bus.id === editingId ? { ...bus, ...formValue } : bus
        )
      );
    }

    setOpen(false);
  };

  return (
    <>
      {/* Header + Add button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Heading level={2}>Buses</Heading>
        <Button appearance="primary" onClick={handleAddOpen}>
          Add Bus
        </Button>
      </div>

      {/* Table */}
      <Table height={420} data={buses}>
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

        <Column width={100} resizable>
          <HeaderCell>Fare</HeaderCell>
          <Cell>{(rowData) => `₹${rowData.fare}`}</Cell>
        </Column>

        <Column width={120} resizable>
          <HeaderCell>No. of Seats</HeaderCell>
          <Cell dataKey="seats" />
        </Column>

        <Column width={140} resizable>
          <HeaderCell>Arrival Time</HeaderCell>
          <Cell dataKey="arrivalTime" />
        </Column>

        <Column width={150} resizable>
          <HeaderCell>Departure Time</HeaderCell>
          <Cell dataKey="departureTime" />
        </Column>

        <Column width={180} resizable>
          <HeaderCell>From Location</HeaderCell>
          <Cell dataKey="fromLocation" />
        </Column>

        <Column width={180} resizable>
          <HeaderCell>To Location</HeaderCell>
          <Cell dataKey="toLocation" />
        </Column>

        <Column width={140} fixed="right">
          <HeaderCell>Actions</HeaderCell>
          <Cell>
            {(rowData) => (
              <>
                <Button
                  size="xs"
                  appearance="link"
                  onClick={() => handleEditOpen(rowData)}
                >
                  Edit
                </Button>
                <Button
                  size="xs"
                  appearance="link"
                  onClick={() => handleDelete(rowData.id)}
                >
                  Delete
                </Button>
              </>
            )}
          </Cell>
        </Column>
      </Table>

      {/* Add / Edit Modal */}
      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>
            {editingId === null ? "Add Bus" : "Edit Bus"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid formValue={formValue} onChange={setFormValue}>
            <Form.Group controlId="busName">
              <Form.ControlLabel>Bus Name</Form.ControlLabel>
              <Form.Control name="busName" accepter={Input} />
            </Form.Group>

            <Form.Group controlId="busNumber">
              <Form.ControlLabel>Bus Number</Form.ControlLabel>
              <Form.Control name="busNumber" accepter={Input} />
            </Form.Group>

            <Form.Group controlId="fare">
              <Form.ControlLabel>Fare</Form.ControlLabel>
              <Form.Control name="fare" accepter={InputNumber} />
            </Form.Group>

            <Form.Group controlId="seats">
              <Form.ControlLabel>No. of Seats</Form.ControlLabel>
              <Form.Control name="seats" accepter={InputNumber} />
            </Form.Group>

            <Form.Group controlId="arrivalTime">
              <Form.ControlLabel>Arrival Time</Form.ControlLabel>
              <Form.Control name="arrivalTime" accepter={Input} />
            </Form.Group>

            <Form.Group controlId="departureTime">
              <Form.ControlLabel>Departure Time</Form.ControlLabel>
              <Form.Control name="departureTime" accepter={Input} />
            </Form.Group>

            <Form.Group controlId="fromLocation">
              <Form.ControlLabel>From Location</Form.ControlLabel>
              <Form.Control name="fromLocation" accepter={Input} />
            </Form.Group>

            <Form.Group controlId="toLocation">
              <Form.ControlLabel>To Location</Form.ControlLabel>
              <Form.Control name="toLocation" accepter={Input} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} appearance="primary">
            {editingId === null ? "Add" : "Save"}
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Busses;
