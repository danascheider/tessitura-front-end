define([
  'backbone',
  'models/user',
  'api',
  'cookie'
  ], function(Backbone, User, API) {

  describe('User', function() {
    var sandbox = sinon.sandbox.create();

    afterEach(function() { sandbox.restore(); });

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
          sandbox.stub(User.prototype, 'protectedFetch');
        });

        it('calls protectedFetch()', function() { 
          var user = new User({id: 342});
          User.prototype.protectedFetch.calledOnce.should.be.true;;
        });
      });

      describe('when instantiated without an ID', function() {
        it('doesn\'t fetch the tasks', function() {
          sandbox.stub(User.prototype, 'protectedFetch');
          new User({username: 'testuser22', password: 'usertest81'});
          User.prototype.protectedFetch.called.should.be.false;
        });
      })
    });

    describe('name() function', function() {
      it('concatenates the first and last names', function() {
        var user = new User({first_name: 'Beth', last_name: 'Franco'});
        user.name().should.equal('Beth Franco');
      })
    });

    // FIX: It's time for the fetch/protectedFetch dichotomy to end

    describe('fetch() function', function() {
      var user = new User({id: 342, username: 'testuser', password: 'testuser', email: 'testuser@example.com'});

      before(function() {

        // The `fetch()` function fetches the requested user regardless of whether
        // that user is the same as the logged-in user.

        var cookie = sandbox.stub($, 'cookie');
        cookie.withArgs('auth').returns(btoa('danascheider:danascheider'));
        cookie.withArgs('userID').returns(1);
      });

      it('calls Backbone.Model\'s fetch() function', function() {
        sandbox.stub(Backbone.Model.prototype, 'fetch');
        user.fetch();
        Backbone.Model.prototype.fetch.calledOnce.should.be.true;
      });

      it('sets the auth header for the user being requested', function() {
        var authString = 'Basic ' + btoa(user.get('username') + ':' + user.get('password'));
        var server = sandbox.useFakeServer();
        user.fetch();
        server.requests[0].requestHeaders.Authorization.should.equal(authString);
      });

      it('sends the request to the appropriate URI', function() {
        sandbox.stub($, 'ajax');
        user.fetch();
        $.ajax.args[0][0].url.should.equal(API.base + '/users/342');
      });
    });

    describe('protectedFetch() function', function() {

      var user = new User({id: 342, username: 'testuser', password: 'testuser', email: 'testuser@example.com'});

      before(function() {
        var cookie = sandbox.stub($, 'cookie');

        cookie.withArgs('auth').returns(btoa('danascheider:danascheider'));
        cookie.withArgs('userID').returns(1);
      });

      it('calls Backbone\'s fetch() function', function() {
        sandbox.spy(Backbone.Model.prototype, 'fetch');
        user.protectedFetch();
        Backbone.Model.prototype.fetch.calledOnce.should.be.true;
      });

      it('sets the auth header for the logged-in user', function() {
        var authString = 'Basic ' + $.cookie('auth');
        var server = sandbox.useFakeServer();

        user.protectedFetch();

        server.requests[0].requestHeaders.Authorization.should.equal(authString);
      });

      it('sends the request to the appropriate URI', function() {
        sandbox.stub($, 'ajax');

        user.fetch();
        $.ajax.args[0][0].url.should.equal(API.base + '/users/342');
      });
    });
  });
});