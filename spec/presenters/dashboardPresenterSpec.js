/* Core Requires
/*****************************************************************************************/

require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');
require(process.cwd() + '/js/canto.js');

/* Configuration
/*****************************************************************************************/

var matchers = require('jasmine-jquery-matchers'),
    fixtures = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context  = describe,
    fcontext = fdescribe;

/*****************************************************************************************
/* DASHBOARD PRESENTER SPEC                                                              *
/*****************************************************************************************/

describe('Dashboard Presenter', function() {
  var presenter, spy;

  /* Filters
  /***************************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  });

  beforeEach(function() {
    presenter = new Canto.DashboardPresenter({user: user});
  });

  afterEach(function() {
    restoreFixtures();
  });

  afterAll(function() {
    global = _.omit(global, fixtures);
    presenter.destroy();
    presenter = null;
  });

  /* Canto Model Properties
  /***************************************************************************************/

  describe('Canto model properties', function() {
    it('has klass DashboardPresenter #travis', function() {
      expect(presenter.klass).toBe('DashboardPresenter');
    });

    it('has family Canto.Model #travis', function() {
      expect(presenter.family).toBe('Canto.Model');
    });

    it('has superFamily Backbone.Model #travis', function() {
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

    it('can be instantiated without a user #travis', function() {
      var newPresenter = new Canto.DashboardPresenter();
      expect(newPresenter.user).not.toExist();
    });

    it('creates a dashboard view #travis', function() {
      expect(presenter.dashboardView).toExist();
    });

    it('calls setUser #travis', function() {
      spyOn(Canto.DashboardPresenter.prototype, 'setUser');
      var newPresenter = new Canto.DashboardPresenter({user: user});
      expect(Canto.DashboardPresenter.prototype.setUser).toHaveBeenCalledWith(user);
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
      it('emits the redirect:dashboard event #travis', function() {
        presenter.dashboardView.trigger('redirect', {destination: 'dashboard'});
        expect(spy).toHaveBeenCalledWith({destination: 'dashboard'});
      });
    });

    describe('redirect:tasks on the dashboard view', function() {
      it('emits the redirect:tasks event #travis', function() {
        presenter.dashboardView.trigger('redirect', {destination: 'tasks'});
        expect(spy).toHaveBeenCalledWith({destination: 'tasks'});
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

        it('calls the dashboard\'s showHomeView method #travis', function() {
          expect(presenter.dashboardView.showHomeView).toHaveBeenCalled();
        });

        it('sets the \'current\' property to \'home\' #travis', function() {
          expect(presenter.current).toBe('home');
        });
      });

      context('when the dashboard view is not already visible', function() {
        beforeEach(function() {
          spyOn(presenter.dashboardView.$el, 'is').and.returnValue(false);
          spyOn(presenter.dashboardView, 'render');
          presenter.getHome();
        });

        it('renders the dashboard view #travis', function() {
          expect(presenter.dashboardView.render).toHaveBeenCalled();
        });

        it('attaches the dashboard view to the DOM #travis', function() {
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

        it('calls the dashboard\'s showTaskView method #travis', function() {
          expect(presenter.dashboardView.showTaskView).toHaveBeenCalled();
        });

        it('sets the \'current\' property to \'task\' #travis', function() {
          expect(presenter.current).toBe('task');
        });
      });

      context('when the dashboard view is not already visible', function() {
        beforeEach(function() {
          spyOn(presenter.dashboardView.$el, 'is').and.returnValue(false);
          spyOn(presenter.dashboardView, 'render');
          presenter.getTask();
        });

        it('renders the dashboard #travis', function() {
          expect(presenter.dashboardView.render).toHaveBeenCalled();
        });

        it('attaches the dashboard view to the DOM #travis', function() {
          expect(presenter.dashboardView.$el).toBeInDom();
        });
      });
    });

    describe('redirect()', function() {
      beforeEach(function() {
        spy = jasmine.createSpy();
        presenter.on('redirect', spy);
      });

      afterEach(function() { presenter.off('redirect'); });

      it('emits the redirect:dashboard event #travis', function() {
        presenter.redirect({destination: 'dashboard'});
        expect(spy).toHaveBeenCalledWith({destination: 'dashboard'});
      });

      it('emits the redirect:tasks event #travis', function() {
        presenter.redirect({destination: 'tasks'});
        expect(spy).toHaveBeenCalledWith({destination: 'tasks'});
      });
    });

    describe('removeAll()', function() {
      it('removes the dashboard view #travis', function() {
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
      it('returns true with argument `Presenter` #travis', function() {
        expect(presenter.isA('Presenter')).toBe(true);
      });

      it('returns true with argument \'DashboardPresenter\' #travis', function() {
        expect(presenter.isA('DashboardPresenter')).toBe(true);
      });

      it('returns false with another argument #travis', function() {
        expect(presenter.isA('Backbone.Router')).toBe(false);
      });
    });

    describe('setUser()', function() {
      var newPresenter;
      
      beforeEach(function() {
        spyOn($, 'ajax').and.callFake(function(args) {
          args.success(user.toJSON());
        });

        newPresenter = new Canto.DashboardPresenter();
        spyOn(newPresenter.dashboardView, 'setUser').and.callThrough();
      });

      afterEach(function() { newPresenter.destroy(); });

      context('when the user is not actually changed', function() {
        it('doesn\'t change the user #travis', function() {
          newPresenter.user = user;
          newPresenter.setUser(user);
          expect(newPresenter.user).toBe(user);
        });
      });

      context('when the "new" user has the same ID as the "old" user', function() {
        it('doesn\'t change the user #travis', function() {
          newPresenter.user = user
          var newUser = new Canto.UserModel({id: user.get('id'), username: user.get('username'), password: user.get('password')});
          newPresenter.setUser(newUser);
          expect(newPresenter.user).toBe(user);
        });
      });

      context('new user', function() {
        it('sets the user #travis', function() {
          newPresenter.setUser(user);
          expect(newPresenter.user.isA('UserModel')).toBe(true);
        });

        it('calls setUser on the dashboard #travis', function() {
          newPresenter.setUser(user);
          expect(newPresenter.dashboardView.setUser).toHaveBeenCalledWith(user);
        });

        it('instantiates a task collection #travis', function() {
          user.tasks = null;
          spyOn(Canto.TaskCollection.prototype, 'initialize');
          newPresenter.setUser(user);
          expect(Canto.TaskCollection.prototype.initialize).toHaveBeenCalled();
        });
      });
    });

    describe('showDash()', function() {
      context('when the dash view is not in the DOM', function() {
        beforeEach(function() { 
          spyOn(presenter.dashboardView.$el, 'is').and.returnValue(false); 
          spyOn(presenter.dashboardView, 'render').and.returnValue(presenter.dashboardView);
        });

        it('calls render on the dashboard view #travis', function() {
          presenter.showDash();
          expect(presenter.dashboardView.render).toHaveBeenCalled();
        });

        it('sets the HTML of the body element #travis', function() {
          presenter.showDash();
          expect($('body').html()).toContain(presenter.dashboardView.$el.html());
        });
      });

      context('when the dash view is in the DOM already', function() {
        beforeEach(function() { spyOn(presenter.dashboardView.$el, 'is').and.returnValue(true); });

        it('doesn\'t call render #travis', function() {
          spyOn(presenter.dashboardView, 'render');
          presenter.showDash();
          expect(presenter.dashboardView.render).not.toHaveBeenCalled();
        });

        it('doesn\'t attach anything to the DOM #travis', function() {
          spyOn($.prototype, 'html');
          presenter.showDash();
          expect($.prototype.html).not.toHaveBeenCalled();
        });
      });
    });
  });
});