const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers.authorization;
    let token = null;

    if (authHeader && typeof authHeader === 'string') {
        const parts = authHeader.split(' ');
        if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
            token = parts[1];
        } else {
            token = parts[0];
        }
    }

    if (!token && req.cookies && req.cookies.token) token = req.cookies.token;
    if (!token && req.query && req.query.token) token = req.query.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: token missing.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({ message: 'Server error: JWT secret not configured.' });
    }

    jwt.verify(token, secret, (err, payload) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: invalid or expired token.' });
        }
        req.user = payload;
        next();
    });
};

module.exports = authenticateToken;