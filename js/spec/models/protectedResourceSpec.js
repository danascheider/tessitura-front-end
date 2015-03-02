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
      $.cookie('userID', 4);
      $.cookie('auth', btoa('user4:user4'));
    });

    afterEach(function() {
      sandbox.restore();
    });

    describe('destroy() method', function() {
      beforeEach(function() {
        resource = new ProtectedResource();
        resource.url = API.base + '/protected-resource';
        sandbox.stub(resource, 'isNew').returns(false);
        server = sandbox.useFakeServer();
      });

      it('attaches an authorization header', function() {
        resource.destroy();
        server.requests[0].requestHeaders.should.haveOwnProperty('Authorization');
      });

      it('includes authorization for the logged-in user', function() {
        resource.destroy();
        var value = 'Basic ' + $.cookie('auth');
        server.requests[0].requestHeaders.Authorization.should.equal(value);
      });

      it('calls destroy on the Backbone model prototype', function() {
        sandbox.stub(Backbone.Model.prototype, 'destroy');
        resource.destroy();
        console.log(Backbone.Model.prototype.destroy.args);
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
        server = sandbox.useFakeServer();
      });

      it('attaches an authorization header', function() {
        resource.save();
        server.requests[0].requestHeaders.should.haveOwnProperty('Authorization');
      });

      it('includes authorization for the logged-in user', function() {
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
        server = sandbox.useFakeServer();
      });

      it('attaches an authorization header', function() {
        resource.fetch();
        server.requests[0].requestHeaders.should.haveOwnProperty('Authorization');
      });

      it('includes authorization for the logged-in user', function() {
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