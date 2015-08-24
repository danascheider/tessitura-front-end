require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = require('jasmine-jquery-matchers'),
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
    _.omit(global, fixtures);
  });

  /* View Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render #organizationCollectionView #collectionView #view #travis', function() {
      spyOn(Tessitura.OrganizationCollectionView.prototype, 'render');
      var newView = new Tessitura.OrganizationCollectionView({collection: organizations});
      expect(Tessitura.OrganizationCollectionView.prototype.render).not.toHaveBeenCalled();
    });

    it('creates a child views array #organizationCollectionView #collectionView #view #travis', function() {
      var newView = new Tessitura.OrganizationCollectionView({collection: organizations});
      expect(typeof newView.childViews).not.toBe('undefined');
    });

    it('fetches its collection #organizationCollectionView #collectionView #view #travis', function() {
      spyOn(organizations, 'fetch');
      var newView = new Tessitura.OrganizationCollectionView({collection: organizations});
      expect(organizations.fetch).toHaveBeenCalled();
    });
  });

  /* Elements
  /**************************************************************************/

  describe('view elements', function() {
    beforeEach(function() {
      view.render();
    });

    it('has ID #organization-list #organizationCollectionView #collectionView #view #travis', function() {
      expect(view.$el[0].id).toEqual('organization-list');
    });

    it('has class .well #organizationCollectionView #collectionView #view #travis', function() {
      expect(view.$el[0].className).toContain('well');
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

  describe('special functions', function() {
    describe('renderCollection()', function() {
      it('renders the collection #organizationCollectionView #collectionView #view #travis', function() {
        newView = new Tessitura.OrganizationCollectionView({collection: organizations});
        view.renderCollection();
        expect(view.childViews.length).toBe(organizations.models.length);
      });
    });
  });

  /* Core View Functions
  /**************************************************************************/

  describe('core view functions', function() {
    describe('render()', function() {
      //
    });
  });
});