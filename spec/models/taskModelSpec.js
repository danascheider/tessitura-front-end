require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');
require(process.cwd() + '/js/canto.js');

var context           = describe,
    fcontext          = fdescribe;

describe('Task Model', function() {
  var task;

  beforeEach(function() {
    task = new Canto.TaskModel({id: 1, title: 'My Task'});
    var cookie = spyOn($, 'cookie').and.callFake(function(name) {
      return name === 'userID' ? 1 : 'Basic ' + btoa('testuser:testuser');
    });
    
    spyOn($, 'ajax');
  });

  afterEach(function() {
    task.destroy();
  });
    
  describe('properties', function() {
    it('has a `urlRoot` scoped to the logged in user #model #travis', function() {
      expect(task.urlRoot()).toEqual(Canto.API.base + '/users/1/tasks');
    });

    it('has an individual `url` not scoped to the logged in user #model #travis', function() {
      expect(task.url()).toEqual(Canto.API.base + '/tasks/1');
    });

    it('has klass `TaskModel` #model #travis', function() {
      expect(task.klass).toBe('TaskModel');
    });

    it('has parent `ProtectedResourceModel` #model #travis', function() {
      expect(task.parent).toBe('ProtectedResourceModel');
    });
  });

  describe('constructor', function() {
    it('does not save the task automatically #model #travis', function() {
      spyOn(Canto.TaskModel.prototype, 'save');
      var newTask = new Canto.TaskModel();
      expect(Canto.TaskModel.prototype.save).not.toHaveBeenCalled();
    });
  });

  describe('validations', function() {
    it('is invalid without a title #model #travis', function() {
      var newTask = new Canto.TaskModel();
      expect(newTask.isValid()).toBe(false);
    });
  });

  describe('core functions', function() {
    describe('fetch', function() {
      it('sends the request to the task\'s individual endpoint #model #travis', function() {
        task.fetch();
        expect($.ajax.calls.argsFor(0)[0].url).toEqual(task.url());
      });

      it('calls fetch on the ProtectedResource prototype #model #travis', function() {
        spyOn(Canto.ProtectedResourceModel.prototype, 'fetch');
        task.fetch();
        expect(Canto.ProtectedResourceModel.prototype.fetch).toHaveBeenCalled();
      });
    });

    describe('save', function() {
      it('calls validate #model #travis', function() {
        spyOn(task, 'validate');
        task.save();
        expect(task.validate).toHaveBeenCalled();
      });

      it('calls save on the ProtectedResource prototype #model #travis', function() {
        spyOn(Canto.ProtectedResourceModel.prototype, 'save');
        task.save();
        expect(Canto.ProtectedResourceModel.prototype.save).toHaveBeenCalled();
      });

      context('when the task is new', function() {
        beforeEach(function() {
          spyOn(task, 'isNew').and.returnValue(true);
          task.save();
        });

        it('sends the request to the collection endpoint #model #travis', function() {
          expect($.ajax.calls.argsFor(0)[0].url).toEqual(task.urlRoot());
        });

        it('sends a POST request #model #travis', function() {
          expect($.ajax.calls.argsFor(0)[0].type).toEqual('POST');
        });
      });

      context('when the task is not new', function() {
        beforeEach(function() { 
          spyOn(task, 'isNew').and.returnValue(false); 
          task.save();
        });

        it('sends the request to the individual endpoint #model #travis', function() {
          expect($.ajax.calls.argsFor(0)[0].url).toEqual(task.url());
        });

        it('sends a PUT request #model #travis', function() {
          expect($.ajax.calls.argsFor(0)[0].type).toEqual('PUT');
        });
      });
    });
  });

  describe('special functions', function() {
    describe('complete', function() {
      context('when the task is complete', function() {
        it('returns true #model #travis', function() {
          task.set('status', 'Complete');
          expect(task.complete()).toBe(true);
        });
      });

      context('when the task is incomplete', function() {
        it('returns false #model #travis', function() {
          task.set('status', 'Blocking');
          expect(task.complete()).toBe(false);
        });
      });
    });

    describe('displayTitle', function() {
      it('leaves a short title as-is #model #travis', function() {
        task.set('title', 'Take out the trash');
        expect(task.displayTitle()).toEqual('Take out the trash');
      });

      it('truncates a long title with an ellipsis #model #travis', function() {
        task.set('title', 'Find out how much wood a woodchuck would chuck if a woodchuck could chuck wood');
        expect(task.displayTitle()).toEqual('Find out how much wood a woodchuck would chuck if a ...');
      });

      it('takes an argument into consideration #model #travis', function() {
        task.set('title', 'Find out how much wood a woodchuck would chuck if a woodchuck could chuck wood');
        expect(task.displayTitle(35)).toEqual('Find out how much wood a ...');
      });
    });

    describe('incomplete', function() {
      context('when the task is complete', function() {
        it('returns false #model #travis', function() {
          task.set('status', 'Complete');
          expect(task.incomplete()).toBe(false);
        });
      });

      context('when the task is incomplete', function() {
        it('returns true #model #travis', function() {
          task.set('status', 'In Progress');
          expect(task.incomplete()).toBe(true);
        });
      });
    });

    describe('isA', function() {
      it('returns true with argument TaskModel #model #travis', function() {
        expect(task.isA('TaskModel')).toBe(true);
      });

      it('returns true with argument Task #model #travis', function() {
        expect(task.isA('Task')).toBe(true);
      });

      it('returns false with another argument #model #travis', function() {
        expect(task.isA('feather pen')).toBe(false);
      });
    });

    describe('prettyDeadline', function() {
      it('presents its deadline in a human-friendly format #model #travis', function() {
        task.set('deadline', new Date('2014-11-10 00:00:00 -0800'));
        expect(task.prettyDeadline()).toEqual('Monday, November 10, 2014');
      });
    });
  });
});