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
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = require('jasmine-jquery-matchers'),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

/******************************************************************************
 * BEGIN SUITE                                                                *
/******************************************************************************/

describe('Dashboard Home View', function() {
  var view, newView, user, collection, task1, task2, task3;

  /* Filters
  /****************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
  });

  beforeEach(function() {
    spyOn(Tessitura.TaskModel.prototype, 'displayTitle').and.returnValue('foobar');
    view = new Tessitura.DashboardHomeView({user: fixtures.user});
  });

  afterEach(function() {
    fixtures.restoreFixtures();
    newView && newView.destroy();
  });

  afterAll(function() {
    view = null;
  });

  /* Static Properties
  /****************************************************************************/

  describe('properties', function() {
    it('has klass DashboardHomeView', function() {
      expect(view.klass).toEqual('DashboardHomeView');
    });

    it('has family Tessitura.View', function() {
      expect(view.family).toEqual('Tessitura.View');
    });

    it('has superFamily Backbone.View', function() {
      expect(view.superFamily).toEqual('Backbone.View');
    });
  });

  /* Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render #partialView #view #travis', function() {
      spyOn(Tessitura.DashboardHomeView.prototype, 'render');
      newView = new Tessitura.DashboardHomeView({user: fixtures.user});
      expect(Tessitura.DashboardHomeView.prototype.render).not.toHaveBeenCalled();
    });

    it('calls setUser #partialView #view #travis', function() {
      spyOn(Tessitura.DashboardHomeView.prototype, 'setUser');
      newView = new Tessitura.DashboardHomeView({user: fixtures.user});
      expect(Tessitura.DashboardHomeView.prototype.setUser).toHaveBeenCalled();
    });

    it('can be instantiated without a user #partialView #view #travis', function() {
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

    it('has a task panel #partialView #view #travis', function() {
      expect(view.$('#task-panel')).toBeInDom();
    });

    it('has a top widget section #partialView #view #travis', function() {
      expect(view.$('#dashboard-top-widgets')).toBeInDom();
    });

    it('has ID #page-wrapper #partialView #view #travis', function() {
      expect(view.$el).toHaveId('page-wrapper');
    });

    it('has class .dashboard-home #partialView #view #travis', function() {
      expect(view.$el).toHaveClass('dashboard-home');
    });
  });

  /* Events
  /**************************************************************************/

    describe('events', function() {
      describe('redirect on top widgets', function() {
        it('calls emitRedirect #partialView #view #travis', function() {
          spyOn(Tessitura.DashboardHomeView.prototype, 'emitRedirect');
          newView = new Tessitura.DashboardHomeView({user: fixtures.user});
          newView.topWidgetView.trigger('redirect', {destination: 'tasks'});
          expect(Tessitura.DashboardHomeView.prototype.emitRedirect).toHaveBeenCalled();
        });
      });
    });

  /* Event Callbacks
  /**************************************************************************/

  describe('event callbacks', function() {
    describe('emitRedirect', function() {
      beforeEach(function() {
        spy = jasmine.createSpy();
        view.on('redirect', spy);
        e = $.Event('redirect', {destination: 'dashboard'});
      });

      afterEach(function() {
        view.off('redirect');
      });

      it('triggers the redirect event', function() {
        view.emitRedirect(e);
        expect(spy).toHaveBeenCalled();
      });
    });
  });

  /* Core View Functions
  /**************************************************************************/

  describe('core view functions', function() {
    describe('render()', function() {
      it('calls renderTaskPanelView #partialView #view #travis', function() {
        spyOn(view, 'renderTaskPanelView');
        view.render();
        expect(view.renderTaskPanelView).toHaveBeenCalled();
      });

      it('calls renderTopWidgetView #partialView #view #travis', function() {
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

      it('calls Backbone.View.prototype.remove on itself #partialView #view #travis', function() {
        spyOn(Backbone.View.prototype.remove, 'call');
        view.remove();
        expect(Backbone.View.prototype.remove.call).toHaveBeenCalledWith(view);
      });

      context('when the child views don\'t exist', function() {
        it('doesn\'t raise an error #partialView #view #travis', function() {
          newView = new Tessitura.DashboardHomeView();
          expect(view.remove).not.toThrow();
        });
      });
    }); 
  });

  /* Special Functions
  /**************************************************************************/

  describe('special functions', function() {
    describe('isA()', function() {
      it('returns true with argument DashboardHomeView #partialView #view #travis', function() {
        expect(view.isA('DashboardHomeView')).toBe(true);
      });

      it('returns true with argument PartialView #partialView #view #travis', function() {
        expect(view.isA('PartialView')).toBe(true);
      });

      it('returns false with another argument #partialView #view #travis', function() {
        expect(view.isA('Corvette')).toBe(false);
      });
    });

    describe('renderTaskPanelView()', function() {
      it('calls render on the task panel view #partialView #view #travis', function() {
        spyOn(view.taskPanelView, 'render');
        view.renderTaskPanelView();
        expect(view.taskPanelView.render).toHaveBeenCalled();
      });

      it('attaches the task panel view to the DOM #partialView #view #travis', function() {
        view.$el.html(view.template());
        view.renderTaskPanelView();
        $('body').html(view.$el);
        expect(view.taskPanelView.$el).toBeInDom();
      });
    });

    describe('renderTopWidgetView()', function() {
      it('calls render on the top-widget view #partialView #view #travis', function() {
        spyOn(view.topWidgetView, 'render');
        view.renderTopWidgetView();
        expect(view.topWidgetView.render).toHaveBeenCalled();
      });

      it('attaches the top widget view to the DOM #partialView #view #travis', function() {
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

      it('sets the user #partialView #view #travis', function() {
        expect(newView.user).toBe(fixtures.user);
      });

      it('sets the collection #partialView #view #travis', function() {
        expect(newView.collection).toBe(fixtures.user.tasks);
      });

      it('creates the task panel #partialView #view #travis', function() {
        expect(newView.taskPanelView.klass).toBe('TaskPanelView');
      });

      it('creates a top widget view #partialView #view #travis', function() {
        expect(newView.topWidgetView.klass).toBe('DashboardTopWidgetView');
      });

      it('puts the task panel in its childViews array #partialView #view #travis', function() {
        expect(newView.childViews).toContain(newView.topWidgetView);
      });

      it('puts the top-widget view in ints childViews array #partialView #view #travis', function() {
        expect(newView.childViews).toContain(newView.topWidgetView);
      });
    });
  });
});