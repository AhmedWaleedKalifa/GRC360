const pool = require("../pool");

async function getAllThreats() {
  const { rows } = await pool.query(
    "SELECT * FROM threats ORDER BY detected_at DESC"
  );
  return rows;
}

async function getThreatById(threat_id) {
  const { rows } = await pool.query(
    "SELECT * FROM threats WHERE threat_id = $1",
    [threat_id]
  );
  return rows[0] || null;
}

async function getThreatsByCategory(category) {
  const { rows } = await pool.query(
    "SELECT * FROM threats WHERE category = $1 ORDER BY detected_at DESC",
    [category]
  );
  return rows;
}

async function searchThreatsByName(substring) {
  const { rows } = await pool.query(
    "SELECT * FROM threats WHERE name ILIKE $1 ORDER BY detected_at DESC",
    [`%${substring}%`]
  );
  return rows;
}

async function addThreat({
  name,
  message,
  description,
  category,
  severity,
  detected_at,
}) {
  if (detected_at === undefined || detected_at === null) {
    const { rows } = await pool.query(
      `INSERT INTO threats (name, message, description, category, severity)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *;`,
      [name, message, description, category, severity]
    );
    return rows[0];
  } else {
    const { rows } = await pool.query(
      `INSERT INTO threats (name, message, description, category, severity, detected_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *;`,
      [name, message, description, category, severity, detected_at]
    );
    return rows[0];
  }
}

async function updateThreat(threat_id, fields) {
  const set = Object.keys(fields)
    .map((key, idx) => `${key} = $${idx + 2}`)
    .join(", ");
  const values = [threat_id, ...Object.values(fields)];

  const { rows } = await pool.query(
    `UPDATE threats SET ${set} WHERE threat_id = $1 RETURNING *`,
    values
  );
  return rows[0];
}

async function removeThreat(threat_id) {
  const { rows } = await pool.query(
    "DELETE FROM threats WHERE threat_id = $1 RETURNING *",
    [threat_id]
  );
  return rows[0];
}

module.exports = {
  getAllThreats,
  getThreatById,
  getThreatsByCategory,
  searchThreatsByName,
  addThreat,
  updateThreat,
  removeThreat,
};
