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
    fcontext       = fdescribe;

/* Kanban Column View Spec
/****************************************************************************/

/* istanbul ignore next */
describe('Kanban Column View', function() {
  var view, newView, data;

  /* Filters
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  });

  beforeEach(function() {
    data = {collection: collection, models: collection.models, color: 'blue', icon: 'fa-exclamation-circle', headline: 'New', groupedBy: {status: 'New'}};

    spyOn(Tessitura.TaskModel.prototype, 'displayTitle').and.returnValue('foobar');
    view = new Tessitura.KanbanColumnView(data);
  });

  afterEach(function() {
    restoreFixtures();
    newView && newView.destroy(); 
  });

  afterAll(function() {
    view.destroy();
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
      expect(newView.collection).not.toExist();
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
      view.render();
    });

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

  /* Event Callbacks
  /**************************************************************************/

  describe('event callbacks', function() {
    describe('crossOff()', function() {
      context('when the task is complete', function() {
        beforeEach(function() {
          view.render();
          task1.set({status: 'Complete'}, {silent: true});
        });

        it('retrieves the view for the task #viewView #partialView #view #travis', function() {
          spyOn(view, 'retrieveViewForModel');
          view.crossOff(task1);
          expect(view.retrieveViewForModel).toHaveBeenCalledWith(task1);
        });

        it('removes the task from the collection #viewView #partialView #view #travis', function(done) {
          var spy = jasmine.createSpy();
          view.collection.on('remove', spy);
          view.crossOff(task1);
          setTimeout(function() {
            expect(spy).toHaveBeenCalled();
            view.off('remove', spy);
            done();
          }, 750);
        });

        it('destroys the view #viewView #partialView #view #travis', function(done) {
          var child = view.retrieveViewForModel(task1);
          spyOn(child, 'destroy');
          view.crossOff(task1);
          setTimeout(function() {
            expect(child.destroy).toHaveBeenCalled();
            done();
          }, 750);
        });

        it('calls destroy on the child view #viewView #partialView #view #travis', function(done) {
          var child = view.retrieveViewForModel(task1);
          spyOn(child, 'destroy');
          view.crossOff(task1);

          setTimeout(function() {
            expect(child.destroy).toHaveBeenCalled();
            done();
          }, 750);
        });

        it('removes the view from the childViews array #viewView #partialView #view #travis', function(done) {
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

        it('doesn\'t remove a backlogged task #taskPanelView #partialView #view #travis', function() {
          view.removeTask(task4);
          expect(collection.remove).not.toHaveBeenCalled();
        });

        it('removes a non-backlogged task #taskPanel #partialView #view #travis', function() {
          view.removeTask(task1);
          expect(collection.remove).toHaveBeenCalledWith(task1);
        });
      });

      context('when not grouped by backlog', function() {
        beforeEach(function() {
          spyOn(collection, 'remove');
        });

        it('removes the task #taskPanelView #partialView #view #travis', function() {
          view.removeTask(task2);
          expect(collection.remove).toHaveBeenCalledWith(task2);
        });
      });
    });
  });

  /* Special Functions
  /**************************************************************************/

  describe('special functions', function() {
    describe('renderModels', function() {
      beforeEach(function() {
        view.groupedBy = {status: 'New'};
      });

      it('renders the models #taskPanelView #partialView #view #travis', function() {
        view.renderModels();
        var task1View = _.findWhere(view.childViews, {model: task1});
        expect(task1View).toExist();
      });

      it('skips the backlogged tasks #taskPanelView #partialView #view #travis', function() {
        view.renderModels();
        var task4View = _.findWhere(view.childViews, {model: task4});
        expect(task4View).not.toExist();
      });

      it('doesn\'t skip the backlogged tasks when grouped by backlog #taskPanelView #partialView #view #travis', function() {
        pending('FUFNR');
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