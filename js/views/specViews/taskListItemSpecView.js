var task = new Tessitura.TaskModel({id: 1, title: 'Make tests for the SpecWrapper views'});

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
    this.view = new Tessitura.TaskListItemView({model: task});
  },

  render     : function() {
    this.$el.html(this.template());
    this.$el.addClass('test');
    this.view.render();
    this.$('#dashboard-wrapper').html(this.view.$el);
    this.delegateEvents();
    return this;
  }
});

module.exports = SpecWrapper;