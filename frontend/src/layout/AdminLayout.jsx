import { Outlet } from "react-router";
import AdminHeader from "../components/AdminHeader";

const AdminLayout = () => {
  return (
    <>
      <AdminHeader />
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
