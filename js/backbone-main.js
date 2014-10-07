User = Backbone.Model.extend({
  urlRoot: 'http://localhost:9292/users',
  initialize: function() {
    // Perhaps this should trigger the API call that creates the
    // user in the database, and form submission should trigger
    // the creation of the Backbone model. Food for thought.
    defaults: {
      admin: false
    }
  }
})

UserCollection = Backbone.Collection.extend({
  model: User,
  url: 'http://localhost:9292/users'
})

Task = Backbone.Model.extend({
  urlRoot: 'http://localhost:9292/users/1/tasks',
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
})

TaskList = Backbone.Model.extend({
  url: '/tasks'
})