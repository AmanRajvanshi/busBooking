import { NavLink, Link, useLocation, useNavigate } from "react-router";
import { Nav, Navbar } from "rsuite";
import { notify } from "./Notification";

const UserHeader = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
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
        to="/user"
        style={{ borderRight: "1px solid black", paddingRight: 10 }}
      >
        BusBooking.com
      </Navbar.Brand>

      <Nav activeKey={pathname}>
        <Nav.Item as={NavLink} to="/user" end eventKey="/user">
          Dashboard
        </Nav.Item>

        <Nav.Item as={NavLink} to="/user/bookings" eventKey="/user/bookings">
          My Bookings
        </Nav.Item>

        <Nav.Item as={NavLink} to="/user/profile" eventKey="/user/profile">
          Profile
        </Nav.Item>
      </Nav>

      <Nav pullRight>
        <Nav.Menu title="Hello, User">
          <Nav.Item onClick={handleLogout}>Logout</Nav.Item>
        </Nav.Menu>
      </Nav>
    </Navbar>
  );
};

export default UserHeader;
