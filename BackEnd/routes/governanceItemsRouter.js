// routes/governanceItems.js
const express = require("express");
const governanceController = require("../controllers/governanceItemsController");
const governanceRouter = express.Router();

governanceRouter.get("/", governanceController.getGovernanceItems);
governanceRouter.get("/search", governanceController.searchGovernanceItems); // Add search route FIRST
governanceRouter.get("/:id", governanceController.getGovernanceItemById);
governanceRouter.get("/owner/:ownerId", governanceController.getGovernanceItemsByOwner);
governanceRouter.get("/:id/risks", governanceController.getRisksForGovernanceItem);
governanceRouter.get("/:id/frameworks", governanceController.getFrameworksForGovernanceItem);
governanceRouter.post("/", governanceController.createGovernanceItem);
governanceRouter.put("/:id", governanceController.updateGovernanceItem);
governanceRouter.delete("/:id", governanceController.deleteGovernanceItem);

module.exports = governanceRouter;