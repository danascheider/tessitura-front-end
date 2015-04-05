require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/dependencies.js');

var Env = require(process.cwd() + '/spec/support/env.js');
var SUT = require(process.cwd() + '/js/collections/taskCollection.js');

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
Backbone.$         = $;
var TaskModel      = require(process.cwd() + '/js/models/taskModel.js'),
    Collection     = require(process.cwd() + '/js/collections/protectedCollection.js'),
    context        = describe,
    fcontext       = fdescribe;

describe('Task Collection', function() {
  var collection;

  // Instantiate the tasks that will populate the collection
  var task1 = new TaskModel({id: 1, title: 'Task 1', status: 'New', priority: 'Normal', position: 1});
  var task2 = new TaskModel({id: 2, title: 'Task 2', status: 'New', priority: 'Normal', position: 2});
  var task3 = new TaskModel({id: 3, title: 'Task 3', status: 'Complete', priority: 'Normal', position: 3});

  beforeEach(function() {
    spyOn($, 'cookie').and.callFake(function(name) {
      return name === 'userID' ? 342 : Env.btoa('testuser:testuser');
    });

    collection = new SUT([task1, task2, task3]);
  });

  describe('constructor', function() {
    it('sets the models #travis', function() {
      expect(collection.models).toEqual([task1, task2, task3]);
    });
  });

  describe('comparator', function() {
    beforeEach(function() {
      task1.set('position', 2);
      task2.set('position', 1);
      collection.sort();
    });

    afterEach(function() {
      task1.set('position', 1);
      task2.set('position', 2);
      collection.sort();
    });

    it('orders the tasks by position #travis', function() {
      expect(collection.models).toEqual([task2, task1, task3]);
    });
  });

  describe('URL', function() {
    it('gets the URL for the logged-in user #travis', function() {
      expect(collection.url()).toEqual(Canto.API.base + '/users/342/tasks');
    });
  });

  describe('core functions', function() {
    describe('fetch', function() {
      beforeEach(function() {
        spyOn(Collection.prototype, 'fetch');
      });

      context('normal', function() {
        it('sends the request to the collection URL #travis', function() {
          collection.fetch();
          expect(Collection.prototype.fetch.calls.argsFor(0)[0].url).toEqual(collection.url());
        });

      //   it('calls fetch on the collection prototype', function() {
      //     collection.fetch();
      //     expect(Collection.prototype.fetch).toHaveBeenCalled();
      //   });
      });

      context('with option `all` set to `true`', function() {
        it('sends the request to the `all` route #travis', function() {
          collection.fetch({all: true});
          expect(Collection.prototype.fetch.calls.argsFor(0)[0].url).toEqual(collection.url() + '/all');
        });
      });
    });
  });

  describe('special functions', function() {
    it('returns true with arg \'TaskCollection\' #travis', function() {
      expect(collection.isA('TaskCollection')).toBe(true);
    });

    it('returns true with arg \'Backbone.Collection\' #travis', function() {
      expect(collection.isA('Backbone.Collection')).toBe(true);
    });

    it('returns true with arg \'ProtectedCollection\' #travis', function() {
      expect(collection.isA('ProtectedCollection')).toBe(true);
    });

    it('returns false with wrong type #travis', function() {
      expect(collection.isA('UserCollection')).toBe(false);
    });
  });
});