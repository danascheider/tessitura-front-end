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
    it('#travis has klass Canto.Model', function() {
      expect(model.klass).toBe('Canto.Model');
    });

    it('#travis has family Canto.Model', function() {
      expect(model.family).toBe('Canto.Model');
    });

    it('#travis has superFamily Backbone.Model', function() {
      expect(model.superFamily).toBe('Backbone.Model');
    });
  });

  describe('types', function() {
    it('#travis includes Backbone.Model and Canto.Model', function() {
      expect(model.types()).toEqual(['Backbone.Model', 'Canto.Model']);
    });
  });

  describe('isA', function() {
    it('#travis returns true with argument Backbone.Model', function() {
      expect(model.isA('Backbone.Model')).toBe(true);
    });

    it('#travis returns true with argument Canto.Model', function() {
      expect(model.isA('Canto.Model')).toBe(true);
    });

    it('#travis returns false with another argument', function() {
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
      it('#travis inherits types from Canto.Model', function() {
        expect(newModel.types()).toEqual(['Backbone.Model', 'Canto.Model']);
      });
    });

    describe('isA', function() {
      it('#travis returns true with argument Backbone.Model', function() {
        expect(newModel.isA('Backbone.Model')).toBe(true);
      });

      it('#travis returns true with argument Canto.Model', function() {
        expect(newModel.isA('Canto.Model')).toBe(true);
      });

      it('#travis returns false with another argument', function() {
        expect(newModel.isA('walrus')).toBe(false);
      });
    });

    describe('properties', function() {
      it('#travis has klass NewModel', function() {
        expect(newModel.klass).toBe('NewModel');
      });

      it('#travis has family Canto.Model', function() {
        expect(newModel.family).toBe('Canto.Model');
      });

      it('#travis has superFamily Backbone.Model', function() {
        expect(newModel.superFamily).toBe('Backbone.Model');
      });
    });
  });
});