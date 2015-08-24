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

  describe('el', function() {
    beforeEach(function() { view.render(); });

    it('is an li #organizationListItemView #modelView #view #travis', function() {
      expect(view.$el[0].tagName).toEqual('LI');
    });

    it('has class .organization-list-item-view #organizationListItemView #modelView #view #travis', function() {
      expect(view.$el.attr('class')).toContain('organization-list-item-view');
    });
  });

  describe('view elements', function() {
    beforeEach(function() {
      org.set({
        email_1   : 'org1@example.org',
        address_1 : '123 Main St.',
        city      : 'Pierre',
        region    : 'SD',
        phone_1   : '(800) 555-4242'
      });

      view.render();
    });

    it('displays the organization\'s name #organizationListItemView #modelView #view #travis', function() {
      expect(view.$('a.organization-name').html()).toEqual(org.get('name'));
    });

    it('displays the organization\'s phone_1 attribute #organizationListItemView #modelView #view #travis', function() {
      expect(view.$el.html()).toContain(org.get('phone_1'));
    });

    it('displays the organization\'s address_1 attribute #organizationListItemView #modelView #view #travis', function() {
      expect(view.$el.html()).toContain(org.get('address_1'));
    });

    it('displays the organization\'s e-mail attribute #organizationListItemView #modelView #view #travis', function() {
      expect(view.$el.html()).toContain(org.get('email_1'));
    });

    it('displays the organization\'s city #organizationListItemView #modelView #view #travis', function() {
      expect(view.$el.html()).toContain(org.get('city'));
    });

    it('displays the organization\'s state #organizationListItemView #modelView #view #travis', function() {
      expect(view.$el.html()).toContain(org.get('region'));
    });

    it('doesn\'t display undefined attributes #organizationListItemView #modelView #view #travis', function() {
      expect(view.$el.html()).not.toContain('undefined');
    });
  });
});