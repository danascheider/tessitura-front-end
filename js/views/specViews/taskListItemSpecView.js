var task = new Canto.TaskModel({id: 1, title: 'Make tests for the SpecWrapper views'});

var SpecWrapper = Backbone.View.extend({
  el         : 'body',
  template   : JST['spec/listItem'],

  events     : {
    'click a' : 'callMethod'
  },

  callMethod : function(e) {
    e.preventDefault();
    this.view[$(e.target).attr('data-method')]();
  },

  initialize : function() {
    this.view = new Canto.TaskListItemView({model: task});
  },

  render     : function() {
    this.$el.html(this.template());
    this.view.render();
    this.$('#view').html(this.view.el);
  }
});

module.exports = SpecWrapper;