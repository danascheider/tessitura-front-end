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

  describe('special functions', function() {
    describe('cityStateZip()', function() {
      context('city, state, and zip present', function() {
        it('returns the appropriate string #model #travis', function() {
          org.set({city: 'Lake Oswego', region: 'OR', postal_code: 97034});
          expect(org.cityStateZip()).toEqual('Lake Oswego, OR 97034');
        });
      });

      context('city and state present', function() {
        it('returns the appropriate string #model #travis', function() {
          org.set({city: 'Lake Oswego', region: 'OR'});
          org.unset('postal_code');
          expect(org.cityStateZip()).toEqual('Lake Oswego, OR');
        });
      });

      context('city and zip present', function() {
        it('returns the appropriate string #model #travis', function() {
          org.set({city: 'Lake Oswego', postal_code: '97034'});
          org.unset('region');
          expect(org.cityStateZip()).toEqual('Lake Oswego, 97034');
        });
      });

      context('state and zip present', function() {
        it('returns the appropriate string #model #travis', function() {
          org.set({region: 'OR', postal_code: '97034'});
          org.unset('city');
          expect(org.cityStateZip()).toEqual('OR 97034');
        })
      });

      context('one attribute defined', function() {
        it('returns the known attribute #model #travis', function() {
          org.set({city: 'Lake Oswego'});
          org.unset(['region', 'postal_code']);
          expect(org.cityStateZip()).toEqual('Lake Oswego');
        })
      });
    });
  });
});