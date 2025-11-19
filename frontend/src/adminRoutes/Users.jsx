import { useEffect, useState } from "react";
import { Heading, Table } from "rsuite";

const { Column, HeaderCell, Cell } = Table;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 👉 Call your API: GET /api/users (with auth & isAdmin on backend)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:4000/api/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Failed to load users:", data);
          return;
        }

        // Map API shape → UI shape
        const mapped = data.map((u) => ({
          id: u.id,
          name: u.name || "",
          email: u.email || "",
          contact: u.phone || "",
          joiningDate: u.created_at || null,
        }));

        setUsers(mapped);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
      </div>

      {/* Table */}
      <Table height={420} data={users} loading={loading}>
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
    </>
  );
};

export default Users;
