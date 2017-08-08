const {User} = require('../database/');
const {expect} = require('chai');

var user = {username: 'fred_zirdung', password: 'fred_zirdung'};

describe('User Schema', function() {
  beforeEach(function(done) {
    User.model.truncate()
      .then(done);
  });

  it('inserts new users', function(done) {
    User.create(user)
      .then(function(newUser) {
        expect(newUser.username).to.exist;
        expect(newUser.salt).to.exist;
        expect(newUser.password).to.not.equal(user.password);

        done();
      }).catch(done);
  });

  it('does not allow duplicate users', function(done) {
    User.create(user)
      .then(function(newUser) {
        User.create(user)
          .catch(function(error) {
            expect(error.message).to.equal('User already exists');
            done();
          });
      }).catch(done);
  });

  it ('validates existing users', function(done) {
    User.create(user)
      .then(function() {
        return User.validate(user);
      })
      .then(function(valid) {
        expect(valid).to.be.true;
        done();
      })
      .catch(done);
  });
});
