const userService = require('../services/userService');

const getUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const result = await userService.getUsers({
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            search,
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.json({ user });
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.validatedBody);
        res.status(201).json({ message: 'User created', user });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.params.id, req.validatedBody);
        res.json({ message: 'User updated', user });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
