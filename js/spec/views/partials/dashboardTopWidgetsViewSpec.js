define(['backbone', 
  'views/app/dashboard-top-widgets',
  'models/task',
  'collections/tasks'
  ], function(Backbone, WidgetView, Task, TaskCollection) {
  
  describe('Dashboard Top Widget View', function() {
    var view, e;

    // var user = new User({
    //   id      : 342,
    //   username: 'testuser', 
    //   password: 'testuser', 
    //   email: 'testuser@example.com',
    //   first_name: 'Test',
    //   last_name: 'User'
    // });

    var task1 = new Task({id: 1, title: 'Task 1', status: 'New', priority: 'Low', position: 1});
    var task2 = new Task({id: 2, title: 'Task 2', status: 'New', priority: 'Normal', position: 2});
    var task3 = new Task({id: 3, title: 'Task 3', status: 'Complete', priority: 'Normal', position: 3});

    var tasks = new TaskCollection([task1, task2, task3]);

    var data = {taskCollection: tasks, deadlineCount: 14}

    beforeEach(function() {
      if(typeof view === 'undefined') { view = new WidgetView({data: data}); }
    });

    describe('constructor', function() {
      it('doesn\'t call render()', function() {
        sinon.stub(Backbone.View.prototype, 'render');
        var newView = new WidgetView({data: data});
        Backbone.View.prototype.render.called.should.be.false;
        Backbone.View.prototype.render.restore();
      });

      it('sets a data property', function() {
        var newView = new WidgetView({data: data});
        newView.data.should.equal(data);
      });

      // FIX: This should instead test whether the figures update when 
      //      the collection does, which would be more robust.

      it('listens to its task collection', function() {
        sinon.stub(Backbone.View.prototype, 'listenTo');
        var newView = new WidgetView({data: {taskCollection: tasks}});
        Backbone.View.prototype.listenTo.withArgs(tasks).called.should.be.true;
        Backbone.View.prototype.listenTo.restore();
      });
    });

    describe('elements', function() {
      beforeEach(function() { view.reset().render(); });

      describe('task widget', function() {
        it('is visible by default', function() {
          view.$('div.dash-widget[data-target="tasks"]').should.be.visible;
        });

        it('includes the task count', function() {
          view.$('div.dash-widget[data-target="tasks"] div.huge').html().should.include('3');
        });
      });

      it('has a deadline widget', function() {
        //
      });
    });

    describe('events', function() {
      //
    });

    describe('changeLinkColor() method', function() {
      //
    });

    describe('changeLinkColorBack() method', function() {
      //
    });

    describe('followLink() method', function() {
      //
    });

    describe('render() function', function() {
      //
    });

    describe('reset() method', function() {
      beforeEach(function() { view.render(); });
      afterEach(function() { view.remove(); });

      it('removes the view from the DOM', function() {
        sinon.stub(view, 'remove');
        view.reset();
        view.remove.calledOnce.should.be.true;
        view.remove.restore();
      });

      it('returns the view', function() {
        view.reset().should.equal(view);
      });
    });
  });
});