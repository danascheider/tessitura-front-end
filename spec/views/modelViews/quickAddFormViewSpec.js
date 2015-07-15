/* istanbul ignore <require> */
require('jasmine');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

/* istanbul ignore next */
var matchers       = require('jasmine-jquery-matchers'),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    context        = describe,
    ccontext       = ddescribe;

_.extend(global, fixtures);

/* istanbul ignore next */
describe('Quick-Add Task Form', function() {
  var view, newView, xhr, e, spy;

  beforeEach(function() {
    this.addMatchers(matchers);
    view = new Tessitura.QuickAddFormView({collection: collection, groupedBy: {status: 'Blocking'}});
  });

  afterEach(function() {
    restoreFixtures();
    view.destroy();
    _.omit(global, fixtures);
  });

 describe('constructor', function() {
    it('assigns the collection #modelView #view #travis', function() {
      expect(view.collection).toBe(collection);
    });

    it('doesn\'t call render() #modelView #view #travis', function() {
      spyOn(Tessitura.QuickAddFormView.prototype, 'render');
      newView = new Tessitura.QuickAddFormView({collection: collection, groupedBy: {status: 'Blocking'}});
      expect(Tessitura.QuickAddFormView.prototype.render).not.toHaveBeenCalled();
      newView.destroy();
    });

    it('sets the `groupedBy` property #modelView #view #travis', function() {
      expect(view.groupedBy).toEqual({status: 'Blocking'});
    });
  });

  describe('elements', function() {
    beforeEach(function() {
      view.render();
    });

    afterEach(function() {
      view.remove();
    });

    it('is a form #modelView #view #travis', function() {
      expect(view.$el[0].tagName).toBe('FORM');
    });

    it('has class .task-form #modelView #view #travis', function() {
      expect(view.$el[0]).toHaveClass('task-form');
    });

    it('has class .create-form #modelView #view #travis', function() {
      expect(view.$el[0]).toHaveClass('create-form');
    });

    it('has class .quick-add-form #modelView #view #travis', function() {
      expect(view.$el[0]).toHaveClass('quick-add-form');
    });
  });

  describe('events', function() {
    beforeEach(function() {
      _.each(['showTaskCreateForm', 'createTask'], function(method) { spyOn(Tessitura.QuickAddFormView.prototype, method); });
      newView = new Tessitura.QuickAddFormView({collection: collection, grouping: {status: 'Blocking'}});
    });

    describe('click span.pull-right', function() {
      it('calls showTaskCreateForm() #modelView #view #travis', function() {
        newView.render().$('span.pull-right > i').click();
        expect(Tessitura.QuickAddFormView.prototype.showTaskCreateForm).toHaveBeenCalled();
      });
    });

    describe('submit form', function() {
      it('calls createTask() #modelView #view #travis', function() {
        newView.render().$el.submit();
        expect(Tessitura.QuickAddFormView.prototype.createTask).toHaveBeenCalled();
      });
    });
  });

  describe('event callbacks', function() {
    describe('createTask()', function() {
      beforeEach(function() {
        e = $.Event('submit', {target: view.$el});
        view.render();
      });

      afterEach(function() {
        view.remove();
        collection.reset([task1, task2, task3]);
      });

      context('when valid', function() {
        beforeEach(function() {
          xhr = new XMLHttpRequest();

          spyOn(Tessitura.Utils, 'getAttributes').andReturn({title: 'Finish writing tests'});

          spyOn($, 'ajax').andCallFake(function(args) {
            args.success();
          });
        });

        it('doesn\'t refresh the browser #modelView #view #travis', function() {
          spyOn(e, 'preventDefault');
          view.createTask(e);
          expect(e.preventDefault).toHaveBeenCalled();
        });

        it('creates a new task #modelView #view #travis', function() {
          spyOn(Tessitura.TaskModel.prototype, 'initialize');
          view.createTask(e);
          expect(Tessitura.TaskModel.prototype.initialize).toHaveBeenCalled();
        });

        it('attaches an auth header #modelView #view #travis', function() {
          spyOn($, 'cookie').andCallFake(function(args) {
            return args === 'userID' ? 1 : btoa('testuser:testuser');
          });

          xhr.open('POST', Tessitura.API.tasks.collection(1));
          view.createTask(e);
          $.ajax.calls[0].args[0].beforeSend(xhr);
          expect(xhr.getRequestHeader('Authorization')).toEqual('Basic ' + btoa('testuser:testuser'));
        });

        it('sets the new task\'s attributes according to its grouping #modelView #view #travis', function() {
          spyOn(Tessitura.TaskModel.prototype, 'save');
          view.createTask(e);
          expect(Tessitura.TaskModel.prototype.save.calls[0].args[0].status).toEqual('Blocking');
        });

        it('adds the new task to the beginning of the collection #modelView #view #travis', function() {
          spyOn(collection, 'unshift');
          view.createTask(e);
          expect(collection.unshift).toHaveBeenCalled();
        });

        it('resets the form #modelView #view #travis', function() {
          spyOn(view.$el[0], 'reset');
          view.createTask(e);
          expect(view.$el[0].reset).toHaveBeenCalled();
        });
      });

      context('when no title given', function() {
        it('doesn\'t create a task #modelView #view #travis', function() {
          spyOn(Tessitura.Utils, 'getAttributes').andReturn({title: ''});
          spyOn(collection, 'create');
          spyOn(Tessitura.TaskModel.prototype, 'initialize');
          view.createTask(e);
          expect(collection.create).not.toHaveBeenCalled();
          expect(Tessitura.TaskModel.prototype.initialize).not.toHaveBeenCalled();
        });
      });
    });

    describe('showTaskCreateForm', function() {
      beforeEach(function() {
        spy = jasmine.createSpy();
        view.on('showTaskCreateForm', spy);
      });

      afterEach(function() { view.off('showTaskCreateForm'); });

      it('triggers the `showTaskCreateForm` event #modelView #view #travis', function() {
        view.showTaskCreateForm();
        expect(spy).toHaveBeenCalledWith(collection, view.groupedBy);
      });
    });
  });
});