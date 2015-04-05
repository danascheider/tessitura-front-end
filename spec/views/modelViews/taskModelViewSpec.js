require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/env.js');

var SUT = require(process.cwd() + '/js/views/modelViews/taskViews/taskModelView.js');

Backbone.$    = $;

var TaskModel = require(process.cwd() + '/js/models/taskModel.js'),
    matchers  = require('jasmine-jquery-matchers'),
    toBeA     = require(process.cwd() + '/spec/support/matchers/toBeA.js'),
    context   = describe,
    fcontext  = fdescribe;

describe('Task Model View', function() {
  var view;

  var task = new TaskModel({
    title        : 'My Task 1', 
    status       : 'New',
    priority     : 'Low',
    deadline     : new Date(2015, 08, 28),
    description  : "Test Canto's front-end functionality",
    owner_id     : 342,
    task_list_id : 14,
    position     : 1
  });

  beforeEach(function() {
    jasmine.addMatchers(matchers);
    jasmine.addMatchers(toBeA);

    spyOn($, 'cookie').and.callFake(function(name) {
      return name === 'userID' ? 342 : btoa('testuser:testuser');
    });

    view = new SUT({model: task});
  });

  afterAll(function() {
    view.remove();
    view = null;
  });

  describe('constructor', function() {
    it('assigns the model #travis', function() {
      expect(view.model).toBe(task);
    });

    it('does not call render #travis', function() {
      spyOn(SUT.prototype, 'render');
      var newView = new SUT({model: task});
      expect(SUT.prototype.render).not.toHaveBeenCalled();
    });
  });

  describe('properties', function() {
    it('is a Canto.View', function() {
      expect(view).toBeA('Canto.View');
    });

    it('has klass TaskModelView', function() {
      expect(view.klass).toBe('TaskModelView');
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

    it('is a div #travis', function() {
      expect(view.$el[0].tagName).toEqual('DIV');
    });

    it('has class .task-model #travis', function() {
      expect(view.$el[0]).toHaveClass('task-model');
    });
  });

  describe('events', function() {
    describe('save model', function() {
      it('calls renderOnSync #travis', function() {
        spyOn(SUT.prototype, 'renderOnSync');
        var newView = new SUT({model: task});
        task.trigger('sync');
        expect(SUT.prototype.renderOnSync).toHaveBeenCalled();
      });
    });
  });

  describe('view elements', function() {
    beforeEach(function() { view.render(); });

    it('displays the task\'s title #travis', function() {
      expect(view.$('a.task-title').html()).toEqual('My Task 1');
    });

    it('displays the task\'s deadline #travis', function() {
      expect(view.$('table.task-details').html()).toEqual(jasmine.stringMatching('Monday, September 28, 2015'));
    });

    it('displays the task\'s priority #travis', function() {
      expect(view.$('table.task-details').html()).toEqual(jasmine.stringMatching('Low'));
    });

    it('displays the task\'s status #travis', function() {
      expect(view.$('table.task-details').html()).toEqual(jasmine.stringMatching('New'));
    });

    it('displays the task\'s description #travis', function() {
      expect(view.$('table.task-details').html()).toEqual(jasmine.stringMatching("Test Canto's front-end functionality"));
    });

    it('does not display blank fields #travis', function() {
      task.unset('deadline');
      view.render();
      expect(view.$('tr.task-deadline-row').length).toEqual(0);
      task.set('deadline', new Date(2015, 8, 28));
    });
  });

  describe('special functions', function() {
    describe('isA', function() {
      it('returns true with arg \'TaskModelView\' #travis', function() {
        expect(view.isA('TaskModelView')).toBe(true);
      });

      it('returns false with another string #travis', function() {
        expect(view.isA('TaskCollection')).toBe(false);
      });
    });
  });

  describe('event callbacks', function() {
    describe('renderOnSync', function() {
      beforeEach(function() { spyOn(view, 'render'); });

      context('when not marked complete', function() {
        it('calls the render function #travis', function() {
          view.renderOnSync();
          expect(view.render).toHaveBeenCalled();
        });
      });

      context('when marked complete', function() {
        it('doesn\'t call render #travis', function() {
          task.set('status', 'Complete');
          view.renderOnSync();
          expect(view.render).not.toHaveBeenCalled();
          task.set('status', 'New');
        });
      });
    });
  });
});