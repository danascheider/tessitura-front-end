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

    describe('getHomepage() function', function() {
      beforeEach(function() {
        sinon.stub($).withArgs('body'), 'prepend').returns(sinon.stub({prepend: function() {}}));
      });

      it('creates a homepage view if there is none', function() {
        var presenter = new AppPresenter();
        presenter.set('homepageView', null);
        presenter.getHomepage(obj);
        presenter.homepageView.should.not.be.null;
      });

      it('renders the homepage', function() {
        var presenter = new AppPresenter();
        sinon.spy(presenter.homepageView, 'render');
        presenter.getHomepage('body');
        presenter.homepageView.render.calledOnce.should.be.true;
      });
    });
  });
});