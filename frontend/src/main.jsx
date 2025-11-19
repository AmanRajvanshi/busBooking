// main.jsx
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { CustomProvider } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import Login from "./Login.jsx";
import Bookings from "./adminRoutes/Bookings.jsx";
import Busses from "./adminRoutes/Busses.jsx";
import Dashboard from "./adminRoutes/Dashboard.jsx";
import Users from "./adminRoutes/Users.jsx";
import Notification from "./components/Notification.jsx";
import "./index.css";
import AdminLayout from "./layout/AdminLayout.jsx";
import UserLayout from "./layout/UserLayout.jsx";
import UserBookings from "./userRoutes/UserBookings.jsx";
import UserDashboard from "./userRoutes/UserDashboard.jsx";
import UserProfile from "./userRoutes/UserProfile.jsx";

ReactDOM.createRoot(document.getElementById("app")).render(
  <BrowserRouter>
    <CustomProvider>
      {/* Mount toaster provider ONCE */}
      <Notification />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<AdminLayout />} path="admin">
          <Route index element={<Dashboard />} />
          <Route path="busses" element={<Busses />} />
          <Route path="users" element={<Users />} />
          <Route path="bookings" element={<Bookings />} />
        </Route>

        <Route element={<UserLayout />} path="user">
          <Route index element={<UserDashboard />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="bookings" element={<UserBookings />} />
        </Route>

        <Route path="/login" element={<Login />} />
      </Routes>
    </CustomProvider>
  </BrowserRouter>
);
