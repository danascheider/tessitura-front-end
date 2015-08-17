require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = _.extend(require('jasmine-jquery-matchers'), require(process.cwd() + '/spec/support/matchers/toBeA.js')),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    ccontext       = ddescribe;

describe('Dashboard Local View', function() {
  var view, newView, e, spy;

  /* Filters
  /**************************************************************************/
  beforeEach(function() {
    this.addMatchers(matchers);
    _.extend(global, fixtures);
    view = new Tessitura.DashboardLocalView({user: user});
  });

  afterEach(function() {
    restoreFixtures();
    view && view.destroy();
    newView && newView.destroy();
    _.omit(global, fixtures);
  });

  /* View Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render #partialView #view #travis', function() {
      spyOn(Tessitura.DashboardLocalView.prototype, 'render');
      newView = new Tessitura.DashboardLocalView({user: user});
      expect(Tessitura.DashboardLocalView.prototype.render).not.toHaveBeenCalled();
    });

    it('calls setUser if a user is present #dashboardLocalView #partialView #view #travis', function() {
      spyOn(Tessitura.DashboardLocalView.prototype, 'setUser');
      newView = new Tessitura.DashboardLocalView({user: user});
      expect(Tessitura.DashboardLocalView.prototype.setUser).toHaveBeenCalledWith(user);
    });

    it('can be instantiated without a user #dashboardLocalView #partialView #view #travis', function() {
      newView = new Tessitura.DashboardLocalView();
      expect(typeof newView.user).toBe('undefined');
    });
  });

  /* Elements
  /**************************************************************************/

  describe('view elements', function() {
    beforeEach(function() {
      view.render();
    });

    it('is a div #dashboardLocalView #partialView #view #travis', function() {
      expect(view.$el[0].tagName).toBe('DIV');
    });

    it('has ID #page-wrapper #dashboardLocalView #partialView #view #travis', function() {
      expect(view.$el.attr('id')).toBe('page-wrapper');
    });
  });

  /* Special Functions
  /****************************************************************************/

  describe('special functions', function() {
    describe('setUser()', function() {
      it('sets the user #dashboardLocalView #partialView #view #travis', function() {
        newView = new Tessitura.DashboardLocalView();
        newView.setUser(user);
        expect(newView.user.isA('UserModel')).toBe(true);
      });
    });
  });
});