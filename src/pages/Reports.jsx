/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { reportsApi } from "../../services/salonApi";
import { PAGE_SIZE } from "../../services/apiConfig";
import { getList, money } from "../utils";
import { PageState } from "../components/PageState";
import { Pagination } from "../components/Pagination";

export function Reports() {
  const [report, setReport] = useState(null),
    [appointmentRevenue, setAppointmentRevenue] = useState(null),
    [byService, setByService] = useState([]),
    [servicePage, setServicePage] = useState(1),
    [servicePagination, setServicePagination] = useState(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  async function load() {
    setLoading(true);
    setError("");

    let revenueFailed = false;
    let appointmentRevenueFailed = false;
    let serviceReportFailed = false;

    try {
      const revenueResponse = await reportsApi.getRevenue();
      setReport(revenueResponse.report || revenueResponse);
    } catch {
      revenueFailed = true;
      setReport({ totalRevenue: 0, totalPayment: 0 });
    }

    try {
      const appointmentRevenueResponse =
        await reportsApi.getAppointmentRevenue();
      setAppointmentRevenue(appointmentRevenueResponse);
    } catch {
      appointmentRevenueFailed = true;
      setAppointmentRevenue({ totalRevenue: 0, completedAppointments: 0 });
    }

    try {
      const { data: serviceReportResponse, pagination: pageInfo } =
        await reportsApi.listServiceRevenue({
          page: servicePage,
          limit: PAGE_SIZE,
        });
      setByService(getList(serviceReportResponse, "report"));
      setServicePagination(pageInfo);
      if (pageInfo && servicePage > Math.max(pageInfo.totalPages, 1)) {
        setServicePage(Math.max(pageInfo.totalPages, 1));
      }
    } catch {
      serviceReportFailed = true;
      setByService([]);
    }

    if (revenueFailed && appointmentRevenueFailed && serviceReportFailed) {
      setError(
        "Reports are unavailable. Check that the backend is running and you have admin access.",
      );
    }
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, [servicePage]);
  return (
    <>
      {error && <PageState error={error} onRetry={load} />}
      {loading ? (
        <PageState loading />
      ) : (
        <>
          <div className="stats-grid report-stats">
            <div className="stat-card">
              <div className="stat-top">
                <span>Collected revenue</span>
                <span className="stat-icon pink">₹</span>
              </div>
              <strong>{money(report?.totalRevenue)}</strong>
              <small>From paid payment records</small>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <span>Successful payments</span>
                <span className="stat-icon purple">◈</span>
              </div>
              <strong>{report?.totalPayment ?? 0}</strong>
              <small>All-time paid transactions</small>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <span>Booked appointment value</span>
                <span className="stat-icon peach">↗</span>
              </div>
              <strong>{money(appointmentRevenue?.totalRevenue)}</strong>
              <small>Value of booked appointments</small>
            </div>
          </div>
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h3>Revenue overview</h3>
                <p>
                  Use Payments to update payment status and reflect collections
                  here.
                </p>
              </div>
              <button className="btn btn-light" onClick={load}>
                ↻ Refresh
              </button>
            </div>
            <div className="report-note">
              <span>✦</span>
              <div>
                <strong>Keep your numbers meaningful</strong>
                <p>
                  The revenue report counts payments marked as paid. Appointment
                  revenue is a separate booking-value metric from your backend.
                </p>
              </div>
            </div>
            {byService.length > 0 && (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>SERVICE ID</th>
                      <th>COMPLETED APPOINTMENTS</th>
                      <th>REVENUE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byService.map((x) => (
                      <tr key={x._id}>
                        <td>{String(x._id || "").slice(-10)}</td>
                        <td>{x.totalAppointments}</td>
                        <td>{money(x.totalRevenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {servicePagination && (
              <Pagination
                pagination={servicePagination}
                onPageChange={setServicePage}
              />
            )}
          </section>
        </>
      )}
    </>
  );
}
