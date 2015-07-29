/* istanbul ignore require */
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

/* istanbul ignore next */
var matchers       = _.extend(require('jasmine-jquery-matchers'), require(process.cwd() + '/spec/support/matchers/toBeA.js')),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    ccontext       = ddescribe;

/* Fach Form View Spec
/*****************************************************************************/

/* istanbul ignore next */
describe('Fach Form View', function() {
  var view, spy, e;

  /* Filters
  /****************************************************************************/

  beforeEach(function() {
    this.addMatchers(matchers);
    _.extend(global, fixtures);
    view = new Tessitura.FachFormView({model: fach});
  });

  afterEach(function() {
    restoreFixtures();
    view.destroy();
    _.omit(global, fixtures);
  });

  /* View Constructor
  /****************************************************************************/

  describe('constructor', function() {
    it('doesn\'t call render #fachFormView #modelView #view #travis', function() {
      spyOn(Tessitura.FachFormView.prototype, 'render');
      var newView = new Tessitura.FachFormView({model: fach});
      expect(Tessitura.FachFormView.prototype.render).not.toHaveBeenCalled();
    });
  });
});