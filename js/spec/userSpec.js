define(function(require) {
  var Backbone = require('backbone');
  var User = require('models/user');

  describe('User', function() {
    it('has default URL root of \'/users\'', function() {
      var user = new User();
      user.urlRoot.should.equal('/users');
    });
  });
});