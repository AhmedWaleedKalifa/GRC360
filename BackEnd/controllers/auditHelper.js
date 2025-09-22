const auditLogsDB = require("../db/queries/auditLogs");

async function logAction(user_id, action, entity, entity_id, details = "") {
  try {
    await auditLogsDB.addAuditLog({
      user_id,
      action,
      entity,
      entity_id,
      details: JSON.stringify(details)
    });
  } catch (error) {
    console.error("Failed to log audit action:", error);
    // Don't throw error here as we don't want to break the main operation
  }
}

module.exports = { logAction };