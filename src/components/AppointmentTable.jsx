import { dateTime } from "../utils";
import { EmptyState } from "./EmptyState";
import { PersonCell } from "./PersonCell";
import { StatusBadge } from "./StatusBadge";

export function AppointmentTable({ appointments, onStatus }) {
  if (!appointments?.length)
    return (
      <EmptyState
        icon="▦"
        title="No appointments yet"
        description="Bookings will appear here once added."
      />
    );
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>CLIENT</th>
            <th>SERVICE</th>
            <th>DATE & TIME</th>
            <th>STATUS</th>
            {onStatus && <th>ACTION</th>}
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a._id}>
              <td>
                <PersonCell
                  name={a.user?.name || "Unknown user"}
                  detail={a.user?.email || "—"}
                />
              </td>
              <td>{a.service?.name || "—"}</td>
              <td>{dateTime(a.appointmentDate)}</td>
              <td>
                <StatusBadge status={a.status} />
              </td>
              {onStatus && (
                <td>
                  <select
                    className="mini-select"
                    value={a.status}
                    onChange={(e) => onStatus(a._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="booked">Booked</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
