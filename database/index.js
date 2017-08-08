const Clan = require('./models/clan');
const User = require('./models/user');
const Message = require('./models/message');

Clan.belongsToMany(User, {through: 'UserClan'});
User.belongsToMany(Clan, {through: 'UserClan'});

User.hasMany(Message);
Message.belongsTo(User);

Clan.sync({force: true});
User.sync({force: true});
Message.sync({force: true});

module.exports = {
  User
};
