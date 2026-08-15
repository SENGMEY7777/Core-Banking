
const bcrypt = require('bcrypt');
const adminModel = require('../../models/admin/adminModel');
const { generateToken } = require('../../configs/jwt');

async function login(email, password) {
  const admin = await adminModel.findActiveAdminByEmail(email);

  if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
    return null;
  }

  const token = generateToken({
    id: admin.id,
    email: admin.email,
    role: admin.role
  });

  const { password_hash, ...safeAdmin } = admin;
  return {
    admin: safeAdmin,
    token
  };
}

async function getProfile(adminId) {
  const admin = await adminModel.findAdminById(adminId);

  if (!admin) {
    return null;
  }

  return admin;
}

module.exports = { login, getProfile };
