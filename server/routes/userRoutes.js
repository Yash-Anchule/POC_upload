const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const validate = require('../middleware/validate');
const { createUserSchema, updateUserSchema } = require('../validators/userValidator');

/* All user management routes are admin-only */
router.use(authenticate, authorize('admin'));

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', validate(createUserSchema), userController.createUser);
router.put('/:id', validate(updateUserSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
