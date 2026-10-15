import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Services from "./pages/Services";
import Appointments from "./pages/Appointments";
import { BrowserRouter, Link, Route, Routes } from "react-router";
import Login from "./pages/Login";
import "./App.css";

function AppRoutes() {
  return (
    <BrowserRouter>
      {/* BrowserRouter enables browser-based routing. */}
      <nav>
        {/* Links let users navigate without a full-page reload. */}
        <Link to="/">Dashboard</Link>{" | "}
        <Link to="/customers">Customers</Link>{" | "}
        <Link to="/services">Services</Link>{" | "}
        <Link to="/appointments">Appointments</Link> {" | "}
        <Link to="/login">Login</Link>
      </nav>

      {/* Routes maps each URL path to the component that should render. */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/services" element={<Services />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;