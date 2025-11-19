import { useEffect, useState } from "react";
import { Heading, Panel, Form, Input, Button } from "rsuite";
import { notify } from "../components/Notification";

const UserProfile = () => {
  const [formValue, setFormValue] = useState({
    name: "",
    email: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // TODO: replace with however you store your token
  const token = localStorage.getItem("token");

  // Load current user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:4000/api/users/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await res.json();
        setFormValue({
          name: data.name || "",
          email: data.email || "",
          contact: data.phone || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch("http://localhost:4000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formValue.name,
          phone: formValue.contact,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await res.json();

      // Sync with server response
      setFormValue({
        name: data.name || "",
        email: data.email || "",
        contact: data.phone || "",
      });

      notify("success", data.message || "Profile updated successfully");
    } catch (err) {
      console.error(err);
      notify("error", err.message || "Error updating profile");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <>
      <Heading level={2} style={{ marginBottom: 16 }}>
        My Details
      </Heading>

      <Panel bordered shaded>
        <Form
          fluid
          formValue={formValue}
          onChange={setFormValue}
          disabled={loading || saving}
        >
          <Form.Group controlId="name">
            <Form.ControlLabel>Name</Form.ControlLabel>
            <Form.Control name="name" accepter={Input} />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.ControlLabel>Email</Form.ControlLabel>
            <Form.Control
              name="email"
              accepter={Input}
              type="email"
              disabled // email not updated by PUT /me
            />
          </Form.Group>

          <Form.Group controlId="contact">
            <Form.ControlLabel>Contact</Form.ControlLabel>
            <Form.Control name="contact" accepter={Input} />
          </Form.Group>

          <Button appearance="primary" onClick={handleSave} loading={saving}>
            Save Changes
          </Button>
        </Form>
      </Panel>
    </>
  );
};

export default UserProfile;
