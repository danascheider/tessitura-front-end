define([
  'underscore',
  'backbone',
  'collections/tasks',
  'models/user',
  'models/task',
  'views/tasks/list-entry',
  'views/tasks/collection',
  'jquery-ui'
], function(_, Backbone, TaskCollection, User, Task, ListItemView, TaskCollectionView) {
  
  describe('task collection view', function() {
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

    var view = new TaskCollectionView({collection: collection});

    describe('constructor', function() {
      it('does not call the render function', function() {
        var stub = sinon.stub(TaskCollectionView.prototype, 'render');
        var newView = new TaskCollectionView({collection: collection});
        stub.called.should.be.false;
        newView.remove();
        stub.restore();
      });
    });

    describe('el', function() {
      beforeEach(function() {
        view.reset().render();
      });

      it('creates a ul', function() {
        view.$el[0].tagName.should.equal('UL');
      });

      it('has class .task-list', function() {
        view.$el[0].className.should.include('task-list');
      });

      it('has a list item for each task', function() {
        view.$('li.task-list-item').length.should.equal(collection.length);
      });
    });

    describe('removeBacklog method', function() {
      beforeEach(function() {
        task1.set('backlog', true);
        view.removeBacklog();
      });

      afterEach(function() {
        task1.unset('backlog');
        view.collection.add(task1);
      });

      it('removes backlogged tasks', function() {
        view.collection.models.should.not.include(task1);
      });

      it('doesn\'t remove non-backlogged tasks', function() {
        view.collection.models.should.include(task2);
      });
    });

    describe('removeComplete method', function() {
      beforeEach(function() {
        task1.set('status', 'Complete');
        view.removeComplete();
      });

      afterEach(function() {
        task1.set('status', 'New');
        view.collection.add(task1);
      });

      it('removes completed tasks', function() {
        view.collection.models.should.not.include(task1);
      });

      it('doesn\'t remove incomplete tasks', function() {
        view.collection.models.should.include(task2);
      });
    });

    describe('render function', function() {
      beforeEach(function() {
        sinon.stub($.prototype, 'sortable');
        view.reset().render();
      });

      afterEach(function() {
        $.prototype.sortable.restore();
      });

      it('renders the list items', function() {
        view.$('.task-list-item').length.should.equal(2);
      });

      describe('on re-render', function() {
        it('maintains the length of the list', function() {
          view.render();      // render view a second time
          view.$('.task-list-item').length.should.equal(2);
        });
      });

      it('configures sortable', function() {
        $.prototype.sortable.withArgs({connectWith: '.task-list', dropOnEmpty: true}).calledOnce.should.be.true;
      });
    });

    describe('reset', function() {
      beforeEach(function() {
        view.render();
      });

      it('removes the view from the DOM', function() {
        sinon.stub(view, 'remove');
        view.reset();
        view.remove.calledOnce.should.be.true;
        view.remove.restore();
      });

      it('keeps its collection', function() {
        view.reset();
        view.collection.should.equal(collection);
      });

      it('returns itself', function() {
        view.reset().should.equal(view);
      });

      describe('listeners', function() {
        beforeEach(function() {
          sinon.stub(view, 'listenTo');
          view.reset();
        });

        afterEach(function() {
          view.listenTo.restore();
        });

        it('re-establishes listener for collection:remove', function() {
          view.listenTo.calledWithExactly(view.collection, 'remove', view.refreshCollection).should.be.true;
        });

        it('re-establishes listener for collection:add', function() {
          view.listenTo.calledWithExactly(view.collection, 'add', view.refreshCollection).should.be.true;
        });

        it('re-establishes listener for collection:markComplete', function() {
          view.listenTo.calledWithExactly(view.collection, 'markComplete', view.removeComplete).should.be.true;
        });

        it('re-establishes listener for collection:change:backlog', function() {
          view.listenTo.calledWithExactly(view.collection, 'change:backlog', view.removeBacklog).should.be.true;
        });
      });
    });
  });
});