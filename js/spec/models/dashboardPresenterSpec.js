define([
  'backbone',
  'models/dashboard-presenter',
  'api',
  'models/user',
  'models/task',
  'collections/tasks',
  'views/app/dashboard',
  'views/app/dashboard-home',
  'views/app/kanban-board',
  'cookie'
], function(Backbone, DashboardPresenter, API, User, Task, TaskCollection, MainView, HomeView, TaskView) {
  
  describe('DashboardPresenter', function() {
    var sandbox = sinon.sandbox.create();

    // Create user to be passed to the DashboardPresenter

    var user = new User({username: 'testuser', password: 'testuser', email: 'testuser@example.com'}), presenter;
    var task1 = new Task({id: 1, title: 'Task 1', status: 'New', priority: 'Low', position: 1});
    var task2 = new Task({id: 2, title: 'Task 2', status: 'New', priority: 'Normal', position: 2});
    var task3 = new Task({id: 3, title: 'Task 3', status: 'Complete', priority: 'Normal', position: 3});

    user.tasks = new TaskCollection([task1, task2, task3]);

    afterEach(function() { sandbox.restore(); });

    describe('constructor', function() {
      it('doesn\'t require a user', function() {
        presenter = new DashboardPresenter();
        (typeof presenter.user).should.equal('undefined');
      });

      it('calls `setUser`', function() {
        sandbox.stub(DashboardPresenter.prototype, 'setUser');
        presenter = new DashboardPresenter({user: user});
        DashboardPresenter.prototype.setUser.withArgs(user).calledOnce.should.be.true;
      });
    });

    describe('setUser() method', function() {
      beforeEach(function() {
        presenter = new DashboardPresenter();
      });

      it('sets this.user', function() {
        presenter.setUser(user);
        presenter.user.should.equal(user);
      });

      it('listens to the user\'s `sync` event', function() {
        sandbox.stub(presenter, 'listenTo');
        presenter.setUser(user);
        presenter.listenTo.withArgs(user, 'sync', presenter.refresh).calledOnce.should.be.true;
      });

      it('creates a main view', function() {
        presenter.setUser(user);
        (typeof presenter.mainView).should.not.equal('undefined');
      });
    });

    describe('getHome() method', function() {
      beforeEach(function() {
        presenter = new DashboardPresenter({user: user});
        sandbox.stub(user.tasks, 'fetch');
      });

      afterEach(function() {
        delete presenter.mainView.$homeView;
        delete presenter.mainView.$kanbanView;
      });

      describe('when the Kanban view is displayed', function() {
        beforeEach(function() {
          presenter.mainView.$kanbanView = new TaskView({user: user});
        });

        after(function() {
          delete presenter.mainView.$kanbanView;
        });

        it('removes the kanban board', function() {
          sandbox.spy(presenter.mainView.$kanbanView, 'remove');
          presenter.getHome();
          presenter.mainView.$kanbanView.remove.calledOnce.should.be.true;
        });
      });

      describe('when there is no home view', function() {
        it('creates the home view', function() {
          delete presenter.mainView.$homeView;
          presenter.getHome();
          (typeof presenter.mainView.$homeView).should.not.equal('undefined');
        });
      });

      describe('when there is a home view', function() {
        it('keeps the same home view', function() {
          presenter.mainView.$homeView = new HomeView({user: user});
          var orig = presenter.mainView.$homeView;
          presenter.getHome();
          presenter.mainView.$homeView.should.equal(orig);
        });
      });

      it('renders the home view', function() {
        presenter.mainView.$homeView = presenter.mainView.$homeView || new HomeView({user: user, collection: user.tasks});
        sandbox.stub(presenter.mainView.$homeView, 'render');
        presenter.getHome();
        presenter.mainView.$homeView.render.calledOnce.should.be.true;
      });

      it('appends the view to the DOM', function() {
        sandbox.stub($.prototype, 'after');
        var el = presenter.mainView.$('nav');
        presenter.getHome();
        el.after.withArgs(presenter.mainView.$homeView.el).calledOnce.should.be.true;
      });

      it('sets the \'current\' property to \'home\'', function() {
        presenter.getHome();
        presenter.current.should.equal('home');
      });
    });

    describe('getKanban() method', function() {
      beforeEach(function() {
        presenter = new DashboardPresenter({user: user});
      });

      describe('when the home view is displayed', function() {
        beforeEach(function() {
          presenter.mainView.$homeView = new HomeView({user: user});
          sandbox.spy(presenter.mainView.$homeView, 'remove');
        });

        after(function() { delete presenter.mainView.$homeView; });

        it('removes the home view', function() {
          presenter.getKanban();
          presenter.mainView.$homeView.remove.calledOnce.should.be.true;
        });
      });

      describe('when there is no task view', function() {
        it('creates the task view', function() {
          delete presenter.mainView.$kanbanView;
          presenter.getKanban();
          (typeof presenter.mainView.$kanbanView).should.not.equal('undefined');
        });
      });

      describe('when there is a task view', function() {
        it('keeps the same task view', function() {
          presenter.mainView.$kanbanView = new TaskView({user: user});
          var orig = presenter.mainView.$kanbanView;
          presenter.getKanban();
          presenter.mainView.$kanbanView.should.equal(orig);
        });
      });

      it('renders the task view', function() {

        // Create the task view in advance in order to set up the stub/spy

        presenter.mainView.$kanbanView = presenter.mainView.$kanbanView || new TaskView({user: user});
        sandbox.stub(presenter.mainView.$kanbanView, 'render');

        presenter.getKanban();
        presenter.mainView.$kanbanView.render.calledOnce.should.be.true;
      });

      it('inserts the view into the DOM', function() {
        sandbox.stub($.prototype, 'after');
        var el = presenter.mainView.$('nav');
        presenter.getKanban();
        el.after.withArgs(presenter.mainView.$kanbanView.el).calledOnce.should.be.true;
      });

      it('sets the \'current\' property to \'kanban\'', function() {
        presenter.getKanban();
        presenter.current.should.equal('kanban');
      });
    });

    describe('getMain() method', function() {
      beforeEach(function() {
        sandbox.stub($.prototype, 'html');
        presenter = new DashboardPresenter({user: user});
      });

      describe('when the main view doesn\'t exist', function() {
        it('creates the main view', function() {
          delete presenter.mainView;
          presenter.getMain();
          (typeof presenter.mainView).should.not.equal('undefined');
        });
      });

      describe('when the main view exists', function() {
        it('keeps the same main view', function() {
          var orig = presenter.mainView;
          presenter.getMain();
          presenter.mainView.should.equal(orig);
        });
      });

      it('renders the main view', function() {
        sandbox.stub(presenter.mainView, 'render');
        presenter.getMain();
        presenter.mainView.render.calledOnce.should.be.true;
      });

      it('sets the HTML of the body', function() {
        presenter.getMain();
        $.prototype.html.called.should.be.true;
      });
    });
    
    describe('refreshCurrent() method', function() {
      beforeEach(function() {
        presenter = new DashboardPresenter({user: user});
      });

      describe('when the home view is current', function() {
        it('calls getHome()', function() {
          sandbox.stub(presenter, 'getHome');
          presenter.current = 'home';
          presenter.refreshCurrent();
          presenter.getHome.calledOnce.should.be.true;
        });
      });

      describe('when the task view is current', function() {
        it('calls getKanban()', function() {
          sandbox.stub(presenter, 'getKanban');
          presenter.current = 'kanban';
          presenter.refreshCurrent();
          presenter.getKanban.calledOnce.should.be.true;
        });
      });

      describe('when current is not set', function() {
        beforeEach(function() { delete presenter.current; });

        it('doesn\'t raise an error', function() {
          presenter.refreshCurrent.should.not.throw(Error);
        });

        it('doesn\'t call getHome()', function() {
          sandbox.stub(presenter, 'getHome');
          presenter.refreshCurrent();
          presenter.getHome.called.should.be.false;
        });

        it('doesn\'t call getKanban()', function() {
          sandbox.stub(presenter, 'getKanban');
          presenter.refreshCurrent();
          presenter.getKanban.called.should.be.false;
        });
      });
    });

    describe('refresh() method', function() {
      beforeEach(function() {
        presenter = new DashboardPresenter({user: user});
        sandbox.stub(presenter, 'getMain');
        sandbox.stub(presenter, 'refreshCurrent');
      });

      it('calls getMain()', function() {
        presenter.refresh();
        presenter.getMain.calledOnce.should.be.true;
      });

      it('calls refreshCurrent()', function() {
        presenter.refresh();
        presenter.refreshCurrent.calledOnce.should.be.true;
      });
    });

    describe('removeAll() method', function() {
      beforeEach(function() {
        presenter = new DashboardPresenter({user: user});
      });

      it('removes the main view', function() {
        sandbox.spy(presenter.mainView, 'remove');
        presenter.removeAll();
        presenter.mainView.remove.calledOnce.should.be.true;
      });
    });
  });
});