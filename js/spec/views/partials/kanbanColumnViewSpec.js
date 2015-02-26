define([
  'backbone',
  'views/app/kanban-column',
  'models/user',
  'models/task',
  'collections/tasks',
  'utils'], function(Backbone, ColumnView, User, Task, TaskCollection, Utils) {
  
  describe('Kanban column view', function() {
    var column, e, server;
    var sandbox = sinon.sandbox.create();

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

    afterEach(function() {
      column.remove();
      sandbox.restore();
    });

    describe('constructor', function() {
      it('doesn\'t call render()', function() {
        sandbox.stub(Backbone.View.prototype, 'render');
        var newView = new ColumnView(data);
        Backbone.View.prototype.render.called.should.be.false;
      });

      describe('properties', function() {
        var newView;

        beforeEach(function() { 
          sandbox.stub(Backbone.View.prototype, 'listenTo');
          newView = new ColumnView(data); 
        });

        it('sets the collection', function() {
          newView.collection.should.equal(user.tasks);
        });

        it('sets the data property', function() {
          newView.data.should.equal(data);
        });

        it('creates a quick-add form', function() {
          newView.$quickAddForm.should.exist;
        });

        it('creates a collection view', function() {
          newView.$collectionView.should.exist;
        });

        // FIX: It might be better to test for behavior, not listeners

        it('listens to its collection', function() {
          Backbone.View.prototype.listenTo.withArgs(newView.collection).called.should.be.true;
        });

        it('listens to its quick-add form', function() {
          Backbone.View.prototype.listenTo.withArgs(newView.$quickAddForm, 'submit').calledOnce.should.be.true;
        });
      });

      describe('groupedBy property when backlog', function() {
        it('groups by backlog', function() {
          data.headline = 'Backlog';
          var newView = new ColumnView(data);
          newView.groupedBy.should.deep.equal({backlog: true});
          data.headline = 'New' // revert
        });
      });

      describe('groupedBy property when not backlog', function() {
        it('groups by status', function() {
          var newView = new ColumnView(data);
          newView.groupedBy.should.deep.equal({status: 'New'});
        });
      });
    });

    describe('elements', function() {
      it('is a div', function() {
        column.$el[0].tagName.should.equal('DIV');
      });

      it('has class panel', function() {
        column.$el[0].className.should.include('panel');
      });

      it('sets its panel color', function() {
        column.$el[0].className.should.include('panel-blue');
      });

      it('has a quick-add form', function() {
        column.$quickAddForm.$el.should.be.visible;
      });

      it('has a collection view', function() {
        column.$collectionView.$el.should.be.visible;
      });
    });

    describe('events', function() {
      describe('submit quick-add form', function() {
        it('calls createTask', function() {
          sandbox.stub(ColumnView.prototype, 'createTask');
          var newCol = new ColumnView(data);
          newCol.render();
          newCol.$quickAddForm.$('form').submit();
          ColumnView.prototype.createTask.calledOnce.should.be.true;
          newCol.remove();
        });
      });
    });

    describe('createTask() method', function() {
      beforeEach(function() {
        e = $.Event('submit', {target: column.$quickAddForm.$el});
        server = sandbox.useFakeServer();
        sandbox.stub(Utils, 'getAttributes').returns({title: 'My New Task'});
      });

      it('adds a task to the collection', function() {
        sandbox.stub(user.tasks, 'create');
        column.createTask(e);
        user.tasks.create.calledOnce.should.be.true;
      });
    });

    describe('updateTask() method', function() {
      it('modifies the task with the column\'s groupedBy attribute', function() {
        sandbox.stub(task3, 'save');
        column.updateTask(task3);
        task3.save.withArgs({status: 'New'}).calledOnce.should.be.true;
      });

      describe('when the task attributes already match', function() {
        it('doesn\'t call save', function() {
          sandbox.stub(task1, 'save');
          column.updateTask(task1);
          task1.save.called.should.be.false;
        });

        it('doesn\'t set the task\'s attributes', function() {
          sandbox.stub(task1, 'set');
          column.updateTask(task1);
          task1.set.called.should.be.false;
        });
      });
    });

    describe('render() function', function() {
      it('sets the HTML', function() {
        sandbox.stub($.prototype, 'html');
        column.render();
        $.prototype.html.withArgs(column.template({data: data})).calledOnce.should.be.true;
      });

      it('renders the collection view', function() {
        sandbox.stub($.prototype, 'html');
        column.render();
        $.prototype.html.withArgs(column.$collectionView.el).calledOnce.should.be.true;
      });

      it('renders the quick-add form view', function() {
        sandbox.stub($.prototype, 'prepend');
        column.render();
        $.prototype.prepend.withArgs(column.$quickAddForm.el).calledOnce.should.be.true;
      });

      it('calls delegateEvents on the collection view', function() {
        sandbox.stub(column.$collectionView, 'delegateEvents');
        column.render();
        column.$collectionView.delegateEvents.called.should.be.true;
      });

      it('calls delegateEvents on the quick-add form', function() {
        sandbox.stub(column.$quickAddForm, 'delegateEvents');
        column.render();
        column.$quickAddForm.delegateEvents.called.should.be.true;
      });

      it('calls delegateEvents on itself', function() {
        sandbox.stub(column, 'delegateEvents');
        column.render();
        column.delegateEvents.calledOnce.should.be.true;
      });

      it('configures sortable', function() {
        sandbox.stub($.prototype, 'sortable');
        column.render();
        $.prototype.sortable.calledOnce.should.be.true;
      });

      it('returns itself', function() {
        column.render().should.equal(column);
      });
    });

    describe('remove() function', function() {
      beforeEach(function() {
        column.render();
      });

      it('removes the collection view from the DOM', function() {
        sandbox.stub(column.$collectionView, 'remove');
        column.remove();
        column.$collectionView.remove.calledOnce.should.be.true;
      });

      it('removes the quick-add form', function() {
        sandbox.stub(column.$quickAddForm, 'remove');
        column.remove();
        column.$quickAddForm.remove.calledOnce.should.be.true;
      });

      it('removes itself', function() {
        sandbox.stub(Backbone.View.prototype.remove, 'call');
        column.remove();
        Backbone.View.prototype.remove.call.withArgs(column).calledOnce.should.be.true;
      });
    });
  });
});