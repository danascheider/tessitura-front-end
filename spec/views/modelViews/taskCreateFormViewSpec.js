/* istanbul ignore <require> */
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

/* istanbul ignore next */
var matchers       = require('jasmine-jquery-matchers'),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    context        = describe,
    ccontext       = ddescribe;

/* istanbul ignore next */
describe('TaskCreateFormView', function() {
  var view, newView, e, xhr;

  beforeEach(function() {
    this.addMatchers(matchers);
    _.extend(global, fixtures);
    view = new Tessitura.TaskCreateFormView({collection: collection});
  });

  afterEach(function() {
    restoreFixtures();
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

  describe('events', function() {
    describe('submit', function() {
      beforeEach(function() {
        spyOn(Tessitura.TaskCreateFormView.prototype, 'createTask');
        newView = new Tessitura.TaskCreateFormView({collection: collection});
        newView.render();
      });

      it('calls createTask() #taskCreateFormView #modelView #view #travis', function() {
        newView.render();
        newView.$el.submit();
        expect(Tessitura.TaskCreateFormView.prototype.createTask).toHaveBeenCalled();
      });
    });
  });

  describe('event callbacks', function() {
    describe('createTask()', function() {
      beforeEach(function() {
        view.render();
        e = $.Event('submit', {target: view.$el});
        xhr = new XMLHttpRequest();
        xhr.open('PUT', Tessitura.API.tasks.collection(1));
        spyOn($, 'ajax').andCallFake(function(args) { args.success(); });
      });

      context('valid attributes', function() {
        beforeEach(function() {
          spyOn(Tessitura.Utils, 'getAttributes').andReturn({
            title: 'Another Task',
            status: 'New',
            priority: 'Normal'
          });
        });

        it('doesn\'t refresh  #taskCreateFormView #modelView #view #travis', function() {
          spyOn(e, 'preventDefault');
          view.createTask(e);
          expect(e.preventDefault).toHaveBeenCalled();
        });

        it('takes the attributes from the form #taskCreateFormView #modelView #view #travis', function() {
          view.createTask(e);
          expect(Tessitura.Utils.getAttributes).toHaveBeenCalled();
        });

        it('creates a task #taskCreateFormView #modelView #view #travis', function() {
          spyOn(Tessitura.TaskModel.prototype, 'initialize');
          view.createTask(e);
          expect(Tessitura.TaskModel.prototype.initialize).toHaveBeenCalled();
        });

        it('adds the task to the collection #taskCreateFormView #modelView #view #travis', function(done) {
          var spy = jasmine.createSpy();
          view.listenTo(view.collection, 'add', spy);
          view.createTask(e);
          expect(spy).toHaveBeenCalled();
          view.stopListening(view.collection, 'add');
          done();
        });

        it('triggers the hideShade event #taskCreateFormView #modelView #view #travis', function(done) {
          var spy = jasmine.createSpy();
          view.on('hideShade', spy);
          view.createTask(e);
          expect(spy).toHaveBeenCalled();
          view.off('hideShade');
          done();
        });
      });

      context('missing title', function() {
        beforeEach(function() {
          spyOn(Tessitura.Utils, 'getAttributes').andReturn({
            title: '',
            status: 'New',
            priority: 'Normal'
          });
        });

        it('doesn\'t refresh #taskCreateFormView #modelView #view #travis', function() {
          spyOn(e, 'preventDefault');
          view.createTask(e);
          expect(e.preventDefault).toHaveBeenCalled();
        });

        it('doesn\'t create a task #taskCreateFormView #modelView #view #travis', function() {
          spyOn(Tessitura.TaskModel.prototype, 'initialize');
          view.createTask(e);
          expect(Tessitura.TaskModel.prototype.initialize).not.toHaveBeenCalled();
        });

        it('adds the .has-error class to the title input #taskEditFormView #modelView #view #travis', function() {
          view.createTask(e);
          expect(view.$('input[name=title]').closest('tr')).toHaveClass('has-error');
        });
      });
    });
  });

  describe('setCollection', function() {
    it('sets the collection #taskCreateFormView #modelView #view #travis', function() {
      view.setCollection(collection);
      expect(view.collection).toBe(collection);
    });
  });
});