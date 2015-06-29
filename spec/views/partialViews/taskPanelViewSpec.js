require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

var Fixtures       = require('../../support/fixtures/fixtures.js'),
    matchers       = require('jasmine-jquery-matchers'),
    context        = describe,
    fcontext       = fdescribe;

/* Task Panel View Spec
/****************************************************************************************/

describe('Task Panel View', function() {
//   var taskPanel, opts, e, spy;

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, Fixtures);
  });

  beforeEach(function() {
    taskPanel = new Tessitura.TaskPanelView({collection: collection});
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
    it('doesn\'t call render #taskPanelView #partialView #view #travis', function() {
      spyOn(Tessitura.TaskPanelView.prototype, 'render');
      task1.set('status', 'Blocking');
      var newPanel = new Tessitura.TaskPanelView({collection: collection});
      expect(Tessitura.TaskPanelView.prototype.render).not.toHaveBeenCalled();
      newPanel.remove();
    });

    it('sets a collection #taskPanelView #partialView #view #travis', function() {
      // expect(...).toBe(collection) caused a stack level error
      expect(taskPanel.collection.isA('TaskCollection')).toBe(true);
    });

    it('has a quick-add form #taskPanelView #partialView #view #travis', function() {
      expect(taskPanel.quickAddForm.isA('QuickAddForm')).toBe(true);
    });

    it('creates a childViews array with its list items #taskPanelView #partialView #view #travis', function() {
      expect(taskPanel.childViews.length).toBe(1); // because of the quick-add form
    });
  });

  describe('properties', function() {
    it('has klass \'TaskPanelView\' #taskPanelView #partialView #view #travis', function() {
      expect(taskPanel.klass).toBe('TaskPanelView');
    });

    it('has family \'Tessitura.View\' #taskPanelView #partialView #view #travis', function() {
      expect(taskPanel.family).toBe('Tessitura.View');
    });

    it('has superFamily \'Backbone.View\' #taskPanelView #partialView #view #travis', function() {
      expect(taskPanel.superFamily).toBe('Backbone.View');
    });
  });

  describe('elements', function() {
    beforeEach(function() {
      taskPanel.render();
    });

    it('has ID #task-panel #taskPanelView #partialView #view #travis', function() {
      expect(taskPanel.$el).toHaveId('task-panel');
    });

    it('has class \'panel\' #taskPanelView #partialView #view #travis', function() {
      expect(taskPanel.$el).toHaveClass('panel');
    });

    it('has class \'panel-primary\' #taskPanelView #partialView #view #travis', function() {
      expect(taskPanel.$el).toHaveClass('panel-primary');
    });

    it('has class \'dash-widget\' #taskPanelView #partialView #view #travis', function() {
      expect(taskPanel.$el).toHaveClass('dash-widget');
    });

    it('displays the collection #taskPanelView #partialView #view #travis', function() {
      expect(taskPanel.$('ul.task-list')).toExist();
    });
  });

  describe('events', function() {
    describe('change task backlog', function() {
      it('calls render() #taskPanelView #partialView #view #travis', function() {
        spyOn(Tessitura.TaskPanelView.prototype, 'render');
        var newView = new Tessitura.TaskPanelView({collection: collection});
        newView.collection.trigger('change:backlog');
        expect(Tessitura.TaskPanelView.prototype.render).toHaveBeenCalled();
      });
    });

    describe('change task status', function() {
      it('calls crossOff() #taskPanelView #partialView #view #travis', function() {
        spyOn(Tessitura.TaskPanelView.prototype, 'crossOff');
        var newView = new Tessitura.TaskPanelView({collection: collection});
        newView.collection.models[0].set('status', 'In Progress');
        expect(Tessitura.TaskPanelView.prototype.crossOff).toHaveBeenCalled();
      });
    });
  });

  describe('event callbacks', function() {
    describe('crossOff', function() {
      context('when the task is complete', function() {
        beforeEach(function() {
          taskPanel.render();
          task1.set({status: 'Complete'}, {silent: true});
        });

        it('retrieves the view for the task #taskPanelView #partialView #view #travis', function() {
          spyOn(taskPanel, 'retrieveViewForModel');
          taskPanel.crossOff(task1);
          expect(taskPanel.retrieveViewForModel).toHaveBeenCalledWith(task1);
        });

        it('removes the task from the collection #taskPanelView #partialView #view #travis', function(done) {
          var spy = jasmine.createSpy();
          taskPanel.collection.on('remove', spy);
          taskPanel.crossOff(task1);
          setTimeout(function() {
            expect(spy).toHaveBeenCalled();
            taskPanel.off('remove', spy);
            done();
          }, 750);
        });

        it('destroys the view #taskPanelView #partialView #view #travis', function(done) {
          var child = taskPanel.retrieveViewForModel(task1);
          spyOn(child, 'destroy');
          taskPanel.crossOff(task1);
          setTimeout(function() {
            expect(child.destroy).toHaveBeenCalled();
            done();
          }, 750);
        });

        it('removes the view from the childViews array #taskPanelView #partialView #view #travis', function(done) {
          var child = taskPanel.retrieveViewForModel(task1);
          taskPanel.crossOff(task1);
          setTimeout(function() {
            expect(taskPanel.childViews.indexOf(child)).toEqual(-1);
            done();
          }, 750);
        });
      });


      context('when the task is incomplete', function() {
          beforeEach(function() {
            taskPanel.render();
            task1.set({status: 'New'}, {silent: true});
          });

        it('doesn\'t call destroy on the child view #taskPanelView #partialView #view #travis', function(done) {
          var child = taskPanel.retrieveViewForModel(task1);
          spyOn(child, 'destroy');
          taskPanel.crossOff(task1);

          setTimeout(function() {
            expect(child.destroy).not.toHaveBeenCalled();
            done();
          }, 750);
        });

        it('doesn\'t remove the view from the childViews array #taskPanelView #partialView #view #travis', function() { 
          var child = taskPanel.retrieveViewForModel(task1);
          taskPanel.crossOff(task1);
          setTimeout(function() {
            expect(taskPanel.childViews).toContain(child);
          }, 750);
        });

        it('doesn\'t remove the task from the collection #taskPanelView #partialView #view #travis', function() {
          var spy = jasmine.createSpy();
          taskPanel.collection.on('remove', spy);
          taskPanel.crossOff(task1);

          setTimeout(function() {
            expect(spy).not.toHaveBeenCalled();
          }, 750);
        });
      });
    });
  });

  describe('core view functions', function() {
    describe('remove()', function() {
      it('removes its child views from the DOM #taskPanelView #partialView #view #travis', function() {
        taskPanel.remove();
        expect(taskPanel.$('.task-list-item')).not.toBeInDom();
      });

      it('removes itself from the DOM #taskPanelView #partialView #view #travis', function() {
        spyOn(Backbone.View.prototype.remove, 'call');
        taskPanel.remove();
        expect(Backbone.View.prototype.remove.call).toHaveBeenCalledWith(taskPanel);
      });
    });
  });

  describe('special functions', function() {
    describe('isA', function() {
      it('returns true with argument \'TaskPanelView\' #taskPanelView #partialView #view #travis', function() {
        expect(taskPanel.isA('TaskPanelView')).toBe(true);
      });

      it('returns true with argument \'TaskPanel\' #taskPanelView #partialView #view #travis', function() {
        expect(taskPanel.isA('TaskPanel')).toBe(true);
      });

      it('returns true with argument \'TaskView\' #taskPanelView #partialView #view #travis', function() {
        expect(taskPanel.isA('TaskView')).toBe(true);
      });

      it('returns true with argument \'PartialView\' #taskPanelView #partialView #view #travis', function() {
        expect(taskPanel.isA('PartialView')).toBe(true);
      });

      it('returns true with argument \'DashWidgetView\' #taskPanelView #partialView #view #travis', function() {
        expect(taskPanel.isA('DashWidgetView')).toBe(true);
      });

      it('returns false with other arguments #taskPanelView #partialView #view #travis', function() {
        expect(taskPanel.isA('TaskCollectionView')).toBe(false);
      });
    });

    describe('renderCollection', function() {
      it('renders the collection #taskPanelView #partialView #view #travis', function() {
        pending('Figure out the right way to test this');
        taskPanel.renderCollection();
        expect(taskPanel.childViews.length).toBe(4);
      });

      it('displays a maximum of 10 tasks #taskPanelView #partialView #view #travis', function() {
        pending('FUFNR');
        for(var i = 4; i < 13; i++) {
          collection.create({title: 'My Task ' + i, status: 'New', priority: 'Normal', position: i});
        }

        taskPanel.render();
        expect(taskPanel.childViews.length).toBe(11);  // because of the quick-add form
      });
    });
  });
});