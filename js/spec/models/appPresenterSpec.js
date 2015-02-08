define(function(require) {
  var Backbone = require('backbone');
  var AppPresenter = require('models/app-presenter');
  var API = require('api');
  var HomepageView = require('views/app/homepage');
  var cookie = require('cookie');

  describe('AppPresenter', function() {
    describe('constructor', function() {
      it('initializes a homepage view', function() {
        var presenter = new AppPresenter();
        (typeof presenter.homepageView).should.not.equal('undefined');
      });
    });

    describe('emitLogin() function', function() {
      var presenter = new AppPresenter();

      it('triggers the `userLoggedIn` event', function() {
        var spy = sinon.spy();
        presenter.on('userLoggedIn', spy);
        presenter.emitLogin();
        spy.calledOnce.should.be.true;
      });
    });

    describe('getHomepage() function', function() {
      var presenter = new AppPresenter();

      beforeEach(function() {
        sinon.stub($.prototype, 'prepend');
      });

      afterEach(function() {
        $.prototype.prepend.restore();
      });

      it('creates a homepage view if there is none', function() {
        presenter.set('homepageView', null);
        presenter.getHomepage('body');
        presenter.homepageView.should.not.be.null;
      });

      it('renders the homepage', function() {
        sinon.spy(presenter.homepageView, 'render');
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
        sinon.stub(presenter.homepageView, 'remove');
      });

      afterEach(function() {
        presenter.homepageView.remove.restore();
      });

      it('removes the homepage view if it exists', function() {
        presenter.removeAll();
        presenter.homepageView.remove.calledOnce.should.be.true;
      });
    });
  });
});