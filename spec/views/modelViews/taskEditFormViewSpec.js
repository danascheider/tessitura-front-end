/* istanbul ignore <require> */
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

/* istanbul ignore next */
var matchers       = require('jasmine-jquery-matchers'),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    context        = describe,
    fcontext       = fdescribe;

/* istanbul ignore next */
describe('Task Edit Form View', function() {
  var view, newView;

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  });

  beforeEach(function() {
    view = new Tessitura.TaskEditFormView({model: task1});
  });

  afterEach(function() {
    restoreFixtures();
  });

  afterAll(function() {
    view.destroy();
    _.omit(global, fixtures);
  });

  describe('constructor', function() {
    it('doesn\'t call render #taskEditFormView #modelView #view #travis', function() {
      spyOn(Tessitura.TaskEditFormView.prototype, 'render');
      newView = new Tessitura.TaskEditFormView({model: task1});
      expect(Tessitura.TaskEditFormView.prototype.render).not.toHaveBeenCalled();
    });

    it('sets the model #taskEditFormView #modelView #view #travis', function() {
      expect(view.model).toBe(task1);
    });
  });

  describe('elements', function() {
    beforeEach(function() {
      view.render();
    });

    it('is a form #taskEditFormView #modelView #view #travis', function() {
      expect(view.$el[0].tagName).toBe('FORM');
    });

    it('has ID #task-edit-form #taskEditFormView #modelView #view #travis', function() {
      expect(view.$el.attr('id')).toBe('task-edit-form');
    });

    it('has a title field #taskEditFormView #modelView #view #travis', function() {
      expect(view.$('input[name=title]')).toExist();
    });
  });

  describe('render()', function() {
    it('calls render on the Tessitura.View prototype #taskEditFormView #modelView #view #travis', function() {
      spyOn(Tessitura.View.prototype, 'render');
      view.render();
      expect(Tessitura.View.prototype.render).toHaveBeenCalled();
    });
  });
});