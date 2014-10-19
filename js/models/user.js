var app = app || {};

app.User = Backbone.RelationalModel.extend({
  urlRoot: 'http://localhost:9292/users',
  relations: [{
    type:           'HasMany',
    relatedModel:   'TaskList',
    reverseRelation: {
      key: 'userId'
    }
  }],
  
  initialize: function() {
    defaults: {
      admin: false
    }
  }
})