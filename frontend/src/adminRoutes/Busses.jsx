// src/adminRoutes/Busses.jsx
import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Heading,
  Input,
  InputGroup,
  InputNumber,
  Modal,
  Table,
  TimePicker,
} from "rsuite";
import { notify } from "../components/Notification";

const { Column, HeaderCell, Cell } = Table;

const emptyBus = {
  busName: "",
  busNumber: "",
  fare: null,
  seats: null,
  arrivalTime: "",
  departureTime: "",
  fromLocation: "",
  toLocation: "",
};

const Busses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [formValue, setFormValue] = useState(emptyBus);
  const [editingId, setEditingId] = useState(null); // null = add, id = edit

  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hourStr, minute] = time.split(":");
    let hour = Number(hourStr);

    const ampm = hour >= 12 ? "PM" : "AM";
    if (hour === 0) hour = 12;
    if (hour > 12) hour = hour - 12;

    return `${hour}:${minute} ${ampm}`;
  };

  const loadBuses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:4000/api/buses`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });
      const data = await res.json();
      if (!res.ok) {
        notify("error", data.message || "Failed to load buses");
        return;
      }

      // Map backend fields (snake_case) to frontend camelCase
      const normalized = data.map((b) => ({
        id: b.id,
        busName: b.bus_name,
        busNumber: b.bus_number,
        fare: b.fare,
        seats: b.seats,
        arrivalTime: b.arrival_time,
        departureTime: b.departure_time,
        fromLocation: b.from_location,
        toLocation: b.to_location,
      }));
      setBuses(normalized);
    } catch (err) {
      console.error(err);
      notify("error", "Server error while loading buses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuses();
  }, []);

  const handleAddOpen = () => {
    setEditingId(null);
    setFormValue(emptyBus);
    setOpen(true);
  };

  const handleEditOpen = (rowData) => {
    setEditingId(rowData.id);
    setFormValue({
      busName: rowData.busName,
      busNumber: rowData.busNumber,
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

  const handleSubmit = async () => {
    if (
      !formValue.busName ||
      !formValue.busNumber ||
      !formValue.fare ||
      !formValue.seats ||
      !formValue.arrivalTime ||
      !formValue.departureTime ||
      !formValue.fromLocation ||
      !formValue.toLocation
    ) {
      notify("error", "Please fill all fields");
      return;
    }

    const toTimeString = (date) => {
      if (!date) return "";
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const payload = {
      bus_number: formValue.busNumber,
      bus_name: formValue.busName,
      fare: Number(formValue.fare),
      seats: Number(formValue.seats),
      arrival_time: toTimeString(formValue.arrivalTime),
      departure_time: toTimeString(formValue.departureTime),
      from_location: formValue.fromLocation,
      to_location: formValue.toLocation,
    };

    try {
      const method = editingId === null ? "POST" : "PUT";
      const url =
        editingId === null
          ? `http://localhost:4000/api/buses`
          : `http://localhost:4000/api/buses/${editingId}`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        notify("error", data.message || "Failed to save bus");
        return;
      }

      notify(
        "success",
        `Bus ${editingId === null ? "added" : "updated"} successfully`
      );
      setOpen(false);
      loadBuses();
    } catch (err) {
      console.error(err);
      notify("error", "Server error while saving bus");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bus?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/buses/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });

      const data = await res.json();
      if (!res.ok) {
        notify("error", data.message || "Failed to delete bus");
        return;
      }

      notify("success", "Bus deleted successfully");
      loadBuses();
    } catch (err) {
      console.error(err);
      notify("error", "Server error while deleting bus");
    }
  };

  const handleSearch = async () => {
    if (!searchFrom || !searchTo) {
      notify("error", "Please enter both From and To locations");
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({
        from: searchFrom,
        to: searchTo,
      });

      const res = await fetch(
        `http://localhost:4000/api/buses/search?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        notify("error", data.message || "Failed to search buses");
        return;
      }

      const normalized = data.map((b) => ({
        id: b.id,
        busName: b.bus_name,
        busNumber: b.bus_number,
        fare: b.fare,
        seats: b.seats,
        arrivalTime: b.arrival_time,
        departureTime: b.departure_time,
        fromLocation: b.from_location,
        toLocation: b.to_location,
      }));
      setBuses(normalized);
    } catch (err) {
      console.error(err);
      notify("error", "Server error while searching buses");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = () => {
    setSearchFrom("");
    setSearchTo("");
    loadBuses();
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
      <Table height={420} data={buses} loading={loading}>
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

        <Column width={150} resizable>
          <HeaderCell>Departure Time</HeaderCell>
          <Cell dataKey="departureTime" />
        </Column>

        <Column width={140} resizable>
          <HeaderCell>Arrival Time</HeaderCell>
          <Cell dataKey="arrivalTime" />
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
              <Form.ControlLabel>Fare (Per Seat)</Form.ControlLabel>
              <Form.Control name="fare" accepter={InputNumber} />
            </Form.Group>

            <Form.Group controlId="seats">
              <Form.ControlLabel>No. of Seats</Form.ControlLabel>
              <Form.Control name="seats" accepter={InputNumber} />
            </Form.Group>

            <Form.Group controlId="fromLocation">
              <Form.ControlLabel>From Location</Form.ControlLabel>
              <Form.Control name="fromLocation" accepter={Input} />
            </Form.Group>

            <Form.Group controlId="departureTime">
              <Form.ControlLabel>Departure Time</Form.ControlLabel>
              <Form.Control
                name="departureTime"
                accepter={TimePicker}
                format="hh:mm aa"
                showMeridiem
                style={{ width: "100%" }}
              />
            </Form.Group>

            <Form.Group controlId="toLocation">
              <Form.ControlLabel>To Location</Form.ControlLabel>
              <Form.Control name="toLocation" accepter={Input} />
            </Form.Group>

            <Form.Group controlId="arrivalTime">
              <Form.ControlLabel>Arrival Time</Form.ControlLabel>
              <Form.Control
                name="arrivalTime"
                accepter={TimePicker}
                format="hh:mm aa"
                showMeridiem
                style={{ width: "100%" }}
              />
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
