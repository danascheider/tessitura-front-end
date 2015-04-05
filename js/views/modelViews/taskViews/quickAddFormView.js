Canto      = Canto || require('../../../dependencies.js');
Canto.View = Canto.View || require('../../appViews/cantoView.js');

var QuickAddFormView = Canto.View.extend({
  tagName    : 'form',
  className  : 'task-form create-form quick-add-form',
  template   : JST['tasks/quickAdd'],

  events     : {
    'submit' : 'createTask'
  },

  // --------------------- //
  // Canto View Properties //
  // --------------------- //

  klass      : 'QuickAddTaskFormView',
  family     : 'Canto.View',
  superFamily: 'Backbone.View',

  types      : function() {
    return Canto.View.prototype.types().concat(['QuickAddForm', 'QuickAddFormView', 'TaskCollectionView', 'TaskFormView', 'TaskCreateFormView']);
  },

  // --------------- //
  // Event Callbacks //
  // --------------- //

  createTask : function(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    
    // Declare variable `that` for use inside Ajax block
    var that  = this;
    var attrs = Canto.Utils.getAttributes(this.$el);
    var TaskModel = require('../../../models/taskModel.js');

    // Make sure the task being created has the attributes 
    // common to this form's collection
    _.each(this.grouping, function(val, key) {
      attrs[key] = val;
    });

    // Position the new task at the top of the list unless otherwise
    // specified
    attrs['position'] = attrs['position'] || 1;

    // Tasks are invalid without a title, so this code should not run
    // unless a title has been entered in the form's input.
    if(!!attrs.title) {
      var newTask = new TaskModel();
      newTask.save(attrs, {
        success    : function(model) {
          that.$el[0].reset();
          that.collection.unshift(model);

          // FIX: Determine if the app works without this
          // that.trigger('newTask');
        }
      });
    }
  },

  // ------------------- //
  // Core View Functions //
  // ------------------- //

  initialize : function(opts) {
    opts = opts || {};
    this.grouping = opts.grouping;
  },

  render     : function(opts) {
    return Canto.View.prototype.render.call(this, this.template());
  }
});

module.exports = QuickAddFormView;