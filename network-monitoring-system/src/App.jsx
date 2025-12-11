import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "./css/ipmanagement.css";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ComplaintForm from "./pages/ComplaintForm";
import UserDashBoard from "./pages/UserDashBoard";
import ComplaintDashboard from "./pages/ComplaintDashboard";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Unauthorized from "./pages/Unauthorized";
import IPCollectionForm from "./pages/IPCollectionForm";
import IPAddressList from "./pages/IPAddressList";
import IpAssignedList from "./pages/IpAssignedList";
import NetworkMap from "./pages/NetworkMap";
import IPStatusLog from "./pages/IPStatusLog";
import AddIPAddress from "./pages/AddIPAddress";
import UpNdownTracking from "./pages/UpNdownTracking";
import AdminDashboard from "./pages/AdminDashboard";
import DNStoIP from "./pages/DNStoIP";
import ManageNetwork from "./pages/ManageNetwork";
import ManageUsers from "./pages/ManageUsers";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Notifications from "./pages/Notifications";
import UserProfile from "./pages/UserProfile";
import UsersSettings from "./pages/UsersSettings";
import PingTesting from "./pages/PingIPTool";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="complaint-form" element={<ComplaintForm />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/dnstoip" element={<DNStoIP />} />
           <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          {/* common routes for both Admin and User  */}
          <Route element={<ProtectedRoutes allowedRoles={["admin", "user"]} />}>
            <Route path="/userDashboard" element={<UserDashBoard />} />
            <Route
              path="/user-ip-collection-form"
              element={<IPCollectionForm />}
            />
              <Route path="/notifications" element={<Notifications/>} />
            {/* <Route path="/complaint" element={<ComplaintForm />} /> */}
            <Route path="/user-profile" element={<UserProfile/>} />
            <Route path="/user-settings" element={<UsersSettings/>} />
            <Route path="/ping-testing" element={<PingTesting/>} />
          </Route>

          {/* Admin-Only Routes */}
          <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
            <Route
              path="/complaintDashboard"
              element={<ComplaintDashboard />}
            />
             
            <Route path="/user-ip-details" element={<IPAddressList />} />
            {/* <Route
              path="/ip/add"
              element={<IPCollectionForm isEdit={false} />}
            /> */}
            <Route path="manage-network" element={<ManageNetwork/>} />
            <Route
              path="/ip/edit/:id"
              element={<IPCollectionForm isEdit={true} />}
            />

            <Route
              path="/manage-network/edit/:id"
              element={<AddIPAddress isEdit={true} />}
            />

            <Route path="assigned-ips" element={<IpAssignedList />} />
            <Route path="/network-map" element={<NetworkMap />} />
            <Route path="/status-log" element={<IPStatusLog />} />
            <Route path="/add-ip-to-network" element={<AddIPAddress />} />
            <Route path="/up-down-tracking" element={<UpNdownTracking />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/manage-users" element={<ManageUsers/>} />
            {/* <Route path="/notifications/:type" element={<Notifications/>} /> */}
          </Route>

          {/* Default Route  */}
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
