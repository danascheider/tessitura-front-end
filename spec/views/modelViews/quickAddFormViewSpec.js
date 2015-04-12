require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/canto.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = require('jasmine-jquery-matchers'),
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    Fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

describe('Quick-Add Task Form #travis', function() {
  var view, xhr, e;

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, Fixtures);
  });

  beforeEach(function() {
    view = new Canto.QuickAddFormView({collection: collection, grouping: {status: 'Blocking'}});
  });

  afterEach(function() {
    restoreFixtures();
  })

  afterAll(function() {
    view.remove();
    view = null;
    global = _.omit(global, Fixtures);
  });

 describe('constructor', function() {
    it('assigns the collection', function() {
      expect(view.collection).toBe(collection);
    });

    it('doesn\'t call render', function() {
      spyOn(Canto.QuickAddFormView.prototype, 'render');
      var newView = new Canto.QuickAddFormView({collection: collection});
      expect(Canto.QuickAddFormView.prototype.render).not.toHaveBeenCalled();
    });

    it('sets the `grouping` property', function() {
      expect(view.grouping).toEqual({status: 'Blocking'});
    });
  });

  describe('properties', function() {
    it('is a Canto.View', function() {
      expect(view).toBeA('Canto.View');
    });

    it('has klass QuickAddTaskFormView', function() {
      expect(view.klass).toBe('QuickAddTaskFormView');
    });

    it('has family Canto.View', function() {
      expect(view.family).toBe('Canto.View');
    });

    it('has superFamily Backbone.View', function() {
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

    it('is a form', function() {
      expect(view.$el[0].tagName).toBe('FORM');
    });

    it('has class .task-form', function() {
      expect(view.$el[0]).toHaveClass('task-form');
    });

    it('has class .create-form', function() {
      expect(view.$el[0]).toHaveClass('create-form');
    });

    it('has class .quick-add-form', function() {
      expect(view.$el[0]).toHaveClass('quick-add-form');
    });
  });

  describe('events', function() {
    describe('submit form', function() {
      it('calls createTask', function() {
        spyOn(Canto.QuickAddFormView.prototype, 'createTask');
        var newView = new Canto.QuickAddFormView({collection: collection, grouping: {status: 'Blocking'}});
        newView.render().$el.submit();
        expect(Canto.QuickAddFormView.prototype.createTask).toHaveBeenCalled();
      });
    });
  });

  describe('event callbacks', function() {
    describe('createTask', function() {
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

        it('doesn\'t refresh the browser', function() {
          spyOn(e, 'preventDefault');
          view.createTask(e);
          expect(e.preventDefault).toHaveBeenCalled();
        });

        it('creates a new task', function() {
          spyOn(Canto.TaskModel.prototype, 'initialize');
          view.createTask(e);
          expect(Canto.TaskModel.prototype.initialize).toHaveBeenCalled();
        });

        it('attaches an auth header', function() {
          spyOn($, 'cookie').and.callFake(function(args) {
            return args === 'userID' ? 342 : btoa('testuser:testuser');
          });

          xhr.open('POST', Canto.API.tasks.collection(342));
          view.createTask(e);
          $.ajax.calls.argsFor(0)[0].beforeSend(xhr);
          expect(xhr.getRequestHeader('Authorization')).toEqual('Basic ' + btoa('testuser:testuser'));
        });

        it('sets the new task\'s attributes according to its grouping', function() {
          spyOn(Canto.TaskModel.prototype, 'save');
          view.createTask(e);
          expect(Canto.TaskModel.prototype.save.calls.argsFor(0)[0].status).toEqual('Blocking');
        });

        it('adds the new task to the beginning of the collection', function() {
          spyOn(collection, 'unshift');
          view.createTask(e);
          expect(collection.unshift).toHaveBeenCalled();
        });

        it('triggers the newTask event', function() {
          pending('Figure out if the app actually needs to do this');
          var spy = jasmine.createSpy('spy');
          view.on('newTask', spy);
          view.createTask(e);
          expect(spy).toHaveBeenCalled();
          view.off();
        });

        it('resets the form', function() {
          spyOn(view.$el[0], 'reset');
          view.createTask(e);
          expect(view.$el[0].reset).toHaveBeenCalled();
        });
      });

      context('when no title given', function() {
        it('doesn\'t create a task', function() {
          spyOn(Canto.Utils, 'getAttributes').and.returnValue({title: ''});
          spyOn(collection, 'create');
          spyOn(Canto.TaskModel.prototype, 'initialize');
          view.createTask(e);
          expect(collection.create).not.toHaveBeenCalled();
          expect(Canto.TaskModel.prototype.initialize).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('special methods', function() {
    describe('isA', function() {
      it('returns true with arg \'QuickAddFormView\'', function() {
        expect(view.isA('QuickAddFormView')).toBe(true);
      });

      it('returns true with arg \'QuickAddForm\'', function() {
        expect(view.isA('QuickAddForm')).toBe(true);
      });

      it('returns true with arg \'TaskCollectionView\'', function() {
        expect(view.isA('TaskCollectionView')).toBe(true);
      });

      it('returns true with arg \'TaskCreateFormView\'', function() {
        expect(view.isA('TaskCreateFormView')).toBe(true);
      });

      it('returns true with arg \'TaskForm\'', function() {
        expect(view.isA('TaskFormView')).toBe(true);
      });

      it('returns false with other arg', function() {
        expect(view.isA('Backbone.Model')).toBe(false);
      });
    });
  });
});