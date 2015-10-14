/* Core Requires
/****************************************************************************/

/* istanbul ignore require */
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

/* istanbul ignore next */
var matchers       = require('jasmine-jquery-matchers'),
    context        = describe,
    ccontext       = ddescribe;

/* Tessitura Router Spec
/******************************************************************************/

/* istanbul ignore next */
describe('Tessitura Router', function() {

  var router, user, spy;

  /* Filters
  /****************************************************************************/

  beforeEach(function() {
    this.addMatchers(matchers);
    router = new Tessitura.Router();
  });

  afterEach(function() {
    router && router.stopListening();
  });

  /* Constructor
  /****************************************************************************/

  describe('constructor', function() {
    it('instantiates a dashboard presenter #router #travis', function() {
      expect(router.DashboardPresenter.isA('DashboardPresenter')).toBe(true);
    });
  });

  /* Before Route Filters
  /****************************************************************************/

  describe('before filters', function() {
    describe('verifyLoggedIn()', function() {
      context('when not logged in', function() {
        beforeEach(function() { spyOn($, 'cookie').andReturn(null); });

        it('redirects to the homepage #router #travis', function() {
          spyOn(router, 'navigate');
          router.verifyLoggedIn();
          expect(router.navigate).toHaveBeenCalledWith('http://localhost', {trigger: true});
        });
      });

      context('when logged in', function() {
        beforeEach(function() { spyOn($, 'cookie').andReturn('Basic ' + btoa('testuser:testuser')); });
        
        xit('doesn\'t redirect #router #travis', function() {
          // "next is not a function"
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
    var newRouter, event;

    beforeEach(function() {
      spyOn(Tessitura.Router.prototype, 'navigateTo');
      user = new Tessitura.UserModel({username: 'testuser', password: 'testuser', id: 1});
    });

    afterEach(function() { user.destroy(); });

    it('listens to its dashboard presenter #router #travis', function(done) {
      newRouter = new Tessitura.Router();
      newRouter.DashboardPresenter.emitRedirect({destination: 'homepage'});
      expect(Tessitura.Router.prototype.navigateTo).toHaveBeenCalledWith({destination: 'homepage'});
      done();
    });
  });

  /* Event Callbacks
  /****************************************************************************/

  describe('event callbacks', function() {
    describe('navigateTo()', function() {
      context('general', function() {
        it('navigates to the given route #router #travis', function() {
          var e = $.Event('redirect', {destination: 'tasks'});
          spyOn(router, 'navigate');
          router.navigateTo(e);
          expect(router.navigate).toHaveBeenCalledWith('tasks', {trigger: true});
        });
      });

      context('when passed a user model', function() {
        beforeEach(function() {
          user = new Tessitura.UserModel({username: 'testuser', password: 'testuser', id: 1});
          spyOn(router.DashboardPresenter, 'setUser');
        });

        afterEach(function() { user.destroy(); });

        it('calls setUser on the dashboard presenter #router #travis', function() {
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
        // This was actually causing a problem
        spyOn($, 'cookie').andReturn(1);
        spyOn($, 'ajax').andCallFake(function(args) {
          args.success && args.success();
        });
      });

      it('sets the user #router #travis', function() {
        spyOn(router.DashboardPresenter, 'setUser');
        router.displayDashboardHome();
        expect(router.DashboardPresenter.setUser).toHaveBeenCalled();
      });

      it('calls getHome on the DashboardPresenter #router #travis', function(done) {
        spyOn(router.DashboardPresenter, 'getHome');
        router.displayDashboardHome();
        expect(router.DashboardPresenter.getHome).toHaveBeenCalled();
        setTimeout(function() { done(); }, 50);
      });
    });

    describe('displayDashboardTaskView()', function() {
      beforeEach(function() { 
        spyOn(router.DashboardPresenter, 'getTask');
        spyOn($, 'ajax').andCallFake(function(args) { args.success(); });
      });

      it('calls setUser on the DashboardPresenter #router #travis', function(done) {
        spyOn(router.DashboardPresenter, 'setUser');
        router.displayDashboardTaskView();
        expect(router.DashboardPresenter.setUser).toHaveBeenCalled();
        done();
      });

      it('calls getTask on the DashboardPresenter #router #travis', function(done) {
        router.displayDashboardTaskView();
        expect(router.DashboardPresenter.getTask).toHaveBeenCalled();
        done();
      });
    });

    describe('displayDashboardProfile()', function() {
      beforeEach(function() {
        spyOn($, 'cookie').andReturn(1);
        spyOn($, 'ajax').andCallFake(function(args) {
          args.success && args.success();
        });
      });

      it('sets the user #router #travis', function() {
        spyOn(router.DashboardPresenter, 'setUser');
        router.displayDashboardProfile();
        expect(router.DashboardPresenter.setUser).toHaveBeenCalled();
      });

      it('calls getProfile on the DashboardPresenter #router #travis', function(done) {
        spyOn(router.DashboardPresenter, 'getProfile');
        router.displayDashboardProfile();
        expect(router.DashboardPresenter.getProfile).toHaveBeenCalled();
        done();
      });
    });

    describe('displayDashboardLocal()', function() {
      beforeEach(function() {
        spyOn($, 'cookie').andReturn(1);
        spyOn($, 'ajax').andCallFake(function(args) {
          args.success && args.success();
        });
      });

      it('sets the user #router #travis', function() {
        spyOn(router.DashboardPresenter, 'setUser');
        router.displayDashboardLocal();
        expect(router.DashboardPresenter.setUser).toHaveBeenCalled();
      });

      it('calls getLocal on the DashboardPresenter #router #travis', function(done) {
        spyOn(router.DashboardPresenter, 'getLocal');
        router.displayDashboardLocal();
        expect(router.DashboardPresenter.getLocal).toHaveBeenCalled();
        done();
      });
    });

    describe('logOut()', function() {
      it('removes cookies #router #travis', function() {
        spyOn($, 'removeCookie');
        router.logOut();
        expect($.removeCookie).toHaveBeenCalledWith('auth');
        expect($.removeCookie).toHaveBeenCalledWith('userID');
      });

      it('navigates to the homepage #router #travis', function() {
        spyOn(router, 'navigate');
        router.logOut();
        expect(router.navigate).toHaveBeenCalledWith('', {trigger: true});
      });
    });

    describe('prepareTestEnvironment()', function() {
      it('sends a POST request to the database destroyer #router #travis', function() {
        spyOn($, 'ajax').andCallFake(function(args) { args.success && args.success(); });
        router.prepareTestEnvironment();
        expect($.ajax).toHaveBeenCalledWith(jasmine.objectContaining({
          type: 'POST',
          url: 'http://api.canto-test.com:1025/destroy'
        }));
      });
    });
  });

  /* Special Functions
  /****************************************************************************/

  describe('special functions', function() {
    describe('isA()', function() {
      it('returns true with argument Tessitura.Router #router #travis', function() {
        expect(router.isA('Tessitura.Router')).toBe(true);
      });

      it('returns true with argument \'Router\' #router #travis', function() {
        expect(router.isA('Router')).toBe(true);
      });

      it('returns true with argument \'Backbone.Router\' #router #travis', function() {
        expect(router.isA('Backbone.Router')).toBe(true);
      });

      it('returns false with another argument #router #travis', function() {
        expect(router.isA('Tessitura.Model')).toBe(false);
      });
    });
  });
});