const Poc = require('../models/Poc');

const getPocs = async ({ page = 1, limit = 10, search = '', tag = '', status = '', author = '' }) => {
    const query = {};

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    if (tag) {
        query.techStack = { $in: tag.split(',').map((t) => t.trim()) };
    }

    if (status) {
        query.status = status;
    }

    if (author) {
        query.author = author;
    }

    const total = await Poc.countDocuments(query);
    const pocs = await Poc.find(query)
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return {
        pocs,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    };
};

const getPocById = async (id) => {
    const poc = await Poc.findById(id).populate('author', 'name email');
    if (!poc) {
        const error = new Error('POC not found');
        error.statusCode = 404;
        throw error;
    }
    return poc;
};

const createPoc = async (data, authorId) => {
    return Poc.create({ ...data, author: authorId });
};

const updatePoc = async (id, data, userId, userRole) => {
    const poc = await Poc.findById(id);
    if (!poc) {
        const error = new Error('POC not found');
        error.statusCode = 404;
        throw error;
    }

    /* Developers can only edit their own POCs */
    if (userRole === 'developer' && poc.author.toString() !== userId) {
        const error = new Error('You can only edit your own POCs');
        error.statusCode = 403;
        throw error;
    }

    Object.assign(poc, data);
    await poc.save();
    return poc.populate('author', 'name email');
};

const deletePoc = async (id, userId, userRole) => {
    const poc = await Poc.findById(id);
    if (!poc) {
        const error = new Error('POC not found');
        error.statusCode = 404;
        throw error;
    }

    if (userRole === 'developer' && poc.author.toString() !== userId) {
        const error = new Error('You can only delete your own POCs');
        error.statusCode = 403;
        throw error;
    }

    await poc.deleteOne();
    return poc;
};

module.exports = { getPocs, getPocById, createPoc, updatePoc, deletePoc };
