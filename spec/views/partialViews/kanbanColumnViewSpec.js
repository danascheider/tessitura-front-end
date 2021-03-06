/* Core Requires
/****************************************************************************/

/* istanbul ignore require */
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

/* istanbul ignore next */
var matchers       = _.extend(require('jasmine-jquery-matchers')),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    ccontext       = ddescribe;

/* Kanban Column View Spec
/****************************************************************************/

/* istanbul ignore next */
describe('Kanban Column View', function() {
  var view, newView, data;

  /* Filters
  /**************************************************************************/

  beforeEach(function() {
    this.addMatchers(matchers);
    _.extend(global, fixtures);
    data = {collection: collection, color: 'blue', icon: 'fa-exclamation-circle', headline: 'New', groupedBy: {status: 'New'}};
    spyOn(Tessitura.TaskModel.prototype, 'displayTitle').andReturn('foobar');
  });

  afterEach(function() {
    restoreFixtures();
    view && view.destroy();
    newView && newView.destroy(); 
    _.omit(global, fixtures);
  });

  /* View Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render #kanbanColumnView #partialView #view #travis', function() {
      spyOn(Tessitura.KanbanColumnView.prototype, 'render');
      newView = new Tessitura.KanbanColumnView(data);
    });

    it('sets the color property #kanbanColumnView #partialView #view #travis', function() {
      newView = new Tessitura.KanbanColumnView(data);
      expect(newView.color).toEqual(data.color);
    });

    it('sets the icon property #kanbanColumnView #partialView #view #travis', function() {
      newView = new Tessitura.KanbanColumnView(data);
      expect(newView.icon).toEqual(data.icon);
    });

    it('sets the headline property #kanbanColumnView #partialView #view #travis', function() {
      newView = new Tessitura.KanbanColumnView(data);
      expect(newView.headline).toEqual(data.headline);
    });

    it('sets the groupedBy property #kanbanColumnView #partialView #view #travis', function() {
      newView = new Tessitura.KanbanColumnView(data);
      expect(newView.groupedBy).toEqual({status: 'New'});
    });

    it('can be instantiated without a collection #kanbanColumnView #partialView #view #travis', function() {
      delete data.collection;
      newView = new Tessitura.KanbanColumnView(data)
      expect(typeof newView.collection).toBe('undefined');
      data.collection = user.tasks;
    });

    it('has a quick-add form #kanbanColumnView #partialView #view #travis', function() {
      newView = new Tessitura.KanbanColumnView(data);
      expect(newView.quickAddForm.isA('Tessitura.View')).toBe(true);
    });

    it('creates a childViews array #kanbanColumnView #partialView #view #travis', function() {
      newView = new Tessitura.KanbanColumnView(data);
      expect(newView.childViews).toExist();
    });
  });

  /* View Elements
  /**************************************************************************/

  describe('view elements', function() {
    beforeEach(function() {
      view = view || new Tessitura.KanbanColumnView(data);
      view.render();
    });

    afterEach(function() { view.remove(); });

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

    it('has a task list UL #kanbanColumnView #partialView #view #travis', function() {
      expect(view.$('.task-list')).toExist();
    });
  });

  /* Event Wiring
  /*******************************************88*****************************************/

  describe('events', function() {
    describe('showTaskCreateForm on quick-add form', function() {
      it('calls showTaskCreateForm() #kanbanColumnView #partialView #view #travis', function() {
        spyOn(Tessitura.KanbanColumnView.prototype, 'showTaskCreateForm');
        newView = new Tessitura.KanbanColumnView(data);
        newView.render();
        newView.quickAddForm.showTaskCreateForm(collection);
        expect(Tessitura.KanbanColumnView.prototype.showTaskCreateForm).toHaveBeenCalledWith(collection, newView.groupedBy);
      });
    });

    describe('showEditForm on child view', function() {
      it('calls showEditForm() #kanbanColumnView #partialView #view #travis', function() {
        spyOn(Tessitura.KanbanColumnView.prototype, 'showEditForm');
        newView = new Tessitura.KanbanColumnView(data);
        newView.render();
        var child = newView.retrieveViewForModel(task1);
        child.showEditForm(task1);
        expect(Tessitura.KanbanColumnView.prototype.showEditForm).toHaveBeenCalledWith(task1);
      });
    });

    describe('add to collection', function() {
      it('calls updateAndRender() #kanbanColumnView #partialView #view #travis', function() {
        spyOn(Tessitura.KanbanColumnView.prototype, 'updateAndRender');
        newView = new Tessitura.KanbanColumnView(data);
        var newTask = new Tessitura.TaskModel({title: 'New Task'});
        newView.collection.add([newTask]);
        expect(Tessitura.KanbanColumnView.prototype.updateAndRender).toHaveBeenCalled();
      });
    });

    describe('remove from collection', function() {
      it('calls render() #kanbanColumnView #partialView #view #travis', function() {
        spyOn(Tessitura.KanbanColumnView.prototype, 'render');
        newView = new Tessitura.KanbanColumnView(data);
        newView.collection.remove([task1]);
        expect(Tessitura.KanbanColumnView.prototype.render).toHaveBeenCalled();
      });
    });

    describe('change task status', function() {
      it('calls crossOff() #kanbanColumnView #partialView #view #travis', function() {
        spyOn(Tessitura.KanbanColumnView.prototype, 'crossOff');
        newView = new Tessitura.KanbanColumnView(data);
        newView.collection.trigger('change:status', task1);
        expect(Tessitura.KanbanColumnView.prototype.crossOff).toHaveBeenCalled();
      });
    });

    describe('change task backlog status', function() {
      it('calls removeTask() #kanbanColumnView #partialView #view #travis', function() {
        spyOn(Tessitura.KanbanColumnView.prototype, 'removeTask');
        newView = new Tessitura.KanbanColumnView(data);
        newView.collection.trigger('change:backlog', task1);
        expect(Tessitura.KanbanColumnView.prototype.removeTask).toHaveBeenCalled();
      });
    });
  });

  /* Event Callbacks
  /**************************************************************************************/

  describe('event callbacks', function() {
    beforeEach(function() {
      view = view || new Tessitura.KanbanColumnView(data);
    });

    describe('crossOff()', function() {
      beforeEach(function() {
        view.render();
      });

      afterEach(function() { view.remove(); });

      context('when the task is complete', function() {
        beforeEach(function() {
          task1.set({status: 'Complete'}, {silent: true});
        });

        it('retrieves the view for the task #viewView #partialView #view #travis', function() {
          spyOn(view, 'retrieveViewForModel');
          view.crossOff(task1);
          expect(view.retrieveViewForModel).toHaveBeenCalledWith(task1);
        });

        xit('removes the task from the collection #viewView #partialView #view #travis', function(done) {
          // 'Breaking Travis builds but passing locally'
          var spy = jasmine.createSpy();
          view.collection.on('remove', spy);
          view.crossOff(task1);
          setTimeout(function() {
            expect(spy).toHaveBeenCalled();
            view.off('remove', spy);
            done();
          }, 750);
        });

        it('destroys the view #kanbanColumnView #partialView #view #travis', function(done) {
          var child = view.retrieveViewForModel(task1);
          spyOn(child, 'destroy');
          view.crossOff(task1);
          setTimeout(function() {
            expect(child.destroy).toHaveBeenCalled();
            done();
          }, 750);
        });

        it('calls destroy on the child view #kanbanColumnView #partialView #view #travis', function(done) {
          var child = view.retrieveViewForModel(task1);
          spyOn(child, 'destroy');
          view.crossOff(task1);

          setTimeout(function() {
            expect(child.destroy).toHaveBeenCalled();
            done();
          }, 750);
        });

        it('removes the view from the childViews array #kanbanColumnView #partialView #view #travis', function(done) {
          var child = view.retrieveViewForModel(task1);
          view.crossOff(task1);
          setTimeout(function() {
            expect(view.childViews.indexOf(child)).toEqual(-1);
            done();
          }, 750);
        });
      });
    });

    describe('removeTask()', function() {
      context('when grouped by backlog', function() {
        beforeEach(function() {
          view.groupedBy = {backlog: true};
          spyOn(collection, 'remove');
        });

        it('doesn\'t remove a backlogged task #kanbanColumnView #partialView #view #travis', function() {
          view.removeTask(task4);
          expect(collection.remove).not.toHaveBeenCalled();
        });

        it('removes a non-backlogged task #kanbanColumnView #partialView #view #travis', function() {
          view.removeTask(task1);
          expect(collection.remove).toHaveBeenCalledWith(task1);
        });
      });

      context('when not grouped by backlog', function() {
        beforeEach(function() {
          spyOn(collection, 'remove');
        });

        it('removes the task #kanbanColumnView #partialView #view #travis', function() {
          view.removeTask(task2);
          expect(collection.remove).toHaveBeenCalledWith(task2);
        });
      });
    });

    describe('showTaskCreateForm()', function() {
      it('triggers the showTaskCreateForm event #kanbanColumnView #partialView #view #travis', function() {
        spy = jasmine.createSpy();
        view.on('showTaskCreateForm', spy);
        view.showTaskCreateForm(collection);
        expect(spy).toHaveBeenCalledWith(view.collection, view.groupedBy);
        view.off('showTaskCreateForm');
      });
    });

    describe('showEditForm()', function() {
      it('triggers the showEditForm event #kanbanColumnView #partialView #view #travis', function() {
        spy = jasmine.createSpy();
        view.on('showEditForm', spy);
        view.showEditForm(task1);
        expect(spy).toHaveBeenCalledWith(task1);
        view.off('showEditForm');
      });
    });
  });

  /* Special Functions
  /**************************************************************************/

  describe('special functions', function() {
    describe('renderModels', function() {
      beforeEach(function() {
        view = new Tessitura.KanbanColumnView(data);
        view.groupedBy = {status: 'New'};
      });

      it('renders the models #kanbanColumnView #partialView #view #travis', function() {
        view.renderModels();
        var task1View = _.findWhere(view.childViews, {model: task1});
        expect(task1View).toExist();
      });

      it('skips the backlogged tasks #kanbanColumnView #partialView #view #travis', function() {
        view.renderModels();
        var task4View = _.findWhere(view.childViews, {model: task4});
        expect(typeof task4View).toBe('undefined');
      });

      xit('doesn\'t skip the backlogged tasks when grouped by backlog #kanbanColumnView #partialView #view #travis', function() {
        // FUFNR
        view.groupedBy = {blocking: true};
        view.renderModels();
        var task4View = _.findWhere(view.childViews, {model: task4});
        expect(task4View).toExist();
      });
    });
  });

  /* Core View Functions
  /**************************************************************************/

  describe('remove()', function() {
    beforeEach(function() {
      view = new Tessitura.KanbanColumnView(data);
    });

    it('removes the quick-add form #kanbanColumnView #partialView #view #travis', function() {
      spyOn(view.quickAddForm, 'remove');
      view.remove();
      expect(view.quickAddForm.remove).toHaveBeenCalled();
    });

    it('removes itself from the DOM using the Tessitura View prototype #kanbanColumnView #partialView #view #travis', function() {
      spyOn(Tessitura.View.prototype.remove, 'call');
      view.remove();
      expect(Tessitura.View.prototype.remove.call).toHaveBeenCalledWith(view);
    });
  });

  describe('render()', function() {
    it('renders the quick-add form #kanbanColumnView #partialView #view #travis', function() {
      spyOn(view.quickAddForm, 'render');
      view.render();
      expect(view.quickAddForm.render).toHaveBeenCalled();
    });

    it('attaches the collection view to the DOM #kanbanColumnView #partialView #view #travis', function() {
      $('body').html(view.$el);
      view.render();
      expect(view.$('ul.task-list')).toBeInDom();
    });
  });
});