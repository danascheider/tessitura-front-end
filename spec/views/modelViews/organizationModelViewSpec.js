require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

var matchers  = require('jasmine-jquery-matchers'),
    fixtures  = require(process.cwd() + '/spec/support/fixtures/fixtures.js');
    context   = describe,
    ccontext  = ddescribe;

describe('OrganizationListItemView', function() {
  var org, view, html, spy, e;

  beforeEach(function() {
    this.addMatchers(matchers);
    _.extend(global, fixtures);
    org = new Tessitura.OrganizationModel({name: 'Foobar'});
    view = new Tessitura.OrganizationListItemView({model: org});
  });

  afterEach(function() { 
    restoreFixtures();
    view && view.destroy(); 
    _.omit(global, fixtures);
  });

  describe('constructor', function() {
    it('sets the model #organizationListItemView #modelView #view #travis', function() {
      expect(view.model).toEqual(org);
    });
  });
});