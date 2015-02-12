define([
  'backbone',
  'views/tasks/model',
  'models/task',
  'models/user',
  'cookie'
], function(Backbone, TaskView, Task, User) {

  describe('Task model view', function() {

    // Define variables for use in before blocks
    var view;

    var user = new User({
      id: 342, 
      username   : 'testuser', 
      password   : 'testuser',
      email      : 'testuser@example.com',
      first_name : 'Test',
      last_name  : 'User'
    });

    var task = new Task({
      title        : 'My Task 1', 
      status       : 'New',
      priority     : 'Low',
      deadline     : new Date(2015, 08, 28),
      description  : "Test Canto's front-end functionality",
      owner_id     : 342,
      task_list_id : 14,
      position     : 1
    });

    beforeEach(function() {
      view = new TaskView({model: task});
      view.render();
    });

    afterEach(function() {
      view.remove();
    });

    describe('el', function() {
      it('is a div', function() {
        view.$el[0].tagName.should.equal('DIV');
      });

      it('has class .task-model', function() {
        view.$el[0].className.should.equal('task-model');
      });
    });

    describe('view elements', function() {
      it('displays the task\'s title', function() {
        view.$('a.task-title').html().should.equal('My Task 1');
      });

      it('displays the task\'s deadline', function() {
        console.log(task.get('deadline'));
        view.$('table.task-details').html().should.include('Monday, September 28, 2015');
      });
    });
  });
});