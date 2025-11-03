// server.js

/**
 * Entry point for the backend server.
 * 
 * This file sets up an Express server, serves the React frontend, and mounts backend API routes.
 * It also includes middleware for handling CORS, JSON payloads, and static file serving.
 * 
 * Features:
 * - Serves React frontend from `frontend/build`.
 * - Routes backend API requests to the `/api` endpoint.
 * - Provides a catch-all handler for client-side routing in React.
 * - Configures middleware for CORS and JSON request handling.
 * 
 * @requires dotenv - Loads environment variables from a `.env` file into `process.env`.
 * @requires express - Web framework for building the backend server.
 * @requires path - Node.js module for handling file paths.
 * @requires cors - Middleware for enabling Cross-Origin Resource Sharing (CORS).
 */

// Import dependencies
require('dotenv').config();
const express = require("express");
const path = require("path");
const cors = require("cors");

// Initialize Express app
const app = express();

// Define the port
const PORT = process.env.PORT || 5000;

/**
 * Middleware configuration:
 * - `cors()`: Enables Cross-Origin Resource Sharing to allow requests from different origins.
 * - `express.json()`: Parses incoming JSON requests and makes them available in `req.body`.
 */
app.use(cors());
app.use(express.json());

/**
 * Serve static files from the React frontend app.
 * Files are located in the `frontend/build` directory.
 */
app.use(express.static(path.join(__dirname, "frontend/build")));

/**
 * Mount backend API routes:
 * - Routes defined in `backend/index.js` are accessible at `/api`.
 * 
 * @example
 * GET /api/someEndpoint -> Handled by the backend router.
 */
const backendRoutes = require("./backend/index"); // Import router
app.use("/api", backendRoutes); // Mount router at /api

/**
 * Catch-all handler for client-side routing.
 * Any request that doesn't match an API route will be served the React app's `index.html`.
 * 
 * This is required to support React's client-side routing using `react-router-dom`.
 */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

/**
 * Start the server:
 * - Listens for incoming requests on the specified port.
 * - Logs a message to the console indicating the server is running.
 * 
 * @example
 * Server is running on http://localhost:5000
 */
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
