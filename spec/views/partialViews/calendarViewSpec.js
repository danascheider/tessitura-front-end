/****************************************************************************
 *                                                                         *
 * DASHBOARD CALENDAR VIEW                                                 *
 *                                                                         *
 * When the user logs into their dashboard, they see a calendar under the  *
 * top widgets and to the right of the task panel. Their calendar will be  *
 * able to be synced with Google calendars.                                *
 *                                                                         *
 * CONTENTS                                                          LINE  *
 * Requires ......................................................... 26   *
 * Suite ............................................................ 41   *
 *   Filters ........................................................ 47   *
 *   Static properties .............................................. 69   *
 *     token                                                               *
 *   Core Functions ................................................. 69   *
 *     initialize()                                                        *
 *   Special Functions .............................................. 91   *
 *     updateAll() .................................................. 92   *
 *     isA() ....................................................... 140   *
 *                                                                         *
/****************************************************************************/

/* Core Requires
/****************************************************************************/

require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var moment         = require('moment'),
    matchers       = _.extend(require('jasmine-jquery-matchers'), require(process.cwd() + '/spec/support/matchers/toBeA.js')),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

var CalendarView   = Tessitura.CalendarView;

/****************************************************************************
 * BEGIN SUITE                                                              *
/****************************************************************************/

describe('dashboard calendar view', function() {
  var view, spy, e;

  /* Filters
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  })

  beforeEach(function() {
    view = new CalendarView();
  });

  afterEach(function() {
    restoreFixtures();
  });

  afterAll(function() {
    view.remove();
    view = null;
    global = _.omit(global, fixtures);
  });

  /* Static Properties
  /**************************************************************************/

  describe('properties', function() {
    it('has klass CalendarView #partialView #view #travis', function() {
      expect(view.klass).toEqual('CalendarView');
    });

    it('has family Tessitura.View #partialView #view #travis', function() {
      expect(view.family).toEqual('Tessitura.View');
    });

    it('has superFamily Backbone.View #partialView #view #travis', function() {
      expect(view.superFamily).toEqual('Backbone.View');
    });
  });

  /* View Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render #partialView #view #travis', function() {
      spyOn(CalendarView.prototype, 'render');
      var newView = new CalendarView();
      expect(CalendarView.prototype.render).not.toHaveBeenCalled();
    });
  });

  /* Elements
  /**************************************************************************/

  describe('view elements', function() {
    beforeEach(function() {
      view.render();
      $('body').html(view.$el);
    });

    it('has ID #calendar #partialView #view #travis', function() {
      expect(view.$el).toHaveId('calendar');
    });

    it('has class .panel #partialView #view #travis', function() {
      expect(view.$el).toHaveClass('panel');
    });

    it('has class .dash-widget #partialView #view #travis', function() {
      expect(view.$el).toHaveClass('dash-widget');
    });

    it('has class .panel-primary #partialView #view #travis', function() {
      expect(view.$el).toHaveClass('panel-primary');
    });
  });

  /* Event Wiring
  /**************************************************************************/

  describe('view events', function() {
    //
  });

  /* Event Callbacks
  /**************************************************************************/

  describe('event callbacks', function() {
    //
  });

  /* Core View Functions
  /**************************************************************************/

  describe('core view functions', function() {
    describe('initialize()', function() {
      //
    });

    describe('render()', function() {
      it('sets the HTML of its el #partialView #view #travis', function() {
        spyOn(view.$el, 'html');
        view.render();
        expect(view.$el.html).toHaveBeenCalled();
      });

      it('returns itself #partialView #view #travis', function() {
        expect(view.render()).toBe(view);
      });
    });
  });

  /* Special Functions
  /**************************************************************************/

  describe('special functions', function() {
    describe('displayDays()', function() {
      var days, today;

      context('simple and easy', function() {
        beforeEach(function() {
          days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
          today = new Date('Tue May 26 2015 11:00:00 GMT-0700 (PDT)');
          jasmine.clock().mockDate(today);
        });

        it('displays the specified days #partialView #view #travis', function() {
          expect(view.displayDays()).toEqual(days);
        });
      });

      context('when today is at the beginning of the week', function() {
        beforeEach(function() {
          days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'];
          today = new Date('Mon Jun 1 2015 11:00:00 GMT-0700 (PDT)');
          jasmine.clock().mockDate(today);
        });

        it('wraps to the end of the last week #partialView #view #travis', function() {
          expect(view.displayDays()).toEqual(days);
        });
      });

      context('when today is at the end of the week')
    });

    describe('isA()', function() {
      it('returns true with argument CalendarView #partialView #view #travis', function() {
        expect(view.isA('CalendarView')).toBe(true);
      });

      it('returns true with argument PartialView #partialView #view #travis', function() {
        expect(view.isA('PartialView')).toBe(true);
      });

      it('returns false with another argument #partialView #view #travis', function() {
        expect(view.isA('Corvette')).toBe(false);
      });
    });
  });
});