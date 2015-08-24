require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

var context        = describe,
    ccontext       = ddescribe;

describe('Organization Model', function() {
  var org, newOrg;

  beforeEach(function() {
    org = new Tessitura.OrganizationModel({id: 1, name: 'St. Stephen\'s Catholic Church'});
  });

  afterEach(function() {
    org.destroy();
    newOrg && newOrg.destroy();
  });

  describe('properties', function() {
    it('has urlRoot /organizations #model #travis', function() {
      expect(org.urlRoot).toEqual('/organizations');
    });

    it('goes to the expected RESTful endpoint #model #travis', function() {
      expect(org.url()).toEqual('/organizations/1');
    });

    it('has klass OrganizationModel #model #travis', function() {
      expect(org.klass).toEqual('OrganizationModel');
    });
  });
});