define([
  'jquery',
  'underscore', 
  'backbone', 
  'views/app/dashboard',
  'models/user'
], function($, _, Backbone, DashboardView, User) {

  describe('Main Dashboard View', function() {
    var dashboard;
    var user = new User({
      username: 'testuser', 
      password: 'testuser', 
      email: 'testuser@example.com',
      first_name: 'Test',
      last_name: 'User'
    });

    describe('constructor', function() {
      it('sets this.user', function() {
        dashboard = new DashboardView({user: user});
        dashboard.user.should.equal(user);
      });
    });
  });

});