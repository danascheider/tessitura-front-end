/* Core Requires
/****************************************************************************/

require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var moment         = require('moment'),
    matchers       = _.extend(require('jasmine-jquery-matchers'), require(process.cwd() + '/spec/support/matchers/toBeA.js')),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

var CalendarView   = Tessitura.CalendarView;

/* Calendar View Spec
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
    it('has klass CalendarView #calendarView #partialView #view #travis', function() {
      expect(view.klass).toEqual('CalendarView');
    });

    it('has family Tessitura.View #calendarView #partialView #view #travis', function() {
      expect(view.family).toEqual('Tessitura.View');
    });

    it('has superFamily Backbone.View #calendarView #partialView #view #travis', function() {
      expect(view.superFamily).toEqual('Backbone.View');
    });
  });

  /* View Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render #calendarView #partialView #view #travis', function() {
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

    it('has ID #calendar #calendarView #partialView #view #travis', function() {
      expect(view.$el).toHaveId('calendar');
    });

    it('has class .panel #calendarView #partialView #view #travis', function() {
      expect(view.$el).toHaveClass('panel');
    });

    it('has class .dash-widget #calendarView #partialView #view #travis', function() {
      expect(view.$el).toHaveClass('dash-widget');
    });

    it('has class .panel-primary #calendarView #partialView #view #travis', function() {
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
      it('sets the HTML of its el #calendarView #partialView #view #travis', function() {
        spyOn(view.$el, 'html');
        view.render();
        expect(view.$el.html).toHaveBeenCalled();
      });

      it('returns itself #calendarView #partialView #view #travis', function() {
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
          days = ['Monday', 'Tuesday', 'Wednesday'];
          today = new Date('Tue May 26 2015 11:00:00 GMT-0700 (PDT)');
          jasmine.clock().mockDate(today);
        });

        it('displays the specified days #calendarView #partialView #view #travis', function() {
          expect(view.displayDays()).toEqual(days);
        });
      });

      context('when today is at the beginning of the week', function() {
        beforeEach(function() {
          days = ['Saturday', 'Sunday', 'Monday'];
          today = new Date('Sun May 31 2015 11:00:00 GMT-0700 (PDT)');
          jasmine.clock().mockDate(today);
        });

        it('wraps to the end of the last week #calendarView #partialView #view #travis', function() {
          expect(view.displayDays()).toEqual(days);
        });
      });

      context('when today is at the end of the week')
    });

    describe('isA()', function() {
      it('returns true with argument CalendarView #calendarView #partialView #view #travis', function() {
        expect(view.isA('CalendarView')).toBe(true);
      });

      it('returns true with argument PartialView #calendarView #partialView #view #travis', function() {
        expect(view.isA('PartialView')).toBe(true);
      });

      it('returns false with another argument #calendarView #partialView #view #travis', function() {
        expect(view.isA('Corvette')).toBe(false);
      });
    });
  });
});