define([
  'backbone', 
  'models/protected-resource', 
  'api', 
  'cookie'
], function(Backbone, ProtectedResource, API) {
  
  describe('ProtectedResource', function() {
    var resource, server;

    before(function() {
      $.cookie('userID', 4);
      $.cookie('auth', btoa('user4:user4'));
    });

    describe('token', function() {
      it('returns the value of the Authorization header', function() {
        resource = new ProtectedResource();
        resource.token().should.equal('Basic ' + $.cookie('auth'));
      });
    });

    describe('save', function() {
      beforeEach(function() {
        resource = new ProtectedResource();
        resource.url = API.base + '/protected-resource';
        server = sinon.fakeServer.create();
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
        var stub = sinon.stub(Backbone.Model.prototype, 'save');
        resource.save();
        stub.calledOnce.should.be.true;
        Backbone.Model.prototype.save.restore();
      });
    });
  });
});