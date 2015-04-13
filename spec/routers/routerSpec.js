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
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

/* Module-Specific Requires
/******************************************************************************/

Canto.Router = require(process.cwd() + '/js/routers/cantoRouter.js');

var DashboardPresenter = require(process.cwd() + '/js/presenters/dashboardPresenter.js');

/******************************************************************************
 * CANTO ROUTER SPEC                                                          *
/******************************************************************************/

describe('Canto Router', function() {

  var router, spy;

  /* Filters
  /****************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  });

  beforeEach(function() {
    router = new Canto.Router();
  });

  afterEach(function() {
    restoreFixtures();
  });

  afterAll(function() {
    router = null;
    global = _.omit(global, fixtures);
  });

  /* Static Properties
  /****************************************************************************/

  describe('static properties', function() {
    it('#travis has klass Canto.Router', function() {
      expect(router.klass).toBe('Canto.Router');
    });
  });

  /* Constructor
  /****************************************************************************/

  describe('constructor', function() {
    it('#travis instantiates an app presenter', function() {
      expect(router.AppPresenter.isAn('AppPresenter')).toBe(true);
    });

    it('#travis instantiates a dashboard presenter', function() {
      expect(router.DashboardPresenter.isA('DashboardPresenter')).toBe(true);
    });
  });

  /* Before Route Filters
  /****************************************************************************/

  describe('before filters', function() {
    describe('rerouteIfLoggedIn()', function() {
      context('when logged in', function() {
        beforeEach(function() { spyOn($, 'cookie').and.returnValue('Basic ' + btoa('testuser:testuser')); });

        it('#travis calls remove on the app presenter', function() {
          spyOn(router.AppPresenter, 'removeAll');
          router.rerouteIfLoggedIn();
          expect(router.AppPresenter.removeAll).toHaveBeenCalled();
        });

        it('#travis navigates to the dashboard', function() {
          spyOn(router, 'navigate');
          router.rerouteIfLoggedIn();
          expect(router.navigate).toHaveBeenCalledWith('dashboard', {trigger: true});
        });
      });

      context('when not logged in', function() {
        beforeEach(function() { spyOn($, 'cookie').and.returnValue(null); });

        it('#travis doesn\'t reroute', function() {
          spyOn(router, 'navigate');
          router.rerouteIfLoggedIn();
          expect(router.navigate).not.toHaveBeenCalled();
        });

        it('#travis doesn\'t remove app views', function() {
          spyOn(router.AppPresenter, 'removeAll');
          router.rerouteIfLoggedIn();
          expect(router.AppPresenter.removeAll).not.toHaveBeenCalled();
        });
      });
    });

    describe('verifyLoggedIn()', function() {
      context('when not logged in', function() {
        beforeEach(function() { spyOn($, 'cookie').and.returnValue(null); });

        it('#travis redirects to the homepage', function() {
          spyOn(router, 'navigate');
          router.verifyLoggedIn();
          expect(router.navigate).toHaveBeenCalledWith('');
        });
      });

      context('when logged in', function() {
        beforeEach(function() { spyOn($, 'cookie').and.returnValue('Basic ' + btoa('testuser:testuser')); });
        
        it('#travis doesn\'t redirect', function() {
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
    var user;

    beforeEach(function() {
      user = new Canto.UserModel({username: 'testuser', password: 'testuser', id: 342});
    });

    it('#travis listens to its app presenter', function(done) {
      spyOn(Canto.Router.prototype, 'navigateTo');
      var newRouter = new Canto.Router();
      var e = $.Event('redirect', {destination: 'dashboard', user: user});
      newRouter.AppPresenter.trigger(e);
      done();
      expect(Canto.Router.prototype.navigateTo).toHaveBeenCalledWith(e);
    });

    it('#travis listens to its dashboard presenter', function(done) {
      spyOn(Canto.Router.prototype, 'navigateTo');
      var newRouter = new Canto.Router();
      var e = $.Event('redirect', {destination: 'homepage'});
      newRouter.DashboardPresenter.trigger(e);
      done();
      expect(Canto.Router.prototype.navigateTo).toHaveBeenCalledWith(e);
    });
  });

  /* Event Callbacks
  /****************************************************************************/

  describe('event callbacks', function() {
    describe('navigateTo()', function() {
      context('general', function() {
        it('#travis navigates to the given route', function() {
          var e = $.Event('redirect', {destination: 'tasks'});
          spyOn(router, 'navigate');
          router.navigateTo(e);
          expect(router.navigate).toHaveBeenCalledWith('tasks', {trigger: true});
        });
      });

      context('when passed a user model', function() {
        beforeEach(function() {
          spyOn(router.DashboardPresenter, 'setUser');
        });

        it('#travis calls setUser on the dashboard presenter', function() {
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
        spyOn($, 'cookie').and.returnValue(user.get('id')); 
        spyOn($, 'ajax').and.callFake(function(args) {
          args.success();
        });
      });

      it('#travis sets the user', function() {
        spyOn(router.DashboardPresenter, 'setUser').and.callThrough();
        router.displayDashboardHome();
        expect(router.DashboardPresenter.setUser).toHaveBeenCalled();
      });

      it('#travis calls getHome on the DashboardPresenter', function(done) {
        spyOn(router.DashboardPresenter, 'getHome');
        router.displayDashboardHome();
        expect(router.DashboardPresenter.getHome).toHaveBeenCalled();
        done();
      });
    });

    describe('displayDashboardTaskView()', function() {
      beforeEach(function() { 
        spyOn($, 'cookie').and.returnValue(user.get('id')); 
        spyOn($, 'ajax').and.callFake(function(args) { args.success(); });
      });

      it('#travis calls setUser on the DashboardPresenter', function(done) {
        spyOn(router.DashboardPresenter, 'setUser').and.callThrough();
        router.displayDashboardTaskView();
        expect(router.DashboardPresenter.setUser).toHaveBeenCalled();
        done();
      });

      it('#travis calls getTask on the DashboardPresenter', function() {
        spyOn(router.DashboardPresenter, 'getTask');
        router.displayDashboardTaskView();
        expect(router.DashboardPresenter.getTask).toHaveBeenCalled();
      });
    });

    describe('displayHomepage()', function() {
      it('#travis calls removeAll on the dashboard presenter', function() {
        spyOn(router.DashboardPresenter, 'removeAll');
        router.displayHomepage();
        expect(router.DashboardPresenter.removeAll).toHaveBeenCalled();
      });

      it('#travis calls getHomepage on the App Presenter', function() {
        spyOn(router.AppPresenter, 'getHomepage');
        router.displayHomepage();
        expect(router.AppPresenter.getHomepage).toHaveBeenCalled();
      });
    });

    describe('logOut()', function() {
      it('#travis removes cookies', function() {
        spyOn($, 'removeCookie');
        router.logOut();
        expect($.removeCookie).toHaveBeenCalledWith('auth');
        expect($.removeCookie).toHaveBeenCalledWith('userID');
      });

      it('#travis navigates to the homepage', function() {
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
      it('#travis returns true with argument Canto.Router', function() {
        expect(router.isA('Canto.Router')).toBe(true);
      });

      it('#travis returns true with argument \'Router\'', function() {
        expect(router.isA('Router')).toBe(true);
      });

      it('#travis returns true with argument \'Backbone.Router\'', function() {
        expect(router.isA('Backbone.Router')).toBe(true);
      });

      it('#travis returns false with another argument', function() {
        expect(router.isA('Canto.Model')).toBe(false);
      });
    });
  });
});