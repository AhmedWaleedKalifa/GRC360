const pool = require("../pool");

async function getAllIncidents() {
  const { rows } = await pool.query("SELECT * FROM incidents ORDER BY created_at DESC");
  return rows;
}

async function getIncidentById(incident_id) {
  const { rows } = await pool.query("SELECT * FROM incidents WHERE incident_id = $1", [incident_id]);
  return rows[0] || null;
}

async function getIncidentsByOwner(owner_id) {
  const { rows } = await pool.query("SELECT * FROM incidents WHERE owner = $1 ORDER BY created_at DESC", [owner_id]);
  return rows;
}

async function searchIncidentsByTitle(substring) {
  const { rows } = await pool.query(
    "SELECT * FROM incidents WHERE title ILIKE $1 ORDER BY created_at DESC",
    [`%${substring}%`]
  );
  return rows;
}

async function addIncident({ title, category, status, severity, priority, reported_at, detected_at, owner, description }) {
  const { rows } = await pool.query(
    `INSERT INTO incidents (title, category, status, severity, priority, reported_at, detected_at, owner, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *;`,
    [title, category, status, severity, priority, reported_at, detected_at, owner, description]
  );
  return rows[0];
}

async function updateIncident(incident_id, fields) {
  const set = Object.keys(fields)
    .map((key, idx) => `${key} = $${idx + 2}`)
    .join(", ");
  const values = [incident_id, ...Object.values(fields)];

  const { rows } = await pool.query(
    `UPDATE incidents SET ${set}, updated_at = NOW() WHERE incident_id = $1 RETURNING *`,
    values
  );
  return rows[0];
}

async function removeIncident(incident_id) {
  const { rows } = await pool.query(
    "DELETE FROM incidents WHERE incident_id = $1 RETURNING *",
    [incident_id]
  );
  return rows[0];
}

module.exports = {
  getAllIncidents,
  getIncidentById,
  getIncidentsByOwner,
  searchIncidentsByTitle,
  addIncident,
  updateIncident,
  removeIncident,
};