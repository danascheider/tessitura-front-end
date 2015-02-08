define([
  'backbone',
  'models/dashboard-presenter',
  'api',
  'models/user',
  'models/task',
  'views/app/dashboard',
  'views/app/dashboard-home',
  'views/app/kanban-board',
  'cookie'
], function(Backbone, DashboardPresenter, API, User, Task, MainView, HomeView, TaskView) {
  
  describe('DashboardPresenter', function() {

    // Create user to be passed to the DashboardPresenter

    var user = new User({username: 'testuser', password: 'testuser', email: 'testuser@example.com'}), presenter;

    describe('constructor', function() {
      beforeEach(function() {
        presenter = new DashboardPresenter();
      });
    });

    describe('event handling', function() {

      // Store a reference to DashboardPresenter's `initialize` so it
      // can be configured to include Sinon spy code for the tests and 
      // then changed back.

      var init = DashboardPresenter.prototype.initialize;

      beforeEach(function() {

        // Monkey patch the DashboardPresenter's `initialize` function
        // allowing Sinon to spy on the 'refresh' function

        DashboardPresenter.prototype.initialize = function() {
          sinon.spy(this, 'refresh');
          init.apply(this, arguments);
        };

        presenter = new DashboardPresenter({user: user});
      });

      afterEach(function() {
        DashboardPresenter.prototype.initialize = function() {
          init.apply(this, arguments);
        };
      });

      it('listens to its user', function() {
        (typeof presenter._listeningTo[user._listenId]).should.not.equal('undefined');
      });

      it('refreshes on its user\'s \'sync\' event', function() {
        user.trigger('sync');
        presenter.refresh.called.should.be.true;
      });
    });
    
    describe('getHome() method', function() {
      beforeEach(function() {
        presenter = new DashboardPresenter({user: user});
      });

      after(function() {
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
          sinon.spy(presenter.mainView.$kanbanView, 'remove');
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
        presenter.mainView.$homeView = presenter.mainView.$homeView || new HomeView({user: user});
        sinon.stub(presenter.mainView.$homeView, 'render');
        presenter.getHome();
        presenter.mainView.$homeView.render.calledOnce.should.be.true;
        presenter.mainView.$homeView.render.restore();
      });

      it('appends the view to the DOM', function() {
        sinon.stub($.prototype, 'after');
        var el = presenter.mainView.$('nav');
        presenter.getHome();
        el.after.withArgs(presenter.mainView.$homeView.el).calledOnce.should.be.true;
        $.prototype.after.restore();
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
          sinon.spy(presenter.mainView.$homeView, 'remove');
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
        sinon.stub(presenter.mainView.$kanbanView, 'render');

        presenter.getKanban();
        presenter.mainView.$kanbanView.render.calledOnce.should.be.true;

        // Restore the render() method to its original glory

        presenter.mainView.$kanbanView.render.restore();
      });

      it('inserts the view into the DOM', function() {
        sinon.stub($.prototype, 'after');
        var el = presenter.mainView.$('nav');
        presenter.getKanban();
        el.after.withArgs(presenter.mainView.$kanbanView.el).calledOnce.should.be.true;
        $.prototype.after.restore();
      });

      it('sets the \'current\' property to \'kanban\'', function() {
        presenter.getKanban();
        presenter.current.should.equal('kanban');
      });
    });

    describe('getMain() method', function() {
      beforeEach(function() {
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
        sinon.stub(presenter.mainView, 'render');
        presenter.getMain();
        presenter.mainView.render.calledOnce.should.be.true;
      });

      it('sets the HTML of the given element', function() {
        sinon.stub($.prototype, 'html');
        presenter.getMain('body');
        $('body').html.withArgs(presenter.mainView.el).calledOnce.should.be.true;
      });
    });
    
    describe('refreshCurrent() method', function() {
      beforeEach(function() {
        presenter = new DashboardPresenter({user: user});
      });

      describe('when the home view is current', function() {
        it('calls getHome()', function() {
          sinon.stub(presenter, 'getHome');
          presenter.current = 'home';
          presenter.refreshCurrent();
          presenter.getHome.calledOnce.should.be.true;
        });
      });

      describe('when the task view is current', function() {
        it('calls getKanban()', function() {
          sinon.stub(presenter, 'getKanban');
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
          sinon.stub(presenter, 'getHome');
          presenter.refreshCurrent();
          presenter.getHome.called.should.be.false;
        });

        it('doesn\'t call getKanban()', function() {
          sinon.stub(presenter, 'getKanban');
          presenter.refreshCurrent();
          presenter.getKanban.called.should.be.false;
        });
      });
    });

    describe('refresh() method', function() {
      beforeEach(function() {
        presenter = new DashboardPresenter({user: user});
      });

      it('calls getMain()', function() {
        sinon.stub(presenter, 'getMain');
        presenter.refresh();
        presenter.getMain.calledOnce.should.be.true;
      });

      it('calls refreshCurrent()', function() {
        sinon.stub(presenter, 'refreshCurrent');
        presenter.refresh();
        presenter.refreshCurrent.calledOnce.should.be.true;
      });
    });

    describe('removeAll() method', function() {
      beforeEach(function() {
        presenter = new DashboardPresenter({user: user});
      });

      it('removes the main view', function() {
        sinon.spy(presenter.mainView, 'remove');
        presenter.removeAll();
        presenter.mainView.remove.calledOnce.should.be.true;
      });
    })
  });
});