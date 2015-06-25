require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = require('jasmine-jquery-matchers'),
    context        = describe,
    fcontext       = fdescribe;

/* Main Dashboard View Spec
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

    it('instantiates a profile view #appView #view #travis', function() {
      expect(dashboard.profileView.klass).toEqual('UserProfileView');
    });

    it('instantiates a task view #appView #view #travis', function() {
      expect(dashboard.taskView.klass).toBe('DashboardTaskView');
    });

    it('puts its child views in a childViews array #appView #view #travis', function() {
      expect(dashboard.childViews).toEqual([
        dashboard.sidebarView, dashboard.homeView, dashboard.profileView, dashboard.taskView
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
      _.each(['DashboardView', 'Dashboard', 'MainDashboardView', 'TopLevelView'], function(type) {
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
    beforeEach(function() {
      spyOn(Tessitura.DashboardView.prototype, 'hideDropdownMenus');
      spyOn(Tessitura.DashboardView.prototype, 'hideSidebar');
      spy = jasmine.createSpy();

      newView = new Tessitura.DashboardView({model: user});

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

    describe('click top nav link', function() {
      it('redirects to the profile page #appView #view #travis', function() {
        newView.$('a.internal-link[data-target="profile"]').click();
        expect(spy).toHaveBeenCalledWith({destination: 'profile'});
      });
    });
  });

  /* Event Callbacks
  /****************************************************************************/

  describe('event callbacks', function() {
    beforeEach(function() { 
      dashboard.setUser(user);
      dashboard.render(); 
    });

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
          expect(dashboard.$('li.dropdown').attr('class')).not.toContain('open');
        });
      });

      context('when the clicked-on object is inside the menu', function() {
        it('doesn\'t hide the menu #appView #view #travis', function() {
          pending('Decide if this is actually how I want this to work');
          dashboard.$('li.dropdown').first().addClass('open');
          e = $.Event('click', {target: dashboard.$('li.dropdown').first().find('ul.dropdown-menu')});
          dashboard.hideDropdownMenus(e);
          expect(dashboard.navView.$('li.dropdown').attr('class')).toContain('open');
        });
      });
    });
  });

  describe('special functions', function() {
    describe('isA()', function() {
      _.each(['DashboardView', 'Dashboard', 'MainDashboardView', 'TopLevelView'], function(type) {
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

      it('sets this.model #appView #view #travis', function() {
        newView = new Tessitura.DashboardView(); // we already know this won't set the user
        newView.setUser(user);
        expect(newView.model        ).toBe(user);
      });
    });
  });

  describe('core functions', function() {
    describe('render()', function() {
      beforeEach(function() {
        dashboard.setUser(user);
      });

      it('renders the nav view #appView #view #travis', function() {
        spyOn(dashboard.navView, 'render');
        dashboard.render();
        expect(dashboard.navView.render).toHaveBeenCalled();
      });

      it('inserts the nav view into its el #appView #view #travis', function() {
        pending('FUFNR');
        dashboard.render();
        $('body').html(dashboard.$el);
        expect(dashboard.navView.$el).toBeInDom();
        dashboard.remove();
      });
    });

    describe('remove', function() {
      beforeEach(function() {
        spyOn(Tessitura.View.prototype, 'remove').and.callThrough();
        dashboard.remove();
      });

      it('removes itself through the Tessitura.View prototype #appView #view #travis', function() {
        expect(Tessitura.View.prototype.remove).toHaveBeenCalled();
      });
    });
  });
});