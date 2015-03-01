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
        it('calls emitRedirectDashboard()', function() {
          sandbox.stub(AppPresenter.prototype, 'emitRedirectDashboard');
          var presenter = new AppPresenter();
          presenter.homepageView.trigger('loginSuccess');
          AppPresenter.prototype.emitRedirectDashboard.calledOnce.should.be.true;
        });
      });

      describe('redirect:dashboard', function() {
        it('calls emitRedirectDashboard', function() {
          sandbox.stub(AppPresenter.prototype, 'emitRedirectDashboard');
          var presenter = new AppPresenter();
          presenter.homepageView.trigger('redirect:dashboard');
          AppPresenter.prototype.emitRedirectDashboard.calledOnce.should.be.true;
        });
      });
    });

    describe('emitRedirectDashboard() method', function() {
      it('emits the redirect:dashboard event', function() {
        spy = sandbox.spy();
        var presenter = new AppPresenter();
        presenter.on('redirect:dashboard', spy);
        presenter.emitRedirectDashboard();
        spy.calledOnce.should.be.true;
        presenter.off('redirect:dashboard');
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