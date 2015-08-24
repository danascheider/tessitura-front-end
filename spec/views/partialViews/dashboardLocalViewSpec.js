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

    it('creates an OrganizationCollection view #dashboardLocalView #partialView #view #travis', function() {
      spyOn(Tessitura.OrganizationCollectionView.prototype, 'initialize');
      newView = new Tessitura.DashboardLocalView({user: user});
      expect(Tessitura.OrganizationCollectionView.prototype.initialize).toHaveBeenCalled();
    });

    it('creates a childViews array #dashboardLocalView #partialView #view #travis', function() {
      newView = new Tessitura.DashboardLocalView({user: user});
      expect(typeof newView.childViews).not.toBe('undefined');
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

  /* Event Wiring
  /****************************************************************************/

  describe('event wiring', function() {
    describe('submit #location-form', function() {
      it('calls updateProfile() #dashboardLocalView #partialView #view #travis', function() {
        spyOn(Tessitura.DashboardLocalView.prototype, 'updateProfile');
        newView = new Tessitura.DashboardLocalView({user: user});
        newView.render();
        newView.$('#location-form').submit();
        expect(Tessitura.DashboardLocalView.prototype.updateProfile).toHaveBeenCalled();
      });
    });
  });

  /* Event Callbacks
  /****************************************************************************/

  describe('event callbacks', function() {
    describe('updateProfile()', function() {
      beforeEach(function() {
        e = $.Event('submit', {target: view.$('#location-form')});
      });

      it('calls preventDefault() #dashboardLocalView #partialView #view #travis', function() {
        spyOn(e, 'preventDefault');
        spyOn($, 'ajax');
        view.updateProfile(e);
        expect(e.preventDefault).toHaveBeenCalled();
      });

      it('saves the model #dashboardLocalView #partialView #view #travis', function() {
        spyOn(user, 'save');
        view.updateProfile(e);
        expect(user.save).toHaveBeenCalled();
      });

      it('hides the form #dashboardLocalView #partialView #view #travis', function(done) {
        spyOn($, 'ajax').andCallFake(function(args) { args.success && args.success(); });
        view.updateProfile(e);
        expect(view.$('.alert')).toBeHidden();
        done();
      });
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