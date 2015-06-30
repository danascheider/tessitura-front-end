/* istanbul ignore <require> */
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

/* istanbul ignore next */
var matchers  = require('jasmine-jquery-matchers'),
    fixtures  = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context   = describe,
    fcontext  = fdescribe;

/* istanbul ignore next */
describe('User Profile View', function() {
  var view, newView; 

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  });

  beforeEach(function() {
    view = new Tessitura.UserProfileView({model: user});
  });

  afterEach(function() {
    restoreFixtures();
  });

  afterAll(function() {
    view.destroy();
    newView && newView.destroy();
    _.omit(global, fixtures);
  });

  describe('event wiring', function() {
    describe('click $el', function() {
      it('calls hideInputs() #userProfileView #modelView #view #travis', function() {
        spyOn(Tessitura.UserProfileView.prototype, 'hideInputs');
        newView = new Tessitura.UserProfileView({model: user});
        newView.render().$el.click();
        expect(Tessitura.UserProfileView.prototype.hideInputs).toHaveBeenCalled();
      });
    });
  });

  describe('event callbacks', function() {
    describe('hideInputs()', function() {
      it('calls hideInputs on the model view #userProfileView #modelView #view #travis', function() {
        spyOn(view.modelView, 'hideInputs');
        view.hideInputs();
        expect(view.modelView.hideInputs).toHaveBeenCalled();
      });
    });
  });
});