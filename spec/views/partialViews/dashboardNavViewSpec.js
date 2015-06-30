/* Core Requires
/****************************************************************************/

require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = require('jasmine-jquery-matchers'),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

/* Dashboard Nav View Spec
/******************************************************************************/

describe('Dashboard Nav View', function() {
  var view, newView;

  /* Filters
  /****************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  });

  beforeEach(function() {
    view = new Tessitura.DashboardNavView({model: fixtures.user});
  });

  afterEach(function() {
    restoreFixtures();
    newView && newView.destroy();
  });

  afterAll(function() {
    view.destroy();
    _.omit(global, fixtures);
  });

  /* Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render #dashboardNavView #partialView #view #travis', function() {
      spyOn(Tessitura.DashboardNavView.prototype, 'render');
      newView = new Tessitura.DashboardNavView({model: fixtures.user});
      expect(Tessitura.DashboardNavView.prototype.render).not.toHaveBeenCalled();
    });

    it('calls setUser #dashboardNavView #partialView #view #travis', function() {
      pending('FUFNR');
      spyOn(Tessitura.DashboardNavView.prototype, 'setUser');
      newView = new Tessitura.DashboardNavView({model: fixtures.user});
      expect(Tessitura.DashboardNavView.prototype.setUser).toHaveBeenCalled();
    });

    it('can be instantiated without a user #dashboardNavView #partialView #view #travis', function() {
      newView = new Tessitura.DashboardNavView();
      expect(newView.user).not.toExist();
    });

    it('is instantiated with a sidebar #dashboardNavView #partialView #view #travis', function() {
      newView = new Tessitura.DashboardNavView();
      expect(newView.sidebar).toBeA('DashboardSidebarView');
    });
  });

  /* Elements
  /****************************************************************************/

  describe('DOM elements', function() {
    beforeEach(function() {
      view.render();
      $('body').html(view.$el);
    });

    it('is a nav #dashboardNavView #partialView #view #travis', function() {
      expect(view.$el[0].tagName).toEqual('NAV');
    })

    it('has a sidebar #dashboardNavView #partialView #view #travis', function() {
      expect(view.$('#side-menu')).toBeInDom();
    });

    it('has class .navbar #dashboardNavView #partialView #view #travis', function() {
      expect(view.$el.attr('class')).toContain('navbar');
    });

    it('has class .navbar-default #dashboardNavView #partialView #view #travis', function() {
      expect(view.$el.attr('class')).toContain('navbar-default');
    });

    it('has class navbar-fixed-top #dashboardNavView #partialView #view #travis', function() {
      expect(view.$el.attr('class')).toContain('navbar-fixed-top');
    });
  });

  /* Event Wiring
  /****************************************************************************/

  describe('events', function() {
    describe('click .navbar-header', function() {
      it('calls toggleSidebar() #dashboardNavView #partialView #view #travis', function() {
        spyOn(Tessitura.DashboardNavView.prototype, 'toggleSidebar');
        newView = new Tessitura.DashboardNavView({model: user});
        newView.render();
        newView.$('.navbar-header').first().click();
        expect(Tessitura.DashboardNavView.prototype.toggleSidebar).toHaveBeenCalled();
      });
    });

    describe('click li.dropdown', function() {
      it('calls toggleDropdownMenu #dashboardNavView #partialView #view #travis', function() {
        spyOn(Tessitura.DashboardNavView.prototype, 'toggleDropdownMenu');
        newView = new Tessitura.DashboardNavView({model: user});
        newView.render();
        newView.$('li.dropdown').first().click();
        expect(Tessitura.DashboardNavView.prototype.toggleDropdownMenu).toHaveBeenCalled();
      });
    });

    describe('change user first name', function() {
      it('calls render #dashboardNavView #partialView #view #travis', function() {
        pending('FUFNR');
        spyOn(Tessitura.DashboardNavView.prototype, 'render');
        newView = new Tessitura.DashboardNavView({model: user});
        newView.model.set({first_name: 'Charles'});
        expect(Tessitura.DashboardNavView.prototype.render).toHaveBeenCalled();
      });
    });

    describe('change user last name', function() {
      it('calls render #dashboardNavView #partialView #view #travis', function() {
        pending('FUFNR');
        spyOn(Tessitura.DashboardNavView.prototype, 'render');
        newView = new Tessitura.DashboardNavView({model: user});
        newView.model.set({last_name: 'Callum'});
        expect(Tessitura.DashboardNavView.prototype.render).toHaveBeenCalled();
      });
    });
  });

  /* Event Callbacks
  /****************************************************************************/

  describe('event callbacks', function() {
    describe('toggleDropdownMenu()', function() {
      beforeEach(function() {
        view.render();
        e = $.Event('click', {target: view.$('li.dropdown').first()});
      });

      context('when the dropdown menu is closed', function() {
        it('adds the .open class #dashboardNavView #partialView #view #travis', function() {
          view.toggleDropdownMenu(e);
          expect(view.$('li.dropdown').first().attr('class')).toContain('open');
        });
      });

      context('when the dropdown menu is open', function() {
        beforeEach(function() {
          view.toggleDropdownMenu(e);
        });

        it('removes the .open class #dashboardNavView #partialView #view #travis', function() {
          view.toggleDropdownMenu(e);
          expect(view.$('li.dropdown').first().attr('class')).not.toContain('open');
        });
      });
    });

    describe('toggleSidebar()', function() {
      it('calls slideToggle #dashboardNavView #partialView #view #travis', function() {
        spyOn($.prototype, 'slideToggle');
        view.$('.sidebar-collapse').hide();
        view.toggleSidebar();
        expect($.prototype.slideToggle).toHaveBeenCalled();
      });

      it('hides any visible dropdown menus #dashboardNavView #partialView #view #travis', function() {
        view.$('li.dropdown').first().click();
        view.toggleSidebar();
        expect(view.$('li.dropdown').first().attr('class')).not.toContain('open')
      });
    });
  });

  /* Core View Functions
  /****************************************************************************/

  describe('core view functions', function() {
    describe('render()', function() {
      it('calls render on its sidebar #dashboardNavView #partialView #view #travis', function() {
        spyOn(view.sidebarView, 'render');
        view.render();
        expect(view.sidebarView.render).toHaveBeenCalled();
      });
    });

    describe('remove()', function() {
      it('removes the nav view', function() {
        spyOn(view.navView, 'remove');
        view.remove();
        expect(view.navView.remove).toHaveBeenCalled();
      });

      it('calls Backbone.View.prototype.remove on itself #dashboardNavView #partialView #view #travis', function() {
        spyOn(Tessitura.View.prototype.remove, 'call');
        view.remove();
        expect(Backbone.View.prototype.remove.call).toHaveBeenCalledWith(view);
      });
    }); 
  });

  /* Special Functions
  /****************************************************************************/

  describe('special functions', function() {
    describe('isA()', function() {
      it('returns true with argument DashboardNavView #dashboardNavView #partialView #view #travis', function() {
        expect(view.isA('DashboardNavView')).toBe(true);
      });

      it('returns true with argument PartialView #dashboardNavView #partialView #view #travis', function() {
        expect(view.isA('PartialView')).toBe(true);
      });

      it('returns false with another argument #dashboardNavView #partialView #view #travis', function() {
        expect(view.isA('Corvette')).toBe(false);
      });
    });

    describe('setUser()', function() {
      beforeEach(function() {
        newView = new Tessitura.DashboardNavView();
        newView.setUser(fixtures.user);
      });

      it('sets the user #dashboardNavView #partialView #view #travis', function() {
        expect(newView.model).toBe(fixtures.user);
      });
    });
  });
});