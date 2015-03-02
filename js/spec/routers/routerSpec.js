define(['backbone', 'router'], function(Backbone, Router) {
  
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
    });
  });
});