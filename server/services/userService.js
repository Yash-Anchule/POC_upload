const User = require('../models/User');

const getUsers = async ({ page = 1, limit = 10, search = '' }) => {
    const query = {};
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return {
        users,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    };
};

const getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }
    return user;
};

const createUser = async (data) => {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
        const error = new Error('Email already registered');
        error.statusCode = 409;
        throw error;
    }
    return User.create(data);
};

const updateUser = async (id, data) => {
    const user = await User.findById(id);
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    /* If email is changing, check uniqueness */
    if (data.email && data.email !== user.email) {
        const existing = await User.findOne({ email: data.email });
        if (existing) {
            const error = new Error('Email already in use');
            error.statusCode = 409;
            throw error;
        }
    }

    Object.assign(user, data);
    await user.save();
    return user;
};

const deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }
    return user;
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
