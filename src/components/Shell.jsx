import { NavLink, useLocation } from "react-router";
import { useUser } from "../context/UserContext";

export function Shell({ children }) {
  const { user, logout } = useUser();
  const location = useLocation();
  const titles = {
    "/": ["Overview", "Here’s what’s happening at your salon today."],
    "/customers": ["Users", "View all accounts returned by the user API."],
    "/services": ["Services", "Manage your menu, prices and service duration."],
    "/appointments": [
      "Appointments",
      "Plan visits and keep every booking on track.",
    ],
    "/staff": ["Team", "Manage stylists and their availability."],
    "/payments": ["Payments", "Review payment status and payment methods."],
    "/reports": ["Reports", "Track collected revenue and payment activity."],
    "/team-access": [
      "Team access",
      "Manage account roles and reset staff passwords.",
    ],
  };
  const current = titles[location.pathname] || [
    "Salon workspace",
    "Manage your salon",
  ];
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">G</div>
          <div>
            <strong>glow.</strong>
            <small>SALON STUDIO</small>
          </div>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav">
          <NavLink end to="/">
            <span>◫</span> Overview
          </NavLink>
          <NavLink to="/appointments">
            <span>▦</span> Appointments
          </NavLink>
          <NavLink to="/customers">
            <span>♙</span> Users
          </NavLink>
          <NavLink to="/services">
            <span>✧</span> Services
          </NavLink>
          {user?.role === "admin" && (
            <NavLink to="/staff">
              <span>♧</span> Team
            </NavLink>
          )}
          <div className="workspace-label nav-spacer">BUSINESS</div>
          <NavLink to="/payments">
            <span>◈</span> Payments
          </NavLink>
          <NavLink to="/reports">
            <span>▥</span> Reports
          </NavLink>
          {user?.role === "admin" && (
            <NavLink to="/team-access">
              <span>⚙</span> Team access
            </NavLink>
          )}
        </nav>
        <div className="sidebar-bottom">
          <div className="online-dot" /> API connection ready{" "}
          <small>Salon management</small>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div className="mobile-brand">✧ glow.</div>
          <div className="breadcrumb">
            Workspace <span>/</span> <b>{current[0]}</b>
          </div>
          <div className="top-actions">
            <span className="today-label">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </span>
            <div className="avatar">
              {(user?.name || "A").slice(0, 1).toUpperCase()}
            </div>
            <div className="user-info">
              <strong>{user?.name || "Salon admin"}</strong>
              <small>{user?.role || "staff"}</small>
            </div>
            <button className="logout-btn" onClick={logout}>
              Log out ↗
            </button>
          </div>
        </header>
        <section className="page-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">GLOW SALON / MANAGEMENT</p>
              <h1>{current[0]}</h1>
              <p>{current[1]}</p>
            </div>
            {location.pathname !== "/team-access" &&
              location.pathname !== "/reports" &&
              location.pathname !== "/payments" && (
                <span className="date-chip">✦ &nbsp; Your salon, in sync</span>
              )}
          </div>
          {children}
        </section>
      </main>
    </div>
  );
}
