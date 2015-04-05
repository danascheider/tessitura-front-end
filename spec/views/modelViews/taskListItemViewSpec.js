// NOTE: The following callbacks are tested partially or completely
//       in the listItemUISpec.js file:
//       - hideEditForm
//       - showEditForm
//       - hideEditIcons
//       - showEditIcons
//       - markComplete
//       - toggleTaskDetails
//       - render

require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/env.js');

var SUT = require(process.cwd() + '/js/views/modelViews/taskViews/taskListItemView.js');

var matchers  = require('jasmine-jquery-matchers'),
    custom    = require(process.cwd() + '/spec/support/matchers/toBeA.js');
    TaskModel = require(process.cwd() + '/js/models/taskModel.js'),
    ModelView = require(process.cwd() + '/js/views/modelViews/taskViews/taskModelView.js'),
    context   = describe,
    fcontext  = fdescribe;

// FIX: Need to give serious consideration to testing styles. If styles are not
//      the responsibility of the view, they should not be tested by the view
//      spec. If they are the responsibility of the view, they should be defined
//      in the view. 

describe('List Item Task View', function() {
  var view, e;

  var task = new TaskModel({title: 'Finish writing test suite', status: 'New', priority: 'Normal'});

  beforeEach(function() { 
    jasmine.addMatchers(matchers);
    jasmine.addMatchers(custom);
    view = new SUT({model: task}); 
  });

  afterEach(function() { view.remove(); });
  afterAll(function() { view = null; });

  describe('constructor', function() {
    it('sets the model #travis', function() {
      expect(view.model).toBe(task);
    });

    it('doesn\'t call render #travis', function() {
      spyOn(SUT.prototype, 'render');
      var newView = new SUT({model: task});
      expect(SUT.prototype.render).not.toHaveBeenCalled();
    });

    it('creates a model view #travis', function() {
      expect((view.modelView).klass).toEqual('TaskModelView');
    });

    it('creates an edit form #travis', function() {
      pending('Need to implement the edit form view');
    });
  });

  describe('properties', function() {
    it('is a Canto.View', function() {
      expect(view).toBeA('Canto.View');
    });

    it('has klass TaskListItemView', function() {
      expect(view.klass).toBe('TaskListItemView');
    });

    it('has family Canto.View', function() {
      expect(view.family).toBe('Canto.View');
    });

    it('has superFamily Backbone.View', function() {
      expect(view.superFamily).toBe('Backbone.View');
    });
  });

  describe('el', function() {
    beforeEach(function() { view.render(); });

    it('is an li #travis', function() {
      expect(view.$el).toHaveTag('li');
    });

    it('has class .task-list-item #travis', function() {
      expect(view.$el).toHaveClass('task-list-item');
    });
  });

  describe('elements', function() {
    beforeEach(function() { view.render(); });

    it('has a mark-complete checkbox #travis', function() {
      expect(view.$('i[title="Mark complete"]')).toExist();
    });

    it('doesn\'t display its edit form by default #travis', function() {
      pending('Need to implement the edit form view');
    });

    describe('draggable functionality', function() {
      it('has class ui-widget-content #travis', function() {
        expect(view.$el).toHaveClass('ui-widget-content');
      });

      it('has class .ui-draggable #travis', function() {
        expect(view.$el).toHaveClass('ui-draggable');
      });
    });

    describe('edit icon', function() {
      it('is present #travis', function() {
        expect(view.$('i[title="Edit"]')).toExist();
      });
    });

    describe('delete icon', function() {
      it('is present #travis', function() {
        expect(view.$('i[title="Delete"]')).toExist();
      });
    });

    describe('backlog icon', function() {
      it('is present #travis', function() {
        expect(view.$('i[title="Backlog"]')).toExist();
      });
    });
  });

  describe('events', function() {
    var newView; 

    beforeEach(function() {
      spyOn(SUT.prototype, 'showEditForm');
      spyOn(SUT.prototype, 'markComplete');
      spyOn(SUT.prototype, 'deleteTask');
      spyOn(SUT.prototype, 'backlogTask');
      spyOn(SUT.prototype, 'toggleTaskDetails');
      spyOn(SUT.prototype, 'showEditIcons');
      spyOn(SUT.prototype, 'hideEditIcons');
      newView = new SUT({model: task});
      newView.render();
    });

    describe('click edit icon', function() {
      it('calls showEditForm #travis', function() {
        newView.$('i[title=Edit]').click();
        expect(SUT.prototype.showEditForm).toHaveBeenCalled();
      });
    });

    describe('click markComplete checkbox', function() {
      it('calls markComplete #travis', function() {
        newView.$('.fa-square-o').click();
        expect(SUT.prototype.markComplete).toHaveBeenCalled();
      });
    });

    describe('click delete icon', function() {
      it('calls deleteTask #travis', function() {
        newView.$('i[title=Delete]').click();
        expect(SUT.prototype.deleteTask).toHaveBeenCalled();
      });
    });

    describe('click backlog icon', function() {
      it('calls backlogTask #travis', function() {
        newView.$('i[title=Backlog]').click();
        expect(SUT.prototype.backlogTask).toHaveBeenCalled();
      });
    });

    describe('click task title', function() {
      it('calls toggleTaskDetails #travis', function() {
        newView.$('a.task-title').click();
        expect(SUT.prototype.toggleTaskDetails).toHaveBeenCalled();
      });
    });

    describe('click reset button', function() {
      it('calls hideEditForm #travis', function() {
        pending('Need to implement the edit form view');
      });
    });

    describe('mouseenter', function() {
      it('calls showEditIcons #travis', function() {
        newView.$el.mouseenter();
        expect(SUT.prototype.showEditIcons).toHaveBeenCalled();
      });
    });

    describe('mouseleave', function() {
      it('calls hideEditIcons #travis', function() {
        newView.$el.mouseleave();
        expect(SUT.prototype.hideEditIcons).toHaveBeenCalled();
      });
    });

    describe('done event on edit form', function() {
      it('calls render #travis', function() {
        pending('Need to implement the edit form view');
      });
    });
  });

  describe('event callbacks', function() {
    describe('backlogTask', function() {
      beforeEach(function() {

        // It is necessary to stub both $.ajax and task.save, because otherwise
        // the program waits for the server to respond, which, of course, it won't.

        spyOn($, 'ajax');
        spyOn(task, 'save').and.callThrough();
        view.backlogTask();
      });

      afterEach(function() { task.unset('backlog'); });

      it('changes the task\'s backlog status to true #travis', function() {
        expect(task.get('backlog')).toBe(true);
      });

      it('saves the task #travis', function() {
        expect(task.save).toHaveBeenCalled();
      });
    });

    describe('deleteTask', function() {
      it('destroys the task #travis', function() {
        spyOn(task, 'destroy');
        view.deleteTask();
        expect(task.destroy).toHaveBeenCalled();
      });
    });

    describe('hideEditForm', function() {
      it('removes the edit form from the DOM #travis', function() {
        pending('Define the edit form view');
        spyOn(view.editForm, 'remove');
        view.hideEditForm();
        expect(view.editForm.remove).toHaveBeenCalled();
      });
    });

    describe('markComplete', function() {
      it('marks the task complete and saves #travis', function() {
        spyOn(task, 'save');
        view.markComplete();
        expect(task.save.calls.argsFor(0)[0]).toEqual({status: 'Complete'});
      });
    });

    describe('toggleTaskDetails', function() {
      it('calls preventDefault #travis', function() {
        var e = $.Event({target: view.$('.task-title')});
        spyOn(e, 'preventDefault');
        view.toggleTaskDetails(e);
        expect(e.preventDefault).toHaveBeenCalled();
      });
    });
  });

  describe('special functions', function() {
    describe('changePosition', function() {
      it('removes inline styles #travis', function() {
        view.changePosition();
        expect(view.$el.attr('style')).not.toExist();
      });

      it('renders the view #travis', function() {
        spyOn(view, 'render');
        view.changePosition();
        expect(view.render).toHaveBeenCalled();
      });
    });

    describe('configureDraggable', function() {
      beforeEach(function() {
        spyOn(view.$el, 'draggable');
        view.configureDraggable();
      });

      it('makes the view draggable #travis', function() {
        expect(view.$el.draggable).toHaveBeenCalled();
      });

      it('confines the view to its parent list #travis', function() {
        expect(view.$el.draggable.calls.argsFor(0)[0].containment).toEqual('parent');
      });

      it('connects to the sortable task list #travis', function() {
        expect(view.$el.draggable.calls.argsFor(0)[0].connectToSortable).toEqual('.task-list');
      });
    });

    describe('isA', function() {
      it('returns true with arg \'TaskListItemView\' #travis', function() {
        expect(view.isA('TaskListItemView')).toBe(true);
      });

      it('returns true with arg \'ListItemView\' #travis', function() {
        expect(view.isA('ListItemView')).toBe(true);
      });

      it('returns false with other arg #travis', function() {
        expect(view.isA('Backbone.Router')).toBe(false);
      });
    });
  });

  describe('core view functions', function() {
    describe('remove', function() {
      it('removes the model view #travis', function() {
        spyOn(view.modelView, 'remove');
        view.remove();
        expect(view.modelView.remove).toHaveBeenCalled();
      });

      it('removes itself #travis', function() {
        spyOn(Backbone.View.prototype, 'remove');
        view.remove();
        expect(Backbone.View.prototype.remove).toHaveBeenCalled();
      });
    });

    describe('render()', function() {
      it('configures the draggable property', function() {
        spyOn(view, 'configureDraggable', function() {
          view.render();
          expect(view.configureDraggable).toHaveBeenCalled();
        });
      });

      it('renders the model view', function() {
        spyOn(view.modelView, 'render');
        view.render();
        expect(view.modelView.render).toHaveBeenCalled();
      });
    });
  });
});