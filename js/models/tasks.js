Task = Backbone.RelationalModel.extend({
  urlRoot: 'http://localhost:9292/users/1/tasks',

  relations: [{
    type:         Backbone.HasOne,
    relatedModel: 'TaskList'
  }],

  initialize: function() {
    this.on('invalid', function(model, error) {
      console.log('**Validation error: ' + error + '**');
    });
  },

  validate: function(attrs) {
    if (!attrs.title) {
      return 'Title is required';
    }
  }
});

TaskView = Backbone.View.extend({
  initialize: function() {
    this.render();
  },
  render: function() {
    this.$el.html(this.title);
    return this
  }
});