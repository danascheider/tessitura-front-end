require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/canto.js');
require(process.cwd() + '/spec/support/env.js');

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    context        = describe,
    fcontext       = fdescribe;

fdescribe('Protected Resource Model', function() {
  var resource, xhr;

  beforeEach(function() {
    resource = new Canto.ProtectedResourceModel({id: 1});
    resource.url = Canto.API.base + '/protected-resources/1'; 
    xhr = new XMLHttpRequest();
  });

  afterEach(function() {
    resource.destroy();
  });

  afterAll(function() {
    resource = null;
  });

  it('returns its token #model #travis', function() {
    spyOn($, 'cookie').and.returnValue(btoa('testuser:testuser'));
    var string = 'Basic ' + btoa('testuser:testuser');
    expect(resource.token()).toEqual(string);
  });

  describe('properties', function() {
    it('has klass ProtectedResourceModel #model #travis', function() {
      expect(resource.klass).toBe('ProtectedResourceModel');
    });
  });

  describe('destroy() method', function() {
    beforeEach(function() { spyOn(resource, 'token').and.returnValue('Basic ' + btoa('testuser:testuser')); });

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

      $.ajax.calls.argsFor(0)[0].beforeSend(xhr);
      expect(xhr.getRequestHeader('Authorization')).toEqual(resource.token());
    });

    it('calls destroy on the Backbone model prototype #model #travis', function() {
      spyOn(Backbone.Model.prototype, 'destroy');
      resource.destroy();
      expect(Backbone.Model.prototype.destroy).toHaveBeenCalled();
    });
  });

  describe('fetch() method', function() {
    beforeEach(function() { spyOn(resource, 'token').and.returnValue('Basic ' + btoa('testuser:testuser')); });

    it('attaches an authorization header #model #travis', function() {
      xhr.open('GET', resource.url);

      spyOn($, 'ajax');
      resource.fetch();

      $.ajax.calls.argsFor(0)[0].beforeSend(xhr);
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
      expect(resource.isA('Canto.View')).toBe(false);
    });
  });

  describe('save() method', function() {
    beforeEach(function() { spyOn(resource, 'token').and.returnValue('Basic ' + btoa('testuser:testuser')); });

    it('attaches an authorization header #model #travis', function() {
      xhr.open('PUT', resource.url);

      spyOn($, 'ajax');
      resource.save();

      $.ajax.calls.argsFor(0)[0].beforeSend(xhr);
      expect(xhr.getRequestHeader('Authorization')).toEqual(resource.token());
    });

    it('calls save on the Backbone model prototype #model #travis', function() {
      spyOn(Backbone.Model.prototype, 'save');
      resource.save();
      expect(Backbone.Model.prototype.save).toHaveBeenCalled();
    });
  });
});