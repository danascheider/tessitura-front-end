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

    describe('constructor', function() {
      it('doesn\'t call render()', function() {
        sinon.stub(Backbone.View.prototype, 'render');
        var newView = new WidgetView({data: {taskCollection: tasks}});
        Backbone.View.prototype.render.called.should.be.false;
        Backbone.View.prototype.render.restore();
      });
    });

    describe('elements', function() {
      //
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
      //
    });
  });
});