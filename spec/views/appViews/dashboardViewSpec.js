/***************************************************************************
 *                                                                         *
 * TOP-LEVEL DASHBOARD VIEW                                                *
 *                                                                         *
 * The dashboard is the user's main view from which they manage            *
 * everything. The dashboard displays summary information about their      *
 * affairs and links to all their other pages.                             *
 *                                                                         *
 * CONTENTS                                                          LINE  *
 * Requires ......................................................... 97   *
 * Suite ........................................................... 116   *
 *   Filters ....................................................... 122   *
 *   Constructor ................................................... 144   *
 *     calls setUser() ............................................. 145   *
 *     instantiates a sidebar ...................................... 152   *
 *     instantiates a home view .................................... 156   *
 *     instantiates a task view .................................... 160   *
 *     doesn't call render ......................................... 164   *
 *     can be instantiated without a user .......................... 170   *
 *   Static Properties ............................................. 179   *
 *     klass ....................................................... 180   *
 *     family ...................................................... 184   *
 *     superFamily ................................................. 188   *
 *     types ....................................................... 192   *
 *   View Elements.................................................. 204   *
 *     has ID #dashboard-wrapper ................................... 210   *
 *     sidebar ..................................................... 214   *
 *   View Events ................................................... 224   *
 *     click $el ................................................... 234   *
 *     click li.dropdown ........................................... 241   *
 *   Event Callbacks ............................................... 252   *
 *     hideDropdownMenus() ......................................... 256   *
 *       when no menus are open .................................... 257   *
 *       when a menu is open ....................................... 266   *
 *       when the clicked-on object is inside the menu ............. 275   *
 *     toggleDropdownMenu() ........................................ 285   *
 *       when none of the menus is open ............................ 286   *
 *         adds the .open class to the target menu ................. 291   *
 *         doesn't add the .open class to the other menus .......... 296   *
 *       when another menu is open ................................. 301   *
 *         removes the .open class from the open menu .............. 308   *
 *         adds the .open class to the target menu ................. 312   *
 *       when the target menu is open .............................. 317   *
 *         removes the .open class from the target menu ............ 324   *
 *         doesn't open any other menus ............................ 328   *
 *     showHomeView() .............................................. ---   *
 *       when the main dash and home view are visible .............. ---   *
 *         doesn't re-render the main dash ......................... ---   *
 *         renders the home view ................................... ---   *
 *         attaches the home view to the DOM ....................... ---   *
 *       when the main dash and task view are visible .............. ---   *
 *         doesn't re-render the main dash ......................... ---   *
 *         removes the task view ................................... ---   *
 *         renders the home view ................................... ---   *
 *         attaches the home view to the DOM ....................... ---   *
 *       when the main dash isn't visible .......................... ---   *
 *         renders the main dash view .............................. ---   *
 *         renders the home view ................................... ---   *
 *         attaches the home view to the DOM ....................... ---   *
 *     showTaskView() .............................................. ---   *
 *       when the main dash and home view are visible .............. ---   *
 *         doesn't re-render the main dash ......................... ---   *
 *         removes the home view ................................... ---   *
 *         renders the task view ................................... ---   *
 *         attaches the task view to the DOM ....................... ---   *
 *       when the main dash and task view are visible .............. ---   *
 *         doesn't re-render the main dash ......................... ---   *
 *         renders the task view ................................... ---   *
 *         attaches the task view to the DOM ....................... ---   *
 *       when the main dash isn't visible .......................... ---   *
 *         doesn't re-render the main dash ......................... ---   *
 *         renders the task view ................................... ---   *
 *         attaches the task view to the DOM ....................... ---   *
 *   Special Functions .............................................. 69   *
 *     isA() ....................................................... ---   *
 *       returns true with argument * .............................. ---   *
 *       returns false with another argument ....................... ---   *
 *     setUser() .................................................... 69   *
 *       sets this.user ............................................ ---   *
 *       calls setUser on the home view ............................ ---   *
 *       calls setUser on the task view ............................ ---   *
 *   Core Functions ................................................. 97   *
 *     render() ..................................................... 97   *
 *       renders the sidebar view .................................. ---   *
 *       attaches the sidebar view to its .sidebar-collapse div .... ---   *
 *     remove() .................................................... 105   *
 *       removes the sidebar ....................................... ---   *
 *       removes the home view ..................................... ---   *
 *       removes the task view ..................................... ---   *
 *       removes itself using the Backbone.View.prototype .......... ---   *
 *                                                                         *
/***************************************************************************/

