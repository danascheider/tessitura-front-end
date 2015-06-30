require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

describe('Task Collection', function() {
  beforeAll(function() {
    _.extend(global, fixtures);
  });

  beforeEach(function() {
    taskCollection = new Tessitura.TaskCollection(collection.models);
    spyOn($, 'cookie').and.callFake(function(name) {
      return name === 'userID' ? 1 : btoa('testuser:testuser');
    });
  });

  afterEach(function() {
    restoreFixtures();
  });

  afterAll(function() {
    _.omit(global, fixtures);
  });

  describe('constructor', function() {
    it('sets the models #collection #travis', function() {
      expect(taskCollection.models).toEqual(collection.models);
    });
  });

  describe('comparator', function() {
    beforeEach(function() {
      task1.set('position', 2);
      task2.set('position', 1);
      taskCollection.sort();
    });

    afterEach(function() {
      task1.set('position', 1);
      task2.set('position', 2);
      taskCollection.sort();
    });

    it('orders the tasks by position #collection #travis', function() {
      expect(taskCollection.models).toEqual([task2, task1, task3]);
    });
  });

  describe('URL', function() {
    it('gets the URL for the logged-in user #collection #travis', function() {
      expect(taskCollection.url()).toEqual(Tessitura.API.base + '/users/1/tasks');
    });
  });

  describe('core functions', function() {
    describe('fetch', function() {
      beforeEach(function() {
        spyOn(Tessitura.ProtectedCollection.prototype, 'fetch');
      });

      context('normal', function() {
        it('sends the request to the collection URL #collection #travis', function() {
          taskCollection.fetch();
          expect(Tessitura.ProtectedCollection.prototype.fetch.calls.argsFor(0)[0].url).toEqual(taskCollection.url());
        });

        it('calls fetch on the collection prototype', function() {
          taskCollection.fetch();
          expect(Tessitura.ProtectedCollection.prototype.fetch).toHaveBeenCalled();
        });
      });

      context('with option `all` set to `true`', function() {
        it('sends the request to the `all` route #collection #travis', function() {
          taskCollection.fetch({all: true});
          expect(Tessitura.ProtectedCollection.prototype.fetch.calls.argsFor(0)[0].url).toEqual(taskCollection.url() + '/all');
        });
      });
    });
  });

  describe('special functions', function() {
    it('returns true with arg \'TaskCollection\' #collection #travis', function() {
      expect(taskCollection.isA('TaskCollection')).toBe(true);
    });

    it('returns true with arg \'Backbone.Collection\' #collection #travis', function() {
      expect(taskCollection.isA('Backbone.Collection')).toBe(true);
    });

    it('returns true with arg \'ProtectedCollection\' #collection #travis', function() {
      expect(taskCollection.isA('ProtectedCollection')).toBe(true);
    });

    it('returns false with wrong type #collection #travis', function() {
      expect(taskCollection.isA('UserCollection')).toBe(false);
    });
  });
});