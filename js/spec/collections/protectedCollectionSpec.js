define([
  'backbone', 
  'collections/protectedCollection',
  'api',
  'cookie'
], function(Backbone, ProtectedCollection, API) {

  // Use this model to populate the collection's 'model' property

  var Model = Backbone.Model.extend({});

  describe('ProtectedCollection', function() {
    var collection, server; 

    var sandbox = sinon.sandbox.create();

    beforeEach(function() {
      $.cookie('userID', 4);
      $.cookie('auth', btoa('user4:user4'));

      collection = new ProtectedCollection();
      collection.model = Model;
      collection.url = API.base + '/models';
      server = sandbox.useFakeServer();
    });

    afterEach(function() { sandbox.restore(); });

    describe('token', function() {
      it('returns the value of the auth header for the logged-in user', function() {
        collection.token().should.equal('Basic ' + $.cookie('auth'));
      });
    });

    describe('fetch() method', function() {
      it('sets the auth header', function() {
        collection.fetch();
        server.requests[0].requestHeaders.should.haveOwnProperty('Authorization');
      });

      it('uses the auth token for the logged-in user', function() {
        var value = 'Basic ' + $.cookie('auth');
        collection.fetch();
        server.requests[0].requestHeaders.Authorization.should.equal(value);
      });

      it('calls `fetch` on the Backbone collection prototype', function() {
        sandbox.stub(Backbone.Collection.prototype, 'fetch');
        collection.fetch();
        Backbone.Collection.prototype.fetch.calledOnce.should.be.true;
      });
    });
  });
});