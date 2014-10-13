var app = app || {};

app.Task = Backbone.RelationalModel.extend({
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