const pool = require("../pool");

async function getAllUsers() {
  const { rows } = await pool.query(
    "SELECT user_id, role, user_name, email, job_title, phone, last_login, is_active, email_verified, created_at, updated_at FROM users ORDER BY created_at DESC"
  );
  return rows;
}

async function getUserById(user_id) {
  const { rows } = await pool.query(
    "SELECT user_id, role, user_name, email, job_title, phone, last_login, is_active, email_verified, verification_code, verification_code_expires, created_at, updated_at FROM users WHERE user_id = $1", 
    [user_id]
  );
  return rows[0] || null;
}

async function getUserByEmail(email) {
  const { rows } = await pool.query(
    "SELECT user_id, role, user_name, email, password, job_title, phone, last_login, is_active, email_verified, verification_code, verification_code_expires, created_at, updated_at FROM users WHERE email = $1", 
    [email]
  );
  return rows[0] || null;
}

async function searchUsersByName(substring) {
  const { rows } = await pool.query(
    "SELECT user_id, role, user_name, email, job_title, phone, last_login, is_active, email_verified, created_at, updated_at FROM users WHERE user_name ILIKE $1",
    [`%${substring}%`]
  );
  return rows;
}

async function addUser({ 
  role, 
  user_name, 
  email, 
  password, 
  job_title, 
  phone,
  verification_code,
  verification_code_expires 
}) {
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
  if (verification_code) {
    columns.push("verification_code");
    values.push(verification_code);
    placeholders.push(`$${idx++}`);
  }
  if (verification_code_expires) {
    columns.push("verification_code_expires");
    values.push(verification_code_expires);
    placeholders.push(`$${idx++}`);
  }

  const query = `
      INSERT INTO users (${columns.join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING user_id, role, user_name, email, job_title, phone, is_active, email_verified, created_at, updated_at;
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
    `UPDATE users SET ${set}, updated_at = NOW() WHERE user_id = $1 RETURNING user_id, role, user_name, email, job_title, phone, is_active, email_verified, created_at, updated_at`,
    values
  );
  return rows[0];
}

async function removeUser(user_id) {
  const { rows } = await pool.query(
    "DELETE FROM users WHERE user_id = $1 RETURNING user_id, user_name, email",
    [user_id]
  );
  return rows[0];
}

// NEW: Update user verification code
async function updateUserVerification(userId, verificationCode, expirationTime) {
  const { rows } = await pool.query(
    `UPDATE users 
     SET verification_code = $1, 
         verification_code_expires = $2, 
         updated_at = NOW() 
     WHERE user_id = $3 
     RETURNING user_id, email, verification_code, verification_code_expires`,
    [verificationCode, expirationTime, userId]
  );
  return rows[0];
}

// NEW: Verify user email
async function verifyUserEmail(userId) {
  const { rows } = await pool.query(
    `UPDATE users 
     SET email_verified = TRUE, 
         verification_code = NULL, 
         verification_code_expires = NULL,
         updated_at = NOW() 
     WHERE user_id = $1 
     RETURNING user_id, email, email_verified`,
    [userId]
  );
  return rows[0];
}

// NEW: Get user with verification data (for internal use)
async function getUserWithVerificationData(userId) {
  const { rows } = await pool.query(
    "SELECT user_id, email, email_verified, verification_code, verification_code_expires FROM users WHERE user_id = $1",
    [userId]
  );
  return rows[0] || null;
}

// NEW: Check if verification code is valid
async function isValidVerificationCode(userId, code) {
  const { rows } = await pool.query(
    `SELECT user_id, verification_code, verification_code_expires 
     FROM users 
     WHERE user_id = $1 AND verification_code = $2 AND verification_code_expires > NOW()`,
    [userId, code]
  );
  return rows.length > 0;
}

// NEW: Clear verification code (after successful verification or expiration)
async function clearVerificationCode(userId) {
  const { rows } = await pool.query(
    `UPDATE users 
     SET verification_code = NULL, 
         verification_code_expires = NULL,
         updated_at = NOW() 
     WHERE user_id = $1 
     RETURNING user_id, email`,
    [userId]
  );
  return rows[0];
}

// NEW: Update last login timestamp
async function updateLastLogin(userId) {
  const { rows } = await pool.query(
    `UPDATE users 
     SET last_login = NOW(), 
         updated_at = NOW() 
     WHERE user_id = $1 
     RETURNING user_id, last_login`,
    [userId]
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
  updateUserVerification,
  verifyUserEmail,
  getUserWithVerificationData,
  isValidVerificationCode,
  clearVerificationCode,
  updateLastLogin,
};