// routes/configurationsRouter.js
const express = require("express");
const configurationController = require("../controllers/configurationsController");
const { authenticate, authorize } = require("../middleware/auth");
const configurationRouter = express.Router();

// All configuration routes require authentication
configurationRouter.use(authenticate);

// GET routes - allow both admin and moderator
configurationRouter.get("/",authorize('moderator',"admin"), configurationController.getConfigurations);
configurationRouter.get("/search",authorize('moderator',"admin"), configurationController.searchConfigurations);
configurationRouter.get("/:id",authorize('moderator',"admin"), configurationController.getConfigurationById);
configurationRouter.get("/key/:key",authorize('moderator',"admin"), configurationController.getConfigurationByKey);

// POST, PUT, DELETE routes - require admin only
configurationRouter.post("/", authorize('admin'), configurationController.createConfiguration);
configurationRouter.put("/:id", authorize('admin'), configurationController.updateConfiguration);
configurationRouter.delete("/:id", authorize('admin'), configurationController.deleteConfiguration);

module.exports = configurationRouter;