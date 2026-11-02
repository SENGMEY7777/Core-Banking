const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const adminRoute = require('./routes/admin/adminRoute');
const biometricRoute = require('./routes/biometric/biometricRoute');

app.use(cors({
    origin: process.env.CORS_ORIGIN || true
}));
app.use(express.json());
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Core Banking API is live and running',
        endpoints: {
            adminAuth: '/api/auth/admin',
            biometrics: '/api/biometrics'
        }
    });
});

app.use('/api/auth/admin', adminRoute);
app.use('/api/biometrics', biometricRoute);

const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
}


module.exports = app;
