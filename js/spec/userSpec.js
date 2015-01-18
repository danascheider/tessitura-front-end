define(function(require) {
  var Backbone = require('backbone');
  var User = require('models/user');
  var API = require('api');

  if (API.base.match(/localhost/)) { throw 'Connect to test API' }

  describe('User', function() {
    it('has default URL root of \'/users\'', function() {
      var user = new User();
      user.urlRoot.should.equal('http://private-6f87dc-canto.apiary-mock.com/users');
    });

    describe('constructor', function() {
      it('instantiates a task collection', function() {
        var user = new User();
        (typeof user.tasks).should.not.equal('undefined');
      });

      describe('when instantiated with an ID', function() {
        beforeEach(function() {
          sinon.spy($, 'ajax');
        });

        afterEach(function() {
          $.ajax.restore();
        });

        it('makes a request to the server', function(done) {
          new User({id: 1});
          $.ajax.calledOnce.should.be.true;
          done();
        });
      });

      describe('when instantiated without an ID', function() {
        beforeEach(function() {
          sinon.spy($, 'ajax');
        });

        afterEach(function() {
          $.ajax.restore();
        });

        it('doesn\'t make a request to the server', function() {
          new User({username: 'testuser22', password: 'usertest81'});
          $.ajax.calledOnce.should.be.false;
        });
      })
    });

    describe('name() function', function() {
      it('concatenates the first and last names', function() {
        var user = new User({first_name: 'Beth', last_name: 'Franco'});
        user.name().should.equal('Beth Franco');
      })
    });

    describe('fetch() function', function() {
      var user = new User({id: 342, username: 'testuser', password: 'testuser', email: 'testuser@example.com'});

      it('calls Backbone\'s fetch() function', function(done) {

        // Spy on the Backbone model prototype's `fetch()` method, which should
        // be called from the User model's `fetch()` method (i.e., should be included
        // in the function that overrides the model's default `fetch()` method)

        sinon.spy(Backbone.Model.prototype, 'fetch');

        user.fetch();
        Backbone.Model.prototype.fetch.calledOnce.should.be.true;
        Backbone.Model.prototype.fetch.restore();
        done();
      });

      it('sets the auth header for the user being requested', function() {
        var authString = 'Basic ' + btoa(user.get('username') + ':' + user.get('password'));
        var server = sinon.fakeServer.create();

        user.fetch();

        server.requests[0].requestHeaders.Authorization.should.equal(authString);
      });
    });
  });
});