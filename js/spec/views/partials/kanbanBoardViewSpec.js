define([
  'backbone', 
  'views/partials/kanbanBoard', 
  'models/task', 
  'models/user',
  'collections/tasks'
  ], function(Backbone, KanbanView, Task, User, TaskCollection) {
  
  describe('Kanban Board View', function() {
    var view, e, server;
    var sandbox = sinon.sandbox.create();

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

      server = sandbox.useFakeServer();
      server.respondWith(/\/users\/342\/tasks/, function(xhr) {
        xhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify(user.tasks));
      });
    });

    afterEach(function() {
      view.remove();
      sandbox.restore();
    });

    describe('constructor', function() {
      it('doesn\'t call render', function() {
        sandbox.stub(KanbanView.prototype, 'render');
        var newView = new KanbanView({user: user});
        KanbanView.prototype.render.called.should.be.false;
      });

      it('calls setUser', function() {
        sandbox.stub(KanbanView.prototype, 'setUser');
        var newView = new KanbanView({user: user});
        KanbanView.prototype.setUser.withArgs(user).calledOnce.should.be.true;
      });
      
      it('can be instantiated without a user', function() {
        var newView = new KanbanView();
        (typeof newView.user).should.equal('undefined');
      });
    });

    describe('elements', function() {
      beforeEach(function() { 
        view.render(); 
        server.respond();
      });

      it('is a div', function() {
        view.$el[0].tagName.should.equal('DIV');
      });

      it('has ID #page-wrapper', function() {
        view.$el[0].id.should.equal('page-wrapper');
      });

      it('has a backlog column', function() {
        view.$('#backlog-tasks').should.exist;
      });

      it('has a new column', function() {
        view.$('#new-tasks').should.exist;
      });

      it('has an in-progress column', function() {
        view.$('#in-progress-tasks').should.exist;
      });

      it('has a blocking column', function() {
        view.$('#blocking-tasks').should.exist;
      });
    });

    describe('setUser() method', function() {
      it('sets the user', function() {
        var newView = new KanbanView();
        newView.setUser(user);
        newView.user.should.equal(user);
      });
    });

    describe('render() function', function() {
      it('sets the HTML of its own el', function() {
        sandbox.stub($.prototype, 'html');
        view.render();
        $.prototype.html.calledOnce.should.be.true;
      })

      it('calls the user\'s fetchIncompleteTasks method', function() {
        sandbox.spy(user, 'fetchIncompleteTasks');
        view.render();
        server.respond();
        user.fetchIncompleteTasks.calledOnce.should.be.true;
      });

      it('creates child views', function() {
        view.render();
        server.respond();
        _.each([view.$backlogColumn, view.$newColumn, view.$inProgressColumn, view.$blockingColumn], function(col) {
          col.should.exist;
        });
      });

      it('returns itself', function() {
        var final = view.render();
        server.respond();
        final.should.equal(view);
      });

      it('calls delegateEvents');
    });

    describe('remove() function', function() {
      beforeEach(function() {
        view.render();
      });

      it('removes the backlog column', function() {
        sandbox.stub(view.$backlogColumn, 'remove');
        view.remove();
        view.$backlogColumn.remove.calledOnce.should.be.true;
      });

      it('removes the new column', function() {
        sandbox.stub(view.$newColumn, 'remove');
        view.remove();
        view.$newColumn.remove.calledOnce.should.be.true;
      });

      it('removes the in-progress column', function() {
        sandbox.stub(view.$inProgressColumn, 'remove');
        view.remove();
        view.$inProgressColumn.remove.calledOnce.should.be.true;
      });

      it('removes the blocking column', function() {
        sandbox.stub(view.$blockingColumn, 'remove');
        view.remove();
        view.$blockingColumn.remove.calledOnce.should.be.true;
      });

      it('removes itself from the DOM', function() {
        sandbox.stub(Backbone.View.prototype.remove, 'call');
        view.remove();
        Backbone.View.prototype.remove.call.withArgs(view).calledOnce.should.be.true;
      });
    });
  });
});