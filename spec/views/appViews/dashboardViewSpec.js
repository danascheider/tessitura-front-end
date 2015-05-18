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
 *     showHomeView() .............................................. 374   *
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
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = require('jasmine-jquery-matchers'),
    context        = describe,
    fcontext       = fdescribe;

/****************************************************************************
 * BEGIN SUITE                                                              *
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

    it('instantiates a home view #appView #view #travis', function() {
      expect(dashboard.homeView.klass).toEqual('DashboardHomeView');
    });

    it('instantiates a task view #appView #view #travis', function() {
      expect(dashboard.taskView.klass).toBe('DashboardTaskView');
    });

    it('puts its child views in a childViews array #appView #view #travis', function() {
      expect(dashboard.childViews).toEqual([
        dashboard.sidebarView, dashboard.homeView, dashboard.taskView
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

  /* View Elements
  /****************************************************************************/

  describe('elements', function() {
    beforeEach(function() {
      dashboard.render();
      $('body').html(dashboard.el);
    });

    it('has ID #dashboard-wrapper #appView #view #travis', function() {
      expect(dashboard.$el).toHaveId('dashboard-wrapper');
    });

    describe('sidebar', function() {
      it('is attached to div.sidebar-collapse element #appView #view #travis', function() {
        expect(dashboard.$('div.sidebar-collapse')).toHaveDescendant('#side-menu');
      });
    });

    describe('side-menu icon', function() {
      it('is present in the navbar-brand element #appView #view #travis', function() {
        expect(dashboard.$('.navbar-brand')).toHaveDescendant('i.fa-bars');
      });
    });
  });

  /* View Events
  /****************************************************************************/

  describe('events', function() {
    var newView;

    beforeEach(function() {
      spyOn(Tessitura.DashboardView.prototype, 'hideDropdownMenus');
      spyOn(Tessitura.DashboardView.prototype, 'hideSidebar');
      spyOn(Tessitura.DashboardView.prototype, 'toggleDropdownMenu');
      spyOn(Tessitura.DashboardView.prototype, 'toggleSidebar');
      newView = new Tessitura.DashboardView({user: user});
      newView.render();
    });

    afterEach(function() { newView.destroy(); });

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

    describe('click li.dropdown', function() {
      it('calls toggleDropdownMenu() #appView #view #travis', function() {
        newView.$('li.dropdown').first().click();
        expect(Tessitura.DashboardView.prototype.toggleDropdownMenu).toHaveBeenCalled();
      });
    });

    describe('change user\'s first name', function() {
      afterEach(function() { newView.destroy(); });

      it('calls render() #appView #view #travis', function() {
        spyOn(Tessitura.DashboardView.prototype, 'render');
        newView = new Tessitura.DashboardView({user: user});
        user.trigger('change:first_name');
        expect(Tessitura.DashboardView.prototype.render).toHaveBeenCalled();
      });
    });

    describe('change user\'s last name', function() {
      afterEach(function() { newView.destroy(); });

      it('calls render() #appView #view #travis', function() {
        spyOn(Tessitura.DashboardView.prototype, 'render');
        newView = new Tessitura.DashboardView({user: user});
        user.trigger('change:last_name');
        expect(Tessitura.DashboardView.prototype.render).toHaveBeenCalled();
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

    describe('toggleDropdownMenu', function() {
      context('when none of the menus is open', function() {
        beforeEach(function() {
          e = $.Event('click', {target: dashboard.$('li.dropdown').first()});
          dashboard.toggleDropdownMenu(e);
        });

        it('adds the .open class to the target menu #appView #view #travis', function() {
          expect(dashboard.$('li.dropdown')[0].className).toContain('open');
        });

        it('doesn\'t add the .open class to the other menus #appView #view #travis', function() {
          var index = dashboard.$('li.dropdown').length - 1
          expect(dashboard.$('li.dropdown')[index].className).not.toContain('open');
        });
      });

      context('when another menu is open', function() {
        beforeEach(function() {
          dashboard.$('li.dropdown').last().addClass('open');
          e.target = dashboard.$('li.dropdown').first();
          dashboard.toggleDropdownMenu(e);
        });

        it('removes the .open class from the open menu #appView #view #travis', function() {
          expect(dashboard.$('li.dropdown').last().className).not.toContain('open');
        });

        it('adds the .open class to the target menu #appView #view #travis', function() {
          expect(dashboard.$('li.dropdown')[0].className).toContain('open');
        });
      });

      context('when the target menu is open', function() {
        beforeEach(function() {
          dashboard.$('li.dropdown').first().addClass('open');
          e.target = dashboard.$('a.dropdown-toggle').first();
          dashboard.toggleDropdownMenu(e);
        });

        it('removes the .open class from the target menu #appView #view #travis', function() {
          expect(dashboard.$('li.dropdown')[0].className).not.toContain('open');
        });

        it('doesn\'t open any other menus #appView #view #travis', function() {
          expect('li.dropdown.open').not.toExist();
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
    });

    describe('remove', function() {
      beforeEach(function() {
        spyOn(dashboard.homeView, 'remove').and.callThrough();
        spyOn(dashboard.taskView, 'remove').and.callThrough();
        spyOn(dashboard.sidebarView, 'remove').and.callThrough();
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

      it('removes itself through the Backbone.View prototype #appView #view #travis', function() {
        expect(Backbone.View.prototype.remove.call.calls.argsFor(0)[0]).toBe(dashboard);
      });
    });
  });
});