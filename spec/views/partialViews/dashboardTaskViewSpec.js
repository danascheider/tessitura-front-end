/* Core Requires
/***************************************************************************/

/* istanbul ignore require */
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

/* istanbul ignore next */
var matchers       = require('jasmine-jquery-matchers'),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

/* Dashboard Task View Spec
/****************************************************************************/

/* istanbul ignore next */
describe('Dashboard Task View', function() {
  var view, newView, newTask, e, spy;

  /* Filters
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  });

  beforeEach(function() {
    view = new Tessitura.DashboardTaskView({user: user, collection: collection});
    spyOn($, 'ajax').and.callFake(function(args) { args.success(collection); });
    spyOn(Tessitura.TaskModel.prototype, 'displayTitle').and.returnValue('foobar')
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

  /* Events 
  /**************************************************************************************/

  describe('event wiring', function() {
    describe('add task to collection', function() {
      it('calls allocate() #dashboardTaskView #partialView #view #travis', function() {
        spyOn(Tessitura.DashboardTaskView.prototype, 'allocate');
        newView = new Tessitura.DashboardTaskView({user: user});
        newView.render();
        newTask = new Tessitura.TaskModel({title: 'Foobar'});
        newView.collection.add(newTask);
        expect(Tessitura.DashboardTaskView.prototype.allocate).toHaveBeenCalled();
      });
    });

    describe('change task status', function() {
      it('calls changeStatus() #dashboardTaskView #partialView #view #travis', function() {
        spyOn(Tessitura.DashboardTaskView.prototype, 'changeStatus');
        newView = new Tessitura.DashboardTaskView({user: user});
        newView.render();
        newView.collection.trigger('change:status', task1);
        expect(Tessitura.DashboardTaskView.prototype.changeStatus).toHaveBeenCalled();
      });
    });

    describe('showEditForm on kanban column', function() {
      it('calls showEditForm() #dashboardTaskView #partialView #view #travis', function() {
        spyOn(Tessitura.DashboardTaskView.prototype, 'showEditForm');
        newView = new Tessitura.DashboardTaskView({user: user, collection: collection});
        newView.render();
        newView.newColumnView.showEditForm(task1);
        expect(Tessitura.DashboardTaskView.prototype.showEditForm).toHaveBeenCalled();
      });
    });
  });

  /* Event Callbacks
  /**************************************************************************************/

  describe('event callbacks', function() {
    describe('allocate()', function() {
      beforeEach(function() {
        newTask = new Tessitura.TaskModel({title: 'Foobar', status: 'In Progress'});
        view.render();
        spyOn(view, 'findNewView').and.returnValue(view.inProgressColumnView);
        view.allocate(newTask);
      });

      it('calls findNewView #dashboardTaskView #partialView #view #travis', function() {
        expect(view.findNewView).toHaveBeenCalled();
      });

      it('adds the task to the new view\'s models #dashboardTaskView #partialView #view #travis', function() {
        expect(view.inProgressColumnView.collection.models.indexOf(newTask)).toBeGreaterThan(-1);
      });

      it('renders the view #dashboardTaskView #partialView #view #travis', function() {
        pending('FUFNR');
        expect(view.render).toHaveBeenCalled();
      });
    });

    describe('changeStatus()', function() {
      beforeEach(function() {
        task1.set({status: 'Blocking'}, {silent: true});
        spyOn(task1, 'get').and.callThrough();
        view.render();
        view.changeStatus(task1);
      });

      it('checks the task status #dashboardTaskView #partialView #view #travis', function() {
        expect(task1.get).toHaveBeenCalledWith('status');
      });


      it('adds the task to the new view\'s collection #dashboardTaskView #partialView #view #travis', function() {
        pending('Raises a call stack size error, not sure why');
        expect(view.blockingColumnView.collection.models.indexOf(task1)).not.toEqual(-1);
      });
    });

    describe('findNewView()', function() {
      beforeEach(function(done) {
        view.render();
        done();
      });

      it('checks the task\'s status #dashboardTaskView #partialView #view #travis', function() {
        spyOn(task1, 'get');
        view.findNewView(task1);
        expect(task1.get).toHaveBeenCalledWith('status');
      });

      it('checks the task\'s backlog status #dashboardTaskView #partialView #view #travis', function() {
        spyOn(task1, 'get');
        view.findNewView(task1);
        expect(task1.get).toHaveBeenCalledWith('backlog');
      });

      context('task is backlogged', function() {
        it('returns the backlog column #dashboardTaskView #partialView #view #travis', function() {
          expect(view.findNewView(task4)).toEqual(view.backlogColumnView);
        });
      });

      context('task has status \'New\'', function() {
        it('returns the new column #dashboardTaskView #partialView #view #travis', function() {
          expect(view.findNewView(task1)).toBe(view.newColumnView);
        });
      })
    });

    describe('showEditForm()', function() {
      it('triggers the showEditForm event #dashboardTaskView #partialView #view #travis', function() {
        var spy = jasmine.createSpy();
        view.on('showEditForm', spy);
        view.showEditForm(task1);
        expect(spy).toHaveBeenCalledWith(task1);
      });
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