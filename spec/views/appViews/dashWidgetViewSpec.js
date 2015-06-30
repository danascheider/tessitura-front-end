/* Core Requires
/****************************************************************************/

/* istanbul ignore require */
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

/* istanbul ignore next */
var matchers       = _.extend(require('jasmine-jquery-matchers'), require(process.cwd() + '/spec/support/matchers/toBeA.js')),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

/* Dash Widget View Spec
/****************************************************************************/

/* istanbul ignore next */
describe('DashWidgetView', function() {
  var view;

  /* Filters
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  })

  beforeEach(function() {
    view = new Tessitura.DashWidgetView();
  });

  afterEach(function() {
    restoreFixtures();
  });

  afterAll(function() {
    view.destroy();
    global = _.omit(global, fixtures);
  });

  /* Event Wiring
  /**************************************************************************/

  describe('view events', function() {
    describe('click on the toggle widget icon', function() {
      it('calls toggleWidget #appView #view #travis', function() {
        spyOn(Tessitura.DashWidgetView.prototype, 'toggleWidget');
        var newView = new Tessitura.DashWidgetView();
        newView.render();
        newView.$('span.toggle-widget > i').click();
        expect(Tessitura.DashWidgetView.prototype.toggleWidget).toHaveBeenCalled();
      });
    });
  });

  /* Event Callbacks
  /**************************************************************************/

  describe('event callbacks', function() {
    describe('toggleWidget #appView #view #travis', function() {
      it('calls slideToggle', function() {
        var e = $.Event('click', {target: view.$('.toggle-widget')});
        spyOn($.prototype, 'slideToggle');
        view.toggleWidget(e);
        expect($.prototype.slideToggle).toHaveBeenCalled();
      });
    });
  });
});