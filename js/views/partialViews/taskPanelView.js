Tessitura.TaskPanelView = Tessitura.DashWidgetView.extend({
  id                   : 'task-panel',
  template             : JST['partials/taskPanel'],

  /* Event Callbacks
  /**************************************************************************************/

  crossOff             : function(task) {
    if(task.get('status') !== 'Complete') { return; }

    var that = this, 
        view = this.retrieveViewForModel(task);

    setTimeout(function() {
      if (view) {
        that.childViews.splice(that.childViews.indexOf(view), 1);
        view.destroy();
      }

      that.collection.remove(task);
    }, 750);
  },

  reorder              : function(e, ui) {
    var taskID = parseInt(ui.item.attr('id').match(/\d+$/)[0]);
    var i      = 1;
    var that   = this;

    _.each(this.$('.task-list-item'), function(child) {

      // Look in the collection for the model that belongs to this child view
      // by searching for it by ID using the ID taken from the ID #task-<n> of
      // the list item

      var model = that.collection.get($(child).attr('id').match(/\d+$/)[0]);

      if(model.get('postion') !== i) {
        model.save({position: i});
      }

      i++;
    });
  },

  retrieveViewForModel : function(task) {
    if(!this.childViews.length) { return; }
    var that = this, child;

    _.each(that.childViews, function(view) {

      // You might be wondering why this hack is necessary. I wish I knew...
      if(view.model && (view.model.get('id') === task.get('id'))) { child = view; }
    });

    return child;
  },

  showEditForm         : function(task) {
    this.trigger('showEditForm', task);
  },

  showTaskCreateForm   : function() {
    this.trigger('showTaskCreateForm', this.collection);
  },

  /* Special Functions 
  /**************************************************************************************/

  renderCollection     : function() {
    var that = this;
    var i    = 0
    var container = document.createDocumentFragment();

    this.collection.each(function(task) {
      if (i > 9) { return; }

      if (task.get('status') !== 'Blocking' && task.get('status') !== 'Complete' && !task.get('backlog')) {
        var view = that.retrieveViewForModel(task) || new Tessitura.TaskListItemView({model: task, width: 40});

        that.listenTo(view, 'showEditForm', that.showEditForm);

        if(that.childViews.indexOf(view) == -1) {
          that.childViews.push(view);
        }

        view.render();
        container.appendChild(view.el);
        i++;
      }
    });

    this.$('ul.task-list').append(container);
    return this;
  },

  /* Core View Functions 
  /**************************************************************************************/

  initialize           : function(opts) {
    this.quickAddForm     = new Tessitura.QuickAddFormView({collection: this.collection});

    this.childViews = [this.quickAddForm];

    _.bindAll(this, 'reorder');

    this.listenTo(this.collection, 'add fetch', this.render);
    this.listenTo(this.collection, 'change:status', this.crossOff);
    this.listenTo(this.collection, 'change:backlog', this.render);
    this.listenTo(this.collection, 'drop', this.removeStyles);
    this.listenTo(this.collection, 'remove', this.render);
    this.listenTo(this.quickAddForm, 'showTaskCreateForm', this.showTaskCreateForm);
  },

  remove               : function() {
    _.each(this.childViews, function(view) { view.remove(); });
    Tessitura.View.prototype.remove.call(this);
  },

  render               : function() {
    var that = this;

    return Tessitura.View.prototype.render.call(this, this.template(), function() {
      that.quickAddForm.render();
      that.$('.quick-add-form').prepend(that.quickAddForm.$el);
      that.renderCollection();

      that.$('ul').sortable({
        items: '>*:not(.not-sortable)',
        stop : that.reorder
      });
    });
  }
});

module.exports = Tessitura.TaskPanelView;