/* Core Requires
/****************************************************************************/

/* istanbul ignore require */
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

/* istanbul ignore next */
var matchers       = require('jasmine-jquery-matchers'),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    ccontext       = ddescribe;

/* Dashboard Home View Spec
/******************************************************************************/

/* istanbul ignore next */
describe('Dashboard Home View', function() {
  var view, newView;

  /* Filters
  /****************************************************************************/

  beforeEach(function() {
    this.addMatchers(matchers);
    _.extend(global, fixtures);
    spyOn(Tessitura.TaskModel.prototype, 'displayTitle').andReturn('foobar');
  });

  afterEach(function() {
    restoreFixtures();
    view && view.destroy();
    _.omit(global, fixtures);

  });

  /* Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render #dashboardHomeView #partialView #view #travis', function() {
      spyOn(Tessitura.DashboardHomeView.prototype, 'render');
      view = new Tessitura.DashboardHomeView({user: fixtures.user});
      expect(Tessitura.DashboardHomeView.prototype.render).not.toHaveBeenCalled();
    });

    it('calls setUser #dashboardHomeView #partialView #view #travis', function() {
      spyOn(Tessitura.DashboardHomeView.prototype, 'setUser');
      view = new Tessitura.DashboardHomeView({user: fixtures.user});
      expect(Tessitura.DashboardHomeView.prototype.setUser).toHaveBeenCalled();
    });

    it('can be instantiated without a user #dashboardHomeView #partialView #view #travis', function() {
      view = new Tessitura.DashboardHomeView();
      expect(typeof view.user).toBe('undefined');
    });
  });

  /* Elements
  /****************************************************************************/

  describe('DOM elements', function() {
    beforeEach(function() {
      if(view) {
        view = view.setUser(user);
      } else {
        view = new Tessitura.DashboardHomeView({user: user});
      }

      view.render();
      $('body').html(view.$el);
    });

    afterEach(function() {
      view.remove();
    });

    it('has a task panel #dashboardHomeView #partialView #view #travis', function() {
      expect(view.$('#task-panel')).toBeInDom();
    });

    it('has a top widget section #dashboardHomeView #partialView #view #travis', function() {
      expect(view.$('#dashboard-top-widgets')).toBeInDom();
    });

    it('has a calendar #dashboardHomeView #partialView #view #travis', function() {
      expect(view.$('#calendar')).toBeInDom();
    });

    it('has ID #page-wrapper #dashboardHomeView #partialView #view #travis', function() {
      expect(view.$el).toHaveId('page-wrapper');
    });

    it('has class .dashboard-home #dashboardHomeView #partialView #view #travis', function() {
      expect(view.$el).toHaveClass('dashboard-home');
    });
  });

  /* Event Wiring
  /****************************************************************************/

  describe('event wiring', function() {
    describe('showTaskCreateForm on task panel element', function() {
      xit('calls showTaskCreateForm() #dashboardHomeView #partialView #view #travis', function() {
        // FUFNR
        spyOn(Tessitura.DashboardHomeView.prototype, 'showTaskCreateForm');
        view = new Tessitura.DashboardHomeView({user: user});
        view.render();
        view.taskPanelView.showTaskCreateForm(collection);
        expect(Tessitura.DashboardHomeView.prototype.showTaskCreateForm).toHaveBeenCalledWith(collection);
      });
    });

    describe('showEditForm on task panel element', function() {
      it('calls showEditForm() #dashboardHomeView #partialView #view #travis', function() {
        spyOn(Tessitura.DashboardHomeView.prototype, 'showEditForm');
        view = new Tessitura.DashboardHomeView({user: user});
        view.render();
        view.taskPanelView.showEditForm(task1);
        expect(Tessitura.DashboardHomeView.prototype.showEditForm).toHaveBeenCalledWith(task1);
      });
    });
  });

  /* Event Callbacks *
  /****************************************************************************/

  describe('event callbacks', function() {
    beforeEach(function() {
      view = view || new Tessitura.DashboardHomeView({user: user});
    });

    describe('showTaskCreateForm()', function() {
      it('triggers the showTaskCreateForm event #dashboardHomeView #partialView #view #travis', function() {
        var spy = jasmine.createSpy();
        view.on('showTaskCreateForm', spy);
        view.showTaskCreateForm(collection);
        expect(spy).toHaveBeenCalledWith(collection);
      });
    });

    describe('showEditForm()', function() {
      it('triggers the showEditForm event #dashboardHomeView #partialView #view #travis', function() {
        var spy = jasmine.createSpy();
        view.on('showEditForm', spy);
        view.showEditForm(task1);
        expect(spy).toHaveBeenCalledWith(task1);
      });
    });
  });

  /* Core View Functions
  /****************************************************************************/

  describe('core view functions', function() {
    beforeEach(function() {
      if(view) {
        view.setUser(user);
      } else {
        view = new Tessitura.DashboardHomeView({user: user});
      }
    });

    afterEach(function() { view.remove(); });

    describe('render()', function() {
      beforeEach(function() {
        spyOn(view, 'renderTaskPanelView');
        spyOn(view, 'renderTopWidgetView');
        spyOn(view, 'renderCalendarView');
        view.render();
      });

      _.each(['renderTaskPanelView', 'renderTopWidgetView', 'renderCalendarView'], function(method) {
        it('calls ' + method + '() #dashboardHomeView #partialView #view #travis', function() {
          expect(view[method]).toHaveBeenCalled();
        });
      });
    });

    describe('remove()', function() {
      _.each(['taskPanelView', 'topWidgetView', 'calendarView'], function(str) {
        it('removes the ' + str, function() {
          spyOn(view[str], 'remove');
          view.remove();
          expect(view[str].remove).toHaveBeenCalled();
        });
      });

      it('calls Backbone.View.prototype.remove on itself #dashboardHomeView #partialView #view #travis', function() {
        spyOn(Backbone.View.prototype.remove, 'call');
        view.remove();
        expect(Backbone.View.prototype.remove.call).toHaveBeenCalledWith(view);
      });

      context('when the child views don\'t exist', function() {
        it('doesn\'t raise an error #dashboardHomeView #partialView #view #travis', function() {
          newView = new Tessitura.DashboardHomeView({user: user});
          newView.render();
          expect(newView.remove).not.toThrow();
        });
      });
    }); 
  });

  /* Special Functions
  /****************************************************************************/

  describe('special functions', function() {
    beforeEach(function() {
      if(view) {
        view.setUser(user);
      } else {
        view = new Tessitura.DashboardHomeView({user: user});
      }

      $('body').html(view.render().$el);
    });

    afterEach(function() { view.remove(); });

    describe('renderCalendarView()', function() {
      it('calls render on the calendar view #dashboardHomeView #partialView #view #travis', function() {
        spyOn(view.calendarView, 'render');
        view.renderCalendarView();
        expect(view.calendarView.render).toHaveBeenCalled();
      });

      it('attaches the calendar view to the DOM #dashboardHomeView #partialView #view #travis', function() {
        view.renderCalendarView();
        expect(view.calendarView.$el).toBeInDom();
      });
    });

    describe('renderTaskPanelView()', function() {
      it('calls render on the task panel view #dashboardHomeView #partialView #view #travis', function() {
        spyOn(view.taskPanelView, 'render');
        view.renderTaskPanelView();
        expect(view.taskPanelView.render).toHaveBeenCalled();
      });

      it('attaches the task panel view to the DOM #dashboardHomeView #partialView #view #travis', function() {
        view.renderTaskPanelView();
        expect(view.taskPanelView.$el).toBeInDom();
      });
    });

    describe('renderTopWidgetView()', function() {
      it('calls render on the top-widget view #dashboardHomeView #partialView #view #travis', function() {
        spyOn(view.topWidgetView, 'render');
        view.renderTopWidgetView();
        expect(view.topWidgetView.render).toHaveBeenCalled();
      });

      it('attaches the top widget view to the DOM #dashboardHomeView #partialView #view #travis', function() {
        view.renderTopWidgetView();
        expect(view.topWidgetView.$el).toBeInDom();
      });
    });

    describe('setUser()', function() {
      beforeEach(function() {
        newView = new Tessitura.DashboardHomeView();
        newView.setUser(user);
      });

      it('sets the user #dashboardHomeView #partialView #view #travis', function() {
        expect(newView.user).toBe(user);
      });

      it('sets the collection #dashboardHomeView #partialView #view #travis', function() {
        expect(newView.collection).toBe(user.tasks);
      });

      it('adds a task panel to its childViews array #dashboardHomeView #partialView #view #travis', function() {
        expect(newView.childViews).toContain(newView.topWidgetView);
      });

      it('adds a top-widget view to its childViews array #dashboardHomeView #partialView #view #travis', function() {
        expect(newView.childViews).toContain(newView.topWidgetView);
      });

      it('adds the calendar view to its childViews array #dashboardHomeView #partialView #view #travis', function() {
        expect(newView.childViews).toContain(newView.calendarView);
      });
    });
  });
});