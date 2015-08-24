require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    ccontext       = ddescribe;

describe('Organization Collection', function() {
  var organizationCollection, newCollection, org1, org2, org3

  beforeEach(function() {
    _.extend(global, fixtures);
  });

  afterEach(function() {
    restoreFixtures()
    _.omit(global, fixtures);
  });

  describe('constructor', function() {
    it('sets the models #collection #travis', function() {
      organizationCollection = new Tessitura.OrganizationCollection([org1, org2, org3]);
      expect(organizationCollection.models.length).toEqual(3);
    });
  });

  describe('URL', function() {
    it('goes to /organizations #collection #travis', function() {
      expect(organizations.url()).toMatch(/\/organizations$/);
    });
  });
});