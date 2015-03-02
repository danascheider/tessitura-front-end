define(['backbone', 'router', 'cookie'], function(Backbone, Router) {
  
  describe('Canto Router', function() {
    var router, e, spy;

    var sandbox = sinon.sandbox.create();
    var server = sandbox.useFakeServer();

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
      });
    });
  });
});