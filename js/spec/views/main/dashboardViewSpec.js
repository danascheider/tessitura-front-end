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

      it('instantiates a sidebar', function() {
        var newDashboard = new DashboardView({user: user});
        newDashboard.$sidebar.should.exist;
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

      it('has ID #dashboard-wrapper', function() {
        dashboard.$el[0].id.should.equal('dashboard-wrapper');
      });

      describe('sidebar', function() {
        it('is inserted into the div.sidebar-collapse', function() {
          dashboard.$sidebar.$el.parents('div.sidebar-collapse').length.should.be.ok;
        });
      });
    });
  });

});