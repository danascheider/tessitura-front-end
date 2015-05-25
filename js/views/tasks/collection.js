define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/tasks/collection.html'
  ], function($, _, Backbone, taskCollectionTemplate) {
  
  var TaskCollectionView = Backbone.View.extend({
    el    : $('#container'),
    render: function() {
      var data = {};
      var compiledTemplate = _.template(taskCollectionTemplate, data);
      this.$el.append(compiledTemplate);
      return this;
    }
  });

  return TaskCollectionView;
});