User = Backbone.RelationalModel.extend({
  urlRoot: 'http://localhost:9292/users',
  relations: [{
    type:           'HasMany',
    relatedModel:   'TaskList',
    reverseRelation: {
      key: 'userId'
    }
  }],
  
  initialize: function() {
    // Perhaps this should trigger the API call that creates the
    // user in the database, and form submission should trigger
    // the creation of the Backbone model. Food for thought.
    defaults: {
      admin: false
    }
  }
})

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
})

TaskList = Backbone.RelationalModel.extend({
  urlRoot: 'http://localhost:9292/user/1/tasks',

  relations: [
    {
      type:            'HasMany',
      relatedModel:    'Task',
      reverseRelation: {
        key: 'taskListId'
      }
    },

    {
      type:         'HasOne',
      relatedModel: 'User',
      key:          'userId'
    }
  ]
})