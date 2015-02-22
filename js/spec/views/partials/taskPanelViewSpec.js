define([
  'backbone',
  'collections/tasks',
  'models/task',
  'views/tasks/task-panel'
  ], function(Backbone, TaskCollection, Task, TaskPanelView) {
  
  describe('Task Panel View', function() {
    var view, e;
    var sandbox = sinon.sandbox.create();

    var task1 = new Task({id: 1, title: 'Task 1', status: 'New', priority: 'Low', position: 1});
    var task2 = new Task({id: 2, title: 'Task 2', status: 'New', priority: 'Normal', position: 2});
    var task3 = new Task({id: 3, title: 'Task 3', status: 'Complete', priority: 'Normal', position: 3});

    var collection = new TaskCollection([task1, task2, task3], {comparator: 'position'});

    beforeEach(function() {
      if(typeof view === 'undefined') { view = new TaskPanelView({collection: collection}); }
    });

    afterEach(function() {
      view.remove();
      sandbox.restore();
    });

    describe('constructor', function() {
      it('doesn\'t call render', function() {
        sandbox.stub(TaskPanelView.prototype, 'render');
        var newView = new TaskPanelView({collection: collection});
        TaskPanelView.prototype.render.calledOnce.should.be.false;
      });

      it('sets a collection', function() {
        var newView = new TaskPanelView({collection: collection});
        newView.collection.should.exist;
      });

      it('instantiates a quick-add form', function() {
        var newView = new TaskPanelView({collection: collection});
        newView.$quickAddForm.should.exist;
      });

      it('instantiates a collection view', function() {
        var newView = new TaskPanelView({collection: collection});
        newView.$collectionView.should.exist;
      });
    });

    describe('elements', function() {
      beforeEach(function() {
        view.render();
      });

      it('is a div', function() {
        view.$el[0].tagName.should.equal('DIV');
      })

      it('has ID #task-panel', function() {
        view.$el[0].id.should.equal('task-panel');
      });

      it('has classname \'panel panel-primary dash-widget\'', function() {
        view.$el[0].className.should.equal('panel panel-primary dash-widget');
      });

      it('has a collection view', function() {
        view.$collectionView.$el.should.be.visible;
      });

      it('has a quick-add form', function() {
        view.$quickAddForm.$el.should.be.visible;
      });
    });

    describe('events', function() {
      //
    });

    describe('filterCollection() method', function() {
      //
    });

    describe('hideToggleWidgetIcon() method', function() {
      //
    });

    describe('hideWidget() method', function() {
      //
    });

    describe('removeTask() method', function() {
      //
    });

    describe('showToggleWidgetIcon() method', function() {
      //
    });

    describe('showTaskForm() method', function() {
      //
    });

    describe('showWidget() method', function() {
      //
    });

    describe('render function', function() {
      //
    });
  });
});