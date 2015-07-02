Tessitura.QuickAddFormView = Tessitura.View.extend({
  tagName    : 'form',
  className  : 'task-form create-form quick-add-form',
  template   : JST['tasks/quickAdd'],

  events     : {
    'click span.pull-right > i' : 'showTaskCreateForm',
    'submit'                    : 'createTask'
  },

  /* Event Callbacks
  /**************************************************************************************/

  createTask : function(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Declare variable `that` for use inside Ajax block
    var that  = this;
    var attrs = Tessitura.Utils.getAttributes(this.$el);

    // Make sure the task being created has the attributes 
    // common to this form's collection
    _.each(this.groupedBy, function(val, key) {
      attrs[key] = val;
    });

    // Position the new task at the top of the list unless otherwise
    // specified
    attrs['position'] = attrs['position'] || 1;

    // Tasks are invalid without a title, so this code should not run
    // unless a title has been entered in the form's input.
    if(!!attrs.title) {

      // It is necessary to do it this way instead of using
      // `this.collection.create` because the latter triggers the `add` event
      // on the collection before the task is assigned an ID, which causes it
      // to be added to the view in `'li#task-undefined'`, which is obviously
      // wrong and aesthetically offensive.

      var task = new Tessitura.TaskModel();

      task.save(attrs, {
        success    : function(model) {
          that.$el[0].reset();
          that.collection.unshift(model);
        }
      });
    }
  },

  // This causes an event that will bubble up to the main dashboard view, so it
  // will know to show the shade element and the task form.

  showTaskCreateForm: function() {
    this.trigger('showTaskCreateForm');
  },

  /* Core View Functions
  /**************************************************************************************/

  initialize : function(opts) {
    opts = opts || /* istanbul ignore next */ {};
    _.extend(this, opts);
  },

  render     : function(opts) {
    return Tessitura.View.prototype.render.call(this, this.template());
  }
});

module.exports = Tessitura.QuickAddFormView;