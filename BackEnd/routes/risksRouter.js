const express = require("express");
const riskController = require("../controllers/risksController");
const riskRouter = express.Router();


riskRouter.get("/", riskController.getRisks);
riskRouter.get("/:id", riskController.getRiskById);
riskRouter.get("/owner/:ownerId", riskController.getRisksByOwner);
riskRouter.post("/", riskController.createRisk);
riskRouter.put("/:id", riskController.updateRisk);
riskRouter.delete("/:id", riskController.deleteRisk);

module.exports = riskRouter;