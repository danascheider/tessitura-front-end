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

// FIX: Need to give serious consideration to testing styles. If styles are not
//      the responsibility of the view, they should not be tested by the view
//      spec. If they are the responsibility of the view, they should be defined
//      in the view. 

fdescribe('List Item Task View', function() {
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
    it('#travis sets the model', function() {
      expect(view.model).toBe(task1);
    });

    it('#travis doesn\'t call render', function() {
      spyOn(Canto.TaskListItemView.prototype, 'render');
      var newView = new Canto.TaskListItemView({model: task1});
      expect(Canto.TaskListItemView.prototype.render).not.toHaveBeenCalled();
    });

    it('#travis creates a model view', function() {
      expect((view.modelView).klass).toEqual('TaskModelView');
    });

    it('#travis creates an edit form', function() {
      pending('Need to implement the edit form view');
    });
  });

  describe('properties', function() {
    it('#travis is a Canto.View', function() {
      expect(view).toBeA('Canto.View');
    });

    it('#travis has klass TaskListItemView', function() {
      expect(view.klass).toBe('TaskListItemView');
    });

    it('#travis has family Canto.View', function() {
      expect(view.family).toBe('Canto.View');
    });

    it('#travis has superFamily Backbone.View', function() {
      expect(view.superFamily).toBe('Backbone.View');
    });
  });

  describe('el', function() {
    beforeEach(function() { view.render(); });

    it('#travis is an li', function() {
      expect(view.$el).toHaveTag('li');
    });

    it('#travis has class .task-list-item', function() {
      expect(view.$el).toHaveClass('task-list-item');
    });
  });

  describe('elements', function() {
    beforeEach(function() { view.render(); });

    it('#travis has a mark-complete checkbox', function() {
      expect(view.$('i[title="Mark complete"]')).toExist();
    });

    it('#travis doesn\'t display its edit form by default', function() {
      pending('Need to implement the edit form view');
    });

    describe('draggable functionality', function() {
      it('#travis has class ui-widget-content', function() {
        expect(view.$el).toHaveClass('ui-widget-content');
      });

      it('#travis has class .ui-draggable', function() {
        expect(view.$el).toHaveClass('ui-draggable');
      });
    });

    describe('edit icon', function() {
      it('#travis is present', function() {
        expect(view.$('i[title="Edit"]')).toExist();
      });
    });

    describe('delete icon', function() {
      it('#travis is present', function() {
        expect(view.$('i[title="Delete"]')).toExist();
      });
    });

    describe('backlog icon', function() {
      it('#travis is present', function() {
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
      it('#travis calls showEditForm', function() {
        newView.$('i[title=Edit]').click();
        expect(Canto.TaskListItemView.prototype.showEditForm).toHaveBeenCalled();
      });
    });

    describe('click markComplete checkbox', function() {
      it('#travis calls markComplete', function() {
        newView.$('.fa-square-o').click();
        expect(Canto.TaskListItemView.prototype.markComplete).toHaveBeenCalled();
      });
    });

    describe('click delete icon', function() {
      it('#travis calls deleteTask', function() {
        newView.$('i[title=Delete]').click();
        expect(Canto.TaskListItemView.prototype.deleteTask).toHaveBeenCalled();
      });
    });

    describe('click backlog icon', function() {
      it('#travis calls backlogTask', function() {
        newView.$('i[title=Backlog]').click();
        expect(Canto.TaskListItemView.prototype.backlogTask).toHaveBeenCalled();
      });
    });

    describe('click task title', function() {
      it('#travis calls toggleTaskDetails', function() {
        newView.$('a.task-title').click();
        expect(Canto.TaskListItemView.prototype.toggleTaskDetails).toHaveBeenCalled();
      });
    });

    describe('click reset button', function() {
      it('#travis calls hideEditForm', function() {
        pending('Need to implement the edit form view');
      });
    });

    describe('mouseenter', function() {
      it('#travis calls showEditIcons', function() {
        newView.$el.mouseenter();
        expect(Canto.TaskListItemView.prototype.showEditIcons).toHaveBeenCalled();
      });
    });

    describe('mouseleave', function() {
      it('#travis calls hideEditIcons', function() {
        newView.$el.mouseleave();
        expect(Canto.TaskListItemView.prototype.hideEditIcons).toHaveBeenCalled();
      });
    });

    describe('done event on edit form', function() {
      it('#travis calls render', function() {
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

      it('#travis changes the task\'s backlog status to true', function() {
        expect(task1.get('backlog')).toBe(true);
      });

      it('#travis saves the task', function() {
        expect(task1.save).toHaveBeenCalled();
      });
    });

    describe('deleteTask', function() {
      it('#travis destroys the task', function() {
        spyOn(task1, 'destroy');
        view.deleteTask();
        expect(task1.destroy).toHaveBeenCalled();
      });
    });

    describe('hideEditForm', function() {
      it('#travis removes the edit form from the DOM', function() {
        pending('Define the edit form view');
        spyOn(view.editForm, 'remove');
        view.hideEditForm();
        expect(view.editForm.remove).toHaveBeenCalled();
      });
    });

    describe('markComplete', function() {
      it('#travis marks the task complete and saves', function() {
        spyOn(task1, 'save');
        view.markComplete();
        expect(task1.save.calls.argsFor(0)[0]).toEqual({status: 'Complete'});
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
    describe('configureDraggable', function() {
      beforeEach(function() {
        spyOn(view.$el, 'draggable');
        view.configureDraggable();
      });

      it('#travis makes the view draggable', function() {
        expect(view.$el.draggable).toHaveBeenCalled();
      });

      it('#travis confines the view to its parent list', function() {
        expect(view.$el.draggable.calls.argsFor(0)[0].containment).toEqual('parent');
      });

      it('#travis connects to the sortable task list', function() {
        expect(view.$el.draggable.calls.argsFor(0)[0].connectToSortable).toEqual('.task-list');
      });
    });

    describe('isA', function() {
      it('#travis returns true with arg \'TaskListItemView\'', function() {
        expect(view.isA('TaskListItemView')).toBe(true);
      });

      it('#travis returns true with arg \'ListItemView\'', function() {
        expect(view.isA('ListItemView')).toBe(true);
      });

      it('#travis returns false with other arg', function() {
        expect(view.isA('Backbone.Router')).toBe(false);
      });
    });
  });

  describe('core view functions', function() {
    describe('remove', function() {
      it('#travis removes the model view', function() {
        spyOn(view.modelView, 'remove');
        view.remove();
        expect(view.modelView.remove).toHaveBeenCalled();
      });

      it('#travis removes itself', function() {
        spyOn(Backbone.View.prototype, 'remove');
        view.remove();
        expect(Backbone.View.prototype.remove).toHaveBeenCalled();
      });
    });

    describe('render()', function() {
      it('#travis configures the draggable property', function() {
        spyOn(view, 'configureDraggable', function() {
          view.render();
          expect(view.configureDraggable).toHaveBeenCalled();
        });
      });

      it('#travis renders the model view', function() {
        spyOn(view.modelView, 'render');
        view.render();
        expect(view.modelView.render).toHaveBeenCalled();
      });
    });
  });
});