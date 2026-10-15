import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCustomer() {
      try {
        // const response = await fetch("/api/customers");

        // if (!response.ok) {
        //   throw new Error("Failed to fetch customers");
        // }
        // const data = await response.json();
        const data = await apiRequest("/api/customers");

        const customerList = Array.isArray(data) ? data : data?.customers;

        if (!Array.isArray(customerList)) {
          throw new Error("Unexpected API response format");
        }

        setCustomers(customerList);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomer();
  }, []);

  if (loading) {
    return <h1>Loading Customer data...</h1>;
  }

  if (error) {
    return <p>Error : {error}</p>;
  }

  return (
    <div>
      <h1>Manage Customers</h1>

      {customers.length === 0 ? (
        <p>No customers found</p>
      ) : (
        customers.map((customer) => (
          <div key={customer._id}>
            <h2>{customer.name}</h2>
            <p>{customer.phone}</p>
            <p>{customer.email}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Customers;
