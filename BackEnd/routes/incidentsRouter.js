// routes/incidentsRouter.js
const express = require("express");
const incidentController = require("../controllers/incidentsController");
const { authenticate, authorize } = require("../middleware/auth");
const incidentRouter = express.Router();

// All incident routes require authentication
incidentRouter.use(authenticate);

// Read operations - all authenticated users
incidentRouter.get("/", incidentController.getIncidents);
incidentRouter.get("/search", incidentController.searchIncidents);
incidentRouter.get("/:id", incidentController.getIncidentById);
incidentRouter.get("/owner/:ownerId", incidentController.getIncidentsByOwner);

// Write operations - admin/moderator only
incidentRouter.post("/", authorize('admin', 'moderator'), incidentController.createIncident);
incidentRouter.put("/:id", authorize('admin', 'moderator'), incidentController.updateIncident);
incidentRouter.delete("/:id", authorize('admin', 'moderator'), incidentController.deleteIncident);

module.exports = incidentRouter;