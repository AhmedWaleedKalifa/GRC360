// routes/governanceItemsRouter.js
const express = require("express");
const governanceController = require("../controllers/governanceItemsController");
const { authenticate, authorize } = require("../middleware/auth");
const governanceRouter = express.Router();

// All governance routes require authentication
governanceRouter.use(authenticate);

// Read operations - all authenticated users
governanceRouter.get("/", governanceController.getGovernanceItems);
governanceRouter.get("/search", governanceController.searchGovernanceItems);
governanceRouter.get("/:id", governanceController.getGovernanceItemById);
governanceRouter.get("/owner/:ownerId", governanceController.getGovernanceItemsByOwner);
governanceRouter.get("/:id/risks", governanceController.getRisksForGovernanceItem);
governanceRouter.get("/:id/frameworks", governanceController.getFrameworksForGovernanceItem);

// Write operations - admin/moderator only
governanceRouter.post("/", authorize('admin', 'moderator'), governanceController.createGovernanceItem);
governanceRouter.put("/:id", authorize('admin', 'moderator'), governanceController.updateGovernanceItem);
governanceRouter.delete("/:id", authorize('admin', 'moderator'), governanceController.deleteGovernanceItem);

module.exports = governanceRouter;