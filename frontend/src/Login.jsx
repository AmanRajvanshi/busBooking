// src/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button, Form, Input, InputGroup, Panel } from "rsuite";
import { notify } from "./components/Notification";
import EyeCloseIcon from "@rsuite/icons/EyeClose";
import VisibleIcon from "@rsuite/icons/Visible";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [formValue, setFormValue] = useState({
    identifier: "", // email or phone
    password: "",
  });
  const [visible, setVisible] = useState(false);
  const handleChange = () => setVisible(!visible);

  const handleLogin = async () => {
    if (!formValue.identifier || !formValue.password) {
      notify("error", "Please enter email/phone and password");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formValue.identifier, // 👈 email or phone
          password: formValue.password,
          role: role, // tells backend if trying admin or user
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        notify("error", data.message || "Login failed");
        return;
      }

      // Store login details
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      notify(
        "success",
        data.message || `${data.user.role.toUpperCase()} login successful!`
      );

      // Redirect based on returned role (trust backend)
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      console.error(err);
      notify("error", "Server error. Try again later.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <Panel
        bordered
        shaded
        style={{
          width: 500,
          padding: 25,
          borderRadius: 12,
          background: "white",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 25,
            fontWeight: 600,
          }}
        >
          Bus-Booking Login
        </h2>

        {/* Role toggle */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 20,
            justifyContent: "center",
          }}
        >
          <Button
            appearance={role === "user" ? "primary" : "ghost"}
            onClick={() => setRole("user")}
            style={{ width: "45%" }}
          >
            User
          </Button>

          <Button
            appearance={role === "admin" ? "primary" : "ghost"}
            onClick={() => setRole("admin")}
            style={{ width: "45%" }}
          >
            Admin
          </Button>
        </div>

        {/* Login form */}
        <Form fluid formValue={formValue} onChange={setFormValue}>
          <Form.Group>
            <Form.ControlLabel>Email or Phone</Form.ControlLabel>
            <Form.Control
              name="identifier"
              accepter={Input}
              type="text" // not email, because it can be phone also
            />
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>Password</Form.ControlLabel>

            <InputGroup inside>
              <Form.Control
                name="password"
                accepter={Input}
                type={visible ? "text" : "password"}
              />
              <InputGroup.Button onClick={handleChange}>
                {visible ? <VisibleIcon /> : <EyeCloseIcon />}
              </InputGroup.Button>
            </InputGroup>
          </Form.Group>

          <Button
            appearance="primary"
            block
            onClick={handleLogin}
            style={{ marginTop: 15 }}
          >
            {role === "admin" ? "Login as Admin" : "Login as User"}
          </Button>
        </Form>
      </Panel>
    </div>
  );
};

export default Login;
