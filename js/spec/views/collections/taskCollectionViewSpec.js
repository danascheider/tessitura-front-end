define([
  'backbone',
  'collections/tasks',
  'models/user',
  'models/task',
  'views/tasks/collection',
  'jquery-ui'
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

    var task1 = new Task({id: 1, title: 'Task 1', owner_id: 342});
    var task2 = new Task({id: 2, title: 'Task 2', owner_id: 342});
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
        sinon.stub($.prototype, 'sortable');
        view = new TaskCollectionView({collection: collection});
      });

      afterEach(function() {
        $.prototype.sortable.restore();
        view.remove();
      });

      it('creates a ul', function() {
        view.$el[0].tagName.should.equal('UL');
      });

      it('has class .task-list', function() {
        view.$el[0].className.should.equal('task-list');
      });

      it('creates a list item for each task', function() {
        view.$('li.task-list-item').length.should.equal(2);
      });

      it('configures sortable', function() {
        $.prototype.sortable.withArgs({connectWith: '.task-list', dropOnEmpty: true}).calledOnce.should.be.true;
      });
    });
  });
});