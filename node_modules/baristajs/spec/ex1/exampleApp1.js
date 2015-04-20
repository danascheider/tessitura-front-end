var $        = jQuery = require('jquery'),
    _        = require('underscore'),
    Backbone = require('backbone');

var App = {

  TaskModel: Backbone.Model.extend({
    url: function() {
      return 'http://localhost:9292/tasks/' + this.get('id');
    },
    defaults: {
      title: 'Untitled Task 1'
    }
  }),

  TaskCollection: Backbone.Collection.extend({
    model: this.TaskModel
  }),
};

module.exports = App;