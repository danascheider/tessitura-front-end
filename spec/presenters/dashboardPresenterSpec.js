/* Core Requires
/*****************************************************************************************/

require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');
require(process.cwd() + '/js/tessitura.js');

/* Configuration
/*****************************************************************************************/

var matchers = require('jasmine-jquery-matchers'),
    context  = describe,
    fcontext = fdescribe;

/*****************************************************************************************
/* DASHBOARD PRESENTER SPEC                                                              *
/*****************************************************************************************/

describe('Dashboard Presenter', function() {
  var presenter, user, collection, spy;

  /* Filters
  /***************************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
  });

  beforeEach(function() {
    user      = new Tessitura.UserModel({id: 1, username: 'testuser', password: 'testuser', email: 'testuser@example.com', first_name: 'Test', last_name: 'User'});
    presenter = new Tessitura.DashboardPresenter({user: user});
  });

  afterEach(function() {
    presenter.destroy();
    user.destroy();
  });

  afterAll(function() {
    presenter = null;
  });

  /* Tessitura Model Properties
  /***************************************************************************************/

  describe('Tessitura model properties', function() {
    it('has klass DashboardPresenter #presenter #travis', function() {
      expect(presenter.klass).toBe('DashboardPresenter');
    });

    it('has family Tessitura.Model #presenter #travis', function() {
      expect(presenter.family).toBe('Tessitura.Model');
    });

    it('has superFamily Backbone.Model #presenter #travis', function() {
      expect(presenter.superFamily).toBe('Backbone.Model');
    });
  });

  /* Presenter Constructor
  /***************************************************************************************/

  describe('constructor', function() {
    beforeEach(function() {
      spyOn($, 'ajax').and.callFake(function(args) {
        args.success(user.toJSON());
      });
    });

    afterEach(function() { newPresenter.destroy(); });

    it('can be instantiated without a user #presenter #travis', function() {
      newPresenter = new Tessitura.DashboardPresenter();
      expect(newPresenter.user).not.toExist();
    });

    it('creates a dashboard view #presenter #travis', function() {
      expect(presenter.dashboardView).toExist();
    });

    it('calls setUser #presenter #travis', function() {
      spyOn(Tessitura.DashboardPresenter.prototype, 'setUser');
      newPresenter = new Tessitura.DashboardPresenter({user: user});
      expect(Tessitura.DashboardPresenter.prototype.setUser).toHaveBeenCalledWith(user);
    });
  });

  /* Presenter Events
  /***************************************************************************************/

  describe('events', function() {
    beforeEach(function() {
      spy = jasmine.createSpy();
      presenter.on('redirect', spy);
    });

    afterEach(function() { presenter.off('redirect'); });

    describe('redirect:dashboard on the dashboard view', function() {
      it('emits the redirect:dashboard event #presenter #travis', function() {
        presenter.dashboardView.trigger('redirect', {destination: 'dashboard'});
        expect(spy).toHaveBeenCalledWith({destination: 'dashboard'});
      });
    });

    describe('redirect:tasks on the dashboard view', function() {
      it('emits the redirect:tasks event #presenter #travis', function() {
        presenter.dashboardView.trigger('redirect', {destination: 'tasks'});
        expect(spy).toHaveBeenCalledWith({destination: 'tasks'});
      });
    });

    describe('redirect:profile on the dashboard view', function() {
      it('emits the redirect:profile event #presenter #travis', function() {
        presenter.dashboardView.trigger('redirect', {destination: 'profile'});
        expect(spy).toHaveBeenCalledWith({destination: 'profile'});
      });
    });
  });

  /* Event Callbacks
  /***************************************************************************************/

  describe('event callbacks', function() {
    describe('getHome()', function() {
      beforeEach(function() { spyOn(presenter.dashboardView, 'showHomeView'); });

      context('general', function() {
        beforeEach(function() {
          presenter.getHome();
        });

        it('calls the dashboard\'s showHomeView method #presenter #travis', function() {
          expect(presenter.dashboardView.showHomeView).toHaveBeenCalled();
        });

        it('sets the \'current\' property to \'home\' #presenter #travis', function() {
          expect(presenter.current).toBe('home');
        });
      });

      context('when the dashboard view is not already visible', function() {
        beforeEach(function() {
          spyOn(presenter.dashboardView.$el, 'is').and.returnValue(false);
          spyOn(presenter.dashboardView, 'render');
          presenter.getHome();
        });

        it('renders the dashboard view #presenter #travis', function() {
          expect(presenter.dashboardView.render).toHaveBeenCalled();
        });

        it('attaches the dashboard view to the DOM #presenter #travis', function() {
          expect(presenter.dashboardView.$el).toBeInDom();
        });
      });
    });

    describe('getTask()', function() {
      beforeEach(function() { spyOn(presenter.dashboardView, 'showTaskView'); });

      context('general', function() {
        beforeEach(function() {
          presenter.getTask();
        });

        it('calls the dashboard\'s showTaskView method #presenter #travis', function() {
          expect(presenter.dashboardView.showTaskView).toHaveBeenCalled();
        });

        it('sets the \'current\' property to \'task\' #presenter #travis', function() {
          expect(presenter.current).toBe('task');
        });
      });

      context('when the dashboard view is not already visible', function() {
        beforeEach(function() {
          spyOn(presenter.dashboardView.$el, 'is').and.returnValue(false);
          spyOn(presenter.dashboardView, 'render');
          presenter.getTask();
        });

        it('renders the dashboard #presenter #travis', function() {
          expect(presenter.dashboardView.render).toHaveBeenCalled();
        });

        it('attaches the dashboard view to the DOM #presenter #travis', function() {
          expect(presenter.dashboardView.$el).toBeInDom();
        });
      });
    });

    describe('emitRedirect()', function() {
      beforeEach(function() {
        spy = jasmine.createSpy();
        presenter.on('redirect', spy);
      });

      afterEach(function() { presenter.off('redirect'); });

      it('emits the redirect:dashboard event #presenter #travis', function() {
        presenter.emitRedirect({destination: 'dashboard'});
        expect(spy).toHaveBeenCalledWith({destination: 'dashboard'});
      });

      it('emits the redirect:tasks event #presenter #travis', function() {
        presenter.emitRedirect({destination: 'tasks'});
        expect(spy).toHaveBeenCalledWith({destination: 'tasks'});
      });
    });

    describe('removeAll()', function() {
      it('removes the dashboard view #presenter #travis', function() {
        spyOn(presenter.dashboardView, 'remove');
        presenter.removeAll();
        expect(presenter.dashboardView.remove).toHaveBeenCalled();
      });
    });
  });

  /* Special Functions
  /***************************************************************************************/

  describe('special functions', function() {
    describe('isA()', function() {
      it('returns true with argument `Presenter` #presenter #travis', function() {
        expect(presenter.isA('Presenter')).toBe(true);
      });

      it('returns true with argument \'DashboardPresenter\' #presenter #travis', function() {
        expect(presenter.isA('DashboardPresenter')).toBe(true);
      });

      it('returns false with another argument #presenter #travis', function() {
        expect(presenter.isA('Backbone.Router')).toBe(false);
      });
    });

    describe('setUser()', function() {      
      beforeEach(function() {
        spyOn($, 'ajax').and.callFake(function(args) {
          args.success(user.toJSON());
        });

        newPresenter = new Tessitura.DashboardPresenter();
        spyOn(newPresenter.dashboardView, 'setUser');
      });

      afterEach(function() { newPresenter.destroy(); });
      context('when the "new" user has the same ID as the "old" user', function() {
        it('doesn\'t change the user #presenter #travis', function() {
          newPresenter.user = user
          var newUser = new Tessitura.UserModel({id: user.get('id'), username: user.get('username'), password: user.get('password')});
          newPresenter.setUser(newUser);
          expect(newPresenter.user).toBe(user);
          newUser.destroy();
        });
      });

      context('new user', function() {
        it('sets the user #presenter #travis', function() {
          newPresenter.setUser(user);
          expect(newPresenter.user.isA('UserModel')).toBe(true);
        });

        it('calls setUser on the dashboard #presenter #travis', function() {
          newPresenter.setUser(user);
          expect(newPresenter.dashboardView.setUser).toHaveBeenCalledWith(user);
        });
      });
    });

    describe('showDash()', function() {
      context('when the dash view is not in the DOM', function() {
        beforeEach(function() { 
          spyOn(presenter.dashboardView.$el, 'is').and.returnValue(false); 
          spyOn(presenter.dashboardView, 'render').and.returnValue(presenter.dashboardView);
        });

        it('calls render on the dashboard view #presenter #travis', function() {
          presenter.showDash();
          expect(presenter.dashboardView.render).toHaveBeenCalled();
        });

        it('sets the HTML of the body element #presenter #travis', function() {
          presenter.showDash();
          expect($('body').html()).toContain(presenter.dashboardView.$el.html());
        });
      });

      context('when the dash view is in the DOM already', function() {
        beforeEach(function() { spyOn(presenter.dashboardView.$el, 'is').and.returnValue(true); });

        it('doesn\'t call render #presenter #travis', function() {
          spyOn(presenter.dashboardView, 'render');
          presenter.showDash();
          expect(presenter.dashboardView.render).not.toHaveBeenCalled();
        });

        it('doesn\'t attach anything to the DOM #presenter #travis', function() {
          spyOn($.prototype, 'html');
          presenter.showDash();
          expect($.prototype.html).not.toHaveBeenCalled();
        });
      });
    });
  });
});