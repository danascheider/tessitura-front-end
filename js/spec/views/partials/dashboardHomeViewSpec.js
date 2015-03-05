define([
  'backbone', 
  'views/partials/dashboardHome', 
  'views/partials/dashboardTopWidgets',
  'views/partials/taskPanel',
  'models/user',
  'models/task',
  'collections/tasks'
  ], function(Backbone, HomeView, TopView, PanelView, User, Task, TaskCollection) {
  
  describe('Dashboard Home View', function() {
    var view, e;
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

    beforeEach(function() {
      sandbox.stub($, 'ajax').yieldsTo('success', JSON.stringify(user.tasks.models));

      if(typeof view === 'undefined') { 
        view = new HomeView({user: user});
        view.render();
      }
    });

    afterEach(function() {
      view.remove();
      sandbox.restore();
    });

    describe('constructor', function() {
      it('does not call render', function() {
        sandbox.stub(Backbone.View.prototype, 'render');
        var newView = new HomeView({user: user});
        Backbone.View.prototype.render.called.should.be.false;
      });

      it('calls setUser()', function() {
        sandbox.stub(HomeView.prototype, 'setUser');
        var newView = new HomeView({user: user});
        HomeView.prototype.setUser.withArgs(user).calledOnce.should.be.true;
      });

      it('can be instantiated without a user', function() {
        var newView = new HomeView();
        (typeof newView.user).should.equal('undefined');
      });
    });

    describe('elements', function() {
      beforeEach(function() { 
        view.render(); 
      });

      it('has a task panel', function() {
        view.$taskPanel.$el.should.be.visible;
      });

      it('has a top widget section', function() {
        view.$topWidgets.$el.html().should.not.be.empty;
      });
    });

    describe('createTopWidgets() method', function() {
      it('creates a top widget view', function() {
        var newView = new HomeView();
        newView.collection = user.tasks;
        newView.createTopWidgets();
        (typeof newView.$topWidgets).should.not.equal('undefined');
      });
    });

    describe('renderTopWidgets() method', function() {
      beforeEach(function() {
        view.render().$topWidgets.remove();
      });

      it('creates a top widget view', function() {
        view.renderTopWidgets({taskCollection: user.tasks});
        (typeof view.$topWidgets).should.not.equal('undefined');
      });

      it('renders the top widget view', function() {
        sandbox.stub(view.$topWidgets, 'render');
        view.renderTopWidgets({taskCollection: user.tasks});
        view.$topWidgets.render.called.should.be.true;
      });

      it('inserts the top widget view into the DOM');
    });

    describe('renderTaskPanel() method', function() {
      beforeEach(function() {
        view.render().$taskPanel.remove();
      });

      it('creates a task panel view', function() {
        view.renderTaskPanel(user.tasks);
        view.$taskPanel.should.exist;
      });

      it('renders the task panel', function() {
        sandbox.stub(view.$taskPanel, 'render');
        view.renderTaskPanel(user.tasks);
        view.$taskPanel.render.calledOnce.should.be.true;
      });

      it('inserts the task panel view into the DOM');
    });

    describe('render() function', function() {
      beforeEach(function() {
        view.remove();
      });

      it('calls renderTopWidgets()', function() {
        sandbox.spy(view, 'renderTopWidgets');
        view.render();
        view.renderTopWidgets.calledOnce.should.be.true;
      });

      it('calls renderTaskPanel()', function() {
        sandbox.stub(view, 'renderTaskPanel');
        view.render();
        view.renderTaskPanel.calledOnce.should.be.true;
      });
    });

    describe('remove() method', function() {
      beforeEach(function() { 
        view.render(); 
      });

      it('removes the task panel', function() {
        sandbox.stub(view.$taskPanel, 'remove');
        view.remove();
        view.$taskPanel.remove.calledOnce.should.be.true;
      });

      it('removes the top widgets', function() {
        sandbox.stub(view.$topWidgets, 'remove');
        view.remove();
        view.$topWidgets.remove.calledOnce.should.be.true;
      });

      it('removes itself from the DOM', function() {
        sandbox.stub(view, 'remove');
        view.remove();
        view.remove.calledOnce.should.be.true;
      });

      it('keeps its user', function() {
        view.remove();
        view.user.should.equal(user);
      });
    });

    describe('setUser() method', function() {
      var newView;

      beforeEach(function() {
        sandbox.stub(HomeView.prototype, 'createTopWidgets');
        newView = new HomeView();
        newView.setUser(user);
      });

      it('sets the user', function() {
        newView.user.should.equal(user);
      });

      it('sets the collection', function() {
        newView.collection.should.equal(user.tasks);
      });

      it('creates the task panel', function() {
        (typeof newView.$taskPanel).should.not.equal('undefined');
      });

      it('calls createTopWidgets', function() {
        HomeView.prototype.createTopWidgets.calledOnce.should.be.true;
      });
    });
  });
});