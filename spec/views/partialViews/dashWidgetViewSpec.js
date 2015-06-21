/* Core Requires
/****************************************************************************/

require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = _.extend(require('jasmine-jquery-matchers'), require(process.cwd() + '/spec/support/matchers/toBeA.js')),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

var DashWidgetView = require(process.cwd() + '/js/views/appViews/dashWidgetView.js');

/* Dash Widget View Spec
/****************************************************************************/

describe('DashWidgetView', function() {
  var view;

  /* Filters
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  })

  beforeEach(function() {
    view = new DashWidgetView();
  });

  afterEach(function() {
    restoreFixtures();
  });

  afterAll(function() {
    view.destroy();
    global = _.omit(global, fixtures);
  });

  /* Static Properties
  /**************************************************************************/

  describe('properties', function() {
    it('has klass DashWidgetView #partialView #view #travis', function() {
      expect(view.klass).toEqual('DashWidgetView');
    });

    it('has family Tessitura.View #partialView #view #travis', function() {
      expect(view.family).toEqual('Tessitura.View');
    });

    it('has superFamily Backbone.View #partialView #view #travis', function() {
      expect(view.superFamily).toEqual('Backbone.View');
    });
  });

  /* Event Wiring
  /**************************************************************************/

  describe('view events', function() {
    describe('click on the toggle widget icon', function() {
      it('calls toggleWidget #partialView #view #travis', function() {
        spyOn(DashWidgetView.prototype, 'toggleWidget');
        var newView = new DashWidgetView();
        newView.render();
        newView.$('span.toggle-widget > i').click();
        expect(DashWidgetView.prototype.toggleWidget).toHaveBeenCalled();
      });
    });
  });

  /* Event Callbacks
  /**************************************************************************/

  describe('event callbacks', function() {
    describe('toggleWidget #partialView #view #travis', function() {
      it('calls slideToggle', function() {
        var e = $.Event('click', {target: view.$('.toggle-widget')});
        spyOn($.prototype, 'slideToggle');
        view.toggleWidget(e);
        expect($.prototype.slideToggle).toHaveBeenCalled();
      });
    });
  });

  /* Special Functions
  /**************************************************************************/

  describe('special functions', function() {
    describe('isA()', function() {
      it('returns true with argument DashWidgetView #partialView #view #travis', function() {
        expect(view.isA('DashWidgetView')).toBe(true);
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