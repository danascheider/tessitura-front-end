/* Core Requires
/****************************************************************************/

/* istanbul ignore require */
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

/* istanbul ignore next */
var matchers       = _.extend(require('jasmine-jquery-matchers'), require(process.cwd() + '/spec/support/matchers/toBeA.js')),
    context        = describe,
    fcontext       = fdescribe;

/* Dash Widget View Spec
/****************************************************************************/

/* istanbul ignore next */
describe('DashWidgetView', function() {
  var view, newView, e;

  /* Filters
  /**************************************************************************/

  beforeAll(function() {
    parseIntCopy = parseInt;
    jasmine.addMatchers(matchers);
  });

  beforeEach(function() {
    view = new Tessitura.DashWidgetView();
  });

  afterAll(function() {
    view.destroy();
  });

  /* Event Callbacks
  /**************************************************************************************/

  describe('event wiring', function() {
    describe('click on the toggleWidget icon', function() {
      it('calls toggleWidget() #dashWidgetView #appView #view #travis', function() {
        spyOn(Tessitura.DashWidgetView.prototype, 'toggleWidget');
        newView = new Tessitura.DashWidgetView();
        newView.render();
        newView.$('span.toggle-widget > i').click();
        expect(Tessitura.DashWidgetView.prototype.toggleWidget).toHaveBeenCalled();
      });
    });
  });

  /* Event Wiring
  /**************************************************************************************/

  describe('event callbacks', function() {
    describe('toggleWidget()', function() {
      beforeEach(function() {
        e = $.Event('click', {target: view.$('.toggle-widget > i.fa-minus')});
      });

      it('calls slideToggle #dashWidgetView #appView #view #travis', function() {
        spyOn($.prototype, 'slideToggle');
        view.toggleWidget(e);
        expect($.prototype.slideToggle).toHaveBeenCalled();
      });
    });
  });
});