import { useState } from "react";
import { apiRequest } from "../../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customer, setCustomer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      // const response = await fetch("/api/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     email,
      //     password,
      //   }),
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.message || "Login Failed");
      // }

      const data = await apiRequest("/api/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const loggedInCustomer = Array.isArray(data)
        ? data
        : data?.customer
          ? [data.customer]
          : [];

      if (!Array.isArray(loggedInCustomer)) {
        throw new Error("Unexpected API response format");
      }

      setCustomer(loggedInCustomer);
      setMessage("Login Successfully");
      console.log("Authenticated user:", data.customer);
    } catch (error) {
      setError(error.message || "Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Glow Salon Management</h1>

      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        {customer.map((loggedInCustomer) => (
          <div
            key={
              loggedInCustomer._id ??
              `${loggedInCustomer.email}-${loggedInCustomer.name}`
            }
          >
            <h2>{loggedInCustomer.name}</h2>
            <p>{loggedInCustomer.phone}</p>
            <p>{loggedInCustomer.email}</p>
          </div>
        ))}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
