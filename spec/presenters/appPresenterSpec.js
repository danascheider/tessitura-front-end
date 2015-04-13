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
    it('#travis has klass AppPresenter', function() {
      expect(presenter.klass).toBe('AppPresenter');
    });

    it('#travis has family Canto.Model', function() {
      expect(presenter.family).toBe('Canto.Model');
    });

    it('#travis has superFamily Backbone.Model', function() {
      expect(presenter.superFamily).toBe('Backbone.Model');
    });
  });

  /* Presenter Constructor
  /***************************************************************************************/

  describe('constructor', function() {
    it('#travis initializes a homepage view #travis', function() {
      expect(presenter.homepageView.isA('HomepageView')).toBe(true);
    });
  });

  /* Presenter Events
  /***************************************************************************************/

  describe('events', function() {
    describe('redirect:dashboard', function() {
      it('#travis calls emitRedirect', function() {
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

      it('#travis triggers the redirect event on itself', function() {
        presenter.emitRedirect({destination: 'dashboard', user: user});
        expect(spy).toHaveBeenCalledWith({destination: 'dashboard', user: user});
      });
    });
  });

  /* Special Functions
  /***************************************************************************************/

  describe('special functions', function() {
    describe('getHomepage()', function() {
      it('#travis renders the homepage view', function() {
        spyOn(presenter.homepageView, 'render');
        presenter.getHomepage();
        expect(presenter.homepageView.render).toHaveBeenCalled();
      });
    });

    describe('isA()', function() {
      it('#travis returns true with argument AppPresenter', function() {
        expect(presenter.isAn('AppPresenter')).toBe(true);
      });

      it('#travis returns true with argument Presenter', function() {
        expect(presenter.isA('Presenter')).toBe(true);
      });

      it('#travis returns false with another argument', function() {
        expect(presenter.isA('Backbone.View')).toBe(false);
      });
    });

    describe('removeAll()', function() {
      it('#travis removes the homepage view', function() {
        spyOn(presenter.homepageView, 'remove');
        presenter.removeAll();
        expect(presenter.homepageView.remove).toHaveBeenCalled();
      });
    });
  });
});