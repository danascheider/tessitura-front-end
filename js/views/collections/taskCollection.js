define([
  'jquery',
  'underscore',
  'backbone',
  'cookie',
  'jquery-ui',
  'api',
  'utils',
  'models/task',
  'views/models/task/listEntry',
  'views/models/task/quickAddForm',
  'text!templates/tasks/model.html'
], function(
  $, 
  _, 
  Backbone, 
  Cookie,
  JQueryUI,
  API,
  Utils,
  TaskModel,
  ListItemView,
  QuickAddForm, 
  ModelTemplate) {
  
  var TaskCollectionView = Backbone.View.extend({
    tagName            : 'ul',
    className          : 'task-list',

    template           : _.template('<li class=\'quick-add-form not-sortable\'></li>'),

    // ------------------- // 
    // Custom View Methods //
    // ------------------- //

    crossOff          : function(task) {
      var that = this;
      if(task.get('status') === 'Complete') {
        this.$('#task-' + task.get('id')).find('.task-title').css('text-decoration', 'line-through');
       
        setTimeout(function() {
          var index = that.childViews.indexOf(that.retrieveViewForModel(task));
          that.collection.remove(task);
          that.childViews.splice(index, 1);
        }, 750);
      }
    }, 

    // -------------- //
    // Event Handlers //
    // -------------- //

    removeBacklog    : function() {
      this.collection.remove(this.collection.findWhere({backlog: true}));
    },

    removeChildViews : function() {
      _.each(this.childViews, function(view) {
        view.remove();
        view.unbind();
      });
    },

    removeComplete   : function() {
      var task = this.collection.findWhere({status: 'Complete'});
      this.collection.remove(task);
    },

    retrieveViewForModel: function(model) {
      var view = _.filter(this.childViews, function(view) {
        return view.model === model;
      });

      return view[0];
    },

    // ------------------- //
    // Core View Functions //
    // ------------------- //

    initialize       : function(opts) {
      opts               = opts || {};
      this.grouping      = opts.grouping || {};
      this.childViews    = this.childViews || [];
      this.$quickAddForm = new QuickAddForm({collection: this.collection, grouping: this.grouping});

      this.listenTo(this.collection, 'add remove change:position', this.render);
      this.listenTo(this.collection, 'change:status', this.crossOff);
    },

    remove           : function() {
      this.removeChildViews();
      Backbone.View.prototype.remove.call(this);
    },

    render           : function() {
      var that = this;

      this.$quickAddForm.render();
      this.$el.html(this.template());
      this.$('li.quick-add-form').html(this.$quickAddForm.el);
      
      this.collection.each(function(task) {
        var view = that.retrieveViewForModel(task);

        if(!!view) {
          that.$el.append(view.render().el);
        } else {
          view = new ListItemView({model: task});
          that.$el.append(view.render().el);
          that.childViews.push(view);
        }

        view.delegateEvents();
      });
  
      this.delegateEvents();
      this.$quickAddForm.delegateEvents();

      this.$el.sortable({connectWith: '.task-list', dropOnEmpty: true});

      return this;
    }
  });

  return TaskCollectionView;
});