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

        describe('when not logged in', function() {
          it('calls displayHomepage()', function() {
            sinon.test(function() {
              sandbox.spy(router, 'displayHomepage');
              router.navigate('');
              router.displayHomepage.calledOnce.should.be.true;
            });
          });
        });
      });
    });
  });
});