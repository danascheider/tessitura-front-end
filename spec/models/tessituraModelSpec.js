/* istanbul ignore require */
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

/* istanbul ignore next */
var context        = describe,
    fcontext       = fdescribe;

/* istanbul ignore next */
describe('Tessitura.Model', function() {
  var model;

  beforeEach(function() {
    model = new Tessitura.Model();
  });

  afterEach(function() {
    model.destroy();
  });

  describe('properties', function() {
    it('has klass Tessitura.Model #model #travis', function() {
      expect(model.klass).toBe('Tessitura.Model');
    });

    it('has family Tessitura.Model #model #travis', function() {
      expect(model.family).toBe('Tessitura.Model');
    });

    it('has superFamily Backbone.Model #model #travis', function() {
      expect(model.superFamily).toBe('Backbone.Model');
    });
  });

  describe('types', function() {
    it('includes Backbone.Model and Tessitura.Model #model #travis', function() {
      expect(model.types()).toEqual(['Backbone.Model', 'Tessitura.Model']);
    });
  });

  describe('isA', function() {
    it('returns true with argument Backbone.Model #model #travis', function() {
      expect(model.isA('Backbone.Model')).toBe(true);
    });

    it('returns true with argument Tessitura.Model #model #travis', function() {
      expect(model.isA('Tessitura.Model')).toBe(true);
    });

    it('returns false with another argument #model #travis', function() {
      expect(model.isA('ProtectedResourceModel')).toBe(false);
    });
  });

  describe('inheritance', function() {
    var NewModel, newModel;

    beforeEach(function() {
      NewModel = Tessitura.Model.extend({klass: 'NewModel'});
      newModel = new NewModel();
    });

    afterEach(function() {
      newModel.destroy();
    });

    describe('types', function() {
      it('inherits types from Tessitura.Model #model #travis', function() {
        expect(newModel.types()).toEqual(['Backbone.Model', 'Tessitura.Model']);
      });
    });

    describe('isA', function() {
      it('returns true with argument Backbone.Model #model #travis', function() {
        expect(newModel.isA('Backbone.Model')).toBe(true);
      });

      it('returns true with argument Tessitura.Model #model #travis', function() {
        expect(newModel.isA('Tessitura.Model')).toBe(true);
      });

      it('returns false with another argument #model #travis', function() {
        expect(newModel.isA('walrus')).toBe(false);
      });
    });

    describe('properties', function() {
      it('has klass NewModel #model #travis', function() {
        expect(newModel.klass).toBe('NewModel');
      });

      it('has family Tessitura.Model #model #travis', function() {
        expect(newModel.family).toBe('Tessitura.Model');
      });

      it('has superFamily Backbone.Model #model #travis', function() {
        expect(newModel.superFamily).toBe('Backbone.Model');
      });
    });
  });
});