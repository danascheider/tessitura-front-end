require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');
require(process.cwd() + '/js/tessitura.js');

var matchers = require('jasmine-jquery-matchers'),
    fixtures = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context  = describe,
    ccontext = ddescribe;

describe('Dashboard Presenter', function() {
  var presenter, spy;

  /* Filters
  /***************************************************************************************/

  beforeEach(function() {
    this.addMatchers(matchers);
    _.extend(global, fixtures);
    presenter = new Tessitura.DashboardPresenter({user: user});
  });

  afterEach(function() {
    restoreFixtures();
    presenter.destroy();
    _.omit(global, fixtures);
  });

  /* Tessitura Model Properties
  /***************************************************************************************/

  describe('Tessitura model properties', function() {
    it('has klass DashboardPresenter #presenter #travis', function() {
      expect(presenter.klass).toBe('DashboardPresenter');
    });

    it('has family Tessitura.Model #presenter #travis', function() {
      expect(presenter.family).toBe('Tessitura.Model');
    });

    it('has superFamily Backbone.Model #presenter #travis', function() {
      expect(presenter.superFamily).toBe('Backbone.Model');
    });
  });

  /* Presenter Constructor
  /***************************************************************************************/

  describe('constructor', function() {
    beforeEach(function() {
      spyOn($, 'ajax').andCallFake(function(args) {
        args.success(user.toJSON());
      });
    });

    afterEach(function() { newPresenter.destroy(); });

    it('can be instantiated without a user #presenter #travis', function() {
      newPresenter = new Tessitura.DashboardPresenter();
      expect(typeof newPresenter.user).toBe('undefined');
    });

    it('creates a dashboard view #presenter #travis', function() {
      expect(presenter.dashboardView).toExist();
    });

    it('creates a dashboard home view #presenter #travis', function() {
      expect(presenter.dashboardHomeView).toExist();
    });

    it('creates a dashboard task view #presenter #travis', function() {
      expect(presenter.dashboardTaskView).toExist();
    });

    it('creates a dashboard profile view #presenter #travis', function() {
      expect(presenter.dashboardProfileView).toExist();
    });

    it('creates a dashboard local view #presenter #travis', function() {
      expect(presenter.dashboardLocalView).toExist();
    });

    it('calls setUser #presenter #travis', function() {
      spyOn(Tessitura.DashboardPresenter.prototype, 'setUser');
      newPresenter = new Tessitura.DashboardPresenter({user: user});
      expect(Tessitura.DashboardPresenter.prototype.setUser).toHaveBeenCalledWith(user);
    });
  });

  /* Presenter Events
  /***************************************************************************************/

  describe('events', function() {
    beforeEach(function() {
      spy = jasmine.createSpy();
      presenter.on('redirect', spy);
      spyOn(Tessitura.DashboardPresenter.prototype, 'hideShade');
      spyOn(Tessitura.DashboardPresenter.prototype, 'showTaskEditForm').andCallThrough();
      spyOn(Tessitura.DashboardPresenter.prototype, 'showTaskCreateForm').andCallThrough();
    });

    afterEach(function() { presenter.off('redirect'); });

    describe('redirect:dashboard on the dashboard view', function() {
      it('emits the redirect:dashboard event #presenter #travis', function() {
        presenter.dashboardView.trigger('redirect', {destination: 'dashboard'});
        expect(spy).toHaveBeenCalledWith({destination: 'dashboard'});
      });
    });

    describe('redirect:tasks on the dashboard view', function() {
      it('emits the redirect:tasks event #presenter #travis', function() {
        presenter.dashboardView.trigger('redirect', {destination: 'tasks'});
        expect(spy).toHaveBeenCalledWith({destination: 'tasks'});
      });
    });

    describe('redirect:profile on the dashboard view', function() {
      it('emits the redirect:profile event #presenter #travis', function() {
        presenter.dashboardView.trigger('redirect', {destination: 'profile'});
        expect(spy).toHaveBeenCalledWith({destination: 'profile'});
      });
    });

    describe('redirect:local on the dashboard view', function() {
      it('emits the redirect:local event #presenter #travis', function() {
        presenter.dashboardView.trigger('redirect', {destination: 'local'});
        expect(spy).toHaveBeenCalledWith({destination: 'local'});
      });
    });

    describe('hideShade on the dashboard view', function() {
      it('calls hideShade() #presenter #travis', function() {
        newPresenter = new Tessitura.DashboardPresenter({user: user});
        newPresenter.dashboardView.hideShade($.Event('dblclick'));
        expect(Tessitura.DashboardPresenter.prototype.hideShade).toHaveBeenCalled();
      });
    });

    describe('hideShade on the editForm view', function() {
      it('calls hideShade() #presenter #travis', function() {
        newPresenter = new Tessitura.DashboardPresenter({user: user});
        newPresenter.getHome();
        newPresenter.showTaskEditForm(task1);
        newPresenter.editForm.trigger('hideShade');
        expect(Tessitura.DashboardPresenter.prototype.hideShade).toHaveBeenCalled();
      });
    });

    describe('showTaskCreateForm on the dashboard task view', function() {
      xit('calls showTaskCreateForm() #presenter #travis', function() {
        // FUFNR
        newPresenter = new Tessitura.DashboardPresenter({user: user});
        newPresenter.dashboardHomeView.showEditForm(collection);
        expect(Tessitura.DashboardPresenter.prototype.showTaskCreateForm).toHaveBeenCalledWith(collection);
      });
    });

    describe('showTaskCreateForm on the dashboard home view', function() {
      xit('calls showTaskCreateForm() #presenter #travis', function() {
        // FUFNR
        newPresenter = new Tessitura.DashboardPresenter({user: user});
        newPresenter.dashboardTaskView.showEditForm(collection);
        expect(Tessitura.DashboardPresenter.prototype.showTaskCreateForm).toHaveBeenCalledWith(collection);
      });
    });

    describe('showEditForm on the dashboard task view', function() {
      xit('calls showTaskEditForm() #presenter #travis', function() {
        // FUFNR
        newPresenter = new Tessitura.DashboardPresenter({user: user});
        newPresenter.dashboardHomeView.showEditForm(task1);
        expect(Tessitura.DashboardPresenter.prototype.showTaskEditForm).toHaveBeenCalledWith(task1);
      });
    });

    describe('showEditForm on the dashboard home view', function() {
      it('calls showTaskEditForm() #presenter #travis', function() {
        newPresenter = new Tessitura.DashboardPresenter({user: user});
        newPresenter.dashboardHomeView.showEditForm(task1);
        expect(Tessitura.DashboardPresenter.prototype.showTaskEditForm).toHaveBeenCalledWith(task1);
      });
    });
  });

  /* Event Callbacks
  /***************************************************************************************/

  describe('event callbacks', function() {
    describe('getHome()', function() {
      context('general', function() {
        beforeEach(function() {
          presenter.setUser(user);
          presenter.getHome();
        });

        it('sets the \'current\' property to the home view #presenter #travis', function() {
          expect(presenter.current).toBe(presenter.dashboardHomeView);
        });
      });

      context('when the dashboard view is not already visible', function() {
        beforeEach(function(done) {
          presenter.dashboardProfileView.setUser(user);
          presenter.dashboardTaskView.setUser(user);
          spyOn(presenter.dashboardView.$el, 'is').andReturn(false);
          spyOn(presenter.dashboardView, 'render');
          presenter.getHome();
          done();
        });

        it('renders the dashboard view #presenter #travis', function() {
          expect(presenter.dashboardView.render).toHaveBeenCalled();
        });

        it('attaches the dashboard view to the DOM #presenter #travis', function() {
          expect(presenter.dashboardView.$el).toBeInDom();
        });
      });
    });

    describe('getTask()', function() {
      context('general', function() {
        beforeEach(function(done) {
          presenter.dashboardTaskView.setUser(user);
          presenter.getTask();
          done();
        });

        it('sets the \'current\' property to the task view #presenter #travis', function() {
          expect(presenter.current).toBe(presenter.dashboardTaskView);
        });
      });

      context('when the dashboard view is not already visible', function() {
        beforeEach(function(done) {
          spyOn(presenter.dashboardView.$el, 'is').andReturn(false);
          spyOn(presenter.dashboardView, 'render');
          presenter.dashboardTaskView.setUser(user);
          presenter.getTask();
          done();
        });

        it('renders the dashboard #presenter #travis', function() {
          expect(presenter.dashboardView.render).toHaveBeenCalled();
        });

        it('attaches the dashboard view to the DOM #presenter #travis', function() {
          expect(presenter.dashboardView.$el).toBeInDom();
        });
      });
    });

    describe('getProfile()', function() {
      context('general', function() {
        beforeEach(function(done) {
          presenter.dashboardProfileView.setUser(user);
          presenter.getProfile();
          done();
        });

        it('sets the \'current\' property to the profile view #presenter #travis', function() {
          expect(presenter.current).toBe(presenter.dashboardProfileView);
        });
      });

      context('when the profile view is not already visible', function() {
        beforeEach(function(done) {
          spyOn($, 'ajax').andCallFake(function(args) {
            args.success();
          });

          presenter.dashboardView.setUser(user);
          presenter.dashboardProfileView.setUser(user);
          spyOn(presenter.dashboardView.$el, 'is').andReturn(false);
          spyOn(presenter.dashboardView, 'render').andCallThrough();
          presenter.getProfile();
          done();
        });

        it('renders the dashboard #presenter #travis', function() {
          expect(presenter.dashboardView.render).toHaveBeenCalled();
        });

        it('attaches the dashboard view to the DOM #presenter #travis', function() {
          expect(presenter.dashboardView.$el).toBeInDom();
        });
      });
    });

    describe('getLocal()', function() {
      context('general', function() {
        beforeEach(function(done) {
          presenter.dashboardLocalView.setUser(user);
          presenter.getLocal();
          done();
        });

        it('sets the \'current\' property to the local view #presenter #travis', function() {
          expect(presenter.current).toBe(presenter.dashboardLocalView);
        });
      });

      context('when the local view is not already visible', function() {
        beforeEach(function(done) {
          spyOn($, 'ajax').andCallFake(function(args) {
            args.success(user);
          });

          presenter.dashboardView.setUser(user);
          presenter.dashboardLocalView.setUser(user);
          spyOn(presenter.dashboardView.$el, 'is').andReturn(false);
          spyOn(presenter.dashboardView, 'render').andCallThrough();
          presenter.getLocal();
          done();
        });

        it('renders the dashboard #presenter #travis', function() {
          expect(presenter.dashboardView.render).toHaveBeenCalled();
        });

        it('attaches the local view to the DOM #presenter #travis', function() {
          expect(presenter.dashboardView.$el).toBeInDom();
        });
      });
    });

    describe('emitRedirect()', function() {
      beforeEach(function() {
        spy = jasmine.createSpy();
        presenter.on('redirect', spy);
      });

      afterEach(function() { presenter.off('redirect'); });

      it('emits the redirect:dashboard event #presenter #travis', function() {
        presenter.emitRedirect({destination: 'dashboard'});
        expect(spy).toHaveBeenCalledWith({destination: 'dashboard'});
      });

      it('emits the redirect:tasks event #presenter #travis', function() {
        presenter.emitRedirect({destination: 'tasks'});
        expect(spy).toHaveBeenCalledWith({destination: 'tasks'});
      });

      it('emits the redirect:profile event #presenter #travis', function() {
        presenter.emitRedirect({destination: 'profile'});
        expect(spy).toHaveBeenCalledWith({destination: 'profile'});
      });

      it('emits the redirect:local event #presenter #travis', function() {
        presenter.emitRedirect({destination: 'local'});
        expect(spy).toHaveBeenCalledWith({destination: 'local'});
      });
    });

    describe('hideShade()', function() {
      beforeEach(function() {
        presenter.getHome();
        presenter.showTaskEditForm(task1);
      });

      it('removes the edit form #presenter #travis', function() {
        spyOn(presenter.editForm, 'remove');
        presenter.hideShade();
        expect(presenter.editForm.remove).toHaveBeenCalled();
      });

      it('hides the #shade element #presenter #travis', function() {
        presenter.hideShade();
        expect(presenter.dashboardView.$('#shade:visible').length).toBe(0);
      });

      it('doesn\'t call remove on a nonexistent edit form #presenter #travis', function() {
        newPresenter = new Tessitura.DashboardPresenter({user: user});
        spyOn(Tessitura.TaskEditFormView.prototype, 'remove');
        newPresenter.hideShade();
        expect(Tessitura.TaskEditFormView.prototype.remove).not.toHaveBeenCalled();
      });
    });

    describe('removeAll()', function() {
      it('removes the dashboard view #presenter #travis', function() {
        spyOn(presenter.dashboardView, 'remove');
        presenter.removeAll();
        expect(presenter.dashboardView.remove).toHaveBeenCalled();
      });
    });

    describe('showTaskCreateForm()', function() {
      it('shows the #shade element #presenter #travis', function() {
        presenter.showTaskCreateForm(collection);
        expect($('#shade')).toBeInDom();
      });

      it('sets this.taskCreateForm #presenter #travis', function() {
        presenter.showTaskCreateForm(collection);
        expect(presenter.taskCreateForm.isA('Tessitura.View')).toBe(true);
      });

      it('sets the collection on the create form #presenter #travis', function() {
        presenter.showTaskCreateForm(collection);
        expect(presenter.taskCreateForm.collection).toBe(collection);
      });

      it('renders the create form #presenter #travis', function() {
        spyOn(Tessitura.TaskCreateFormView.prototype, 'render');
        presenter.showTaskCreateForm(collection);
        expect(Tessitura.TaskCreateFormView.prototype.render).toHaveBeenCalled();
      });

      xit('attaches the create form to the DOM #presenter #travis', function() {
        // FUFNR
        presenter.showTaskCreateForm(collection);
        expect(presenter.taskCreateForm.$el).toBeInDom();
      });
    });

    describe('showTaskEditForm()', function() {
      beforeEach(function() {
        presenter.showDash();
      });

      it('shows the #shade element #presenter #travis', function() {
        presenter.showTaskEditForm(task1);
        expect($('#shade')).toBeInDom();
      });

      it('sets this.editForm #presenter #travis', function() {
        presenter.showTaskEditForm(task1);
        expect(presenter.editForm.isA('Tessitura.View')).toBe(true);
      });

      it('sets the model on the edit form #presenter #travis', function() {
        presenter.showTaskEditForm(task1);
        expect(presenter.editForm.model).toEqual(task1);
      });

      it('renders the edit form #presenter #travis', function() {
        spyOn(Tessitura.TaskEditFormView.prototype, 'render');
        presenter.showTaskEditForm(task1);
        expect(Tessitura.TaskEditFormView.prototype.render).toHaveBeenCalled();
      });

      xit('attaches the edit form view to the DOM #presenter #travis', function() {
        // FUFNR;
        presenter.showTaskEditForm(task1);
        expect(presenter.editForm.$el).toBeInDom();
      });
    });
  });

  /* Special Functions
  /***************************************************************************************/

  describe('special functions', function() {
    describe('isA()', function() {
      it('returns true with argument `Presenter` #presenter #travis', function() {
        expect(presenter.isA('Presenter')).toBe(true);
      });

      it('returns true with argument \'DashboardPresenter\' #presenter #travis', function() {
        expect(presenter.isA('DashboardPresenter')).toBe(true);
      });

      it('returns false with another argument #presenter #travis', function() {
        expect(presenter.isA('Backbone.Router')).toBe(false);
      });
    });

    describe('setUser()', function() {      
      beforeEach(function() {
        spyOn($, 'ajax').andCallFake(function(args) {
          args.success(user.toJSON());
        });

        newPresenter = new Tessitura.DashboardPresenter();
        spyOn(newPresenter.dashboardView, 'setUser');
      });

      afterEach(function() { newPresenter.destroy(); });
      context('when the "new" user has the same ID as the "old" user', function() {
        it('doesn\'t change the user #presenter #travis', function() {
          newPresenter.user = user
          var newUser = new Tessitura.UserModel({id: user.get('id'), username: user.get('username'), password: user.get('password')});
          newPresenter.setUser(newUser);
          expect(newPresenter.user).toBe(user);
          newUser.destroy();
        });
      });

      context('new user', function() {
        it('sets the user #presenter #travis', function() {
          newPresenter.setUser(user);
          expect(newPresenter.user.isA('UserModel')).toBe(true);
        });

        it('calls setUser on the dashboard #presenter #travis', function() {
          newPresenter.setUser(user);
          expect(newPresenter.dashboardView.setUser).toHaveBeenCalledWith(user);
        });
      });
    });

    describe('showDash()', function() {
      context('when the dash view is not in the DOM', function() {
        beforeEach(function() { 
          spyOn(presenter.dashboardView.$el, 'is').andReturn(false); 
          spyOn(presenter.dashboardView, 'render').andReturn(presenter.dashboardView);
        });

        it('calls render on the dashboard view #presenter #travis', function() {
          presenter.showDash();
          expect(presenter.dashboardView.render).toHaveBeenCalled();
        });

        it('sets the HTML of the body element #presenter #travis', function() {
          presenter.showDash();
          expect($('body').html()).toContain(presenter.dashboardView.$el.html());
        });
      });

      context('when the dash view is in the DOM already', function() {
        beforeEach(function() { spyOn(presenter.dashboardView.$el, 'is').andReturn(true); });

        it('doesn\'t call render #presenter #travis', function() {
          spyOn(presenter.dashboardView, 'render');
          presenter.showDash();
          expect(presenter.dashboardView.render).not.toHaveBeenCalled();
        });

        it('doesn\'t attach anything to the DOM #presenter #travis', function() {
          spyOn($.prototype, 'html');
          presenter.showDash();
          expect($.prototype.html).not.toHaveBeenCalled();
        });
      });
    });
  });
});