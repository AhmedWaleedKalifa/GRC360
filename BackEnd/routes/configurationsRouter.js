const express = require("express");
const configurationController = require("../controllers/configurationsController");
const configurationRouter = express.Router();


configurationRouter.get("/", configurationController.getConfigurations);
configurationRouter.get("/search", configurationController.searchConfigurations);
configurationRouter.get("/:id", configurationController.getConfigurationById);
configurationRouter.get("/key/:key", configurationController.getConfigurationByKey);
configurationRouter.post("/", configurationController.createConfiguration);
configurationRouter.put("/:id", configurationController.updateConfiguration);
configurationRouter.delete("/:id", configurationController.deleteConfiguration);

module.exports = configurationRouter;