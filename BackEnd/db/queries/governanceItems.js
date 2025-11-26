const pool = require("../pool");

async function getAllGovernanceItems() {
  const { rows } = await pool.query(
    "SELECT * FROM governance_items ORDER BY created_at DESC"
  );
  return rows;
}

async function getGovernanceItemById(governance_id) {
  const { rows } = await pool.query(
    "SELECT * FROM governance_items WHERE governance_id = $1",
    [governance_id]
  );
  return rows[0] || null;
}

async function getGovernanceItemsByOwner(owner_id) {
  const { rows } = await pool.query(
    "SELECT * FROM governance_items WHERE owner = $1 ORDER BY created_at DESC",
    [owner_id]
  );
  return rows;
}

async function searchGovernanceItemsByName(substring) {
  const { rows } = await pool.query(
    "SELECT * FROM governance_items WHERE governance_name ILIKE $1 ORDER BY created_at DESC",
    [`%${substring}%`]
  );
  return rows;
}

async function addGovernanceItem({
  governance_name,
  type,
  owner,
  status,
  effective_date,
  expiry_date,
  next_review,
  last_reviewed,
  approval_status,
  approver,
  latest_change_summary,
  attachment,
}) {
  const { rows } = await pool.query(
    `INSERT INTO governance_items (governance_name, type, owner, status, effective_date, expiry_date, next_review, last_reviewed, approval_status, approver, latest_change_summary, attachment)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING *;`,
    [
      governance_name,
      type,
      owner,
      status,
      effective_date,
      expiry_date,
      next_review,
      last_reviewed,
      approval_status,
      approver,
      latest_change_summary,
      attachment,
    ]
  );
  return rows[0];
}

async function updateGovernanceItem(governance_id, fields) {
  const set = Object.keys(fields)
    .map((key, idx) => `${key} = $${idx + 2}`)
    .join(", ");
  const values = [governance_id, ...Object.values(fields)];

  const { rows } = await pool.query(
    `UPDATE governance_items SET ${set}, updated_at = NOW() WHERE governance_id = $1 RETURNING *`,
    values
  );
  return rows[0];
}

async function removeGovernanceItem(governance_id) {
  const { rows } = await pool.query(
    "DELETE FROM governance_items WHERE governance_id = $1 RETURNING *",
    [governance_id]
  );
  return rows[0];
}

async function getRisksForGovernanceItem(governance_id) {
  const { rows } = await pool.query(
    `SELECT r.* FROM risks r
     JOIN governance_risks gr ON r.risk_id = gr.risk_id
     WHERE gr.governance_id = $1`,
    [governance_id]
  );
  return rows;
}

async function getFrameworksForGovernanceItem(governance_id) {
  const { rows } = await pool.query(
    `SELECT cf.* FROM compliance_frameworks cf
     JOIN governance_frameworks gf ON cf.framework_id = gf.framework_id
     WHERE gf.governance_id = $1`,
    [governance_id]
  );
  return rows;
}

module.exports = {
  getAllGovernanceItems,
  getGovernanceItemById,
  getGovernanceItemsByOwner,
  searchGovernanceItemsByName,
  addGovernanceItem,
  updateGovernanceItem,
  removeGovernanceItem,
  getRisksForGovernanceItem,
  getFrameworksForGovernanceItem,
};
