define([
  'jquery',
  'underscore', 
  'backbone', 
  'views/main/dashboard',
  'models/user'
], function($, _, Backbone, DashboardView, User) {

  describe('Main Dashboard View', function() {
    var dashboard, e, spy;
    var sandbox = sinon.sandbox.create();

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

    afterEach(function() { 
      dashboard.remove();
      sandbox.restore();
    });

    describe('constructor', function() {
      it('calls setUser', function() {
        sandbox.stub(DashboardView.prototype, 'setUser');
        var newDashboard = new DashboardView({user: user});
        DashboardView.prototype.setUser.withArgs(user).calledOnce.should.be.true;
      });

      it('instantiates a sidebar', function() {
        var newDashboard = new DashboardView({user: user});
        newDashboard.$sidebar.should.exist;
      });

      it('instantiates a home view', function() {
        var newDashboard = new DashboardView();
        (typeof newDashboard.$homeView).should.not.equal('undefined');
      });

      it('instantiates a task view', function() {
        var newDashboard = new DashboardView();
        (typeof newDashboard.$taskView).should.not.equal('undefined');
      });

      it('doesn\'t call render', function() {
        sandbox.stub(Backbone.View.prototype, 'render');
        var newDashboard = new DashboardView({user: user});
        Backbone.View.prototype.render.called.should.be.false;
      });

      it('can be instantiated without a user', function() {
        var newDashboard = new DashboardView();
        (typeof newDashboard.user).should.equal('undefined');
      });
    });

    describe('elements', function() {
      beforeEach(function() {
        dashboard.render();
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
        sandbox.spy(DashboardView.prototype, 'toggleDropdownMenu');
        sandbox.spy(DashboardView.prototype, 'hideDropdownMenus');
        newDashboard = new DashboardView({user: user});
        newDashboard.render();
      });

      afterEach(function() { 
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

      describe('listeners', function() {
        beforeEach(function() {
          spy = sandbox.spy(DashboardView.prototype, 'redirect');
          dashboard = new DashboardView({user: user});
        });

        describe('redirect:dashboard', function() {
          describe('in sidebar', function() {
            it('calls redirect()', function() {
              dashboard.$sidebar.trigger('redirect', {destination: 'dashboard'});
              dashboard.redirect.withArgs({destination: 'dashboard'}).calledOnce.should.be.true;
            });
          });

          describe('in home view', function() {
            it('calls redirect()', function() {
              dashboard.$homeView.trigger('redirect', {destination: 'dashboard'});
              dashboard.redirect.withArgs({destination: 'dashboard'}).calledOnce.should.be.true;
            });
          });

          describe('in task view', function() {
            it('calls redirect()', function() {
              dashboard.$taskView.trigger('redirect', {destination: 'dashboard'});
              dashboard.redirect.withArgs({destination: 'dashboard'}).calledOnce.should.be.true;
            });
          });
        });

        describe('redirect:tasks', function() {
          describe('in sidebar', function() {
            it('calls redirect()', function() {
              dashboard.$sidebar.trigger('redirect', {destination: 'tasks'});
              dashboard.redirect.withArgs({destination: 'tasks'}).calledOnce.should.be.true;
            });
          });

          describe('in home view', function() {
            it('calls redirect()', function() {
              dashboard.$homeView.trigger('redirect', {destination: 'tasks'});
              dashboard.redirect.withArgs({destination: 'tasks'}).calledOnce.should.be.true;
            });
          });

          describe('in task view', function() {
            it('calls redirect()', function() {
              dashboard.$homeView.trigger('redirect', {destination: 'tasks'});
              dashboard.redirect.withArgs({destination: 'tasks'}).calledOnce.should.be.true;
            });
          });
        });
      });
    });

    describe('hideDropdownMenus() method', function() {
      beforeEach(function() { dashboard.render(); });

      describe('when not clicking on a menu', function() {
        it('hides visible dropdown menus', function() {
          e = $.Event('click', {target: dashboard.$el.not('ul.nav')});
          dashboard.$('li.dropdown').first().addClass('open');
          dashboard.hideDropdownMenus(e);
          dashboard.$('li.dropdown').should.not.be.visible;
        });
      });

      describe('when clicking on a menu', function() {
        it('doesn\'t hide the menu clicked on', function() {
          dashboard.$('li.dropdown').first().addClass('open');
          e = $.Event('click', {target: dashboard.$('li.dropdown').first().children('ul.dropdown-menu')});
          dashboard.hideDropdownMenus(e);
          dashboard.$('li.dropdown').first().should.be.visible;
        });
      });
    });

    describe('setUser() method', function() {
      it('sets this.user', function() {
        var newDashboard = new DashboardView();
        newDashboard.setUser(user);
        newDashboard.user.should.equal(user);
      });
    });

    describe('showHomeView() method', function() {
      describe('when main dashboard is visible', function() {
        beforeEach(function() { 
          sandbox.stub(dashboard.$el, 'is').withArgs(':visible').returns(true);
        });

        it('removes the task view', function() {
          sandbox.stub(dashboard.$taskView, 'remove');
          dashboard.showHomeView();
          dashboard.$taskView.remove.calledOnce.should.be.true;
        });

        it('renders the home view', function() {
          sandbox.stub(dashboard.$homeView, 'render');
          dashboard.showHomeView();
          dashboard.$homeView.render.calledOnce.should.be.true;
        });

        it('attaches the home view to the DOM', function() {
          dashboard.showHomeView();
          dashboard.$homeView.$el.should.be.visible;
        });

        it('doesn\'t re-render the main dash', function() {
          sandbox.stub(dashboard, 'render');
          dashboard.showHomeView();
          dashboard.render.called.should.be.false;
        });
      });

      describe('when main dashboard is not visible', function() {
        beforeEach(function() { dashboard.remove(); });

        it('renders the main dash', function() {
          sandbox.stub(dashboard, 'render');
          dashboard.showHomeView();
          dashboard.render.calledOnce.should.be.true;
        });
      });
    });

    describe('showTaskView() method', function() {
      describe('when main dashboard is visible', function() {
        beforeEach(function() { 
          sandbox.stub(dashboard.$el, 'is').withArgs(':visible').returns(true);
          sandbox.useFakeServer();
        });

        it('removes the home view', function() {
          sandbox.stub(dashboard.$homeView, 'remove');
          dashboard.showTaskView();
          dashboard.$homeView.remove.calledOnce.should.be.true;
        });

        it('renders the task view', function() {
          sandbox.stub(dashboard.$taskView, 'render');
          dashboard.showTaskView();
          dashboard.$taskView.render.calledOnce.should.be.true;
        });

        it('attaches the task view to the DOM', function() {
          dashboard.showTaskView();
          dashboard.$taskView.$el.should.be.visible;
        });

        it('doesn\'t re-render the main dashboard', function() {
          sandbox.stub(dashboard, 'render');
          dashboard.showTaskView();
          dashboard.render.called.should.be.false;
        });
      });

      describe('when main dashboard is not visible', function() {
        beforeEach(function() { dashboard.remove(); });

        it('renders the main dashboard', function() {
          sandbox.stub(dashboard, 'render');
          dashboard.showTaskView();
          dashboard.render.calledOnce.should.be.true;
        });
      });
    });

    describe('toggleDropdownMenu() method', function() {
      beforeEach(function() {
        dashboard.render();
        dashboard.$('li.dropdown').removeClass('open');
        e = $.Event('click', {target: dashboard.$('li.dropdown').last()});
      });

      describe('when no menus are visible', function() {
        it('displays the menu that was clicked', function() {
          dashboard.toggleDropdownMenu(e);
          dashboard.$('li.dropdown').last().should.be.visible;
        });

        it('doesn\'t display the other menus', function() {
          dashboard.toggleDropdownMenu(e);
          dashboard.$('li.dropdown').first().should.not.be.visible;
        });
      });

      describe('when another menu is visible', function() {
        beforeEach(function() { dashboard.$('li.dropdown').first().addClass('open'); });

        it('hides the visible menu', function() {
          dashboard.toggleDropdownMenu(e);
          dashboard.$('li.dropdown').first().should.not.be.visible;
        });

        it('displays the menu that was clicked', function() {
          dashboard.toggleDropdownMenu(e);
          dashboard.$('li.dropdown').last().should.be.visible;
        });
      });

      describe('when the clicked menu was visible', function() {
        beforeEach(function() { dashboard.$('li.dropdown').last().addClass('open'); });

        it('hides the menu', function() {
          dashboard.toggleDropdownMenu(e);
          dashboard.$('li.dropdown').last().should.not.be.visible;
        });
      });
    });

    describe('render() function', function() {
      it('calls delegateEvents on its sidebar', function() {
        sandbox.spy(dashboard.$sidebar, 'delegateEvents');
        dashboard.render();
        dashboard.$sidebar.delegateEvents.called.should.be.true;
      });

      it('calls delegateEvents on itself', function() {
        sandbox.spy(dashboard, 'delegateEvents');
        dashboard.render();
        dashboard.delegateEvents.calledOnce.should.be.true;
      });
    });

    describe('remove() function', function() {
      beforeEach(function() {
        dashboard.render();
      });

      it('removes the view from the DOM', function() {
        sandbox.spy(Backbone.View.prototype.remove, 'call');
        dashboard.remove();
        Backbone.View.prototype.remove.call.withArgs(dashboard).calledOnce.should.be.true;;
      });

      it('removes the sidebar from the DOM', function() {
        sandbox.spy(dashboard.$sidebar.remove, 'call');
        dashboard.remove();
        dashboard.$sidebar.remove.call.calledOnce.should.be.true;
      });
    });
  });
});