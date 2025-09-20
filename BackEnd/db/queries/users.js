const pool = require("../pool");

async function getAllUsers() {
  const { rows } = await pool.query("SELECT * FROM users ORDER BY created_at DESC");
  return rows;
}

async function getUserById(user_id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
  return rows[0] || null;
}

async function getUserByEmail(email) {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0] || null;
}

async function searchUsersByName(substring) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE user_name ILIKE $1",
    [`%${substring}%`]
  );
  return rows;
}


async function addUser({ role, user_name, email, password, job_title, phone }) {
    // required fields check here, optional handled by DB defaults
    if (!user_name || !email || !password) {
      throw new Error("user_name, email, and password are required");
    }
  
    const columns = ["user_name", "email", "password"];
    const values = [user_name, email, password];
    const placeholders = ["$1", "$2", "$3"];
    let idx = 4;
  
    if (role) {
      columns.push("role");
      values.push(role);
      placeholders.push(`$${idx++}`);
    }
    if (job_title) {
      columns.push("job_title");
      values.push(job_title);
      placeholders.push(`$${idx++}`);
    }
    if (phone) {
      columns.push("phone");
      values.push(phone);
      placeholders.push(`$${idx++}`);
    }
  
    const query = `
      INSERT INTO users (${columns.join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING *;
    `;
  
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

async function updateUser(user_id, fields) {
  const set = Object.keys(fields)
    .map((key, idx) => `${key} = $${idx + 2}`)
    .join(", ");
  const values = [user_id, ...Object.values(fields)];

  const { rows } = await pool.query(
    `UPDATE users SET ${set}, updated_at = NOW() WHERE user_id = $1 RETURNING *`,
    values
  );
  return rows[0];
}

async function removeUser(user_id) {
  const { rows } = await pool.query(
    "DELETE FROM users WHERE user_id = $1 RETURNING *",
    [user_id]
  );
  return rows[0];
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  searchUsersByName,
  addUser,
  updateUser,
  removeUser,
};