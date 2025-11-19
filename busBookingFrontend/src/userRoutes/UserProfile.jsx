import { useState } from "react";
import { Heading, Panel, Form, Input, Button } from "rsuite";
import Notification from "../components/Notification";

const UserProfile = () => {
  const [formValue, setFormValue] = useState({
    name: "John Doe",
    email: "john@example.com",
    contact: "+91-98765-43210",
  });

  const [message, setMessage] = useState("");

  const handleSave = () => {
    // Here you’d call API
    setMessage("Profile updated successfully");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <>
      <Heading level={2} style={{ marginBottom: 16 }}>
        My Details
      </Heading>

      <Panel bordered shaded>
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

          <Button appearance="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Form>
      </Panel>

      <Notification show={!!message} type="success" message={message} />
    </>
  );
};

export default UserProfile;
