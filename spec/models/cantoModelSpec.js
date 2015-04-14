require(process.cwd() + '/js/canto.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var context        = describe,
    fcontext       = fdescribe;

describe('Canto.Model', function() {
  var model;

  beforeEach(function() {
    model = new Canto.Model();
  });

  describe('properties', function() {
    it('has klass Canto.Model #travis', function() {
      expect(model.klass).toBe('Canto.Model');
    });

    it('has family Canto.Model #travis', function() {
      expect(model.family).toBe('Canto.Model');
    });

    it('has superFamily Backbone.Model #travis', function() {
      expect(model.superFamily).toBe('Backbone.Model');
    });
  });

  describe('types', function() {
    it('includes Backbone.Model and Canto.Model #travis', function() {
      expect(model.types()).toEqual(['Backbone.Model', 'Canto.Model']);
    });
  });

  describe('isA', function() {
    it('returns true with argument Backbone.Model #travis', function() {
      expect(model.isA('Backbone.Model')).toBe(true);
    });

    it('returns true with argument Canto.Model #travis', function() {
      expect(model.isA('Canto.Model')).toBe(true);
    });

    it('returns false with another argument #travis', function() {
      expect(model.isA('ProtectedResourceModel')).toBe(false);
    });
  });

  describe('inheritance', function() {
    var NewModel, newModel;

    beforeEach(function() {
      NewModel = Canto.Model.extend({klass: 'NewModel'});
      newModel = new NewModel();
    });

    afterEach(function() {
      newModel.destroy();
    });

    describe('types', function() {
      it('inherits types from Canto.Model #travis', function() {
        expect(newModel.types()).toEqual(['Backbone.Model', 'Canto.Model']);
      });
    });

    describe('isA', function() {
      it('returns true with argument Backbone.Model #travis', function() {
        expect(newModel.isA('Backbone.Model')).toBe(true);
      });

      it('returns true with argument Canto.Model #travis', function() {
        expect(newModel.isA('Canto.Model')).toBe(true);
      });

      it('returns false with another argument #travis', function() {
        expect(newModel.isA('walrus')).toBe(false);
      });
    });

    describe('properties', function() {
      it('has klass NewModel #travis', function() {
        expect(newModel.klass).toBe('NewModel');
      });

      it('has family Canto.Model #travis', function() {
        expect(newModel.family).toBe('Canto.Model');
      });

      it('has superFamily Backbone.Model #travis', function() {
        expect(newModel.superFamily).toBe('Backbone.Model');
      });
    });
  });
});