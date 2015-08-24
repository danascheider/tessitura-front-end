require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = _.extend(require('jasmine-jquery-matchers'), require(process.cwd() + '/spec/support/matchers/toBeA.js')),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    ccontext       = ddescribe;

describe('Organization Collection View', function() {
  var view;

  /* Filters
  /**************************************************************************/

  beforeEach(function() {
    this.addMatchers(matchers);
    _.extend(global, fixtures);
    view = new Tessitura.OrganizationCollectionView({collection: organizations});
  });

  afterEach(function() {
    restoreFixtures();
    view.destroy();
    global = _.omit(global, fixtures);
  });

  /* View Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render #organizationCollectionView #collectionView #view #travis', function() {
      spyOn(Tessitura.OrganizationCollectionView.prototype, 'render');
      var newView = new Tessitura.OrganizationCollectionView({collection: organizations});
      expect(Tessitura.OrganizationCollectionView.prototype.render).not.toHaveBeenCalled();
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