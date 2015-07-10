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
  var view, newView, e, xhr;

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

    it('has a deadline field #taskEditFormView #modelView #view #travis', function() {
      expect(view.$('input[name=deadline]')).toExist();
    });

    it('has a status field #taskEditFormView #modelView #view #travis', function() {
      expect(view.$('select[name=status]')).toExist();
    });

    it('has a priority field #taskEditFormView #modelView #view #travis', function() {
      expect(view.$('select[name=priority]')).toExist();
    });

    it('has a submit button #taskEditFormView #modelView #view #travis', function() {
      expect(view.$('button[type=submit]')).toExist();
    });
  });

  describe('events', function() {
    describe('submit form', function() {
      it('calls updateTask() #taskEditFormView #modelView #view #travis', function() {
        pending('FUFNR');
        spyOn(Tessitura.TaskEditFormView.prototype, 'updateTask');
        newView = new Tessitura.TaskEditFormView({model: task1});
        newView.render();
        view.$el.submit();
        expect(Tessitura.TaskEditFormView.prototype.updateTask).toHaveBeenCalled();
      });
    });
  });

  describe('event callbacks', function() {
    describe('updateTask()', function() {
      beforeEach(function() {
        view.render();
        e = $.Event('submit', {target: view.$el});
        xhr = new XMLHttpRequest();
        xhr.open('PUT', Tessitura.API.tasks.single(1));
        spyOn($, 'ajax').and.callFake(function(args) { args.success(); });
      });

      context('valid attributes', function() {
        beforeEach(function() {
          spyOn(Tessitura.Utils, 'getAttributes').and.returnValue({title: 'Change the task title', status: 'New', priority: 'Low'});
        });

        it('doesn\'t refresh #taskEditFormView #modelView #view #travis', function() {
          spyOn(e, 'preventDefault');
          view.updateTask(e);
          expect(e.preventDefault).toHaveBeenCalled();
        });

        it('takes the attributes from the form #taskEditFormView #modelView #view #travis', function() {
          view.updateTask(e);
          expect(Tessitura.Utils.getAttributes).toHaveBeenCalled();
        });

        it('calls save on the task #taskEditFormView #modelView #view #travis', function() {
          spyOn(task1, 'save');
          view.updateTask(e);
          expect(task1.save).toHaveBeenCalled();
        });

        it('triggers the hideShade event #taskEditFormView #modelView #view #travis', function(done) {
          spy = jasmine.createSpy();
          view.on('hideShade', spy);
          view.updateTask(e);
          expect(spy).toHaveBeenCalled();
          done();
        });
      });

      context('missing title', function() {
        beforeEach(function() {
          spyOn(Tessitura.Utils, 'getAttributes').and.returnValue({title: '', status: 'New', priority: 'Low'});
        });

        it('doesn\'t refresh #taskEditFormView #modelView #view #travis', function() {
          spyOn(e, 'preventDefault');
          view.updateTask(e);
          expect(e.preventDefault).toHaveBeenCalled();
        });

        it('doesn\'t save the task #taskEditFormView #modelView #view #travis', function() {
          spyOn(task1, 'save');
          view.updateTask(e);
          expect(task1.save).not.toHaveBeenCalled();
        });

        it('adds the .has-error class to the title input #taskEditFormView #modelView #view #travis', function() {
          view.updateTask(e);
          expect(view.$('input[name=title]').closest('tr')).toHaveClass('has-error');
        });
      });
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