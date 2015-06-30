/* Core Requires
/*****************************************************************************************/

/* istanbul ignore require */
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');
require(process.cwd() + '/js/tessitura.js');

/* Configuration
/*****************************************************************************************/

/* istanbul ignore next */
var matchers       = require('jasmine-jquery-matchers'),
    context        = describe,
    fcontext       = fdescribe;

/*****************************************************************************************
/* APP PRESENTER SPEC                                                                    *
/*****************************************************************************************/

/* istanbul ignore next */
describe('App Presenter', function() {
  var presenter, newPresenter, spy;

  /* Filters
  /***************************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
  });

  beforeEach(function() { 
    presenter = new Tessitura.AppPresenter(); 
  });

  afterAll(function() { 
    presenter.destroy();
    presenter = null; 
  });

  /* Tessitura Model Properties
  /***************************************************************************************/

  describe('Tessitura model properties', function() {
    it('has klass AppPresenter #presenter #travis', function() {
      expect(presenter.klass).toBe('AppPresenter');
    });

    it('has family Tessitura.Model #presenter #travis', function() {
      expect(presenter.family).toBe('Tessitura.Model');
    });

    it('has superFamily Backbone.Model #presenter #travis', function() {
      expect(presenter.superFamily).toBe('Backbone.Model');
    });
  });

  /* Presenter Constructor
  /***************************************************************************************/

  describe('constructor', function() {
    it('initializes a homepage view #presenter #travis #presenter #travis', function() {
      expect(presenter.homepageView.isA('HomepageView')).toBe(true);
    });
  });

  /* Presenter Events
  /***************************************************************************************/

  describe('events', function() {
    describe('redirect:dashboard', function() {
      beforeEach(function() {
        spyOn(Tessitura.AppPresenter.prototype, 'emitRedirect');
        newPresenter = new Tessitura.AppPresenter();
      });

      afterEach(function() { newPresenter.destroy(); });

      it('calls emitRedirect #presenter #travis', function() {
        newPresenter.homepageView.trigger('redirect', {destination: 'dashboard'});
        expect(Tessitura.AppPresenter.prototype.emitRedirect).toHaveBeenCalledWith({destination: 'dashboard'});
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
        user = new Tessitura.UserModel({username: 'testuser', password: 'testuser', id: 1});
      });

      afterEach(function() { 
        presenter.off('redirect'); 
        user.destroy();
      });

      it('triggers the redirect event on itself #presenter #travis', function() {
        presenter.emitRedirect({destination: 'dashboard', user: user});
        expect(spy).toHaveBeenCalledWith({destination: 'dashboard', user: user});
      });
    });
  });

  /* Special Functions
  /***************************************************************************************/

  describe('special functions', function() {
    describe('getHomepage()', function() {
      it('renders the homepage view #presenter #travis', function() {
        spyOn(presenter.homepageView, 'render');
        presenter.getHomepage();
        expect(presenter.homepageView.render).toHaveBeenCalled();
      });
    });

    describe('isA()', function() {
      it('returns true with argument AppPresenter #presenter #travis', function() {
        expect(presenter.isAn('AppPresenter')).toBe(true);
      });

      it('returns true with argument Presenter #presenter #travis', function() {
        expect(presenter.isA('Presenter')).toBe(true);
      });

      it('returns false with another argument #presenter #travis', function() {
        expect(presenter.isA('Backbone.View')).toBe(false);
      });
    });

    describe('removeAll()', function() {
      it('removes the homepage view #presenter #travis', function() {
        spyOn(presenter.homepageView, 'remove');
        presenter.removeAll();
        expect(presenter.homepageView.remove).toHaveBeenCalled();
      });
    });
  });
});