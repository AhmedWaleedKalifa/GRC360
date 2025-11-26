// app.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();

// Import routes
const authRouter = require("./routes/authRoutes");
const awarenessRouter = require("./routes/awarenessRouter");
const governanceItemsRouter = require("./routes/governanceItemsRouter");
const risksRouter = require("./routes/risksRouter");
const complianceItemsRouter = require("./routes/complianceItemsRouter");
const incidentsRouter = require("./routes/incidentsRouter");
const threatsRouter = require("./routes/threatsRouter");
const auditLogsRouter = require("./routes/auditLogsRouter");
const configurationsRouter = require("./routes/configurationsRouter");
const usersRouter = require("./routes/usersRouter");
const aiRouter = require("./routes/aiRouter"); 

const errorHandler = require("./middleware/errorHandler");
const { authenticate } = require("./middleware/auth");

// Middleware - IMPORTANT: These must come BEFORE routes
app.use(cookieParser());
app.use(express.json()); // This parses JSON bodies
app.use(express.urlencoded({ extended: true })); // This parses URL-encoded bodies

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL2,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(
          new Error("CORS not allowed for this origin: " + origin)
        );
      }
    },
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => res.send("GRC360 API Server is running!"));

// API Routes
app.use("/api/auth", authRouter); // This route now has JSON parsing
app.use("/api/ai", authenticate, aiRouter);
app.use("/awareness", authenticate, awarenessRouter);
app.use("/governanceItems", authenticate, governanceItemsRouter);
app.use("/risks", authenticate, risksRouter);
app.use("/complianceItems", authenticate, complianceItemsRouter);
app.use("/incidents", authenticate, incidentsRouter);
app.use("/threats", authenticate, threatsRouter);
app.use("/configurations", authenticate, configurationsRouter);
app.use("/auditLogs", authenticate, auditLogsRouter);
app.use("/users", authenticate, usersRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3003;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`✅ GRC360 Server running on http://localhost:${PORT}`);
  console.log(`🤖 AI Chat endpoint available at /api/ai/chat`);
});