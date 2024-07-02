const AppError = require('../utils/AppError');

class UsersController {
  create(request, response) {
    const { name, age, email, password } = request.body;

    if (!name) {
      throw new AppError('O nome não foi enviado');
    }
    response.status(201).json(`o usuário ${name} foi adicionado`);
  }
}

module.exports = UsersController;
