console.log("VITE_API_URL =", import.meta.env.VITE_API_URL); 
// Import React hooks (useEffect and useState) from the React library
// - useState lets us store and update data inside the component
// - useEffect lets us run code when the component first loads
import { useEffect, useState } from "react";

// Import Axios, a library used to make HTTP requests to our backend
import axios from "axios";

// Define and export our main React component called "App"
export default function App() {

  // Create a piece of state called "status" to hold the connection message
  // setStatus is a function that can change "status"
  // It starts with "Checking API..."
  const [status, setStatus] = useState("Checking API...");

  // useEffect runs once when the component first loads
  // We'll use it to call our backend's /api/health route
  useEffect(() => {
    // Make a GET request to our backend API
    // The URL uses our environment variable (VITE_API_URL) from .env.local
    axios.get('/api/health')
      // If the request succeeds, check if the backend sent "ok: true"
      // Then update our "status" message to show success or issue
      .then(r => setStatus(r.data.ok ? "API successfully connected ✅" : "API issue ❌"))
      // If the request fails (e.g., backend is offline), show "API offline ❌"
      .catch(() => setStatus("API offline ❌"));
  }, []); // Empty [] means run this code only once when the page loads

  // This return section defines what we display on the webpage (the UI)
  return (
    <main style={{ fontFamily: "Inter, system-ui", padding: 24 }}>
      {/* Title of the app */}
      <h1>🐾 FurryCare</h1>

      {/* Display the current API connection status */}
      <p>{status}</p>

      {/* Description text below the status */}
      <p>React + Vite frontend talking to Express backend.</p>
    </main>
  );
}
