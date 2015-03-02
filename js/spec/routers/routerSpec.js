define([
  'backbone', 
  'router', 
  'models/user',
  'cookie'], function(Backbone, Router, User) {
  
  describe('Canto Router', function() {
    var router, e, spy;

    var sandbox = sinon.sandbox.create();
    var server = sandbox.useFakeServer();

    var user = new User({id: 342, username: 'testuser', password: 'testuser'});

    beforeEach(function() {
      if(typeof router === 'undefined') { router = new Router(); }
    });

    afterEach(function() {
      sandbox.restore();
    });

    describe('constructor', function() {
      it('creates an app presenter', function() {
        var newRouter = new Router();
        (typeof newRouter.appPresenter).should.not.equal('undefined');
      });

      it('creates a dashboard presenter', function() {
        var newRouter = new Router();
        (typeof newRouter.dashboardPresenter).should.not.equal('undefined');
      });
    });

    describe('routes', function() {
      describe('/', function() {
        it('calls rerouteIfLoggedIn', function() {
          sinon.test(function() {
            sandbox.spy(router, 'rerouteIfLoggedIn');
            router.navigate('');
            router.rerouteIfLoggedIn.calledOnce.should.be.true;
          });
        });

        describe('when logged in', function() {
          sinon.test(function() {
            sandbox.stub($, 'cookie').withArgs('auth').returns('foobar');
            sandbox.stub(router, 'displayDashboardHome')
            router.navigate('');
            router.displayDashboardHome.calledOnce.should.be.true;
          });
        });

        describe('when not logged in', function() {
          it('calls displayHomepage', function() {
            sinon.test(function() {
              sandbox.stub($, 'cookie').withArgs('auth').returns(null);
              sandbox.stub(router, 'displayHomepage');
              router.navigate('');
              router.displayHomepage.calledOnce.should.be.true;
            });
          });
        });
      });

      describe('home', function() {
        it('calls displayHomepage', function() {
          sinon.test(function() {
            sandbox.spy(router, 'displayHomepage');
            router.navigate('home');
            router.displayHomepage.calledOnce.should.be.true;
          });
        });
      });

      describe('dashboard', function() {
        it('calls verifyLoggedIn', function() {
          sinon.test(function() {
            sandbox.stub(router, 'verifyLoggedIn');
            router.navigate('dashboard');
            router.verifyLoggedIn.calledOnce.should.be.true;
          });
        });

        describe('when logged in', function() {
          it('calls displayDashboardHome', function() {
            sinon.test(function() {
              sandbox.stub($, 'cookie').withArgs('auth').returns('foobar');
              sandbox.stub(router, 'displayDashboardHome');
              router.navigate('dashboard');
              router.displayDashboardHome.calledOnce.should.be.true;
            });
          });
        });

        describe('when not logged in', function() {
          it('goes back to the homepage', function() {
            sinon.test(function() {
              sandbox.stub($, 'cookie').withArgs('auth').returns(null);
              sandbox.stub(router, 'displayHomepage');
              router.navigate('dashboard');
              router.displayHomepage.calledOnce.should.be.true;
            });
          });
        });
      });

      describe('tasks', function() {
        it('calls verifyLoggedIn', function() {
          sinon.test(function() {
            sandbox.spy(router, 'verifyLoggedIn');
            router.navigate('tasks');
            router.verifyLoggedIn.calledOnce.should.be.true;
          });
        });

        describe('when logged in', function() {
          it('calls displayTaskView', function() {
            sinon.test(function() {
              sandbox.stub($, 'cookie').withArgs('auth').returns('foobar');
              sandbox.stub(router, 'displayTaskView');
              router.navigate('tasks');
              router.displayTaskView.calledOnce.should.be.true;
            });
          });
        });

        describe('when not logged in', function() {
          it('goes back to the homepage', function() {
            sinon.test(function() {
              sandbox.stub($, 'cookie').withArgs('auth').returns(null);
              sandbox.stub(router, 'displayHomepage');
              router.navigate('tasks');
              router.displayHomepage.calledOnce.should.be.true;
            });
          });
        });
      });

      describe('logout', function() {
        it('calls logOut', function() {
          sinon.test(function() {
            sandbox.stub(router, 'logOut');
            router.navigate('logout');
            router.logOut.calledOnce.should.be.true;
          });
        });
      });
    });

    describe('displayDashboardHome', function() {
      it('calls getHome on the dashboard presenter', function() {
        // It needs a cookie to set the user
        sandbox.stub($, 'cookie').withArgs('userID').returns(342);
        sandbox.stub(router.dashboardPresenter, 'getHome');
        router.displayDashboardHome();
        router.dashboardPresenter.getHome.calledOnce.should.be.true;
        delete router.dashboardPresenter.user;
      });

      describe('when presenter has a user', function() {
        beforeEach(function() { router.dashboardPresenter.setUser(user); });

        it('doesn\'t call setUser', function() {
          sinon.test(function() {
            sandbox.stub(router.dashboardPresenter, 'setUser');
            router.displayDashboardHome();
            router.dashboardPresenter.setUser.called.should.be.false;
          });
        });
      });

      describe('when presenter has no user', function() {
        beforeEach(function() { delete router.dashboardPresenter.user; });

        it('calls setUser', function() {
          sinon.test(function() {
            sandbox.stub($, 'cookie').withArgs('userID').returns(342);
            sandbox.stub(router.dashboardPresenter, 'setUser');
            console.log('inside test');
            router.displayDashboardHome();
            router.dashboardPresenter.setUser.withArgs(user).calledOnce.should.be.true;
          });
        });
      });
    });

    describe('displayTaskView', function() {
      it('calls getTask on the dashboard presenter', function() {
        sinon.test(function() {
          // It needs a cookie to set the user
          sandbox.stub($, 'cookie').withArgs('userID').returns(342);
          sandbox.stub(router.dashboardPresenter, 'getTask');
          router.displayTaskView();
          router.dashboardPresenter.getTask.calledOnce.should.be.true;
        });
      });

      describe('when presenter has a user', function() {
        beforeEach(function() { router.dashboardPresenter.setUser(user); });

        it('doesn\'t call setUser', function() {
          sinon.test(function() {
            sandbox.stub(router.dashboardPresenter, 'setUser');
            router.displayTaskView();
            router.dashboardPresenter.setUser.called.should.be.false;
          });
        });
      });

      describe('when presenter has no user', function() {
        beforeEach(function() { delete router.dashboardPresenter.user; });

        it('calls setUser', function() {
          sinon.test(function() {
            sandbox.stub($, 'cookie').withArgs('userID').returns(342);
            sandbox.stub(router.dashboardPresenter, 'setUser');
            console.log('inside test');
            router.displayTaskView();
            router.dashboardPresenter.setUser.withArgs(user).calledOnce.should.be.true;
          });
        });
      });
    });

    describe('displayHomepage', function() {
      it('calls getHomepage on the app presenter', function() {
        sinon.test(function() {
          sandbox.stub(router.appPresenter, 'getHomepage');
          router.displayHomepage();
          router.appPresenter.getHomepage.calledOnce.should.be.true;
        });
      });

      it('calls removeAll on the dashboard presenter', function() {
        sinon.test(function() {
          sandbox.stub(router.dashboardPresenter, 'removeAll');
          router.displayHomepage();
          router.dashboardPresenter.removeAll.calledOnce.should.be.true;
        });
      });
    });

    describe('logOut', function() {
      _.each(['auth', 'userID'], function(cookie) {
        it('removes the ' + cookie + ' cookie', function() {
          sinon.test(function() {
            sandbox.stub($, 'removeCookie');
            router.logOut();
            $.removeCookie.withArgs(cookie).calledOnce.should.be.true;
          });
        });
      });

      it('navigates to the homepage', function() {
        sinon.stub(router, 'navigate');
        router.logOut();
        router.navigate.calledWithExactly('', {trigger: true}).should.be.true;
      });
    });

    describe('rerouteIfLoggedIn', function() {
      describe('when logged in', function() {
        it('calls removeAll on the app presenter', function() {
          sinon.test(function() {
            sandbox.stub($, 'cookie').withArgs('auth').returns('foobar');
            sandbox.stub(router.appPresenter, 'removeAll');
            router.rerouteIfLoggedIn();
            router.appPresenter.removeAll.calledOnce.should.be.true;
          });
        });

        it('navigates to the dashboard', function() {
          sinon.test(function() {
            sandbox.stub(router, 'navigate');
            sandbox.stub($, 'cookie').withArgs('auth').returns('foobar');
            router.rerouteIfLoggedIn();
            router.navigate.calledWithExactly('dashboard', {trigger: true}).should.be.true;
          });
        });
      });
    });
  });
});