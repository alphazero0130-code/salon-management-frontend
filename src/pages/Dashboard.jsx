/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { dashboardApi } from "../../services/salonApi";
import { PAGE_SIZE } from "../../services/apiConfig";
import { getList, money } from "../utils";
import { AppointmentTable } from "../components/AppointmentTable";
import { PageState } from "../components/PageState";

export function Dashboard() {
  const [stats, setStats] = useState(null),
    [appointments, setAppointments] = useState([]),
    [services, setServices] = useState([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    setError("");
    try {
      const statsResponse = await dashboardApi.getStats();
      const { data: appointmentsResponse } =
        await dashboardApi.listAppointments({ page: 1, limit: PAGE_SIZE });
      const { data: servicesResponse } = await dashboardApi.listServices({
        page: 1,
        limit: PAGE_SIZE,
      });

      setStats(statsResponse);
      setAppointments(getList(appointmentsResponse, "appointments").slice(0, 5));
      setServices(getList(servicesResponse, "services"));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  const cards = [
    {
      label: "Revenue today",
      value: money(stats?.todayRevenue),
      icon: "₹",
      tone: "pink",
      foot: "Payments collected",
    },
    {
      label: "Appointments today",
      value: stats?.todayAppointments ?? "—",
      icon: "▦",
      tone: "purple",
      foot: `${stats?.pendingAppointments ?? 0} awaiting confirmation`,
    },
    {
      label: "Customers",
      value: stats?.totalCustomers ?? "—",
      icon: "♙",
      tone: "peach",
      foot: "Customer accounts",
    },
    {
      label: "Salon team",
      value: stats?.totalStaff ?? "—",
      icon: "♧",
      tone: "green",
      foot: "Active team members",
    },
  ];
  return (
    <>
      {error && (
        <div className="notice error">
          {error}{" "}
          <button className="text-btn" onClick={load}>
            Retry
          </button>
        </div>
      )}
      <div className="welcome-banner">
        <div className="banner-copy">
          <span className="banner-tag">SALON OPERATIONS / TODAY</span>
          <h2>Your salon, at a glance.</h2>
          <p>Keep today’s appointments, services and team running smoothly.</p>
          <NavLink className="banner-action" to="/appointments">
            Open appointment book <span aria-hidden="true">→</span>
          </NavLink>
        </div>
        <img className="banner-art" src="/salon-station.svg" alt="" />
      </div>
      {loading ? (
        <PageState loading />
      ) : (
        <>
          <div className="stats-grid">
            {cards.map((card) => (
              <div className="stat-card" key={card.label}>
                <div className="stat-top">
                  <span>{card.label}</span>
                  <span className={`stat-icon ${card.tone}`}>{card.icon}</span>
                </div>
                <strong>{card.value}</strong>
                <small>{card.foot}</small>
              </div>
            ))}
          </div>
          <div className="dashboard-grid">
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Appointment book</h3>
                  <p>Recent client visits and booking status</p>
                </div>
                <NavLink className="inline-link" to="/appointments">
                  Manage schedule →
                </NavLink>
              </div>
              <AppointmentTable appointments={appointments} />
            </section>
            <section className="panel service-summary">
              <div className="panel-heading">
                <div>
                  <h3>Salon services</h3>
                  <p>Treatments, timings and prices</p>
                </div>
                <NavLink className="inline-link" to="/services">
                  Edit menu →
                </NavLink>
              </div>
              {services.map((service, index) => (
                <div className="service-mini" key={service._id}>
                  <div className={`service-mini-icon icon-${index % 4}`}>
                    {["✂", "◷", "◇", "✦"][index % 4]}
                  </div>
                  <div className="grow">
                    <strong>{service.name}</strong>
                    <small>{service.duration} min</small>
                  </div>
                  <b>{money(service.price)}</b>
                </div>
              ))}
              {!services.length && (
                <p className="empty-inline">
                  No services yet. Add your first salon service.
                </p>
              )}
            </section>
          </div>
        </>
      )}
    </>
  );
}
