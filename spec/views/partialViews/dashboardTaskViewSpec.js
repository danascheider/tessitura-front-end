/* Core Requires
/***************************************************************************/

require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = require('jasmine-jquery-matchers'),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    fcontext       = fdescribe;

/* Dashboard Task View Spec
/****************************************************************************/

describe('Dashboard Task View', function() {
  var view, newView, e, spy;

  /* Filters
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  });

  beforeEach(function() {
    view = new Tessitura.DashboardTaskView({user: user, collection: collection});
  });

  afterEach(function() {
    restoreFixtures();
    view.remove();
    newView && newView.destroy();
  });

  afterAll(function() {
    _.omit(global, fixtures);
    view = null;
  });

  /* Constructor             
  /**************************************************************************/

  describe('constructor', function() {
    it('calls setUser #dashboardTaskView #partialView #view #travis', function() {
      spyOn(Tessitura.DashboardTaskView.prototype, 'setUser');
      newView = new Tessitura.DashboardTaskView({user: user});
      expect(Tessitura.DashboardTaskView.prototype.setUser).toHaveBeenCalled();
      expect(Tessitura.DashboardTaskView.prototype.setUser.calls.argsFor(0)[0]).toEqual(user);
    });

    it('doesn\'t call render #dashboardTaskView #partialView #view #travis', function() {
      spyOn(Tessitura.DashboardTaskView.prototype, 'render');
      newView = new Tessitura.DashboardTaskView({user: user});
      expect(Tessitura.DashboardTaskView.prototype.render).not.toHaveBeenCalled();
    });

    it('can be instantiated without a user #dashboardTaskView #partialView #view #travis', function() {
      newView = new Tessitura.DashboardTaskView();
      expect(newView.user).not.toExist();
    });
  });

  /* View Elements
  /**************************************************************************************/

  describe('elements', function() {
    beforeEach(function() {
      spyOn(user.tasks, 'fetch').and.returnValue(user.tasks);
      view.render();
    });

    it('#view #travis is a div', function() {
      expect(view.$el[0].tagName).toEqual('DIV');
    });

    it('#view #travis has ID #page-wrapper', function() {
      expect(view.$el).toHaveId('page-wrapper');
    });
  });

  /* Core View Functions
  /**************************************************************************************/

  describe('core view functions', function() {
    describe('remove', function() {
      _.each(['newColumnView', 'inProgressColumnView', 'blockingColumnView', 'backlogColumnView'], function(column) {
        it('removes its ' + column + '#dashboardTaskView #partialView #view #travis', function(done) {
          pending('Iron out some other aspects of the app and hope this works after that');
          view.render();
          done();
          setTimeout(function() {spyOn(view[column], 'remove');
            view.remove();
            expect(view[column].remove).toHaveBeenCalled();
          }, 50);
        });
      });

      it('removes itself using the Backbone.View.prototype #dashboardTaskView #partialView #view #travis', function() {
        spyOn(Backbone.View.prototype.remove, 'call');
        view.remove();
        expect(Backbone.View.prototype.remove.call).toHaveBeenCalledWith(view);
      });
    });

    describe('render', function() {
      it('fetches the task collection #dashboardTaskView #partialView #view #travis', function() {
        spyOn(user.tasks, 'fetch');
        view.render();
        expect(user.tasks.fetch).toHaveBeenCalled();
      });

      _.each(['newColumnView', 'inProgressColumnView', 'blockingColumnView', 'backlogColumnView'], function(column) {
        it('creates the ' + column + '#dashboardTaskView #partialView #view #travis', function() {
          spyOn(Tessitura.TaskModel.prototype, 'displayTitle').and.returnValue('foobar')
          spyOn($, 'ajax').and.callFake(function(args) {
            args.success(user.tasks);
          });

          view.render();
          expect(view[column]).toExist();
        });
      });
    });
  });

  /* Special Functions
  /**************************************************************************/

  describe('special functions', function() {
    describe('setUser()', function() {
      it('sets the user #dashboardTaskView #partialView #view #travis', function() {
        newView = new Tessitura.DashboardTaskView();
        newView.setUser(user);
        expect(newView.user).toBe(user);
      });
    });
  });
});