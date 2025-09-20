const express = require("express");
const auditLogController = require("../controllers/auditLogsController");
const auditLogRouter = express.Router();


auditLogRouter.get("/", auditLogController.getAuditLogs);
auditLogRouter.get("/:id", auditLogController.getAuditLogById);
auditLogRouter.get("/user/:userId", auditLogController.getAuditLogsByUser);
auditLogRouter.get("/entity/:entity/:entityId", auditLogController.getAuditLogsByEntity);
auditLogRouter.post("/", auditLogController.createAuditLog);
auditLogRouter.delete("/:id", auditLogController.deleteAuditLog);

module.exports = auditLogRouter;