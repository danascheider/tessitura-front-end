/* istanbul ignore require */
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

/* istanbul ignore next */
var matchers       = require('jasmine-jquery-matchers'),
    context        = describe,
    fcontext       = fdescribe;

/* Main Dashboard View Spec
/****************************************************************************/

/* istanbul ignore next */
describe('Main Dashboard View', function() {
  var dashboard, newView, user, e, spy;

  /* Filters                 
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
  });

  beforeEach(function() {
    user = new Tessitura.UserModel({id: 1, username: 'testuser', password: 'testuser', email: 'testuser@example.com', first_name: 'Test', last_name: 'User'});
    dashboard = new Tessitura.DashboardView({model: user});
  });

  afterEach(function() {
    user.destroy(); 
    dashboard && dashboard.destroy();
  });

  afterAll(function() {
    dashboard = null;
  });

  /* Constructor             
  /**************************************************************************/

  describe('constructor', function() {
    afterEach(function() { newView && newView.destroy(); });

    it('calls setUser #dashboardView #appView #view #travis', function() {
      spyOn(Tessitura.DashboardView.prototype, 'setUser');
      newView = new Tessitura.DashboardView({model: user});
      expect(Tessitura.DashboardView.prototype.setUser).toHaveBeenCalled();
      expect(Tessitura.DashboardView.prototype.setUser.calls.argsFor(0)[0]).toEqual(user);
    });

    it('instantiates a nav view #dashboardView #appView #view #travis', function() {
      expect(dashboard.navView).toBeA('DashboardNavView');
    });

    it('puts its child views in a childViews array #dashboardView #appView #view #travis', function() {
      expect(dashboard.childViews).toEqual([dashboard.navView]);
    });

    it('doesn\'t call render #dashboardView #appView #view #travis', function() {
      spyOn(Tessitura.DashboardView.prototype, 'render');
      newView = new Tessitura.DashboardView({model: user});
      expect(Tessitura.DashboardView.prototype.render).not.toHaveBeenCalled();
    });

    it('can be instantiated without a user #dashboardView #appView #view #travis', function() {
      newView = new Tessitura.DashboardView();
      expect(newView.user).not.toExist();
    });
  });

  /* View Elements
  /****************************************************************************/

  describe('elements', function() {
    beforeEach(function() {
      dashboard.setUser(user);
      dashboard.render();
      $('body').html(dashboard.el);
    });

    it('has ID #dashboard-wrapper #dashboardView #appView #view #travis', function() {
      expect(dashboard.$el).toHaveId('dashboard-wrapper');
    });
  });

  /* View Events
  /****************************************************************************/

  describe('events', function() {
    beforeEach(function() {
      spyOn(Tessitura.DashboardView.prototype, 'hideDropdownMenus');
      spyOn(Tessitura.DashboardView.prototype, 'hideSidebar');
      spyOn(Tessitura.DashboardView.prototype, 'hideShade');
      spyOn(Tessitura.DashboardView.prototype, 'followLink');
      newView = new Tessitura.DashboardView({model: user});
    });

    afterEach(function() { 
      newView.destroy(); 
    });

    describe('click $el', function() {
      it('calls hideDropdownMenus() #dashboardView #appView #view #travis', function() {
        newView.$el.click();
        expect(Tessitura.DashboardView.prototype.hideDropdownMenus).toHaveBeenCalled();
      });
    });

    describe('dblclick $el', function() {
      it('calls hideSidebar() #dashboardView #appView #view #travis', function() {
        newView.$el.dblclick();
        expect(Tessitura.DashboardView.prototype.hideSidebar).toHaveBeenCalled();
      });
    });

    describe('click top nav link', function() {
      it('calls followLink() #dashboardView #appView #view #travis', function() {
        pending('FUFNR');
        newView.$('a.internal-link[data-target="profile"]').first().click();
        expect(Tessitura.DashboardView.prototype.followLink).toHaveBeenCalled();
      });
    });

    describe('dblclick #shade', function() {
      beforeEach(function() {
        $('body').html(newView.render().$el);
        newView.$('#shade').show();
      });

      afterEach(function() {
        newView.remove();
      });

      it('calls hideShade() #dashboardView #appView #view #travis', function() {
        newView.$('#shade').dblclick();
        expect(Tessitura.DashboardView.prototype.hideShade).toHaveBeenCalled();
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

    describe('emitRedirect()', function() {
      it('triggers the redirect event #dashboardView #appView #view #travis', function() {
        spy = jasmine.createSpy();
        dashboard.on('redirect', spy);
        dashboard.emitRedirect({destination: 'dashboard'});
        expect(spy).toHaveBeenCalledWith({destination: 'dashboard'});
      });
    });

    describe('followLink()', function() {
      beforeEach(function() {
        spyOn(dashboard, 'emitRedirect');
        spyOn($.prototype, 'attr').and.returnValue('profile');
        dashboard.followLink($.Event('click', {target: dashboard.$('.internal-link').first()}));
      });

      it('calls emitRedirect #dashboardView #appView #view #travis', function() {
        expect(dashboard.emitRedirect).toHaveBeenCalledWith({destination: 'profile'});
      });
    });

    describe('hideDropdownMenus()', function() {
      context('when none of the menus is open', function() {
        it('doesn\'t open the menus #dashboardView #appView #view #travis', function() {
          dashboard.$('li.dropdown').removeClass('open');
          e = $.Event('click', {target: dashboard.$el});
          dashboard.hideDropdownMenus(e);
          expect(dashboard.$('li.dropdown.open')).toHaveLength(0);
        });
      });

      context('when a menu is open', function() {
        it('removes the .open class #dashboardView #appView #view #travis', function() {
          dashboard.$('li.dropdown').first().addClass('open');
          e = $.Event('click', {target: dashboard.$el});
          dashboard.hideDropdownMenus(e);
          expect(dashboard.$('li.dropdown').attr('class')).not.toContain('open');
        });
      });

      context('when the clicked-on object is inside the menu', function() {
        it('doesn\'t hide the menu #dashboardView #appView #view #travis', function() {
          pending('Decide if this is actually how I want this to work');
          dashboard.$('li.dropdown').first().addClass('open');
          e = $.Event('click', {target: dashboard.$('li.dropdown').first().find('ul.dropdown-menu')});
          dashboard.hideDropdownMenus(e);
          expect(dashboard.navView.$('li.dropdown').attr('class')).toContain('open');
        });
      });
    });

    describe('hideShade()', function() {
      it('triggers the hideShade event #dashboardView #appView #view #travis', function() {
        spy = jasmine.createSpy();
        dashboard.on('hideShade', spy);
        dashboard.hideShade();
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('hideSidebar()', function() {
      context('when the target is in the sidebar', function() {
        it('doesn\'t call slideUp #dashboardView #appView #view #travis', function() {
          spyOn($.prototype, 'slideUp');
          e = $.Event('dblclick', {target: dashboard.navView.sidebarView.$el});
          dashboard.hideSidebar(e);
          expect($.prototype.slideUp).not.toHaveBeenCalled();
        });
      });

      context('when the target isn\'t in the sidebar', function() {
        beforeEach(function() {
          $('body').html(dashboard.render().$el);
        });

        it('calls slideUp #dashboardView #appView #view #travis', function() {
          pending('FUFNR');
          spyOn($.prototype, 'slideUp');
          dashboard.hideSidebar();
          expect($.prototype.slideUp).toHaveBeenCalled();
        });
      });
    });
  });

  describe('special functions', function() {
    describe('setUser()', function() {
      afterEach(function() { newView.destroy(); });

      it('sets this.model #dashboardView #appView #view #travis', function() {
        newView = new Tessitura.DashboardView(); // we already know this won't set the user
        newView.setUser(user);
        expect(newView.model).toBe(user);
      });
    });
  });

  describe('core functions', function() {
    describe('render()', function() {
      beforeEach(function() {
        dashboard.setUser(user);
      });

      it('renders the nav view #dashboardView #appView #view #travis', function() {
        spyOn(dashboard.navView, 'render');
        dashboard.render();
        expect(dashboard.navView.render).toHaveBeenCalled();
      });

      it('inserts the nav view into its el #dashboardView #appView #view #travis', function() {
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

      it('removes itself through the Tessitura.View prototype #dashboardView #appView #view #travis', function() {
        expect(Tessitura.View.prototype.remove).toHaveBeenCalled();
      });
    });
  });
});