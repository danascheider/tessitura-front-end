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

require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = _.extend(require('jasmine-jquery-matchers')),
    context        = describe,
    fcontext       = fdescribe;

var User = require(process.cwd() + '/js/models/userModel.js'),
    SUT  = require(process.cwd() + '/js/views/appViews/homepageView.js');

/****************************************************************************
 * BEGIN SUITE                                                              *
/****************************************************************************/

describe('Canto Homepage View #travis', function() {
  var view, e, spy, newView;

  /* Filters
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
  })

  beforeEach(function() {
    view = new SUT();
  });

  afterAll(function() {
    view.remove();
    view = null;
  });

  /* Static Properties
  /**************************************************************************/

  describe('properties', function() {
    it('has klass \'HomepageView\'', function() {
      expect(view.klass).toEqual('HomepageView');
    });

    it('has family Canto.View', function() {
      expect(view.family).toEqual('Canto.View');
    });

    it('has superFamily Backbone.View', function() {
      expect(view.superFamily).toEqual('Backbone.View');
    });
  });

  /* View Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render', function() {
      spyOn(SUT.prototype, 'render');
      var newView = new SUT();
      expect(SUT.prototype.render).not.toHaveBeenCalled();
    });

    it('creates a login form', function() {
      expect(view.loginForm).toExist();
    });
  });

  /* Elements
  /**************************************************************************/

  describe('view elements', function() {
    beforeEach(function() {
      view.render();
    });

    it('is a div', function() {
      expect(view.$el).toHaveTag('div');
    });

    it('has ID #homepage-wrapper', function() {
      expect(view.$el).toHaveId('homepage-wrapper');
    });
  });

  /* Event Wiring
  /**************************************************************************/

  describe('events', function() {
    beforeEach(function() {
      spyOn(SUT.prototype, 'hideLoginForm');
      spyOn(SUT.prototype, 'createUser');
      spyOn(SUT.prototype, 'toggleLoginForm');
      newView = new SUT();
      newView.render();
    });

    afterEach(function() { newView.remove(); });

    describe('submit registration form', function() {
      it('calls createUser', function() {
        newView.$('#registration-form').submit();
        expect(SUT.prototype.createUser).toHaveBeenCalled();
      });
    });

    describe('click .login-link', function() {
      it('calls toggleLoginForm', function() {
        newView.$('nav li .login-link').click();
        expect(SUT.prototype.toggleLoginForm).toHaveBeenCalled();
      });
    });

    describe('dblclick #shade', function() {
      it('calls hideLoginForm', function() {
        newView.$('#shade').dblclick();
        expect(SUT.prototype.hideLoginForm).toHaveBeenCalled();
      });
    });
  });

  /* Event Callbacks
  /**************************************************************************/

  describe('event callbacks', function() {
    describe('createUser()', function() {
      beforeEach(function() {
        spyOn(Canto.Utils, 'getAttributes').and.returnValue({
          username: 'testuser245', password: '245usertest', email: 'tu245@example.org',
          first_name: 'Test', last_name: 'User'
        });      

        e = $.Event('submit', {target: view.$('#registration-form')});
      });

      it('doesn\'t refresh the page', function() {
        spyOn($, 'ajax');
        spyOn(e, 'preventDefault').and.callThrough();
        view.createUser(e);
        expect(e.preventDefault).toHaveBeenCalled();
      });

      it('instantiates a user model', function() {
        spyOn($, 'ajax');
        spyOn(User.prototype, 'initialize');
        view.createUser(e);
        expect(User.prototype.initialize).toHaveBeenCalled();
      });

      context('success', function() {
        beforeEach(function() {
          spyOn($, 'cookie');
          spy = jasmine.createSpy();
          view.on('redirect', spy);

          spyOn($, 'ajax').and.callFake(function(args) {
            args.success({
              id: 245, username: 'testuser245', password: '245usertest', 
              email: 'tu245@example.org', first_name: 'Test', last_name: 'User'
            });
          });

          view.createUser(e);
        });

        afterEach(function() { view.off('redirect'); });

        it('sets the auth cookie as a session cookie', function() {
          expect($.cookie).toHaveBeenCalledWith('auth', btoa('testuser245:245usertest'));
        });

        it('sets the userID cookie as a session cookie', function() {
          expect($.cookie).toHaveBeenCalledWith('userID', 245);
        });

        it('triggers the redirect event', function() {
          expect(spy).toHaveBeenCalledWith({destination: 'dashboard'});
        });
      });
      
      context('error', function() {
        beforeEach(function() {
          spyOn($, 'cookie');
          spy = jasmine.createSpy();
          view.on('redirect', spy);

          spyOn($, 'ajax').and.callFake(function(args) {
            args.error();
          });

          view.createUser(e);
        });

        afterEach(function() { view.off('redirect'); });

        it('does not set cookies', function() {
          expect($.cookie).not.toHaveBeenCalled();
        });

        it('does not redirect', function() {
          expect(spy).not.toHaveBeenCalled();
        });
      });
    });

    describe('hideLoginForm()', function() {
      it('hides the login form', function() {
        pending('Need to implement the login form view');
      });
    });

    describe('toggleLoginForm()', function() {
      context('when the user is logged in', function() {
        beforeEach(function() {
          spyOn($, 'cookie').and.returnValue(btoa('testuser:testuser'));
        });

        it('triggers redirect', function() {
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

        it('doesn\'t trigger redirect', function() {
          view.toggleLoginForm($.Event('click', {target: view.$('.login-link')}));
        });
      });
    });
  });

  /* Core View Functions
  /**************************************************************************/

  describe('core view functions', function() {
    describe('remove()', function() {
      it('removes its login form', function() {
        spyOn(view.loginForm, 'remove');
        view.remove();
        expect(view.loginForm.remove).toHaveBeenCalled();
      });

      it('removes itself using the Backbone view prototype', function() {
        spyOn(Backbone.View.prototype.remove, 'call');
        view.remove();
        expect(Backbone.View.prototype.remove.call).toHaveBeenCalledWith(view);
      });
    });

    describe('render', function() {
      it('renders its login form', function() {
        spyOn(view.loginForm, 'render');
        view.render();
        expect(view.loginForm.render).toHaveBeenCalled();
      });

      it('inserts its login form into its #shade element', function() {
        view.render();
        expect(view.$('#shade')).toHaveDescendant(view.loginForm.$el);
      });
    });
  });

  /* Special Functions
  /**************************************************************************/

  describe('special functions', function() {
    describe('isA()', function() {
      it('returns true with argument HomepageView', function() {
        expect(view.isA('HomepageView')).toBe(true);
      });

      it('returns true with argument TopLevelView', function() {
        expect(view.isA('TopLevelView')).toBe(true);
      });

      it('returns false with another argument', function() {
        expect(view.isA('Corvette')).toBe(false);
      });
    });
  });
});