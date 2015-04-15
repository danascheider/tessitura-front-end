require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/canto.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = require('jasmine-jquery-matchers'),
    Fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

describe('Task Collection View', function() {
  var view, newView;

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, Fixtures);
  })
  
  beforeEach(function() {
    childViews = collection.models.map(function(task) { return new Canto.TaskListItemView({model: task}); });
    var models = childViews.map(function(model) { return model.cid });
    view = new Canto.TaskCollectionView({collection: collection});
  });

  afterEach(function() {
    view.remove();
    restoreFixtures();
  })

  afterAll(function() {
    view = null;
    global = _.omit(global, Fixtures)
  });

  describe('constructor', function() {
    it('does not call the render function', function() {
      spyOn(Canto.TaskCollectionView.prototype, 'render');
      var newView = new Canto.TaskCollectionView({collection: collection});
      expect(Canto.TaskCollectionView.prototype.render).not.toHaveBeenCalled();
    });

    it('creates an empty childViews array #travis', function() {
      expect(view.childViews).toEqual([]);
    });

    it('creates a quick-add form #travis', function() {
      expect(view.quickAddForm.klass).toEqual('QuickAddTaskFormView');
    });
  });

  describe('properties', function() {
    it('is a Canto.View #travis', function() {
      expect(view.isA('Canto.View')).toBe(true);
    });

    it('has klass TaskCollectionView #travis', function() {
      expect(view.klass).toEqual('TaskCollectionView');
    });

    it('has family Canto.View #travis', function() {
      expect(view.family).toEqual('Canto.View');
    });

    it('has superFamily Backbone.View #travis', function() {
      expect(view.superFamily).toEqual('Backbone.View');
    });
  });

  describe('elements', function() {
    beforeEach(function() { view.render(); });

    it('is a ul #travis', function() {
      expect(view.$el[0]).toHaveTag('UL');
    });

    it('has class .task-list #travis', function() {
      expect(view.$el[0]).toHaveClass('task-list');
    });

    it('has a list item for each task #travis', function() {
      expect(view.$('.task-list-item')).toHaveLength(3);
    });
  });

  describe('events', function() {
    beforeEach(function() {
      spyOn(Canto.TaskCollectionView.prototype, 'render');
      spyOn(Canto.TaskCollectionView.prototype, 'crossOff');
      spyOn(Canto.TaskCollectionView.prototype, 'removeChildAndRender');
      spyOn(Canto.TaskCollectionView.prototype, 'showTaskCreateForm');
      spyOn(Canto.TaskCollectionView.prototype, 'retrieveViewForModel').and.returnValue(childViews[0]);

      newView = new Canto.TaskCollectionView({collection: collection});
      newView.childViews = childViews;
    });

    afterEach(function() {
      newView.remove();
      newView.unbind();
    });

    describe('add to collection', function() {
      it('calls render() #travis', function() {
        newView.collection.trigger('add');
        expect(Canto.TaskCollectionView.prototype.render).toHaveBeenCalled();
      });
    });

    describe('remove from collection', function() {
      it('calls removeChildAndRender() #travis', function() {
        newView.collection.trigger('remove');
        expect(Canto.TaskCollectionView.prototype.render).toHaveBeenCalled();
      });
    });

    describe('fetch collection', function() {
      it('calls render() #travis', function() {
        newView.collection.trigger('fetch');
        expect(Canto.TaskCollectionView.prototype.render).toHaveBeenCalled();
      });
    });

    describe('showTaskCreateForm on quick-add form', function() {
      it('calls showTaskCreateForm() #travis', function() {
        newView.quickAddForm.trigger('showTaskCreateForm');
        expect(Canto.TaskCollectionView.prototype.showTaskCreateForm).toHaveBeenCalled();
      })
    });

    describe('change:status', function() {
      it('calls crossOff #travis', function() {
        task1.set('status', 'Complete');
        expect(Canto.TaskCollectionView.prototype.crossOff).toHaveBeenCalled();
      });
    });
  });

  describe('event callbacks', function() {
    describe('crossOff()', function() {
      context('when the task is complete', function() {
        it('retrieves the view associated with the given task #travis', function() {
          spyOn(view, 'retrieveViewForModel');
          view.crossOff(task3);
          expect(view.retrieveViewForModel).toHaveBeenCalledWith(task3);
        });

        it('destroys the view #travis', function(done) {
          view.render();
          var child = view.retrieveViewForModel(task3);
          spyOn(child, 'destroy');
          view.crossOff(task3);
          setTimeout(function() {
            expect(child.destroy).toHaveBeenCalled();
            done();
          }, 750);
        });

        it('removes the task from the collection #travis', function(done) {
          spyOn(view.collection, 'remove');
          view.crossOff(task3);
          setTimeout(function() {
            expect(view.collection.remove).toHaveBeenCalledWith(task3);
            done();
          }, 750);
        });

        it('removes the view from the childViews array #travis', function() {
          var child = view.retrieveViewForModel(task3);
          view.crossOff(task3);
          expect(view.childViews).not.toContain(child);
        });
      });

      context('when the task is incomplete', function() {
        it('doesn\'t call destroy on the view #travis', function() {
          view.render();
          var child = view.retrieveViewForModel(task2);
          spyOn(child, 'destroy');
          view.crossOff(task2);
          expect(child.destroy).not.toHaveBeenCalled();
        });
        
        it('doesn\'t remove the view from the childViews array #travis', function() {
          view.render();
          var child = view.retrieveViewForModel(task2);
          view.crossOff(task2);
          expect(view.childViews).toContain(child);
        });

        it('doesn\'t remove the task from the collection #travis', function() {
          view.crossOff(task2);
          expect(view.collection.get(2)).toBe(task2);
        });
      });
    });

    describe('removeBacklog()', function() {
      context('when there is a backlogged task', function() {
        beforeEach(function() { 
          spyOn(Canto.TaskModel.prototype, 'displayTitle').and.returnValue('foobar');
          spyOn(task2, 'get').and.returnValue(true);
        });

        it('removes the backlogged task from the collection #travis', function() {
          view.removeBacklog();
          expect(view.collection.models).not.toContain(task2);
        });

        it('destroys the task\'s view #travis', function() {
          view.render();
          var child = view.retrieveViewForModel(task2);
          spyOn(child, 'destroy');
          view.removeBacklog();
          expect(child.destroy).toHaveBeenCalled();
        });

        it('removes the view from the childViews array #travis', function() {
          view.render();
          view.removeBacklog();
          expect(view.childViews.length).toBe(2);
        });
      });

      context('when there is no backlogged task', function() {
        it('does not remove any tasks from the collection #travis', function() {
          view.removeBacklog();
          expect(view.collection.length).toBe(3);
        });

        it('does not remove child views from the child view array #travis', function() {
          view.render();
          view.removeBacklog();
          expect(view.childViews.length).toBe(3);
        });

        it('doesn\'t delete any child views #travis', function() {
          spyOn(Canto.TaskListItemView.prototype, 'destroy');
          view.removeBacklog();
          expect(Canto.TaskListItemView.prototype.destroy).not.toHaveBeenCalled();
        });
      });
    });

    describe('removeChildAndRender()', function() {
      it('removes the child view from the array #travis', function() {
        var child = childViews[1];
        view.removeChildAndRender(task2);
        expect(view.childViews).not.toContain(child);
      });

      it('calls render() #travis', function() {
        spyOn(view, 'render');
        view.removeChildAndRender(task2);
        expect(view.render).toHaveBeenCalled();
      });
    });

    describe('removeChildViews()', function() {
      beforeEach(function() { 
        view.childViews = childViews; 
        view.render();
      });

      it('calls remove() on the child views #travis', function() {
        spyOn(view.childViews[2], 'remove');
        view.removeChildViews(); 
        expect(view.childViews[2].remove).toHaveBeenCalled();
      });
    });

    describe('removeComplete()', function() {
      context('when there is a complete task', function() {
        beforeEach(function() {
          view.childViews = childViews;
          spyOn(task1, 'get').and.returnValue('Complete');
        });

        it('removes the completed task from the collection #travis', function() {
          view.removeComplete();
          expect(view.models).not.toContain(task1);
        });

        it('calls destroy on the model\'s view #travis', function() {
          view.render();
          var child = view.retrieveViewForModel(task1);
          spyOn(child, 'destroy');
          view.removeComplete();
          expect(child.destroy).toHaveBeenCalled();
        });

        it('removes the view from the childViews array #travis', function() {
          view.render();
          var child = view.retrieveViewForModel(task1);
          view.removeComplete();
          expect(view.childViews).not.toContain(child);
        });
      });

      context('when there is no complete task', function() {
        beforeEach(function() {
          spyOn(task3, 'get').and.returnValue('New');
        });

        it('doesn\'t remove any tasks from the collection #travis', function() {
          view.removeComplete();
          expect(view.collection.length).toBe(3);
        });

        it('doesn\'t remove any views from the array', function() {
          view.render().removeComplete();
          expect(view.childViews.length).toBe(3);
        });
      });
    });
  
    describe('renderCollection()', function() {
      it('renders the collection #travis', function() {
        view.renderCollection();
        expect(view.$('li.task-list-item')).toHaveLength(3);
      });
    });
  });

  describe('special functions', function() {
    describe('isA', function() {
      it('returns true with the argument TaskCollectionView #travis', function() {
        expect(view.isA('TaskCollectionView')).toBe(true);
      });

      it('returns true with the argument TaskView #travis', function() {
        expect(view.isA('TaskView')).toBe(true);
      });

      it('returns false with other arguments #travis', function() {
        expect(view.isA('deposed Nigerian warlord')).toBe(false);
      });
    });

    describe('retrieveViewForModel()', function() {
      context('when there is no view for the model', function() {
        beforeEach(function() { view.childViews = []; });

        it('returns null #travis', function() {
          expect(view.retrieveViewForModel(task1)).toBe(null);
        });
      });

      context('when there is a view for the model', function() {
        beforeEach(function() { view.childViews = childViews; });

        it('returns the appropriate view #travis', function() {
          expect((view.retrieveViewForModel(task1)).klass).toEqual('TaskListItemView');
        });
      });
    });

    describe('showTaskCreateForm()', function() {
      var spy;

      beforeEach(function() {
        spy = jasmine.createSpy();
        view.on('showTaskCreateForm', spy);
      });

      afterEach(function() { view.off('showTaskCreateForm'); });

      it('triggers the showTaskCreateForm event #travis', function() {
        view.showTaskCreateForm();
        expect(spy).toHaveBeenCalled();
      });

      it('passes its collection through #travis', function() {
        view.showTaskCreateForm();
        expect(spy.calls.mostRecent().args[0].collection.klass).toEqual('TaskCollection');
      });
    });
  });

  describe('core view functions', function() {
    describe('render()', function() {
      it('renders the quick-add form #travis', function() {
        spyOn(view.quickAddForm, 'render');
        view.render();
        expect(view.quickAddForm.render).toHaveBeenCalled();
      });

      it('renders the list items #travis', function() {
        spyOn(view, 'renderCollection');
        view.render();
        expect(view.renderCollection).toHaveBeenCalled();
      });

      it('configures sortable #travis', function() {
        spyOn($.prototype, 'sortable');
        view.render();
        expect($.prototype.sortable).toHaveBeenCalled();
      });

      it('doesn\'t apply sortable to class .not-sortable #travis', function() {
        spyOn($.prototype, 'sortable');
        view.render();
        expect($.prototype.sortable.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({
          items: '>*:not(.not-sortable)'
        }));
      })

      describe('idempotency', function() {
        beforeEach(function() { 
          view.childViews = childViews;
          view.render(); 
        });

        it('maintains the length of the list #travis', function() {
          view.render(); // render a second time
          expect(view.$('.task-list-item').length).toEqual(3);
        });

        it('maintains the length of the child view array #travis', function() {
          view.render();
          expect(view.childViews.length).toEqual(3);
        });
      });
    });

    describe('remove', function() {
      beforeEach(function() { view.render(); });

      it('calls removeChildViews() #travis', function() {
        spyOn(view, 'removeChildViews');
        view.remove();
        expect(view.removeChildViews).toHaveBeenCalled();
      });

      it('removes itself #travis', function() {
        spyOn(Canto.View.prototype.remove, 'call');
        view.remove();
        expect(Backbone.View.prototype.remove.call).toHaveBeenCalledWith(view);
      });
    });
  });
});