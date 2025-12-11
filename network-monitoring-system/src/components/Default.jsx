import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./icons";
import SignUp from './pages/SignUp';
import Login from "./pages/Login";
import ComplaintForm from "./pages/ComplaintForm";
import ComplaintDashboard from './pages/ComplaintDashboard';
import UserDashBoard from "./pages/UserDashBoard";
import Unauthorized from "./pages/Unauthorized";  // Ensure this is the correct path
import ProtectedRoutes from "./components/ProtectedRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes  */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} /> {/* Corrected unauthorized path */}

        {/* Protected routes  */}
        <Route element={<ProtectedRoutes allowedRoles={["user", "admin"]} />}>
          <Route path="/complaint" element={<ComplaintForm />} />
          <Route path="/complaintDashboard" element={<ComplaintDashboard />} />
          <Route path="/userDashboard" element={<UserDashBoard />} />
        </Route>

        {/* Default route */}
        <Route path="/" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
