import { useEffect, useState } from "react";
import StatCard from "./components/StatCard";

function App() {
  const [customerCount, setCustomerCount] = useState(0);
  useEffect(() => {
    document.title = `Customers: ${customerCount}`;
  }, [customerCount]); // is the dependency array. Because it's empty, the effect runs when the component mounts, rather than after every render.
  // Runs on mount. Example: initialize something when the dashboard opens.
  // [ServiceId] -> Runs on mount and again whenever serviceId changes.

  const salonName = "Glow Salon";
  const totalCustomers = 120;
  const todayAppointments = 18;
  const totalServices = 12;
  const [count, setCount] = useState(5);
  // State is data that a component remembers and can update over time.
  /*
    useState(0) creates state with an initial value of 0.
    count holds the current value.
    setCount is the function used to update that value.
    */
  // An event is an action that happens in the interface, such as a button click or a text input change.

  const services = [
    { id: 1, name: "Haircut", active: true },
    { id: 2, name: "Facial", active: false },
    { id: 3, name: "Hair Coloring", active: true },
  ];

  function completeAppointment() {
    setCount((previousCount) => previousCount + 1);
  }

  function handleSubmit() {
    event.preventDefault();
    console.log("Customer name:", customerName);
  }

  // FORMS
  const [customerName, setCustomerName] = useState("");

  return (
    <dev>
      <h1>Book a Salon Appointment</h1>
      <p>Interactive form preview</p>
      <form onSubmit={handleSubmit}>
        <label>Customer Name</label>
        <input
          id="customerName"
          placeholder="Enter Customer Name"
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
          required
        />
        <label>Phone number</label>
        <input
          id="customerName"
          value={customerName}
          placeholder="Enter Phone Number"
          onChange={(event) => setCustomerName(event.target.value)}
          required
        />

        <button type="submit">Submit</button>
      </form>

      <p>Total customers: {customerCount}</p>

      <button onClick={() => setCustomerCount(customerCount + 1)}>
        Add Customer
      </button>
    </dev>
    // <div>
    //   {/* <h1>{salonName} Management System</h1>
    //   <p>Welcome to your salon dashboard!</p>

    //   <div>
    //     <h2>Total Customer</h2>
    //     <p>{totalCustomers}</p>
    //   </div>

    //   <div>
    //     <h2>Today's Appointment</h2>
    //     <p>{todayAppointments}</p>
    //   </div>

    //   <div>
    //     <h2>Total Services</h2>
    //     <p>{totalServices}</p>
    //   </div> */}

    //   <h1>{salonName} Dashboard</h1>

    //   <StatCard title="Total Customer" value={totalCustomers} />
    //   <StatCard title="Today's Appointment" value={todayAppointments} />
    //   <StatCard title="Total Services" value={totalServices} />
    //   {/*
    //   onClick tells React which event to listen for.
    //   () => ... defines a function to run when the click happens.
    //   setCount(count + 1) updates the state to the next number. */}

    //   <h1>Completed Appointments</h1>
    //   <p>{count}</p>

    //   <button onClick={() => setCount(count + 1)}>Complete Appointment</button>
    //   {/* <button onClick={comple teAppointment}>Complete Appointment</button> */}

    //    <h1>Available Salon Services</h1>

    //   {services
    //     .filter((service) => service.active)
    //     .map((service) => (
    //       <p key={service.id}>{service.name}</p>
    //     ))}

    //     <h1> Book a Salon Appointment</h1>

    //     <label>Customer Name</label>
    //     <input
    //     type="text"
    //     placeholder="Enter Customer Name"
    //     value={customerName}
    //     onChange={(event) => setCustomerName(event.target.value)}/>

    //     <p>Customer Name : {customerName}</p>
    // </div>
  );
}

export default App;
