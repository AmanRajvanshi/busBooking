import { useState } from "react";
import { Heading, Panel, Input, Button, Divider } from "rsuite";
import { useNavigate } from "react-router";

const UserDashboard = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    // for now just go to book page with query (you can store in state / context later)
    navigate("/user/book");
  };

  return (
    <>
      <Heading level={2} style={{ marginBottom: 16 }}>
        User Dashboard
      </Heading>

      {/* Search buses */}
      <Panel bordered shaded style={{ marginBottom: 16 }}>
        <h4>Search Buses</h4>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <Input
            placeholder="Search by route, city, bus name..."
            value={search}
            onChange={setSearch}
          />
          <Button appearance="primary" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </Panel>

      {/* User details summary */}
      <Panel bordered style={{ marginBottom: 16 }}>
        <h4>Your Details</h4>
        <p>
          <strong>Name:</strong> John Doe
        </p>
        <p>
          <strong>Email:</strong> john@example.com
        </p>
        <p>
          <strong>Contact:</strong> +91-98765-43210
        </p>
        <Button appearance="link" onClick={() => navigate("/user/profile")}>
          Edit Details
        </Button>
      </Panel>

      <Divider />

      {/* Quick actions */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Panel bordered style={{ flex: "1 1 200px" }}>
          <h5>Book a Bus</h5>
          <p>Find and book buses for your journey.</p>
          <Button
            appearance="primary"
            size="sm"
            onClick={() => navigate("/user/book")}
          >
            Book Now
          </Button>
        </Panel>

        <Panel bordered style={{ flex: "1 1 200px" }}>
          <h5>View Bookings</h5>
          <p>See all your current and past bookings.</p>
          <Button size="sm" onClick={() => navigate("/user/bookings")}>
            View Bookings
          </Button>
        </Panel>
      </div>
    </>
  );
};

export default UserDashboard;
