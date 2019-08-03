const express = require('express');
const users = require('./../api-v1/users');
const router = express.Router();

router
    .route('/')
    .get(users.getAllUsers)
    .post(users.createNewUser);
router
    .route('/:id')
    .get(users.getUser)
    .patch(users.updateUser)
    .delete(users.deleteUser);

module.exports = router;
