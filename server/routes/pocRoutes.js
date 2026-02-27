const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pocController = require('../controllers/pocController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const validate = require('../middleware/validate');
const { createPocSchema, updatePocSchema } = require('../validators/pocValidator');

/* Multer config for thumbnail uploads */
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    },
});

const fileFilter = (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

/**
 * Middleware to parse FormData fields before Zod validation.
 * techStack arrives as a JSON string from the frontend FormData.
 */
const parseFormData = (req, _res, next) => {
    if (req.body.techStack && typeof req.body.techStack === 'string') {
        try {
            req.body.techStack = JSON.parse(req.body.techStack);
        } catch {
            req.body.techStack = [];
        }
    }
    next();
};

/* Public: list and get (published POCs visible to all authenticated users) */
router.get('/', authenticate, pocController.getPocs);
router.get('/:id', authenticate, pocController.getPocById);

/* Developer + Admin: create, update, delete */
router.post(
    '/',
    authenticate,
    authorize('admin', 'developer'),
    upload.single('thumbnail'),
    parseFormData,
    validate(createPocSchema),
    pocController.createPoc
);

router.put(
    '/:id',
    authenticate,
    authorize('admin', 'developer'),
    upload.single('thumbnail'),
    parseFormData,
    validate(updatePocSchema),
    pocController.updatePoc
);

router.delete(
    '/:id',
    authenticate,
    authorize('admin', 'developer'),
    pocController.deletePoc
);

module.exports = router;
