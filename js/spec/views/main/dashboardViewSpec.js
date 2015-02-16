define([
  'jquery',
  'underscore', 
  'backbone', 
  'views/app/dashboard',
  'models/user'
], function($, _, Backbone, DashboardView, User) {

  describe('Main Dashboard View', function() {
    var dashboard, e;
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
        dashboard.reset().render();
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

      describe('dropdown menus', function() {
        it('is hidden by default', function() {
          dashboard.$('ul.nav li.dropdown').should.not.be.visible;
        });
      });
    });

    describe('hideDropdownMenus() method', function() {
      beforeEach(function() {
        dashboard.reset().render();
        e = $.Event('click', {target: dashboard.$el.not('ul.nav')});
      });

      it('hides visible dropdown menus', function() {
        dashboard.$('li.dropdown').first().addClass('open');
        dashboard.hideDropdownMenus(e);
        dashboard.$('li.dropdown.open').length.should.equal(0);
      });
    });

    describe('reset() method', function() {
      beforeEach(function() {
        dashboard.render();
      });

      it('removes the view from the DOM', function() {
        sinon.spy(dashboard, 'remove');
        dashboard.reset();
        dashboard.remove.calledOnce.should.be.true;
        dashboard.remove.restore();
      });

      it('keeps its user', function() {
        dashboard.reset();
        dashboard.user.should.equal(user);
      });

      it('retains its sidebar', function() {
        var sidebar = dashboard.$sidebar;
        dashboard.reset();
        dashboard.$sidebar.should.equal(sidebar);
      })

      it('returns the view', function() {
        dashboard.reset().should.equal(dashboard);
      });
    });
  });

});