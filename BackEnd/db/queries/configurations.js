const pool = require("../pool");

async function getAllConfigurations() {
  const { rows } = await pool.query("SELECT * FROM configurations ORDER BY config_id");
  return rows;
}

async function getConfigurationById(config_id) {
  const { rows } = await pool.query("SELECT * FROM configurations WHERE config_id = $1", [config_id]);
  return rows[0] || null;
}

async function getConfigurationByKey(key) {
  const { rows } = await pool.query("SELECT * FROM configurations WHERE key = $1", [key]);
  return rows[0] || null;
}

async function addConfiguration({ key, value, description }) {
  const { rows } = await pool.query(
    `INSERT INTO configurations (key, value, description)
     VALUES ($1, $2, $3)
     RETURNING *;`,
    [key, value, description]
  );
  return rows[0];
}

async function updateConfiguration(config_id, fields) {
  const set = Object.keys(fields)
    .map((key, idx) => `${key} = $${idx + 2}`)
    .join(", ");
  const values = [config_id, ...Object.values(fields)];

  const { rows } = await pool.query(
    `UPDATE configurations SET ${set} WHERE config_id = $1 RETURNING *`,
    values
  );
  return rows[0];
}

async function removeConfiguration(config_id) {
  const { rows } = await pool.query(
    "DELETE FROM configurations WHERE config_id = $1 RETURNING *",
    [config_id]
  );
  return rows[0];
}
async function searchConfigurationsByKeyOrValue(searchQuery) {
  const { rows } = await pool.query(
    `
    SELECT * 
    FROM configurations 
    WHERE key ILIKE $1 
       OR value ILIKE $1
       OR description ILIKE $1
    ORDER BY config_id DESC
    `,
    [`%${searchQuery}%`]
  );
  return rows;
}
module.exports = {
  getAllConfigurations,
  getConfigurationById,
  getConfigurationByKey,
  addConfiguration,
  updateConfiguration,
  removeConfiguration,
  searchConfigurationsByKeyOrValue
};