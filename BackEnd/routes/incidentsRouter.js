// routes/incidents.js
const express = require("express");
const incidentController = require("../controllers/incidentsController");
const incidentRouter = express.Router();

incidentRouter.get("/", incidentController.getIncidents);
incidentRouter.get("/search", incidentController.searchIncidents); // Add search route FIRST
incidentRouter.get("/:id", incidentController.getIncidentById);
incidentRouter.get("/owner/:ownerId", incidentController.getIncidentsByOwner);
incidentRouter.post("/", incidentController.createIncident);
incidentRouter.put("/:id", incidentController.updateIncident);
incidentRouter.delete("/:id", incidentController.deleteIncident);

module.exports = incidentRouter;