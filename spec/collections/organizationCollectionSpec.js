require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    ccontext       = ddescribe;

describe('Organization Collection', function() {
  var collection, newCollection, org1, org2, org3

  beforeEach(function() {
    org1 = new Tessitura.OrganizationModel({name: 'Org1'});
    org2 = new Tessitura.OrganizationModel({name: 'Org2'});
    org3 = new Tessitura.OrganizationModel({name: 'Org3'});
    collection = new Tessitura.OrganizationCollection([org1, org2, org3]);
  });

  afterEach(function() {
    org1.destroy();
    org2.destroy();
    org3.destroy();
  });

  describe('constructor', function() {
    it('sets the models #collection #travis', function() {
      expect(collection.models).toEqual([org1, org2, org3]);
    });
  });

  describe('URL', function() {
    it('goes to /organizations #collection #travis', function() {
      expect(collection.url).toEqual('/organizations');
    });
  });
});