define([
  'backbone',
  'models/dashboardPresenter',
  'api',
  'models/user',
  'models/task',
  'collections/tasks',
  'views/main/dashboard',
  'views/partials/dashboardHome',
  'views/partials/kanbanBoard',
  'spec/testTools',
  'cookie'
], function(Backbone, DashboardPresenter, API, User, Task, TaskCollection, MainView, HomeView, TaskView, TestTools) {
  
  describe('DashboardPresenter', function() {
    var spy;
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

      it('creates a dashboard', function() {
        presenter = new DashboardPresenter();
        (typeof presenter.$dashboard).should.not.equal('undefined');
      });

      it('calls `setUser`', function() {
        sandbox.stub(DashboardPresenter.prototype, 'setUser');
        presenter = new DashboardPresenter({user: user});
        DashboardPresenter.prototype.setUser.withArgs(user).calledOnce.should.be.true;
      });
    });

    describe('events', function() {
      describe('sync user', function() {
        beforeEach(function() {
          sandbox.stub(DashboardPresenter.prototype, 'refresh');
          presenter = new DashboardPresenter({user: user});
        });

        it('calls refresh', function() {
          user.trigger('sync');
          DashboardPresenter.prototype.refresh.calledOnce.should.be.true;
        });
      });

      describe('listeners', function() {
        beforeEach(function() {
          presenter = new DashboardPresenter({user: user});
        });

        afterEach(function() { presenter.off(); })

        describe('redirect:dashboard on dashboard view', function() {
          it('emits the redirect:dashboard event', function() {
            spy = sandbox.spy();
            presenter.on('redirect', spy);
            presenter.$dashboard.trigger('redirect', {destination: 'dashboard'});
            spy.withArgs({destination: 'dashboard'}).calledOnce.should.be.true;
          });
        });

        describe('redirect:tasks on dashboard view', function() {
          it('emits the redirect:tasks event', function() {
            spy = sandbox.spy();
            presenter.on('redirect', spy);
            presenter.$dashboard.trigger('redirect', {destination: 'tasks'});
            spy.withArgs({destination: 'tasks'}).calledOnce.should.be.true;
          });
        });
      });
    });

    describe('redirect() method', function() {
      before(function() {
        presenter = new DashboardPresenter({user: user});
      });

      afterEach(function() { presenter.off(); });

      describe('to dashboard', function() {
        it('emits the redirect:dashboard event', function() {
          spy = sandbox.spy();
          presenter.on('redirect', spy);
          presenter.redirect({destination: 'dashboard'});
          spy.withArgs({destination: 'dashboard'}).calledOnce.should.be.true;
        });
      });

      describe('to main task view', function() {
        it('emits the redirect:tasks event', function() {
          spy = sandbox.spy();
          presenter.on('redirect', spy);
          presenter.redirect({destination: 'tasks'});
          spy.withArgs({destination: 'tasks'}).calledOnce.should.be.true;
        });
      })
    });

    describe('setUser() method', function() {
      beforeEach(function() {
        presenter = new DashboardPresenter();
      });

      it('sets this.user', function() {
        presenter.setUser(user);
        presenter.user.should.equal(user);
      });

      it('sets up a listener', function() {
        sandbox.stub(presenter, 'listenTo');
        presenter.setUser(user);
        presenter.listenTo.withArgs(user).calledOnce.should.be.true;
      });

      it('calls setUser on the dashboard', function() {
        server = sandbox.useFakeServer();
        server.respondWith(function(xhr) {
          xhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify([{user: {id: 342, username: 'testuser', password: 'testuser', email: 'testuser@example.com'}}]))
        });

        sandbox.spy(presenter.$dashboard, 'setUser');
        presenter.setUser(user);
        server.respond();
        presenter.$dashboard.setUser.calledOnce.should.be.true;
      });

      it('fetches the user data', function() {
        sandbox.stub(user, 'protectedFetch');
        presenter.setUser(user);
        user.protectedFetch.calledOnce.should.be.true;
      });
    });

    describe('getHome() method', function() {
      beforeEach(function() {
        presenter = new DashboardPresenter({user: user});
        sandbox.stub(user.tasks, 'fetch');
        sandbox.stub(presenter.$dashboard, 'showHomeView');
        sandbox.stub($.prototype, 'html');
      });

      it('calls the dashboard\'s showHomeView() function', function() {
        sinon.test(function() {
          presenter.getHome();
          presenter.$dashboard.showHomeView.calledOnce.should.be.true;
        });
      });

      it('sets the \'current\' property to \'home\'', function() {
        sinon.test(function() {
          presenter.getHome();
          presenter.current.should.equal('home');
        });
      });
    });

    describe('getTask() method', function() {
      beforeEach(function() {
        presenter = new DashboardPresenter({user: user});
        sandbox.stub(presenter.$dashboard, 'showTaskView');
        sandbox.stub($.prototype, 'html');
      });

      it('calls the dashboard\'s showTaskView() method', function() {
        sinon.test(function() {
          presenter.getTask();
          presenter.$dashboard.showTaskView.calledOnce.should.be.true;
        });
      });

      it('sets the \'current\' property to \'task\'', function() {
        sinon.test(function() {
          presenter.getTask();
          presenter.current.should.equal('task');
        });
      });
    });

    describe('refreshCurrent() method', function() {
      beforeEach(function() {
        presenter = new DashboardPresenter({user: user});
        sandbox.stub(presenter, 'getHome');
        sandbox.stub(presenter, 'getTask');
      });

      describe('when the home view is current', function() {
        it('calls getHome()', function() {
          sinon.test(function() {
            presenter.current = 'home';
            presenter.refreshCurrent();
            presenter.getHome.calledOnce.should.be.true;
          });
        });
      });

      describe('when the task view is current', function() {
        it('calls getTask()', function() {
          sinon.test(function() {
            presenter.current = 'task';
            presenter.refreshCurrent();
            presenter.getTask.calledOnce.should.be.true;
          });
        });
      });

      // describe('when current is not set', function() {
      //   beforeEach(function() { delete presenter.current; });

      //   it('doesn\'t raise an error', function() {
      //     presenter.refreshCurrent.should.not.throw(Error);
      //   });

      //   it('doesn\'t call getHome()', function() {
      //     presenter.refreshCurrent();
      //     presenter.getHome.called.should.be.false;
      //   });

      //   it('doesn\'t call getTask()', function() {
      //     presenter.refreshCurrent();
      //     presenter.getTask.called.should.be.false;
      //   });
      // });
    });

    // describe('refresh() method', function() {
    //   beforeEach(function() {
    //     presenter = new DashboardPresenter({user: user});
    //     sandbox.stub(presenter, 'refreshCurrent');
    //   });
      
    //   it('calls refreshCurrent()', function() {
    //     presenter.refresh();
    //     presenter.refreshCurrent.calledOnce.should.be.true;
    //   });
    // });

    // describe('removeAll() method', function() {
    //   beforeEach(function() {
    //     presenter = new DashboardPresenter({user: user});
    //   });

    //   it('removes the dashboard view', function() {
    //     sandbox.spy(presenter.$dashboard, 'remove');
    //     presenter.removeAll();
    //     presenter.$dashboard.remove.calledOnce.should.be.true;
    //   });
    // });
  });
});