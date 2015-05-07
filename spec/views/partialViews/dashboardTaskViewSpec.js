/***************************************************************************
 *                                                                         *
 * DASHBOARD TASK VIEW                                                     *
 *                                                                         *
 * The dashboard task view is the page that shows detailed information     *
 * about the user's tasks. Currently, it takes the form of a Kanban        *
 * board, but I'm considering other possibilities as well.                 *
 *                                                                         *
 * CONTENTS                                                          LINE  *
 * Requires ......................................................... 43   *
 * Suite ............................................................ 58   *
 *   Filters ........................................................ 22   *
 *   Properties ..................................................... 86   *
 *     klass ........................................................ 87   *
 *     family ....................................................... 91   *
 *     superFamily .................................................. 95   *
 *   Constructor ................................................... 103   *
 *     doesn't call render() ........................................104   *
 *     calls setUser() ............................................. 111   *
 *     can be instantiated without a user .......................... 117   *
 *   View Elements.................................................. 126   *
 *     is a div .................................................... 132   *
 *     has ID #page-wrapper ........................................ 136   *
 *   Core View Functions ........................................... 144   *
 *     remove() .................................................... 145   *
 *       removes its child views ................................... 146   *
 *       removes itself using the Backbone.View.prototype .......... 155   *
 *     render() .................................................... 162   *
 *       fetches the task collection ............................... 163   *
 *       creates child views ....................................... 169   *
 *   Special Functions ............................................. 182   *
 *     isA() ....................................................... 183   *
 *       returns true with argument DashboardTaskView .............. 184   *
 *       returns false with another argument ....................... 188   *
 *     setUser() ................................................... 193   *
 *       sets this.user ............................................ 194   *
 *                                                                         *
/***************************************************************************/

/* Core Requires
/***************************************************************************/

require(process.cwd() + '/js/canto.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = require('jasmine-jquery-matchers'),
    fcontext       = fdescribe;

/****************************************************************************
 * BEGIN SUITE                                                              *
/****************************************************************************/

describe('Dashboard Task View', function() {
  var view, newView, e, spy;

  /* Filters
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
  });

  beforeEach(function() {
    user = new Canto.UserModel({id: 1, username: 'testuser', password: 'testuser', email: 'testuser@example.com', first_name: 'Test', last_name: 'User'});

    // Require the task model and create 3 tasks
    task1 = new Canto.TaskModel({id: 1, owner_id: 1, title: 'Task 1', status: 'New', priority: 'Low', position: 1});
    task2 = new Canto.TaskModel({id: 2, owner_id: 1, title: 'Task 2', status: 'New', priority: 'Normal', position: 2});
    task3 = new Canto.TaskModel({id: 3, owner_id: 1, title: 'Task 3', status: 'Complete', priority: 'Normal', position: 3});

    collection = user.tasks;

    view = new Canto.DashboardTaskView({user: user});
  });

  afterEach(function() {
    _.each([view, user, task1, task2, task3, collection], function(obj) { obj.destroy(); });
    newView && newView.destroy();
  });

  afterAll(function() {
    view = null;
  });

  /* Static Properties
  /**************************************************************************/

  describe('properties', function() {
    it('#view #travis has klass DashboardTaskView', function() {
      expect(view.klass).toEqual('DashboardTaskView');
    });

    it('#view #travis has family Canto.View', function() {
      expect(view.family).toEqual('Canto.View');
    });

    it('#view #travis has superFamily Backbone.View', function() {
      expect(view.superFamily).toEqual('Backbone.View');
    });
  });

  /* Constructor             
  /**************************************************************************/

  describe('constructor', function() {
    it('#view #travis calls setUser', function() {
      spyOn(Canto.DashboardTaskView.prototype, 'setUser');
      newView = new Canto.DashboardTaskView({user: user});
      expect(Canto.DashboardTaskView.prototype.setUser).toHaveBeenCalled();
      expect(Canto.DashboardTaskView.prototype.setUser.calls.argsFor(0)[0]).toEqual(user);
    });

    it('#view #travis doesn\'t call render', function() {
      spyOn(Canto.DashboardTaskView.prototype, 'render');
      newView = new Canto.DashboardTaskView({user: user});
      expect(Canto.DashboardTaskView.prototype.render).not.toHaveBeenCalled();
    });

    it('#view #travis can be instantiated without a user', function() {
      newView = new Canto.DashboardTaskView();
      expect(newView.user).not.toExist();
    });
  });

  /* View Elements
  /**************************************************************************/

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
  /**************************************************************************/

  describe('core view functions', function() {
    describe('remove', function() {
      _.each(['newColumnView', 'inProgressColumnView', 'blockingColumnView', 'backlogColumnView'], function(column) {
        it('#view #travis removes its ' + column, function(done) {
          pending('Iron out some other aspects of the app and hope this works after that');
          view.render();
          done();
          setTimeout(function() {spyOn(view[column], 'remove');
            view.remove();
            expect(view[column].remove).toHaveBeenCalled();
          }, 50);
        });
      });

      it('#view #travis removes itself using the Backbone.View.prototype', function() {
        spyOn(Backbone.View.prototype.remove, 'call');
        view.remove();
        expect(Backbone.View.prototype.remove.call).toHaveBeenCalledWith(view);
      });
    });

    describe('render', function() {
      it('#view #travis fetches the task collection', function() {
        spyOn(user.tasks, 'fetch');
        view.render();
        expect(user.tasks.fetch).toHaveBeenCalled();
      });

      _.each(['newColumnView', 'inProgressColumnView', 'blockingColumnView', 'backlogColumnView'], function(column) {
        it('#view #travis creates the ' + column, function() {
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
    describe('isA()', function() {
      it('#view #travis returns true with argument DashboardTaskView', function() {
        expect(view.isA('DashboardTaskView')).toBe(true);
      });

      it('#view #travis returns false with another argument', function() {
        expect(view.isA('Corvette')).toBe(false);
      });
    });

    describe('setUser()', function() {
      it('#view #travis sets the user', function() {
        newView = new Canto.DashboardTaskView();
        newView.setUser(user);
        expect(newView.user).toBe(user);
      });
    });
  });
});