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
describe('TaskCreateFormView', function() {
  var view, newView, e, xhr;

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  });

  beforeEach(function() {
    view = new Tessitura.TaskCreateFormView({collection: collection});
  });

  afterEach(function() {
    restoreFixtures();
  });

  afterAll(function() {
    view.destroy();
    _.omit(global, fixtures);
  });

  describe('elements', function() {
    beforeEach(function() {
      view.render();
    });

    it('is a form #taskCreateFormView #modelView #view #travis', function() {
      expect(view.$el[0].tagName).toEqual('FORM');
    });

    it('has ID #task-create-form #taskCreateFormView #modelView #view #travis', function() {
      expect(view.$el.attr('id')).toEqual('task-create-form');
    });

    it('has a title field #taskCreateFormView #modelView #view #travis', function() {
      expect(view.$('input[name=title]')).toExist();
    });

    it('has a deadline field #taskCreateFormView #modelView #view #travis', function() {
      expect(view.$('input[name=deadline]')).toExist();
    });

    it('has a status select #taskCreateFormView #modelView #view #travis', function() {
      expect(view.$('select[name=status]')).toExist();
    });

    it('has a priority select #taskCreateFormView #modelView #view #travis', function() {
      expect(view.$('select[name=priority]')).toExist();
    });

    it('has a description textarea #taskCreateFormView #modelView #view #travis', function() {
      expect(view.$('textarea[name=description]')).toExist();
    });

    it('has a submit button #taskCreateFormView #modelView #view #travis', function() {
      expect(view.$('button[type=submit]')).toExist();
    });
  });

  describe('setCollection', function() {
    it('sets the collection #taskCreateFormView #modelView #view #travis', function() {
      view.setCollection(collection);
      expect(view.collection).toBe(collection);
    });
  });
});