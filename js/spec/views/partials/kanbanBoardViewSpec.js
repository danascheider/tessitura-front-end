define([
  'backbone', 
  'views/app/kanban-board', 
  'models/task', 
  'models/user',
  'collections/tasks'], function(Backbone, KanbanView, Task, User, TaskCollection) {
  
  describe('Kanban Board View', function() {
    var view, e, server;

    // Define resources that will be used in testing

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

    beforeEach(function() {
      if(typeof view === 'undefined') { view = new KanbanView({user: user}) }
    });

    describe('constructor', function() {
      it('doesn\'t call render', function() {
        sinon.stub(Backbone.View.prototype, 'render');
        var newView = new KanbanView({user: user});
        Backbone.View.prototype.render.called.should.be.false;
        Backbone.View.prototype.render.restore();
      });

      it('sets the user property', function() {
        var newView = new KanbanView({user: user});
        newView.user.should.equal(user);
      });
    });

    describe('elements', function() {
      //
    });

    describe('events', function() {
      //
    });

    describe('render() function', function() {
      //
    });

    describe('reset() method', function() {
      beforeEach(function() {
        server = sinon.fakeServer.create(); // stub out Ajax call
        view.render();
      });

      it('returns itself', function() {
        view.reset().should.equal(view);
      });
    });
  });
});