/* Core Requires
/****************************************************************************/

/* istanbul ignore require */
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

/* istanbul ignore next */
var moment         = require('moment'),
    matchers       = _.extend(require('jasmine-jquery-matchers'), require(process.cwd() + '/spec/support/matchers/toBeA.js')),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    ccontext       = ddescribe;

/* Calendar View Spec
/****************************************************************************/

/* istanbul ignore next */
describe('dashboard calendar view', function() {
  var view, spy, e;

  /* Filters
  /**************************************************************************/

  beforeEach(function() {
    this.addMatchers(matchers);
    _.extend(global, fixtures);
    view = new Tessitura.CalendarView();
  });

  afterEach(function() {
    restoreFixtures();
    view.destroy();
    global = _.omit(global, fixtures);
  });

  /* View Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render #calendarView #partialView #view #travis', function() {
      spyOn(Tessitura.CalendarView.prototype, 'render');
      var newView = new Tessitura.CalendarView();
      expect(Tessitura.CalendarView.prototype.render).not.toHaveBeenCalled();
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
    // Ain't nobody got time for that. This is handled in the integration
    // tests and that will have to be enough.
    xdescribe('displayDays()', function() {
      var days, today;

      context('simple and easy', function() {
        beforeEach(function() {
          days = ['Monday', 'Tuesday', 'Wednesday'];
          today = new Date('Tue May 26 2015 11:00:00 GMT-0700 (PDT)');
          spyOn(window, 'Date').andReturn(today);
        });

        it('displays the specified days #calendarView #partialView #view #travis', function() {
          expect(view.displayDays()).toEqual(days);
        });
      });

      context('when today is at the beginning of the week', function() {
        beforeEach(function() {
          days = ['Saturday', 'Sunday', 'Monday'];
          today = new Date('Sun May 31 2015 11:00:00 GMT-0700 (PDT)');
          spyOn(window, 'Date').andReturn(today);
        });

        it('wraps to the end of the last week #calendarView #partialView #view #travis', function() {
          expect(view.displayDays()).toEqual(days);
        });
      });

      context('when today is at the end of the week', function() {
        beforeEach(function() {
          days = ['Friday', 'Saturday', 'Sunday'];
          today = new Date('Sat May 30 2015 11:00:00 GMT-0700 (PDT)');
          spyOn(window, 'Date').andReturn(today);
        });

        it('wraps to the beginning of next week', function() {
          expect(view.displayDays()).toEqual(days);
        });
      });
    });
  });
});