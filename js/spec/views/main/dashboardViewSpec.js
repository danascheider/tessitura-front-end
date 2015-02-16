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

    beforeEach(function() {
      if(typeof dashboard === 'undefined') { dashboard = new DashboardView({user: user}); }
    });

    describe('constructor', function() {
      it('sets this.user', function() {
        var newDashboard = new DashboardView({user: user});
        newDashboard.user.should.equal(user);
      });

      it('doesn\'t call render', function() {
        sinon.stub(Backbone.View.prototype, 'render');
        var newDashboard = new DashboardView({user: user});
        Backbone.View.prototype.render.called.should.be.false;
      });
    });

    describe('elements', function() {
      beforeEach(function() {
        dashboard.render();
      });

      afterEach(function() {
        dashboard.remove();
      });

      it('is a div', function() {
        dashboard.$el[0].tagName.should.equal('DIV');
      });
    });
  });

});