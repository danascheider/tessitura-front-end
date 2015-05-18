require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

var matchers  = require('jasmine-jquery-matchers'),
    context   = describe,
    fcontext  = fdescribe;

describe('Task Model View', function() {
  var view, task, newView;

  beforeAll(function() {
    jasmine.addMatchers(matchers);
  });

  beforeEach(function() {
    spyOn($, 'cookie').and.callFake(function(name) {
      return name === 'userID' ? 1 : btoa('testuser:testuser');
    });
  
    task = new Tessitura.TaskModel({id: 1, owner_id: 1, title: 'Task 1', status: 'New', priority: 'Low', position: 1});
    view = new Tessitura.TaskModelView({model: task});
  });

  afterEach(function() {
    task.destroy();
    view.destroy();
  }); 

  afterAll(function() {
    view = null;
  });

  describe('constructor', function() {
    it('assigns the model #modelView #view #travis', function() {
      expect(view.model).toBe(task);
    });

    it('does not call render #modelView #view #travis', function() {
      spyOn(Tessitura.TaskModelView.prototype, 'render');
      newView = new Tessitura.TaskModelView({model: task});
      expect(Tessitura.TaskModelView.prototype.render).not.toHaveBeenCalled();
      newView.destroy();
    });
  });

  describe('properties', function() {
    it('is a Tessitura.View #modelView #view #travis', function() {
      expect(view).toBeA('Tessitura.View');
    });

    it('has klass TaskModelView #modelView #view #travis', function() {
      expect(view.klass).toBe('TaskModelView');
    });

    it('has family Tessitura.View #modelView #view #travis', function() {
      expect(view.family).toBe('Tessitura.View');
    });

    it('has superFamily Backbone.View #modelView #view #travis', function() {
      expect(view.superFamily).toBe('Backbone.View');
    });
  });

  describe('el', function() {
    beforeEach(function() { view.render(); });

    it('is a div #modelView #view #travis', function() {
      expect(view.$el[0].tagName).toEqual('DIV');
    });

    it('has class .task-model #modelView #view #travis', function() {
      expect(view.$el[0]).toHaveClass('task-model');
    });
  });

  describe('events', function() {
    describe('save model', function() {
      it('calls renderOnSync #modelView #view #travis', function() {
        spyOn(Tessitura.TaskModelView.prototype, 'renderOnSync');
        newView = new Tessitura.TaskModelView({model: task});
        task.trigger('sync');
        expect(Tessitura.TaskModelView.prototype.renderOnSync).toHaveBeenCalled();
        newView.destroy();
      });
    });
  });

  describe('view elements', function() {
    beforeEach(function() { 
      task.set('deadline', new Date(2015, 8, 28));
      task.set('description', 'Test Tessitura\'s front-end functionality')
      view.render(); 
    });

    it('displays the task\'s title #modelView #view #travis', function() {
      expect(view.$('a.task-title').html()).toEqual('Task 1');
    });

    it('displays the task\'s deadline #modelView #view #travis', function() {
      expect(view.$('table.task-details').html()).toEqual(jasmine.stringMatching('Monday, September 28, 2015'));
    });

    it('displays the task\'s priority #modelView #view #travis', function() {
      expect(view.$('.task-priority-row').html()).toEqual(jasmine.stringMatching('Low'));
    });

    it('displays the task\'s status #modelView #view #travis', function() {
      expect(view.$('.task-status-row').html()).toEqual(jasmine.stringMatching('New'));
    });

    it('displays the task\'s description #modelView #view #travis', function() {
      expect(view.$('.task-description-row').html()).toEqual(jasmine.stringMatching("Test Tessitura's front-end functionality"));
    });

    it('does not display blank fields #modelView #view #travis', function() {
      task.unset('deadline');
      view.render();
      expect(view.$('tr.task-deadline-row').length).toEqual(0);
      task.set('deadline', new Date(2015, 8, 28));
    });
  });

  describe('special functions', function() {
    describe('isA', function() {
      it('returns true with arg \'TaskModelView\' #modelView #view #travis', function() {
        expect(view.isA('TaskModelView')).toBe(true);
      });

      it('returns false with another string #modelView #view #travis', function() {
        expect(view.isA('TaskCollection')).toBe(false);
      });
    });
  });

  describe('event callbacks', function() {
    describe('renderOnSync', function() {
      beforeEach(function() { spyOn(view, 'render'); });

      context('when not marked complete', function() {
        it('calls the render function #modelView #view #travis', function() {
          view.renderOnSync();
          expect(view.render).toHaveBeenCalled();
        });
      });

      context('when marked complete', function() {
        it('doesn\'t call render #modelView #view #travis', function() {
          task.set('status', 'Complete');
          view.renderOnSync();
          expect(view.render).not.toHaveBeenCalled();
        });
      });
    });
  });
});