define(['backbone', 'views/app/homepage', 'cookie'], function(Backbone, HomepageView) {
  
  describe('HomepageView', function() {
    var view;

    describe('constructor', function() {
      it('instantiates a login form', function() {
        view = new HomepageView();
        (typeof view.$loginForm).should.not.equal('undefined');
      });
    });

    describe('homepage elements', function() {
      beforeEach(function() {
        view = new HomepageView();
        view.render();
      });

      afterEach(function() {
        view.undelegateEvents();
        view.$el.removeData().unbind();
        view.remove();
        Backbone.View.prototype.remove.call(view);
      });

      describe('top nav', function() {
        it('is present', function() {
          view.$('#navbar-top').should.exist();
        });

        it('has a link to log in', function() {
          view.$('#navbar-top').find('.login-link').should.exist();
        });
      });

      describe('registration form', function() {
        it('is visible', function() {
          view.$('form#registration-form').should.be.visible;
        });
      });

      // The view homepage view has a child login form view, `view.$loginForm`.
      // The homepage view controls the appearance of the login form, which is 
      // attached to its #shade div and remains invisible until a link is clicked.
      // When the login form is submitted, it emits a `loginSuccess` event, which
      // should then trigger a `loginSuccess` event on the homepage itself. 
      // The router listens for the loginSuccess event.

      describe('login form', function() {
        it('is hidden initially', function() {
          view.$('#login-form').should.not.be.visible;
        });

        it('is displayed when the link is clicked', function() {
          view.$('#navbar-top').find('.login-link').trigger('click');
          view.$('#login-form').should.be.visible;
        });

        it('triggers the loginSuccess event', function() {
          var spy = sinon.spy();
          view.on('loginSuccess', spy);
          view.$loginForm.trigger('loginSuccess');
          spy.calledOnce.should.be.true;
          view.off('loginSuccess');
        });
      });

      it('has a \'features\' section', function() {
        view.$('section#features').should.exist();
      });

      it('has contact information', function() {
        view.$('#contact-us').should.exist();
      });
    });

    describe('render() function', function() {
      beforeEach(function() {
        view = new HomepageView();
        view.render();
      });

      afterEach(function() {
        view.remove();
      });

      it('creates a div', function() {
        view.$el[0].tagName.should.equal('DIV');
      });

      it('assigns the ID #homepage-wrapper', function() {
        view.$el[0].id.should.equal('homepage-wrapper');
      });
    });
  });
});