// routes/configurationsRouter.js
const express = require("express");
const configurationController = require("../controllers/configurationsController");
const { authenticate, authorize } = require("../middleware/auth");
const configurationRouter = express.Router();

// All configuration routes require authentication and admin privileges
configurationRouter.use(authenticate);
configurationRouter.use(authorize('admin'));

configurationRouter.get("/", configurationController.getConfigurations);
configurationRouter.get("/search", configurationController.searchConfigurations);
configurationRouter.get("/:id", configurationController.getConfigurationById);
configurationRouter.get("/key/:key", configurationController.getConfigurationByKey);
configurationRouter.post("/", configurationController.createConfiguration);
configurationRouter.put("/:id", configurationController.updateConfiguration);
configurationRouter.delete("/:id", configurationController.deleteConfiguration);

module.exports = configurationRouter;