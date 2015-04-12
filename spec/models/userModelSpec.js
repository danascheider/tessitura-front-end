require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/canto.js');
require(process.cwd() + '/spec/support/env.js');

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

var context        = describe,
    fcontext       = fdescribe;

describe('User Model #travis', function() {
  var user, xhr, newUser;

  beforeEach(function() {
    user = new Canto.UserModel({id: 342, username: 'testuser', password: 'testuser', email: 'testuser@example.com', first_name: 'Test', last_name: 'User'});
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
    beforeEach(function() { spyOn(Canto.UserModel.prototype, 'protectedFetch'); });

    it('instantiates a task collection #travis', function() {
      var newUser = new Canto.UserModel();
      expect(newUser.tasks.isA('TaskCollection')).toBe(true);
    });

    describe('when instantiated with an ID', function() {
      it('calls protectedFetch #travis', function() {
        var newUser = new Canto.UserModel({id: 14});
        expect(Canto.UserModel.prototype.protectedFetch).toHaveBeenCalled();
      });

      it('doesn\'t call protectedFetch if `sync` is set to false #travis', function() {
        var newUser = new Canto.UserModel({id: 22}, {sync: false});
        expect(Canto.UserModel.prototype.protectedFetch).not.toHaveBeenCalled();
      });
    });

    describe('when not instantiated with an ID', function() {
      it('doesn\'t call protectedFetch #travis', function() {
        var newUser = new Canto.UserModel();
        expect(Canto.UserModel.prototype.protectedFetch).not.toHaveBeenCalled();
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
      spyOn($, 'cookie').and.returnValue(btoa('danascheider:danascheider'));
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

    describe('login', function() {
      beforeEach(function() {
        newUser = new Canto.UserModel({username: 'testuser', password: 'testuser'});
      });

      it('sends a POST request', function() {
        newUser.login();
        expect($.ajax.calls.argsFor(0)[0].type).toEqual('POST');
      });

      it('calls `fetch`', function() {
        spyOn(Canto.Model.prototype, 'fetch');
        newUser.login();
        expect(Canto.Model.prototype.fetch).toHaveBeenCalled();
      });

      it('calls `fetch` with itself', function() {
        spyOn(Canto.Model.prototype.fetch, 'call');
        newUser.login();
        expect(Canto.Model.prototype.fetch.call.calls.argsFor(0)[0]).toEqual(newUser);
      });

      it('sends the request to the login endpoint', function() {
        newUser.login();
        expect($.ajax.calls.argsFor(0)[0].url).toEqual(Canto.API.login);
      });

      it('attaches the auth header', function() {
        xhr.open('POST', Canto.API.login)
        newUser.login();
        $.ajax.calls.argsFor(0)[0].beforeSend(xhr);
        expect(xhr.getRequestHeader('Authorization')).toEqual('Basic ' + btoa('testuser:testuser'));
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