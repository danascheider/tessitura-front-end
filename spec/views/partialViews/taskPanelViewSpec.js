require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/canto.js');
require(process.cwd() + '/spec/support/env.js');

var Fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    matchers       = require('jasmine-jquery-matchers'),
    context        = describe,
    fcontext       = fdescribe;

describe('Task Panel View #travis', function() {

  // Declare variables to be used in the tests
  var taskPanel, opts, e;

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
    taskPanel.unbind();
    restoreFixtures();
  });

  afterAll(function() {
    taskPanel = null;

    // Scrub up the pollution
    global = _.omit(global, Fixtures);
  });

  describe('constructor', function() {
    it('doesn\'t call render', function() {
      spyOn(Canto.TaskPanelView.prototype, 'render');
      var newPanel = new Canto.TaskPanelView(opts);
      expect(Canto.TaskPanelView.prototype.render).not.toHaveBeenCalled();
    });

    it('sets a collection', function() {
      expect(taskPanel.collection).toBe(collection);
    });

    it('instantiates a collection view', function() {

      // For some reason, when I worded this with the toBeA('TaskCollectionView')
      // matcher, it passed even when the thing did not exist. That's why I'm 
      // using the stupid matcher.

      expect(taskPanel.collectionView).toExist();
    });
  });

  describe('properties', function() {
    it('has klass \'TaskPanelView\'', function() {
      expect(taskPanel.klass).toBe('TaskPanelView');
    });

    it('has family \'Canto.View\'', function() {
      expect(taskPanel.family).toBe('Canto.View');
    });

    it('has superFamily \'Backbone.View\'', function() {
      expect(taskPanel.superFamily).toBe('Backbone.View');
    });
  });

  describe('elements', function() {
    beforeEach(function() {
      taskPanel.render();
    });

    it('has ID #task-panel', function() {
      expect(taskPanel.$el).toHaveId('task-panel');
    });

    it('has class \'panel\'', function() {
      expect(taskPanel.$el).toHaveClass('panel');
    });

    it('has class \'panel-primary\'', function() {
      expect(taskPanel.$el).toHaveClass('panel-primary');
    });

    it('has class \'dash-widget\'', function() {
      expect(taskPanel.$el).toHaveClass('dash-widget');
    });

    it('has a collection view', function() {
      expect(taskPanel.$('ul.task-list')).toExist();
    });
  });

  describe('events', function() {
    describe('mouseenter', function() {
      it('calls showToggleWidgetIcon', function() {
        spyOn(Canto.TaskPanelView.prototype, 'showToggleWidgetIcon');
        var newView = new Canto.TaskPanelView({collection: collection});
        newView.render().$el.mouseenter();
        expect(Canto.TaskPanelView.prototype.showToggleWidgetIcon).toHaveBeenCalled();
      });
    });

    describe('mouseleave', function() {
      it('calls hideToggleWidgetIcon', function() {
        spyOn(Canto.TaskPanelView.prototype, 'hideToggleWidgetIcon');
        var newView = new Canto.TaskPanelView({collection: collection});
        newView.render().$el.mouseleave();
        expect(Canto.TaskPanelView.prototype.hideToggleWidgetIcon).toHaveBeenCalled();
      });
    });

    describe('click .hide-widget', function() {
      it('calls hideWidget', function() {
        spyOn(Canto.TaskPanelView.prototype, 'hideWidget');
        var newView = new Canto.TaskPanelView({collection: collection});
        newView.render().$('.hide-widget').trigger('click');
        expect(Canto.TaskPanelView.prototype.hideWidget).toHaveBeenCalled();
      });
    });

    describe('click .show-widget', function() {
      it('calls showWidget', function() {
        spyOn(Canto.TaskPanelView.prototype, 'showWidget');
        var newView = new Canto.TaskPanelView({collection: collection});
        newView.render().hideWidget();
        newView.$('.show-widget').click();
        expect(Canto.TaskPanelView.prototype.showWidget).toHaveBeenCalled();
      });
    });

    describe('change task status', function() {
      it('calls crossOffComplete', function() {
        spyOn(Canto.TaskPanelView.prototype, 'crossOffComplete');
        spyOn(Canto.TaskCollectionView.prototype, 'crossOff');

        var newCollection = new Canto.TaskCollection([task1, task2, task3]);
        var newView = new Canto.TaskPanelView({collection: newCollection});
        newView.collection.trigger('change:status');
        expect(Canto.TaskPanelView.prototype.crossOffComplete).toHaveBeenCalled();
      });
    });

    describe('change task backlog', function() {
      it('calls removeBacklogged', function() {
        spyOn(Canto.TaskPanelView.prototype, 'removeBacklogged');
        var newView = new Canto.TaskPanelView({collection: collection});
        newView.collection.trigger('change:backlog');
        expect(Canto.TaskPanelView.prototype.removeBacklogged).toHaveBeenCalled();
      });
    });
  });

  describe('event callbacks', function() {
    describe('crossOffComplete', function() {
      beforeEach(function() {
        task1.set({status: 'Complete'}, {silent: true});
        taskPanel.render();
      });

      afterEach(function() {
        task1.set({status: 'New'}, {silent: true});
      })

      it('calls crossOff on the collection view', function() {
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

      it('returns 10 tasks', function() {
        expect(taskPanel.filterCollection(collection)).toHaveLength(10);
      });

      it('doesn\'t include blocking tasks', function() {
        var newView = new Canto.TaskListItemView({model: task2});
        spyOn(Canto.TaskCollectionView.prototype, 'retrieveViewForModel').and.returnValue(newView);
        task2.set({status: 'Blocking'});
        expect(taskPanel.filterCollection(collection).indexOf(task2)).toBe(-1);
      });

      it('doesn\'t include backlogged tasks', function() {
        task2.set({backlog: true});
        expect(taskPanel.filterCollection(collection).indexOf(task2)).toBe(-1);
      })
    });

    describe('hideWidget', function() {
      beforeEach(function() {
        taskPanel.render();
        taskPanel.hideWidget();
      });

      it('changes the icon class to .show-widget', function() {
        expect(taskPanel.$('span.pull-right').first()).not.toHaveClass('hide-widget');
        expect(taskPanel.$('span.pull-right').first()).toHaveClass('show-widget');
      });

      it('changes the icon to fa-plus', function() {
        expect(taskPanel.$('span.pull-right i').first()).not.toHaveClass('fa-minus');
        expect(taskPanel.$('span.pull-right i').first()).toHaveClass('fa-plus');
      })
    });

    describe('removeBacklogged', function() {
      it('removes the specified task from the collection', function() {
        spyOn(taskPanel.collection, 'remove');
        task1.set({backlog: true});
        taskPanel.removeBacklogged();
        expect(taskPanel.collection.remove).toHaveBeenCalledWith(task1);
      });
    });

    describe('showWidget', function() {
      beforeEach(function() {
        taskPanel.render();
        taskPanel.hideWidget(); // hide it first
        taskPanel.showWidget();
      });

      it('changes the icon class to .hide-widget', function() {
        expect(taskPanel.$('span.pull-right').first()).toHaveClass('hide-widget');
        expect(taskPanel.$('span.pull-right').first()).not.toHaveClass('show-widget');
      });

      it('changes the icon to fa-minus', function() {
        expect(taskPanel.$('span.pull-right i').first()).toHaveClass('fa-minus');
      });
    });
  });

  describe('core view functions', function() {
    describe('remove()', function() {
      it('removes the collection view from the DOM', function() {
        spyOn(taskPanel.collectionView, 'remove');
        taskPanel.remove();
        expect(taskPanel.collectionView.remove).toHaveBeenCalled();
      });

      it('removes itself from the DOM', function() {
        spyOn(Backbone.View.prototype.remove, 'call');
        taskPanel.remove();
        expect(Backbone.View.prototype.remove.call).toHaveBeenCalledWith(taskPanel);
      });

      it('calls undelegateEvents', function() {
        spyOn(taskPanel, 'undelegateEvents');
        taskPanel.remove();
        expect(taskPanel.undelegateEvents).toHaveBeenCalled();
      });
    });

    describe('render()', function() {
      it('renders its collection view', function() {
        spyOn(taskPanel.collectionView, 'render');
        taskPanel.render();
        expect(taskPanel.collectionView.render).toHaveBeenCalled();
      });

      it('attaches the collection view to the DOM', function() {
        spyOn($.prototype, 'html');
        taskPanel.render();
        expect($.prototype.html.calls.argsFor(1)).toContain(taskPanel.collectionView.template());
      })

      it('configures sortable', function() {
        spyOn($.prototype, 'sortable');
        taskPanel.render();
        expect($.prototype.sortable).toHaveBeenCalled();
      });

      it('doesn\'t let not-sortable things be sorted', function() {
        spyOn($.prototype, 'sortable');
        taskPanel.render();
        expect($.prototype.sortable.calls.argsFor(0)[0].items).toEqual('>*:not(.not-sortable)')
      });
    });
  });

  describe('special functions', function() {
    describe('isA', function() {
      it('returns true with argument \'TaskPanelView\'', function() {
        expect(taskPanel.isA('TaskPanelView')).toBe(true);
      });

      it('returns true with argument \'TaskPanel\'', function() {
        expect(taskPanel.isA('TaskPanel')).toBe(true);
      });

      it('returns true with argument \'TaskView\'', function() {
        expect(taskPanel.isA('TaskView')).toBe(true);
      });

      it('returns true with argument \'PartialView\'', function() {
        expect(taskPanel.isA('PartialView')).toBe(true);
      });

      it('returns false with other arguments', function() {
        expect(taskPanel.isA('TaskCollectionView')).toBe(false);
      });
    });
  });
});