const sqlite3 = require('sqlite3'); // driver que estabele a comunicação
const sqlite = require('sqlite'); // para se comunicar
const path = require('path'); //resolver conflito de possíveis caminhos

async function sqliteConnection() {
  const database = await sqlite.open({
    filename: path.resolve(__dirname, '..', 'database.db'),
    driver: sqlite3.Database,
  });

  return database;
}

module.exports = sqliteConnection;
