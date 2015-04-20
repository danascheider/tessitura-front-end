require(process.cwd() + '/lib/barista.js');

var _          = require('underscore'),
    ExampleApp = require(process.cwd() + '/spec/ex1/exampleApp1.js'),
    context    = describe;

describe('Barista', function() {
  var model1, model2, collection, spy;

  it('has a Model property', function() {
    expect(typeof Barista.Model).not.toBe('undefined');
  });

  it('has a Collection property', function() {
    expect(typeof Barista.Collection).not.toBe('undefined');  
  });

  it('has a \'_modelInstances\' array', function() {
    expect(_.isArray(Barista._modelInstances)).toBe(true);
  });

  it('has a \'_collectionInstances\' array', function() {
    expect(_.isArray(Barista._collectionInstances)).toBe(true);
  });

  describe('Barista.config()', function() {

    // The config method takes an app object as input and extends Barista.Model
    // and Barista.Collection using the models and collections defined on the 
    // app object.

    // This example is taken from the spec/ex1 directory.

    it('creates a Barista.TaskModel object', function() {
      Barista.config(ExampleApp);
      expect(typeof Barista.TaskModel).not.toBe('undefined');
    });

    it('creates a Barista.TaskCollection object', function() {
      Barista.config(ExampleApp);
      expect(typeof Barista.TaskCollection).not.toBe('undefined');
    });

    it('extends the Barista.Model object', function() {
      spyOn(Barista.Model, 'extend');
      Barista.config(ExampleApp);
      expect(Barista.Model.extend).toHaveBeenCalledWith(ExampleApp.TaskModel);
    });

    it('extends the Barista.Collection object', function() {
      spyOn(Barista.Collection, 'extend');
      Barista.config(ExampleApp);
      expect(Barista.Collection.extend).toHaveBeenCalledWith(ExampleApp.TaskCollection);
    });
  });

  describe('Barista.destroy()', function() {
    beforeEach(function() {
      Barista.config(ExampleApp);
      model1 = new Barista.TaskModel();
      model2 = new Barista.TaskModel();
      collection = new Barista.TaskCollection([model1, model2]);
      spyOn(model1, 'destroy');
      spyOn(model2, 'destroy');
      spyOn(collection, 'destroy');
    });

    it('calls destroy on all model instances', function() {
      Barista.destroy();
      expect(model1.destroy).toHaveBeenCalled();
      expect(model2.destroy).toHaveBeenCalled();
    });

    it('removes the model instances from the _modelInstances array', function() {
      Barista.destroy();
      expect(Barista._modelInstances.length).toBe(0);
    });

    it('calls destroy on all collection instances', function() {
      Barista.destroy();
      expect(collection.destroy).toHaveBeenCalled();
    });

    it('removes the collection instances from the _collectionInstances array', function() {
      Barista.destroy();
      expect(Barista._collectionInstances.length).toBe(0);
    });
  });

  describe('instantiating models and collections', function() {

    beforeEach(function() {
      Barista.config(ExampleApp);
    });

    it('adds the model to the _modelInstances array', function() {
      var model = new Barista.TaskModel();
      expect(Barista._modelInstances).toContain(model);
    });

    it('adds the collection to the _collectionInstances array', function() {
      var collection = new Barista.TaskCollection();
      expect(Barista._collectionInstances).toContain(collection);
    });
  });
});