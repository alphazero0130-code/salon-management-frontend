/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
  appointmentsApi,
  authApi,
  resourcesApi,
} from "../../services/salonApi";
import { PAGE_SIZE } from "../../services/apiConfig";
import { useUser } from "../context/UserContext";
import { getList, money, useToast } from "../utils";
import { AppointmentTable } from "../components/AppointmentTable";
import { Field } from "../components/Field";
import { PageState } from "../components/PageState";
import { Modal } from "../components/Modal";
import { Pagination } from "../components/Pagination";
import { Button } from "../components/ui/Button";
import { SelectField } from "../components/ui/SelectField";
import { Text } from "../components/ui/Text";

export function Appointments() {
  const [rows, setRows] = useState([]),
    [users, setUsers] = useState([]),
    [services, setServices] = useState([]),
    [staff, setStaff] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [status, setStatus] = useState(""),
    [page, setPage] = useState(1),
    [pagination, setPagination] = useState(null),
    [modal, setModal] = useState(false),
    [form, setForm] = useState({
      userId: "",
      serviceId: "",
      staffId: "",
      appointmentDate: "",
      notes: "",
    }),
    [busy, setBusy] = useState(false),
    [toast, notify] = useToast();
  const { user } = useUser(),
    admin = user?.role === "admin";
  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data: appointmentResponse, pagination: pageInfo } =
        await appointmentsApi.list({
          page,
          limit: PAGE_SIZE,
          params: { status: status || undefined },
        });
      const { data: servicesResponse } = await resourcesApi.list("services", {
        page: 1,
        limit: PAGE_SIZE,
      });
      const { data: staffResponse } = admin
        ? await resourcesApi.list("staff", { page: 1, limit: PAGE_SIZE })
        : { data: { staff: [] } };
      const { data: userResponse } = admin
        ? await authApi.listUsers({ page: 1, limit: PAGE_SIZE })
        : { data: { user: [] } };

      setRows(getList(appointmentResponse, "appointments"));
      setPagination(pageInfo);
      if (pageInfo && page > Math.max(pageInfo.totalPages, 1)) {
        setPage(Math.max(pageInfo.totalPages, 1));
      }
      setServices(getList(servicesResponse, "services"));
      setStaff(getList(staffResponse, "staff"));
      setUsers(getList(userResponse, "user"));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [status, page]);
  async function create(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await appointmentsApi.create({
        ...form,
        staffId: form.staffId || undefined,
      });
      setModal(false);
      notify("Appointment created. A pending payment record was also created.");
      load();
    } catch (e) {
      notify(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function changeStatus(id, next) {
    try {
      await appointmentsApi.updateStatus(id, next);
      notify("Appointment status updated.");
      load();
    } catch (e) {
      notify(e.message);
    }
  }
  async function remove(row) {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await appointmentsApi.remove(row._id);
      notify("Appointment deleted.");
      load();
    } catch (e) {
      notify(e.message);
    }
  }
  return (
    <>
      <div className="toolbar">
        <div className="filter-select">
          <Text as="span">Status</Text>
          <SelectField
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All appointments</option>
            <option value="booked">Booked</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </SelectField>
        </div>
        <Text as="span" className="result-count">
          {pagination?.total ?? rows.length} bookings
        </Text>
        {admin && (
          <Button
            onClick={() => {
              setForm({
                userId: "",
                serviceId: "",
                staffId: "",
                appointmentDate: "",
                notes: "",
              });
              setModal(true);
            }}
          >
            ＋ New appointment
          </Button>
        )}
      </div>
      {toast && <div className="notice success">{toast}</div>}
      {error ? (
        <PageState error={error} onRetry={load} />
      ) : loading ? (
        <PageState loading />
      ) : (
        <section className="panel table-panel">
          <AppointmentTable
            appointments={rows}
            onStatus={admin ? changeStatus : null}
          />
          <Text as="div" className="table-footer">
            Showing {rows.length} appointment{rows.length === 1 ? "" : "s"} ·
            Updates are saved to your backend.
          </Text>
          {pagination && (
            <Pagination pagination={pagination} onPageChange={setPage} />
          )}
          {admin && (
            <div className="appointment-delete-list">
              {rows.map((a) => (
                <Button
                  variant="destructive"
                  key={a._id}
                  onClick={() => remove(a)}
                >
                  Delete {a.user?.name || "booking"} ×
                </Button>
              ))}
            </div>
          )}
        </section>
      )}
      {modal && (
        <Modal
          eyebrow="NEW BOOKING"
          title="Book an appointment"
          subtitle={
            <>
              Choose an existing user account, service and appointment time.
              This creates a pending payment record too.
            </>
          }
          subtitleClassName="muted form-help"
          onClose={() => setModal(false)}
          onSubmit={create}
        >
            <div className="form-grid">
              <Field
                label="Customer account"
                value={form.userId}
                onChange={(v) => setForm({ ...form, userId: v })}
                required
                options={users.map((u) => ({
                  value: u._id || u.id,
                  label: `${u.name} · ${u.email}`,
                }))}
              />
              <Field
                label="Service"
                value={form.serviceId}
                onChange={(v) => setForm({ ...form, serviceId: v })}
                required
                options={services
                  .filter((s) => s.isActive)
                  .map((s) => ({
                    value: s._id,
                    label: `${s.name} · ${money(s.price)}`,
                  }))}
              />
              <Field
                label="Staff member (optional)"
                value={form.staffId}
                onChange={(v) => setForm({ ...form, staffId: v })}
                options={staff
                  .filter(
                    (s) => s.isAvailable !== false && s.isActive !== false,
                  )
                  .map((s) => ({
                    value: s._id,
                    label: `${s.name} · ${s.jobTitle}`,
                  }))}
              />
              <Field
                label="Date & time"
                type="datetime-local"
                value={form.appointmentDate}
                onChange={(v) => setForm({ ...form, appointmentDate: v })}
                required
              />
              <Field
                className="full-field"
                label="Notes"
                value={form.notes}
                onChange={(v) => setForm({ ...form, notes: v })}
                placeholder="Any preferences or notes for the stylist"
                multiline
              />
            </div>
            {users.length === 0 && (
              <div className="notice error">
                No user accounts found. Register a staff/user account first, or
                use Team access to check users.
              </div>
            )}
            <div className="modal-actions">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={busy || !users.length}
              >
                {busy ? "Creating…" : "Create appointment"}
              </Button>
            </div>
        </Modal>
      )}
    </>
  );
}
