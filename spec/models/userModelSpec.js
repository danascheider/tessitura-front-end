require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/env.js');

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

var Collection     = require(process.cwd() + '/js/collections/taskCollection.js'),
    context        = describe,
    fcontext       = fdescribe;

var SUT = require(process.cwd() + '/js/models/userModel.js');

describe('User Model', function() {
  var user, xhr;

  beforeEach(function() {
    user = new SUT({id: 342, username: 'testuser', password: 'testuser', email: 'testuser@example.com', first_name: 'Test', last_name: 'User'});
    xhr = new XMLHttpRequest();
  });

  afterAll(function() {
    user = null;
  });

  describe('properties', function() {
    it('has `urlRoot` /users #travis', function() {
      expect(user.urlRoot).toEqual(Canto.API.base + '/users');
    });

    it('has klass UserModel', function() {
      expect(user.klass).toBe('UserModel');
    });
  });

  describe('constructor', function() {
    beforeEach(function() { spyOn(SUT.prototype, 'protectedFetch'); });

    it('instantiates a task collection #travis', function() {
      var newUser = new SUT();
      expect(newUser.tasks.isA('TaskCollection')).toBe(true);
    });

    describe('when instantiated with an ID', function() {
      it('calls protectedFetch #travis', function() {
        var newUser = new SUT({id: 14});
        expect(SUT.prototype.protectedFetch).toHaveBeenCalled();
      });

      it('doesn\'t call protectedFetch if `sync` is set to false #travis', function() {
        var newUser = new SUT({id: 22}, {sync: false});
        expect(SUT.prototype.protectedFetch).not.toHaveBeenCalled();
      });
    });

    describe('when not instantiated with an ID', function() {
      it('doesn\'t call protectedFetch #travis', function() {
        var newUser = new SUT();
        expect(SUT.prototype.protectedFetch).not.toHaveBeenCalled();
      });
    });
  });

  describe('core functions', function() {
    beforeEach(function() {
      spyOn($, 'ajax');
    });

    describe('fetch', function() {
      it('calls Backbone fetch function #travis', function() {
        spyOn(Backbone.Model.prototype, 'fetch');
        user.fetch();
        expect(Backbone.Model.prototype.fetch).toHaveBeenCalled();
      });

      it('sets the auth header for the requested user #travis', function() {
        xhr = new XMLHttpRequest();
        xhr.open('GET', user.url());
        user.fetch();
        $.ajax.calls.argsFor(0)[0].beforeSend(xhr);
        expect(xhr.getRequestHeader('Authorization')).toEqual('Basic ' + btoa('testuser:testuser'));
      });

      it('sends the request to the requested user\'s endpoint #travis', function() {
        user.fetch();
        expect($.ajax.calls.argsFor(0)[0].url).toEqual(user.url());
      });
    });
  });

  describe('special functions', function() {
    beforeEach(function() {
      spyOn($, 'cookie').and.returnValue('Basic ' + btoa('danascheider:danascheider'));
      spyOn($, 'ajax');
    });

    describe('isA', function() {
      it('returns true with argument UserModel', function() {
        expect(user.isA('UserModel')).toBe(true);
      });

      it('returns true with argument User', function() {
        expect(user.isA('User')).toBe(true);
      });

      it('returns false with another argument', function() {
        expect(user.isA('ProtectedResource')).toBe(false);
      });
    });

    describe('protectedFetch', function() {
      it('calls Backbone fetch function #travis', function() {
        spyOn(Backbone.Model.prototype, 'fetch');
        user.protectedFetch();
        expect(Backbone.Model.prototype.fetch).toHaveBeenCalled();
      });

      it('sets the auth header for the requested user #travis', function() {
        xhr.open('GET', user.url);
        user.protectedFetch();
        $.ajax.calls.argsFor(0)[0].beforeSend(xhr);
        expect(xhr.getRequestHeader('Authorization')).toEqual('Basic ' + btoa('danascheider:danascheider'));
      });

      it('sends the request to the requested user\'s endpoint #travis', function() {
        user.protectedFetch();
        expect($.ajax.calls.argsFor(0)[0].url).toEqual(Canto.API.base + '/users/342');
      });
    });
  });
});