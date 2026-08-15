const authService = require('../../services/admin/authService');
const { sendResponse } = require('../../utils/responseHelper');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendResponse(res, 400, false, 'Email and password are required');
        }

        const result = await authService.login(email, password);
        if (!result) {
            return sendResponse(res, 401, false, 'Invalid email or password');
        }

        return sendResponse(res, 200, true, 'Login successful', result);
    }catch (error) {
        return sendResponse(res, 500, false, 'Login failed', null, error.message);
    }

}

const me = async (req, res) => {
    try {
        if (!req.user?.id) {
            return sendResponse(res, 401, false, 'Unauthorized');
        }

        const admin = await authService.getProfile(req.user.id);

        if (!admin) {
            return sendResponse(res, 404, false, 'Admin account not found');
        }

        return sendResponse(res, 200, true, 'Profile loaded successfully', admin);
    } catch (error) {
        return sendResponse(res, 500, false, 'Failed to load profile', null, error.message);
    }
};

module.exports = {
    login,
    me
};
