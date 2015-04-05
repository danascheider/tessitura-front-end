require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/env.js');

var SUT = require(process.cwd() + '/js/models/taskModel.js');

var ProtectedResource = require(process.cwd() + '/js/models/protectedResourceModel.js');
Backbone.$            = $;

var context           = describe,
    fcontext          = fdescribe;

describe('Task Model', function() {
  var task;

  beforeEach(function() {
    task = new SUT({id: 1, title: 'My Task'});
    var cookie = spyOn($, 'cookie').and.callFake(function(name) {
      return name === 'userID' ? 342 : 'Basic ' + btoa('testuser:testuser');
    });
    spyOn($, 'ajax');
  });

  afterAll(function() {
    task = null;
  });

  describe('properties', function() {
    it('has a `urlRoot` scoped to the logged in user #travis', function() {
      expect(task.urlRoot()).toEqual(Canto.API.base + '/users/342/tasks');
    });

    it('has an individual `url` not scoped to the logged in user #travis', function() {
      expect(task.url()).toEqual(Canto.API.base + '/tasks/1');
    });

    it('has klass `TaskModel`', function() {
      expect(task.klass).toBe('TaskModel');
    });

    it('has parent `ProtectedResourceModel`', function() {
      expect(task.parent).toBe('ProtectedResourceModel');
    });
  });

  describe('constructor', function() {
    it('does not save the task automatically #travis', function() {
      spyOn(SUT.prototype, 'save');
      var newTask = new SUT();
      expect(SUT.prototype.save).not.toHaveBeenCalled();
    });
  });

  describe('validations', function() {
    it('is invalid without a title #travis', function() {
      var newTask = new SUT();
      expect(newTask.isValid()).toBe(false);
    });
  });

  describe('core functions', function() {
    describe('fetch', function() {
      it('sends the request to the task\'s individual endpoint #travis', function() {
        task.fetch();
        expect($.ajax.calls.argsFor(0)[0].url).toEqual(task.url());
      });

      it('calls fetch on the ProtectedResource prototype #travis', function() {
        spyOn(ProtectedResource.prototype, 'fetch');
        task.fetch();
        expect(ProtectedResource.prototype.fetch).toHaveBeenCalled();
      });
    });

    describe('save', function() {
      it('calls validate #travis', function() {
        spyOn(task, 'validate');
        task.save();
        expect(task.validate).toHaveBeenCalled();
      });

      it('calls save on the ProtectedResource prototype #travis', function() {
        spyOn(ProtectedResource.prototype, 'save');
        task.save();
        expect(ProtectedResource.prototype.save).toHaveBeenCalled();
      });

      context('when the task is new', function() {
        beforeEach(function() {
          spyOn(task, 'isNew').and.returnValue(true);
          task.save();
        });

        it('sends the request to the collection endpoint #travis', function() {
          expect($.ajax.calls.argsFor(0)[0].url).toEqual(task.urlRoot());
        });

        it('sends a POST request #travis', function() {
          expect($.ajax.calls.argsFor(0)[0].type).toEqual('POST');
        });
      });

      context('when the task is not new #travis', function() {
        beforeEach(function() { 
          spyOn(task, 'isNew').and.returnValue(false); 
          task.save();
        });

        it('sends the request to the individual endpoint #travis', function() {
          expect($.ajax.calls.argsFor(0)[0].url).toEqual(task.url());
        });

        it('sends a PUT request #travis', function() {
          expect($.ajax.calls.argsFor(0)[0].type).toEqual('PUT');
        });
      });
    });
  });

  describe('special functions', function() {
    describe('complete', function() {
      context('when the task is complete', function() {
        it('returns true #travis', function() {
          task.set('status', 'Complete');
          expect(task.complete()).toBe(true);
        });
      });

      context('when the task is incomplete', function() {
        it('returns false #travis', function() {
          task.set('status', 'Blocking');
          expect(task.complete()).toBe(false);
        });
      });
    });

    describe('displayTitle', function() {
      it('leaves a short title as-is #travis', function() {
        task.set('title', 'Take out the trash');
        expect(task.displayTitle()).toEqual('Take out the trash');
      });

      it('truncates a long title with an ellipsis #travis', function() {
        task.set('title', 'Find out how much wood a woodchuck would chuck if a woodchuck could chuck wood');
        expect(task.displayTitle()).toEqual('Find out how much wood a woodchuck would chuck if a ...');
      });

      it('takes an argument into consideration #travis', function() {
        task.set('title', 'Find out how much wood a woodchuck would chuck if a woodchuck could chuck wood');
        expect(task.displayTitle(35)).toEqual('Find out how much wood a ...');
      });
    });

    describe('incomplete', function() {
      context('when the task is complete', function() {
        it('returns false #travis', function() {
          task.set('status', 'Complete');
          expect(task.incomplete()).toBe(false);
        });
      });

      context('when the task is incomplete', function() {
        it('returns true #travis', function() {
          task.set('status', 'In Progress');
          expect(task.incomplete()).toBe(true);
        });
      });
    });

    describe('isA', function() {
      it('returns true with argument TaskModel', function() {
        expect(task.isA('TaskModel')).toBe(true);
      });

      it('returns true with argument Task', function() {
        expect(task.isA('Task')).toBe(true);
      });

      it('returns false with another argument', function() {
        expect(task.isA('feather pen')).toBe(false);
      });
    });

    describe('prettyDeadline', function() {
      it('presents its deadline in a human-friendly format #travis', function() {
        task.set('deadline', new Date('2014-11-10 00:00:00 -0800'));
        expect(task.prettyDeadline()).toEqual('Monday, November 10, 2014');
      });
    });
  });
});