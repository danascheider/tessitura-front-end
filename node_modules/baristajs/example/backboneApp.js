var Backbone = require('backbone'),
    _        = require('underscore');

global.App   = {};

App.Task   = Backbone.Model.extend({
  url      : 'http://localhost:9292/tasks/' + this.get('id'),
  defaults : {
    title: 'Untitled Task 1',
    done : false
  }
});

App.TaskCollection = Backbone.collection.extend({
  model   : Task,
  urlRoot : 'http://localhost:9292/tasks'
});

App.TaskView = Backbone.View.extend({
  tagName    : 'li',
  className  : 'task',
  template   : _.template(require('./templates/task.html')),
  initialize : function() {
    this.render();
  },
  render     : function() {
    this.$el.html(this.template(this.model.attributes));
    this.delegateEvents();
    return this;
  }
});

App.TaskCollectionView = Backbone.View.extend({
  tagName   : 'ul',
  className : 'task-list',
  initialize: function() {
    this.render();
  },
  render    : function() {
    this.$el.empty();

    _.each(this.collection.models, function(task) {
      var view = new App.TaskView({model: task});
      this.$el.append(view.render().$el);
    });

    this.delegateEvents();
    return this;
  }
});

App.Router = Backbone.Router.extend({
  routes : {
    '(/)' : 'showList'
  },

  showList: function() {
    var tasks = new App.TaskCollection();
    var view = new App.TaskCollectionView({collection: tasks});
    
    $('body').html(view.render().el);
  }
});

module.exports = App;