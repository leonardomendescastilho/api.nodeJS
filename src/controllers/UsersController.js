const AppError = require('../utils/AppError');
const { hash } = require('bcryptjs');

const sqliteConnection = require('../database/sqlite');
class UsersController {
  async create(request, response) {
    const { name, age, email, password } = request.body;
    const database = await sqliteConnection();

    const checkUserExist = await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    );
    if (checkUserExist) {
      throw new AppError('Esse e-mail já está em uso');
    }

    const hashPassword = await hash(password, 8);
    await database.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashPassword]
    );

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection();

    const user = await database.get('SELECT * FROM users WHERE id = (?)', [id]); //chave para verificação

    if (!user) {
      throw new AppError('Usuário não encontrado');
    }

    const userEmailToUpdate = await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    );

    if (userEmailToUpdate && userEmailToUpdate.id !== user.id) {
      throw new AppError('Esse e-mail já está em uso');
    }

    user.name = name;
    user.email = email;

    await database.run(
      `
      UPDATE users SET
      name = ?,
      email = ?,
      update_at = ?
      WHERE id = ?`,
      [user.name, user.email, new Date(), id]
    );

    response.status(200).json();
  }
}

module.exports = UsersController;
