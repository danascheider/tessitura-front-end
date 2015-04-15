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
    it('has klass DashboardHomeView', function() {
      expect(view.klass).toEqual('DashboardHomeView');
    });

    it('has family Canto.View', function() {
      expect(view.family).toEqual('Canto.View');
    });

    it('has superFamily Backbone.View', function() {
      expect(view.superFamily).toEqual('Backbone.View');
    });
  });

  /* Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render #travis', function() {
      spyOn(Canto.DashboardHomeView.prototype, 'render');
      var newView = new Canto.DashboardHomeView({user: user});
      expect(Canto.DashboardHomeView.prototype.render).not.toHaveBeenCalled();
    });

    it('calls setUser #travis', function() {
      spyOn(Canto.DashboardHomeView.prototype, 'setUser');
      var newView = new Canto.DashboardHomeView({user: user});
      expect(Canto.DashboardHomeView.prototype.setUser).toHaveBeenCalled();
    });

    it('can be instantiated without a user #travis', function() {
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

    it('has a task panel #travis', function() {
      expect(view.$('#task-panel')).toBeInDom();
    });

    it('has a top widget section #travis', function() {
      expect(view.$('#dashboard-top-widgets')).toBeInDom();
    });

    it('has ID #page-wrapper #travis', function() {
      expect(view.$el).toHaveId('page-wrapper');
    });

    it('has class .dashboard-home #travis', function() {
      expect(view.$el).toHaveClass('dashboard-home');
    });
  });

  /* Core View Functions
  /**************************************************************************/

  describe('core view functions', function() {
    describe('render()', function() {
      it('calls renderTaskPanelView #travis', function() {
        spyOn(view, 'renderTaskPanelView');
        view.render();
        expect(view.renderTaskPanelView).toHaveBeenCalled();
      });

      it('calls renderTopWidgetView #travis', function() {
        spyOn(view, 'renderTopWidgetView');
        view.render();
        expect(view.renderTopWidgetView).toHaveBeenCalled();
      });
    });

    describe('remove()', function() {
      _.each(['taskPanelView', 'topWidgetView'], function(str) {
        it('removes the ' + str, function() {
          spyOn(view[str], 'remove');
          view.remove();
          expect(view[str].remove).toHaveBeenCalled();
        });
      });

      it('calls Backbone.View.prototype.remove on itself #travis', function() {
        spyOn(Backbone.View.prototype.remove, 'call');
        view.remove();
        expect(Backbone.View.prototype.remove.call).toHaveBeenCalledWith(view);
      });

      context('when the child views don\'t exist', function() {
        it('doesn\'t raise an error #travis',() {
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
      it('returns true with argument DashboardHomeView #travis',() {
        expect(view.isA('DashboardHomeView')).toBe(true);
      });

      it('returns true with argument PartialView #travis',() {
        expect(view.isA('PartialView')).toBe(true);
      });

      it('returns false with another argument #travis',() {
        expect(view.isA('Corvette')).toBe(false);
      });
    });

    describe('renderTaskPanelView()', function() {
      it('calls render on the task panel view #travis',() {
        spyOn(view.taskPanelView, 'render');
        view.renderTaskPanelView();
        expect(view.taskPanelView.render).toHaveBeenCalled();
      });

      it('attaches the task panel view to the DOM #travis',() {
        view.$el.html(view.template());
        view.renderTaskPanelView();
        $('body').html(view.$el);
        expect(view.taskPanelView.$el).toBeInDom();
      });
    });

    describe('renderTopWidgetView()', function() {
      it('calls render on the top-widget view #travis',() {
        spyOn(view.topWidgetView, 'render');
        view.renderTopWidgetView();
        expect(view.topWidgetView.render).toHaveBeenCalled();
      });

      it('attaches the top widget view to the DOM #travis',() {
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

      it('sets the user #travis',() {
        expect(newView.user).toBe(user);
      });

      it('sets the collection #travis',() {
        expect(newView.collection).toBe(user.tasks);
      });

      it('creates the task panel #travis',() {
        expect(newView.taskPanelView.klass).toBe('TaskPanelView');
      });

      it('creates a top widget view #travis',() {
        expect(newView.topWidgetView.klass).toBe('DashboardTopWidgetView');
      });
    });
  });
});