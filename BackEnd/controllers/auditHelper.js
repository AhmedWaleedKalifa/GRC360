const auditLogsDB = require("../db/queries/auditLogs");

async function logAction(req, action, entity, entity_id, details = "") {
  try {
    let userInfo = {};
    let userName = "System";

    // Use the user data from the request (extracted from headers)
    if (req.frontendUser && req.frontendUser.user_id) {
      userInfo = {
        user_id: req.frontendUser.user_id,
        user_name:
          req.frontendUser.user_name || `User ${req.frontendUser.user_id}`,
        email: req.frontendUser.email || "No email",
        role: req.frontendUser.role || "user",
      };
      userName =
        req.frontendUser.user_name || `User ${req.frontendUser.user_id}`;
    }

    // Ensure details is an object
    let detailsObj = {};
    if (typeof details === "object" && details !== null) {
      detailsObj = details;
    } else if (typeof details === "string") {
      try {
        detailsObj = JSON.parse(details);
      } catch {
        detailsObj = { custom_details: details };
      }
    }

    const logDetails = {
      user_name: userName,
      user_info: userInfo,
      timestamp: new Date().toISOString(),
      ...detailsObj,
    };

    await auditLogsDB.addAuditLog({
      user_id: req.frontendUser?.user_id || null,
      action,
      entity,
      entity_id,
      details: JSON.stringify(logDetails),
    });
  } catch (error) {
    console.error("Failed to log audit action:", error);
    // Don't throw error here as we don't want to break the main operation
  }
}

// Helper function to log system actions (without user context)
async function logSystemAction(action, entity, entity_id, details = {}) {
  try {
    const logDetails = {
      user_name: "System",
      system_generated: true,
      timestamp: new Date().toISOString(),
      ...details,
    };

    await auditLogsDB.addAuditLog({
      user_id: null,
      action,
      entity,
      entity_id,
      details: JSON.stringify(logDetails),
    });
  } catch (error) {
    console.error("Failed to log system action:", error);
  }
}

module.exports = {
  logAction,
  logSystemAction,
};
