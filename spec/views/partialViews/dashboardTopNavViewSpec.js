/* Core Requires
/****************************************************************************/

require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = _.extend(require('jasmine-jquery-matchers'), require(process.cwd() + '/spec/support/matchers/toBeA.js')),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

var DashboardTopNavView = require(process.cwd() + '/js/views/partialViews/dashboardTopNavView.js');

/* Dashboard Top Nav View Spec
/****************************************************************************/

describe('Tessitura.DashboardTopNavView', function() {
  var view, newView, e;

  /* Filters
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  })

  beforeEach(function() {
    view = new DashboardTopNavView();
  });

  afterEach(function() {
    restoreFixtures();
  });

  afterAll(function() {
    view.destroy();
    global = _.omit(global, fixtures);
  });

  /* Static Properties
  /**************************************************************************/

  describe('properties', function() {
    it('has klass DashboardTopNavView #partialView #view #travis', function() {
      expect(view.klass).toEqual('DashboardTopNavView');
    });

    it('has family Tessitura.View #partialView #view #travis', function() {
      expect(view.family).toEqual('Tessitura.View');
    });

    it('has superFamily Backbone.View #partialView #view #travis', function() {
      expect(view.superFamily).toEqual('Backbone.View');
    });
  });

  /* View Constructor
  /**************************************************************************/

  describe('constructor', function() {
    afterEach(function() { newView.destroy(); });

    it('does not call render #partialView #view #travis', function() {
      spyOn(DashboardTopNavView.prototype, 'render');
      newView = new DashboardTopNavView();
      expect(DashboardTopNavView.prototype.render).not.toHaveBeenCalled();
    });

    it('can be instantiated without a user #partialView #view #travis', function() {
      newView = new DashboardTopNavView();
      expect(newView.model).not.toExist();
    });
  });

  /* Elements
  /**************************************************************************/

  describe('view elements', function() {
    //
  });

  /* Event Wiring
  /**************************************************************************/

  describe('view events', function() {
    beforeEach(function() {
      spyOn(DashboardTopNavView.prototype, 'toggleDropdownMenu');
      spyOn(DashboardTopNavView.prototype, 'render');
      newView = new DashboardTopNavView({model: user});
    });

    afterEach(function() { newView.destroy(); });

    describe('click li.dropdown', function() {
      it('calls toggleDropdownMenu #partialView #view #travis', function() {
        newView.render();
        newView.$('li.dropdown').click();
        expect(DashboardTopNavView.prototype.toggleDropdownMenu).toHaveBeenCalled();
      });
    });

    describe('change user\'s first name', function() {
      beforeEach(function() {
        spyOn($, 'ajax').and.callFake(function(args) { args.success(); });
      });

      it('calls render #partialView #view #travis', function() {
        user.save({first_name: 'Jim-Bob'});
        expect(DashboardTopNavView.prototype.render).toHaveBeenCalled();
      });
    });

    describe('change user\'s last name', function() {
      beforeEach(function() {
        spyOn($, 'ajax').and.callFake(function(args) { args.success(); });
      });

      it('calls render #partialView #view #travis', function() {
        user.save({last_name: 'Duggar'});
        expect(DashboardTopNavView.prototype.render).toHaveBeenCalled();
      })
    });
  });

  /* Event Callbacks
  /**************************************************************************/

  describe('event callbacks', function() {
    describe('toggleDropdownMenu', function() {
      beforeEach(function() {
        e = $.Event('click', {target: view.$('li.dropdown').first()});
        view.setUser(user).render();
      });

      context('when none of the menus is open', function() {
        beforeEach(function() {
          view.$('li.dropdown.open').removeClass('open');
          view.toggleDropdownMenu(e);
        });

        it('adds the .open class to the target menu #partialView #view #travis', function() {
          expect(view.$('li.dropdown').first().attr('class')).toContain('open');
        });

        it('doesn\'t add the .open class to the other menus #partialView #view #travis', function() {
          expect(view.$('li.dropdown').last().attr('class')).not.toContain('open');
        });
      });

      context('when another menu is open', function() {
        beforeEach(function() {
          view.$('li.dropdown').last().addClass('open');
          view.toggleDropdownMenu(e);
        });

        it('removes the .open class from the open menu #partialView #view #travis', function() {
          expect(view.$('li.dropdown').last().attr('class')).not.toContain('open');
        });

        it('adds the .open class to the target menu #partialView #view #travis', function() {
          expect(view.$('li.dropdown').first().attr('class')).toContain('open');
        });
      });

      context('when the target menu is open', function() {
        beforeEach(function() {
          view.$('li.dropdown.open').removeClass('open');
          view.$('li.dropdown').first().addClass('open');
          view.toggleDropdownMenu(e);
        });

        it('removes the .open class #partialView #view #travis', function() {
          expect(view.$('li.dropdown.open')).not.toExist();
        })
      });
    });
  });

  /* Core View Functions
  /**************************************************************************/

  describe('core view functions', function() {
    describe('render()', function() {
      beforeEach(function() {
        view.setUser(user);
        view.render();
      });

      it('doesn\'t attach itself to the DOM #partialView #view #travis', function() {
        view.render();
        expect(view.$el).not.toBeInDom();
      });
    });
  });

  /* Special Functions
  /**************************************************************************/

  describe('special functions', function() {
    describe('isA()', function() {
      it('returns true with argument DashboardTopNavView #partialView #view #travis', function() {
        expect(view.isA('DashboardTopNavView')).toBe(true);
      });

      it('returns true with argument TopNavView #partialView #view #travis', function() {
        expect(view.isA('TopNavView')).toBe(true);
      });

      it('returns true with argument DashboardView #partialView #view #travis', function() {
        expect(view.isA('DashboardView')).toBe(true);
      });

      it('returns false with another argument #partialView #view #travis', function() {
        expect(view.isA('Corvette')).toBe(false);
      });
    });
  });
});