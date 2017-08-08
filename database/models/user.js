/**
 * @todo Switch from sha256 to bcrypt
 * @todo User permissions on update/ delete. New Methods?
 */

const crypto = require('crypto');
const {Sequelize, db} = require('../connection');

const hashData = function(data, salt = '') {
  var shasum = crypto.createHash('sha256');
  shasum.update(data + salt);
  return shasum.digest('hex');
};

const UserModel = db.define('users', {
  username: {
    type: Sequelize.STRING(40),
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING(64),
    allowNull: false
  },
  salt: {
    type: Sequelize.STRING(64),
  }
}, {
  hooks: {
    beforeCreate: function(user) {
      user.salt = crypto.randomBytes(32).toString('hex');

      user.password = hashData(user.password, user.salt);
    }
  }
});

var User = { model: UserModel };

User.validate = function({username, password}) {
  return UserModel.findOne({where: {username}})
    .then(function(user) {
      if (user) {
        return user.password === hashData(password, user.salt);
      } else {
        return false;
      }
    });
};

User.findAll = function() {
  return UserModel.findAll();
};

User.read = function(query) {
  return UserModel.find({where: query});
};

User.update = function(query, values) {
  return UserModel.update({values: values}, {where: query});
};

User.delete = function(query) {
  return UserModel.destroy({where: query});
};

module.exports = User;
