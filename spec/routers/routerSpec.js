/***************************************************************************
 *                                                                         *
 * ROUTER                                                                  *
 *                                                                         *                                                                         *
 * CONTENTS                                                          LINE  *
 * Core Requires .................................................... 28   *
 * Module-Specific Requires ......................................... 40   *
 * Suite ............................................................ 47   *
 *   Filters ........................................................ 50   *
 *   Authorization and Authentication ............................... 73   *
 *     token()                                                             *
 *   Core Functions ................................................. 69   *
 *     fetch()                                                             *
 *   Special Functions .............................................. 91   *
 *     updateAll() .................................................. 92   *
 *     isA() ....................................................... 140   *
 *                                                                         *
/***************************************************************************/

/* Core Requires
/****************************************************************************/

require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = require('jasmine-jquery-matchers'),
    context        = describe,
    fcontext       = fdescribe;

/* Module-Specific Requires
/******************************************************************************/

Tessitura.Router = require(process.cwd() + '/js/routers/tessituraRouter.js');

var DashboardPresenter = require(process.cwd() + '/js/presenters/dashboardPresenter.js');

/******************************************************************************
 * Tessitura ROUTER SPEC                                                          *
/******************************************************************************/

describe('Tessitura Router', function() {

  var router, user, spy;

  /* Filters
  /****************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
  });

  beforeEach(function() {
    router = new Tessitura.Router();
  });

  afterAll(function() {
    router = null;
  });

  /* Static Properties
  /****************************************************************************/

  describe('static properties', function() {
    it('has klass Tessitura.Router #router #travis', function() {
      expect(router.klass).toBe('Tessitura.Router');
    });
  });

  /* Constructor
  /****************************************************************************/

  describe('constructor', function() {
    it('instantiates an app presenter #router #travis', function() {
      expect(router.AppPresenter.isAn('AppPresenter')).toBe(true);
    });

    it('instantiates a dashboard presenter #router #travis', function() {
      expect(router.DashboardPresenter.isA('DashboardPresenter')).toBe(true);
    });
  });

  /* Before Route Filters
  /****************************************************************************/

  describe('before filters', function() {
    describe('rerouteIfLoggedIn()', function() {
      context('when logged in', function() {
        beforeEach(function() { spyOn($, 'cookie').and.returnValue('Basic ' + btoa('testuser:testuser')); });

        it('calls remove on the app presenter #router #travis', function() {
          spyOn(router.AppPresenter, 'removeAll');
          router.rerouteIfLoggedIn();
          expect(router.AppPresenter.removeAll).toHaveBeenCalled();
        });

        it('navigates to the dashboard #router #travis', function() {
          spyOn(router, 'navigate');
          router.rerouteIfLoggedIn();
          expect(router.navigate).toHaveBeenCalledWith('dashboard', {trigger: true});
        });
      });

      context('when not logged in', function() {
        beforeEach(function() { spyOn($, 'cookie').and.returnValue(null); });

        it('doesn\'t reroute #router #travis', function() {
          pending('Raises error "next is not a function" when app won\'t actually work without next()');
          spyOn(router, 'navigate');
          router.rerouteIfLoggedIn();
          expect(router.navigate).not.toHaveBeenCalled();
        });

        it('doesn\'t remove app views #router #travis', function() {
          pending('Raises error "next is not a function" when app won\'t actually work without next()');
          spyOn(router.AppPresenter, 'removeAll');
          router.rerouteIfLoggedIn();
          expect(router.AppPresenter.removeAll).not.toHaveBeenCalled();
        });
      });
    });

    describe('verifyLoggedIn()', function() {
      context('when not logged in', function() {
        beforeEach(function() { spyOn($, 'cookie').and.returnValue(null); });

        it('redirects to the homepage #router #travis', function() {
          spyOn(router, 'navigate');
          router.verifyLoggedIn();
          expect(router.navigate).toHaveBeenCalledWith('');
        });
      });

      context('when logged in', function() {
        beforeEach(function() { spyOn($, 'cookie').and.returnValue('Basic ' + btoa('testuser:testuser')); });
        
        it('doesn\'t redirect #router #travis', function() {
          pending('Raises error "next is not a function" when app won\'t actually work without next()');
          spyOn(router, 'navigate');
          router.verifyLoggedIn();
          expect(router.navigate).not.toHaveBeenCalled();
        });
      });
    });
  });

  /* Non-Route Events
  /****************************************************************************/

  describe('non-route events', function() {
    var newRouter, event;

    beforeEach(function() {
      spyOn(Tessitura.Router.prototype, 'navigateTo');
      user = new Tessitura.UserModel({username: 'testuser', password: 'testuser', id: 1});
    });

    afterEach(function() { user.destroy(); });

    it('listens to its dashboard presenter #router #travis', function(done) {
      newRouter = new Tessitura.Router();
      newRouter.DashboardPresenter.emitRedirect({destination: 'homepage'});
      expect(Tessitura.Router.prototype.navigateTo).toHaveBeenCalledWith({destination: 'homepage'});
      done();
    });

    it('listens to its app presenter #router #travis', function(done) {
      newRouter = new Tessitura.Router();
      newRouter.AppPresenter.emitRedirect({destination: 'dashboard', user: user});
      expect(Tessitura.Router.prototype.navigateTo).toHaveBeenCalledWith({destination: 'dashboard', user: user});
      done();
    });
  });

  /* Event Callbacks
  /****************************************************************************/

  describe('event callbacks', function() {
    describe('navigateTo()', function() {
      context('general', function() {
        it('navigates to the given route #router #travis #router #travis', function() {
          var e = $.Event('redirect', {destination: 'tasks'});
          spyOn(router, 'navigate');
          router.navigateTo(e);
          expect(router.navigate).toHaveBeenCalledWith('tasks', {trigger: true});
        });
      });

      context('when passed a user model', function() {
        beforeEach(function() {
          user = new Tessitura.UserModel({username: 'testuser', password: 'testuser', id: 1});
          spyOn(router.DashboardPresenter, 'setUser');
        });

        afterEach(function() { user.destroy(); });

        it('calls setUser on the dashboard presenter #router #travis #router #travis', function() {
          e = $.Event('redirect', {destination: 'dashboard', user: user});
          router.navigateTo(e);
          expect(router.DashboardPresenter.setUser).toHaveBeenCalledWith(user);
        });
      });
    });
  });

  /* Route Callbacks
  /****************************************************************************/

  describe('route callbacks', function() {
    describe('displayDashboardHome()', function() {
      beforeEach(function() { 
        // This was actually causing a problem
        spyOn(router.DashboardPresenter.dashboardView.homeView, 'setUser');
        spyOn($, 'cookie').and.returnValue(1);
        spyOn($, 'ajax').and.callFake(function(args) {
          args.success && args.success();
        });
      });

      it('sets the user #router #travis', function() {
        spyOn(router.DashboardPresenter, 'setUser');
        router.displayDashboardHome();
        expect(router.DashboardPresenter.setUser).toHaveBeenCalled();
      });

      it('calls getHome on the DashboardPresenter #router #travis', function(done) {
        spyOn(router.DashboardPresenter, 'getHome');
        router.displayDashboardHome();
        expect(router.DashboardPresenter.getHome).toHaveBeenCalled();
        setTimeout(function() { done(); }, 50);
      });
    });

    describe('displayDashboardTaskView()', function() {
      beforeEach(function() { 
        spyOn(router.DashboardPresenter, 'setUser');
        spyOn(router.DashboardPresenter, 'getTask');
        spyOn($, 'ajax').and.callFake(function(args) { args.success(); });
      });

      it('calls setUser on the DashboardPresenter #router #travis', function(done) {
        router.displayDashboardTaskView();
        expect(router.DashboardPresenter.setUser).toHaveBeenCalled();
        done();
      });

      it('calls getTask on the DashboardPresenter #router #travis', function(done) {
        router.displayDashboardTaskView();
        expect(router.DashboardPresenter.getTask).toHaveBeenCalled();
        done();
      });
    });

    describe('displayHomepage()', function() {
      it('calls removeAll on the dashboard presenter #router #travis', function() {
        spyOn(router.DashboardPresenter, 'removeAll');
        router.displayHomepage();
        expect(router.DashboardPresenter.removeAll).toHaveBeenCalled();
      });

      it('calls getHomepage on the App Presenter #router #travis', function() {
        spyOn(router.AppPresenter, 'getHomepage');
        router.displayHomepage();
        expect(router.AppPresenter.getHomepage).toHaveBeenCalled();
      });
    });

    describe('logOut()', function() {
      it('removes cookies #router #travis', function() {
        spyOn($, 'removeCookie');
        router.logOut();
        expect($.removeCookie).toHaveBeenCalledWith('auth');
        expect($.removeCookie).toHaveBeenCalledWith('userID');
      });

      it('navigates to the homepage #router #travis', function() {
        spyOn(router, 'navigate');
        router.logOut();
        expect(router.navigate).toHaveBeenCalledWith('', {trigger: true});
      });
    });
  });

  /* Special Functions
  /****************************************************************************/

  describe('special functions', function() {
    describe('isA()', function() {
      it('returns true with argument Tessitura.Router #router #travis', function() {
        expect(router.isA('Tessitura.Router')).toBe(true);
      });

      it('returns true with argument \'Router\' #router #travis', function() {
        expect(router.isA('Router')).toBe(true);
      });

      it('returns true with argument \'Backbone.Router\' #router #travis', function() {
        expect(router.isA('Backbone.Router')).toBe(true);
      });

      it('returns false with another argument #router #travis', function() {
        expect(router.isA('Tessitura.Model')).toBe(false);
      });
    });
  });
});