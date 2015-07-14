/* istanbul ignore require */

require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    ccontext       = ddescribe;

/* istanbul ignore next */

describe('Task Collection', function() {
  beforeEach(function() {
    _.extend(global, fixtures);
    taskCollection = new Tessitura.TaskCollection(collection.models);
    spyOn($, 'cookie').andCallFake(function(name) {
      return name === 'userID' ? 1 : btoa('testuser:testuser');
    });
  });

  afterEach(function() {
    restoreFixtures();
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

  describe('child collections', function() {
    var collection1, collection2;

    beforeEach(function() {
      collection1 = new Tessitura.TaskCollection(collection.where({status: 'New'}));
      collection2 = new Tessitura.TaskCollection(collection.where({status: 'In Progress'}));
      taskCollection = new Tessitura.TaskCollection(null, {children: [collection1, collection2]});
    });

    it('can have a child collection #collection #travis', function() {
      expect(taskCollection.children).not.toBeNull();
    });

    it('adds the tasks from the child collections #collection #travis', function() {
      expect(taskCollection.models.indexOf(task1)).toBeGreaterThan(-1);
    });

    it('listens to the add event #collection #travis', function() {
      collection1.add(task5);
      expect(taskCollection.models.indexOf(task5)).toBeGreaterThan(-1);
    });

    it('doesn\'t add things more than once #collection #travis', function() {
      collection2.add(task1);

      var i = 0;
      taskCollection.each(function(task) { if (task === task1) { i++; }});
      expect(i).toEqual(1);
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
          expect(Tessitura.ProtectedCollection.prototype.fetch.calls[0].args[0].url).toEqual(taskCollection.url());
        });

        it('calls fetch on the collection prototype', function() {
          taskCollection.fetch();
          expect(Tessitura.ProtectedCollection.prototype.fetch).toHaveBeenCalled();
        });
      });

      context('with option `all` set to `true`', function() {
        it('sends the request to the `all` route #collection #travis', function() {
          taskCollection.fetch({all: true});
          expect(Tessitura.ProtectedCollection.prototype.fetch.calls[0].args[0].url).toEqual(taskCollection.url() + '/all');
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