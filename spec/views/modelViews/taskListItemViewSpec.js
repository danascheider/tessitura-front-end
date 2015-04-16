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
require(process.cwd() + '/js/canto.js');
require(process.cwd() + '/spec/support/env.js');

var matchers  = require('jasmine-jquery-matchers'),
    fixtures  = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context   = describe,
    fcontext  = fdescribe;

describe('List Item Task View', function() {
  var view, e;

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  });

  beforeEach(function() { 
    jasmine.addMatchers(matchers);
    view = new Canto.TaskListItemView({model: task1}); 
  });

  afterEach(function() { view.remove(); });

  afterAll(function() { 
    view   = null; 
    global = _.omit(global, fixtures);
  });

  describe('constructor', function() {
    it('sets the model #modelView #view #travis', function() {
      expect(view.model).toBe(task1);
    });

    it('doesn\'t call render #modelView #view #travis', function() {
      spyOn(Canto.TaskListItemView.prototype, 'render');
      var newView = new Canto.TaskListItemView({model: task1});
      expect(Canto.TaskListItemView.prototype.render).not.toHaveBeenCalled();
    });

    it('creates a model view #modelView #view #travis', function() {
      expect((view.modelView).klass).toEqual('TaskModelView');
    });

    it('includes the model view in its childViews array', function() {
      expect(view.childViews).toContain(view.modelView);
    });

    it('creates an edit form #modelView #view #travis', function() {
      pending('Need to implement the edit form view');
    });
  });

  describe('properties', function() {
    it('is a Canto.View #modelView #view #travis', function() {
      expect(view).toBeA('Canto.View');
    });

    it('has klass TaskListItemView #modelView #view #travis', function() {
      expect(view.klass).toBe('TaskListItemView');
    });

    it('has family Canto.View #modelView #view #travis', function() {
      expect(view.family).toBe('Canto.View');
    });

    it('has superFamily Backbone.View #modelView #view #travis', function() {
      expect(view.superFamily).toBe('Backbone.View');
    });
  });

  describe('el', function() {
    beforeEach(function() { view.render(); });

    it('is an li #modelView #view #travis', function() {
      expect(view.$el).toHaveTag('li');
    });

    it('has class .task-list-item #modelView #view #travis', function() {
      expect(view.$el).toHaveClass('task-list-item');
    });
  });

  describe('elements', function() {
    beforeEach(function() { view.render(); });

    it('has a mark-complete checkbox #modelView #view #travis', function() {
      expect(view.$('i[title="Mark complete"]')).toExist();
    });

    it('doesn\'t display its edit form by default #modelView #view #travis', function() {
      pending('Need to implement the edit form view');
    });

    describe('draggable functionality', function() {
      it('has class ui-widget-content #modelView #view #travis', function() {
        expect(view.$el).toHaveClass('ui-widget-content');
      });

      it('has class .ui-draggable #modelView #view #travis', function() {
        expect(view.$el).toHaveClass('ui-draggable');
      });
    });

    describe('edit icon', function() {
      it('is present #modelView #view #travis', function() {
        expect(view.$('i[title="Edit"]')).toExist();
      });
    });

    describe('delete icon', function() {
      it('is present #modelView #view #travis', function() {
        expect(view.$('i[title="Delete"]')).toExist();
      });
    });

    describe('backlog icon', function() {
      it('is present #modelView #view #travis', function() {
        expect(view.$('i[title="Backlog"]')).toExist();
      });
    });
  });

  describe('events', function() {
    var newView; 

    beforeEach(function() {
      spyOn(Canto.TaskListItemView.prototype, 'showEditForm');
      spyOn(Canto.TaskListItemView.prototype, 'markComplete');
      spyOn(Canto.TaskListItemView.prototype, 'deleteTask');
      spyOn(Canto.TaskListItemView.prototype, 'backlogTask');
      spyOn(Canto.TaskListItemView.prototype, 'toggleTaskDetails');
      spyOn(Canto.TaskListItemView.prototype, 'showEditIcons');
      spyOn(Canto.TaskListItemView.prototype, 'hideEditIcons');
      newView = new Canto.TaskListItemView({model: task1});
      newView.render();
    });

    describe('click edit icon', function() {
      it('calls showEditForm #modelView #view #travis', function() {
        newView.$('i[title=Edit]').click();
        expect(Canto.TaskListItemView.prototype.showEditForm).toHaveBeenCalled();
      });
    });

    describe('click markComplete checkbox', function() {
      it('calls markComplete #modelView #view #travis', function() {
        newView.$('.fa-square-o').click();
        expect(Canto.TaskListItemView.prototype.markComplete).toHaveBeenCalled();
      });
    });

    describe('click delete icon', function() {
      it('calls deleteTask #modelView #view #travis', function() {
        newView.$('i[title=Delete]').click();
        expect(Canto.TaskListItemView.prototype.deleteTask).toHaveBeenCalled();
      });
    });

    describe('click backlog icon', function() {
      it('calls backlogTask #modelView #view #travis', function() {
        newView.$('i[title=Backlog]').click();
        expect(Canto.TaskListItemView.prototype.backlogTask).toHaveBeenCalled();
      });
    });

    describe('click task title', function() {
      it('calls toggleTaskDetails() #modelView #view #travis', function() {
        newView.$('a.task-title').click();
        expect(Canto.TaskListItemView.prototype.toggleTaskDetails).toHaveBeenCalled();
      });
    });

    describe('click reset button', function() {
      it('calls hideEditForm() #modelView #view #travis', function() {
        pending('Need to implement the edit form view');
      });
    });

    describe('mouseenter', function() {
      it('calls showEditIcons() #modelView #view #travis', function() {
        newView.$el.mouseenter();
        expect(Canto.TaskListItemView.prototype.showEditIcons).toHaveBeenCalled();
      });
    });

    describe('mouseleave', function() {
      it('calls hideEditIcons() #modelView #view #travis', function() {
        newView.$el.mouseleave();
        expect(Canto.TaskListItemView.prototype.hideEditIcons).toHaveBeenCalled();
      });
    });

    describe('done event on edit form', function() {
      it('calls render #modelView #view #travis', function() {
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
        spyOn(task1, 'save').and.callThrough();
        view.backlogTask();
      });

      afterEach(function() { task1.unset('backlog'); });

      it('changes the task\'s backlog status to true #modelView #view #travis', function() {
        expect(task1.get('backlog')).toBe(true);
      });

      it('saves the task #modelView #view #travis', function() {
        expect(task1.save).toHaveBeenCalled();
      });
    });

    describe('deleteTask', function() {
      it('destroys the task #modelView #view #travis', function() {
        spyOn(task1, 'destroy');
        view.deleteTask();
        expect(task1.destroy).toHaveBeenCalled();
      });
    });

    describe('hideEditForm', function() {
      it('removes the edit form from the DOM #modelView #view #travis', function() {
        pending('Define the edit form view');
        spyOn(view.editForm, 'remove');
        view.hideEditForm();
        expect(view.editForm.remove).toHaveBeenCalled();
      });
    });

    describe('markComplete', function() {
      it('marks the task complete and saves #modelView #view #travis', function() {
        spyOn(task1, 'save');
        view.markComplete();
        expect(task1.save.calls.argsFor(0)[0]).toEqual({status: 'Complete'});
      });
    });

    describe('toggleTaskDetails', function() {
      it('calls preventDefault #modelView #view #travis', function() {
        var e = $.Event({target: view.$('.task-title')});
        spyOn(e, 'preventDefault');
        view.toggleTaskDetails(e);
        expect(e.preventDefault).toHaveBeenCalled();
      });
    });
  });

  describe('special functions', function() {
    describe('configureDraggable', function() {
      beforeEach(function() {
        spyOn(view.$el, 'draggable');
        view.configureDraggable();
      });

      it('makes the view draggable #modelView #view #travis', function() {
        expect(view.$el.draggable).toHaveBeenCalled();
      });

      it('confines the view to its parent list #modelView #view #travis', function() {
        expect(view.$el.draggable.calls.argsFor(0)[0].containment).toEqual('parent');
      });

      it('connects to the sortable task list #modelView #view #travis', function() {
        expect(view.$el.draggable.calls.argsFor(0)[0].connectToSortable).toEqual('.task-list');
      });
    });

    describe('isA', function() {
      it('returns true with arg \'TaskListItemView\' #modelView #view #travis', function() {
        expect(view.isA('TaskListItemView')).toBe(true);
      });

      it('returns true with arg \'ListItemView\' #modelView #view #travis', function() {
        expect(view.isA('ListItemView')).toBe(true);
      });

      it('returns false with other arg #modelView #view #travis', function() {
        expect(view.isA('Backbone.Router')).toBe(false);
      });
    });
  });

  describe('core view functions', function() {
    describe('remove()', function() {
      it('removes the model view #modelView #view #travis', function() {
        spyOn(view.modelView, 'remove');
        view.remove();
        expect(view.modelView.remove).toHaveBeenCalled();
      });

      it('removes itself #modelView #view #travis', function() {
        spyOn(Backbone.View.prototype, 'remove');
        view.remove();
        expect(Backbone.View.prototype.remove).toHaveBeenCalled();
      });
    });

    describe('render()', function() {
      it('configures the draggable property #modelView #view #travis', function() {
        spyOn(view, 'configureDraggable', function() {
          view.render();
          expect(view.configureDraggable).toHaveBeenCalled();
        });
      });

      it('renders the model view #modelView #view #travis', function() {
        spyOn(view.modelView, 'render');
        view.render();
        expect(view.modelView.render).toHaveBeenCalled();
      });
    });
  });
});