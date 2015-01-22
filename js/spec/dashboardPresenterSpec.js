define([
  'backbone',
  'models/dashboard-presenter',
  'api',
  'models/user',
  'models/task',
  'views/app/dashboard',
  'views/app/dashboard-home',
  'views/app/kanban-board',
  'cookie'
], function(Backbone, DashboardPresenter, API, User, Task, MainView, HomeView, TaskView) {
  
  describe('DashboardPresenter', function() {

    // Create user to be passed to the DashboardPresenter constructor
    // and declare `presenter` variable to be defined in `before` blocks

    var user = new User({username: 'testuser', password: 'testuser', email: 'testuser@example.com'}), presenter;

    describe('constructor', function() {
      beforeEach(function() {
        presenter = new DashboardPresenter({user: user});
      });

      it('is instantiated with a user', function() {
        presenter.user.should.equal(user);
      });

      it('creates a main dashboard view', function() {
        (typeof presenter.mainView).should.not.equal('undefined');
      });
    });

    describe('event handling', function() {

      // Store a reference to DashboardPresenter's `initialize` so it
      // can be configured to include Sinon spy code for the tests and 
      // then changed back.

      var init = DashboardPresenter.prototype.initialize;

      beforeEach(function() {

        // Monkey patch the DashboardPresenter's `initialize` function
        // allowing Sinon to spy on the 'refresh' function

        DashboardPresenter.prototype.initialize = function() {
          sinon.spy(this, 'refresh');
          init.apply(this, arguments);
        };

        presenter = new DashboardPresenter({user: user});
      });

      afterEach(function() {
        DashboardPresenter.prototype.initialize = function() {
          init.apply(this, arguments);
        };
      });

      it('listens to its user', function() {
        (typeof presenter._listeningTo[user._listenId]).should.not.equal('undefined');
      });

      it('refreshes on its user\'s \'sync\' event', function() {
        user.trigger('sync');
        presenter.refresh.called.should.be.true;
      });
    });
  });
});