// routes/threatsRouter.js
const express = require("express");
const threatController = require("../controllers/threatsController");
const { authenticate, authorize } = require("../middleware/auth");
const threatRouter = express.Router();

// All threat routes require authentication
threatRouter.use(authenticate);

// Read operations - all authenticated users
threatRouter.get("/", threatController.getThreats);
threatRouter.get("/search", threatController.searchThreats);
threatRouter.get("/:id", threatController.getThreatById);
threatRouter.get("/category/:category", threatController.getThreatsByCategory);

// Write operations - admin/moderator only
threatRouter.post("/", authorize('admin', 'moderator'), threatController.createThreat);
threatRouter.put("/:id", authorize('admin', 'moderator'), threatController.updateThreat);
threatRouter.delete("/:id", authorize('admin', 'moderator'), threatController.deleteThreat);

module.exports = threatRouter;