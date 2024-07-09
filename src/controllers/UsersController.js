const AppError = require('../utils/AppError');
const { hash, compare } = require('bcryptjs');

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
    const { name, email, password, old_password } = request.body;
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

    if (password && !old_password) {
      throw new AppError('Você precisa passar a nova senha!');
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError('A senha antiga não confere.');
      }

      user.password = await hash(password, 8);
    }
    if (userEmailToUpdate && userEmailToUpdate.id !== user.id) {
      throw new AppError('Esse e-mail já está em uso');
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    await database.run(
      `
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      update_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, id]
    );

    response.status(200).json();
  }
}

module.exports = UsersController;
