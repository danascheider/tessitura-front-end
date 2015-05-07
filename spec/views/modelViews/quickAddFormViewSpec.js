require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/canto.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = require('jasmine-jquery-matchers'),
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    context        = describe,
    fcontext       = fdescribe;

describe('Quick-Add Task Form', function() {
  var view, newView, collection, task1, task2, task3, xhr, e, spy;

  beforeAll(function() {
    jasmine.addMatchers(matchers);
  });

  beforeEach(function() {
    task1 = new Canto.TaskModel({id: 1, owner_id: 1, title: 'Task 1', status: 'Blocking', priority: 'Low', position: 1});
    task2 = new Canto.TaskModel({id: 2, owner_id: 1, title: 'Task 2', status: 'Blocking', priority: 'Normal', position: 2});
    task3 = new Canto.TaskModel({id: 3, owner_id: 1, title: 'Task 3', status: 'Blocking', priority: 'Normal', position: 3});

    collection = new Canto.TaskCollection([task1, task2, task3]);

    view = new Canto.QuickAddFormView({collection: collection, grouping: {status: 'Blocking'}});
  });

  afterEach(function() {
    _.each([view, task1, task2, task3, collection], function(obj) { obj.destroy(); });
  })

  afterAll(function() {
    _.each([view, task1, task2, task3, collection], function(variable) {
      variable = null;
    });
  });

 describe('constructor', function() {
    it('assigns the collection #modelView #view #travis', function() {
      expect(view.collection).toBe(collection);
    });

    it('doesn\'t call render() #modelView #view #travis', function() {
      spyOn(Canto.QuickAddFormView.prototype, 'render');
      newView = new Canto.QuickAddFormView({collection: collection});
      expect(Canto.QuickAddFormView.prototype.render).not.toHaveBeenCalled();
      newView.destroy();
    });

    it('sets the `grouping` property #modelView #view #travis', function() {
      expect(view.grouping).toEqual({status: 'Blocking'});
    });
  });

  describe('properties', function() {
    it('is a Canto.View #modelView #view #travis', function() {
      expect(view).toBeA('Canto.View');
    });

    it('has klass QuickAddTaskFormView #modelView #view #travis', function() {
      expect(view.klass).toBe('QuickAddTaskFormView');
    });

    it('has family Canto.View #modelView #view #travis', function() {
      expect(view.family).toBe('Canto.View');
    });

    it('has superFamily Backbone.View #modelView #view #travis', function() {
      expect(view.superFamily).toBe('Backbone.View');
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
      _.each(['showTaskCreateForm', 'createTask'], function(method) { spyOn(Canto.QuickAddFormView.prototype, method); });
      newView = new Canto.QuickAddFormView({collection: collection, grouping: {status: 'Blocking'}});
    });

    describe('click span.pull-right', function() {
      it('calls showTaskCreateForm() #modelView #view #travis', function() {
        newView.render().$('span.pull-right > i').click();
        expect(Canto.QuickAddFormView.prototype.showTaskCreateForm).toHaveBeenCalled();
      });
    });

    describe('submit form', function() {
      it('calls createTask() #modelView #view #travis', function() {
        newView.render().$el.submit();
        expect(Canto.QuickAddFormView.prototype.createTask).toHaveBeenCalled();
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

          spyOn(Canto.Utils, 'getAttributes').and.returnValue({title: 'Finish writing tests'});

          spyOn($, 'ajax').and.callFake(function(args) {
            args.success();
          });
        });

        it('doesn\'t refresh the browser #modelView #view #travis', function() {
          spyOn(e, 'preventDefault');
          view.createTask(e);
          expect(e.preventDefault).toHaveBeenCalled();
        });

        it('creates a new task #modelView #view #travis', function() {
          spyOn(Canto.TaskModel.prototype, 'initialize');
          view.createTask(e);
          expect(Canto.TaskModel.prototype.initialize).toHaveBeenCalled();
        });

        it('attaches an auth header #modelView #view #travis', function() {
          spyOn($, 'cookie').and.callFake(function(args) {
            return args === 'userID' ? 1 : btoa('testuser:testuser');
          });

          xhr.open('POST', Canto.API.tasks.collection(1));
          view.createTask(e);
          $.ajax.calls.argsFor(0)[0].beforeSend(xhr);
          expect(xhr.getRequestHeader('Authorization')).toEqual('Basic ' + btoa('testuser:testuser'));
        });

        it('sets the new task\'s attributes according to its grouping #modelView #view #travis', function() {
          spyOn(Canto.TaskModel.prototype, 'save');
          view.createTask(e);
          expect(Canto.TaskModel.prototype.save.calls.argsFor(0)[0].status).toEqual('Blocking');
        });

        it('adds the new task to the beginning of the collection #modelView #view #travis', function() {
          spyOn(collection, 'unshift');
          view.createTask(e);
          expect(collection.unshift).toHaveBeenCalled();
        });

        it('triggers the newTask event #modelView #view #travis', function() {
          pending('Figure out if the app actually needs to do this');
          var spy = jasmine.createSpy('spy');
          view.on('newTask', spy);
          view.createTask(e);
          expect(spy).toHaveBeenCalled();
          view.off();
        });

        it('resets the form #modelView #view #travis', function() {
          spyOn(view.$el[0], 'reset');
          view.createTask(e);
          expect(view.$el[0].reset).toHaveBeenCalled();
        });
      });

      context('when no title given', function() {
        it('doesn\'t create a task #modelView #view #travis', function() {
          spyOn(Canto.Utils, 'getAttributes').and.returnValue({title: ''});
          spyOn(collection, 'create');
          spyOn(Canto.TaskModel.prototype, 'initialize');
          view.createTask(e);
          expect(collection.create).not.toHaveBeenCalled();
          expect(Canto.TaskModel.prototype.initialize).not.toHaveBeenCalled();
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
        expect(spy).toHaveBeenCalled();
      });
    });
  });

  describe('special methods', function() {
    describe('isA', function() {
      it('returns true with arg \'QuickAddFormView\' #modelView #view #travis', function() {
        expect(view.isA('QuickAddFormView')).toBe(true);
      });

      it('returns true with arg \'QuickAddForm\' #modelView #view #travis', function() {
        expect(view.isA('QuickAddForm')).toBe(true);
      });

      it('returns true with arg \'TaskCollectionView\' #modelView #view #travis', function() {
        expect(view.isA('TaskCollectionView')).toBe(true);
      });

      it('returns true with arg \'TaskCreateFormView\' #modelView #view #travis', function() {
        expect(view.isA('TaskCreateFormView')).toBe(true);
      });

      it('returns true with arg \'TaskForm\' #modelView #view #travis', function() {
        expect(view.isA('TaskFormView')).toBe(true);
      });

      it('returns false with other arg #modelView #view #travis', function() {
        expect(view.isA('Backbone.Model')).toBe(false);
      });
    });
  });
});