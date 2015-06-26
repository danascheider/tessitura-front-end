/* Core Requires
/****************************************************************************/

require(process.cwd() + '/spec/support/env.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    Model          = Tessitura.Model.extend({}),
    context        = describe,
    fcontext       = fdescribe;

/* Suite
/******************************************************************************/

describe('Protected Collection', function() {
  var collection, model1, model2, model3, xhr, ajaxSettings, spy;

  /* Filters
  /***************************************************************************/

  beforeEach(function() {
    collection     = new Tessitura.ProtectedCollection({model: Model});
    collection.url = Tessitura.API.base + '/models';
    xhr = new XMLHttpRequest();
    spyOn($, 'cookie').and.returnValue(btoa('testuser:testuser'));
  });

  /* Static Properties
  /***************************************************************************/

  describe('static properties', function() {
    it('has klass \'ProtectedCollection\' #collection #travis', function() {
      expect(collection.klass).toBe('ProtectedCollection');
    });

    it('has family Backbone.Collection #collection #travis', function() {
      expect(collection.family).toBe('ProtectedCollection');
    });

    it('has superFamily Backbone.Collection #collection #travis', function() {
      expect(collection.superFamily).toBe('Backbone.Collection');
    });
  });

  /* Authorization and Authentication
  /***************************************************************************/

  describe('token', function() {
    it('returns the value of the auth header for the logged-in user #collection #travis', function() {
      expect(collection.token()).toEqual('Basic ' + btoa('testuser:testuser'));
    });
  });

  /* Core Functions
  /***************************************************************************/

  describe('core functions', function() {
    describe('fetch', function() {
      beforeEach(function() { spyOn($, 'ajax'); });

      it('attaches the auth header #collection #travis', function() {
        xhr.open('GET', collection.url);
        collection.fetch();
        $.ajax.calls.argsFor(0)[0].beforeSend(xhr);
        expect(xhr.getRequestHeader('Authorization')).toEqual(collection.token());
      });

      it('calls Backbone.Sync #collection #travis', function() {
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
      it('returns true with arg \'ProtectedCollection\' #collection #travis', function() {
        expect(collection.isA('ProtectedCollection')).toBe(true);
      });

      it('returns true with arg \'Backbone.Collection\' #collection #travis', function() {
        expect(collection.isA('Backbone.Collection')).toBe(true);
      });

      it('returns false with another value #collection #travis', function() {
        expect(collection.isA('TaskModel')).toBe(false);
      });
    });

    describe('destroy', function() {
      it('removes all the models from the collection', function() {
        collection.destroy();
        expect(collection.models).toEqual([]);
      });

      it('calls stopListening', function() {
        spyOn(collection, 'stopListening');
        collection.destroy();
        expect(collection.stopListening).toHaveBeenCalled();
      });
    });
  });
});