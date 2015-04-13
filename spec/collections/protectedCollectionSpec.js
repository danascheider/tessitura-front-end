/****************************************************************************
 *                                                                         *
 * PROTECTED COLLECTION                                                    *
 *                                                                         *
 * The ProtectedCollection is a higher-level collection extended into      *
 * Canto's other collections. Its main function is to affix the proper     *  
 * authorization header to all Ajax requests.                              *
 *                                                                         *
 *                                                                         *
 * CONTENTS                                                          LINE  *
 * Requires ......................................................... 27   *
 * Suite ............................................................ 44   *
 *   Filters ........................................................ 50   *
 *   Authorization and Authentication ............................... 60   *
 *     token()                                                             *
 *   Core Functions ................................................. 69   *
 *     fetch()                                                             *
 *   Special Functions .............................................. 91   *
 *     updateAll() .................................................. 92   *
 *     isA() ....................................................... 140   *
 *                                                                         *
/****************************************************************************/

/* Core Requires
/****************************************************************************/

require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');
require(process.cwd() + '/js/canto.js');

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    Model          = Canto.Model.extend({}),
    context        = describe,
    fcontext       = fdescribe;

/******************************************************************************
 * BEGIN SUITE                                                                *
/******************************************************************************/

describe('Protected Collection #travis', function() {
  var collection, model1, model2, model3, xhr, ajaxSettings, spy;

  /* Filters
  /***************************************************************************/

  beforeEach(function() {
    collection     = new Canto.ProtectedCollection({model: Model});
    collection.url = Canto.API.base + '/models';
    xhr = new XMLHttpRequest();
    spyOn($, 'cookie').and.returnValue(btoa('testuser:testuser'));
  });

  /* Static Properties
  /***************************************************************************/

  describe('static properties', function() {
    it('has klass \'ProtectedCollection\'', function() {
      expect(collection.klass).toBe('ProtectedCollection');
    });

    it('has family Backbone.Collection', function() {
      expect(collection.family).toBe('Backbone.Collection');
    });

    it('has superFamily Backbone.Collection', function() {
      expect(collection.superFamily).toBe('Backbone.Collection');
    });
  });

  /* Authorization and Authentication
  /***************************************************************************/

  describe('token', function() {
    it('returns the value of the auth header for the logged-in user', function() {
      expect(collection.token()).toEqual('Basic ' + btoa('testuser:testuser'));
    });
  });

  /* Core Functions
  /***************************************************************************/

  describe('core functions', function() {
    describe('fetch', function() {
      beforeEach(function() { spyOn($, 'ajax'); });

      it('attaches the auth header', function() {
        xhr.open('GET', collection.url);
        collection.fetch();
        $.ajax.calls.argsFor(0)[0].beforeSend(xhr);
        expect(xhr.getRequestHeader('Authorization')).toEqual(collection.token());
      });

      it('calls Backbone.Sync', function() {
        spyOn(Backbone, 'sync');
        collection.fetch();
        expect(Backbone.sync.calls.argsFor(0)[1]).toBe(collection);
      });
    });
  });

  /* Special Functions
  /***************************************************************************/

  describe('special functions', function() {
    describe('isA', function() {
      it('returns true with arg \'ProtectedCollection\'', function() {
        expect(collection.isA('ProtectedCollection')).toBe(true);
      });

      it('returns true with arg \'Backbone.Collection\'', function() {
        expect(collection.isA('Backbone.Collection')).toBe(true);
      });

      it('returns false with another value', function() {
        expect(collection.isA('TaskModel')).toBe(false);
      });
    });
  });
});