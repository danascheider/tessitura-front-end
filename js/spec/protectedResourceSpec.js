define([
  'backbone', 
  'models/protected-resource', 
  'api', 
  'cookie'
], function(Backbone, ProtectedResource, API) {
  
  describe('ProtectedResource', function() {
    var resource;

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
  });
});