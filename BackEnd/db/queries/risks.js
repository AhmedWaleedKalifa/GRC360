const pool = require("../pool");

async function getAllRisks() {
  const { rows } = await pool.query("SELECT * FROM risks ORDER BY created_at DESC");
  return rows;
}

async function getRiskById(risk_id) {
  const { rows } = await pool.query("SELECT * FROM risks WHERE risk_id = $1", [risk_id]);
  return rows[0] || null;
}

async function getRisksByOwner(owner_id) {
  const { rows } = await pool.query("SELECT * FROM risks WHERE owner = $1 ORDER BY created_at DESC", [owner_id]);
  return rows;
}



async function addRisk({ title, description, category, type, status, severity, impact, likelihood, owner, last_reviewed, due_date, notes }) {
  const { rows } = await pool.query(
    `INSERT INTO risks (title, description, category, type, status, severity, impact, likelihood, owner, last_reviewed, due_date, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING *;`,
    [title, description, category, type, status, severity, impact, likelihood, owner, last_reviewed, due_date, notes]
  );
  return rows[0];
}

async function updateRisk(risk_id, fields) {
  const set = Object.keys(fields)
    .map((key, idx) => `${key} = $${idx + 2}`)
    .join(", ");
  const values = [risk_id, ...Object.values(fields)];

  const { rows } = await pool.query(
    `UPDATE risks SET ${set}, updated_at = NOW() WHERE risk_id = $1 RETURNING *`,
    values
  );
  return rows[0];
}

async function removeRisk(risk_id) {
  const { rows } = await pool.query(
    "DELETE FROM risks WHERE risk_id = $1 RETURNING *",
    [risk_id]
  );
  return rows[0];
}
async function searchRisksByTitle(substring) {
  // Validate input
  if (!substring || typeof substring !== 'string') {
    throw new Error('Invalid search parameter');
  }
  
  const { rows } = await pool.query(
    "SELECT * FROM risks WHERE title ILIKE $1 ORDER BY created_at DESC",
    [`%${substring}%`]
  );
  return rows;
}

module.exports = {
  getAllRisks,
  getRiskById,
  getRisksByOwner,
  searchRisksByTitle,
  addRisk,
  updateRisk,
  removeRisk,
};