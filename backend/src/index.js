// Importing the libraries installed with npm into this file  
import express from "express";    // Web server framework  
import mongoose, { mongo } from "mongoose";    // Connect and interact with MongoDB 
import dotenv from "dotenv";    // For reading vairables from the .env file
import cors from "cors";    // Enables requests from other origins 

// Load environment variables from .env into process.env 
dotenv.config(); 

// Create an instance of the Express application 
const app = express(); 

// Middleware: tells Express to automatically parse JSON data in requests 
app.use(express.json()); 

// Connect to MongoDB using the connection string in .env 
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB successfully connected!")) 
    .catch((err) => console.error("MongoDB ERROR:", err)); 
    
// A simple route for testing that the server works 
// If you visit http://localhost:4000/api/health in your browser, 
// It will respond with a small JSON message 
app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "FurryCare API" });
}); 

// Get the PORT value from .env or use 4000 by default 
const port = process.env.PORT || 4000; 

// Start the server and listen for incoming requests 
app.listen(port, () => console.log(`Server running on port ${port}`)); 

