define(['backbone', 'models/user'], function(Backbone, UserModel) {
  
  var FakeUser = UserModel.extend({
    defaults: {
      'id'         : 342,
      'username'   : 'testuser',
      'password'   : 'testuser',
      'email'      : 'testuser@example.com',
      'first_name' : 'Test',
      'last_name'  : 'User'
    },

    initialize : function() {
      this.originalAttributes = this.attributes;
    },

    reset      : function() {
      this.set(this.originalAttributes);
    }
  });

  return FakeUser;
});