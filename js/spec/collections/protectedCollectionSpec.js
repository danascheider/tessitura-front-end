define([
  'backbone', 
  'collections/protectedCollection',
  'api',
  'cookie'
], function(Backbone, ProtectedCollection, API) {

  // Use this model to populate the collection's 'model' property

  var Model = Backbone.Model.extend({});

  describe('ProtectedCollection', function() {
    var collection, server, model1, model2, model3; 

    var sandbox = sinon.sandbox.create();

    beforeEach(function() {
      var cookie = sandbox.stub($, 'cookie');
      cookie.withArgs('userID').returns(4);
      cookie.withArgs('auth').returns(btoa('user4:user4'));

      collection = new ProtectedCollection();
      collection.model = Model;
      collection.url = function() { return API.base + '/models'; };
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

    describe('updateAll() method', function() {
      var ajaxOptions;

      beforeEach(function() {
        model1 = new Model({foo: 'bar'}), model2 = new Model({foo: 'baz'}), model3 = new Model({foo: 'qux'});
        collection.reset([model1, model2, model3]);
        
        sandbox.stub($, 'ajax').yieldsTo('success');

        // Only 2 of the 3 models have been modified in this example, so only
        // those should be sent in the request.

        sandbox.stub(model1, 'hasChanged').returns(true);
        sandbox.stub(model2, 'hasChanged').returns(false);
        sandbox.stub(model3, 'hasChanged').returns(true);

        collection.updateAll();
        ajaxOptions = $.ajax.args[0][0];
      });

      afterEach(function() {
        collection.reset();
      });

      it('sends a request to the collection\'s main URL', function() {
        ajaxOptions.url.should.equal(collection.url());
      });

      it('sends a PUT request', function() {
        ajaxOptions.type.should.equal('PUT');
      });

      it('includes all changed models', function() {
        var expected = [JSON.parse(JSON.stringify(model1)), JSON.parse(JSON.stringify(model3))];
        JSON.parse(ajaxOptions.data).should.deep.equal(expected);
      });

      it('triggers the collectionSynced event', function(done) {
        var spy = sandbox.spy();
        collection.on('collectionSynced', spy);
        collection.updateAll();
        spy.calledOnce.should.be.true;
        done();
        collection.off();
      });

      it('includes the auth header', function() {
        $.ajax.restore();
        collection.updateAll();
        (typeof server.requests[0].requestHeaders.Authorization).should.not.be.undefined;
      });
    });
  });
});