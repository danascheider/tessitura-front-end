define(['backbone'], function(Backbone) {
  var Subset = Backbone.Collection.extend({
    initialize: function(models, options) {
      this.parent   = options.parent;
      this.model    = this.parent.model;
      this.grouping = options.grouping;
    }
  });

  return Subset;
});