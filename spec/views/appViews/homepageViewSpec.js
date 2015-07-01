/* istanbul ignore require */
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');
require(process.cwd() + '/js/tessitura.js');

/* istanbul ignore next */
var matchers       = _.extend(require('jasmine-jquery-matchers')),
    context        = describe,
    fcontext       = fdescribe;

/* istanbul ignore next */
describe('Tessitura Homepage View', function() {
  var view, e, spy, newView, user;

  /* Filters
  /**************************************************************************/

  beforeAll(function()  { jasmine.addMatchers(matchers); });
  beforeEach(function() { view = new Tessitura.HomepageView(); });
  afterEach(function()  { view.destroy(); });
  afterAll(function()   { view = null; });

  /* View Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render #homepageView #appView #view #travis', function() {
      spyOn(Tessitura.HomepageView.prototype, 'render');
      var newView = new Tessitura.HomepageView();
      expect(Tessitura.HomepageView.prototype.render).not.toHaveBeenCalled();
    });

    it('creates a login form #homepageView #appView #view #travis', function() {
      expect(view.loginForm).toExist();
    });

    it('creates a registration form #homepageView #appView #view #travis', function() {
      expect(view.registrationForm).toExist();
    });
  });

  /* Elements
  /**************************************************************************/

  describe('view elements', function() {
    beforeEach(function() {
      view.render();
    });

    it('is a div #homepageView #appView #view #travis', function() {
      expect(view.$el).toHaveTag('div');
    });

    it('has ID #homepage-wrapper #homepageView #appView #view #travis', function() {
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
      it('calls toggleLoginForm #homepageView #appView #view #travis', function() {
        newView.$('nav li .login-link').click();
        expect(Tessitura.HomepageView.prototype.toggleLoginForm).toHaveBeenCalled();
      });
    });

    describe('dblclick #shade', function() {
      it('calls hideLoginForm #homepageView #appView #view #travis', function() {
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
      
      it('triggers redirect on itself #homepageView #appView #view #travis', function() {
        view.goToDashboard(e);
        expect(spy).toHaveBeenCalled();
      });

      it('passes the user through #homepageView #appView #view #travis', function() {
        view.goToDashboard(e);
        expect(spy.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({user: user}));
      });

      it('sends the destination #homepageView #appView #view #travis', function() {
        view.goToDashboard(e);
        expect(spy.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({destination: 'dashboard'}));
      });
    });

    describe('hideLoginForm()', function() {
      it('calls hide #homepageView #appView #view #travis', function() {
        spyOn($.prototype, 'hide');
        view.hideLoginForm($.Event('click', {target: view.$el}));
        expect($.prototype.hide).toHaveBeenCalled();
      });
    });

    describe('toggleLoginForm()', function() {
      context('when the user is logged in', function() {
        beforeEach(function() {
          spyOn($, 'cookie').and.returnValue(btoa('testuser:testuser'));
        });

        it('triggers redirect #homepageView #appView #view #travis', function() {
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

        it('doesn\'t trigger redirect #homepageView #appView #view #travis', function() {
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

      it('removes its login form #homepageView #appView #view #travis', function() {
        expect(view.loginForm.remove).toHaveBeenCalled();
      });

      it('removes its registration form #homepageView #appView #view #travis', function() {
        expect(view.registrationForm.remove).toHaveBeenCalled();
      });

      it('removes itself using the Backbone view prototype #homepageView #appView #view #travis', function() {
        expect(Backbone.View.prototype.remove.call).toHaveBeenCalledWith(view);
      });
    });

    describe('render', function() {
      it('renders its login form #homepageView #appView #view #travis', function() {
        spyOn(view.loginForm, 'render');
        view.render();
        expect(view.loginForm.render).toHaveBeenCalled();
      });

      it('inserts its login form into its #shade element #homepageView #appView #view #travis', function() {
        view.render();
        expect(view.$('#shade')).toHaveDescendant(view.loginForm.$el);
      });
    });
  });
});