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

    describe('events', function() {
      var newDashboard;

      beforeEach(function() {
        sinon.spy(DashboardView.prototype, 'toggleDropdownMenu');
        sinon.spy(DashboardView.prototype, 'hideDropdownMenus');
        newDashboard = new DashboardView({user: user});
        newDashboard.render();
      });

      afterEach(function() { 
        DashboardView.prototype.toggleDropdownMenu.restore();
        DashboardView.prototype.hideDropdownMenus.restore(); 
        newDashboard.remove();
      });

      describe('click on dropdown li', function() {
        it('calls toggleDropdownMenu()', function() {
          newDashboard.$('li.dropdown').first().click();
          DashboardView.prototype.toggleDropdownMenu.calledOnce.should.be.true;
        });
      });

      describe('click on a random point on the dashboard', function() {
        it('calls hideDropdownMenus()', function() {
          newDashboard.$el.click();
          DashboardView.prototype.hideDropdownMenus.calledOnce.should.be.true;
        });
      });
    });

    // FIX: This should also check for menu visibility and not for 
    //      class name

    describe('hideDropdownMenus() method', function() {
      beforeEach(function() { dashboard.reset().render(); });

      describe('when not clicking on a menu', function() {
        it('hides visible dropdown menus', function() {
          e = $.Event('click', {target: dashboard.$el.not('ul.nav')});
          dashboard.$('li.dropdown').first().addClass('open');
          dashboard.hideDropdownMenus(e);
          dashboard.$('li.dropdown.open').length.should.equal(0);
        });
      });

      describe('when clicking on a menu', function() {
        it('doesn\'t hide the menu clicked on', function() {
          dashboard.$('li.dropdown').first().addClass('open');
          e = $.Event('click', {target: dashboard.$('li.dropdown').first().children('ul.dropdown-menu')});
          dashboard.hideDropdownMenus(e);
          dashboard.$('li.dropdown').first()[0].className.should.include('open');
        });
      });
    });

    // FIX: This should check for menu visibility, not for class name

    describe('toggleDropdownMenu() method', function() {
      beforeEach(function() {
        dashboard.reset().render();
        dashboard.$('li.dropdown').removeClass('open');
        e = $.Event('click', {target: dashboard.$('li.dropdown').last()});
      });

      describe('when no menus are visible', function() {
        it('displays the menu that was clicked', function() {
          dashboard.toggleDropdownMenu(e);
          dashboard.$('li.dropdown').last()[0].className.should.include('open');
        });

        it('doesn\'t display the other menus', function() {
          dashboard.toggleDropdownMenu(e);
          dashboard.$('li.dropdown').first()[0].className.should.not.include('open');
        });
      })

      describe('when another menu is visible', function() {
        beforeEach(function() { dashboard.$('li.dropdown').first().addClass('open'); });

        it('hides the visible menu', function() {
          dashboard.toggleDropdownMenu(e);
          dashboard.$('li.dropdown').first()[0].className.should.not.include('open');
        });

        it('displays the menu that was clicked', function() {
          dashboard.toggleDropdownMenu(e);
          dashboard.$('li.dropdown').last()[0].className.should.include('open');
        });
      });

      describe('when the clicked menu was visible', function() {
        beforeEach(function() { dashboard.$('li.dropdown').last().addClass('open'); });

        it('hides the menu', function() {
          dashboard.toggleDropdownMenu(e);
          dashboard.$('li.dropdown').last()[0].className.should.not.include('open');
        });
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