/****************************************************************************
 *                                                                         *
 * HOMEPAGE VIEW                                                           *
 *                                                                         *
 * The homepage is the place where users who are not logged in land when   *
 * they visit the site. It is the place where they can get information     *  
 * about the product or log into their dashboard.                          *
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

require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');
require(process.cwd() + '/js/tessitura.js');

var matchers       = _.extend(require('jasmine-jquery-matchers')),
    context        = describe,
    fcontext       = fdescribe;

/****************************************************************************
 * BEGIN SUITE                                                              *
/****************************************************************************/

describe('Tessitura Homepage View', function() {
  var view, e, spy, newView, user;

  /* Filters
  /**************************************************************************/

  beforeAll(function()  { jasmine.addMatchers(matchers); });
  beforeEach(function() { view = new Tessitura.HomepageView(); });
  afterEach(function()  { view.destroy(); });
  afterAll(function()   { view = null; });

  /* Static Properties
  /**************************************************************************/

  describe('properties', function() {
    it('#view #travis has klass \'HomepageView\'', function() {
      expect(view.klass).toEqual('HomepageView');
    });

    it('#view #travis has family Tessitura.View', function() {
      expect(view.family).toEqual('Tessitura.View');
    });

    it('#view #travis has superFamily Backbone.View', function() {
      expect(view.superFamily).toEqual('Backbone.View');
    });
  });

  /* View Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render #appView #view #travis', function() {
      spyOn(Tessitura.HomepageView.prototype, 'render');
      var newView = new Tessitura.HomepageView();
      expect(Tessitura.HomepageView.prototype.render).not.toHaveBeenCalled();
    });

    it('creates a login form #appView #view #travis', function() {
      expect(view.loginForm).toExist();
    });

    it('creates a registration form #appView #view #travis', function() {
      expect(view.registrationForm).toExist();
    });
  });

  /* Elements
  /**************************************************************************/

  describe('view elements', function() {
    beforeEach(function() {
      view.render();
    });

    it('is a div #appView #view #travis', function() {
      expect(view.$el).toHaveTag('div');
    });

    it('has ID #homepage-wrapper #appView #view #travis', function() {
      expect(view.$el).toHaveId('homepage-wrapper');
    });
  });

  /* Event Wiring
  /**************************************************************************/

  describe('events', function() {
    beforeEach(function() {
      spy = jasmine.createSpy();
      spyOn(Tessitura.HomepageView.prototype, 'hideLoginForm');
      spyOn(Tessitura.HomepageView.prototype, 'toggleLoginForm');
      newView = new Tessitura.HomepageView();
      newView.render();
      newView.on('redirect', spy);
    });

    afterEach(function() { newView.destroy(); });

    describe('click .login-link', function() {
      it('calls toggleLoginForm #appView #view #travis', function() {
        newView.$('nav li .login-link').click();
        expect(Tessitura.HomepageView.prototype.toggleLoginForm).toHaveBeenCalled();
      });
    });

    describe('dblclick #shade', function() {
      it('calls hideLoginForm #appView #view #travis', function() {
        newView.$('#shade').dblclick();
        expect(Tessitura.HomepageView.prototype.hideLoginForm).toHaveBeenCalled();
      });
    });
  });

  /* Event Callbacks
  /**************************************************************************/

  describe('event callbacks', function() {
    describe('goToDashboard()', function() {
      beforeEach(function() {
        spy = jasmine.createSpy();
        view.on('redirect', spy);
        user = new Tessitura.UserModel({id: 1, username: 'testuser', password: 'testuser'});
        e = {user: user};
      });

      afterEach(function() { user.destroy(); });
      
      it('triggers redirect on itself #appView #view #travis', function() {
        view.goToDashboard(e);
        expect(spy).toHaveBeenCalled();
      });

      it('passes the user through #appView #view #travis', function() {
        view.goToDashboard(e);
        expect(spy.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({user: user}));
      });

      it('sends the destination #appView #view #travis', function() {
        view.goToDashboard(e);
        expect(spy.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({destination: 'dashboard'}));
      });
    });

    describe('toggleLoginForm()', function() {
      context('when the user is logged in', function() {
        beforeEach(function() {
          spyOn($, 'cookie').and.returnValue(btoa('testuser:testuser'));
        });

        it('triggers redirect #appView #view #travis', function() {
          spy = jasmine.createSpy();
          view.on('redirect', spy);
          view.toggleLoginForm($.Event('click', {target: view.$('.login-link')}));
          expect(spy).toHaveBeenCalledWith({destination: 'dashboard'});
        });
      });

      context('when the user is not logged in', function() {
        beforeEach(function() {
          spyOn($, 'cookie').and.returnValue(null);
        });

        it('doesn\'t trigger redirect #appView #view #travis', function() {
          view.toggleLoginForm($.Event('click', {target: view.$('.login-link')}));
        });
      });
    });
  });

  /* Core View Functions
  /**************************************************************************/

  describe('core view functions', function() {
    describe('remove()', function() {
      beforeEach(function() {
        spyOn(view.loginForm, 'remove');
        spyOn(view.registrationForm, 'remove');
        spyOn(Backbone.View.prototype.remove, 'call');
        view.remove();
      });

      it('removes its login form #appView #view #travis', function() {
        expect(view.loginForm.remove).toHaveBeenCalled();
      });

      it('removes its registration form #appView #view #travis', function() {
        expect(view.registrationForm.remove).toHaveBeenCalled();
      });

      it('removes itself using the Backbone view prototype #appView #view #travis', function() {
        expect(Backbone.View.prototype.remove.call).toHaveBeenCalledWith(view);
      });
    });

    describe('render', function() {
      it('renders its login form #appView #view #travis', function() {
        spyOn(view.loginForm, 'render');
        view.render();
        expect(view.loginForm.render).toHaveBeenCalled();
      });

      it('inserts its login form into its #shade element #appView #view #travis', function() {
        view.render();
        expect(view.$('#shade')).toHaveDescendant(view.loginForm.$el);
      });
    });
  });

  /* Special Functions
  /**************************************************************************/

  describe('special functions', function() {
    describe('isA()', function() {
      it('returns true with argument HomepageView #appView #view #travis', function() {
        expect(view.isA('HomepageView')).toBe(true);
      });

      it('returns true with argument TopLevelView #appView #view #travis', function() {
        expect(view.isA('TopLevelView')).toBe(true);
      });

      it('returns false with another argument #appView #view #travis', function() {
        expect(view.isA('Corvette')).toBe(false);
      });
    });
  });
});