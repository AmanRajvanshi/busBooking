import { Outlet } from "react-router";
import UserHeader from "../components/UserHeader";

const UserLayout = () => {
  return (
    <>
      <UserHeader />
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </>
  );
};

export default UserLayout;
