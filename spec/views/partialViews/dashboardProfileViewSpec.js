require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

var matchers = require('jasmine-jquery-matchers'),
    fixtures = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context  = describe,
    fcontext = fdescribe;

describe('Dashboard Profile View', function() {
  var view, newView;

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  });

  beforeEach(function() {
    view = new Tessitura.DashboardProfileView({model: user});
  });

  afterEach(function() {
    restoreFixtures();
  });

  afterAll(function() {
    view = null;
    _.omit(global, fixtures);
  });

  describe('constructor', function() {
    it('doesn\'t call render #dashboardProfileView #partialView #view #travis', function() {
      spyOn(Tessitura.DashboardProfileView.prototype, 'render');
      newView = new Tessitura.DashboardProfileView({model: user});
      expect(Tessitura.DashboardProfileView.prototype.render).not.toHaveBeenCalled();
    });
  });
});