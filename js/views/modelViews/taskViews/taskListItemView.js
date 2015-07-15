Tessitura.ListItemView = Tessitura.View.extend({

  /* Backbone View Properties
  /**************************************************************************************/

  tagName    : 'li',
  className  : 'task-list-item ui-widget-content ui-draggable ui-draggable-handle ui-sortable-handle',
  id         : function() { return 'task-' + this.model.get('id'); },
  template   : JST['tasks/listItem'],

  events     : {
    'click i[title=Edit]'    : 'showEditForm',
    'click i[title=Delete]'  : 'deleteTask',
    'click i[title=Backlog]' : 'backlogTask',
    'click .fa-square-o'     : 'markComplete',
    'click .task-title'      : 'toggleTaskDetails',
    'mouseenter'             : 'showEditIcons',
    'mouseleave'             : 'hideEditIcons'
  },

  /* Event Callbacks
  /**************************************************************************************/

  backlogTask        : function() {
    this.model.save({backlog: true});
  },

  deleteTask         : function() {
    this.model.destroy();
  },

  hideEditIcons     : function() {
    this.$('span.edit-task').hide();
  },

  markComplete      : function() {
    this.model.save({status: 'Complete'});
    this.$('.fa-square-o').removeClass('fa-square-o').addClass('fa-check-square-o');
    this.$('a.task-title').css('text-decoration', 'line-through');
  },

  renderOnSync      : function() {
    if(this.model.get('status') === 'Complete') { return; }
    this.render();
  },

  showEditForm      : function() {
    this.trigger('showEditForm', this.model);
  },

  showEditIcons     : function() {
    this.$('span.edit-task').show();
  },

  toggleTaskDetails : function(e) {
    /* istanbul ignore next */ if(e) { e.preventDefault(); }
    this.$el.toggleClass('open', {duration: 400});
    this.$('.task-details').slideToggle();
  },

  /* Special Functions
  /**************************************************************************************/

  configureDraggable : function() {
    var that   = this;

    this.$el.draggable({
      connectToSortable : '.task-list',
      stop              :       /* istanbul ignore next */ function() {
        that.render();
      }
    });
  },

  /* Core View Functions
  /**************************************************************************************/

  initialize         : function(opts) {
    opts = opts || /* istanbul ignore next */ {};
    _.extend(this, opts);
    this.listenTo(this.model, 'sync', this.renderOnSync);
  },

  render             : function() {
    var that = this;

    return Tessitura.View.prototype.render.call(this, this.template({model: that.model, width: that.width}), function() {
      that.configureDraggable();
      that.$el.removeAttr('style');
    });
  }
});

module.exports = Tessitura.ListItemView;