/* istanbul ignore require */
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

/* istanbul ignore next */
var matchers = require('jasmine-jquery-matchers'),
    fixtures = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context  = describe,
    fcontext = fdescribe;

/* istanbul ignore next */
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

  describe('properties', function() {
    describe('types', function() {
      it('includes DashboardProfileView #dashboardProfileView #partialView #view #travis', function() {
        expect(view.types().indexOf('DashboardProfileView')).not.toEqual(-1);
      });
    });
  });

  describe('event wiring', function() {
    describe('click $el', function() {
      it('calls hideInputs() #dashboardProfileView #partialView #view #travis', function() {
        spyOn(Tessitura.DashboardProfileView.prototype, 'hideInputs');
        newView = new Tessitura.DashboardProfileView({model: user});
        newView.render();
        newView.$el.click();
        expect(Tessitura.DashboardProfileView.prototype.hideInputs).toHaveBeenCalled();
      });
    });
  });

  describe('event callbacks', function() {
    describe('hideInputs()', function() {
      context('when the click is inside an input', function() {
        it('does not call hideInputs on its profileView #dashboardProfileView #partialView #view #travis', function() {
          spyOn(view.profileView, 'hideInputs');
          e = $.Event('click', {target: view.$('input')});
          view.hideInputs(e);
          expect(view.profileView.hideInputs).toHaveBeenCalled();
        });
      });

      context('when the click is not inside an input', function() {
        it('calls hideInputs on its profileView #dashboardProfileView #partialView #view #travis', function() {
          spyOn(view.profileView, 'hideInputs');
          e = $.Event('click', {target: view.$el});
          view.hideInputs(e);
          expect(view.profileView.hideInputs).toHaveBeenCalled();
        });
      })
    });
  });
});