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

Canto.Router = require(process.cwd() + '/js/router.js');

/******************************************************************************
 * CANTO ROUTER SPEC                                                          *
/******************************************************************************/

xdescribe('Canto Router', function() {

  var router, spy;

  /* Filters
  /****************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  });

  beforeEach(function() {
    router = new Canto.Router();
    try {
      Backbone.history.start();
    } catch(e) {
      return;
    }
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

  describe('routes', function() {
    var newRouter; 

    beforeEach(function() {
      spyOn(Backbone.history, 'navigate');
      newRouter = new Canto.Router();
    })

    describe('(/)', function() {
      context('when logged in is true', function() {
        beforeEach(function() {
          spyOn(Canto.Router.prototype, 'rerouteIfLoggedIn').and.callThrough();
          spyOn(Canto.Router.prototype, 'displayHomepage');
          spyOn($, 'cookie').and.returnValue(true);
          newRouter = new Canto.Router();
          newRouter.navigate('');
          spyOn(Canto.Router.prototype, 'navigate');
        });

        it('calls rerouteIfLoggedIn', function() {
          expect(Canto.Router.prototype.rerouteIfLoggedIn).toHaveBeenCalled();
        });

        it('navigates to the dashboard', function() {
          expect(Canto.Router.prototype.navigate).toHaveBeenCalledWith('dashboard');
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