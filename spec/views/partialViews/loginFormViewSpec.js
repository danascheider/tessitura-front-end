/****************************************************************************
 *                                                                         *
 * LOGIN FORM VIEW                                                         *
 *                                                                         *
 * The login form is displayed on the homepage when the user clicks the    *
 * .login-link item on the homepage top nav. It provides fields for the    *  
 * username and password, a "remember-me" checkbox, and a login help link. *
 *                                                                         *
 * CONTENTS                                                          LINE  *
 * Requires ......................................................... 26   *
 * Suite ............................................................ 44   *
 *   Filters ........................................................ 50   *
 *   Static Properties .............................................. 60   *
 *     klass                                                               *
 *     family                                                              *
 *     superFamily                                                         *
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

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    matchers       = _.extend(require('jasmine-jquery-matchers'), require(process.cwd() + '/spec/support/matchers/toBeA.js')),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

var SUT = require(process.cwd() + '/js/views/partialViews/loginFormView.js');

/****************************************************************************
 * BEGIN SUITE                                                              *
/****************************************************************************/

describe('Login Form View', function() {
  var view, e, spy, xhr;

  /* Filters
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  })

  beforeEach(function() {
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
    it('has klass LoginFormView', function() {
      expect(view.klass).toEqual('LoginFormView');
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
  });

  /* Elements
  /**************************************************************************/

  describe('view elements', function() {
    beforeEach(function() {
      view.render();
    });

    it('is a form', function() {
      expect(view.$el).toHaveTag('form');
    });

    it('has ID #login-form', function() {
      expect(view.$el).toHaveId('login-form');
    });

    it('has a username field', function() {
      expect(view.$('input[name=username]')).toHaveLength(1);
    });

    it('has a password field', function() {
      expect(view.$('input[name=password]')).toHaveLength(1);
    });

    it('has a submit button', function() {
      expect(view.$('button[type=submit]')).toHaveLength(1);
    });

    it('has a link for login help', function() {
      expect(view.$('a.login-help-link')).toHaveLength(1);
    });

    describe('remember checkbox', function() {
      it('is a checkbox', function() {
        expect(view.$('input[name=remember]')[0].type).toEqual('checkbox');
      });

      it('is checked by default', function() {
        expect(view.$('input[name=remember]')).toBeChecked();
      });
    });
  });

  /* Event Wiring
  /**************************************************************************/

  describe('view events', function() {
    var newView; 
    beforeEach(function() {
      spyOn(SUT.prototype, 'loginUser');
      spyOn(SUT.prototype, 'loginHelp');
      newView = new SUT();
      newView.render();
    });

    afterEach(function() { newView.remove(); });

    describe('submit form', function() {
      it('calls loginUser', function() {
        newView.$el.submit();
        expect(SUT.prototype.loginUser).toHaveBeenCalled();
      });
    });

    describe('click .login-help-link', function() {
      it('calls loginHelp', function() {
        newView.$('.login-help-link').click();
        expect(SUT.prototype.loginHelp).toHaveBeenCalled();
      });
    });
  });

  /* Event Callbacks
  /**************************************************************************/

  describe('event callbacks', function() {
    describe('loginHelp()', function() {
      it('does not log "Haha, you\'re boned!" to the console', function() {
        pending('Fuller implementation');
      });
    });

    describe('loginUser()', function() {
      beforeEach(function() {
        view.render();
        e = $.Event('submit', {target: view.$el});
        xhr = new XMLHttpRequest();
        xhr.open('POST', Canto.API.login)
      });

      describe('ajax request', function() {
        beforeEach(function() { 
          spyOn($, 'ajax'); 
          spyOn(Canto.Utils, 'getAttributes').and.returnValue({username: 'testuser', password: 'testuser', remember: 'Remember Me'});
        });

        it('doesn\'t refresh the page', function() {
          spyOn(e, 'preventDefault').and.callThrough();
          view.loginUser(e);
          expect(e.preventDefault).toHaveBeenCalled();
        });

        it('sends a POST request', function() {
          view.loginUser(e);
          expect($.ajax.calls.argsFor(0)[0].type).toEqual('POST');
        });

        it('makes a request to the /login endpoint', function() {
          view.loginUser(e);
          expect($.ajax.calls.argsFor(0)[0].url).toMatch(/\/login$/);
        });

        it('includes a basic auth header', function() {
          view.loginUser(e);
          $.ajax.calls.argsFor(0)[0].beforeSend(xhr);
          expect(xhr.getRequestHeader('Authorization')).toEqual(btoa('testuser:testuser'));
        });
      });

      describe('setting cookies', function() {
        beforeEach(function() {
          spyOn($, 'cookie');
          spy = jasmine.createSpy();
          view.on('redirect', spy);
        });

        afterAll(function() {
          view.off('redirect');
        });

        context('successful login', function() {
          beforeEach(function() {
            spyOn($, 'ajax').and.callFake(function(args) {
              args.success(user);
            });
          });

          context('with remember me true', function() {
            beforeEach(function() {
              spyOn(Canto.Utils, 'getAttributes').and.returnValue({username: 'testuser', password: 'testuser', remember: 'Remember Me'});
              view.loginUser(e);
            });

            it('sets the auth cookie for 365 days', function() {
              expect($.cookie).toHaveBeenCalledWith('auth', btoa('testuser:testuser'), {expires: 365});
            });

            it('sets the userID cookie for 365 days', function() {
              expect($.cookie).toHaveBeenCalledWith('userID', 342, {expires: 365});
            });

            it('triggers the `redirect` event', function(done) {
              expect(spy).toHaveBeenCalledWith({destination: 'dashboard'});
              done();
            });
          });

          context('with remember me false', function() {
            beforeEach(function() {
              spyOn(Canto.Utils, 'getAttributes').and.returnValue({username: 'testuser', password: 'testuser', remember: null});
              view.loginUser(e);
            });

            it('sets the auth cookie as a session cookie', function() {
              expect($.cookie).toHaveBeenCalledWith('auth', btoa('testuser:testuser'));
            });

            it('sets the userID cookie as a session cookie', function() {
              expect($.cookie).toHaveBeenCalledWith('userID', 342);
            });

            it('triggers the `redirect` event', function() {
              expect(spy).toHaveBeenCalledWith({destination: 'dashboard'});
            });
          });
        });

        context('unsuccessful login', function() {
          beforeEach(function() {
            spyOn($, 'ajax').and.callFake(function(args) { args.error(); });
          });

          it('doesn\'t set cookies', function() {
            expect($.cookie).not.toHaveBeenCalled();
          });

          it('doesn\'t redirect to the dashboard', function() {
            expect(spy).not.toHaveBeenCalled();
          });
        });
      });
    });
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
      it('returns true with argument LoginFormView', function() {
        expect(view.isA('LoginFormView')).toBe(true);
      });

      it('returns true with argument LoginForm', function() {
        expect(view.isA('LoginForm')).toBe(true);
      });

      it('returns true with argument PartialView', function() {
        expect(view.isA('PartialView')).toBe(true);
      });

      it('returns false with another argument', function() {
        expect(view.isA('Corvette')).toBe(false);
      });
    });
  });
});