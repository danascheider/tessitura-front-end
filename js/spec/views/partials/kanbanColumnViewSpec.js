define([
  'backbone',
  'views/app/kanban-column',
  'models/user',
  'models/task',
  'collections/tasks',
  'utils'], function(Backbone, ColumnView, Task, User, TaskCollection, Utils) {
  
  describe('Kanban column view', function() {
    var column, e, server;

    var user = new User({
      id      : 342,
      username: 'testuser', 
      password: 'testuser', 
      email: 'testuser@example.com',
      first_name: 'Test',
      last_name: 'User'
    });

    var task1 = new Task({id: 1, title: 'Task 1', status: 'New', priority: 'Low', position: 1});
    var task2 = new Task({id: 2, title: 'Task 2', status: 'New', priority: 'Normal', position: 2});
    var task3 = new Task({id: 3, title: 'Task 3', status: 'Complete', priority: 'Normal', position: 3});

    user.tasks = new TaskCollection([task1, task2, task3]);

    var data = {collection: user.tasks, color: 'blue', icon: 'fa-exclamation-circle', headline: 'New'};

    beforeEach(function() {
      if(typeof column === 'undefined') { column = new ColumnView(data); }
    });

    describe('constructor', function() {
      it('doesn\'t call render()', function() {
        sinon.stub(Backbone.View.prototype, 'render');
        var newView = new ColumnView(data);
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

    describe('createTask() method', function() {
      //
    });

    describe('renderChildViews() method', function() {
      //
    });

    describe('renderChildViews() method', function() {
      //
    });

    describe('updateTask() method', function() {
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