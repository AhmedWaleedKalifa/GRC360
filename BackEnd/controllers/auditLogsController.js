const db = require("../db/queries/auditLogs");
const { BadRequestError, NotFoundError } = require("../errors/errors");

async function createAuditLog(req, res, next) {
  try {
    const { user_id, action, entity, entity_id, details } = req.body;

    if (!action || !entity) {
      throw new BadRequestError("Action and entity are required");
    }

    const newAuditLog = await db.addAuditLog({  user_id,  action,  entity,  entity_id,  details,});

    res.status(201).json(newAuditLog);
  } catch (err) {
    next(err);
  }
}

async function getAuditLogs(req, res, next) {
  try {
    const auditLogs = await db.getAllAuditLogs();

    if (!auditLogs || auditLogs.length === 0) {
      return res.status(404).json({ message: "No audit logs found" });
    }

    res.status(200).json(auditLogs);
  } catch (err) {
    next(err);
  }
}

// ADD SEARCH CONTROLLER
async function searchAuditLogs(req, res, next) {
  try {
    const { q } = req.query; // Get search query from URL parameters
    
    if (!q || q.trim() === '') {
      return res.status(400).json({ message: "Search query is required" });
    }

    const auditLogs = await db.searchAuditLogs(q.trim());

    if (!auditLogs || auditLogs.length === 0) {
      return res.status(404).json({ message: "No audit logs found matching your search" });
    }

    res.status(200).json(auditLogs);
  } catch (err) {
    next(err);
  }
}

async function getAuditLogById(req, res, next) {
  try {
    const { id } = req.params;
    const auditLog = await db.getAuditLogById(parseInt(id));

    if (!auditLog) {
      throw new NotFoundError("Audit log not found");
    }

    res.status(200).json(auditLog);
  } catch (err) {
    next(err);
  }
}

async function getAuditLogsByUser(req, res, next) {
  try {
    const { userId } = req.params;
    const auditLogs = await db.getAuditLogsByUser(parseInt(userId));

    if (!auditLogs || auditLogs.length === 0) {
      return res.status(404).json({ message: "No audit logs found for this user" });
    }

    res.status(200).json(auditLogs);
  } catch (err) {
    next(err);
  }
}

async function getAuditLogsByEntity(req, res, next) {
  try {
    const { entity, entityId } = req.params;
    const auditLogs = await db.getAuditLogsByEntity(entity, parseInt(entityId));

    if (!auditLogs || auditLogs.length === 0) {
      return res.status(404).json({ message: "No audit logs found for this entity" });
    }

    res.status(200).json(auditLogs);
  } catch (err) {
    next(err);
  }
}

async function deleteAuditLog(req, res, next) {
  try {
    const { id } = req.params;
    const deletedAuditLog = await db.removeAuditLog(parseInt(id));

    if (!deletedAuditLog) {
      throw new NotFoundError("Audit log not found");
    }

    res.status(200).json({ message: "Audit log deleted successfully", auditLog: deletedAuditLog });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createAuditLog,
  getAuditLogs,
  getAuditLogById,
  getAuditLogsByUser,
  getAuditLogsByEntity,
  deleteAuditLog,
  searchAuditLogs, // Export the search controller
};