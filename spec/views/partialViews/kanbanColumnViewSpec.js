/* Core Requires
/****************************************************************************/

require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = _.extend(require('jasmine-jquery-matchers')),
    context        = describe,
    fcontext       = fdescribe;

/* Kanban Column View Spec
/****************************************************************************/

describe('Kanban Column View', function() {
  var view, newView, user, collection, task1, task2, task3, data;

  /* Filters
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
  });

  beforeEach(function() {
    user = new Tessitura.UserModel({id: 1, username: 'testuser', password: 'testuser', email: 'testuser@example.com', first_name: 'Test', last_name: 'User'});

    task1 = new Tessitura.TaskModel({id: 1, owner_id: 1, title: 'Task 1', status: 'New', priority: 'Low', position: 1});
    task2 = new Tessitura.TaskModel({id: 2, owner_id: 1, title: 'Task 2', status: 'New', priority: 'Normal', position: 2});
    task3 = new Tessitura.TaskModel({id: 3, owner_id: 1, title: 'Task 3', status: 'Complete', priority: 'Normal', position: 3});

    collection = user.tasks = new Tessitura.TaskCollection([task1, task2, task3]);
    data = {collection: collection, color: 'blue', icon: 'fa-exclamation-circle', headline: 'New'};

    spyOn(Tessitura.TaskModel.prototype, 'displayTitle').and.returnValue('foobar');
    view = new Tessitura.KanbanColumnView(data);
  });

  afterEach(function() {
    _.each([view, user, task1, task2, task3, collection], function(ob) { ob.destroy(); });
    newView && newView.destroy(); 
  });

  afterAll(function() {
    view = null;
  });

  /* Static Properties
  /**************************************************************************/

  describe('properties', function() {
    it('has klass KanbanColumnView #kanbanColumnView #partialView #view #travis', function() {
      expect(view.klass).toEqual('KanbanColumnView');
    });

    it('has family Tessitura.View #kanbanColumnView #partialView #view #travis', function() {
      expect(view.family).toEqual('Tessitura.View');
    });

    it('has superFamily Backbone.View #kanbanColumnView #partialView #view #travis', function() {
      expect(view.superFamily).toEqual('Backbone.View');
    });
  });

  /* View Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render #kanbanColumnView #partialView #view #travis', function() {
      spyOn(Tessitura.KanbanColumnView.prototype, 'render');
      newView = new Tessitura.KanbanColumnView(data);
    });

    it('calls setCollection #kanbanColumnView #partialView #view #travis', function () {
      spyOn(Tessitura.KanbanColumnView.prototype, 'setCollection');
      newView = new Tessitura.KanbanColumnView(data);
      expect(Tessitura.KanbanColumnView.prototype.setCollection.calls.argsFor(0)[0]).toEqual(collection);
    });

    it('sets the data property #kanbanColumnView #partialView #view #travis', function() {
      newView = new Tessitura.KanbanColumnView(data);
      _.each(['color', 'icon', 'headline'], function(prop) {
        expect(newView.data[prop]).toEqual(data[prop]);
      });
    });

    it('can be instantiated without a collection #kanbanColumnView #partialView #view #travis', function() {
      delete data.collection;
      newView = new Tessitura.KanbanColumnView(data)
      expect(newView.collection).not.toExist();
      data.collection = user.tasks;
    });

    describe('groupedBy property', function() {
      context('when grouped by backlog', function() {
        it('sets groupedBy to Backlog #kanbanColumnView #partialView #view #travis', function() {
          data.headline = 'Backlog';
          newView = new Tessitura.KanbanColumnView(data);
          expect(newView.groupedBy).toEqual({backlog: true});
          data.headline = 'New';
        });
      });

      context('when grouped by status', function() {
        it('sets groupedBy to the appropriate status #kanbanColumnView #partialView #view #travis', function() {
          newView = new Tessitura.KanbanColumnView(data);
          expect(newView.groupedBy).toEqual({status: 'New'});
        });
      });
    });

    it('creates a collection view #kanbanColumnView #partialView #view #travis', function() {
      expect(view.collectionView.isA('TaskCollectionView')).toBe(true);
    });
  });

  /* View Elements
  /**************************************************************************/

  describe('view elements', function() {
    it('is a div #kanbanColumnView #partialView #view #travis', function() {
      expect(view.$el).toHaveTag('div');
    });

    it('has class .panel #kanbanColumnView #partialView #view #travis', function() {
      expect(view.$el).toHaveClass('panel');
    });

    it('has class .dash-widget #kanbanColumnView #partialView #view #travis', function() {
      expect(view.$el).toHaveClass('dash-widget');
    });

    it('has class .kanban-column #kanbanColumnView #partialView #view #travis', function() {
      expect(view.$el).toHaveClass('kanban-column');
    });

    it('sets its panel color #kanbanColumnView #partialView #view #travis', function() {
      expect(view.$el).toHaveClass('panel-blue');
    });
  });

  /* Event Wiring
  /**************************************************************************/

  describe('view events', function() {
    describe('add task to collection', function() {
      it('calls updateTask #kanbanColumnView #partialView #view #travis', function() {
        spyOn(Tessitura.KanbanColumnView.prototype, 'updateTask');
        newView = new Tessitura.KanbanColumnView(data);
        var newTask = new Tessitura.TaskModel({id: 4, owner_id: 1, title: 'Hello World'});
        newView.collection.trigger('add', newTask);
        expect(Tessitura.KanbanColumnView.prototype.updateTask).toHaveBeenCalled();
      });
    });

    describe('change:backlog', function() {
      it('calls removeTask #kanbanColumnView #partialView #view #travis', function() {
        spyOn(Tessitura.KanbanColumnView.prototype, 'removeTask');
        newView = new Tessitura.KanbanColumnView(data);
        newView.collection.trigger('change:backlog', task1);
        expect(Tessitura.KanbanColumnView.prototype.removeTask).toHaveBeenCalledWith(task1);
      });
    });
  });

  /* Event Callbacks
  /**************************************************************************/

  describe('event callbacks', function() {
    describe('removeTask()', function() {
      it('removes the task #kanbanColumnView #partialView #view #travis', function() {
        spyOn(collection, 'remove');
        view.removeTask(view.collection.models[0]);
        expect(collection.remove.calls.argsFor(0)[0]).toEqual(view.collection.models[0]);
      });
    });

    describe('updateTask()', function() {
      it('modifies the task with the column\'s groupedBy property #kanbanColumnView #partialView #view #travis', function() {
        spyOn(task3, 'save');
        view.updateTask(task3);
        expect(task3.save).toHaveBeenCalledWith({status: 'New'});
      });

      context('when the attributes already match', function() {
        it('doesn\'t call save on the task #kanbanColumnView #partialView #view #travis', function() {
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
      newView;

      beforeEach(function() { 
        delete data.collection;
        newView = new Tessitura.KanbanColumnView();
      });

      afterAll(function() {
        data.collection = collection;
      });

      it('sets the collection #kanbanColumnView #partialView #view #travis', function() {
        newView.setCollection(collection);
        expect(newView.collection).toBe(collection);
      });

      it('creates a collection view #kanbanColumnView #partialView #view #travis', function() {
        newView.setCollection(collection);
        expect(newView.collectionView.isA('TaskCollectionView')).toBe(true);
      });
    });
  });

  /* Core View Functions
  /**************************************************************************/

  describe('remove()', function() {
    it('removes the collection view #kanbanColumnView #partialView #view #travis', function() {
      spyOn(view.collectionView, 'remove');
      view.remove();
      expect(view.collectionView.remove).toHaveBeenCalled();
    });

    it('removes itself from the DOM using the Tessitura View prototype #kanbanColumnView #partialView #view #travis', function() {
      spyOn(Tessitura.View.prototype.remove, 'call');
      view.remove();
      expect(Tessitura.View.prototype.remove.call).toHaveBeenCalledWith(view);
    });
  });

  describe('render()', function() {
    it('renders the collection view #kanbanColumnView #partialView #view #travis', function() {
      spyOn(view.collectionView, 'render');
      view.render();
      expect(view.collectionView.render).toHaveBeenCalled();
    });

    it('attaches the collection view to the DOM #kanbanColumnView #partialView #view #travis', function() {
      $('body').html(view.$el);
      view.render();
      expect(view.$('ul.task-list')).toBeInDom();
    });
  });

  /* Special Functions
  /**************************************************************************/

  describe('special functions', function() {
    describe('isA()', function() {
      it('returns true with argument KanbanColumnView #kanbanColumnView #partialView #view #travis', function() {
        expect(view.isA('KanbanColumnView')).toBe(true);
      });

      it('returns true with argument KanbanColumn #kanbanColumnView #partialView #view #travis', function() {
        expect(view.isA('KanbanColumn')).toBe(true);
      });

      it('returns true with argument PartialView #kanbanColumnView #partialView #view #travis', function() {
        expect(view.isA('PartialView')).toBe(true);
      });

      it('returns false with another argument #kanbanColumnView #partialView #view #travis', function() {
        expect(view.isA('Corvette')).toBe(false);
      });
    });
  });
});