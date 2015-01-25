define(['backbone', 'views/app/homepage'], function(Backbone, HomepageView) {
  
  describe('HomepageView', function() {
    var view;

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
  });
});