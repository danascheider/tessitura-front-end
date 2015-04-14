/* Core Requires
/*****************************************************************************************/

require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');
require(process.cwd() + '/js/canto.js');

/* Configuration
/*****************************************************************************************/

var matchers       = require('jasmine-jquery-matchers'),
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
  });

  beforeEach(function() { 
    presenter = new Canto.AppPresenter(); 
  });

  afterAll(function() { 
    presenter.destroy();
    presenter = null; 
  });

  /* Canto Model Properties
  /***************************************************************************************/

  describe('Canto model properties', function() {
    it('has klass AppPresenter #travis', function() {
      expect(presenter.klass).toBe('AppPresenter');
    });

    it('has family Canto.Model #travis', function() {
      expect(presenter.family).toBe('Canto.Model');
    });

    it('has superFamily Backbone.Model #travis', function() {
      expect(presenter.superFamily).toBe('Backbone.Model');
    });
  });

  /* Presenter Constructor
  /***************************************************************************************/

  describe('constructor', function() {
    it('initializes a homepage view #travis #travis', function() {
      expect(presenter.homepageView.isA('HomepageView')).toBe(true);
    });
  });

  /* Presenter Events
  /***************************************************************************************/

  describe('events', function() {
    describe('redirect:dashboard', function() {
      it('calls emitRedirect #travis', function() {
        spyOn(Canto.AppPresenter.prototype, 'emitRedirect');
        var newPresenter = new Canto.AppPresenter();
        newPresenter.homepageView.trigger('redirect', {destination: 'dashboard'});
        expect(Canto.AppPresenter.prototype.emitRedirect).toHaveBeenCalledWith({destination: 'dashboard'});
      });
    });
  });

  /* Event Callbacks
  /***************************************************************************************/

  describe('event callbacks', function() {
    describe('emitRedirect()', function() {
      var user;

      beforeEach(function() {
        spy = jasmine.createSpy();
        presenter.on('redirect', spy);
        user = new Canto.UserModel({username: 'testuser', password: 'testuser', id: 342});
      });

      afterEach(function() { presenter.off('redirect'); });

      it('triggers the redirect event on itself #travis', function() {
        presenter.emitRedirect({destination: 'dashboard', user: user});
        expect(spy).toHaveBeenCalledWith({destination: 'dashboard', user: user});
      });
    });
  });

  /* Special Functions
  /***************************************************************************************/

  describe('special functions', function() {
    describe('getHomepage()', function() {
      it('renders the homepage view #travis', function() {
        spyOn(presenter.homepageView, 'render');
        presenter.getHomepage();
        expect(presenter.homepageView.render).toHaveBeenCalled();
      });
    });

    describe('isA()', function() {
      it('returns true with argument AppPresenter #travis', function() {
        expect(presenter.isAn('AppPresenter')).toBe(true);
      });

      it('returns true with argument Presenter #travis', function() {
        expect(presenter.isA('Presenter')).toBe(true);
      });

      it('returns false with another argument #travis', function() {
        expect(presenter.isA('Backbone.View')).toBe(false);
      });
    });

    describe('removeAll()', function() {
      it('removes the homepage view #travis', function() {
        spyOn(presenter.homepageView, 'remove');
        presenter.removeAll();
        expect(presenter.homepageView.remove).toHaveBeenCalled();
      });
    });
  });
});