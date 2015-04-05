/* Core Requires
/*****************************************************************************************/

require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

/* Module-Specific Requires
/*****************************************************************************************/

var AppPresenter = require(process.cwd() + '/js/presenters/appPresenter.js');

/* Configuration
/*****************************************************************************************/

var matchers       = require('jasmine-jquery-matchers'),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

/*****************************************************************************************
/* APP PRESENTER SPEC                                                                    *
/*****************************************************************************************/

describe('App Presenter', function() {
  var presenter, spy;

  /* Filters
  /***************************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  });

  beforeEach(function() { 
    presenter = new AppPresenter(); 
  });

  afterEach(function() {
    restoreFixtures();
  });

  afterAll(function() { 
    presenter.destroy();
    _.omit(global, fixtures);
    presenter = null; 
  });

  /* Canto Model Properties
  /***************************************************************************************/

  describe('Canto model properties', function() {
    it('has klass AppPresenter', function() {
      expect(presenter.klass).toBe('AppPresenter');
    });

    it('has family Canto.Model', function() {
      expect(presenter.family).toBe('Canto.Model');
    });

    it('has superFamily Backbone.Model', function() {
      expect(presenter.superFamily).toBe('Backbone.Model');
    });
  });

  /* Presenter Constructor
  /***************************************************************************************/

  describe('constructor', function() {
    it('initializes a homepage view #travis', function() {
      expect(presenter.homepageView.isA('HomepageView')).toBe(true);
    });
  });

  /* Presenter Events
  /***************************************************************************************/

  describe('events', function() {
    describe('redirect:dashboard', function() {
      it('calls emitRedirect #travis', function() {
        pending('fuller implementation of the app as a whole');
      });
    });
  });

  /* Event Callbacks
  /***************************************************************************************/

  describe('event callbacks', function() {
    describe('redirect()', function() {
      beforeEach(function() {
        spy = jasmine.createSpy();
        presenter.on('redirect', spy);
      });

      afterEach(function() { presenter.off('redirect'); });

      it('triggers the redirect event on itself', function() {
        presenter.redirect({destination: 'dashboard'});
        expect(spy).toHaveBeenCalledWith({destination: 'dashboard'});
      });
    });
  });

  /* Special Functions
  /***************************************************************************************/

  describe('special functions', function() {
    describe('getHomepage()', function() {
      it('renders the homepage view', function() {
        spyOn(presenter.homepageView, 'render');
        presenter.getHomepage();
        expect(presenter.homepageView.render).toHaveBeenCalled();
      });
    });

    describe('isA()', function() {
      it('returns true with argument AppPresenter', function() {
        expect(presenter.isAn('AppPresenter')).toBe(true);
      });

      it('returns true with argument Presenter', function() {
        expect(presenter.isA('Presenter')).toBe(true);
      });

      it('returns false with another argument', function() {
        expect(presenter.isA('Backbone.View')).toBe(false);
      });
    });

    describe('removeAll()', function() {
      it('removes the homepage view', function() {
        spyOn(presenter.homepageView, 'remove');
        presenter.removeAll();
        expect(presenter.homepageView.remove).toHaveBeenCalled();
      });
    });
  });
});