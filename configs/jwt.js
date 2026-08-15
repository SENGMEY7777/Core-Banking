const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

function generateToken(user, options = {}) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not configured in environment');

    if (!user || !user.id) throw new Error('generateToken: user object with `id` is required');

    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    const expiresIn = options.expiresIn || process.env.JWT_EXPIRES_IN || '1h';
    return jwt.sign(payload, secret, { expiresIn });
}

function verifyToken(token) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not configured in environment');
    return jwt.verify(token, secret);
}

module.exports = { generateToken, verifyToken };