const pocService = require('../services/pocService');

const getPocs = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search = '', tag = '', status = '', author = '' } = req.query;
        const result = await pocService.getPocs({
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            search,
            tag,
            status,
            author,
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getPocById = async (req, res, next) => {
    try {
        const poc = await pocService.getPocById(req.params.id);
        res.json({ poc });
    } catch (error) {
        next(error);
    }
};

const createPoc = async (req, res, next) => {
    try {
        const data = { ...req.validatedBody };
        if (req.file) {
            data.thumbnail = `/uploads/${req.file.filename}`;
        }
        const poc = await pocService.createPoc(data, req.user._id);
        res.status(201).json({ message: 'POC created', poc });
    } catch (error) {
        next(error);
    }
};

const updatePoc = async (req, res, next) => {
    try {
        const data = { ...req.validatedBody };
        if (req.file) {
            data.thumbnail = `/uploads/${req.file.filename}`;
        }
        const poc = await pocService.updatePoc(
            req.params.id,
            data,
            req.user._id.toString(),
            req.user.role
        );
        res.json({ message: 'POC updated', poc });
    } catch (error) {
        next(error);
    }
};

const deletePoc = async (req, res, next) => {
    try {
        await pocService.deletePoc(req.params.id, req.user._id.toString(), req.user.role);
        res.json({ message: 'POC deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getPocs, getPocById, createPoc, updatePoc, deletePoc };
