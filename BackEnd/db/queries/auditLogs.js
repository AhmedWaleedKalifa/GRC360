const pool = require("../pool");

async function getAllAuditLogs() {
  const { rows } = await pool.query("SELECT * FROM audit_logs ORDER BY timestamp DESC");
  return rows;
}

async function getAuditLogById(audit_id) {
  const { rows } = await pool.query("SELECT * FROM audit_logs WHERE audit_id = $1", [audit_id]);
  return rows[0] || null;
}

async function getAuditLogsByUser(user_id) {
  const { rows } = await pool.query("SELECT * FROM audit_logs WHERE user_id = $1 ORDER BY timestamp DESC", [user_id]);
  return rows;
}

async function getAuditLogsByEntity(entity, entity_id) {
  const { rows } = await pool.query(
    "SELECT * FROM audit_logs WHERE entity = $1 AND entity_id = $2 ORDER BY timestamp DESC",
    [entity, entity_id]
  );
  return rows;
}

async function addAuditLog({ user_id, action, entity, entity_id, details }) {
  const { rows } = await pool.query(
    `INSERT INTO audit_logs (user_id, action, entity, entity_id, details)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *;`,
    [user_id, action, entity, entity_id, details]
  );
  return rows[0];
}

async function removeAuditLog(audit_id) {
  const { rows } = await pool.query(
    "DELETE FROM audit_logs WHERE audit_id = $1 RETURNING *",
    [audit_id]
  );
  return rows[0];
}

module.exports = {
  getAllAuditLogs,
  getAuditLogById,
  getAuditLogsByUser,
  getAuditLogsByEntity,
  addAuditLog,
  removeAuditLog,
};