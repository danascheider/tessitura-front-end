define([
  'backbone', 
  'models/protectedResource', 
  'api', 
  'cookie'
], function(Backbone, ProtectedResource, API) {
  
  describe('ProtectedResource', function() {
    var resource, server;
    var sandbox = sinon.sandbox.create();

    before(function() {
      var cookie = sandbox.stub($, 'cookie');
      cookie.withArgs('userID').returns(4);
      cookie.withArgs('auth').returns(btoa('user4:user4'));
    });

    afterEach(function() {
      sandbox.restore();
    });

    describe('destroy() method', function() {
      beforeEach(function() {
        resource = new ProtectedResource();
        resource.url = API.base + '/protected-resource';
        sandbox.stub(resource, 'isNew').returns(false);
      });

      it('includes authorization for the logged-in user', function() {
        server = sandbox.useFakeServer();
        resource.destroy();
        var value = 'Basic ' + $.cookie('auth');
        server.requests[0].requestHeaders.Authorization.should.equal(value);
      });

      it('calls destroy on the Backbone model prototype', function() {
        sandbox.stub(Backbone.Model.prototype, 'destroy');
        resource.destroy();
        Backbone.Model.prototype.destroy.calledOnce.should.be.true;
      });
    });

    describe('token', function() {
      it('returns the value of the Authorization header', function() {
        resource = new ProtectedResource();
        resource.token().should.equal('Basic ' + $.cookie('auth'));
      });
    });

    describe('save() method', function() {
      beforeEach(function() {
        resource = new ProtectedResource();
        resource.url = API.base + '/protected-resource';
      });

      it('includes authorization for the logged-in user', function() {
        server = sandbox.useFakeServer();
        resource.save();
        var value = 'Basic ' + $.cookie('auth');
        server.requests[0].requestHeaders.Authorization.should.equal(value);
      });

      it('calls `save` from the Backbone Model prototype', function() {
        sandbox.stub(Backbone.Model.prototype, 'save');
        resource.save();
        Backbone.Model.prototype.save.calledOnce.should.be.true;
      });
    });

    describe('fetch() method', function() {
      beforeEach(function() {
        resource = new ProtectedResource();
        resource.url = API.base + '/protected-resource';
      });

      it('includes authorization for the logged-in user', function() {
        server = sandbox.useFakeServer();
        resource.fetch();
        var value = 'Basic ' + $.cookie('auth');
        server.requests[0].requestHeaders.Authorization.should.equal(value);
      });

      it('calls `fetch` from the Backbone Model prototype', function() {
        sandbox.stub(Backbone.Model.prototype, 'fetch');
        resource.fetch();
        Backbone.Model.prototype.fetch.calledOnce.should.be.true;
      });
    });
  });
});