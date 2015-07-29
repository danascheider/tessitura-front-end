/* istanbul ignore <require> */
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

/* istanbul ignore next */
var matchers  = require('jasmine-jquery-matchers'),
    fixtures  = require(process.cwd() + '/spec/support/fixtures/fixtures.js');
    context   = describe,
    ccontext  = ddescribe;

/* Task List Item View Spec
/****************************************************************************************/

/* istanbul ignore next */
describe('TaskListItemView', function() {
  var view, html, spy, e;

  beforeEach(function() {
    this.addMatchers(matchers);
    _.extend(global, fixtures);
  });

  afterEach(function() { 
    restoreFixtures();
    view && view.destroy(); 
    _.omit(global, fixtures);
  });

  describe('constructor', function() {
    beforeEach(function() {
      spyOn(Tessitura.TaskListItemView.prototype, 'render');
      view = new Tessitura.TaskListItemView({model: task1});
    });

    it('sets the model #taskListItemView #modelView #view #travis', function() {
      expect(view.model).toBe(task1);
    });

    it('doesn\'t call render #taskListItemView #modelView #view #travis', function() {
      expect(Tessitura.TaskListItemView.prototype.render).not.toHaveBeenCalled();
    });
  });

  describe('el', function() {
    beforeEach(function() { 
      view = view || new Tessitura.TaskListItemView({model: task1});
      view.render(); 
    });

    it('is an li #taskListItemView #modelView #view #travis', function() {
      expect(view.$el).toHaveTag('li');
    });

    it('has class .task-list-item #taskListItemView #modelView #view #travis', function() {
      expect(view.$el).toHaveClass('task-list-item');
    });
  });

  describe('elements', function() {
    beforeEach(function() {
      task1.set('deadline', new Date(2015, 8, 28));
      task1.set('description', 'Test Tessitura\'s front-end functionality')
      view = view || new Tessitura.TaskListItemView({model: task1});
      view.render();
    });

    it('displays the task\'s title #taskListItemView #modelView #view #travis', function() {
      expect(view.$('a.task-title').html()).toEqual('Task 1');
    });

    it('displays the task\'s deadline #taskListItemView #modelView #view #travis', function() {
      expect(view.$('table.task-details').html()).toMatch('Monday, September 28, 2015');
    });

    it('displays the task\'s priority #taskListItemView #modelView #view #travis', function() {
      expect(view.$('.task-priority-row').html()).toMatch('Low');
    });

    it('displays the task\'s status #taskListItemView #modelView #view #travis', function() {
      expect(view.$('.task-status-row').html()).toMatch('New');
    });

    it('displays the task\'s description #taskListItemView #modelView #view #travis', function() {
      expect(view.$('.task-description-row').html()).toMatch("Test Tessitura's front-end functionality");
    });

    it('does not display blank fields #taskListItemView #modelView #view #travis', function() {
      task1.unset('deadline');
      view.render();
      expect(view.$('tr.task-deadline-row').length).toEqual(0);
      task1.set('deadline', new Date(2015, 8, 28));
    });

    it('has a mark-complete checkbox #taskListItemView #modelView #view #travis', function() {
      expect(view.$('i[title="Mark complete"]')).toExist();
    });

    describe('draggable functionality', function() {
      it('has class ui-widget-content #taskListItemView #modelView #view #travis', function() {
        expect(view.$el).toHaveClass('ui-widget-content');
      });

      it('has class .ui-draggable #taskListItemView #modelView #view #travis', function() {
        expect(view.$el).toHaveClass('ui-draggable');
      });
    });

    describe('edit icon', function() {
      it('is present #taskListItemView #modelView #view #travis', function() {
        expect(view.$('i[title="Edit"]')).toExist();
      });
    });

    describe('delete icon', function() {
      it('is present #taskListItemView #modelView #view #travis', function() {
        expect(view.$('i[title="Delete"]')).toExist();
      });
    });

    describe('backlog icon', function() {
      it('is present #taskListItemView #modelView #view #travis', function() {
        expect(view.$('i[title="Backlog"]')).toExist();
      });
    });
  });

  describe('events', function() {
    beforeEach(function() {
      var arr = ['showEditForm', 'markComplete', 'deleteTask', 'backlogTask', 'toggleTaskDetails', 'showEditIcons', 'hideEditIcons'];
      _.each(arr, function(method) { spyOn(Tessitura.TaskListItemView.prototype, method); });

      newView = new Tessitura.TaskListItemView({model: task1});
      newView.render();
    });

    afterEach(function() { newView.destroy(); });

    describe('click edit icon', function() {
      it('calls showEditForm #taskListItemView #modelView #view #travis', function() {
        newView.$('i[title=Edit]').click();
        expect(Tessitura.TaskListItemView.prototype.showEditForm).toHaveBeenCalled();
      });
    });

    describe('click markComplete checkbox', function() {
      it('calls markComplete #taskListItemView #modelView #view #travis', function() {
        newView.$('.fa-square-o').click();
        expect(Tessitura.TaskListItemView.prototype.markComplete).toHaveBeenCalled();
      });
    });

    describe('click delete icon', function() {
      it('calls deleteTask #taskListItemView #modelView #view #travis', function() {
        newView.$('i[title=Delete]').click();
        expect(Tessitura.TaskListItemView.prototype.deleteTask).toHaveBeenCalled();
      });
    });

    describe('click backlog icon', function() {
      it('calls backlogTask #taskListItemView #modelView #view #travis', function() {
        newView.$('i[title=Backlog]').click();
        expect(Tessitura.TaskListItemView.prototype.backlogTask).toHaveBeenCalled();
      });
    });

    describe('click task title', function() {
      it('calls toggleTaskDetails() #taskListItemView #modelView #view #travis', function() {
        newView.$('a.task-title').click();
        expect(Tessitura.TaskListItemView.prototype.toggleTaskDetails).toHaveBeenCalled();
      });
    });

    describe('mouseenter', function() {
      it('calls showEditIcons() #taskListItemView #modelView #view #travis', function() {
        newView.$el.mouseenter();
        expect(Tessitura.TaskListItemView.prototype.showEditIcons).toHaveBeenCalled();
      });
    });

    describe('mouseleave', function() {
      it('calls hideEditIcons() #taskListItemView #modelView #view #travis', function() {
        newView.$el.mouseleave();
        expect(Tessitura.TaskListItemView.prototype.hideEditIcons).toHaveBeenCalled();
      });
    });
  });

  describe('event callbacks', function() {
    beforeEach(function() {
      view = view || new Tessitura.TaskListItemView({model: task1});
      $('body').html(view.render().$el);
    });

    describe('backlogTask', function() {
      beforeEach(function() {
        spyOn(task1, 'save').andCallFake(function(args) { args.success && args.success(task1); });
        view.backlogTask();
      });

      it('saves the task #taskListItemView #modelView #view #travis', function() {
        expect(task1.save.calls[0].args).toContain({backlog: true});
      });
    });

    describe('deleteTask', function() {
      it('destroys the task #taskListItemView #modelView #view #travis', function() {
        spyOn(task1, 'destroy');
        view.deleteTask();
        expect(task1.destroy).toHaveBeenCalled();
      });
    });

    describe('hideEditIcons', function() {
      it('calls hide #taskListItemView #modelView #view #travis', function() {
        spyOn($.prototype, 'hide');
        view.hideEditIcons();
        expect($.prototype.hide).toHaveBeenCalled();
      });
    });

    describe('markComplete', function() {
      it('marks the task complete and saves #taskListItemView #modelView #view #travis', function() {
        spyOn(task1, 'save');
        view.markComplete();
        expect(task1.save.calls[0].args[0]).toEqual({status: 'Complete'});
      });
    });

    describe('renderOnSync', function() {
      beforeEach(function() { spyOn(view, 'render'); });

      context('when not marked complete', function() {
        it('calls the render function #taskListItemView #modelView #view #travis', function() {
          view.renderOnSync();
          expect(view.render).toHaveBeenCalled();
        });
      });

      context('when marked complete', function() {
        it('doesn\'t call render #taskListItemView #modelView #view #travis', function() {
          task1.set('status', 'Complete');
          view.renderOnSync();
          expect(view.render).not.toHaveBeenCalled();
        });
      });
    });

    describe('showEditForm', function() {
      beforeEach(function() {
        spy = jasmine.createSpy();
        view.on('showEditForm', spy);
      });

      afterEach(function() {
        view.off('showEditForm', spy);
      });

      it('triggers the showEditForm event #taskListItemView #modelView #view #travis', function() {
        view.showEditForm();
        expect(spy).toHaveBeenCalledWith(task1);
      });
    });

    describe('showEditIcons', function() {
      it('calls show #taskListItemView #modelView #view #travis', function() {
        spyOn($.prototype, 'show');
        view.showEditIcons();
        expect($.prototype.show).toHaveBeenCalled();
      });
    });

    describe('toggleTaskDetails', function() {
      beforeEach(function() {
        e = $.Event({target: view.$('.task-title')});
      });

      it('calls preventDefault #taskListItemView #modelView #view #travis', function() {
        spyOn(e, 'preventDefault');
        view.toggleTaskDetails(e);
        expect(e.preventDefault).toHaveBeenCalled();
      });

      it('shows the .task-details element #taskListItemView #modelView #view #travis', function() {
        view.toggleTaskDetails(e);
        expect(view.$('.task-details')).toBeInDom();
      });
    });
  });
});