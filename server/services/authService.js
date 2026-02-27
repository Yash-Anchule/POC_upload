const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRY,
    });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRY,
    });
};

const register = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error('Email already registered');
        error.statusCode = 409;
        throw error;
    }

    const user = await User.create({ name, email, password });
    return user;
};

const login = async ({ email, password }) => {
    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
};

const refresh = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id).select('+refreshToken');

        if (!user || user.refreshToken !== refreshToken) {
            const error = new Error('Invalid refresh token');
            error.statusCode = 401;
            throw error;
        }

        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        user.refreshToken = newRefreshToken;
        await user.save();

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
        if (error.statusCode) throw error;
        const err = new Error('Invalid refresh token');
        err.statusCode = 401;
        throw err;
    }
};

const logout = async (userId) => {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
};

module.exports = { register, login, refresh, logout };
