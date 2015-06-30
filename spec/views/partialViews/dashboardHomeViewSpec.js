/* Core Requires
/****************************************************************************/

require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = require('jasmine-jquery-matchers'),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

/* Dashboard Home View Spec
/******************************************************************************/

describe('Dashboard Home View', function() {
  var view, newView;

  /* Filters
  /****************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  });

  beforeEach(function() {
    spyOn(Tessitura.TaskModel.prototype, 'displayTitle').and.returnValue('foobar');
    view = new Tessitura.DashboardHomeView({user: fixtures.user});
  });

  afterEach(function() {
    restoreFixtures();
    newView && newView.destroy();
  });

  afterAll(function() {
    view = null;
    _.omit(global, fixtures);
  });

  /* Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render #dashboardHomeView #partialView #view #travis', function() {
      spyOn(Tessitura.DashboardHomeView.prototype, 'render');
      newView = new Tessitura.DashboardHomeView({user: fixtures.user});
      expect(Tessitura.DashboardHomeView.prototype.render).not.toHaveBeenCalled();
    });

    it('calls setUser #dashboardHomeView #partialView #view #travis', function() {
      spyOn(Tessitura.DashboardHomeView.prototype, 'setUser');
      newView = new Tessitura.DashboardHomeView({user: fixtures.user});
      expect(Tessitura.DashboardHomeView.prototype.setUser).toHaveBeenCalled();
    });

    it('can be instantiated without a user #dashboardHomeView #partialView #view #travis', function() {
      newView = new Tessitura.DashboardHomeView();
      expect(newView.user).not.toExist();
    });
  });

  /* Elements
  /**************************************************************************/

  describe('DOM elements', function() {
    beforeEach(function() {
      view.render();
      $('body').html(view.$el);
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

  /* Core View Functions
  /**************************************************************************/

  describe('core view functions', function() {
    describe('render()', function() {
      it('calls renderTaskPanelView #dashboardHomeView #partialView #view #travis', function() {
        spyOn(view, 'renderTaskPanelView');
        view.render();
        expect(view.renderTaskPanelView).toHaveBeenCalled();
      });

      it('calls renderTopWidgetView #dashboardHomeView #partialView #view #travis', function() {
        spyOn(view, 'renderTopWidgetView');
        view.render();
        expect(view.renderTopWidgetView).toHaveBeenCalled();
      });

      it('calls renderCalendarView #dashboardHomeView #partialView, #view, #travis', function() {
        spyOn(view, 'renderCalendarView');
        view.render();
        expect(view.renderCalendarView).toHaveBeenCalled();
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
  /**************************************************************************/

  describe('special functions', function() {
    describe('isA()', function() {
      it('returns true with argument DashboardHomeView #dashboardHomeView #partialView #view #travis', function() {
        expect(view.isA('DashboardHomeView')).toBe(true);
      });

      it('returns true with argument PartialView #dashboardHomeView #partialView #view #travis', function() {
        expect(view.isA('PartialView')).toBe(true);
      });

      it('returns false with another argument #dashboardHomeView #partialView #view #travis', function() {
        expect(view.isA('Corvette')).toBe(false);
      });
    });

    describe('renderCalendarView()', function() {
      it('calls render on the calendar view #dashboardHomeView #partialView #view #travis', function() {
        spyOn(view.calendarView, 'render');
        view.renderCalendarView();
        expect(view.calendarView.render).toHaveBeenCalled();
      });

      it('attaches the calendar view to the DOM', function() {
        view.$el.html(view.template());
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
        view.$el.html(view.template());
        view.renderTaskPanelView();
        $('body').html(view.$el);
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
        view.$el.html(view.template());
        view.renderTopWidgetView();
        $('body').html(view.$el);
        expect(view.topWidgetView.$el).toBeInDom();
      });
    });

    describe('setUser()', function() {
      beforeEach(function() {
        newView = new Tessitura.DashboardHomeView();
        newView.setUser(fixtures.user);
      });

      it('sets the user #dashboardHomeView #partialView #view #travis', function() {
        expect(newView.user).toBe(fixtures.user);
      });

      it('sets the collection #dashboardHomeView #partialView #view #travis', function() {
        expect(newView.collection).toBe(fixtures.user.tasks);
      });

      it('creates the task panel #dashboardHomeView #partialView #view #travis', function() {
        expect(newView.taskPanelView.klass).toBe('TaskPanelView');
      });

      it('creates a top widget view #dashboardHomeView #partialView #view #travis', function() {
        expect(newView.topWidgetView.isA('DashboardTopWidgetView')).toBe(true);
      });

      it('creates a calendar widget #dashboardHomeView #partialView #view #travis', function() {
        expect(newView.calendarView.isA('CalendarView')).toBe(true);
      });

      it('puts the task panel in its childViews array #dashboardHomeView #partialView #view #travis', function() {
        expect(newView.childViews).toContain(newView.topWidgetView);
      });

      it('puts the top-widget view in its childViews array #dashboardHomeView #partialView #view #travis', function() {
        expect(newView.childViews).toContain(newView.topWidgetView);
      });

      it('puts the calendar view in its childViews array #dashboardHomeView #partialView #view #travis', function() {
        expect(newView.childViews).toContain(newView.calendarView);
      });
    });
  });
});