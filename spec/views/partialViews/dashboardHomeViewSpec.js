/***************************************************************************
 *                                                                         *
 * DASHBOARD HOME VIEW                                                     *
 *                                                                         *
 * The DashboardHomeView is the view the user sees when they first log     *
 * into their dashboard. It contains summary information about all their   *
 * activities and obligations.                                             *
 *                                                                         *
 * CONTENTS                                                          LINE  *
 * Requires ......................................................... 40   *
 * Suite ............................................................ 55   *
 *   Filters ........................................................ 61   *
 *   Static Properties .............................................. 83   *
 *     klass ........................................................ 84   *
 *     family ....................................................... 88   *
 *     superFamily .................................................. 92   *
 *   Constructor ................................................... 100   *
 *     does not call render                                                *
 *     calls setUser()                                                     *
 *     can be instantiated without a user                                  *
 *   Elements ...................................................... 122   *
 *     has a task panel ............................................ 128   *
 *     has a top widget section .................................... 132   *
 *     has ID #page-wrapper ........................................ 136   *
 *     has class .dashboard-home ................................... 140   *
 *   Core View Functions ........................................... 148   *
 *     render() .................................................... 149   *
 *     remove() .................................................... 163   *
 *   Special Functions ............................................. 183   *
 *     isA() ....................................................... 184   *
 *     renderTaskPanelView() ....................................... 198   *
 *     renderTopWidgetView() ....................................... 213   *
 *     setUser() ................................................... 228   *
 *                                                                         *
/****************************************************************************/

/* Core Requires
/****************************************************************************/

require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/canto.js');
require(process.cwd() + '/spec/support/env.js');

var fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    matchers       = require('jasmine-jquery-matchers'),
    context        = describe,
    fcontext       = fdescribe;

/******************************************************************************
 * BEGIN SUITE                                                                *
/******************************************************************************/

describe('Dashboard Home View', function() {
  var view;

  /* Filters
  /****************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  });

  beforeEach(function() {
    spyOn(Canto.TaskModel.prototype, 'displayTitle').and.returnValue('foobar');
    view = new Canto.DashboardHomeView({user: user});
  });

  afterEach(function() {
    view.remove();
    restoreFixtures();
  });

  afterAll(function() {
    view = null;
    global = _.omit(global, fixtures);
  });

  /* Static Properties
  /****************************************************************************/

  describe('properties', function() {
    it('#travis has klass DashboardHomeView', function() {
      expect(view.klass).toEqual('DashboardHomeView');
    });

    it('#travis has family Canto.View', function() {
      expect(view.family).toEqual('Canto.View');
    });

    it('#travis has superFamily Backbone.View', function() {
      expect(view.superFamily).toEqual('Backbone.View');
    });
  });

  /* Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('#travis does not call render', function() {
      spyOn(Canto.DashboardHomeView.prototype, 'render');
      var newView = new Canto.DashboardHomeView({user: user});
      expect(Canto.DashboardHomeView.prototype.render).not.toHaveBeenCalled();
    });

    it('#travis calls setUser', function() {
      spyOn(Canto.DashboardHomeView.prototype, 'setUser');
      var newView = new Canto.DashboardHomeView({user: user});
      expect(Canto.DashboardHomeView.prototype.setUser).toHaveBeenCalled();
    });

    it('#travis can be instantiated without a user', function() {
      var newView = new Canto.DashboardHomeView();
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

    it('#travis has a task panel', function() {
      expect(view.$('#task-panel')).toBeInDom();
    });

    it('#travis has a top widget section', function() {
      expect(view.$('#dashboard-top-widgets')).toBeInDom();
    });

    it('#travis has ID #page-wrapper', function() {
      expect(view.$el).toHaveId('page-wrapper');
    });

    it('#travis has class .dashboard-home', function() {
      expect(view.$el).toHaveClass('dashboard-home');
    });
  });

  /* Core View Functions
  /**************************************************************************/

  describe('core view functions', function() {
    describe('render()', function() {
      it('#travis calls renderTaskPanelView', function() {
        spyOn(view, 'renderTaskPanelView');
        view.render();
        expect(view.renderTaskPanelView).toHaveBeenCalled();
      });

      it('#travis calls renderTopWidgetView', function() {
        spyOn(view, 'renderTopWidgetView');
        view.render();
        expect(view.renderTopWidgetView).toHaveBeenCalled();
      });
    });

    describe('remove()', function() {
      _.each(['taskPanelView', 'topWidgetView'], function(str) {
        it('#travis removes the ' + str, function() {
          spyOn(view[str], 'remove');
          view.remove();
          expect(view[str].remove).toHaveBeenCalled();
        });
      });

      it('#travis calls Backbone.View.prototype.remove on itself', function() {
        spyOn(Backbone.View.prototype.remove, 'call');
        view.remove();
        expect(Backbone.View.prototype.remove.call).toHaveBeenCalledWith(view);
      });

      context('when the child views don\'t exist', function() {
        it('#travis doesn\'t raise an error', function() {
          var newView = new Canto.DashboardHomeView();
          expect(view.remove).not.toThrow();
        });
      });
    }); 
  });

  /* Special Functions
  /**************************************************************************/

  describe('special functions', function() {
    describe('isA()', function() {
      it('#travis returns true with argument DashboardHomeView', function() {
        expect(view.isA('DashboardHomeView')).toBe(true);
      });

      it('#travis returns true with argument PartialView', function() {
        expect(view.isA('PartialView')).toBe(true);
      });

      it('#travis returns false with another argument', function() {
        expect(view.isA('Corvette')).toBe(false);
      });
    });

    describe('renderTaskPanelView()', function() {
      it('#travis calls render on the task panel view', function() {
        spyOn(view.taskPanelView, 'render');
        view.renderTaskPanelView();
        expect(view.taskPanelView.render).toHaveBeenCalled();
      });

      it('#travis attaches the task panel view to the DOM', function() {
        view.$el.html(view.template());
        view.renderTaskPanelView();
        $('body').html(view.$el);
        expect(view.taskPanelView.$el).toBeInDom();
      });
    });

    describe('renderTopWidgetView()', function() {
      it('#travis calls render on the top-widget view', function() {
        spyOn(view.topWidgetView, 'render');
        view.renderTopWidgetView();
        expect(view.topWidgetView.render).toHaveBeenCalled();
      });

      it('#travis attaches the top widget view to the DOM', function() {
        view.$el.html(view.template());
        view.renderTopWidgetView();
        $('body').html(view.$el);
        expect(view.topWidgetView.$el).toBeInDom();
      });
    });

    describe('setUser()', function() {
      var newView;

      beforeEach(function() {
        newView = new Canto.DashboardHomeView();
        newView.setUser(user);
      });

      it('#travis sets the user', function() {
        expect(newView.user).toBe(user);
      });

      it('#travis sets the collection', function() {
        expect(newView.collection).toBe(user.tasks);
      });

      it('#travis creates the task panel', function() {
        expect(newView.taskPanelView.klass).toBe('TaskPanelView');
      });

      it('#travis creates a top widget view', function() {
        expect(newView.topWidgetView.klass).toBe('DashboardTopWidgetView');
      });
    });
  });
});