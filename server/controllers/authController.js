const authService = require('../services/authService');

const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.validatedBody);
        res.status(201).json({
            message: 'Registration successful',
            user,
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { user, accessToken, refreshToken } = await authService.login(req.validatedBody);
        res.json({
            message: 'Login successful',
            user,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        next(error);
    }
};

const refresh = async (req, res, next) => {
    try {
        const tokens = await authService.refresh(req.validatedBody.refreshToken);
        res.json(tokens);
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        await authService.logout(req.user._id);
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res) => {
    res.json({ user: req.user });
};

module.exports = { register, login, refresh, logout, getMe };
