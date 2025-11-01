// Import required libraries installed via npm
import express from "express";   // Web server framework
import mongoose from "mongoose"; // MongoDB connection & schema handling
import dotenv from "dotenv";     // Loads environment variables from .env
import cors from "cors";         // Allows requests from the frontend (different origin)

// Load environment variables into process.env (PORT, MongoDB URI, etc.)
dotenv.config();

// Create an instance of the Express application
const app = express();

// Middleware: automatically parse incoming JSON request bodies
app.use(express.json());

// Enable CORS so the React frontend (running on another port) can access the API
app.use(cors());

// Connect to MongoDB using the connection string defined in .env
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB successfully connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Health check route — confirms API is running
// Visit http://localhost:4000/api/health to test the server
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "FurryCare API" });
});

// Select the port (from .env or default to 4000)
const port = process.env.PORT || 4000;

// Start server and listen for incoming requests
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
