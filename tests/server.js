const supertest = require('supertest');
const { app } = require('../server/server');
const request = supertest.agent(app);
const { User, Clan, Member } = require('../database');
const {db} = require('../database/connection');
const {expect} = require('chai');

var user = {username: 'fred_zirdung', password: 'fred_zirdung'};
var user2 = {username: 'test_user_please_ignore', password: 'test_user_please_ignore'};
var clan = {name: 'test_clan_please_ignore', userId: 0};

/**
 * @todo Double check with the database that changes went through.
 */
describe('Express Middleware', function() {
  
  var user = {username: 'fred_zirdung', password: 'fred_zirdung'};

  beforeEach(function() {
    return db.sync({force: true});
  });

  it('should have index.html', function() {
    return request.get('/')
      .expect(200)
      .expect('Content-Type', /html/);
  });

  it('should have users', function() {
    return request.get('/api/users')
      .expect(200);
  });

  it('should return users from get to /users/:user', function() {
    return User.create(user)
      .then(newUser => {
        return request.get(`/api/users/${newUser.id}`)
          .expect(200)
          .expect('Content-Type', /json/);
      });
  });

  it('should create a new user with post to /users ', function() {
    return request.post('/api/users')
      .send({username: 'foo', password: 'bar'})
      .set('Content-Type', 'application/json')
      .expect(200);
  });

  it('should delete a new user with delete to /users ', function() {
    return User.create(user)
      .then(newUser => {
        return request.delete(`/api/users/${newUser.id}`)
          .expect(200);
      });
  });

  it('should create a new member with post to /users/:user/members/ ', function() {
    return User.create(user)
      .then(newUser => {
        clan.userId = newUser.id;
        return Clan.create(clan);
      })
      .then(newClan => {
        return request.post(`/api/users/${clan.userId}/members`)
          .send({clanId: newClan.id})
          .set('Content-Type', 'application/json')
          .expect(200);
      });
  });

  it('should remove membership with delete to /users/:user/members/:member', function() {
    var userId;
    return User.create(user)
      .then(newUser => {
        clan.userId = newUser.id;
        return Clan.create(clan);
      })
      .then(newClan => {
        clan.id = newClan.id;
        return request.post(`/api/users/${clan.userId}/members`)
          .send({clanId: newClan.id})
          .set('Content-Type', 'application/json')
          .expect(200);
      })
      .then(response => {
        return request.delete(`/api/users/${clan.userId}/members/${clan.id}`);
      })
      .then(response => {
        expect(response.body.clanId).to.equal(String(clan.id));
        expect(response.body.userId).to.equal(String(clan.userId));
      });
  });
});
