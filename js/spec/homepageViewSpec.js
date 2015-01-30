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

      describe('top nav', function() {
        it('has a link to log in', function() {
          view.$el.find('#navbar-top').length.should.equal(1);
        });
      });
    });

    describe('render() function', function() {
      beforeEach(function() {
        view = new HomepageView();
      });

      it('creates a div', function() {
        view.render();
        view.$el[0].tagName.should.equal('DIV');
      });

      it('assigns the ID #homepage-wrapper', function() {
        view.render();
        view.$el[0].id.should.equal('homepage-wrapper');
      });
    });

    describe('toggleLoginForm() method', function() {
      //
    });
  });
});