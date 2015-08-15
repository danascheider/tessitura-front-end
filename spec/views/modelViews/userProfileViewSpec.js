/* istanbul ignore <require> */
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

/* istanbul ignore next */
var matchers  = require('jasmine-jquery-matchers'),
    fixtures  = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context   = describe,
    ccontext  = ddescribe;

/* istanbul ignore next */
describe('User Profile View', function() {
  var view, newView; 

  beforeEach(function() {
    this.addMatchers(matchers);
    _.extend(global, fixtures);
    view = new Tessitura.UserProfileView({model: user});
  });

  afterEach(function() {
    restoreFixtures();
    view.destroy();
    newView && newView.destroy();
    _.omit(global, fixtures);
  });
  
  describe('event wiring', function() {
    beforeEach(function() {
      spyOn(Tessitura.UserProfileView.prototype, 'hideInputs');
      spyOn(Tessitura.UserProfileView.prototype, 'updateTitle');
      newView = new Tessitura.UserProfileView({model: user});
    });

    describe('click $el', function() {
      it('calls hideInputs() #userProfileView #modelView #view #travis', function() {
        newView.render().$el.click();
        expect(Tessitura.UserProfileView.prototype.hideInputs).toHaveBeenCalled();
      });
    });

    describe('change user first name', function() {
      it('calls updateTitle #userProfileView #modelView #view #travis', function() {
        user.set('first_name', 'Kelly');
        expect(Tessitura.UserProfileView.prototype.updateTitle).toHaveBeenCalled();
      });
    });

    describe('change user last name', function() {
      it('calls updateTitle #userProfileView #modelView #view #travis', function() {
        user.set('last_name', 'Jones');
        expect(Tessitura.UserProfileView.prototype.updateTitle).toHaveBeenCalled();
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

    describe('updateTitle()', function() {
      it('updates the title #userProfileView #modelView #view #travis', function() {
        view.render();
        user.set('first_name', 'Mickey', {silent: true});
        view.updateTitle();
        expect(view.$el).toHaveText('Jacob User\'s Profile');
      });
    });
  });
});