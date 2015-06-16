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
    view = new Tessitura.UserProfileView();
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
    it('has klass UserProfileView #modelView #view #travis', function() {
      expect(view.klass).toEqual('UserProfileView');
    });

    it('has family Tessitura.View #modelView #view #travis', function() {
      expect(view.family).toEqual('Tessitura.View');
    });

    it('has superFamily Backbone.View #modelView #view #travis', function() {
      expect(view.superFamily).toEqual('Backbone.View');
    });
  });

  /* View Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render #modelView #view #travis', function() {
      spyOn(Tessitura.UserProfileView.prototype, 'render');
      var newView = new Tessitura.UserProfileView();
      expect(Tessitura.UserProfileView.prototype.render).not.toHaveBeenCalled();
    });

    it('calls setUser if a user is given #modelView #view #travis', function() {
      spyOn(Tessitura.UserProfileView.prototype, 'setUser');
      var newView = new Tessitura.UserProfileView({model: user});
      expect(Tessitura.UserProfileView.prototype.setUser).toHaveBeenCalled();
    });

    it('doesn\'t call setUser if no user is given #modelView #view #travis', function() {
      spyOn(Tessitura.UserProfileView.prototype, 'setUser');
      var newView = new Tessitura.UserProfileView();
      expect(Tessitura.UserProfileView.prototype.setUser).not.toHaveBeenCalled();
    });
  });

  /* Elements
  /**************************************************************************/

  describe('view elements', function() {
    beforeEach(function() { 
      view.setUser(user).render(); 
    });

    it('has ID #page-wrapper #modelView #view #travis', function() {
      expect(view.$el[0].id).toEqual('page-wrapper');
    });

    it('has class .user-profile #modelView #view #travis', function() {
      expect(view.$el[0].className).toEqual('user-profile');
    });
  });

  /* Event Wiring
  /**************************************************************************/

  describe('view events', function() {
    describe('click', function() {
      it('calls hideInputs #modelView #view #travis', function() {
        spyOn(Tessitura.UserProfileView.prototype, 'hideInputs');
        newView = new Tessitura.UserProfileView({model: user});
        newView.$el.click();
        expect(Tessitura.UserProfileView.prototype.hideInputs).toHaveBeenCalled();
      });
    });
  });

  /* Event Callbacks
  /**************************************************************************/

  describe('event callbacks', function() {
    describe('hideInputs', function() {
      beforeEach(function() { 
        view.setUser(user); 
        spyOn(view.modelView, 'hideInputs');
      });

      context('when the target is not an input', function() {
        beforeEach(function() {
          spyOn($.prototype, 'is').and.returnValue(false);
          e = $.Event('click', {target: view.$('#profile-info')});
        });

        it('calls hideInputs on its model view #modelView #view #travis', function() {
          view.hideInputs(e);
          expect(view.modelView.hideInputs).toHaveBeenCalled();
        });
      });

      context('when the target is an input', function() {
        beforeEach(function() {
          spyOn($.prototype, 'is').and.returnValue(true);
          e = $.Event('click', {target: view.$('input')});
        });

        it('doesn\'t call hideInputs on its model view #modelView #view #travis', function() {
          view.hideInputs(e);
          expect(view.modelView.hideInputs).not.toHaveBeenCalled();
        });
      });
    });
  });

  /* Core View Functions
  /**************************************************************************/

  describe('core view functions', function() {
    describe('render()', function() {
      beforeEach(function() {
        view.setUser(user);
      });

      it('renders its model view', function() {
        spyOn(view.modelView, 'render');
        view.render();
        expect(view.modelView.render).toHaveBeenCalled();
      });

      it('attaches the model view to its el', function() {
        view.render();
        expect(view.$el.html()).toContain(view.modelView.$el.html());
      });
    });
  });

  /* Special Functions
  /**************************************************************************/

  describe('special functions', function() {
    describe('isA()', function() {
      it('returns true with argument UserProfileView #modelView #view #travis', function() {
        expect(view.isA('UserProfileView')).toBe(true);
      });

      it('returns true with argument UserView #modelView #view #travis', function() {
        expect(view.isA('UserView')).toBe(true);
      });

      it('returns true with argument DashboardProfileView #modelView #view #travis', function() {
        expect(view.isA('DashboardProfileView')).toBe(true);
      });

      it('returns false with another argument #modelView #view #travis', function() {
        expect(view.isA('Corvette')).toBe(false);
      });
    });

    describe('setUser()', function() {

      // In this instance, the user is being passed as {model: user}, so Backbone
      // sets the user automatically, but the setUser method is still being used
      // to instantiate the child view.

      it('instantiates a userModelView #modelView #view #travis', function(done) {
        view.setUser(user);
        expect(view.modelView.klass).toBe('UserModelView');
        done();
      });

      it('puts the modelView in the childViews array #modelView #view #travis', function() {
        view.setUser(user);
        expect(view.childViews).toEqual([view.modelView]);
      });

      it('returns itself #modelView #view #travis', function() {
        expect(view.setUser(user)).toBe(view);
      });
    });
  });
});