define([
  'backbone',
  'models/appPresenter',
  'api',
  'views/main/homepage',
  'cookie'
  ], function(Backbone, AppPresenter, API, HomepageView) {

  describe('AppPresenter', function() {

    var sandbox = sinon.sandbox.create();

    afterEach(function() {
      sandbox.restore();
    });

    describe('constructor', function() {
      it('initializes a homepage view', function() {
        var presenter = new AppPresenter();
        (typeof presenter.homepageView).should.not.equal('undefined');
      });
    });

    describe('events', function() {
      describe('login user', function() {
        it('calls emitRedirect()', function() {
          sandbox.stub(AppPresenter.prototype, 'emitRedirect');
          var presenter = new AppPresenter();
          presenter.homepageView.trigger('loginSuccess');
          AppPresenter.prototype.emitRedirect.calledOnce.should.be.true;
        });
      });

      describe('redirect - dashboard', function() {
        it('calls emitRedirect', function() {
          sandbox.stub(AppPresenter.prototype, 'emitRedirect');
          var presenter = new AppPresenter();
          presenter.homepageView.trigger('redirect', {destination: 'dashboard'});
          AppPresenter.prototype.emitRedirect.calledOnce.should.be.true;
        });
      });
    });

    describe('emitRedirect() method', function() {
      it('emits the redirect:dashboard event', function() {
        spy = sandbox.spy();
        var presenter = new AppPresenter();
        presenter.on('redirect', spy);
        presenter.emitRedirect();
        spy.calledOnce.should.be.true;
        presenter.off();
      });
    });

    describe('getHomepage() function', function() {
      var presenter = new AppPresenter();

      beforeEach(function() {
        sandbox.stub($.prototype, 'prepend');
      });

      it('creates a homepage view if there is none', function() {
        presenter.set('homepageView', null);
        presenter.getHomepage('body');
        presenter.homepageView.should.not.be.null;
      });

      it('renders the homepage', function() {
        sandbox.spy(presenter.homepageView, 'render');
        presenter.getHomepage('body');
        presenter.homepageView.render.calledOnce.should.be.true;
      });

      it('attaches the homepage view to the given element', function() {
        presenter.getHomepage('body');
        $.prototype.prepend.called.should.be.true
      });
    });

    describe('removeAll() function', function() {
      var presenter = new AppPresenter();

      beforeEach(function() {
        sandbox.stub(presenter.homepageView, 'remove');
      });

      it('removes the homepage view if it exists', function() {
        presenter.removeAll();
        presenter.homepageView.remove.calledOnce.should.be.true;
      });
    });
  });
});