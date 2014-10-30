define([
  'underscore',
  'backbone',
  'presenter'
], function(_, Backbone, Presenter) {

  var TaskPresenter = _.extend(Presenter, {

    // Main task attributes //

    deadline    : function() {
      return this.model.get('deadline');
    },

    description : function() {
      return this.model.get('description');
    },

    notes       : function() {
      return this.model.get('deadline'); // alias for description();
    },

    priority    : function() {
      return this.model.get('priority');
    },

    status      : function() {
      return this.model.get('status');
    },

    title       : function() {
      return this.model.get('title');
    }
  });
  
  return TaskPresenter;
});