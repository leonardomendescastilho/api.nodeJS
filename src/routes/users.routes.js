const { Router } = require('express');
const userRoutes = Router();

const UsersController = require('../controllers/UsersController.js');
const userController = new UsersController();

userRoutes.post('/', userController.create);
userRoutes.put('/:id', userController.update);

module.exports = userRoutes;
