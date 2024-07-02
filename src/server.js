require('express-async-errors');
const migrationsRun = require('./database/sqlite/migrations');
const express = require('express');
const AppError = require('./utils/AppError');
const routes = require('./routes/index');
migrationsRun();

const app = express();
app.use(express.json());
app.use(routes);

app.use((error, request, response, next) => {
  //o "error" aqui representa o throw new AppError
  if (error instanceof AppError) {
    //erro criado pelo cliente
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  console.error(error);
  //"erro" aqui representa um erro do servidor pois não está atrelado a nenhum throw new erro
  return response.status(500).json({
    //erro padrão
    status: 'error',
    message: 'erro no servidor interno',
  });
});

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Server is running in ${PORT}`);
});
