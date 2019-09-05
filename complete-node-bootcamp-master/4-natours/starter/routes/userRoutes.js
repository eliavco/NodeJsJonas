const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

// eslint-disable-next-line no-unused-vars
const { protect, restrict } = authController;

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createNewUser);

router.route('/stats').get(userController.getStats);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
