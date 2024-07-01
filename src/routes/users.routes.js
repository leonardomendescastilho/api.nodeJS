const { Router } = require('express');
const userRoutes = Router();

const UsersController = require('../controllers/UsersController.js');
const userController = new UsersController();

userRoutes.post('/', userController.create);

module.exports = userRoutes;
