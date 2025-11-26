// routes/risksRouter.js
const express = require("express");
const riskController = require("../controllers/risksController");
const { authenticate, authorize } = require("../middleware/auth");
const riskRouter = express.Router();

// All risk routes require authentication
riskRouter.use(authenticate);

// Read operations - all authenticated users
riskRouter.get("/", riskController.getRisks);
riskRouter.get("/search", riskController.searchRisks);
riskRouter.get("/matrix", riskController.getRiskMatrix);
riskRouter.get("/:id", riskController.getRiskById);
riskRouter.get("/owner/:ownerId", riskController.getRisksByOwner);

// Write operations - admin/moderator only
riskRouter.post("/", authorize('admin', 'moderator'), riskController.createRisk);
riskRouter.put("/:id", authorize('admin', 'moderator'), riskController.updateRisk);
riskRouter.delete("/:id", authorize('admin', 'moderator'), riskController.deleteRisk);
riskRouter.post("/fix-invalid", authorize('admin'), riskController.fixInvalidRisks);

module.exports = riskRouter;