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

require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = _.extend(require('jasmine-jquery-matchers'), require(process.cwd() + '/spec/support/matchers/toBeA.js')),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

var SUT = require(process.cwd() + '/js/views/partialViews/dashboardTaskView.js');

/****************************************************************************
 * BEGIN SUITE                                                              *
/****************************************************************************/

describe('Dashboard Task View #travis', function() {
  var view, e, spy;

  /* Filters
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  });

  beforeEach(function() {
    view = new SUT({user: user});
  });

  afterEach(function() {
    fixtures.restoreFixtures();
  });

  afterAll(function() {
    view.remove();
    dashboard = null;
    global = _.omit(global, fixtures);
  });

  /* Static Properties
  /**************************************************************************/

  describe('properties', function() {
    it('has klass DashboardTaskView', function() {
      expect(view.klass).toEqual('DashboardTaskView');
    });

    it('has family Canto.View', function() {
      expect(view.family).toEqual('Canto.View');
    });

    it('has superFamily Backbone.View', function() {
      expect(view.superFamily).toEqual('Backbone.View');
    });
  });

  /* Constructor             
  /**************************************************************************/

  describe('constructor', function() {
    it('calls setUser', function() {
      spyOn(SUT.prototype, 'setUser');
      var newView = new SUT({user: user});
      expect(SUT.prototype.setUser).toHaveBeenCalled();
      expect(SUT.prototype.setUser.calls.argsFor(0)[0]).toEqual(user);
    });

    it('doesn\'t call render', function() {
      spyOn(SUT.prototype, 'render');
      var newView = new SUT({user: user});
      expect(SUT.prototype.render).not.toHaveBeenCalled();
    });

    it('can be instantiated without a user', function() {
      var newView = new SUT();
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

    it('is a div', function() {
      expect(view.$el[0].tagName).toEqual('DIV');
    });

    it('has ID #page-wrapper', function() {
      expect(view.$el).toHaveId('page-wrapper');
    });
  });

  /* Core View Functions
  /**************************************************************************/

  describe('core view functions', function() {
    describe('remove', function() {
      _.each(['newColumnView', 'inProgressColumnView', 'blockingColumnView', 'backlogColumnView'], function(column) {
        it('removes its ' + column, function(done) {
          pending('Iron out some other aspects of the app and hope this works after that');
          view.render();
          done();
          setTimeout(function() {spyOn(view[column], 'remove');
            view.remove();
            expect(view[column].remove).toHaveBeenCalled();
          }, 50);
        });
      });

      it('removes itself using the Backbone.View.prototype', function() {
        spyOn(Backbone.View.prototype.remove, 'call');
        view.remove();
        expect(Backbone.View.prototype.remove.call).toHaveBeenCalledWith(view);
      });
    });

    describe('render', function() {
      it('fetches the task collection', function() {
        spyOn(user.tasks, 'fetch');
        view.render();
        expect(user.tasks.fetch).toHaveBeenCalled();
      });

      _.each(['newColumnView', 'inProgressColumnView', 'blockingColumnView', 'backlogColumnView'], function(column) {
        it('creates the ' + column, function() {
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
      it('returns true with argument DashboardTaskView', function() {
        expect(view.isA('DashboardTaskView')).toBe(true);
      });

      it('returns false with another argument', function() {
        expect(view.isA('Corvette')).toBe(false);
      });
    });

    describe('setUser()', function() {
      it('sets the user', function() {
        var newView = new SUT();
        newView.setUser(user);
        expect(newView.user).toBe(user);
      });
    });
  });
});