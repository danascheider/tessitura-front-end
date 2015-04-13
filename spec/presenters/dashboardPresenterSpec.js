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
    it('#travis has klass DashboardPresenter', function() {
      expect(presenter.klass).toBe('DashboardPresenter');
    });

    it('#travis has family Canto.Model', function() {
      expect(presenter.family).toBe('Canto.Model');
    });

    it('#travis has superFamily Backbone.Model', function() {
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

    it('#travis can be instantiated without a user', function() {
      var newPresenter = new Canto.DashboardPresenter();
      expect(newPresenter.user).not.toExist();
    });

    it('#travis creates a dashboard view', function() {
      expect(presenter.dashboardView).toExist();
    });

    it('#travis calls setUser', function() {
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
      it('#travis emits the redirect:dashboard event', function() {
        presenter.dashboardView.trigger('redirect', {destination: 'dashboard'});
        expect(spy).toHaveBeenCalledWith({destination: 'dashboard'});
      });
    });

    describe('redirect:tasks on the dashboard view', function() {
      it('#travis emits the redirect:tasks event', function() {
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

        it('#travis calls the dashboard\'s showHomeView method', function() {
          expect(presenter.dashboardView.showHomeView).toHaveBeenCalled();
        });

        it('#travis sets the \'current\' property to \'home\'', function() {
          expect(presenter.current).toBe('home');
        });
      });

      context('when the dashboard view is not already visible', function() {
        beforeEach(function() {
          spyOn(presenter.dashboardView.$el, 'is').and.returnValue(false);
          spyOn(presenter.dashboardView, 'render');
          presenter.getHome();
        });

        it('#travis renders the dashboard view', function() {
          expect(presenter.dashboardView.render).toHaveBeenCalled();
        });

        it('#travis attaches the dashboard view to the DOM', function() {
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

        it('#travis calls the dashboard\'s showTaskView method', function() {
          expect(presenter.dashboardView.showTaskView).toHaveBeenCalled();
        });

        it('#travis sets the \'current\' property to \'task\'', function() {
          expect(presenter.current).toBe('task');
        });
      });

      context('when the dashboard view is not already visible', function() {
        beforeEach(function() {
          spyOn(presenter.dashboardView.$el, 'is').and.returnValue(false);
          spyOn(presenter.dashboardView, 'render');
          presenter.getTask();
        });

        it('#travis renders the dashboard', function() {
          expect(presenter.dashboardView.render).toHaveBeenCalled();
        });

        it('#travis attaches the dashboard view to the DOM', function() {
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

      it('#travis emits the redirect:dashboard event', function() {
        presenter.redirect({destination: 'dashboard'});
        expect(spy).toHaveBeenCalledWith({destination: 'dashboard'});
      });

      it('#travis emits the redirect:tasks event', function() {
        presenter.redirect({destination: 'tasks'});
        expect(spy).toHaveBeenCalledWith({destination: 'tasks'});
      });
    });

    describe('removeAll()', function() {
      it('#travis removes the dashboard view', function() {
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
      it('#travis returns true with argument `Presenter`', function() {
        expect(presenter.isA('Presenter')).toBe(true);
      });

      it('#travis returns true with argument \'DashboardPresenter\'', function() {
        expect(presenter.isA('DashboardPresenter')).toBe(true);
      });

      it('#travis returns false with another argument', function() {
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
        it('#travis doesn\'t change the user', function() {
          newPresenter.user = user;
          newPresenter.setUser(user);
          expect(newPresenter.user).toBe(user);
        });
      });

      context('when the "new" user has the same ID as the "old" user', function() {
        it('#travis doesn\'t change the user', function() {
          newPresenter.user = user
          var newUser = new Canto.UserModel({id: user.get('id'), username: user.get('username'), password: user.get('password')});
          newPresenter.setUser(newUser);
          expect(newPresenter.user).toBe(user);
        });
      });

      context('new user', function() {
        it('#travis sets the user', function() {
          newPresenter.setUser(user);
          expect(newPresenter.user.isA('UserModel')).toBe(true);
        });

        it('#travis calls setUser on the dashboard', function() {
          newPresenter.setUser(user);
          expect(newPresenter.dashboardView.setUser).toHaveBeenCalledWith(user);
        });

        it('#travis instantiates a task collection', function() {
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

        it('#travis calls render on the dashboard view', function() {
          presenter.showDash();
          expect(presenter.dashboardView.render).toHaveBeenCalled();
        });

        it('#travis sets the HTML of the body element', function() {
          presenter.showDash();
          expect($('body').html()).toContain(presenter.dashboardView.$el.html());
        });
      });

      context('when the dash view is in the DOM already', function() {
        beforeEach(function() { spyOn(presenter.dashboardView.$el, 'is').and.returnValue(true); });

        it('#travis doesn\'t call render', function() {
          spyOn(presenter.dashboardView, 'render');
          presenter.showDash();
          expect(presenter.dashboardView.render).not.toHaveBeenCalled();
        });

        it('#travis doesn\'t attach anything to the DOM', function() {
          spyOn($.prototype, 'html');
          presenter.showDash();
          expect($.prototype.html).not.toHaveBeenCalled();
        });
      });
    });
  });
});