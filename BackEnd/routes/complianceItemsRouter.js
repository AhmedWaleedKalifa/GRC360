// routes/complianceItemsRouter.js
const express = require("express");
const complianceController = require("../controllers/complianceItemsController");
const { authenticate, authorize } = require("../middleware/auth");
const complianceRouter = express.Router();

// All compliance routes require authentication
complianceRouter.use(authenticate);

// Frameworks routes - all authenticated users can read, admin/moderator can write
complianceRouter.get("/frameworks", complianceController.getFrameworks);
complianceRouter.get("/frameworks/search", complianceController.searchFrameworks);
complianceRouter.get("/frameworks/:id", complianceController.getFrameworkById);
complianceRouter.post("/frameworks", authorize('admin', 'moderator'), complianceController.createFramework);
complianceRouter.put("/frameworks/:id", authorize('admin', 'moderator'), complianceController.updateFramework);
complianceRouter.delete("/frameworks/:id", authorize('admin', 'moderator'), complianceController.deleteFramework);

// Requirements routes - all authenticated users can read, admin/moderator can write
complianceRouter.get("/frameworks/:frameworkId/requirements", complianceController.getRequirementsByFramework);
complianceRouter.get("/requirements/:id", complianceController.getRequirementById);
complianceRouter.post("/requirements", authorize('admin', 'moderator'), complianceController.createRequirement);
complianceRouter.put("/requirements/:id", authorize('admin', 'moderator'), complianceController.updateRequirement);
complianceRouter.delete("/requirements/:id", authorize('admin', 'moderator'), complianceController.deleteRequirement);

// Controls routes - all authenticated users can read, admin/moderator can write
complianceRouter.get("/controls/search", complianceController.searchControls);
complianceRouter.get("/requirements/:requirementId/controls", complianceController.getControlsByRequirement);
complianceRouter.get("/controls/owner/:ownerId", complianceController.getControlsByOwner);
complianceRouter.get("/controls/:id", complianceController.getControlById);
complianceRouter.post("/controls", authorize('admin', 'moderator'), complianceController.createControl);
complianceRouter.put("/controls/:id", authorize('admin', 'moderator'), complianceController.updateControl);
complianceRouter.delete("/controls/:id", authorize('admin', 'moderator'), complianceController.deleteControl);

module.exports = complianceRouter;