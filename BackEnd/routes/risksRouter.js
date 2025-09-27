// routes/risks.js
const express = require("express");
const riskController = require("../controllers/risksController");
const riskRouter = express.Router();

riskRouter.get("/", riskController.getRisks);
riskRouter.get("/search", riskController.searchRisks); // Add search route FIRST
riskRouter.get('/matrix', riskController.getRiskMatrix); // Add this line

riskRouter.get("/:id", riskController.getRiskById);
riskRouter.get("/owner/:ownerId", riskController.getRisksByOwner);
riskRouter.post("/", riskController.createRisk);
riskRouter.put("/:id", riskController.updateRisk);
riskRouter.delete("/:id", riskController.deleteRisk);
riskRouter.post('/fix-invalid', riskController.fixInvalidRisks); // Add this line

module.exports = riskRouter;