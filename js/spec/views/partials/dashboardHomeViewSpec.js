define([
  'backbone', 
  'views/app/dashboard-home', 
  'models/user',
  'models/task',
  'collections/tasks'
  ], function(Backbone, HomeView, User, Task, TaskCollection) {
  
  describe('Dashboard Home View', function() {
    var view, e, server;
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
      if(typeof view === 'undefined') { view = new HomeView({user: user}); }
      server = sinon.fakeServer.create();
      server.respondWith(/\/users\/342\/tasks$/, function(xhr) {
        xhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify(user.tasks.models));
      });
    });

    describe('constructor', function() {
      it('does not call render', function() {
        sinon.stub(Backbone.View.prototype, 'render');
        var newView = new HomeView({user: user});
        Backbone.View.prototype.render.called.should.be.false;
        Backbone.View.prototype.render.restore();
      });

      it('assigns a user', function() {
        var newView = new HomeView({user: user});
        newView.user.should.equal(user);
      });

      // FIX: Pending tests need to be addressed in the views referenced; their 
      //      constructors and render functions cause failures otherwise

      it('instantiates a task panel');

      it('instantiates a top widget view');
    });

    // describe('elements');

    // describe('events');

    // describe('renderTopWidgets() method');

    // describe('renderTaskPanel() method');

    // describe('render() function');

    describe('reset() method', function() {
      beforeEach(function() { 
        view.render(); 
        server.respond(); // render function makes Ajax call
      });

      it('removes the task panel', function() {
        sinon.stub(view.$taskPanel, 'remove');
        view.reset();
        view.$taskPanel.remove.calledOnce.should.be.true;
        view.$taskPanel.remove.restore();
      });

      it('removes the top widgets', function() {
        sinon.stub(view.$topWidgets, 'remove');
        view.reset();
        view.$topWidgets.remove.calledOnce.should.be.true;
        view.$topWidgets.remove.restore();
      });

      it('removes itself from the DOM', function() {
        sinon.stub(view, 'remove');
        view.reset();
        view.remove.calledOnce.should.be.true;
        view.remove.restore();
      });

      it('keeps its user', function() {
        view.reset();
        view.user.should.equal(user);
      });

      it('undelegates events', function() {
        sinon.stub(view, 'undelegateEvents');
        view.reset();
        view.undelegateEvents.calledOnce.should.be.true;
        view.undelegateEvents.restore();
      });

      it('returns itself', function() {
        view.reset().should.equal(view);
      });
    });
  });
});