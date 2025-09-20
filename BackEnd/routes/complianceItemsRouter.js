const express = require("express");
const complianceController = require("../controllers/complianceItemsController");
const complianceRouter = express.Router();



complianceRouter.get("/frameworks", complianceController.getFrameworks);
complianceRouter.get("/frameworks/:id", complianceController.getFrameworkById);
complianceRouter.post("/frameworks", complianceController.createFramework);
complianceRouter.put("/frameworks/:id", complianceController.updateFramework);
complianceRouter.delete("/frameworks/:id", complianceController.deleteFramework);



complianceRouter.get("/frameworks/:frameworkId/requirements", complianceController.getRequirementsByFramework);
complianceRouter.get("/requirements/:id", complianceController.getRequirementById);
complianceRouter.post("/requirements", complianceController.createRequirement);
complianceRouter.put("/requirements/:id", complianceController.updateRequirement);
complianceRouter.delete("/requirements/:id", complianceController.deleteRequirement);


complianceRouter.get("/requirements/:requirementId/controls", complianceController.getControlsByRequirement);
complianceRouter.get("/controls/owner/:ownerId", complianceController.getControlsByOwner);
complianceRouter.get("/controls/:id", complianceController.getControlById);
complianceRouter.post("/controls", complianceController.createControl);
complianceRouter.put("/controls/:id", complianceController.updateControl);
complianceRouter.delete("/controls/:id", complianceController.deleteControl);

module.exports = complianceRouter;