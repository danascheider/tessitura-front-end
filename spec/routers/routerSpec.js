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
    it('has klass Canto.Router', function() {
      expect(router.klass).toBe('Canto.Router');
    });
  });

  /* Constructor
  /****************************************************************************/

  describe('constructor', function() {
    it('instantiates an app presenter', function() {
      expect(router.AppPresenter.isAn('AppPresenter')).toBe(true);
    });

    it('instantiates a dashboard presenter', function() {
      expect(router.DashboardPresenter.isA('DashboardPresenter')).toBe(true);
    });
  });

  /* Routes
  /****************************************************************************/

  describe('before filters', function() {
    describe('rerouteIfLoggedIn', function() {
      context('when logged in', function() {
        beforeEach(function() { spyOn($, 'cookie').and.returnValue(btoa('testuser:testuser')); });

        it('calls remove on the app presenter', function() {
          spyOn(router.AppPresenter, 'removeAll');
          router.rerouteIfLoggedIn();
          expect(router.AppPresenter.removeAll).toHaveBeenCalled();
        });

        it('navigates to the dashboard', function() {
          spyOn(router, 'navigate');
          router.rerouteIfLoggedIn();
          expect(router.navigate).toHaveBeenCalledWith('dashboard', {trigger: true});
        });
      });

      context('when not logged in', function() {
        beforeEach(function() { spyOn($, 'cookie').and.returnValue(null); });

        it('doesn\'t reroute', function() {
          spyOn(router, 'navigate');
          router.rerouteIfLoggedIn();
          expect(router.navigate).not.toHaveBeenCalled();
        });

        it('doesn\'t remove app views', function() {
          spyOn(router.AppPresenter, 'removeAll');
          router.rerouteIfLoggedIn();
          expect(router.AppPresenter.removeAll).not.toHaveBeenCalled();
        });
      });
    });
  });

  /* Special Functions
  /****************************************************************************/

  describe('special functions', function() {
    describe('isA()', function() {
      it('returns true with argument Canto.Router', function() {
        expect(router.isA('Canto.Router')).toBe(true);
      });

      it('returns true with argument \'Router\'', function() {
        expect(router.isA('Router')).toBe(true);
      });

      it('returns true with argument \'Backbone.Router\'', function() {
        expect(router.isA('Backbone.Router')).toBe(true);
      });

      it('returns false with another argument', function() {
        expect(router.isA('Canto.Model')).toBe(false);
      });
    });
  });
});