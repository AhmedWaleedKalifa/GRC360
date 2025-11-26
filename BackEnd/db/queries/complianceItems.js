const pool = require("../pool");

// Frameworks
async function getAllFrameworks() {
  const { rows } = await pool.query(
    "SELECT * FROM compliance_frameworks ORDER BY created_at DESC"
  );
  return rows;
}

async function getFrameworkById(framework_id) {
  const { rows } = await pool.query(
    "SELECT * FROM compliance_frameworks WHERE framework_id = $1",
    [framework_id]
  );
  return rows[0] || null;
}

async function addFramework({ framework_id, framework_name, description }) {
  const { rows } = await pool.query(
    `INSERT INTO compliance_frameworks (framework_id, framework_name, description)
     VALUES ($1, $2, $3)
     RETURNING *;`,
    [framework_id, framework_name, description]
  );
  return rows[0];
}

async function updateFramework(framework_id, fields) {
  const set = Object.keys(fields)
    .map((key, idx) => `${key} = $${idx + 2}`)
    .join(", ");
  const values = [framework_id, ...Object.values(fields)];

  const { rows } = await pool.query(
    `UPDATE compliance_frameworks SET ${set}, updated_at = NOW() WHERE framework_id = $1 RETURNING *`,
    values
  );
  return rows[0];
}

async function removeFramework(framework_id) {
  const { rows } = await pool.query(
    "DELETE FROM compliance_frameworks WHERE framework_id = $1 RETURNING *",
    [framework_id]
  );
  return rows[0];
}

// Requirements
async function getRequirementsByFramework(framework_id) {
  const { rows } = await pool.query(
    "SELECT * FROM compliance_requirements WHERE framework_id = $1 ORDER BY created_at DESC",
    [framework_id]
  );
  return rows;
}

async function getRequirementById(requirement_id) {
  const { rows } = await pool.query(
    "SELECT * FROM compliance_requirements WHERE requirement_id = $1",
    [requirement_id]
  );
  return rows[0] || null;
}

async function addRequirement({
  requirement_id,
  framework_id,
  requirement_name,
  reference,
}) {
  const { rows } = await pool.query(
    `INSERT INTO compliance_requirements (requirement_id, framework_id, requirement_name, reference)
     VALUES ($1, $2, $3, $4)
     RETURNING *;`,
    [requirement_id, framework_id, requirement_name, reference]
  );
  return rows[0];
}

async function updateRequirement(requirement_id, fields) {
  const set = Object.keys(fields)
    .map((key, idx) => `${key} = $${idx + 2}`)
    .join(", ");
  const values = [requirement_id, ...Object.values(fields)];

  const { rows } = await pool.query(
    `UPDATE compliance_requirements SET ${set}, updated_at = NOW() WHERE requirement_id = $1 RETURNING *`,
    values
  );
  return rows[0];
}

async function removeRequirement(requirement_id) {
  const { rows } = await pool.query(
    "DELETE FROM compliance_requirements WHERE requirement_id = $1 RETURNING *",
    [requirement_id]
  );
  return rows[0];
}

// Controls
async function getControlsByRequirement(requirement_id) {
  const { rows } = await pool.query(
    "SELECT * FROM compliance_controls WHERE requirement_id = $1 ORDER BY created_at DESC",
    [requirement_id]
  );
  return rows;
}

async function getControlsByOwner(owner_id) {
  const { rows } = await pool.query(
    "SELECT * FROM compliance_controls WHERE owner = $1 ORDER BY created_at DESC",
    [owner_id]
  );
  return rows;
}

async function getControlById(control_id) {
  const { rows } = await pool.query(
    "SELECT * FROM compliance_controls WHERE control_id = $1",
    [control_id]
  );
  return rows[0] || null;
}

async function searchControlsByName(substring) {
  const { rows } = await pool.query(
    "SELECT * FROM compliance_controls WHERE control_name ILIKE $1 ORDER BY created_at DESC",
    [`%${substring}%`]
  );
  return rows;
}

async function addControl({
  control_id,
  requirement_id,
  control_name,
  status,
  owner,
  last_reviewed,
  reference,
  notes,
  description,
  attachment,
}) {
  const { rows } = await pool.query(
    `INSERT INTO compliance_controls (control_id, requirement_id, control_name, status, owner, last_reviewed, reference, notes, description, attachment)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *;`,
    [
      control_id,
      requirement_id,
      control_name,
      status,
      owner,
      last_reviewed,
      reference,
      notes,
      description,
      attachment,
    ]
  );
  return rows[0];
}

async function updateControl(control_id, fields) {
  const set = Object.keys(fields)
    .map((key, idx) => `${key} = $${idx + 2}`)
    .join(", ");
  const values = [control_id, ...Object.values(fields)];

  const { rows } = await pool.query(
    `UPDATE compliance_controls SET ${set}, updated_at = NOW() WHERE control_id = $1 RETURNING *`,
    values
  );
  return rows[0];
}

async function removeControl(control_id) {
  const { rows } = await pool.query(
    "DELETE FROM compliance_controls WHERE control_id = $1 RETURNING *",
    [control_id]
  );
  return rows[0];
}
async function searchFrameworksByName(substring) {
  const { rows } = await pool.query(
    "SELECT * FROM compliance_frameworks WHERE framework_name ILIKE $1 OR description  ILIKE $2 ORDER BY created_at DESC",
    [`%${substring}%`, `%${substring}%`]
  );
  return rows;
}

// Add to module.exports
module.exports = {
  // Frameworks
  getAllFrameworks,
  getFrameworkById,
  addFramework,
  updateFramework,
  removeFramework,
  searchFrameworksByName, // Add this

  // Requirements
  getRequirementsByFramework,
  getRequirementById,
  addRequirement,
  updateRequirement,
  removeRequirement,

  // Controls
  getControlsByRequirement,
  getControlsByOwner,
  getControlById,
  searchControlsByName,
  addControl,
  updateControl,
  removeControl,
};
