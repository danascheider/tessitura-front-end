define([
  'backbone',
  'models/user',
  'api',
  'cookie'
  ], function(Backbone, User, API) {

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

          // Since it is not possible to check that the constructor calls
          // `protectedFetch()` instead of regular `fetch()`, it is necessary to 
          // determine that (1) the request was made and (2) the request was made
          // using the credentials of the logged-in user, which differ from those
          // of the user being created.

          $.cookie('auth', btoa('danascheider:danascheider'));
          sinon.spy($, 'ajax');
        });

        afterEach(function() {
          $.removeCookie('auth');
          $.ajax.restore();
        });

        it('makes a request to the server', function(done) { 
          var user = new User({id: 342});
          $.ajax.calledOnce.should.be.true;
          done();
        });

        it('uses the credentials from the cookie', function(done) {
          var server = sinon.fakeServer.create();
          var user = new User({id: 342});
          var expected = 'Basic ' + btoa('danascheider:danascheider');
          server.requests[0].requestHeaders.Authorization.should.equal(expected);
          done();
        });
      });

      describe('when instantiated without an ID', function() {
        it('doesn\'t make a request to the server', function() {
          sinon.spy($, 'ajax');
          new User({username: 'testuser22', password: 'usertest81'});
          $.ajax.calledOnce.should.be.false;
          $.ajax.restore();
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

      before(function() {

        // The `fetch()` function fetches the requested user regardless of whether
        // that user is the same as the logged-in user.

        $.cookie('auth', btoa('danascheider:danascheider'));
        $.cookie('userID', 1);
      });

      after(function() {

        // Log out before moving on to other tests

        $.removeCookie('auth');
        $.removeCookie('userID');
      });

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

        // The `fetch()` method has to include the requested user's authorization
        // token, regardless of what user is logged in. 

        var authString = 'Basic ' + btoa(user.get('username') + ':' + user.get('password'));
        var server = sinon.fakeServer.create();

        user.fetch();

        server.requests[0].requestHeaders.Authorization.should.equal(authString);
      });

      it('sends the request to the appropriate URI', function() {
        
        // The request should be sent to the endpoint belonging to the user
        // whose data are being requested

        var server = sinon.fakeServer.create();
        user.fetch();
        server.requests[0].url.should.equal(API.base + '/users/342');
      });
    });

    describe('protectedFetch() function', function() {

      var user = new User({id: 342, username: 'testuser', password: 'testuser', email: 'testuser@example.com'});

      before(function() {

        // The `protectedFetch()` function always uses the logged-in user's
        // credentials in the request, regardless of which user is being 
        // requested.

        $.cookie('auth', btoa('danascheider:danascheider'));
        $.cookie('userID', 1);
      });

      after(function() {

        // Log out before moving on to other tests

        $.removeCookie('auth');
        $.removeCookie('userID');
      });

      it('calls Backbone\'s fetch() function', function(done) {

        // Spy on the Backbone model prototype's `fetch()` method, which should
        // be called from the User model's `fetch()` method (i.e., should be included
        // in the function that overrides the model's default `fetch()` method)

        sinon.spy(Backbone.Model.prototype, 'fetch');

        user.protectedFetch();
        Backbone.Model.prototype.fetch.calledOnce.should.be.true;
        Backbone.Model.prototype.fetch.restore();
        done();
      });

      it('sets the auth header for the logged-in user', function() {

        // The `protectedFetch()` method has to includes the logged-in user's
        // credentials, regardless of which user is being requested.

        var authString = 'Basic ' + $.cookie('auth');
        var server = sinon.fakeServer.create();

        user.protectedFetch();

        server.requests[0].requestHeaders.Authorization.should.equal(authString);
      });

      it('sends the request to the appropriate URI', function() {
        
        // The request should be sent to the endpoint belonging to the user
        // whose data are being requested

        var server = sinon.fakeServer.create();
        user.fetch();
        server.requests[0].url.should.equal(API.base + '/users/342');
      });
    });
  });
});