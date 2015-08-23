require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

var context        = describe,
    ccontext       = ddescribe;

describe('User Model', function() {
  var user, newUser, xhr, newUser;

  beforeEach(function() {
    user = new Tessitura.UserModel({id: 1, username: 'testuser', password: 'testuser', email: 'testuser@example.com', first_name: 'Test', last_name: 'User'});
    xhr = new XMLHttpRequest();
  });

  afterEach(function() {
    user.destroy();
  });

  describe('properties', function() {
    it('has `urlRoot` /users #model #travis', function() {
      expect(user.urlRoot).toEqual(Tessitura.API.base + '/users');
    });

    it('has klass UserModel #model #travis', function() {
      expect(user.klass).toBe('UserModel');
    });
  });

  describe('constructor', function() {
    afterEach(function() { newUser.destroy(); });

    it('instantiates a task collection #model #travis', function() {
      newUser = new Tessitura.UserModel();
      expect(newUser.tasks.isA('TaskCollection')).toBe(true);
    });
  });

  describe('core functions', function() {
    beforeEach(function() { spyOn($, 'ajax'); });

    describe('fetch', function() {
      it('calls Backbone fetch function #model #travis', function() {
        spyOn(Backbone.Model.prototype, 'fetch');
        user.fetch();
        expect(Backbone.Model.prototype.fetch).toHaveBeenCalled();
      });

      it('sets the auth header from the stored cookie #model #travis', function() {
        xhr.open('GET', user.url());
        spyOn($, 'cookie').andReturn(btoa(user.get('username') + ':' + user.get('password')));
        user.fetch();
        $.ajax.calls[0].args[0].beforeSend(xhr);
        expect(xhr.getRequestHeader('Authorization')).toEqual('Basic ' + btoa(user.get('username') + ':' + user.get('password')));
      });

      it('sends the request to the requested user\'s endpoint #model #travis', function() {
        user.fetch();
        expect($.ajax.calls[0].args[0].url).toEqual(user.url());
      });

      it('creates a fach if one is given #model #travis', function() {
        // pending('Not yet implemented');
        spyOn(Tessitura.FachModel.prototype, 'initialize');
        user.fetch();
        $.ajax.calls[0].args[0].success(user);
      });
    });
  });

  describe('special functions', function() {
    beforeEach(function() {
      spyOn($, 'cookie').andReturn(btoa('danascheider:danascheider'));
      spyOn($, 'ajax');
    });

    describe('isA', function() {
      it('returns true with argument UserModel #model #travis', function() {
        expect(user.isA('UserModel')).toBe(true);
      });

      it('returns true with argument User #model #travis', function() {
        expect(user.isA('User')).toBe(true);
      });

      it('returns false with another argument #model #travis', function() {
        expect(user.isA('ProtectedResource')).toBe(false);
      });
    });

    describe('login', function() {
      beforeEach(function() {
        newUser = new Tessitura.UserModel({username: 'testuser', password: 'testuser'});
      });

      afterEach(function() { newUser.destroy(); });

      it('sends a POST request #model #travis', function() {
        newUser.login();
        expect($.ajax.calls[0].args[0].type).toEqual('POST');
      });

      it('calls `fetch` #model #travis', function() {
        spyOn(Tessitura.Model.prototype, 'fetch');
        newUser.login();
        expect(Tessitura.Model.prototype.fetch).toHaveBeenCalled();
      });

      it('calls `fetch` with itself #model #travis', function() {
        spyOn(Tessitura.Model.prototype.fetch, 'call');
        newUser.login();
        expect(Tessitura.Model.prototype.fetch.call.calls[0].args[0]).toEqual(newUser);
      });

      it('sends the request to the login endpoint #model #travis', function() {
        newUser.login();
        expect($.ajax.calls[0].args[0].url).toEqual(Tessitura.API.login);
      });

      it('attaches the auth header #model #travis', function() {
        xhr.open('POST', Tessitura.API.login)
        newUser.login();
        $.ajax.calls[0].args[0].beforeSend(xhr);
        expect(xhr.getRequestHeader('Authorization')).toEqual('Basic ' + btoa('testuser:testuser'));
      });
    });
  });
});