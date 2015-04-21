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

require(process.cwd() + '/js/canto.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    matchers       = require('jasmine-jquery-matchers'),
    context        = describe,
    fcontext       = fdescribe;

/****************************************************************************
 * BEGIN SUITE                                                              *
/****************************************************************************/

describe('Login Form View', function() {
  var view, user, newView, e, spy, xhr;

  /* Filters
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
  });

  beforeEach(function() {
    view = new Canto.LoginFormView();
  });

  afterEach(function() {
    view.destroy();
    newView && newView.destroy();
  });

  afterAll(function() {
    view = null;
  });

  /* Static Properties
  /**************************************************************************/

  describe('properties', function() {
    it('has klass LoginFormView #partialView #view #travis', function() {
      expect(view.klass).toEqual('LoginFormView');
    });

    it('has family Canto.View #partialView #view #travis', function() {
      expect(view.family).toEqual('Canto.View');
    });

    it('has superFamily Backbone.View #partialView #view #travis', function() {
      expect(view.superFamily).toEqual('Backbone.View');
    });
  });

  /* View Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render #partialView #view #travis', function() {
      spyOn(Canto.LoginFormView.prototype, 'render');
      var newView = new Canto.LoginFormView();
      expect(Canto.LoginFormView.prototype.render).not.toHaveBeenCalled();
    });
  });

  /* Elements
  /**************************************************************************/

  describe('view elements', function() {
    beforeEach(function() {
      view.render();
    });

    it('is a form #partialView #view #travis', function() {
      expect(view.$el).toHaveTag('form');
    });

    it('has ID #login-form #partialView #view #travis', function() {
      expect(view.$el).toHaveId('login-form');
    });

    it('has a username field #partialView #view #travis', function() {
      expect(view.$('input[name=username]')).toHaveLength(1);
    });

    it('has a password field #partialView #view #travis', function() {
      expect(view.$('input[name=password]')).toHaveLength(1);
    });

    it('has a submit button #partialView #view #travis', function() {
      expect(view.$('button[type=submit]')).toHaveLength(1);
    });

    it('has a link for login help #partialView #view #travis', function() {
      expect(view.$('a.login-help-link')).toHaveLength(1);
    });

    describe('remember checkbox', function() {
      it('is a checkbox #partialView #view #travis', function() {
        expect(view.$('input[name=remember]')[0].type).toEqual('checkbox');
      });

      it('is checked by default #partialView #view #travis', function() {
        expect(view.$('input[name=remember]')).toBeChecked();
      });
    });
  });

  /* Event Wiring
  /**************************************************************************/

  describe('view events', function() {
    var newView; 
    beforeEach(function() {
      spyOn(Canto.LoginFormView.prototype, 'loginUser');
      spyOn(Canto.LoginFormView.prototype, 'loginHelp');
      newView = new Canto.LoginFormView();
      newView.render();
    });

    afterEach(function() { newView.remove(); });

    describe('submit form', function() {
      it('calls loginUser #partialView #view #travis', function() {
        newView.$el.submit();
        expect(Canto.LoginFormView.prototype.loginUser).toHaveBeenCalled();
      });
    });

    describe('click .login-help-link', function() {
      it('calls loginHelp #partialView #view #travis', function() {
        newView.$('.login-help-link').click();
        expect(Canto.LoginFormView.prototype.loginHelp).toHaveBeenCalled();
      });
    });
  });

  /* Event Callbacks
  /**************************************************************************/

  describe('event callbacks', function() {
    describe('loginHelp()', function() {
      it('does not log "Haha, you\'re boned!" to the console #partialView #view #travis', function() {
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

      describe('general', function() {
        beforeEach(function() { 
          spyOn($, 'ajax'); 
          spyOn(Canto.Utils, 'getAttributes').and.returnValue({username: 'testuser', password: 'testuser', remember: 'Remember Me'});
        });

        it('doesn\'t refresh the page #partialView #view #travis', function() {
          spyOn(e, 'preventDefault').and.callThrough();
          view.loginUser(e);
          expect(e.preventDefault).toHaveBeenCalled();
        });

        it('creates a new user #partialView #view #travis', function() {
          spyOn(Canto.UserModel.prototype, 'initialize');
          view.loginUser(e);
          expect(Canto.UserModel.prototype.initialize).toHaveBeenCalled();
        });

        it('calls login on the user #partialView #view #travis', function() {
          spyOn(Canto.UserModel.prototype, 'login');
          view.loginUser(e);
          expect(Canto.UserModel.prototype.login).toHaveBeenCalled();
        });
      });

      describe('setting cookies', function() {
        beforeEach(function() {
          spyOn($, 'cookie');
          spy = jasmine.createSpy();
          view.on('userLoggedIn', spy);
        });

        afterAll(function() {
          view.off('userLoggedIn');
        });

        context('successful login', function() {
          beforeEach(function() {
            user = new Canto.UserModel({id: 342, username: 'testuser', password: 'testuser'});
            spyOn($, 'ajax').and.callFake(function(args) {
              args.success(user);
            });
          });

          afterEach(function() { user.destroy(); });

          context('with remember me true', function() {
            beforeEach(function() {
              spyOn(Canto.Utils, 'getAttributes').and.returnValue({username: 'testuser', password: 'testuser', remember: 'Remember Me'});
              view.loginUser(e);
            });

            it('sets the auth cookie for 365 days #partialView #view #travis', function() {
              expect($.cookie).toHaveBeenCalledWith('auth', btoa('testuser:testuser'), {expires: 365});
            });

            it('sets the userID cookie for 365 days #partialView #view #travis', function() {
              expect($.cookie).toHaveBeenCalledWith('userID', 342, {expires: 365});
            });

            it('triggers the `userLoggedIn` event #partialView #view #travis', function(done) {
              expect(spy).toHaveBeenCalled();
              done();
            });

            it('passes the user with the event #partialView #view #travis', function(done) {
              expect(typeof (spy.calls.argsFor(0)[0].user)).not.toBe('undefined');
              done();
            });
          });

          context('with remember me false', function() {
            beforeEach(function() {
              spyOn(Canto.Utils, 'getAttributes').and.returnValue({username: 'testuser', password: 'testuser', remember: null});
              view.loginUser(e);
            });

            it('sets the auth cookie as a session cookie #partialView #view #travis', function() {
              expect($.cookie).toHaveBeenCalledWith('auth', btoa('testuser:testuser'));
            });

            it('sets the userID cookie as a session cookie #partialView #view #travis', function() {
              expect($.cookie).toHaveBeenCalledWith('userID', 342);
            });

            it('triggers the `userLoggedIn` event #partialView #view #travis', function() {
              expect(spy).toHaveBeenCalled();
            });

            it('passes the user with the event #partialView #view #travis', function(done) {
              expect(typeof (spy.calls.argsFor(0)[0].user)).not.toBe('undefined');
              done();
            });
          });
        });

        context('unsuccessful login', function() {
          beforeEach(function() {
            spyOn($, 'ajax').and.callFake(function(args) { args.error(); });
          });

          it('doesn\'t set cookies #partialView #view #travis', function() {
            expect($.cookie).not.toHaveBeenCalled();
          });

          it('doesn\'t redirect to the dashboard #partialView #view #travis', function() {
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
      it('returns true with argument LoginFormView #partialView #view #travis', function() {
        expect(view.isA('LoginFormView')).toBe(true);
      });

      it('returns true with argument LoginForm #partialView #view #travis', function() {
        expect(view.isA('LoginForm')).toBe(true);
      });

      it('returns true with argument PartialView #partialView #view #travis', function() {
        expect(view.isA('PartialView')).toBe(true);
      });

      it('returns false with another argument #partialView #view #travis', function() {
        expect(view.isA('Corvette')).toBe(false);
      });
    });
  });
});