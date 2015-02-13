define([
  'backbone',
  'collections/tasks',
  'models/user',
  'models/task',
  'views/tasks/collection'
], function(Backbone, TaskCollection, User, Task, TaskCollectionView) {
  
  describe('task collection view', function() {
    var view; // Instantiate variable to use in before blocks

    // Create user and task objects required for the view to function

    var user = new User({
      id         : 342,
      username   : 'testuser',
      password   : 'testuser',
      email      : 'testuser@example.com',
      first_name : 'Test',
      last_name  : 'User'
    });

    var task1 = new Task({title: 'Task 1', owner_id: 342});
    var task2 = new Task({title: 'Task 2', owner_id: 342});
    var collection = new TaskCollection([task1, task2]);

    describe('constructor', function() {
      it('calls the render function', function() {
        var stub = sinon.stub(TaskCollectionView.prototype, 'render');
        view = new TaskCollectionView({collection: collection});
        stub.calledOnce.should.be.true;
        stub.restore();
      });
    });

    describe('el', function() {
      beforeEach(function() {
        view = new TaskCollectionView({collection: collection});
      });

      afterEach(function() {
        view.remove();
      });

      it('creates a ul', function() {
        view.$el[0].tagName.should.equal('UL');
      });
    });
  });
});