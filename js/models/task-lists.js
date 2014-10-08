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