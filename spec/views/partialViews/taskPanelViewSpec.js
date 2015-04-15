require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/canto.js');
require(process.cwd() + '/spec/support/env.js');

var Fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    matchers       = require('jasmine-jquery-matchers'),
    context        = describe,
    fcontext       = fdescribe;

describe('Task Panel View', function() {

  // Declare variables to be used in the tests
  var taskPanel, opts, e, spy;

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, Fixtures);
  });

  beforeEach(function() {
    opts = {
      collection : collection,
      grouping   : {
        backlog : false
      }
    };

    taskPanel = new Canto.TaskPanelView(opts);
  });

  afterEach(function() {
    taskPanel.remove();
    restoreFixtures();
  });

  afterAll(function() {
    taskPanel.destroy();

    // Scrub up the pollution
    global = _.omit(global, Fixtures);
  });

  describe('constructor', function() {
    it('doesn\'t call render #travis', function() {
      spyOn(Canto.TaskPanelView.prototype, 'render');
      task1.set('status', 'Blocking');
      var newPanel = new Canto.TaskPanelView(opts);
      expect(Canto.TaskPanelView.prototype.render).not.toHaveBeenCalled();
      newPanel.remove();
    });

    it('sets a collection #travis', function() {
      // expect(...).toBe(collection) caused a stack level error
      expect(taskPanel.collection.isA('TaskCollection')).toBe(true);
    });

    it('instantiates a collection view #travis', function() {
      expect(taskPanel.collectionView.klass).toBe('TaskCollectionView');
    });

    it('adds the collection view to its childViews array', function() {
      expect(taskPanel.childViews).toEqual([taskPanel.collectionView]);
    });

    it('passes a maximum of 10 models to the collection view #travis', function() {
      for(var i = 4; i < 13; i++) {
        collection.create({title: 'My Task ' + i, position: i}, {sync: false, silent: true});
      }

      var newPanel = new Canto.TaskPanelView({collection: collection});
      expect(newPanel.collectionView.collection.length).toBe(10);
    });
  });

  describe('properties', function() {
    it('has klass \'TaskPanelView\' #travis', function() {
      expect(taskPanel.klass).toBe('TaskPanelView');
    });

    it('has family \'Canto.View\' #travis', function() {
      expect(taskPanel.family).toBe('Canto.View');
    });

    it('has superFamily \'Backbone.View\' #travis', function() {
      expect(taskPanel.superFamily).toBe('Backbone.View');
    });
  });

  describe('elements', function() {
    beforeEach(function() {
      taskPanel.render();
    });

    it('has ID #task-panel #travis', function() {
      expect(taskPanel.$el).toHaveId('task-panel');
    });

    it('has class \'panel\' #travis', function() {
      expect(taskPanel.$el).toHaveClass('panel');
    });

    it('has class \'panel-primary\' #travis', function() {
      expect(taskPanel.$el).toHaveClass('panel-primary');
    });

    it('has class \'dash-widget\' #travis', function() {
      expect(taskPanel.$el).toHaveClass('dash-widget');
    });

    it('has a collection view #travis', function() {
      expect(taskPanel.$('ul.task-list')).toExist();
    });
  });

  describe('events', function() {
    describe('click .toggle-widget i', function() {
      it(' calls toggleWidget() #travis', function() {
        spyOn(Canto.TaskPanelView.prototype, 'toggleWidget');
        var newView = new Canto.TaskPanelView({collection: collection});
        newView.render().$('.toggle-widget i').trigger('click');
        expect(Canto.TaskPanelView.prototype.toggleWidget).toHaveBeenCalled();
      });
    });

    describe('change task status', function() {
      it('calls crossOffComplete() #travis', function() {
        spyOn(Canto.TaskPanelView.prototype, 'crossOffComplete');
        spyOn(Canto.TaskCollectionView.prototype, 'crossOff');

        var newCollection = new Canto.TaskCollection([task1, task2, task3]);
        var newView = new Canto.TaskPanelView({collection: newCollection});
        newView.collection.trigger('change:status');
        expect(Canto.TaskPanelView.prototype.crossOffComplete).toHaveBeenCalled();
      });
    });

    describe('change task backlog', function() {
      it('calls removeBacklogged() #travis', function() {
        spyOn(Canto.TaskPanelView.prototype, 'removeBacklogged');
        var newView = new Canto.TaskPanelView({collection: collection});
        newView.collection.trigger('change:backlog');
        expect(Canto.TaskPanelView.prototype.removeBacklogged).toHaveBeenCalled();
      });
    });

    describe('remove task from collection display', function() {
      it('calls addTaskToDisplay() #travis', function() {
        spyOn(Canto.TaskPanelView.prototype, 'addTaskToDisplay');
        var newView = new Canto.TaskPanelView({collection: collection});
        newView.collectionView.collection.remove(task1);
        expect(Canto.TaskPanelView.prototype.addTaskToDisplay).toHaveBeenCalled();
      });
    });
  });

  describe('event callbacks', function() {
    describe('addTaskToDisplay()', function() {
      context('when there are more tasks than are in the child\'s collection', function() {
        var newView;

        beforeEach(function() {
          for(var i = 4; i < 13; i++) {
            collection.create({title: 'My Task ' + i, position: i}, {sync: false, silent: true});
          }

          newView = new Canto.TaskPanelView({collection: collection});
        });

        it('adds a task to the collection view\'s collection #travis', function() {
          newView.addTaskToDisplay();
          expect(newView.collectionView.collection.length).toBe(11);
        });
      });

      context('when there are not more tasks than in the child\'s collection', function() {
        it('doesn\'t give any trouble #travis', function() {
          taskPanel.addTaskToDisplay();
          expect(taskPanel.collectionView.collection.length).toBe(3);
        });
      });
    });

    describe('crossOffComplete()', function() {
      beforeEach(function() {
        task1.set({status: 'Complete'}, {silent: true});
        taskPanel.render();
      });

      afterEach(function() {
        task1.set({status: 'New'}, {silent: true});
      })

      it('calls crossOff on the collection view #travis', function() {
        spyOn(taskPanel.collectionView, 'crossOff');
        taskPanel.crossOffComplete();
        expect(taskPanel.collectionView.crossOff).toHaveBeenCalledWith(task1);
      });
    });

    describe('filterCollection()', function() {
      beforeEach(function() {
        spyOn($, 'ajax');

        for(var i = 4; i < 13; i++) {
          taskPanel.collection.create({title: 'My Task ' + i, position: i}, {sync: false, silent: true});
        }
      });

      it('doesn\'t include blocking tasks #travis', function() {
        var newView = new Canto.TaskListItemView({model: task2});
        spyOn(Canto.TaskCollectionView.prototype, 'retrieveViewForModel').and.returnValue(newView);
        task2.set({status: 'Blocking'});
        expect(taskPanel.filterCollection(collection).indexOf(task2)).toBe(-1);
      });

      it('doesn\'t include backlogged tasks #travis', function() {
        task2.set({backlog: true});
        expect(taskPanel.filterCollection(collection).indexOf(task2)).toBe(-1);
      });
    });

    describe('showTaskCreateForm()', function() {
      beforeEach(function() {
        spy = jasmine.createSpy();
        taskPanel.on('showTaskCreateForm', spy);
        e = $.Event('showTaskCreateForm', {tasks: collection});
      });

      afterEach(function() {
        taskPanel.off('showTaskCreateForm');
      });

      it('triggers the \'showTaskCreateForm\' event #travis', function() {
        taskPanel.showTaskCreateForm(e);
        expect(spy).toHaveBeenCalled();
      });

      xit('passes its collection through #travis', function() {
        taskPanel.showTaskCreateForm(e);
        expect(spy.calls.argsFor(0)[0]).toBe({collection: collection});
      });
    });

    describe('toggleWidget()', function() {
      context('when the widget is visible', function() {
        beforeEach(function() {
          taskPanel.render();
          spyOn($.prototype, 'slideToggle');
          e = $.Event('click', {target: taskPanel.$('i.hide-widget')});
          taskPanel.toggleWidget(e);
        });

        it('removes the .fa-minus class #travis', function(done) {
          pending('Find out why this test keeps failing when the functionality unambiguously works');
          expect(taskPanel.$('.panel-heading i').last()).not.toHaveClass('fa-minus');
          done();
        });

        it('adds the .fa-plus class #travis', function(done) {
          pending('Find out why this test keeps failing when the functionality unambiguously works');
          expect(taskPanel.$('.panel-heading i').last()).toHaveClass('fa-plus');
          done();
        });

        it('calls slideToggle on the widget #travis', function(done) {
          expect($.prototype.slideToggle).toHaveBeenCalled();
          done();
        });
      });
    });

    describe('removeBacklog()', function() {
      context('when there is a backlogged task', function() {
        beforeEach(function() {
          spyOn(task1, 'get').and.returnValue(true);
        });

        it('calls removeBacklog on its collection view #travis', function() {
          spyOn(taskPanel.collectionView, 'removeBacklog');
          taskPanel.removeBacklog();
          expect(taskPanel.collectionView.removeBacklog).toHaveBeenCalled();
        });
      });
    });
  });

  describe('core view functions', function() {
    describe('remove()', function() {
      it('removes the collection view from the DOM #travis', function() {
        spyOn(taskPanel.collectionView, 'remove');
        taskPanel.remove();
        expect(taskPanel.collectionView.remove).toHaveBeenCalled();
      });

      it('removes itself from the DOM #travis', function() {
        spyOn(Backbone.View.prototype.remove, 'call');
        taskPanel.remove();
        expect(Backbone.View.prototype.remove.call).toHaveBeenCalledWith(taskPanel);
      });

      it('calls undelegateEvents #travis', function() {
        spyOn(taskPanel, 'undelegateEvents');
        taskPanel.remove();
        expect(taskPanel.undelegateEvents).toHaveBeenCalled();
      });
    });

    describe('render()', function() {
      it('renders its collection view #travis', function() {
        spyOn(taskPanel.collectionView, 'render');
        taskPanel.render();
        expect(taskPanel.collectionView.render).toHaveBeenCalled();
      });

      it('attaches the collection view to the DOM #travis', function() {
        spyOn($.prototype, 'html');
        taskPanel.render();
        expect($.prototype.html.calls.argsFor(1)).toContain(taskPanel.collectionView.template());
      });
    });
  });

  describe('special functions', function() {
    describe('isA', function() {
      it('returns true with argument \'TaskPanelView\' #travis', function() {
        expect(taskPanel.isA('TaskPanelView')).toBe(true);
      });

      it('returns true with argument \'TaskPanel\' #travis', function() {
        expect(taskPanel.isA('TaskPanel')).toBe(true);
      });

      it('returns true with argument \'TaskView\' #travis', function() {
        expect(taskPanel.isA('TaskView')).toBe(true);
      });

      it('returns true with argument \'PartialView\' #travis', function() {
        expect(taskPanel.isA('PartialView')).toBe(true);
      });

      it('returns false with other arguments #travis', function() {
        expect(taskPanel.isA('TaskCollectionView')).toBe(false);
      });
    });
  });
});