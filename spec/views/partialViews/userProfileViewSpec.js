/****************************************************************************
 *                                                                         *
 * DASHBOARD USER PROFILE VIEW                                             *
 *                                                                         *
 * The user profile view displays information about the user's account     *
 * and personal information and materials they have uploaded, such as      *  
 * their resume and headshot.                                              *
 *                                                                         *
 * CONTENTS                                                          LINE  *
 * Requires ......................................................... 26   *
 * Suite ............................................................ 44   *
 *   Filters ........................................................ 50   *
 *   Authorization and Authentication ............................... 60   *
 *     token()                                                             *
 *   Core Functions ................................................. 69   *
 *     fetch()                                                             *
 *   Special Functions .............................................. 91   *
 *     updateAll() .................................................. 92   *
 *     isA() ....................................................... 140   *
 *                                                                         *
/****************************************************************************/

/* Core Requires
/****************************************************************************/

require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = _.extend(require('jasmine-jquery-matchers'), require(process.cwd() + '/spec/support/matchers/toBeA.js')),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

var SUT = require(process.cwd() + '/js/views/partialViews/userProfileView.js');

/****************************************************************************
 * BEGIN SUITE                                                              *
/****************************************************************************/

describe('Tessitura.UserProfileView', function() {
  var view;

  /* Filters
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  })

  beforeEach(function() {

    // Create an instance of the view under test
    // Insert args here

    view = new SUT();
  });

  afterEach(function() {
    restoreFixtures();
  });

  afterAll(function() {
    view.remove();
    view = null;
    global = _.omit(global, fixtures);
  });

  /* Static Properties
  /**************************************************************************/

  describe('properties', function() {
    it('has klass UserProfileView #partialView #view #travis', function() {
      expect(view.klass).toEqual('UserProfileView');
    });

    it('has family Tessitura.View #partialView #view #travis', function() {
      expect(view.family).toEqual('Tessitura.View');
    });

    it('has superFamily Backbone.View #partialView #view #travis', function() {
      expect(view.superFamily).toEqual('Backbone.View');
    });
  });

  /* View Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render #partialView #view #travis', function() {
      spyOn(SUT.prototype, 'render');
      var newView = new SUT();
      expect(SUT.prototype.render).not.toHaveBeenCalled();
    });

    it('calls setUser if a user is given #partialView #view #travis', function() {
      spyOn(SUT.prototype, 'setUser');
      var newView = new SUT({model: user});
      expect(SUT.prototype.setUser).toHaveBeenCalled();
    });

    it('doesn\'t call setUser if no user is given #partialView #view #travis', function() {
      spyOn(SUT.prototype, 'setUser');
      var newView = new SUT();
      expect(SUT.prototype.setUser).not.toHaveBeenCalled();
    });
  });

  /* Elements
  /**************************************************************************/

  describe('view elements', function() {
    //
  });

  /* Event Wiring
  /**************************************************************************/

  describe('view events', function() {
    //
  });

  /* Event Callbacks
  /**************************************************************************/

  describe('event callbacks', function() {
    //
  });

  /* Core View Functions
  /**************************************************************************/

  describe('core view functions', function() {
    describe('render()', function() {
      //
    });
  });

  /* Special Functions
  /**************************************************************************/

  describe('special functions', function() {
    describe('isA()', function() {
      it('returns true with argument UserProfileView #partialView #view #travis', function() {
        expect(view.isA('UserProfileView')).toBe(true);
      });

      it('returns true with argument UserView #partialView #view #travis', function() {
        expect(view.isA('UserView')).toBe(true);
      });

      it('returns true with argument DashboardProfileView #partialView #view #travis', function() {
        expect(view.isA('DashboardProfileView')).toBe(true);
      });

      it('returns false with another argument #partialView #view #travis', function() {
        expect(view.isA('Corvette')).toBe(false);
      });
    });

    describe('setUser()', function() {

      // In this instance, the user is being passed as {model: user}, so Backbone
      // sets the user automatically, but the setUser method is still being used
      // to instantiate the child view.

      it('instantiates a userModelView #partialView #view #travis', function(done) {
        view.setUser(user);
        expect(view.userModelView.klass).toBe('UserModelView');
        done();
      });

      it('puts the userModelView in the childViews array #partialView #view #travis', function() {
        view.setUser(user);
        expect(view.childViews).toEqual([view.userModelView]);
      });
    });
  });
});