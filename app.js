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
app.use('/api/auth/admin', adminRoute);
app.use('/api/biometrics', biometricRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
