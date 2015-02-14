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

    describe('reset', function() {
      beforeEach(function() {
        view = new TaskCollectionView({collection: collection});
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

    describe('render function', function() {
      beforeEach(function() {
        sinon.stub($.prototype, 'sortable');
        view = new TaskCollectionView({collection: collection});
        view.render();
      });

      afterEach(function() {
        view.remove();
        $.prototype.sortable.restore();
      });

      describe('when there is no listItemViews array', function() {
        it('adds a new view for each collection element', function() {
          view.listItemViews.length.should.equal(2);
        });
      });

      describe('on re-render', function() {
        it('maintains the length of the listItemViews array', function() {
          view.render();
          view.listItemViews.length.should.equal(2);
        });
      });

      it('configures sortable', function() {
        $.prototype.sortable.withArgs({connectWith: '.task-list', dropOnEmpty: true}).calledOnce.should.be.true;
      });
    });
  });
});