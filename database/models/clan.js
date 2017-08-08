const {Sequelize, db} = require('../connection');

const ClanModel = db.define('clans', {
  name: {
    type: Sequelize.STRING,
    unique: true
  }
});

module.exports = ClanModel;