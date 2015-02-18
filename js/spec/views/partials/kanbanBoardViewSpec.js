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

      server = sinon.fakeServer.create();
      server.respondWith(/\/users\/342\/tasks/, function(xhr) {
        xhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify(user.tasks));
      });
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
      beforeEach(function() { 
        view.reset().render(); 
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

    describe('events', function() {
      //
    });

    describe('render() function', function() {
      beforeEach(function() {
        view.reset();
      });
    });

    describe('reset() method', function() {
      beforeEach(function() {
        view.render();
        server.respond();
      });

      it('removes the \'backlog\' column', function() {
        sinon.stub(view.$backlogColumn, 'remove');
        view.reset();
        view.$backlogColumn.remove.calledOnce.should.be.true;
        view.$backlogColumn.remove.restore();
      });

      it('removes the \'New\' column', function() {
        sinon.stub(view.$newColumn, 'remove');
        view.reset();
        view.$newColumn.remove.calledOnce.should.be.true;
        view.$newColumn.remove.restore();
      });

      it('removes the \'In Progress\' column from the DOM', function() {
        sinon.stub(view.$inProgressColumn, 'remove');
        view.reset();
        view.$inProgressColumn.remove.calledOnce.should.be.true;
        view.$inProgressColumn.remove.restore();
      });

      it('removes the \'Blocking\' column from the DOM', function() {
        sinon.stub(view.$blockingColumn, 'remove');
        view.reset();
        view.$blockingColumn.remove.calledOnce.should.be.true;
        view.$blockingColumn.remove.restore();
      });

      it('removes itself from the DOM', function() {
        sinon.stub(view, 'remove');
        view.reset();
        view.remove.calledOnce.should.be.true;
        view.remove.restore();
      });

      it('returns itself', function() {
        view.reset().should.equal(view);
      });
    });
  });
});