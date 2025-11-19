// src/userRoutes/UserDashboard.jsx
import { useEffect, useState } from "react";
import { Heading, Panel, Input, Button, Divider, Loader } from "rsuite";
import { useNavigate } from "react-router";
import { notify } from "../components/Notification";

const UserDashboard = () => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  // ---- 1) Load current user details from backend ----
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // not logged in -> go to login
      navigate("/login");
      return;
    }

    const fetchMe = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            // token invalid / expired
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
            return;
          }
          const data = await res.json().catch(() => ({}));
          notify("error", data.message || "Failed to load user");
          return;
        }

        const data = await res.json();
        setUser(data); // { id, name, email, phone, ... }
      } catch (err) {
        console.error(err);
        notify("error", "Server error while loading user");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchMe();
  }, [navigate]);

  // ---- 2) Search buses using /api/buses/search (partial match LIKE) ----
  const handleSearch = async () => {
    if (!search.trim()) return;

    setSearchLoading(true);
    setSearchResults([]);

    try {
      // using `from` and `to` both with same value for quick search
      const url = `http://localhost:4000/api/buses/search?from=${encodeURIComponent(
        search
      )}&to=${encodeURIComponent(search)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        notify("error", data.message || "Failed to search buses");
        return;
      }

      setSearchResults(data); // list of buses
    } catch (err) {
      console.error(err);
      notify("error", "Server error while searching buses");
    } finally {
      setSearchLoading(false);
    }
  };

  if (loadingUser) {
    return (
      <div style={{ paddingTop: 40, textAlign: "center" }}>
        <Loader size="lg" />
      </div>
    );
  }

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
          <Button
            appearance="primary"
            onClick={handleSearch}
            loading={searchLoading}
          >
            Search
          </Button>
        </div>

        {/* Quick inline search results */}
        {searchResults.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h5>Search Results</h5>
            {searchResults.map((bus) => (
              <div
                key={bus.id}
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                }}
              >
                <span>
                  <strong>{bus.bus_name}</strong> ({bus.bus_number}) –{" "}
                  {bus.from_location} → {bus.to_location}
                </span>
                <span>₹{bus.fare}</span>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {/* User details summary from API */}
      <Panel bordered style={{ marginBottom: 16 }}>
        <h4>Your Details</h4>
        <p>
          <strong>Name:</strong> {user?.name || "-"}
        </p>
        <p>
          <strong>Email:</strong> {user?.email || "-"}
        </p>
        <p>
          <strong>Contact:</strong> {user?.phone || "-"}
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
