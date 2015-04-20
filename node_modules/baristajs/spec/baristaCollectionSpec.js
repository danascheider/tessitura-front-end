var Barista    = require(process.cwd() + '/lib/barista.js'),
    ExampleApp = require(process.cwd() + '/spec/ex1/exampleApp1.js'),
    Backbone   = require('backbone'),
    context    = describe;

describe('Barista.Collection', function() {
  var collection, model1, model2, spy;

  beforeEach(function() {
    Barista.config(ExampleApp);
  });

  describe('properties', function() {
    it('has model Barista.Model by default', function() {
      expect(Barista.Collection.prototype.model).toBe(Barista.Model);
    });
  });

  describe('create', function() {
    beforeEach(function() {
      model1 = new Barista.TaskModel();
      model2 = new Barista.TaskModel();
      collection = new Barista.TaskCollection([model1, model2]);
      spyOn(Barista.TaskModel.prototype, 'save');
      spyOn(Backbone, 'sync');
      spy = jasmine.createSpy();
      collection.on('sync', spy);
    });

    it('doesn\'t call Backbone.sync', function() {
      collection.create(new Barista.TaskModel({title: 'Task 3'}));
      expect(Backbone.sync).not.toHaveBeenCalled();
    });

    it('calls save on the new model', function() {
      collection.create(new Barista.TaskModel({title: 'Task 3'}));
      expect(Barista.TaskModel.prototype.save).toHaveBeenCalled();
    });

    it('adds the new model to the collection', function() {
      collection.create({title: 'Task 3'});
      expect(collection.where({title: 'Task 3'}).length).toBe(1);
    });

    it('returns the model', function() {
      var model3 = new Barista.TaskModel({title: 'Task 3'});
      expect(collection.create(model3)).toBe(model3);
    });

    it('triggers the sync event', function() {
      collection.create({title: 'Task 3'});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('destroy', function() {
    it('removes the models', function() {
      collection.destroy();
      expect(collection.length).toBe(0);
    });

    it('calls stopListening', function() {
      spyOn(collection, 'stopListening');
      collection.destroy();
      expect(collection.stopListening).toHaveBeenCalled();
    });
  });

  describe('fetch', function() {
    beforeEach(function() {
      model1 = new Barista.TaskModel();
      model2 = new Barista.TaskModel();
      collection = new Barista.TaskCollection([model1, model2]);
      spy = jasmine.createSpy();
      collection.on('sync', spy);
      spyOn(Backbone, 'sync');
    });

    afterEach(function() { collection.off('sync'); });

    it('doesn\'t call Backbone.sync', function() {
      collection.fetch();
      expect(Backbone.sync).not.toHaveBeenCalled();
    });

    context('without the silent option', function() {
      it('triggers a \'remove\' event', function() {
        collection.fetch();
        expect(spy).toHaveBeenCalled();
      });
    });
  });

  describe('isA', function() {
    it('returns true with arg \'Backbone.Collection\'', function() {
      var newCollection = new Barista.Collection();
      expect(newCollection.isA('Backbone.Collection')).toBe(true);
    });

    it('returns true with arg \'Barista.Collection\'', function() {
      var newCollection = new Barista.Collection();
      expect(newCollection.isA('Barista.Collection')).toBe(true);
    });

    it('returns false with another argument', function() {
      var newCollection = new Barista.Collection();
      expect(newCollection.isA('Porsche')).toBe(false);
    });
  });

  describe('remove', function() {
    beforeEach(function() {
      spy = jasmine.createSpy();
      model1 = new Barista.TaskModel({title: 'Task 1'});
      model2 = new Barista.TaskModel({title: 'Task 2'});
      collection = new Barista.TaskCollection([model1, model2]);
      collection.on('remove', spy);
    });

    it('removes the model from the collection', function() {
      collection.remove([model1]);
      expect(collection.models).not.toContain(model1);
    });

    context('without the silent option', function() {
      it('triggers the \'remove\' event', function() {
        collection.remove([model1]);
        expect(spy).toHaveBeenCalled();
      });
    });

    context('with the silent option', function() {
      it('doesn\'t trigger the \'remove\' event', function() {
        collection.remove([model1], {silent: true});
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe('sync', function() {
    beforeEach(function() {
      spyOn(Backbone, 'sync');
      collection = new Barista.Collection();
    });

    it('doesn\'t call Backbone.sync', function() {
      collection.sync();
      expect(Backbone.sync).not.toHaveBeenCalled();
    });

    it('returns the collection', function() {
      expect(collection.sync()).toBe(collection);
    });
  });
});