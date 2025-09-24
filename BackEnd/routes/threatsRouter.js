// routes/threats.js
const express = require("express");
const threatController = require("../controllers/threatsController");
const threatRouter = express.Router();

threatRouter.get("/", threatController.getThreats);
threatRouter.get("/search", threatController.searchThreats); // Add search route FIRST
threatRouter.get("/:id", threatController.getThreatById);
threatRouter.get("/category/:category", threatController.getThreatsByCategory);
threatRouter.post("/", threatController.createThreat);
threatRouter.put("/:id", threatController.updateThreat);
threatRouter.delete("/:id", threatController.deleteThreat);

module.exports = threatRouter;