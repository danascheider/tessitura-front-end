require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/canto.js');
require(process.cwd() + '/spec/support/env.js');

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    context        = describe,
    fcontext       = fdescribe;

fdescribe('Task Collection', function() {
  var collection, task1, task2, task3

  beforeEach(function() {
    task1 = new Canto.TaskModel({title: 'New Task', owner_id: 342});
    task2 = new Canto.TaskModel({title: 'New Task', owner_id: 342});
    task3 = new Canto.TaskModel({title: 'New Task', owner_id: 342});
    collection = new Canto.TaskCollection([task1, task2, task3]);
    spyOn($, 'cookie').and.callFake(function(name) {
      return name === 'userID' ? 342 : btoa('testuser:testuser');
    });
  });

  afterEach(function() {
    task1.destroy();
    task2.destroy();
    task3.destroy();
    collection.destroy();
  });

  describe('constructor', function() {
    it('sets the models #collection #travis', function() {
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

    it('orders the tasks by position #collection #travis', function() {
      expect(collection.models).toEqual([task2, task1, task3]);
    });
  });

  describe('static properties', function() {
    it('has klass TaskCollection #collection #travis', function() {
      expect(collection.klass).toBe('TaskCollection');
    });

    it('has family ProtectedCollection #collection #travis', function() {
      expect(collection.family).toBe('ProtectedCollection');
    });

    it('has superFamily Backbone.Collection #collection #travis', function() {
      expect(collection.superFamily).toBe('Backbone.Collection');
    });
  });

  describe('URL', function() {
    it('gets the URL for the logged-in user #collection #travis', function() {
      expect(collection.url()).toEqual(Canto.API.base + '/users/342/tasks');
    });
  });

  describe('core functions', function() {
    describe('fetch', function() {
      beforeEach(function() {
        spyOn(Canto.ProtectedCollection.prototype, 'fetch');
      });

      context('normal', function() {
        it('sends the request to the collection URL #collection #travis', function() {
          collection.fetch();
          expect(Canto.ProtectedCollection.prototype.fetch.calls.argsFor(0)[0].url).toEqual(collection.url());
        });

        it('calls fetch on the collection prototype', function() {
          collection.fetch();
          expect(Canto.ProtectedCollection.prototype.fetch).toHaveBeenCalled();
        });
      });

      context('with option `all` set to `true`', function() {
        it('sends the request to the `all` route #collection #travis', function() {
          collection.fetch({all: true});
          expect(Canto.ProtectedCollection.prototype.fetch.calls.argsFor(0)[0].url).toEqual(collection.url() + '/all');
        });
      });
    });
  });

  describe('special functions', function() {
    it('returns true with arg \'TaskCollection\' #collection #travis', function() {
      expect(collection.isA('TaskCollection')).toBe(true);
    });

    it('returns true with arg \'Backbone.Collection\' #collection #travis', function() {
      expect(collection.isA('Backbone.Collection')).toBe(true);
    });

    it('returns true with arg \'ProtectedCollection\' #collection #travis', function() {
      expect(collection.isA('ProtectedCollection')).toBe(true);
    });

    it('returns false with wrong type #collection #travis', function() {
      expect(collection.isA('UserCollection')).toBe(false);
    });
  });
});