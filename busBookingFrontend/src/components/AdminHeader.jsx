import { NavLink, Link, useLocation, useNavigate } from "react-router";
import { Nav, Navbar } from "rsuite";
import { notify } from "./Notification";

const AdminHeader = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth info
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    notify("success", "Logged out successfully");
    navigate("/login");
  };

  return (
    <Navbar>
      <Navbar.Brand
        as={Link}
        to="/admin"
        style={{ borderRight: "1px solid black" }}
      >
        BusBooking.com
      </Navbar.Brand>

      <Nav activeKey={pathname}>
        <Nav.Item as={NavLink} to="/admin" end eventKey="/admin">
          Dashboard
        </Nav.Item>

        <Nav.Item as={NavLink} to="/admin/busses" eventKey="/admin/busses">
          Buses
        </Nav.Item>

        <Nav.Item as={NavLink} to="/admin/bookings" eventKey="/admin/bookings">
          Bookings
        </Nav.Item>

        <Nav.Item as={NavLink} to="/admin/users" eventKey="/admin/users">
          Users
        </Nav.Item>
      </Nav>

      <Nav pullRight>
        <Nav.Menu title="Hello, Admin">
          <Nav.Item onClick={handleLogout}>Logout</Nav.Item>
        </Nav.Menu>
      </Nav>
    </Navbar>
  );
};

export default AdminHeader;
