const Sequelize = require('sequelize');

const database = process.env.DATABASE_URL;

const db = new Sequelize(database, {
  // logging: false
});

module.exports = {
  Sequelize,
  db
};