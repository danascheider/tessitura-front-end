define([
  'underscore',
  'backbone',
  'collections/tasks',
  'models/user',
  'models/task',
  'views/models/task/listEntry',
  'views/collections/taskCollection',
  'spec/testTools',
  'jquery-ui',
], function(_, Backbone, TaskCollection, User, Task, ListItemView, TaskCollectionView, TestTools) {
  
  describe('task collection view', function() {
    var view; 
    var sandbox = sinon.sandbox.create();

    var user = new User({
      id         : 342,
      username   : 'testuser',
      password   : 'testuser',
      email      : 'testuser@example.com',
      first_name : 'Test',
      last_name  : 'User'
    });

    var task1 = new Task({id: 1, title: 'Task 1', status: 'In Progress', owner_id: 342});
    var task2 = new Task({id: 2, title: 'Task 2', status: 'In Progress', owner_id: 342});
    var collection = new TaskCollection([task1, task2]);
    var data = {collection: collection, grouping: {status: 'In Progress'}};

    beforeEach(function() {
      if(typeof view === 'undefined') { view = new TaskCollectionView(data); }
    });

    afterEach(function() {
      view.remove();
      sandbox.restore();
    });

    describe('constructor', function() {
      it('does not call the render function', function() {
        var stub = sandbox.stub(TaskCollectionView.prototype, 'render');
        var newView = new TaskCollectionView(data);
        stub.called.should.be.false;
      });

      it('creates an empty childViews array', function() {
        var newView = new TaskCollectionView(data);
        newView.childViews.should.deep.equal([]);
      });

      it('creates a quick-add form', function() {
        var newView = new TaskCollectionView(data);
        newView.$quickAddForm.should.exist;
      });
    });

    describe('elements', function() {
      beforeEach(function() {
        view.render();
      });

      it('creates a ul', function() {
        view.$el[0].tagName.should.equal('UL');
      });

      it('has class .task-list', function() {
        view.$el[0].className.should.include('task-list');
      });

      it('has a quick-add form', function() {
        view.$('form.quick-add-form').length.should.equal(1);
      });

      it('has a list item for each task', function() {
        view.$('li.task-list-item').length.should.equal(collection.length);
      });
    });

    describe('events', function() {
      describe('remove task from collection', function() {
        it('calls render', function() {
          sandbox.stub(TaskCollectionView.prototype, 'render');
          var newView = new TaskCollectionView(data);
          newView.collection.remove(task1);
          TaskCollectionView.prototype.render.calledOnce.should.be.true;
          collection.reset([task1, task2, task3]);
        });
      });
    });

    describe('crossOff() method', function() {
      beforeEach(function() { 
        view.render(); 
      });

      afterEach(function() { collection.reset([task1, task2]); });

      it('crosses out the task\'s title', function() {
        view.crossOff(task1);
        view.$('.task-title').first().css('text-decoration').should.equal('line-through');
      });

      it('removes the task from the collection', function(done) {
        view.crossOff(task1);

        TestTools.delay(750, done, function() {
          view.collection.models.should.not.include(task1);
        });
      });
    });

    describe('removeBacklog() method', function() {
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

    describe('removeChildViews() method', function() {
      beforeEach(function() {
        view.render();
      });

      it('removes all the child views from the DOM', function() {
        view.removeChildViews();
        var form = view.$quickAddForm.el.toString();
        view.$('li').length.should.equal(1);
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

    describe('retrieveViewForModel', function() {
      beforeEach(function() { view.render(); });

      it('finds a view within the collection', function() {
        var listItem = view.retrieveViewForModel(task1);
        listItem.$el[0].id.should.equal('task-1');
      });
    });

    describe('render function', function() {
      beforeEach(function() {
        sandbox.stub($.prototype, 'sortable');
        view.render();
      });

      it('renders the list items', function() {
        view.$('.task-list-item').length.should.equal(2);
      });

      describe('on re-render', function() {
        it('maintains the length of the list', function() {
          view.render();      // render view a second time
          view.$('.task-list-item').length.should.equal(2);
        });

        it('maintains the length of the child view array', function() {
          view.render();
          view.childViews.length.should.equal(2);
        });

        it('keeps existing child views', function() {
          var child = view.retrieveViewForModel(task1);
          view.render();
          view.childViews.should.include(child);
        });
      });

      it('configures sortable', function() {
        $.prototype.sortable.withArgs({connectWith: '.task-list', dropOnEmpty: true}).calledOnce.should.be.true;
      });
    });

    describe('remove() function', function() {
      beforeEach(function() {
        view.render();
      });

      it('removes the child views', function() {
        sandbox.stub(view, 'removeChildViews');
        view.remove();
        view.removeChildViews.calledOnce.should.be.true;
      });

      it('removes the view from the DOM', function() {
        sandbox.stub(Backbone.View.prototype.remove, 'call');
        view.remove();
        Backbone.View.prototype.remove.call.withArgs(view).calledOnce.should.be.true;
      });
    });
  });
});