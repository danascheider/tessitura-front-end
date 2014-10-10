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

DashboardTaskView = Backbone.View.extend({
  initialize: function() {
    this.$el = $('#dash-task-display');
  },
  taskTemplate: _.template($('#dashboard-task-template')),
  render: function() {
    this.$el.html(this.taskTemplate(this.model.attributes) );
    return this
  },
  tagName: 'li',
  events: {
    'click .mark-complete' : 'markComplete',
    'dblclick this' : 'showUpdateForm'
  },
  markComplete: function() {
    // Change the task status to 'complete'
    // Remove task from list
    // For a few seconds show a placeholder with an 'undo' option
    // Remove the placeholder
  },
  showUpdateForm: function() {
    // Replace task display with an update form
  }
});