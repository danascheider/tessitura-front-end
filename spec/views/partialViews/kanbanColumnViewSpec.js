/****************************************************************************
 *                                                                         *
 * KANBAN COLUMN VIEW                                                      *
 *                                                                         *
 * The Kanban column view displays information about the user's tasks,     *
 * sorted by status. Each column has tasks of one status: In Progress,     *  
 * New, Blocking, or Backlogged. In the future, users may be able to       *
 * access their completed tasks as well.                                   *
 *                                                                         *
 * CONTENTS                                                          LINE  *
 * Core Requires .................................................... 28   *
 * Module-Specific Requires ......................................... 40   * 
 * Suite ............................................................ 47   *
 *   Filters ........................................................ 50   *
 *   Authorization and Authentication ............................... 73   *
 *     token()                                                             *
 *   Core Functions ................................................. 69   *
 *     fetch()                                                             *
 *   Special Functions .............................................. 91   *
 *     updateAll() .................................................. 92   *
 *     isA() ....................................................... 140   *
 *                                                                         *
/***************************************************************************/

/* Core Requires
/****************************************************************************/

require(process.cwd() + '/js/canto.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = _.extend(require('jasmine-jquery-matchers')),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

/****************************************************************************
 * BEGIN SUITE                                                              *
/****************************************************************************/

describe('Kanban Column View', function() {
  var view, data;

  /* Filters
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
    data = {collection: collection, color: 'blue', icon: 'fa-exclamation-circle', headline: 'New'};
  });

  beforeEach(function() {
    spyOn(Canto.TaskModel.prototype, 'displayTitle').and.returnValue('foobar');
    view = new Canto.KanbanColumnView(data);
  });

  afterEach(function() {
    view.remove();
    restoreFixtures();
  })

  afterAll(function() {
    view = null;
    global = _.omit(global, fixtures);
  });

  /* Static Properties
  /**************************************************************************/

  describe('properties', function() {
    it('#travis has klass KanbanColumnView', function() {
      expect(view.klass).toEqual('KanbanColumnView');
    });

    it('#travis has family Canto.View', function() {
      expect(view.family).toEqual('Canto.View');
    });

    it('#travis has superFamily Backbone.View', function() {
      expect(view.superFamily).toEqual('Backbone.View');
    });
  });

  /* View Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('#travis does not call render', function() {
      spyOn(Canto.KanbanColumnView.prototype, 'render');
      var newView = new Canto.KanbanColumnView(data);
    });

    it('#travis calls setCollection', function () {
      spyOn(view, 'setCollection');
      expect(view.collection).toBe(collection);
    });

    it('#travis sets the data property', function() {
      var newView = new Canto.KanbanColumnView(data);
      _.each(['color', 'icon', 'headline'], function(prop) {
        expect(newView.data[prop]).toEqual(data[prop]);
      });
    });

    it('#travis can be instantiated without a collection', function() {
      delete data.collection;
      var newView = new Canto.KanbanColumnView(data)
      expect(newView.collection).not.toExist();
      data.collection = user.tasks;
    });

    describe('groupedBy property', function() {
      context('when grouped by backlog', function() {
        it('#travis sets groupedBy to Backlog', function() {
          data.headline = 'Backlog';
          var newView = new Canto.KanbanColumnView(data);
          expect(newView.groupedBy).toEqual({backlog: true});
          data.headline = 'New';
        });
      });

      context('when grouped by status', function() {
        it('#travis sets groupedBy to the appropriate status', function() {
          var newView = new Canto.KanbanColumnView(data);
          expect(newView.groupedBy).toEqual({status: 'New'});
        });
      });
    });

    it('#travis creates a collection view', function() {
      expect(view.collectionView.isA('TaskCollectionView')).toBe(true);
    });
  });

  /* View Elements
  /**************************************************************************/

  describe('view elements', function() {
    it('#travis is a div', function() {
      expect(view.$el).toHaveTag('div');
    });

    it('#travis has class .panel', function() {
      expect(view.$el).toHaveClass('panel');
    });

    it('#travis has class .dash-widget', function() {
      expect(view.$el).toHaveClass('dash-widget');
    });

    it('#travis has class .kanban-column', function() {
      expect(view.$el).toHaveClass('kanban-column');
    });

    it('#travis sets its panel color', function() {
      expect(view.$el).toHaveClass('panel-blue');
    });
  });

  /* Event Wiring
  /**************************************************************************/

  describe('view events', function() {
    describe('add task to collection', function() {
      it('#travis calls updateTask', function() {
        spyOn(Canto.KanbanColumnView.prototype, 'updateTask');
        var newView = new Canto.KanbanColumnView(data);
        var newTask = new Canto.TaskModel({id: 4, owner_id: 342, title: 'Hello World'});
        newView.collection.trigger('add', newTask);
        expect(Canto.KanbanColumnView.prototype.updateTask).toHaveBeenCalled();
      });
    });

    describe('change:backlog', function() {
      it('#travis calls removeTask', function() {
        spyOn(Canto.KanbanColumnView.prototype, 'removeTask');
        var newView = new Canto.KanbanColumnView(data);
        newView.collection.trigger('change:backlog', task1);
        expect(Canto.KanbanColumnView.prototype.removeTask).toHaveBeenCalledWith(task1);
      });
    });
  });

  /* Event Callbacks
  /**************************************************************************/

  describe('event callbacks', function() {
    describe('removeTask()', function() {
      it('#travis removes the task', function() {
        spyOn(collection, 'remove');
        view.removeTask(view.collection.models[0]);
        expect(collection.remove.calls.argsFor(0)[0]).toEqual(view.collection.models[0]);
      });
    });

    describe('updateTask()', function() {
      it('#travis modifies the task with the column\'s groupedBy property', function() {
        spyOn(task3, 'save');
        view.updateTask(task3);
        expect(task3.save).toHaveBeenCalledWith({status: 'New'});
      });

      context('when the attributes already match', function() {
        it('#travis doesn\'t call save on the task', function() {
          spyOn(task1, 'save');
          view.updateTask(task1);
          expect(task1.save).not.toHaveBeenCalled();
        });
      });
    });
  });

  /* Special Functions
  /**************************************************************************/

  describe('special functions', function() {
    describe('setCollection()', function() {
      var newView;

      beforeEach(function() { 
        delete data.collection;
        newView = new Canto.KanbanColumnView();
      });

      afterAll(function() {
        data.collection = collection;
      });

      it('#travis sets the collection', function() {
        newView.setCollection(collection);
        expect(newView.collection).toBe(collection);
      });

      it('#travis creates a collection view', function() {
        newView.setCollection(collection);
        expect(newView.collectionView.isA('TaskCollectionView')).toBe(true);
      });
    });
  });

  /* Core View Functions
  /**************************************************************************/

  describe('remove()', function() {
    it('#travis removes the collection view', function() {
      spyOn(view.collectionView, 'remove');
      view.remove();
      expect(view.collectionView.remove).toHaveBeenCalled();
    });

    it('#travis removes itself from the DOM using the Canto View prototype', function() {
      spyOn(Canto.View.prototype.remove, 'call');
      view.remove();
      expect(Canto.View.prototype.remove.call).toHaveBeenCalledWith(view);
    });
  });

  describe('render()', function() {
    it('#travis renders the collection view', function() {
      spyOn(view.collectionView, 'render');
      view.render();
      expect(view.collectionView.render).toHaveBeenCalled();
    });

    it('#travis attaches the collection view to the DOM', function() {
      $('body').html(view.$el);
      view.render();
      expect(view.$('ul.task-list')).toBeInDom();
    });
  });

  /* Special Functions
  /**************************************************************************/

  describe('special functions', function() {
    describe('isA()', function() {
      it('#travis returns true with argument KanbanColumnView', function() {
        expect(view.isA('KanbanColumnView')).toBe(true);
      });

      it('#travis returns true with argument KanbanColumn', function() {
        expect(view.isA('KanbanColumn')).toBe(true);
      });

      it('#travis returns true with argument PartialView', function() {
        expect(view.isA('PartialView')).toBe(true);
      });

      it('#travis returns false with another argument', function() {
        expect(view.isA('Corvette')).toBe(false);
      });
    });
  });
});