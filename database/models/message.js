const {Sequelize, db} = require('../connection');

const MessageModel = db.define('messages', {
  text: {
    type: Sequelize.TEXT
  }
});

module.exports = MessageModel;
