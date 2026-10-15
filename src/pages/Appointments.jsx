import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAppointments() {
      try {
        // const response = await fetch("/api/appointments");

        // if (!response.ok) {
        //   throw new Error("Failed to fetch appointments");
        // }
        // const data = await response.json();

        const data = await apiRequest("/api/appointments");

        const appointmentList = Array.isArray(data) ? data : data?.appointments;

        if (!Array.isArray(appointmentList)) {
          throw new Error("Unexpected API response format");
        }

        setAppointments(appointmentList);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  if (loading) {
    return <p>Loading appointments...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Manage Appointments</h1>

      {appointments.length === 0 ? (
        <p>No appointments found</p>
      ) : (
        appointments.map((appointment) => (
          <article key={appointment._id}>
            <h2>{appointment.customer?.name ?? "Unknown customer"}</h2>
            <p>Service: {appointment.service?.serviceName ?? "Unknown service"}</p>
            <p>Price: ₹{appointment.price}</p>
            <p>
              Date:{" "}
              {new Date(appointment.appointmentDate).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            <p>Status: {appointment.status}</p>
          </article>
        ))
      )}
    </div>
  );
}

export default Appointments;
