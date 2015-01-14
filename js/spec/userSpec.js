define(function(require) {
  var Backbone = require('backbone');
  var User = require('models/user');

  describe('User', function() {
    it('has default URL root of \'http://localhost:9292/users\'', function() {
      var user = new User();
      user.urlRoot.should.equal('http://localhost:9292/users');
    });
  });
});