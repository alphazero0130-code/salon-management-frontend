import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router";
import "./App.css";
import { Protected } from "./components/Protected";
import { Appointments } from "./pages/Appointments";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Payments } from "./pages/Payments";
import { Reports } from "./pages/Reports";
import { ResourcePage } from "./pages/ResourcePage";
import { TeamAccess } from "./pages/TeamAccess";

function AppRoutesInner() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <Protected admin>
            <Dashboard />
          </Protected>
        }
      />
      <Route
        path="/customers"
        element={
          <Protected>
            <ResourcePage kind="customers" />
          </Protected>
        }
      />
      <Route
        path="/services"
        element={
          <Protected>
            <ResourcePage kind="services" />
          </Protected>
        }
      />
      <Route
        path="/appointments"
        element={
          <Protected>
            <Appointments />
          </Protected>
        }
      />
      <Route
        path="/staff"
        element={
          <Protected admin>
            <ResourcePage kind="staff" />
          </Protected>
        }
      />
      <Route
        path="/payments"
        element={
          <Protected admin>
            <Payments />
          </Protected>
        }
      />
      <Route
        path="/reports"
        element={
          <Protected admin>
            <Reports />
          </Protected>
        }
      />
      <Route
        path="/team-access"
        element={
          <Protected admin>
            <TeamAccess />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppRoutesInner />
    </BrowserRouter>
  );
}
