define(['backbone', 'views/app/homepage', 'cookie'], function(Backbone, HomepageView) {
  
  describe('HomepageView', function() {
    var view;

    describe('homepage elements', function() {
      // The homepage needs to have the following elements:
      // - Top nav with login link
      // - Registration form
      // - 'Contact us' section
      // - 'Features' section with links

      beforeEach(function() {
        view = new HomepageView();
        view.render();
      });

      afterEach(function() {
        view.remove();
      });

      describe('top nav', function() {
        it('is present', function() {
          view.$('#navbar-top').should.exist();
        });

        it('has a link to log in', function() {
          view.$('#navbar-top').find('.login-link').should.exist();
        });
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

    describe('toggleLoginForm() method', function() {
      //
    });
  });
});