import { useEffect, useState } from "react";

function ApiService() {
  const [services, setServices] = useState([]); // creates a state variable named services, initially an empty array.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch("/api/services"); // requests the services from your Express backend.

        if (!response.ok) {
          throw new Error("Failed to fetch salon services");
        }
        const data = await response.json(); // converts the JSON response into a JavaScript value.

        // Supports either an array or { services: [...] }.
        const serviceList = Array.isArray(data) ? data : data?.services;

        if (!Array.isArray(serviceList)) {
          throw new Error("Unexpected API response format");
        }

        setServices(serviceList); // stores the returned services in React state.
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []); // dependency Array : Because it's empty, the effect runs when the component mounts, rather than after every render.

  if (loading) {
    return <p>Loading salon Services...</p>;
  }

  if (error) {
    return <p>Error : {error}</p>;
  }

  return (
    <div>
      <h1>Glow Salon Services</h1>

      {services.length === 0 ? (
        <p>No services found</p>
      ) : (
        services.map((service) => (
          <div key={service._id}>
            <h2>{service.serviceName}</h2>
            <p>Price: {service.price}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ApiService;
/*
http://localhost:5173/
*/
