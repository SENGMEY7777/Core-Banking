
const pool = require('../../configs/db');

const findActiveAdminByEmail = async (email) => {
  const sql = `
    SELECT user_id AS id, email, password_hash, full_name, role, kyc_status, status, created_at, updated_at
    FROM users
    WHERE email = ? AND role = 'ADMIN' AND status = 'ACTIVE'
    LIMIT 1
  `;

  const [rows] = await pool.query(sql, [email]);
  return rows[0] || null;
};

const findAdminById = async (id) => {
  const sql = `
    SELECT user_id AS id, email, full_name, role, kyc_status, status, created_at, updated_at
    FROM users
    WHERE user_id = ? AND role = 'ADMIN'
    LIMIT 1
  `;

  const [rows] = await pool.query(sql, [id]);
  return rows[0] || null;
};

const upsertAdmin = async (email, passwordHash, fullName = 'System Administrator') => {
  const sql = `
    INSERT INTO users (email, password_hash, full_name, role, kyc_status, status)
    VALUES (?, ?, ?, 'ADMIN', 'VERIFIED', 'ACTIVE')
    ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash),
      full_name = VALUES(full_name);
  `;
  const [result] = await pool.query(sql, [email, passwordHash, fullName]);
  return result;
};
module.exports = {
  findActiveAdminByEmail,
  findAdminById,
  upsertAdmin
};
