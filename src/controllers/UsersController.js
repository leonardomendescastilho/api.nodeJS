class UsersController {
  create(request, response) {
    const { name, age, email, password } = request.body;
    response.json({ name });
  }
}

module.exports = UsersController;
