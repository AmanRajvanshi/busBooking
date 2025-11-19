import { useState } from "react";
import { Heading, Table, Button, Modal, Form, Input, DatePicker } from "rsuite";

const { Column, HeaderCell, Cell } = Table;

const initialUsers = [
  {
    id: 1,
    name: "Amanraj Vanshi",
    email: "amanraj@gmail.com",
    contact: "9876543210",
    joiningDate: "2024-01-10",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@gmail.com",
    contact: "9988776655",
    joiningDate: "2024-03-22",
  },
];

const emptyUser = {
  name: "",
  email: "",
  contact: "",
  joiningDate: null,
};

const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [open, setOpen] = useState(false);
  const [formValue, setFormValue] = useState(emptyUser);

  const handleAddOpen = () => {
    setFormValue(emptyUser);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    if (!formValue.name || !formValue.email) {
      alert("Please enter name and email");
      return;
    }

    const newId =
      users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

    setUsers((prev) => [
      ...prev,
      {
        id: newId,
        name: formValue.name,
        email: formValue.email,
        contact: formValue.contact,
        joiningDate: formValue.joiningDate
          ? formValue.joiningDate.toISOString().slice(0, 10)
          : "",
      },
    ]);

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
        <Heading level={2}>Users</Heading>
        <Button appearance="primary" onClick={handleAddOpen}>
          Add User
        </Button>
      </div>

      {/* Table */}
      <Table height={420} data={users}>
        <Column width={60} align="center" resizable>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column width={250} resizable>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column>

        <Column width={160} resizable>
          <HeaderCell>Contact</HeaderCell>
          <Cell dataKey="contact" />
        </Column>

        <Column width={160} resizable>
          <HeaderCell>Joining Date</HeaderCell>
          <Cell>
            {(rowData) =>
              rowData.joiningDate
                ? new Date(rowData.joiningDate).toLocaleDateString()
                : "-"
            }
          </Cell>
        </Column>
      </Table>

      {/* Add User Modal */}
      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid formValue={formValue} onChange={setFormValue}>
            <Form.Group controlId="name">
              <Form.ControlLabel>Name</Form.ControlLabel>
              <Form.Control name="name" accepter={Input} />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.ControlLabel>Email</Form.ControlLabel>
              <Form.Control name="email" accepter={Input} type="email" />
            </Form.Group>

            <Form.Group controlId="contact">
              <Form.ControlLabel>Contact</Form.ControlLabel>
              <Form.Control name="contact" accepter={Input} />
            </Form.Group>

            <Form.Group controlId="joiningDate">
              <Form.ControlLabel>Joining Date</Form.ControlLabel>
              <Form.Control
                name="joiningDate"
                accepter={DatePicker}
                oneTap
                style={{ width: "100%" }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} appearance="primary">
            Add
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Users;
