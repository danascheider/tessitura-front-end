var Barista    = require(process.cwd() + '/lib/barista.js'),
    Backbone   = require('backbone'),
    ExampleApp = require(process.cwd() + '/spec/ex1/exampleApp1.js'),
    context    = describe;

describe('Barista.Model', function() {
  var model, spy;

  beforeEach(function() {
    Barista.config(ExampleApp);
  });

  describe('destroy', function() {
    var spy2;

    beforeEach(function() {
      model = new Barista.TaskModel();
      spy   = jasmine.createSpy();
      spy2  = jasmine.createSpy();
      model.on('destroy', spy);
      model.on('sync', spy2);
      spyOn(Backbone, 'sync');
      spyOn(model, 'stopListening');
    });

    afterEach(function() { 
      model.off('destroy'); 
      model.off('sync');
    });

    it('doesn\'t call Backbone.sync', function() {
      model.destroy();
      expect(Backbone.sync).not.toHaveBeenCalled();
    });

    it('calls stopListening', function() {
      model.destroy();
      expect(model.stopListening).toHaveBeenCalled();
    });

    it('triggers the \'sync\' event', function() {
      model.destroy();
      expect(spy2).toHaveBeenCalled();
    });

    context('when the model is new', function() {
      beforeEach(function() { spyOn(model, 'isNew').and.returnValue(true); });

      it('returns false', function() {
        expect(model.destroy()).toBe(false);
      });
    });

    context('when the model is not new', function() {
      beforeEach(function() { spyOn(model, 'isNew').and.returnValue(false); });

      it('returns the model', function() {
        expect(model.destroy()).toBe(model);
      });
    });
  });

  describe('fetch', function() {
    beforeEach(function() {
      model = new Barista.TaskModel();
      spy   = jasmine.createSpy();
      model.on('sync', spy);
    });

    afterEach(function() {
      model.off('sync');
    });

    it('doesn\'t call Backbone.sync', function() {
      spyOn(Backbone, 'sync');
      model.fetch();
      expect(Backbone.sync).not.toHaveBeenCalled();
    });

    context('silent false', function() {
      it('triggers the \'sync\' event', function() {
        model.fetch();
        expect(spy).toHaveBeenCalled();
      });
    });

    context('silent true', function() {
      it('doesn\'t trigger the \'sync\' event', function() {
        model.fetch({silent: true});
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe('get', function() {
    beforeEach(function() {
      model = new Barista.TaskModel({title: 'Foobar'});
    });

    it('retrieves the object\'s attribute', function() {
      expect(model.get('title')).toBe('Foobar');
    });
  });

  describe('isA', function() {
    it('returns true with arg \'Backbone.Model\'', function() {
      var newModel = new Barista.Model();
      expect(newModel.isA('Backbone.Model')).toBe(true);
    });

    it('returns true with arg\'Barista.Model\'', function() {
      var newModel = new Barista.Model();
      expect(newModel.isA('Barista.Model')).toBe(true);
    });

    it('returns false with another argument', function() {
      var newModel = new Barista.Model();
      expect(newModel.isA('Barista.Collection')).toBe(false);
    });
  });

  describe('save', function() {
    beforeEach(function() {
      model = new Barista.TaskModel();
      spy   = jasmine.createSpy();
      model.on('sync', spy);
      spyOn(Backbone, 'sync');
    });

    afterEach(function() { model.off('sync'); });

    it('doesn\'t call Backbone.sync', function() {
      model.save({priority: 'High', complete: false});
      expect(Backbone.sync).not.toHaveBeenCalled();
    });

    it('sets the model\'s attributes', function() {
      model.save({priority: 'High', complete: false});
      expect(model.attributes).toEqual(jasmine.objectContaining({
        priority: 'High',
        complete: false
      }));
    });

    it('returns the model', function() {
      expect(model.save({priority: 'High', complete: false})).toBe(model);
    });

    it('triggers the \'sync\' event', function() {
      model.save('priority', 'High');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('set', function() {
    it('sets attributes on the model', function() {
      model = new Barista.TaskModel();
      model.set('priority', 'urgent');
      expect(model.get('priority')).toBe('urgent');
    });
  });

  describe('sync', function() {
    beforeEach(function() {
      model = new Barista.TaskModel();
      spyOn(Backbone, 'sync');
    });

    it('does not call Backbone.sync', function() {
      model.sync();
      expect(Backbone.sync).not.toHaveBeenCalled();
    });

    it('empties the model.changed object', function() {
      model.set('priority', 'High');
      model.sync();
      expect(model.changed).toEqual({});
    });

    it('returns the model', function() {
      expect(model.sync()).toBe(model);
    });

    context('without silent option', function() {
      it('triggers the \'change\' event', function() {
        var spy = jasmine.createSpy();
        model.on('change', spy);
        model.sync();
        expect(spy).toHaveBeenCalled();
        model.off('change');
      });
    });

    context('with the silent option', function() {
      it('doesn\'t trigger the \'change\' event', function() {
        var spy = jasmine.createSpy();
        model.on('change', spy);
        model.sync({silent: true});
        expect(spy).not.toHaveBeenCalled();
        model.off('change');
      });
    });
  });
});