/* Requires
/***************************************************************************/

require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/env.js');

var SUT = require(process.cwd() + '/js/views/appViews/dashboardView.js');

var matchers       = require('jasmine-jquery-matchers'),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    UserModel      = require(process.cwd() + '/js/models/userModel.js'),
    TaskModel      = require(process.cwd() + '/js/models/taskModel.js'),
    TaskCollection = require(process.cwd() + '/js/collections/taskCollection.js'),
    context        = describe,
    fcontext       = fdescribe;

/****************************************************************************
 * BEGIN SUITE                                                              *
/****************************************************************************/

describe('Main Dashboard View #travis', function() {
  var dashboard, e, spy;

  /* Filters                 
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  });

  beforeEach(function() {
    dashboard = new SUT({user: user});
  });

  afterEach(function() {
    fixtures.restoreFixtures();
  });

  afterAll(function() {
    dashboard.remove();
    dashboard = null;
    global = _.omit(global, fixtures);
  });

  /* Constructor             
  /**************************************************************************/

  describe('constructor', function() {
    it('calls setUser', function() {
      spyOn(SUT.prototype, 'setUser');
      var newView = new SUT({user: user});
      expect(SUT.prototype.setUser).toHaveBeenCalled();
      expect(SUT.prototype.setUser.calls.argsFor(0)[0]).toEqual(user);
    });

    it('instantiates a sidebar', function() {
      expect(dashboard.sidebarView).toBeA('DashboardSidebarView');
    });

    it('instantiates a home view', function() {
      expect(dashboard.homeView.klass).toEqual('DashboardHomeView');
    });

    it('instantiates a task view', function() {
      expect(dashboard.taskView.klass).toBe('DashboardTaskView');
    });

    it('doesn\'t call render', function() {
      spyOn(SUT.prototype, 'render');
      var newView = new SUT({user: user});
      expect(SUT.prototype.render).not.toHaveBeenCalled();
    });

    it('can be instantiated without a user', function() {
      var newView = new SUT();
      expect(newView.user).not.toExist();
    });
  });

  /* Static Properties
  /****************************************************************************/

  describe('properties', function() {
    it('has klass DashboardView', function() {
      expect(dashboard.klass).toEqual('DashboardView');
    });

    it('has family Canto.View', function() {
      expect(dashboard.family).toEqual('Canto.View');
    });

    it('has superFamily Backbone.View', function() {
      expect(dashboard.superFamily).toEqual('Backbone.View');
    });

    describe('types', function() {
      _.each(['DashboardView', 'Dashboard', 'MainDashboardView', 'MainDashboard', 'TopLevelView'], function(type) {
        it('includes ' + type, function() {
          expect(dashboard.types()).toContain(type);
        });
      });
    });
  });

  /* View Elements
  /****************************************************************************/

  describe('elements', function() {
    beforeEach(function() {
      dashboard.render();
      $('body').html(dashboard.el);
    });

    it('has ID #dashboard-wrapper', function() {
      expect(dashboard.$el).toHaveId('dashboard-wrapper');
    });

    describe('sidebar', function() {
      it('is attached to div.sidebar-collapse element', function() {
        expect(dashboard.$('div.sidebar-collapse')).toHaveDescendant('#side-menu');
      });
    });
  });

  /* View Events
  /****************************************************************************/

  describe('events', function() {
    var newDashboard;

    beforeEach(function() {
      spyOn(SUT.prototype, 'hideDropdownMenus');
      spyOn(SUT.prototype, 'toggleDropdownMenu');
      newDashboard = new SUT({user: user});
      newDashboard.render();
    });

    describe('click $el', function() {
      it('calls hideDropdownMenus', function() {
        newDashboard.$el.click();
        expect(SUT.prototype.hideDropdownMenus).toHaveBeenCalled();
      });
    });

    describe('click li.dropdown', function() {
      it('calls toggleDropdownMenu', function() {
        newDashboard.$('li.dropdown').first().click();
        expect(SUT.prototype.toggleDropdownMenu).toHaveBeenCalled();
      });
    });

    describe('sync user', function() {
      it('calls render()', function() {
        spyOn(SUT.prototype, 'render');
        var newDashboard = new SUT({user: user});
        user.trigger('sync');
        expect(SUT.prototype.render).toHaveBeenCalled();
      });
    });
  });

  /* Event Callbacks
  /****************************************************************************/

  describe('event callbacks', function() {
    beforeEach(function() { dashboard.render(); });
    afterEach(function() { dashboard.remove(); });

    describe('hideDropdownMenus', function() {
      context('when none of the menus is open', function() {
        it('doesn\'t open the menus', function() {
          dashboard.$('li.dropdown').removeClass('open');
          e = $.Event('click', {target: dashboard.$el});
          dashboard.hideDropdownMenus(e);
          expect(dashboard.$('li.dropdown.open')).toHaveLength(0);
        });
      });

      context('when a menu is open', function() {
        it('removes the .open class', function() {
          dashboard.$('li.dropdown').first().addClass('open');
          e = $.Event('click', {target: dashboard.$el});
          dashboard.hideDropdownMenus(e);
          expect(dashboard.$('li.dropdown').first()).not.toHaveClass('open');
        });
      });

      context('when the clicked-on object is inside the menu', function() {
        it('doesn\'t hide the menu', function() {
          dashboard.$('li.dropdown').first().addClass('open');
          e = $.Event('click', {target: dashboard.$('li.dropdown').first().find('ul.dropdown-menu')});
          dashboard.hideDropdownMenus(e);
          expect(dashboard.$('li.dropdown').first()).toHaveClass('open');
        });
      });
    });

    describe('toggleDropdownMenu', function() {
      context('when none of the menus is open', function() {
        beforeEach(function() {
          e = $.Event('click', {target: dashboard.$('a.dropdown-toggle').first()});
          dashboard.toggleDropdownMenu(e);
        });

        it('adds the .open class to the target menu', function() {
          expect(dashboard.$('li.dropdown').first()).toHaveClass('open');
        });

        it('doesn\'t add the .open class to the other menus', function() {
          expect(dashboard.$('li.dropdown').last()).not.toHaveClass('open');
        });
      });

      context('when another menu is open', function() {
        beforeEach(function() {
          dashboard.$('li.dropdown').last().addClass('open');
          e.target = dashboard.$('a.dropdown-toggle').first();
          dashboard.toggleDropdownMenu(e);
        });

        it('removes the .open class from the open menu', function() {
          expect(dashboard.$('li.dropdown').last()).not.toHaveClass('open');
        });

        it('adds the .open class to the target menu', function() {
          expect(dashboard.$('li.dropdown').first()).toHaveClass('open');
        });
      });

      context('when the target menu is open', function() {
        beforeEach(function() {
          dashboard.$('li.dropdown').first().addClass('open');
          e.target = dashboard.$('a.dropdown-toggle').first();
          dashboard.toggleDropdownMenu(e);
        });

        it('removes the .open class from the target menu', function() {
          expect(dashboard.$('li.dropdown').first()).not.toHaveClass('open');
        });

        it('doesn\'t open any other menus', function() {
          expect('li.dropdown.open').not.toExist();
        });
      });
    });

    describe('showHomeView()', function() {
      context('when the main dash and home view are visible', function() {
        beforeEach(function() {
          spyOn(dashboard.$el, 'is').and.returnValue(true);
          dashboard.render();
          $('body').html(dashboard.$el);
        });

        it('doesn\'t re-render the main dash', function() {
          spyOn(dashboard, 'render');
          dashboard.showHomeView();
          expect(dashboard.render).not.toHaveBeenCalled();
        });

        it('renders the home view', function() {
          spyOn(dashboard.homeView, 'render');
          dashboard.showHomeView();
          expect(dashboard.homeView.render).toHaveBeenCalled();
        });

        it('attaches the home view to the DOM', function() {
          dashboard.showHomeView();
          expect(dashboard.homeView.$el).toBeInDom();
        });
      });

      context('when the main dash and task view are visible', function() {
        beforeEach(function() {
          spyOn(dashboard.$el, 'is').and.returnValue(true);
          spyOn(dashboard.taskView.$el, 'is').and.returnValue(true);
        });

        it('doesn\'t re-render the main dash', function() {
          spyOn(dashboard, 'render');
          dashboard.showHomeView();
          expect(dashboard.render).not.toHaveBeenCalled();
        });

        it('removes the task view', function() {
          spyOn(dashboard.taskView, 'remove');
          dashboard.showHomeView();
          expect(dashboard.taskView.remove).toHaveBeenCalled();
        });

        it('renders the home view', function() {
          spyOn(dashboard.homeView, 'render');
          dashboard.showHomeView();
          expect(dashboard.homeView.render).toHaveBeenCalled();
        });

        it('attaches the home view to the DOM', function() {
          dashboard.render();
          $('body').html(dashboard.$el);
          dashboard.homeView.remove();
          dashboard.showHomeView();
          expect(dashboard.homeView.$el).toBeInDom();
        });
      });

      context('when the main dash isn\'t visible', function() {
        beforeEach(function() {
          spyOn(dashboard.$el, 'is').and.returnValue(false);
        });

        it('renders the main dash', function() {
          spyOn(dashboard, 'render');
          dashboard.showHomeView();
          expect(dashboard.render).toHaveBeenCalled();
        });

        it('renders the home view', function() {
          spyOn(dashboard.homeView, 'render');
          dashboard.showHomeView();
          expect(dashboard.homeView.render).toHaveBeenCalled();
        });

        it('attaches the home view to the DOM', function() {
          dashboard.showHomeView();
          $('body').html(dashboard.$el);
          expect(dashboard.homeView.$el).toBeInDom();
        });
      });
    });

    describe('showTaskView', function() {
      context('when the main dash and home view are visible', function() {
        beforeEach(function() {
          spyOn(dashboard.$el, 'is').and.returnValue(true);
          spyOn(dashboard.homeView.$el, 'is').and.returnValue(true);
          spyOn(dashboard.taskView.$el, 'is').and.returnValue(false);
          dashboard.render();
          $('body').html(dashboard.$el);
        });

        it('doesn\'t re-render the main dash', function() {
          spyOn(dashboard, 'render');
          dashboard.showTaskView();
          expect(dashboard.render).not.toHaveBeenCalled();
        });

        it('removes the home view', function() {
          spyOn(dashboard.homeView, 'remove');
          dashboard.showTaskView();
          expect(dashboard.homeView.remove).toHaveBeenCalled();
        });

        it('renders the task view', function() {
          spyOn(dashboard.taskView, 'render');
          dashboard.showTaskView();
          expect(dashboard.taskView.render).toHaveBeenCalled();
        });

        it('attaches the task view to the DOM', function() {
          dashboard.showTaskView();
          expect(dashboard.taskView.$el).toBeInDom();
        });
      });

      context('when the main dash and task view are visible', function() {
        beforeEach(function() {
          spyOn(dashboard.$el, 'is').and.returnValue(true);
          spyOn(dashboard.taskView.$el, 'is').and.returnValue(true);
          dashboard.render();
          $('body').html(dashboard.$el);
        });

        it('doesn\'t re-render the main dash', function() {
          spyOn(dashboard, 'render');
          dashboard.showTaskView();
          expect(dashboard.render).not.toHaveBeenCalled();
        });

        it('renders the task view', function() {
          spyOn(dashboard.taskView, 'render');
          dashboard.showTaskView();
          expect(dashboard.taskView.render).toHaveBeenCalled();
        });

        it('attaches the task view to the DOM', function() {
          dashboard.showTaskView();
          expect(dashboard.taskView.$el).toBeInDom();
        });
      });

      context('when the main dash isn\'t visible', function() {
        beforeEach(function() {
          spyOn(dashboard.$el, 'is').and.returnValue(false);
        });

        it('renders the main dash', function() {
          spyOn(dashboard, 'render');
          dashboard.showTaskView();
          expect(dashboard.render).toHaveBeenCalled();
        });

        it('renders the task view', function() {
          spyOn(dashboard.taskView, 'render');
          dashboard.showTaskView();
          expect(dashboard.taskView.render).toHaveBeenCalled();
        });

        it('attaches the task view to the DOM', function() {
          dashboard.showTaskView();
          $('body').html(dashboard.$el);
          expect(dashboard.taskView.$el).toBeInDom();
        });
      });
    });
  });

  describe('special functions', function() {
    describe('isA()', function() {
      _.each(['DashboardView', 'Dashboard', 'MainDashboardView', 'MainDashboard', 'TopLevelView'], function(type) {
        it('returns true with argument ' + type, function() {
          expect(dashboard.isA(type)).toBe(true);
        });
      });

      it('returns false with another argument', function() {
        expect(dashboard.isA('duck')).toBe(false);
      });
    });

    describe('setUser()', function() {
      it('sets this.user', function() {
        var newView = new SUT(); // we already know this won't set the user
        newView.setUser(user);
        expect(newView.user).toBe(user);
      });

      it('calls setUser on the home view', function() {
        var newView = new SUT();
        spyOn(newView.homeView, 'setUser');
        newView.setUser(user);
        expect(newView.homeView.setUser).toHaveBeenCalledWith(user);
      });

      it('calls setUser on the task view', function() {
        var newView = new SUT();
        spyOn(newView.taskView, 'setUser');
        newView.setUser(user);
        expect(newView.taskView.setUser).toHaveBeenCalled();
      });
    });
  });

  describe('core functions', function() {
    describe('render()', function() {
      it('renders the sidebar view', function() {
        spyOn(dashboard.sidebarView, 'render');
        dashboard.render();
        expect(dashboard.sidebarView.render).toHaveBeenCalled();
      });

      it('inserts the sidebar view into its .sidebar-collapse div', function() {
        dashboard.render();
        $('body').html(dashboard.$el);
        expect(dashboard.sidebarView.el).toBeInDom();
      });
    });

    describe('remove', function() {
      it('removes the home view', function() {
        spyOn(dashboard.homeView, 'remove');
        dashboard.remove();
        expect(dashboard.homeView.remove).toHaveBeenCalled();
      });

      it('removes the task view', function() {
        spyOn(dashboard.taskView, 'remove');
        dashboard.remove();
        expect(dashboard.taskView.remove).toHaveBeenCalled();
      });

      it('removes the sidebar view', function() {
        spyOn(dashboard.sidebarView, 'remove');
        dashboard.remove();
        expect(dashboard.sidebarView.remove).toHaveBeenCalled();
      });

      it('removes itself through the Backbone.View prototype', function() {
        spyOn(Backbone.View.prototype.remove, 'call');
        dashboard.remove();
        expect(Backbone.View.prototype.remove.call.calls.argsFor(0)[0]).toBe(dashboard);
      });
    });
  });
});