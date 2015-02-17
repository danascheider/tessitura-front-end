define(['backbone', 'views/app/dashboard-home', 'models/user'], function(Backbone, HomeView, User) {
  
  describe('Dashboard Home View', function() {
    var view, e;
    var user = new User({
      username: 'testuser', 
      password: 'testuser', 
      email: 'testuser@example.com',
      first_name: 'Test',
      last_name: 'User'
    });

    beforeEach(function() {
      if(typeof view === 'undefined') { view = new HomeView({user: user}); }
    });

    describe('constructor', function() {
      it('does not call render', function() {
        sinon.stub(Backbone.View.prototype, 'render');
        newView = new HomeView({user: user});
        Backbone.View.prototype.render.called.should.be.false;
        Backbone.View.prototype.render.restore();
      });
    });

    // describe('elements');

    // describe('events');

    // describe('renderTopWidgets() method');

    // describe('renderTaskPanel() method');

    // describe('render() function');

    // describe('reset() method');
  });
});