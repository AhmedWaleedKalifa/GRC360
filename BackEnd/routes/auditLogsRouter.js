// routes/auditLogsRouter.js
const express = require("express");
const auditLogController = require("../controllers/auditLogsController");
const { authenticate, authorize } = require("../middleware/auth");
const auditLogRouter = express.Router();

// All audit log routes require authentication and admin privileges
auditLogRouter.use(authenticate);
auditLogRouter.use(authorize('admin'));

auditLogRouter.get("/", auditLogController.getAuditLogs);
auditLogRouter.get("/search", auditLogController.searchAuditLogs);
auditLogRouter.delete("/", auditLogController.deleteAllAuditLogs);
auditLogRouter.get("/:id", auditLogController.getAuditLogById);
auditLogRouter.get("/user/:userId", auditLogController.getAuditLogsByUser);
auditLogRouter.get(
  "/entity/:entity/:entityId",
  auditLogController.getAuditLogsByEntity
);
auditLogRouter.post("/", auditLogController.createAuditLog);
auditLogRouter.delete("/:id", auditLogController.deleteAuditLog);

module.exports = auditLogRouter;