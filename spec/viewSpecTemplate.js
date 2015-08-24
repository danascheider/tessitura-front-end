require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = _.extend(require('jasmine-jquery-matchers'), require(process.cwd() + '/spec/support/matchers/toBeA.js')),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    ccontext       = ddescribe;

describe(/* ACTUAL VALUE */, function() {
  var view;

  /* Filters
  /**************************************************************************/

  beforeEach(function() {
    this.addMatchers(matchers);
    _.extend(global, fixtures);

    // Create an instance of the view under test
    // Insert args here

    view = new SUT();
  });

  afterEach(function() {
    restoreFixtures();
    view.destroy();
    global = _.omit(global, fixtures);
  });

  /* View Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render #partialView #view #travis', function() {
      spyOn(SUT.prototype, 'render');
      var newView = new SUT();
      expect(SUT.prototype.render).not.toHaveBeenCalled();
    });
  });

  /* Elements
  /**************************************************************************/

  describe('view elements', function() {
    //
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
    describe('render()', function() {
      //
    });
  });
});