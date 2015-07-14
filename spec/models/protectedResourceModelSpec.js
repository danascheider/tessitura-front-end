/* istanbul ignore require */

require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

/* istanbul ignore next */ 

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    context        = describe,
    ccontext       = ddescribe;

/* istanbul ignore next */

describe('Protected Resource Model', function() {
  var resource, xhr;

  beforeEach(function() {
    resource = new Tessitura.ProtectedResourceModel({id: 1});
    resource.url = Tessitura.API.base + '/protected-resources/1'; 
    xhr = new XMLHttpRequest();
  });

  afterEach(function() {
    resource.destroy();
  });

  it('returns its token #model #travis', function() {
    spyOn($, 'cookie').andReturn(btoa('testuser:testuser'));
    var string = 'Basic ' + btoa('testuser:testuser');
    expect(resource.token()).toEqual(string);
  });

  describe('properties', function() {
    it('has klass ProtectedResourceModel #model #travis', function() {
      expect(resource.klass).toBe('ProtectedResourceModel');
    });
  });

  describe('destroy() method', function() {
    beforeEach(function() { spyOn(resource, 'token').andReturn('Basic ' + btoa('testuser:testuser')); });

    it('attaches an authorization header #model #travis', function() {

      // XHR object can be passed to the Ajax beforeSend setting to
      // check the value of the Authorization header

      xhr.open('DELETE', resource.url);

      // Spy on Ajax to intercept its options
      spyOn($, 'ajax');
      resource.destroy();

      // The beforeSend function should set the Authorization header
      // on the XHR object passed to it to the value of "token", the 
      // resource's authorization token.

      $.ajax.calls[0].args[0].beforeSend(xhr);
      expect(xhr.getRequestHeader('Authorization')).toEqual(resource.token());
    });

    it('calls destroy on the Backbone model prototype #model #travis', function() {
      spyOn(Backbone.Model.prototype, 'destroy');
      resource.destroy();
      expect(Backbone.Model.prototype.destroy).toHaveBeenCalled();
    });
  });

  describe('fetch() method', function() {
    beforeEach(function() { spyOn(resource, 'token').andReturn('Basic ' + btoa('testuser:testuser')); });

    it('attaches an authorization header #model #travis', function() {
      xhr.open('GET', resource.url);

      spyOn($, 'ajax');
      resource.fetch();

      $.ajax.calls[0].args[0].beforeSend(xhr);
      expect(xhr.getRequestHeader('Authorization')).toEqual(resource.token());
    });

    it('calls fetch on the Backbone model prototype #model #travis', function() {
      spyOn(Backbone.Model.prototype, 'fetch');
      resource.fetch();
      expect(Backbone.Model.prototype.fetch).toHaveBeenCalled;
    });
  });

  describe('isA() method', function() {
    it('returns true with argument ProtectedResourceModel #model #travis', function() {
      expect(resource.isA('ProtectedResourceModel')).toBe(true);
    });

    it('returns true with argument ProtectedResource #model #travis', function() {
      expect(resource.isA('ProtectedResource')).toBe(true);
    });

    it('returns false with another argument #model #travis', function() {
      expect(resource.isA('Tessitura.View')).toBe(false);
    });
  });

  describe('save() method', function() {
    beforeEach(function() { spyOn(resource, 'token').andReturn('Basic ' + btoa('testuser:testuser')); });

    it('attaches an authorization header #model #travis', function() {
      xhr.open('PUT', resource.url);

      spyOn($, 'ajax');
      resource.save();

      $.ajax.calls[0].args[0].beforeSend(xhr);
      expect(xhr.getRequestHeader('Authorization')).toEqual(resource.token());
    });

    it('calls save on the Backbone model prototype #model #travis', function() {
      spyOn(Backbone.Model.prototype, 'save');
      resource.save();
      expect(Backbone.Model.prototype.save).toHaveBeenCalled();
    });
  });
});