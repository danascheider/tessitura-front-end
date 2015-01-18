define(function(require) {
  var Backbone = require('backbone');
  var User = require('models/user');
  var Task = require('models/task');
  var API = require('api');
  var cookie = require('cookie');

  describe('Task', function() {
    describe('urlRoot', function() {
      it('is scoped to the logged in user', function() {
        $.cookie('auth', btoa('testuser:testuser'));
        $.cookie('userID', 342);
        var task = new Task();
        task.urlRoot().should.equal(API.base + '/users/342/tasks');
      });
    });

    describe('constructor', function() {
      it('calls the validation function', function() {
        var task = new Task();
        sinon.spy(task, 'validate');
        task.save();
        task.validate.calledOnce.should.be.true;
      });

      it('does not save the task automatically', function() {
        sinon.spy(Backbone.Model.prototype, 'sync');
        var task = new Task({title: 'Take out the trash'});
        Backbone.Model.prototype.sync.called.should.be.false;
      });
    });

    describe('validations', function() {
      it('is invalid without a title', function() {
        var task = new Task();
        task.save().should.be.false;
      });

      it('is valid with a title', function() {
        var task = new Task({title: 'Take out the trash'});
        task.save().should.beTruthy;
      });
    });

    describe('create() function', function() {
      beforeEach(function() {
        $.cookie('auth', btoa('testuser:testuser'));
        $.cookie('userID', 342);
      });

      afterEach(function() {
        $.removeCookie('auth');
        $.removeCookie('userID');
      });

      it('sends the request to the right endpoint', function() {
        var server = sinon.fakeServer.create();
        var task = new Task({title: 'Take out the trash'});
        task.create();
        server.requests[0].url.should.equal(API.base + '/users/342/tasks');
      });
    });

    describe('fetch() function', function() {
      var auth = 'Basic ' + btoa('testuser:testuser');

      beforeEach(function() {
        $.cookie('auth', btoa('testuser:testuser'));
        $.cookie('userID', 342);
      });

      afterEach(function() {
        $.removeCookie('auth');
        $.removeCookie('userID');
      });

      it('makes the request to the individual task endpoint', function() {
        var server = sinon.fakeServer.create(); 
        var task = new Task({id: 114, title: 'Take out the trash'});
        task.fetch();
        server.requests[0].url.should.equal(API.base + '/tasks/114');
      });

      it('includes the correct authorization header', function() {
        var server = sinon.fakeServer.create(); 
        var task = new Task({id: 114, title: 'Take out the trash'});
        task.fetch();
        server.requests[0].requestHeaders.Authorization.should.equal(auth);
      })
    });
  });
});