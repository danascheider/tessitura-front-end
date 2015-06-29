/* Core Requires
/****************************************************************************/

require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = _.extend(require('jasmine-jquery-matchers')),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

/* Kanban Column View Spec
/****************************************************************************/

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
      expect(newView.quickAddForm.isA('QuickAddForm')).toBe(true);
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
    describe('crossOff', function() {
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

        it('removes the view from the childViews array #viewView #partialView #view #travis', function(done) {
          var child = view.retrieveViewForModel(task1);
          view.crossOff(task1);
          setTimeout(function() {
            expect(view.childViews.indexOf(child)).toEqual(-1);
            done();
          }, 750);
        });
      });


      context('when the task is incomplete', function() {
          beforeEach(function() {
            view.render();
            task1.set({status: 'New'}, {silent: true});
          });

        it('doesn\'t call destroy on the child view #viewView #partialView #view #travis', function(done) {
          var child = view.retrieveViewForModel(task1);
          spyOn(child, 'destroy');
          view.crossOff(task1);

          setTimeout(function() {
            expect(child.destroy).not.toHaveBeenCalled();
            done();
          }, 750);
        });

        it('doesn\'t remove the view from the childViews array #viewView #partialView #view #travis', function(done) { 
          var child = view.retrieveViewForModel(task1);
          view.crossOff(task1);
          setTimeout(function() {
            expect(view.childViews).toContain(child);
            done();
          });
        });

        it('doesn\'t remove the task from the collection #viewView #partialView #view #travis', function(done) {
          var spy = jasmine.createSpy();
          view.collection.on('remove', spy);
          view.crossOff(task1);

          setTimeout(function() {
            expect(spy).not.toHaveBeenCalled();
            done();
          }, 750);
        });
      });
    });
  });

  /* Special Functions
  /**************************************************************************/

  describe('special functions', function() {
    describe('renderModels', function() {
      it('renders the models #taskPanelView #partialView #view #travis', function() {
        pending('Figure out the right way to test this');
        view.renderModels();
        expect(view.childViews.length).toBe(4);
      });
    });

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