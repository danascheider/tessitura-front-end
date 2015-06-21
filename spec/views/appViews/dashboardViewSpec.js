/* Requires
/***************************************************************************/

require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = require('jasmine-jquery-matchers'),
    context        = describe,
    fcontext       = fdescribe;

/* Top Level Dashboard View Spec
/****************************************************************************/

describe('Main Dashboard View', function() {
  var dashboard, newView, user, e, spy;

  /* Filters                 
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
  });

  beforeEach(function() {
    user = new Tessitura.UserModel({id: 1, username: 'testuser', password: 'testuser', email: 'testuser@example.com', first_name: 'Test', last_name: 'User'});
    dashboard = new Tessitura.DashboardView({user: user});
  });

  afterEach(function() {
    user.destroy(); 
    dashboard.destroy();
  });

  afterAll(function() {
    dashboard = null;
  });

  /* Constructor             
  /**************************************************************************/

  describe('constructor', function() {
    afterEach(function() { newView && newView.destroy(); });

    it('calls setUser #appView #view #travis', function() {
      spyOn(Tessitura.DashboardView.prototype, 'setUser');
      newView = new Tessitura.DashboardView({user: user});
      expect(Tessitura.DashboardView.prototype.setUser).toHaveBeenCalled();
      expect(Tessitura.DashboardView.prototype.setUser.calls.argsFor(0)[0]).toEqual(user);
    });

    it('instantiates a sidebar #appView #view #travis', function() {
      expect(dashboard.sidebarView).toBeA('DashboardSidebarView');
    });

    it('instantiates a top navbar #appView #view #travis', function() {
      expect(dashboard.topNavView.klass).toEqual('DashboardTopNavView');
    });

    it('instantiates a home view #appView #view #travis', function() {
      expect(dashboard.homeView.klass).toEqual('DashboardHomeView');
    });

    it('instantiates a profile view #appView #view #travis', function() {
      expect(dashboard.profileView.klass).toEqual('DashboardProfileView');
    });

    it('instantiates a task view #appView #view #travis', function() {
      expect(dashboard.taskView.klass).toBe('DashboardTaskView');
    });

    it('puts its child views in a childViews array #appView #view #travis', function() {
      expect(dashboard.childViews).toEqual([
        dashboard.sidebarView, dashboard.topNavView, dashboard.homeView, dashboard.profileView, dashboard.taskView
      ]);
    });

    it('doesn\'t call render #appView #view #travis', function() {
      spyOn(Tessitura.DashboardView.prototype, 'render');
      newView = new Tessitura.DashboardView({user: user});
      expect(Tessitura.DashboardView.prototype.render).not.toHaveBeenCalled();
    });

    it('can be instantiated without a user #appView #view #travis', function() {
      newView = new Tessitura.DashboardView();
      expect(newView.user).not.toExist();
    });
  });

  /* Static Properties
  /****************************************************************************/

  describe('properties', function() {
    it('has klass DashboardView #appView #view #travis', function() {
      expect(dashboard.klass).toEqual('DashboardView');
    });

    it('has family Tessitura.View #appView #view #travis', function() {
      expect(dashboard.family).toEqual('Tessitura.View');
    });

    it('has superFamily Backbone.View #appView #view #travis', function() {
      expect(dashboard.superFamily).toEqual('Backbone.View');
    });

    describe('types', function() {
      _.each(['DashboardView', 'Dashboard', 'MainDashboardView', 'MainDashboard', 'TopLevelView'], function(type) {
        it('includes ' + type + ' #appView #view #travis', function() {
          expect(dashboard.types()).toContain(type);
        });
      });
    });
  });

  // /* View Elements
  // /****************************************************************************/

  // describe('elements', function() {
  //   beforeEach(function() {
  //     dashboard.render();
  //     $('body').html(dashboard.el);
  //   });

  //   it('has ID #dashboard-wrapper #appView #view #travis', function() {
  //     expect(dashboard.$el).toHaveId('dashboard-wrapper');
  //   });

  //   describe('sidebar', function() {
  //     it('is attached to div.sidebar-collapse element #appView #view #travis', function() {
  //       expect(dashboard.$('div.sidebar-collapse')).toHaveDescendant('#side-menu');
  //     });
  //   });

  //   describe('top navbar', function() {
  //     it('is attached to the nav bar #appView #view #travis', function() {
  //       expect(dashboard.$('nav')).toHaveDescendant('.navbar-top-links');
  //     });
  //   });

  //   describe('side-menu icon', function() {
  //     it('is present in the navbar-brand element #appView #view #travis', function() {
  //       expect(dashboard.$('.navbar-brand')).toHaveDescendant('i.fa-bars');
  //     });
  //   });
  // });

  /* View Events
  /****************************************************************************/

  describe('events', function() {
    var newView;

    beforeEach(function() {
      spyOn(Tessitura.DashboardView.prototype, 'hideDropdownMenus');
      spyOn(Tessitura.DashboardView.prototype, 'hideSidebar');
      spyOn(Tessitura.DashboardView.prototype, 'toggleSidebar');
      spy = jasmine.createSpy();

      newView = new Tessitura.DashboardView({user: user});

      newView.on('redirect', spy);
      newView.render();
    });

    afterEach(function() { 
      newView.off('redirect');
      newView.destroy(); 
    });

    describe('click $el', function() {
      it('calls hideDropdownMenus #appView #view #travis', function() {
        newView.$el.click();
        expect(Tessitura.DashboardView.prototype.hideDropdownMenus).toHaveBeenCalled();
      });
    });

    describe('dblclick $el', function() {
      it('calls hideSidebar #appView #view #travis', function() {
        newView.$el.dblclick();
        expect(Tessitura.DashboardView.prototype.hideSidebar).toHaveBeenCalled();
      });
    });

    describe('click .navbar-header', function() {
      it('calls toggleSidebar #appView #view #travis', function() {
        newView.$('.navbar-header').click();
        expect(Tessitura.DashboardView.prototype.toggleSidebar).toHaveBeenCalled();
      });
    });

    describe('click top nav link', function() {
      it('redirects to the profile page #appView #view #travis', function() {
        newView.$('a.link[href="/#profile"]').first().click();
        expect(spy).toHaveBeenCalledWith({destination: 'profile'});
      });
    });

    describe('redirect from home view', function() {
      it('triggers redirect #appView #view #travis', function() {
        newView.homeView.trigger('redirect', {destination: 'tasks'});
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('redirect from top nav view', function() {
      it('triggers redirect #appView #view #travis', function() {
        newView.topNavView.trigger('redirect', {destination: 'tasks'});
        expect(spy).toHaveBeenCalled();
      });
    });
  });

  /* Event Callbacks
  /****************************************************************************/

  describe('event callbacks', function() {
    beforeEach(function() { dashboard.render(); });
    afterEach(function()  { dashboard.remove(); });

    describe('hideDropdownMenus', function() {
      context('when none of the menus is open', function() {
        it('doesn\'t open the menus #appView #view #travis', function() {
          dashboard.$('li.dropdown').removeClass('open');
          e = $.Event('click', {target: dashboard.$el});
          dashboard.hideDropdownMenus(e);
          expect(dashboard.$('li.dropdown.open')).toHaveLength(0);
        });
      });

      context('when a menu is open', function() {
        it('removes the .open class #appView #view #travis', function() {
          dashboard.$('li.dropdown').first().addClass('open');
          e = $.Event('click', {target: dashboard.$el});
          dashboard.hideDropdownMenus(e);
          expect(dashboard.$('li.dropdown')[0]).not.toContain('open');
        });
      });

      context('when the clicked-on object is inside the menu', function() {
        it('doesn\'t hide the menu #appView #view #travis', function() {
          dashboard.$('li.dropdown').first().addClass('open');
          e = $.Event('click', {target: dashboard.$('li.dropdown').first().find('ul.dropdown-menu')});
          dashboard.hideDropdownMenus(e);
          expect(dashboard.$('li.dropdown')[0].className).toContain('open');
        });
      });
    });

    describe('showHomeView()', function() {
      context('when the home view is visible', function() {
        beforeEach(function() {
          spyOn(dashboard.homeView.$el, 'is').and.returnValue(true);
          spyOn(Tessitura.TaskModel.prototype, 'displayTitle').and.returnValue('Foobar');
          dashboard.render();
          $('body').html(dashboard.$el);
        });

        it('renders the home view #appView #view #travis', function() {
          spyOn(dashboard.homeView, 'render');
          dashboard.showHomeView();
          expect(dashboard.homeView.render).toHaveBeenCalled();
        });

        it('attaches the home view to the DOM #appView #view #travis', function() {
          dashboard.showHomeView();
          expect(dashboard.homeView.$el).toBeInDom();
        });
      });

      context('when the task view is visible', function() {
        beforeEach(function() {
          spyOn(dashboard.taskView.$el, 'is').and.returnValue(true);
          spyOn(Tessitura.TaskModel.prototype, 'displayTitle').and.returnValue('foobar');
        });

        it('doesn\'t re-render the main dash #appView #view #travis', function() {
          spyOn(dashboard, 'render');
          dashboard.showHomeView();
          expect(dashboard.render).not.toHaveBeenCalled();
        });

        it('removes the task view #appView #view #travis', function() {
          spyOn(dashboard.taskView, 'remove');
          dashboard.showHomeView();
          expect(dashboard.taskView.remove).toHaveBeenCalled();
        });

        it('renders the home view #appView #view #travis', function() {
          spyOn(dashboard.homeView, 'render');
          dashboard.showHomeView();
          expect(dashboard.homeView.render).toHaveBeenCalled();
        });

        it('attaches the home view to the DOM #appView #view #travis', function() {
          dashboard.render();
          $('body').html(dashboard.$el);
          dashboard.homeView.remove();
          dashboard.showHomeView();
          expect(dashboard.homeView.$el).toBeInDom();
        });
      });
    });

    describe('showProfileView()', function() {
      context('when the main dash and profile view are visible', function() {
        beforeEach(function() {
          spyOn(dashboard.profileView.$el, 'is').and.returnValue(true);
          dashboard.render();
          $('body').html(dashboard.$el);
        });

        it('doesn\'t re-render the main dash #appView #view #travis', function() {
          spyOn(dashboard, 'render');
          dashboard.showProfileView();
          expect(dashboard.render).not.toHaveBeenCalled();
        });

        it('renders the profile view #appView #view #travis', function() {
          spyOn(dashboard.profileView, 'render');
          dashboard.showProfileView();
          expect(dashboard.profileView.render).toHaveBeenCalled();
        });

        it('attaches the profile view to the DOM #appView #view #travis', function() {
          dashboard.showProfileView();
          expect(dashboard.profileView.$el).toBeInDom();
        });
      });

      context('when the main dash is visible and the profile view isn\'t', function() {
        beforeEach(function() {
          spyOn(dashboard.profileView.$el, 'is').and.returnValue(false);
          dashboard.render();
          $('body').html(dashboard.$el);
        });

        it('doesn\'t re-render the main dash #appView #view #travis', function() {
          spyOn(dashboard, 'render');
          dashboard.showProfileView();
          expect(dashboard.render).not.toHaveBeenCalled();
        });

        it('renders the profile view #appView #view #travis', function() {
          spyOn(dashboard.profileView, 'render');
          dashboard.showProfileView();
          expect(dashboard.profileView.render).toHaveBeenCalled();
        });

        it('attaches the profile view to the DOM #appView #view #travis', function() {
          dashboard.showProfileView();
          expect(dashboard.profileView.$el).toBeInDom();
        });
      });

      context('when the main dash is not visible', function() {
        beforeEach(function() {
          spyOn(dashboard.$el, 'is').and.returnValue(false);
        });

        it('renders the main dash #appView #view #travis', function() {
          spyOn(dashboard, 'render');
          dashboard.showProfileView();
          expect(dashboard.render).toHaveBeenCalled();
        });

        it('renders the profile view #appView #view #travis', function() {
          spyOn(dashboard.profileView, 'render');
          dashboard.showProfileView();
          expect(dashboard.profileView.render).toHaveBeenCalled();
        });

        it('attaches the profile view to itself #appView #view #travis', function() {
          dashboard.showProfileView();
          expect(dashboard.$('#profile-info')).toExist();
        });
      });
    });

    describe('showTaskView', function() {
      context('when the home view is visible', function() {
        beforeEach(function() {
          spyOn(dashboard.homeView.$el, 'is').and.returnValue(true);
          spyOn(dashboard.taskView.$el, 'is').and.returnValue(false);
          dashboard.render();
          $('body').html(dashboard.$el);
        });

        afterEach(function() {
          dashboard.remove();
        });

        it('removes the home view #appView #view #travis', function() {
          spyOn(dashboard.homeView, 'remove');
          dashboard.showTaskView();
          expect(dashboard.homeView.remove).toHaveBeenCalled();
        });

        it('renders the task view #appView #view #travis', function() {
          spyOn(dashboard.taskView, 'render');
          dashboard.showTaskView();
          expect(dashboard.taskView.render).toHaveBeenCalled();
        });

        it('attaches the task view to the DOM #appView #view #travis', function() {
          dashboard.showTaskView();
          expect(dashboard.taskView.$el).toBeInDom();
        });
      });

      context('when the task view is visible', function() {
        beforeEach(function() {
          spyOn(dashboard.taskView.$el, 'is').and.returnValue(true);
          dashboard.render();
          $('body').html(dashboard.$el);
        });

        afterEach(function() { dashboard.remove(); });

        it('renders the task view #appView #view #travis', function() {
          spyOn(dashboard.taskView, 'render');
          dashboard.showTaskView();
          expect(dashboard.taskView.render).toHaveBeenCalled();
        });

        it('attaches the task view to the DOM #appView #view #travis', function() {
          dashboard.showTaskView();
          expect(dashboard.taskView.$el).toBeInDom();
        });
      });
    });
  });

  describe('special functions', function() {
    describe('isA()', function() {
      _.each(['DashboardView', 'Dashboard', 'MainDashboardView', 'MainDashboard', 'TopLevelView'], function(type) {
        it('returns true with argument ' + type + ' #appView #view #travis', function() {
          expect(dashboard.isA(type)).toBe(true);
        });
      });

      it('returns false with another argument #appView #view #travis', function() {
        expect(dashboard.isA('duck')).toBe(false);
      });
    });

    describe('setUser()', function() {
      afterEach(function() { newView.destroy(); });

      it('sets this.user #appView #view #travis', function() {
        newView = new Tessitura.DashboardView(); // we already know this won't set the user
        newView.setUser(user);
        expect(newView.user).toBe(user);
      });

      it('calls setUser on the top nav view #appView #view #travis', function() {
        newView = new Tessitura.DashboardView();
        spyOn(newView.topNavView, 'setUser');
        newView.setUser(user);
        expect(newView.topNavView.setUser).toHaveBeenCalledWith(user);
      });

      it('calls setUser on the home view #appView #view #travis', function() {
        newView = new Tessitura.DashboardView();
        spyOn(newView.homeView, 'setUser');
        newView.setUser(user);
        expect(newView.homeView.setUser).toHaveBeenCalledWith(user);
      });

      it('calls setUser on the task view #appView #view #travis', function() {
        newView = new Tessitura.DashboardView();
        spyOn(newView.taskView, 'setUser');
        newView.setUser(user);
        expect(newView.taskView.setUser).toHaveBeenCalled();
      });

      it('calls setUser on the profile view #appView #view #travis', function() {
        newView = new Tessitura.DashboardView();
        spyOn(newView.profileView, 'setUser');
        newView.setUser(user);
        expect(newView.profileView.setUser).toHaveBeenCalled();
      });
    });
  });

  describe('core functions', function() {
    describe('render()', function() {
      it('renders the sidebar view #appView #view #travis', function() {
        spyOn(dashboard.sidebarView, 'render');
        dashboard.render();
        expect(dashboard.sidebarView.render).toHaveBeenCalled();
      });

      it('inserts the sidebar view into its .sidebar-collapse div #appView #view #travis', function() {
        dashboard.render();
        $('body').html(dashboard.$el);
        expect(dashboard.sidebarView.el).toBeInDom();
        dashboard.remove();
      });

      it('renders the top nav view #appView #view #travis', function() {
        spyOn(dashboard.topNavView, 'render');
        dashboard.render();
        expect(dashboard.topNavView.render).toHaveBeenCalled();
      });

      it('inserts the top nav view into its nav element #appView #view #travis', function() {
        dashboard.render();
        $('body').html(dashboard.$el);
        expect(dashboard.sidebarView.el).toBeInDom();
      });
    });

    describe('remove', function() {
      beforeEach(function() {
        spyOn(dashboard.homeView, 'remove').and.callThrough();
        spyOn(dashboard.taskView, 'remove').and.callThrough();
        spyOn(dashboard.sidebarView, 'remove').and.callThrough();
        spyOn(dashboard.profileView, 'remove').and.callThrough();
        spyOn(dashboard.topNavView, 'remove').and.callThrough();
        spyOn(Backbone.View.prototype.remove, 'call').and.callThrough();
        dashboard.remove();
      });

      it('removes the home view #appView #view #travis', function() {
        expect(dashboard.homeView.remove).toHaveBeenCalled();
      });

      it('removes the task view #appView #view #travis', function() {
        expect(dashboard.taskView.remove).toHaveBeenCalled();
      });

      it('removes the sidebar view #appView #view #travis', function() {
        expect(dashboard.sidebarView.remove).toHaveBeenCalled();
      });

      it('removes the top nav view #appView #view #travis', function() {
        expect(dashboard.topNavView.remove).toHaveBeenCalled();
      });

      it('removes the profile view #appView #view #travis', function() {
        expect(dashboard.profileView.remove).toHaveBeenCalled();
      });

      it('removes itself through the Backbone.View prototype #appView #view #travis', function() {
        expect(Backbone.View.prototype.remove.call).toHaveBeenCalledWith(dashboard);
      });
    });
  });
});