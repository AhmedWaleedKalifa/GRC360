const pool = require("../pool");

async function getAllAuditLogs() {
  const { rows } = await pool.query(`
    SELECT 
      al.audit_id,
      al.user_id,
      u.user_name,
      u.email,
      al.action,
      al.entity,
      al.entity_id,
      al.details,
      al.timestamp
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.user_id
    ORDER BY al.timestamp DESC
  `);
  return rows;
}

// Updated search function
async function searchAuditLogs(query) {
  const { rows } = await pool.query(`
    SELECT 
      al.audit_id,
      al.user_id,
      u.user_name,
      u.email,
      al.action,
      al.entity,
      al.entity_id,
      al.details,
      al.timestamp
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.user_id
    WHERE 
      al.action ILIKE $1 OR 
      al.entity ILIKE $1 OR 
      al.details::text ILIKE $1 OR
      u.user_name ILIKE $1
    ORDER BY al.timestamp DESC
  `, [`%${query}%`]);
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
async function deleteAllAuditLogs() {
  const { rows } = await pool.query('DELETE FROM audit_logs RETURNING *');
  return rows;
}
module.exports = {
  getAllAuditLogs,
  getAuditLogById,
  getAuditLogsByUser,
  getAuditLogsByEntity,
  addAuditLog,
  removeAuditLog,
  deleteAllAuditLogs,
  searchAuditLogs, // Export the search function
};